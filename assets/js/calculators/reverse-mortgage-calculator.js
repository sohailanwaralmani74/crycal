(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var borrowerAge = parseFloat(document.getElementById('input_borrowerAge').value) || 0;
    var homeValue = parseFloat(document.getElementById('input_homeValue').value) || 0;
    var loanBalance = parseFloat(document.getElementById('input_loanBalance').value) || 0;
    var interestRate = parseFloat(document.getElementById('input_interestRate').value) || 0;
    var paymentOption = document.getElementById('input_paymentOption').value;
    var termYears = parseFloat(document.getElementById('input_termYears').value) || 0;
    var propertyType = document.getElementById('input_propertyType').value;

    return {
      borrowerAge: borrowerAge,
      homeValue: homeValue,
      loanBalance: loanBalance,
      interestRate: interestRate / 100,
      paymentOption: paymentOption,
      termYears: termYears,
      propertyType: propertyType
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatCurrencyFull(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Core Calculation ──
  function calculateReverseMortgage(inputs) {
    var age = inputs.borrowerAge;
    var homeValue = inputs.homeValue;
    var balance = inputs.loanBalance;
    var rate = inputs.interestRate;
    var option = inputs.paymentOption;
    var term = inputs.termYears;

    if (age < 62) {
      return { error: 'Borrower must be at least 62 years old' };
    }

    if (homeValue <= 0) {
      return { error: 'Enter a valid home value' };
    }

    // ── Principal Limit Factor (simplified HECM calculation) ──
    // Higher age = higher factor, lower rate = higher factor
    var baseFactor = 0.40 + (age - 62) * 0.005;
    baseFactor = Math.min(baseFactor, 0.75);

    var rateAdjustment = 1 - (rate * 2);
    var factor = baseFactor * Math.min(rateAdjustment, 1.2);
    factor = Math.min(Math.max(factor, 0.30), 0.80);

    // ── Principal Limit ──
    var maxClaim = Math.min(homeValue, 1200000); // HECM limit
    var principalLimit = maxClaim * factor;

    // ── Estimated Fees ──
    var originationFee = Math.min(principalLimit * 0.02, 6000);
    var mortgageInsurance = principalLimit * 0.005;
    var closingCosts = 1500;
    var initialFees = originationFee + mortgageInsurance + closingCosts;

    // ── Net Proceeds ──
    var netProceeds = Math.max(0, principalLimit - balance - initialFees);

    // ── Monthly Payment (Tenure) ──
    var monthlyPayment = 0;
    if (option === 'tenure' && netProceeds > 0) {
      // Estimate life expectancy (simplified)
      var lifeExpectancy = 85;
      var yearsRemaining = Math.max(5, lifeExpectancy - age);
      monthlyPayment = netProceeds / (yearsRemaining * 12);
    }

    // ── Term Payment ──
    if (option === 'term' && netProceeds > 0 && term > 0) {
      monthlyPayment = netProceeds / (term * 12);
    }

    // ── Line of Credit ──
    var lineOfCredit = 0;
    if (option === 'line-of-credit') {
      lineOfCredit = netProceeds * 0.8;
    }

    // ── Total Interest ──
    var totalInterest = 0;
    if (netProceeds > 0) {
      var loanTerm = Math.min(30, Math.max(5, 85 - age));
      totalInterest = netProceeds * rate * loanTerm;
    }

    // ── Summary ──
    var summary = '';
    if (netProceeds <= 0) {
      summary = 'Insufficient equity for a reverse mortgage. Consider paying down existing debt.';
    } else {
      summary = 'You may be eligible for up to ' + formatCurrency(netProceeds) + ' in proceeds.';
      if (option === 'lump-sum') {
        summary += ' Take it as a lump sum.';
      } else if (option === 'tenure') {
        summary += ' Receive approximately ' + formatCurrency(monthlyPayment) + ' per month for life.';
      } else if (option === 'term') {
        summary += ' Receive approximately ' + formatCurrency(monthlyPayment) + ' per month for ' + term + ' years.';
      } else {
        summary += ' Access a line of credit up to ' + formatCurrency(lineOfCredit) + '.';
      }
    }

    return {
      maxLoanAmount: principalLimit,
      netProceeds: netProceeds,
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      lineOfCredit: lineOfCredit,
      principalLimit: principalLimit,
      initialFees: initialFees,
      summary: summary,
      age: age,
      homeValue: homeValue,
      rate: rate,
      option: option,
      factor: factor,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.borrowerAge < 62) {
      setOutputText('output_maxLoanAmount', '—');
      setOutputText('output_netProceeds', '—');
      setOutputText('output_monthlyPayment', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_lineOfCredit', '—');
      setOutputText('output_principalLimit', '—');
      setOutputText('output_initialFees', '—');
      setOutputText('output_summary', 'Borrower must be at least 62 years old');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    if (inputs.homeValue <= 0) {
      setOutputText('output_maxLoanAmount', '—');
      setOutputText('output_netProceeds', '—');
      setOutputText('output_monthlyPayment', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_lineOfCredit', '—');
      setOutputText('output_principalLimit', '—');
      setOutputText('output_initialFees', '—');
      setOutputText('output_summary', 'Enter a valid home value');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateReverseMortgage(inputs);

    if (result.error) {
      setOutputText('output_maxLoanAmount', '—');
      setOutputText('output_netProceeds', '—');
      setOutputText('output_monthlyPayment', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_lineOfCredit', '—');
      setOutputText('output_principalLimit', '—');
      setOutputText('output_initialFees', '—');
      setOutputText('output_summary', result.error);
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_maxLoanAmount', formatCurrency(result.maxLoanAmount));
    setOutputText('output_netProceeds', formatCurrency(result.netProceeds));
    setOutputText('output_monthlyPayment', formatCurrency(result.monthlyPayment) + '/mo');
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_lineOfCredit', formatCurrency(result.lineOfCredit));
    setOutputText('output_principalLimit', formatCurrency(result.principalLimit));
    setOutputText('output_initialFees', formatCurrency(result.initialFees));
    setOutputText('output_summary', result.summary);

    var chartPayload = {
      result: result,
      netProceeds: result.netProceeds,
      maxLoanAmount: result.maxLoanAmount,
      principalLimit: result.principalLimit,
      initialFees: result.initialFees,
      homeValue: inputs.homeValue
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        borrowerAge: inputs.borrowerAge,
        homeValue: inputs.homeValue,
        netProceeds: result.netProceeds,
        maxLoanAmount: result.maxLoanAmount
      });
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'breakdown') {
      var labels = ['Net Proceeds', 'Existing Balance & Fees'];
      var values = [data.netProceeds, data.maxLoanAmount - data.netProceeds];

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4ade80', '#D95B43'],
            borderColor: ['#3a9b6c', '#B84A32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Loan Proceeds Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_borrowerAge').value = 65;
    document.getElementById('input_homeValue').value = 300000;
    document.getElementById('input_loanBalance').value = 0;
    document.getElementById('input_interestRate').value = 7.0;
    document.getElementById('input_paymentOption').value = 'lump-sum';
    document.getElementById('input_termYears').value = 10;
    document.getElementById('input_propertyType').value = 'single-family';
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
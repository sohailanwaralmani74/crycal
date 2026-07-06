/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Refinance Calculator
   Tool ID: refinance
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      currentBalance: parseFloat(document.getElementById('input_currentBalance').value) || 0,
      currentRate: parseFloat(document.getElementById('input_currentRate').value) || 0,
      currentTerm: parseFloat(document.getElementById('input_currentTerm').value) || 0,
      newRate: parseFloat(document.getElementById('input_newRate').value) || 0,
      newTerm: parseFloat(document.getElementById('input_newTerm').value) || 0,
      closingCosts: parseFloat(document.getElementById('input_closingCosts').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'daily': 365,
      'monthly': 12,
      'quarterly': 4,
      'semi-annually': 2,
      'annually': 1
    };
    return map[frequency] || 12;
  }

  // ── Calculate Monthly Mortgage Payment ──
  function calculateMonthlyPayment(loanAmount, annualRate, loanTerm) {
    if (loanAmount <= 0 || annualRate < 0) return 0;
    var monthlyRate = annualRate / 100 / 12;
    var totalMonths = loanTerm * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // ── Calculate Total Interest ──
  function calculateTotalInterest(loanAmount, annualRate, loanTerm) {
    var monthlyPayment = calculateMonthlyPayment(loanAmount, annualRate, loanTerm);
    var totalMonths = loanTerm * 12;
    return (monthlyPayment * totalMonths) - loanAmount;
  }

  // ── Generate Amortization Data ──
  function generateAmortization(loanAmount, annualRate, loanTerm) {
    var data = [];
    var balance = loanAmount;
    var monthlyRate = annualRate / 100 / 12;
    var totalMonths = loanTerm * 12;
    var monthlyPayment = calculateMonthlyPayment(loanAmount, annualRate, loanTerm);

    if (monthlyPayment === 0) return data;

    for (var month = 1; month <= totalMonths; month++) {
      var interestPaid = balance * monthlyRate;
      var principalPaid = monthlyPayment - interestPaid;
      if (principalPaid > balance) principalPaid = balance;
      balance = Math.max(0, balance - principalPaid);
      data.push({
        month: month,
        interest: interestPaid,
        principal: principalPaid,
        balance: balance
      });
    }
    return data;
  }

  // ── Main Calculation ──
  function calculateRefinance(inputs) {
    var currentBalance = inputs.currentBalance;
    var currentRate = inputs.currentRate;
    var currentTerm = inputs.currentTerm;
    var newRate = inputs.newRate;
    var newTerm = inputs.newTerm;
    var closingCosts = inputs.closingCosts;

    // Calculate current monthly payment
    var currentMonthly = calculateMonthlyPayment(currentBalance, currentRate, currentTerm);

    // Calculate new monthly payment (on the same loan balance)
    var newMonthly = calculateMonthlyPayment(currentBalance, newRate, newTerm);

    // Total interest remaining on current loan
    var currentTotalInterest = calculateTotalInterest(currentBalance, currentRate, currentTerm);

    // Total interest on new loan
    var newTotalInterest = calculateTotalInterest(currentBalance, newRate, newTerm);

    // Monthly savings
    var monthlySavings = Math.max(0, currentMonthly - newMonthly);

    // Total interest saved
    var totalInterestSaved = Math.max(0, currentTotalInterest - newTotalInterest);

    // Break-even point (months)
    var breakEvenMonths = 0;
    if (monthlySavings > 0) {
      breakEvenMonths = closingCosts / monthlySavings;
    } else {
      breakEvenMonths = Infinity;
    }

    // Total cost with refinance (closing costs + new total interest)
    var totalCostWithRefi = closingCosts + newTotalInterest;

    // Generate amortization data for current and new loan
    var currentAmort = generateAmortization(currentBalance, currentRate, currentTerm);
    var newAmort = generateAmortization(currentBalance, newRate, newTerm);

    // Cumulative data for charts
    var cumulativeData = [];
    var maxMonths = Math.min(currentAmort.length, newAmort.length, 360);

    for (var i = 0; i < maxMonths; i++) {
      var month = i + 1;
      var currentCumInterest = currentAmort[i] ? currentAmort[i].interest : 0;
      var newCumInterest = newAmort[i] ? newAmort[i].interest : 0;

      // Cumulative interest
      var cumCurrent = 0;
      var cumNew = 0;
      for (var j = 0; j <= i; j++) {
        if (currentAmort[j]) cumCurrent += currentAmort[j].interest;
        if (newAmort[j]) cumNew += newAmort[j].interest;
      }

      cumulativeData.push({
        month: month,
        cumCurrent: cumCurrent,
        cumNew: cumNew,
        balanceCurrent: currentAmort[i] ? currentAmort[i].balance : 0,
        balanceNew: newAmort[i] ? newAmort[i].balance : 0
      });
    }

    return {
      currentMonthly: currentMonthly,
      newMonthly: newMonthly,
      monthlySavings: monthlySavings,
      currentTotalInterest: currentTotalInterest,
      newTotalInterest: newTotalInterest,
      totalInterestSaved: totalInterestSaved,
      breakEvenMonths: breakEvenMonths,
      totalCostWithRefi: totalCostWithRefi,
      cumulativeData: cumulativeData,
      currentAmort: currentAmort,
      newAmort: newAmort
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Format Break-Even ──
  function formatBreakEven(months) {
    if (months === Infinity || months === undefined || !isFinite(months)) return 'Never';
    if (months < 0) return '0';
    var y = Math.floor(months / 12);
    var m = Math.round(months % 12);
    if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateRefinance(inputs);

    document.getElementById('output_currentMonthlyPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.currentMonthly);
    document.getElementById('output_newMonthlyPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.newMonthly);
    document.getElementById('output_monthlySavings').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlySavings);
    document.getElementById('output_totalInterestCurrent').querySelector('.output-number').textContent = formatCurrencyLocal(result.currentTotalInterest);
    document.getElementById('output_totalInterestNew').querySelector('.output-number').textContent = formatCurrencyLocal(result.newTotalInterest);
    document.getElementById('output_totalInterestSaved').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterestSaved);
    document.getElementById('output_breakEvenMonths').querySelector('.output-number').textContent = formatBreakEven(result.breakEvenMonths);
    document.getElementById('output_totalCostWithRefi').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalCostWithRefi);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        currentBalance: inputs.currentBalance,
        currentRate: inputs.currentRate,
        currentTerm: inputs.currentTerm,
        newRate: inputs.newRate,
        newTerm: inputs.newTerm,
        closingCosts: inputs.closingCosts,
        compoundingFrequency: inputs.compoundingFrequency
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(result, inputs) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');
    var cumulativeData = result.cumulativeData;

    if (tab === 'comparison') {
      var labels = cumulativeData.map(function(d) { return d.month; });
      var currentData = cumulativeData.map(function(d) { return d.cumCurrent; });
      var newData = cumulativeData.map(function(d) { return d.cumNew; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Current Interest',
              data: currentData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#B23A3A'
            },
            {
              label: 'New Interest',
              data: newData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Interest Comparison: Current vs New', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cumulative Interest (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'savings') {
      var labels2 = cumulativeData.map(function(d) { return d.month; });
      var savingsData = cumulativeData.map(function(d) {
        return Math.max(0, d.cumCurrent - d.cumNew);
      });

      // Find break-even point
      var breakEvenMonth = result.breakEvenMonths;
      var breakEvenIdx = 0;
      if (breakEvenMonth !== Infinity && breakEvenMonth > 0) {
        breakEvenIdx = Math.floor(breakEvenMonth);
        if (breakEvenIdx > savingsData.length - 1) breakEvenIdx = savingsData.length - 1;
      }

      var colors = savingsData.map(function(d, i) {
        return i < breakEvenIdx ? '#DCE1E3' : '#2F6F5E';
      });

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Cumulative Savings',
              data: savingsData,
              backgroundColor: colors,
              borderColor: colors.map(function(c) { return c === '#2F6F5E' ? '#1f4f42' : '#B0B5B7'; }),
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Cumulative Savings Over Time' + (breakEvenMonth !== Infinity ? ' | Break-Even: ' + formatBreakEven(breakEvenMonth) : ''),
              font: { size: 14 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Savings (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var currentTotal = result.currentTotalInterest;
      var newTotal = result.newTotalInterest;
      var saved = result.totalInterestSaved;
      var closingCosts = inputs.closingCosts;

      return {
        type: 'doughnut',
        data: {
          labels: ['Current Interest', 'New Interest', 'Interest Saved', 'Closing Costs'],
          datasets: [{
            data: [currentTotal, newTotal, saved, closingCosts],
            backgroundColor: ['#B23A3A', '#2F6F5E', '#C08A2E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Mortgage Costs', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(2);
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) el.value = defaultVal;
      else if (el.type !== 'select-one') el.value = '';
    });
    if (typeof window.updateTool === 'function') window.updateTool();
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
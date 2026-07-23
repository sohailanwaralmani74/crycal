(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      loanAmount: parseFloat(document.getElementById('input_loanAmount').value) || 0,
      fixedRate: parseFloat(document.getElementById('input_fixedRate').value) || 0,
      armInitialRate: parseFloat(document.getElementById('input_armInitialRate').value) || 0,
      armIntroYears: parseFloat(document.getElementById('input_armIntroYears').value) || 5,
      armExpectedRateIncrease: parseFloat(document.getElementById('input_armExpectedRateIncrease').value) || 0,
      armMaxCapRate: parseFloat(document.getElementById('input_armMaxCapRate').value) || 0
    };
  }

  function calculateMonthlyPayment(P, annualRate, months) {
    if (P <= 0 || annualRate <= 0 || months <= 0) return 0;
    var r = (annualRate / 100) / 12;
    return (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
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

  function calculateResults(inputs) {
    var P = inputs.loanAmount;
    var fixedRate = inputs.fixedRate;
    var armRate = inputs.armInitialRate;
    var introYears = inputs.armIntroYears;
    var incRate = inputs.armExpectedRateIncrease;
    var maxCap = inputs.armMaxCapRate;

    var fixedMonthly = calculateMonthlyPayment(P, fixedRate, 360);
    var totalFixedInterest = (fixedMonthly * 360) - P;

    var armInitialMonthly = calculateMonthlyPayment(P, armRate, 360);
    var armInitialSavings = Math.max(0, fixedMonthly - armInitialMonthly);

    var armMaxMonthly = calculateMonthlyPayment(P, Math.min(maxCap, armRate + 5), 360);

    // Build 30-year projections
    var yearlyData = [];
    var fixedBalance = P;
    var armBalance = P;

    var totalArmInterest = 0;
    var currentArmRate = armRate;

    var fixedMonthlyR = (fixedRate / 100) / 12;

    for (var yr = 1; yr <= 30; yr++) {
      if (yr > introYears) {
        currentArmRate = Math.min(maxCap, currentArmRate + incRate);
      }
      var currentArmMonthlyR = (currentArmRate / 100) / 12;
      var remainingMonths = (31 - yr) * 12;
      var armMonthlyForYear = calculateMonthlyPayment(armBalance, currentArmRate, remainingMonths);

      var yrArmInterest = 0;
      for (var m = 0; m < 12; m++) {
        if (armBalance <= 0) break;
        var interestM = armBalance * currentArmMonthlyR;
        var principalM = Math.min(armBalance, armMonthlyForYear - interestM);
        yrArmInterest += interestM;
        armBalance -= principalM;
      }

      var yrFixedInterest = 0;
      for (var m = 0; m < 12; m++) {
        if (fixedBalance <= 0) break;
        var interestM2 = fixedBalance * fixedMonthlyR;
        var principalM2 = Math.min(fixedBalance, fixedMonthly - interestM2);
        yrFixedInterest += interestM2;
        fixedBalance -= principalM2;
      }

      totalArmInterest += yrArmInterest;

      yearlyData.push({
        year: yr,
        armMonthly: armMonthlyForYear,
        fixedMonthly: fixedMonthly,
        cumArmInterest: totalArmInterest,
        cumFixedInterest: (fixedMonthly * yr * 12) - (P - fixedBalance)
      });
    }

    return {
      fixedMonthlyPayment: fixedMonthly,
      armInitialMonthlyPayment: armInitialMonthly,
      armInitialMonthlySavings: armInitialSavings,
      armMaxMonthlyPayment: armMaxMonthly,
      totalFixedInterest: totalFixedInterest,
      totalArmInterest: totalArmInterest,
      yearlyData: yearlyData
    };
  }

  function updateTool() {
    var inputs = getInputs();
    if (inputs.loanAmount <= 0) return;

    var result = calculateResults(inputs);

    setOutputText('output_fixedMonthlyPayment', formatCurrencyLocal(result.fixedMonthlyPayment));
    setOutputText('output_armInitialMonthlyPayment', formatCurrencyLocal(result.armInitialMonthlyPayment));
    setOutputText('output_armInitialMonthlySavings', formatCurrencyLocal(result.armInitialMonthlySavings));
    setOutputText('output_armMaxMonthlyPayment', formatCurrencyLocal(result.armMaxMonthlyPayment));
    setOutputText('output_totalFixedInterest', formatCurrencyLocal(result.totalFixedInterest));
    setOutputText('output_totalArmInterest', formatCurrencyLocal(result.totalArmInterest));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        loanAmount: inputs.loanAmount,
        fixedRate: inputs.fixedRate,
        armInitialRate: inputs.armInitialRate,
        fixedMonthlyPayment: result.fixedMonthlyPayment,
        armInitialMonthlyPayment: result.armInitialMonthlyPayment,
        armInitialMonthlySavings: result.armInitialMonthlySavings,
        armMaxMonthlyPayment: result.armMaxMonthlyPayment
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var labels = result.yearlyData.map(function(d) { return 'Yr ' + d.year; });
    var currencySymbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'comparison') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Fixed-Rate Monthly Payment',
              data: result.yearlyData.map(function(d) { return d.fixedMonthly; }),
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: false,
              tension: 0.2
            },
            {
              label: 'ARM Monthly Payment',
              data: result.yearlyData.map(function(d) { return d.armMonthly; }),
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: false,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Payment Comparison Over Time' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
            }
          }
        }
      };
    }

    if (tab === 'cumulative') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Fixed Cumulative Interest',
              data: result.yearlyData.map(function(d) { return d.cumFixedInterest; }),
              borderColor: '#2F6F5E',
              fill: false
            },
            {
              label: 'ARM Cumulative Interest',
              data: result.yearlyData.map(function(d) { return d.cumArmInterest; }),
              borderColor: '#B23A3A',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Interest Comparison' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
            }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });

    setTimeout(updateTool, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();

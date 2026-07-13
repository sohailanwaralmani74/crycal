(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── IRS Uniform Lifetime Table (Selected Ages) ──
  var UNIFORM_TABLE = {
    70: 27.4, 71: 26.5, 72: 25.6, 73: 24.7, 74: 23.8,
    75: 22.9, 76: 22.0, 77: 21.2, 78: 20.3, 79: 19.5,
    80: 18.7, 81: 18.0, 82: 18.0, 83: 17.3, 84: 16.6,
    85: 15.9, 86: 15.3, 87: 14.6, 88: 14.0, 89: 13.4,
    90: 12.8, 91: 12.3, 92: 11.8, 93: 11.3, 94: 10.9,
    95: 10.4, 96: 10.0, 97: 9.6, 98: 9.2, 99: 8.8,
    100: 8.5, 101: 8.1, 102: 7.8, 103: 7.5, 104: 7.2,
    105: 6.9, 106: 6.6, 107: 6.3, 108: 6.0, 109: 5.7,
    110: 5.4, 111: 5.1, 112: 4.8, 113: 4.5, 114: 4.3,
    115: 4.0, 116: 3.8, 117: 3.5, 118: 3.3, 119: 3.0,
    120: 2.8
  };

  // ── Get Inputs ──
  function getInputs() {
    var age = parseFloat(document.getElementById('input_age').value) || 0;
    var accountBalance = parseFloat(document.getElementById('input_accountBalance').value) || 0;
    var spouseBeneficiary = parseFloat(document.getElementById('input_spouseBeneficiary').value) || 0;
    var accountType = document.getElementById('input_accountType').value;

    return {
      age: age,
      accountBalance: accountBalance,
      spouseBeneficiary: spouseBeneficiary,
      accountType: accountType
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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Get Life Expectancy Factor ──
  function getLifeExpectancyFactor(age, spouseAge) {
    // Use spouse beneficiary if provided and more than 10 years younger
    if (spouseAge > 0 && (spouseAge - age < -10)) {
      // Joint Life Expectancy (simplified)
      // For spouses more than 10 years younger, a special table applies
      // This is a simplified calculation
      return UNIFORM_TABLE[age] || 20.0;
    }
    return UNIFORM_TABLE[age] || 20.0;
  }

  // ── Core Calculation ──
  function calculateRMD(inputs) {
    var age = inputs.age;
    var balance = inputs.accountBalance;
    var spouseAge = inputs.spouseBeneficiary;

    if (age < 70 || balance <= 0) {
      return {
        rmd: 0,
        factor: 0,
        distributionPeriod: 0,
        taxPenalty: 0,
        rmdPercentage: 0,
        error: 'Enter valid values (age ≥ 70, balance > 0)'
      };
    }

    var factor = getLifeExpectancyFactor(age, spouseAge);
    var rmd = balance / factor;
    var rmdPercentage = rmd / balance;
    var taxPenalty25 = rmd * 0.25;
    var taxPenalty10 = rmd * 0.10;

    return {
      rmd: rmd,
      factor: factor,
      distributionPeriod: factor,
      taxPenalty25: taxPenalty25,
      taxPenalty10: taxPenalty10,
      rmdPercentage: rmdPercentage,
      error: null
    };
  }

  // ── Generate Projection ──
  function generateProjection(age, balance, factor, growthRate, years) {
    var projection = [];
    var currentAge = age;
    var currentBalance = balance;
    var currentFactor = factor;

    for (var i = 1; i <= years; i++) {
      var rmd = currentBalance / currentFactor;
      // Assume 5% growth on remaining balance after RMD
      var remaining = currentBalance - rmd;
      currentBalance = remaining * (1 + growthRate);

      projection.push({
        year: i,
        age: Math.round(currentAge + i),
        balance: currentBalance,
        rmd: rmd,
        factor: currentFactor
      });

      // Decrease factor by approximately 0.5 each year (simplified)
      currentFactor = Math.max(currentFactor - 0.5, 2.0);
    }

    return projection;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.age < 70 || inputs.accountBalance <= 0) {
      setOutputText('output_rmdAmount', '—');
      setOutputText('output_lifeExpectancyFactor', '—');
      setOutputText('output_distributionPeriod', '—');
      setOutputText('output_taxPenalty', '—');
      setOutputText('output_rmdPercentage', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateRMD(inputs);

    if (result.error) {
      setOutputText('output_rmdAmount', '—');
      setOutputText('output_lifeExpectancyFactor', '—');
      setOutputText('output_distributionPeriod', '—');
      setOutputText('output_taxPenalty', '—');
      setOutputText('output_rmdPercentage', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_rmdAmount', formatCurrency(result.rmd));
    setOutputText('output_lifeExpectancyFactor', result.factor.toFixed(1));
    setOutputText('output_distributionPeriod', result.factor.toFixed(1) + ' years');
    setOutputText('output_taxPenalty', formatCurrency(result.taxPenalty25) + ' (25%)');
    setOutputText('output_rmdPercentage', formatPercent(result.rmdPercentage));

    var projection = generateProjection(inputs.age, inputs.accountBalance, result.factor, 0.05, 5);

    var chartPayload = {
      rmd: result.rmd,
      factor: result.factor,
      rmdPercentage: result.rmdPercentage,
      accountBalance: inputs.accountBalance,
      age: inputs.age,
      projection: projection
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        age: inputs.age,
        accountBalance: inputs.accountBalance,
        rmdAmount: result.rmd,
        rmdPercentage: result.rmdPercentage * 100
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
      var rmd = data.rmd || 0;
      var remaining = data.accountBalance - rmd;

      return {
        type: 'doughnut',
        data: {
          labels: ['RMD Withdrawal', 'Remaining Balance'],
          datasets: [{
            data: [rmd, remaining],
            backgroundColor: ['#D95B43', '#2F6F5E'],
            borderColor: ['#B84A32', '#1f4f42'],
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
              text: 'RMD vs Remaining Balance',
              font: { size: 14, color: '#e8edf0' }
            }
          }
        }
      };
    }

    if (tab === 'projection') {
      if (!data.projection || data.projection.length === 0) return null;

      var labels = data.projection.map(function(d) { return 'Year ' + d.year + ' (Age ' + d.age + ')'; });
      var rmdData = data.projection.map(function(d) { return d.rmd; });

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'RMD Amount',
            data: rmdData,
            backgroundColor: '#4A90D9',
            borderColor: '#3a7b8c',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'RMD Projection (5 Years)',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxTicksLimit: 10
              }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
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
    document.getElementById('input_age').value = 73;
    document.getElementById('input_accountBalance').value = 500000;
    document.getElementById('input_spouseBeneficiary').value = 0;
    document.getElementById('input_accountType').value = 'traditional-ira';
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
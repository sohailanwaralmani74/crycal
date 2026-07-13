(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var currentAge = parseFloat(document.getElementById('input_currentAge').value) || 0;
    var retirementAge = parseFloat(document.getElementById('input_retirementAge').value) || 0;
    var currentSavings = parseFloat(document.getElementById('input_currentSavings').value) || 0;
    var annualSpending = parseFloat(document.getElementById('input_annualSpending').value) || 0;
    var safeWithdrawalRate = parseFloat(document.getElementById('input_safeWithdrawalRate').value) || 0;
    var expectedReturn = parseFloat(document.getElementById('input_expectedReturn').value) || 0;

    return {
      currentAge: currentAge,
      retirementAge: retirementAge,
      currentSavings: currentSavings,
      annualSpending: annualSpending,
      safeWithdrawalRate: safeWithdrawalRate / 100,
      expectedReturn: expectedReturn / 100
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
  function calculateCoastFire(inputs) {
    var currentAge = inputs.currentAge;
    var retirementAge = inputs.retirementAge;
    var currentSavings = inputs.currentSavings;
    var annualSpending = inputs.annualSpending;
    var swr = inputs.safeWithdrawalRate;
    var returnRate = inputs.expectedReturn;

    // FIRE Number: Annual Spending / Safe Withdrawal Rate
    var fireTarget = swr > 0 ? annualSpending / swr : 0;

    // Years to Retirement
    var yearsToRetirement = retirementAge - currentAge;

    // Coast FIRE Number: FIRE Target / (1 + return)^years
    var coastFireNumber = 0;
    if (returnRate > 0 && yearsToRetirement > 0) {
      coastFireNumber = fireTarget / Math.pow(1 + returnRate, yearsToRetirement);
    } else if (yearsToRetirement <= 0) {
      coastFireNumber = fireTarget; // Already at retirement age
    }

    // Coast FIRE Progress (%)
    var progress = coastFireNumber > 0 ? (currentSavings / coastFireNumber) * 100 : 0;

    // Coast FIRE Status
    var status = '';
    if (progress >= 100) {
      status = '✅ Coast FIRE Achieved! You can stop saving for retirement.';
    } else if (progress >= 75) {
      status = '🔵 Almost there! Keep saving a little longer.';
    } else if (progress >= 50) {
      status = '🟡 Making good progress. Stay the course.';
    } else if (progress >= 25) {
      status = '🟠 Getting started. Consistent saving will get you there.';
    } else {
      status = '🔴 Early in your journey. Start saving today.';
    }

    // Years until Coast FIRE (with current savings growing at return rate)
    var yearsToCoast = 0;
    if (coastFireNumber > 0 && currentSavings > 0 && returnRate > 0) {
      yearsToCoast = Math.log(coastFireNumber / currentSavings) / Math.log(1 + returnRate);
      if (yearsToCoast < 0) yearsToCoast = 0;
    } else if (currentSavings === 0) {
      yearsToCoast = Infinity;
    }

    // Coast FIRE Age
    var coastAge = currentAge + yearsToCoast;

    // Generate growth data points (year by year)
    var dataPoints = [];
    var years = Math.min(yearsToRetirement + 5, 50); // Show up to 50 years
    for (var i = 0; i <= years; i++) {
      var age = currentAge + i;
      if (age > retirementAge + 10) break;

      var balance = currentSavings * Math.pow(1 + returnRate, i);
      dataPoints.push({
        age: age,
        year: i,
        balance: balance,
        coastTarget: coastFireNumber * Math.pow(1 + returnRate, i)
      });
    }

    return {
      fireTarget: fireTarget,
      coastFireNumber: coastFireNumber,
      progress: progress,
      status: status,
      yearsToCoast: yearsToCoast,
      coastAge: coastAge,
      dataPoints: dataPoints,
      currentSavings: currentSavings,
      returnRate: returnRate,
      yearsToRetirement: yearsToRetirement
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentAge <= 0 || inputs.retirementAge <= 0 || inputs.annualSpending <= 0) {
      setOutputText('output_fireTarget', '—');
      setOutputText('output_coastFireNumber', '—');
      setOutputText('output_coastFireProgress', '—');
      setOutputText('output_coastFireStatus', 'Enter your age, retirement age, and spending');
      setOutputText('output_yearsToCoast', '—');
      setOutputText('output_coastAge', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    if (inputs.retirementAge <= inputs.currentAge) {
      setOutputText('output_fireTarget', '—');
      setOutputText('output_coastFireNumber', '—');
      setOutputText('output_coastFireProgress', '—');
      setOutputText('output_coastFireStatus', 'Retirement age must be greater than current age');
      setOutputText('output_yearsToCoast', '—');
      setOutputText('output_coastAge', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateCoastFire(inputs);

    setOutputText('output_fireTarget', formatCurrency(result.fireTarget));
    setOutputText('output_coastFireNumber', formatCurrency(result.coastFireNumber));
    setOutputText('output_coastFireProgress', result.progress.toFixed(1) + '%');
    setOutputText('output_coastFireStatus', result.status);
    setOutputText('output_yearsToCoast', result.yearsToCoast === Infinity ? '—' : result.yearsToCoast.toFixed(1) + ' years');
    setOutputText('output_coastAge', result.yearsToCoast === Infinity ? '—' : result.coastAge.toFixed(0));

    var chartPayload = {
      dataPoints: result.dataPoints,
      coastFireNumber: result.coastFireNumber,
      progress: result.progress,
      currentSavings: result.currentSavings,
      fireTarget: result.fireTarget,
      coastAge: result.coastAge,
      yearsToRetirement: result.yearsToRetirement
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        annualSpending: inputs.annualSpending,
        coastFireNumber: result.coastFireNumber,
        coastAge: result.coastAge
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
    if (!data || !data.dataPoints || data.dataPoints.length === 0) return null;

    if (tab === 'growth') {
      var labels = data.dataPoints.map(function(d) { return d.age; });
      var balances = data.dataPoints.map(function(d) { return d.balance; });
      var targets = data.dataPoints.map(function(d) { return d.coastTarget; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Portfolio Balance',
            data: balances,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }, {
            label: 'Coast FIRE Target',
            data: targets,
            borderColor: '#D95B43',
            backgroundColor: 'rgba(217, 91, 67, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [6, 4]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Portfolio Growth vs Coast FIRE Target',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age',
                color: '#8899aa'
              },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 9 } }
            },
            y: {
              title: {
                display: true,
                text: 'Balance',
                color: '#8899aa'
              },
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
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var needed = data.coastFireNumber || 0;
      var saved = data.currentSavings || 0;
      var gap = Math.max(0, needed - saved);

      return {
        type: 'doughnut',
        data: {
          labels: ['Current Savings', 'Still Needed'],
          datasets: [{
            data: [saved, gap],
            backgroundColor: ['#2F6F5E', '#D95B43'],
            borderColor: ['#1f4f42', '#B84A32'],
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
              text: 'Coast FIRE Progress: ' + data.progress.toFixed(1) + '%',
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
    document.getElementById('input_currentAge').value = 30;
    document.getElementById('input_retirementAge').value = 65;
    document.getElementById('input_currentSavings').value = 50000;
    document.getElementById('input_annualSpending').value = 50000;
    document.getElementById('input_safeWithdrawalRate').value = 4.0;
    document.getElementById('input_expectedReturn').value = 7.0;
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
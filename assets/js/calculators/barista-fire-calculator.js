(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var currentAge = parseFloat(document.getElementById('input_currentAge').value) || 0;
    var retirementAge = parseFloat(document.getElementById('input_retirementAge').value) || 0;
    var currentSavings = parseFloat(document.getElementById('input_currentSavings').value) || 0;
    var annualExpenses = parseFloat(document.getElementById('input_annualExpenses').value) || 0;
    var partTimeIncome = parseFloat(document.getElementById('input_partTimeIncome').value) || 0;
    var safeWithdrawalRate = parseFloat(document.getElementById('input_safeWithdrawalRate').value) || 0;
    var expectedReturn = parseFloat(document.getElementById('input_expectedReturn').value) || 0;

    return {
      currentAge: currentAge,
      retirementAge: retirementAge,
      currentSavings: currentSavings,
      annualExpenses: annualExpenses,
      partTimeIncome: partTimeIncome,
      safeWithdrawalRate: safeWithdrawalRate / 100,
      expectedReturn: expectedReturn / 100,
      hourlyRate: 25 // Assumed hourly rate for hours calculation
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
  function calculateBaristaFire(inputs) {
    var currentAge = inputs.currentAge;
    var retirementAge = inputs.retirementAge;
    var currentSavings = inputs.currentSavings;
    var annualExpenses = inputs.annualExpenses;
    var partTimeIncome = inputs.partTimeIncome;
    var swr = inputs.safeWithdrawalRate;
    var returnRate = inputs.expectedReturn;
    var hourlyRate = inputs.hourlyRate || 25;

    // Full FIRE Number: Annual Expenses / Safe Withdrawal Rate
    var fullFireNumber = swr > 0 ? annualExpenses / swr : 0;

    // Barista FIRE Number: (Annual Expenses - Part-Time Income) / Safe Withdrawal Rate
    var expensesGap = Math.max(0, annualExpenses - partTimeIncome);
    var baristaFireNumber = swr > 0 ? expensesGap / swr : 0;

    // Savings Gap to Barista FIRE
    var baristaFireGap = Math.max(0, baristaFireNumber - currentSavings);

    // Barista FIRE Progress (%)
    var progress = baristaFireNumber > 0 ? (currentSavings / baristaFireNumber) * 100 : 0;
    if (progress > 100) progress = 100;

    // Years to Retirement (Full)
    var yearsToRetirement = retirementAge - currentAge;

    // Years until Barista FIRE (with current savings growing at return rate)
    var yearsToBarista = 0;
    if (baristaFireNumber > 0 && currentSavings > 0 && returnRate > 0) {
      yearsToBarista = Math.log(baristaFireNumber / currentSavings) / Math.log(1 + returnRate);
      if (yearsToBarista < 0) yearsToBarista = 0;
    } else if (currentSavings === 0 && baristaFireNumber > 0) {
      yearsToBarista = Infinity;
    }

    // Barista FIRE Age
    var baristaAge = currentAge + yearsToBarista;

    // Weekly hours needed (Annual Income / (Hourly Rate * 52 weeks))
    var hoursPerWeek = partTimeIncome > 0 ? partTimeIncome / (hourlyRate * 52) : 0;
    hoursPerWeek = Math.min(hoursPerWeek, 40); // Cap at full-time

    // Status
    var status = '';
    if (progress >= 100) {
      status = '✅ Barista FIRE Achieved! You can semi-retire now.';
    } else if (progress >= 75) {
      status = '🔵 Almost there! Keep saving a little longer.';
    } else if (progress >= 50) {
      status = '🟡 Making good progress. Stay the course.';
    } else if (progress >= 25) {
      status = '🟠 Getting started. Consistent saving will get you there.';
    } else {
      status = '🔴 Early in your journey. Start saving today.';
    }

    // Generate growth data points (year by year)
    var dataPoints = [];
    var years = Math.min(yearsToRetirement + 5, 50);
    for (var i = 0; i <= years; i++) {
      var age = currentAge + i;
      if (age > retirementAge + 10) break;

      var balance = currentSavings * Math.pow(1 + returnRate, i);
      dataPoints.push({
        age: age,
        year: i,
        balance: balance,
        baristaTarget: baristaFireNumber * Math.pow(1 + returnRate, i),
        fullTarget: fullFireNumber * Math.pow(1 + returnRate, i)
      });
    }

    return {
      fullFireNumber: fullFireNumber,
      baristaFireNumber: baristaFireNumber,
      baristaFireGap: baristaFireGap,
      progress: progress,
      status: status,
      yearsToBarista: yearsToBarista,
      baristaAge: baristaAge,
      hoursPerWeek: hoursPerWeek,
      dataPoints: dataPoints,
      currentSavings: currentSavings,
      returnRate: returnRate,
      yearsToRetirement: yearsToRetirement,
      annualExpenses: annualExpenses,
      partTimeIncome: partTimeIncome
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentAge <= 0 || inputs.retirementAge <= 0 || inputs.annualExpenses <= 0) {
      setOutputText('output_fullFireNumber', '—');
      setOutputText('output_baristaFireNumber', '—');
      setOutputText('output_baristaFireGap', '—');
      setOutputText('output_baristaFireProgress', '—');
      setOutputText('output_baristaFireStatus', 'Enter your age, retirement age, and expenses');
      setOutputText('output_yearsToBarista', '—');
      setOutputText('output_baristaAge', '—');
      setOutputText('output_hoursPerWeek', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    if (inputs.retirementAge <= inputs.currentAge) {
      setOutputText('output_fullFireNumber', '—');
      setOutputText('output_baristaFireNumber', '—');
      setOutputText('output_baristaFireGap', '—');
      setOutputText('output_baristaFireProgress', '—');
      setOutputText('output_baristaFireStatus', 'Retirement age must be greater than current age');
      setOutputText('output_yearsToBarista', '—');
      setOutputText('output_baristaAge', '—');
      setOutputText('output_hoursPerWeek', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateBaristaFire(inputs);

    setOutputText('output_fullFireNumber', formatCurrency(result.fullFireNumber));
    setOutputText('output_baristaFireNumber', formatCurrency(result.baristaFireNumber));
    setOutputText('output_baristaFireGap', formatCurrency(result.baristaFireGap));
    setOutputText('output_baristaFireProgress', result.progress.toFixed(1) + '%');
    setOutputText('output_baristaFireStatus', result.status);
    setOutputText('output_yearsToBarista', result.yearsToBarista === Infinity ? '—' : result.yearsToBarista.toFixed(1) + ' years');
    setOutputText('output_baristaAge', result.yearsToBarista === Infinity ? '—' : result.baristaAge.toFixed(0));
    setOutputText('output_hoursPerWeek', result.hoursPerWeek.toFixed(0) + ' hrs/week');

    var chartPayload = {
      dataPoints: result.dataPoints,
      baristaFireNumber: result.baristaFireNumber,
      fullFireNumber: result.fullFireNumber,
      progress: result.progress,
      currentSavings: result.currentSavings,
      baristaAge: result.baristaAge,
      yearsToRetirement: result.yearsToRetirement,
      partTimeIncome: result.partTimeIncome,
      annualExpenses: result.annualExpenses
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        annualExpenses: inputs.annualExpenses,
        partTimeIncome: inputs.partTimeIncome,
        baristaFireNumber: result.baristaFireNumber,
        baristaAge: result.baristaAge
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
      var baristaTargets = data.dataPoints.map(function(d) { return d.baristaTarget; });
      var fullTargets = data.dataPoints.map(function(d) { return d.fullTarget; });

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
            label: 'Barista FIRE Target',
            data: baristaTargets,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [6, 4]
          }, {
            label: 'Full FIRE Target',
            data: fullTargets,
            borderColor: '#f87171',
            backgroundColor: 'rgba(248, 113, 113, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [4, 6]
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
              text: 'Portfolio Growth vs FIRE Targets',
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
      var needed = data.baristaFireNumber || 0;
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
              text: 'Barista FIRE Progress: ' + data.progress.toFixed(1) + '%',
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
    document.getElementById('input_annualExpenses').value = 50000;
    document.getElementById('input_partTimeIncome').value = 25000;
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
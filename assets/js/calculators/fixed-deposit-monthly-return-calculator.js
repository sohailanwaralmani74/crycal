(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var principal = parseFloat(document.getElementById('input_principal').value) || 0;
    var interestRate = parseFloat(document.getElementById('input_interestRate').value) || 0;
    var tenureMonths = parseFloat(document.getElementById('input_tenureMonths').value) || 0;
    var compoundingFrequency = document.getElementById('input_compoundingFrequency').value;

    return {
      principal: principal,
      interestRate: interestRate / 100,
      tenureMonths: tenureMonths,
      compoundingFrequency: compoundingFrequency
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
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

  // ── Core Calculation ──
  function calculateFD(inputs) {
    var principal = inputs.principal;
    var rate = inputs.interestRate;
    var months = inputs.tenureMonths;
    var freq = inputs.compoundingFrequency;

    if (principal <= 0 || rate <= 0 || months <= 0) {
      return { error: 'Enter valid values' };
    }

    var years = months / 12;
    var n = 1;

    switch(freq) {
      case 'monthly': n = 12; break;
      case 'quarterly': n = 4; break;
      case 'half-yearly': n = 2; break;
      case 'annually': n = 1; break;
      case 'none': n = 1; break;
      default: n = 12;
    }

    var maturityValue = 0;
    var totalInterest = 0;
    var monthlyInterest = 0;
    var effectiveRate = 0;

    if (freq === 'none') {
      // Simple interest (no compounding)
      var totalInterestSimple = principal * rate * years;
      maturityValue = principal + totalInterestSimple;
      totalInterest = totalInterestSimple;
      monthlyInterest = totalInterest / months;
      effectiveRate = rate;
    } else {
      // Compound interest
      maturityValue = principal * Math.pow(1 + rate / n, n * years);
      totalInterest = maturityValue - principal;
      monthlyInterest = totalInterest / months;
      effectiveRate = Math.pow(1 + rate / n, n) - 1;
    }

    // Monthly return percentage
    var monthlyReturnPercentage = (monthlyInterest / principal) * 100;

    // Generate data points for chart (monthly)
    var dataPoints = [];
    var currentValue = principal;

    for (var i = 0; i <= months; i++) {
      if (i === 0) {
        dataPoints.push({
          month: 0,
          value: principal,
          interest: 0
        });
        continue;
      }

      var monthFraction = i / 12;
      var monthValue = 0;

      if (freq === 'none') {
        monthValue = principal + (principal * rate * monthFraction);
      } else {
        monthValue = principal * Math.pow(1 + rate / n, n * monthFraction);
      }

      var monthInterest = monthValue - principal;

      dataPoints.push({
        month: i,
        value: monthValue,
        interest: monthInterest
      });

      currentValue = monthValue;
    }

    return {
      monthlyInterest: monthlyInterest,
      totalInterest: totalInterest,
      maturityValue: maturityValue,
      effectiveRate: effectiveRate,
      monthlyReturnPercentage: monthlyReturnPercentage,
      dataPoints: dataPoints,
      principal: principal,
      rate: rate,
      months: months,
      freq: freq
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.principal <= 0 || inputs.interestRate <= 0 || inputs.tenureMonths <= 0) {
      setOutputText('output_monthlyInterest', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_maturityValue', '—');
      setOutputText('output_effectiveRate', '—');
      setOutputText('output_monthlyReturnPercentage', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateFD(inputs);

    if (result.error) {
      setOutputText('output_monthlyInterest', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_maturityValue', '—');
      setOutputText('output_effectiveRate', '—');
      setOutputText('output_monthlyReturnPercentage', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_monthlyInterest', formatCurrency(result.monthlyInterest));
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_maturityValue', formatCurrency(result.maturityValue));
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));
    setOutputText('output_monthlyReturnPercentage', formatPercent(result.monthlyReturnPercentage / 100));

    var chartPayload = {
      dataPoints: result.dataPoints,
      maturityValue: result.maturityValue,
      totalInterest: result.totalInterest,
      principal: result.principal,
      monthlyInterest: result.monthlyInterest,
      months: result.months
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        principal: inputs.principal,
        interestRate: inputs.interestRate * 100,
        tenureMonths: inputs.tenureMonths,
        maturityValue: result.maturityValue,
        totalInterest: result.totalInterest
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
      var labels = data.dataPoints.map(function(d) { return 'Month ' + d.month; });
      var values = data.dataPoints.map(function(d) { return d.value; });

      // Show every 3rd month for cleaner display
      var filteredLabels = labels.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === labels.length - 1; });
      var filteredValues = values.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === values.length - 1; });

      return {
        type: 'line',
        data: {
          labels: filteredLabels,
          datasets: [{
            label: 'Maturity Value',
            data: filteredValues,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
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
              text: 'Fixed Deposit Growth Over Time',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxTicksLimit: 20
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
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      };
    }

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Total Interest'],
          datasets: [{
            data: [data.principal, data.totalInterest],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderColor: ['#3a7b8c', '#3a9b6c'],
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
              text: 'Principal vs Interest Breakdown',
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
    document.getElementById('input_principal').value = 100000;
    document.getElementById('input_interestRate').value = 7.5;
    document.getElementById('input_tenureMonths').value = 12;
    document.getElementById('input_compoundingFrequency').value = 'monthly';
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
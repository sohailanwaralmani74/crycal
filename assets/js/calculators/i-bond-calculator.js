(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Historical I Bond Rates ──
  var HISTORICAL_RATES = {
    '2026-05': { fixed: 0.0090, inflation: 0.0168 },
    '2025-11': { fixed: 0.0090, inflation: 0.0156 },
    '2025-05': { fixed: 0.0000, inflation: 0.0169 },
    '2024-11': { fixed: 0.0000, inflation: 0.0124 },
    '2024-05': { fixed: 0.0000, inflation: 0.0182 },
    '2023-11': { fixed: 0.0000, inflation: 0.0169 },
    '2023-05': { fixed: 0.0000, inflation: 0.0181 },
    '2022-11': { fixed: 0.0000, inflation: 0.0324 },
    '2022-05': { fixed: 0.0000, inflation: 0.0372 },
    '2021-11': { fixed: 0.0000, inflation: 0.0356 },
    '2021-05': { fixed: 0.0000, inflation: 0.0177 },
    '2020-11': { fixed: 0.0000, inflation: 0.0068 },
    '2020-05': { fixed: 0.0000, inflation: 0.0022 },
    '2019-11': { fixed: 0.0000, inflation: 0.0020 },
    '2019-05': { fixed: 0.0000, inflation: 0.0070 },
  };

  // ── Get Inputs ──
  function getInputs() {
    var purchaseDate = document.getElementById('input_purchaseDate').value;
    var purchaseAmount = parseFloat(document.getElementById('input_purchaseAmount').value) || 0;
    var fixedRate = parseFloat(document.getElementById('input_fixedRate').value) || 0;
    var inflationRate = parseFloat(document.getElementById('input_inflationRate').value) || 0;
    var redemptionMonth = document.getElementById('input_redemptionMonth').value;

    return {
      purchaseDate: purchaseDate,
      purchaseAmount: purchaseAmount,
      fixedRate: fixedRate / 100,
      inflationRate: inflationRate / 100,
      redemptionMonth: redemptionMonth
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

  // ── Calculate Composite Rate ──
  function calculateCompositeRate(fixedRate, inflationRate) {
    return fixedRate + (2 * inflationRate) + (fixedRate * inflationRate);
  }

  // ── Core Calculation ──
  function calculateIBond(inputs) {
    var purchaseDate = inputs.purchaseDate;
    var purchaseAmount = inputs.purchaseAmount;
    var fixedRate = inputs.fixedRate;
    var inflationRate = inputs.inflationRate;
    var redemptionMonth = inputs.redemptionMonth;

    if (!purchaseDate || purchaseAmount <= 0) {
      return { error: 'Enter a valid purchase date and amount' };
    }

    var purchase = new Date(purchaseDate + 'T00:00:00');
    if (isNaN(purchase.getTime())) {
      return { error: 'Invalid purchase date' };
    }

    var endDate = new Date();
    if (redemptionMonth) {
      var parts = redemptionMonth.split('-');
      if (parts.length === 2) {
        endDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
      }
    }

    var yearsHeld = (endDate - purchase) / (365.25 * 24 * 60 * 60 * 1000);
    if (yearsHeld < 0) yearsHeld = 0;

    var penaltyMonths = yearsHeld < 5 ? 3 : 0;

    var value = purchaseAmount;
    var dataPoints = [];
    var currentDate = new Date(purchase);

    var maxPeriods = 60;
    var periodCount = 0;

    while (currentDate < endDate && periodCount < maxPeriods) {
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;

      var rateKey = year + '-';
      if (month >= 5 && month < 11) {
        rateKey += '05';
      } else if (month >= 11) {
        rateKey += '11';
      } else {
        rateKey = (year - 1) + '-11';
      }

      var periodRate = HISTORICAL_RATES[rateKey] || null;

      var fixed = fixedRate > 0 ? fixedRate : (periodRate ? periodRate.fixed : 0);
      var infl = inflationRate > 0 ? inflationRate : (periodRate ? periodRate.inflation : 0);

      var composite = calculateCompositeRate(fixed, infl);

      var periodEnd = new Date(currentDate);
      var m = periodEnd.getMonth() + 1;
      var y = periodEnd.getFullYear();

      if (m < 5) {
        periodEnd = new Date(y, 4, 1);
      } else if (m < 11) {
        periodEnd = new Date(y, 10, 1);
      } else {
        periodEnd = new Date(y + 1, 4, 1);
      }

      if (periodEnd > endDate) {
        periodEnd = new Date(endDate);
      }

      var monthsInPeriod = (periodEnd - currentDate) / (30.44 * 24 * 60 * 60 * 1000);
      if (monthsInPeriod < 0) monthsInPeriod = 0;

      var semiannualRate = composite / 2;
      var periodValue = value * Math.pow(1 + semiannualRate, monthsInPeriod / 6);

      dataPoints.push({
        date: new Date(currentDate),
        value: value,
        periodValue: periodValue,
        composite: composite
      });

      value = periodValue;
      currentDate = new Date(periodEnd);
      periodCount++;
    }

    if (penaltyMonths > 0 && yearsHeld > 0) {
      var monthlyRate = Math.pow(value / purchaseAmount, 1 / (yearsHeld * 12)) - 1;
      var penalty = value * (1 - Math.pow(1 + monthlyRate, -penaltyMonths));
      value = value - penalty;
    }

    var totalInterest = value - purchaseAmount;

    var currentComposite = calculateCompositeRate(
      fixedRate > 0 ? fixedRate : 0.0090,
      inflationRate > 0 ? inflationRate : 0.0168
    );

    var annualizedReturn = 0;
    if (yearsHeld > 0 && purchaseAmount > 0) {
      annualizedReturn = Math.pow(value / purchaseAmount, 1 / yearsHeld) - 1;
    }

    var nextChange = new Date();
    var nextMonth = nextChange.getMonth() + 1;
    var nextYear = nextChange.getFullYear();

    if (nextMonth < 5) {
      nextChange = new Date(nextYear, 4, 1);
    } else if (nextMonth < 11) {
      nextChange = new Date(nextYear, 10, 1);
    } else {
      nextChange = new Date(nextYear + 1, 4, 1);
    }

    var nextRateChange = nextChange.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    return {
      currentValue: value,
      totalInterest: totalInterest,
      compositeRate: currentComposite,
      yearsHeld: yearsHeld,
      annualizedReturn: annualizedReturn,
      nextRateChange: nextRateChange,
      dataPoints: dataPoints,
      purchaseAmount: purchaseAmount
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (!inputs.purchaseDate || inputs.purchaseAmount <= 0) {
      setOutputText('output_currentValue', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_compositeRate', '—');
      setOutputText('output_yearsHeld', '—');
      setOutputText('output_annualizedReturn', '—');
      setOutputText('output_nextRateChange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateIBond(inputs);

    if (result.error) {
      setOutputText('output_currentValue', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_compositeRate', '—');
      setOutputText('output_yearsHeld', '—');
      setOutputText('output_annualizedReturn', '—');
      setOutputText('output_nextRateChange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_currentValue', formatCurrency(result.currentValue));
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_compositeRate', formatPercent(result.compositeRate));
    setOutputText('output_yearsHeld', result.yearsHeld.toFixed(1) + ' years');
    setOutputText('output_annualizedReturn', formatPercent(result.annualizedReturn));
    setOutputText('output_nextRateChange', result.nextRateChange);

    var chartPayload = {
      dataPoints: result.dataPoints,
      currentValue: result.currentValue,
      totalInterest: result.totalInterest,
      purchaseAmount: result.purchaseAmount
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        purchaseDate: inputs.purchaseDate,
        purchaseAmount: inputs.purchaseAmount,
        fixedRate: inputs.fixedRate * 100,
        currentValue: result.currentValue,
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
      var labels = data.dataPoints.map(function(d) {
        return d.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      });
      var values = data.dataPoints.map(function(d) { return d.value; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Bond Value',
            data: values,
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
              text: 'I Bond Value Over Time',
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
      var principal = data.purchaseAmount || 0;
      var interest = data.totalInterest || 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Interest Earned'],
          datasets: [{
            data: [principal, interest],
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
    var dateInput = document.getElementById('input_purchaseDate');
    if (dateInput) {
      dateInput.value = '';
    }

    document.getElementById('input_purchaseAmount').value = 10000;
    document.getElementById('input_fixedRate').value = 0.90;
    document.getElementById('input_inflationRate').value = 1.68;

    var monthInput = document.getElementById('input_redemptionMonth');
    if (monthInput) monthInput.value = '';

    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    // DO NOT set a default date here — let the user pick
    // The tool will show "Enter a valid purchase date" until they select one

    // Add event listeners to trigger updates
    var dateInput = document.getElementById('input_purchaseDate');
    if (dateInput) {
      dateInput.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    var monthInput = document.getElementById('input_redemptionMonth');
    if (monthInput) {
      monthInput.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    // Handle all other inputs
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
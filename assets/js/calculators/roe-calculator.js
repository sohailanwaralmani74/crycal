(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var netIncome = parseFloat(document.getElementById('input_netIncome').value) || 0;
    var shareholdersEquity = parseFloat(document.getElementById('input_shareholdersEquity').value) || 0;
    var averageEquity = parseFloat(document.getElementById('input_averageEquity').value) || 0;

    return {
      netIncome: netIncome,
      shareholdersEquity: shareholdersEquity,
      averageEquity: averageEquity
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
  function calculateROE(inputs) {
    var netIncome = inputs.netIncome;
    var equity = inputs.shareholdersEquity;
    var avgEquity = inputs.averageEquity;

    if (netIncome <= 0 || equity <= 0) {
      return { error: 'Enter valid net income and equity values' };
    }

    // Calculate ROE
    var equityUsed = avgEquity > 0 ? avgEquity : equity;
    var roe = netIncome / equityUsed;

    // ── DuPont Analysis ──
    // ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
    // For this calculation, we need assumptions for total assets and sales
    // Since we don't have these inputs, we calculate what we can
    // and provide placeholders for the rest

    var netProfitMargin = null;
    var assetTurnover = null;
    var equityMultiplier = null;

    // If we have additional data, we could calculate these
    // For now, we'll show them as "—" or calculate from available data

    // ── Performance Assessment ──
    var performance = '';
    var recommendation = '';

    if (roe >= 0.25) {
      performance = '✅ Excellent — Exceptional return on equity';
      recommendation = 'The company is generating strong profits from shareholder equity. This indicates efficient management and a solid business model.';
    } else if (roe >= 0.18) {
      performance = '✅ Good — Healthy return on equity';
      recommendation = 'The company is generating solid returns. Continue to monitor profitability and capital structure.';
    } else if (roe >= 0.12) {
      performance = '🟡 Moderate — Acceptable but room for improvement';
      recommendation = 'Consider improving profitability or optimizing the capital structure to increase ROE.';
    } else if (roe >= 0.06) {
      performance = '🟡 Low — Below average';
      recommendation = 'The company may need to improve profitability, reduce costs, or increase asset efficiency.';
    } else {
      performance = '🔴 Poor — Significant improvement needed';
      recommendation = 'The company is generating very low returns on equity. A comprehensive review of operations and strategy is recommended.';
    }

    // ── Data for Charts ──
    var chartData = {
      'Net Income': netIncome,
      'Shareholders\' Equity': equityUsed,
      'ROE': roe * 100
    };

    return {
      roe: roe,
      performance: performance,
      recommendation: recommendation,
      chartData: chartData,
      netIncome: netIncome,
      equityUsed: equityUsed,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.netIncome <= 0 || inputs.shareholdersEquity <= 0) {
      setOutputText('output_roe', '—');
      setOutputText('output_roeBreakdown', '—');
      setOutputText('output_performance', '—');
      setOutputText('output_netProfitMargin', '—');
      setOutputText('output_assetTurnover', '—');
      setOutputText('output_equityMultiplier', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateROE(inputs);

    if (result.error) {
      setOutputText('output_roe', '—');
      setOutputText('output_roeBreakdown', '—');
      setOutputText('output_performance', '—');
      setOutputText('output_netProfitMargin', '—');
      setOutputText('output_assetTurnover', '—');
      setOutputText('output_equityMultiplier', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_roe', formatPercent(result.roe));
    setOutputText('output_roeBreakdown', 'Net Income: ' + formatCurrency(result.netIncome) + ' / Equity: ' + formatCurrency(result.equityUsed) + ' = ' + formatPercent(result.roe));
    setOutputText('output_performance', result.performance);
    setOutputText('output_netProfitMargin', '— (requires sales data)');
    setOutputText('output_assetTurnover', '— (requires asset data)');
    setOutputText('output_equityMultiplier', '— (requires asset data)');
    setOutputText('output_recommendation', result.recommendation);

    var chartPayload = {
      chartData: result.chartData,
      roe: result.roe,
      netIncome: result.netIncome,
      equityUsed: result.equityUsed
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        netIncome: inputs.netIncome,
        shareholdersEquity: inputs.shareholdersEquity,
        roe: result.roe * 100,
        performance: result.performance
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
      var labels = Object.keys(data.chartData);
      var values = Object.values(data.chartData);

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Value',
            data: values,
            backgroundColor: ['#4A90D9', '#fbbf24', '#4ade80'],
            borderColor: ['#3a7b8c', '#d4a030', '#3a9b6c'],
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
              text: 'ROE Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  if (v > 100) {
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
                  return v.toFixed(0) + '%';
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
            }
          }
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Net Income', 'Shareholders\' Equity'],
          datasets: [{
            data: [data.netIncome, data.equityUsed],
            backgroundColor: ['#4A90D9', '#D95B43'],
            borderColor: ['#3a7b8c', '#B84A32'],
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
              text: 'Net Income vs Shareholders\' Equity',
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
    document.getElementById('input_netIncome').value = 500000;
    document.getElementById('input_shareholdersEquity').value = 2500000;
    document.getElementById('input_averageEquity').value = 0;
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
(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var roe = parseFloat(document.getElementById('input_roe').value) || 0;
    var retentionRatio = parseFloat(document.getElementById('input_retentionRatio').value) || 0;
    var dividendPayoutRatio = parseFloat(document.getElementById('input_dividendPayoutRatio').value) || 0;
    var eps = parseFloat(document.getElementById('input_eps').value) || 0;
    var dps = parseFloat(document.getElementById('input_dps').value) || 0;
    var equity = parseFloat(document.getElementById('input_equity').value) || 0;
    var netIncome = parseFloat(document.getElementById('input_netIncome').value) || 0;

    return {
      roe: roe / 100,
      retentionRatio: retentionRatio / 100,
      dividendPayoutRatio: dividendPayoutRatio / 100,
      eps: eps,
      dps: dps,
      equity: equity,
      netIncome: netIncome
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
  function calculateSGR(inputs) {
    var roe = inputs.roe;
    var retention = inputs.retentionRatio;
    var payout = inputs.dividendPayoutRatio;
    var eps = inputs.eps;
    var dps = inputs.dps;
    var equity = inputs.equity;
    var netIncome = inputs.netIncome;

    // Calculate ROE if not provided
    var roeCalculated = roe;
    if (roeCalculated === 0 && equity > 0 && netIncome > 0) {
      roeCalculated = netIncome / equity;
    }

    // Calculate retention ratio if not provided
    var retentionCalculated = retention;
    if (retentionCalculated === 0 && payout > 0) {
      retentionCalculated = 1 - payout;
    }
    if (retentionCalculated === 0 && eps > 0 && dps > 0) {
      retentionCalculated = 1 - (dps / eps);
    }

    // Cap values
    if (roeCalculated > 1) roeCalculated = 1;
    if (retentionCalculated > 1) retentionCalculated = 1;
    if (retentionCalculated < 0) retentionCalculated = 0;

    // Calculate SGR
    var sgr = roeCalculated * retentionCalculated;

    // Calculate retained earnings and dividends
    var retainedEarnings = 0;
    var totalDividends = 0;
    if (netIncome > 0) {
      retainedEarnings = netIncome * retentionCalculated;
      totalDividends = netIncome * (1 - retentionCalculated);
    }

    // Status
    var status = '';
    var recommendation = '';
    if (sgr > 0.25) {
      status = '✅ High Growth Capacity';
      recommendation = 'The company has strong organic growth potential. Consider reinvesting earnings for expansion.';
    } else if (sgr > 0.15) {
      status = '✅ Healthy Growth Capacity';
      recommendation = 'The company can grow at a healthy rate without external financing. Maintain current financial policies.';
    } else if (sgr > 0.08) {
      status = '🟡 Moderate Growth Capacity';
      recommendation = 'The company can grow moderately. Consider increasing retention ratio or improving ROE.';
    } else if (sgr > 0.03) {
      status = '🟡 Low Growth Capacity';
      recommendation = 'Growth is limited. Consider improving profitability or reducing dividends.';
    } else {
      status = '🔴 Limited Growth Capacity';
      recommendation = 'Significant improvement in ROE or retention is needed. Evaluate business strategy.';
    }

    // Data for charts
    var chartData = {
      'ROE Contribution': roeCalculated * 100,
      'Retention Ratio': retentionCalculated * 100,
      'Sustainable Growth Rate': sgr * 100
    };

    return {
      sgr: sgr,
      roeCalculated: roeCalculated,
      retentionCalculated: retentionCalculated,
      retainedEarnings: retainedEarnings,
      totalDividends: totalDividends,
      status: status,
      recommendation: recommendation,
      chartData: chartData,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.roe <= 0 && inputs.netIncome <= 0) {
      setOutputText('output_sgr', '—');
      setOutputText('output_retentionDisplay', '—');
      setOutputText('output_dividendDisplay', '—');
      setOutputText('output_roeDisplay', '—');
      setOutputText('output_retainedEarnings', '—');
      setOutputText('output_totalDividends', '—');
      setOutputText('output_status', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateSGR(inputs);

    if (result.error) {
      setOutputText('output_sgr', '—');
      setOutputText('output_retentionDisplay', '—');
      setOutputText('output_dividendDisplay', '—');
      setOutputText('output_roeDisplay', '—');
      setOutputText('output_retainedEarnings', '—');
      setOutputText('output_totalDividends', '—');
      setOutputText('output_status', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_sgr', formatPercent(result.sgr));
    setOutputText('output_retentionDisplay', formatPercent(result.retentionCalculated));
    setOutputText('output_dividendDisplay', formatPercent(1 - result.retentionCalculated));
    setOutputText('output_roeDisplay', formatPercent(result.roeCalculated));
    setOutputText('output_retainedEarnings', formatCurrency(result.retainedEarnings));
    setOutputText('output_totalDividends', formatCurrency(result.totalDividends));
    setOutputText('output_status', result.status);
    setOutputText('output_recommendation', result.recommendation);

    var chartPayload = {
      chartData: result.chartData,
      sgr: result.sgr,
      retention: result.retentionCalculated,
      roe: result.roeCalculated
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        roe: inputs.roe * 100,
        retentionRatio: inputs.retentionRatio * 100,
        sgr: result.sgr * 100,
        status: result.status
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
            label: 'Percentage (%)',
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
              text: 'SGR Breakdown',
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
          labels: ['Retained Earnings', 'Dividends Paid'],
          datasets: [{
            data: [data.retention * 100, (1 - data.retention) * 100],
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
              text: 'Earnings Allocation',
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
    document.getElementById('input_roe').value = 15.0;
    document.getElementById('input_retentionRatio').value = 60.0;
    document.getElementById('input_dividendPayoutRatio').value = 40.0;
    document.getElementById('input_eps').value = 5.00;
    document.getElementById('input_dps').value = 2.00;
    document.getElementById('input_equity').value = 1000000;
    document.getElementById('input_netIncome').value = 150000;
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
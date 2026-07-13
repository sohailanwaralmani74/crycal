(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var sharesHeld = parseFloat(document.getElementById('input_sharesHeld').value) || 0;
    var costBasis = parseFloat(document.getElementById('input_costBasis').value) || 0;
    var splitRatio = parseFloat(document.getElementById('input_splitRatio').value) || 0;

    return {
      sharesHeld: sharesHeld,
      costBasis: costBasis,
      splitRatio: splitRatio
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

  function formatNumber(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '—';
    return amount.toFixed(2);
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
  function calculateSplit(inputs) {
    var shares = inputs.sharesHeld;
    var costBasis = inputs.costBasis;
    var ratio = inputs.splitRatio;

    if (shares <= 0 || costBasis <= 0 || ratio <= 0) {
      return {
        newShares: 0,
        newCostPerShare: 0,
        totalCostBasis: costBasis,
        splitType: '—',
        shareChange: 0,
        error: 'Enter valid values (shares > 0, cost basis > 0, ratio > 0)'
      };
    }

    var newShares = shares * ratio;
    var newCostPerShare = costBasis / newShares;
    var shareChange = newShares - shares;

    var splitType = '';
    if (ratio > 1) {
      splitType = 'Forward Split (' + ratio.toFixed(2) + ':1)';
    } else if (ratio < 1) {
      splitType = 'Reverse Split (1:' + (1 / ratio).toFixed(2) + ')';
    } else {
      splitType = 'No Split (1:1)';
    }

    return {
      newShares: newShares,
      newCostPerShare: newCostPerShare,
      totalCostBasis: costBasis,
      splitType: splitType,
      shareChange: shareChange,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.sharesHeld <= 0 || inputs.costBasis <= 0 || inputs.splitRatio <= 0) {
      setOutputText('output_newShares', '—');
      setOutputText('output_newCostPerShare', '—');
      setOutputText('output_totalCostBasis', '—');
      setOutputText('output_splitType', '—');
      setOutputText('output_shareChange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateSplit(inputs);

    if (result.error) {
      setOutputText('output_newShares', '—');
      setOutputText('output_newCostPerShare', '—');
      setOutputText('output_totalCostBasis', '—');
      setOutputText('output_splitType', '—');
      setOutputText('output_shareChange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_newShares', formatNumber(result.newShares));
    setOutputText('output_newCostPerShare', formatCurrency(result.newCostPerShare));
    setOutputText('output_totalCostBasis', formatCurrency(result.totalCostBasis));
    setOutputText('output_splitType', result.splitType);
    setOutputText('output_shareChange', (result.shareChange > 0 ? '+' : '') + formatNumber(result.shareChange));

    var chartPayload = {
      sharesBefore: inputs.sharesHeld,
      sharesAfter: result.newShares,
      costBefore: inputs.costBasis,
      costAfter: result.newCostPerShare,
      splitRatio: inputs.splitRatio,
      newShares: result.newShares,
      newCostPerShare: result.newCostPerShare,
      totalCostBasis: result.totalCostBasis
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        sharesHeld: inputs.sharesHeld,
        costBasis: inputs.costBasis,
        splitRatio: inputs.splitRatio,
        newShares: result.newShares,
        newCostPerShare: result.newCostPerShare
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
    if (!data || data.sharesBefore === undefined) return null;

    if (tab === 'breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Shares Before', 'Shares After'],
          datasets: [{
            label: 'Share Count',
            data: [data.sharesBefore, data.sharesAfter],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderColor: ['#3a7b8c', '#3a9b6c'],
            borderWidth: 1,
            borderRadius: 4
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
              text: 'Share Count Before & After Split',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 }
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Cost Per Share'],
          datasets: [{
            label: 'Before Split',
            data: [data.costBefore / data.sharesBefore],
            backgroundColor: '#4A90D9',
            borderColor: '#3a7b8c',
            borderWidth: 1,
            borderRadius: 4
          }, {
            label: 'After Split',
            data: [data.newCostPerShare],
            backgroundColor: '#4ade80',
            borderColor: '#3a9b6c',
            borderWidth: 1,
            borderRadius: 4
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
              text: 'Cost Per Share: Before vs After',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
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
    document.getElementById('input_sharesHeld').value = 100;
    document.getElementById('input_costBasis').value = 5000;
    document.getElementById('input_splitRatio').value = 2;
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
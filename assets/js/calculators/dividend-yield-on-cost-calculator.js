(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var purchasePrice = parseFloat(document.getElementById('input_purchasePrice').value) || 0;
    var sharesHeld = parseFloat(document.getElementById('input_sharesHeld').value) || 0;
    var annualDividendPerShare = parseFloat(document.getElementById('input_annualDividendPerShare').value) || 0;
    var dividendGrowthRate = parseFloat(document.getElementById('input_dividendGrowthRate').value) || 0;

    return {
      purchasePrice: purchasePrice,
      sharesHeld: sharesHeld,
      annualDividendPerShare: annualDividendPerShare,
      dividendGrowthRate: dividendGrowthRate / 100
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
  function calculateYOC(inputs) {
    var purchasePrice = inputs.purchasePrice;
    var shares = inputs.sharesHeld;
    var dividend = inputs.annualDividendPerShare;
    var growthRate = inputs.dividendGrowthRate;

    if (purchasePrice <= 0 || shares <= 0 || dividend <= 0) {
      return {
        totalInvestment: 0,
        annualDividendIncome: 0,
        yoc: 0,
        currentYield: 0,
        yieldDifference: 0,
        projectedIncome: 0,
        error: 'Enter valid values (price > 0, shares > 0, dividend > 0)'
      };
    }

    var totalInvestment = purchasePrice * shares;
    var annualDividendIncome = dividend * shares;
    var yoc = dividend / purchasePrice;

    // Current yield is same as YOC since we don't have current price
    // In a real scenario, this would use current market price
    var currentYield = yoc; // Same as YOC for this calculation

    var yieldDifference = yoc - currentYield;

    // Projected income after 10 years with dividend growth
    var projectedDividend = dividend * Math.pow(1 + growthRate, 10);
    var projectedIncome = projectedDividend * shares;

    return {
      totalInvestment: totalInvestment,
      annualDividendIncome: annualDividendIncome,
      yoc: yoc,
      currentYield: currentYield,
      yieldDifference: yieldDifference,
      projectedIncome: projectedIncome,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.purchasePrice <= 0 || inputs.sharesHeld <= 0 || inputs.annualDividendPerShare <= 0) {
      setOutputText('output_totalInvestment', '—');
      setOutputText('output_annualDividendIncome', '—');
      setOutputText('output_dividendYieldOnCost', '—');
      setOutputText('output_currentYield', '—');
      setOutputText('output_yieldDifference', '—');
      setOutputText('output_projectedIncome', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateYOC(inputs);

    if (result.error) {
      setOutputText('output_totalInvestment', '—');
      setOutputText('output_annualDividendIncome', '—');
      setOutputText('output_dividendYieldOnCost', '—');
      setOutputText('output_currentYield', '—');
      setOutputText('output_yieldDifference', '—');
      setOutputText('output_projectedIncome', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalInvestment', formatCurrency(result.totalInvestment));
    setOutputText('output_annualDividendIncome', formatCurrency(result.annualDividendIncome));
    setOutputText('output_dividendYieldOnCost', formatPercent(result.yoc));
    setOutputText('output_currentYield', formatPercent(result.currentYield));
    setOutputText('output_yieldDifference', formatPercent(result.yieldDifference));
    setOutputText('output_projectedIncome', formatCurrency(result.projectedIncome));

    var chartPayload = {
      totalInvestment: result.totalInvestment,
      annualDividendIncome: result.annualDividendIncome,
      yoc: result.yoc,
      currentYield: result.currentYield,
      yieldDifference: result.yieldDifference,
      projectedIncome: result.projectedIncome,
      purchasePrice: inputs.purchasePrice,
      sharesHeld: inputs.sharesHeld,
      dividend: inputs.annualDividendPerShare,
      growthRate: inputs.dividendGrowthRate
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        purchasePrice: inputs.purchasePrice,
        sharesHeld: inputs.sharesHeld,
        annualDividendPerShare: inputs.annualDividendPerShare,
        yoc: result.yoc * 100,
        annualDividendIncome: result.annualDividendIncome
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
    if (!data || data.purchasePrice === undefined) return null;

    if (tab === 'growth') {
      // Generate 10-year dividend growth projection
      var labels = [];
      var incomeData = [];
      var dividendData = [];
      var yocData = [];

      for (var i = 0; i <= 10; i++) {
        labels.push('Year ' + i);
        var div = data.dividend * Math.pow(1 + data.growthRate, i);
        var income = div * data.sharesHeld;
        var yoc = div / data.purchasePrice;

        dividendData.push(div);
        incomeData.push(income);
        yocData.push(yoc * 100);
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Annual Dividend Income',
            data: incomeData,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            yAxisID: 'y'
          }, {
            label: 'Yield on Cost (%)',
            data: yocData,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [6, 4],
            yAxisID: 'y1'
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
              text: 'Dividend Income & YOC Growth (10-Year Projection)',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxTicksLimit: 11
              }
            },
            y: {
              position: 'left',
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
            },
            y1: {
              position: 'right',
              grid: { display: false },
              ticks: {
                color: '#4ade80',
                font: { size: 9 },
                callback: function(v) {
                  return v.toFixed(0) + '%';
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Yield on Cost (YOC)', 'Current Yield'],
          datasets: [{
            label: 'Yield Comparison',
            data: [data.yoc * 100, data.currentYield * 100],
            backgroundColor: ['#4ade80', '#4A90D9'],
            borderColor: ['#3a9b6c', '#3a7b8c'],
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
              text: 'YOC vs Current Yield',
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
                  return v.toFixed(2) + '%';
                }
              }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var principal = data.totalInvestment || 0;
      var annualIncome = data.annualDividendIncome || 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Total Investment', 'Annual Dividend Income'],
          datasets: [{
            data: [principal, annualIncome],
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
              text: 'Investment vs Annual Income',
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
    document.getElementById('input_purchasePrice').value = 50.00;
    document.getElementById('input_sharesHeld').value = 100;
    document.getElementById('input_annualDividendPerShare').value = 2.00;
    document.getElementById('input_dividendGrowthRate').value = 5.0;
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
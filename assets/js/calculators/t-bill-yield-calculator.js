(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var faceValue = parseFloat(document.getElementById('input_faceValue').value) || 0;
    var purchasePrice = parseFloat(document.getElementById('input_purchasePrice').value) || 0;
    var daysToMaturity = parseFloat(document.getElementById('input_daysToMaturity').value) || 0;
    var calculationType = document.getElementById('input_calculationType').value;

    return {
      faceValue: faceValue,
      purchasePrice: purchasePrice,
      daysToMaturity: daysToMaturity,
      calculationType: calculationType
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
    return (value * 100).toFixed(4) + '%';
  }

  function formatPercentShort(value) {
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
  function calculateTBillYield(inputs) {
    var face = inputs.faceValue;
    var price = inputs.purchasePrice;
    var days = inputs.daysToMaturity;
    var calcType = inputs.calculationType;

    if (face <= 0 || price <= 0 || days <= 0) {
      return { error: 'Enter valid values for face value, purchase price, and days to maturity' };
    }

    if (price >= face) {
      return { error: 'Purchase price must be less than face value' };
    }

    var discount = face - price;

    // ── Discount Yield (Bank Discount Yield) ──
    var discountYield = (discount / face) * (360 / days);

    // ── Investment Yield (Bond Equivalent Yield) ──
    var investmentYield = (discount / price) * (365 / days);

    // ── Dollar Return ──
    var dollarReturn = discount;

    // ── Annualized Return ──
    var annualizedReturn = (discount / price) * (365 / days);

    // ── Effective Annual Yield ──
    var effectiveYield = Math.pow(1 + (discount / price), 365 / days) - 1;

    // ── Determine what to show ──
    var showDiscount = (calcType === 'discount-yield' || calcType === 'both');
    var showInvestment = (calcType === 'investment-yield' || calcType === 'both');

    return {
      discountYield: discountYield,
      investmentYield: investmentYield,
      dollarReturn: dollarReturn,
      annualizedReturn: annualizedReturn,
      effectiveYield: effectiveYield,
      showDiscount: showDiscount,
      showInvestment: showInvestment,
      faceValue: face,
      purchasePrice: price,
      daysToMaturity: days,
      discount: discount,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.faceValue <= 0 || inputs.purchasePrice <= 0 || inputs.daysToMaturity <= 0) {
      setOutputText('output_discountYield', '—');
      setOutputText('output_investmentYield', '—');
      setOutputText('output_dollarReturn', '—');
      setOutputText('output_annualizedReturn', '—');
      setOutputText('output_effectiveYield', '—');
      setOutputText('output_summaryDollarReturn', '—');
      setOutputText('output_summaryDiscountYield', '—');
      setOutputText('output_summaryInvestmentYield', '—');
      setOutputText('output_summaryEffectiveYield', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateTBillYield(inputs);

    if (result.error) {
      setOutputText('output_discountYield', '—');
      setOutputText('output_investmentYield', '—');
      setOutputText('output_dollarReturn', '—');
      setOutputText('output_annualizedReturn', '—');
      setOutputText('output_effectiveYield', '—');
      setOutputText('output_summaryDollarReturn', '—');
      setOutputText('output_summaryDiscountYield', '—');
      setOutputText('output_summaryInvestmentYield', '—');
      setOutputText('output_summaryEffectiveYield', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    // ── Main Outputs ──
    setOutputText('output_discountYield', result.showDiscount ? formatPercent(result.discountYield) : '—');
    setOutputText('output_investmentYield', result.showInvestment ? formatPercent(result.investmentYield) : '—');
    setOutputText('output_dollarReturn', formatCurrency(result.dollarReturn));
    setOutputText('output_annualizedReturn', formatPercent(result.annualizedReturn));
    setOutputText('output_effectiveYield', formatPercent(result.effectiveYield));

    // ── Summary Outputs (Separate) ──
    setOutputText('output_summaryDollarReturn', formatCurrency(result.dollarReturn));
    setOutputText('output_summaryDiscountYield', result.showDiscount ? formatPercentShort(result.discountYield) : '—');
    setOutputText('output_summaryInvestmentYield', result.showInvestment ? formatPercentShort(result.investmentYield) : '—');
    setOutputText('output_summaryEffectiveYield', formatPercentShort(result.effectiveYield));

    var chartPayload = {
      discountYield: result.discountYield,
      investmentYield: result.investmentYield,
      effectiveYield: result.effectiveYield,
      dollarReturn: result.dollarReturn,
      faceValue: result.faceValue,
      purchasePrice: result.purchasePrice,
      daysToMaturity: result.daysToMaturity,
      showDiscount: result.showDiscount,
      showInvestment: result.showInvestment,
      discount: result.discount
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        faceValue: inputs.faceValue,
        purchasePrice: inputs.purchasePrice,
        daysToMaturity: inputs.daysToMaturity,
        discountYield: result.discountYield * 100,
        investmentYield: result.investmentYield * 100
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
      var labels = [];
      var values = [];

      if (data.showDiscount) {
        labels.push('Discount Yield');
        values.push(data.discountYield * 100);
      }
      if (data.showInvestment) {
        labels.push('Investment Yield');
        values.push(data.investmentYield * 100);
      }
      labels.push('Effective Annual Yield');
      values.push(data.effectiveYield * 100);

      var colors = ['#4A90D9', '#4ade80', '#fbbf24'];

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Yield (%)',
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: colors.slice(0, labels.length).map(function(c) {
              return c === '#4A90D9' ? '#3a7b8c' : c === '#4ade80' ? '#3a9b6c' : '#d4a030';
            }),
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
              text: 'T-Bill Yield Comparison',
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
                  return v.toFixed(2) + '%';
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 9 } }
            }
          }
        }
      };
    }

    if (tab === 'growth') {
      var labels = [];
      var values = [];
      var steps = Math.min(data.daysToMaturity / 7, 20);

      for (var i = 0; i <= steps; i++) {
        var days = Math.round((i / steps) * data.daysToMaturity);
        labels.push(days + 'd');
        var val = data.purchasePrice * Math.pow(1 + data.investmentYield, days / 365);
        values.push(val);
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Value Over Time',
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
              text: 'T-Bill Value Growth Over Time',
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
    document.getElementById('input_faceValue').value = 10000;
    document.getElementById('input_purchasePrice').value = 9800;
    document.getElementById('input_daysToMaturity').value = 91;
    document.getElementById('input_calculationType').value = 'both';
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
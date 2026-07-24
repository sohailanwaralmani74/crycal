/* ═══════════════════════════════════════════════════════════
   Wanjaaro — ROI Calculator (Pure, Simple)
   Tool ID: roi-calculator
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      initialInvestment: parseFloat(document.getElementById('input_initialInvestment').value) || 0,
      finalValue: parseFloat(document.getElementById('input_finalValue').value) || 0,
      holdingPeriod: parseFloat(document.getElementById('input_holdingPeriod').value) || 0
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Format Percentage ──
  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  // ── Calculate ROI ──
  function calculateROI(inputs) {
    var initial = inputs.initialInvestment;
    var final = inputs.finalValue;
    var years = inputs.holdingPeriod;

    // Total ROI
    var totalROI = 0;
    if (initial > 0) {
      totalROI = ((final - initial) / initial) * 100;
    }

    // Annualized ROI (CAGR)
    var annualizedROI = 0;
    if (initial > 0 && years > 0 && final > 0) {
      annualizedROI = (Math.pow(final / initial, 1 / years) - 1) * 100;
    }

    // Net Profit
    var netProfit = final - initial;

    // ── Generate year data for chart ──
    var yearData = [];
    if (years > 0 && initial > 0 && final > 0) {
      var steps = Math.max(30, Math.ceil(years * 12));
      var stepSize = years / steps;
      var growthFactor = Math.pow(final / initial, 1 / years);

      for (var i = 0; i <= steps; i++) {
        var t = i * stepSize;
        var balance = initial * Math.pow(growthFactor, t);
        yearData.push({
          year: t,
          balance: balance
        });
      }
    }

    return {
      totalROI: totalROI,
      annualizedROI: annualizedROI,
      netProfit: netProfit,
      finalValue: final,
      yearData: yearData
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateROI(inputs);

    document.getElementById('output_totalROI').querySelector('.output-number').textContent = formatPercentage(result.totalROI);
    document.getElementById('output_annualizedROI').querySelector('.output-number').textContent = formatPercentage(result.annualizedROI);
    document.getElementById('output_netProfit').querySelector('.output-number').textContent = formatCurrency(result.netProfit);
    document.getElementById('output_finalValueDisplay').querySelector('.output-number').textContent = formatCurrency(result.finalValue);

    // ── Charts ──
    updateCharts({
      yearData: result.yearData,
      initialValue: inputs.initialInvestment,
      finalValue: result.finalValue,
      totalROI: result.totalROI,
      annualizedROI: result.annualizedROI
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        initialInvestment: inputs.initialInvestment,
        finalValue: inputs.finalValue,
        holdingPeriod: inputs.holdingPeriod,
        totalROI: result.totalROI,
        annualizedROI: result.annualizedROI
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');
    var yearData = data.yearData;

    if (tab === 'growth') {
      if (!yearData || yearData.length === 0) {
        return {
          type: 'line',
          data: {
            labels: ['0'],
            datasets: [
              {
                label: 'Investment Value',
                data: [data.initialValue],
                borderColor: '#C08A2E',
                pointBackgroundColor: '#C08A2E'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Investment Growth', font: { size: 14 } }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Value (' + currencySymbol + ')' },
                ticks: {
                  callback: function(v) { return currencySymbol + v.toFixed(0); }
                }
              },
              x: {
                title: { display: true, text: 'Years' }
              }
            }
          }
        };
      }

      var labels = yearData.map(function(d) { return d.year.toFixed(1); });
      var balanceData = yearData.map(function(d) { return d.balance; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Investment Value',
              data: balanceData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Investment Growth Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Value (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Years' }
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
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_initialInvestment').value = 10000;
    document.getElementById('input_finalValue').value = 15000;
    document.getElementById('input_holdingPeriod').value = 5;
    if (typeof window.updateTool === 'function') window.updateTool();
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
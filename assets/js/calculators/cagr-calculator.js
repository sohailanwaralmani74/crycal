/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Compound Annual Growth Rate Calculator
   Tool ID: cagr-calculator
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      initialValue: parseFloat(document.getElementById('input_initialValue').value) || 0,
      finalValue: parseFloat(document.getElementById('input_finalValue').value) || 0,
      years: parseFloat(document.getElementById('input_years').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'annually'
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'daily': 365,
      'monthly': 12,
      'quarterly': 4,
      'semi-annually': 2,
      'annually': 1
    };
    return map[frequency] || 1;
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

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var initial = inputs.initialValue;
    var final = inputs.finalValue;
    var years = inputs.years;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    // ── CAGR ──
    var cagr = 0;
    if (initial > 0 && final > 0 && years > 0) {
      cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
    }

    // ── Total Return ──
    var totalReturn = 0;
    if (initial > 0) {
      totalReturn = ((final - initial) / initial) * 100;
    }

    // ── Total Gain ──
    var totalGain = final - initial;

    // ── Generate Year Data ──
    var yearData = [];
    if (years > 0 && initial > 0 && final > 0) {
      var steps = Math.max(30, Math.ceil(years * 12));
      var stepSize = years / steps;
      var monthlyRate = Math.pow(1 + cagr / 100 / n, n / 12) - 1;

      for (var i = 0; i <= steps; i++) {
        var t = i * stepSize;
        var balance = initial * Math.pow(1 + monthlyRate, i);
        yearData.push({
          year: t,
          balance: balance
        });
      }
    }

    // ── Update Outputs ──
    document.getElementById('output_cagr').querySelector('.output-number').textContent = formatPercentage(cagr);
    document.getElementById('output_totalReturn').querySelector('.output-number').textContent = formatPercentage(totalReturn);
    document.getElementById('output_totalGain').querySelector('.output-number').textContent = formatCurrency(totalGain);
    document.getElementById('output_finalValueDisplay').querySelector('.output-number').textContent = formatCurrency(final);

    // ── Charts ──
    updateCharts({
      yearData: yearData,
      initialValue: initial,
      finalValue: final,
      cagr: cagr,
      totalReturn: totalReturn,
      totalGain: totalGain
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        initialValue: initial,
        finalValue: final,
        years: years,
        cagr: cagr,
        totalReturn: totalReturn
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
    document.getElementById('input_initialValue').value = 10000;
    document.getElementById('input_finalValue').value = 18000;
    document.getElementById('input_years').value = 5;
    document.getElementById('input_compoundingFrequency').value = 'annually';
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
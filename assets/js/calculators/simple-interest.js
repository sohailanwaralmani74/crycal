/* ═══════════════════════════════════════════════════════════
   CRYCAL — Simple Interest Calculator
   Tool ID: simple-interest
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      principal: parseFloat(document.getElementById('input_principal').value) || 0,
      annualRate: parseFloat(document.getElementById('input_annualRate').value) || 0,
      timeYears: parseFloat(document.getElementById('input_timeYears').value) || 0
    };
  }

  // ── Calculate Simple Interest ──
  function calculateSimpleInterest(inputs) {
    var P = inputs.principal;
    var r = inputs.annualRate / 100;
    var t = inputs.timeYears;

    var totalInterest = P * r * t;
    var finalAmount = P + totalInterest;

    // Year-by-year data for charts
    var yearData = [];
    for (var year = 0; year <= t; year += 0.5) {
      var interest = P * r * year;
      var total = P + interest;
      yearData.push({
        year: year,
        total: total,
        interest: interest,
        principal: P
      });
    }

    return {
      totalInterest: totalInterest,
      finalAmount: finalAmount,
      yearData: yearData,
      P: P,
      r: r,
      t: t
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
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

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateSimpleInterest(inputs);

    // Update outputs
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_finalAmount').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalAmount);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        principal: inputs.principal,
        annualRate: inputs.annualRate,
        timeYears: inputs.timeYears
      };
      window.logHistory(inputSnapshot);
    }

    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Chart Rendering ──
  function updateCharts(result, inputs) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');
    var yearData = result.yearData;

    if (tab === 'growth') {
      var labels = yearData.map(function(d) { return d.year; });
      var totalData = yearData.map(function(d) { return d.total; });
      var interestData = yearData.map(function(d) { return d.interest; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Amount',
              data: totalData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.1,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Interest Earned',
              data: interestData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.1,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Growth Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Years' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var final = yearData[yearData.length - 1];
      var principal = inputs.principal;
      var interest = final.interest;

      return {
        type: 'doughnut',
        data: {
          labels: ['Initial Principal', 'Interest Earned'],
          datasets: [{
            data: [principal, interest],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Final Amount', font: { size: 14 } }
          },
          cutout: '60%'
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) {
        el.value = defaultVal;
      } else if (el.type !== 'select-one') {
        el.value = '';
      }
    });
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') {
        el.value = defaultVal;
      }
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') {
        window.updateTool();
      }
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') {
          window.updateTool();
        }
      });
    }
  });

})();
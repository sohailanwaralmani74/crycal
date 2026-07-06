/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Insurance Deductible Break-Even Calculator
   Tool ID: insurance-deductible-breakeven
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      highDeductible: parseFloat(document.getElementById('input_highDeductible').value) || 0,
      lowDeductible: parseFloat(document.getElementById('input_lowDeductible').value) || 0,
      highPremium: parseFloat(document.getElementById('input_highPremium').value) || 0,
      lowPremium: parseFloat(document.getElementById('input_lowPremium').value) || 0,
      policyTerm: parseFloat(document.getElementById('input_policyTerm').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'monthly'
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

  // ── Format Months ──
  function formatMonths(months) {
    if (months === Infinity || !isFinite(months) || months < 0) return '∞';
    var y = Math.floor(months / 12);
    var m = Math.round(months % 12);
    if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    var deductibleDifference = inputs.highDeductible - inputs.lowDeductible;
    var monthlyPremiumSavings = inputs.lowPremium - inputs.highPremium;
    var annualPremiumSavings = monthlyPremiumSavings * 12;

    var breakEvenMonths = monthlyPremiumSavings > 0 ? deductibleDifference / monthlyPremiumSavings : Infinity;

    var totalSavingsAtTerm = (annualPremiumSavings * inputs.policyTerm) - deductibleDifference;

    document.getElementById('output_deductibleDifference').querySelector('.output-number').textContent = formatCurrency(deductibleDifference);
    document.getElementById('output_monthlyPremiumSavings').querySelector('.output-number').textContent = formatCurrency(monthlyPremiumSavings);
    document.getElementById('output_annualPremiumSavings').querySelector('.output-number').textContent = formatCurrency(annualPremiumSavings);
    document.getElementById('output_breakEvenMonths').querySelector('.output-number').textContent = formatMonths(breakEvenMonths);
    document.getElementById('output_totalSavingsAtTerm').querySelector('.output-number').textContent = formatCurrency(totalSavingsAtTerm);

    updateCharts({
      highDeductible: inputs.highDeductible,
      lowDeductible: inputs.lowDeductible,
      highPremium: inputs.highPremium,
      lowPremium: inputs.lowPremium,
      monthlyPremiumSavings: monthlyPremiumSavings,
      annualPremiumSavings: annualPremiumSavings,
      deductibleDifference: deductibleDifference,
      totalSavingsAtTerm: totalSavingsAtTerm,
      breakEvenMonths: breakEvenMonths
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        highDeductible: inputs.highDeductible,
        lowDeductible: inputs.lowDeductible,
        monthlyPremiumSavings: monthlyPremiumSavings,
        breakEvenMonths: breakEvenMonths
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['High Deductible', 'Low Deductible', 'Monthly Savings'],
          datasets: [{
            label: 'Amount',
            data: [data.highDeductible, data.lowDeductible, data.monthlyPremiumSavings],
            backgroundColor: ['#B23A3A', '#2F6F5E', '#C08A2E'],
            borderColor: ['#8a2a2a', '#1f4f42', '#A87520'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Deductible & Savings Comparison', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            }
          }
        }
      };
    }

    if (tab === 'timeline') {
      return {
        type: 'bar',
        data: {
          labels: ['Annual Savings', 'Total Savings at Term'],
          datasets: [{
            label: 'Amount',
            data: [data.annualPremiumSavings, data.totalSavingsAtTerm],
            backgroundColor: ['#4A90D9', '#2F6F5E'],
            borderColor: ['#3a7b8c', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Premium Savings Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
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
    document.getElementById('input_highDeductible').value = 2000;
    document.getElementById('input_lowDeductible').value = 500;
    document.getElementById('input_highPremium').value = 300;
    document.getElementById('input_lowPremium').value = 450;
    document.getElementById('input_policyTerm').value = 5;
    document.getElementById('input_compoundingFrequency').value = 'monthly';
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
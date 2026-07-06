/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Home / Renters Insurance Calculator
   Tool ID: home-renters-insurance
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      propertyValue: parseFloat(document.getElementById('input_propertyValue').value) || 0,
      personalPropertyPercent: parseFloat(document.getElementById('input_personalPropertyPercent').value) || 0,
      liabilityCoverage: parseFloat(document.getElementById('input_liabilityCoverage').value) || 0,
      medicalPayments: parseFloat(document.getElementById('input_medicalPayments').value) || 0,
      deductible: parseFloat(document.getElementById('input_deductible').value) || 0,
      additionalLivingExpenses: parseFloat(document.getElementById('input_additionalLivingExpenses').value) || 0,
      personalPropertyDeductible: parseFloat(document.getElementById('input_personalPropertyDeductible').value) || 0
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

  // ── Format Currency Short ──
  function formatCurrencyShort(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(0);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Dwelling Coverage ──
    var dwellingCoverage = inputs.propertyValue;

    // ── Personal Property ──
    var personalProperty = dwellingCoverage * (inputs.personalPropertyPercent / 100);

    // ── Additional Living Expenses ──
    var livingExpenses = (dwellingCoverage * 0.002) * inputs.additionalLivingExpenses;

    // ── Total Coverage ──
    var totalCoverage = dwellingCoverage + personalProperty + inputs.liabilityCoverage + inputs.medicalPayments + livingExpenses;

    // ── Estimated Monthly Premium ──
    // Simple model: dwelling rate + personal property rate + liability rate + medical payments - deductible discount
    var basePremium = (dwellingCoverage * 0.0035) + (personalProperty * 0.004) + (inputs.liabilityCoverage * 0.0005) + (inputs.medicalPayments * 0.01) + (livingExpenses * 0.003);

    // Deductible discount: higher deductible = lower premium
    var deductibleDiscount = Math.min(inputs.deductible * 0.01, basePremium * 0.3);
    var estimatedPremium = Math.max(0, basePremium - deductibleDiscount);

    // ── Update Outputs ──
    document.getElementById('output_dwellingCoverage').querySelector('.output-number').textContent = formatCurrency(dwellingCoverage);
    document.getElementById('output_personalPropertyCoverage').querySelector('.output-number').textContent = formatCurrency(personalProperty);
    document.getElementById('output_totalCoverage').querySelector('.output-number').textContent = formatCurrency(totalCoverage);
    document.getElementById('output_liabilityCoverageDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.liabilityCoverage);
    document.getElementById('output_medicalPaymentsDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.medicalPayments);
    document.getElementById('output_recommendedMonthlyPremium').querySelector('.output-number').textContent = formatCurrency(estimatedPremium) + ' / month';

    // ── Charts ──
    updateCharts({
      dwellingCoverage: dwellingCoverage,
      personalProperty: personalProperty,
      liabilityCoverage: inputs.liabilityCoverage,
      medicalPayments: inputs.medicalPayments,
      livingExpenses: livingExpenses,
      estimatedPremium: estimatedPremium,
      totalCoverage: totalCoverage
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        propertyValue: inputs.propertyValue,
        totalCoverage: totalCoverage,
        recommendedMonthlyPremium: estimatedPremium
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

    if (tab === 'breakdown') {
      var categories = [
        { label: 'Dwelling', value: data.dwellingCoverage, color: '#C08A2E' },
        { label: 'Personal Property', value: data.personalProperty, color: '#2F6F5E' },
        { label: 'Liability', value: data.liabilityCoverage, color: '#4A90D9' },
        { label: 'Medical Payments', value: data.medicalPayments, color: '#8E44AD' },
        { label: 'Living Expenses', value: data.livingExpenses, color: '#F39C12' }
      ];

      var filtered = categories.filter(function(c) { return c.value > 0; });

      if (filtered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No coverage'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No coverage data', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'doughnut',
        data: {
          labels: filtered.map(function(f) { return f.label; }),
          datasets: [{
            data: filtered.map(function(f) { return f.value; }),
            backgroundColor: filtered.map(function(f) { return f.color; }),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Coverage Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toFixed(2) + ' (' + pct + '%)';
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Dwelling', 'Personal Property', 'Liability', 'Medical'],
          datasets: [{
            label: 'Coverage Amount',
            data: [data.dwellingCoverage, data.personalProperty, data.liabilityCoverage, data.medicalPayments],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#4A90D9', '#8E44AD'],
            borderColor: ['#A87520', '#1f4f42', '#3a7b8c', '#6c3483'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Coverage Comparison', font: { size: 14 } }
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
    document.getElementById('input_propertyValue').value = 350000;
    document.getElementById('input_personalPropertyPercent').value = 50.0;
    document.getElementById('input_liabilityCoverage').value = 300000;
    document.getElementById('input_medicalPayments').value = 5000;
    document.getElementById('input_deductible').value = 1000;
    document.getElementById('input_additionalLivingExpenses').value = 12;
    document.getElementById('input_personalPropertyDeductible').value = 0;
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
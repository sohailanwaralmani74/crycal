/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Umbrella Insurance Calculator
   Tool ID: umbrella-insurance
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      netWorth: parseFloat(document.getElementById('input_netWorth').value) || 0,
      annualIncome: parseFloat(document.getElementById('input_annualIncome').value) || 0,
      homeLiability: parseFloat(document.getElementById('input_homeLiability').value) || 0,
      autoLiability: parseFloat(document.getElementById('input_autoLiability').value) || 0,
      numberProperties: parseFloat(document.getElementById('input_numberProperties').value) || 0,
      numberVehicles: parseFloat(document.getElementById('input_numberVehicles').value) || 0,
      umbrellaDeductible: parseFloat(document.getElementById('input_umbrellaDeductible').value) || 0,
      riskFactors: document.getElementById('input_riskFactors').value || 'moderate'
    };
  }

  // ── Get Risk Multiplier ──
  function getRiskMultiplier(risk) {
    var map = {
      'low': 1.0,
      'moderate': 1.2,
      'high': 1.5
    };
    return map[risk] || 1.2;
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
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

  // ── Format Currency Short ──
  function formatCurrencyShort(amount) {
    var code = getGlobalCurrency() || 'USD';
    var formatted = formatCurrency(amount);
    return formatted;
  }

  // ── Round Up to Nearest 100,000 ──
  function roundUpToNearest(amount, nearest) {
    return Math.ceil(amount / nearest) * nearest;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var riskMultiplier = getRiskMultiplier(inputs.riskFactors);

    // ── Assets at Risk ──
    // Future income present value (simplified: 5x income)
    var futureIncomeValue = inputs.annualIncome * 5;
    var propertyRisk = inputs.numberProperties * 50000;
    var vehicleRisk = inputs.numberVehicles * 10000;
    var assetsAtRisk = inputs.netWorth + futureIncomeValue + propertyRisk + vehicleRisk;

    // ── Existing Liability Coverage ──
    var existingLiability = inputs.homeLiability + inputs.autoLiability;

    // ── Protection Gap ──
    var protectionGap = assetsAtRisk - existingLiability;
    if (protectionGap < 0) protectionGap = 0;

    // ── Recommended Coverage ──
    var recommendedCoverage = roundUpToNearest(Math.max(protectionGap * riskMultiplier, 100000), 100000);

    // ── Minimum recommended coverage ──
    if (recommendedCoverage < 100000) recommendedCoverage = 100000;

    // ── Estimated Premium ──
    // $200 per $1M coverage, adjusted by risk multiplier
    var basePremium = (recommendedCoverage / 1000000) * 200;
    var estimatedPremium = basePremium * riskMultiplier;
    if (estimatedPremium < 50) estimatedPremium = 50;

    // ── Update Outputs ──
    document.getElementById('output_existingLiability').querySelector('.output-number').textContent = formatCurrency(existingLiability);
    document.getElementById('output_assetsAtRisk').querySelector('.output-number').textContent = formatCurrency(assetsAtRisk);
    document.getElementById('output_recommendedCoverage').querySelector('.output-number').textContent = formatCurrency(recommendedCoverage);
    document.getElementById('output_protectionGap').querySelector('.output-number').textContent = formatCurrency(protectionGap);
    document.getElementById('output_estimatedPremium').querySelector('.output-number').textContent = formatCurrency(estimatedPremium) + ' / year';

    // ── Charts ──
    updateCharts({
      existingLiability: existingLiability,
      assetsAtRisk: assetsAtRisk,
      recommendedCoverage: recommendedCoverage,
      protectionGap: protectionGap,
      netWorth: inputs.netWorth,
      futureIncome: futureIncomeValue,
      propertyRisk: propertyRisk,
      vehicleRisk: vehicleRisk
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        netWorth: inputs.netWorth,
        annualIncome: inputs.annualIncome,
        recommendedCoverage: recommendedCoverage,
        estimatedPremium: estimatedPremium
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
          labels: ['Assets at Risk', 'Existing Liability', 'Protection Gap'],
          datasets: [{
            label: 'Amount',
            data: [data.assetsAtRisk, data.existingLiability, data.protectionGap],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#B23A3A'],
            borderColor: ['#A87520', '#1f4f42', '#8a2a2a'],
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

    if (tab === 'breakdown') {
      var categories = [
        { label: 'Net Worth', value: data.netWorth, color: '#C08A2E' },
        { label: 'Future Income', value: data.futureIncome, color: '#2F6F5E' },
        { label: 'Properties', value: data.propertyRisk, color: '#4A90D9' },
        { label: 'Vehicles', value: data.vehicleRisk, color: '#8E44AD' }
      ];

      var filtered = categories.filter(function(c) { return c.value > 0; });

      if (filtered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No data'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No data to display', font: { size: 14 } }
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
            title: { display: true, text: 'Assets at Risk Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toFixed(0) + ' (' + pct + '%)';
                }
              }
            }
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
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_netWorth').value = 500000;
    document.getElementById('input_annualIncome').value = 100000;
    document.getElementById('input_homeLiability').value = 300000;
    document.getElementById('input_autoLiability').value = 300000;
    document.getElementById('input_numberProperties').value = 1;
    document.getElementById('input_numberVehicles').value = 2;
    document.getElementById('input_umbrellaDeductible').value = 0;
    document.getElementById('input_riskFactors').value = 'moderate';
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
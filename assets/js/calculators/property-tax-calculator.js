/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Property Tax Calculator
   Tool ID: property-tax-calculator
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'annual';

  // ── Get Inputs ──
  function getInputs() {
    return {
      propertyValue: parseFloat(document.getElementById('input_propertyValue').value) || 0,
      assessmentRatio: parseFloat(document.getElementById('input_assessmentRatio').value) || 100,
      taxRate: parseFloat(document.getElementById('input_taxRate').value) || 0,
      exemptions: parseFloat(document.getElementById('input_exemptions').value) || 0,
      timeYears: parseFloat(document.getElementById('input_timeYears').value) || 0,
      annualAppreciation: parseFloat(document.getElementById('input_annualAppreciation').value) || 0
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

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Calculations ──
    var assessedValue = inputs.propertyValue * (inputs.assessmentRatio / 100);
    var taxableValue = Math.max(0, assessedValue - inputs.exemptions);
    var annualTax = taxableValue * (inputs.taxRate / 100);
    var monthlyTax = annualTax / 12;
    var effectiveTaxRate = inputs.propertyValue > 0 ? (annualTax / inputs.propertyValue) * 100 : 0;

    // ── Year Data ──
    var yearData = [];
    if (inputs.timeYears > 0) {
      for (var year = 0; year <= inputs.timeYears; year++) {
        var value = inputs.propertyValue * Math.pow(1 + inputs.annualAppreciation / 100, year);
        var assessed = value * (inputs.assessmentRatio / 100);
        var taxable = Math.max(0, assessed - inputs.exemptions);
        var tax = taxable * (inputs.taxRate / 100);
        yearData.push({
          year: year,
          propertyValue: value,
          assessedValue: assessed,
          taxableValue: taxable,
          annualTax: tax
        });
      }
    }

    // ── Outputs ──
    document.getElementById('output_assessedValue').querySelector('.output-number').textContent = formatCurrency(assessedValue);
    document.getElementById('output_taxableValue').querySelector('.output-number').textContent = formatCurrency(taxableValue);
    document.getElementById('output_annualTax').querySelector('.output-number').textContent = formatCurrency(annualTax);
    document.getElementById('output_monthlyTax').querySelector('.output-number').textContent = formatCurrency(monthlyTax);
    document.getElementById('output_effectiveTaxRate').querySelector('.output-number').textContent = formatPercentage(effectiveTaxRate);

    // ── Charts ──
    updateCharts({
      yearData: yearData,
      inputs: inputs,
      annualTax: annualTax,
      monthlyTax: monthlyTax,
      assessedValue: assessedValue,
      taxableValue: taxableValue,
      effectiveTaxRate: effectiveTaxRate
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        propertyValue: inputs.propertyValue,
        taxRate: inputs.taxRate,
        annualTax: annualTax,
        effectiveTaxRate: effectiveTaxRate
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

    if (tab === 'annual') {
      if (!yearData || yearData.length === 0) {
        return {
          type: 'line',
          data: {
            labels: ['0'],
            datasets: [
              {
                label: 'Annual Property Tax',
                data: [0],
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
              title: { display: true, text: 'Enter years to see tax projection', font: { size: 14 } }
            }
          }
        };
      }

      var labels = yearData.map(function(d) { return d.year; });
      var taxData = yearData.map(function(d) { return d.annualTax; });
      var valueData = yearData.map(function(d) { return d.propertyValue; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Annual Property Tax',
              data: taxData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#B23A3A'
            },
            {
              label: 'Property Value',
              data: valueData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
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
            title: { display: true, text: 'Property Tax Projection Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Year' }
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
    document.getElementById('input_assessmentRatio').value = 100.0;
    document.getElementById('input_taxRate').value = 1.2;
    document.getElementById('input_exemptions').value = 0;
    document.getElementById('input_timeYears').value = 5;
    document.getElementById('input_annualAppreciation').value = 2.0;
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
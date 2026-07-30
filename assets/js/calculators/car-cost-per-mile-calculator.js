(function() {
  var chartInstance = null;
  var currentTab = 'costBreakdown';

  function getInputs() {
    return {
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 1,
      annualFuelCost: parseFloat(document.getElementById('input_annualFuelCost').value) || 0,
      annualInsurance: parseFloat(document.getElementById('input_annualInsurance').value) || 0,
      annualMaintenance: parseFloat(document.getElementById('input_annualMaintenance').value) || 0,
      annualDepreciation: parseFloat(document.getElementById('input_annualDepreciation').value) || 0,
      annualLoanInterest: parseFloat(document.getElementById('input_annualLoanInterest').value) || 0,
      annualTollsParking: parseFloat(document.getElementById('input_annualTollsParking').value) || 0
    }
  }

  function formatCurrency(amount) {
    try {
      var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + Math.round(amount);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateResults(inputs) {
    var miles = Math.max(1, inputs.annualMiles);

    var variableAnnual = inputs.annualFuelCost + inputs.annualMaintenance + inputs.annualTollsParking;
    var fixedAnnual = inputs.annualInsurance + inputs.annualDepreciation + inputs.annualLoanInterest;
    var totalAnnualCost = variableAnnual + fixedAnnual;

    var totalCostPerMile = totalAnnualCost / miles;
    var variableCostPerMile = variableAnnual / miles;
    var fixedCostPerMile = fixedAnnual / miles;
    var tripCost100Miles = totalCostPerMile * 100;

    return {
      totalCostPerMile: totalCostPerMile,
      variableCostPerMile: variableCostPerMile,
      fixedCostPerMile: fixedCostPerMile,
      totalAnnualCost: totalAnnualCost,
      tripCost100Miles: tripCost100Miles,
      variableAnnual: variableAnnual,
      fixedAnnual: fixedAnnual
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_totalCostPerMile', '$' + result.totalCostPerMile.toFixed(3));
    setOutputText('output_variableCostPerMile', '$' + result.variableCostPerMile.toFixed(3));
    setOutputText('output_fixedCostPerMile', '$' + result.fixedCostPerMile.toFixed(3));
    setOutputText('output_totalAnnualCost', formatCurrency(result.totalAnnualCost));
    setOutputText('output_tripCost100Miles', formatCurrency(result.tripCost100Miles));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualMiles: inputs.annualMiles,
        totalAnnualCost: Math.round(result.totalAnnualCost),
        totalCostPerMile: '$' + result.totalCostPerMile.toFixed(3),
        variableCostPerMile: '$' + result.variableCostPerMile.toFixed(3),
        fixedCostPerMile: '$' + result.fixedCostPerMile.toFixed(3)
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var miles = Math.max(1, inputs.annualMiles);

    if (tab === 'costBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Fuel', 'Depreciation', 'Insurance', 'Maintenance', 'Loan Interest', 'Tolls/Parking'],
          datasets: [{
            label: 'Cost Per Mile ',
            data: [
              +(inputs.annualFuelCost / miles).toFixed(3),
              +(inputs.annualDepreciation / miles).toFixed(3),
              +(inputs.annualInsurance / miles).toFixed(3),
              +(inputs.annualMaintenance / miles).toFixed(3),
              +(inputs.annualLoanInterest / miles).toFixed(3),
              +(inputs.annualTollsParking / miles).toFixed(3)
            ],
            backgroundColor: ['#3b82f6', '#e11d48', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Operating Cost Per Mile Categories ($/mi)', font: { size: 14 }, color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            }
          }
        }
      }
    } else if (tab === 'fixedVsVariable') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Variable Expenses (Fuel, Upkeep, Tolls)', 'Fixed Overhead (Insurance, Loans, Depreciation)'],
          datasets: [{
            data: [
              Math.round(result.variableAnnual),
              Math.round(result.fixedAnnual)
            ],
            backgroundColor: ['#3b82f6', '#e11d48'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 11 } } },
            title: { display: true, text: 'Fixed Overhead vs Variable Expense Share', font: { size: 14 }, color: '#e8edf0' }
          }
        }
      }
    }
    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    var _el_input_annualMiles = document.getElementById('input_annualMiles');
    _el_input_annualMiles.value = (_el_input_annualMiles.dataset && _el_input_annualMiles.dataset.default !== undefined) ? _el_input_annualMiles.dataset.default : (_el_input_annualMiles.getAttribute('value') || '');
    var _el_input_annualFuelCost = document.getElementById('input_annualFuelCost');
    _el_input_annualFuelCost.value = (_el_input_annualFuelCost.dataset && _el_input_annualFuelCost.dataset.default !== undefined) ? _el_input_annualFuelCost.dataset.default : (_el_input_annualFuelCost.getAttribute('value') || '');
    var _el_input_annualInsurance = document.getElementById('input_annualInsurance');
    _el_input_annualInsurance.value = (_el_input_annualInsurance.dataset && _el_input_annualInsurance.dataset.default !== undefined) ? _el_input_annualInsurance.dataset.default : (_el_input_annualInsurance.getAttribute('value') || '');
    var _el_input_annualMaintenance = document.getElementById('input_annualMaintenance');
    _el_input_annualMaintenance.value = (_el_input_annualMaintenance.dataset && _el_input_annualMaintenance.dataset.default !== undefined) ? _el_input_annualMaintenance.dataset.default : (_el_input_annualMaintenance.getAttribute('value') || '');
    var _el_input_annualDepreciation = document.getElementById('input_annualDepreciation');
    _el_input_annualDepreciation.value = (_el_input_annualDepreciation.dataset && _el_input_annualDepreciation.dataset.default !== undefined) ? _el_input_annualDepreciation.dataset.default : (_el_input_annualDepreciation.getAttribute('value') || '');
    var _el_input_annualLoanInterest = document.getElementById('input_annualLoanInterest');
    _el_input_annualLoanInterest.value = (_el_input_annualLoanInterest.dataset && _el_input_annualLoanInterest.dataset.default !== undefined) ? _el_input_annualLoanInterest.dataset.default : (_el_input_annualLoanInterest.getAttribute('value') || '');
    var _el_input_annualTollsParking = document.getElementById('input_annualTollsParking');
    _el_input_annualTollsParking.value = (_el_input_annualTollsParking.dataset && _el_input_annualTollsParking.dataset.default !== undefined) ? _el_input_annualTollsParking.dataset.default : (_el_input_annualTollsParking.getAttribute('value') || '');
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    
    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });
})();

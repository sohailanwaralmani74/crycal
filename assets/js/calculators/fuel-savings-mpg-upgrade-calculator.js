(function() {
  var chartInstance = null;
  var currentTab = 'spendingComparison';

  function getInputs() {
    return {
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 0,
      currentMpg: parseFloat(document.getElementById('input_currentMpg').value) || 1,
      newMpg: parseFloat(document.getElementById('input_newMpg').value) || 1,
      gasPrice: parseFloat(document.getElementById('input_gasPrice').value) || 0
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
    var miles = inputs.annualMiles;
    var curMpg = Math.max(1, inputs.currentMpg);
    var newMpg = Math.max(1, inputs.newMpg);
    var price = inputs.gasPrice;

    var currentGallons = miles / curMpg;
    var newGallons = miles / newMpg;

    var currentAnnualCost = currentGallons * price;
    var newAnnualCost = newGallons * price;

    var annualGallonsSaved = Math.max(0, currentGallons - newGallons);
    var annualDollarSavings = Math.max(0, currentAnnualCost - newAnnualCost);
    var fiveYearDollarSavings = annualDollarSavings * 5;

    return {
      currentAnnualCost: currentAnnualCost,
      newAnnualCost: newAnnualCost,
      annualDollarSavings: annualDollarSavings,
      annualGallonsSaved: annualGallonsSaved,
      fiveYearDollarSavings: fiveYearDollarSavings
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_currentAnnualCost', formatCurrency(result.currentAnnualCost));
    setOutputText('output_newAnnualCost', formatCurrency(result.newAnnualCost));
    setOutputText('output_annualDollarSavings', formatCurrency(result.annualDollarSavings));
    setOutputText('output_annualGallonsSaved', Math.round(result.annualGallonsSaved) + ' gal');
    setOutputText('output_fiveYearDollarSavings', formatCurrency(result.fiveYearDollarSavings));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentMpg: inputs.currentMpg,
        newMpg: inputs.newMpg,
        annualDollarSavings: Math.round(result.annualDollarSavings),
        annualGallonsSaved: Math.round(result.annualGallonsSaved),
        fiveYearDollarSavings: Math.round(result.fiveYearDollarSavings)
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
    if (tab === 'spendingComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Current Vehicle (' + inputs.currentMpg + ' MPG)', 'Upgraded Vehicle (' + inputs.newMpg + ' MPG)'],
          datasets: [{
            label: 'Annual Fuel Spending ',
            data: [
              Math.round(result.currentAnnualCost),
              Math.round(result.newAnnualCost)
            ],
            backgroundColor: ['#e11d48', '#10b981'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Fuel Spending: Current vs Upgraded MPG ', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'gallonsSaved') {
      var annualGallons = result.annualGallonsSaved;
      return {
        type: 'bar',
        data: {
          labels: ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years'],
          datasets: [{
            label: 'Cumulative Gallons Saved',
            data: [
              Math.round(annualGallons * 1),
              Math.round(annualGallons * 2),
              Math.round(annualGallons * 3),
              Math.round(annualGallons * 4),
              Math.round(annualGallons * 5)
            ],
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cumulative Fuel Saved Over 5 Years (Gallons)', font: { size: 14 }, color: '#e8edf0' }
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
    var _el_input_currentMpg = document.getElementById('input_currentMpg');
    _el_input_currentMpg.value = (_el_input_currentMpg.dataset && _el_input_currentMpg.dataset.default !== undefined) ? _el_input_currentMpg.dataset.default : (_el_input_currentMpg.getAttribute('value') || '');
    var _el_input_newMpg = document.getElementById('input_newMpg');
    _el_input_newMpg.value = (_el_input_newMpg.dataset && _el_input_newMpg.dataset.default !== undefined) ? _el_input_newMpg.dataset.default : (_el_input_newMpg.getAttribute('value') || '');
    var _el_input_gasPrice = document.getElementById('input_gasPrice');
    _el_input_gasPrice.value = (_el_input_gasPrice.dataset && _el_input_gasPrice.dataset.default !== undefined) ? _el_input_gasPrice.dataset.default : (_el_input_gasPrice.getAttribute('value') || '');
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

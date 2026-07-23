(function() {
  var chartInstance = null;
  var currentTab = 'fillUpBreakdown';

  var GRADE_PREMIUMS = {
    'regular': 0.00,
    'midgrade': 0.35,
    'premium': 0.70,
    'diesel': 0.45
  };

  function getInputs() {
    return {
      tankCapacity: parseFloat(document.getElementById('input_tankCapacity').value) || 16,
      currentFuelLevel: parseFloat(document.getElementById('input_currentFuelLevel').value) || 25,
      gasPrice: parseFloat(document.getElementById('input_gasPrice').value) || 0,
      fuelGrade: document.getElementById('input_fuelGrade').value || 'regular'
    };
  }

  function formatCurrency(amount) {
    try {
      var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
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
    var cap = inputs.tankCapacity;
    var pct = inputs.currentFuelLevel / 100;
    var gradePremium = GRADE_PREMIUMS[inputs.fuelGrade] || 0.00;
    var effectivePrice = inputs.gasPrice + gradePremium;

    var gallonsNeeded = cap * (1 - pct);
    var totalFillCost = gallonsNeeded * effectivePrice;
    var fullTankCost = cap * effectivePrice;
    // Assuming baseline 25 MPG
    var estimatedRangeAdded = gallonsNeeded * 25;

    return {
      gallonsNeeded: gallonsNeeded,
      totalFillCost: totalFillCost,
      fullTankCost: fullTankCost,
      estimatedRangeAdded: estimatedRangeAdded,
      effectivePrice: effectivePrice
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_gallonsNeeded', result.gallonsNeeded.toFixed(1) + ' gal');
    setOutputText('output_totalFillCost', formatCurrency(result.totalFillCost));
    setOutputText('output_fullTankCost', formatCurrency(result.fullTankCost));
    setOutputText('output_estimatedRangeAdded', '+' + Math.round(result.estimatedRangeAdded) + ' miles');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        tankCapacity: inputs.tankCapacity,
        currentFuelLevel: inputs.currentFuelLevel + '%',
        gasPrice: '$' + result.effectivePrice.toFixed(2),
        gallonsNeeded: result.gallonsNeeded.toFixed(1),
        totalFillCost: '$' + result.totalFillCost.toFixed(2)
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
    var cap = inputs.tankCapacity;
    var price = result.effectivePrice;

    if (tab === 'fillUpBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['From Empty (100%)', 'From 1/4 Full (75%)', 'From 1/2 Full (50%)', 'From 3/4 Full (25%)'],
          datasets: [{
            label: 'Fill-Up Cost ',
            data: [
              +(cap * 1.00 * price).toFixed(2),
              +(cap * 0.75 * price).toFixed(2),
              +(cap * 0.50 * price).toFixed(2),
              +(cap * 0.25 * price).toFixed(2)
            ],
            backgroundColor: ['#e11d48', '#f59e0b', '#3b82f6', '#10b981'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Fill-Up Cost at Different Fuel Starting Levels ', font: { size: 14 }, color: '#e8edf0' }
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
      };
    } else if (tab === 'fuelGradeComparison') {
      var baseP = inputs.gasPrice;
      return {
        type: 'bar',
        data: {
          labels: ['Regular (87)', 'Midgrade (89)', 'Premium (91-93)', 'Diesel'],
          datasets: [{
            label: 'Full Tank Cost ',
            data: [
              +(cap * (baseP + 0.00)).toFixed(2),
              +(cap * (baseP + 0.35)).toFixed(2),
              +(cap * (baseP + 0.70)).toFixed(2),
              +(cap * (baseP + 0.45)).toFixed(2)
            ],
            backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Full Tank Cost Comparison by Octane Grade ', font: { size: 14 }, color: '#e8edf0' }
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
      };
    }
    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_tankCapacity').value = 16;
    document.getElementById('input_currentFuelLevel').value = 25;
    document.getElementById('input_gasPrice').value = 3.55;
    document.getElementById('input_fuelGrade').value = 'regular';
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

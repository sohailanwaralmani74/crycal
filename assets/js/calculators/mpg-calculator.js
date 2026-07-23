(function() {
  var chartInstance = null;
  var currentTab = 'efficiencyGauge';

  function getInputs() {
    return {
      startingOdometer: parseFloat(document.getElementById('input_startingOdometer').value) || 0,
      endingOdometer: parseFloat(document.getElementById('input_endingOdometer').value) || 0,
      gallonsPumped: parseFloat(document.getElementById('input_gallonsPumped').value) || 0.1,
      gasPrice: parseFloat(document.getElementById('input_gasPrice').value) || 0
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
    var distanceDriven = Math.max(0, inputs.endingOdometer - inputs.startingOdometer);
    var gallons = Math.max(0.01, inputs.gallonsPumped);

    var calculatedMpg = distanceDriven > 0 ? (distanceDriven / gallons) : 0;
    var costPerMile = calculatedMpg > 0 ? (inputs.gasPrice / calculatedMpg) : 0;
    var costPer100Miles = costPerMile * 100;

    return {
      calculatedMpg: calculatedMpg,
      distanceDriven: distanceDriven,
      costPerMile: costPerMile,
      costPer100Miles: costPer100Miles
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_calculatedMpg', result.calculatedMpg.toFixed(1) + ' MPG');
    setOutputText('output_distanceDriven', result.distanceDriven.toFixed(0) + ' miles');
    setOutputText('output_costPerMile', '$' + result.costPerMile.toFixed(3));
    setOutputText('output_costPer100Miles', formatCurrency(result.costPer100Miles));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        distanceDriven: result.distanceDriven.toFixed(0),
        gallonsPumped: inputs.gallonsPumped,
        calculatedMpg: result.calculatedMpg.toFixed(1),
        costPerMile: '$' + result.costPerMile.toFixed(3),
        costPer100Miles: '$' + result.costPer100Miles.toFixed(2)
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
    if (tab === 'efficiencyGauge') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Vehicle', 'Avg Truck (18)', 'Avg Sedan (28)', 'Hybrid (48)'],
          datasets: [{
            label: 'Miles Per Gallon (MPG)',
            data: [
              +result.calculatedMpg.toFixed(1),
              18,
              28,
              48
            ],
            backgroundColor: ['#10b981', '#e11d48', '#3b82f6', '#8b5cf6'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Fuel Economy Rating vs Benchmarks (MPG)', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'costBreakdown') {
      var cpm = result.costPerMile;
      return {
        type: 'bar',
        data: {
          labels: ['50 Miles', '100 Miles', '250 Miles', '500 Miles'],
          datasets: [{
            label: 'Total Fuel Spending ',
            data: [
              +(cpm * 50).toFixed(2),
              +(cpm * 100).toFixed(2),
              +(cpm * 250).toFixed(2),
              +(cpm * 500).toFixed(2)
            ],
            backgroundColor: '#f59e0b',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Estimated Fuel Expense by Distance ', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_startingOdometer').value = 45000;
    document.getElementById('input_endingOdometer').value = 45350;
    document.getElementById('input_gallonsPumped').value = 11.8;
    document.getElementById('input_gasPrice').value = 3.55;
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

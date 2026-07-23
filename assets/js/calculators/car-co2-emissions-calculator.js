(function() {
  var chartInstance = null;
  var currentTab = 'emissionsComparison';

  var FUEL_CO2_FACTORS = {
    'gasoline': 19.64,
    'diesel': 22.38,
    'e85': 13.90
  };

  function getInputs() {
    return {
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 0,
      mpg: parseFloat(document.getElementById('input_mpg').value) || 1,
      fuelType: document.getElementById('input_fuelType').value || 'gasoline'
    };
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
    var mpg = Math.max(1, inputs.mpg);
    var factor = FUEL_CO2_FACTORS[inputs.fuelType] || 19.64;

    var annualGallons = miles / mpg;
    var annualCo2Pounds = annualGallons * factor;
    // 1 metric ton = 2204.62 lbs
    var annualCo2Tons = annualCo2Pounds / 2204.62;

    // Grams per mile (1 lb = 453.592 grams)
    var co2PerMile = miles > 0 ? ((annualCo2Pounds * 453.592) / miles) : 0;
    // 1 mature tree absorbs ~48 lbs CO2/yr
    var treesNeededToOffset = Math.ceil(annualCo2Pounds / 48);

    return {
      annualCo2Tons: annualCo2Tons,
      annualCo2Pounds: annualCo2Pounds,
      co2PerMile: co2PerMile,
      treesNeededToOffset: treesNeededToOffset
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_annualCo2Tons', result.annualCo2Tons.toFixed(2) + ' Metric Tons');
    setOutputText('output_annualCo2Pounds', Math.round(result.annualCo2Pounds).toLocaleString() + ' lbs');
    setOutputText('output_co2PerMile', Math.round(result.co2PerMile) + ' g/mi');
    setOutputText('output_treesNeededToOffset', result.treesNeededToOffset.toLocaleString() + ' trees');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualMiles: inputs.annualMiles,
        mpg: inputs.mpg,
        fuelType: inputs.fuelType,
        annualCo2Tons: result.annualCo2Tons.toFixed(2),
        treesNeededToOffset: result.treesNeededToOffset
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
    if (tab === 'emissionsComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Vehicle', 'US Vehicle Avg (4.6T)', 'Hybrid (2.2T)', 'Electric Grid Avg (1.5T)'],
          datasets: [{
            label: 'CO2 Emissions (Metric Tons)',
            data: [
              +result.annualCo2Tons.toFixed(2),
              4.64,
              2.23,
              1.50
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
            title: { display: true, text: 'Annual Carbon Footprint vs Benchmarks (Metric Tons CO2)', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'offsetTrees') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Vehicle Offset', 'Avg US Car Offset'],
          datasets: [{
            label: 'Mature Trees Needed',
            data: [
              result.treesNeededToOffset,
              213
            ],
            backgroundColor: ['#10b981', '#3b82f6'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Mature Trees Required for Carbon Offsetting', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_annualMiles').value = 12500;
    document.getElementById('input_mpg').value = 24;
    document.getElementById('input_fuelType').value = 'gasoline';
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

(function() {
  var chartInstance = null;
  var currentTab = 'yearlyTrend';

  var BRAND_FACTORS = {
    'economy': 0.85,
    'mid-tier': 1.00,
    'luxury': 1.45,
    'german-luxury': 1.95
  };

  function getInputs() {
    return {
      vehicleAge: parseFloat(document.getElementById('input_vehicleAge').value) || 0,
      currentOdometer: parseFloat(document.getElementById('input_currentOdometer').value) || 0,
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 12000,
      brandCategory: document.getElementById('input_brandCategory').value || 'mid-tier'
    };
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
    var age = inputs.vehicleAge;
    var brandFactor = BRAND_FACTORS[inputs.brandCategory] || 1.00;

    // Base cost per mile increases with age & odometer
    var ageFactor = 1 + (age * 0.12);
    var odoFactor = 1 + (inputs.currentOdometer / 100000) * 0.25;

    var baseCostPerMile = 0.05 * ageFactor * odoFactor * brandFactor;
    var estimatedAnnualMaintenance = inputs.annualMiles * baseCostPerMile;
    var estimatedMonthlyMaintenance = estimatedAnnualMaintenance / 12;
    var maintenancePerMile = baseCostPerMile;

    // Project 5-year cumulative maintenance
    var fiveYearTotal = 0;
    var ageCopy = age;
    var odoCopy = inputs.currentOdometer;
    for (var yr = 0; yr < 5; yr++) {
      var yrAgeFactor = 1 + (ageCopy * 0.12);
      var yrOdoFactor = 1 + (odoCopy / 100000) * 0.25;
      var yrCPM = 0.05 * yrAgeFactor * yrOdoFactor * brandFactor;
      fiveYearTotal += inputs.annualMiles * yrCPM;

      ageCopy += 1;
      odoCopy += inputs.annualMiles;
    }

    return {
      estimatedAnnualMaintenance: estimatedAnnualMaintenance,
      estimatedMonthlyMaintenance: estimatedMonthlyMaintenance,
      maintenancePerMile: maintenancePerMile,
      fiveYearMaintenanceCost: fiveYearTotal,
      brandFactor: brandFactor
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_estimatedAnnualMaintenance', formatCurrency(result.estimatedAnnualMaintenance));
    setOutputText('output_estimatedMonthlyMaintenance', formatCurrency(result.estimatedMonthlyMaintenance));
    setOutputText('output_maintenancePerMile', '$' + result.maintenancePerMile.toFixed(3));
    setOutputText('output_fiveYearMaintenanceCost', formatCurrency(result.fiveYearMaintenanceCost));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehicleAge: inputs.vehicleAge,
        currentOdometer: inputs.currentOdometer,
        brandCategory: inputs.brandCategory,
        estimatedAnnualMaintenance: Math.round(result.estimatedAnnualMaintenance),
        maintenancePerMile: result.maintenancePerMile.toFixed(3)
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
    if (tab === 'yearlyTrend') {
      var years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var costs = years.map(function(y) {
        var af = 1 + (y * 0.12);
        var of = 1 + ((y * 12000) / 100000) * 0.25;
        return Math.round(inputs.annualMiles * (0.05 * af * of * result.brandFactor));
      });

      return {
        type: 'bar',
        data: {
          labels: years.map(function(y) { return 'Yr ' + y; }),
          datasets: [{
            label: 'Estimated Annual Maintenance ',
            data: costs,
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Projected Annual Maintenance by Vehicle Age', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'breakdown') {
      var annual = result.estimatedAnnualMaintenance;
      return {
        type: 'doughnut',
        data: {
          labels: ['Oil & Filters (15%)', 'Tires & Brakes (35%)', 'Scheduled Service (25%)', 'Unscheduled Repairs (25%)'],
          datasets: [{
            data: [
              Math.round(annual * 0.15),
              Math.round(annual * 0.35),
              Math.round(annual * 0.25),
              Math.round(annual * 0.25)
            ],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#e11d48'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 11 } } },
            title: { display: true, text: 'Maintenance Cost Category Allocation', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_vehicleAge').value = 4;
    document.getElementById('input_currentOdometer').value = 48000;
    document.getElementById('input_annualMiles').value = 12000;
    document.getElementById('input_brandCategory').value = 'mid-tier';
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

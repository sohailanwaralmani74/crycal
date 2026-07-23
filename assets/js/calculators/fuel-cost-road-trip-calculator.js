(function() {
  var chartInstance = null;
  var currentTab = 'costPerPerson';

  function getInputs() {
    return {
      tripDistance: parseFloat(document.getElementById('input_tripDistance').value) || 0,
      mpg: parseFloat(document.getElementById('input_mpg').value) || 1,
      gasPrice: parseFloat(document.getElementById('input_gasPrice').value) || 0,
      passengerCount: parseFloat(document.getElementById('input_passengerCount').value) || 1
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
    var dist = inputs.tripDistance;
    var mpg = Math.max(1, inputs.mpg);
    var price = inputs.gasPrice;
    var passengers = Math.max(1, inputs.passengerCount);

    var totalGallons = dist / mpg;
    var totalGasCost = totalGallons * price;
    var costPerPerson = totalGasCost / passengers;
    // Assuming 14-gal tank, refilling ~12 gals each time
    var tankFillUps = Math.ceil(totalGallons / 12);

    return {
      totalGasCost: totalGasCost,
      totalGallons: totalGallons,
      costPerPerson: costPerPerson,
      tankFillUps: tankFillUps
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_totalGasCost', formatCurrency(result.totalGasCost));
    setOutputText('output_totalGallons', result.totalGallons.toFixed(1) + ' gal');
    setOutputText('output_costPerPerson', formatCurrency(result.costPerPerson));
    setOutputText('output_tankFillUps', result.tankFillUps + ' fill-ups');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        tripDistance: inputs.tripDistance,
        mpg: inputs.mpg,
        gasPrice: inputs.gasPrice,
        totalGasCost: '$' + result.totalGasCost.toFixed(2),
        costPerPerson: '$' + result.costPerPerson.toFixed(2)
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
    if (tab === 'costPerPerson') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Road Trip Gas Bill', 'Cost Per Person (' + inputs.passengerCount + ' travelers)'],
          datasets: [{
            label: 'Amount ',
            data: [
              +result.totalGasCost.toFixed(2),
              +result.costPerPerson.toFixed(2)
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
            title: { display: true, text: 'Total Gas Expense vs Passenger Share ', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'distanceBreakdown') {
      var dist = inputs.tripDistance;
      var cpm = (inputs.gasPrice / Math.max(1, inputs.mpg));
      var fractions = [0.25, 0.50, 0.75, 1.00];

      return {
        type: 'bar',
        data: {
          labels: fractions.map(function(f) { return Math.round(dist * f) + ' mi'; }),
          datasets: [{
            label: 'Cumulative Fuel Spending ',
            data: fractions.map(function(f) { return +(dist * f * cpm).toFixed(2); }),
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cumulative Gas Spending Across Distance Milestones', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_tripDistance').value = 850;
    document.getElementById('input_mpg').value = 26;
    document.getElementById('input_gasPrice').value = 3.65;
    document.getElementById('input_passengerCount').value = 3;
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

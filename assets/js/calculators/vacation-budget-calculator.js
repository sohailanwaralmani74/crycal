(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      travelerCount: parseFloat(document.getElementById('input_travelerCount').value) || 1,
      tripDurationDays: parseFloat(document.getElementById('input_tripDurationDays').value) || 1,
      transportationTotal: parseFloat(document.getElementById('input_transportationTotal').value) || 0,
      lodgingNightlyRate: parseFloat(document.getElementById('input_lodgingNightlyRate').value) || 0,
      dailyFoodActivityPerPerson: parseFloat(document.getElementById('input_dailyFoodActivityPerPerson').value) || 0
    };
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
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
    var travelers = inputs.travelerCount;
    var days = inputs.tripDurationDays;

    if (travelers <= 0 || days <= 0) return null;

    var totalLodging = inputs.lodgingNightlyRate * Math.max(1, days - 1);
    var totalFoodActivity = inputs.dailyFoodActivityPerPerson * travelers * days;

    var totalTripCost = inputs.transportationTotal + totalLodging + totalFoodActivity;
    var costPerPerson = totalTripCost / travelers;
    var dailyAllowancePerPerson = costPerPerson / days;

    return {
      totalTripCost: totalTripCost,
      costPerPerson: costPerPerson,
      dailyAllowancePerPerson: dailyAllowancePerPerson,
      totalTransit: inputs.transportationTotal,
      totalLodging: totalLodging,
      totalFoodActivity: totalFoodActivity
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_totalTripCost', formatCurrencyLocal(result.totalTripCost));
    setOutputText('output_totalCostPerPerson', formatCurrencyLocal(result.costPerPerson));
    setOutputText('output_dailyAllowancePerPerson', formatCurrencyLocal(result.dailyAllowancePerPerson) + ' / day');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        travelerCount: inputs.travelerCount,
        tripDurationDays: inputs.tripDurationDays,
        transportationTotal: inputs.transportationTotal,
        totalTripCost: result.totalTripCost,
        totalCostPerPerson: result.costPerPerson,
        dailyAllowancePerPerson: result.dailyAllowancePerPerson
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
    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Transportation & Flights', 'Lodging & Hotels', 'Food, Drinks & Activities'],
          datasets: [{
            data: [result.totalTransit, result.totalLodging, result.totalFoodActivity],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Total Vacation Expense Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'perPerson') {
      return {
        type: 'bar',
        data: {
          labels: ['Cost Metrics'],
          datasets: [
            {
              label: 'Total Cost Per Person',
              data: [result.costPerPerson],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Daily All-Inclusive Budget Per Person',
              data: [result.dailyAllowancePerPerson],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Per-Person Expenditure Metrics' }
          },
          scales: {
            y: { beginAtZero: true }
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
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });

    setTimeout(updateTool, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();

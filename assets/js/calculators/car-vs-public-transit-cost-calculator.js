(function() {
  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      carPayment: parseFloat(document.getElementById('input_carPayment').value) || 0,
      carInsurance: parseFloat(document.getElementById('input_carInsurance').value) || 0,
      monthlyFuel: parseFloat(document.getElementById('input_monthlyFuel').value) || 0,
      parkingTolls: parseFloat(document.getElementById('input_parkingTolls').value) || 0,
      carMaintenance: parseFloat(document.getElementById('input_carMaintenance').value) || 0,
      transitPass: parseFloat(document.getElementById('input_transitPass').value) || 0,
      occasionalRideshare: parseFloat(document.getElementById('input_occasionalRideshare').value) || 0
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
    var totalCarMonthly = inputs.carPayment + inputs.carInsurance + inputs.monthlyFuel + inputs.parkingTolls + inputs.carMaintenance;
    var totalTransitMonthly = inputs.transitPass + inputs.occasionalRideshare;

    var monthlySavings = totalCarMonthly - totalTransitMonthly;
    var annualSavings = monthlySavings * 12;
    var fiveYearSavings = monthlySavings * 60;

    return {
      totalCarMonthly: totalCarMonthly,
      totalTransitMonthly: totalTransitMonthly,
      monthlySavings: monthlySavings,
      annualSavings: annualSavings,
      fiveYearSavings: fiveYearSavings
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_totalCarMonthly', formatCurrency(result.totalCarMonthly));
    setOutputText('output_totalTransitMonthly', formatCurrency(result.totalTransitMonthly));
    setOutputText('output_monthlySavings', formatCurrency(result.monthlySavings));
    setOutputText('output_annualSavings', formatCurrency(result.annualSavings));
    setOutputText('output_fiveYearSavings', formatCurrency(result.fiveYearSavings));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalCarMonthly: Math.round(result.totalCarMonthly),
        totalTransitMonthly: Math.round(result.totalTransitMonthly),
        monthlySavings: Math.round(result.monthlySavings),
        annualSavings: Math.round(result.annualSavings),
        fiveYearSavings: Math.round(result.fiveYearSavings)
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
    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Car Ownership', 'Public Transit'],
          datasets: [{
            label: 'Total Monthly Expense ',
            data: [
              Math.round(result.totalCarMonthly),
              Math.round(result.totalTransitMonthly)
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
            title: { display: true, text: 'Total Monthly Expense: Car vs Transit ', font: { size: 14 }, color: '#e8edf0' }
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
      return {
        type: 'doughnut',
        data: {
          labels: ['Car Payment', 'Insurance', 'Fuel', 'Parking & Tolls', 'Maintenance'],
          datasets: [{
            data: [
              Math.round(inputs.carPayment),
              Math.round(inputs.carInsurance),
              Math.round(inputs.monthlyFuel),
              Math.round(inputs.parkingTolls),
              Math.round(inputs.carMaintenance)
            ],
            backgroundColor: ['#e11d48', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 11 } } },
            title: { display: true, text: 'Car Monthly Expense Breakdown', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_carPayment').value = 450;
    document.getElementById('input_carInsurance').value = 140;
    document.getElementById('input_monthlyFuel').value = 150;
    document.getElementById('input_parkingTolls').value = 100;
    document.getElementById('input_carMaintenance').value = 80;
    document.getElementById('input_transitPass').value = 120;
    document.getElementById('input_occasionalRideshare').value = 50;
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

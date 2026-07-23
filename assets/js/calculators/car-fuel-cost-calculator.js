(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 0,
      mpg: parseFloat(document.getElementById('input_mpg').value) || 1,
      fuelPrice: parseFloat(document.getElementById('input_fuelPrice').value) || 0
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
    var miles = inputs.annualMiles;
    var mpg = Math.max(1, inputs.mpg);
    var price = inputs.fuelPrice;

    var gallonsPerYear = miles / mpg;
    var annualFuelCost = gallonsPerYear * price;
    var monthlyFuelCost = annualFuelCost / 12;
    var costPerMile = price / mpg;
    var fiveYearFuelCost = annualFuelCost * 5;

    return {
      monthlyFuelCost: monthlyFuelCost,
      annualFuelCost: annualFuelCost,
      gallonsPerYear: gallonsPerYear,
      costPerMile: costPerMile,
      fiveYearFuelCost: fiveYearFuelCost
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_monthlyFuelCost', formatCurrency(result.monthlyFuelCost));
    setOutputText('output_annualFuelCost', formatCurrency(result.annualFuelCost));
    setOutputText('output_gallonsPerYear', Math.round(result.gallonsPerYear) + ' gal');
    setOutputText('output_costPerMile', '$' + result.costPerMile.toFixed(3));
    setOutputText('output_fiveYearFuelCost', formatCurrency(result.fiveYearFuelCost));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualMiles: inputs.annualMiles,
        mpg: inputs.mpg,
        fuelPrice: inputs.fuelPrice,
        monthlyFuelCost: Math.round(result.monthlyFuelCost),
        annualFuelCost: Math.round(result.annualFuelCost)
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
        type: 'bar',
        data: {
          labels: ['Monthly', 'Annual', '5-Year Cumulative'],
          datasets: [{
            label: 'Fuel Expense ',
            data: [
              Math.round(result.monthlyFuelCost),
              Math.round(result.annualFuelCost),
              Math.round(result.fiveYearFuelCost)
            ],
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Fuel Spending Timeline', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'mileageSensitivity') {
      var mileages = [5000, 10000, 12000, 15000, 20000, 25000];
      var costs = mileages.map(function(m) {
        return Math.round((m / Math.max(1, inputs.mpg)) * inputs.fuelPrice);
      });

      return {
        type: 'line',
        data: {
          labels: ['5k mi', '10k mi', '12k mi', '15k mi', '20k mi', '25k mi'],
          datasets: [{
            label: 'Annual Gas Cost ',
            data: costs,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Fuel Cost by Distance Driven', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_annualMiles').value = 12000;
    document.getElementById('input_mpg').value = 25;
    document.getElementById('input_fuelPrice').value = 3.50;
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

(function() {
  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 0,
      gasCarMpg: parseFloat(document.getElementById('input_gasCarMpg').value) || 1,
      gasPrice: parseFloat(document.getElementById('input_gasPrice').value) || 0,
      evEfficiency: parseFloat(document.getElementById('input_evEfficiency').value) || 30,
      electricityRate: parseFloat(document.getElementById('input_electricityRate').value) || 0.16
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
    var gasMpg = Math.max(1, inputs.gasCarMpg);

    var gasCostPerMile = inputs.gasPrice / gasMpg;
    var annualGasCost = miles * gasCostPerMile;

    var evCostPerMile = (inputs.evEfficiency / 100) * inputs.electricityRate;
    var annualEvCost = miles * evCostPerMile;

    var annualEvSavings = annualGasCost - annualEvCost;
    var fiveYearEvSavings = annualEvSavings * 5;

    return {
      annualGasCost: annualGasCost,
      annualEvCost: annualEvCost,
      annualEvSavings: annualEvSavings,
      fiveYearEvSavings: fiveYearEvSavings,
      gasCostPerMile: gasCostPerMile,
      evCostPerMile: evCostPerMile
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_annualGasCost', formatCurrency(result.annualGasCost));
    setOutputText('output_annualEvCost', formatCurrency(result.annualEvCost));
    setOutputText('output_annualEvSavings', formatCurrency(result.annualEvSavings));
    setOutputText('output_fiveYearEvSavings', formatCurrency(result.fiveYearEvSavings));
    setOutputText('output_gasCostPerMile', '$' + result.gasCostPerMile.toFixed(3));
    setOutputText('output_evCostPerMile', '$' + result.evCostPerMile.toFixed(3));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualMiles: inputs.annualMiles,
        annualGasCost: Math.round(result.annualGasCost),
        annualEvCost: Math.round(result.annualEvCost),
        annualEvSavings: Math.round(result.annualEvSavings),
        fiveYearEvSavings: Math.round(result.fiveYearEvSavings)
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
          labels: ['Gasoline Vehicle', 'Electric Vehicle (EV)'],
          datasets: [{
            label: 'Annual Fuel / Power Spending ',
            data: [
              Math.round(result.annualGasCost),
              Math.round(result.annualEvCost)
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
            title: { display: true, text: 'Annual Fuel Expenditure: Gas vs EV ', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'cumulative') {
      var years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      var gasCumulative = years.map(function(y, i) { return Math.round(result.annualGasCost * (i + 1)); });
      var evCumulative = years.map(function(y, i) { return Math.round(result.annualEvCost * (i + 1)); });

      return {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Gasoline Cumulative ',
              data: gasCumulative,
              borderColor: '#e11d48',
              backgroundColor: 'rgba(225, 29, 72, 0.1)',
              fill: false,
              tension: 0.3
            },
            {
              label: 'EV Charging Cumulative ',
              data: evCumulative,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: false,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 11 } } },
            title: { display: true, text: '5-Year Cumulative Fuel Spending Comparison ', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_annualMiles').value = 13500;
    document.getElementById('input_gasCarMpg').value = 27;
    document.getElementById('input_gasPrice').value = 3.60;
    document.getElementById('input_evEfficiency').value = 30;
    document.getElementById('input_electricityRate').value = 0.16;
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

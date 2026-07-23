(function() {
  var chartInstance = null;
  var currentTab = 'wasteBreakdown';

  var IDLE_RATES = {
    'small-4cyl': 0.30,
    'med-v6': 0.60,
    'large-v8': 0.90,
    'diesel-truck': 1.10
  };

  function getInputs() {
    return {
      dailyIdleMinutes: parseFloat(document.getElementById('input_dailyIdleMinutes').value) || 0,
      engineDisplacement: document.getElementById('input_engineDisplacement').value || 'med-v6',
      daysPerYear: parseFloat(document.getElementById('input_daysPerYear').value) || 260,
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
    var rate = IDLE_RATES[inputs.engineDisplacement] || 0.60;
    var idleHoursPerDay = inputs.dailyIdleMinutes / 60;

    var dailyGallonsWasted = idleHoursPerDay * rate;
    var annualGallonsWasted = dailyGallonsWasted * inputs.daysPerYear;
    var annualMoneyWasted = annualGallonsWasted * inputs.gasPrice;
    // 1 gal gas = 19.6 lbs CO2
    var annualCo2Wasted = annualGallonsWasted * 19.6;

    return {
      dailyGallonsWasted: dailyGallonsWasted,
      annualGallonsWasted: annualGallonsWasted,
      annualMoneyWasted: annualMoneyWasted,
      annualCo2Wasted: annualCo2Wasted
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_dailyGallonsWasted', result.dailyGallonsWasted.toFixed(2) + ' gal');
    setOutputText('output_annualGallonsWasted', result.annualGallonsWasted.toFixed(1) + ' gal');
    setOutputText('output_annualMoneyWasted', formatCurrency(result.annualMoneyWasted));
    setOutputText('output_annualCo2Wasted', Math.round(result.annualCo2Wasted) + ' lbs');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        dailyIdleMinutes: inputs.dailyIdleMinutes,
        engineDisplacement: inputs.engineDisplacement,
        annualGallonsWasted: result.annualGallonsWasted.toFixed(1),
        annualMoneyWasted: '$' + result.annualMoneyWasted.toFixed(2),
        annualCo2Wasted: Math.round(result.annualCo2Wasted) + ' lbs'
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
    if (tab === 'wasteBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Annual Money Wasted ', 'Annual CO2 Emissions (lbs / 10)'],
          datasets: [{
            label: 'Idle Waste',
            data: [
              +result.annualMoneyWasted.toFixed(2),
              +(result.annualCo2Wasted / 10).toFixed(1)
            ],
            backgroundColor: ['#e11d48', '#f59e0b'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Idle Waste: Money  & CO2 Emissions (lbs ÷ 10)', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'dailyVsAnnual') {
      var daily = result.dailyGallonsWasted * inputs.gasPrice;
      var monthly = daily * 21.6;
      var annual = result.annualMoneyWasted;

      return {
        type: 'bar',
        data: {
          labels: ['Daily Waste', 'Monthly Waste', 'Annual Waste'],
          datasets: [{
            label: 'Dollar Wasted ',
            data: [
              +daily.toFixed(2),
              +monthly.toFixed(2),
              +annual.toFixed(2)
            ],
            backgroundColor: ['#3b82f6', '#10b981', '#e11d48'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Idling Dollar Loss Accumulation Timeline ', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_dailyIdleMinutes').value = 25;
    document.getElementById('input_engineDisplacement').value = 'med-v6';
    document.getElementById('input_daysPerYear').value = 260;
    document.getElementById('input_gasPrice').value = 3.60;
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

(function() {
  'use strict';

  var chartInstance = null;

  function init() {
    var inputs = document.querySelectorAll('#inputsArea input, #inputsArea select, .tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function setOutput(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function getPerformanceTier(hpPerTon) {
    if (hpPerTon >= 500) return '🏎️ Hypercar / Track Special (500+ hp/ton)';
    if (hpPerTon >= 350) return '🔥 Supercar Tier (350 - 500 hp/ton)';
    if (hpPerTon >= 230) return '🚀 High-Performance Sports Car (230 - 350 hp/ton)';
    if (hpPerTon >= 150) return '⚡ Sporty Performance Tier (150 - 230 hp/ton)';
    if (hpPerTon >= 100) return '🚘 Standard Passenger Car (100 - 150 hp/ton)';
    return '🐢 Economy / Heavy Commercial (< 100 hp/ton)';
  }

  function calculate() {
    var hp = parseFloat(document.getElementById('input_horsepower').value) || 400;
    var weightLbs = parseFloat(document.getElementById('input_weightLbs').value) || 3200;
    var driverLbs = parseFloat(document.getElementById('input_driverWeightLbs').value) || 180;

    var grossLbs = weightLbs + driverLbs;
    var grossTonsUs = grossLbs / 2000.0;
    var grossTonneMetric = grossLbs / 2204.62;

    var hpPerTon = (grossTonsUs > 0) ? (hp / grossTonsUs) : 0;
    var lbsPerHp = (hp > 0) ? (grossLbs / hp) : 0;

    var kwTotal = hp * 0.7457;
    var kwPerTonne = (grossTonneMetric > 0) ? (kwTotal / grossTonneMetric) : 0;

    var tierText = getPerformanceTier(hpPerTon);

    setOutput('hpPerTon', Math.round(hpPerTon) + ' hp / US Ton');
    setOutput('lbsPerHp', lbsPerHp.toFixed(2) + ' lbs / hp');
    setOutput('kwPerTonne', Math.round(kwPerTonne) + ' kW / Tonne');
    setOutput('totalWeight', grossLbs.toLocaleString() + ' lbs');
    setOutput('performanceTier', tierText);

    updateChart(hpPerTon);

    if (window.logHistory) {
      window.logHistory('horsepower-to-weight-ratio-calculator', {
        hpPerTon: Math.round(hpPerTon) + ' hp/ton',
        lbsPerHp: lbsPerHp.toFixed(2) + ' lbs/hp',
        kwPerTonne: Math.round(kwPerTonne) + ' kW/tonne',
        performanceTier: tierText
      });
    }
  }

  function updateChart(userHpPerTon) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'tierBenchmark';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'powerToWeightMetric') {
      var categories = ['Economy Car', 'Hot Hatch', 'Your Car', 'Sports Coupe', 'Supercar', 'Hypercar'];
      var benchmarks = [110, 190, Math.round(userHpPerTon), 280, 420, 600];
      var colors = ['#8899aa', '#8899aa', '#4ade80', '#8899aa', '#8899aa', '#8899aa'];

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Horsepower per US Ton',
            data: benchmarks,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var tierLabels = ['Economy (<100)', 'Standard (100-150)', 'Sporty (150-230)', 'Sports (230-350)', 'Supercar (350-500)', 'Hypercar (500+)'];
      var tierThresholds = [75, 125, 190, 290, 425, 600];

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tierLabels,
          datasets: [{
            label: 'Benchmark Tier hp/ton',
            data: tierThresholds,
            backgroundColor: '#4A90D9'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_horsepower').value = 400;
    document.getElementById('input_weightLbs').value = 3200;
    document.getElementById('input_driverWeightLbs').value = 180;
    calculate();
  }

  window.updateTool = calculate;
  window.resetTool = reset;
  window.switchChartTab = function(tabId) {
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var target = document.querySelector('.chart-tab[data-tab="' + tabId + '"]');
    if (target) target.classList.add('active');
    calculate();
  };

  document.addEventListener('DOMContentLoaded', init);
})();

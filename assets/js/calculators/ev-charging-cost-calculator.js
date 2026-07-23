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

  function formatCurrency(num) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    } catch (e) {
      return '$' + num.toFixed(2);
    }
  }

  function setOutput(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculate() {
    var capacity = parseFloat(document.getElementById('input_batteryCapacity').value) || 75;
    var startSoc = parseFloat(document.getElementById('input_startSoc').value) || 20;
    var targetSoc = parseFloat(document.getElementById('input_targetSoc').value) || 80;
    var rate = parseFloat(document.getElementById('input_electricityRate').value) || 0.16;
    var efficiencyPercent = parseFloat(document.getElementById('input_chargerEfficiency').value) || 90;
    var monthlyMiles = parseFloat(document.getElementById('input_monthlyMiles').value) || 1000;
    var evEfficiency = parseFloat(document.getElementById('input_evEfficiency').value) || 3.5;

    if (targetSoc < startSoc) targetSoc = startSoc;
    var efficiency = efficiencyPercent / 100.0;

    var socDiff = (targetSoc - startSoc) / 100.0;
    var energyAdded = capacity * socDiff;
    var gridEnergy = energyAdded / efficiency;
    var singleChargeCost = gridEnergy * rate;

    var monthlyEnergyKwh = (monthlyMiles / evEfficiency) / efficiency;
    var monthlyEvBill = monthlyEnergyKwh * rate;
    var annualEvBill = monthlyEvBill * 12;
    var costPerMile = rate / (evEfficiency * efficiency);

    setOutput('singleChargeCost', formatCurrency(singleChargeCost));
    setOutput('energyAddedKwh', energyAdded.toFixed(1) + ' kWh');
    setOutput('gridEnergyKwh', gridEnergy.toFixed(1) + ' kWh');
    setOutput('monthlyEvBill', formatCurrency(monthlyEvBill) + ' / mo');
    setOutput('annualEvBill', formatCurrency(annualEvBill) + ' / yr');
    setOutput('costPerMile', formatCurrency(costPerMile) + ' / mi');

    updateChart(monthlyMiles, evEfficiency, rate, efficiency, capacity, startSoc);

    if (window.logHistory) {
      window.logHistory('ev-charging-cost-calculator', {
        singleChargeCost: formatCurrency(singleChargeCost),
        energyAddedKwh: energyAdded.toFixed(1) + ' kWh',
        monthlyEvBill: formatCurrency(monthlyEvBill),
        costPerMile: formatCurrency(costPerMile)
      });
    }
  }

  function updateChart(monthlyMiles, evEfficiency, rate, efficiency, capacity, startSoc) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'monthlyCostByMiles';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'chargeCostBySoc') {
      var socTargets = [50, 60, 70, 80, 90, 100];
      var costs = socTargets.map(function(t) {
        var diff = Math.max(0, (t - startSoc) / 100.0);
        var grid = (capacity * diff) / efficiency;
        return parseFloat((grid * rate).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: socTargets.map(function(t) { return 'To ' + t + '%'; }),
          datasets: [{
            label: 'Charge Session Cost ',
            data: costs,
            backgroundColor: '#4A90D9'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var distances = [500, 750, 1000, 1250, 1500, 2000];
      var monthlyCosts = distances.map(function(m) {
        var kwh = (m / evEfficiency) / efficiency;
        return parseFloat((kwh * rate).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: distances.map(function(m) { return m + ' mi'; }),
          datasets: [{
            label: 'Monthly Electric Bill ',
            data: monthlyCosts,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
            fill: true,
            tension: 0.3
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
    document.getElementById('input_batteryCapacity').value = 75;
    document.getElementById('input_startSoc').value = 20;
    document.getElementById('input_targetSoc').value = 80;
    document.getElementById('input_electricityRate').value = 0.16;
    document.getElementById('input_chargerEfficiency').value = 90;
    document.getElementById('input_monthlyMiles').value = 1000;
    document.getElementById('input_evEfficiency').value = 3.5;
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

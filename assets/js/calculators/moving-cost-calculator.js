(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      homeSize: document.getElementById('input_homeSize').value,
      moveDistanceMiles: parseFloat(document.getElementById('input_moveDistanceMiles').value) || 0,
      moveType: document.getElementById('input_moveType').value
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
    var sizeMult = 1.0;
    var packingSupplies = 150;
    if (inputs.homeSize.indexOf('2-3 Bedrooms') !== -1) {
      sizeMult = 1.8;
      packingSupplies = 300;
    } else if (inputs.homeSize.indexOf('4+') !== -1) {
      sizeMult = 2.8;
      packingSupplies = 550;
    }

    var dist = inputs.moveDistanceMiles;
    var baseCost = 400 * sizeMult;
    var mileCost = dist * (dist > 200 ? 1.2 : 0.8) * sizeMult;

    var methodMult = 1.0; // DIY Truck
    if (inputs.moveType.indexOf('Container') !== -1) methodMult = 1.6;
    else if (inputs.moveType.indexOf('Full-Service') !== -1) methodMult = 2.4;

    var movingCost = (baseCost + mileCost) * methodMult;
    var totalWithCushion = (movingCost + packingSupplies) * 1.15;

    return {
      movingCost: movingCost,
      packingSupplies: packingSupplies,
      totalWithCushion: totalWithCushion
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_estimatedMovingCost', formatCurrencyLocal(result.movingCost));
    setOutputText('output_packingSuppliesCost', formatCurrencyLocal(result.packingSupplies));
    setOutputText('output_totalBudgetWithCushion', formatCurrencyLocal(result.totalWithCushion));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        homeSize: inputs.homeSize,
        moveDistanceMiles: inputs.moveDistanceMiles,
        moveType: inputs.moveType,
        estimatedMovingCost: result.movingCost,
        totalBudgetWithCushion: result.totalWithCushion
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
          labels: ['Transport & Mover Labor', 'Boxes & Packing Supplies', '15% Emergency Buffer'],
          datasets: [{
            data: [result.movingCost, result.packingSupplies, result.totalWithCushion - (result.movingCost + result.packingSupplies)],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Relocation Expenses Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'methodComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Relocation Budget'],
          datasets: [
            {
              label: 'Estimated Base Move Cost',
              data: [result.movingCost],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Packing & Buffer Cushion',
              data: [result.totalWithCushion - result.movingCost],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Total Relocation Financial Target' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
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

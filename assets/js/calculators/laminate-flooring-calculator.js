(function () {
  var chartInstance = null;
  var currentTab = 'materialCostBreakdown';
  var lastData = null;

  function formatCurrency(val) {
    return '$' + Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatNumber(val) {
    return Number(val).toLocaleString();
  }

  function getInputValue(id, fallback) {
    var el = document.getElementById('input_' + id);
    if (!el) return fallback;
    var val = parseFloat(el.value);
    return isNaN(val) ? fallback : val;
  }

  function setOutputText(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculate() {
    var roomAreaSqFt = getInputValue('roomAreaSqFt', 400);
    var roomPerimeterFeet = getInputValue('roomPerimeterFeet', 80);
    var wasteFactor = getInputValue('wasteFactor', 10);
    var sqFtPerCarton = getInputValue('sqFtPerCarton', 24);
    var underlaymentRollSqFt = getInputValue('underlaymentRollSqFt', 100);
    var pricePerSqFt = getInputValue('pricePerSqFt', 2.75);
    var underlaymentCostPerRoll = getInputValue('underlaymentCostPerRoll', 35.00);

    var wasteMultiplier = 1 + (wasteFactor / 100);
    var totalOrderSqFt = roomAreaSqFt * wasteMultiplier;

    var totalCartonsNeeded = Math.ceil(totalOrderSqFt / sqFtPerCarton);
    var underlaymentRollsNeeded = Math.ceil(totalOrderSqFt / underlaymentRollSqFt);
    var transitionStripsNeeded = Math.max(1, Math.ceil(roomAreaSqFt / 200));

    var plankCost = totalCartonsNeeded * sqFtPerCarton * pricePerSqFt;
    var underlaymentCost = underlaymentRollsNeeded * underlaymentCostPerRoll;
    var totalMaterialCost = plankCost + underlaymentCost;

    setOutputText('totalCartonsNeeded', formatNumber(totalCartonsNeeded) + ' Cartons (' + formatNumber(totalCartonsNeeded * sqFtPerCarton) + ' sq ft)');
    setOutputText('underlaymentRollsNeeded', formatNumber(underlaymentRollsNeeded) + ' Rolls');
    setOutputText('transitionStripsNeeded', formatNumber(transitionStripsNeeded) + ' Strips (6 ft each)');
    setOutputText('totalMaterialCost', formatCurrency(totalMaterialCost));

    lastData = {
      plankCost: plankCost,
      underlaymentCost: underlaymentCost,
      totalCartonsNeeded: totalCartonsNeeded,
      underlaymentRollsNeeded: underlaymentRollsNeeded
    };

    renderChart(lastData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        roomAreaSqFt: roomAreaSqFt,
        totalCartonsNeeded: formatNumber(totalCartonsNeeded),
        underlaymentRollsNeeded: formatNumber(underlaymentRollsNeeded),
        totalMaterialCost: formatCurrency(totalMaterialCost)
      });
    }
  }

  function renderChart(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'materialCostBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Laminate Planks Cost', 'Underlayment Rolls Cost'],
          datasets: [{
            data: [data.plankCost, data.underlaymentCost],
            backgroundColor: ['#10b981', '#3b82f6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#e8edf0' } } }
        }
      });
    } else if (currentTab === 'cartonAndRollCount') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Laminate Cartons', 'Underlayment Rolls'],
          datasets: [{
            label: 'Packages to Order',
            data: [data.totalCartonsNeeded, data.underlaymentRollsNeeded],
            backgroundColor: ['#10b981', '#6366f1']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  window.updateTool = calculate;
  window.resetTool = function () {
    var defaults = {
      roomAreaSqFt: 400,
      roomPerimeterFeet: 80,
      wasteFactor: 10,
      sqFtPerCarton: 24,
      underlaymentRollSqFt: 100,
      pricePerSqFt: 2.75,
      underlaymentCostPerRoll: 35.00
    };
    Object.keys(defaults).forEach(function (key) {
      var el = document.getElementById('input_' + key);
      if (el) el.value = defaults[key];
    });
    calculate();
  };

  window.switchChartTab = function (tabId) {
    currentTab = tabId;
    if (lastData) renderChart(lastData);
  };

  document.addEventListener('DOMContentLoaded', function () {
    calculate();
  });
})();

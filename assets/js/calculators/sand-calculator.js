(function () {
  var chartInstance = null;
  var currentTab = 'bulkVsBagged';
  var lastData = null;

  function formatCurrency(val) {
    return '$' + Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatNumber(val) {
    return Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 });
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
    var areaSquareFeet = getInputValue('areaSquareFeet', 300);
    var depthInches = getInputValue('depthInches', 2);
    var pricePerTon = getInputValue('pricePerTon', 40.00);
    var wastePercentage = getInputValue('wastePercentage', 10);

    var cubicFeetNet = areaSquareFeet * (depthInches / 12);
    var wasteMultiplier = 1 + (wastePercentage / 100);
    var cubicFeetTotal = cubicFeetNet * wasteMultiplier;
    var totalCubicYards = cubicFeetTotal / 27;

    var densityTonsPerYd = 1.35;
    var totalTons = totalCubicYards * densityTonsPerYd;
    var totalLbs = totalTons * 2000;
    var total50lbBags = Math.ceil(totalLbs / 50);

    var totalMaterialCost = totalTons * pricePerTon;
    var baggedCost = total50lbBags * 4.50;

    setOutputText('totalCubicYards', formatNumber(totalCubicYards) + ' cu yd');
    setOutputText('totalTons', formatNumber(totalTons) + ' Tons (' + formatNumber(totalLbs) + ' lbs)');
    setOutputText('total50lbBags', formatNumber(total50lbBags) + ' Bags (50 lb)');
    setOutputText('totalMaterialCost', formatCurrency(totalMaterialCost));

    lastData = {
      totalTons: totalTons,
      total50lbBags: total50lbBags,
      totalMaterialCost: totalMaterialCost,
      baggedCost: baggedCost
    };

    renderChart(lastData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        areaSquareFeet: areaSquareFeet,
        depthInches: depthInches,
        totalCubicYards: formatNumber(totalCubicYards),
        totalTons: formatNumber(totalTons),
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

    if (currentTab === 'bulkVsBagged') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bulk Weight (Tons)', '50lb Bags Count'],
          datasets: [{
            label: 'Quantity',
            data: [data.totalTons, data.total50lbBags],
            backgroundColor: ['#10b981', '#3b82f6']
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
    } else if (currentTab === 'costComparison') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Bulk Delivery Cost', 'Pre-Bagged Retail Cost'],
          datasets: [{
            data: [data.totalMaterialCost, data.baggedCost],
            backgroundColor: ['#10b981', '#f59e0b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#e8edf0' } } }
        }
      });
    }
  }

  window.updateTool = calculate;
  window.resetTool = function () {
    var defaults = {
      areaSquareFeet: 300,
      depthInches: 2,
      sandType: "paver_sand",
      pricePerTon: 40.00,
      wastePercentage: 10
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

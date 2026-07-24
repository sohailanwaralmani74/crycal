(function () {
  var chartInstance = null;
  var currentTab = 'costBreakdown';
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
    var poolVolumeGallons = getInputValue('poolVolumeGallons', 18000);
    var waterRatePer1000 = getInputValue('waterRatePer1000', 6.00);
    var sewerRatePer1000 = getInputValue('sewerRatePer1000', 4.00);
    var waterTruckFee = getInputValue('waterTruckFee', 0);

    var thousandsOfGallons = poolVolumeGallons / 1000;
    var waterCostOnly = thousandsOfGallons * waterRatePer1000;
    var sewerFeeCost = thousandsOfGallons * sewerRatePer1000;
    var totalFillCost = waterCostOnly + sewerFeeCost + waterTruckFee;

    var costPer1000Gal = thousandsOfGallons > 0 ? (totalFillCost / thousandsOfGallons) : 0;

    setOutputText('totalFillCost', formatCurrency(totalFillCost));
    setOutputText('waterCostOnly', formatCurrency(waterCostOnly));
    setOutputText('sewerFeeCost', formatCurrency(sewerFeeCost));
    setOutputText('costPer1000Gal', formatCurrency(costPer1000Gal) + ' / 1,000 gal');

    lastData = {
      waterCostOnly: waterCostOnly,
      sewerFeeCost: sewerFeeCost,
      waterTruckFee: waterTruckFee,
      poolVolumeGallons: poolVolumeGallons,
      waterRatePer1000: waterRatePer1000,
      sewerRatePer1000: sewerRatePer1000
    };

    renderChart(lastData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        poolVolumeGallons: formatNumber(poolVolumeGallons) + ' gal',
        waterRatePer1000: formatCurrency(waterRatePer1000),
        totalFillCost: formatCurrency(totalFillCost),
        costPer1000Gal: formatCurrency(costPer1000Gal)
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

    if (currentTab === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Water Utility Charge', 'Sewer Surcharge', 'Truck Delivery Fee'],
          datasets: [{
            data: [data.waterCostOnly, data.sewerFeeCost, data.waterTruckFee],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#e8edf0' } } }
        }
      });
    } else if (currentTab === 'volumeVolumeCurve') {
      var volumes = [5000, 10000, 15000, 20000, 25000, 30000];
      var costs = volumes.map(function (v) {
        var kGal = v / 1000;
        return (kGal * data.waterRatePer1000) + (kGal * data.sewerRatePer1000) + data.waterTruckFee;
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['5k Gal', '10k Gal', '15k Gal', '20k Gal', '25k Gal', '30k Gal'],
          datasets: [{
            label: 'Fill Cost ($)',
            data: costs,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.2
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
      poolVolumeGallons: 18000,
      waterRatePer1000: 6.00,
      sewerRatePer1000: 4.00,
      waterTruckFee: 0
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

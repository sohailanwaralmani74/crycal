(function () {
  var chartInstance = null;
  var currentTab = 'metalCostBreakdown';
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
    var roofLengthFt = getInputValue('roofLengthFt', 50);
    var rakeSlopeLengthFt = getInputValue('rakeSlopeLengthFt', 20);
    var panelWidthInches = getInputValue('panelWidthInches', 16);
    var roofSides = getInputValue('roofSides', 2);
    var pricePerLinFt = getInputValue('pricePerLinFt', 4.5);
    var wastePercent = getInputValue('wastePercent', 10);

    var panelWidthFt = panelWidthInches / 12;
    var panelsPerSide = Math.ceil(roofLengthFt / panelWidthFt);
    var netPanelsNeeded = panelsPerSide * roofSides;
    var wasteMultiplier = 1 + (wastePercent / 100);
    var totalPanelsNeeded = Math.ceil(netPanelsNeeded * wasteMultiplier);

    var totalLinearFeet = totalPanelsNeeded * rakeSlopeLengthFt;
    var fastenerCount = Math.ceil(totalLinearFeet * 4); // ~4 fasteners per lin ft
    var totalMetalCost = totalLinearFeet * pricePerLinFt;
    var fastenerCost = fastenerCount * 0.12;
    var trimCost = roofLengthFt * roofSides * 3.5;

    setOutputText('totalPanelsNeeded', formatNumber(totalPanelsNeeded) + ' Panels');
    setOutputText('totalLinearFeet', formatNumber(totalLinearFeet) + ' lin ft');
    setOutputText('fastenerCount', formatNumber(fastenerCount) + ' Screws');
    setOutputText('totalMetalCost', formatCurrency(totalMetalCost));

    lastData = {
      totalMetalCost: totalMetalCost,
      fastenerCost: fastenerCost,
      trimCost: trimCost,
      roofLengthFt: roofLengthFt,
      roofSides: roofSides,
      wasteMultiplier: wasteMultiplier
    };

    renderChart(lastData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        roofLengthFt: roofLengthFt,
        panelWidthInches: panelWidthInches + '"',
        totalPanelsNeeded: formatNumber(totalPanelsNeeded),
        totalMetalCost: formatCurrency(totalMetalCost)
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

    if (currentTab === 'metalCostBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Metal Panels', 'Fasteners & Screws', 'Ridge & Eave Trim'],
          datasets: [{
            data: [data.totalMetalCost, data.fastenerCost, data.trimCost],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } }
          }
        }
      });
    } else if (currentTab === 'panelWidthComparison') {
      var widths = [12, 16, 24, 36];
      var panelCounts = widths.map(function (w) {
        var pSide = Math.ceil(data.roofLengthFt / (w / 12));
        return Math.ceil(pSide * data.roofSides * data.wasteMultiplier);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['12" Standing', '16" Standing', '24" R-Panel', '36" Ag-Panel'],
          datasets: [{
            label: 'Panels Required',
            data: panelCounts,
            backgroundColor: '#6366f1'
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
      roofLengthFt: 50,
      rakeSlopeLengthFt: 20,
      panelWidthInches: "16",
      roofSides: 2,
      pricePerLinFt: 4.5,
      wastePercent: 10
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

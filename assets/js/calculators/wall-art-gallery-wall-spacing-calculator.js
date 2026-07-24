(function () {
  var chartInstance = null;
  var currentTab = 'galleryVsWall';
  var lastData = null;

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
    var wallWidthInches = getInputValue('wallWidthInches', 120);
    var frameCount = getInputValue('frameCount', 3);
    var frameWidthInches = getInputValue('frameWidthInches', 20);
    var frameHeightInches = getInputValue('frameHeightInches', 24);
    var targetCenterHeight = getInputValue('targetCenterHeight', 57);

    var gapSpacingInches = 3;
    if (frameCount > 1) {
      if (frameWidthInches <= 12) gapSpacingInches = 2;
      else if (frameWidthInches <= 24) gapSpacingInches = 3;
      else gapSpacingInches = 4;
    } else {
      gapSpacingInches = 0;
    }

    var totalFramesWidth = frameCount * frameWidthInches;
    var totalGapsWidth = frameCount > 1 ? (frameCount - 1) * gapSpacingInches : 0;
    var totalGalleryWidth = totalFramesWidth + totalGapsWidth;

    var remainingWallWidth = wallWidthInches - totalGalleryWidth;
    var sideMarginSpacing = remainingWallWidth > 0 ? (remainingWallWidth / 2) : 0;

    var frameTopHangingHeight = targetCenterHeight + (frameHeightInches / 2);

    setOutputText('gapSpacingInches', gapSpacingInches.toFixed(1) + ' inches');
    setOutputText('totalGalleryWidth', totalGalleryWidth.toFixed(1) + ' inches (' + (totalGalleryWidth / 12).toFixed(1) + ' ft)');
    setOutputText('sideMarginSpacing', sideMarginSpacing.toFixed(1) + ' inches each side');
    setOutputText('frameTopHangingHeight', frameTopHangingHeight.toFixed(1) + ' inches from floor');

    lastData = {
      wallWidthInches: wallWidthInches,
      totalGalleryWidth: totalGalleryWidth,
      sideMarginSpacing: sideMarginSpacing,
      targetCenterHeight: targetCenterHeight,
      frameHeightInches: frameHeightInches,
      frameTopHangingHeight: frameTopHangingHeight
    };

    renderChart(lastData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        gapSpacingInches: gapSpacingInches.toFixed(1) + '"',
        totalGalleryWidth: totalGalleryWidth.toFixed(1) + '"',
        sideMarginSpacing: sideMarginSpacing.toFixed(1) + '"',
        frameTopHangingHeight: frameTopHangingHeight.toFixed(1) + '"'
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

    if (currentTab === 'galleryVsWall') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Gallery Width', 'Left Margin', 'Right Margin'],
          datasets: [{
            label: 'Width Breakdown (Inches)',
            data: [data.totalGalleryWidth, data.sideMarginSpacing, data.sideMarginSpacing],
            backgroundColor: ['#10b981', '#3b82f6', '#3b82f6']
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
    } else if (currentTab === 'verticalPlacement') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Frame Top Edge', 'Eye-Level Center', 'Frame Bottom Edge'],
          datasets: [{
            label: 'Height Above Floor (Inches)',
            data: [
              data.frameTopHangingHeight,
              data.targetCenterHeight,
              data.targetCenterHeight - (data.frameHeightInches / 2)
            ],
            backgroundColor: ['#f59e0b', '#6366f1', '#64748b']
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
      wallWidthInches: 120,
      frameCount: 3,
      frameWidthInches: 20,
      frameHeightInches: 24,
      targetCenterHeight: 57
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

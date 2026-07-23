(function() {
  'use strict';

  var chartInstance = null;

  function init() {
    var calcBtn = document.getElementById('btn_calculate');
    var resetBtn = document.getElementById('btn_reset');

    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    var inputs = document.querySelectorAll('.tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function calculate() {
    var lengthFt = parseFloat(document.getElementById('input_roomLengthFt').value) || 16;
    var widthFt = parseFloat(document.getElementById('input_roomWidthFt').value) || 12;
    var openingsWidth = parseFloat(document.getElementById('input_doorwayOpeningsWidthFt').value) || 0;
    var breaksCount = parseInt(document.getElementById('input_doorwayCount').value, 10) || 2;
    var appType = document.getElementById('input_applicationType').value || 'general';
    var extraOutlets = parseInt(document.getElementById('input_extraOutlets').value, 10) || 0;

    var grossPerimeter = 2 * (lengthFt + widthFt);
    var netWall = Math.max(0, grossPerimeter - openingsWidth);

    var segments = Math.max(1, breaksCount);
    var avgSegmentLength = netWall / segments;

    var maxSpacing = (appType === 'kitchen') ? 4 : 12;
    var minWallReq = (appType === 'kitchen') ? 1 : 2;

    var outletsPerSegment = 0;
    if (avgSegmentLength >= minWallReq) {
      outletsPerSegment = Math.max(1, Math.ceil(avgSegmentLength / maxSpacing));
    }

    var baseOutlets = outletsPerSegment * segments;
    var totalOutlets = baseOutlets + extraOutlets;
    var estimatedCableFt = totalOutlets * 20;

    var outGross = document.querySelector('#output_grossPerimeterFeet .output-number');
    var outNet = document.querySelector('#output_netUsableWallFeet .output-number');
    var outCount = document.querySelector('#output_requiredOutletsCount .output-number');
    var outCable = document.querySelector('#output_recommendedCableFeet .output-number');

    if (outGross) outGross.textContent = grossPerimeter.toFixed(1) + ' Feet';
    if (outNet) outNet.textContent = netWall.toFixed(1) + ' Feet';
    if (outCount) outCount.textContent = totalOutlets + ' Duplex Receptacles';
    if (outCable) outCable.textContent = estimatedCableFt + ' Linear Feet';

    updateChart(netWall, openingsWidth, segments, baseOutlets, extraOutlets);

    if (window.logHistory) {
      window.logHistory('outlet-spacing-calculator', {
        roomLengthFt: lengthFt + ' ft',
        roomWidthFt: widthFt + ' ft',
        requiredOutletsCount: totalOutlets + ' receptacles',
        recommendedCableFeet: estimatedCableFt + ' ft'
      });
    }
  }

  function updateChart(netWall, openingsWidth, segments, baseOutlets, extraOutlets) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'outletDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'perimeterBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Usable Outlet Wall Space (ft)', 'Doorway & Opening Deductions (ft)'],
          datasets: [{
            data: [parseFloat(netWall.toFixed(1)), parseFloat(openingsWidth.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Code Minimum Outlets', 'User Added Extra Outlets', 'Total Receptacles Installed'],
          datasets: [{
            label: 'Receptacle Outlets Count',
            data: [baseOutlets, extraOutlets, baseOutlets + extraOutlets],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_roomLengthFt').value = 16;
    document.getElementById('input_roomWidthFt').value = 12;
    document.getElementById('input_doorwayOpeningsWidthFt').value = 6;
    document.getElementById('input_doorwayCount').value = 2;
    document.getElementById('input_applicationType').value = "general";
    document.getElementById('input_extraOutlets').value = 0;
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

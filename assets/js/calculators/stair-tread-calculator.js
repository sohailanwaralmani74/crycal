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
    var risersCount = parseInt(document.getElementById('input_numberOfRisers').value, 10) || 0;
    var widthInches = parseFloat(document.getElementById('input_treadWidthInches').value) || 36;
    var includeRisers = document.getElementById('input_includeRiserVeneer').value;
    var nosingStyle = document.getElementById('input_nosingType').value;
    var openSides = parseInt(document.getElementById('input_openSidesCount').value, 10) || 0;

    var treadsCount = risersCount > 0 ? risersCount - 1 : 0;
    var riserCoversCount = (includeRisers === 'yes') ? risersCount : 0;

    var frontNosingFeet = (treadsCount * widthInches) / 12;
    var sideReturnPieces = openSides * treadsCount;
    var sideReturnFeet = (sideReturnPieces * 11.5) / 12; // 11.5" per return

    var totalNosingFeetNet = frontNosingFeet + sideReturnFeet;
    var totalNosingFeetGross = totalNosingFeetNet * 1.10; // 10% waste

    var landingTreadFeet = widthInches / 12;

    var outTreads = document.querySelector('#output_treadCapsCount .output-number');
    var outRisers = document.querySelector('#output_riserCoversCount .output-number');
    var outNosing = document.querySelector('#output_nosingTrimLinearFeet .output-number');
    var outLanding = document.querySelector('#output_landingTreadLinearFeet .output-number');

    if (outTreads) outTreads.textContent = treadsCount + ' Tread Caps (' + widthInches + '" width)';
    if (outRisers) outRisers.textContent = riserCoversCount + ' Riser Covers (' + (includeRisers === 'yes' ? 'Matching Veneer' : 'Painted Existing') + ')';
    if (outNosing) outNosing.textContent = totalNosingFeetGross.toFixed(1) + ' linear ft (Front: ' + frontNosingFeet.toFixed(1) + ' ft, Side Returns: ' + sideReturnFeet.toFixed(1) + ' ft)';
    if (outLanding) outLanding.textContent = landingTreadFeet.toFixed(1) + ' linear ft (1 piece @ ' + widthInches + '")';

    updateChart(treadsCount, riserCoversCount, frontNosingFeet, sideReturnFeet);

    if (window.logHistory) {
      window.logHistory('stair-tread-calculator', {
        numberOfRisers: risersCount,
        treadWidthInches: widthInches + '"',
        treadCapsCount: treadsCount + ' Treads',
        riserCoversCount: riserCoversCount + ' Covers',
        nosingTrimLinearFeet: totalNosingFeetGross.toFixed(1) + ' ft',
        landingTreadLinearFeet: landingTreadFeet.toFixed(1) + ' ft'
      });
    }
  }

  function updateChart(treads, risers, frontFeet, sideFeet) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'treadVsRiserCount';

    var ctx = canvas.getContext('2d');
    if (tabId === 'trimLengthBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Front Nosing (ft)', 'Mitered Side Returns (ft)'],
          datasets: [{
            label: 'Linear Feet',
            data: [
              parseFloat(frontFeet.toFixed(1)),
              parseFloat(sideFeet.toFixed(1))
            ],
            backgroundColor: ['#4A90E2', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Tread Cap Boards', 'Riser Veneer Covers'],
          datasets: [{
            data: [treads, risers],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
    document.getElementById('input_numberOfRisers').value = 13;
    document.getElementById('input_treadWidthInches').value = 36;
    document.getElementById('input_includeRiserVeneer').value = "yes";
    document.getElementById('input_nosingType').value = "bullnose";
    document.getElementById('input_openSidesCount').value = "1";
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

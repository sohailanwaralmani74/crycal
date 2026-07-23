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
    var length = parseFloat(document.getElementById('input_structureLength').value) || 0;
    var width = parseFloat(document.getElementById('input_structureWidth').value) || 0;
    var postSize = document.getElementById('input_postSize').value || '6x6';
    var beamSize = document.getElementById('input_beamSize').value || 'double_2x10';
    var rafterSpacing = parseFloat(document.getElementById('input_rafterSpacing').value) || 16;
    var slatSpacing = parseFloat(document.getElementById('input_slatSpacing').value) || 6;
    var pricePerPost = parseFloat(document.getElementById('input_pricePerPost').value) || 0;
    var pricePerBoardFt = parseFloat(document.getElementById('input_pricePerBoardFt').value) || 0;

    var numPosts = 4;
    if (length > 16 || width > 16) numPosts = 6;
    if (length > 24 && width > 24) numPosts = 8;

    var numBeams = 2;
    if (width > 16) numBeams = 4;
    var beamLengthFt = length + 2; // 1 ft overhang each end

    var rafterCount = Math.ceil((length * 12) / rafterSpacing) + 1;
    var rafterLengthFt = width + 2; // 1 ft overhang each end

    var slatCount = Math.ceil((width * 12) / slatSpacing) + 1;
    var slatLengthFt = length + 2;

    var concreteBags = numPosts * 3; // 3 bags 80lb concrete per post

    var totalPostLinearFt = numPosts * 10; // 10 ft post length
    var totalBeamLinearFt = numBeams * beamLengthFt;
    var totalRafterLinearFt = rafterCount * rafterLengthFt;
    var totalSlatLinearFt = slatCount * slatLengthFt;

    var costPosts = numPosts * pricePerPost;
    var costLumber = (totalBeamLinearFt + totalRafterLinearFt + (totalSlatLinearFt * 0.5)) * pricePerBoardFt;
    var costConcrete = concreteBags * 6.50;
    var totalCost = costPosts + costLumber + costConcrete;

    var outPosts = document.querySelector('#output_totalPosts .output-number');
    var outBeams = document.querySelector('#output_mainBeams .output-number');
    var outRafters = document.querySelector('#output_raftersNeeded .output-number');
    var outSlats = document.querySelector('#output_shadeSlats .output-number');
    var outConcrete = document.querySelector('#output_postConcreteBags .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outPosts) outPosts.textContent = numPosts + ' Posts (' + postSize + ' x 10ft)';
    if (outBeams) outBeams.textContent = numBeams + ' Beams (' + beamLengthFt + ' ft length)';
    if (outRafters) outRafters.textContent = rafterCount + ' Rafters (' + rafterLengthFt + ' ft length @ ' + rafterSpacing + '" o.c.)';
    if (outSlats) outSlats.textContent = slatCount + ' Shade Slats (' + slatLengthFt + ' ft length @ ' + slatSpacing + '" o.c.)';
    if (outConcrete) outConcrete.textContent = concreteBags + ' bags (80 lb concrete mix)';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(numPosts, numBeams, rafterCount, slatCount, costPosts, costLumber, costConcrete);

    if (window.logHistory) {
      window.logHistory('pergola-gazebo-calculator', {
        dimensions: length + ' x ' + width + ' ft',
        postSize: postSize,
        totalPosts: numPosts + ' posts',
        raftersNeeded: rafterCount + ' rafters',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(numPosts, numBeams, rafterCount, slatCount, costPosts, costLumber, costConcrete) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'lumberBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costDistribution') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Posts Cost ', 'Beams & Framing Lumber ', 'Concrete Footings '],
          datasets: [{
            data: [
              parseFloat(costPosts.toFixed(2)),
              parseFloat(costLumber.toFixed(2)),
              parseFloat(costConcrete.toFixed(2))
            ],
            backgroundColor: ['#D35400', '#2980B9', '#27AE60']
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
          labels: ['Support Posts', 'Main Beams', 'Roof Rafters', 'Shade Slats'],
          datasets: [{
            label: 'Piece Count',
            data: [numPosts, numBeams, rafterCount, slatCount],
            backgroundColor: ['#D35400', '#2980B9', '#8E44AD', '#27AE60']
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
    document.getElementById('input_structureLength').value = 12;
    document.getElementById('input_structureWidth').value = 12;
    document.getElementById('input_postSize').value = '6x6';
    document.getElementById('input_beamSize').value = 'double_2x10';
    document.getElementById('input_rafterSpacing').value = '16';
    document.getElementById('input_slatSpacing').value = '6';
    document.getElementById('input_pricePerPost').value = 45.00;
    document.getElementById('input_pricePerBoardFt').value = 3.50;
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

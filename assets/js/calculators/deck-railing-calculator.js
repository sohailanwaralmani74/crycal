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
    var railingLength = parseFloat(document.getElementById('input_railingLength').value) || 0;
    var balusterWidth = parseFloat(document.getElementById('input_balusterWidth').value) || 1.5;
    var maxSpacing = parseFloat(document.getElementById('input_maxSpacing').value) || 3.75;
    var postSpacingLimit = parseFloat(document.getElementById('input_postSpacing').value) || 6;
    var pricePerBaluster = parseFloat(document.getElementById('input_pricePerBaluster').value) || 0;
    var pricePerPost = parseFloat(document.getElementById('input_pricePerPost').value) || 0;
    var pricePerRailFt = parseFloat(document.getElementById('input_pricePerRailFt').value) || 0;

    var numSections = Math.ceil(railingLength / postSpacingLimit);
    var totalPosts = numSections + 1;

    var postWidthInches = 3.5; // 4x4 nominal post is 3.5"
    var totalPostWidthInches = totalPosts * postWidthInches;

    var netRailInches = Math.max(0, (railingLength * 12) - totalPostWidthInches);
    var clearSectionInches = netRailInches / (numSections || 1);

    var balusterCountPerSection = Math.ceil((clearSectionInches - maxSpacing) / (balusterWidth + maxSpacing));
    if (balusterCountPerSection < 1) balusterCountPerSection = 1;

    var totalBalusters = balusterCountPerSection * numSections;

    var exactGapInches = (clearSectionInches - (balusterCountPerSection * balusterWidth)) / (balusterCountPerSection + 1);
    if (exactGapInches < 0) exactGapInches = 0;

    var railLinearFeet = railingLength * 2; // Top & bottom rail

    var costBalusters = totalBalusters * pricePerBaluster;
    var costPosts = totalPosts * pricePerPost;
    var costRails = railLinearFeet * pricePerRailFt;
    var totalCost = costBalusters + costPosts + costRails;

    var outBalusters = document.querySelector('#output_totalBalusters .output-number');
    var outGap = document.querySelector('#output_balusterGap .output-number');
    var outPosts = document.querySelector('#output_totalPosts .output-number');
    var outRailFt = document.querySelector('#output_railLinearFeet .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outBalusters) outBalusters.textContent = totalBalusters.toLocaleString() + ' balusters';
    if (outGap) outGap.textContent = exactGapInches.toFixed(2) + ' inches (Code compliant < 4.0")';
    if (outPosts) outPosts.textContent = totalPosts + ' posts (' + numSections + ' sections @ ~' + (railingLength / numSections).toFixed(1) + ' ft)';
    if (outRailFt) outRailFt.textContent = railLinearFeet.toLocaleString() + ' lin ft';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(totalBalusters, totalPosts, railLinearFeet, costBalusters, costPosts, costRails);

    if (window.logHistory) {
      window.logHistory('deck-railing-calculator', {
        railingLength: railingLength + ' ft',
        balusterWidth: balusterWidth + ' in',
        totalBalusters: totalBalusters + ' balusters',
        totalPosts: totalPosts + ' posts',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(totalBalusters, totalPosts, railLinearFeet, costBalusters, costPosts, costRails) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'materialQuantities';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Balusters Cost ', 'Posts Cost ', 'Top/Bottom Rails Cost '],
          datasets: [{
            data: [
              parseFloat(costBalusters.toFixed(2)),
              parseFloat(costPosts.toFixed(2)),
              parseFloat(costRails.toFixed(2))
            ],
            backgroundColor: ['#0984E3', '#6C5CE7', '#00CEC9']
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
          labels: ['Balusters Count', 'Support Posts', 'Rail Length (lin ft)'],
          datasets: [{
            label: 'Quantity',
            data: [totalBalusters, totalPosts, railLinearFeet],
            backgroundColor: ['#0984E3', '#6C5CE7', '#00CEC9']
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
    document.getElementById('input_railingLength').value = 40;
    document.getElementById('input_balusterWidth').value = 1.5;
    document.getElementById('input_maxSpacing').value = 3.75;
    document.getElementById('input_postSpacing').value = '6';
    document.getElementById('input_pricePerBaluster').value = 2.50;
    document.getElementById('input_pricePerPost').value = 22.00;
    document.getElementById('input_pricePerRailFt').value = 4.00;
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

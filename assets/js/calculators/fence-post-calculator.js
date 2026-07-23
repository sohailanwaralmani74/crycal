(function() {
  'use strict';

  var chartInstance = null;

  function getGlobalCurrency() {
    var picker = document.getElementById('globalCurrencyPicker');
    return picker ? picker.value : 'USD';
  }

  function formatCurrency(val) {
    var curr = getGlobalCurrency();
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(2);
    }
  }

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

    var currPicker = document.getElementById('globalCurrencyPicker');
    if (currPicker) currPicker.addEventListener('change', calculate);

    calculate();
  }

  function calculate() {
    var fenceLen = parseFloat(document.getElementById('input_fenceLengthFt').value) || 0;
    var spacing = parseFloat(document.getElementById('input_postSpacingFt').value) || 1;
    var corners = parseInt(document.getElementById('input_cornerPostsCount').value, 10) || 0;
    var gates = parseInt(document.getElementById('input_gatePostsCount').value, 10) || 0;
    var bagsPerPost = parseFloat(document.getElementById('input_bagsPerPost').value) || 0;
    var postPrice = parseFloat(document.getElementById('input_costPerPost').value) || 0;
    var bagPrice = parseFloat(document.getElementById('input_costPerBag').value) || 0;

    var sections = Math.ceil(fenceLen / spacing);
    var basePosts = sections + 1;
    var totalPosts = basePosts + gates;

    var cornerAndGates = corners + gates;
    var linePosts = Math.max(0, totalPosts - cornerAndGates);

    var totalBags = Math.ceil(totalPosts * bagsPerPost);

    var postsCost = totalPosts * postPrice;
    var concreteCost = totalBags * bagPrice;
    var totalCost = postsCost + concreteCost;

    var outTotalPosts = document.querySelector('#output_totalFencePosts .output-number');
    var outLinePosts = document.querySelector('#output_totalLinePosts .output-number');
    var outCornerGates = document.querySelector('#output_totalCornerGatePosts .output-number');
    var outBags = document.querySelector('#output_totalConcreteBagsNeeded .output-number');
    var outCost = document.querySelector('#output_totalPostProjectCost .output-number');

    if (outTotalPosts) outTotalPosts.textContent = totalPosts + ' Posts';
    if (outLinePosts) outLinePosts.textContent = linePosts + ' Line Posts';
    if (outCornerGates) outCornerGates.textContent = cornerAndGates + ' Special Posts';
    if (outBags) outBags.textContent = totalBags + ' Concrete Bags';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(postsCost, concreteCost, linePosts, cornerAndGates);

    if (window.logHistory) {
      window.logHistory('fence-post-calculator', {
        fenceLengthFt: fenceLen + ' ft',
        postSpacingFt: spacing + ' ft',
        totalFencePosts: totalPosts + ' Posts',
        totalConcreteBagsNeeded: totalBags + ' Bags',
        totalPostProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(postsCost, concreteCost, linePosts, cornerAndGates) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'postTypesTab') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Line Posts', 'Corner & Gate Posts'],
          datasets: [{
            label: 'Post Count',
            data: [linePosts, cornerAndGates],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
          labels: ['Timber/Steel Posts Cost', 'Concrete Bags Cost'],
          datasets: [{
            data: [parseFloat(postsCost.toFixed(2)), parseFloat(concreteCost.toFixed(2))],
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
    document.getElementById('input_fenceLengthFt').value = 150;
    document.getElementById('input_postSpacingFt').value = 8;
    document.getElementById('input_cornerPostsCount').value = 4;
    document.getElementById('input_gatePostsCount').value = 2;
    document.getElementById('input_bagsPerPost').value = 1.5;
    document.getElementById('input_costPerPost').value = 18.00;
    document.getElementById('input_costPerBag').value = 6.50;
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

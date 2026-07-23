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
    var lengthFt = parseFloat(document.getElementById('input_deckLengthFt').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_deckWidthFt').value) || 0;
    var spacingFt = parseFloat(document.getElementById('input_postSpacingFt').value) || 1;
    var diaIn = parseFloat(document.getElementById('input_footingDiameterIn').value) || 0;
    var depthIn = parseFloat(document.getElementById('input_footingDepthIn').value) || 0;
    var postH = parseFloat(document.getElementById('input_postHeightFt').value) || 0;
    var bagPrice = parseFloat(document.getElementById('input_costPerBag').value) || 0;
    var postPrice = parseFloat(document.getElementById('input_costPerPost').value) || 0;

    var postsX = Math.ceil(lengthFt / spacingFt) + 1;
    var postsY = Math.ceil(widthFt / spacingFt) + 1;
    var totalPosts = postsX * postsY;

    var radiusFt = (diaIn / 2) / 12;
    var depthFt = depthIn / 12;
    var singlePierVolCuFt = Math.PI * Math.pow(radiusFt, 2) * depthFt;
    var netTotalCuFt = singlePierVolCuFt * totalPosts;
    var grossTotalCuFt = netTotalCuFt * 1.10; // 10% waste
    var grossTotalCuYd = grossTotalCuFt / 27;

    var bags80lb = Math.ceil(grossTotalCuFt / 0.60);
    var totalLinearFt = totalPosts * postH;

    var concreteCost = bags80lb * bagPrice;
    var postsCost = totalPosts * postPrice;
    var totalCost = concreteCost + postsCost;

    var outFootings = document.querySelector('#output_totalFootingsCount .output-number');
    var outBags = document.querySelector('#output_totalConcreteBags .output-number');
    var outYards = document.querySelector('#output_totalConcreteYards .output-number');
    var outLinearFt = document.querySelector('#output_totalPostLinearFeet .output-number');
    var outCost = document.querySelector('#output_totalFootingPostCost .output-number');

    if (outFootings) outFootings.textContent = totalPosts + ' Footings';
    if (outBags) outBags.textContent = bags80lb + ' Bags (80 lb)';
    if (outYards) outYards.textContent = grossTotalCuYd.toFixed(2) + ' cu yd';
    if (outLinearFt) outLinearFt.textContent = totalLinearFt + ' linear ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(concreteCost, postsCost, bags80lb, totalPosts);

    if (window.logHistory) {
      window.logHistory('deck-footing-post-calculator', {
        deckLengthFt: lengthFt + ' ft',
        deckWidthFt: widthFt + ' ft',
        totalFootingsCount: totalPosts + ' Posts',
        totalConcreteBags: bags80lb + ' Bags',
        totalFootingPostCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(concreteCost, postsCost, bags, posts) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'volumeBagTab') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Footings', '80 lb Concrete Bags'],
          datasets: [{
            label: 'Quantity',
            data: [posts, bags],
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
          labels: ['Concrete Material Cost', 'Timber Posts Cost'],
          datasets: [{
            data: [parseFloat(concreteCost.toFixed(2)), parseFloat(postsCost.toFixed(2))],
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
    document.getElementById('input_deckLengthFt').value = 20;
    document.getElementById('input_deckWidthFt').value = 15;
    document.getElementById('input_postSpacingFt').value = 8;
    document.getElementById('input_footingDiameterIn').value = 12;
    document.getElementById('input_footingDepthIn').value = 36;
    document.getElementById('input_postHeightFt').value = 6;
    document.getElementById('input_costPerBag').value = 6.50;
    document.getElementById('input_costPerPost').value = 28.00;
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

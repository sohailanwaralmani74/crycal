/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Credit Score Simulator
   Tool ID: credit-score-simulator
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'factorImpact';

  // ── Get Inputs ──
  function getInputs() {
    return {
      baseScore: parseFloat(document.getElementById('input_baseScore').value) || 700,
      paymentHistory: parseFloat(document.getElementById('input_paymentHistory').value) || 98,
      creditUtilization: parseFloat(document.getElementById('input_creditUtilization').value) || 30,
      creditAge: parseFloat(document.getElementById('input_creditAge').value) || 8,
      inquiries: parseFloat(document.getElementById('input_inquiries').value) || 2,
      accountMix: document.getElementById('input_accountMix').value || 'good'
    };
  }

  // ── Score each factor ──
  function scorePaymentHistory(pct) {
    if (pct >= 100) return 100;
    if (pct >= 99) return 95;
    if (pct >= 97) return 85;
    if (pct >= 95) return 75;
    if (pct >= 90) return 60;
    if (pct >= 80) return 40;
    if (pct >= 70) return 20;
    return 10;
  }

  function scoreUtilization(pct) {
    if (pct <= 10) return 100;
    if (pct <= 20) return 90;
    if (pct <= 30) return 80;
    if (pct <= 40) return 65;
    if (pct <= 50) return 50;
    if (pct <= 70) return 30;
    if (pct <= 90) return 15;
    return 5;
  }

  function scoreCreditAge(years) {
    if (years >= 15) return 100;
    if (years >= 10) return 85;
    if (years >= 7) return 70;
    if (years >= 5) return 55;
    if (years >= 3) return 35;
    if (years >= 1) return 20;
    return 10;
  }

  function scoreInquiries(count) {
    if (count <= 0) return 100;
    if (count <= 1) return 90;
    if (count <= 2) return 75;
    if (count <= 3) return 60;
    if (count <= 5) return 40;
    if (count <= 8) return 20;
    return 10;
  }

  function scoreAccountMix(mix) {
    var map = {
      'excellent': 100,
      'good': 80,
      'average': 55,
      'poor': 25
    };
    return map[mix] || 50;
  }

  // ── Calculate Simulated Score ──
  function calculateScore(inputs) {
    var pScore = scorePaymentHistory(inputs.paymentHistory);
    var uScore = scoreUtilization(inputs.creditUtilization);
    var aScore = scoreCreditAge(inputs.creditAge);
    var iScore = scoreInquiries(inputs.inquiries);
    var mScore = scoreAccountMix(inputs.accountMix);

    // Weighted average
    var weightedScore = (pScore * 0.35) + (uScore * 0.30) + (aScore * 0.15) + (iScore * 0.10) + (mScore * 0.10);

    // Map to 300-850 range
    var simulatedScore = 300 + (weightedScore / 100) * 550;

    // Round to nearest integer
    simulatedScore = Math.round(simulatedScore);

    // Base score influence (simulate small drift from current score)
    var baseWeight = 0.3;
    var finalScore = Math.round((simulatedScore * (1 - baseWeight)) + (inputs.baseScore * baseWeight));

    // Clamp
    finalScore = Math.max(300, Math.min(850, finalScore));

    // Score category
    var category = 'Poor';
    if (finalScore >= 800) category = 'Excellent';
    else if (finalScore >= 740) category = 'Very Good';
    else if (finalScore >= 670) category = 'Good';
    else if (finalScore >= 580) category = 'Fair';

    var change = finalScore - inputs.baseScore;

    return {
      finalScore: finalScore,
      change: change,
      category: category,
      pScore: pScore,
      uScore: uScore,
      aScore: aScore,
      iScore: iScore,
      mScore: mScore,
      weightedScore: weightedScore
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  // ── Format Percentage ──
  function formatPercentage(value) {
    return value.toFixed(0) + '%';
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateScore(inputs);

    document.getElementById('output_simulatedScore').querySelector('.output-number').textContent = result.finalScore;
    document.getElementById('output_scoreChange').querySelector('.output-number').textContent = (result.change >= 0 ? '+' : '') + result.change;
    document.getElementById('output_scoreCategory').querySelector('.output-number').textContent = result.category;
    document.getElementById('output_paymentHistoryScore').querySelector('.output-number').textContent = result.pScore + '%';
    document.getElementById('output_utilizationScore').querySelector('.output-number').textContent = result.uScore + '%';
    document.getElementById('output_creditAgeScore').querySelector('.output-number').textContent = result.aScore + '%';

    // ── Charts ──
    updateCharts({
      result: result,
      inputs: inputs
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        baseScore: inputs.baseScore,
        simulatedScore: result.finalScore,
        scoreChange: result.change,
        scoreCategory: result.category
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    var result = data.result;
    var inputs = data.inputs;
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    if (tab === 'factorImpact') {
      // Bar chart showing each factor's score
      var factorLabels = ['Payment History', 'Utilization', 'Credit Age', 'Inquiries', 'Account Mix'];
      var factorScores = [result.pScore, result.uScore, result.aScore, result.iScore, result.mScore];
      var colors = ['#2F6F5E', '#C08A2E', '#4A90D9', '#8E44AD', '#B23A3A'];

      return {
        type: 'bar',
        data: {
          labels: factorLabels,
          datasets: [{
            label: 'Factor Score (%)',
            data: factorScores,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Factor Impact on Your Credit Score', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: 'Score (%)' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      // Doughnut chart showing weighted contribution
      var weights = [
        { label: 'Payment History (35%)', value: result.pScore * 0.35 },
        { label: 'Utilization (30%)', value: result.uScore * 0.30 },
        { label: 'Credit Age (15%)', value: result.aScore * 0.15 },
        { label: 'Inquiries (10%)', value: result.iScore * 0.10 },
        { label: 'Account Mix (10%)', value: result.mScore * 0.10 }
      ];

      var labels = weights.map(function(w) { return w.label; });
      var values = weights.map(function(w) { return w.value; });
      var colors = ['#2F6F5E', '#C08A2E', '#4A90D9', '#8E44AD', '#B23A3A'];

      // Filter out zero values
      var filtered = weights.filter(function(w, i) { return values[i] > 0; });
      var filteredLabels = filtered.map(function(w) { return w.label; });
      var filteredValues = filtered.map(function(w) { return w.value; });
      var filteredColors = colors.slice(0, filtered.length);

      return {
        type: 'doughnut',
        data: {
          labels: filteredLabels,
          datasets: [{
            data: filteredValues,
            backgroundColor: filteredColors,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Weighted Score Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + value.toFixed(1) + ' (' + pct + '%)';
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'projection') {
      // Line chart showing score improvement over 12 months with small monthly gains
      var currentScore = result.finalScore;
      var labels = [];
      var dataPoints = [];

      for (var i = 0; i <= 12; i++) {
        labels.push(i + 'm');
        // Simulate gradual improvement if possible
        var improvement = 0;
        if (result.pScore < 100) improvement += (100 - result.pScore) * 0.01;
        if (result.uScore < 100) improvement += (100 - result.uScore) * 0.008;
        if (result.aScore < 100) improvement += (100 - result.aScore) * 0.005;
        // Cap improvement
        var maxImprove = 100 - (currentScore - 300) / 5.5;
        var score = currentScore + Math.min(improvement * i * 0.5, maxImprove);
        dataPoints.push(Math.min(850, Math.max(300, Math.round(score))));
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Projected Score',
            data: dataPoints,
            borderColor: '#C08A2E',
            backgroundColor: 'rgba(192, 138, 46, 0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#C08A2E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Score Projection (12 Months)', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: Math.max(300, Math.min(800, currentScore - 50)),
              max: Math.min(850, Math.max(800, currentScore + 50)),
              title: { display: true, text: 'Credit Score' }
            },
            x: {
              title: { display: true, text: 'Time' }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_baseScore').value = 700;
    document.getElementById('input_paymentHistory').value = 98.0;
    document.getElementById('input_creditUtilization').value = 30.0;
    document.getElementById('input_creditAge').value = 8;
    document.getElementById('input_inquiries').value = 2;
    document.getElementById('input_accountMix').value = 'good';
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });
    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);
    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
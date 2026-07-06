/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Kelly Criterion Calculator
   Tool ID: kelly-criterion
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      winProbability: parseFloat(document.getElementById('input_winProbability').value) || 0,
      winLossRatio: parseFloat(document.getElementById('input_winLossRatio').value) || 0,
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      fractionalKelly: parseFloat(document.getElementById('input_fractionalKelly').value) || 100,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'monthly'
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    var p = inputs.winProbability / 100;
    var q = 1 - p;
    var b = inputs.winLossRatio;
    var balance = inputs.accountBalance;
    var fractional = inputs.fractionalKelly / 100;

    // ── Kelly Fraction ──
    var kellyFraction = 0;
    if (b > 0) {
      kellyFraction = (b * p - q) / b;
    }
    // Ensure positive (if negative, don't bet)
    kellyFraction = Math.max(0, kellyFraction);

    // ── Optimal Bet Size ──
    var optimalBetSize = kellyFraction * fractional * 100;

    // ── Optimal Amount ──
    var optimalAmount = balance * (optimalBetSize / 100);

    // ── Expected Growth Rate ──
    var expectedGrowthRate = 0;
    var f = kellyFraction * fractional;
    if (f > 0 && f < 1) {
      expectedGrowthRate = (p * Math.log(1 + b * f) + q * Math.log(1 - f)) * 100;
    } else if (f === 1 && p > 0) {
      expectedGrowthRate = p * Math.log(1 + b) * 100;
    }

    // ── Half-Kelly and Quarter-Kelly ──
    var halfKellyAmount = balance * ((kellyFraction * 0.5) * 100) / 100;
    var quarterKellyAmount = balance * ((kellyFraction * 0.25) * 100) / 100;

    // ── Update Outputs ──
    document.getElementById('output_kellyFraction').querySelector('.output-number').textContent = (kellyFraction * 100).toFixed(2) + '%';
    document.getElementById('output_optimalBetSize').querySelector('.output-number').textContent = optimalBetSize.toFixed(2) + '%';
    document.getElementById('output_optimalAmount').querySelector('.output-number').textContent = formatCurrency(optimalAmount);
    document.getElementById('output_expectedGrowthRate').querySelector('.output-number').textContent = expectedGrowthRate.toFixed(2) + '%';
    document.getElementById('output_halfKellyAmount').querySelector('.output-number').textContent = formatCurrency(halfKellyAmount);
    document.getElementById('output_quarterKellyAmount').querySelector('.output-number').textContent = formatCurrency(quarterKellyAmount);

    // ── Charts ──
    updateCharts({
      kellyFraction: kellyFraction,
      fractionalKelly: fractional,
      optimalAmount: optimalAmount,
      halfKellyAmount: halfKellyAmount,
      quarterKellyAmount: quarterKellyAmount,
      accountBalance: balance,
      expectedGrowthRate: expectedGrowthRate,
      p: p,
      b: b,
      q: q
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        winProbability: inputs.winProbability,
        winLossRatio: inputs.winLossRatio,
        optimalBetSize: optimalBetSize,
        optimalAmount: optimalAmount
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
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    if (tab === 'comparison') {
      // Amount comparison: Full Kelly vs Half vs Quarter
      var fullAmount = data.optimalAmount;
      var halfAmount = data.halfKellyAmount;
      var quarterAmount = data.quarterKellyAmount;

      return {
        type: 'bar',
        data: {
          labels: ['Full Kelly', 'Half Kelly', 'Quarter Kelly'],
          datasets: [{
            label: 'Amount to Risk',
            data: [fullAmount, halfAmount, quarterAmount],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#4A90D9'],
            borderColor: ['#A87520', '#1f4f42', '#3a7b8c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Kelly Bet Sizes', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
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
    document.getElementById('input_winProbability').value = 55.0;
    document.getElementById('input_winLossRatio').value = 1.5;
    document.getElementById('input_accountBalance').value = 10000;
    document.getElementById('input_fractionalKelly').value = 100;
    document.getElementById('input_compoundingFrequency').value = 'monthly';
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
  });

})();
/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Credit Limit Calculator
   Tool ID: credit-limit-calculator
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      annualIncome: parseFloat(document.getElementById('input_annualIncome').value) || 0,
      monthlyDebts: parseFloat(document.getElementById('input_monthlyDebts').value) || 0,
      creditScore: parseFloat(document.getElementById('input_creditScore').value) || 700,
      existingCreditLimit: parseFloat(document.getElementById('input_existingCreditLimit').value) || 0,
      creditUtilization: parseFloat(document.getElementById('input_creditUtilization').value) || 30
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
      return getCurrencySymbol(code) + amount.toFixed(0);
    }
  }

  // ── Format Percentage ──
  function formatPercentage(value) {
    return value.toFixed(1) + '%';
  }

  // ── Calculate DTI ──
  function calculateDTI(income, monthlyDebts) {
    if (income <= 0) return 0;
    var monthlyIncome = income / 12;
    return (monthlyDebts / monthlyIncome) * 100;
  }

  // ── Calculate Credit Score Multiplier ──
  function getScoreMultiplier(score) {
    if (score >= 800) return 1.8;
    if (score >= 740) return 1.5;
    if (score >= 700) return 1.2;
    if (score >= 670) return 1.0;
    if (score >= 580) return 0.7;
    return 0.4;
  }

  // ── Calculate DTI Multiplier ──
  function getDTIMultiplier(dti) {
    if (dti <= 20) return 1.4;
    if (dti <= 30) return 1.2;
    if (dti <= 40) return 1.0;
    if (dti <= 50) return 0.7;
    return 0.4;
  }

  // ── Calculate Existing Credit Multiplier ──
  function getExistingCreditMultiplier(existing, income) {
    if (existing <= 0) return 1.0;
    var ratio = existing / income;
    if (ratio <= 0.1) return 1.1;
    if (ratio <= 0.2) return 1.0;
    if (ratio <= 0.4) return 0.8;
    if (ratio <= 0.6) return 0.6;
    return 0.4;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    var dti = calculateDTI(inputs.annualIncome, inputs.monthlyDebts);

    // Income-based limit (base: 20-30% of annual income)
    var incomeBase = inputs.annualIncome * 0.25;

    // Score multiplier
    var scoreMult = getScoreMultiplier(inputs.creditScore);

    // DTI multiplier
    var dtiMult = getDTIMultiplier(dti);

    // Existing credit multiplier
    var existingMult = getExistingCreditMultiplier(inputs.existingCreditLimit, inputs.annualIncome);

    // Utilization adjustment (higher utilization = slightly lower limit)
    var utilAdj = 1 - (inputs.creditUtilization / 100) * 0.15;

    // Base estimate
    var baseEstimate = incomeBase * scoreMult * dtiMult * existingMult * utilAdj;

    // Clamp to reasonable range
    var estimatedLimit = Math.max(0, Math.round(baseEstimate / 100) * 100);

    // Low and high estimates (±30%)
    var lowEstimate = Math.max(0, Math.round((estimatedLimit * 0.7) / 100) * 100);
    var highEstimate = Math.round((estimatedLimit * 1.3) / 100) * 100;

    // Income-based limit (what income alone suggests)
    var incomeBased = Math.round((inputs.annualIncome * 0.30 * utilAdj) / 100) * 100;

    // Credit-based limit (what credit score alone suggests)
    var creditBased = Math.round((5000 * scoreMult * existingMult) / 100) * 100;

    // ── Outputs ──
    document.getElementById('output_estimatedLimit').querySelector('.output-number').textContent = formatCurrency(estimatedLimit);
    document.getElementById('output_lowEstimate').querySelector('.output-number').textContent = formatCurrency(lowEstimate);
    document.getElementById('output_highEstimate').querySelector('.output-number').textContent = formatCurrency(highEstimate);
    document.getElementById('output_incomeBasedLimit').querySelector('.output-number').textContent = formatCurrency(incomeBased);
    document.getElementById('output_creditBasedLimit').querySelector('.output-number').textContent = formatCurrency(creditBased);
    document.getElementById('output_dtiRatio').querySelector('.output-number').textContent = formatPercentage(dti);

    // ── Charts ──
    updateCharts({
      estimatedLimit: estimatedLimit,
      lowEstimate: lowEstimate,
      highEstimate: highEstimate,
      incomeBased: incomeBased,
      creditBased: creditBased,
      dti: dti,
      score: inputs.creditScore,
      income: inputs.annualIncome,
      existingCredit: inputs.existingCreditLimit,
      utilization: inputs.creditUtilization
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        annualIncome: inputs.annualIncome,
        creditScore: inputs.creditScore,
        estimatedLimit: estimatedLimit,
        dtiRatio: dti
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

    if (tab === 'breakdown') {
      // Donut chart: Low, Mid, High
      var low = data.lowEstimate;
      var mid = data.estimatedLimit - data.lowEstimate;
      var high = data.highEstimate - data.estimatedLimit;

      return {
        type: 'doughnut',
        data: {
          labels: ['Low Estimate', 'Mid Range', 'High Estimate'],
          datasets: [{
            data: [low, mid, high],
            backgroundColor: ['#B23A3A', '#C08A2E', '#2F6F5E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Credit Limit Range', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  return label + ': ' + currencySymbol + value.toFixed(0);
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      // Bar chart: Different limit calculations
      return {
        type: 'bar',
        data: {
          labels: ['Estimated Limit', 'Income-Based', 'Credit-Based'],
          datasets: [{
            label: 'Credit Limit',
            data: [data.estimatedLimit, data.incomeBased, data.creditBased],
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
            title: { display: true, text: 'Credit Limit Comparison', font: { size: 14 } }
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
    document.getElementById('input_annualIncome').value = 75000;
    document.getElementById('input_monthlyDebts').value = 500;
    document.getElementById('input_creditScore').value = 700;
    document.getElementById('input_existingCreditLimit').value = 5000;
    document.getElementById('input_creditUtilization').value = 30.0;
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
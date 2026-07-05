/* ═══════════════════════════════════════════════════════════
   CRYCAL — Disability Insurance Calculator
   Tool ID: disability-insurance
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      currentIncome: parseFloat(document.getElementById('input_currentIncome').value) || 0,
      monthlyExpenses: parseFloat(document.getElementById('input_monthlyExpenses').value) || 0,
      existingSavings: parseFloat(document.getElementById('input_existingSavings').value) || 0,
      employerBenefit: parseFloat(document.getElementById('input_employerBenefit').value) || 0,
      governmentBenefit: parseFloat(document.getElementById('input_governmentBenefit').value) || 0,
      benefitPeriod: parseFloat(document.getElementById('input_benefitPeriod').value) || 0,
      eliminationPeriod: parseFloat(document.getElementById('input_eliminationPeriod').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      investmentReturn: parseFloat(document.getElementById('input_investmentReturn').value) || 0
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

  // ── Main Calculation ──
  function calculateDisabilityInsurance(inputs) {
    // Target income replacement: the lower of current income or expenses
    var targetIncome = Math.min(inputs.currentIncome, inputs.monthlyExpenses);

    // Existing monthly benefits from employer + government
    var employerBenefitAmount = inputs.currentIncome * (inputs.employerBenefit / 100);
    var existingBenefits = employerBenefitAmount + inputs.governmentBenefit;

    // Monthly income gap
    var monthlyGap = Math.max(0, targetIncome - existingBenefits);

    // Benefit period in months
    var benefitMonths = inputs.benefitPeriod * 12;

    // Inflation-adjusted need over the benefit period
    var totalNeed = 0;
    var annualNeed = monthlyGap * 12;
    var infl = inputs.inflationRate / 100;
    var ret = inputs.investmentReturn / 100;
    var realReturn = (1 + ret) / (1 + infl) - 1;

    if (realReturn > 0 && annualNeed > 0) {
      totalNeed = annualNeed * (1 - Math.pow(1 + realReturn, -inputs.benefitPeriod)) / realReturn;
    } else {
      totalNeed = annualNeed * inputs.benefitPeriod;
    }

    // Elimination period need (gap × months)
    var eliminationNeed = monthlyGap * inputs.eliminationPeriod;

    // Deduct existing savings from total need
    var adjustedNeed = Math.max(0, totalNeed - inputs.existingSavings);

    // Recommended monthly benefit (round up to nearest $50)
    var recommendedBenefit = Math.ceil(monthlyGap / 50) * 50;

    return {
      monthlyGap: monthlyGap,
      totalNeed: totalNeed,
      adjustedNeed: adjustedNeed,
      benefitPeriodCoverage: inputs.benefitPeriod,
      eliminationNeed: eliminationNeed,
      recommendedBenefit: recommendedBenefit,
      targetIncome: targetIncome,
      existingBenefits: existingBenefits,
      employerBenefitAmount: employerBenefitAmount
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateDisabilityInsurance(inputs);

    document.getElementById('output_monthlyIncomeGap').querySelector('.output-number').textContent = formatCurrency(result.monthlyGap);
    document.getElementById('output_totalInsuranceNeed').querySelector('.output-number').textContent = formatCurrency(result.adjustedNeed);
    document.getElementById('output_benefitPeriodCoverage').querySelector('.output-number').textContent = result.benefitPeriodCoverage + ' years';
    document.getElementById('output_eliminationPeriodNeed').querySelector('.output-number').textContent = formatCurrency(result.eliminationNeed);
    document.getElementById('output_recommendedCoverage').querySelector('.output-number').textContent = formatCurrency(result.recommendedBenefit) + '/mo';

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        currentIncome: inputs.currentIncome,
        monthlyExpenses: inputs.monthlyExpenses,
        employerBenefit: inputs.employerBenefit,
        governmentBenefit: inputs.governmentBenefit,
        benefitPeriod: inputs.benefitPeriod,
        eliminationPeriod: inputs.eliminationPeriod,
        monthlyGap: result.monthlyGap,
        totalNeed: result.adjustedNeed,
        recommendedBenefit: result.recommendedBenefit
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(result, inputs) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    if (tab === 'breakdown') {
      // Monthly breakdown: Income vs Expenses vs Existing Benefits
      var income = inputs.currentIncome;
      var expenses = inputs.monthlyExpenses;
      var existingBenefits = result.existingBenefits;
      var gap = result.monthlyGap;

      return {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses', 'Existing Benefits', 'Gap'],
          datasets: [{
            label: 'Amount',
            data: [income, expenses, existingBenefits, gap],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A90D9', '#B23A3A'],
            borderColor: ['#1f4f42', '#A87520', '#3a7b8c', '#8a2a2a'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income vs Expenses vs Coverage', font: { size: 14 } }
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

    if (tab === 'comparison') {
      var totalNeed = result.totalNeed;
      var adjustedNeed = result.adjustedNeed;

      return {
        type: 'bar',
        data: {
          labels: ['Total Need', 'Adjusted Need (w/ Savings)'],
          datasets: [{
            label: 'Amount',
            data: [totalNeed, adjustedNeed],
            backgroundColor: ['#C08A2E', '#2F6F5E'],
            borderColor: ['#A87520', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Need vs Adjusted Need', font: { size: 14 } }
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

    if (tab === 'allocation') {
      var income = inputs.currentIncome;
      var expenses = inputs.monthlyExpenses;
      var gap = result.monthlyGap;
      var existing = result.existingBenefits;

      var incomePct = 100;
      var expensePct = expenses / income * 100;
      var gapPct = gap / income * 100;
      var existingPct = existing / income * 100;

      // Cap at 100% for display
      var cappedExpense = Math.min(expensePct, 100);
      var cappedGap = Math.min(gapPct, 100);
      var cappedExisting = Math.min(existingPct, 100);

      return {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses', 'Existing Coverage', 'Gap to Fill'],
          datasets: [{
            label: 'Percentage of Income',
            data: [100, cappedExpense, cappedExisting, cappedGap],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A90D9', '#B23A3A'],
            borderColor: ['#1f4f42', '#A87520', '#3a7b8c', '#8a2a2a'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income Allocation', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 110,
              title: { display: true, text: 'Percentage of Income (%)' }
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
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) el.value = defaultVal;
      else if (el.type !== 'select-one') el.value = '';
    });
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
    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();
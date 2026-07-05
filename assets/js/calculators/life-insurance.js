/* ═══════════════════════════════════════════════════════════
   CRYCAL — Life Insurance Calculator
   Tool ID: life-insurance
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      annualIncome: parseFloat(document.getElementById('input_annualIncome').value) || 0,
      incomeReplacementYears: parseFloat(document.getElementById('input_incomeReplacementYears').value) || 0,
      spouseIncome: parseFloat(document.getElementById('input_spouseIncome').value) || 0,
      mortgageBalance: parseFloat(document.getElementById('input_mortgageBalance').value) || 0,
      otherDebts: parseFloat(document.getElementById('input_otherDebts').value) || 0,
      finalExpenses: parseFloat(document.getElementById('input_finalExpenses').value) || 0,
      childrenEducation: parseFloat(document.getElementById('input_childrenEducation').value) || 0,
      existingSavings: parseFloat(document.getElementById('input_existingSavings').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      investmentReturn: parseFloat(document.getElementById('input_investmentReturn').value) || 0
    };
  }

  // ── Calculate Present Value of Future Income ──
  function calculateIncomeReplacement(annualIncome, spouseIncome, years, investmentReturn, inflationRate) {
    var netIncome = Math.max(0, annualIncome - spouseIncome);
    if (netIncome <= 0 || years <= 0) return 0;

    var realReturn = (1 + investmentReturn / 100) / (1 + inflationRate / 100) - 1;

    if (realReturn <= 0) {
      return netIncome * years;
    }

    return netIncome * (1 - Math.pow(1 + realReturn, -years)) / realReturn;
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
  function calculateLifeInsurance(inputs) {
    var incomeReplacement = calculateIncomeReplacement(
      inputs.annualIncome,
      inputs.spouseIncome,
      inputs.incomeReplacementYears,
      inputs.investmentReturn,
      inputs.inflationRate
    );

    // Debt + Final Expenses (merged into one line item)
    var debtCoverage = inputs.mortgageBalance + inputs.otherDebts + inputs.finalExpenses;
    var educationCoverage = inputs.childrenEducation;

    var totalNeed = incomeReplacement + debtCoverage + educationCoverage;
    var adjustedNeed = Math.max(0, totalNeed - inputs.existingSavings);
    var recommendedCoverage = Math.ceil(adjustedNeed / 10000) * 10000;

    return {
      incomeReplacement: incomeReplacement,
      debtCoverage: debtCoverage,
      educationCoverage: educationCoverage,
      totalNeed: totalNeed,
      adjustedNeed: adjustedNeed,
      recommendedCoverage: recommendedCoverage
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateLifeInsurance(inputs);

    document.getElementById('output_incomeReplacement').querySelector('.output-number').textContent = formatCurrency(result.incomeReplacement);
    document.getElementById('output_debtCoverage').querySelector('.output-number').textContent = formatCurrency(result.debtCoverage);
    document.getElementById('output_educationCoverage').querySelector('.output-number').textContent = formatCurrency(result.educationCoverage);
    document.getElementById('output_totalNeed').querySelector('.output-number').textContent = formatCurrency(result.totalNeed);
    document.getElementById('output_adjustedNeed').querySelector('.output-number').textContent = formatCurrency(result.adjustedNeed);
    document.getElementById('output_recommendedCoverage').querySelector('.output-number').textContent = formatCurrency(result.recommendedCoverage);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        annualIncome: inputs.annualIncome,
        incomeReplacementYears: inputs.incomeReplacementYears,
        spouseIncome: inputs.spouseIncome,
        mortgageBalance: inputs.mortgageBalance,
        otherDebts: inputs.otherDebts,
        finalExpenses: inputs.finalExpenses,
        childrenEducation: inputs.childrenEducation,
        existingSavings: inputs.existingSavings,
        inflationRate: inputs.inflationRate,
        investmentReturn: inputs.investmentReturn,
        totalNeed: result.totalNeed,
        recommendedCoverage: result.recommendedCoverage
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts (unchanged except formatting) ──
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
      var income = result.incomeReplacement;
      var debt = result.debtCoverage;
      var education = result.educationCoverage;

      return {
        type: 'doughnut',
        data: {
          labels: ['Income Replacement', 'Debt & Final Expenses', 'Education'],
          datasets: [{
            data: [income, debt, education],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Life Insurance Need Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(0);
                }
              }
            }
          },
          cutout: '60%'
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
      var total = result.totalNeed;
      var incomePct = total > 0 ? (result.incomeReplacement / total) * 100 : 0;
      var debtPct = total > 0 ? (result.debtCoverage / total) * 100 : 0;
      var eduPct = total > 0 ? (result.educationCoverage / total) * 100 : 0;

      return {
        type: 'bar',
        data: {
          labels: ['Income', 'Debt & Final', 'Education'],
          datasets: [{
            label: 'Percentage of Total Need',
            data: [incomePct, debtPct, eduPct],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#B23A3A'],
            borderColor: ['#A87520', '#1f4f42', '#8a2a2a'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Allocation of Insurance Need', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: 'Percentage (%)' }
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
    // Initial update after DOM ready
    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();
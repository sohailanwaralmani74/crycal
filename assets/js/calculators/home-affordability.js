/* ═══════════════════════════════════════════════════════════
   CRYCAL — Home Affordability Calculator
   Tool ID: home-affordability
   FIX: Compounding frequency now correctly impacts calculations
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      annualIncome: parseFloat(document.getElementById('input_annualIncome').value) || 0,
      monthlyDebts: parseFloat(document.getElementById('input_monthlyDebts').value) || 0,
      downPayment: parseFloat(document.getElementById('input_downPayment').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      propertyTax: parseFloat(document.getElementById('input_propertyTax').value) || 0,
      insurance: parseFloat(document.getElementById('input_insurance').value) || 0,
      hoaFees: parseFloat(document.getElementById('input_hoaFees').value) || 0,
      frontEndRatio: parseFloat(document.getElementById('input_frontEndRatio').value) || 28,
      backEndRatio: parseFloat(document.getElementById('input_backEndRatio').value) || 36,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'daily': 365,
      'monthly': 12,
      'quarterly': 4,
      'semi-annually': 2,
      'annually': 1
    };
    return map[frequency] || 12;
  }

  // ── Calculate Monthly Payment (corrected to use compounding frequency) ──
  function calculateMonthlyPayment(loanAmount, annualRate, loanTerm, n) {
    if (loanAmount <= 0 || annualRate < 0) return 0;
    // Convert annual rate to monthly rate based on compounding frequency
    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    var totalMonths = loanTerm * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // ── Calculate Max Loan Amount (corrected to use compounding frequency) ──
  function calculateMaxLoanAmount(maxMonthlyPayment, annualRate, loanTerm, n) {
    if (maxMonthlyPayment <= 0 || annualRate < 0) return 0;
    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    var totalMonths = loanTerm * 12;
    if (monthlyRate === 0) return maxMonthlyPayment * totalMonths;
    return maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate;
  }

  // ── Main Calculation ──
  function calculateAffordability(inputs) {
    var monthlyIncome = inputs.annualIncome / 12;

    // Front-end limit: max housing payment based on front-end DTI
    var maxHousingPaymentFront = monthlyIncome * (inputs.frontEndRatio / 100);

    // Back-end limit: max total debt payment based on back-end DTI
    var maxTotalDebtPayment = monthlyIncome * (inputs.backEndRatio / 100);
    var maxHousingPaymentBack = maxTotalDebtPayment - inputs.monthlyDebts;

    // Take the lower of the two limits
    var maxHousingPayment = Math.min(maxHousingPaymentFront, maxHousingPaymentBack);
    maxHousingPayment = Math.max(0, maxHousingPayment);

    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    // Subtract taxes, insurance, HOA from housing payment to get max principal & interest
    var monthlyTax = 0;
    var monthlyInsurance = 0;
    var hoa = inputs.hoaFees || 0;

    // Iterative approach to find max home price
    var estimatedHomePrice = inputs.downPayment > 0 ? inputs.downPayment / 0.2 : 300000;
    var maxIterations = 20;

    for (var iter = 0; iter < maxIterations; iter++) {
      monthlyTax = estimatedHomePrice * (inputs.propertyTax / 100) / 12;
      monthlyInsurance = estimatedHomePrice * (inputs.insurance / 100) / 12;
      var totalHousingCosts = monthlyTax + monthlyInsurance + hoa;
      var maxPI = maxHousingPayment - totalHousingCosts;
      if (maxPI < 0) maxPI = 0;

      var maxLoan = calculateMaxLoanAmount(maxPI, inputs.interestRate, inputs.loanTerm, n);
      var newHomePrice = maxLoan + inputs.downPayment;

      if (Math.abs(newHomePrice - estimatedHomePrice) < 1) {
        estimatedHomePrice = newHomePrice;
        break;
      }
      estimatedHomePrice = newHomePrice;
    }

    var finalMonthlyTax = estimatedHomePrice * (inputs.propertyTax / 100) / 12;
    var finalMonthlyInsurance = estimatedHomePrice * (inputs.insurance / 100) / 12;
    var finalHOA = inputs.hoaFees || 0;

    var finalMaxLoan = Math.max(0, estimatedHomePrice - inputs.downPayment);
    var finalMonthlyPI = calculateMonthlyPayment(finalMaxLoan, inputs.interestRate, inputs.loanTerm, n);
    var finalMonthlyPayment = finalMonthlyPI + finalMonthlyTax + finalMonthlyInsurance + finalHOA;

    // Calculate actual DTI ratios with the estimated home price
    var actualFrontEnd = monthlyIncome > 0 ? (finalMonthlyPayment / monthlyIncome) * 100 : 0;
    var actualBackEnd = monthlyIncome > 0 ? ((finalMonthlyPayment + inputs.monthlyDebts) / monthlyIncome) * 100 : 0;

    // Remaining monthly income after housing and debts
    var remainingIncome = monthlyIncome - finalMonthlyPayment - inputs.monthlyDebts;

    // Limit front-end and back-end to 100%
    actualFrontEnd = Math.min(actualFrontEnd, 100);
    actualBackEnd = Math.min(actualBackEnd, 100);

    return {
      maxHomePrice: estimatedHomePrice,
      maxLoanAmount: finalMaxLoan,
      monthlyPayment: finalMonthlyPayment,
      frontEndRatio: actualFrontEnd,
      backEndRatio: actualBackEnd,
      remainingIncome: remainingIncome,
      monthlyTax: finalMonthlyTax,
      monthlyInsurance: finalMonthlyInsurance,
      monthlyHOA: finalHOA,
      monthlyPI: finalMonthlyPI,
      maxHousingPayment: maxHousingPayment,
      monthlyIncome: monthlyIncome
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
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
    var result = calculateAffordability(inputs);

    document.getElementById('output_maxHomePrice').querySelector('.output-number').textContent = formatCurrencyLocal(result.maxHomePrice);
    document.getElementById('output_maxLoanAmount').querySelector('.output-number').textContent = formatCurrencyLocal(result.maxLoanAmount);
    document.getElementById('output_monthlyPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyPayment);
    document.getElementById('output_frontEndRatio').querySelector('.output-number').textContent = result.frontEndRatio.toFixed(1);
    document.getElementById('output_backEndRatio').querySelector('.output-number').textContent = result.backEndRatio.toFixed(1);
    document.getElementById('output_remainingIncome').querySelector('.output-number').textContent = formatCurrencyLocal(result.remainingIncome);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        annualIncome: inputs.annualIncome,
        monthlyDebts: inputs.monthlyDebts,
        downPayment: inputs.downPayment,
        interestRate: inputs.interestRate,
        loanTerm: inputs.loanTerm,
        propertyTax: inputs.propertyTax,
        insurance: inputs.insurance,
        hoaFees: inputs.hoaFees,
        frontEndRatio: inputs.frontEndRatio,
        backEndRatio: inputs.backEndRatio,
        compoundingFrequency: inputs.compoundingFrequency
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
      var pi = result.monthlyPI || 0;
      var tax = result.monthlyTax || 0;
      var insurance = result.monthlyInsurance || 0;
      var hoa = result.monthlyHOA || 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Principal & Interest', 'Property Tax', 'Insurance', 'HOA Fees'],
          datasets: [{
            data: [pi, tax, insurance, hoa],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#4A90D9', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Monthly Payment Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(2);
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'dti') {
      var frontEnd = Math.min(result.frontEndRatio, 100);
      var backEnd = Math.min(result.backEndRatio, 100);
      var frontLimit = inputs.frontEndRatio || 28;
      var backLimit = inputs.backEndRatio || 36;

      return {
        type: 'bar',
        data: {
          labels: ['Front-End DTI', 'Back-End DTI'],
          datasets: [
            {
              label: 'Your DTI',
              data: [frontEnd, backEnd],
              backgroundColor: ['#C08A2E', '#2F6F5E'],
              borderColor: ['#A87520', '#1f4f42'],
              borderWidth: 1
            },
            {
              label: 'Lender Limit',
              data: [frontLimit, backLimit],
              backgroundColor: ['rgba(178, 58, 58, 0.2)', 'rgba(178, 58, 58, 0.2)'],
              borderColor: ['#B23A3A', '#B23A3A'],
              borderWidth: 1,
              borderDash: [4, 4]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'DTI Ratio Analysis', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 50,
              title: { display: true, text: 'DTI (%)' }
            }
          }
        }
      };
    }

    if (tab === 'affordability') {
      var maxPrice = result.maxHomePrice;
      var downPayment = inputs.downPayment;
      var loanAmount = Math.max(0, maxPrice - downPayment);

      return {
        type: 'doughnut',
        data: {
          labels: ['Loan Amount', 'Down Payment'],
          datasets: [{
            data: [loanAmount, downPayment],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Home Purchase Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(2);
                }
              }
            }
          },
          cutout: '60%'
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
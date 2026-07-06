/* ═══════════════════════════════════════════════════════════
   CRYCAL — Down Payment Calculator
   Tool ID: down-payment
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      downPaymentPercent: parseFloat(document.getElementById('input_downPaymentPercent').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      propertyTax: parseFloat(document.getElementById('input_propertyTax').value) || 0,
      insurance: parseFloat(document.getElementById('input_insurance').value) || 0,
      pmiRate: parseFloat(document.getElementById('input_pmiRate').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'monthly'
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

  // ── Calculate Monthly Payment ──
  function calculateMonthlyPayment(loanAmount, annualRate, loanTerm, n) {
    if (loanAmount <= 0 || annualRate < 0) return 0;
    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    var totalMonths = loanTerm * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
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
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    var downPaymentAmount = inputs.homePrice * (inputs.downPaymentPercent / 100);
    var loanAmount = inputs.homePrice - downPaymentAmount;

    var monthlyPI = calculateMonthlyPayment(loanAmount, inputs.interestRate, inputs.loanTerm, n);
    var monthlyTax = inputs.homePrice * (inputs.propertyTax / 100) / 12;
    var monthlyInsurance = inputs.homePrice * (inputs.insurance / 100) / 12;

    var pmiMonthly = 0;
    if (inputs.downPaymentPercent < 20 && loanAmount > 0) {
      pmiMonthly = loanAmount * (inputs.pmiRate / 100) / 12;
    }

    var totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + pmiMonthly;

    document.getElementById('output_downPaymentAmount').querySelector('.output-number').textContent = formatCurrency(downPaymentAmount);
    document.getElementById('output_loanAmount').querySelector('.output-number').textContent = formatCurrency(loanAmount);
    document.getElementById('output_monthlyPayment').querySelector('.output-number').textContent = formatCurrency(totalMonthly);
    document.getElementById('output_pmiMonthly').querySelector('.output-number').textContent = formatCurrency(pmiMonthly);

    updateCharts({
      downPaymentAmount: downPaymentAmount,
      loanAmount: loanAmount,
      homePrice: inputs.homePrice
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        homePrice: inputs.homePrice,
        downPaymentPercent: inputs.downPaymentPercent,
        downPaymentAmount: downPaymentAmount,
        loanAmount: loanAmount,
        monthlyPayment: totalMonthly
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
      return {
        type: 'doughnut',
        data: {
          labels: ['Down Payment', 'Loan Amount'],
          datasets: [{
            data: [data.downPaymentAmount, data.loanAmount],
            backgroundColor: ['#C08A2E', '#2F6F5E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Down Payment vs Loan Amount', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toFixed(2) + ' (' + pct + '%)';
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
    document.getElementById('input_homePrice').value = 350000;
    document.getElementById('input_downPaymentPercent').value = 20.0;
    document.getElementById('input_interestRate').value = 6.5;
    document.getElementById('input_loanTerm').value = 30;
    document.getElementById('input_propertyTax').value = 1.2;
    document.getElementById('input_insurance').value = 0.5;
    document.getElementById('input_pmiRate').value = 0.5;
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
    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
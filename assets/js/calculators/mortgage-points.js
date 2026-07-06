/* ═══════════════════════════════════════════════════════════
   CRYCAL — Mortgage Points Calculator
   Tool ID: mortgage-points
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      loanAmount: parseFloat(document.getElementById('input_loanAmount').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      noPointsRate: parseFloat(document.getElementById('input_noPointsRate').value) || 0,
      pointsRate: parseFloat(document.getElementById('input_pointsRate').value) || 0,
      pointsCost: parseFloat(document.getElementById('input_pointsCost').value) || 0,
      propertyTax: parseFloat(document.getElementById('input_propertyTax').value) || 0,
      insurance: parseFloat(document.getElementById('input_insurance').value) || 0,
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

  // ── Calculate Total Interest ──
  function calculateTotalInterest(loanAmount, annualRate, loanTerm, n) {
    var payment = calculateMonthlyPayment(loanAmount, annualRate, loanTerm, n);
    var totalMonths = loanTerm * 12;
    return (payment * totalMonths) - loanAmount;
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

  // ── Format Months ──
function formatMonths(months) {
  if (months === Infinity || !isFinite(months) || months < 0) return '∞';
  var totalMonths = Math.round(months);
  var y = Math.floor(totalMonths / 12);
  var m = totalMonths % 12;
  if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
  if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
  return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
}

  // ── Format Years ──
  function formatYears(months) {
    if (months === Infinity || !isFinite(months)) return '∞';
    return (months / 12).toFixed(1) + ' years';
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    // ── Points Cost ──
    var pointsCostAmount = inputs.loanAmount * (inputs.pointsCost / 100);

    // ── Monthly Payments ──
    var noPointsPayment = calculateMonthlyPayment(inputs.loanAmount, inputs.noPointsRate, inputs.loanTerm, n);
    var pointsPayment = calculateMonthlyPayment(inputs.loanAmount, inputs.pointsRate, inputs.loanTerm, n);

    var monthlySavings = noPointsPayment - pointsPayment;

    // ── Total Interest ──
    var noPointsInterest = calculateTotalInterest(inputs.loanAmount, inputs.noPointsRate, inputs.loanTerm, n);
    var pointsInterest = calculateTotalInterest(inputs.loanAmount, inputs.pointsRate, inputs.loanTerm, n);
    var totalInterestSaved = noPointsInterest - pointsInterest;

    // ── Break-Even ──
    var breakEvenMonths = monthlySavings > 0 ? pointsCostAmount / monthlySavings : Infinity;

    // ── Update Outputs ──
    document.getElementById('output_pointsCostAmount').querySelector('.output-number').textContent = formatCurrency(pointsCostAmount);
    document.getElementById('output_monthlySavings').querySelector('.output-number').textContent = formatCurrency(monthlySavings);
    document.getElementById('output_totalInterestSaved').querySelector('.output-number').textContent = formatCurrency(totalInterestSaved);
    document.getElementById('output_breakEvenMonths').querySelector('.output-number').textContent = formatMonths(breakEvenMonths);
    document.getElementById('output_breakEvenYears').querySelector('.output-number').textContent = formatYears(breakEvenMonths);

    // ── Charts ──
    updateCharts({
      noPointsPayment: noPointsPayment,
      pointsPayment: pointsPayment,
      monthlySavings: monthlySavings,
      pointsCostAmount: pointsCostAmount,
      noPointsInterest: noPointsInterest,
      pointsInterest: pointsInterest,
      totalInterestSaved: totalInterestSaved,
      breakEvenMonths: breakEvenMonths
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        loanAmount: inputs.loanAmount,
        noPointsRate: inputs.noPointsRate,
        pointsRate: inputs.pointsRate,
        breakEvenMonths: breakEvenMonths,
        totalInterestSaved: totalInterestSaved
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
        type: 'bar',
        data: {
          labels: ['No-Points Payment', 'Points Payment', 'Monthly Savings'],
          datasets: [{
            label: 'Amount',
            data: [data.noPointsPayment, data.pointsPayment, data.monthlySavings],
            backgroundColor: ['#B23A3A', '#2F6F5E', '#C08A2E'],
            borderColor: ['#8a2a2a', '#1f4f42', '#A87520'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Payment Comparison', font: { size: 14 } }
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

    if (tab === 'timeline') {
      return {
        type: 'bar',
        data: {
          labels: ['No-Points Interest', 'Points Interest', 'Interest Saved'],
          datasets: [{
            label: 'Amount',
            data: [data.noPointsInterest, data.pointsInterest, data.totalInterestSaved],
            backgroundColor: ['#B23A3A', '#2F6F5E', '#C08A2E'],
            borderColor: ['#8a2a2a', '#1f4f42', '#A87520'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Interest Comparison', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Interest (' + currencySymbol + ')' },
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
    document.getElementById('input_loanAmount').value = 300000;
    document.getElementById('input_loanTerm').value = 30;
    document.getElementById('input_noPointsRate').value = 7.0;
    document.getElementById('input_pointsRate').value = 6.5;
    document.getElementById('input_pointsCost').value = 1.0;
    document.getElementById('input_propertyTax').value = 1.2;
    document.getElementById('input_insurance').value = 0.5;
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
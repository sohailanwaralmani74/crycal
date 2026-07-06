/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Debt Consolidation Calculator
   Tool ID: debt-consolidation
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      totalDebt: parseFloat(document.getElementById('input_totalDebt').value) || 0,
      currentAvgRate: parseFloat(document.getElementById('input_currentAvgRate').value) || 0,
      currentMonthlyPayment: parseFloat(document.getElementById('input_currentMonthlyPayment').value) || 0,
      newLoanRate: parseFloat(document.getElementById('input_newLoanRate').value) || 0,
      newLoanTerm: parseFloat(document.getElementById('input_newLoanTerm').value) || 0,
      originationFee: parseFloat(document.getElementById('input_originationFee').value) || 0,
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

  // ── Simulate Payoff ──
  function simulatePayoff(balance, annualRate, monthlyPayment, n) {
    var balance = balance;
    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    var totalInterest = 0;
    var month = 0;

    while (balance > 0 && month < 1200) {
      month++;
      var interestPaid = balance * monthlyRate;
      var principalPaid = monthlyPayment - interestPaid;
      if (principalPaid > balance) {
        principalPaid = balance;
        monthlyPayment = interestPaid + principalPaid;
      }
      balance = Math.max(0, balance - principalPaid);
      totalInterest += interestPaid;
      if (balance <= 0) break;
    }
    return { months: month, totalInterest: totalInterest };
  }

  // ── Calculate New Loan Payment ──
  function calculateNewPayment(loanAmount, annualRate, loanTerm, n) {
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

  // ── Format Months ──
  function formatMonths(months) {
    if (months === Infinity || !isFinite(months)) return '∞';
    var y = Math.floor(months / 12);
    var m = months % 12;
    if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    // Current
    var current = simulatePayoff(inputs.totalDebt, inputs.currentAvgRate, inputs.currentMonthlyPayment, n);

    // New Loan
    var newLoanAmount = inputs.totalDebt + inputs.originationFee;
    var newMonthlyPayment = calculateNewPayment(newLoanAmount, inputs.newLoanRate, inputs.newLoanTerm, n);
    var newPayoffMonths = inputs.newLoanTerm * 12;
    var newTotalInterest = (newMonthlyPayment * newPayoffMonths) - newLoanAmount;

    var monthlySavings = inputs.currentMonthlyPayment - newMonthlyPayment;
    var totalInterestSaved = current.totalInterest - newTotalInterest;

    document.getElementById('output_currentPayoffMonths').querySelector('.output-number').textContent = formatMonths(current.months);
    document.getElementById('output_currentTotalInterest').querySelector('.output-number').textContent = formatCurrency(current.totalInterest);
    document.getElementById('output_newMonthlyPayment').querySelector('.output-number').textContent = formatCurrency(newMonthlyPayment);
    document.getElementById('output_newPayoffMonths').querySelector('.output-number').textContent = formatMonths(newPayoffMonths);
    document.getElementById('output_newTotalInterest').querySelector('.output-number').textContent = formatCurrency(newTotalInterest);
    document.getElementById('output_monthlySavings').querySelector('.output-number').textContent = formatCurrency(monthlySavings);
    document.getElementById('output_totalInterestSaved').querySelector('.output-number').textContent = formatCurrency(totalInterestSaved);

    updateCharts({
      currentMonthlyPayment: inputs.currentMonthlyPayment,
      newMonthlyPayment: newMonthlyPayment,
      currentTotalInterest: current.totalInterest,
      newTotalInterest: newTotalInterest,
      currentMonths: current.months,
      newMonths: newPayoffMonths,
      monthlySavings: monthlySavings
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        totalDebt: inputs.totalDebt,
        currentAvgRate: inputs.currentAvgRate,
        newLoanRate: inputs.newLoanRate,
        monthlySavings: monthlySavings,
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
          labels: ['Current Payment', 'New Payment'],
          datasets: [{
            label: 'Monthly Payment',
            data: [data.currentMonthlyPayment, data.newMonthlyPayment],
            backgroundColor: ['#B23A3A', '#2F6F5E'],
            borderColor: ['#8a2a2a', '#1f4f42'],
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
          labels: ['Current Payoff', 'New Payoff'],
          datasets: [{
            label: 'Total Interest Paid',
            data: [data.currentTotalInterest, data.newTotalInterest],
            backgroundColor: ['#B23A3A', '#2F6F5E'],
            borderColor: ['#8a2a2a', '#1f4f42'],
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
    document.getElementById('input_totalDebt').value = 25000;
    document.getElementById('input_currentAvgRate').value = 18.0;
    document.getElementById('input_currentMonthlyPayment').value = 800;
    document.getElementById('input_newLoanRate').value = 9.0;
    document.getElementById('input_newLoanTerm').value = 3;
    document.getElementById('input_originationFee').value = 0;
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
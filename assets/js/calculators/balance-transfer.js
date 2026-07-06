/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Balance Transfer Calculator
   Tool ID: balance-transfer
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      debtBalance: parseFloat(document.getElementById('input_debtBalance').value) || 0,
      currentRate: parseFloat(document.getElementById('input_currentRate').value) || 0,
      currentMonthlyPayment: parseFloat(document.getElementById('input_currentMonthlyPayment').value) || 0,
      introRate: parseFloat(document.getElementById('input_introRate').value) || 0,
      transferFee: parseFloat(document.getElementById('input_transferFee').value) || 0,
      postIntroRate: parseFloat(document.getElementById('input_postIntroRate').value) || 0,
      monthlyPaymentTransfer: parseFloat(document.getElementById('input_monthlyPaymentTransfer').value) || 0,
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
    if (balance <= 0) return { months: 0, totalInterest: 0 };
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

  // ── Simulate Transfer Payoff ──
  function simulateTransfer(balance, transferFee, introMonths, postRate, monthlyPayment, n) {
    if (balance <= 0) return { months: 0, totalInterest: 0 };

    // Add transfer fee
    var feeAmount = balance * (transferFee / 100);
    var totalBalance = balance + feeAmount;

    var monthlyRate = Math.pow(1 + postRate / 100 / n, n / 12) - 1;
    var totalInterest = 0;
    var month = 0;
    var currentBalance = totalBalance;

    while (currentBalance > 0 && month < 1200) {
      month++;
      // During intro period, no interest
      if (month <= introMonths) {
        var interestPaid = 0;
      } else {
        var interestPaid = currentBalance * monthlyRate;
        totalInterest += interestPaid;
        currentBalance += interestPaid;
      }
      var principalPaid = monthlyPayment - interestPaid;
      if (principalPaid > currentBalance) {
        principalPaid = currentBalance;
        monthlyPayment = interestPaid + principalPaid;
      }
      currentBalance = Math.max(0, currentBalance - principalPaid);
      if (currentBalance <= 0) break;
    }
    return { months: month, totalInterest: totalInterest };
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
    var current = simulatePayoff(inputs.debtBalance, inputs.currentRate, inputs.currentMonthlyPayment, n);

    // Transfer
    var transfer = simulateTransfer(
      inputs.debtBalance,
      inputs.transferFee,
      inputs.introRate,
      inputs.postIntroRate,
      inputs.monthlyPaymentTransfer,
      n
    );

    var interestSaved = current.totalInterest - transfer.totalInterest;
    var transferFeeAmount = inputs.debtBalance * (inputs.transferFee / 100);

    document.getElementById('output_currentPayoffMonths').querySelector('.output-number').textContent = formatMonths(current.months);
    document.getElementById('output_currentTotalInterest').querySelector('.output-number').textContent = formatCurrency(current.totalInterest);
    document.getElementById('output_transferPayoffMonths').querySelector('.output-number').textContent = formatMonths(transfer.months);
    document.getElementById('output_transferTotalInterest').querySelector('.output-number').textContent = formatCurrency(transfer.totalInterest);
    document.getElementById('output_interestSaved').querySelector('.output-number').textContent = formatCurrency(interestSaved);
    document.getElementById('output_transferFeeAmount').querySelector('.output-number').textContent = formatCurrency(transferFeeAmount);

    updateCharts({
      currentTotalInterest: current.totalInterest,
      transferTotalInterest: transfer.totalInterest,
      interestSaved: interestSaved,
      currentMonths: current.months,
      transferMonths: transfer.months,
      transferFeeAmount: transferFeeAmount
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        debtBalance: inputs.debtBalance,
        currentRate: inputs.currentRate,
        introRate: inputs.introRate,
        interestSaved: interestSaved,
        transferFeeAmount: transferFeeAmount
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
          labels: ['Current Interest', 'Transfer Interest', 'Interest Saved'],
          datasets: [{
            label: 'Amount',
            data: [data.currentTotalInterest, data.transferTotalInterest, data.interestSaved],
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
            title: { display: true, text: 'Interest Comparison', font: { size: 14 } }
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
          labels: ['Current Payoff', 'Transfer Payoff'],
          datasets: [{
            label: 'Months',
            data: [data.currentMonths, data.transferMonths],
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
            title: { display: true, text: 'Payoff Timeline', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Months' }
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
    document.getElementById('input_debtBalance').value = 5000;
    document.getElementById('input_currentRate').value = 22.0;
    document.getElementById('input_currentMonthlyPayment').value = 200;
    document.getElementById('input_introRate').value = 18;
    document.getElementById('input_transferFee').value = 3.0;
    document.getElementById('input_postIntroRate').value = 22.0;
    document.getElementById('input_monthlyPaymentTransfer').value = 200;
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
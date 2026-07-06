/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Loan Payoff Calculator
   Tool ID: loan-payoff
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      loanBalance: parseFloat(document.getElementById('input_loanBalance').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      monthlyPayment: parseFloat(document.getElementById('input_monthlyPayment').value) || 0,
      extraMonthlyPayment: parseFloat(document.getElementById('input_extraMonthlyPayment').value) || 0,
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

  // ── Simulate Payoff ──
  function simulatePayoff(loanBalance, annualRate, monthlyPayment, extraPayment, n) {
    var balance = loanBalance;
    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    var totalPayment = monthlyPayment + extraPayment;
    var totalInterest = 0;
    var month = 0;
    var schedule = [];

    while (balance > 0 && month < 600) { // Max 50 years
      month++;
      var interestPaid = balance * monthlyRate;
      var principalPaid = totalPayment - interestPaid;
      if (principalPaid > balance) {
        principalPaid = balance;
        totalPayment = interestPaid + principalPaid;
      }
      balance = Math.max(0, balance - principalPaid);
      totalInterest += interestPaid;
      schedule.push({
        month: month,
        balance: balance,
        interest: interestPaid,
        principal: principalPaid,
        totalPayment: totalPayment
      });
      if (balance <= 0) break;
    }
    return {
      months: month,
      totalInterest: totalInterest,
      schedule: schedule,
      finalPayment: totalPayment
    };
  }

  // ── Main Calculation ──
  function calculatePayoff(inputs) {
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    // Original (no extra)
    var original = simulatePayoff(
      inputs.loanBalance,
      inputs.interestRate,
      inputs.monthlyPayment,
      0,
      n
    );

    // With extra payment
    var withExtra = simulatePayoff(
      inputs.loanBalance,
      inputs.interestRate,
      inputs.monthlyPayment,
      inputs.extraMonthlyPayment,
      n
    );

    var monthsSaved = original.months - withExtra.months;
    var interestSaved = original.totalInterest - withExtra.totalInterest;

    // Calculate payoff dates (approximately)
    var today = new Date();
    var originalDate = new Date(today);
    originalDate.setMonth(today.getMonth() + original.months);
    var newDate = new Date(today);
    newDate.setMonth(today.getMonth() + withExtra.months);

    return {
      originalMonths: original.months,
      newMonths: withExtra.months,
      monthsSaved: monthsSaved,
      interestSaved: interestSaved,
      originalTotalInterest: original.totalInterest,
      newTotalInterest: withExtra.totalInterest,
      originalSchedule: original.schedule,
      newSchedule: withExtra.schedule,
      originalPayoffDate: originalDate,
      newPayoffDate: newDate
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

  // ── Format Date ──
  function formatDate(date) {
    if (!date || !date.getFullYear) return '—';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getFullYear();
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
    var result = calculatePayoff(inputs);

    document.getElementById('output_originalPayoffDate').querySelector('.output-number').textContent = formatDate(result.originalPayoffDate);
    document.getElementById('output_newPayoffDate').querySelector('.output-number').textContent = formatDate(result.newPayoffDate);
    document.getElementById('output_timeSaved').querySelector('.output-number').textContent = formatMonths(result.monthsSaved);
    document.getElementById('output_interestSaved').querySelector('.output-number').textContent = formatCurrencyLocal(result.interestSaved);
    document.getElementById('output_originalTotalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.originalTotalInterest);
    document.getElementById('output_newTotalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.newTotalInterest);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        loanBalance: inputs.loanBalance,
        interestRate: inputs.interestRate,
        monthlyPayment: inputs.monthlyPayment,
        extraMonthlyPayment: inputs.extraMonthlyPayment,
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
    var origSchedule = result.originalSchedule;
    var newSchedule = result.newSchedule;
    var maxMonths = Math.min(origSchedule.length, newSchedule.length, 360);

    if (tab === 'comparison') {
      var labels = [];
      var origBalances = [];
      var newBalances = [];

      var step = 1;
      if (maxMonths > 120) step = 2;
      if (maxMonths > 240) step = 4;

      for (var i = 0; i < maxMonths; i += step) {
        labels.push(i + 1);
        origBalances.push(origSchedule[i] ? origSchedule[i].balance : 0);
        newBalances.push(newSchedule[i] ? newSchedule[i].balance : 0);
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Original Balance',
              data: origBalances,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#B23A3A',
              pointRadius: 0
            },
            {
              label: 'With Extra Payment',
              data: newBalances,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#2F6F5E',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Loan Balance Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'timeline') {
      var labels2 = [];
      var origData2 = [];
      var newData2 = [];

      var maxMonths2 = Math.max(origSchedule.length, newSchedule.length);
      var step2 = 1;
      if (maxMonths2 > 120) step2 = 2;
      if (maxMonths2 > 240) step2 = 4;

      for (var j = 0; j < maxMonths2; j += step2) {
        labels2.push(j + 1);
        origData2.push(origSchedule[j] ? origSchedule[j].balance : 0);
        newData2.push(newSchedule[j] ? newSchedule[j].balance : 0);
      }

      return {
        type: 'line',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Original Payoff',
              data: origData2,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [4, 4],
              pointRadius: 0
            },
            {
              label: 'With Extra Payment',
              data: newData2,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Payoff Timeline', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var origInterest = result.originalTotalInterest;
      var newInterest = result.newTotalInterest;
      var interestSaved = result.interestSaved;

      return {
        type: 'doughnut',
        data: {
          labels: ['Original Interest', 'New Interest', 'Interest Saved'],
          datasets: [{
            data: [origInterest, newInterest, interestSaved],
            backgroundColor: ['#B23A3A', '#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Interest Breakdown', font: { size: 14 } },
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
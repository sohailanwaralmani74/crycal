/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Amortization Calculator
   Tool ID: amortization
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      loanAmount: parseFloat(document.getElementById('input_loanAmount').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      // Negative "extra payment" would silently create negative amortization
      // (balance growing instead of shrinking) with no warning — block it.
      extraPayment: Math.max(0, parseFloat(document.getElementById('input_extraPayment').value) || 0),
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year (normalized so "semiannually" and
  //    "semi-annually" both resolve — avoids a silent fallback to monthly) ──
  function getCompoundsPerYear(frequency) {
    var key = (frequency || '').toLowerCase().replace(/[-\s]/g, '');
    var map = { daily: 365, monthly: 12, quarterly: 4, semiannually: 2, annually: 1 };
    return map[key] || 12;
  }

  // ── Calculate Monthly Payment ──
  function calculateMonthlyPayment(loanAmount, annualRate, loanTerm, n) {
    var totalMonths = loanTerm * 12;
    if (loanAmount <= 0 || annualRate < 0 || totalMonths <= 0) return 0;
    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // ── Generate Amortization Schedule ──
  function generateAmortization(loanAmount, annualRate, loanTerm, extraPayment, n) {
    var totalMonths = loanTerm * 12;
    if (loanAmount <= 0 || totalMonths <= 0) {
      return { schedule: [], totalInterest: 0, totalPayment: 0, monthlyPayment: 0, totalMonths: 0 };
    }

    var monthlyRate = Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
    var basePayment = calculateMonthlyPayment(loanAmount, annualRate, loanTerm, n);
    var scheduledPayment = basePayment + extraPayment;

    var balance = loanAmount;
    var schedule = [];
    var totalInterest = 0;
    var totalPaymentSum = 0; // sum of ACTUAL payments made, not (last payment * months)
    var month = 0;

    while (balance > 0 && month < totalMonths) {
      month++;
      var interestPaid = balance * monthlyRate;
      var actualPayment = scheduledPayment;
      var principalPaid = actualPayment - interestPaid;

      if (principalPaid > balance) {
        principalPaid = balance;
        actualPayment = interestPaid + principalPaid; // final, smaller closing payment
      }

      balance = Math.max(0, balance - principalPaid);
      totalInterest += interestPaid;
      totalPaymentSum += actualPayment;

      schedule.push({
        month: month,
        payment: actualPayment,
        principal: principalPaid,
        interest: interestPaid,
        balance: balance
      });

      if (balance <= 0) break;
    }

    return {
      schedule: schedule,
      totalInterest: totalInterest,
      totalPayment: totalPaymentSum,
      monthlyPayment: basePayment,
      totalMonths: month
    };
  }

  // ── Main Calculation ──
  function calculateAmortization(inputs) {
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var result = generateAmortization(
      inputs.loanAmount,
      inputs.interestRate,
      inputs.loanTerm,
      inputs.extraPayment,
      n
    );

    var today = new Date();
    var payoffDate = new Date(today);
    payoffDate.setMonth(today.getMonth() + result.totalMonths);

    return {
      monthlyPayment: result.monthlyPayment,
      totalPayment: result.totalPayment,
      totalInterest: result.totalInterest,
      payoffDate: payoffDate,
      schedule: result.schedule,
      totalMonths: result.totalMonths
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD';
    if (typeof formatCurrency === 'function') return formatCurrency(amount, code);
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return code + ' ' + amount.toFixed(2);
    }
  }

  // ── Format Date ──
  function formatDate(date) {
    if (!date || !date.getFullYear) return '—';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getFullYear();
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateAmortization(inputs);

    document.getElementById('output_monthlyPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyPayment);
    document.getElementById('output_totalPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalPayment);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_payoffDate').querySelector('.output-number').textContent = formatDate(result.payoffDate);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory(inputs);
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

  function thinSeries(labels, series, maxPoints) {
    var step = 1;
    if (labels.length > 120) step = 2;
    if (labels.length > 240) step = 4;
    if (labels.length > 360) step = 6;
    var outLabels = [];
    var outSeries = series.map(function () { return []; });
    for (var i = 0; i < labels.length; i += step) {
      outLabels.push(labels[i]);
      series.forEach(function (s, idx) { outSeries[idx].push(s[i]); });
    }
    return { labels: outLabels, series: outSeries };
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = (typeof getCurrencySymbol === 'function')
      ? getCurrencySymbol((typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD')
      : '';
    var schedule = result.schedule;

    if (!schedule || schedule.length === 0) {
      return {
        type: 'line',
        data: { labels: ['0'], datasets: [{ label: 'Balance', data: [0], borderColor: '#C08A2E' }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, title: { display: true, text: 'Enter valid loan details', font: { size: 14 } } }
        }
      };
    }

    var labels = schedule.map(function(d) { return d.month; });

    if (tab === 'breakdown') {
      var principalData = schedule.map(function(d) { return d.principal; });
      var interestData = schedule.map(function(d) { return d.interest; });
      var thinned = thinSeries(labels, [principalData, interestData]);

      return {
        type: 'bar',
        data: {
          labels: thinned.labels,
          datasets: [
            { label: 'Principal Paid', data: thinned.series[0], backgroundColor: '#2F6F5E', borderColor: '#1f4f42', borderWidth: 0 },
            { label: 'Interest Paid', data: thinned.series[1], backgroundColor: '#C08A2E', borderColor: '#A87520', borderWidth: 0 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' }, title: { display: true, text: 'Payment Breakdown', font: { size: 14 } } },
          scales: {
            x: { stacked: true, title: { display: true, text: 'Month' } },
            y: {
              stacked: true,
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: { callback: function(v) { return currencySymbol + v.toFixed(0); } }
            }
          }
        }
      };
    }

    if (tab === 'balance') {
      var balanceData = schedule.map(function(d) { return d.balance; });
      var thinnedB = thinSeries(labels, [balanceData]);

      return {
        type: 'line',
        data: {
          labels: thinnedB.labels,
          datasets: [{
            label: 'Remaining Balance',
            data: thinnedB.series[0],
            borderColor: '#C08A2E',
            backgroundColor: 'rgba(192, 138, 46, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, title: { display: true, text: 'Loan Balance Over Time', font: { size: 14 } } },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: { callback: function(v) { return currencySymbol + v.toFixed(0); } }
            },
            x: { title: { display: true, text: 'Month' } }
          }
        }
      };
    }

    if (tab === 'interest') {
      var interestData2 = schedule.map(function(d) { return d.interest; });
      var cumulativeInterest = [];
      var cumTotal = 0;
      for (var k = 0; k < interestData2.length; k++) {
        cumTotal += interestData2[k];
        cumulativeInterest.push(cumTotal);
      }
      var thinnedI = thinSeries(labels, [interestData2, cumulativeInterest]);

      return {
        type: 'line',
        data: {
          labels: thinnedI.labels,
          datasets: [
            {
              label: 'Monthly Interest',
              data: thinnedI.series[0],
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 0
            },
            {
              label: 'Cumulative Interest',
              data: thinnedI.series[1],
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' }, title: { display: true, text: 'Interest Over Time', font: { size: 14 } } },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Interest (' + currencySymbol + ')' },
              ticks: { callback: function(v) { return currencySymbol + v.toFixed(0); } }
            },
            x: { title: { display: true, text: 'Month' } }
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

  // ── Reset Tool (aligned with the pattern used in other calculators) ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (el.type === 'number' || el.type === 'text') {
        el.value = defaultVal;
      } else if (el.tagName === 'SELECT') {
        if (defaultVal) el.value = defaultVal;
        else el.selectedIndex = 0;
      }
    });
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  // Currency-picker wiring is handled centrally by initCurrencyPickers()
  // in data.js — no per-tool listener needed here.
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });
    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();
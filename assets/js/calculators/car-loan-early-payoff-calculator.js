(function() {

  var chartInstance = null;
  var currentTab = 'payoff_timeline';

  function getInputs() {
    return {
      loanBalance: parseFloat(document.getElementById('input_loanBalance').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      remainingMonths: parseInt(document.getElementById('input_remainingMonths').value, 10) || 48,
      paymentFrequency: document.getElementById('input_paymentFrequency').value,
      extraPaymentAmount: parseFloat(document.getElementById('input_extraPaymentAmount').value) || 0
    };
  }

  function formatCurrency(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateEarlyPayoff(inputs) {
    var P = inputs.loanBalance;
    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.remainingMonths;
    var freq = inputs.paymentFrequency;
    var extra = inputs.extraPaymentAmount;

    if (P <= 0 || n <= 0) {
      return {
        standardMonthlyPayment: 0,
        acceleratedPayment: 0,
        monthsSaved: '0 Mos',
        interestSaved: 0,
        newPayoffDate: '0 Mos',
        stdSchedule: [],
        accSchedule: []
      };
    }

    var stdPmt = (r > 0) ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
    var stdInterest = (stdPmt * n) - P;

    // Standard schedule
    var stdSchedule = [];
    var balS = P;
    for (var m = 1; m <= n; m++) {
      var intS = balS * r;
      var prinS = Math.min(balS, stdPmt - intS);
      balS = Math.max(0, balS - prinS);
      stdSchedule.push({ month: m, balance: balS });
    }

    // Accelerated schedule
    var accPmt = stdPmt;
    if (freq === 'bi_weekly') {
      accPmt = (stdPmt * 13) / 12 + extra;
    } else {
      accPmt = stdPmt + extra;
    }

    var accSchedule = [];
    var balA = P;
    var accMonthCount = 0;
    var accTotalInterest = 0;

    while (balA > 0.01 && accMonthCount < n * 2) {
      accMonthCount++;
      var intA = balA * r;
      var prinA = Math.min(balA, accPmt - intA);
      accTotalInterest += intA;
      balA = Math.max(0, balA - prinA);
      accSchedule.push({ month: accMonthCount, balance: balA });
    }

    var monthsSaved = Math.max(0, n - accMonthCount);
    var interestSaved = Math.max(0, stdInterest - accTotalInterest);

    return {
      standardMonthlyPayment: stdPmt,
      acceleratedPayment: accPmt,
      monthsSaved: monthsSaved.toFixed(1) + ' Months',
      interestSaved: interestSaved,
      newPayoffDate: accMonthCount + ' Months (' + (accMonthCount / 12).toFixed(1) + ' yrs)',
      stdSchedule: stdSchedule,
      accSchedule: accSchedule,
      stdInterest: Math.max(0, stdInterest),
      accInterest: Math.max(0, accTotalInterest)
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateEarlyPayoff(inputs);

    setOutputText('output_standardMonthlyPayment', formatCurrency(res.standardMonthlyPayment));
    setOutputText('output_acceleratedPayment', formatCurrency(res.acceleratedPayment));
    setOutputText('output_monthsSaved', res.monthsSaved);
    setOutputText('output_interestSaved', formatCurrency(res.interestSaved));
    setOutputText('output_newPayoffDate', res.newPayoffDate);

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        loanBalance: inputs.loanBalance,
        interestRate: inputs.interestRate,
        paymentFrequency: inputs.paymentFrequency,
        extraPaymentAmount: inputs.extraPaymentAmount,
        monthsSaved: res.monthsSaved,
        interestSaved: res.interestSaved
      });
    }
  }

  function updateCharts(res, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var chartData = generateChartData(currentTab, res, inputs);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, res, inputs) {
    var sym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';
    var maxM = inputs.remainingMonths;

    var labels = [];
    for (var i = 1; i <= maxM; i++) labels.push('Mo ' + i);

    var stdMap = {};
    res.stdSchedule.forEach(function(d) { stdMap[d.month] = Math.round(d.balance); });

    var accMap = {};
    res.accSchedule.forEach(function(d) { accMap[d.month] = Math.round(d.balance); });

    if (tab === 'payoff_timeline') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Standard Loan Balance',
              data: labels.map(function(_, idx) { return stdMap[idx + 1] !== undefined ? stdMap[idx + 1] : 0; }),
              borderColor: '#E05A47',
              borderDash: [5, 5],
              fill: false,
              tension: 0.2
            },
            {
              label: 'Accelerated Payoff Trajectory',
              data: labels.map(function(_, idx) { return accMap[idx + 1] !== undefined ? accMap[idx + 1] : 0; }),
              borderColor: '#2E7D32',
              backgroundColor: 'rgba(46, 125, 50, 0.15)',
              fill: true,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Car Loan Balance Trajectory: Standard vs Early Payoff' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'interest_saved_chart') {
      return {
        type: 'bar',
        data: {
          labels: ['Standard Interest', 'Accelerated Interest Paid', 'Interest Saved'],
          datasets: [{
            label: 'Amount ',
            data: [
              Math.round(res.stdInterest),
              Math.round(res.accInterest),
              Math.round(res.interestSaved)
            ],
            backgroundColor: ['#E05A47', '#FFC107', '#2E7D32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Interest Comparison' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });

})();

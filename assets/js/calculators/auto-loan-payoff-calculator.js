(function() {

  var chartInstance = null;
  var currentTab = 'balance';

  function getInputs() {
    return {
      currentAutoLoanBalance: parseFloat(document.getElementById('input_currentAutoLoanBalance').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      remainingMonths: parseInt(document.getElementById('input_remainingMonths').value, 10) || 48,
      extraMonthlyPayment: parseFloat(document.getElementById('input_extraMonthlyPayment').value) || 0
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

  function calculatePayoff(inputs) {
    var P = inputs.currentAutoLoanBalance;
    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.remainingMonths;
    var extra = inputs.extraMonthlyPayment;

    if (P <= 0 || n <= 0) {
      return {
        standardMonthlyPayment: 0,
        newPayoffTimeMonths: '0 Mos',
        monthsSaved: 0,
        totalInterestSaved: 0,
        totalRemainingInterest: 0,
        stdSchedule: [],
        extraSchedule: []
      };
    }

    var stdPmt = 0;
    var stdTotalInterest = 0;
    if (r > 0) {
      stdPmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      stdTotalInterest = (stdPmt * n) - P;
    } else {
      stdPmt = P / n;
      stdTotalInterest = 0;
    }

    // Standard schedule
    var stdSchedule = [];
    var balS = P;
    for (var m = 1; m <= n; m++) {
      var intS = balS * r;
      var prinS = Math.min(balS, stdPmt - intS);
      balS -= prinS;
      stdSchedule.push({ month: m, balance: Math.max(0, balS), interest: intS });
    }

    // Extra payment schedule
    var extraSchedule = [];
    var balE = P;
    var totalPmtE = stdPmt + extra;
    var monthCount = 0;
    var extraTotalInterest = 0;

    while (balE > 0.01 && monthCount < n * 2) {
      monthCount++;
      var intE = balE * r;
      var prinE = Math.min(balE, totalPmtE - intE);
      extraTotalInterest += intE;
      balE -= prinE;
      extraSchedule.push({ month: monthCount, balance: Math.max(0, balE), cumulativeInterest: extraTotalInterest });
    }

    var interestSaved = Math.max(0, stdTotalInterest - extraTotalInterest);
    var monthsSaved = Math.max(0, n - monthCount);

    return {
      standardMonthlyPayment: stdPmt,
      newPayoffTimeMonths: monthCount + ' Mos (' + (monthCount / 12).toFixed(1) + ' yrs)',
      monthsSaved: monthsSaved,
      totalInterestSaved: interestSaved,
      totalRemainingInterest: extraTotalInterest,
      stdSchedule: stdSchedule,
      extraSchedule: extraSchedule
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculatePayoff(inputs);

    setOutputText('output_standardMonthlyPayment', formatCurrency(res.standardMonthlyPayment));
    setOutputText('output_newPayoffTimeMonths', res.newPayoffTimeMonths);
    setOutputText('output_totalInterestSaved', formatCurrency(res.totalInterestSaved));
    setOutputText('output_totalRemainingInterest', formatCurrency(res.totalRemainingInterest));

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAutoLoanBalance: inputs.currentAutoLoanBalance,
        interestRate: inputs.interestRate,
        extraMonthlyPayment: inputs.extraMonthlyPayment,
        newPayoffTimeMonths: res.newPayoffTimeMonths,
        totalInterestSaved: res.totalInterestSaved
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

    var stdBalMap = {};
    res.stdSchedule.forEach(function(d) { stdBalMap[d.month] = Math.round(d.balance); });

    var extraBalMap = {};
    res.extraSchedule.forEach(function(d) { extraBalMap[d.month] = Math.round(d.balance); });

    if (tab === 'balance') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Standard Loan Balance',
              data: labels.map(function(_, idx) { return stdBalMap[idx + 1] !== undefined ? stdBalMap[idx + 1] : 0; }),
              borderColor: '#E05A47',
              borderDash: [5, 5],
              fill: false,
              tension: 0.2
            },
            {
              label: 'Accelerated Balance (+ Extra Pmt)',
              data: labels.map(function(_, idx) { return extraBalMap[idx + 1] !== undefined ? extraBalMap[idx + 1] : 0; }),
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
            title: { display: true, text: 'Auto Loan Principal Payoff Trajectory' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'interest') {
      return {
        type: 'bar',
        data: {
          labels: ['Standard Total Interest', 'Accelerated Interest Paid', 'Total Interest Saved'],
          datasets: [{
            label: 'Interest ',
            data: [
              Math.round(res.totalRemainingInterest + res.totalInterestSaved),
              Math.round(res.totalRemainingInterest),
              Math.round(res.totalInterestSaved)
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
            title: { display: true, text: 'Interest Savings Comparison' }
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

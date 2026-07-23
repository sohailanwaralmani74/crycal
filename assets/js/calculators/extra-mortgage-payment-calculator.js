(function() {

  var chartInstance = null;
  var currentTab = 'balance';

  function getInputs() {
    return {
      loanBalance: parseFloat(document.getElementById('input_loanBalance').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      remainingYears: parseFloat(document.getElementById('input_remainingYears').value) || 25,
      extraMonthlyPayment: parseFloat(document.getElementById('input_extraMonthlyPayment').value) || 0,
      lumpSumPayment: parseFloat(document.getElementById('input_lumpSumPayment').value) || 0
    };
  }

  function formatCurrencyLocal(amount) {
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

  function calculateResults(inputs) {
    var P = inputs.loanBalance;
    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.remainingYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return null;

    var stdMonthlyPmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var stdTotalInterest = (stdMonthlyPmt * n) - P;

    // Standard schedule
    var stdSchedule = [];
    var balS = P;
    var cumIntS = 0;
    for (var m = 1; m <= n; m++) {
      var intS = balS * r;
      var prinS = Math.min(balS, stdMonthlyPmt - intS);
      cumIntS += intS;
      balS -= prinS;
      if (m % 12 === 0 || m === n) {
        stdSchedule.push({ year: Math.ceil(m / 12), balance: Math.max(0, balS), interest: cumIntS });
      }
    }

    // Extra schedule
    var extraSchedule = [];
    var balE = Math.max(0, P - inputs.lumpSumPayment);
    var cumIntE = 0;
    var monthCount = 0;
    var totalMonthlyForExtra = stdMonthlyPmt + inputs.extraMonthlyPayment;

    while (balE > 0 && monthCount < n) {
      monthCount++;
      var intE = balE * r;
      var prinE = Math.min(balE, totalMonthlyForExtra - intE);
      cumIntE += intE;
      balE -= prinE;

      if (monthCount % 12 === 0 || balE <= 0) {
        extraSchedule.push({ year: Math.ceil(monthCount / 12), balance: Math.max(0, balE), interest: cumIntE });
      }
    }

    var newYears = (monthCount / 12);
    var interestSaved = Math.max(0, stdTotalInterest - cumIntE);
    var timeSavedYears = Math.max(0, inputs.remainingYears - newYears);

    return {
      standardMonthlyPayment: stdMonthlyPmt,
      newPayoffTerm: newYears,
      totalInterestSaved: interestSaved,
      timeSavedYears: timeSavedYears,
      monthCount: monthCount,
      stdSchedule: stdSchedule,
      extraSchedule: extraSchedule
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_standardMonthlyPayment', formatCurrencyLocal(result.standardMonthlyPayment));
    setOutputText('output_newPayoffTerm', result.newPayoffTerm.toFixed(1) + ' Years (' + result.monthCount + ' mos)');
    setOutputText('output_totalInterestSaved', formatCurrencyLocal(result.totalInterestSaved));
    setOutputText('output_totalTimeSaved', result.timeSavedYears.toFixed(1) + ' Years Saved');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        loanBalance: inputs.loanBalance,
        interestRate: inputs.interestRate,
        extraMonthlyPayment: inputs.extraMonthlyPayment,
        lumpSumPayment: inputs.lumpSumPayment,
        newPayoffTerm: result.newPayoffTerm.toFixed(1) + ' yrs',
        totalInterestSaved: result.totalInterestSaved
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';
    var maxYears = inputs.remainingYears;
    var labels = [];
    for (var i = 1; i <= maxYears; i++) labels.push('Yr ' + i);

    var stdBalMap = {};
    result.stdSchedule.forEach(function(d) { stdBalMap[d.year] = d.balance; });

    var extraBalMap = {};
    result.extraSchedule.forEach(function(d) { extraBalMap[d.year] = d.balance; });

    var stdIntMap = {};
    result.stdSchedule.forEach(function(d) { stdIntMap[d.year] = d.interest; });

    var extraIntMap = {};
    result.extraSchedule.forEach(function(d) { extraIntMap[d.year] = d.interest; });

    if (tab === 'balance') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Standard Loan Balance',
              data: labels.map(function(_, idx) { return stdBalMap[idx + 1] !== undefined ? stdBalMap[idx + 1] : 0; }),
              borderColor: '#B23A3A',
              fill: false,
              tension: 0.2
            },
            {
              label: 'Accelerated Balance (Extra Pmt)',
              data: labels.map(function(_, idx) { return extraBalMap[idx + 1] !== undefined ? extraBalMap[idx + 1] : 0; }),
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
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
            title: { display: true, text: 'Mortgage Amortization Payoff Comparison' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
            }
          }
        }
      };
    }

    if (tab === 'interest') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Standard Cumulative Interest',
              data: labels.map(function(_, idx) { return stdIntMap[idx + 1] !== undefined ? stdIntMap[idx + 1] : 0; }),
              borderColor: '#B23A3A',
              fill: false
            },
            {
              label: 'Accelerated Cumulative Interest',
              data: labels.map(function(_, idx) { return extraIntMap[idx + 1] !== undefined ? extraIntMap[idx + 1] : 0; }),
              borderColor: '#2F6F5E',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Interest Paid Comparison' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
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

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();

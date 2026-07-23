(function() {

  var chartInstance = null;
  var currentTab = 'balance';

  function getInputs() {
    return {
      homeLoanBalance: parseFloat(document.getElementById('input_homeLoanBalance').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermYears: parseFloat(document.getElementById('input_loanTermYears').value) || 30
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
    var P = inputs.homeLoanBalance;
    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return null;

    var monthlyPmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var stdTotalInterest = (monthlyPmt * n) - P;

    var biweeklyPmt = monthlyPmt / 2;
    var rBiweekly = (inputs.interestRate / 100) / 26;

    // Simulate monthly schedule
    var monthlySchedule = [];
    var balM = P;
    var cumIntM = 0;
    for (var m = 1; m <= n; m++) {
      var intM = balM * r;
      var prinM = Math.min(balM, monthlyPmt - intM);
      cumIntM += intM;
      balM -= prinM;
      if (m % 12 === 0) {
        monthlySchedule.push({ year: m / 12, balance: Math.max(0, balM), interest: cumIntM });
      }
    }

    // Simulate biweekly schedule
    var biweeklySchedule = [];
    var balB = P;
    var cumIntB = 0;
    var periodCount = 0;
    var maxPeriods = inputs.loanTermYears * 26;

    while (balB > 0 && periodCount < maxPeriods) {
      periodCount++;
      var intB = balB * rBiweekly;
      var prinB = Math.min(balB, biweeklyPmt - intB);
      cumIntB += intB;
      balB -= prinB;

      if (periodCount % 26 === 0 || balB <= 0) {
        var yr = Math.ceil(periodCount / 26);
        biweeklySchedule.push({ year: yr, balance: Math.max(0, balB), interest: cumIntB });
      }
    }

    var biweeklyPayoffYears = (periodCount / 26);
    var interestSaved = Math.max(0, stdTotalInterest - cumIntB);
    var yearsSaved = Math.max(0, inputs.loanTermYears - biweeklyPayoffYears);

    return {
      monthlyPaymentAmount: monthlyPmt,
      biweeklyPaymentAmount: biweeklyPmt,
      biweeklyPayoffYears: biweeklyPayoffYears,
      totalInterestSaved: interestSaved,
      yearsSaved: yearsSaved,
      monthlySchedule: monthlySchedule,
      biweeklySchedule: biweeklySchedule
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_monthlyPaymentAmount', formatCurrencyLocal(result.monthlyPaymentAmount));
    setOutputText('output_biweeklyPaymentAmount', formatCurrencyLocal(result.biweeklyPaymentAmount));
    setOutputText('output_biweeklyPayoffYears', result.biweeklyPayoffYears.toFixed(1) + ' Years');
    setOutputText('output_totalInterestSaved', formatCurrencyLocal(result.totalInterestSaved));
    setOutputText('output_yearsSaved', result.yearsSaved.toFixed(1) + ' Years Earlier');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        homeLoanBalance: inputs.homeLoanBalance,
        interestRate: inputs.interestRate,
        monthlyPaymentAmount: result.monthlyPaymentAmount,
        biweeklyPaymentAmount: result.biweeklyPaymentAmount,
        totalInterestSaved: result.totalInterestSaved,
        yearsSaved: result.yearsSaved.toFixed(1) + ' yrs'
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
    var maxYears = inputs.loanTermYears;
    var labels = [];
    for (var i = 1; i <= maxYears; i++) labels.push('Yr ' + i);

    var monthlyBalMap = {};
    result.monthlySchedule.forEach(function(d) { monthlyBalMap[d.year] = d.balance; });

    var biweeklyBalMap = {};
    result.biweeklySchedule.forEach(function(d) { biweeklyBalMap[d.year] = d.balance; });

    var monthlyIntMap = {};
    result.monthlySchedule.forEach(function(d) { monthlyIntMap[d.year] = d.interest; });

    var biweeklyIntMap = {};
    result.biweeklySchedule.forEach(function(d) { biweeklyIntMap[d.year] = d.interest; });

    if (tab === 'balance') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Standard Monthly Balance',
              data: labels.map(function(_, idx) { return monthlyBalMap[idx + 1] !== undefined ? monthlyBalMap[idx + 1] : 0; }),
              borderColor: '#B23A3A',
              fill: false,
              tension: 0.2
            },
            {
              label: 'Biweekly Accelerated Balance',
              data: labels.map(function(_, idx) { return biweeklyBalMap[idx + 1] !== undefined ? biweeklyBalMap[idx + 1] : 0; }),
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
            title: { display: true, text: 'Principal Loan Balance Reduction Over Time' }
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
              data: labels.map(function(_, idx) { return monthlyIntMap[idx + 1] !== undefined ? monthlyIntMap[idx + 1] : 0; }),
              borderColor: '#B23A3A',
              fill: false
            },
            {
              label: 'Biweekly Cumulative Interest',
              data: labels.map(function(_, idx) { return biweeklyIntMap[idx + 1] !== undefined ? biweeklyIntMap[idx + 1] : 0; }),
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
            title: { display: true, text: 'Cumulative Interest Paid Over Loan Term' }
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

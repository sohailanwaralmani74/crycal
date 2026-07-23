(function() {

  var chartInstance = null;
  var currentTab = 'timeline';

  function getInputs() {
    return {
      cardBalance: parseFloat(document.getElementById('input_cardBalance').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      minPaymentPercent: parseFloat(document.getElementById('input_minPaymentPercent').value) || 2.5,
      fixedPaymentTarget: parseFloat(document.getElementById('input_fixedPaymentTarget').value) || 0
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
    var P = inputs.cardBalance;
    var r = (inputs.interestRate / 100) / 12;
    var minRate = inputs.minPaymentPercent / 100;
    var fixedTarget = inputs.fixedPaymentTarget;

    if (P <= 0 || r <= 0) return null;

    // Minimum payment simulation
    var balMin = P;
    var minMonths = 0;
    var minTotalInt = 0;
    var minSchedule = [];

    while (balMin > 0.01 && minMonths < 600) {
      minMonths++;
      var intM = balMin * r;
      var pmt = Math.max(15, balMin * minRate);
      if (pmt <= intM) pmt = intM + 5; // prevent infinite loop
      var prinM = Math.min(balMin, pmt - intM);
      minTotalInt += intM;
      balMin -= prinM;
      if (minMonths % 6 === 0 || balMin <= 0) {
        minSchedule.push({ month: minMonths, balance: Math.max(0, balMin) });
      }
    }

    // Fixed payment simulation
    var balFix = P;
    var fixMonths = 0;
    var fixTotalInt = 0;
    var fixSchedule = [];

    if (fixedTarget > P * r) {
      while (balFix > 0.01 && fixMonths < 600) {
        fixMonths++;
        var intF = balFix * r;
        var prinF = Math.min(balFix, fixedTarget - intF);
        fixTotalInt += intF;
        balFix -= prinF;
        if (fixMonths % 6 === 0 || balFix <= 0) {
          fixSchedule.push({ month: fixMonths, balance: Math.max(0, balFix) });
        }
      }
    }

    var interestSaved = Math.max(0, minTotalInt - fixTotalInt);

    return {
      minMonths: minMonths,
      minTotalInt: minTotalInt,
      fixMonths: fixMonths,
      fixTotalInt: fixTotalInt,
      interestSaved: interestSaved,
      minSchedule: minSchedule,
      fixSchedule: fixSchedule
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_minPaymentMonths', result.minMonths + ' Months (' + (result.minMonths / 12).toFixed(1) + ' yrs)');
    setOutputText('output_minPaymentTotalInterest', formatCurrencyLocal(result.minTotalInt));

    if (result.fixMonths > 0) {
      setOutputText('output_fixedPaymentMonths', result.fixMonths + ' Months (' + (result.fixMonths / 12).toFixed(1) + ' yrs)');
      setOutputText('output_fixedPaymentInterestSaved', formatCurrencyLocal(result.interestSaved));
    } else {
      setOutputText('output_fixedPaymentMonths', '—');
      setOutputText('output_fixedPaymentInterestSaved', '—');
    }

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        cardBalance: inputs.cardBalance,
        interestRate: inputs.interestRate,
        minPaymentPercent: inputs.minPaymentPercent,
        minPaymentMonths: result.minMonths + ' mos',
        minPaymentTotalInterest: result.minTotalInt,
        fixedPaymentInterestSaved: result.interestSaved
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

    if (tab === 'timeline') {
      var maxMos = Math.max(result.minMonths, result.fixMonths);
      var labels = [];
      for (var i = 6; i <= maxMos; i += 6) labels.push('Mo ' + i);

      var minMap = {};
      result.minSchedule.forEach(function(d) { minMap[d.month] = d.balance; });

      var fixMap = {};
      result.fixSchedule.forEach(function(d) { fixMap[d.month] = d.balance; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Minimum Payment Payoff Trajectory',
              data: labels.map(function(l) {
                var m = parseInt(l.replace('Mo ', ''));
                return minMap[m] !== undefined ? minMap[m] : 0;
              }),
              borderColor: '#B23A3A',
              fill: false,
              tension: 0.2
            },
            {
              label: 'Fixed Payment Target Trajectory',
              data: labels.map(function(l) {
                var m = parseInt(l.replace('Mo ', ''));
                return fixMap[m] !== undefined ? fixMap[m] : 0;
              }),
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
            title: { display: true, text: 'Credit Card Balance Reduction Timeline' }
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
        type: 'bar',
        data: {
          labels: ['Total Interest Cost'],
          datasets: [
            {
              label: 'Minimum Payments Interest',
              data: [result.minTotalInt],
              backgroundColor: '#B23A3A'
            },
            {
              label: 'Fixed Payment Interest',
              data: [result.fixTotalInt],
              backgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Total Interest Comparison' }
          },
          scales: {
            y: { beginAtZero: true }
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

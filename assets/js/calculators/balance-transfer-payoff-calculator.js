(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      transferAmount: parseFloat(document.getElementById('input_transferAmount').value) || 0,
      transferFeePercent: parseFloat(document.getElementById('input_transferFeePercent').value) || 3.0,
      introMonths: parseFloat(document.getElementById('input_introMonths').value) || 18,
      regularAprAfterIntro: parseFloat(document.getElementById('input_regularAprAfterIntro').value) || 24.99
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
    var P = inputs.transferAmount;
    var feePercent = inputs.transferFeePercent / 100;
    var months = inputs.introMonths;
    var regApr = inputs.regularAprAfterIntro / 100;

    if (P <= 0 || months <= 0) return null;

    var feeAmount = P * feePercent;
    var totalFinanced = P + feeAmount;
    var targetMonthlyPmt = totalFinanced / months;

    // Estimate interest saved vs staying on high APR card (assumed ~22% APR over same months)
    var stdMonthlyApr = 0.22 / 12;
    var estimatedHighAprInterest = (P * stdMonthlyApr * months) * 0.75;
    var potentialInterestSaved = Math.max(0, estimatedHighAprInterest - feeAmount);

    // Timeline schedule
    var schedule = [];
    var bal = totalFinanced;
    for (var m = 1; m <= months; m++) {
      bal -= targetMonthlyPmt;
      schedule.push({ month: m, balance: Math.max(0, bal) });
    }

    return {
      feeAmount: feeAmount,
      totalFinanced: totalFinanced,
      targetMonthlyPmt: targetMonthlyPmt,
      potentialInterestSaved: potentialInterestSaved,
      schedule: schedule,
      transferAmount: P
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_transferFeeAmount', formatCurrencyLocal(result.feeAmount));
    setOutputText('output_totalBalanceToPay', formatCurrencyLocal(result.totalFinanced));
    setOutputText('output_targetMonthlyPayment', formatCurrencyLocal(result.targetMonthlyPmt));
    setOutputText('output_potentialInterestSaved', formatCurrencyLocal(result.potentialInterestSaved));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        transferAmount: inputs.transferAmount,
        transferFeePercent: inputs.transferFeePercent,
        introMonths: inputs.introMonths,
        transferFeeAmount: result.feeAmount,
        targetMonthlyPayment: result.targetMonthlyPmt,
        potentialInterestSaved: result.potentialInterestSaved
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

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Transferred Principal', 'Transfer Fee'],
          datasets: [{
            data: [result.transferAmount, result.feeAmount],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Balance Transfer Financed Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'timeline') {
      var labels = result.schedule.map(function(d) { return 'Mo ' + d.month; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: '0% APR Balance Reduction',
            data: result.schedule.map(function(d) { return d.balance; }),
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Target Monthly Payoff Trajectory (0% Interest)' }
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

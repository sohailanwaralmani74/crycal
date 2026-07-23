(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      remainingMortgageBalance: parseFloat(document.getElementById('input_remainingMortgageBalance').value) || 0,
      monthlyMortgagePayment: parseFloat(document.getElementById('input_monthlyMortgagePayment').value) || 0,
      emergencyCushionMonths: parseFloat(document.getElementById('input_emergencyCushionMonths').value) || 12
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
    var bal = inputs.remainingMortgageBalance;
    var cushion = inputs.monthlyMortgagePayment * inputs.emergencyCushionMonths;
    var totalNeeded = bal + cushion;

    return {
      totalNeeded: totalNeeded,
      cushion: cushion,
      balance: bal
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_totalMortgageProtectionNeeded', formatCurrencyLocal(result.totalNeeded));
    setOutputText('output_cushionAmount', formatCurrencyLocal(result.cushion));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        remainingMortgageBalance: inputs.remainingMortgageBalance,
        monthlyMortgagePayment: inputs.monthlyMortgagePayment,
        emergencyCushionMonths: inputs.emergencyCushionMonths,
        totalMortgageProtectionNeeded: result.totalNeeded,
        cushionAmount: result.cushion
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
    if (tab === 'breakdown' || tab === 'comparison') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Remaining Loan Balance Payoff', 'Transition Income Cushion'],
          datasets: [{
            data: [result.balance, result.cushion],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'MPI Policy Payout Allocation' }
          },
          cutout: '60%'
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

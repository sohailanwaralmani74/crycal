(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      lineOfCredit: parseFloat(document.getElementById('input_lineOfCredit').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      drawPeriodYears: parseFloat(document.getElementById('input_drawPeriodYears').value) || 10,
      repaymentPeriodYears: parseFloat(document.getElementById('input_repaymentPeriodYears').value) || 20
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
    var P = inputs.lineOfCredit;
    var r = (inputs.interestRate / 100) / 12;

    if (P <= 0 || r <= 0) return null;

    var drawMonthlyPmt = P * r;
    var totalDrawInterest = drawMonthlyPmt * inputs.drawPeriodYears * 12;

    var repN = inputs.repaymentPeriodYears * 12;
    var repaymentMonthlyPmt = (P * r * Math.pow(1 + r, repN)) / (Math.pow(1 + r, repN) - 1);
    var totalRepaymentInterest = (repaymentMonthlyPmt * repN) - P;

    return {
      drawMonthlyPmt: drawMonthlyPmt,
      repaymentMonthlyPmt: repaymentMonthlyPmt,
      totalDrawInterest: totalDrawInterest,
      totalRepaymentInterest: totalRepaymentInterest,
      creditLine: P
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_drawPeriodMonthlyPayment', formatCurrencyLocal(result.drawMonthlyPmt));
    setOutputText('output_repaymentPeriodMonthlyPayment', formatCurrencyLocal(result.repaymentMonthlyPmt));
    setOutputText('output_totalDrawInterest', formatCurrencyLocal(result.totalDrawInterest));
    setOutputText('output_totalRepaymentInterest', formatCurrencyLocal(result.totalRepaymentInterest));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        lineOfCredit: inputs.lineOfCredit,
        interestRate: inputs.interestRate,
        drawPeriodMonthlyPayment: result.drawMonthlyPmt,
        repaymentPeriodMonthlyPayment: result.repaymentMonthlyPmt,
        totalDrawInterest: result.totalDrawInterest,
        totalRepaymentInterest: result.totalRepaymentInterest
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
    if (tab === 'breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Draw Phase (Interest Only)', 'Repayment Phase (P&I)'],
          datasets: [{
            label: 'Monthly Payment Amount',
            data: [result.drawMonthlyPmt, result.repaymentMonthlyPmt],
            backgroundColor: ['#C08A2E', '#2F6F5E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Payment Jump Between Phases' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
    }

    if (tab === 'interest') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Draw Period Interest', 'Repayment Period Interest'],
          datasets: [{
            data: [result.totalDrawInterest, result.totalRepaymentInterest],
            backgroundColor: ['#C08A2E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Lifetime Interest Cost Distribution' }
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

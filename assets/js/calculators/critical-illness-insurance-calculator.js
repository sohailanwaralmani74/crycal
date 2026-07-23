(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      annualSalary: parseFloat(document.getElementById('input_annualSalary').value) || 0,
      recoveryMonths: parseFloat(document.getElementById('input_recoveryMonths').value) || 12,
      outOfPocketMedical: parseFloat(document.getElementById('input_outOfPocketMedical').value) || 0,
      experimentalTreatment: parseFloat(document.getElementById('input_experimentalTreatment').value) || 0
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
    var lostIncome = (inputs.annualSalary / 12) * inputs.recoveryMonths;
    var totalCoverage = lostIncome + inputs.outOfPocketMedical + inputs.experimentalTreatment;

    return {
      lostIncome: lostIncome,
      totalCoverage: totalCoverage
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_lostIncomeNeeded', formatCurrencyLocal(result.lostIncome));
    setOutputText('output_totalCriticalIllnessCoverage', formatCurrencyLocal(result.totalCoverage));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualSalary: inputs.annualSalary,
        recoveryMonths: inputs.recoveryMonths,
        outOfPocketMedical: inputs.outOfPocketMedical,
        lostIncomeNeeded: result.lostIncome,
        totalCriticalIllnessCoverage: result.totalCoverage
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
        type: 'doughnut',
        data: {
          labels: ['Lost Income Replacement', 'Out-of-Pocket Medical Deductible', 'Out-of-Network & Travel Expenses'],
          datasets: [{
            data: [result.lostIncome, inputs.outOfPocketMedical, inputs.experimentalTreatment],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Critical Illness Coverage Needs Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Recommended Lump-Sum Policy Coverage'],
          datasets: [
            {
              label: 'Income Replacement',
              data: [result.lostIncome],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Medical & Out-of-Pocket Expenses',
              data: [inputs.outOfPocketMedical + inputs.experimentalTreatment],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Living Expense vs Direct Medical Cost Needs' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
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

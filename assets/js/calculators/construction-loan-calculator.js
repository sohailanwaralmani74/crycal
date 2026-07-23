(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalConstructionCost: parseFloat(document.getElementById('input_totalConstructionCost').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      constructionMonths: parseFloat(document.getElementById('input_constructionMonths').value) || 12,
      avgDrawPercent: parseFloat(document.getElementById('input_avgDrawPercent').value) || 50
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
    var P = inputs.totalConstructionCost;
    var r = (inputs.interestRate / 100) / 12;
    var avgDrawnBalance = P * (inputs.avgDrawPercent / 100);

    if (P <= 0 || r <= 0) return null;

    var avgMonthlyInterest = avgDrawnBalance * r;
    var totalConstructionInterest = avgMonthlyInterest * inputs.constructionMonths;

    var n = 30 * 12;
    var finalMonthlyPmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return {
      avgMonthlyInterest: avgMonthlyInterest,
      totalConstructionInterest: totalConstructionInterest,
      finalMonthlyPmt: finalMonthlyPmt,
      avgDrawnBalance: avgDrawnBalance
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_avgMonthlyInterest', formatCurrencyLocal(result.avgMonthlyInterest));
    setOutputText('output_totalConstructionInterest', formatCurrencyLocal(result.totalConstructionInterest));
    setOutputText('output_finalMonthlyMortgage', formatCurrencyLocal(result.finalMonthlyPmt));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalConstructionCost: inputs.totalConstructionCost,
        interestRate: inputs.interestRate,
        avgMonthlyInterest: result.avgMonthlyInterest,
        totalConstructionInterest: result.totalConstructionInterest,
        finalMonthlyMortgage: result.finalMonthlyPmt
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
          labels: ['Drawn Construction Balance', 'Undrawn Reserve', 'Total Build Interest Paid'],
          datasets: [{
            data: [result.avgDrawnBalance, inputs.totalConstructionCost - result.avgDrawnBalance, result.totalConstructionInterest],
            backgroundColor: ['#2F6F5E', '#DCE1E3', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Construction Budget & Interest Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly Payment Phase'],
          datasets: [
            {
              label: 'Average Construction Phase Interest Payment',
              data: [result.avgMonthlyInterest],
              backgroundColor: '#C08A2E'
            },
            {
              label: 'Final Permanent Mortgage Payment (P&I)',
              data: [result.finalMonthlyPmt],
              backgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Outlay: Construction Phase vs Permanent Mortgage' }
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

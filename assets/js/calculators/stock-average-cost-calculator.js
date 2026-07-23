(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      shareCount1: parseFloat(document.getElementById('input_shareCount1').value) || 0,
      sharePrice1: parseFloat(document.getElementById('input_sharePrice1').value) || 0,
      shareCount2: parseFloat(document.getElementById('input_shareCount2').value) || 0,
      sharePrice2: parseFloat(document.getElementById('input_sharePrice2').value) || 0
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
    var n1 = inputs.shareCount1;
    var p1 = inputs.sharePrice1;
    var n2 = inputs.shareCount2;
    var p2 = inputs.sharePrice2;

    var cost1 = n1 * p1;
    var cost2 = n2 * p2;
    var totalShares = n1 + n2;
    var totalCost = cost1 + cost2;

    if (totalShares <= 0) return null;

    var avgCost = totalCost / totalShares;

    return {
      totalShares: totalShares,
      totalCost: totalCost,
      avgCost: avgCost,
      cost1: cost1,
      cost2: cost2
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_totalSharesOwned', result.totalShares + ' Shares');
    setOutputText('output_totalCapitalInvested', formatCurrencyLocal(result.totalCost));
    setOutputText('output_weightedAverageCostPerShare', formatCurrencyLocal(result.avgCost) + ' / share');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        shareCount1: inputs.shareCount1,
        sharePrice1: inputs.sharePrice1,
        shareCount2: inputs.shareCount2,
        sharePrice2: inputs.sharePrice2,
        totalSharesOwned: result.totalShares,
        weightedAverageCostPerShare: result.avgCost
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
          labels: ['Tranche 1 Outlay', 'Tranche 2 Outlay'],
          datasets: [{
            data: [result.cost1, result.cost2],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Capital Invested Per Tranche' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'costVsAverage') {
      return {
        type: 'bar',
        data: {
          labels: ['Buy Price Per Share'],
          datasets: [
            {
              label: 'Tranche 1 Buy Price',
              data: [inputs.sharePrice1],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Tranche 2 Buy Price',
              data: [inputs.sharePrice2],
              backgroundColor: '#C08A2E'
            },
            {
              label: 'Weighted Average Cost',
              data: [result.avgCost],
              backgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Purchase Prices vs Weighted Average Cost' }
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

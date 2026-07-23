(function() {
  var chartInstance = null;
  var currentTab = 'mrrComparison';
  var lastChartData = null;

  function getInputs() {
    return {
      currentCustomers: parseFloat(document.getElementById('input_currentCustomers').value) || 0,
      currentPrice: parseFloat(document.getElementById('input_currentPrice').value) || 0,
      priceIncreasePercent: (parseFloat(document.getElementById('input_priceIncreasePercent').value) || 0) / 100,
      estimatedChurnPercent: (parseFloat(document.getElementById('input_estimatedChurnPercent').value) || 0) / 100,
      newCustomerAcquisitionMonthly: parseFloat(document.getElementById('input_newCustomerAcquisitionMonthly').value) || 0
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatPercent(val) {
    return (val * 100).toFixed(1) + '%';
  }

  function formatNumber(num) {
    return Math.round(num).toLocaleString();
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateImpact(inputs) {
    var oldMRR = inputs.currentCustomers * inputs.currentPrice;
    var newPrice = inputs.currentPrice * (1 + inputs.priceIncreasePercent);
    var churnedAccounts = inputs.currentCustomers * inputs.estimatedChurnPercent;
    var retainedAccounts = inputs.currentCustomers - churnedAccounts;
    var newMRR = retainedAccounts * newPrice;
    var netMRRGain = newMRR - oldMRR;

    var maxTolerableChurn = inputs.priceIncreasePercent / (1 + inputs.priceIncreasePercent);

    // Churn Sensitivity Array (0% to 25%)
    var churnRates = [0, 2.5, 5, 7.5, 10, 15, 20, 25];
    var sensitivityMRR = churnRates.map(function(cr) {
      var r = inputs.currentCustomers * (1 - (cr / 100));
      return r * newPrice;
    });

    return {
      oldMRR: oldMRR,
      newPrice: newPrice,
      churnedAccounts: churnedAccounts,
      retainedAccounts: retainedAccounts,
      newMRR: newMRR,
      netMRRGain: netMRRGain,
      maxTolerableChurn: maxTolerableChurn,
      churnRates: churnRates,
      sensitivityMRR: sensitivityMRR
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateImpact(inputs);

    setOutputText('output_oldMRR', formatCurrency(res.oldMRR));
    setOutputText('output_newPrice', formatCurrency(res.newPrice));
    setOutputText('output_churnedCustomers', formatNumber(res.churnedAccounts));
    setOutputText('output_newMRR', formatCurrency(res.newMRR));
    setOutputText('output_netMRRGain', (res.netMRRGain >= 0 ? '+' : '') + formatCurrency(res.netMRRGain));
    setOutputText('output_maxTolerableChurn', formatPercent(res.maxTolerableChurn));

    lastChartData = res;
    updateCharts(res);
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'mrrComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Baseline MRR', 'Post-Increase MRR'],
          datasets: [{
            label: 'MRR ($)',
            data: [data.oldMRR, data.newMRR],
            backgroundColor: ['#4A90D9', data.newMRR >= data.oldMRR ? '#4ade80' : '#f87171'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Revenue Comparison', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'sensitivity') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.churnRates.map(function(c) { return c + '% Churn'; }),
          datasets: [
            {
              label: 'Post-Increase MRR ($)',
              data: data.sensitivityMRR,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.1)',
              fill: true,
              tension: 0.2
            },
            {
              label: 'Baseline MRR Baseline',
              data: Array(data.churnRates.length).fill(data.oldMRR),
              borderColor: '#f87171',
              borderDash: [4, 4],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: 'MRR Impact across Churn Sensitivity', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_currentCustomers').value = 500;
    document.getElementById('input_currentPrice').value = 100;
    document.getElementById('input_priceIncreasePercent').value = 20;
    document.getElementById('input_estimatedChurnPercent').value = 5;
    document.getElementById('input_newCustomerAcquisitionMonthly').value = 20;
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

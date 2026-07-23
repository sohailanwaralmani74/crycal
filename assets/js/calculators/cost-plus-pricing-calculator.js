(function() {
  var chartInstance = null;
  var currentTab = 'costBreakdown';
  var lastChartData = null;

  function getInputs() {
    return {
      hostingStorageCost: parseFloat(document.getElementById('input_hostingStorageCost').value) || 0,
      customerSupportCost: parseFloat(document.getElementById('input_customerSupportCost').value) || 0,
      thirdPartyLicensingCost: parseFloat(document.getElementById('input_thirdPartyLicensingCost').value) || 0,
      paymentProcessingRate: (parseFloat(document.getElementById('input_paymentProcessingRate').value) || 0) / 100,
      targetGrossMargin: (parseFloat(document.getElementById('input_targetGrossMargin').value) || 0) / 100,
      expectedCustomers: parseFloat(document.getElementById('input_expectedCustomers').value) || 0
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
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

  function calculateCostPlus(inputs) {
    var totalCOGS = inputs.hostingStorageCost + inputs.customerSupportCost + inputs.thirdPartyLicensingCost;

    var divisor = Math.max(0.01, 1 - inputs.targetGrossMargin - inputs.paymentProcessingRate);
    var requiredPriceMonthly = totalCOGS / divisor;

    var grossProfitPerCustomer = (requiredPriceMonthly * (1 - inputs.paymentProcessingRate)) - totalCOGS;
    var totalMonthlyGrossProfit = grossProfitPerCustomer * inputs.expectedCustomers;
    var annualRevenuePotential = (requiredPriceMonthly * inputs.expectedCustomers) * 12;

    // Sensitivity across margins (50% to 90%)
    var marginTargets = [50, 60, 70, 75, 80, 85, 90];
    var sensitivityPrices = marginTargets.map(function(m) {
      var d = Math.max(0.01, 1 - (m / 100) - inputs.paymentProcessingRate);
      return totalCOGS / d;
    });

    return {
      totalCOGS: totalCOGS,
      requiredPriceMonthly: requiredPriceMonthly,
      grossProfitPerCustomer: grossProfitPerCustomer,
      totalMonthlyGrossProfit: totalMonthlyGrossProfit,
      annualRevenuePotential: annualRevenuePotential,
      marginTargets: marginTargets,
      sensitivityPrices: sensitivityPrices
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateCostPlus(inputs);

    setOutputText('output_totalCOGSPerCustomer', formatCurrency(res.totalCOGS));
    setOutputText('output_requiredPriceMonthly', formatCurrency(res.requiredPriceMonthly));
    setOutputText('output_grossProfitPerCustomer', formatCurrency(res.grossProfitPerCustomer));
    setOutputText('output_totalMonthlyGrossProfit', formatCurrency(res.totalMonthlyGrossProfit));
    setOutputText('output_annualRevenuePotential', formatCurrency(res.annualRevenuePotential));

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

    if (currentTab === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Direct COGS', 'Gross Profit', 'Calculated Price'],
          datasets: [{
            label: 'Amount ($ / Customer / Mo)',
            data: [data.totalCOGS, data.grossProfitPerCustomer, data.requiredPriceMonthly],
            backgroundColor: ['#f87171', '#4ade80', '#4A90D9'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Unit Price vs COGS Breakdown ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'marginSensitivity') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.marginTargets.map(function(m) { return m + '% Margin'; }),
          datasets: [{
            label: 'Required Price ($)',
            data: data.sensitivityPrices,
            borderColor: '#fbbf24',
            backgroundColor: 'rgba(251, 191, 36, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: 'Required Price by Target Margin %', color: '#e8edf0' }
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
    document.getElementById('input_hostingStorageCost').value = 8;
    document.getElementById('input_customerSupportCost').value = 12;
    document.getElementById('input_thirdPartyLicensingCost').value = 5;
    document.getElementById('input_paymentProcessingRate').value = 2.9;
    document.getElementById('input_targetGrossMargin').value = 75;
    document.getElementById('input_expectedCustomers').value = 300;
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

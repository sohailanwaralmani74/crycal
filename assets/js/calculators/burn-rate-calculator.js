(function() {
  var chartInstance = null;
  var currentTab = 'spendBreakdown';
  var lastChartData = null;

  function getInputs() {
    var payroll = parseFloat(document.getElementById('input_payroll').value) || 0;
    var hostingCloud = parseFloat(document.getElementById('input_hostingCloud').value) || 0;
    var marketingAds = parseFloat(document.getElementById('input_marketingAds').value) || 0;
    var officeOther = parseFloat(document.getElementById('input_officeOther').value) || 0;
    var monthlyCashIn = parseFloat(document.getElementById('input_monthlyCashIn').value) || 0;

    return {
      payroll: payroll,
      hostingCloud: hostingCloud,
      marketingAds: marketingAds,
      officeOther: officeOther,
      monthlyCashIn: monthlyCashIn
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + Math.round(amount).toLocaleString();
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

  function calculateBurn(inputs) {
    var grossBurn = inputs.payroll + inputs.hostingCloud + inputs.marketingAds + inputs.officeOther;
    var netBurn = grossBurn - inputs.monthlyCashIn;

    var annualizedGross = grossBurn * 12;
    var annualizedNet = netBurn * 12;
    var netBurnRatio = grossBurn > 0 ? Math.max(0, (netBurn / grossBurn) * 100) : 0;

    return {
      grossBurn: grossBurn,
      netBurn: netBurn,
      annualizedGrossBurn: annualizedGross,
      annualizedNetBurn: annualizedNet,
      burnEfficiency: netBurnRatio.toFixed(1) + '%',
      payroll: inputs.payroll,
      hostingCloud: inputs.hostingCloud,
      marketingAds: inputs.marketingAds,
      officeOther: inputs.officeOther,
      monthlyCashIn: inputs.monthlyCashIn
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var gross = inputs.payroll + inputs.hostingCloud + inputs.marketingAds + inputs.officeOther;

    if (gross <= 0) {
      setOutputText('output_grossBurn', '—');
      setOutputText('output_netBurn', '—');
      setOutputText('output_annualizedGrossBurn', '—');
      setOutputText('output_annualizedNetBurn', '—');
      setOutputText('output_burnEfficiency', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateBurn(inputs);

    setOutputText('output_grossBurn', formatCurrency(res.grossBurn));
    setOutputText('output_netBurn', res.netBurn > 0 ? formatCurrency(res.netBurn) : formatCurrency(res.netBurn) + ' (Net Cash Positive)');
    setOutputText('output_annualizedGrossBurn', formatCurrency(res.annualizedGrossBurn));
    setOutputText('output_annualizedNetBurn', res.annualizedNetBurn > 0 ? formatCurrency(res.annualizedNetBurn) : '$0 (Profitable)');
    setOutputText('output_burnEfficiency', res.burnEfficiency);

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        grossBurn: formatCurrency(res.grossBurn),
        netBurn: formatCurrency(res.netBurn),
        monthlyCashIn: inputs.monthlyCashIn,
        annualizedNetBurn: formatCurrency(res.annualizedNetBurn)
      });
    }
  }

  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var config = generateChartConfig(currentTab, data);
    if (!config) return;
    chartInstance = new Chart(ctx, config);
  }

  function generateChartConfig(tab, data) {
    if (!data) return null;

    if (tab === 'spendBreakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Payroll & Benefits', 'Hosting & Infra', 'Marketing & Ads', 'Admin & Office'],
          datasets: [{
            data: [data.payroll, data.hostingCloud, data.marketingAds, data.officeOther],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Gross Monthly Spend Distribution', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'grossVsNet') {
      return {
        type: 'bar',
        data: {
          labels: ['Gross Burn', 'Cash Receipts', 'Net Burn'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.grossBurn, data.monthlyCashIn, Math.max(0, data.netBurn)],
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Gross Spend vs Cash In vs Net Burn', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(0) + 'k'; } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_payroll').value = 120000;
    document.getElementById('input_hostingCloud').value = 15000;
    document.getElementById('input_marketingAds').value = 25000;
    document.getElementById('input_officeOther').value = 10000;
    document.getElementById('input_monthlyCashIn').value = 70000;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

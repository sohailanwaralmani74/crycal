(function() {
  var chartInstance = null;
  var currentTab = 'mrrComposition';
  var lastChartData = null;

  function getInputs() {
    return {
      activeCustomerBase: parseFloat(document.getElementById('input_activeCustomerBase').value) || 0,
      corePlanMRR: parseFloat(document.getElementById('input_corePlanMRR').value) || 0,
      addon1Price: parseFloat(document.getElementById('input_addon1Price').value) || 0,
      addon1AttachRate: (parseFloat(document.getElementById('input_addon1AttachRate').value) || 0) / 100,
      addon2Price: parseFloat(document.getElementById('input_addon2Price').value) || 0,
      addon2AttachRate: (parseFloat(document.getElementById('input_addon2AttachRate').value) || 0) / 100,
      premiumSupportPrice: parseFloat(document.getElementById('input_premiumSupportPrice').value) || 0,
      premiumSupportAttachRate: (parseFloat(document.getElementById('input_premiumSupportAttachRate').value) || 0) / 100
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateAddon(inputs) {
    var coreMRR = inputs.activeCustomerBase * inputs.corePlanMRR;

    var addon1MRR = (inputs.activeCustomerBase * inputs.addon1AttachRate) * inputs.addon1Price;
    var addon2MRR = (inputs.activeCustomerBase * inputs.addon2AttachRate) * inputs.addon2Price;
    var supportMRR = (inputs.activeCustomerBase * inputs.premiumSupportAttachRate) * inputs.premiumSupportPrice;

    var addonExpansionMRR = addon1MRR + addon2MRR + supportMRR;
    var totalBlendedMRR = coreMRR + addonExpansionMRR;

    var expansionARR = addonExpansionMRR * 12;
    var expansionArpuPercentage = coreMRR > 0 ? (addonExpansionMRR / coreMRR) : 0;

    return {
      coreMRR: coreMRR,
      addon1MRR: addon1MRR,
      addon2MRR: addon2MRR,
      supportMRR: supportMRR,
      addonExpansionMRR: addonExpansionMRR,
      totalBlendedMRR: totalBlendedMRR,
      expansionARR: expansionARR,
      expansionArpuPercentage: expansionArpuPercentage
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateAddon(inputs);

    setOutputText('output_coreMRR', formatCurrency(res.coreMRR));
    setOutputText('output_addonExpansionMRR', formatCurrency(res.addonExpansionMRR));
    setOutputText('output_totalBlendedMRR', formatCurrency(res.totalBlendedMRR));
    setOutputText('output_expansionARR', formatCurrency(res.expansionARR));
    setOutputText('output_expansionArpuPercentage', formatPercent(res.expansionArpuPercentage));

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

    if (currentTab === 'mrrComposition') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Core Base MRR', 'Add-On 1', 'Add-On 2', 'Premium Support'],
          datasets: [{
            data: [data.coreMRR, data.addon1MRR, data.addon2MRR, data.supportMRR],
            backgroundColor: ['#4A90D9', '#4ade80', '#fbbf24', '#a78bfa'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: 'Total MRR Composition ($)', color: '#e8edf0' }
          }
        }
      });
    } else if (currentTab === 'attachRateImpact') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Add-On 1 MRR', 'Add-On 2 MRR', 'Support MRR', 'Total Expansion MRR'],
          datasets: [{
            label: 'Expansion Revenue ($)',
            data: [data.addon1MRR, data.addon2MRR, data.supportMRR, data.addonExpansionMRR],
            backgroundColor: ['#4ade80', '#fbbf24', '#a78bfa', '#4A90D9'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Add-On Expansion Revenue ($)', color: '#e8edf0' }
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
    document.getElementById('input_activeCustomerBase').value = 800;
    document.getElementById('input_corePlanMRR').value = 79;
    document.getElementById('input_addon1Price').value = 29;
    document.getElementById('input_addon1AttachRate').value = 25;
    document.getElementById('input_addon2Price').value = 49;
    document.getElementById('input_addon2AttachRate').value = 15;
    document.getElementById('input_premiumSupportPrice').value = 199;
    document.getElementById('input_premiumSupportAttachRate').value = 8;
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

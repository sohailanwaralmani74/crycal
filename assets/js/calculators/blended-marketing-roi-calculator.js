(function() {
  var chartInstance = null;
  var currentTab = 'spend';
  var lastChartData = null;

  function getInputs() {
    var paidAdSpend = parseFloat(document.getElementById('input_paidAdSpend').value) || 0;
    var organicContentSpend = parseFloat(document.getElementById('input_organicContentSpend').value) || 0;
    var socialMediaSpend = parseFloat(document.getElementById('input_socialMediaSpend').value) || 0;
    var partnerAffiliateSpend = parseFloat(document.getElementById('input_partnerAffiliateSpend').value) || 0;
    var totalRevenueGenerated = parseFloat(document.getElementById('input_totalRevenueGenerated').value) || 0;

    return {
      paidAdSpend: paidAdSpend,
      organicContentSpend: organicContentSpend,
      socialMediaSpend: socialMediaSpend,
      partnerAffiliateSpend: partnerAffiliateSpend,
      totalRevenueGenerated: totalRevenueGenerated
    }
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateBlendedRoi(inputs) {
    var totalSpend = inputs.paidAdSpend + inputs.organicContentSpend + inputs.socialMediaSpend + inputs.partnerAffiliateSpend;
    var revenue = inputs.totalRevenueGenerated;

    if (totalSpend <= 0) {
      return { error: 'Total marketing spend must be greater than zero.' };
    }

    var netProfit = revenue - totalSpend;
    var blendedRoi = (netProfit / totalSpend) * 100;
    var blendedRoas = revenue / totalSpend;

    return {
      totalMarketingSpend: totalSpend,
      netProfit: netProfit,
      blendedRoi: blendedRoi,
      blendedRoas: blendedRoas,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateBlendedRoi(inputs);

    if (result.error) {
      setOutputText('output_totalMarketingSpend', '—');
      setOutputText('output_netProfit', '—');
      setOutputText('output_blendedRoi', '—');
      setOutputText('output_blendedRoas', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalMarketingSpend', formatCurrency(result.totalMarketingSpend));
    setOutputText('output_netProfit', formatCurrency(result.netProfit));
    setOutputText('output_blendedRoi', result.blendedRoi.toFixed(0) + '%');
    setOutputText('output_blendedRoas', result.blendedRoas.toFixed(2) + 'x (MER)');

    var chartPayload = {
      paidSpend: inputs.paidAdSpend,
      organicSpend: inputs.organicContentSpend,
      socialSpend: inputs.socialMediaSpend,
      partnerSpend: inputs.partnerAffiliateSpend,
      totalSpend: result.totalMarketingSpend,
      revenue: inputs.totalRevenueGenerated,
      netProfit: result.netProfit
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        paidAdSpend: inputs.paidAdSpend,
        totalRevenueGenerated: inputs.totalRevenueGenerated,
        totalMarketingSpend: formatCurrency(result.totalMarketingSpend),
        blendedRoi: result.blendedRoi.toFixed(0) + '%'
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
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'spend') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Paid Ads', 'SEO Content', 'Social & PR', 'Partner & Affiliate'],
          datasets: [{
            data: [data.paidSpend, data.organicSpend, data.socialSpend, data.partnerSpend],
            backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Channel Spend Distribution ($)', color: '#e8edf0' }
          }
        }
      }
    }

    if (tab === 'returns') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Spend', 'Total Revenue', 'Net Profit'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.totalSpend, data.revenue, data.netProfit],
            backgroundColor: ['#ef4444', '#3b82f6', data.netProfit >= 0 ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Blended Financial Returns ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      }
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    var _el_input_paidAdSpend = document.getElementById('input_paidAdSpend');
    _el_input_paidAdSpend.value = (_el_input_paidAdSpend.dataset && _el_input_paidAdSpend.dataset.default !== undefined) ? _el_input_paidAdSpend.dataset.default : (_el_input_paidAdSpend.getAttribute('value') || '');
    var _el_input_organicContentSpend = document.getElementById('input_organicContentSpend');
    _el_input_organicContentSpend.value = (_el_input_organicContentSpend.dataset && _el_input_organicContentSpend.dataset.default !== undefined) ? _el_input_organicContentSpend.dataset.default : (_el_input_organicContentSpend.getAttribute('value') || '');
    var _el_input_socialMediaSpend = document.getElementById('input_socialMediaSpend');
    _el_input_socialMediaSpend.value = (_el_input_socialMediaSpend.dataset && _el_input_socialMediaSpend.dataset.default !== undefined) ? _el_input_socialMediaSpend.dataset.default : (_el_input_socialMediaSpend.getAttribute('value') || '');
    var _el_input_partnerAffiliateSpend = document.getElementById('input_partnerAffiliateSpend');
    _el_input_partnerAffiliateSpend.value = (_el_input_partnerAffiliateSpend.dataset && _el_input_partnerAffiliateSpend.dataset.default !== undefined) ? _el_input_partnerAffiliateSpend.dataset.default : (_el_input_partnerAffiliateSpend.getAttribute('value') || '');
    var _el_input_totalRevenueGenerated = document.getElementById('input_totalRevenueGenerated');
    _el_input_totalRevenueGenerated.value = (_el_input_totalRevenueGenerated.dataset && _el_input_totalRevenueGenerated.dataset.default !== undefined) ? _el_input_totalRevenueGenerated.dataset.default : (_el_input_totalRevenueGenerated.getAttribute('value') || '');
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    
    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });
})();

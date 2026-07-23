(function() {

  var chartInstance = null;
  var currentTab = 'paybackByChannel';
  var lastChartData = null;

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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function updateTool() {

    var googleAdsCac = parseFloat(document.getElementById('input_googleAdsCac').value) || 0;
    var linkedInCac = parseFloat(document.getElementById('input_linkedInCac').value) || 0;
    var seoCac = parseFloat(document.getElementById('input_seoCac').value) || 0;
    var outboundCac = parseFloat(document.getElementById('input_outboundCac').value) || 0;
    var arpu = parseFloat(document.getElementById('input_arpu').value) || 1;
    var grossMargin = (parseFloat(document.getElementById('input_grossMargin').value) || 80) / 100;

    var monthlyGrossProfit = arpu * grossMargin;
    if (monthlyGrossProfit <= 0) monthlyGrossProfit = 1;

    var googlePayback = googleAdsCac / monthlyGrossProfit;
    var linkedInPayback = linkedInCac / monthlyGrossProfit;
    var seoPayback = seoCac / monthlyGrossProfit;
    var outboundPayback = outboundCac / monthlyGrossProfit;

    var channels = [
      { name: 'Google Ads', payback: googlePayback, cac: googleAdsCac },
      { name: 'LinkedIn Ads', payback: linkedInPayback, cac: linkedInCac },
      { name: 'SEO Inbound', payback: seoPayback, cac: seoCac },
      { name: 'Outbound Sales', payback: outboundPayback, cac: outboundCac }
    ];

    channels.sort(function(a, b) { return a.payback - b.payback; });
    var fastestChannel = channels[0].name + ' (' + channels[0].payback.toFixed(1) + ' Mo)';

    var status = '✅ Channel Breakdown Analyzed';
    var recommendation = 'Reallocate ad budget from ' + channels[3].name + ' (' + channels[3].payback.toFixed(1) + ' Mo payback) toward ' + channels[0].name + ' to accelerate cash recovery.';

    setOutputText('output_googlePayback', googlePayback.toFixed(1) + ' Mo');
    setOutputText('output_linkedInPayback', linkedInPayback.toFixed(1) + ' Mo');
    setOutputText('output_seoPayback', seoPayback.toFixed(1) + ' Mo');
    setOutputText('output_outboundPayback', outboundPayback.toFixed(1) + ' Mo');
    setOutputText('output_fastestChannel', fastestChannel);
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      googlePayback: googlePayback,
      linkedInPayback: linkedInPayback,
      seoPayback: seoPayback,
      outboundPayback: outboundPayback,
      googleAdsCac: googleAdsCac,
      linkedInCac: linkedInCac,
      seoCac: seoCac,
      outboundCac: outboundCac
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        googleAdsCac: googleAdsCac,
        seoCac: seoCac,
        fastestChannel: fastestChannel,
        status: status
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
    if (tab === 'paybackByChannel') {
      return {
        type: 'bar',
        data: {
          labels: ['Google Ads', 'LinkedIn Ads', 'SEO Inbound', 'Outbound Sales'],
          datasets: [{
            label: 'Payback Period (Months)',
            data: [data.googlePayback, data.linkedInPayback, data.seoPayback, data.outboundPayback],
            backgroundColor: ['#60A5FA', '#EC4899', '#34D399', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'cacVsPayback') {
      return {
        type: 'bar',
        data: {
          labels: ['Google Ads CAC', 'LinkedIn Ads CAC', 'SEO CAC', 'Outbound CAC'],
          datasets: [{
            label: 'CAC ($)',
            data: [data.googleAdsCac, data.linkedInCac, data.seoCac, data.outboundCac],
            backgroundColor: ['#60A5FA', '#EC4899', '#34D399', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    return null;

  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {

    document.getElementById('input_googleAdsCac').value = 1200;
    document.getElementById('input_linkedInCac').value = 2400;
    document.getElementById('input_seoCac').value = 600;
    document.getElementById('input_outboundCac').value = 3000;
    document.getElementById('input_arpu').value = 200;
    document.getElementById('input_grossMargin').value = 80;
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

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();

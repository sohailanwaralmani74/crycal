(function() {

  var chartInstance = null;
  var currentTab = 'mrrWaterfall';
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

    var startMrr = parseFloat(document.getElementById('input_startMrr').value) || 1;
    var newMrr = parseFloat(document.getElementById('input_newMrr').value) || 0;
    var expansionMrr = parseFloat(document.getElementById('input_expansionMrr').value) || 0;
    var contractionMrr = parseFloat(document.getElementById('input_contractionMrr').value) || 0;
    var churnedMrr = parseFloat(document.getElementById('input_churnedMrr').value) || 0;

    var netNewMrr = newMrr + expansionMrr - contractionMrr - churnedMrr;
    var endingMrr = startMrr + netNewMrr;
    var momGrowthRate = (netNewMrr / startMrr);
    var annualizedGrowthRate = (Math.pow(1 + momGrowthRate, 12) - 1);
    var nrrNumerator = startMrr + expansionMrr - contractionMrr - churnedMrr;
    var netRetentionRate = (nrrNumerator / startMrr);

    var status = '';
    var recommendation = '';

    if (momGrowthRate >= 0.10) {
      status = '🚀 Hyper-Growth (>= 10% MoM)';
      recommendation = 'Outstanding revenue velocity. Scale sales hiring and marketing channels aggressively.';
    } else if (momGrowthRate >= 0.05) {
      status = '✅ Strong Growth (5% - 9.9% MoM)';
      recommendation = 'Solid growth cadence. Focus on upsells to drive Net Revenue Retention above 115%.';
    } else if (momGrowthRate >= 0.01) {
      status = '🟡 Moderate Growth (1% - 4.9% MoM)';
      recommendation = 'Growth is slowing. Audit inbound trial conversions and customer churn root causes.';
    } else {
      status = '🔴 Flat / Negative Growth (< 1% MoM)';
      recommendation = 'Revenue is stagnant or shrinking. Address churn immediately and optimize pricing tiers.';
    }

    setOutputText('output_endingMrr', formatCurrency(endingMrr));
    setOutputText('output_netNewMrr', formatCurrency(netNewMrr));
    setOutputText('output_momGrowthRate', formatPercent(momGrowthRate));
    setOutputText('output_annualizedGrowthRate', formatPercent(annualizedGrowthRate));
    setOutputText('output_netRetentionRate', formatPercent(netRetentionRate));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      startMrr: startMrr,
      newMrr: newMrr,
      expansionMrr: expansionMrr,
      contractionMrr: contractionMrr,
      churnedMrr: churnedMrr,
      endingMrr: endingMrr
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startMrr: startMrr,
        netNewMrr: netNewMrr,
        momGrowthRate: (momGrowthRate * 100).toFixed(1) + '%',
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
    if (tab === 'mrrWaterfall') {
      return {
        type: 'bar',
        data: {
          labels: ['Start MRR', 'New MRR', 'Expansion MRR', 'Contraction MRR', 'Churned MRR', 'Ending MRR'],
          datasets: [{
            label: 'MRR ($)',
            data: [data.startMrr, data.newMrr, data.expansionMrr, -data.contractionMrr, -data.churnedMrr, data.endingMrr],
            backgroundColor: ['#60A5FA', '#34D399', '#34D399', '#EC4899', '#EC4899', '#8B5CF6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'retentionSplit') {
      return {
        type: 'bar',
        data: {
          labels: ['Gross Additions (New + Expansion)', 'Gross Losses (Contraction + Churn)'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.newMrr + data.expansionMrr, data.contractionMrr + data.churnedMrr],
            backgroundColor: ['#34D399', '#EC4899']
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

    document.getElementById('input_startMrr').value = 50000;
    document.getElementById('input_newMrr').value = 6000;
    document.getElementById('input_expansionMrr').value = 2500;
    document.getElementById('input_contractionMrr').value = 1000;
    document.getElementById('input_churnedMrr').value = 1500;
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

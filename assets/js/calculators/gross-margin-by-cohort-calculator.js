(function() {

  var chartInstance = null;
  var currentTab = 'cohortMarginBar';
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

    var c2022Rev = parseFloat(document.getElementById('input_c2022Rev').value) || 0;
    var c2022Cogs = parseFloat(document.getElementById('input_c2022Cogs').value) || 0;
    var c2023Rev = parseFloat(document.getElementById('input_c2023Rev').value) || 0;
    var c2023Cogs = parseFloat(document.getElementById('input_c2023Cogs').value) || 0;
    var c2024Rev = parseFloat(document.getElementById('input_c2024Rev').value) || 0;
    var c2024Cogs = parseFloat(document.getElementById('input_c2024Cogs').value) || 0;

    var m2022 = c2022Rev > 0 ? (c2022Rev - c2022Cogs) / c2022Rev : 0;
    var m2023 = c2023Rev > 0 ? (c2023Rev - c2023Cogs) / c2023Rev : 0;
    var m2024 = c2024Rev > 0 ? (c2024Rev - c2024Cogs) / c2024Rev : 0;

    var totalRev = c2022Rev + c2023Rev + c2024Rev;
    var totalCogs = c2022Cogs + c2023Cogs + c2024Cogs;
    var blendedMargin = totalRev > 0 ? (totalRev - totalCogs) / totalRev : 0;
    var marginExpansion = (m2024 - m2022) * 100;

    var status = '';
    var recommendation = '';

    if (m2024 >= m2022 && blendedMargin >= 0.75) {
      status = '🚀 Expanding Cohort Margins (Blended >= 75%)';
      recommendation = 'Strong operational leverage. Newer cohorts achieve high gross margins right from onboarding.';
    } else if (blendedMargin >= 0.70) {
      status = '✅ Healthy Margin Trajectory (70% - 74%)';
      recommendation = 'Solid cohort profile. Automate onboarding workflows to push 2024 cohort margin past 75%.';
    } else {
      status = '🟡 Suppressed Cohort Efficiency (< 70%)';
      recommendation = 'Margin expansion is lagging. Audit customer success headcount and cloud hosting costs across cohorts.';
    }

    setOutputText('output_c2022Margin', formatPercent(m2022));
    setOutputText('output_c2023Margin', formatPercent(m2023));
    setOutputText('output_c2024Margin', formatPercent(m2024));
    setOutputText('output_blendedMargin', formatPercent(blendedMargin));
    setOutputText('output_marginExpansion', marginExpansion.toFixed(1) + ' pts');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      m2022: m2022,
      m2023: m2023,
      m2024: m2024,
      c2022Rev: c2022Rev,
      c2022Cogs: c2022Cogs,
      c2023Rev: c2023Rev,
      c2023Cogs: c2023Cogs,
      c2024Rev: c2024Rev,
      c2024Cogs: c2024Cogs
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        c2022Rev: c2022Rev,
        c2024Rev: c2024Rev,
        blendedMargin: (blendedMargin * 100).toFixed(1) + '%',
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
    if (tab === 'cohortMarginBar') {
      return {
        type: 'bar',
        data: {
          labels: ['2022 Cohort Margin', '2023 Cohort Margin', '2024 Cohort Margin'],
          datasets: [{
            label: 'Gross Margin (%)',
            data: [data.m2022 * 100, data.m2023 * 100, data.m2024 * 100],
            backgroundColor: ['#60A5FA', '#F59E0B', '#34D399']
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
    if (tab === 'cohortRevenueCogs') {
      return {
        type: 'bar',
        data: {
          labels: ['2022 Cohort', '2023 Cohort', '2024 Cohort'],
          datasets: [
            { label: 'Revenue ($)', data: [data.c2022Rev, data.c2023Rev, data.c2024Rev], backgroundColor: '#60A5FA' },
            { label: 'COGS ($)', data: [data.c2022Cogs, data.c2023Cogs, data.c2024Cogs], backgroundColor: '#EC4899' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

    document.getElementById('input_c2022Rev').value = 120000;
    document.getElementById('input_c2022Cogs').value = 36000;
    document.getElementById('input_c2023Rev').value = 250000;
    document.getElementById('input_c2023Cogs').value = 60000;
    document.getElementById('input_c2024Rev').value = 450000;
    document.getElementById('input_c2024Cogs').value = 90000;
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

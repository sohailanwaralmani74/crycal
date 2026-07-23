(function() {

  var chartInstance = null;
  var currentTab = 'paybackTimeline';
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

    var cac = parseFloat(document.getElementById('input_cac').value) || 0;
    var arpu = parseFloat(document.getElementById('input_arpu').value) || 0;
    var grossMargin = (parseFloat(document.getElementById('input_grossMargin').value) || 0) / 100;

    var monthlyGrossProfit = arpu * grossMargin;
    var paybackMonths = monthlyGrossProfit > 0 ? (cac / monthlyGrossProfit) : 0;
    var paybackYears = paybackMonths / 12;

    var status = '';
    var recommendation = '';

    if (paybackMonths <= 12) {
      status = '✅ Top-Tier Efficiency (< 12 Mo)';
      recommendation = 'Rapid capital recovery. Aggressively scale sales and marketing spend.';
    } else if (paybackMonths <= 18) {
      status = '✅ Healthy Payback (12 - 18 Mo)';
      recommendation = 'Solid payback period. Maintain current GTM execution while optimizing onboarding conversion.';
    } else if (paybackMonths <= 24) {
      status = '🟡 Moderate Payback (18 - 24 Mo)';
      recommendation = 'Capital intensity is high. Push for annual upfront contracts to improve cash velocity.';
    } else {
      status = '🔴 High Risk Payback (> 24 Mo)';
      recommendation = 'Payback period is dangerously long. Audit sales cycle length, ad channel ROI, and pricing tiers.';
    }

    setOutputText('output_paybackMonths', paybackMonths.toFixed(1) + ' Mo');
    setOutputText('output_paybackYears', paybackYears.toFixed(2) + ' Yrs');
    setOutputText('output_monthlyGrossProfit', formatCurrency(monthlyGrossProfit));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      cac: cac,
      monthlyGrossProfit: monthlyGrossProfit,
      paybackMonths: paybackMonths
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        cac: cac,
        arpu: arpu,
        paybackMonths: paybackMonths.toFixed(1),
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
    if (tab === 'paybackTimeline') {
      var months = [0, 6, 12, 18, 24, 30, 36];
      var netCashFlows = months.map(function(m) { return (data.monthlyGrossProfit * m) - data.cac; });
      return {
        type: 'line',
        data: {
          labels: months.map(function(m){ return 'Month ' + m; }),
          datasets: [{
            label: 'Net Cash Position ($)',
            data: netCashFlows,
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Payback', 'SMB Target (12Mo)', 'Enterprise Target (18Mo)'],
          datasets: [{
            label: 'Months',
            data: [data.paybackMonths, 12, 18],
            backgroundColor: ['#60A5FA', '#34D399', '#F59E0B']
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

    document.getElementById('input_cac').value = 1500;
    document.getElementById('input_arpu').value = 150;
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

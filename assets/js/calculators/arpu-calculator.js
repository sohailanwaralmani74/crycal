(function() {

  var chartInstance = null;
  var currentTab = 'arpuBreakdown';
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

    var totalMrr = parseFloat(document.getElementById('input_totalMrr').value) || 0;
    var totalUsers = parseFloat(document.getElementById('input_totalUsers').value) || 1;
    var expansionRev = parseFloat(document.getElementById('input_expansionRev').value) || 0;

    var arpu = totalMrr / totalUsers;
    var annualArpu = arpu * 12;
    var baseMrr = Math.max(0, totalMrr - expansionRev);
    var baseArpu = baseMrr / totalUsers;
    var expansionArpu = expansionRev / totalUsers;

    var status = '';
    var recommendation = '';

    if (arpu >= 500) {
      status = '✅ Mid-Market / Enterprise ARPU (>= $500/mo)';
      recommendation = 'High ARPU tier. Leverage high-touch sales reps and customer success managers to drive retention.';
    } else if (arpu >= 100) {
      status = '✅ Healthy SMB ARPU ($100 - $499/mo)';
      recommendation = 'Solid SMB positioning. Test usage-based tiering to capture upside from heavy power users.';
    } else if (arpu >= 25) {
      status = '🟡 Self-Serve SMB ARPU ($25 - $99/mo)';
      recommendation = 'Ensure self-serve onboarding is automated to keep CAC low relative to monthly subscriber ARPU.';
    } else {
      status = '🔴 Micro / Consumer ARPU (< $25/mo)';
      recommendation = 'ARPU is low. Focus on viral product-led growth (PLG) loops or introduce premium feature add-ons.';
    }

    setOutputText('output_arpu', formatCurrency(arpu) + ' / mo');
    setOutputText('output_annualArpu', formatCurrency(annualArpu) + ' / yr');
    setOutputText('output_baseArpu', formatCurrency(baseArpu) + ' / mo');
    setOutputText('output_expansionArpu', formatCurrency(expansionArpu) + ' / mo');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      baseArpu: baseArpu,
      expansionArpu: expansionArpu,
      arpu: arpu,
      annualArpu: annualArpu
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalMrr: totalMrr,
        totalUsers: totalUsers,
        arpu: formatCurrency(arpu),
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
    if (tab === 'arpuBreakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Base Subscription ARPU', 'Expansion / Add-On ARPU'],
          datasets: [{
            data: [data.baseArpu, data.expansionArpu],
            backgroundColor: ['#60A5FA', '#34D399'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#e8edf0' } } }
        }
      };
    }
    if (tab === 'annualizedChart') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly ARPU', 'Annualized ARPU'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.arpu, data.annualArpu],
            backgroundColor: ['#34D399', '#F59E0B']
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

    document.getElementById('input_totalMrr').value = 50000;
    document.getElementById('input_totalUsers').value = 1000;
    document.getElementById('input_expansionRev').value = 5000;
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

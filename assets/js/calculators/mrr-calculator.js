(function() {

  var chartInstance = null;
  var currentTab = 'mrrByTier';
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

    var starterCount = parseFloat(document.getElementById('input_starterCount').value) || 0;
    var starterPrice = parseFloat(document.getElementById('input_starterPrice').value) || 0;
    var proCount = parseFloat(document.getElementById('input_proCount').value) || 0;
    var proPrice = parseFloat(document.getElementById('input_proPrice').value) || 0;
    var enterpriseCount = parseFloat(document.getElementById('input_enterpriseCount').value) || 0;
    var enterprisePrice = parseFloat(document.getElementById('input_enterprisePrice').value) || 0;

    var starterMrr = starterCount * starterPrice;
    var proMrr = proCount * proPrice;
    var enterpriseMrr = enterpriseCount * enterprisePrice;
    var totalMrr = starterMrr + proMrr + enterpriseMrr;

    var totalSubscribers = starterCount + proCount + enterpriseCount;
    var blendedArpu = totalSubscribers > 0 ? (totalMrr / totalSubscribers) : 0;

    var status = '';
    var recommendation = '';

    if (totalMrr >= 100000) {
      status = '🚀 Scale-Stage MRR (>= $100k/mo)';
      recommendation = 'ARR run-rate exceeds $1.2M. Focus on expansion revenue and churn reduction.';
    } else if (totalMrr >= 25000) {
      status = '✅ Growth-Stage MRR ($25k - $99k/mo)';
      recommendation = 'Solid recurring revenue foundation. Scale paid acquisition channels and inside sales AEs.';
    } else if (totalMrr >= 5000) {
      status = '✅ Early Traction MRR ($5k - $24k/mo)';
      recommendation = 'Product-market fit validating. Focus on increasing Pro and Enterprise tier conversion.';
    } else {
      status = '🟡 Early Stage MRR (< $5k/mo)';
      recommendation = 'Early traction phase. Optimize free trial landing page conversion and core features.';
    }

    setOutputText('output_totalMrr', formatCurrency(totalMrr));
    setOutputText('output_starterMrr', formatCurrency(starterMrr));
    setOutputText('output_proMrr', formatCurrency(proMrr));
    setOutputText('output_enterpriseMrr', formatCurrency(enterpriseMrr));
    setOutputText('output_totalSubscribers', totalSubscribers.toLocaleString() + ' Users');
    setOutputText('output_blendedArpu', formatCurrency(blendedArpu) + ' / mo');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      starterMrr: starterMrr,
      proMrr: proMrr,
      enterpriseMrr: enterpriseMrr,
      starterCount: starterCount,
      proCount: proCount,
      enterpriseCount: enterpriseCount
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalSubscribers: totalSubscribers,
        totalMrr: formatCurrency(totalMrr),
        blendedArpu: formatCurrency(blendedArpu),
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
    if (tab === 'mrrByTier') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Starter Tier MRR', 'Pro Tier MRR', 'Enterprise Tier MRR'],
          datasets: [{
            data: [data.starterMrr, data.proMrr, data.enterpriseMrr],
            backgroundColor: ['#60A5FA', '#34D399', '#F59E0B'],
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
    if (tab === 'subscriberByTier') {
      return {
        type: 'bar',
        data: {
          labels: ['Starter Users', 'Pro Users', 'Enterprise Accounts'],
          datasets: [{
            label: 'Subscribers',
            data: [data.starterCount, data.proCount, data.enterpriseCount],
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

    document.getElementById('input_starterCount').value = 120;
    document.getElementById('input_starterPrice').value = 29;
    document.getElementById('input_proCount').value = 80;
    document.getElementById('input_proPrice').value = 99;
    document.getElementById('input_enterpriseCount').value = 15;
    document.getElementById('input_enterprisePrice').value = 499;
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

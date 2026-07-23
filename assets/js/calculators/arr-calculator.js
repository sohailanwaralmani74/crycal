(function() {

  var chartInstance = null;
  var currentTab = 'arrComposition';
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

    var currentMrr = parseFloat(document.getElementById('input_currentMrr').value) || 0;
    var annualPrepaidContracts = parseFloat(document.getElementById('input_annualPrepaidContracts').value) || 0;
    var contractTermYears = parseFloat(document.getElementById('input_contractTermYears').value) || 1.0;

    var mrrRunrate = currentMrr * 12;
    var contractArr = contractTermYears > 0 ? (annualPrepaidContracts / contractTermYears) : 0;
    var arr = mrrRunrate + contractArr;
    var impliedQuarterlyRevenue = arr / 4;

    var status = '';
    var recommendation = '';

    if (arr >= 10000000) {
      status = '🚀 Enterprise Scale ARR (>= $10M ARR)';
      recommendation = 'Scale milestone achieved. Prepare for Series C/D expansion or pre-IPO corporate readiness.';
    } else if (arr >= 3000000) {
      status = '✅ Expansion Stage ARR ($3M - $9.9M ARR)';
      recommendation = 'Strong venture scale. Expand international sales teams and cross-sell enterprise modules.';
    } else if (arr >= 1000000) {
      status = '✅ $1M ARR Milestone ($1M - $2.9M ARR)';
      recommendation = '$1M ARR milestone crossed! Focus on building a repeatable AE sales hiring engine.';
    } else {
      status = '🟡 Early Stage ARR (< $1M ARR)';
      recommendation = 'Early traction. Focus on reaching the $1M ARR milestone through founder-led sales.';
    }

    setOutputText('output_arr', formatCurrency(arr));
    setOutputText('output_mrrRunrate', formatCurrency(mrrRunrate));
    setOutputText('output_contractArr', formatCurrency(contractArr));
    setOutputText('output_impliedQuarterlyRevenue', formatCurrency(impliedQuarterlyRevenue));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      mrrRunrate: mrrRunrate,
      contractArr: contractArr,
      arr: arr,
      impliedQuarterlyRevenue: impliedQuarterlyRevenue
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentMrr: currentMrr,
        arr: formatCurrency(arr),
        impliedQuarterlyRevenue: formatCurrency(impliedQuarterlyRevenue),
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
    if (tab === 'arrComposition') {
      return {
        type: 'doughnut',
        data: {
          labels: ['MRR Run-Rate (MRR x 12)', 'Contract ARR'],
          datasets: [{
            data: [data.mrrRunrate, data.contractArr],
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
    if (tab === 'quarterlyProjection') {
      var qVal = data.impliedQuarterlyRevenue;
      return {
        type: 'bar',
        data: {
          labels: ['Q1 Revenue', 'Q2 Revenue', 'Q3 Revenue', 'Q4 Revenue'],
          datasets: [{
            label: 'Quarterly Revenue ($)',
            data: [qVal, qVal, qVal, qVal],
            backgroundColor: ['#60A5FA', '#34D399', '#F59E0B', '#8B5CF6']
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

    document.getElementById('input_currentMrr').value = 85000;
    document.getElementById('input_annualPrepaidContracts').value = 120000;
    document.getElementById('input_contractTermYears').value = 1.0;
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

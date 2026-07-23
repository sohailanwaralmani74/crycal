(function() {
  var chartInstance = null;
  var currentTab = 'split';
  var lastChartData = null;

  function getInputs() {
    var totalAdBudget = parseFloat(document.getElementById('input_totalAdBudget').value) || 0;
    var brandShare = parseFloat(document.getElementById('input_brandShare').value) || 60;
    var performanceShare = parseFloat(document.getElementById('input_performanceShare').value) || 40;
    var expectedPerformanceCac = parseFloat(document.getElementById('input_expectedPerformanceCac').value) || 800;

    return {
      totalAdBudget: totalAdBudget,
      brandShare: brandShare,
      performanceShare: performanceShare,
      expectedPerformanceCac: expectedPerformanceCac
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateBrandVsPerformance(inputs) {
    var budget = inputs.totalAdBudget;
    var cac = inputs.expectedPerformanceCac;
    var totalShare = inputs.brandShare + inputs.performanceShare;

    if (budget <= 0 || cac <= 0) {
      return { error: 'Budget and CAC must be greater than zero.' };
    }

    var normBrand = totalShare > 0 ? (inputs.brandShare / totalShare) : 0.6;
    var normPerf = totalShare > 0 ? (inputs.performanceShare / totalShare) : 0.4;

    var brandBudget = budget * normBrand;
    var perfBudget = budget * normPerf;
    var directAcquisitions = Math.round(perfBudget / cac);
    var organicLift = 1.0 + (normBrand * 0.35);

    return {
      brandBudget: brandBudget,
      performanceBudget: perfBudget,
      directAcquisitions: directAcquisitions,
      longTermBrandImpact: organicLift,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateBrandVsPerformance(inputs);

    if (result.error) {
      setOutputText('output_brandBudget', '—');
      setOutputText('output_performanceBudget', '—');
      setOutputText('output_directAcquisitions', '—');
      setOutputText('output_longTermBrandImpact', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_brandBudget', formatCurrency(result.brandBudget));
    setOutputText('output_performanceBudget', formatCurrency(result.performanceBudget));
    setOutputText('output_directAcquisitions', result.directAcquisitions + ' customers/mo');
    setOutputText('output_longTermBrandImpact', result.longTermBrandImpact.toFixed(2) + 'x Organic Lift Factor');

    var chartPayload = {
      brandBudget: result.brandBudget,
      performanceBudget: result.performanceBudget,
      acquisitions: result.directAcquisitions,
      lift: result.longTermBrandImpact
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalAdBudget: inputs.totalAdBudget,
        brandBudget: formatCurrency(result.brandBudget),
        performanceBudget: formatCurrency(result.performanceBudget),
        directAcquisitions: result.directAcquisitions
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

    if (tab === 'split') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Brand Awareness Budget', 'Direct Response Performance Budget'],
          datasets: [{
            data: [data.brandBudget, data.performanceBudget],
            backgroundColor: ['#8b5cf6', '#3b82f6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Ad Budget Allocation Split ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'impact') {
      return {
        type: 'bar',
        data: {
          labels: ['Direct Response Spend', 'Brand Awareness Spend'],
          datasets: [{
            label: 'Budget ($)',
            data: [data.performanceBudget, data.brandBudget],
            backgroundColor: ['#3b82f6', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Campaign Investment Focus ($)', color: '#e8edf0' }
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
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    document.getElementById('input_totalAdBudget').value = 40000;
    document.getElementById('input_brandShare').value = 60;
    document.getElementById('input_performanceShare').value = 40;
    document.getElementById('input_expectedPerformanceCac').value = 800;
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

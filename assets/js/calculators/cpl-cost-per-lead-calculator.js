(function() {
  var chartInstance = null;
  var currentTab = 'cost';
  var lastChartData = null;

  function getInputs() {
    var totalAdSpend = parseFloat(document.getElementById('input_totalAdSpend').value) || 0;
    var totalLeads = parseFloat(document.getElementById('input_totalLeads').value) || 0;
    var mqlConversionRate = parseFloat(document.getElementById('input_mqlConversionRate').value) || 40;
    var targetCpl = parseFloat(document.getElementById('input_targetCpl').value) || 0;

    return {
      totalAdSpend: totalAdSpend,
      totalLeads: totalLeads,
      mqlConversionRate: mqlConversionRate / 100,
      targetCpl: targetCpl
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
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

  function calculateCPL(inputs) {
    var spend = inputs.totalAdSpend;
    var leads = inputs.totalLeads;
    var rate = inputs.mqlConversionRate;
    var target = inputs.targetCpl;

    if (leads <= 0) {
      return { error: 'Total leads must be greater than zero.' };
    }

    var cpl = spend / leads;
    var mqlCount = Math.round(leads * rate);
    var costPerMql = mqlCount > 0 ? (spend / mqlCount) : 0;
    var variance = target > 0 ? (cpl - target) : 0;

    return {
      cpl: cpl,
      mqlCount: mqlCount,
      costPerMql: costPerMql,
      variance: variance,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateCPL(inputs);

    if (result.error) {
      setOutputText('output_cpl', '—');
      setOutputText('output_mqlCount', '—');
      setOutputText('output_costPerMql', '—');
      setOutputText('output_cplVariance', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_cpl', formatCurrency(result.cpl));
    setOutputText('output_mqlCount', result.mqlCount + ' MQLs');
    setOutputText('output_costPerMql', formatCurrency(result.costPerMql));
    
    if (inputs.targetCpl > 0) {
      var varText = formatCurrency(Math.abs(result.variance)) + (result.variance <= 0 ? ' (Under Target)' : ' (Over Target)');
      setOutputText('output_cplVariance', varText);
    } else {
      setOutputText('output_cplVariance', 'N/A');
    }

    var chartPayload = {
      cpl: result.cpl,
      costPerMql: result.costPerMql,
      targetCpl: inputs.targetCpl
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalAdSpend: inputs.totalAdSpend,
        totalLeads: inputs.totalLeads,
        cpl: formatCurrency(result.cpl),
        costPerMql: formatCurrency(result.costPerMql)
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

    if (tab === 'cost') {
      return {
        type: 'bar',
        data: {
          labels: ['Raw Cost Per Lead (CPL)', 'Cost Per MQL (CPMQL)'],
          datasets: [{
            label: 'Cost ($)',
            data: [data.cpl, data.costPerMql],
            backgroundColor: ['#3b82f6', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Lead Acquisition Cost Comparison', color: '#e8edf0' }
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

    if (tab === 'benchmark') {
      return {
        type: 'bar',
        data: {
          labels: ['Actual CPL', 'Target CPL Benchmark'],
          datasets: [{
            label: 'CPL ($)',
            data: [data.cpl, data.targetCpl],
            backgroundColor: [data.cpl <= data.targetCpl ? '#10b981' : '#ef4444', '#64748b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Actual CPL vs Target Benchmark', color: '#e8edf0' }
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
    document.getElementById('input_totalAdSpend').value = 15000;
    document.getElementById('input_totalLeads').value = 300;
    document.getElementById('input_mqlConversionRate').value = 40;
    document.getElementById('input_targetCpl').value = 60;
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

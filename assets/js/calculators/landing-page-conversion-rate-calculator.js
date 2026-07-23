(function() {
  var chartInstance = null;
  var currentTab = 'funnel';
  var lastChartData = null;

  function getInputs() {
    var uniqueVisitors = parseFloat(document.getElementById('input_uniqueVisitors').value) || 0;
    var formSubmissions = parseFloat(document.getElementById('input_formSubmissions').value) || 0;
    var adSpendOnPage = parseFloat(document.getElementById('input_adSpendOnPage').value) || 0;
    var leadValue = parseFloat(document.getElementById('input_leadValue').value) || 0;

    return {
      uniqueVisitors: uniqueVisitors,
      formSubmissions: formSubmissions,
      adSpendOnPage: adSpendOnPage,
      leadValue: leadValue
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

  function calculateLandingPageConversion(inputs) {
    var visitors = inputs.uniqueVisitors;
    var submissions = inputs.formSubmissions;
    var spend = inputs.adSpendOnPage;
    var leadVal = inputs.leadValue;

    if (visitors <= 0) {
      return { error: 'Unique visitors must be greater than zero.' };
    }

    var conversionRate = (submissions / visitors) * 100;
    var costPerSubmission = submissions > 0 ? (spend / submissions) : 0;
    var pipelineValue = submissions * leadVal;
    var returnOnPageSpend = spend > 0 ? ((pipelineValue - spend) / spend) * 100 : 0;

    return {
      conversionRate: conversionRate,
      costPerSubmission: costPerSubmission,
      totalPipelineValue: pipelineValue,
      returnOnPageSpend: returnOnPageSpend,
      nonConvertedVisitors: visitors - submissions,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateLandingPageConversion(inputs);

    if (result.error) {
      setOutputText('output_conversionRate', '—');
      setOutputText('output_costPerSubmission', '—');
      setOutputText('output_totalPipelineValue', '—');
      setOutputText('output_returnOnPageSpend', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_conversionRate', result.conversionRate.toFixed(2) + '%');
    setOutputText('output_costPerSubmission', formatCurrency(result.costPerSubmission));
    setOutputText('output_totalPipelineValue', formatCurrency(result.totalPipelineValue));
    setOutputText('output_returnOnPageSpend', result.returnOnPageSpend.toFixed(0) + '%');

    var chartPayload = {
      visitors: inputs.uniqueVisitors,
      submissions: inputs.formSubmissions,
      costPerSubmission: result.costPerSubmission,
      leadValue: inputs.leadValue
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        uniqueVisitors: inputs.uniqueVisitors,
        formSubmissions: inputs.formSubmissions,
        conversionRate: result.conversionRate.toFixed(2) + '%',
        costPerSubmission: formatCurrency(result.costPerSubmission)
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

    if (tab === 'funnel') {
      return {
        type: 'bar',
        data: {
          labels: ['Unique Visitors', 'Form Submissions / Leads'],
          datasets: [{
            label: 'Count',
            data: [data.visitors, data.submissions],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Landing Page Visitor Conversion Funnel', color: '#e8edf0' }
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

    if (tab === 'cost') {
      return {
        type: 'bar',
        data: {
          labels: ['Cost Per Lead', 'Estimated Lead Value'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.costPerSubmission, data.leadValue],
            backgroundColor: ['#ef4444', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cost Per Lead vs Monetary Lead Value ($)', color: '#e8edf0' }
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
    document.getElementById('input_uniqueVisitors').value = 10000;
    document.getElementById('input_formSubmissions').value = 450;
    document.getElementById('input_adSpendOnPage').value = 6000;
    document.getElementById('input_leadValue').value = 80;
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

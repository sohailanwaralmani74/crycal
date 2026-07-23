(function() {
  var chartInstance = null;
  var currentTab = 'distribution';
  var lastChartData = null;

  function getInputs() {
    var rdSpend = parseFloat(document.getElementById('input_rdSpend').value) || 0;
    var smSpend = parseFloat(document.getElementById('input_smSpend').value) || 0;
    var gaSpend = parseFloat(document.getElementById('input_gaSpend').value) || 0;
    var hostingSpend = parseFloat(document.getElementById('input_hostingSpend').value) || 0;
    var annualGrowthRate = parseFloat(document.getElementById('input_annualGrowthRate').value) || 15;

    return {
      rdSpend: rdSpend,
      smSpend: smSpend,
      gaSpend: gaSpend,
      hostingSpend: hostingSpend,
      annualGrowthRate: annualGrowthRate / 100
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

  function calculateOpexForecast(inputs) {
    var rd = inputs.rdSpend;
    var sm = inputs.smSpend;
    var ga = inputs.gaSpend;
    var hosting = inputs.hostingSpend;
    var growth = inputs.annualGrowthRate;

    var monthlyOpex = rd + sm + ga + hosting;
    if (monthlyOpex <= 0) {
      return { error: 'Total monthly OpEx must be greater than zero.' };
    }

    var annualOpex = monthlyOpex * 12;
    var nextYearOpex = annualOpex * (1 + growth);

    var rdShare = ((rd / monthlyOpex) * 100).toFixed(0);
    var smShare = ((sm / monthlyOpex) * 100).toFixed(0);
    var gaShare = ((ga / monthlyOpex) * 100).toFixed(0);
    var hostingShare = ((hosting / monthlyOpex) * 100).toFixed(0);

    var sharesText = 'R&D: ' + rdShare + '% | S&M: ' + smShare + '% | G&A: ' + gaShare + '% | Hosting: ' + hostingShare + '%';

    return {
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,
      projectedNextYearOpex: nextYearOpex,
      departmentShares: sharesText,
      rd: rd,
      sm: sm,
      ga: ga,
      hosting: hosting,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateOpexForecast(inputs);

    if (result.error) {
      setOutputText('output_totalMonthlyOpex', '—');
      setOutputText('output_totalAnnualOpex', '—');
      setOutputText('output_projectedNextYearOpex', '—');
      setOutputText('output_departmentShares', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalMonthlyOpex', formatCurrency(result.totalMonthlyOpex));
    setOutputText('output_totalAnnualOpex', formatCurrency(result.totalAnnualOpex));
    setOutputText('output_projectedNextYearOpex', formatCurrency(result.projectedNextYearOpex));
    setOutputText('output_departmentShares', result.departmentShares);

    var chartPayload = {
      rd: result.rd,
      sm: result.sm,
      ga: result.ga,
      hosting: result.hosting,
      annualOpex: result.totalAnnualOpex,
      nextYearOpex: result.projectedNextYearOpex
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        rdSpend: inputs.rdSpend,
        smSpend: inputs.smSpend,
        totalMonthlyOpex: formatCurrency(result.totalMonthlyOpex),
        totalAnnualOpex: formatCurrency(result.totalAnnualOpex)
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

    if (tab === 'distribution') {
      return {
        type: 'doughnut',
        data: {
          labels: ['R&D Engineering', 'Sales & Marketing', 'General & Admin', 'Cloud Hosting'],
          datasets: [{
            data: [data.rd, data.sm, data.ga, data.hosting],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Monthly Departmental OpEx Split ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'projection') {
      return {
        type: 'bar',
        data: {
          labels: ['Current Annual OpEx', 'Projected Next Year OpEx'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.annualOpex, data.nextYearOpex],
            backgroundColor: ['#64748b', '#3b82f6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual OpEx Budget Projection ($)', color: '#e8edf0' }
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
    document.getElementById('input_rdSpend').value = 45000;
    document.getElementById('input_smSpend').value = 35000;
    document.getElementById('input_gaSpend').value = 15000;
    document.getElementById('input_hostingSpend').value = 8000;
    document.getElementById('input_annualGrowthRate').value = 15;
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

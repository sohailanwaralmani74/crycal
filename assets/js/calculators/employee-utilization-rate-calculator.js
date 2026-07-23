(function() {
  var chartInstance = null;
  var currentTab = 'utilization';
  var lastChartData = null;

  function getInputs() {
    var totalWeeklyHours = parseFloat(document.getElementById('input_totalWeeklyHours').value) || 40;
    var billableHours = parseFloat(document.getElementById('input_billableHours').value) || 0;
    var adminHours = parseFloat(document.getElementById('input_adminHours').value) || 0;
    var hourlyBillingRate = parseFloat(document.getElementById('input_hourlyBillingRate').value) || 0;

    return {
      totalWeeklyHours: totalWeeklyHours,
      billableHours: billableHours,
      adminHours: adminHours,
      hourlyBillingRate: hourlyBillingRate
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

  function calculateUtilization(inputs) {
    var total = inputs.totalWeeklyHours;
    var billable = inputs.billableHours;
    var rate = inputs.hourlyBillingRate;

    if (total <= 0) {
      return { error: 'Total weekly hours must be greater than zero.' };
    }

    var utilizationRate = (billable / total) * 100;
    var nonProductiveRate = 100 - utilizationRate;
    var weeklyRevenue = billable * rate;
    var annualRevenue = weeklyRevenue * 48; // Assuming 48 working weeks

    return {
      utilizationRate: utilizationRate,
      nonProductiveRate: nonProductiveRate,
      weeklyBilledRevenue: weeklyRevenue,
      annualBilledRevenue: annualRevenue,
      billableHours: billable,
      adminHours: inputs.adminHours,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateUtilization(inputs);

    if (result.error) {
      setOutputText('output_utilizationRate', '—');
      setOutputText('output_nonProductiveRate', '—');
      setOutputText('output_weeklyBilledRevenue', '—');
      setOutputText('output_annualBilledRevenue', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_utilizationRate', result.utilizationRate.toFixed(1) + '%');
    setOutputText('output_nonProductiveRate', result.nonProductiveRate.toFixed(1) + '%');
    setOutputText('output_weeklyBilledRevenue', formatCurrency(result.weeklyBilledRevenue));
    setOutputText('output_annualBilledRevenue', formatCurrency(result.annualBilledRevenue));

    var chartPayload = {
      billableHours: result.billableHours,
      adminHours: result.adminHours,
      weeklyRevenue: result.weeklyBilledRevenue,
      annualRevenue: result.annualBilledRevenue
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalWeeklyHours: inputs.totalWeeklyHours,
        billableHours: inputs.billableHours,
        utilizationRate: result.utilizationRate.toFixed(1) + '%',
        annualBilledRevenue: formatCurrency(result.annualBilledRevenue)
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

    if (tab === 'utilization') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Billable / Core Task Hours', 'Non-Billable Admin & Meetings'],
          datasets: [{
            data: [data.billableHours, data.adminHours],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Weekly Work Hours Split', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'revenue') {
      return {
        type: 'bar',
        data: {
          labels: ['Weekly Billed Revenue ($)', 'Annual Billed Revenue ($)'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.weeklyRevenue, data.annualRevenue],
            backgroundColor: ['#3b82f6', '#6366f1'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Projected Client Billed Revenue ($)', color: '#e8edf0' }
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
    document.getElementById('input_totalWeeklyHours').value = 40;
    document.getElementById('input_billableHours').value = 28;
    document.getElementById('input_adminHours').value = 12;
    document.getElementById('input_hourlyBillingRate').value = 150;
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

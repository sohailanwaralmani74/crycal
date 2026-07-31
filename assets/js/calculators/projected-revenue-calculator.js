(function() {

  var chartInstance = null;
  var lastChartData = null;

  function getInputs() {
    var currentRevenue = parseFloat(document.getElementById('input_currentRevenue').value) || 0;
    var growthRate = parseFloat(document.getElementById('input_growthRate').value) || 0;
    var periods = parseFloat(document.getElementById('input_periods').value) || 0;

    return {
      currentRevenue: currentRevenue,
      growthRate: growthRate / 100,
      periods: periods
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

  var ALL_OUTPUTS = ['finalRevenue', 'totalRevenue', 'averageMonthlyRevenue'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateProjection(inputs) {
    if (inputs.currentRevenue <= 0) {
      return { error: 'Enter a valid current revenue amount' };
    }
    if (inputs.periods <= 0) {
      return { error: 'Enter a valid number of months' };
    }

    var monthlyData = [];
    var revenue = inputs.currentRevenue;
    var total = 0;

    for (var month = 1; month <= inputs.periods; month++) {
      revenue = revenue * (1 + inputs.growthRate);
      monthlyData.push({ month: month, revenue: revenue });
      total += revenue;
    }

    var finalRevenue = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].revenue : 0;
    var averageMonthly = inputs.periods > 0 ? total / inputs.periods : 0;

    return {
      finalRevenue: finalRevenue,
      totalRevenue: total,
      averageMonthlyRevenue: averageMonthly,
      monthlyData: monthlyData,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentRevenue <= 0 || inputs.periods <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateProjection(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_finalRevenue', formatCurrency(result.finalRevenue));
    setOutputText('output_totalRevenue', formatCurrency(result.totalRevenue));
    setOutputText('output_averageMonthlyRevenue', formatCurrency(result.averageMonthlyRevenue));

    var chartPayload = {
      monthlyData: result.monthlyData
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    // Log history
    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentRevenue: inputs.currentRevenue,
        growthRate: inputs.growthRate * 100,
        periods: inputs.periods,
        finalRevenue: result.finalRevenue,
        totalRevenue: result.totalRevenue,
        averageMonthlyRevenue: result.averageMonthlyRevenue
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
    var chartData = generateChartData(data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function currencyTick(v) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
    } catch (e) { return '$' + v.toFixed(0); }
  }

  function generateChartData(data) {
    if (!data || !data.monthlyData || data.monthlyData.length === 0) return null;

    var labels = data.monthlyData.map(function(d) { return 'Month ' + d.month; });
    var revenues = data.monthlyData.map(function(d) { return d.revenue; });

    return {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Revenue',
            data: revenues,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
          title: { display: true, text: 'Projected Monthly Revenue', font: { size: 14, color: '#e8edf0' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 15 } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: currencyTick } }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    };
  }

  function resetTool() {
    var _el_currentRevenue = document.getElementById('input_currentRevenue');
    _el_currentRevenue.value = (_el_currentRevenue.dataset && _el_currentRevenue.dataset.default !== undefined) ? _el_currentRevenue.dataset.default : (_el_currentRevenue.getAttribute('value') || '');
    var _el_growthRate = document.getElementById('input_growthRate');
    _el_growthRate.value = (_el_growthRate.dataset && _el_growthRate.dataset.default !== undefined) ? _el_growthRate.dataset.default : (_el_growthRate.getAttribute('value') || '');
    var _el_periods = document.getElementById('input_periods');
    _el_periods.value = (_el_periods.dataset && _el_periods.dataset.default !== undefined) ? _el_periods.dataset.default : (_el_periods.getAttribute('value') || '');
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
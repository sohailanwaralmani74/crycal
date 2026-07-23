(function() {
  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  function getInputs() {
    var totalRevenue = parseFloat(document.getElementById('input_totalRevenue').value) || 0;
    var firstTouchSharePercent = parseFloat(document.getElementById('input_firstTouchSharePercent').value) || 50;
    var lastTouchSharePercent = parseFloat(document.getElementById('input_lastTouchSharePercent').value) || 50;
    var touchpointCount = parseFloat(document.getElementById('input_touchpointCount').value) || 4;

    return {
      totalRevenue: totalRevenue,
      firstTouchSharePercent: firstTouchSharePercent / 100,
      lastTouchSharePercent: lastTouchSharePercent / 100,
      touchpointCount: touchpointCount
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

  function calculateAttribution(inputs) {
    var revenue = inputs.totalRevenue;
    var touchpoints = inputs.touchpointCount;

    if (revenue <= 0 || touchpoints <= 0) {
      return { error: 'Revenue and touchpoints must be greater than zero.' };
    }

    var firstTouchCredit = revenue * inputs.firstTouchSharePercent;
    var lastTouchCredit = revenue * inputs.lastTouchSharePercent;
    var linearCreditPerTouch = revenue / touchpoints;
    var variance = Math.abs(firstTouchCredit - lastTouchCredit);

    return {
      firstTouchAttribution: firstTouchCredit,
      lastTouchAttribution: lastTouchCredit,
      linearAttribution: linearCreditPerTouch,
      channelVariance: variance,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateAttribution(inputs);

    if (result.error) {
      setOutputText('output_firstTouchAttribution', '—');
      setOutputText('output_lastTouchAttribution', '—');
      setOutputText('output_linearAttribution', '—');
      setOutputText('output_channelVariance', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_firstTouchAttribution', formatCurrency(result.firstTouchAttribution));
    setOutputText('output_lastTouchAttribution', formatCurrency(result.lastTouchAttribution));
    setOutputText('output_linearAttribution', formatCurrency(result.linearAttribution) + ' / touch');
    setOutputText('output_channelVariance', formatCurrency(result.channelVariance));

    var chartPayload = {
      revenue: inputs.totalRevenue,
      firstTouch: result.firstTouchAttribution,
      lastTouch: result.lastTouchAttribution,
      linearTouch: result.linearAttribution,
      touchpoints: inputs.touchpointCount
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalRevenue: inputs.totalRevenue,
        firstTouchAttribution: formatCurrency(result.firstTouchAttribution),
        lastTouchAttribution: formatCurrency(result.lastTouchAttribution),
        linearAttribution: formatCurrency(result.linearAttribution)
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['First-Touch Model', 'Last-Touch Model', 'Linear (All Touches)'],
          datasets: [{
            label: 'Attributed Credit ($)',
            data: [data.firstTouch, data.lastTouch, data.revenue],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Revenue Credit Attributed by Model ($)', color: '#e8edf0' }
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

    if (tab === 'touchpoints') {
      var touchLabels = [];
      var touchData = [];
      for (var i = 1; i <= data.touchpoints; i++) {
        touchLabels.push('Touch ' + i);
        touchData.push(data.linearTouch);
      }

      return {
        type: 'bar',
        data: {
          labels: touchLabels,
          datasets: [{
            label: 'Credit ($)',
            data: touchData,
            backgroundColor: '#06b6d4',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Linear Model Equal Credit Distribution per Touchpoint', color: '#e8edf0' }
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
    document.getElementById('input_totalRevenue').value = 100000;
    document.getElementById('input_firstTouchSharePercent').value = 50;
    document.getElementById('input_lastTouchSharePercent').value = 50;
    document.getElementById('input_touchpointCount').value = 4;
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

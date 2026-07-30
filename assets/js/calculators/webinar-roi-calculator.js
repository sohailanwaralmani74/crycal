(function() {
  var chartInstance = null;
  var currentTab = 'funnel';
  var lastChartData = null;

  function getInputs() {
    var webinarCost = parseFloat(document.getElementById('input_webinarCost').value) || 0;
    var registrants = parseFloat(document.getElementById('input_registrants').value) || 0;
    var attendanceRate = parseFloat(document.getElementById('input_attendanceRate').value) || 40;
    var attendeeToDemoRate = parseFloat(document.getElementById('input_attendeeToDemoRate').value) || 15;
    var demoToClosedRate = parseFloat(document.getElementById('input_demoToClosedRate').value) || 20;
    var averageAcv = parseFloat(document.getElementById('input_averageAcv').value) || 6000;

    return {
      webinarCost: webinarCost,
      registrants: registrants,
      attendanceRate: attendanceRate / 100,
      attendeeToDemoRate: attendeeToDemoRate / 100,
      demoToClosedRate: demoToClosedRate / 100,
      averageAcv: averageAcv
    }
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

  function calculateWebinarRoi(inputs) {
    var cost = inputs.webinarCost;
    var reg = inputs.registrants;

    if (reg <= 0 || cost <= 0) {
      return { error: 'Registrants and cost must be greater than zero.' };
    }

    var liveAttendees = Math.round(reg * inputs.attendanceRate);
    var demoRequests = Math.round(liveAttendees * inputs.attendeeToDemoRate);
    var closedDeals = Math.round(demoRequests * inputs.demoToClosedRate);
    var netArr = closedDeals * inputs.averageAcv;
    var netProfit = netArr - cost;
    var webinarRoi = (netProfit / cost) * 100;

    return {
      liveAttendees: liveAttendees,
      demoRequests: demoRequests,
      closedDeals: closedDeals,
      netPipelineArr: netArr,
      netWebinarProfit: netProfit,
      webinarRoi: webinarRoi,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateWebinarRoi(inputs);

    if (result.error) {
      setOutputText('output_liveAttendees', '—');
      setOutputText('output_demoRequests', '—');
      setOutputText('output_closedDeals', '—');
      setOutputText('output_netPipelineArr', '—');
      setOutputText('output_netWebinarProfit', '—');
      setOutputText('output_webinarRoi', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_liveAttendees', result.liveAttendees.toLocaleString() + ' attendees');
    setOutputText('output_demoRequests', result.demoRequests + ' demos');
    setOutputText('output_closedDeals', result.closedDeals + ' deals');
    setOutputText('output_netPipelineArr', formatCurrency(result.netPipelineArr));
    setOutputText('output_netWebinarProfit', formatCurrency(result.netWebinarProfit));
    setOutputText('output_webinarRoi', result.webinarRoi.toFixed(0) + '%');

    var chartPayload = {
      registrants: inputs.registrants,
      attendees: result.liveAttendees,
      demos: result.demoRequests,
      deals: result.closedDeals,
      cost: inputs.webinarCost,
      netArr: result.netPipelineArr,
      netProfit: result.netWebinarProfit
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        webinarCost: inputs.webinarCost,
        registrants: inputs.registrants,
        netPipelineArr: formatCurrency(result.netPipelineArr),
        webinarRoi: result.webinarRoi.toFixed(0) + '%'
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
          labels: ['Registrants', 'Live Attendees', 'Demo Requests', 'Closed Deals'],
          datasets: [{
            label: 'Volume',
            data: [data.registrants, data.attendees, data.demos, data.deals],
            backgroundColor: ['#64748b', '#06b6d4', '#3b82f6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Webinar Audience Conversion Funnel', color: '#e8edf0' }
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
      }
    }

    if (tab === 'roi') {
      return {
        type: 'bar',
        data: {
          labels: ['Event Cost', 'New ARR Generated', 'Net Profit'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.cost, data.netArr, data.netProfit],
            backgroundColor: ['#ef4444', '#3b82f6', data.netProfit >= 0 ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Webinar Event Financial Return ($)', color: '#e8edf0' }
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
      }
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    var _el_input_webinarCost = document.getElementById('input_webinarCost');
    _el_input_webinarCost.value = (_el_input_webinarCost.dataset && _el_input_webinarCost.dataset.default !== undefined) ? _el_input_webinarCost.dataset.default : (_el_input_webinarCost.getAttribute('value') || '');
    var _el_input_registrants = document.getElementById('input_registrants');
    _el_input_registrants.value = (_el_input_registrants.dataset && _el_input_registrants.dataset.default !== undefined) ? _el_input_registrants.dataset.default : (_el_input_registrants.getAttribute('value') || '');
    var _el_input_attendanceRate = document.getElementById('input_attendanceRate');
    _el_input_attendanceRate.value = (_el_input_attendanceRate.dataset && _el_input_attendanceRate.dataset.default !== undefined) ? _el_input_attendanceRate.dataset.default : (_el_input_attendanceRate.getAttribute('value') || '');
    var _el_input_attendeeToDemoRate = document.getElementById('input_attendeeToDemoRate');
    _el_input_attendeeToDemoRate.value = (_el_input_attendeeToDemoRate.dataset && _el_input_attendeeToDemoRate.dataset.default !== undefined) ? _el_input_attendeeToDemoRate.dataset.default : (_el_input_attendeeToDemoRate.getAttribute('value') || '');
    var _el_input_demoToClosedRate = document.getElementById('input_demoToClosedRate');
    _el_input_demoToClosedRate.value = (_el_input_demoToClosedRate.dataset && _el_input_demoToClosedRate.dataset.default !== undefined) ? _el_input_demoToClosedRate.dataset.default : (_el_input_demoToClosedRate.getAttribute('value') || '');
    var _el_input_averageAcv = document.getElementById('input_averageAcv');
    _el_input_averageAcv.value = (_el_input_averageAcv.dataset && _el_input_averageAcv.dataset.default !== undefined) ? _el_input_averageAcv.dataset.default : (_el_input_averageAcv.getAttribute('value') || '');
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

    
    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });
})();

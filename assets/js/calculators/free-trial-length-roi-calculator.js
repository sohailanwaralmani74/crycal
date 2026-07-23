(function() {
  var chartInstance = null;
  var currentTab = 'arrByTrialLength';
  var lastChartData = null;

  function getInputs() {
    return {
      monthlyTrialLeads: parseFloat(document.getElementById('input_monthlyTrialLeads').value) || 0,
      avgPlanACV: parseFloat(document.getElementById('input_avgPlanACV').value) || 0,
      trial7ConvRate: (parseFloat(document.getElementById('input_trial7ConvRate').value) || 0) / 100,
      trial14ConvRate: (parseFloat(document.getElementById('input_trial14ConvRate').value) || 0) / 100,
      trial30ConvRate: (parseFloat(document.getElementById('input_trial30ConvRate').value) || 0) / 100,
      trialSupportCostPerLead: parseFloat(document.getElementById('input_trialSupportCostPerLead').value) || 0
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

  function calculateTrialROI(inputs) {
    var annualLeads = inputs.monthlyTrialLeads * 12;
    var totalAnnualSupportCost = annualLeads * inputs.trialSupportCostPerLead;

    var grossARR7 = (annualLeads * inputs.trial7ConvRate) * inputs.avgPlanACV;
    var netARR7 = grossARR7 - totalAnnualSupportCost;

    var grossARR14 = (annualLeads * inputs.trial14ConvRate) * inputs.avgPlanACV;
    var netARR14 = grossARR14 - totalAnnualSupportCost;

    var grossARR30 = (annualLeads * inputs.trial30ConvRate) * inputs.avgPlanACV;
    var netARR30 = grossARR30 - totalAnnualSupportCost;

    var winner = '14-Day Trial';
    var maxNet = netARR14;
    if (netARR7 > maxNet) { winner = '7-Day Trial'; maxNet = netARR7; }
    if (netARR30 > maxNet) { winner = '30-Day Trial'; maxNet = netARR30; }

    return {
      grossARR7: grossARR7,
      netARR7: netARR7,
      grossARR14: grossARR14,
      netARR14: netARR14,
      grossARR30: grossARR30,
      netARR30: netARR30,
      totalAnnualSupportCost: totalAnnualSupportCost,
      winningTrialLength: winner
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateTrialROI(inputs);

    setOutputText('output_newARR7Day', formatCurrency(res.grossARR7));
    setOutputText('output_newARR14Day', formatCurrency(res.grossARR14));
    setOutputText('output_newARR30Day', formatCurrency(res.grossARR30));
    setOutputText('output_netROI14Day', formatCurrency(res.netARR14));
    setOutputText('output_winningTrialLength', res.winningTrialLength);

    lastChartData = res;
    updateCharts(res);
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'arrByTrialLength') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['7-Day Trial', '14-Day Trial', '30-Day Trial'],
          datasets: [{
            label: 'New Gross ARR ($)',
            data: [data.grossARR7, data.grossARR14, data.grossARR30],
            backgroundColor: ['#fbbf24', '#4ade80', '#4A90D9'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Gross ARR by Trial Duration ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'netProfitTrial') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['7-Day Net', '14-Day Net', '30-Day Net'],
          datasets: [{
            label: 'Net ARR (Minus Support Costs)',
            data: [data.netARR7, data.netARR14, data.netARR30],
            backgroundColor: ['#fbbf24', '#4ade80', '#4A90D9'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Net ARR after Onboarding Support Costs ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_monthlyTrialLeads').value = 2000;
    document.getElementById('input_avgPlanACV').value = 600;
    document.getElementById('input_trial7ConvRate').value = 4.5;
    document.getElementById('input_trial14ConvRate').value = 6.0;
    document.getElementById('input_trial30ConvRate').value = 5.0;
    document.getElementById('input_trialSupportCostPerLead').value = 12;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });
})();

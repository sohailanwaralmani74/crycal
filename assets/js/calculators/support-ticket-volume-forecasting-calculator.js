(function() {
  var chartInstance = null;
  var currentTab = 'volume';
  var lastChartData = null;

  function getInputs() {
    var currentCustomers = parseFloat(document.getElementById('input_currentCustomers').value) || 1;
    var currentMonthlyTickets = parseFloat(document.getElementById('input_currentMonthlyTickets').value) || 0;
    var projectedCustomers = parseFloat(document.getElementById('input_projectedCustomers').value) || 1;
    var deflectionRate = parseFloat(document.getElementById('input_deflectionRate').value) || 15;
    var ticketsPerAgentMonthly = parseFloat(document.getElementById('input_ticketsPerAgentMonthly').value) || 300;

    return {
      currentCustomers: currentCustomers,
      currentMonthlyTickets: currentMonthlyTickets,
      projectedCustomers: projectedCustomers,
      deflectionRate: deflectionRate / 100,
      ticketsPerAgentMonthly: ticketsPerAgentMonthly
    };
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateTicketForecast(inputs) {
    var currCust = inputs.currentCustomers;
    var currTickets = inputs.currentMonthlyTickets;
    var projCust = inputs.projectedCustomers;
    var deflection = inputs.deflectionRate;
    var agentCapacity = inputs.ticketsPerAgentMonthly;

    if (currCust <= 0 || projCust <= 0 || agentCapacity <= 0) {
      return { error: 'Customer counts and agent capacity must be greater than zero.' };
    }

    var ticketsPerCustomer = currTickets / currCust;
    var projectedGrossTickets = Math.round(projCust * ticketsPerCustomer);
    var projectedNetTickets = Math.round(projectedGrossTickets * (1 - deflection));
    var currentFtes = Math.ceil(currTickets / agentCapacity);
    var futureFtes = Math.ceil(projectedNetTickets / agentCapacity);
    var additionalFteNeeded = Math.max(0, futureFtes - currentFtes);

    return {
      ticketsPerCustomer: ticketsPerCustomer,
      projectedGrossTickets: projectedGrossTickets,
      projectedNetTickets: projectedNetTickets,
      additionalFteNeeded: additionalFteNeeded,
      currTickets: currTickets,
      deflectedCount: projectedGrossTickets - projectedNetTickets,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateTicketForecast(inputs);

    if (result.error) {
      setOutputText('output_ticketsPerCustomer', '—');
      setOutputText('output_projectedGrossTickets', '—');
      setOutputText('output_projectedNetTickets', '—');
      setOutputText('output_additionalFteNeeded', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_ticketsPerCustomer', result.ticketsPerCustomer.toFixed(2) + ' tickets/acct');
    setOutputText('output_projectedGrossTickets', result.projectedGrossTickets.toLocaleString() + ' tickets/mo');
    setOutputText('output_projectedNetTickets', result.projectedNetTickets.toLocaleString() + ' tickets/mo');
    setOutputText('output_additionalFteNeeded', result.additionalFteNeeded + ' support agents');

    var chartPayload = {
      currTickets: result.currTickets,
      grossTickets: result.projectedGrossTickets,
      netTickets: result.projectedNetTickets,
      deflectedCount: result.deflectedCount
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentCustomers: inputs.currentCustomers,
        projectedCustomers: inputs.projectedCustomers,
        projectedNetTickets: result.projectedNetTickets.toLocaleString(),
        additionalFteNeeded: result.additionalFteNeeded
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

    if (tab === 'volume') {
      return {
        type: 'bar',
        data: {
          labels: ['Current Monthly Tickets', 'Projected Gross Tickets', 'Projected Net Tickets'],
          datasets: [{
            label: 'Ticket Volume',
            data: [data.currTickets, data.grossTickets, data.netTickets],
            backgroundColor: ['#64748b', '#ef4444', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Current vs Projected Monthly Ticket Volume', color: '#e8edf0' }
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

    if (tab === 'deflection') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Net Agent Handled Tickets', 'AI & Self-Service Deflected Tickets'],
          datasets: [{
            data: [data.netTickets, data.deflectedCount],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Projected Ticket Deflection Split', color: '#e8edf0' }
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
    document.getElementById('input_currentCustomers').value = 1200;
    document.getElementById('input_currentMonthlyTickets').value = 1800;
    document.getElementById('input_projectedCustomers').value = 3500;
    document.getElementById('input_deflectionRate').value = 15;
    document.getElementById('input_ticketsPerAgentMonthly').value = 300;
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

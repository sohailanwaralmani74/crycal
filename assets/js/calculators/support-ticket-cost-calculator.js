(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  function getInputs() {
    var monthlySupportPayroll = parseFloat(document.getElementById('input_monthlySupportPayroll').value) || 0;
    var monthlySupportSoftware = parseFloat(document.getElementById('input_monthlySupportSoftware').value) || 0;
    var monthlyTicketVolume = parseFloat(document.getElementById('input_monthlyTicketVolume').value) || 1;
    var avgResolutionTimeMinutes = parseFloat(document.getElementById('input_avgResolutionTimeMinutes').value) || 18;

    return {
      monthlySupportPayroll: monthlySupportPayroll,
      monthlySupportSoftware: monthlySupportSoftware,
      monthlyTicketVolume: monthlyTicketVolume,
      avgResolutionTimeMinutes: avgResolutionTimeMinutes
    }
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

  function calculateSupportCost(inputs) {
    var payroll = inputs.monthlySupportPayroll;
    var software = inputs.monthlySupportSoftware;
    var volume = inputs.monthlyTicketVolume;
    var minutes = inputs.avgResolutionTimeMinutes;

    if (volume <= 0) {
      return { error: 'Ticket volume must be greater than zero.' };
    }

    var totalMonthlyCost = payroll + software;
    var costPerTicket = totalMonthlyCost / volume;
    var annualSupportCost = totalMonthlyCost * 12;

    var totalResolutionHours = (volume * minutes) / 60;
    var costPerHour = totalResolutionHours > 0 ? (totalMonthlyCost / totalResolutionHours) : 0;

    var rating = '';
    if (costPerTicket <= 8) rating = 'Highly Efficient Tier 1 ($<8/ticket)';
    else if (costPerTicket <= 18) rating = 'Standard B2B SaaS Benchmark ($8-$18/ticket)';
    else rating = 'High Touch / Enterprise Tier ($>18/ticket)';

    return {
      costPerTicket: costPerTicket,
      annualSupportCost: annualSupportCost,
      costPerHour: costPerHour,
      ticketEfficiencyRating: rating,
      payroll: payroll,
      software: software,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateSupportCost(inputs);

    if (result.error) {
      setOutputText('output_costPerTicket', '—');
      setOutputText('output_annualSupportCost', '—');
      setOutputText('output_costPerHour', '—');
      setOutputText('output_ticketEfficiencyRating', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_costPerTicket', formatCurrency(result.costPerTicket));
    setOutputText('output_annualSupportCost', formatCurrency(result.annualSupportCost));
    setOutputText('output_costPerHour', formatCurrency(result.costPerHour) + ' / hr');
    setOutputText('output_ticketEfficiencyRating', result.ticketEfficiencyRating);

    var chartPayload = {
      payroll: result.payroll,
      software: result.software,
      costPerTicket: result.costPerTicket,
      volume: inputs.monthlyTicketVolume
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthlySupportPayroll: inputs.monthlySupportPayroll,
        monthlyTicketVolume: inputs.monthlyTicketVolume,
        costPerTicket: formatCurrency(result.costPerTicket),
        annualSupportCost: formatCurrency(result.annualSupportCost)
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

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Agent Payroll & Benefits', 'Helpdesk Software & Tools'],
          datasets: [{
            data: [data.payroll, data.software],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Monthly Support Budget Breakdown ($)', color: '#e8edf0' }
          }
        }
      }
    }

    if (tab === 'unit') {
      return {
        type: 'bar',
        data: {
          labels: ['Calculated Cost Per Ticket ($)', 'Benchmark Target ($12.00)'],
          datasets: [{
            label: 'Cost ($)',
            data: [data.costPerTicket, 12.00],
            backgroundColor: [data.costPerTicket <= 12.00 ? '#10b981' : '#f59e0b', '#64748b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cost Per Ticket vs Industry Benchmark Target ($)', color: '#e8edf0' }
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
    var _el_input_monthlySupportPayroll = document.getElementById('input_monthlySupportPayroll');
    _el_input_monthlySupportPayroll.value = (_el_input_monthlySupportPayroll.dataset && _el_input_monthlySupportPayroll.dataset.default !== undefined) ? _el_input_monthlySupportPayroll.dataset.default : (_el_input_monthlySupportPayroll.getAttribute('value') || '');
    var _el_input_monthlySupportSoftware = document.getElementById('input_monthlySupportSoftware');
    _el_input_monthlySupportSoftware.value = (_el_input_monthlySupportSoftware.dataset && _el_input_monthlySupportSoftware.dataset.default !== undefined) ? _el_input_monthlySupportSoftware.dataset.default : (_el_input_monthlySupportSoftware.getAttribute('value') || '');
    var _el_input_monthlyTicketVolume = document.getElementById('input_monthlyTicketVolume');
    _el_input_monthlyTicketVolume.value = (_el_input_monthlyTicketVolume.dataset && _el_input_monthlyTicketVolume.dataset.default !== undefined) ? _el_input_monthlyTicketVolume.dataset.default : (_el_input_monthlyTicketVolume.getAttribute('value') || '');
    var _el_input_avgResolutionTimeMinutes = document.getElementById('input_avgResolutionTimeMinutes');
    _el_input_avgResolutionTimeMinutes.value = (_el_input_avgResolutionTimeMinutes.dataset && _el_input_avgResolutionTimeMinutes.dataset.default !== undefined) ? _el_input_avgResolutionTimeMinutes.dataset.default : (_el_input_avgResolutionTimeMinutes.getAttribute('value') || '');
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

(function() {
  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  function getInputs() {
    var headcount = parseFloat(document.getElementById('input_headcount').value) || 1;
    var officeLeaseMonthly = parseFloat(document.getElementById('input_officeLeaseMonthly').value) || 0;
    var officePerksMonthly = parseFloat(document.getElementById('input_officePerksMonthly').value) || 0;
    var remoteStipendMonthly = parseFloat(document.getElementById('input_remoteStipendMonthly').value) || 0;
    var annualOffsiteBudget = parseFloat(document.getElementById('input_annualOffsiteBudget').value) || 0;

    return {
      headcount: headcount,
      officeLeaseMonthly: officeLeaseMonthly,
      officePerksMonthly: officePerksMonthly,
      remoteStipendMonthly: remoteStipendMonthly,
      annualOffsiteBudget: annualOffsiteBudget
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

  function calculateOfficeVsRemote(inputs) {
    var ftes = inputs.headcount;
    var lease = inputs.officeLeaseMonthly;
    var perks = inputs.officePerksMonthly;
    var stipend = inputs.remoteStipendMonthly;
    var offsite = inputs.annualOffsiteBudget;

    if (ftes <= 0) {
      return { error: 'Headcount must be greater than zero.' };
    }

    var monthlyOfficeTotal = lease + perks;
    var annualOfficeCost = monthlyOfficeTotal * 12;
    var costPerEmployeeOffice = annualOfficeCost / ftes;

    var annualRemoteStipends = ftes * stipend * 12;
    var annualRemoteCost = annualRemoteStipends + offsite;
    var costPerEmployeeRemote = annualRemoteCost / ftes;

    var netSavings = annualOfficeCost - annualRemoteCost;

    return {
      annualOfficeCost: annualOfficeCost,
      annualRemoteCost: annualRemoteCost,
      annualNetSavings: netSavings,
      costPerEmployeeOffice: costPerEmployeeOffice,
      costPerEmployeeRemote: costPerEmployeeRemote,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateOfficeVsRemote(inputs);

    if (result.error) {
      setOutputText('output_annualOfficeCost', '—');
      setOutputText('output_annualRemoteCost', '—');
      setOutputText('output_annualNetSavings', '—');
      setOutputText('output_costPerEmployeeOffice', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_annualOfficeCost', formatCurrency(result.annualOfficeCost));
    setOutputText('output_annualRemoteCost', formatCurrency(result.annualRemoteCost));
    setOutputText('output_annualNetSavings', formatCurrency(result.annualNetSavings) + (result.annualNetSavings >= 0 ? ' Saved' : ' Deficit'));
    setOutputText('output_costPerEmployeeOffice', formatCurrency(result.costPerEmployeeOffice) + ' / emp / yr');

    var chartPayload = {
      officeCost: result.annualOfficeCost,
      remoteCost: result.annualRemoteCost,
      perEmpOffice: result.costPerEmployeeOffice,
      perEmpRemote: result.costPerEmployeeRemote
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        headcount: inputs.headcount,
        annualOfficeCost: formatCurrency(result.annualOfficeCost),
        annualRemoteCost: formatCurrency(result.annualRemoteCost),
        annualNetSavings: formatCurrency(result.annualNetSavings)
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
          labels: ['Total Annual Office Cost', 'Total Annual Remote Cost'],
          datasets: [{
            label: 'Annual Cost ($)',
            data: [data.officeCost, data.remoteCost],
            backgroundColor: [data.officeCost > data.remoteCost ? '#ef4444' : '#10b981', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Annual Commercial Office vs Remote Work Cost ($)', color: '#e8edf0' }
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

    if (tab === 'perCapita') {
      return {
        type: 'bar',
        data: {
          labels: ['Office Cost / Employee', 'Remote Cost / Employee'],
          datasets: [{
            label: 'Cost Per Employee ($/yr)',
            data: [data.perEmpOffice, data.perEmpRemote],
            backgroundColor: ['#ef4444', '#3b82f6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Cost Per Employee ($/yr)', color: '#e8edf0' }
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
    document.getElementById('input_headcount').value = 50;
    document.getElementById('input_officeLeaseMonthly').value = 18000;
    document.getElementById('input_officePerksMonthly').value = 4000;
    document.getElementById('input_remoteStipendMonthly').value = 150;
    document.getElementById('input_annualOffsiteBudget').value = 50000;
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

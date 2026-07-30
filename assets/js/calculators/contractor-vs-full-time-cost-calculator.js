(function() {
  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  function getInputs() {
    var contractorHourlyRate = parseFloat(document.getElementById('input_contractorHourlyRate').value) || 0;
    var contractorWeeklyHours = parseFloat(document.getElementById('input_contractorWeeklyHours').value) || 40;
    var ftBaseSalary = parseFloat(document.getElementById('input_ftBaseSalary').value) || 0;
    var ftBenefitsTaxesPercent = parseFloat(document.getElementById('input_ftBenefitsTaxesPercent').value) || 25;
    var ftEquipmentOverhead = parseFloat(document.getElementById('input_ftEquipmentOverhead').value) || 0;

    return {
      contractorHourlyRate: contractorHourlyRate,
      contractorWeeklyHours: contractorWeeklyHours,
      ftBaseSalary: ftBaseSalary,
      ftBenefitsTaxesPercent: ftBenefitsTaxesPercent / 100,
      ftEquipmentOverhead: ftEquipmentOverhead
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

  function calculateContractorVsFt(inputs) {
    var rate = inputs.contractorHourlyRate;
    var hours = inputs.contractorWeeklyHours;
    var ftSalary = inputs.ftBaseSalary;
    var taxRate = inputs.ftBenefitsTaxesPercent;
    var overhead = inputs.ftEquipmentOverhead;

    if (rate <= 0 || ftSalary <= 0) {
      return { error: 'Contractor rate and FT salary must be greater than zero.' };
    }

    var annualContractorCost = rate * hours * 48; // 48 active billable weeks
    var ftBenefitsCost = ftSalary * taxRate;
    var annualFtCost = ftSalary + ftBenefitsCost + overhead;
    var diff = Math.abs(annualContractorCost - annualFtCost);

    var winner = annualContractorCost < annualFtCost ? '1099 Contractor (Save ' + formatCurrency(diff) + '/yr)' : 'Full-Time Employee (Save ' + formatCurrency(diff) + '/yr)';
    if (diff < 1000) winner = 'Equal Annual Cost (Within $1k)';

    return {
      annualContractorCost: annualContractorCost,
      annualFtCost: annualFtCost,
      costDifference: diff,
      cheaperOption: winner,
      ftSalary: ftSalary,
      ftBenefitsCost: ftBenefitsCost,
      overhead: overhead,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateContractorVsFt(inputs);

    if (result.error) {
      setOutputText('output_annualContractorCost', '—');
      setOutputText('output_annualFtCost', '—');
      setOutputText('output_costDifference', '—');
      setOutputText('output_cheaperOption', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_annualContractorCost', formatCurrency(result.annualContractorCost));
    setOutputText('output_annualFtCost', formatCurrency(result.annualFtCost));
    setOutputText('output_costDifference', formatCurrency(result.costDifference));
    setOutputText('output_cheaperOption', result.cheaperOption);

    var chartPayload = {
      contractorCost: result.annualContractorCost,
      ftCost: result.annualFtCost,
      ftSalary: result.ftSalary,
      ftBenefitsCost: result.ftBenefitsCost,
      overhead: result.overhead
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        contractorHourlyRate: '$' + inputs.contractorHourlyRate + '/hr',
        ftBaseSalary: formatCurrency(inputs.ftBaseSalary),
        annualContractorCost: formatCurrency(result.annualContractorCost),
        annualFtCost: formatCurrency(result.annualFtCost)
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
          labels: ['1099 Contractor Annual Cost', 'Full-Time Fully-Loaded Cost'],
          datasets: [{
            label: 'Annual Cost ($)',
            data: [data.contractorCost, data.ftCost],
            backgroundColor: [data.contractorCost <= data.ftCost ? '#10b981' : '#f59e0b', data.ftCost <= data.contractorCost ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Cost Comparison ($)', color: '#e8edf0' }
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

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Base Salary', 'Benefits & Payroll Taxes', 'Equipment & Software'],
          datasets: [{
            data: [data.ftSalary, data.ftBenefitsCost, data.overhead],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Full-Time Employee Cost Breakdown ($)', color: '#e8edf0' }
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
    var _el_input_contractorHourlyRate = document.getElementById('input_contractorHourlyRate');
    _el_input_contractorHourlyRate.value = (_el_input_contractorHourlyRate.dataset && _el_input_contractorHourlyRate.dataset.default !== undefined) ? _el_input_contractorHourlyRate.dataset.default : (_el_input_contractorHourlyRate.getAttribute('value') || '');
    var _el_input_contractorWeeklyHours = document.getElementById('input_contractorWeeklyHours');
    _el_input_contractorWeeklyHours.value = (_el_input_contractorWeeklyHours.dataset && _el_input_contractorWeeklyHours.dataset.default !== undefined) ? _el_input_contractorWeeklyHours.dataset.default : (_el_input_contractorWeeklyHours.getAttribute('value') || '');
    var _el_input_ftBaseSalary = document.getElementById('input_ftBaseSalary');
    _el_input_ftBaseSalary.value = (_el_input_ftBaseSalary.dataset && _el_input_ftBaseSalary.dataset.default !== undefined) ? _el_input_ftBaseSalary.dataset.default : (_el_input_ftBaseSalary.getAttribute('value') || '');
    var _el_input_ftBenefitsTaxesPercent = document.getElementById('input_ftBenefitsTaxesPercent');
    _el_input_ftBenefitsTaxesPercent.value = (_el_input_ftBenefitsTaxesPercent.dataset && _el_input_ftBenefitsTaxesPercent.dataset.default !== undefined) ? _el_input_ftBenefitsTaxesPercent.dataset.default : (_el_input_ftBenefitsTaxesPercent.getAttribute('value') || '');
    var _el_input_ftEquipmentOverhead = document.getElementById('input_ftEquipmentOverhead');
    _el_input_ftEquipmentOverhead.value = (_el_input_ftEquipmentOverhead.dataset && _el_input_ftEquipmentOverhead.dataset.default !== undefined) ? _el_input_ftEquipmentOverhead.dataset.default : (_el_input_ftEquipmentOverhead.getAttribute('value') || '');
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

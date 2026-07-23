(function() {
  var chartInstance = null;
  var currentTab = 'cost';
  var lastChartData = null;

  function getInputs() {
    var daysToFill = parseFloat(document.getElementById('input_daysToFill').value) || 1;
    var annualTargetRevenue = parseFloat(document.getElementById('input_annualTargetRevenue').value) || 0;
    var roleBaseSalary = parseFloat(document.getElementById('input_roleBaseSalary').value) || 0;
    var externalRecruiterFee = parseFloat(document.getElementById('input_externalRecruiterFee').value) || 20;
    var internalHiringHours = parseFloat(document.getElementById('input_internalHiringHours').value) || 0;

    return {
      daysToFill: daysToFill,
      annualTargetRevenue: annualTargetRevenue,
      roleBaseSalary: roleBaseSalary,
      externalRecruiterFee: externalRecruiterFee / 100,
      internalHiringHours: internalHiringHours
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

  function calculateTimeToHireCost(inputs) {
    var days = inputs.daysToFill;
    var rev = inputs.annualTargetRevenue;
    var salary = inputs.roleBaseSalary;
    var feeRate = inputs.externalRecruiterFee;
    var hours = inputs.internalHiringHours;

    if (days <= 0) {
      return { error: 'Days vacant must be greater than zero.' };
    }

    var dailyRev = rev / 365;
    var lostOpportunityCost = dailyRev * days;
    var recruitingAgencyCost = salary * feeRate;
    var internalLaborCost = hours * 75; // Blended $75/hr internal labor rate

    var totalVacancyCost = lostOpportunityCost + recruitingAgencyCost + internalLaborCost;
    var dailyCostOfVacancy = totalVacancyCost / days;

    return {
      lostOpportunityCost: lostOpportunityCost,
      recruitingAgencyCost: recruitingAgencyCost,
      internalLaborCost: internalLaborCost,
      totalVacancyCost: totalVacancyCost,
      dailyCostOfVacancy: dailyCostOfVacancy,
      days: days,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateTimeToHireCost(inputs);

    if (result.error) {
      setOutputText('output_lostOpportunityCost', '—');
      setOutputText('output_recruitingAgencyCost', '—');
      setOutputText('output_internalLaborCost', '—');
      setOutputText('output_totalVacancyCost', '—');
      setOutputText('output_dailyCostOfVacancy', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_lostOpportunityCost', formatCurrency(result.lostOpportunityCost));
    setOutputText('output_recruitingAgencyCost', formatCurrency(result.recruitingAgencyCost));
    setOutputText('output_internalLaborCost', formatCurrency(result.internalLaborCost));
    setOutputText('output_totalVacancyCost', formatCurrency(result.totalVacancyCost));
    setOutputText('output_dailyCostOfVacancy', formatCurrency(result.dailyCostOfVacancy) + ' / day');

    var chartPayload = {
      lostOpp: result.lostOpportunityCost,
      agency: result.recruitingAgencyCost,
      internal: result.internalLaborCost,
      dailyCost: result.dailyCostOfVacancy,
      days: result.days
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        daysToFill: inputs.daysToFill,
        roleBaseSalary: formatCurrency(inputs.roleBaseSalary),
        totalVacancyCost: formatCurrency(result.totalVacancyCost),
        dailyCostOfVacancy: formatCurrency(result.dailyCostOfVacancy) + '/day'
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

    if (tab === 'cost') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Lost Revenue Opportunity', 'Recruiter Agency Fee', 'Internal Interview Labor'],
          datasets: [{
            data: [data.lostOpp, data.agency, data.internal],
            backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Total Vacancy Cost Component Breakdown ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'timeline') {
      var dayIntervals = [15, 30, 45, 60, 90];
      var timelineData = dayIntervals.map(function(d) {
        return data.dailyCost * d;
      });

      return {
        type: 'line',
        data: {
          labels: ['15 Days', '30 Days', '45 Days', '60 Days', '90 Days'],
          datasets: [{
            label: 'Cumulative Vacancy Cost ($)',
            data: timelineData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cumulative Vacancy Cost Over Open Duration ($)', color: '#e8edf0' }
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
    document.getElementById('input_daysToFill').value = 45;
    document.getElementById('input_annualTargetRevenue').value = 250000;
    document.getElementById('input_roleBaseSalary').value = 120000;
    document.getElementById('input_externalRecruiterFee').value = 20;
    document.getElementById('input_internalHiringHours').value = 35;
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

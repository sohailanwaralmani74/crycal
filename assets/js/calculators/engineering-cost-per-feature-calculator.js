(function() {
  var chartInstance = null;
  var currentTab = 'cost';
  var lastChartData = null;

  function getInputs() {
    var engineersAssigned = parseFloat(document.getElementById('input_engineersAssigned').value) || 1;
    var sprintWeeks = parseFloat(document.getElementById('input_sprintWeeks').value) || 1;
    var avgAnnualDevSalary = parseFloat(document.getElementById('input_avgAnnualDevSalary').value) || 150000;
    var designerPmCost = parseFloat(document.getElementById('input_designerPmCost').value) || 0;
    var cloudTestingCost = parseFloat(document.getElementById('input_cloudTestingCost').value) || 0;

    return {
      engineersAssigned: engineersAssigned,
      sprintWeeks: sprintWeeks,
      avgAnnualDevSalary: avgAnnualDevSalary,
      designerPmCost: designerPmCost,
      cloudTestingCost: cloudTestingCost
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

  function calculateFeatureCost(inputs) {
    var devs = inputs.engineersAssigned;
    var weeks = inputs.sprintWeeks;
    var salary = inputs.avgAnnualDevSalary;
    var pmDesign = inputs.designerPmCost;
    var qaCloud = inputs.cloudTestingCost;

    if (devs <= 0 || weeks <= 0 || salary <= 0) {
      return { error: 'Engineers, weeks, and salary must be greater than zero.' };
    }

    var weeklyDevSalary = salary / 52;
    var devLaborCost = devs * weeklyDevSalary * weeks;
    var totalFeatureCost = devLaborCost + pmDesign + qaCloud;
    var costPerSprintWeek = totalFeatureCost / weeks;
    var requiredArrToBreakeven = totalFeatureCost;

    return {
      devSalaryCost: devLaborCost,
      totalFeatureCost: totalFeatureCost,
      costPerSprintWeek: costPerSprintWeek,
      requiredArrToBreakeven: requiredArrToBreakeven,
      pmDesign: pmDesign,
      qaCloud: qaCloud,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateFeatureCost(inputs);

    if (result.error) {
      setOutputText('output_devSalaryCost', '—');
      setOutputText('output_totalFeatureCost', '—');
      setOutputText('output_costPerSprintWeek', '—');
      setOutputText('output_requiredArrToBreakeven', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_devSalaryCost', formatCurrency(result.devSalaryCost));
    setOutputText('output_totalFeatureCost', formatCurrency(result.totalFeatureCost));
    setOutputText('output_costPerSprintWeek', formatCurrency(result.costPerSprintWeek) + ' / week');
    setOutputText('output_requiredArrToBreakeven', formatCurrency(result.requiredArrToBreakeven));

    var chartPayload = {
      devLabor: result.devSalaryCost,
      pmDesign: result.pmDesign,
      qaCloud: result.qaCloud,
      totalCost: result.totalFeatureCost
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        engineersAssigned: inputs.engineersAssigned,
        sprintWeeks: inputs.sprintWeeks,
        devSalaryCost: formatCurrency(result.devSalaryCost),
        totalFeatureCost: formatCurrency(result.totalFeatureCost)
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
          labels: ['Developer Salaries', 'PM & Design', 'QA & Infrastructure'],
          datasets: [{
            data: [data.devLabor, data.pmDesign, data.qaCloud],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Feature R&D Cost Component Split ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'payback') {
      return {
        type: 'bar',
        data: {
          labels: ['Total R&D Feature Cost', 'Required New ARR Payback'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.totalCost, data.totalCost],
            backgroundColor: ['#ef4444', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'R&D Cost vs 1-Year ARR Payback Target ($)', color: '#e8edf0' }
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
    document.getElementById('input_engineersAssigned').value = 4;
    document.getElementById('input_sprintWeeks').value = 6;
    document.getElementById('input_avgAnnualDevSalary').value = 150000;
    document.getElementById('input_designerPmCost').value = 12000;
    document.getElementById('input_cloudTestingCost').value = 3000;
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

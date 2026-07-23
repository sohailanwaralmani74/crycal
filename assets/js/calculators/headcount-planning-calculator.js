(function() {
  var chartInstance = null;
  var currentTab = 'headcount';
  var lastChartData = null;

  function getInputs() {
    var currentArr = parseFloat(document.getElementById('input_currentArr').value) || 0;
    var targetArr = parseFloat(document.getElementById('input_targetArr').value) || 0;
    var currentHeadcount = parseFloat(document.getElementById('input_currentHeadcount').value) || 1;
    var avgSalaryPerHire = parseFloat(document.getElementById('input_avgSalaryPerHire').value) || 140000;
    var arrPerEmployeeTarget = parseFloat(document.getElementById('input_arrPerEmployeeTarget').value) || 180000;

    return {
      currentArr: currentArr,
      targetArr: targetArr,
      currentHeadcount: currentHeadcount,
      avgSalaryPerHire: avgSalaryPerHire,
      arrPerEmployeeTarget: arrPerEmployeeTarget
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

  function calculateHeadcountPlanning(inputs) {
    var targetArr = inputs.targetArr;
    var targetRpe = inputs.arrPerEmployeeTarget;
    var currentHeadcount = inputs.currentHeadcount;
    var avgSalary = inputs.avgSalaryPerHire;

    if (targetArr <= 0 || targetRpe <= 0 || currentHeadcount <= 0) {
      return { error: 'Target ARR, RPE target, and Headcount must be greater than zero.' };
    }

    var totalFutureHeadcount = Math.ceil(targetArr / targetRpe);
    var newHiresNeeded = Math.max(0, totalFutureHeadcount - currentHeadcount);
    var additionalPayrollOpex = newHiresNeeded * avgSalary;
    var projectedArrGrowth = Math.max(0, targetArr - inputs.currentArr);

    return {
      newHiresNeeded: newHiresNeeded,
      totalFutureHeadcount: totalFutureHeadcount,
      additionalPayrollOpex: additionalPayrollOpex,
      projectedArrGrowth: projectedArrGrowth,
      currentHeadcount: currentHeadcount,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateHeadcountPlanning(inputs);

    if (result.error) {
      setOutputText('output_newHiresNeeded', '—');
      setOutputText('output_totalFutureHeadcount', '—');
      setOutputText('output_additionalPayrollOpex', '—');
      setOutputText('output_projectedArrGrowth', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_newHiresNeeded', result.newHiresNeeded + ' hires');
    setOutputText('output_totalFutureHeadcount', result.totalFutureHeadcount + ' employees');
    setOutputText('output_additionalPayrollOpex', formatCurrency(result.additionalPayrollOpex));
    setOutputText('output_projectedArrGrowth', formatCurrency(result.projectedArrGrowth));

    var chartPayload = {
      currentHeadcount: result.currentHeadcount,
      newHiresNeeded: result.newHiresNeeded,
      totalFutureHeadcount: result.totalFutureHeadcount,
      additionalPayrollOpex: result.additionalPayrollOpex
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentArr: formatCurrency(inputs.currentArr),
        targetArr: formatCurrency(inputs.targetArr),
        newHiresNeeded: result.newHiresNeeded,
        additionalPayrollOpex: formatCurrency(result.additionalPayrollOpex)
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

    if (tab === 'headcount') {
      return {
        type: 'bar',
        data: {
          labels: ['Current Headcount', 'New Hires Needed', 'Total Future Headcount'],
          datasets: [{
            label: 'Employees',
            data: [data.currentHeadcount, data.newHiresNeeded, data.totalFutureHeadcount],
            backgroundColor: ['#64748b', '#10b981', '#3b82f6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Headcount Expansion Plan', color: '#e8edf0' }
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

    if (tab === 'opex') {
      return {
        type: 'bar',
        data: {
          labels: ['New Payroll OpEx Added ($)'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.additionalPayrollOpex],
            backgroundColor: ['#ef4444'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Additional Annual Payroll Expense ($)', color: '#e8edf0' }
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
    document.getElementById('input_currentArr').value = 3000000;
    document.getElementById('input_targetArr').value = 6000000;
    document.getElementById('input_currentHeadcount').value = 18;
    document.getElementById('input_avgSalaryPerHire').value = 140000;
    document.getElementById('input_arrPerEmployeeTarget').value = 180000;
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

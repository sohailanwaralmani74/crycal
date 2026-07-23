(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  function getInputs() {
    var baseSalary = parseFloat(document.getElementById('input_baseSalary').value) || 0;
    var benefitsTaxPercent = parseFloat(document.getElementById('input_benefitsTaxPercent').value) || 25;
    var annualEquipmentOverhead = parseFloat(document.getElementById('input_annualEquipmentOverhead').value) || 0;
    var bonusCommission = parseFloat(document.getElementById('input_bonusCommission').value) || 0;

    return {
      baseSalary: baseSalary,
      benefitsTaxPercent: benefitsTaxPercent / 100,
      annualEquipmentOverhead: annualEquipmentOverhead,
      bonusCommission: bonusCommission
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

  function calculateEmployeeCost(inputs) {
    var salary = inputs.baseSalary;
    var taxRate = inputs.benefitsTaxPercent;
    var overhead = inputs.annualEquipmentOverhead;
    var bonus = inputs.bonusCommission;

    if (salary <= 0) {
      return { error: 'Base salary must be greater than zero.' };
    }

    var benefitsTaxCost = salary * taxRate;
    var totalFullyLoadedCost = salary + benefitsTaxCost + overhead + bonus;
    var costMultiple = totalFullyLoadedCost / salary;
    var monthlyLoadedCost = totalFullyLoadedCost / 12;

    return {
      benefitsTaxCost: benefitsTaxCost,
      totalFullyLoadedCost: totalFullyLoadedCost,
      costMultiple: costMultiple,
      monthlyLoadedCost: monthlyLoadedCost,
      baseSalary: salary,
      overhead: overhead,
      bonus: bonus,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateEmployeeCost(inputs);

    if (result.error) {
      setOutputText('output_benefitsTaxCost', '—');
      setOutputText('output_totalFullyLoadedCost', '—');
      setOutputText('output_costMultiple', '—');
      setOutputText('output_monthlyLoadedCost', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_benefitsTaxCost', formatCurrency(result.benefitsTaxCost));
    setOutputText('output_totalFullyLoadedCost', formatCurrency(result.totalFullyLoadedCost));
    setOutputText('output_costMultiple', result.costMultiple.toFixed(2) + 'x of Base Salary');
    setOutputText('output_monthlyLoadedCost', formatCurrency(result.monthlyLoadedCost));

    var chartPayload = {
      baseSalary: result.baseSalary,
      benefitsTaxCost: result.benefitsTaxCost,
      overhead: result.overhead,
      bonus: result.bonus,
      totalFullyLoadedCost: result.totalFullyLoadedCost
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        baseSalary: inputs.baseSalary,
        benefitsTaxPercent: (inputs.benefitsTaxPercent * 100).toFixed(0) + '%',
        totalFullyLoadedCost: formatCurrency(result.totalFullyLoadedCost),
        monthlyLoadedCost: formatCurrency(result.monthlyLoadedCost)
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
          labels: ['Base Salary', 'Taxes & Benefits', 'Equipment & Software', 'Bonus / Variable'],
          datasets: [{
            data: [data.baseSalary, data.benefitsTaxCost, data.overhead, data.bonus],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Fully-Loaded Expense Component Split ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Base Salary', 'Total Fully-Loaded Cost'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.baseSalary, data.totalFullyLoadedCost],
            backgroundColor: ['#64748b', '#3b82f6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Base Salary vs Fully-Loaded Annual Cost ($)', color: '#e8edf0' }
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
    document.getElementById('input_baseSalary').value = 120000;
    document.getElementById('input_benefitsTaxPercent').value = 25;
    document.getElementById('input_annualEquipmentOverhead').value = 10000;
    document.getElementById('input_bonusCommission').value = 15000;
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

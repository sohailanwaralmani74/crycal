(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  function getInputs() {
    var currentBalance = parseFloat(document.getElementById('input_currentBalance').value) || 0;
    var annualSalary = parseFloat(document.getElementById('input_annualSalary').value) || 0;
    var contributionPercent = parseFloat(document.getElementById('input_contributionPercent').value) || 0;
    var employerMatchPercent = parseFloat(document.getElementById('input_employerMatchPercent').value) || 0;
    var annualReturn = parseFloat(document.getElementById('input_annualReturn').value) || 0;
    var yearsToRetirement = parseFloat(document.getElementById('input_yearsToRetirement').value) || 0;
    var annualSalaryGrowth = parseFloat(document.getElementById('input_annualSalaryGrowth').value) || 0;

    return {
      currentBalance: currentBalance,
      annualSalary: annualSalary,
      contributionPercent: contributionPercent / 100,
      employerMatchPercent: employerMatchPercent / 100,
      annualReturn: annualReturn / 100,
      yearsToRetirement: yearsToRetirement,
      annualSalaryGrowth: annualSalaryGrowth / 100
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

  var ALL_OUTPUTS = ['projectedBalance', 'totalYourContributions', 'totalEmployerContributions', 'totalGrowth'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculate403b(inputs) {
    if (inputs.annualSalary <= 0) {
      return { error: 'Enter your annual salary' };
    }
    if (inputs.yearsToRetirement <= 0) {
      return { error: 'Enter valid years until retirement' };
    }

    var monthlyRate = inputs.annualReturn / 12;
    var balance = inputs.currentBalance;
    var salary = inputs.annualSalary;
    var totalYourContributions = 0;
    var totalEmployerContributions = 0;
    var dataPoints = [{ month: 0, balance: balance }];
    var month = 0;

    for (var year = 0; year < inputs.yearsToRetirement; year++) {
      var yourMonthlyContribution = (salary * inputs.contributionPercent) / 12;
      var employerMonthlyContribution = (salary * inputs.employerMatchPercent) / 12;

      for (var m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate);
        balance += yourMonthlyContribution + employerMonthlyContribution;
        totalYourContributions += yourMonthlyContribution;
        totalEmployerContributions += employerMonthlyContribution;
        month++;
        dataPoints.push({ month: month, balance: balance });
      }

      salary = salary * (1 + inputs.annualSalaryGrowth);
    }

    var totalContributions = totalYourContributions + totalEmployerContributions;
    var totalGrowth = balance - inputs.currentBalance - totalContributions;

    return {
      projectedBalance: balance,
      totalYourContributions: totalYourContributions,
      totalEmployerContributions: totalEmployerContributions,
      totalGrowth: totalGrowth,
      dataPoints: dataPoints,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.annualSalary <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculate403b(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_projectedBalance', formatCurrency(result.projectedBalance));
    setOutputText('output_totalYourContributions', formatCurrency(result.totalYourContributions));
    setOutputText('output_totalEmployerContributions', formatCurrency(result.totalEmployerContributions));
    setOutputText('output_totalGrowth', formatCurrency(result.totalGrowth));

    var chartPayload = {
      dataPoints: result.dataPoints,
      totalYourContributions: result.totalYourContributions,
      totalEmployerContributions: result.totalEmployerContributions,
      totalGrowth: result.totalGrowth
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualSalary: inputs.annualSalary,
        contributionPercent: inputs.contributionPercent * 100,
        yearsToRetirement: inputs.yearsToRetirement,
        projectedBalance: result.projectedBalance
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
    if (!data || !data.dataPoints || data.dataPoints.length === 0) return null;

    if (tab === 'growth') {
      var labels = data.dataPoints.map(function(d) { return 'Month ' + d.month; });
      var balances = data.dataPoints.map(function(d) { return d.balance; });

      var fLabels = labels.filter(function(d, i) { return i % 6 === 0 || i === 0 || i === labels.length - 1; });
      var fBalances = balances.filter(function(d, i) { return i % 6 === 0 || i === 0 || i === balances.length - 1; });

      return {
        type: 'line',
        data: {
          labels: fLabels,
          datasets: [
            { label: '403(b) Balance', data: fBalances, borderColor: '#4A90D9', backgroundColor: 'rgba(74, 144, 217, 0.1)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: '403(b) Balance Growth', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 20 } },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa', font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
                  } catch (e) { return '$' + v.toFixed(0); }
                }
              }
            }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      };
    }

    if (tab === 'breakdown') {
      var yours = data.totalYourContributions || 0;
      var employer = data.totalEmployerContributions || 0;
      var growth = data.totalGrowth || 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Your Contributions', 'Employer Match', 'Investment Growth'],
          datasets: [{ data: [yours, employer, growth], backgroundColor: ['#4A90D9', '#fbbf24', '#4ade80'], borderColor: ['#3a7b8c', '#c99a1e', '#3a9b6c'], borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Contribution Sources', font: { size: 14, color: '#e8edf0' } }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {
    document.getElementById('input_currentBalance').value = 40000;
    document.getElementById('input_annualSalary').value = 75000;
    document.getElementById('input_contributionPercent').value = 8;
    document.getElementById('input_employerMatchPercent').value = 3;
    document.getElementById('input_annualReturn').value = 7;
    document.getElementById('input_yearsToRetirement').value = 25;
    document.getElementById('input_annualSalaryGrowth').value = 2.5;
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

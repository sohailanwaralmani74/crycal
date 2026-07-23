(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  function getInputs() {
    var currentBalance = parseFloat(document.getElementById('input_currentBalance').value) || 0;
    var annualContribution = parseFloat(document.getElementById('input_annualContribution').value) || 0;
    var employerContribution = parseFloat(document.getElementById('input_employerContribution').value) || 0;
    var annualReturn = parseFloat(document.getElementById('input_annualReturn').value) || 0;
    var yearsToGrow = parseFloat(document.getElementById('input_yearsToGrow').value) || 0;
    var marginalTaxRate = parseFloat(document.getElementById('input_marginalTaxRate').value) || 0;

    return {
      currentBalance: currentBalance,
      annualContribution: annualContribution,
      employerContribution: employerContribution,
      annualReturn: annualReturn / 100,
      yearsToGrow: yearsToGrow,
      marginalTaxRate: marginalTaxRate / 100
    };
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

  var ALL_OUTPUTS = ['projectedBalance', 'totalContributions', 'totalGrowth', 'totalTaxSavings'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateHsa(inputs) {
    var P = inputs.currentBalance;
    var PMT = (inputs.annualContribution + inputs.employerContribution) / 12;
    var r = inputs.annualReturn;
    var t = inputs.yearsToGrow;
    var taxRate = inputs.marginalTaxRate;

    if (P <= 0 && PMT <= 0) {
      return { error: 'Enter a current balance or contribution' };
    }
    if (t <= 0 || r < 0) {
      return { error: 'Enter valid years and return rate' };
    }

    var totalMonths = Math.round(t * 12);
    var monthlyRate = r / 12;

    var fvPresent = P * Math.pow(1 + monthlyRate, totalMonths);
    var fvContributions = 0;
    if (PMT > 0 && r > 0) {
      fvContributions = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else if (PMT > 0) {
      fvContributions = PMT * totalMonths;
    }

    var projectedBalance = fvPresent + fvContributions;
    var totalContributions = P + (PMT * totalMonths);
    var totalGrowth = projectedBalance - totalContributions;

    var totalYourContributions = inputs.annualContribution * t;
    var totalTaxSavings = totalYourContributions * taxRate;

    var dataPoints = [];
    var currentBal = P;
    for (var i = 0; i <= totalMonths; i++) {
      if (i === 0) {
        dataPoints.push({ month: 0, balance: P, contributions: P });
        continue;
      }
      currentBal = currentBal * (1 + monthlyRate);
      if (PMT > 0) currentBal += PMT;
      dataPoints.push({ month: i, balance: currentBal, contributions: P + (PMT * i) });
    }

    return {
      projectedBalance: projectedBalance,
      totalContributions: totalContributions,
      totalGrowth: totalGrowth,
      totalTaxSavings: totalTaxSavings,
      dataPoints: dataPoints,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentBalance <= 0 && inputs.annualContribution <= 0 && inputs.employerContribution <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateHsa(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_projectedBalance', formatCurrency(result.projectedBalance));
    setOutputText('output_totalContributions', formatCurrency(result.totalContributions));
    setOutputText('output_totalGrowth', formatCurrency(result.totalGrowth));
    setOutputText('output_totalTaxSavings', formatCurrency(result.totalTaxSavings));

    var chartPayload = {
      dataPoints: result.dataPoints,
      projectedBalance: result.projectedBalance,
      totalGrowth: result.totalGrowth,
      totalContributions: result.totalContributions
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentBalance: inputs.currentBalance,
        annualContribution: inputs.annualContribution,
        employerContribution: inputs.employerContribution,
        annualReturn: inputs.annualReturn * 100,
        yearsToGrow: inputs.yearsToGrow,
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
      var contributions = data.dataPoints.map(function(d) { return d.contributions; });

      var fLabels = labels.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === labels.length - 1; });
      var fBalances = balances.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === balances.length - 1; });
      var fContribs = contributions.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === contributions.length - 1; });

      return {
        type: 'line',
        data: {
          labels: fLabels,
          datasets: [
            { label: 'HSA Balance', data: fBalances, borderColor: '#4A90D9', backgroundColor: 'rgba(74, 144, 217, 0.1)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 },
            { label: 'Total Contributions', data: fContribs, borderColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.05)', fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2, borderDash: [6, 4] }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'HSA Growth Over Time', font: { size: 14, color: '#e8edf0' } }
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
      var principal = data.totalContributions || 0;
      var growth = data.totalGrowth || 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Contributions', 'Investment Growth'],
          datasets: [{ data: [principal, growth], backgroundColor: ['#4A90D9', '#4ade80'], borderColor: ['#3a7b8c', '#3a9b6c'], borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Contributions vs Growth', font: { size: 14, color: '#e8edf0' } }
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
    document.getElementById('input_currentBalance').value = 3000;
    document.getElementById('input_annualContribution').value = 3000;
    document.getElementById('input_employerContribution').value = 1000;
    document.getElementById('input_annualReturn').value = 6;
    document.getElementById('input_yearsToGrow').value = 20;
    document.getElementById('input_marginalTaxRate').value = 24;
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

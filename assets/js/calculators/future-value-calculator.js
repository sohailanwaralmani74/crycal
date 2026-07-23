(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  var COMPOUNDING_MAP = {
    'daily': 365,
    'monthly': 12,
    'quarterly': 4,
    'annually': 1
  };

  function getInputs() {
    var presentValue = parseFloat(document.getElementById('input_presentValue').value) || 0;
    var monthlyContribution = parseFloat(document.getElementById('input_monthlyContribution').value) || 0;
    var annualRate = parseFloat(document.getElementById('input_annualRate').value) || 0;
    var compoundingFrequency = document.getElementById('input_compoundingFrequency').value;
    var timeYears = parseFloat(document.getElementById('input_timeYears').value) || 0;

    return {
      presentValue: presentValue,
      monthlyContribution: monthlyContribution,
      annualRate: annualRate / 100,
      compoundingFrequency: compoundingFrequency,
      timeYears: timeYears
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

  var ALL_OUTPUTS = ['futureValue', 'totalContributions', 'totalGrowth', 'growthMultiple'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateFutureValue(inputs) {
    var PV = inputs.presentValue;
    var PMT = inputs.monthlyContribution;
    var r = inputs.annualRate;
    var n = COMPOUNDING_MAP[inputs.compoundingFrequency] || 12;
    var t = inputs.timeYears;

    if (PV <= 0 && PMT <= 0) {
      return { error: 'Enter a present value or monthly contribution' };
    }
    if (t <= 0 || r < 0) {
      return { error: 'Enter valid time period and rate' };
    }

    var totalMonths = Math.round(t * 12);
    var periods = n * t;
    var periodicRate = r / n;

    var fvPresent = PV * Math.pow(1 + periodicRate, periods);

    var fvContributions = 0;
    if (PMT > 0 && r > 0) {
      var monthlyRate = r / 12;
      fvContributions = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else if (PMT > 0) {
      fvContributions = PMT * totalMonths;
    }

    var futureValue = fvPresent + fvContributions;
    var totalContributions = PV + (PMT * totalMonths);
    var totalGrowth = futureValue - totalContributions;
    var growthMultiple = PV > 0 ? futureValue / PV : null;

    var dataPoints = [];
    var currentBalance = PV;
    for (var i = 0; i <= totalMonths; i++) {
      if (i === 0) {
        dataPoints.push({ month: 0, balance: PV, contributions: PV });
        continue;
      }
      var monthlyFactor = Math.pow(1 + r / n, n / 12);
      currentBalance = currentBalance * monthlyFactor;
      if (PMT > 0) currentBalance += PMT;
      dataPoints.push({
        month: i,
        balance: currentBalance,
        contributions: PV + (PMT * i)
      });
    }

    return {
      futureValue: futureValue,
      totalContributions: totalContributions,
      totalGrowth: totalGrowth,
      growthMultiple: growthMultiple,
      dataPoints: dataPoints,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.presentValue <= 0 && inputs.monthlyContribution <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateFutureValue(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_futureValue', formatCurrency(result.futureValue));
    setOutputText('output_totalContributions', formatCurrency(result.totalContributions));
    setOutputText('output_totalGrowth', formatCurrency(result.totalGrowth));
    setOutputText('output_growthMultiple', result.growthMultiple !== null ? result.growthMultiple.toFixed(2) + 'x' : '—');

    var chartPayload = {
      dataPoints: result.dataPoints,
      futureValue: result.futureValue,
      totalGrowth: result.totalGrowth,
      totalContributions: result.totalContributions
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        presentValue: inputs.presentValue,
        monthlyContribution: inputs.monthlyContribution,
        annualRate: inputs.annualRate * 100,
        compoundingFrequency: inputs.compoundingFrequency,
        timeYears: inputs.timeYears,
        futureValue: result.futureValue
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
            {
              label: 'Future Value',
              data: fBalances,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: 'Total Contributions',
              data: fContribs,
              borderColor: '#fbbf24',
              backgroundColor: 'rgba(251, 191, 36, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 0,
              borderWidth: 2,
              borderDash: [6, 4]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Future Value Growth', font: { size: 14, color: '#e8edf0' } }
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
          labels: ['Principal', 'Growth'],
          datasets: [{
            data: [principal, growth],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderColor: ['#3a7b8c', '#3a9b6c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Principal vs Growth Breakdown', font: { size: 14, color: '#e8edf0' } }
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
    document.getElementById('input_presentValue').value = 10000;
    document.getElementById('input_monthlyContribution').value = 300;
    document.getElementById('input_annualRate').value = 7;
    document.getElementById('input_compoundingFrequency').value = 'monthly';
    document.getElementById('input_timeYears').value = 15;
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

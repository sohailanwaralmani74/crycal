(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var initialDeposit = parseFloat(document.getElementById('input_initialDeposit').value) || 0;
    var monthlyContribution = parseFloat(document.getElementById('input_monthlyContribution').value) || 0;
    var apy = parseFloat(document.getElementById('input_apy').value) || 0;
    var compoundFreq = document.getElementById('input_compoundFrequency').value;
    var timeValue = parseFloat(document.getElementById('input_timeValue').value) || 0;
    var timeUnit = document.getElementById('input_timeUnit').value;

    return {
      initialDeposit: initialDeposit,
      monthlyContribution: monthlyContribution,
      apy: apy / 100,
      compoundFreq: compoundFreq,
      timeValue: timeValue,
      timeUnit: timeUnit
    };
  }

  // ── Format Currency ──
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

  // ── Core Calculation ──
  function calculateHYSA(inputs) {
    var P = inputs.initialDeposit;
    var PMT = inputs.monthlyContribution;
    var r = inputs.apy;
    var t = inputs.timeUnit === 'months' ? inputs.timeValue / 12 : inputs.timeValue;
    var nMap = { daily: 365, monthly: 12, quarterly: 4, annually: 1 };
    var n = nMap[inputs.compoundFreq] || 365;

    if (t <= 0 || r < 0) {
      return { finalBalance: P, totalInterest: 0, totalContributions: P, effectiveApy: 0, dataPoints: [] };
    }

    var totalMonths = Math.round(t * 12);
    if (totalMonths < 0) totalMonths = 0;

    var monthlyRate = r / n;
    var periods = n * t;

    // Future value of initial deposit
    var fvInitial = P * Math.pow(1 + monthlyRate, periods);

    // Future value of monthly contributions (end of each month)
    var fvContributions = 0;
    if (PMT > 0 && r > 0) {
      var monthlyPeriodicRate = r / 12;
      fvContributions = PMT * ((Math.pow(1 + monthlyPeriodicRate, totalMonths) - 1) / monthlyPeriodicRate);
    } else if (PMT > 0) {
      fvContributions = PMT * totalMonths;
    }

    var finalBalance = fvInitial + fvContributions;
    var totalContributionsAmount = P + (PMT * totalMonths);
    var totalInterest = finalBalance - totalContributionsAmount;

    // Effective APY
    var effectiveApy = (Math.pow(1 + r/n, n) - 1) * 100;

    // Generate data points for chart (monthly)
    var dataPoints = [];
    var currentBalance = P;
    var monthlyFactor = Math.pow(1 + r/n, n / 12);

    for (var i = 0; i <= totalMonths; i++) {
      if (i === 0) {
        dataPoints.push({ month: 0, balance: P });
        continue;
      }
      currentBalance = currentBalance * monthlyFactor;
      if (PMT > 0) {
        currentBalance += PMT;
      }
      dataPoints.push({ month: i, balance: currentBalance });
    }

    return {
      finalBalance: finalBalance,
      totalInterest: totalInterest,
      totalContributions: totalContributionsAmount,
      effectiveApy: effectiveApy,
      dataPoints: dataPoints
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.initialDeposit < 0 || inputs.timeValue <= 0 || inputs.apy < 0) {
      setOutputText('output_finalBalance', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_totalContributions', '—');
      setOutputText('output_effectiveApy', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateHYSA(inputs);

    setOutputText('output_finalBalance', formatCurrency(result.finalBalance));
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_totalContributions', formatCurrency(result.totalContributions));
    setOutputText('output_effectiveApy', result.effectiveApy.toFixed(2) + '%');

    var chartPayload = {
      dataPoints: result.dataPoints,
      finalBalance: result.finalBalance,
      totalInterest: result.totalInterest,
      totalContributions: result.totalContributions,
      initialDeposit: inputs.initialDeposit
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        initialDeposit: inputs.initialDeposit,
        monthlyContribution: inputs.monthlyContribution,
        apy: inputs.apy * 100,
        timePeriod: inputs.timeValue + ' ' + inputs.timeUnit,
        compoundFrequency: inputs.compoundFreq,
        finalBalance: result.finalBalance,
        totalInterest: result.totalInterest
      });
    }
  }

  // ── Charts ──
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
      var labels = data.dataPoints.map(function(d) { return d.month; });
      var balances = data.dataPoints.map(function(d) { return d.balance; });
      var currencySymbol = (typeof getCurrencySymbol === 'function')
        ? getCurrencySymbol(typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD')
        : '$';

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Balance',
            data: balances,
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Savings Growth Over Time (months)',
              font: { size: 14 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Months' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var contrib = data.totalContributions || 0;
      var interest = data.totalInterest || 0;
      if (contrib === 0 && interest === 0) return null;

      return {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Interest Earned'],
          datasets: [{
            data: [contrib, interest],
            backgroundColor: ['#4A90D9', '#C08A2E'],
            borderColor: ['#3a7b8c', '#A87520'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Principal vs Interest Breakdown',
              font: { size: 14 }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_initialDeposit').value = 1000;
    document.getElementById('input_monthlyContribution').value = 100;
    document.getElementById('input_apy').value = 4.50;
    document.getElementById('input_compoundFrequency').value = 'daily';
    document.getElementById('input_timeValue').value = 5;
    document.getElementById('input_timeUnit').value = 'years';
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
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
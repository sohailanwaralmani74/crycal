(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Compounding Frequency Mapping ──
  var COMPOUNDING_MAP = {
    'daily': 365,
    'weekly': 52,
    'monthly': 12,
    'quarterly': 4,
    'annually': 1
  };

  // ── Get Inputs ──
  function getInputs() {
    var initialDeposit = parseFloat(document.getElementById('input_initialDeposit').value) || 0;
    var monthlyContribution = parseFloat(document.getElementById('input_monthlyContribution').value) || 0;
    var apy = parseFloat(document.getElementById('input_apy').value) || 0;
    var compoundingFrequency = document.getElementById('input_compoundingFrequency').value;
    var timeYears = parseFloat(document.getElementById('input_timeYears').value) || 0;
    var taxRate = parseFloat(document.getElementById('input_taxRate').value) || 0;

    return {
      initialDeposit: initialDeposit,
      monthlyContribution: monthlyContribution,
      apy: apy / 100,
      compoundingFrequency: compoundingFrequency,
      timeYears: timeYears,
      taxRate: taxRate / 100
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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
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
  function calculateMoneyMarket(inputs) {
    var P = inputs.initialDeposit;
    var PMT = inputs.monthlyContribution;
    var r = inputs.apy;
    var freq = inputs.compoundingFrequency;
    var t = inputs.timeYears;
    var taxRate = inputs.taxRate;

    var n = COMPOUNDING_MAP[freq] || 12;

    if (P <= 0 && PMT <= 0) {
      return { error: 'Enter an initial deposit or monthly contribution' };
    }

    if (t <= 0 || r < 0) {
      return { error: 'Enter valid time period and APY' };
    }

    var totalMonths = Math.round(t * 12);
    var monthlyRate = r / n;
    var periods = n * t;

    // ── Future Value of Initial Deposit ──
    var fvInitial = P * Math.pow(1 + monthlyRate, periods);

    // ── Future Value of Monthly Contributions ──
    var fvContributions = 0;
    if (PMT > 0 && r > 0) {
      var monthlyPeriodicRate = r / 12;
      fvContributions = PMT * ((Math.pow(1 + monthlyPeriodicRate, totalMonths) - 1) / monthlyPeriodicRate);
    } else if (PMT > 0) {
      fvContributions = PMT * totalMonths;
    }

    var endingBalance = fvInitial + fvContributions;
    var totalContributions = P + (PMT * totalMonths);
    var totalInterest = endingBalance - totalContributions;

    // ── Interest After Tax ──
    var interestAfterTax = totalInterest * (1 - taxRate);

    // ── Effective Annual Yield ──
    var effectiveYield = Math.pow(1 + r / n, n) - 1;

    // ── Money Market Return ──
    var moneyMarketReturn = totalContributions > 0 ? (endingBalance - totalContributions) / totalContributions : 0;

    // ── Average Monthly Earnings ──
    var monthlyEarnings = totalMonths > 0 ? totalInterest / totalMonths : 0;

    // ── Generate Data Points ──
    var dataPoints = [];
    var currentBalance = P;

    for (var i = 0; i <= totalMonths; i++) {
      if (i === 0) {
        dataPoints.push({ month: 0, balance: P, contributions: P });
        continue;
      }

      var monthlyFactor = Math.pow(1 + r / n, n / 12);
      currentBalance = currentBalance * monthlyFactor;
      if (PMT > 0) {
        currentBalance += PMT;
      }

      var contribSoFar = P + (PMT * i);
      dataPoints.push({
        month: i,
        balance: currentBalance,
        contributions: contribSoFar
      });
    }

    return {
      endingBalance: endingBalance,
      totalContributions: totalContributions,
      totalInterest: totalInterest,
      interestAfterTax: interestAfterTax,
      effectiveYield: effectiveYield,
      moneyMarketReturn: moneyMarketReturn,
      monthlyEarnings: monthlyEarnings,
      dataPoints: dataPoints,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.initialDeposit <= 0 && inputs.monthlyContribution <= 0) {
      setOutputText('output_endingBalance', '—');
      setOutputText('output_totalContributions', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_interestAfterTax', '—');
      setOutputText('output_effectiveAnnualYield', '—');
      setOutputText('output_moneyMarketReturn', '—');
      setOutputText('output_monthlyEarnings', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateMoneyMarket(inputs);

    if (result.error) {
      setOutputText('output_endingBalance', '—');
      setOutputText('output_totalContributions', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_interestAfterTax', '—');
      setOutputText('output_effectiveAnnualYield', '—');
      setOutputText('output_moneyMarketReturn', '—');
      setOutputText('output_monthlyEarnings', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_endingBalance', formatCurrency(result.endingBalance));
    setOutputText('output_totalContributions', formatCurrency(result.totalContributions));
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_interestAfterTax', formatCurrency(result.interestAfterTax));
    setOutputText('output_effectiveAnnualYield', formatPercent(result.effectiveYield));
    setOutputText('output_moneyMarketReturn', formatPercent(result.moneyMarketReturn));
    setOutputText('output_monthlyEarnings', formatCurrency(result.monthlyEarnings));

    var chartPayload = {
      dataPoints: result.dataPoints,
      endingBalance: result.endingBalance,
      totalInterest: result.totalInterest,
      totalContributions: result.totalContributions
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        initialDeposit: inputs.initialDeposit,
        monthlyContribution: inputs.monthlyContribution,
        apy: inputs.apy * 100,
        compoundingFrequency: inputs.compoundingFrequency,
        timeYears: inputs.timeYears,
        endingBalance: result.endingBalance,
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
      var labels = data.dataPoints.map(function(d) { return 'Month ' + d.month; });
      var balances = data.dataPoints.map(function(d) { return d.balance; });
      var contributions = data.dataPoints.map(function(d) { return d.contributions; });

      // Show every 3rd month for cleaner display
      var filteredLabels = labels.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === labels.length - 1; });
      var filteredBalances = balances.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === balances.length - 1; });
      var filteredContributions = contributions.filter(function(d, i) { return i % 3 === 0 || i === 0 || i === contributions.length - 1; });

      return {
        type: 'line',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: 'Account Balance',
              data: filteredBalances,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: 'Total Contributions',
              data: filteredContributions,
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
            legend: {
              position: 'top',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Money Market Account Growth',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxTicksLimit: 20
              }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var principal = data.totalContributions || 0;
      var interest = data.totalInterest || 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Interest Earned'],
          datasets: [{
            data: [principal, interest],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderColor: ['#3a7b8c', '#3a9b6c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Principal vs Interest Breakdown',
              font: { size: 14, color: '#e8edf0' }
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
    document.getElementById('input_initialDeposit').value = 10000;
    document.getElementById('input_monthlyContribution').value = 500;
    document.getElementById('input_apy').value = 4.50;
    document.getElementById('input_compoundingFrequency').value = 'daily';
    document.getElementById('input_timeYears').value = 5;
    document.getElementById('input_taxRate').value = 0;
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
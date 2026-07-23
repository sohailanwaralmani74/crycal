(function() {

  var chartInstance = null;
  var currentTab = 'balance';
  var lastChartData = null;

  function getInputs() {
    var portfolioValue = parseFloat(document.getElementById('input_portfolioValue').value) || 0;
    var withdrawalRate = parseFloat(document.getElementById('input_withdrawalRate').value) || 0;
    var inflationRate = parseFloat(document.getElementById('input_inflationRate').value) || 0;
    var expectedReturn = parseFloat(document.getElementById('input_expectedReturn').value) || 0;
    var retirementYears = parseFloat(document.getElementById('input_retirementYears').value) || 0;

    return {
      portfolioValue: portfolioValue,
      withdrawalRate: withdrawalRate / 100,
      inflationRate: inflationRate / 100,
      expectedReturn: expectedReturn / 100,
      retirementYears: retirementYears
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

  var ALL_OUTPUTS = ['initialAnnualWithdrawal', 'initialMonthlyWithdrawal', 'withdrawalInFinalYear', 'endingBalance'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateSafeWithdrawal(inputs) {
    if (inputs.portfolioValue <= 0) {
      return { error: 'Enter a valid portfolio value' };
    }
    if (inputs.retirementYears <= 0) {
      return { error: 'Enter valid years in retirement' };
    }

    var initialWithdrawal = inputs.portfolioValue * inputs.withdrawalRate;
    var balance = inputs.portfolioValue;
    var withdrawal = initialWithdrawal;
    var balancePoints = [{ year: 0, balance: balance }];
    var withdrawalPoints = [{ year: 1, withdrawal: withdrawal }];

    for (var year = 1; year <= inputs.retirementYears; year++) {
      if (year > 1) {
        withdrawal = withdrawal * (1 + inputs.inflationRate);
        withdrawalPoints.push({ year: year, withdrawal: withdrawal });
      }
      balance = (balance - withdrawal) * (1 + inputs.expectedReturn);
      balancePoints.push({ year: year, balance: Math.max(0, balance) });
    }

    return {
      initialAnnualWithdrawal: initialWithdrawal,
      initialMonthlyWithdrawal: initialWithdrawal / 12,
      withdrawalInFinalYear: withdrawal,
      endingBalance: balance,
      balancePoints: balancePoints,
      withdrawalPoints: withdrawalPoints,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.portfolioValue <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateSafeWithdrawal(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_initialAnnualWithdrawal', formatCurrency(result.initialAnnualWithdrawal));
    setOutputText('output_initialMonthlyWithdrawal', formatCurrency(result.initialMonthlyWithdrawal));
    setOutputText('output_withdrawalInFinalYear', formatCurrency(result.withdrawalInFinalYear));
    setOutputText('output_endingBalance', formatCurrency(result.endingBalance));

    var chartPayload = {
      balancePoints: result.balancePoints,
      withdrawalPoints: result.withdrawalPoints
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        portfolioValue: inputs.portfolioValue,
        withdrawalRate: inputs.withdrawalRate * 100,
        retirementYears: inputs.retirementYears,
        endingBalance: result.endingBalance
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

  function currencyTick(v) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
    } catch (e) { return '$' + v.toFixed(0); }
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'balance' && data.balancePoints && data.balancePoints.length > 0) {
      var labels = data.balancePoints.map(function(d) { return 'Year ' + d.year; });
      var balances = data.balancePoints.map(function(d) { return d.balance; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Portfolio Balance', data: balances, borderColor: '#4A90D9', backgroundColor: 'rgba(74, 144, 217, 0.1)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Portfolio Balance Over Retirement', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 15 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: currencyTick } }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      };
    }

    if (tab === 'withdrawal' && data.withdrawalPoints && data.withdrawalPoints.length > 0) {
      var wLabels = data.withdrawalPoints.map(function(d) { return 'Year ' + d.year; });
      var withdrawals = data.withdrawalPoints.map(function(d) { return d.withdrawal; });

      return {
        type: 'bar',
        data: {
          labels: wLabels,
          datasets: [
            { label: 'Annual Withdrawal', data: withdrawals, backgroundColor: 'rgba(74, 144, 217, 0.6)', borderColor: '#4A90D9', borderWidth: 1 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Inflation-Adjusted Annual Withdrawal', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 15 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: currencyTick } }
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
    document.getElementById('input_portfolioValue').value = 1000000;
    document.getElementById('input_withdrawalRate').value = 4;
    document.getElementById('input_inflationRate').value = 3;
    document.getElementById('input_expectedReturn').value = 6;
    document.getElementById('input_retirementYears').value = 30;
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

(function() {

  var chartInstance = null;
  var lastChartData = null;

  var COMPOUND_MAP = {
    daily: 365,
    monthly: 12,
    quarterly: 4,
    semiannually: 2,
    annually: 1
  };

  function getInputs() {
    var principal = parseFloat(document.getElementById('input_principal').value) || 0;
    var termMonths = parseFloat(document.getElementById('input_termMonths').value) || 0;
    var interestRate = parseFloat(document.getElementById('input_interestRate').value) || 0;
    var compoundingKey = document.getElementById('input_compoundingFrequency')?.value || 'monthly';

    return {
      principal: principal,
      termMonths: termMonths,
      interestRate: interestRate / 100,
      compoundingKey: compoundingKey,
      compoundingPerYear: COMPOUND_MAP[compoundingKey] || 12
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

  function formatPercent(amount) {
    return amount.toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['maturityValue', 'totalInterest', 'apy'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateCD(inputs) {
    if (inputs.principal <= 0) {
      return { error: 'Enter a valid deposit amount' };
    }
    if (inputs.termMonths <= 0) {
      return { error: 'Enter a valid CD term in months' };
    }
    if (inputs.interestRate <= 0) {
      return { error: 'Enter a valid interest rate' };
    }

    var P = inputs.principal;
    var r = inputs.interestRate;
    var n = inputs.compoundingPerYear;
    var t = inputs.termMonths / 12;

    var maturityValue = P * Math.pow(1 + r / n, n * t);
    var totalInterest = maturityValue - P;
    var apy = Math.pow(1 + r / n, n) - 1;

    // Generate monthly chart data
    var balancePoints = [];
    var months = Math.ceil(inputs.termMonths);
    for (var m = 0; m <= months; m++) {
      var time = m / 12;
      var balance = P * Math.pow(1 + r / n, n * time);
      balancePoints.push({ month: m, balance: Math.max(0, balance) });
    }

    return {
      maturityValue: maturityValue,
      totalInterest: totalInterest,
      apy: apy,
      balancePoints: balancePoints,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.principal <= 0 || inputs.termMonths <= 0 || inputs.interestRate <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateCD(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_maturityValue', formatCurrency(result.maturityValue));
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_apy', formatPercent(result.apy * 100));

    var chartPayload = {
      balancePoints: result.balancePoints
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    // Log history
    if (typeof window.logHistory === 'function') {
      window.logHistory({
        principal: inputs.principal,
        termMonths: inputs.termMonths,
        interestRate: inputs.interestRate * 100,
        compounding: inputs.compoundingKey,
        maturityValue: result.maturityValue,
        totalInterest: result.totalInterest,
        apy: result.apy * 100
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
    var chartData = generateChartData(data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function currencyTick(v) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
    } catch (e) { return '$' + v.toFixed(0); }
  }

  function generateChartData(data) {
    if (!data || !data.balancePoints || data.balancePoints.length === 0) return null;

    var labels = data.balancePoints.map(function(d) { return 'Month ' + d.month; });
    var balances = data.balancePoints.map(function(d) { return d.balance; });

    return {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'CD Balance',
            data: balances,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
          title: { display: true, text: 'CD Balance Growth Over Term', font: { size: 14, color: '#e8edf0' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 15 } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: currencyTick } }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    };
  }

  function resetTool() {
    var _el_principal = document.getElementById('input_principal');
    _el_principal.value = (_el_principal.dataset && _el_principal.dataset.default !== undefined) ? _el_principal.dataset.default : (_el_principal.getAttribute('value') || '');
    var _el_termMonths = document.getElementById('input_termMonths');
    _el_termMonths.value = (_el_termMonths.dataset && _el_termMonths.dataset.default !== undefined) ? _el_termMonths.dataset.default : (_el_termMonths.getAttribute('value') || '');
    var _el_interestRate = document.getElementById('input_interestRate');
    _el_interestRate.value = (_el_interestRate.dataset && _el_interestRate.dataset.default !== undefined) ? _el_interestRate.dataset.default : (_el_interestRate.getAttribute('value') || '');
    var _el_compounding = document.getElementById('input_compoundingFrequency');
    if (_el_compounding) {
      var defaultComp = (_el_compounding.dataset && _el_compounding.dataset.default !== undefined) ? _el_compounding.dataset.default : (_el_compounding.getAttribute('value') || 'monthly');
      _el_compounding.value = defaultComp;
    }
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
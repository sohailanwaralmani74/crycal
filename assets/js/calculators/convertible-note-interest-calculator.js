(function() {
  var chartInstance = null;
  var currentTab = 'principalVsInterest';
  var lastChartData = null;

  function getInputs() {
    var principal = parseFloat(document.getElementById('input_principalAmount').value) || 0;
    var rate = parseFloat(document.getElementById('input_interestRate').value) || 0;
    var duration = parseFloat(document.getElementById('input_durationMonths').value) || 0;
    var methodEl = document.getElementById('input_compoundingFrequency');
    var method = methodEl ? methodEl.value : 'Simple Interest';
    var price = parseFloat(document.getElementById('input_qualifiedRoundPrice').value) || 0.01;

    return {
      principal: principal,
      rate: rate / 100,
      duration: duration,
      method: method,
      price: price
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }

  function formatLargeCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + Math.round(amount).toLocaleString();
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

  function calculateNoteInterest(inputs) {
    var p = inputs.principal;
    var r = inputs.rate;
    var m = inputs.duration;
    var isCompound = inputs.method === 'Annual Compounding';
    var price = inputs.price;

    var interest = 0;
    if (isCompound) {
      var total = p * Math.pow(1 + r, m / 12);
      interest = total - p;
    } else {
      interest = p * r * (m / 12);
    }

    var totalVal = p + interest;
    var shares = price > 0 ? totalVal / price : 0;
    var monthlyAccrual = m > 0 ? interest / m : 0;
    var effYield = p > 0 ? (interest / p) * 100 : 0;

    var timeline = [];
    for (var i = 0; i <= m; i += Math.max(1, Math.floor(m / 12))) {
      var curInt = isCompound ? p * Math.pow(1 + r, i / 12) - p : p * r * (i / 12);
      timeline.push({ month: i, interest: curInt });
    }

    return {
      interest: interest,
      totalVal: totalVal,
      shares: shares,
      monthlyAccrual: monthlyAccrual,
      effYield: effYield,
      timeline: timeline,
      principal: p
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.principal <= 0 || inputs.duration <= 0) {
      setOutputText('output_accruedInterest', '—');
      setOutputText('output_totalConversionValue', '—');
      setOutputText('output_totalShares', '—');
      setOutputText('output_monthlyInterest', '—');
      setOutputText('output_effectiveInterestPercent', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateNoteInterest(inputs);

    setOutputText('output_accruedInterest', formatCurrency(res.interest));
    setOutputText('output_totalConversionValue', formatLargeCurrency(res.totalVal));
    setOutputText('output_totalShares', Math.round(res.shares).toLocaleString() + ' shares');
    setOutputText('output_monthlyInterest', formatCurrency(res.monthlyAccrual) + ' / mo');
    setOutputText('output_effectiveInterestPercent', res.effYield.toFixed(2) + '%');

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        principalAmount: inputs.principal,
        interestRate: (inputs.rate * 100) + '%',
        durationMonths: inputs.duration,
        accruedInterest: formatCurrency(res.interest),
        totalConversionValue: formatLargeCurrency(res.totalVal)
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
    var config = generateChartConfig(currentTab, data);
    if (!config) return;
    chartInstance = new Chart(ctx, config);
  }

  function generateChartConfig(tab, data) {
    if (!data) return null;

    if (tab === 'principalVsInterest') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Converting Value ($)'],
          datasets: [
            {
              label: 'Principal Amount',
              data: [data.principal],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Accrued Interest',
              data: [data.interest],
              backgroundColor: '#f59e0b'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Principal vs Accrued Interest Stack ($)', color: '#e8edf0' }
          },
          scales: {
            x: { stacked: true, ticks: { color: '#8899aa' } },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(0) + 'k'; } }
            }
          }
        }
      };
    }

    if (tab === 'accrualTrajectory') {
      var labels = data.timeline.map(function(d) { return 'Mo ' + d.month; });
      var values = data.timeline.map(function(d) { return d.interest; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Accrued Interest ($)',
            data: values,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cumulative Interest Accrual ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(1) + 'k'; } }
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
  }

  function resetTool() {
    document.getElementById('input_principalAmount').value = 250000;
    document.getElementById('input_interestRate').value = 6.0;
    document.getElementById('input_durationMonths').value = 18;
    var m = document.getElementById('input_compoundingFrequency');
    if (m) m.value = 'Simple Interest';
    document.getElementById('input_qualifiedRoundPrice').value = 5.00;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

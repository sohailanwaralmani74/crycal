(function() {
  var chartInstance = null;
  var currentTab = 'valuationBreakdown';
  var lastChartData = null;

  function getInputs() {
    var preVal = parseFloat(document.getElementById('input_preMoneyValuation').value) || 0;
    var invAmt = parseFloat(document.getElementById('input_investmentAmount').value) || 0;
    var existShares = parseFloat(document.getElementById('input_existingShares').value) || 1;

    return {
      preValuation: preVal,
      investmentAmount: invAmt,
      existingShares: existShares
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

  function calculatePrePost(inputs) {
    var pre = inputs.preValuation;
    var inv = inputs.investmentAmount;
    var existS = inputs.existingShares;

    var post = pre + inv;
    var invPct = post > 0 ? (inv / post) * 100 : 0;
    var existPct = post > 0 ? (pre / post) * 100 : 0;
    var pps = existS > 0 ? pre / existS : 0;
    var newS = pps > 0 ? inv / pps : 0;
    var totalS = existS + newS;
    var dilution = 100 - existPct;

    return {
      postValuation: post,
      investorPct: invPct,
      existPct: existPct,
      pricePerShare: pps,
      newShares: newS,
      totalShares: totalS,
      dilution: dilution,
      preValuation: pre,
      investmentAmount: inv,
      existingShares: existS
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.preValuation <= 0 || inputs.investmentAmount <= 0) {
      setOutputText('output_postMoneyValuation', '—');
      setOutputText('output_investorOwnership', '—');
      setOutputText('output_pricePerShare', '—');
      setOutputText('output_newSharesIssued', '—');
      setOutputText('output_effectiveDilution', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculatePrePost(inputs);

    setOutputText('output_postMoneyValuation', formatLargeCurrency(res.postValuation));
    setOutputText('output_investorOwnership', res.investorPct.toFixed(2) + '%');
    setOutputText('output_pricePerShare', formatCurrency(res.pricePerShare));
    setOutputText('output_newSharesIssued', Math.round(res.newShares).toLocaleString() + ' shares');
    setOutputText('output_effectiveDilution', res.dilution.toFixed(2) + '%');

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        preMoneyValuation: inputs.preValuation,
        investmentAmount: inputs.investmentAmount,
        postMoneyValuation: res.postValuation,
        investorOwnership: res.investorPct.toFixed(2) + '%',
        pricePerShare: formatCurrency(res.pricePerShare)
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

    if (tab === 'valuationBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Valuation Stack ($)'],
          datasets: [
            {
              label: 'Pre-Money Valuation',
              data: [data.preValuation],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Investment Raised',
              data: [data.investmentAmount],
              backgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Pre-Money + Investment = Post-Money Valuation', color: '#e8edf0' }
          },
          scales: {
            x: { stacked: true, ticks: { color: '#8899aa' } },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e6).toFixed(1) + 'M'; } }
            }
          }
        }
      };
    }

    if (tab === 'shareDistribution') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Existing Pre-Round Shares', 'New Investor Shares'],
          datasets: [{
            data: [data.existingShares, data.newShares],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Post-Round Total Share Distribution', color: '#e8edf0' }
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
    document.getElementById('input_preMoneyValuation').value = 8000000;
    document.getElementById('input_investmentAmount').value = 2000000;
    document.getElementById('input_existingShares').value = 8000000;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

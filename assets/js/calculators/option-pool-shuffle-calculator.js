(function() {
  var chartInstance = null;
  var currentTab = 'poolComparison';
  var lastChartData = null;

  function getInputs() {
    var preVal = parseFloat(document.getElementById('input_preMoneyValuation').value) || 0;
    var invAmt = parseFloat(document.getElementById('input_investmentAmount').value) || 0;
    var poolPct = parseFloat(document.getElementById('input_optionPoolPercent').value) || 0;
    var fShares = parseFloat(document.getElementById('input_existingFounderShares').value) || 1;

    return {
      preValuation: preVal,
      investmentAmount: invAmt,
      poolPercent: poolPct,
      founderShares: fShares
    };
  }

  function formatCurrency(amount) {
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

  function calculateOptionPoolShuffle(inputs) {
    var pre = inputs.preValuation;
    var inv = inputs.investmentAmount;
    var poolPct = inputs.poolPercent;

    var post = pre + inv;
    var invPct = post > 0 ? (inv / post) * 100 : 0;

    // Pre-Money Pool Option (Investor standard)
    var prePoolVal = post * (poolPct / 100);
    var effPre = pre - prePoolVal;
    var preFounderPct = post > 0 ? (effPre / post) * 100 : 0;
    var preInvPct = invPct;

    // Post-Money Pool Option (Founder friendly)
    var postFounderPct = (pre / post) * (1 - poolPct / 100) * 100;
    var postInvPct = (inv / post) * (1 - poolPct / 100) * 100;

    var shuffleDiff = postFounderPct - preFounderPct;
    var dollarLoss = post * (shuffleDiff / 100);

    return {
      postValuation: post,
      preFounderPct: preFounderPct,
      postFounderPct: postFounderPct,
      preInvPct: preInvPct,
      postInvPct: postInvPct,
      poolPct: poolPct,
      shuffleDiff: shuffleDiff,
      dollarLoss: dollarLoss,
      effPre: effPre,
      preValuation: pre,
      investmentAmount: inv
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.preValuation <= 0 || inputs.investmentAmount <= 0) {
      setOutputText('output_preMoneyFounderEquity', '—');
      setOutputText('output_postMoneyFounderEquity', '—');
      setOutputText('output_shuffleDilutionImpact', '—');
      setOutputText('output_dollarCostToFounders', '—');
      setOutputText('output_effectivePreMoneyValuation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateOptionPoolShuffle(inputs);

    setOutputText('output_preMoneyFounderEquity', res.preFounderPct.toFixed(2) + '%');
    setOutputText('output_postMoneyFounderEquity', res.postFounderPct.toFixed(2) + '%');
    setOutputText('output_shuffleDilutionImpact', '-' + res.shuffleDiff.toFixed(2) + '% points');
    setOutputText('output_dollarCostToFounders', formatCurrency(res.dollarLoss));
    setOutputText('output_effectivePreMoneyValuation', formatCurrency(res.effPre));

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        preMoneyValuation: inputs.preValuation,
        investmentAmount: inputs.investmentAmount,
        optionPoolPercent: inputs.poolPercent + '%',
        preMoneyFounderEquity: res.preFounderPct.toFixed(2) + '%',
        shuffleDilutionImpact: '-' + res.shuffleDiff.toFixed(2) + '%'
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

    if (tab === 'poolComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Pre-Money Pool (Standard Investor)', 'Post-Money Pool (Founder Friendly)'],
          datasets: [{
            label: 'Founder Ownership (%)',
            data: [data.preFounderPct, data.postFounderPct],
            backgroundColor: ['#ef4444', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Founder Ownership: Pre-Money vs Post-Money Option Pool (%)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return v + '%'; } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'capTableComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Pre-Money Pool Structure', 'Post-Money Pool Structure'],
          datasets: [
            {
              label: 'Founders',
              data: [data.preFounderPct, data.postFounderPct],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Investors',
              data: [data.preInvPct, data.postInvPct],
              backgroundColor: '#10b981'
            },
            {
              label: 'Option Pool',
              data: [data.poolPct, data.poolPct],
              backgroundColor: '#f59e0b'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Cap Table Composition Comparison (%)', color: '#e8edf0' }
          },
          scales: {
            x: { stacked: true, ticks: { color: '#8899aa' } },
            y: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return v + '%'; } }
            }
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
    document.getElementById('input_preMoneyValuation').value = 10000000;
    document.getElementById('input_investmentAmount').value = 2500000;
    document.getElementById('input_optionPoolPercent').value = 10.0;
    document.getElementById('input_existingFounderShares').value = 10000000;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

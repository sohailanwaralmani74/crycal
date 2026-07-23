(function() {
  var chartInstance = null;
  var currentTab = 'postRoundCapTable';
  var lastChartData = null;

  function getInputs() {
    var preMoney = parseFloat(document.getElementById('input_preMoneyValuation').value) || 0;
    var investment = parseFloat(document.getElementById('input_investmentAmount').value) || 0;
    var founderOwn = parseFloat(document.getElementById('input_existingFounderOwnership').value) || 0;
    var poolPercent = parseFloat(document.getElementById('input_optionPoolPercent').value) || 0;

    return {
      preMoney: preMoney,
      investment: investment,
      founderOwn: founderOwn,
      poolPercent: poolPercent
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

  function calculateDilution(inputs) {
    var pre = inputs.preMoney;
    var inv = inputs.investment;
    var fOwnPre = inputs.founderOwn;
    var pool = inputs.poolPercent;

    var post = pre + inv;
    var invPct = post > 0 ? (inv / post) * 100 : 0;
    var remainingPct = 100 - invPct - pool;

    var newFounderPct = fOwnPre * (remainingPct / 100);
    var otherExistingPct = Math.max(0, remainingPct - newFounderPct);

    var dropPct = fOwnPre - newFounderPct;
    var founderVal = post * (newFounderPct / 100);

    return {
      postMoney: post,
      investorPct: invPct,
      newFounderPct: newFounderPct,
      otherExistingPct: otherExistingPct,
      dropPct: dropPct,
      founderVal: founderVal,
      poolPct: pool,
      fOwnPre: fOwnPre
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.preMoney <= 0 || inputs.investment <= 0) {
      setOutputText('output_postMoneyValuation', '—');
      setOutputText('output_investorOwnership', '—');
      setOutputText('output_newFounderOwnership', '—');
      setOutputText('output_founderDilution', '—');
      setOutputText('output_founderValue', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateDilution(inputs);

    setOutputText('output_postMoneyValuation', formatCurrency(res.postMoney));
    setOutputText('output_investorOwnership', res.investorPct.toFixed(2) + '%');
    setOutputText('output_newFounderOwnership', res.newFounderPct.toFixed(2) + '%');
    setOutputText('output_founderDilution', '-' + res.dropPct.toFixed(2) + '% points');
    setOutputText('output_founderValue', formatCurrency(res.founderVal));

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        preMoneyValuation: inputs.preMoney,
        investmentAmount: inputs.investment,
        investorOwnership: res.investorPct.toFixed(2) + '%',
        newFounderOwnership: res.newFounderPct.toFixed(2) + '%'
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

    if (tab === 'postRoundCapTable') {
      var labels = ['Founders', 'New Investors', 'Option Pool'];
      var chartValues = [data.newFounderPct, data.investorPct, data.poolPct];
      var colors = ['#3b82f6', '#10b981', '#f59e0b'];

      if (data.otherExistingPct > 0.1) {
        labels.push('Other Existing');
        chartValues.push(data.otherExistingPct);
        colors.push('#8b5cf6');
      }

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: chartValues,
            backgroundColor: colors,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Post-Round Ownership (%)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'preVsPostOwnership') {
      return {
        type: 'bar',
        data: {
          labels: ['Founder Ownership %'],
          datasets: [
            {
              label: 'Pre-Round',
              data: [data.fOwnPre],
              backgroundColor: '#64748b',
              borderRadius: 6
            },
            {
              label: 'Post-Round',
              data: [data.newFounderPct],
              backgroundColor: '#3b82f6',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Founder Ownership Pre vs Post Round (%)', color: '#e8edf0' }
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

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_preMoneyValuation').value = 10000000;
    document.getElementById('input_investmentAmount').value = 2500000;
    document.getElementById('input_existingFounderOwnership').value = 80.0;
    document.getElementById('input_optionPoolPercent').value = 10.0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

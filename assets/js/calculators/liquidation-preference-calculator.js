(function() {
  var chartInstance = null;
  var currentTab = 'payoutComparison';
  var lastChartData = null;

  function getInputs() {
    var invested = parseFloat(document.getElementById('input_investedCapital').value) || 0;
    var multiple = parseFloat(document.getElementById('input_liquidationMultiple').value) || 1;
    var ownPct = parseFloat(document.getElementById('input_investorOwnership').value) || 0;
    var capMult = parseFloat(document.getElementById('input_participationCap').value) || 0;
    var exitVal = parseFloat(document.getElementById('input_exitValuation').value) || 0;

    return {
      invested: invested,
      multiple: multiple,
      ownPct: ownPct / 100,
      capMult: capMult,
      exitVal: exitVal
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

  function calculateWaterfall(inputs) {
    var inv = inputs.invested;
    var mult = inputs.multiple;
    var own = inputs.ownPct;
    var cap = inputs.capMult;
    var exitVal = inputs.exitVal;

    var prefAmount = inv * mult;

    // 1. Non-Participating Preferred
    var nonPartCommon = exitVal * own;
    var nonPartInvPayout = Math.min(exitVal, Math.max(prefAmount, nonPartCommon));
    var nonPartFounderPayout = Math.max(0, exitVal - nonPartInvPayout);

    // 2. Participating Preferred
    var prefPaid = Math.min(exitVal, prefAmount);
    var remaining = Math.max(0, exitVal - prefPaid);
    var partShare = remaining * own;
    var totalPartInvPayout = prefPaid + partShare;

    if (cap > 0) {
      var capMax = inv * cap;
      totalPartInvPayout = Math.min(totalPartInvPayout, capMax);
    }
    totalPartInvPayout = Math.min(exitVal, totalPartInvPayout);
    var partFounderPayout = Math.max(0, exitVal - totalPartInvPayout);

    var partDiff = totalPartInvPayout - nonPartInvPayout;

    return {
      nonPartInvPayout: nonPartInvPayout,
      nonPartFounderPayout: nonPartFounderPayout,
      partInvPayout: totalPartInvPayout,
      partFounderPayout: partFounderPayout,
      partDiff: partDiff,
      exitVal: exitVal,
      invested: inv
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.invested <= 0 || inputs.exitVal <= 0) {
      setOutputText('output_nonParticipatingInvestorPayout', '—');
      setOutputText('output_nonParticipatingFounderPayout', '—');
      setOutputText('output_participatingInvestorPayout', '—');
      setOutputText('output_participatingFounderPayout', '—');
      setOutputText('output_participatingDifference', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateWaterfall(inputs);

    setOutputText('output_nonParticipatingInvestorPayout', formatCurrency(res.nonPartInvPayout));
    setOutputText('output_nonParticipatingFounderPayout', formatCurrency(res.nonPartFounderPayout));
    setOutputText('output_participatingInvestorPayout', formatCurrency(res.partInvPayout));
    setOutputText('output_participatingFounderPayout', formatCurrency(res.partFounderPayout));
    setOutputText('output_participatingDifference', res.partDiff >= 0 ? '+' + formatCurrency(res.partDiff) : formatCurrency(res.partDiff));

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        investedCapital: inputs.invested,
        exitValuation: inputs.exitVal,
        nonParticipatingInvestorPayout: formatCurrency(res.nonPartInvPayout),
        participatingInvestorPayout: formatCurrency(res.partInvPayout),
        nonParticipatingFounderPayout: formatCurrency(res.nonPartFounderPayout)
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

    if (tab === 'payoutComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['1x Non-Participating', '1x Participating'],
          datasets: [
            {
              label: 'Investor Payout',
              data: [data.nonPartInvPayout, data.partInvPayout],
              backgroundColor: '#10b981',
              borderRadius: 6
            },
            {
              label: 'Founder / Common Payout',
              data: [data.nonPartFounderPayout, data.partFounderPayout],
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
            title: { display: true, text: 'Investor vs Founder Exit Payout Comparison ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e6).toFixed(1) + 'M'; } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'waterfallAtExit') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Investor Payout (Non-Part)', 'Founder Payout (Non-Part)'],
          datasets: [{
            data: [data.nonPartInvPayout, data.nonPartFounderPayout],
            backgroundColor: ['#10b981', '#3b82f6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Exit Proceeds Share Breakdown ($)', color: '#e8edf0' }
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
    document.getElementById('input_investedCapital').value = 5000000;
    document.getElementById('input_liquidationMultiple').value = 1.0;
    document.getElementById('input_investorOwnership').value = 25.0;
    document.getElementById('input_participationCap').value = 0.0;
    document.getElementById('input_exitValuation').value = 12000000;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

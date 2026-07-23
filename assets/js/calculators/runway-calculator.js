(function() {
  var chartInstance = null;
  var currentTab = 'cashTrajectory';
  var lastChartData = null;

  function getInputs() {
    var cashBalance = parseFloat(document.getElementById('input_cashBalance').value) || 0;
    var monthlyRevenue = parseFloat(document.getElementById('input_monthlyRevenue').value) || 0;
    var monthlyExpenses = parseFloat(document.getElementById('input_monthlyExpenses').value) || 0;
    var growthRate = parseFloat(document.getElementById('input_expectedRevenueGrowth').value) || 0;

    return {
      cashBalance: cashBalance,
      monthlyRevenue: monthlyRevenue,
      monthlyExpenses: monthlyExpenses,
      growthRate: growthRate / 100
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

  function calculateRunway(inputs) {
    var cash = inputs.cashBalance;
    var rev = inputs.monthlyRevenue;
    var exp = inputs.monthlyExpenses;
    var g = inputs.growthRate;

    var netBurn = exp - rev;

    if (netBurn <= 0) {
      return {
        runwayMonths: 'Infinite (Profitable)',
        netMonthlyBurn: netBurn,
        grossMonthlyBurn: exp,
        zeroCashMonth: 'Default (Profitable)',
        runwayStatus: '🟢 Profitable / Cash Flow Positive',
        monthlyData: []
      };
    }

    var months = 0;
    var currentCash = cash;
    var currentRev = rev;
    var monthlyData = [];

    monthlyData.push({ month: 0, cash: currentCash, rev: currentRev, netBurn: exp - currentRev });

    while (currentCash > 0 && months < 120) {
      months++;
      currentRev = currentRev * (1 + g);
      var currentNetBurn = exp - currentRev;
      currentCash -= currentNetBurn;

      monthlyData.push({
        month: months,
        cash: Math.max(0, currentCash),
        rev: currentRev,
        netBurn: currentNetBurn
      });

      if (currentNetBurn <= 0) {
        months = 'Infinite (Growth Break-even)';
        break;
      }
    }

    var status = '';
    if (typeof months === 'number') {
      if (months >= 18) status = '🟢 Safe (' + months + ' mo)';
      else if (months >= 12) status = '🟡 Warning (' + months + ' mo)';
      else status = '🔴 Critical (' + months + ' mo)';
    } else {
      status = '🟢 Profitable';
    }

    var now = new Date();
    var zeroCashDate = 'N/A';
    if (typeof months === 'number') {
      var targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
      zeroCashDate = targetDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    }

    return {
      runwayMonths: typeof months === 'number' ? months + ' Months' : months,
      netMonthlyBurn: netBurn,
      grossMonthlyBurn: exp,
      zeroCashMonth: zeroCashDate,
      runwayStatus: status,
      monthlyData: monthlyData
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.cashBalance <= 0 || inputs.monthlyExpenses <= 0) {
      setOutputText('output_runwayMonths', '—');
      setOutputText('output_netMonthlyBurn', '—');
      setOutputText('output_zeroCashMonth', '—');
      setOutputText('output_grossMonthlyBurn', '—');
      setOutputText('output_runwayStatus', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateRunway(inputs);

    setOutputText('output_runwayMonths', res.runwayMonths);
    setOutputText('output_netMonthlyBurn', formatCurrency(res.netMonthlyBurn));
    setOutputText('output_zeroCashMonth', res.zeroCashMonth);
    setOutputText('output_grossMonthlyBurn', formatCurrency(res.grossMonthlyBurn));
    setOutputText('output_runwayStatus', res.runwayStatus);

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        cashBalance: inputs.cashBalance,
        netMonthlyBurn: formatCurrency(res.netMonthlyBurn),
        runwayMonths: res.runwayMonths,
        runwayStatus: res.runwayStatus
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
    if (!data || !data.monthlyData || data.monthlyData.length === 0) return null;

    var labels = data.monthlyData.map(function(d) { return 'Mo ' + d.month; });

    if (tab === 'cashTrajectory') {
      var cashValues = data.monthlyData.map(function(d) { return d.cash; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cash Balance ($)',
            data: cashValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Projected Cash Balance ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(0) + 'k'; } }
            },
            x: { ticks: { color: '#8899aa', maxTicksLimit: 12 } }
          }
        }
      };
    }

    if (tab === 'burnVsRev') {
      var revValues = data.monthlyData.map(function(d) { return d.rev; });
      var burnValues = data.monthlyData.map(function(d) { return Math.max(0, d.netBurn); });

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Monthly Revenue ($)',
              data: revValues,
              backgroundColor: '#10b981'
            },
            {
              label: 'Net Monthly Burn ($)',
              data: burnValues,
              backgroundColor: '#ef4444'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Revenue vs Net Burn', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(0) + 'k'; } }
            },
            x: { ticks: { color: '#8899aa', maxTicksLimit: 12 } }
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
    document.getElementById('input_cashBalance').value = 1500000;
    document.getElementById('input_monthlyRevenue').value = 80000;
    document.getElementById('input_monthlyExpenses').value = 180000;
    document.getElementById('input_expectedRevenueGrowth').value = 5.0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

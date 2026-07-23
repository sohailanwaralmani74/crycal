(function() {
  var chartInstance = null;
  var currentTab = 'revenueShift';
  var lastChartData = null;

  function getInputs() {
    return {
      lowerTierAccounts: parseFloat(document.getElementById('input_lowerTierAccounts').value) || 0,
      lowerTierPrice: parseFloat(document.getElementById('input_lowerTierPrice').value) || 0,
      higherTierPrice: parseFloat(document.getElementById('input_higherTierPrice').value) || 0,
      featureUsageRate: (parseFloat(document.getElementById('input_featureUsageRate').value) || 0) / 100,
      upgradeConversionRate: (parseFloat(document.getElementById('input_upgradeConversionRate').value) || 0) / 100,
      churnFromGatingRate: (parseFloat(document.getElementById('input_churnFromGatingRate').value) || 0) / 100
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

  function formatNumber(num) {
    return Math.round(num).toLocaleString();
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateGating(inputs) {
    var activeFeatureUsers = inputs.lowerTierAccounts * inputs.featureUsageRate;
    var accountsUpgraded = activeFeatureUsers * inputs.upgradeConversionRate;

    var priceDelta = Math.max(0, inputs.higherTierPrice - inputs.lowerTierPrice);
    var expansionMRR = accountsUpgraded * priceDelta;

    var churnedAccounts = inputs.lowerTierAccounts * inputs.churnFromGatingRate;
    var lostMRRFromChurn = churnedAccounts * inputs.lowerTierPrice;

    var netMonthlyRevenueGain = expansionMRR - lostMRRFromChurn;
    var netAnnualARRImpact = netMonthlyRevenueGain * 12;

    var monthLabels = [];
    var cumulativeTimeline = [];
    var runningSum = 0;

    for (var m = 1; m <= 12; m++) {
      monthLabels.push('M' + m);
      runningSum += netMonthlyRevenueGain;
      cumulativeTimeline.push(runningSum);
    }

    return {
      accountsUpgraded: accountsUpgraded,
      expansionMRR: expansionMRR,
      churnedAccounts: churnedAccounts,
      lostMRRFromChurn: lostMRRFromChurn,
      netMonthlyRevenueGain: netMonthlyRevenueGain,
      netAnnualARRImpact: netAnnualARRImpact,
      monthLabels: monthLabels,
      cumulativeTimeline: cumulativeTimeline
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateGating(inputs);

    setOutputText('output_accountsUpgraded', formatNumber(res.accountsUpgraded));
    setOutputText('output_expansionMRR', formatCurrency(res.expansionMRR));
    setOutputText('output_lostMRRFromChurn', formatCurrency(res.lostMRRFromChurn));
    setOutputText('output_netMonthlyRevenueGain', (res.netMonthlyRevenueGain >= 0 ? '+' : '') + formatCurrency(res.netMonthlyRevenueGain));
    setOutputText('output_netAnnualARRImpact', (res.netAnnualARRImpact >= 0 ? '+' : '') + formatCurrency(res.netAnnualARRImpact));

    lastChartData = res;
    updateCharts(res);
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'revenueShift') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Expansion MRR Gained', 'Lost MRR to Churn', 'Net Monthly Gain'],
          datasets: [{
            label: 'Monthly Revenue Impact ($)',
            data: [data.expansionMRR, data.lostMRRFromChurn, data.netMonthlyRevenueGain],
            backgroundColor: ['#4ade80', '#f87171', '#4A90D9'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Revenue Shift ($)', color: '#e8edf0' }
          },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'netGainTrajectory') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [{
            label: 'Cumulative ARR Impact ($)',
            data: data.cumulativeTimeline,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: '12-Month Cumulative ARR Impact ($)', color: '#e8edf0' }
          },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_lowerTierAccounts').value = 2000;
    document.getElementById('input_lowerTierPrice').value = 49;
    document.getElementById('input_higherTierPrice').value = 149;
    document.getElementById('input_featureUsageRate').value = 30;
    document.getElementById('input_upgradeConversionRate').value = 15;
    document.getElementById('input_churnFromGatingRate').value = 2.0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });
})();

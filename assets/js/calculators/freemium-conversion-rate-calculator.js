(function() {
  var chartInstance = null;
  var currentTab = 'conversion';
  var lastChartData = null;

  function getInputs() {
    return {
      freeUserBase: parseFloat(document.getElementById('input_freeUserBase').value) || 0,
      monthlyFreeGrowth: (parseFloat(document.getElementById('input_monthlyFreeGrowth').value) || 0) / 100,
      conversionRate: (parseFloat(document.getElementById('input_conversionRate').value) || 0) / 100,
      avgPaidPrice: parseFloat(document.getElementById('input_avgPaidPrice').value) || 0,
      paidMonthlyChurn: (parseFloat(document.getElementById('input_paidMonthlyChurn').value) || 0) / 100
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

  function calculateFreemium(inputs) {
    var totalPaidUsers = inputs.freeUserBase * inputs.conversionRate;
    var newPaidUsersMonthly = inputs.freeUserBase * inputs.monthlyFreeGrowth * inputs.conversionRate;

    var freemiumMRR = totalPaidUsers * inputs.avgPaidPrice;
    var freemiumARR = freemiumMRR * 12;

    var arpuFreeUser = inputs.freeUserBase > 0 ? freemiumMRR / inputs.freeUserBase : 0;

    // Rates sensitivity chart data
    var testRates = [1.0, 2.0, 3.0, 4.0, 5.0];
    var rateArrValues = testRates.map(function(r) {
      return (inputs.freeUserBase * (r / 100)) * inputs.avgPaidPrice * 12;
    });

    // 12 month timeline
    var monthLabels = [];
    var mrrTimeline = [];
    var currentFree = inputs.freeUserBase;
    var currentPaid = totalPaidUsers;

    for (var m = 1; m <= 12; m++) {
      monthLabels.push('M' + m);
      var newFree = currentFree * inputs.monthlyFreeGrowth;
      currentFree += newFree;
      var newUpgrades = newFree * inputs.conversionRate;
      var churnedPaid = currentPaid * inputs.paidMonthlyChurn;
      currentPaid = currentPaid + newUpgrades - churnedPaid;
      mrrTimeline.push(currentPaid * inputs.avgPaidPrice);
    }

    return {
      totalPaidUsers: totalPaidUsers,
      newPaidUsersMonthly: newPaidUsersMonthly,
      freemiumMRR: freemiumMRR,
      freemiumARR: freemiumARR,
      arpuFreeUser: arpuFreeUser,
      testRates: testRates,
      rateArrValues: rateArrValues,
      monthLabels: monthLabels,
      mrrTimeline: mrrTimeline
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateFreemium(inputs);

    setOutputText('output_totalPaidUsers', formatNumber(res.totalPaidUsers));
    setOutputText('output_newPaidUsersMonthly', formatNumber(res.newPaidUsersMonthly));
    setOutputText('output_freemiumMRR', formatCurrency(res.freemiumMRR));
    setOutputText('output_freemiumARR', formatCurrency(res.freemiumARR));
    setOutputText('output_arpuFreeUser', formatCurrency(res.arpuFreeUser));

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

    if (currentTab === 'conversion') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.testRates.map(function(r) { return r + '% Conversion'; }),
          datasets: [{
            label: 'Projected ARR ($)',
            data: data.rateArrValues,
            backgroundColor: ['#f87171', '#fbbf24', '#4A90D9', '#4ade80', '#a78bfa'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'ARR Potential across Conversion Rates', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'revenue') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [{
            label: 'Monthly MRR ($)',
            data: data.mrrTimeline,
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
            title: { display: true, text: '12-Month Compound MRR Curve', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
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
    document.getElementById('input_freeUserBase').value = 50000;
    document.getElementById('input_monthlyFreeGrowth').value = 5;
    document.getElementById('input_conversionRate').value = 2.5;
    document.getElementById('input_avgPaidPrice').value = 49;
    document.getElementById('input_paidMonthlyChurn').value = 3.0;
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

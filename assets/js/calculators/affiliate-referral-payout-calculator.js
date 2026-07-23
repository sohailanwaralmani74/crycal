(function() {
  var chartInstance = null;
  var currentTab = 'payout';
  var lastChartData = null;

  function getInputs() {
    var referredCustomers = parseFloat(document.getElementById('input_referredCustomers').value) || 0;
    var monthlySubscriptionPrice = parseFloat(document.getElementById('input_monthlySubscriptionPrice').value) || 0;
    var commissionRate = parseFloat(document.getElementById('input_commissionRate').value) || 20;
    var payoutDurationMonths = parseFloat(document.getElementById('input_payoutDurationMonths').value) || 12;

    return {
      referredCustomers: referredCustomers,
      monthlySubscriptionPrice: monthlySubscriptionPrice,
      commissionRate: commissionRate / 100,
      payoutDurationMonths: payoutDurationMonths
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

  function calculateAffiliatePayout(inputs) {
    var count = inputs.referredCustomers;
    var price = inputs.monthlySubscriptionPrice;
    var rate = inputs.commissionRate;
    var duration = inputs.payoutDurationMonths;

    if (count <= 0 || price <= 0) {
      return { error: 'Referred customers and price must be greater than zero.' };
    }

    var grossMonthly = count * price;
    var monthlyPayout = grossMonthly * rate;
    var annualPayout = monthlyPayout * duration;
    var netMonthlyRevenue = grossMonthly - monthlyPayout;
    var effectiveCostPercent = (monthlyPayout / grossMonthly) * 100;

    return {
      grossMonthlyRevenue: grossMonthly,
      monthlyPayout: monthlyPayout,
      annualPayout: annualPayout,
      netSaasRevenue: netMonthlyRevenue,
      effectiveCommissionCost: effectiveCostPercent,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateAffiliatePayout(inputs);

    if (result.error) {
      setOutputText('output_grossMonthlyRevenue', '—');
      setOutputText('output_monthlyPayout', '—');
      setOutputText('output_annualPayout', '—');
      setOutputText('output_netSaasRevenue', '—');
      setOutputText('output_effectiveCommissionCost', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_grossMonthlyRevenue', formatCurrency(result.grossMonthlyRevenue));
    setOutputText('output_monthlyPayout', formatCurrency(result.monthlyPayout));
    setOutputText('output_annualPayout', formatCurrency(result.annualPayout));
    setOutputText('output_netSaasRevenue', formatCurrency(result.netSaasRevenue));
    setOutputText('output_effectiveCommissionCost', result.effectiveCommissionCost.toFixed(1) + '%');

    var chartPayload = {
      monthlyPayout: result.monthlyPayout,
      netRevenue: result.netSaasRevenue,
      duration: inputs.payoutDurationMonths
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        referredCustomers: inputs.referredCustomers,
        commissionRate: (inputs.commissionRate * 100).toFixed(0) + '%',
        monthlyPayout: formatCurrency(result.monthlyPayout),
        netSaasRevenue: formatCurrency(result.netSaasRevenue)
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

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'payout') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Affiliate Commission Payout', 'Net Retained SaaS Revenue'],
          datasets: [{
            data: [data.monthlyPayout, data.netRevenue],
            backgroundColor: ['#ef4444', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Monthly Gross Referred Revenue Split ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'projection') {
      var monthLabels = [];
      var cumulativeData = [];
      for (var i = 1; i <= data.duration; i++) {
        monthLabels.push('Month ' + i);
        cumulativeData.push(data.monthlyPayout * i);
      }

      return {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [{
            label: 'Cumulative Commission Payout ($)',
            data: cumulativeData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cumulative Affiliate Commission Payout Over Time', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
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
    else updateTool();
  }

  function resetTool() {
    document.getElementById('input_referredCustomers').value = 150;
    document.getElementById('input_monthlySubscriptionPrice').value = 149;
    document.getElementById('input_commissionRate').value = 20;
    document.getElementById('input_payoutDurationMonths').value = 12;
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

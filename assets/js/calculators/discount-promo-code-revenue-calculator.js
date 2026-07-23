(function() {
  var chartInstance = null;
  var currentTab = 'monthlyRevenue';
  var lastChartData = null;

  function getInputs() {
    return {
      baselinePrice: parseFloat(document.getElementById('input_baselinePrice').value) || 0,
      promoDiscountPercent: (parseFloat(document.getElementById('input_promoDiscountPercent').value) || 0) / 100,
      discountDurationMonths: parseFloat(document.getElementById('input_discountDurationMonths').value) || 0,
      expectedPromoSignups: parseFloat(document.getElementById('input_expectedPromoSignups').value) || 0,
      postDiscountRetentionRate: (parseFloat(document.getElementById('input_postDiscountRetentionRate').value) || 0) / 100,
      cogsPerCustomerMonthly: parseFloat(document.getElementById('input_cogsPerCustomerMonthly').value) || 0
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

  function formatPercent(val) {
    return (val * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculatePromo(inputs) {
    var discountedPrice = inputs.baselinePrice * (1 - inputs.promoDiscountPercent);
    var promoMonths = Math.min(12, inputs.discountDurationMonths);
    var fullRateMonths = Math.max(0, 12 - promoMonths);

    var totalPromoRevenue = inputs.expectedPromoSignups * discountedPrice * promoMonths;

    var retainedSignups = inputs.expectedPromoSignups * inputs.postDiscountRetentionRate;
    var postDiscountMRR = retainedSignups * inputs.baselinePrice;

    var postPromoRevenue = retainedSignups * inputs.baselinePrice * fullRateMonths;
    var totalCampaignARR = totalPromoRevenue + postPromoRevenue;

    var totalCOGS1Year = (inputs.expectedPromoSignups * inputs.cogsPerCustomerMonthly * promoMonths) +
                         (retainedSignups * inputs.cogsPerCustomerMonthly * fullRateMonths);
    var campaignGrossProfit = totalCampaignARR - totalCOGS1Year;
    var campaignGrossMargin = totalCampaignARR > 0 ? campaignGrossProfit / totalCampaignARR : 0;

    // Monthly Schedule
    var monthLabels = [];
    var monthlyRevenueArray = [];
    for (var m = 1; m <= 12; m++) {
      monthLabels.push('M' + m);
      if (m <= promoMonths) {
        monthlyRevenueArray.push(inputs.expectedPromoSignups * discountedPrice);
      } else {
        monthlyRevenueArray.push(retainedSignups * inputs.baselinePrice);
      }
    }

    return {
      discountedPrice: discountedPrice,
      totalPromoRevenue: totalPromoRevenue,
      postDiscountMRR: postDiscountMRR,
      totalCampaignARR: totalCampaignARR,
      campaignGrossMargin: campaignGrossMargin,
      totalCOGS1Year: totalCOGS1Year,
      campaignGrossProfit: campaignGrossProfit,
      monthLabels: monthLabels,
      monthlyRevenueArray: monthlyRevenueArray
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculatePromo(inputs);

    setOutputText('output_discountedPrice', formatCurrency(res.discountedPrice));
    setOutputText('output_totalPromoRevenue', formatCurrency(res.totalPromoRevenue));
    setOutputText('output_postDiscountMRR', formatCurrency(res.postDiscountMRR));
    setOutputText('output_totalCampaignARR', formatCurrency(res.totalCampaignARR));
    setOutputText('output_campaignGrossMargin', formatPercent(res.campaignGrossMargin));

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

    if (currentTab === 'monthlyRevenue') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.monthLabels,
          datasets: [{
            label: 'Monthly Campaign Revenue ($)',
            data: data.monthlyRevenueArray,
            backgroundColor: '#4A90D9',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: '12-Month Revenue Schedule ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'marginImpact') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Gross Profit', '1-Year COGS'],
          datasets: [{
            data: [Math.max(0, data.campaignGrossProfit), data.totalCOGS1Year],
            backgroundColor: ['#4ade80', '#f87171'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: '1-Year Revenue Breakdown ($)', color: '#e8edf0' }
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
    document.getElementById('input_baselinePrice').value = 100;
    document.getElementById('input_promoDiscountPercent').value = 20;
    document.getElementById('input_discountDurationMonths').value = 6;
    document.getElementById('input_expectedPromoSignups').value = 250;
    document.getElementById('input_postDiscountRetentionRate').value = 70;
    document.getElementById('input_cogsPerCustomerMonthly').value = 15;
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

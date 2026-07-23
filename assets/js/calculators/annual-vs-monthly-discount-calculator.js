(function() {
  var chartInstance = null;
  var currentTab = 'cashflowComparison';
  var lastChartData = null;

  function getInputs() {
    return {
      monthlyPrice: parseFloat(document.getElementById('input_monthlyPrice').value) || 0,
      annualDiscountPercent: (parseFloat(document.getElementById('input_annualDiscountPercent').value) || 0) / 100,
      totalNewCustomers: parseFloat(document.getElementById('input_totalNewCustomers').value) || 0,
      annualPlanTakeRate: (parseFloat(document.getElementById('input_annualPlanTakeRate').value) || 0) / 100,
      monthlyChurnRate: (parseFloat(document.getElementById('input_monthlyChurnRate').value) || 0) / 100
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

  function calculateBilling(inputs) {
    var annualUpfrontPrice = (inputs.monthlyPrice * 12) * (1 - inputs.annualDiscountPercent);

    var annualCustomers = inputs.totalNewCustomers * inputs.annualPlanTakeRate;
    var monthlyCustomers = inputs.totalNewCustomers * (1 - inputs.annualPlanTakeRate);

    var month1UpfrontCash = annualCustomers * annualUpfrontPrice;
    var month1MonthlyCash = monthlyCustomers * inputs.monthlyPrice;
    var month1TotalCash = month1UpfrontCash + month1MonthlyCash;

    var monthlyCashTimeline = [];
    var cumulativeCashTimeline = [];

    var currentMonthlySubscribers = monthlyCustomers;
    var runningCashSum = month1UpfrontCash;

    var monthLabels = [];

    for (var m = 1; m <= 12; m++) {
      monthLabels.push('M' + m);
      var mCash = (m === 1 ? month1UpfrontCash : 0) + (currentMonthlySubscribers * inputs.monthlyPrice);
      monthlyCashTimeline.push(mCash);
      runningCashSum += (currentMonthlySubscribers * inputs.monthlyPrice);
      cumulativeCashTimeline.push(runningCashSum);

      currentMonthlySubscribers = currentMonthlySubscribers * (1 - inputs.monthlyChurnRate);
    }

    var totalYear1Cash = cumulativeCashTimeline[11];
    var fullPriceNoDiscountYear = (inputs.totalNewCustomers * inputs.monthlyPrice * 12);
    var discountCostAnnual = (annualCustomers * inputs.monthlyPrice * 12) - (annualCustomers * annualUpfrontPrice);

    var blendedMonthlyMRR = ((annualCustomers * (annualUpfrontPrice / 12)) + (monthlyCustomers * inputs.monthlyPrice));

    return {
      annualUpfrontPrice: annualUpfrontPrice,
      annualCustomers: annualCustomers,
      monthlyCustomers: monthlyCustomers,
      month1UpfrontCash: month1UpfrontCash,
      blendedMonthlyMRR: blendedMonthlyMRR,
      totalYear1Cash: totalYear1Cash,
      discountCostAnnual: discountCostAnnual,
      monthLabels: monthLabels,
      monthlyCashTimeline: monthlyCashTimeline,
      cumulativeCashTimeline: cumulativeCashTimeline
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateBilling(inputs);

    setOutputText('output_annualUpfrontPrice', formatCurrency(res.annualUpfrontPrice));
    setOutputText('output_month1UpfrontCash', formatCurrency(res.month1UpfrontCash));
    setOutputText('output_blendedMonthlyMRR', formatCurrency(res.blendedMonthlyMRR));
    setOutputText('output_totalYear1Cash', formatCurrency(res.totalYear1Cash));
    setOutputText('output_discountCostAnnual', formatCurrency(res.discountCostAnnual));

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

    if (currentTab === 'cashflowComparison') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [{
            label: 'Cumulative Cash Inflow ($)',
            data: data.cumulativeCashTimeline,
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
            title: { display: true, text: 'Cumulative 12-Month Cash Flow ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'customerSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Annual Plan (Upfront)', 'Monthly Plan'],
          datasets: [{
            data: [data.annualCustomers, data.monthlyCustomers],
            backgroundColor: ['#4ade80', '#4A90D9'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: 'Customer Billing Preference Split', color: '#e8edf0' }
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
    document.getElementById('input_monthlyPrice').value = 100;
    document.getElementById('input_annualDiscountPercent').value = 20;
    document.getElementById('input_totalNewCustomers').value = 500;
    document.getElementById('input_annualPlanTakeRate').value = 40;
    document.getElementById('input_monthlyChurnRate').value = 4.0;
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

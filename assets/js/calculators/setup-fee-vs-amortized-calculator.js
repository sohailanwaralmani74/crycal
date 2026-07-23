(function() {
  var chartInstance = null;
  var currentTab = 'cashFlowTimeline';
  var lastChartData = null;

  function getInputs() {
    return {
      annualSubscriptionFee: parseFloat(document.getElementById('input_annualSubscriptionFee').value) || 0,
      upfrontSetupFee: parseFloat(document.getElementById('input_upfrontSetupFee').value) || 0,
      contractTermMonths: parseFloat(document.getElementById('input_contractTermMonths').value) || 12,
      amortizedMonthlyMarkup: (parseFloat(document.getElementById('input_amortizedMonthlyMarkup').value) || 0) / 100,
      customerCapExPreference: document.getElementById('input_customerCapExPreference').value || 'Upfront Setup Fee'
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

  function calculateSetup(inputs) {
    var monthlySub = inputs.annualSubscriptionFee / inputs.contractTermMonths;

    var day1UpfrontCash = inputs.annualSubscriptionFee + inputs.upfrontSetupFee;
    var totalUpfrontContractValue = inputs.annualSubscriptionFee + inputs.upfrontSetupFee;

    var totalSetupWithMarkup = inputs.upfrontSetupFee * (1 + inputs.amortizedMonthlyMarkup);
    var amortizedMonthlyFee = inputs.contractTermMonths > 0 ? totalSetupWithMarkup / inputs.contractTermMonths : 0;
    var totalAmortizedContractValue = inputs.annualSubscriptionFee + totalSetupWithMarkup;

    var day1AmortizedCash = inputs.annualSubscriptionFee + amortizedMonthlyFee;
    var day1CashCollected = inputs.customerCapExPreference === 'Amortized Monthly Fee' ? day1AmortizedCash : day1UpfrontCash;

    var contractDelta = totalAmortizedContractValue - totalUpfrontContractValue;

    // Timeline over contract months
    var monthLabels = [];
    var upfrontCumulative = [];
    var amortizedCumulative = [];

    var upfrontSum = day1UpfrontCash;
    var amortizedSum = inputs.annualSubscriptionFee + amortizedMonthlyFee;

    for (var m = 1; m <= inputs.contractTermMonths; m++) {
      monthLabels.push('M' + m);
      if (m === 1) {
        upfrontCumulative.push(day1UpfrontCash);
        amortizedCumulative.push(day1AmortizedCash);
      } else {
        upfrontSum += 0; // Annual subscription was paid upfront
        amortizedSum += amortizedMonthlyFee;
        upfrontCumulative.push(upfrontSum);
        amortizedCumulative.push(amortizedSum);
      }
    }

    return {
      day1CashCollected: day1CashCollected,
      amortizedMonthlyFee: amortizedMonthlyFee,
      totalAmortizedContractValue: totalAmortizedContractValue,
      totalUpfrontContractValue: totalUpfrontContractValue,
      contractDelta: contractDelta,
      monthLabels: monthLabels,
      upfrontCumulative: upfrontCumulative,
      amortizedCumulative: amortizedCumulative
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateSetup(inputs);

    setOutputText('output_day1CashCollected', formatCurrency(res.day1CashCollected));
    setOutputText('output_amortizedMonthlyFee', formatCurrency(res.amortizedMonthlyFee));
    setOutputText('output_totalAmortizedContractValue', formatCurrency(res.totalAmortizedContractValue));
    setOutputText('output_totalUpfrontContractValue', formatCurrency(res.totalUpfrontContractValue));
    setOutputText('output_contractDelta', (res.contractDelta >= 0 ? '+' : '') + formatCurrency(res.contractDelta));

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

    if (currentTab === 'cashFlowTimeline') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [
            {
              label: 'Upfront Setup Model ($)',
              data: data.upfrontCumulative,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.1)',
              fill: true,
              tension: 0.1
            },
            {
              label: 'Amortized Monthly Model ($)',
              data: data.amortizedCumulative,
              borderColor: '#4ade80',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              fill: true,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: 'Cumulative Contract Cash Inflow ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'totalContractComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Upfront Model TCV', 'Amortized Model TCV'],
          datasets: [{
            label: 'Total Contract Value ($)',
            data: [data.totalUpfrontContractValue, data.totalAmortizedContractValue],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Contract Value (TCV) Comparison ($)', color: '#e8edf0' }
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
    document.getElementById('input_annualSubscriptionFee').value = 12000;
    document.getElementById('input_upfrontSetupFee').value = 3000;
    document.getElementById('input_contractTermMonths').value = 12;
    document.getElementById('input_amortizedMonthlyMarkup').value = 10;
    document.getElementById('input_customerCapExPreference').value = 'Upfront Setup Fee';
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

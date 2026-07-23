(function() {
  var chartInstance = null;
  var currentTab = 'revenueSplit';
  var lastChartData = null;

  function getInputs() {
    return {
      smbMonthlyACV: parseFloat(document.getElementById('input_smbMonthlyACV').value) || 0,
      smbDealsPerYear: parseFloat(document.getElementById('input_smbDealsPerYear').value) || 0,
      smbSalesCycleDays: parseFloat(document.getElementById('input_smbSalesCycleDays').value) || 0,
      enterpriseACV: parseFloat(document.getElementById('input_enterpriseACV').value) || 0,
      enterpriseDealsPerYear: parseFloat(document.getElementById('input_enterpriseDealsPerYear').value) || 0,
      enterpriseSalesCycleDays: parseFloat(document.getElementById('input_enterpriseSalesCycleDays').value) || 0
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

  function calculateSegment(inputs) {
    var smbAnnualARR = inputs.smbMonthlyACV * inputs.smbDealsPerYear;
    var enterpriseAnnualARR = inputs.enterpriseACV * inputs.enterpriseDealsPerYear;
    var totalCombinedARR = smbAnnualARR + enterpriseAnnualARR;

    var smbRevenuePercent = totalCombinedARR > 0 ? smbAnnualARR / totalCombinedARR : 0;
    var enterpriseRevenuePercent = totalCombinedARR > 0 ? enterpriseAnnualARR / totalCombinedARR : 0;

    var dealEquivalent = inputs.smbMonthlyACV > 0 ? inputs.enterpriseACV / inputs.smbMonthlyACV : 0;

    return {
      smbAnnualARR: smbAnnualARR,
      enterpriseAnnualARR: enterpriseAnnualARR,
      totalCombinedARR: totalCombinedARR,
      smbRevenuePercent: smbRevenuePercent,
      enterpriseRevenuePercent: enterpriseRevenuePercent,
      dealEquivalent: dealEquivalent
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateSegment(inputs);

    setOutputText('output_smbAnnualARR', formatCurrency(res.smbAnnualARR));
    setOutputText('output_enterpriseAnnualARR', formatCurrency(res.enterpriseAnnualARR));
    setOutputText('output_totalCombinedARR', formatCurrency(res.totalCombinedARR));
    setOutputText('output_smbRevenuePercent', formatPercent(res.smbRevenuePercent));
    setOutputText('output_enterpriseRevenuePercent', formatPercent(res.enterpriseRevenuePercent));
    setOutputText('output_dealEquivalent', res.dealEquivalent.toFixed(1) + ' SMB Deals');

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

    if (currentTab === 'revenueSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['SMB ARR', 'Enterprise ARR'],
          datasets: [{
            data: [data.smbAnnualARR, data.enterpriseAnnualARR],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: 'Total ARR Segment Split ($)', color: '#e8edf0' }
          }
        }
      });
    } else if (currentTab === 'dealVolumeVsACV') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['SMB Segment', 'Enterprise Segment'],
          datasets: [{
            label: 'Total Segment ARR ($)',
            data: [data.smbAnnualARR, data.enterpriseAnnualARR],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Segment ARR Comparison ($)', color: '#e8edf0' }
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
    document.getElementById('input_smbMonthlyACV').value = 1200;
    document.getElementById('input_smbDealsPerYear').value = 120;
    document.getElementById('input_smbSalesCycleDays').value = 14;
    document.getElementById('input_enterpriseACV').value = 36000;
    document.getElementById('input_enterpriseDealsPerYear').value = 10;
    document.getElementById('input_enterpriseSalesCycleDays').value = 120;
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

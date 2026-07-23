(function() {
  var chartInstance = null;
  var currentTab = 'tierBreakdown';
  var lastChartData = null;

  function getInputs() {
    return {
      totalCustomers: parseFloat(document.getElementById('input_totalCustomers').value) || 0,
      starterPrice: parseFloat(document.getElementById('input_starterPrice').value) || 0,
      starterMixPercent: parseFloat(document.getElementById('input_starterMixPercent').value) || 0,
      proPrice: parseFloat(document.getElementById('input_proPrice').value) || 0,
      proMixPercent: parseFloat(document.getElementById('input_proMixPercent').value) || 0,
      enterprisePrice: parseFloat(document.getElementById('input_enterprisePrice').value) || 0,
      enterpriseMixPercent: parseFloat(document.getElementById('input_enterpriseMixPercent').value) || 0
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

  function calculateTiered(inputs) {
    var sumMix = inputs.starterMixPercent + inputs.proMixPercent + inputs.enterpriseMixPercent;
    var normStarter = sumMix > 0 ? inputs.starterMixPercent / sumMix : 0;
    var normPro = sumMix > 0 ? inputs.proMixPercent / sumMix : 0;
    var normEnterprise = sumMix > 0 ? inputs.enterpriseMixPercent / sumMix : 0;

    var starterCount = inputs.totalCustomers * normStarter;
    var proCount = inputs.totalCustomers * normPro;
    var enterpriseCount = inputs.totalCustomers * normEnterprise;

    var starterMRR = starterCount * inputs.starterPrice;
    var proMRR = proCount * inputs.proPrice;
    var enterpriseMRR = enterpriseCount * inputs.enterprisePrice;

    var totalMRR = starterMRR + proMRR + enterpriseMRR;
    var totalARR = totalMRR * 12;

    var blendedARPU = inputs.totalCustomers > 0 ? totalMRR / inputs.totalCustomers : 0;

    return {
      starterCount: starterCount,
      proCount: proCount,
      enterpriseCount: enterpriseCount,
      starterMRR: starterMRR,
      proMRR: proMRR,
      enterpriseMRR: enterpriseMRR,
      totalMRR: totalMRR,
      totalARR: totalARR,
      blendedARPU: blendedARPU
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateTiered(inputs);

    setOutputText('output_starterMRR', formatCurrency(res.starterMRR));
    setOutputText('output_proMRR', formatCurrency(res.proMRR));
    setOutputText('output_enterpriseMRR', formatCurrency(res.enterpriseMRR));
    setOutputText('output_totalMRR', formatCurrency(res.totalMRR));
    setOutputText('output_totalARR', formatCurrency(res.totalARR));
    setOutputText('output_blendedARPU', formatCurrency(res.blendedARPU));

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

    if (currentTab === 'tierBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Starter MRR', 'Pro MRR', 'Enterprise MRR'],
          datasets: [{
            data: [data.starterMRR, data.proMRR, data.enterpriseMRR],
            backgroundColor: ['#fbbf24', '#4A90D9', '#4ade80'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: 'MRR Contribution by Tier ($)', color: '#e8edf0' }
          }
        }
      });
    } else if (currentTab === 'customerDistribution') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Starter', 'Pro', 'Enterprise'],
          datasets: [{
            label: 'Customer Accounts',
            data: [data.starterCount, data.proCount, data.enterpriseCount],
            backgroundColor: ['#fbbf24', '#4A90D9', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Customer Distribution Count', color: '#e8edf0' }
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
    document.getElementById('input_totalCustomers').value = 1000;
    document.getElementById('input_starterPrice').value = 29;
    document.getElementById('input_starterMixPercent').value = 50;
    document.getElementById('input_proPrice').value = 99;
    document.getElementById('input_proMixPercent').value = 35;
    document.getElementById('input_enterprisePrice').value = 499;
    document.getElementById('input_enterpriseMixPercent').value = 15;
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

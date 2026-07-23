(function() {

  var chartInstance = null;
  var currentTab = 'arpaComposition';
  var lastChartData = null;

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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function updateTool() {

    var mrr = parseFloat(document.getElementById('input_mrr').value) || 0;
    var accounts = parseFloat(document.getElementById('input_accounts').value) || 1;
    var seatsPerAccount = parseFloat(document.getElementById('input_seatsPerAccount').value) || 1;

    var arpa = mrr / accounts;
    var annualArpa = arpa * 12;
    var arpuPerSeat = arpa / seatsPerAccount;

    var tierClassification = '';
    var status = '';
    var recommendation = '';

    if (arpa >= 2500) {
      tierClassification = 'Enterprise Tier';
      status = '✅ Enterprise Grade ARPA (>= $2,500/mo)';
      recommendation = 'High account contract value. Invest in dedicated Customer Success Managers to protect net retention.';
    } else if (arpa >= 600) {
      status = '✅ Mid-Market ARPA ($600 - $2,499/mo)';
      tierClassification = 'Mid-Market Tier';
      recommendation = 'Strong account revenue density. Focus on seat expansion and cross-selling feature add-ons.';
    } else if (arpa >= 150) {
      status = '🟡 SMB Tier ARPA ($150 - $599/mo)';
      tierClassification = 'SMB Tier';
      recommendation = 'Healthy SMB tier. Maintain lean inside sales processes and automated trial onboarding.';
    } else {
      status = '🔴 Low Account ARPA (< $150/mo)';
      tierClassification = 'Micro-SMB Tier';
      recommendation = 'Account value is low. Shift toward self-serve product-led growth (PLG) to reduce sales friction.';
    }

    setOutputText('output_arpa', formatCurrency(arpa) + ' / mo');
    setOutputText('output_annualArpa', formatCurrency(annualArpa) + ' / yr');
    setOutputText('output_arpuPerSeat', formatCurrency(arpuPerSeat) + ' / seat');
    setOutputText('output_tierClassification', tierClassification);
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      arpa: arpa,
      annualArpa: annualArpa,
      arpuPerSeat: arpuPerSeat
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        mrr: mrr,
        accounts: accounts,
        arpa: formatCurrency(arpa),
        status: status
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
    if (tab === 'arpaComposition') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly ARPA', 'Annual Account Value'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.arpa, data.annualArpa],
            backgroundColor: ['#60A5FA', '#34D399']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'tierComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Your ARPA', 'SMB Benchmark ($300)', 'Enterprise Benchmark ($3000)'],
          datasets: [{
            label: 'Monthly ARPA ($)',
            data: [data.arpa, 300, 3000],
            backgroundColor: ['#60A5FA', '#F59E0B', '#34D399']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    return null;

  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {

    document.getElementById('input_mrr').value = 120000;
    document.getElementById('input_accounts').value = 200;
    document.getElementById('input_seatsPerAccount').value = 15;
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

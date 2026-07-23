(function() {
  var chartInstance = null;
  var currentTab = 'vestingSchedule';
  var lastChartData = null;

  function getInputs() {
    var totalShares = parseFloat(document.getElementById('input_totalGrantShares').value) || 0;
    var valuation = parseFloat(document.getElementById('input_companyValuation').value) || 0;
    var totalCompanyShares = parseFloat(document.getElementById('input_totalCompanyShares').value) || 1;
    var vestingYears = parseFloat(document.getElementById('input_vestingTermYears').value) || 4;
    var cliffMonths = parseFloat(document.getElementById('input_cliffMonths').value) || 12;
    var monthsElapsed = parseFloat(document.getElementById('input_monthsElapsed').value) || 0;

    return {
      totalShares: totalShares,
      valuation: valuation,
      totalCompanyShares: totalCompanyShares,
      vestingYears: vestingYears,
      cliffMonths: cliffMonths,
      monthsElapsed: monthsElapsed
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

  function calculateVesting(inputs) {
    var totalS = inputs.totalShares;
    var val = inputs.valuation;
    var totalCoS = inputs.totalCompanyShares;
    var totalMonths = inputs.vestingYears * 12;
    var cliff = inputs.cliffMonths;
    var elapsed = inputs.monthsElapsed;

    var pricePerShare = totalCoS > 0 ? val / totalCoS : 0;

    var vestedS = 0;
    if (elapsed >= cliff) {
      vestedS = Math.min(totalS, totalS * (elapsed / totalMonths));
    }

    var unvestedS = Math.max(0, totalS - vestedS);
    var vestedVal = vestedS * pricePerShare;
    var unvestedVal = unvestedS * pricePerShare;
    var vestedPct = totalS > 0 ? (vestedS / totalS) * 100 : 0;

    var scheduleData = [];
    for (var m = 0; m <= totalMonths; m += 3) {
      var v = 0;
      if (m >= cliff) {
        v = Math.min(totalS, totalS * (m / totalMonths));
      }
      scheduleData.push({ month: m, vestedShares: v });
    }

    return {
      vestedShares: vestedS,
      unvestedShares: unvestedS,
      vestedValue: vestedVal,
      unvestedValue: unvestedVal,
      vestedPercentage: vestedPct,
      scheduleData: scheduleData,
      totalShares: totalS
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.totalShares <= 0) {
      setOutputText('output_vestedShares', '—');
      setOutputText('output_unvestedShares', '—');
      setOutputText('output_vestedValue', '—');
      setOutputText('output_unvestedValue', '—');
      setOutputText('output_vestedPercentage', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateVesting(inputs);

    setOutputText('output_vestedShares', Math.round(res.vestedShares).toLocaleString() + ' shares');
    setOutputText('output_unvestedShares', Math.round(res.unvestedShares).toLocaleString() + ' shares');
    setOutputText('output_vestedValue', formatCurrency(res.vestedValue));
    setOutputText('output_unvestedValue', formatCurrency(res.unvestedValue));
    setOutputText('output_vestedPercentage', res.vestedPercentage.toFixed(1) + '%');

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalGrantShares: inputs.totalShares,
        monthsElapsed: inputs.monthsElapsed,
        vestedShares: Math.round(res.vestedShares),
        vestedValue: formatCurrency(res.vestedValue),
        vestedPercentage: res.vestedPercentage.toFixed(1) + '%'
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
    if (!data) return null;

    if (tab === 'vestingSchedule') {
      var labels = data.scheduleData.map(function(d) { return 'Mo ' + d.month; });
      var values = data.scheduleData.map(function(d) { return d.vestedShares; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cumulative Vested Shares',
            data: values,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            stepped: false,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Vesting Schedule Timeline (Shares)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return (v / 1e3).toFixed(0) + 'k'; } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'equityStatus') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Vested Shares', 'Unvested Shares'],
          datasets: [{
            data: [data.vestedShares, data.unvestedShares],
            backgroundColor: ['#10b981', '#64748b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Vested vs Unvested Equity', color: '#e8edf0' }
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
    document.getElementById('input_totalGrantShares').value = 100000;
    document.getElementById('input_companyValuation').value = 10000000;
    document.getElementById('input_totalCompanyShares').value = 10000000;
    document.getElementById('input_vestingTermYears').value = 4;
    document.getElementById('input_cliffMonths').value = 12;
    document.getElementById('input_monthsElapsed').value = 18;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

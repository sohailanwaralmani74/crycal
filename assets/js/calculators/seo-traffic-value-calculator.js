(function() {
  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  function getInputs() {
    var monthlyOrganicVisits = parseFloat(document.getElementById('input_monthlyOrganicVisits').value) || 0;
    var avgPpcCpc = parseFloat(document.getElementById('input_avgPpcCpc').value) || 0;
    var monthlySeoCost = parseFloat(document.getElementById('input_monthlySeoCost').value) || 0;

    return {
      monthlyOrganicVisits: monthlyOrganicVisits,
      avgPpcCpc: avgPpcCpc,
      monthlySeoCost: monthlySeoCost
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

  function calculateSeoValue(inputs) {
    var visits = inputs.monthlyOrganicVisits;
    var cpc = inputs.avgPpcCpc;
    var seoCost = inputs.monthlySeoCost;

    if (visits <= 0 || cpc <= 0) {
      return { error: 'Visits and CPC must be greater than zero.' };
    }

    var monthlyValue = visits * cpc;
    var annualValue = monthlyValue * 12;
    var netSavings = monthlyValue - seoCost;
    var seoRoi = seoCost > 0 ? ((monthlyValue - seoCost) / seoCost) * 100 : 0;

    return {
      monthlyTrafficValue: monthlyValue,
      annualTrafficValue: annualValue,
      netMonthlySavings: netSavings,
      seoRoi: seoRoi,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateSeoValue(inputs);

    if (result.error) {
      setOutputText('output_monthlyTrafficValue', '—');
      setOutputText('output_annualTrafficValue', '—');
      setOutputText('output_netMonthlySavings', '—');
      setOutputText('output_seoRoi', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_monthlyTrafficValue', formatCurrency(result.monthlyTrafficValue));
    setOutputText('output_annualTrafficValue', formatCurrency(result.annualTrafficValue));
    setOutputText('output_netMonthlySavings', formatCurrency(result.netMonthlySavings));
    setOutputText('output_seoRoi', result.seoRoi.toFixed(0) + '%');

    var chartPayload = {
      seoCost: inputs.monthlySeoCost,
      monthlyValue: result.monthlyTrafficValue,
      netSavings: result.netMonthlySavings,
      annualValue: result.annualTrafficValue
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthlyOrganicVisits: inputs.monthlyOrganicVisits.toLocaleString(),
        avgPpcCpc: '$' + inputs.avgPpcCpc.toFixed(2),
        monthlyTrafficValue: formatCurrency(result.monthlyTrafficValue),
        seoRoi: result.seoRoi.toFixed(0) + '%'
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly SEO Cost', 'Equivalent PPC Value', 'Net Monthly Savings'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.seoCost, data.monthlyValue, data.netSavings],
            backgroundColor: ['#ef4444', '#3b82f6', data.netSavings >= 0 ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly SEO Investment vs Equivalent PPC Value ($)', color: '#e8edf0' }
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

    if (tab === 'value') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly Traffic Value', 'Annual Traffic Value'],
          datasets: [{
            label: 'Valuation ($)',
            data: [data.monthlyValue, data.annualValue],
            backgroundColor: ['#06b6d4', '#6366f1'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Organic Search Traffic Valuation', color: '#e8edf0' }
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
    document.getElementById('input_monthlyOrganicVisits').value = 35000;
    document.getElementById('input_avgPpcCpc').value = 4.50;
    document.getElementById('input_monthlySeoCost').value = 6000;
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

(function() {
  var chartInstance = null;
  var currentTab = 'conversion';
  var lastChartData = null;

  function getInputs() {
    var totalTrialSignups = parseFloat(document.getElementById('input_totalTrialSignups').value) || 0;
    var paidConversions = parseFloat(document.getElementById('input_paidConversions').value) || 0;
    var avgArpu = parseFloat(document.getElementById('input_avgArpu').value) || 0;
    var creditCardRequired = document.getElementById('input_creditCardRequired').value || 'no';

    return {
      totalTrialSignups: totalTrialSignups,
      paidConversions: paidConversions,
      avgArpu: avgArpu,
      creditCardRequired: creditCardRequired
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateTrialConversion(inputs) {
    var signups = inputs.totalTrialSignups;
    var conversions = inputs.paidConversions;
    var arpu = inputs.avgArpu;

    if (signups <= 0) {
      return { error: 'Total signups must be greater than zero.' };
    }

    var conversionRate = (conversions / signups) * 100;
    var newMrr = conversions * arpu;
    var newArr = newMrr * 12;
    var revenuePerTrial = newMrr / signups;

    var isCard = inputs.creditCardRequired === 'yes';
    var status = '';
    if (isCard) {
      if (conversionRate >= 50) status = 'Exceptional (Above 50%)';
      else if (conversionRate >= 30) status = 'Healthy Opt-Out Benchmark (30%-50%)';
      else status = 'Below Opt-Out Benchmark (<30%)';
    } else {
      if (conversionRate >= 10) status = 'Exceptional (Above 10%)';
      else if (conversionRate >= 5) status = 'Healthy Opt-In Benchmark (5%-10%)';
      else status = 'Below Opt-In Benchmark (<5%)';
    }

    return {
      conversionRate: conversionRate,
      newMrr: newMrr,
      newArr: newArr,
      revenuePerTrial: revenuePerTrial,
      benchmarkStatus: status,
      nonConverted: signups - conversions,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateTrialConversion(inputs);

    if (result.error) {
      setOutputText('output_conversionRate', '—');
      setOutputText('output_newMrr', '—');
      setOutputText('output_newArr', '—');
      setOutputText('output_revenuePerTrial', '—');
      setOutputText('output_benchmarkStatus', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_conversionRate', result.conversionRate.toFixed(1) + '%');
    setOutputText('output_newMrr', formatCurrency(result.newMrr));
    setOutputText('output_newArr', formatCurrency(result.newArr));
    setOutputText('output_revenuePerTrial', formatCurrency(result.revenuePerTrial));
    setOutputText('output_benchmarkStatus', result.benchmarkStatus);

    var chartPayload = {
      conversions: inputs.paidConversions,
      nonConverted: result.nonConverted,
      newMrr: result.newMrr,
      newArr: result.newArr
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalTrialSignups: inputs.totalTrialSignups,
        paidConversions: inputs.paidConversions,
        conversionRate: result.conversionRate.toFixed(1) + '%',
        newMrr: formatCurrency(result.newMrr)
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

    if (tab === 'conversion') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Converted Paid Users', 'Unconverted Trial Users'],
          datasets: [{
            data: [data.conversions, data.nonConverted],
            backgroundColor: ['#10b981', '#64748b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Trial Cohort Conversion Split', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'revenue') {
      return {
        type: 'bar',
        data: {
          labels: ['New Monthly Recurring Revenue (MRR)', 'New Annual Recurring Revenue (ARR)'],
          datasets: [{
            label: 'Revenue ($)',
            data: [data.newMrr, data.newArr],
            backgroundColor: ['#3b82f6', '#6366f1'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'New Subscription Revenue Created ($)', color: '#e8edf0' }
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
    document.getElementById('input_totalTrialSignups').value = 500;
    document.getElementById('input_paidConversions').value = 45;
    document.getElementById('input_avgArpu').value = 99;
    document.getElementById('input_creditCardRequired').value = 'no';
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

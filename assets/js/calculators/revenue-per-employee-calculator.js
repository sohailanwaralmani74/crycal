(function() {
  var chartInstance = null;
  var currentTab = 'rpe';
  var lastChartData = null;

  function getInputs() {
    var annualRecurringRevenue = parseFloat(document.getElementById('input_annualRecurringRevenue').value) || 0;
    var fullTimeEmployees = parseFloat(document.getElementById('input_fullTimeEmployees').value) || 1;
    var targetBenchmark = parseFloat(document.getElementById('input_targetBenchmark').value) || 200000;

    return {
      annualRecurringRevenue: annualRecurringRevenue,
      fullTimeEmployees: fullTimeEmployees,
      targetBenchmark: targetBenchmark
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

  function calculateRpe(inputs) {
    var arr = inputs.annualRecurringRevenue;
    var ftes = inputs.fullTimeEmployees;
    var target = inputs.targetBenchmark;

    if (ftes <= 0) {
      return { error: 'Full-time employees must be greater than zero.' };
    }

    var rpe = arr / ftes;
    var monthlyRpe = rpe / 12;
    var variance = rpe - target;

    var rating = '';
    if (rpe >= 300000) rating = 'Exceptional Productivity (>$300k/FTE)';
    else if (rpe >= 180000) rating = 'Healthy SaaS Benchmark ($180k-$300k/FTE)';
    else if (rpe >= 100000) rating = 'Moderate Productivity ($100k-$180k/FTE)';
    else rating = 'Below Average Productivity (<$100k/FTE)';

    return {
      revenuePerEmployee: rpe,
      monthlyRevenuePerEmployee: monthlyRpe,
      benchmarkDifference: variance,
      productivityRating: rating,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateRpe(inputs);

    if (result.error) {
      setOutputText('output_revenuePerEmployee', '—');
      setOutputText('output_monthlyRevenuePerEmployee', '—');
      setOutputText('output_benchmarkDifference', '—');
      setOutputText('output_productivityRating', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_revenuePerEmployee', formatCurrency(result.revenuePerEmployee));
    setOutputText('output_monthlyRevenuePerEmployee', formatCurrency(result.monthlyRevenuePerEmployee));
    
    var varText = formatCurrency(Math.abs(result.benchmarkDifference)) + (result.benchmarkDifference >= 0 ? ' (Above Target)' : ' (Below Target)');
    setOutputText('output_benchmarkDifference', varText);
    setOutputText('output_productivityRating', result.productivityRating);

    var chartPayload = {
      actualRpe: result.revenuePerEmployee,
      targetBenchmark: inputs.targetBenchmark,
      arr: inputs.annualRecurringRevenue,
      ftes: inputs.fullTimeEmployees
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualRecurringRevenue: formatCurrency(inputs.annualRecurringRevenue),
        fullTimeEmployees: inputs.fullTimeEmployees,
        revenuePerEmployee: formatCurrency(result.revenuePerEmployee),
        benchmarkDifference: varText
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

    if (tab === 'rpe') {
      return {
        type: 'bar',
        data: {
          labels: ['Actual RPE ($)', 'Target Benchmark RPE ($)'],
          datasets: [{
            label: 'RPE ($)',
            data: [data.actualRpe, data.targetBenchmark],
            backgroundColor: [data.actualRpe >= data.targetBenchmark ? '#10b981' : '#f59e0b', '#64748b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Actual Revenue Per Employee vs Benchmark Target ($)', color: '#e8edf0' }
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

    if (tab === 'scale') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Headcount (FTEs)', 'Revenue ($ in Thousands)'],
          datasets: [{
            label: 'Ratio',
            data: [data.ftes, data.arr / 1000],
            backgroundColor: ['#3b82f6', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Headcount vs ARR (in $k)', color: '#e8edf0' }
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
    document.getElementById('input_annualRecurringRevenue').value = 5000000;
    document.getElementById('input_fullTimeEmployees').value = 25;
    document.getElementById('input_targetBenchmark').value = 200000;
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

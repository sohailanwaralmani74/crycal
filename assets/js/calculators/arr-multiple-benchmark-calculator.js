(function() {
  var chartInstance = null;
  var currentTab = 'multipleComparison';
  var lastChartData = null;

  function getInputs() {
    var arr = parseFloat(document.getElementById('input_arr').value) || 0;
    var targetVal = parseFloat(document.getElementById('input_targetValuation').value) || 0;
    var growth = parseFloat(document.getElementById('input_yoyGrowth').value) || 0;
    var nrr = parseFloat(document.getElementById('input_nrr').value) || 0;
    var r40 = parseFloat(document.getElementById('input_ruleOf40').value) || 0;

    return {
      arr: arr,
      targetValuation: targetVal,
      yoyGrowth: growth,
      nrr: nrr,
      ruleOf40: r40
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

  function calculateBenchmark(inputs) {
    var arr = inputs.arr;
    var targetVal = inputs.targetValuation;
    var growth = inputs.yoyGrowth;
    var nrr = inputs.nrr;
    var r40 = inputs.ruleOf40;

    var impliedMultiple = arr > 0 ? targetVal / arr : 0;

    var medianMultiple = 8.5;
    var growthFactor = (growth - 40) * 0.04;
    var nrrFactor = (nrr - 100) * 0.08;
    var r40Factor = (r40 - 40) * 0.05;

    var benchmarkMultiple = Math.max(2.0, medianMultiple + growthFactor + nrrFactor + r40Factor);
    var benchmarkValuation = arr * benchmarkMultiple;

    var deltaPct = benchmarkMultiple > 0 ? ((impliedMultiple - benchmarkMultiple) / benchmarkMultiple) * 100 : 0;
    var deltaText = (deltaPct >= 0 ? '+' : '') + deltaPct.toFixed(1) + '% vs Benchmark';

    var rank = 'Median (50th Percentile)';
    if (impliedMultiple >= 16.0) rank = 'Top 10% (Top Quartile)';
    else if (impliedMultiple >= 12.0) rank = 'Top 25% (75th Percentile)';
    else if (impliedMultiple >= 7.5) rank = 'Median (50th Percentile)';
    else if (impliedMultiple >= 4.5) rank = 'Lower Quartile (25th Percentile)';
    else rank = 'Bottom 10%';

    return {
      impliedMultiple: impliedMultiple,
      medianMultiple: medianMultiple,
      benchmarkMultiple: benchmarkMultiple,
      benchmarkValuation: benchmarkValuation,
      deltaText: deltaText,
      percentileRank: rank,
      p25: 4.5,
      p50: 8.5,
      p75: 12.0,
      p90: 16.0,
      targetValuation: targetVal
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.arr <= 0 || inputs.targetValuation <= 0) {
      setOutputText('output_impliedMultiple', '—');
      setOutputText('output_marketMedianMultiple', '—');
      setOutputText('output_benchmarkValuation', '—');
      setOutputText('output_valuationDelta', '—');
      setOutputText('output_percentileRank', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateBenchmark(inputs);

    setOutputText('output_impliedMultiple', res.impliedMultiple.toFixed(2) + 'x');
    setOutputText('output_marketMedianMultiple', res.benchmarkMultiple.toFixed(2) + 'x');
    setOutputText('output_benchmarkValuation', formatCurrency(res.benchmarkValuation));
    setOutputText('output_valuationDelta', res.deltaText);
    setOutputText('output_percentileRank', res.percentileRank);

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        arr: inputs.arr,
        targetValuation: inputs.targetValuation,
        impliedMultiple: res.impliedMultiple.toFixed(2) + 'x',
        marketMedianMultiple: res.benchmarkMultiple.toFixed(2) + 'x',
        percentileRank: res.percentileRank
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

    if (tab === 'multipleComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['25th Pct', 'Median', 'Your Implied', 'Benchmark Fair', 'Top 10%'],
          datasets: [{
            label: 'ARR Multiple (x)',
            data: [data.p25, data.p50, data.impliedMultiple, data.benchmarkMultiple, data.p90],
            backgroundColor: ['#64748b', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'ARR Multiple vs Market Benchmarks (x)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return v + 'x'; } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'valuationGap') {
      return {
        type: 'bar',
        data: {
          labels: ['Target Valuation', 'Benchmark Fair Valuation'],
          datasets: [{
            label: 'Valuation ($)',
            data: [data.targetValuation, data.benchmarkValuation],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Target Valuation vs Benchmark Valuation', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e6).toFixed(1) + 'M'; } }
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
  }

  function resetTool() {
    document.getElementById('input_arr').value = 5000000;
    document.getElementById('input_targetValuation').value = 45000000;
    document.getElementById('input_yoyGrowth').value = 75.0;
    document.getElementById('input_nrr').value = 115.0;
    document.getElementById('input_ruleOf40').value = 45.0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

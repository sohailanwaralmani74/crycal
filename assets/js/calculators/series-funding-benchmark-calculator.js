(function() {
  var chartInstance = null;
  var currentTab = 'benchmarkRadar';
  var lastChartData = null;

  function getInputs() {
    var arr = parseFloat(document.getElementById('input_currentArr').value) || 0;
    var growth = parseFloat(document.getElementById('input_yoyGrowth').value) || 0;
    var nrr = parseFloat(document.getElementById('input_nrr').value) || 0;
    var roundEl = document.getElementById('input_targetRound');
    var round = roundEl ? roundEl.value : 'Series A';

    return {
      currentArr: arr,
      yoyGrowth: growth,
      nrr: nrr,
      targetRound: round
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

  function calculateSeriesBenchmark(inputs) {
    var arr = inputs.currentArr;
    var growth = inputs.yoyGrowth;
    var nrr = inputs.nrr;
    var round = inputs.targetRound;

    var targetArr = 2000000;
    var targetGrowth = 100;
    var targetNrr = 110;
    var valRange = '$20M – $45M Post';

    if (round === 'Seed') {
      targetArr = 500000;
      targetGrowth = 150;
      targetNrr = 100;
      valRange = '$6M – $12M Post';
    } else if (round === 'Series B') {
      targetArr = 7500000;
      targetGrowth = 75;
      targetNrr = 115;
      valRange = '$60M – $120M Post';
    }

    var arrScore = Math.min(100, (arr / targetArr) * 100);
    var growthScore = Math.min(100, (growth / targetGrowth) * 100);
    var nrrScore = Math.min(100, (nrr / targetNrr) * 100);

    var overallScore = (arrScore * 0.45) + (growthScore * 0.35) + (nrrScore * 0.20);
    overallScore = Math.min(100, Math.max(0, overallScore));

    var status = '🟢 Ready for ' + round;
    if (overallScore < 60) status = '🔴 Early / Metric Gap Exists';
    else if (overallScore < 85) status = '🟡 Near ' + round + ' Benchmark';

    var arrGapVal = targetArr - arr;
    var arrGapText = arrGapVal <= 0 ? '✅ Target Exceeded' : formatCurrency(arrGapVal) + ' short';

    var growthGapVal = targetGrowth - growth;
    var growthGapText = growthGapVal <= 0 ? '✅ Target Exceeded' : growthGapVal.toFixed(0) + '% points short';

    return {
      readinessScore: overallScore.toFixed(0) + '%',
      readinessTier: status,
      arrGapText: arrGapText,
      growthGapText: growthGapText,
      valRange: valRange,
      arrScore: arrScore,
      growthScore: growthScore,
      nrrScore: nrrScore,
      targetArr: targetArr,
      targetGrowth: targetGrowth,
      targetNrr: targetNrr,
      arr: arr,
      growth: growth,
      nrr: nrr
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentArr <= 0) {
      setOutputText('output_readinessScore', '—');
      setOutputText('output_readinessTier', '—');
      setOutputText('output_arrGap', '—');
      setOutputText('output_growthGap', '—');
      setOutputText('output_estimatedValuationRange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateSeriesBenchmark(inputs);

    setOutputText('output_readinessScore', res.readinessScore);
    setOutputText('output_readinessTier', res.readinessTier);
    setOutputText('output_arrGap', res.arrGapText);
    setOutputText('output_growthGap', res.growthGapText);
    setOutputText('output_estimatedValuationRange', res.valRange);

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentArr: inputs.currentArr,
        yoyGrowth: inputs.yoyGrowth + '%',
        targetRound: inputs.targetRound,
        readinessScore: res.readinessScore,
        readinessTier: res.readinessTier
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

    if (tab === 'benchmarkRadar') {
      return {
        type: 'bar',
        data: {
          labels: ['ARR Metric Score', 'Growth Rate Score', 'NRR Retention Score'],
          datasets: [{
            label: 'Benchmark Attainment (%)',
            data: [data.arrScore, data.growthScore, data.nrrScore],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'VC Target Metric Attainment (%)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return v + '%'; } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'stageProgression') {
      return {
        type: 'bar',
        data: {
          labels: ['Seed ($500k)', 'Series A ($2.0M)', 'Series B ($7.5M)'],
          datasets: [
            {
              label: 'VC Target ARR',
              data: [0.5, 2.0, 7.5],
              backgroundColor: '#64748b',
              borderRadius: 6
            },
            {
              label: 'Your Company ARR',
              data: [data.arr / 1e6, data.arr / 1e6, data.arr / 1e6],
              backgroundColor: '#3b82f6',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Company ARR vs Stage Benchmarks ($M)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + v.toFixed(1) + 'M'; } }
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
    document.getElementById('input_currentArr').value = 2500000;
    document.getElementById('input_yoyGrowth').value = 120.0;
    document.getElementById('input_nrr').value = 115.0;
    var r = document.getElementById('input_targetRound');
    if (r) r.value = 'Series A';
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

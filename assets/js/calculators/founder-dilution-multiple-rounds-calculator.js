(function() {
  var chartInstance = null;
  var currentTab = 'ownershipWaterfall';
  var lastChartData = null;

  function getInputs() {
    var initOwn = parseFloat(document.getElementById('input_initialFounderOwnership').value) || 100;
    var seedInv = parseFloat(document.getElementById('input_seedInvestment').value) || 0;
    var seedPre = parseFloat(document.getElementById('input_seedPreMoney').value) || 0;
    var seriesAInv = parseFloat(document.getElementById('input_seriesAInvestment').value) || 0;
    var seriesAPre = parseFloat(document.getElementById('input_seriesAPreMoney').value) || 0;
    var seriesBInv = parseFloat(document.getElementById('input_seriesBInvestment').value) || 0;
    var seriesBPre = parseFloat(document.getElementById('input_seriesBPreMoney').value) || 0;

    return {
      initOwn: initOwn,
      seedInv: seedInv,
      seedPre: seedPre,
      seriesAInv: seriesAInv,
      seriesAPre: seriesAPre,
      seriesBInv: seriesBInv,
      seriesBPre: seriesBPre
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

  function calculateMultiRound(inputs) {
    var f0 = inputs.initOwn;

    // Seed Round
    var seedPost = inputs.seedPre + inputs.seedInv;
    var seedInvPct = seedPost > 0 ? (inputs.seedInv / seedPost) * 100 : 0;
    var fSeed = f0 * (1 - seedInvPct / 100);

    // Series A Round
    var seriesAPost = inputs.seriesAPre + inputs.seriesAInvestment;
    var seriesAInvPct = seriesAPost > 0 ? (inputs.seriesAInvestment / seriesAPost) * 100 : 0;
    var fSeriesA = fSeed * (1 - seriesAInvPct / 100);

    // Series B Round
    var seriesBPost = inputs.seriesBPre + inputs.seriesBInvestment;
    var seriesBInvPct = seriesBPost > 0 ? (inputs.seriesBInvestment / seriesBPost) * 100 : 0;
    var fSeriesB = fSeriesA * (1 - seriesBInvPct / 100);

    var totalDrop = f0 - fSeriesB;
    var fValueB = seriesBPost * (fSeriesB / 100);

    return {
      f0: f0,
      fSeed: fSeed,
      fSeriesA: fSeriesA,
      fSeriesB: fSeriesB,
      totalDrop: totalDrop,
      fValueB: fValueB,
      seedPost: seedPost,
      seriesAPost: seriesAPost,
      seriesBPost: seriesBPost,
      seedInvPct: seedInvPct,
      seriesAInvPct: seriesAInvPct,
      seriesBInvPct: seriesBInvPct
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.seedPre <= 0 || inputs.seriesAPre <= 0 || inputs.seriesBPre <= 0) {
      setOutputText('output_postSeedOwnership', '—');
      setOutputText('output_postSeriesAOwnership', '—');
      setOutputText('output_postSeriesBOwnership', '—');
      setOutputText('output_totalDilution', '—');
      setOutputText('output_founderEquityValue', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateMultiRound(inputs);

    setOutputText('output_postSeedOwnership', res.fSeed.toFixed(2) + '%');
    setOutputText('output_postSeriesAOwnership', res.fSeriesA.toFixed(2) + '%');
    setOutputText('output_postSeriesBOwnership', res.fSeriesB.toFixed(2) + '%');
    setOutputText('output_totalDilution', '-' + res.totalDrop.toFixed(2) + '% points');
    setOutputText('output_founderEquityValue', formatCurrency(res.fValueB));

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        seedPreMoney: inputs.seedPre,
        seriesAPreMoney: inputs.seriesAPre,
        seriesBPreMoney: inputs.seriesBPre,
        postSeriesBOwnership: res.fSeriesB.toFixed(2) + '%',
        founderEquityValue: formatCurrency(res.fValueB)
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

    if (tab === 'ownershipWaterfall') {
      return {
        type: 'bar',
        data: {
          labels: ['Incorporation', 'Post-Seed', 'Post-Series A', 'Post-Series B'],
          datasets: [{
            label: 'Founder Equity (%)',
            data: [data.f0, data.fSeed, data.fSeriesA, data.fSeriesB],
            backgroundColor: ['#64748b', '#3b82f6', '#8b5cf6', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Founder Ownership Retention (%) across Stages', color: '#e8edf0' }
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

    if (tab === 'capTableProgression') {
      var seedInvOwn = data.seedInvPct;
      var seriesAInvOwn = (100 - seedInvOwn) * (data.seriesAInvPct / 100);
      var seriesBInvOwn = (100 - seedInvOwn - seriesAInvOwn) * (data.seriesBInvPct / 100);

      return {
        type: 'bar',
        data: {
          labels: ['Post-Seed', 'Post-Series A', 'Post-Series B'],
          datasets: [
            {
              label: 'Founders',
              data: [data.fSeed, data.fSeriesA, data.fSeriesB],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Seed Investors',
              data: [seedInvOwn, seedInvOwn * (1 - data.seriesAInvPct / 100), seedInvOwn * (1 - data.seriesAInvPct / 100) * (1 - data.seriesBInvPct / 100)],
              backgroundColor: '#8b5cf6'
            },
            {
              label: 'Series A Investors',
              data: [0, seriesAInvOwn, seriesAInvOwn * (1 - data.seriesBInvPct / 100)],
              backgroundColor: '#f59e0b'
            },
            {
              label: 'Series B Investors',
              data: [0, 0, data.seriesBInvPct],
              backgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Cap Table Composition Progression (%)', color: '#e8edf0' }
          },
          scales: {
            x: { stacked: true, ticks: { color: '#8899aa' } },
            y: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return v + '%'; } }
            }
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
    document.getElementById('input_initialFounderOwnership').value = 100.0;
    document.getElementById('input_seedInvestment').value = 1000000;
    document.getElementById('input_seedPreMoney').value = 4000000;
    document.getElementById('input_seriesAInvestment').value = 5000000;
    document.getElementById('input_seriesAPreMoney').value = 20000000;
    document.getElementById('input_seriesBInvestment').value = 15000000;
    document.getElementById('input_seriesBPreMoney').value = 60000000;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

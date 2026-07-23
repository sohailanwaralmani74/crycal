(function() {
  var chartInstance = null;
  var currentTab = 'valuationRange';
  var lastChartData = null;

  function getInputs() {
    var arr = parseFloat(document.getElementById('input_arr').value) || 0;
    var baseMultiple = parseFloat(document.getElementById('input_baseMultiple').value) || 0;
    var growthRate = parseFloat(document.getElementById('input_growthRate').value) || 0;
    var nrr = parseFloat(document.getElementById('input_nrr').value) || 0;
    var grossMargin = parseFloat(document.getElementById('input_grossMargin').value) || 0;

    return {
      arr: arr,
      baseMultiple: baseMultiple,
      growthRate: growthRate,
      nrr: nrr,
      grossMargin: grossMargin
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

  function calculateValuation(inputs) {
    var arr = inputs.arr;
    var baseMultiple = inputs.baseMultiple;
    var growth = inputs.growthRate;
    var nrr = inputs.nrr;
    var gm = inputs.grossMargin;

    var growthAdj = (growth - 50) * 0.05;
    var nrrAdj = (nrr - 100) * 0.10;
    var gmAdj = (gm - 75) * 0.04;

    var totalAdj = growthAdj + nrrAdj + gmAdj;
    var effectiveMultiple = Math.max(1.0, baseMultiple + totalAdj);

    var impliedValuation = arr * effectiveMultiple;
    var lowValuation = arr * Math.max(1.0, effectiveMultiple * 0.8);
    var highValuation = arr * (effectiveMultiple * 1.25);

    return {
      impliedValuation: impliedValuation,
      lowValuation: lowValuation,
      highValuation: highValuation,
      effectiveMultiple: effectiveMultiple,
      baseMultiple: baseMultiple,
      growthAdj: growthAdj,
      nrrAdj: nrrAdj,
      gmAdj: gmAdj,
      totalAdj: totalAdj
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.arr <= 0) {
      setOutputText('output_impliedValuation', '—');
      setOutputText('output_effectiveMultiple', '—');
      setOutputText('output_valuationRange', '—');
      setOutputText('output_growthPremium', '—');
      setOutputText('output_arrOutput', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateValuation(inputs);

    setOutputText('output_impliedValuation', formatCurrency(res.impliedValuation));
    setOutputText('output_effectiveMultiple', res.effectiveMultiple.toFixed(2) + 'x');
    setOutputText('output_valuationRange', formatCurrency(res.lowValuation) + ' – ' + formatCurrency(res.highValuation));
    setOutputText('output_growthPremium', (res.totalAdj >= 0 ? '+' : '') + res.totalAdj.toFixed(2) + 'x');
    setOutputText('output_arrOutput', formatCurrency(inputs.arr));

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        arr: inputs.arr,
        growthRate: inputs.growthRate,
        nrr: inputs.nrr,
        effectiveMultiple: res.effectiveMultiple.toFixed(2) + 'x',
        impliedValuation: res.impliedValuation
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

    if (tab === 'valuationRange') {
      return {
        type: 'bar',
        data: {
          labels: ['Low Valuation', 'Implied Valuation', 'High Valuation'],
          datasets: [{
            label: 'Enterprise Valuation ($)',
            data: [data.lowValuation, data.impliedValuation, data.highValuation],
            backgroundColor: ['#64748b', '#3b82f6', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Valuation Range ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: {
                color: '#8899aa',
                callback: function(v) { return '$' + (v / 1e6).toFixed(1) + 'M'; }
              }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'multipleBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Base', 'Growth Adj', 'NRR Adj', 'Margin Adj', 'Final Multiple'],
          datasets: [{
            label: 'Multiple (x)',
            data: [
              data.baseMultiple,
              data.growthAdj,
              data.nrrAdj,
              data.gmAdj,
              data.effectiveMultiple
            ],
            backgroundColor: ['#475569', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'ARR Multiple Drivers', color: '#e8edf0' }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return v + 'x'; } }
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
    document.getElementById('input_arr').value = 2000000;
    document.getElementById('input_baseMultiple').value = 8.0;
    document.getElementById('input_growthRate').value = 80;
    document.getElementById('input_nrr').value = 115;
    document.getElementById('input_grossMargin').value = 80;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

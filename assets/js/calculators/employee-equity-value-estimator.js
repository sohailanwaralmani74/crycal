(function() {
  var chartInstance = null;
  var currentTab = 'payoutBreakdown';
  var lastChartData = null;

  function getInputs() {
    var numOptions = parseFloat(document.getElementById('input_numOptions').value) || 0;
    var strikePrice = parseFloat(document.getElementById('input_strikePrice').value) || 0;
    var exitPrice = parseFloat(document.getElementById('input_exitSharePrice').value) || 0;
    var taxRate = parseFloat(document.getElementById('input_estimatedTaxRate').value) || 0;

    return {
      numOptions: numOptions,
      strikePrice: strikePrice,
      exitPrice: exitPrice,
      taxRate: taxRate / 100
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

  function calculateEmployeeEquity(inputs) {
    var n = inputs.numOptions;
    var strike = inputs.strikePrice;
    var exitP = inputs.exitPrice;
    var taxR = inputs.taxRate;

    var grossVal = n * exitP;
    var totalCost = n * strike;
    var preTaxProfit = n * Math.max(0, exitP - strike);
    var taxAmt = preTaxProfit * taxR;
    var netTakeHome = preTaxProfit - taxAmt;

    var pricePoints = [5, 10, 15, 20, 25, 30];
    var sensitivity = pricePoints.map(function(p) {
      var profit = n * Math.max(0, p - strike);
      return { price: p, netTakeHome: profit * (1 - taxR) };
    });

    return {
      grossVal: grossVal,
      totalCost: totalCost,
      preTaxProfit: preTaxProfit,
      taxAmt: taxAmt,
      netTakeHome: netTakeHome,
      sensitivity: sensitivity
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.numOptions <= 0 || inputs.exitPrice <= 0) {
      setOutputText('output_grossExitValue', '—');
      setOutputText('output_totalExerciseCost', '—');
      setOutputText('output_preTaxGain', '—');
      setOutputText('output_taxLiability', '—');
      setOutputText('output_netTakeHome', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateEmployeeEquity(inputs);

    setOutputText('output_grossExitValue', formatCurrency(res.grossVal));
    setOutputText('output_totalExerciseCost', formatCurrency(res.totalCost));
    setOutputText('output_preTaxGain', formatCurrency(res.preTaxProfit));
    setOutputText('output_taxLiability', formatCurrency(res.taxAmt));
    setOutputText('output_netTakeHome', formatCurrency(res.netTakeHome));

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        numOptions: inputs.numOptions,
        strikePrice: '$' + inputs.strikePrice.toFixed(2),
        exitSharePrice: '$' + inputs.exitPrice.toFixed(2),
        preTaxGain: formatCurrency(res.preTaxProfit),
        netTakeHome: formatCurrency(res.netTakeHome)
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

    if (tab === 'payoutBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Gross Exit Value ($)'],
          datasets: [
            {
              label: 'Exercise Strike Cost',
              data: [data.totalCost],
              backgroundColor: '#64748b'
            },
            {
              label: 'Estimated Taxes',
              data: [data.taxAmt],
              backgroundColor: '#ef4444'
            },
            {
              label: 'Net Take-Home Cash',
              data: [data.netTakeHome],
              backgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Gross Exit Value Stack Breakdown ($)', color: '#e8edf0' }
          },
          scales: {
            x: { stacked: true, ticks: { color: '#8899aa' } },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(0) + 'k'; } }
            }
          }
        }
      };
    }

    if (tab === 'gainVsSharePrice') {
      var labels = data.sensitivity.map(function(s) { return '$' + s.price; });
      var values = data.sensitivity.map(function(s) { return s.netTakeHome; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Net Take-Home Pay ($)',
            data: values,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Net Take-Home vs Exit Share Price ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + (v / 1e3).toFixed(0) + 'k'; } }
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
    document.getElementById('input_numOptions').value = 25000;
    document.getElementById('input_strikePrice').value = 1.50;
    document.getElementById('input_exitSharePrice').value = 15.00;
    document.getElementById('input_estimatedTaxRate').value = 25.0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

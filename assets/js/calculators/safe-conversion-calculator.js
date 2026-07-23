(function() {
  var chartInstance = null;
  var currentTab = 'priceComparison';
  var lastChartData = null;

  function getInputs() {
    var safeAmount = parseFloat(document.getElementById('input_safeAmount').value) || 0;
    var valuationCap = parseFloat(document.getElementById('input_valuationCap').value) || 0;
    var discountRate = parseFloat(document.getElementById('input_discountRate').value) || 0;
    var seriesAPre = parseFloat(document.getElementById('input_seriesAPreMoney').value) || 0;
    var seriesAPrice = parseFloat(document.getElementById('input_seriesAPricePerShare').value) || 0;

    return {
      safeAmount: safeAmount,
      valuationCap: valuationCap,
      discountRate: discountRate / 100,
      seriesAPre: seriesAPre,
      seriesAPrice: seriesAPrice
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
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

  function calculateSAFE(inputs) {
    var amt = inputs.safeAmount;
    var cap = inputs.valuationCap;
    var disc = inputs.discountRate;
    var pre = inputs.seriesAPre;
    var roundPrice = inputs.seriesAPrice;

    var capPrice = (cap > 0 && pre > 0) ? roundPrice * (cap / pre) : roundPrice;
    var discountPrice = roundPrice * (1 - disc);

    var effPrice = Math.min(capPrice, discountPrice, roundPrice);

    var trigger = 'Series A Round Price';
    if (effPrice === capPrice && capPrice < discountPrice && capPrice < roundPrice) {
      trigger = '🎯 Valuation Cap ($' + (cap / 1e6).toFixed(1) + 'M)';
    } else if (effPrice === discountPrice && discountPrice < capPrice && discountPrice < roundPrice) {
      trigger = '🏷️ Discount Rate (' + (disc * 100).toFixed(0) + '%)';
    } else if (effPrice < roundPrice) {
      trigger = '🎯 Cap & Discount Tied';
    }

    var shares = effPrice > 0 ? amt / effPrice : 0;
    var effValuation = (cap > 0 && capPrice <= discountPrice) ? cap : pre * (1 - disc);
    var safeEquityPct = effValuation > 0 ? (amt / effValuation) * 100 : 0;
    var effectiveDiscPct = roundPrice > 0 ? ((roundPrice - effPrice) / roundPrice) * 100 : 0;

    return {
      effPrice: effPrice,
      capPrice: capPrice,
      discountPrice: discountPrice,
      roundPrice: roundPrice,
      trigger: trigger,
      shares: shares,
      safeEquityPct: safeEquityPct,
      effectiveDiscPct: effectiveDiscPct,
      safeAmount: amt
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.safeAmount <= 0 || inputs.seriesAPrice <= 0) {
      setOutputText('output_effectiveSharePrice', '—');
      setOutputText('output_conversionTrigger', '—');
      setOutputText('output_safeShares', '—');
      setOutputText('output_safeEquityPercent', '—');
      setOutputText('output_effectiveDiscount', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var res = calculateSAFE(inputs);

    setOutputText('output_effectiveSharePrice', formatCurrency(res.effPrice));
    setOutputText('output_conversionTrigger', res.trigger);
    setOutputText('output_safeShares', Math.round(res.shares).toLocaleString() + ' shares');
    setOutputText('output_safeEquityPercent', res.safeEquityPct.toFixed(2) + '%');
    setOutputText('output_effectiveDiscount', res.effectiveDiscPct.toFixed(1) + '%');

    lastChartData = res;
    updateCharts(res);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        safeAmount: inputs.safeAmount,
        valuationCap: inputs.valuationCap,
        discountRate: (inputs.discountRate * 100) + '%',
        effectiveSharePrice: formatCurrency(res.effPrice),
        safeEquityPercent: res.safeEquityPct.toFixed(2) + '%'
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

    if (tab === 'priceComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Series A Round Price', 'Discount Price', 'Valuation Cap Price', 'Effective Price'],
          datasets: [{
            label: 'Share Price ($)',
            data: [data.roundPrice, data.discountPrice, data.capPrice, data.effPrice],
            backgroundColor: ['#64748b', '#8b5cf6', '#3b82f6', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Share Price Comparison ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#8899aa', callback: function(v) { return '$' + v.toFixed(2); } }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'equitySplit') {
      var safePct = Math.min(100, data.safeEquityPct);
      var remainingPct = Math.max(0, 100 - safePct);

      return {
        type: 'doughnut',
        data: {
          labels: ['SAFE Holder Equity', 'Existing Founders & Series A'],
          datasets: [{
            data: [safePct, remainingPct],
            backgroundColor: ['#10b981', '#3b82f6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Implied Cap Table Split (%)', color: '#e8edf0' }
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
    document.getElementById('input_safeAmount').value = 500000;
    document.getElementById('input_valuationCap').value = 5000000;
    document.getElementById('input_discountRate').value = 20.0;
    document.getElementById('input_seriesAPreMoney').value = 12000000;
    document.getElementById('input_seriesAPricePerShare').value = 10.00;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateTool(); }, 150);
  });
})();

(function() {

  var chartInstance = null;
  var currentTab = 'payoff';

  function getInputs() {
    return {
      optionType: document.getElementById('input_optionType').value,
      strikePrice: parseFloat(document.getElementById('input_strikePrice').value) || 0,
      premiumPaid: parseFloat(document.getElementById('input_premiumPaid').value) || 0,
      contractCount: parseFloat(document.getElementById('input_contractCount').value) || 1,
      targetStockPrice: parseFloat(document.getElementById('input_targetStockPrice').value) || 0
    };
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
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

  function calculateResults(inputs) {
    var isCall = inputs.optionType.indexOf('Call') !== -1;
    var strike = inputs.strikePrice;
    var prem = inputs.premiumPaid;
    var contracts = inputs.contractCount;
    var target = inputs.targetStockPrice;

    if (strike <= 0 || prem <= 0) return null;

    var totalShares = contracts * 100;
    var totalCost = prem * totalShares;

    var breakEven = isCall ? (strike + prem) : (strike - prem);

    var intrinsicPerShare = 0;
    if (isCall) {
      intrinsicPerShare = Math.max(0, target - strike);
    } else {
      intrinsicPerShare = Math.max(0, strike - target);
    }

    var totalPayout = intrinsicPerShare * totalShares;
    var netProfit = totalPayout - totalCost;
    var roi = (netProfit / totalCost) * 100;

    // Generate payoff points for chart
    var payoffPoints = [];
    var minPrice = Math.max(0, strike - (prem * 4));
    var maxPrice = strike + (prem * 4);
    var step = (maxPrice - minPrice) / 20;

    for (var p = minPrice; p <= maxPrice; p += step) {
      var intVal = isCall ? Math.max(0, p - strike) : Math.max(0, strike - p);
      var pnl = (intVal - prem) * totalShares;
      payoffPoints.push({ stockPrice: p, profit: pnl });
    }

    return {
      breakEven: breakEven,
      totalCost: totalCost,
      netProfit: netProfit,
      roi: roi,
      payoffPoints: payoffPoints
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_breakEvenPrice', formatCurrencyLocal(result.breakEven));
    setOutputText('output_totalInvestmentCost', formatCurrencyLocal(result.totalCost));
    setOutputText('output_netProfitLoss', formatCurrencyLocal(result.netProfit));
    setOutputText('output_returnOnInvestmentPercent', result.roi.toFixed(1) + '% ROI');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        optionType: inputs.optionType,
        strikePrice: inputs.strikePrice,
        premiumPaid: inputs.premiumPaid,
        targetStockPrice: inputs.targetStockPrice,
        breakEvenPrice: result.breakEven,
        netProfitLoss: result.netProfit
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'payoff') {
      var labels = result.payoffPoints.map(function(d) { return currencySymbol + d.stockPrice.toFixed(1); });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Net Profit / Loss ',
            data: result.payoffPoints.map(function(d) { return d.profit; }),
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Option Expiration Profit / Loss Diagram' }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Option Position Financials'],
          datasets: [
            {
              label: 'Total Premium Capital Risked',
              data: [result.totalCost],
              backgroundColor: '#C08A2E'
            },
            {
              label: 'Net Profit Realized at Target Price',
              data: [Math.max(0, result.netProfit)],
              backgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Risked Premium vs Profit Target' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });

    setTimeout(updateTool, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();

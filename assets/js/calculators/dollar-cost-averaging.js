/* ═══════════════════════════════════════════════════════════
   CRYCAL — Dollar Cost Averaging Calculator
   Tool ID: dollar-cost-averaging
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      initialInvestment: parseFloat(document.getElementById('input_initialInvestment').value) || 0,
      monthlyInvestment: parseFloat(document.getElementById('input_monthlyInvestment').value) || 0,
      investmentPeriod: parseFloat(document.getElementById('input_investmentPeriod').value) || 0,
      averageReturn: parseFloat(document.getElementById('input_averageReturn').value) || 0,
      volatility: parseFloat(document.getElementById('input_volatility').value) || 0,
      dcaVsLumpSum: document.getElementById('input_dcaVsLumpSum').value === 'true'
    };
  }

  // ── Simulate Price Path ──
  function simulatePricePath(months, averageReturn, volatility) {
    var prices = [];
    var monthlyReturn = averageReturn / 100 / 12;
    var monthlyVol = volatility / 100 / Math.sqrt(12);

    // Start at price 100
    var price = 100;
    prices.push(price);

    for (var i = 1; i <= months; i++) {
      var random = (Math.random() * 2 - 1) * monthlyVol;
      var change = monthlyReturn + random;
      price = price * (1 + change);
      if (price < 1) price = 1; // Prevent negative prices
      prices.push(price);
    }

    return prices;
  }

  // ── Calculate DCA Strategy ──
  function calculateDCA(inputs) {
    var months = inputs.investmentPeriod * 12;
    var monthlyInvestment = inputs.monthlyInvestment;
    var averageReturn = inputs.averageReturn;
    var volatility = inputs.volatility;
    var initialLumpSum = inputs.initialInvestment;

    // Simulate price path
    var prices = simulatePricePath(months, averageReturn, volatility);

    // DCA: invest monthly
    var sharesDCA = 0;
    var totalInvestedDCA = 0;
    var monthlyData = [];

    for (var i = 1; i <= months; i++) {
      var price = prices[i];
      var investment = monthlyInvestment;
      var sharesPurchased = investment / price;
      sharesDCA += sharesPurchased;
      totalInvestedDCA += investment;

      monthlyData.push({
        month: i,
        price: price,
        shares: sharesDCA,
        value: sharesDCA * price,
        invested: totalInvestedDCA
      });
    }

    var finalPrice = prices[months];
    var finalValueDCA = sharesDCA * finalPrice;
    var averageCostPerShare = totalInvestedDCA / sharesDCA;

    // Lump Sum Strategy (if comparing)
    var finalValueLumpSum = 0;
    var initialShares = 0;
    if (inputs.dcaVsLumpSum && initialLumpSum > 0) {
      var lumpSumAmount = initialLumpSum + (monthlyInvestment * months);
      initialShares = lumpSumAmount / prices[0];
      finalValueLumpSum = initialShares * finalPrice;
    }

    // Add initial lump sum to DCA if provided
    var totalInvestedDCAWithLump = totalInvestedDCA;
    var sharesDCATotal = sharesDCA;
    var finalValueDCAWithLump = finalValueDCA;

    if (initialLumpSum > 0) {
      var initialSharesLump = initialLumpSum / prices[0];
      sharesDCATotal += initialSharesLump;
      totalInvestedDCAWithLump += initialLumpSum;
      finalValueDCAWithLump = sharesDCATotal * finalPrice;
    }

    var dcaAdvantage = finalValueDCAWithLump - finalValueLumpSum;

    return {
      finalValueDCA: finalValueDCAWithLump,
      totalInvestedDCA: totalInvestedDCAWithLump,
      averageCostPerShare: averageCostPerShare,
      finalValueLumpSum: finalValueLumpSum,
      dcaAdvantage: dcaAdvantage,
      monthlyData: monthlyData,
      finalPrice: finalPrice,
      prices: prices,
      totalSharesDCA: sharesDCATotal
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateDCA(inputs);

    // Update outputs
    document.getElementById('output_finalValueDCA').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalValueDCA);
    document.getElementById('output_totalInvestedDCA').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInvestedDCA);
    document.getElementById('output_averageCostPerShare').querySelector('.output-number').textContent = formatCurrencyLocal(result.averageCostPerShare);
    document.getElementById('output_finalValueLumpSum').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalValueLumpSum);
    document.getElementById('output_dcaAdvantage').querySelector('.output-number').textContent = formatCurrencyLocal(result.dcaAdvantage);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        initialInvestment: inputs.initialInvestment,
        monthlyInvestment: inputs.monthlyInvestment,
        investmentPeriod: inputs.investmentPeriod,
        averageReturn: inputs.averageReturn,
        volatility: inputs.volatility,
        dcaVsLumpSum: inputs.dcaVsLumpSum ? 'Yes' : 'No'
      };
      window.logHistory(inputSnapshot);
    }

    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Chart Rendering ──
  function updateCharts(result, inputs) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');
    var monthlyData = result.monthlyData;

    if (tab === 'growth') {
      var labels = monthlyData.map(function(d) { return d.month; });
      var valueData = monthlyData.map(function(d) { return d.value; });
      var investedData = monthlyData.map(function(d) { return d.invested; });

      // Add initial investment to invested data if present
      if (inputs.initialInvestment > 0) {
        investedData = monthlyData.map(function(d) { return d.invested + inputs.initialInvestment; });
        var initialPrice = result.prices ? result.prices[0] : 100;
        var initialShares = inputs.initialInvestment / initialPrice;
        valueData = monthlyData.map(function(d) { return (d.shares + initialShares) * d.price; });
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: valueData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Total Invested',
              data: investedData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Portfolio Growth Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Value (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Months' }
            }
          }
        }
      };
    }

    if (tab === 'shares') {
      var labels2 = monthlyData.map(function(d) { return d.month; });
      var shareData = monthlyData.map(function(d) { return d.shares; });
      var priceData = monthlyData.map(function(d) { return d.price; });

      if (inputs.initialInvestment > 0) {
        var initialPrice2 = result.prices ? result.prices[0] : 100;
        var initialShares2 = inputs.initialInvestment / initialPrice2;
        shareData = monthlyData.map(function(d) { return d.shares + initialShares2; });
      }

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Shares Accumulated',
              data: shareData,
              backgroundColor: '#2F6F5E',
              borderColor: '#1f4f42',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Shares Accumulation Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Shares' }
            },
            x: {
              title: { display: true, text: 'Months' }
            }
          }
        }
      };
    }

    if (tab === 'comparison' && inputs.dcaVsLumpSum && inputs.initialInvestment > 0) {
      var dcaValue = result.finalValueDCA;
      var lumpSumValue = result.finalValueLumpSum;

      return {
        type: 'bar',
        data: {
          labels: ['DCA Strategy', 'Lump Sum'],
          datasets: [
            {
              label: 'Final Portfolio Value',
              data: [dcaValue, lumpSumValue],
              backgroundColor: ['#C08A2E', '#2F6F5E'],
              borderColor: ['#A87520', '#1f4f42'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'DCA vs Lump Sum Comparison', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Final Value (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) {
        el.value = defaultVal;
      } else if (el.type !== 'select-one') {
        el.value = '';
      }
    });
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') {
        el.value = defaultVal;
      }
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') {
        window.updateTool();
      }
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') {
          window.updateTool();
        }
      });
    }
  });

})();
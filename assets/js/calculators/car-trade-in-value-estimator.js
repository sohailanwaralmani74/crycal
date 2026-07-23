(function() {
  var chartInstance = null;
  var currentTab = 'valueComparison';

  var CONDITION_FACTORS = {
    'excellent': 1.05,
    'good': 0.95,
    'fair': 0.82,
    'poor': 0.68
  };

  function getInputs() {
    return {
      baseMarketValue: parseFloat(document.getElementById('input_baseMarketValue').value) || 0,
      vehicleCondition: document.getElementById('input_vehicleCondition').value || 'good',
      odometerReading: parseFloat(document.getElementById('input_odometerReading').value) || 0,
      expectedMiles: parseFloat(document.getElementById('input_expectedMiles').value) || 0,
      stateSalesTaxRate: parseFloat(document.getElementById('input_stateSalesTaxRate').value) || 6.0
    };
  }

  function formatCurrency(amount) {
    try {
      var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + Math.round(amount);
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
    var baseVal = inputs.baseMarketValue;
    var condFactor = CONDITION_FACTORS[inputs.vehicleCondition] || 0.95;

    // Mileage adjustment: +/- $0.10 per mile difference
    var milesDiff = inputs.odometerReading - inputs.expectedMiles;
    var mileageAdjustment = milesDiff * 0.10;

    var adjustedRetail = Math.max(500, (baseVal * condFactor) - mileageAdjustment);

    var estimatedTradeIn = adjustedRetail * 0.82;
    var estimatedPrivateSale = adjustedRetail * 0.96;

    var privatePartyBonus = estimatedPrivateSale - estimatedTradeIn;
    var tradeInTaxCredit = estimatedTradeIn * (inputs.stateSalesTaxRate / 100);
    var netDifference = estimatedPrivateSale - (estimatedTradeIn + tradeInTaxCredit);

    return {
      estimatedTradeIn: estimatedTradeIn,
      estimatedPrivateSale: estimatedPrivateSale,
      privatePartyBonus: privatePartyBonus,
      tradeInTaxCredit: tradeInTaxCredit,
      netDifference: netDifference
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_estimatedTradeIn', formatCurrency(result.estimatedTradeIn));
    setOutputText('output_estimatedPrivateSale', formatCurrency(result.estimatedPrivateSale));
    setOutputText('output_privatePartyBonus', formatCurrency(result.privatePartyBonus));
    setOutputText('output_tradeInTaxCredit', formatCurrency(result.tradeInTaxCredit));
    setOutputText('output_netDifference', formatCurrency(result.netDifference));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        baseMarketValue: inputs.baseMarketValue,
        vehicleCondition: inputs.vehicleCondition,
        estimatedTradeIn: Math.round(result.estimatedTradeIn),
        estimatedPrivateSale: Math.round(result.estimatedPrivateSale),
        netDifference: Math.round(result.netDifference)
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
    if (tab === 'valueComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Dealer Trade-In Offer', 'Private Party Cash Offer'],
          datasets: [{
            label: 'Estimated Vehicle Value ',
            data: [
              Math.round(result.estimatedTradeIn),
              Math.round(result.estimatedPrivateSale)
            ],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Dealer Trade-In vs Private Party Sale Value ', font: { size: 14 }, color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            }
          }
        }
      };
    } else if (tab === 'netBenefit') {
      return {
        type: 'bar',
        data: {
          labels: ['Gross Private Advantage', 'Dealer Sales Tax Credit', 'Net Private Advantage'],
          datasets: [{
            label: 'Dollar Value ',
            data: [
              Math.round(result.privatePartyBonus),
              Math.round(result.tradeInTaxCredit),
              Math.round(result.netDifference)
            ],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Tax Credit Offset vs Net Private Selling Advantage', font: { size: 14 }, color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            }
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
    document.getElementById('input_baseMarketValue').value = 22000;
    document.getElementById('input_vehicleCondition').value = 'good';
    document.getElementById('input_odometerReading').value = 55000;
    document.getElementById('input_expectedMiles').value = 45000;
    document.getElementById('input_stateSalesTaxRate').value = 6.0;
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

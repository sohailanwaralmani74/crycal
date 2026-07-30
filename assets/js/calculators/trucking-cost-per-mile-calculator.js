(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var truckPayment = parseFloat(document.getElementById('input_truckPayment').value) || 0;
    var insurance = parseFloat(document.getElementById('input_insurance').value) || 0;
    var fuelPrice = parseFloat(document.getElementById('input_fuelPrice').value) || 0;
    var avgMpg = parseFloat(document.getElementById('input_avgMpg').value) || 0;
    var maintenanceReserve = parseFloat(document.getElementById('input_maintenanceReserve').value) || 0;
    var tireReplacement = parseFloat(document.getElementById('input_tireReplacement').value) || 0;
    var driverPay = parseFloat(document.getElementById('input_driverPay').value) || 0;
    var totalMiles = parseFloat(document.getElementById('input_totalMiles').value) || 0;
    var loadMiles = parseFloat(document.getElementById('input_loadMiles').value) || 0;
    var loadRate = parseFloat(document.getElementById('input_loadRate').value) || 0;
    var desiredMargin = parseFloat(document.getElementById('input_desiredMargin').value) || 0;

    return {
      truckPayment: truckPayment,
      insurance: insurance,
      fuelPrice: fuelPrice,
      avgMpg: avgMpg,
      maintenanceReserve: maintenanceReserve,
      tireReplacement: tireReplacement,
      driverPay: driverPay,
      totalMiles: totalMiles,
      loadMiles: loadMiles,
      loadRate: loadRate,
      desiredMargin: desiredMargin / 100
    }
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
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

  // ── Core Calculation ──
  function calculateTruckingCost(inputs) {
    var truckPayment = inputs.truckPayment;
    var insurance = inputs.insurance;
    var fuelPrice = inputs.fuelPrice;
    var avgMpg = inputs.avgMpg;
    var maintenanceReserve = inputs.maintenanceReserve;
    var tireReplacement = inputs.tireReplacement;
    var driverPay = inputs.driverPay;
    var totalMiles = inputs.totalMiles;
    var loadMiles = inputs.loadMiles;
    var loadRate = inputs.loadRate;
    var margin = inputs.desiredMargin;

    if (totalMiles <= 0) {
      return { error: 'Enter valid total monthly miles' };
    }

    // ── Fixed Costs ──
    var totalFixed = truckPayment + insurance;
    var fixedPerDay = totalFixed / 30;
    var fixedPerMile = totalFixed / totalMiles;

    // ── Variable Costs ──
    var fuelPerMile = avgMpg > 0 ? fuelPrice / avgMpg : 0;
    var totalVariablePerMile = fuelPerMile + maintenanceReserve + tireReplacement + driverPay;

    // ── Total Cost ──
    var totalCostPerMile = fixedPerMile + totalVariablePerMile;

    // ── Break‑Even Rate ──
    var breakEvenRate = totalCostPerMile;

    // ── Trip Profit ──
    var tripProfitPerMile = loadRate - totalCostPerMile;
    var totalTripProfit = tripProfitPerMile * loadMiles;

    // ── Recommended Rate ──
    var recommendedRate = margin > 0 && margin < 1 ? breakEvenRate / (1 - margin) : breakEvenRate;

    // ── Data for Chart ──
    var chartData = {
      'Fixed Cost Per Mile': fixedPerMile,
      'Fuel Cost Per Mile': fuelPerMile,
      'Maintenance': maintenanceReserve,
      'Tires': tireReplacement,
      'Driver Pay': driverPay
    }
    return {
      fixedPerDay: fixedPerDay,
      fixedPerMile: fixedPerMile,
      fuelPerMile: fuelPerMile,
      totalVariablePerMile: totalVariablePerMile,
      totalCostPerMile: totalCostPerMile,
      breakEvenRate: breakEvenRate,
      tripProfitPerMile: tripProfitPerMile,
      totalTripProfit: totalTripProfit,
      recommendedRate: recommendedRate,
      chartData: chartData,
      error: null
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.totalMiles <= 0) {
      setOutputText('output_fixedCostPerDay', '—');
      setOutputText('output_fixedCostPerMile', '—');
      setOutputText('output_fuelCostPerMile', '—');
      setOutputText('output_totalVariablePerMile', '—');
      setOutputText('output_totalCostPerMile', '—');
      setOutputText('output_breakEvenRate', '—');
      setOutputText('output_tripProfitPerMile', '—');
      setOutputText('output_totalTripProfit', '—');
      setOutputText('output_recommendedRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateTruckingCost(inputs);

    if (result.error) {
      setOutputText('output_fixedCostPerDay', '—');
      setOutputText('output_fixedCostPerMile', '—');
      setOutputText('output_fuelCostPerMile', '—');
      setOutputText('output_totalVariablePerMile', '—');
      setOutputText('output_totalCostPerMile', '—');
      setOutputText('output_breakEvenRate', '—');
      setOutputText('output_tripProfitPerMile', '—');
      setOutputText('output_totalTripProfit', '—');
      setOutputText('output_recommendedRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_fixedCostPerDay', formatCurrency(result.fixedPerDay));
    setOutputText('output_fixedCostPerMile', formatCurrency(result.fixedPerMile));
    setOutputText('output_fuelCostPerMile', formatCurrency(result.fuelPerMile));
    setOutputText('output_totalVariablePerMile', formatCurrency(result.totalVariablePerMile));
    setOutputText('output_totalCostPerMile', formatCurrency(result.totalCostPerMile));
    setOutputText('output_breakEvenRate', formatCurrency(result.breakEvenRate));
    setOutputText('output_tripProfitPerMile', formatCurrency(result.tripProfitPerMile));
    setOutputText('output_totalTripProfit', formatCurrency(result.totalTripProfit));
    setOutputText('output_recommendedRate', formatCurrency(result.recommendedRate));

    var chartPayload = {
      chartData: result.chartData
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalMiles: inputs.totalMiles,
        totalCostPerMile: result.totalCostPerMile,
        totalTripProfit: result.totalTripProfit,
        recommendedRate: result.recommendedRate
      });
    }
  }

  // ── Charts ──
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
    if (!data || !data.chartData) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.chartData);
      var values = Object.values(data.chartData);

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cost Per Mile',
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43', '#fbbf24', '#4ade80', '#4A90D9'],
            borderColor: ['#3a7b8c', '#B84A32', '#d4a030', '#3a9b6c', '#3a7b8c'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Cost Per Mile Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(2);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 9 } }
            }
          }
        }
      }
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    var _el_input_truckPayment = document.getElementById('input_truckPayment');
    _el_input_truckPayment.value = (_el_input_truckPayment.dataset && _el_input_truckPayment.dataset.default !== undefined) ? _el_input_truckPayment.dataset.default : (_el_input_truckPayment.getAttribute('value') || '');
    var _el_input_insurance = document.getElementById('input_insurance');
    _el_input_insurance.value = (_el_input_insurance.dataset && _el_input_insurance.dataset.default !== undefined) ? _el_input_insurance.dataset.default : (_el_input_insurance.getAttribute('value') || '');
    var _el_input_fuelPrice = document.getElementById('input_fuelPrice');
    _el_input_fuelPrice.value = (_el_input_fuelPrice.dataset && _el_input_fuelPrice.dataset.default !== undefined) ? _el_input_fuelPrice.dataset.default : (_el_input_fuelPrice.getAttribute('value') || '');
    var _el_input_avgMpg = document.getElementById('input_avgMpg');
    _el_input_avgMpg.value = (_el_input_avgMpg.dataset && _el_input_avgMpg.dataset.default !== undefined) ? _el_input_avgMpg.dataset.default : (_el_input_avgMpg.getAttribute('value') || '');
    var _el_input_maintenanceReserve = document.getElementById('input_maintenanceReserve');
    _el_input_maintenanceReserve.value = (_el_input_maintenanceReserve.dataset && _el_input_maintenanceReserve.dataset.default !== undefined) ? _el_input_maintenanceReserve.dataset.default : (_el_input_maintenanceReserve.getAttribute('value') || '');
    var _el_input_tireReplacement = document.getElementById('input_tireReplacement');
    _el_input_tireReplacement.value = (_el_input_tireReplacement.dataset && _el_input_tireReplacement.dataset.default !== undefined) ? _el_input_tireReplacement.dataset.default : (_el_input_tireReplacement.getAttribute('value') || '');
    var _el_input_driverPay = document.getElementById('input_driverPay');
    _el_input_driverPay.value = (_el_input_driverPay.dataset && _el_input_driverPay.dataset.default !== undefined) ? _el_input_driverPay.dataset.default : (_el_input_driverPay.getAttribute('value') || '');
    var _el_input_totalMiles = document.getElementById('input_totalMiles');
    _el_input_totalMiles.value = (_el_input_totalMiles.dataset && _el_input_totalMiles.dataset.default !== undefined) ? _el_input_totalMiles.dataset.default : (_el_input_totalMiles.getAttribute('value') || '');
    var _el_input_loadMiles = document.getElementById('input_loadMiles');
    _el_input_loadMiles.value = (_el_input_loadMiles.dataset && _el_input_loadMiles.dataset.default !== undefined) ? _el_input_loadMiles.dataset.default : (_el_input_loadMiles.getAttribute('value') || '');
    var _el_input_loadRate = document.getElementById('input_loadRate');
    _el_input_loadRate.value = (_el_input_loadRate.dataset && _el_input_loadRate.dataset.default !== undefined) ? _el_input_loadRate.dataset.default : (_el_input_loadRate.getAttribute('value') || '');
    var _el_input_desiredMargin = document.getElementById('input_desiredMargin');
    _el_input_desiredMargin.value = (_el_input_desiredMargin.dataset && _el_input_desiredMargin.dataset.default !== undefined) ? _el_input_desiredMargin.dataset.default : (_el_input_desiredMargin.getAttribute('value') || '');
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    
    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
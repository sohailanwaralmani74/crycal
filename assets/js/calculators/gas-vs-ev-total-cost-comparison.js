(function() {
  'use strict';

  var chartInstance = null;

  function init() {
    var inputs = document.querySelectorAll('#inputsArea input, #inputsArea select, .tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function formatCurrency(num) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    } catch (e) {
      return '$' + num.toFixed(0);
    }
  }

  function setOutput(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculate() {
    var gasPriceSticker = parseFloat(document.getElementById('input_gasPurchasePrice').value) || 35000;
    var evPriceSticker = parseFloat(document.getElementById('input_evPurchasePrice').value) || 42000;
    var evCredit = parseFloat(document.getElementById('input_evTaxCredit').value) || 7500;
    var annualMiles = parseFloat(document.getElementById('input_annualMiles').value) || 12000;
    var gasMpg = parseFloat(document.getElementById('input_gasMpg').value) || 28;
    var gasPrice = parseFloat(document.getElementById('input_gasPrice').value) || 3.65;
    var evEff = parseFloat(document.getElementById('input_evEfficiency').value) || 3.5;
    var elecPrice = parseFloat(document.getElementById('input_elecPrice').value) || 0.16;
    var gasMaintRate = parseFloat(document.getElementById('input_gasMaintPerMile').value) || 0.09;
    var evMaintRate = parseFloat(document.getElementById('input_evMaintPerMile').value) || 0.05;

    var netGasPrice = gasPriceSticker;
    var netEvPrice = Math.max(0, evPriceSticker - evCredit);

    var annualGasFuel = (annualMiles / Math.max(1, gasMpg)) * gasPrice;
    var annualEvElec = (annualMiles / Math.max(0.5, evEff)) * elecPrice;

    var annualGasMaint = annualMiles * gasMaintRate;
    var annualEvMaint = annualMiles * evMaintRate;

    var fiveYearGasFuel = annualGasFuel * 5;
    var fiveYearEvElec = annualEvElec * 5;

    var fiveYearGasMaint = annualGasMaint * 5;
    var fiveYearEvMaint = annualEvMaint * 5;

    var fiveYearGasTco = netGasPrice + fiveYearGasFuel + fiveYearGasMaint;
    var fiveYearEvTco = netEvPrice + fiveYearEvElec + fiveYearEvMaint;

    var fiveYearSavings = fiveYearGasTco - fiveYearEvTco;

    setOutput('netGasPrice', formatCurrency(netGasPrice));
    setOutput('netEvPrice', formatCurrency(netEvPrice));
    setOutput('annualGasFuel', formatCurrency(annualGasFuel) + ' / yr');
    setOutput('annualEvElec', formatCurrency(annualEvElec) + ' / yr');
    setOutput('fiveYearGasTco', formatCurrency(fiveYearGasTco));
    setOutput('fiveYearEvTco', formatCurrency(fiveYearEvTco));
    setOutput('fiveYearNetSavings', formatCurrency(fiveYearSavings));

    updateChart(netGasPrice, netEvPrice, fiveYearGasFuel, fiveYearEvElec, fiveYearGasMaint, fiveYearEvMaint, annualGasFuel, annualEvElec, annualGasMaint, annualEvMaint);

    if (window.logHistory) {
      window.logHistory('gas-vs-ev-total-cost-comparison', {
        fiveYearGasTco: formatCurrency(fiveYearGasTco),
        fiveYearEvTco: formatCurrency(fiveYearEvTco),
        fiveYearNetSavings: formatCurrency(fiveYearSavings),
        annualGasFuel: formatCurrency(annualGasFuel),
        annualEvElec: formatCurrency(annualEvElec)
      });
    }
  }

  function updateChart(netGasPrice, netEvPrice, fiveYearGasFuel, fiveYearEvElec, fiveYearGasMaint, fiveYearEvMaint, annualGasFuel, annualEvElec, annualGasMaint, annualEvMaint) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'tcoBreakdown';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'annualFuelMaint') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Gasoline Vehicle', 'Electric Vehicle'],
          datasets: [
            {
              label: 'Annual Fuel Cost ',
              data: [Math.round(annualGasFuel), Math.round(annualEvElec)],
              backgroundColor: '#D95B43'
            },
            {
              label: 'Annual Maintenance Cost ',
              data: [Math.round(annualGasMaint), Math.round(annualEvMaint)],
              backgroundColor: '#4A90D9'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Gasoline Car', 'Electric Vehicle'],
          datasets: [
            {
              label: 'Net Purchase Price ',
              data: [Math.round(netGasPrice), Math.round(netEvPrice)],
              backgroundColor: '#4A90D9'
            },
            {
              label: '5-Year Fuel Cost ',
              data: [Math.round(fiveYearGasFuel), Math.round(fiveYearEvElec)],
              backgroundColor: '#D95B43'
            },
            {
              label: '5-Year Maintenance ',
              data: [Math.round(fiveYearGasMaint), Math.round(fiveYearEvMaint)],
              backgroundColor: '#fbbf24'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_gasPurchasePrice').value = 35000;
    document.getElementById('input_evPurchasePrice').value = 42000;
    document.getElementById('input_evTaxCredit').value = 7500;
    document.getElementById('input_annualMiles').value = 12000;
    document.getElementById('input_gasMpg').value = 28;
    document.getElementById('input_gasPrice').value = 3.65;
    document.getElementById('input_evEfficiency').value = 3.5;
    document.getElementById('input_elecPrice').value = 0.16;
    document.getElementById('input_gasMaintPerMile').value = 0.09;
    document.getElementById('input_evMaintPerMile').value = 0.05;
    calculate();
  }

  window.updateTool = calculate;
  window.resetTool = reset;
  window.switchChartTab = function(tabId) {
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var target = document.querySelector('.chart-tab[data-tab="' + tabId + '"]');
    if (target) target.classList.add('active');
    calculate();
  };

  document.addEventListener('DOMContentLoaded', init);
})();

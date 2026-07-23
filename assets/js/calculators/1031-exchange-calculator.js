(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      relinquishedPropertySalePrice: parseFloat(document.getElementById('input_relinquishedPropertySalePrice').value) || 0,
      originalCostBasis: parseFloat(document.getElementById('input_originalCostBasis').value) || 0,
      replacementPropertyPurchasePrice: parseFloat(document.getElementById('input_replacementPropertyPurchasePrice').value) || 0,
      capitalGainsTaxRate: parseFloat(document.getElementById('input_capitalGainsTaxRate').value) || 0
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
    var oldPrice = inputs.relinquishedPropertySalePrice;
    var basis = inputs.originalCostBasis;
    var newPrice = inputs.replacementPropertyPurchasePrice;
    var rate = inputs.capitalGainsTaxRate / 100;

    if (oldPrice <= 0) return null;

    var realizedGain = Math.max(0, oldPrice - basis);
    var bootCash = Math.max(0, oldPrice - newPrice);
    var taxableBoot = Math.min(realizedGain, bootCash);

    var totalPotentialTax = realizedGain * rate;
    var bootTax = taxableBoot * rate;
    var deferredTax = Math.max(0, totalPotentialTax - bootTax);

    return {
      realizedGain: realizedGain,
      deferredTax: deferredTax,
      bootTax: bootTax,
      totalPotentialTax: totalPotentialTax
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_totalRealizedCapitalGain', formatCurrencyLocal(result.realizedGain));
    setOutputText('output_deferredCapitalGainsTax', formatCurrencyLocal(result.deferredTax));
    setOutputText('output_bootTaxLiability', formatCurrencyLocal(result.bootTax));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        relinquishedPropertySalePrice: inputs.relinquishedPropertySalePrice,
        replacementPropertyPurchasePrice: inputs.replacementPropertyPurchasePrice,
        totalRealizedCapitalGain: result.realizedGain,
        deferredCapitalGainsTax: result.deferredTax,
        bootTaxLiability: result.bootTax
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
    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Deferred Capital Gains Tax', 'Taxable Boot Owed Now'],
          datasets: [{
            data: [result.deferredTax, result.bootTax],
            backgroundColor: ['#2F6F5E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Total Potential Capital Gains Tax Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['1031 Exchange Property Trade'],
          datasets: [
            {
              label: 'Relinquished Property Sale Price',
              data: [inputs.relinquishedPropertySalePrice],
              backgroundColor: '#C08A2E'
            },
            {
              label: 'Replacement Property Purchase Price',
              data: [inputs.replacementPropertyPurchasePrice],
              backgroundColor: '#2F6F5E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Equal-or-Greater Value Requirement Check' }
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

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      sellingPrice: parseFloat(document.getElementById('input_sellingPrice').value) || 0,
      originalPurchasePrice: parseFloat(document.getElementById('input_originalPurchasePrice').value) || 0,
      capitalImprovementCosts: parseFloat(document.getElementById('input_capitalImprovementCosts').value) || 0,
      sellingExpenses: parseFloat(document.getElementById('input_sellingExpenses').value) || 0,
      filingStatus: document.getElementById('input_filingStatus').value
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
    var salePrice = inputs.sellingPrice;
    var origPrice = inputs.originalPurchasePrice;
    var improvements = inputs.capitalImprovementCosts;
    var expenses = inputs.sellingExpenses;

    if (salePrice <= 0) return null;

    var adjBasis = origPrice + improvements + expenses;
    var realizedGain = Math.max(0, salePrice - adjBasis);

    var maxExclusion = 250000;
    if (inputs.filingStatus.indexOf('$500k') !== -1) {
      maxExclusion = 500000;
    }

    var allowedExclusion = Math.min(realizedGain, maxExclusion);
    var taxableGain = Math.max(0, realizedGain - allowedExclusion);

    return {
      adjBasis: adjBasis,
      realizedGain: realizedGain,
      allowedExclusion: allowedExclusion,
      taxableGain: taxableGain
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_adjustedCostBasis', formatCurrencyLocal(result.adjBasis));
    setOutputText('output_totalRealizedGain', formatCurrencyLocal(result.realizedGain));
    setOutputText('output_section121ExclusionAmount', formatCurrencyLocal(result.allowedExclusion));
    setOutputText('output_taxableCapitalGain', formatCurrencyLocal(result.taxableGain));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        sellingPrice: inputs.sellingPrice,
        originalPurchasePrice: inputs.originalPurchasePrice,
        totalRealizedGain: result.realizedGain,
        section121ExclusionAmount: result.allowedExclusion,
        taxableCapitalGain: result.taxableGain
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
          labels: ['Adjusted Cost Basis', 'Tax-Free Capital Gain', 'Taxable Capital Gain'],
          datasets: [{
            data: [result.adjBasis, result.allowedExclusion, result.taxableGain],
            backgroundColor: ['#DCE1E3', '#2F6F5E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Home Sale Price Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'taxability') {
      return {
        type: 'bar',
        data: {
          labels: ['Realized Gain'],
          datasets: [
            {
              label: 'Section 121 Tax-Free Exclusion',
              data: [result.allowedExclusion],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Taxable Capital Gain Remaining',
              data: [result.taxableGain],
              backgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Taxable vs Tax-Free Gain Comparison' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
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

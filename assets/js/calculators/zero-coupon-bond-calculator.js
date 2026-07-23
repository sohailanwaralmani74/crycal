(function() {

  var COMPOUNDING_MAP = {
    'annually': 1,
    'semiannually': 2,
    'quarterly': 4
  };

  function getInputs() {
    var calculationMode = document.getElementById('input_calculationMode').value;
    var faceValue = parseFloat(document.getElementById('input_faceValue').value) || 0;
    var yieldRate = parseFloat(document.getElementById('input_yieldRate').value) || 0;
    var purchasePrice = parseFloat(document.getElementById('input_purchasePrice').value) || 0;
    var yearsToMaturity = parseFloat(document.getElementById('input_yearsToMaturity').value) || 0;
    var compoundingFrequency = document.getElementById('input_compoundingFrequency').value;

    return {
      calculationMode: calculationMode,
      faceValue: faceValue,
      yieldRate: yieldRate / 100,
      purchasePrice: purchasePrice,
      yearsToMaturity: yearsToMaturity,
      compoundingFrequency: compoundingFrequency
    };
  }

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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['bondPrice', 'impliedYield', 'totalGain', 'totalReturnPercent'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateZeroCoupon(inputs) {
    var F = inputs.faceValue;
    var n = COMPOUNDING_MAP[inputs.compoundingFrequency] || 1;
    var t = inputs.yearsToMaturity;

    if (F <= 0 || t <= 0) {
      return { error: 'Enter valid face value and years to maturity' };
    }

    var periods = n * t;
    var price, yieldRate;

    if (inputs.calculationMode === 'price') {
      var y = inputs.yieldRate;
      if (y < 0) return { error: 'Enter a valid yield' };
      price = F / Math.pow(1 + y / n, periods);
      yieldRate = y;
    } else {
      var P = inputs.purchasePrice;
      if (P <= 0 || P >= F) return { error: 'Purchase price must be positive and less than face value' };
      yieldRate = n * (Math.pow(F / P, 1 / periods) - 1);
      price = P;
    }

    var totalGain = F - price;
    var totalReturnPercent = price > 0 ? totalGain / price : 0;

    return {
      bondPrice: price,
      impliedYield: yieldRate,
      totalGain: totalGain,
      totalReturnPercent: totalReturnPercent,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.faceValue <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateZeroCoupon(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_bondPrice', formatCurrency(result.bondPrice));
    setOutputText('output_impliedYield', formatPercent(result.impliedYield));
    setOutputText('output_totalGain', formatCurrency(result.totalGain));
    setOutputText('output_totalReturnPercent', formatPercent(result.totalReturnPercent));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        calculationMode: inputs.calculationMode,
        faceValue: inputs.faceValue,
        yearsToMaturity: inputs.yearsToMaturity,
        bondPrice: result.bondPrice,
        impliedYield: result.impliedYield
      });
    }
  }

  function resetTool() {
    document.getElementById('input_calculationMode').value = 'price';
    document.getElementById('input_faceValue').value = 1000;
    document.getElementById('input_yieldRate').value = 5;
    document.getElementById('input_purchasePrice').value = 700;
    document.getElementById('input_yearsToMaturity').value = 10;
    document.getElementById('input_compoundingFrequency').value = 'annually';
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;

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

    var modeSelect = document.getElementById('input_calculationMode');
    if (modeSelect) {
      modeSelect.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();

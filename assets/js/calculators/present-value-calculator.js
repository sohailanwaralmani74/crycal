(function() {

  var COMPOUNDING_MAP = {
    'annually': 1,
    'quarterly': 4,
    'monthly': 12,
    'daily': 365
  }
  function getInputs() {
    var futureValue = parseFloat(document.getElementById('input_futureValue').value) || 0;
    var discountRate = parseFloat(document.getElementById('input_discountRate').value) || 0;
    var compoundingFrequency = document.getElementById('input_compoundingFrequency').value;
    var timeYears = parseFloat(document.getElementById('input_timeYears').value) || 0;

    return {
      futureValue: futureValue,
      discountRate: discountRate / 100,
      compoundingFrequency: compoundingFrequency,
      timeYears: timeYears
    }
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

  var ALL_OUTPUTS = ['presentValue', 'totalDiscount', 'discountPercent', 'effectiveDiscountRate'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculatePresentValue(inputs) {
    var FV = inputs.futureValue;
    var r = inputs.discountRate;
    var n = COMPOUNDING_MAP[inputs.compoundingFrequency] || 1;
    var t = inputs.timeYears;

    if (FV <= 0) {
      return { error: 'Enter a future value' };
    }
    if (t <= 0 || r < 0) {
      return { error: 'Enter valid time period and discount rate' };
    }

    var periods = n * t;
    var periodicRate = r / n;
    var presentValue = FV / Math.pow(1 + periodicRate, periods);
    var totalDiscount = FV - presentValue;
    var discountPercent = FV > 0 ? totalDiscount / FV : 0;

    return {
      presentValue: presentValue,
      totalDiscount: totalDiscount,
      discountPercent: discountPercent,
      effectiveDiscountRate: periodicRate,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.futureValue <= 0) {
      clearOutputs();
      return;
    }

    var result = calculatePresentValue(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_presentValue', formatCurrency(result.presentValue));
    setOutputText('output_totalDiscount', formatCurrency(result.totalDiscount));
    setOutputText('output_discountPercent', formatPercent(result.discountPercent));
    setOutputText('output_effectiveDiscountRate', formatPercent(result.effectiveDiscountRate));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        futureValue: inputs.futureValue,
        discountRate: inputs.discountRate * 100,
        compoundingFrequency: inputs.compoundingFrequency,
        timeYears: inputs.timeYears,
        presentValue: result.presentValue
      });
    }
  }

  function resetTool() {
    var _el_input_futureValue = document.getElementById('input_futureValue');
    _el_input_futureValue.value = (_el_input_futureValue.dataset && _el_input_futureValue.dataset.default !== undefined) ? _el_input_futureValue.dataset.default : (_el_input_futureValue.getAttribute('value') || '');
    var _el_input_discountRate = document.getElementById('input_discountRate');
    _el_input_discountRate.value = (_el_input_discountRate.dataset && _el_input_discountRate.dataset.default !== undefined) ? _el_input_discountRate.dataset.default : (_el_input_discountRate.getAttribute('value') || '');
    document.getElementById('input_compoundingFrequency').value = 'annually';
    var _el_input_timeYears = document.getElementById('input_timeYears');
    _el_input_timeYears.value = (_el_input_timeYears.dataset && _el_input_timeYears.dataset.default !== undefined) ? _el_input_timeYears.dataset.default : (_el_input_timeYears.getAttribute('value') || '');
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;

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

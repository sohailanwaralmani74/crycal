(function() {

  function getInputs() {
    var cashFlow = parseFloat(document.getElementById('input_cashFlow').value) || 0;
    var discountRate = parseFloat(document.getElementById('input_discountRate').value) || 0;
    var growthRate = parseFloat(document.getElementById('input_growthRate').value) || 0;

    return {
      cashFlow: cashFlow,
      discountRate: discountRate / 100,
      growthRate: growthRate / 100
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['presentValue', 'perpetuityType', 'valueIn10Years', 'totalCashFlow10yr'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculatePerpetuity(inputs) {
    var C = inputs.cashFlow;
    var r = inputs.discountRate;
    var g = inputs.growthRate;

    if (C <= 0) {
      return { error: 'Enter an annual cash flow' };
    }
    if (r <= 0) {
      return { error: 'Enter a valid discount rate' };
    }
    if (g >= r) {
      return { error: 'Growth rate must be less than the discount rate' };
    }

    var presentValue = C / (r - g);
    var perpetuityType = g > 0 ? 'Growing Perpetuity' : 'Level Perpetuity';
    var valueIn10Years = C * Math.pow(1 + g, 9);

    var totalCashFlow10yr = 0;
    for (var i = 0; i < 10; i++) {
      totalCashFlow10yr += C * Math.pow(1 + g, i);
    }

    return {
      presentValue: presentValue,
      perpetuityType: perpetuityType,
      valueIn10Years: valueIn10Years,
      totalCashFlow10yr: totalCashFlow10yr,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.cashFlow <= 0) {
      clearOutputs();
      return;
    }

    var result = calculatePerpetuity(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_presentValue', formatCurrency(result.presentValue));
    setOutputText('output_perpetuityType', result.perpetuityType);
    setOutputText('output_valueIn10Years', formatCurrency(result.valueIn10Years));
    setOutputText('output_totalCashFlow10yr', formatCurrency(result.totalCashFlow10yr));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        cashFlow: inputs.cashFlow,
        discountRate: inputs.discountRate * 100,
        growthRate: inputs.growthRate * 100,
        presentValue: result.presentValue
      });
    }
  }

  function resetTool() {
    var _el_input_cashFlow = document.getElementById('input_cashFlow');
    _el_input_cashFlow.value = (_el_input_cashFlow.dataset && _el_input_cashFlow.dataset.default !== undefined) ? _el_input_cashFlow.dataset.default : (_el_input_cashFlow.getAttribute('value') || '');
    var _el_input_discountRate = document.getElementById('input_discountRate');
    _el_input_discountRate.value = (_el_input_discountRate.dataset && _el_input_discountRate.dataset.default !== undefined) ? _el_input_discountRate.dataset.default : (_el_input_discountRate.getAttribute('value') || '');
    var _el_input_growthRate = document.getElementById('input_growthRate');
    _el_input_growthRate.value = (_el_input_growthRate.dataset && _el_input_growthRate.dataset.default !== undefined) ? _el_input_growthRate.dataset.default : (_el_input_growthRate.getAttribute('value') || '');
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

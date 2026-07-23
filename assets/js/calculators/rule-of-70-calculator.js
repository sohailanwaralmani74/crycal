(function() {

  function getInputs() {
    var growthRate = parseFloat(document.getElementById('input_growthRate').value) || 0;
    var initialValue = parseFloat(document.getElementById('input_initialValue').value) || 0;
    return {
      growthRate: growthRate / 100,
      initialValue: initialValue
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['doublingYears', 'doublingYears72', 'doublingYearsExact', 'doubledValue'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateRuleOf70(inputs) {
    var r = inputs.growthRate;

    if (r <= 0) {
      return { error: 'Enter a valid growth rate' };
    }

    var ratePercent = r * 100;
    var doublingYears = 70 / ratePercent;
    var doublingYears72 = 72 / ratePercent;
    var doublingYearsExact = Math.log(2) / Math.log(1 + r);
    var doubledValue = inputs.initialValue > 0 ? inputs.initialValue * 2 : 0;

    return {
      doublingYears: doublingYears,
      doublingYears72: doublingYears72,
      doublingYearsExact: doublingYearsExact,
      doubledValue: doubledValue,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.growthRate <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateRuleOf70(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_doublingYears', result.doublingYears.toFixed(2) + ' years');
    setOutputText('output_doublingYears72', result.doublingYears72.toFixed(2) + ' years');
    setOutputText('output_doublingYearsExact', result.doublingYearsExact.toFixed(2) + ' years');
    setOutputText('output_doubledValue', inputs.initialValue > 0 ? formatCurrency(result.doubledValue) : '—');

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        growthRate: inputs.growthRate * 100,
        initialValue: inputs.initialValue,
        doublingYears: result.doublingYears
      });
    }
  }

  function resetTool() {
    document.getElementById('input_growthRate').value = 7;
    document.getElementById('input_initialValue').value = 10000;
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
  });

})();

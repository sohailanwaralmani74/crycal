(function() {

  function getInputs() {
    var accountType = document.getElementById('input_accountType').value;
    var age = parseFloat(document.getElementById('input_age').value) || 0;
    var standardLimit = parseFloat(document.getElementById('input_standardLimit').value) || 0;
    var catchUp50 = parseFloat(document.getElementById('input_catchUp50').value) || 0;
    var catchUp60to63 = parseFloat(document.getElementById('input_catchUp60to63').value) || 0;

    return {
      accountType: accountType,
      age: age,
      standardLimit: standardLimit,
      catchUp50: catchUp50,
      catchUp60to63: catchUp60to63
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['applicableCatchUp', 'totalContributionLimit', 'percentIncrease'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateCatchUp(inputs) {
    var age = inputs.age;
    var standardLimit = inputs.standardLimit;

    if (standardLimit <= 0) {
      return { error: 'Enter a valid standard contribution limit' };
    }

    var applicableCatchUp = 0;
    var isEnhancedEligible = (inputs.accountType === '401k' || inputs.accountType === '403b');

    if (age >= 60 && age <= 63 && isEnhancedEligible) {
      applicableCatchUp = inputs.catchUp60to63;
    } else if (age >= 50) {
      applicableCatchUp = inputs.catchUp50;
    }

    var totalContributionLimit = standardLimit + applicableCatchUp;
    var percentIncrease = standardLimit > 0 ? applicableCatchUp / standardLimit : 0;

    return {
      applicableCatchUp: applicableCatchUp,
      totalContributionLimit: totalContributionLimit,
      percentIncrease: percentIncrease,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.standardLimit <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateCatchUp(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_applicableCatchUp', formatCurrency(result.applicableCatchUp));
    setOutputText('output_totalContributionLimit', formatCurrency(result.totalContributionLimit));
    setOutputText('output_percentIncrease', formatPercent(result.percentIncrease));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        accountType: inputs.accountType,
        age: inputs.age,
        totalContributionLimit: result.totalContributionLimit
      });
    }
  }

  function resetTool() {
    document.getElementById('input_accountType').value = '401k';
    document.getElementById('input_age').value = 55;
    document.getElementById('input_standardLimit').value = 23500;
    document.getElementById('input_catchUp50').value = 7500;
    document.getElementById('input_catchUp60to63').value = 11250;
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

    var typeSelect = document.getElementById('input_accountType');
    if (typeSelect) {
      typeSelect.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();

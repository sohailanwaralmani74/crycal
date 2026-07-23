(function() {

  function getInputs() {
    var workerPia = parseFloat(document.getElementById('input_workerPia').value) || 0;
    var spouseOwnPia = parseFloat(document.getElementById('input_spouseOwnPia').value) || 0;
    var claimingAgeMonths = parseFloat(document.getElementById('input_claimingAgeMonths').value) || 0;
    var fullRetirementAge = parseFloat(document.getElementById('input_fullRetirementAge').value) || 0;

    return {
      workerPia: workerPia,
      spouseOwnPia: spouseOwnPia,
      claimingAge: claimingAgeMonths,
      fullRetirementAge: fullRetirementAge
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

  var ALL_OUTPUTS = ['maxSpousalBenefit', 'reducedSpousalBenefit', 'higherOfTwo', 'reductionPercent'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateSpousalBenefit(inputs) {
    var workerPia = inputs.workerPia;
    var fra = inputs.fullRetirementAge;
    var claimingAge = inputs.claimingAge;

    if (workerPia <= 0) {
      return { error: "Enter your spouse's PIA" };
    }
    if (fra <= 0 || claimingAge < 62) {
      return { error: 'Enter valid full retirement age and claiming age (62+)' };
    }

    var maxSpousalBenefit = workerPia * 0.5;

    var monthsEarly = Math.max(0, Math.round((fra - claimingAge) * 12));
    var reductionPercent = 0;

    if (monthsEarly > 0) {
      var first36 = Math.min(monthsEarly, 36);
      var beyond36 = Math.max(0, monthsEarly - 36);
      reductionPercent = (first36 * (25 / 36 / 100)) + (beyond36 * (5 / 12 / 100));
      reductionPercent = Math.min(reductionPercent, 0.35); // floor at 32.5% of PIA (i.e., max 35% reduction)
    }

    var reducedSpousalBenefit = maxSpousalBenefit * (1 - reductionPercent);
    var higherOfTwo = Math.max(inputs.spouseOwnPia, reducedSpousalBenefit);

    return {
      maxSpousalBenefit: maxSpousalBenefit,
      reducedSpousalBenefit: reducedSpousalBenefit,
      higherOfTwo: higherOfTwo,
      reductionPercent: reductionPercent,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.workerPia <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateSpousalBenefit(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_maxSpousalBenefit', formatCurrency(result.maxSpousalBenefit) + '/mo');
    setOutputText('output_reducedSpousalBenefit', formatCurrency(result.reducedSpousalBenefit) + '/mo');
    setOutputText('output_higherOfTwo', formatCurrency(result.higherOfTwo) + '/mo');
    setOutputText('output_reductionPercent', formatPercent(result.reductionPercent));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        workerPia: inputs.workerPia,
        claimingAge: inputs.claimingAge,
        reducedSpousalBenefit: result.reducedSpousalBenefit
      });
    }
  }

  function resetTool() {
    document.getElementById('input_workerPia').value = 2800;
    document.getElementById('input_spouseOwnPia').value = 0;
    document.getElementById('input_claimingAgeMonths').value = 67;
    document.getElementById('input_fullRetirementAge').value = 67;
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

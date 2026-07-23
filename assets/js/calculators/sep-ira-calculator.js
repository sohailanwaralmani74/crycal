(function() {

  function getInputs() {
    var annualCompensation = parseFloat(document.getElementById('input_annualCompensation').value) || 0;
    var contributionPercent = parseFloat(document.getElementById('input_contributionPercent').value) || 0;
    var irsAnnualLimit = parseFloat(document.getElementById('input_irsAnnualLimit').value) || 0;
    var marginalTaxRate = parseFloat(document.getElementById('input_marginalTaxRate').value) || 0;

    return {
      annualCompensation: annualCompensation,
      contributionPercent: contributionPercent / 100,
      irsAnnualLimit: irsAnnualLimit,
      marginalTaxRate: marginalTaxRate / 100
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

  var ALL_OUTPUTS = ['maxContribution', 'effectiveContributionRate', 'taxSavings', 'takeHomeAfterContribution'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateSepIra(inputs) {
    var comp = inputs.annualCompensation;
    var pct = inputs.contributionPercent;
    var limit = inputs.irsAnnualLimit;
    var taxRate = inputs.marginalTaxRate;

    if (comp <= 0) {
      return { error: 'Enter your annual compensation' };
    }

    var pctBasedAmount = comp * pct;
    var maxContribution = Math.min(pctBasedAmount, limit);
    var effectiveContributionRate = comp > 0 ? maxContribution / comp : 0;
    var taxSavings = maxContribution * taxRate;
    var takeHomeAfterContribution = comp - maxContribution;

    return {
      maxContribution: maxContribution,
      effectiveContributionRate: effectiveContributionRate,
      taxSavings: taxSavings,
      takeHomeAfterContribution: takeHomeAfterContribution,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.annualCompensation <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateSepIra(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_maxContribution', formatCurrency(result.maxContribution));
    setOutputText('output_effectiveContributionRate', formatPercent(result.effectiveContributionRate));
    setOutputText('output_taxSavings', formatCurrency(result.taxSavings));
    setOutputText('output_takeHomeAfterContribution', formatCurrency(result.takeHomeAfterContribution));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualCompensation: inputs.annualCompensation,
        contributionPercent: inputs.contributionPercent * 100,
        maxContribution: result.maxContribution
      });
    }
  }

  function resetTool() {
    document.getElementById('input_annualCompensation').value = 120000;
    document.getElementById('input_contributionPercent').value = 20;
    document.getElementById('input_irsAnnualLimit').value = 70000;
    document.getElementById('input_marginalTaxRate').value = 24;
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

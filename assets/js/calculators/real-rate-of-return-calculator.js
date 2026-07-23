(function() {

  function getInputs() {
    var nominalRate = parseFloat(document.getElementById('input_nominalRate').value);
    var inflationRate = parseFloat(document.getElementById('input_inflationRate').value);
    var investmentAmount = parseFloat(document.getElementById('input_investmentAmount').value) || 0;

    return {
      nominalRate: (isNaN(nominalRate) ? 0 : nominalRate) / 100,
      inflationRate: (isNaN(inflationRate) ? 0 : inflationRate) / 100,
      investmentAmount: investmentAmount,
      hasNominal: !isNaN(nominalRate)
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

  var ALL_OUTPUTS = ['realRateExact', 'realRateApprox', 'realValueAfter1Year', 'purchasingPowerLoss'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateRealReturn(inputs) {
    var rNom = inputs.nominalRate;
    var rInf = inputs.inflationRate;

    if (rNom + 1 <= 0 || rInf + 1 <= 0) {
      return { error: 'Enter valid rates' };
    }

    var realRateExact = ((1 + rNom) / (1 + rInf)) - 1;
    var realRateApprox = rNom - rInf;

    var realValueAfter1Year = null;
    var purchasingPowerLoss = null;
    if (inputs.investmentAmount > 0) {
      var nominalValue = inputs.investmentAmount * (1 + rNom);
      realValueAfter1Year = nominalValue / (1 + rInf);
      purchasingPowerLoss = nominalValue - realValueAfter1Year;
    }

    return {
      realRateExact: realRateExact,
      realRateApprox: realRateApprox,
      realValueAfter1Year: realValueAfter1Year,
      purchasingPowerLoss: purchasingPowerLoss,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (!inputs.hasNominal) {
      clearOutputs();
      return;
    }

    var result = calculateRealReturn(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_realRateExact', formatPercent(result.realRateExact));
    setOutputText('output_realRateApprox', formatPercent(result.realRateApprox));
    setOutputText('output_realValueAfter1Year', result.realValueAfter1Year !== null ? formatCurrency(result.realValueAfter1Year) : '—');
    setOutputText('output_purchasingPowerLoss', result.purchasingPowerLoss !== null ? formatCurrency(result.purchasingPowerLoss) : '—');

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        nominalRate: inputs.nominalRate * 100,
        inflationRate: inputs.inflationRate * 100,
        investmentAmount: inputs.investmentAmount,
        realRateExact: result.realRateExact
      });
    }
  }

  function resetTool() {
    document.getElementById('input_nominalRate').value = 8;
    document.getElementById('input_inflationRate').value = 3.2;
    document.getElementById('input_investmentAmount').value = 10000;
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

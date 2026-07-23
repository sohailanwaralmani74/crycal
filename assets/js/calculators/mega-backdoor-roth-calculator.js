(function() {

  function getInputs() {
    var employeeContribution = parseFloat(document.getElementById('input_employeeContribution').value) || 0;
    var employerContribution = parseFloat(document.getElementById('input_employerContribution').value) || 0;
    var overallLimit = parseFloat(document.getElementById('input_overallLimit').value) || 0;
    var catchUpAmount = parseFloat(document.getElementById('input_catchUpAmount').value) || 0;
    var annualReturn = parseFloat(document.getElementById('input_annualReturn').value) || 0;
    var yearsToGrow = parseFloat(document.getElementById('input_yearsToGrow').value) || 0;

    return {
      employeeContribution: employeeContribution,
      employerContribution: employerContribution,
      overallLimit: overallLimit,
      catchUpAmount: catchUpAmount,
      annualReturn: annualReturn / 100,
      yearsToGrow: yearsToGrow
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['afterTaxRoom', 'totalContributionRoom', 'projectedRothValue', 'totalGrowth'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateMegaBackdoor(inputs) {
    var effectiveLimit = inputs.overallLimit + inputs.catchUpAmount;
    var usedRoom = inputs.employeeContribution + inputs.employerContribution;

    if (effectiveLimit <= 0) {
      return { error: 'Enter a valid overall contribution limit' };
    }

    var afterTaxRoom = Math.max(0, effectiveLimit - usedRoom);
    var totalContributionRoom = usedRoom + afterTaxRoom;

    var projectedRothValue = afterTaxRoom;
    if (inputs.annualReturn > 0 && inputs.yearsToGrow > 0) {
      projectedRothValue = afterTaxRoom * Math.pow(1 + inputs.annualReturn, inputs.yearsToGrow);
    }
    var totalGrowth = projectedRothValue - afterTaxRoom;

    return {
      afterTaxRoom: afterTaxRoom,
      totalContributionRoom: totalContributionRoom,
      projectedRothValue: projectedRothValue,
      totalGrowth: totalGrowth,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.overallLimit <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateMegaBackdoor(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_afterTaxRoom', formatCurrency(result.afterTaxRoom));
    setOutputText('output_totalContributionRoom', formatCurrency(result.totalContributionRoom));
    setOutputText('output_projectedRothValue', formatCurrency(result.projectedRothValue));
    setOutputText('output_totalGrowth', formatCurrency(result.totalGrowth));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        employeeContribution: inputs.employeeContribution,
        employerContribution: inputs.employerContribution,
        afterTaxRoom: result.afterTaxRoom
      });
    }
  }

  function resetTool() {
    document.getElementById('input_employeeContribution').value = 23500;
    document.getElementById('input_employerContribution').value = 8000;
    document.getElementById('input_overallLimit').value = 70000;
    document.getElementById('input_catchUpAmount').value = 0;
    document.getElementById('input_annualReturn').value = 7;
    document.getElementById('input_yearsToGrow').value = 20;
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

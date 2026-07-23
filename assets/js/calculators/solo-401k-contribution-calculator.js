(function() {

  function getInputs() {
    var netSelfEmploymentIncome = parseFloat(document.getElementById('input_netSelfEmploymentIncome').value) || 0;
    var age = parseFloat(document.getElementById('input_age').value) || 0;
    var employeeDeferralLimit = parseFloat(document.getElementById('input_employeeDeferralLimit').value) || 0;
    var catchUp50 = parseFloat(document.getElementById('input_catchUp50').value) || 0;
    var catchUp60to63 = parseFloat(document.getElementById('input_catchUp60to63').value) || 0;
    var employerContributionPercent = parseFloat(document.getElementById('input_employerContributionPercent').value) || 0;
    var overallLimit = parseFloat(document.getElementById('input_overallLimit').value) || 0;

    return {
      netSelfEmploymentIncome: netSelfEmploymentIncome,
      age: age,
      employeeDeferralLimit: employeeDeferralLimit,
      catchUp50: catchUp50,
      catchUp60to63: catchUp60to63,
      employerContributionPercent: employerContributionPercent / 100,
      overallLimit: overallLimit
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

  var ALL_OUTPUTS = ['employeeDeferral', 'employerContribution', 'totalContribution', 'remainingRoom'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function getCatchUpAmount(age, catchUp50, catchUp60to63) {
    if (age >= 60 && age <= 63) return catchUp60to63;
    if (age >= 50) return catchUp50;
    return 0;
  }

  function calculateSolo401k(inputs) {
    var income = inputs.netSelfEmploymentIncome;
    var age = inputs.age;

    if (income <= 0) {
      return { error: 'Enter your net self-employment income' };
    }

    var catchUp = getCatchUpAmount(age, inputs.catchUp50, inputs.catchUp60to63);
    var employeeDeferral = inputs.employeeDeferralLimit + catchUp;

    // Employer contribution generally capped at 20% of net SE income (after 1/2 SE tax adjustment, approximated here)
    var employerContribution = income * inputs.employerContributionPercent;

    var effectiveOverallLimit = inputs.overallLimit + catchUp;
    var totalContribution = Math.min(employeeDeferral + employerContribution, effectiveOverallLimit);

    // If capped, reduce employer contribution first to fit within the limit (employee deferral is fixed)
    var actualEmployerContribution = employerContribution;
    if (employeeDeferral + employerContribution > effectiveOverallLimit) {
      actualEmployerContribution = Math.max(0, effectiveOverallLimit - employeeDeferral);
    }

    var remainingRoom = effectiveOverallLimit - (employeeDeferral + actualEmployerContribution);

    return {
      employeeDeferral: employeeDeferral,
      employerContribution: actualEmployerContribution,
      totalContribution: employeeDeferral + actualEmployerContribution,
      remainingRoom: Math.max(0, remainingRoom),
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.netSelfEmploymentIncome <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateSolo401k(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_employeeDeferral', formatCurrency(result.employeeDeferral));
    setOutputText('output_employerContribution', formatCurrency(result.employerContribution));
    setOutputText('output_totalContribution', formatCurrency(result.totalContribution));
    setOutputText('output_remainingRoom', formatCurrency(result.remainingRoom));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        netSelfEmploymentIncome: inputs.netSelfEmploymentIncome,
        age: inputs.age,
        totalContribution: result.totalContribution
      });
    }
  }

  function resetTool() {
    document.getElementById('input_netSelfEmploymentIncome').value = 150000;
    document.getElementById('input_age').value = 45;
    document.getElementById('input_employeeDeferralLimit').value = 23500;
    document.getElementById('input_catchUp50').value = 7500;
    document.getElementById('input_catchUp60to63').value = 11250;
    document.getElementById('input_employerContributionPercent').value = 20;
    document.getElementById('input_overallLimit').value = 70000;
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

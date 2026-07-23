(function() {

  // Approximate IRS Single Life Expectancy Table anchor points (age: factor), linearly interpolated
  var LIFE_EXPECTANCY_ANCHORS = [
    [0, 84.6], [10, 74.8], [20, 65.0], [30, 55.3], [40, 45.7],
    [50, 36.2], [60, 27.1], [70, 18.8], [80, 11.2], [90, 5.7],
    [100, 2.8], [110, 1.1], [120, 1.0]
  ];

  function getLifeExpectancyFactor(age) {
    if (age <= LIFE_EXPECTANCY_ANCHORS[0][0]) return LIFE_EXPECTANCY_ANCHORS[0][1];
    var last = LIFE_EXPECTANCY_ANCHORS[LIFE_EXPECTANCY_ANCHORS.length - 1];
    if (age >= last[0]) return last[1];

    for (var i = 0; i < LIFE_EXPECTANCY_ANCHORS.length - 1; i++) {
      var a = LIFE_EXPECTANCY_ANCHORS[i];
      var b = LIFE_EXPECTANCY_ANCHORS[i + 1];
      if (age >= a[0] && age <= b[0]) {
        var frac = (age - a[0]) / (b[0] - a[0]);
        return a[1] + frac * (b[1] - a[1]);
      }
    }
    return last[1];
  }

  function getInputs() {
    var inheritedBalance = parseFloat(document.getElementById('input_inheritedBalance').value) || 0;
    var beneficiaryType = document.getElementById('input_beneficiaryType').value;
    var beneficiaryAge = parseFloat(document.getElementById('input_beneficiaryAge').value) || 0;
    var yearsSinceInheritance = parseFloat(document.getElementById('input_yearsSinceInheritance').value) || 0;

    return {
      inheritedBalance: inheritedBalance,
      beneficiaryType: beneficiaryType,
      beneficiaryAge: beneficiaryAge,
      yearsSinceInheritance: yearsSinceInheritance
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

  var ALL_OUTPUTS = ['lifeExpectancyFactor', 'currentYearRmd', 'rmdAsPercent', 'distributionDeadline'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateInheritedRmd(inputs) {
    var balance = inputs.inheritedBalance;
    var type = inputs.beneficiaryType;
    var age = inputs.beneficiaryAge;
    var yearsSince = inputs.yearsSinceInheritance;

    if (balance <= 0) {
      return { error: 'Enter a valid inherited IRA balance' };
    }

    if (type === 'non_designated_5yr') {
      return {
        lifeExpectancyFactor: null,
        currentYearRmd: null,
        rmdAsPercent: null,
        distributionDeadline: 'End of Year 5 (no annual RMD required)',
        error: null
      };
    }

    if (type === 'non_eligible_10yr') {
      return {
        lifeExpectancyFactor: null,
        currentYearRmd: null,
        rmdAsPercent: null,
        distributionDeadline: 'End of Year 10 (annual RMDs may apply if original owner had begun RMDs; consult a tax advisor)',
        error: null
      };
    }

    // Spouse or eligible designated beneficiary — life expectancy method
    var factor;
    if (type === 'spouse') {
      // Spouses can recalculate the factor each year based on current age
      factor = getLifeExpectancyFactor(age);
    } else {
      // Eligible designated beneficiary: factor set in first distribution year, reduced by 1 each subsequent year
      var initialFactor = getLifeExpectancyFactor(age - yearsSince);
      factor = Math.max(1, initialFactor - yearsSince);
    }

    var currentYearRmd = balance / factor;
    var rmdAsPercent = balance > 0 ? currentYearRmd / balance : 0;

    return {
      lifeExpectancyFactor: factor,
      currentYearRmd: currentYearRmd,
      rmdAsPercent: rmdAsPercent,
      distributionDeadline: 'Based on life expectancy (no fixed depletion deadline)',
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.inheritedBalance <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateInheritedRmd(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_lifeExpectancyFactor', result.lifeExpectancyFactor !== null ? result.lifeExpectancyFactor.toFixed(1) : 'N/A');
    setOutputText('output_currentYearRmd', result.currentYearRmd !== null ? formatCurrency(result.currentYearRmd) : 'N/A');
    setOutputText('output_rmdAsPercent', result.rmdAsPercent !== null ? formatPercent(result.rmdAsPercent) : 'N/A');
    setOutputText('output_distributionDeadline', result.distributionDeadline);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        inheritedBalance: inputs.inheritedBalance,
        beneficiaryType: inputs.beneficiaryType,
        currentYearRmd: result.currentYearRmd
      });
    }
  }

  function resetTool() {
    document.getElementById('input_inheritedBalance').value = 200000;
    document.getElementById('input_beneficiaryType').value = 'eligible_designated';
    document.getElementById('input_beneficiaryAge').value = 55;
    document.getElementById('input_yearsSinceInheritance').value = 0;
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

    var typeSelect = document.getElementById('input_beneficiaryType');
    if (typeSelect) {
      typeSelect.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();

(function() {

  var FREQ_MAP = {
    'monthly': 12,
    'quarterly': 4,
    'annually': 1
  };

  function getInputs() {
    var principal = parseFloat(document.getElementById('input_principal').value) || 0;
    var annualRate = parseFloat(document.getElementById('input_annualRate').value) || 0;
    var payoutYears = parseFloat(document.getElementById('input_payoutYears').value) || 0;
    var paymentFrequency = document.getElementById('input_paymentFrequency').value;

    return {
      principal: principal,
      annualRate: annualRate / 100,
      payoutYears: payoutYears,
      paymentFrequency: paymentFrequency
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

  var ALL_OUTPUTS = ['paymentAmount', 'totalPayments', 'totalInterestEarned', 'numberOfPayments'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateAnnuityPayout(inputs) {
    var P = inputs.principal;
    var m = FREQ_MAP[inputs.paymentFrequency] || 12;
    var n = Math.round(inputs.payoutYears * m);
    var r = inputs.annualRate / m;

    if (P <= 0) {
      return { error: 'Enter a valid principal amount' };
    }
    if (n <= 0) {
      return { error: 'Enter a valid payout term' };
    }

    var payment;
    if (r > 0) {
      payment = (P * r) / (1 - Math.pow(1 + r, -n));
    } else {
      payment = P / n;
    }

    var totalPayments = payment * n;
    var totalInterestEarned = totalPayments - P;

    return {
      paymentAmount: payment,
      totalPayments: totalPayments,
      totalInterestEarned: totalInterestEarned,
      numberOfPayments: n,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.principal <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateAnnuityPayout(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_paymentAmount', formatCurrency(result.paymentAmount));
    setOutputText('output_totalPayments', formatCurrency(result.totalPayments));
    setOutputText('output_totalInterestEarned', formatCurrency(result.totalInterestEarned));
    setOutputText('output_numberOfPayments', result.numberOfPayments.toString());

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        principal: inputs.principal,
        annualRate: inputs.annualRate * 100,
        payoutYears: inputs.payoutYears,
        paymentAmount: result.paymentAmount
      });
    }
  }

  function resetTool() {
    document.getElementById('input_principal').value = 250000;
    document.getElementById('input_annualRate').value = 5;
    document.getElementById('input_payoutYears').value = 20;
    document.getElementById('input_paymentFrequency').value = 'monthly';
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

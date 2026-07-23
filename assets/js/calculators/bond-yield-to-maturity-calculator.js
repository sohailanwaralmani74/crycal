(function() {

  function getInputs() {
    var faceValue = parseFloat(document.getElementById('input_faceValue').value) || 0;
    var currentPrice = parseFloat(document.getElementById('input_currentPrice').value) || 0;
    var couponRate = parseFloat(document.getElementById('input_couponRate').value) || 0;
    var yearsToMaturity = parseFloat(document.getElementById('input_yearsToMaturity').value) || 0;
    var paymentsPerYear = parseInt(document.getElementById('input_paymentsPerYear').value, 10) || 2;

    return {
      faceValue: faceValue,
      currentPrice: currentPrice,
      couponRate: couponRate / 100,
      yearsToMaturity: yearsToMaturity,
      paymentsPerYear: paymentsPerYear
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
    return (value * 100).toFixed(3) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['annualCoupon', 'approxYtm', 'preciseYtm', 'currentYield', 'totalReturn'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  // Bond price given a yield (per-period rate), used by the solver
  function bondPriceForYield(yPerPeriod, couponPerPeriod, faceValue, totalPeriods) {
    var price = 0;
    for (var t = 1; t <= totalPeriods; t++) {
      price += couponPerPeriod / Math.pow(1 + yPerPeriod, t);
    }
    price += faceValue / Math.pow(1 + yPerPeriod, totalPeriods);
    return price;
  }

  // Newton-Raphson solve for precise YTM
  function solvePreciseYtm(price, couponPerPeriod, faceValue, totalPeriods, paymentsPerYear, guess) {
    var y = guess;
    for (var iter = 0; iter < 100; iter++) {
      var f = bondPriceForYield(y, couponPerPeriod, faceValue, totalPeriods) - price;
      var h = 0.000001;
      var fPrime = (bondPriceForYield(y + h, couponPerPeriod, faceValue, totalPeriods) - bondPriceForYield(y - h, couponPerPeriod, faceValue, totalPeriods)) / (2 * h);
      if (Math.abs(fPrime) < 1e-12) break;
      var yNext = y - f / fPrime;
      if (!isFinite(yNext) || yNext <= -0.999999) {
        yNext = y / 2;
      }
      if (Math.abs(yNext - y) < 1e-9) {
        y = yNext;
        break;
      }
      y = yNext;
    }
    return y * paymentsPerYear;
  }

  function calculateYtm(inputs) {
    var F = inputs.faceValue;
    var P = inputs.currentPrice;
    var c = inputs.couponRate;
    var n = inputs.yearsToMaturity;
    var m = inputs.paymentsPerYear;

    if (F <= 0 || P <= 0) {
      return { error: 'Enter valid face value and current price' };
    }
    if (n <= 0) {
      return { error: 'Enter valid years to maturity' };
    }

    var annualCoupon = F * c;
    var couponPerPeriod = annualCoupon / m;
    var totalPeriods = Math.round(n * m);

    var approxYtm = (annualCoupon + (F - P) / n) / ((F + P) / 2);

    var preciseYtmGuess = approxYtm / m;
    var preciseYtm = solvePreciseYtm(P, couponPerPeriod, F, totalPeriods, m, preciseYtmGuess);

    var currentYield = P > 0 ? annualCoupon / P : 0;

    var totalCouponsReceived = annualCoupon * n;
    var totalReturn = ((totalCouponsReceived + (F - P)) / P);

    return {
      annualCoupon: annualCoupon,
      approxYtm: approxYtm,
      preciseYtm: preciseYtm,
      currentYield: currentYield,
      totalReturn: totalReturn,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.faceValue <= 0 || inputs.currentPrice <= 0) {
      clearOutputs();
      return;
    }

    var result = calculateYtm(inputs);

    if (result.error) {
      clearOutputs();
      return;
    }

    setOutputText('output_annualCoupon', formatCurrency(result.annualCoupon));
    setOutputText('output_approxYtm', formatPercent(result.approxYtm));
    setOutputText('output_preciseYtm', formatPercent(result.preciseYtm));
    setOutputText('output_currentYield', formatPercent(result.currentYield));
    setOutputText('output_totalReturn', formatPercent(result.totalReturn));

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        faceValue: inputs.faceValue,
        currentPrice: inputs.currentPrice,
        couponRate: inputs.couponRate * 100,
        yearsToMaturity: inputs.yearsToMaturity,
        preciseYtm: result.preciseYtm
      });
    }
  }

  function resetTool() {
    document.getElementById('input_faceValue').value = 1000;
    document.getElementById('input_currentPrice').value = 950;
    document.getElementById('input_couponRate').value = 5;
    document.getElementById('input_yearsToMaturity').value = 10;
    document.getElementById('input_paymentsPerYear').value = '2';
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

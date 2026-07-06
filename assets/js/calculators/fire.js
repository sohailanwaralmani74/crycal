/* ═══════════════════════════════════════════════════════════
   Wanjaaro — FIRE Calculator
   - Closed-form annuity math (smooth, continuous in t) instead of
     a month-by-month loop, so Newton-Raphson's derivative is
     accurate and the solver converges reliably.
   - Uses real return (nominal return adjusted for inflation), so
     the resulting FI number and balance are both in today's
     purchasing power — no mixing of real/nominal series.
═══════════════════════════════════════════════════════════ */

(function () {

  var chartInstance = null;
  var currentTab = 'growth';
  var MAX_HORIZON_YEARS = 100; // safety cap for the solver and chart

  // ── Get Inputs ──
  function getInputs() {
    return {
      currentAge: parseFloat(document.getElementById('input_currentAge').value) || 0,
      annualExpenses: parseFloat(document.getElementById('input_annualExpenses').value) || 0,
      currentSavings: parseFloat(document.getElementById('input_currentSavings').value) || 0,
      annualIncome: parseFloat(document.getElementById('input_annualIncome').value) || 0,
      savingsRate: parseFloat(document.getElementById('input_savingsRate').value) || 0,
      annualReturn: parseFloat(document.getElementById('input_annualReturn').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      safeWithdrawalRate: parseFloat(document.getElementById('input_safeWithdrawalRate').value) || 4.0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Compounding periods per year (normalized so "semiannually" and
  //    "semi-annually" both resolve — avoids a silent fallback to monthly) ──
  function getCompoundsPerYear(frequency) {
    var key = (frequency || '').toLowerCase().replace(/[-\s]/g, '');
    var map = { daily: 365, monthly: 12, quarterly: 4, semiannually: 2, annually: 1 };
    return map[key] || 12;
  }

  // ── FI Number: how much you need invested to sustain expenses forever ──
  function calculateFINumber(annualExpenses, safeWithdrawalRate) {
    if (safeWithdrawalRate <= 0) return Infinity;
    return annualExpenses / (safeWithdrawalRate / 100);
  }

  function calculateSavingsRate(annualIncome, annualExpenses) {
    if (annualIncome <= 0) return 0;
    return ((annualIncome - annualExpenses) / annualIncome) * 100;
  }

  // ── Effective monthly REAL rate ──
  // Real return strips out inflation, so every dollar figure downstream
  // (FI number, balance, target) is expressed in today's purchasing power.
  function getEffectiveMonthlyRealRate(annualReturn, inflationRate, n) {
    var rNominal = annualReturn / 100;
    var i = inflationRate / 100;
    var rReal = (1 + rNominal) / (1 + i) - 1;
    return Math.pow(1 + rReal / n, n / 12) - 1;
  }

  // ── Closed-form future value at continuous time t (years) ──
  // FV = P(1+i)^(12t) + PMT * [(1+i)^(12t) - 1] / i
  // Smooth and O(1) — this is what fixes the Newton-Raphson derivative.
  function futureValueAt(t, currentSavings, monthlyContribution, effMonthlyRate) {
    if (t <= 0) return currentSavings;
    var growth = Math.pow(1 + effMonthlyRate, 12 * t);
    if (Math.abs(effMonthlyRate) < 1e-9) {
      return currentSavings + monthlyContribution * 12 * t;
    }
    return currentSavings * growth + monthlyContribution * (growth - 1) / effMonthlyRate;
  }

  // ── Analytic derivative of futureValueAt with respect to t ──
  function futureValueDerivativeAt(t, currentSavings, monthlyContribution, effMonthlyRate) {
    if (Math.abs(effMonthlyRate) < 1e-9) {
      return monthlyContribution * 12;
    }
    var lnGrowthRate = 12 * Math.log(1 + effMonthlyRate);
    var growth = Math.pow(1 + effMonthlyRate, 12 * t);
    return lnGrowthRate * growth * (currentSavings + monthlyContribution / effMonthlyRate);
  }

  // ── Time to FI via Newton-Raphson on the smooth closed-form ──
  function calculateTimeToFI(currentSavings, monthlyContribution, effMonthlyRate, fiNumber) {
    if (!isFinite(fiNumber) || fiNumber <= 0 || currentSavings >= fiNumber) return 0;

    // If contributions are non-positive and the rate can't grow the balance
    // to target within the horizon, it's simply not reachable.
    var fvAtHorizon = futureValueAt(MAX_HORIZON_YEARS, currentSavings, monthlyContribution, effMonthlyRate);
    if (fvAtHorizon < fiNumber) return Infinity;

    var t = 5; // reasonable initial guess
    var maxIter = 100;
    var tol = 1e-6;

    for (var iter = 0; iter < maxIter; iter++) {
      var fv = futureValueAt(t, currentSavings, monthlyContribution, effMonthlyRate);
      var f = fv - fiNumber;
      var derivative = futureValueDerivativeAt(t, currentSavings, monthlyContribution, effMonthlyRate);

      if (Math.abs(derivative) < 1e-9) break;

      var tNew = t - f / derivative;
      if (tNew < 0) tNew = t / 2;
      if (tNew > MAX_HORIZON_YEARS) tNew = MAX_HORIZON_YEARS;

      if (Math.abs(tNew - t) < tol) return tNew;
      t = tNew;
    }
    return t;
  }

  // ── Year-by-year data for charts — capped resolution so the x-axis
  //    stays readable instead of rendering hundreds of labels. ──
  function generateYearData(currentSavings, monthlyContribution, effMonthlyRate, fiNumber, years) {
    var data = [];
    var horizon = Math.max(1, Math.min(years, MAX_HORIZON_YEARS));
    var pointCount = Math.max(12, Math.min(60, Math.ceil(horizon))); // ~1 point/year, capped
    var stepSize = horizon / pointCount;

    for (var i = 0; i <= pointCount; i++) {
      var t = i * stepSize;
      var balance = futureValueAt(t, currentSavings, monthlyContribution, effMonthlyRate);
      // Target is constant (today's dollars) — matches what the solver
      // actually solves for, since balance already uses real return.
      var progress = fiNumber > 0 ? Math.min(100, (balance / fiNumber) * 100) : 0;
      data.push({ year: t, age: 0, balance: balance, target: fiNumber, progress: progress });
    }
    return data;
  }

  // ── Main calculation ──
  function calculateFIRE(inputs) {
    var fiNumber = calculateFINumber(inputs.annualExpenses, inputs.safeWithdrawalRate);
    var savingsRate = inputs.savingsRate > 0 ? inputs.savingsRate : calculateSavingsRate(inputs.annualIncome, inputs.annualExpenses);

    var monthlySavings = (inputs.annualIncome - inputs.annualExpenses) / 12;
    if (inputs.savingsRate > 0) {
      monthlySavings = (inputs.annualIncome * (inputs.savingsRate / 100)) / 12;
    }

    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var effMonthlyRate = getEffectiveMonthlyRealRate(inputs.annualReturn, inputs.inflationRate, n);

    var timeToFI = calculateTimeToFI(inputs.currentSavings, monthlySavings, effMonthlyRate, fiNumber);
    var ageAtFI = isFinite(timeToFI) ? inputs.currentAge + timeToFI : Infinity;
    var progressToFI = fiNumber > 0 && isFinite(fiNumber) ? Math.min(100, (inputs.currentSavings / fiNumber) * 100) : 0;

    var chartHorizon = isFinite(timeToFI) && timeToFI > 0 ? Math.min(timeToFI + 5, MAX_HORIZON_YEARS) : 30;
    var yearData = generateYearData(inputs.currentSavings, monthlySavings, effMonthlyRate, fiNumber, chartHorizon);
    yearData.forEach(function (d) { d.age = inputs.currentAge + d.year; });

    return {
      fiNumber: fiNumber,
      timeToFI: timeToFI,
      ageAtFI: ageAtFI,
      savingsRate: savingsRate,
      progressToFI: progressToFI,
      netWorth: inputs.currentSavings,
      yearData: yearData,
      monthlySavings: monthlySavings
    };
  }

  // ── Format duration (years) with months rollover ──
  function formatDuration(years) {
    if (years === Infinity || !isFinite(years)) return '∞';
    if (years < 0) return '0';

    var totalMonths = Math.round(years * 12);
    var y = Math.floor(totalMonths / 12);
    var m = totalMonths % 12;

    if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
    var result = y + ' year' + (y !== 1 ? 's' : '');
    if (m > 0) result += ' ' + m + ' month' + (m !== 1 ? 's' : '');
    return result;
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD';
    if (typeof formatCurrency === 'function') return formatCurrency(amount, code);
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: code, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    } catch (e) {
      return code + ' ' + amount.toFixed(2);
    }
  }

  // ── Update Tool ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateFIRE(inputs);

    document.getElementById('output_fiNumber').querySelector('.output-number').textContent = formatCurrencyLocal(result.fiNumber);
    document.getElementById('output_timeToFI').querySelector('.output-number').textContent = formatDuration(result.timeToFI);
    document.getElementById('output_ageAtFI').querySelector('.output-number').textContent = isFinite(result.ageAtFI) ? Math.round(result.ageAtFI) : '∞';
    document.getElementById('output_savingsRateCalculated').querySelector('.output-number').textContent = result.savingsRate.toFixed(1);
    document.getElementById('output_progressToFI').querySelector('.output-number').textContent = result.progressToFI.toFixed(1);
    document.getElementById('output_netWorth').querySelector('.output-number').textContent = formatCurrencyLocal(result.netWorth);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory(inputs);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(result, inputs) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    var currencySymbol = (typeof getCurrencySymbol === 'function')
      ? getCurrencySymbol((typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD')
      : '';
    var yearData = result.yearData;

    if (tab === 'growth') {
      var labels = yearData.map(function (d) { return d.age.toFixed(0); });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Net Worth',
              data: yearData.map(function (d) { return d.balance; }),
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 0
            },
            {
              label: 'FI Target',
              data: yearData.map(function (d) { return d.target; }),
              borderColor: '#2F6F5E',
              backgroundColor: 'transparent',
              fill: false,
              borderDash: [8, 4],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Journey to Financial Independence (Today\'s Dollars)', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: { callback: function (v) { return currencySymbol + v.toFixed(0); } }
            },
            x: { title: { display: true, text: 'Age' } }
          }
        }
      };
    }

    if (tab === 'milestone') {
      var labels2 = yearData.map(function (d) { return d.age.toFixed(0); });
      var progressData = yearData.map(function (d) { return d.progress; });
      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [{
            label: 'Progress to FI (%)',
            data: progressData,
            backgroundColor: progressData.map(function (p) { return p >= 100 ? '#2F6F5E' : '#C08A2E'; }),
            borderColor: progressData.map(function (p) { return p >= 100 ? '#1f4f42' : '#A87520'; }),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Progress to FI Over Time', font: { size: 14 } }
          },
          scales: {
            y: { beginAtZero: true, max: 100, title: { display: true, text: 'Progress (%)' } },
            x: { title: { display: true, text: 'Age' } }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var remaining = Math.max(0, result.fiNumber - result.netWorth);
      var progress = Math.min(result.netWorth, result.fiNumber);
      return {
        type: 'doughnut',
        data: {
          labels: ['Progress to FI', 'Remaining to FI'],
          datasets: [{
            data: [progress, remaining],
            backgroundColor: ['#2F6F5E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Current Progress to FI', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function (ctx) { return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(2); }
              }
            }
          },
          cutout: '60%'
        }
      };
    }
    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool (aligned with the pattern used in other calculators) ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function (el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (el.type === 'number' || el.type === 'text') {
        el.value = defaultVal;
      } else if (el.tagName === 'SELECT') {
        if (defaultVal) el.value = defaultVal;
        else el.selectedIndex = 0;
      }
    });
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  // Currency-picker wiring is handled centrally by initCurrencyPickers()
  // in data.js — no per-tool listener needed here.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function (el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });
    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();
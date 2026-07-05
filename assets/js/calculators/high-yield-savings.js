/* ═══════════════════════════════════════════════════════════
   CRYCAL — High Yield Savings Calculator
   Tool ID: high-yield-savings
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      initialDeposit: parseFloat(document.getElementById('input_initialDeposit').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0,
      apy: parseFloat(document.getElementById('input_apy').value) || 0,
      timeYears: parseFloat(document.getElementById('input_timeYears').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'daily': 365,
      'monthly': 12,
      'quarterly': 4,
      'annually': 1
    };
    return map[frequency] || 12;
  }

  // ── Calculate Future Value ──
  function calculateFutureValue(initialDeposit, monthlyContribution, apy, timeYears, n) {
    var r = apy / 100;
    var PMT = monthlyContribution;
    var perPeriodContribution = PMT * (12 / n);

    var fvInitial = initialDeposit * Math.pow(1 + r / n, n * timeYears);

    var fvContributions = 0;
    if (perPeriodContribution > 0 && r > 0) {
      fvContributions = perPeriodContribution * (Math.pow(1 + r / n, n * timeYears) - 1) / (r / n);
    } else if (perPeriodContribution > 0 && r === 0) {
      fvContributions = perPeriodContribution * n * timeYears;
    }

    return fvInitial + fvContributions;
  }

  // ── Calculate Effective Annual Yield ──
  function calculateEffectiveYield(apy, n) {
    var r = apy / 100;
    return (Math.pow(1 + r / n, n) - 1) * 100;
  }

  // ── Main Calculation ──
  function calculateHYSA(inputs) {
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var initial = inputs.initialDeposit;
    var PMT = inputs.monthlyContribution;
    var r = inputs.apy / 100;
    var t = inputs.timeYears;

    var finalBalance = calculateFutureValue(initial, PMT, inputs.apy, t, n);
    var totalContributions = initial + PMT * 12 * t;
    var totalInterest = finalBalance - totalContributions;
    var effectiveYield = calculateEffectiveYield(inputs.apy, n);
    var monthlyEarnings = totalInterest / (t * 12);

    // Year-by-year data for charts
    var yearData = [];
    var steps = Math.max(50, Math.ceil(t * 12));
    var stepSize = t / steps;

    for (var i = 0; i <= steps; i++) {
      var year = i * stepSize;
      var fv = calculateFutureValue(initial, PMT, inputs.apy, year, n);
      var contribs = initial + PMT * 12 * year;
      var interest = fv - contribs;
      yearData.push({
        year: year,
        total: fv,
        contributions: contribs,
        interest: interest
      });
    }

    // Monthly interest data (for chart)
    var monthlyData = [];
var prevBalance = initial; // start with initial deposit

for (var j = 0; j <= t * 12; j++) {
  var month = j / 12;
  var fvMonth = calculateFutureValue(initial, PMT, inputs.apy, month, n);
  var monthlyInterest = 0;
  if (j > 0) {
    monthlyInterest = fvMonth - prevBalance;
  }
  monthlyData.push({
    month: j,
    balance: fvMonth,
    monthlyInterest: monthlyInterest
  });
  prevBalance = fvMonth;
}

    return {
      finalBalance: finalBalance,
      totalContributions: totalContributions,
      totalInterest: totalInterest,
      effectiveYield: effectiveYield,
      monthlyEarnings: monthlyEarnings,
      yearData: yearData,
      monthlyData: monthlyData,
      n: n,
      r: r,
      t: t,
      initial: initial,
      PMT: PMT
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateHYSA(inputs);

    // Update outputs
    document.getElementById('output_finalBalance').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalBalance);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_effectiveYield').querySelector('.output-number').textContent = result.effectiveYield.toFixed(2);
    document.getElementById('output_monthlyEarnings').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyEarnings);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        initialDeposit: inputs.initialDeposit,
        monthlyContribution: inputs.monthlyContribution,
        apy: inputs.apy,
        timeYears: inputs.timeYears,
        compoundingFrequency: inputs.compoundingFrequency
      };
      window.logHistory(inputSnapshot);
    }

    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Chart Rendering ──
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
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');
    var yearData = result.yearData;

    if (tab === 'growth') {
      var labels = yearData.map(function(d) { return d.year.toFixed(1); });
      var totalData = yearData.map(function(d) { return d.total; });
      var contribData = yearData.map(function(d) { return d.contributions; });
      var interestData = yearData.map(function(d) { return d.interest; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Final Balance',
              data: totalData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Contributions',
              data: contribData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E'
            },
            {
              label: 'Interest Earned',
              data: interestData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [3, 3],
              pointBackgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Savings Growth Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Years' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var final = yearData[yearData.length - 1];
      var initial = inputs.initialDeposit;
      var contributions = final.contributions - initial;
      var interest = final.interest;

      if (interest < 0) interest = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Initial Deposit', 'Monthly Contributions', 'Interest Earned'],
          datasets: [{
            data: [initial, contributions, interest],
            backgroundColor: ['#2F6F5E', '#DCE1E3', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Final Balance', font: { size: 14 } }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'monthly') {
      var monthlyData = result.monthlyData;
      var labels = monthlyData.map(function(d) { return d.month; });
      var interestData2 = monthlyData.map(function(d) { return d.monthlyInterest; });

      // Only show every nth label to avoid clutter
      var step = Math.max(1, Math.floor(labels.length / 30));
      var filteredLabels = labels.map(function(l, i) {
        return i % step === 0 ? l : '';
      });

      return {
        type: 'bar',
        data: {
          labels: filteredLabels,
          datasets: [{
            label: 'Monthly Interest',
            data: interestData2,
            backgroundColor: '#C08A2E',
            borderColor: '#A87520',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Interest Accrual', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Interest (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(2); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) {
        el.value = defaultVal;
      } else if (el.type !== 'select-one') {
        el.value = '';
      }
    });
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') {
        el.value = defaultVal;
      }
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') {
        window.updateTool();
      }
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') {
          window.updateTool();
        }
      });
    }
  });

})();
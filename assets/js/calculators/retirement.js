/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Retirement Calculator
   Tool ID: retirement
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      currentAge: parseFloat(document.getElementById('input_currentAge').value) || 0,
      retirementAge: parseFloat(document.getElementById('input_retirementAge').value) || 0,
      currentSavings: parseFloat(document.getElementById('input_currentSavings').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0,
      annualReturn: parseFloat(document.getElementById('input_annualReturn').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      annualWithdrawal: parseFloat(document.getElementById('input_annualWithdrawal').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'annually': 1,
      'semi-annually': 2,
      'quarterly': 4,
      'monthly': 12,
      'daily': 365
    };
    return map[frequency] || 12;
  }

  // ── Calculate Future Value ──
  function calculateFutureValue(current, monthly, rate, years, n) {
    var r = rate / 100;
    var PMT = monthly;
    var perPeriodContribution = PMT * (12 / n);

    var fvCurrent = current * Math.pow(1 + r / n, n * years);

    var fvContributions = 0;
    if (perPeriodContribution > 0 && r > 0) {
      fvContributions = perPeriodContribution * (Math.pow(1 + r / n, n * years) - 1) / (r / n);
    } else if (perPeriodContribution > 0 && r === 0) {
      fvContributions = perPeriodContribution * n * years;
    }

    return fvCurrent + fvContributions;
  }

  // ── Calculate Sustainable Withdrawal (4% Rule) ──
  function calculateSustainableIncome(savings) {
    return savings * 0.04;
  }

  // ── Calculate Retirement Duration ──
  function calculateRetirementDuration(savings, annualWithdrawal, returnRate, inflationRate) {
    if (annualWithdrawal <= 0) return Infinity;
    if (savings <= 0) return 0;

    var r = returnRate / 100;
    var i = inflationRate / 100;
    var withdrawal = annualWithdrawal;

    // Real return (return - inflation)
    var realReturn = r - i;

    if (realReturn <= 0) {
      return savings / withdrawal;
    }

    // Duration = ln(1 / (1 - (withdrawal * (1 - (1+realReturn)^-n)) / (savings * realReturn)))
    // Simplified: using continuous approximation
    var n = Math.log(1 + (savings * realReturn) / withdrawal) / Math.log(1 + realReturn);
    return n;
  }

  // ── Main Calculation ──
  function calculateRetirement(inputs) {
    var currentAge = inputs.currentAge;
    var retirementAge = inputs.retirementAge;
    var yearsToRetirement = Math.max(0, retirementAge - currentAge);
    var currentSavings = inputs.currentSavings;
    var monthly = inputs.monthlyContribution;
    var rate = inputs.annualReturn;
    var inflation = inputs.inflationRate;
    var withdrawal = inputs.annualWithdrawal;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    // 1. Project savings at retirement
    var savingsAtRetirement = calculateFutureValue(currentSavings, monthly, rate, yearsToRetirement, n);
    var totalContributions = currentSavings + (monthly * 12 * yearsToRetirement);
    var totalReturns = savingsAtRetirement - totalContributions;

    // 2. Sustainable annual income (4% rule)
    var annualIncome = calculateSustainableIncome(savingsAtRetirement);

    // 3. Income gap
    var incomeGap = withdrawal > 0 ? withdrawal - annualIncome : 0;

    // 4. Retirement duration
    var yearsCovered = 0;
    if (withdrawal > 0 && savingsAtRetirement > 0) {
      yearsCovered = calculateRetirementDuration(savingsAtRetirement, withdrawal, rate, inflation);
    } else if (withdrawal > 0 && savingsAtRetirement <= 0) {
      yearsCovered = 0;
    } else {
      yearsCovered = Infinity;
    }

    // 5. Year-by-year data for charts
    var yearData = [];

    // Pre-retirement growth (from current age to retirement)
    var totalYears = yearsToRetirement + 30; // 30 years into retirement
    var steps = Math.max(100, Math.ceil(totalYears * 12));
    var stepSize = totalYears / steps;
    var retirementStartIndex = Math.round(yearsToRetirement / stepSize);

    // Track the drawdown during retirement
    var drawdownBalance = savingsAtRetirement;
    var drawdownYears = 0;

    for (var i = 0; i <= steps; i++) {
      var t = i * stepSize;
      var age = currentAge + t;

      if (age <= retirementAge) {
        // Pre-retirement: growth phase
        var fv = calculateFutureValue(currentSavings, monthly, rate, t, n);
        var contribs = currentSavings + (monthly * 12 * t);
        yearData.push({
          age: age,
          total: fv,
          contributions: contribs,
          returns: fv - contribs,
          phase: 'growth'
        });
      } else {
        // Post-retirement: drawdown phase
        var yearsIntoRetirement = age - retirementAge;
        var adjustedWithdrawal = withdrawal * Math.pow(1 + inflation / 100, yearsIntoRetirement);
        var newBalance = drawdownBalance - adjustedWithdrawal * Math.pow(1 + rate / 100, -1);
        // Simplified drawdown: subtract annual withdrawal
        if (drawdownBalance > 0) {
          var annualizedReturn = rate / 100;
          var yearBalance = drawdownBalance * (1 + annualizedReturn) - adjustedWithdrawal;
          drawdownBalance = Math.max(0, yearBalance);
          drawdownYears = yearsIntoRetirement;
        }

        yearData.push({
          age: age,
          total: drawdownBalance,
          contributions: drawdownBalance,
          returns: 0,
          phase: 'drawdown',
          annualIncome: adjustedWithdrawal,
          drawdownBalance: drawdownBalance
        });
      }
    }

    return {
      savingsAtRetirement: savingsAtRetirement,
      totalContributions: totalContributions,
      totalReturns: totalReturns,
      annualIncome: annualIncome,
      incomeGap: incomeGap,
      yearsCovered: yearsCovered,
      yearData: yearData,
      yearsToRetirement: yearsToRetirement
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

  // ── Format Duration ──
  function formatDuration(years) {
    if (years === Infinity || !isFinite(years)) return '∞ (Indefinite)';
    if (years < 0) return '0';
    if (years < 1) {
      var months = Math.round(years * 12);
      return months + ' month' + (months !== 1 ? 's' : '');
    }
    var y = Math.floor(years);
    var m = Math.round((years - y) * 12);
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateRetirement(inputs);

    // Update outputs
    document.getElementById('output_savingsAtRetirement').querySelector('.output-number').textContent = formatCurrencyLocal(result.savingsAtRetirement);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalReturns').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalReturns);
    document.getElementById('output_annualIncome').querySelector('.output-number').textContent = formatCurrencyLocal(result.annualIncome);
    document.getElementById('output_incomeGap').querySelector('.output-number').textContent = formatCurrencyLocal(result.incomeGap);
    document.getElementById('output_yearsCovered').querySelector('.output-number').textContent = formatDuration(result.yearsCovered);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        monthlyContribution: inputs.monthlyContribution,
        annualReturn: inputs.annualReturn,
        inflationRate: inputs.inflationRate,
        annualWithdrawal: inputs.annualWithdrawal,
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
      var labels = yearData.map(function(d) { return d.age.toFixed(1); });
      var totalData = yearData.map(function(d) { return d.total; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: totalData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Retirement Savings Over Time', font: { size: 14 } }
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
              title: { display: true, text: 'Age' }
            }
          }
        }
      };
    }

    if (tab === 'drawdown') {
      var labels2 = yearData.map(function(d) { return d.age.toFixed(1); });
      var drawdownData = yearData.map(function(d) { return d.phase === 'drawdown' ? d.total : null; });

      return {
        type: 'line',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Retirement Balance',
              data: drawdownData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#B23A3A'
            },
            {
              label: 'Pre-Retirement Growth',
              data: yearData.map(function(d) { return d.phase === 'growth' ? d.total : null; }),
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.05)',
              fill: false,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Retirement Drawdown', font: { size: 14 } }
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
              title: { display: true, text: 'Age' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var contributions = result.totalContributions;
      var returns = result.totalReturns;

      if (returns < 0) returns = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Total Returns'],
          datasets: [{
            data: [contributions, returns],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Retirement Savings', font: { size: 14 } }
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
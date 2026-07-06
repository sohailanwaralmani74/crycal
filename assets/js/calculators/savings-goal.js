/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Savings Goal Calculator
   Tool ID: savings-goal
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      targetAmount: parseFloat(document.getElementById('input_targetAmount').value) || 0,
      currentSavings: parseFloat(document.getElementById('input_currentSavings').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0,
      annualRate: parseFloat(document.getElementById('input_annualRate').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value,
      timeYears: parseFloat(document.getElementById('input_timeYears').value) || 0
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
  function calculateFutureValue(currentSavings, monthlyContribution, annualRate, timeYears, n) {
    var r = annualRate / 100;
    var PMT = monthlyContribution;
    var perPeriodContribution = PMT * (12 / n);

    var fvCurrent = currentSavings * Math.pow(1 + r / n, n * timeYears);

    var fvContributions = 0;
    if (perPeriodContribution > 0 && r > 0) {
      fvContributions = perPeriodContribution * (Math.pow(1 + r / n, n * timeYears) - 1) / (r / n);
    } else if (perPeriodContribution > 0 && r === 0) {
      fvContributions = perPeriodContribution * n * timeYears;
    }

    return fvCurrent + fvContributions;
  }

  // ── Solve for Time (Newton‑Raphson) ──
  function solveForTime(targetAmount, currentSavings, monthlyContribution, annualRate, n) {
    if (currentSavings >= targetAmount) return 0;

    var r = annualRate / 100;
    var PMT = monthlyContribution;
    var perPeriodContribution = PMT * (12 / n);

    if (r === 0 && perPeriodContribution === 0) return Infinity;
    if (r === 0) {
      // Simple linear growth
      var gap = targetAmount - currentSavings;
      return gap / (perPeriodContribution * n);
    }

    // Newton‑Raphson method
    var t = 1; // initial guess
    var maxIterations = 100;
    var tolerance = 0.0001;

    for (var i = 0; i < maxIterations; i++) {
      // F(t) = currentSavings * (1 + r/n)^(n*t) + perPeriodContribution * ((1 + r/n)^(n*t) - 1) / (r/n) - targetAmount
      var factor = Math.pow(1 + r / n, n * t);
      var fv = currentSavings * factor + perPeriodContribution * (factor - 1) / (r / n);
      var f = fv - targetAmount;

      // derivative: F'(t) = n * ln(1 + r/n) * (currentSavings * factor + perPeriodContribution * factor / (r/n))
      var derivative = n * Math.log(1 + r / n) * (currentSavings * factor + perPeriodContribution * factor / (r / n));

      if (Math.abs(derivative) < 1e-12) break;

      var t_new = t - f / derivative;
      if (t_new < 0) t_new = t / 2;
      if (Math.abs(t_new - t) < tolerance) {
        return t_new;
      }
      t = t_new;
    }
    return t;
  }

  // ── Solve for Required Monthly Contribution ──
  function solveForContribution(targetAmount, currentSavings, annualRate, timeYears, n) {
    if (timeYears <= 0) return 0;
    var r = annualRate / 100;
    var factor = Math.pow(1 + r / n, n * timeYears);
    var fvCurrent = currentSavings * factor;

    if (fvCurrent >= targetAmount) return 0;

    var PMT;
    if (r > 0) {
      PMT = (targetAmount - fvCurrent) / ((factor - 1) / (r / n));
    } else {
      PMT = (targetAmount - currentSavings) / (n * timeYears);
    }
    // Convert from per‑period to monthly
    return PMT * (n / 12);
  }

  // ── Main Calculation ──
  function calculateSavingsGoal(inputs) {
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var target = inputs.targetAmount;
    var current = inputs.currentSavings;
    var PMT = inputs.monthlyContribution;
    var r = inputs.annualRate / 100;
    var t = inputs.timeYears;

    var result = {
      timeToGoal: 0,
      finalAmount: 0,
      totalContributions: 0,
      totalInterest: 0,
      requiredMonthly: 0,
      fundingGap: 0,
      yearData: [],
      progressPercentage: 0
    };

    // If target time is set, calculate required monthly contribution
    if (t > 0) {
      result.requiredMonthly = solveForContribution(target, current, inputs.annualRate, t, n);
      // Calculate final balance with the required contribution
      var finalWithRequired = calculateFutureValue(current, result.requiredMonthly, inputs.annualRate, t, n);
      result.finalAmount = finalWithRequired;
      result.totalContributions = current + result.requiredMonthly * 12 * t;
      result.totalInterest = finalWithRequired - result.totalContributions;

      // Generate year data with required contribution
      result.yearData = generateYearData(current, result.requiredMonthly, inputs.annualRate, t, n, target);
      result.fundingGap = Math.max(0, target - current);
      result.progressPercentage = Math.min(100, (finalWithRequired / target) * 100);
      result.timeToGoal = t;
    } else {
      // Calculate time to reach goal
      var timeNeeded = solveForTime(target, current, PMT, inputs.annualRate, n);
      result.timeToGoal = timeNeeded;

      var finalT = (timeNeeded === Infinity || !isFinite(timeNeeded)) ? 50 : timeNeeded;
      var final = calculateFutureValue(current, PMT, inputs.annualRate, finalT, n);
      result.finalAmount = final;
      result.totalContributions = current + PMT * 12 * finalT;
      result.totalInterest = final - result.totalContributions;

      result.yearData = generateYearData(current, PMT, inputs.annualRate, finalT, n, target);
      result.fundingGap = Math.max(0, target - current);
      result.progressPercentage = Math.min(100, (final / target) * 100);
      result.requiredMonthly = 0;
    }

    return result;
  }

  // ── Generate Year‑by‑Year Data ──
  function generateYearData(currentSavings, monthlyContribution, annualRate, timeYears, n, target) {
    var data = [];
    var r = annualRate / 100;
    var PMT = monthlyContribution;
    var perPeriodContribution = PMT * (12 / n);

    var steps = Math.max(50, Math.ceil(timeYears * 12));
    var stepSize = timeYears / steps;

    for (var i = 0; i <= steps; i++) {
      var t = i * stepSize;
      var factor = Math.pow(1 + r / n, n * t);
      var fvCurrent = currentSavings * factor;
      var fvContributions = 0;
      if (perPeriodContribution > 0 && r > 0) {
        fvContributions = perPeriodContribution * (factor - 1) / (r / n);
      } else if (perPeriodContribution > 0 && r === 0) {
        fvContributions = perPeriodContribution * n * t;
      }
      var total = fvCurrent + fvContributions;
      var contributions = currentSavings + (PMT * 12 * t);
      var interest = total - contributions;
      data.push({
        year: t,
        total: total,
        contributions: contributions,
        interest: interest,
        target: target
      });
    }
    return data;
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

  // ── Format Time ──
  function formatTime(years) {
    if (years === Infinity || !isFinite(years)) return '∞';
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
    var result = calculateSavingsGoal(inputs);

    // Update outputs
    document.getElementById('output_timeToGoal').querySelector('.output-number').textContent = formatTime(result.timeToGoal);
    document.getElementById('output_finalAmount').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalAmount);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_requiredMonthly').querySelector('.output-number').textContent = formatCurrencyLocal(result.requiredMonthly);
    document.getElementById('output_fundingGap').querySelector('.output-number').textContent = formatCurrencyLocal(result.fundingGap);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        targetAmount: inputs.targetAmount,
        currentSavings: inputs.currentSavings,
        monthlyContribution: inputs.monthlyContribution,
        annualRate: inputs.annualRate,
        compoundingFrequency: inputs.compoundingFrequency,
        timeYears: inputs.timeYears
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
      var targetData = yearData.map(function(d) { return d.target; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Balance',
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
            },
            {
              label: 'Target Amount',
              data: targetData,
              borderColor: '#1a5276',
              backgroundColor: 'rgba(26, 82, 118, 0.05)',
              fill: false,
              tension: 0.1,
              borderDash: [8, 4],
              pointBackgroundColor: '#1a5276',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Growth Over Time', font: { size: 14 } }
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

    if (tab === 'progress') {
      var final = yearData[yearData.length - 1];
      var target = inputs.targetAmount;
      var current = Math.min(final.total, target);
      var remaining = Math.max(0, target - current);

      var progress = target > 0 ? (current / target * 100) : 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Progress (' + progress.toFixed(1) + '%)', 'Remaining'],
          datasets: [{
            data: [current, remaining],
            backgroundColor: ['#2F6F5E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Progress Towards Target', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(context) {
                  var label = context.label || '';
                  var value = context.parsed || 0;
                  return label + ': ' + currencySymbol + value.toFixed(2);
                }
              }
            }
          },
          cutout: '65%'
        }
      };
    }

    if (tab === 'breakdown') {
      var final2 = yearData[yearData.length - 1];
      var principal = inputs.currentSavings;
      var contributions = final2.contributions - principal;
      var interest = final2.interest;

      if (interest < 0) interest = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Current Savings', 'Total Contributions', 'Interest Earned'],
          datasets: [{
            data: [principal, contributions, interest],
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
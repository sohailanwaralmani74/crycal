/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Retirement Withdrawal Calculator
   Tool ID: retirement-withdrawal
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'balance';

  // ── Get Inputs ──
  function getInputs() {
    return {
      currentAge: parseFloat(document.getElementById('input_currentAge').value) || 0,
      retirementSavings: parseFloat(document.getElementById('input_retirementSavings').value) || 0,
      annualWithdrawal: parseFloat(document.getElementById('input_annualWithdrawal').value) || 0,
      annualReturn: parseFloat(document.getElementById('input_annualReturn').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      withdrawalAdjustment: document.getElementById('input_withdrawalAdjustment').value,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value,
      sustainableRate: parseFloat(document.getElementById('input_sustainableRate').value) || 4.0
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

  // ── Simulate Retirement Withdrawals ──
  function simulateWithdrawal(inputs) {
    var age = inputs.currentAge;
    var balance = inputs.retirementSavings;
    var withdrawal = inputs.annualWithdrawal;
    var annualReturn = inputs.annualReturn / 100;
    var inflationRate = inputs.inflationRate / 100;
    var adjustment = inputs.withdrawalAdjustment;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var maxAge = 99;
    var yearData = [];
    var totalWithdrawn = 0;
    var yearsLasted = 0;

    // User-defined sustainable withdrawal rate (global-friendly)
    var sustainableRate = inputs.sustainableRate || 4.0;
    var sustainableWithdrawal = inputs.retirementSavings * (sustainableRate / 100);

    // If no withdrawal, funds last forever
    if (withdrawal <= 0) {
      return {
        yearsFundsLast: Infinity,
        sustainableWithdrawal: sustainableWithdrawal,
        totalWithdrawn: 0,
        endingBalance: balance,
        withdrawalRate: 0,
        yearData: [{ age: age, balance: balance, withdrawal: 0, return: 0 }]
      };
    }

    // If no savings, funds last 0 years
    if (balance <= 0) {
      return {
        yearsFundsLast: 0,
        sustainableWithdrawal: 0,
        totalWithdrawn: 0,
        endingBalance: 0,
        withdrawalRate: 0,
        yearData: [{ age: age, balance: 0, withdrawal: 0, return: 0 }]
      };
    }

    // Calculate current withdrawal rate
    var withdrawalRate = (withdrawal / inputs.retirementSavings) * 100;

    var withdrawalAmount = withdrawal;
    var yearCounter = 0;
    var startingBalance = balance;

    // Simulate year by year
    while (age < maxAge && balance > 0 && yearCounter < 100) {
      yearCounter++;

      // Apply investment return
      var returnAmount = balance * (Math.pow(1 + annualReturn / n, n) - 1);
      var newBalance = balance + returnAmount;

      // Apply withdrawal
      newBalance = Math.max(0, newBalance - withdrawalAmount);

      // Record data for this year
      yearData.push({
        age: age,
        balance: newBalance,
        withdrawal: withdrawalAmount,
        return: returnAmount,
        balanceBefore: balance
      });

      totalWithdrawn += withdrawalAmount;
      balance = newBalance;
      age++;

      // Adjust withdrawal for inflation if applicable
      if (adjustment === 'inflation-adjusted') {
        withdrawalAmount = withdrawalAmount * (1 + inflationRate);
      }

      yearsLasted = yearCounter;

      // Safety: prevent infinite loop
      if (balance > 0 && withdrawalAmount > balance * 1.5 && yearCounter > 50) break;
    }

    // If balance still > 0 at max age, funds lasted indefinitely
    var finalYears = (balance > 0 && age >= maxAge) ? Infinity : yearsLasted;

    return {
      yearsFundsLast: finalYears,
      sustainableWithdrawal: sustainableWithdrawal,
      totalWithdrawn: totalWithdrawn,
      endingBalance: balance,
      withdrawalRate: withdrawalRate,
      yearData: yearData
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
    var result = simulateWithdrawal(inputs);

    // Update outputs
    document.getElementById('output_yearsFundsLast').querySelector('.output-number').textContent = formatDuration(result.yearsFundsLast);
    document.getElementById('output_sustainableWithdrawal').querySelector('.output-number').textContent = formatCurrencyLocal(result.sustainableWithdrawal);
    document.getElementById('output_totalWithdrawn').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalWithdrawn);
    document.getElementById('output_endingBalance').querySelector('.output-number').textContent = formatCurrencyLocal(result.endingBalance);
    document.getElementById('output_withdrawalRate').querySelector('.output-number').textContent = result.withdrawalRate.toFixed(2);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        currentAge: inputs.currentAge,
        retirementSavings: inputs.retirementSavings,
        annualWithdrawal: inputs.annualWithdrawal,
        annualReturn: inputs.annualReturn,
        inflationRate: inputs.inflationRate,
        withdrawalAdjustment: inputs.withdrawalAdjustment,
        compoundingFrequency: inputs.compoundingFrequency,
        sustainableRate: inputs.sustainableRate
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

    if (!yearData || yearData.length === 0) {
      return {
        type: 'line',
        data: {
          labels: ['0'],
          datasets: [
            {
              label: 'Balance',
              data: [inputs.retirementSavings],
              borderColor: '#C08A2E',
              pointBackgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Retirement Balance', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            }
          }
        }
      };
    }

    if (tab === 'balance') {
      var labels = yearData.map(function(d) { return d.age; });
      var balanceData = yearData.map(function(d) { return d.balance; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Remaining Balance',
              data: balanceData,
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
            title: { display: true, text: 'Retirement Balance Over Time', font: { size: 14 } }
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

    if (tab === 'withdrawals') {
      var labels2 = yearData.map(function(d) { return d.age; });
      var withdrawalData = yearData.map(function(d) { return d.withdrawal; });
      var returnData = yearData.map(function(d) { return d.return; });

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Withdrawals',
              data: withdrawalData,
              backgroundColor: '#B23A3A',
              borderColor: '#8a2a2a',
              borderWidth: 0
            },
            {
              label: 'Investment Returns',
              data: returnData,
              backgroundColor: '#2F6F5E',
              borderColor: '#1f4f42',
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Withdrawals vs Returns', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
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
      var final = yearData[yearData.length - 1];
      var totalWithdrawn = result.totalWithdrawn;
      var endingBalance = result.endingBalance;
      var returns = yearData.reduce(function(sum, d) { return sum + (d.return || 0); }, 0);

      if (endingBalance < 0) endingBalance = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Withdrawn', 'Ending Balance', 'Investment Returns'],
          datasets: [{
            data: [totalWithdrawn, endingBalance, returns],
            backgroundColor: ['#B23A3A', '#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Withdrawn Funds', font: { size: 14 } }
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
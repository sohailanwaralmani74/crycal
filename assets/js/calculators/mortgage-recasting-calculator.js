(function() {

  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var loanBalance = parseFloat(document.getElementById('input_loanBalance').value) || 0;
    var interestRate = parseFloat(document.getElementById('input_interestRate').value) || 0;
    var remainingTerm = parseFloat(document.getElementById('input_remainingTerm').value) || 0;
    var lumpSumPayment = parseFloat(document.getElementById('input_lumpSumPayment').value) || 0;
    var recastFee = parseFloat(document.getElementById('input_recastFee').value) || 0;
    var originalTerm = parseFloat(document.getElementById('input_originalTerm').value) || 0;
    var originalRate = parseFloat(document.getElementById('input_originalRate').value) || 0;

    return {
      loanBalance: loanBalance,
      interestRate: interestRate / 100,
      remainingTerm: remainingTerm,
      lumpSumPayment: lumpSumPayment,
      recastFee: recastFee,
      originalTerm: originalTerm,
      originalRate: originalRate / 100
    };
  }

  // ── Format Currency ──
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

  // ── Calculate Monthly Payment ──
  function calculateMonthlyPayment(principal, annualRate, years) {
    var months = years * 12;
    var monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  // ── Calculate Total Interest ──
  function calculateTotalInterest(principal, annualRate, years) {
    var monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
    var totalPaid = monthlyPayment * years * 12;
    return totalPaid - principal;
  }

  // ── Core Calculation ──
  function calculateRecast(inputs) {
    var balance = inputs.loanBalance;
    var rate = inputs.interestRate;
    var remaining = inputs.remainingTerm;
    var lumpSum = inputs.lumpSumPayment;
    var fee = inputs.recastFee;
    var origTerm = inputs.originalTerm;
    var origRate = inputs.originalRate;

    if (balance <= 0 || rate <= 0 || remaining <= 0 || lumpSum <= 0) {
      return { error: 'Enter valid loan details and lump‑sum payment' };
    }

    // ── Current Path ──
    var currentPayment = calculateMonthlyPayment(balance, rate, remaining);
    var currentTotalInterest = calculateTotalInterest(balance, rate, remaining);

    // ── Recast Path ──
    var newBalance = Math.max(0, balance - lumpSum);
    var recastPayment = calculateMonthlyPayment(newBalance, rate, remaining);
    var recastTotalInterest = calculateTotalInterest(newBalance, rate, remaining);

    // ── Savings ──
    var monthlySavings = currentPayment - recastPayment;
    var interestSavings = currentTotalInterest - recastTotalInterest;

    // ── Break‑Even ──
    var breakEvenMonths = fee > 0 ? Math.ceil(fee / monthlySavings) : 0;

    // ── Recommendation ──
    var recommendation = '';
    if (monthlySavings <= 0) {
      recommendation = 'No monthly savings. Recasting may not be beneficial.';
    } else if (monthlySavings > 0 && breakEvenMonths < 12) {
      recommendation = '✅ Recast is recommended — break‑even in less than 12 months.';
    } else if (monthlySavings > 0 && breakEvenMonths < 24) {
      recommendation = '✅ Recast is beneficial — break‑even within 24 months.';
    } else if (monthlySavings > 0 && breakEvenMonths < 48) {
      recommendation = '🟡 Recast is moderately beneficial — break‑even within 4 years.';
    } else if (monthlySavings > 0) {
      recommendation = '⚠️ Recast is beneficial but break‑even is long. Consider refinancing instead.';
    } else {
      recommendation = '❌ Recast may not be worth the cost.';
    }

    // ── Data for Charts ──
    var paymentData = {
      'Current Payment': currentPayment,
      'Recast Payment': recastPayment
    };

    var interestData = {
      'Current Interest': currentTotalInterest,
      'Recast Interest': recastTotalInterest
    };

    return {
      currentPayment: currentPayment,
      recastPayment: recastPayment,
      monthlySavings: monthlySavings,
      currentTotalInterest: currentTotalInterest,
      recastTotalInterest: recastTotalInterest,
      interestSavings: interestSavings,
      breakEvenMonths: breakEvenMonths,
      recommendation: recommendation,
      paymentData: paymentData,
      interestData: interestData,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.loanBalance <= 0 || inputs.interestRate <= 0 || inputs.remainingTerm <= 0 || inputs.lumpSumPayment <= 0) {
      setOutputText('output_currentPayment', '—');
      setOutputText('output_recastPayment', '—');
      setOutputText('output_monthlySavings', '—');
      setOutputText('output_totalInterestOriginal', '—');
      setOutputText('output_totalInterestRecast', '—');
      setOutputText('output_interestSavings', '—');
      setOutputText('output_breakEvenMonths', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateRecast(inputs);

    if (result.error) {
      setOutputText('output_currentPayment', '—');
      setOutputText('output_recastPayment', '—');
      setOutputText('output_monthlySavings', '—');
      setOutputText('output_totalInterestOriginal', '—');
      setOutputText('output_totalInterestRecast', '—');
      setOutputText('output_interestSavings', '—');
      setOutputText('output_breakEvenMonths', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_currentPayment', formatCurrency(result.currentPayment));
    setOutputText('output_recastPayment', formatCurrency(result.recastPayment));
    setOutputText('output_monthlySavings', formatCurrency(result.monthlySavings));
    setOutputText('output_totalInterestOriginal', formatCurrency(result.currentTotalInterest));
    setOutputText('output_totalInterestRecast', formatCurrency(result.recastTotalInterest));
    setOutputText('output_interestSavings', formatCurrency(result.interestSavings));
    setOutputText('output_breakEvenMonths', result.breakEvenMonths + ' months');
    setOutputText('output_recommendation', result.recommendation);

    var chartPayload = {
      paymentData: result.paymentData,
      interestData: result.interestData,
      currentPayment: result.currentPayment,
      recastPayment: result.recastPayment,
      currentInterest: result.currentTotalInterest,
      recastInterest: result.recastTotalInterest,
      monthlySavings: result.monthlySavings,
      interestSavings: result.interestSavings
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        loanBalance: inputs.loanBalance,
        lumpSumPayment: inputs.lumpSumPayment,
        currentPayment: result.currentPayment,
        recastPayment: result.recastPayment,
        interestSavings: result.interestSavings
      });
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'comparison') {
      var labels = ['Current Payment', 'Recast Payment'];
      var values = [data.currentPayment, data.recastPayment];

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Payment',
            data: values,
            backgroundColor: ['#D95B43', '#4ade80'],
            borderColor: ['#B84A32', '#3a9b6c'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Monthly Payment Comparison',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
            }
          }
        }
      };
    }

    if (tab === 'interest') {
      var labels = ['Current Interest', 'Recast Interest'];
      var values = [data.currentInterest, data.recastInterest];

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Interest',
            data: values,
            backgroundColor: ['#D95B43', '#4ade80'],
            borderColor: ['#B84A32', '#3a9b6c'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Total Interest Comparison',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
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
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_loanBalance').value = 250000;
    document.getElementById('input_interestRate').value = 6.5;
    document.getElementById('input_remainingTerm').value = 25;
    document.getElementById('input_lumpSumPayment').value = 50000;
    document.getElementById('input_recastFee').value = 0;
    document.getElementById('input_originalTerm').value = 30;
    document.getElementById('input_originalRate').value = 6.5;
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
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
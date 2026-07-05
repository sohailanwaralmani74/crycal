/* ═══════════════════════════════════════════════════════════
   CRYCAL — Emergency Fund Calculator
   Tool ID: emergency-fund
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      housingExpenses: parseFloat(document.getElementById('input_housingExpenses').value) || 0,
      foodExpenses: parseFloat(document.getElementById('input_foodExpenses').value) || 0,
      transportationExpenses: parseFloat(document.getElementById('input_transportationExpenses').value) || 0,
      insuranceExpenses: parseFloat(document.getElementById('input_insuranceExpenses').value) || 0,
      debtPayments: parseFloat(document.getElementById('input_debtPayments').value) || 0,
      healthcareExpenses: parseFloat(document.getElementById('input_healthcareExpenses').value) || 0,
      personalExpenses: parseFloat(document.getElementById('input_personalExpenses').value) || 0,
      currentSavings: parseFloat(document.getElementById('input_currentSavings').value) || 0,
      targetMonths: parseFloat(document.getElementById('input_targetMonths').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
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

    // ── Total Monthly Expenses ──
    var totalExpenses = inputs.housingExpenses + inputs.foodExpenses + inputs.transportationExpenses +
                        inputs.insuranceExpenses + inputs.debtPayments + inputs.healthcareExpenses +
                        inputs.personalExpenses;

    // ── Emergency Fund Target ──
    var fundTarget = totalExpenses * inputs.targetMonths;

    // ── Amount Still Needed ──
    var amountNeeded = Math.max(0, fundTarget - inputs.currentSavings);

    // ── Progress Percentage ──
    var progress = fundTarget > 0 ? (inputs.currentSavings / fundTarget) * 100 : 0;
    progress = Math.min(progress, 100);

    // ── Months to Reach Target ──
    var monthsToReach = inputs.monthlyContribution > 0 ? Math.ceil(amountNeeded / inputs.monthlyContribution) : 0;

    // ── Update Outputs ──
    document.getElementById('output_totalMonthlyExpenses').querySelector('.output-number').textContent = formatCurrency(totalExpenses);
    document.getElementById('output_emergencyFundTarget').querySelector('.output-number').textContent = formatCurrency(fundTarget);
    document.getElementById('output_amountNeeded').querySelector('.output-number').textContent = formatCurrency(amountNeeded);
    document.getElementById('output_progressPercentage').querySelector('.output-number').textContent = progress.toFixed(1) + '%';
    document.getElementById('output_monthsToReachTarget').querySelector('.output-number').textContent = monthsToReach > 0 ? monthsToReach + ' months' : '—';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var expenseItems = [
        { label: 'Housing', amount: inputs.housingExpenses, color: '#2C3E50' },
        { label: 'Food & Groceries', amount: inputs.foodExpenses, color: '#C08A2E' },
        { label: 'Transportation', amount: inputs.transportationExpenses, color: '#4A90D9' },
        { label: 'Insurance', amount: inputs.insuranceExpenses, color: '#8E44AD' },
        { label: 'Debt Payments', amount: inputs.debtPayments, color: '#B23A3A' },
        { label: 'Healthcare', amount: inputs.healthcareExpenses, color: '#1ABC9C' },
        { label: 'Personal & Other', amount: inputs.personalExpenses, color: '#F39C12' }
      ];

      var activeExpenses = expenseItems.filter(function(d) { return d.amount > 0; });

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      if (activeExpenses.length > 0) {
        activeExpenses.forEach(function(item) {
          var pct = totalExpenses > 0 ? (item.amount / totalExpenses * 100) : 0;
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + item.label + '</span>';
          html += '<span><strong>' + formatCurrency(item.amount) + '</strong> (' + pct.toFixed(0) + '%)</span>';
          html += '</div>';
        });
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-top: 0.0625rem solid var(--border-default); font-weight: 600; grid-column: 1 / -1;">';
        html += '<span>Total Monthly Expenses</span>';
        html += '<span>' + formatCurrency(totalExpenses) + '</span>';
        html += '</div>';
      } else {
        html += '<div style="grid-column: 1 / -1; color: var(--text-muted); text-align: center; padding: 0.5rem;">Enter your expenses to see breakdown</div>';
      }

      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      totalExpenses: totalExpenses,
      fundTarget: fundTarget,
      currentSavings: inputs.currentSavings,
      amountNeeded: amountNeeded,
      progress: progress,
      monthsToReach: monthsToReach,
      housing: inputs.housingExpenses,
      food: inputs.foodExpenses,
      transportation: inputs.transportationExpenses,
      insurance: inputs.insuranceExpenses,
      debt: inputs.debtPayments,
      healthcare: inputs.healthcareExpenses,
      personal: inputs.personalExpenses
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        totalMonthlyExpenses: totalExpenses,
        emergencyFundTarget: fundTarget,
        currentSavings: inputs.currentSavings,
        progressPercentage: progress.toFixed(1)
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    var expenseCategories = [
      { label: 'Housing', value: data.housing, color: '#2C3E50' },
      { label: 'Food', value: data.food, color: '#C08A2E' },
      { label: 'Transportation', value: data.transportation, color: '#4A90D9' },
      { label: 'Insurance', value: data.insurance, color: '#8E44AD' },
      { label: 'Debt', value: data.debt, color: '#B23A3A' },
      { label: 'Healthcare', value: data.healthcare, color: '#1ABC9C' },
      { label: 'Personal', value: data.personal, color: '#F39C12' }
    ];

    var filtered = expenseCategories.filter(function(c) { return c.value > 0; });

    if (tab === 'breakdown') {
      if (filtered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No expenses'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No expenses entered', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'doughnut',
        data: {
          labels: filtered.map(function(f) { return f.label; }),
          datasets: [{
            data: filtered.map(function(f) { return f.value; }),
            backgroundColor: filtered.map(function(f) { return f.color; }),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Monthly Expense Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toFixed(2) + ' (' + pct + '%)';
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'progress') {
      var remaining = Math.max(0, data.fundTarget - data.currentSavings);
      var saved = Math.min(data.currentSavings, data.fundTarget);

      return {
        type: 'doughnut',
        data: {
          labels: ['Saved (' + data.progress.toFixed(0) + '%)', 'Remaining'],
          datasets: [{
            data: [saved, remaining],
            backgroundColor: ['#2F6F5E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Progress to Emergency Fund Target', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  return label + ': ' + currencySymbol + value.toFixed(2);
                }
              }
            }
          },
          cutout: '65%'
        }
      };
    }

    if (tab === 'comparison') {
      var monthsData = [];
      var monthsLabels = [];
      var monthsToReach = data.monthsToReach;
      var step = 6;

      if (monthsToReach > 0) {
        var steps = Math.ceil(monthsToReach / step);
        for (var i = 0; i <= steps; i++) {
          var month = i * step;
          var saved = data.currentSavings + (data.monthlyContribution * month);
          monthsLabels.push(month + ' months');
          monthsData.push(Math.min(saved, data.fundTarget));
        }
      } else {
        monthsLabels = ['Current'];
        monthsData = [data.currentSavings];
      }

      return {
        type: 'bar',
        data: {
          labels: monthsLabels,
          datasets: [{
            label: 'Savings Progress',
            data: monthsData,
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
            title: { display: true, text: 'Savings Timeline', font: { size: 14 } },
            annotation: {
              annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: data.fundTarget,
                borderColor: '#2F6F5E',
                borderWidth: 2,
                borderDash: [6, 4],
                label: {
                  content: 'Target: ' + currencySymbol + data.fundTarget.toFixed(0),
                  enabled: true,
                  position: 'end'
                }
              }]
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Time' }
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
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_housingExpenses').value = 1500;
    document.getElementById('input_foodExpenses').value = 600;
    document.getElementById('input_transportationExpenses').value = 400;
    document.getElementById('input_insuranceExpenses').value = 200;
    document.getElementById('input_debtPayments').value = 300;
    document.getElementById('input_healthcareExpenses').value = 150;
    document.getElementById('input_personalExpenses').value = 200;
    document.getElementById('input_currentSavings').value = 0;
    document.getElementById('input_targetMonths').value = 6;
    document.getElementById('input_monthlyContribution').value = 200;
    if (typeof window.updateTool === 'function') window.updateTool();
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
  });

})();
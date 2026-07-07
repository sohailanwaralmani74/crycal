/* ═══════════════════════════════════════════════════════════
   CRYCAL — Biweekly Budget Calculator
   Tool ID: biweekly-budget
   ALL amounts are biweekly (expenses match pay cycle)
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var expenses = [];
  var expenseIdCounter = 0;

  // ── Default Expenses (Biweekly Amounts) ──
  var defaultExpenses = [
    { id: 'exp_1', name: 'Rent', amount: 600 },
    { id: 'exp_2', name: 'Groceries', amount: 200 },
    { id: 'exp_3', name: 'Utilities', amount: 75 },
    { id: 'exp_4', name: 'Transportation', amount: 100 },
    { id: 'exp_5', name: 'Insurance', amount: 50 }
  ];

  var incomeInput = document.getElementById('input_biweeklyIncome');
  var otherIncomeInput = document.getElementById('input_otherIncome');
  var expenseListEl = document.getElementById('expenseListByWeekly');
  var addExpenseBtn = document.getElementById('addExpenseBtnByWeekly');

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

  // ── Render Expenses ──
  function renderExpenses() {
    if (!expenseListEl) return;
    expenseListEl.innerHTML = '';

    if (expenses.length === 0) {
      expenseListEl.innerHTML = '<div style="color: var(--text-muted); padding: 0.5rem; text-align: center;">No expenses added.</div>';
      return;
    }

    expenses.forEach(function(exp) {
      var div = document.createElement('div');
      div.className = 'debt-item';
      div.dataset.id = exp.id;
      div.innerHTML = `
        <div class="debt-item-row">
          <div class="debt-field">
            <label>Expense Name</label>
            <input type="text" class="exp-name" value="${exp.name}" placeholder="e.g., Rent">
          </div>
          <div class="debt-field">
            <label>Biweekly Amount</label>
            <input type="number" class="exp-amount" value="${exp.amount}" step="10" min="0">
          </div>
          <button class="btn-debt-remove" data-id="${exp.id}">✕</button>
        </div>
      `;
      expenseListEl.appendChild(div);
    });

    expenseListEl.querySelectorAll('.btn-debt-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.id;
        expenses = expenses.filter(function(e) { return e.id !== id; });
        renderExpenses();
        updateTool();
      });
    });

    expenseListEl.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        updateExpensesFromUI();
        updateTool();
      });
      input.addEventListener('change', function() {
        updateExpensesFromUI();
        updateTool();
      });
    });

    updateExpensesFromUI();
  }

  function updateExpensesFromUI() {
    if (!expenseListEl) return;
    var items = expenseListEl.querySelectorAll('.debt-item');
    var newExpenses = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.exp-name') ? item.querySelector('.exp-name').value : 'Unnamed Expense';
      var amount = item.querySelector('.exp-amount') ? parseFloat(item.querySelector('.exp-amount').value) || 0 : 0;
      newExpenses.push({ id: id, name: name, amount: amount });
    });
    expenses = newExpenses;
  }

  function addExpense() {
    expenseIdCounter++;
    expenses.push({
      id: 'exp_' + expenseIdCounter,
      name: 'New Expense',
      amount: 50
    });
    renderExpenses();
    updateTool();
  }

  function getInputs() {
    return {
      biweeklyIncome: incomeInput ? parseFloat(incomeInput.value) || 0 : 0,
      otherIncome: otherIncomeInput ? parseFloat(otherIncomeInput.value) || 0 : 0
    };
  }

  // ── Calculate (All amounts are biweekly) ──
  function calculate() {
    var inputs = getInputs();
    var expenseData = expenses;

    // Total income for this biweekly period
    var totalIncome = inputs.biweeklyIncome + inputs.otherIncome;
    var totalExpenses = expenseData.reduce(function(sum, e) { return sum + e.amount; }, 0);
    var remaining = totalIncome - totalExpenses;

    var status = remaining > 0 ? 'Surplus' : (remaining < 0 ? 'Deficit' : 'Balanced');

    return {
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      remaining: remaining,
      status: status
    };
  }

  // ── Update Outputs ──
  function updateTool() {
    var result = calculate();

    document.getElementById('output_totalIncome').querySelector('.output-number').textContent = formatCurrency(result.totalIncome) + ' / biweekly';
    document.getElementById('output_totalExpenses').querySelector('.output-number').textContent = formatCurrency(result.totalExpenses) + ' / biweekly';
    document.getElementById('output_remaining').querySelector('.output-number').textContent = formatCurrency(result.remaining) + ' (' + result.status + ')';
    document.getElementById('output_biweeklyRemaining').querySelector('.output-number').textContent = formatCurrency(result.remaining);

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';
      if (expenses.length > 0) {
        expenses.forEach(function(exp) {
          var pct = result.totalIncome > 0 ? (exp.amount / result.totalIncome * 100) : 0;
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + exp.name + '</span>';
          html += '<span><strong>' + formatCurrency(exp.amount) + '</strong> (' + pct.toFixed(0) + '%)</span>';
          html += '</div>';
        });
      } else {
        html += '<div style="grid-column: 1 / -1; color: var(--text-muted); text-align: center; padding: 0.5rem;">No expenses added.</div>';
      }
      html += '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0; border-top: 0.125rem solid var(--text-primary); margin-top: 0.3rem; grid-column: 1 / -1; font-weight: 700;">';
      html += '<span>Remaining</span>';
      html += '<span style="color: ' + (result.remaining >= 0 ? 'var(--profit)' : 'var(--loss)') + ';">' + formatCurrency(result.remaining) + '</span>';
      html += '</div></div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      totalIncome: result.totalIncome,
      totalExpenses: result.totalExpenses,
      remaining: result.remaining,
      expenseData: expenses
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalIncome: result.totalIncome,
        totalExpenses: result.totalExpenses,
        remaining: result.remaining
      });
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
    var expenseData = data.expenseData || [];

    if (tab === 'breakdown') {
      if (expenseData.length === 0) {
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
      var labels = expenseData.map(function(e) { return e.name; });
      var amounts = expenseData.map(function(e) { return e.amount; });
      var colors = ['#C08A2E', '#2F6F5E', '#4A90D9', '#B23A3A', '#8E44AD', '#2C3E50', '#F39C12', '#1ABC9C', '#DCE1E3'];
      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: amounts,
            backgroundColor: colors.slice(0, amounts.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Expense Breakdown', font: { size: 14 } },
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

    if (tab === 'comparison') {
      var income = data.totalIncome;
      var expenses = data.totalExpenses;
      var remaining = data.remaining;
      return {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses', 'Remaining'],
          datasets: [{
            label: 'Amount',
            data: [income, expenses, remaining],
            backgroundColor: ['#2F6F5E', '#B23A3A', remaining >= 0 ? '#2F6F5E' : '#B23A3A'],
            borderColor: ['#1f4f42', '#8a2a2a', remaining >= 0 ? '#1f4f42' : '#8a2a2a'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income vs Expenses', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            }
          }
        }
      };
    }
    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  function resetTool() {
    expenses = JSON.parse(JSON.stringify(defaultExpenses));
    expenseIdCounter = expenses.length;
    renderExpenses();
    if (incomeInput) incomeInput.value = 2000;
    if (otherIncomeInput) otherIncomeInput.value = 0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;
  window.addExpense = addExpense;
  window.renderExpenses = renderExpenses;

  document.addEventListener('DOMContentLoaded', function() {
    expenses = JSON.parse(JSON.stringify(defaultExpenses));
    expenseIdCounter = expenses.length;
    renderExpenses();

    if (incomeInput) {
      incomeInput.addEventListener('input', updateTool);
      incomeInput.addEventListener('change', updateTool);
    }
    if (otherIncomeInput) {
      otherIncomeInput.addEventListener('input', updateTool);
      otherIncomeInput.addEventListener('change', updateTool);
    }

    if (addExpenseBtn) {
      addExpenseBtn.addEventListener('click', function() {
        if (typeof window.addExpense === 'function') window.addExpense();
      });
    }

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);
  });

})();
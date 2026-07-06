/* ═══════════════════════════════════════════════════════════
   CRYCAL — Zero-Based Budget Calculator
   Tool ID: zero-based-budget
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  var incomeCounter = 0;
  var expenseCounter = 0;
  var incomes = [];
  var expenses = [];

  // ── Default entries ──
  var defaultIncomes = [
    { id: 'inc_' + (++incomeCounter), name: 'Salary', amount: 5000 }
  ];

  var defaultExpenses = [
    { id: 'exp_' + (++expenseCounter), name: 'Rent', amount: 1500 },
    { id: 'exp_' + (++expenseCounter), name: 'Groceries', amount: 600 },
    { id: 'exp_' + (++expenseCounter), name: 'Utilities', amount: 200 },
    { id: 'exp_' + (++expenseCounter), name: 'Transportation', amount: 400 },
    { id: 'exp_' + (++expenseCounter), name: 'Savings', amount: 500 },
    { id: 'exp_' + (++expenseCounter), name: 'Entertainment', amount: 300 },
    { id: 'exp_' + (++expenseCounter), name: 'Other', amount: 1500 }
  ];

  // ── Get Inputs ──
  function getInputs() {
    return {
      payFrequency: document.getElementById('input_payFrequency').value || 'monthly',
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'monthly'
    };
  }

  // ── Get incomes from UI ──
  function getIncomesFromUI() {
    var items = document.querySelectorAll('.income-item');
    var result = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.inc-name').value;
      var amount = parseFloat(item.querySelector('.inc-amount').value) || 0;
      result.push({ id: id, name: name, amount: amount });
    });
    return result;
  }

  // ── Get expenses from UI ──
  function getExpensesFromUI() {
    var items = document.querySelectorAll('.expense-item');
    var result = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.exp-name').value;
      var amount = parseFloat(item.querySelector('.exp-amount').value) || 0;
      result.push({ id: id, name: name, amount: amount });
    });
    return result;
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
    var incomeData = getIncomesFromUI();
    var expenseData = getExpensesFromUI();

    var totalIncome = incomeData.reduce(function(sum, inc) { return sum + inc.amount; }, 0);
    var totalExpenses = expenseData.reduce(function(sum, exp) { return sum + exp.amount; }, 0);
    var remaining = totalIncome - totalExpenses;

    var status = 'Balanced';
    if (remaining > 0) status = 'Surplus';
    else if (remaining < 0) status = 'Deficit';

    document.getElementById('output_totalIncome').querySelector('.output-number').textContent = formatCurrency(totalIncome);
    document.getElementById('output_totalExpenses').querySelector('.output-number').textContent = formatCurrency(totalExpenses);
    document.getElementById('output_remaining').querySelector('.output-number').textContent = formatCurrency(remaining);
    document.getElementById('output_budgetStatus').querySelector('.output-number').textContent = status;

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      if (incomeData.length > 0) {
        html += '<div style="font-weight: 600; grid-column: 1 / -1; border-bottom: 0.0625rem solid var(--border-default); padding-bottom: 0.3rem;">Income</div>';
        incomeData.forEach(function(inc) {
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + inc.name + '</span>';
          html += '<span><strong>' + formatCurrency(inc.amount) + '</strong></span>';
          html += '</div>';
        });
      }

      if (expenseData.length > 0) {
        html += '<div style="font-weight: 600; grid-column: 1 / -1; border-bottom: 0.0625rem solid var(--border-default); padding: 0.3rem 0 0.3rem 0;">Expenses</div>';
        expenseData.forEach(function(exp) {
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + exp.name + '</span>';
          html += '<span><strong>' + formatCurrency(exp.amount) + '</strong></span>';
          html += '</div>';
        });
      }

      html += '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0; border-top: 0.125rem solid var(--text-primary); margin-top: 0.3rem; grid-column: 1 / -1; font-weight: 700;">';
      html += '<span>Remaining</span>';
      html += '<span style="color: ' + (remaining >= 0 ? 'var(--profit)' : 'var(--loss)') + ';">' + formatCurrency(remaining) + '</span>';
      html += '</div>';

      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      remaining: remaining,
      expenseData: expenseData
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        remaining: remaining
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

    if (tab === 'breakdown') {
      var expenseData = data.expenseData || [];
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

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Render Incomes ──
  function renderIncomes() {
    var container = document.getElementById('incomeList');
    if (!container) return;

    container.innerHTML = '';

    incomes.forEach(function(inc) {
      var div = document.createElement('div');
      div.className = 'income-item';
      div.dataset.id = inc.id;

      div.innerHTML = `
        <div class="income-item-row">
          <div class="inc-field">
            <label>Income Source</label>
            <input type="text" class="inc-name" value="${inc.name}" placeholder="e.g., Salary">
          </div>
          <div class="inc-field">
            <label>Amount</label>
            <input type="number" class="inc-amount" value="${inc.amount}" step="10" min="0">
          </div>
          <button class="btn-inc-remove" data-id="${inc.id}">✕</button>
        </div>
      `;

      container.appendChild(div);
    });

    // Remove buttons
    container.querySelectorAll('.btn-inc-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.id;
        incomes = incomes.filter(function(i) { return i.id !== id; });
        renderIncomes();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    // Input listeners
    container.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        updateIncomesFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
      input.addEventListener('change', function() {
        updateIncomesFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    updateIncomesFromUI();
  }

  // ── Render Expenses ──
  function renderExpenses() {
    var container = document.getElementById('expenseList');
    if (!container) return;

    container.innerHTML = '';

    expenses.forEach(function(exp) {
      var div = document.createElement('div');
      div.className = 'expense-item';
      div.dataset.id = exp.id;

      div.innerHTML = `
        <div class="expense-item-row">
          <div class="exp-field">
            <label>Expense Category</label>
            <input type="text" class="exp-name" value="${exp.name}" placeholder="e.g., Rent">
          </div>
          <div class="exp-field">
            <label>Amount</label>
            <input type="number" class="exp-amount" value="${exp.amount}" step="10" min="0">
          </div>
          <button class="btn-exp-remove" data-id="${exp.id}">✕</button>
        </div>
      `;

      container.appendChild(div);
    });

    container.querySelectorAll('.btn-exp-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.id;
        expenses = expenses.filter(function(e) { return e.id !== id; });
        renderExpenses();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    container.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        updateExpensesFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
      input.addEventListener('change', function() {
        updateExpensesFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    updateExpensesFromUI();
  }

  // ── Update arrays from UI ──
  function updateIncomesFromUI() {
    var items = document.querySelectorAll('.income-item');
    var newIncomes = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.inc-name').value || 'Unnamed Income';
      var amount = parseFloat(item.querySelector('.inc-amount').value) || 0;
      newIncomes.push({ id: id, name: name, amount: amount });
    });
    incomes = newIncomes;
  }

  function updateExpensesFromUI() {
    var items = document.querySelectorAll('.expense-item');
    var newExpenses = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.exp-name').value || 'Unnamed Expense';
      var amount = parseFloat(item.querySelector('.exp-amount').value) || 0;
      newExpenses.push({ id: id, name: name, amount: amount });
    });
    expenses = newExpenses;
  }

  // ── Add Income ──
  function addIncome() {
    incomes.push({
      id: 'inc_' + (++incomeCounter),
      name: 'New Income',
      amount: 100
    });
    renderIncomes();
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Add Expense ──
  function addExpense() {
    expenses.push({
      id: 'exp_' + (++expenseCounter),
      name: 'New Expense',
      amount: 100
    });
    renderExpenses();
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    incomes = defaultIncomes.slice();
    incomeCounter = incomes.length;
    expenses = defaultExpenses.slice();
    expenseCounter = expenses.length;
    renderIncomes();
    renderExpenses();
    document.getElementById('input_payFrequency').value = 'monthly';
    document.getElementById('input_compoundingFrequency').value = 'monthly';
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;
  window.addIncome = addIncome;
  window.addExpense = addExpense;
  window.renderIncomes = renderIncomes;
  window.renderExpenses = renderExpenses;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    incomes = defaultIncomes.slice();
    incomeCounter = incomes.length;
    expenses = defaultExpenses.slice();
    expenseCounter = expenses.length;
    renderIncomes();
    renderExpenses();

    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    var addIncomeBtn = document.getElementById('addIncomeBtn');
    if (addIncomeBtn) {
      addIncomeBtn.addEventListener('click', function() {
        if (typeof window.addIncome === 'function') window.addIncome();
      });
    }

    var addExpenseBtn = document.getElementById('addExpenseBtn');
    if (addExpenseBtn) {
      addExpenseBtn.addEventListener('click', function() {
        if (typeof window.addExpense === 'function') window.addExpense();
      });
    }

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
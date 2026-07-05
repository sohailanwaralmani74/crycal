/* ═══════════════════════════════════════════════════════════
   CRYCAL — Debt Avalanche Calculator
   Tool ID: debt-avalanche
   Sorts by highest interest rate first
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'progress';
  var debtCounter = 0;
  var debts = [];

  // ── Default debts ──
  var defaultDebts = [
    { id: 'debt_' + (++debtCounter), name: 'Credit Card 1', balance: 1500, interestRate: 22.0, minimumPayment: 50 },
    { id: 'debt_' + (++debtCounter), name: 'Credit Card 2', balance: 3500, interestRate: 19.0, minimumPayment: 100 },
    { id: 'debt_' + (++debtCounter), name: 'Personal Loan', balance: 5000, interestRate: 12.0, minimumPayment: 150 }
  ];

  // ── Get Inputs ──
  function getInputs() {
    return {
      extraMonthlyPayment: parseFloat(document.getElementById('input_extraMonthlyPayment').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get debts from UI ──
  function getDebtsFromUI() {
    var debtItems = document.querySelectorAll('.debt-item');
    var result = [];
    debtItems.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.debt-name').value;
      var balance = parseFloat(item.querySelector('.debt-balance').value) || 0;
      var rate = parseFloat(item.querySelector('.debt-rate').value) || 0;
      var min = parseFloat(item.querySelector('.debt-min').value) || 0;
      result.push({ id: id, name: name, balance: balance, interestRate: rate, minimumPayment: min });
    });
    return result;
  }

  // ── Get effective monthly rate ──
  function getMonthlyRate(annualRate, freq) {
    var apr = annualRate / 100;
    if (freq === 'daily') {
      var dailyRate = apr / 365;
      return Math.pow(1 + dailyRate, 30) - 1;
    } else {
      return apr / 12;
    }
  }

  // ── Simulate debt payoff (avalanche method) ──
  function simulateAvalanche(debts, extraPayment, freq) {
    if (!debts || debts.length === 0) {
      return {
        totalMonths: 0,
        totalInterest: 0,
        totalDebt: 0,
        payoffDate: null,
        schedule: [],
        payoffOrder: []
      };
    }

    // Sort by interest rate (highest to lowest)
    var sorted = debts.slice().sort(function(a, b) {
      return b.interestRate - a.interestRate;
    });

    // Copy for simulation
    var active = sorted.map(function(d) {
      return {
        id: d.id,
        name: d.name,
        balance: d.balance,
        rate: d.interestRate,
        minPayment: d.minimumPayment,
        originalBalance: d.balance,
        paidOff: false,
        paidOffMonth: null
      };
    });

    var totalInterest = 0;
    var totalPaid = 0;
    var month = 0;
    var schedule = [];
    var payoffOrder = [];
    var maxMonths = 1200;

    while (month < maxMonths) {
      month++;
      var totalMinimum = 0;
      var activeDebts = 0;

      // Calculate total minimum payments and count active debts
      active.forEach(function(d) {
        if (!d.paidOff && d.balance > 0.01) {
          totalMinimum += d.minPayment;
          activeDebts++;
        }
      });

      if (activeDebts === 0) break;

      // Available payment = total minimums + extra
      var availablePayment = totalMinimum + extraPayment;

      // Apply payment to debts in order (highest interest first)
      active.forEach(function(d) {
        if (d.paidOff || d.balance <= 0.01) return;

        var monthlyRate = getMonthlyRate(d.rate, freq);
        var interest = d.balance * monthlyRate;
        totalInterest += interest;
        d.balance += interest;

        // Determine payment for this debt
        var payment = d.minPayment;

        // If this is the first active debt (highest rate), apply any extra to it
        var isFirstActive = true;
        var firstFound = false;
        active.forEach(function(ad) {
          if (!ad.paidOff && ad.balance > 0.01 && !firstFound) {
            firstFound = true;
            if (ad.id === d.id) {
              payment += extraPayment;
            }
          }
        });

        // Apply payment
        if (payment > d.balance) {
          payment = d.balance;
          d.balance = 0;
        } else {
          d.balance -= payment;
        }

        totalPaid += payment;

        // Check if paid off
        if (d.balance <= 0.01 && !d.paidOff) {
          d.paidOff = true;
          d.paidOffMonth = month;
          payoffOrder.push({
            name: d.name,
            originalBalance: d.originalBalance,
            interestRate: d.rate,
            paidOffMonth: month,
            interestPaid: totalInterest - (d.originalBalance - d.balance)
          });
        }
      });

      // Record schedule
      var totalBalance = 0;
      var totalOriginal = 0;
      active.forEach(function(d) {
        totalBalance += d.balance;
        totalOriginal += d.originalBalance;
      });

      schedule.push({
        month: month,
        totalBalance: totalBalance,
        totalPaid: totalPaid,
        totalInterest: totalInterest,
        debtsPaidOff: active.filter(function(d) { return d.paidOff; }).length
      });
    }

    // Calculate final stats
    var totalDebt = debts.reduce(function(sum, d) { return sum + d.balance; }, 0);
    var totalInterestPaid = totalInterest;

    // Payoff date
    var today = new Date();
    var payoffDate = new Date(today);
    payoffDate.setMonth(today.getMonth() + month);

    return {
      totalMonths: month,
      totalInterest: totalInterestPaid,
      totalDebt: totalDebt,
      payoffDate: payoffDate,
      schedule: schedule,
      payoffOrder: payoffOrder
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

  // ── Format Date ──
  function formatDate(date) {
    if (!date || !date.getFullYear) return '—';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getFullYear();
  }

  // ── Format Months ──
  function formatMonths(months) {
    if (months === Infinity || !isFinite(months)) return '∞';
    var y = Math.floor(months / 12);
    var m = months % 12;
    if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Render Debt List ──
  function renderDebts() {
    var container = document.getElementById('debtList');
    if (!container) return;

    container.innerHTML = '';

    debts.forEach(function(debt) {
      var div = document.createElement('div');
      div.className = 'debt-item';
      div.dataset.id = debt.id;

      div.innerHTML = `
        <div class="debt-item-row">
          <div class="debt-field">
            <label>Debt Name</label>
            <input type="text" class="debt-name" value="${debt.name}" placeholder="e.g. Credit Card">
          </div>
          <div class="debt-field">
            <label>Balance</label>
            <input type="number" class="debt-balance" value="${debt.balance}" step="100" min="0">
          </div>
          <div class="debt-field">
            <label>Interest Rate (%)</label>
            <input type="number" class="debt-rate" value="${debt.interestRate}" step="0.1" min="0">
          </div>
          <div class="debt-field">
            <label>Min. Payment</label>
            <input type="number" class="debt-min" value="${debt.minimumPayment}" step="5" min="0">
          </div>
          <button class="btn-debt-remove" data-id="${debt.id}">✕</button>
        </div>
      `;

      container.appendChild(div);
    });

    // Event listeners for remove buttons
    container.querySelectorAll('.btn-debt-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.id;
        debts = debts.filter(function(d) { return d.id !== id; });
        renderDebts();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    // Event listeners for input changes
    container.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        updateDebtsFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
      input.addEventListener('change', function() {
        updateDebtsFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    updateDebtsFromUI();
  }

  // ── Update debts array from UI ──
  function updateDebtsFromUI() {
    var items = document.querySelectorAll('.debt-item');
    var newDebts = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.debt-name').value || 'Unnamed Debt';
      var balance = parseFloat(item.querySelector('.debt-balance').value) || 0;
      var rate = parseFloat(item.querySelector('.debt-rate').value) || 0;
      var min = parseFloat(item.querySelector('.debt-min').value) || 0;
      newDebts.push({
        id: id,
        name: name,
        balance: balance,
        interestRate: rate,
        minimumPayment: min
      });
    });
    debts = newDebts;
  }

  // ── Add Debt ──
  function addDebt() {
    debts.push({
      id: 'debt_' + (++debtCounter),
      name: 'New Debt',
      balance: 1000,
      interestRate: 15.0,
      minimumPayment: 50
    });
    renderDebts();
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var debtData = getDebtsFromUI();

    // If no debts, show zeros
    if (debtData.length === 0) {
      document.getElementById('output_totalDebt').querySelector('.output-number').textContent = formatCurrencyLocal(0);
      document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(0);
      document.getElementById('output_payoffDate').querySelector('.output-number').textContent = '—';
      document.getElementById('output_totalMonths').querySelector('.output-number').textContent = '0';
      updateCharts(null, inputs);
      return;
    }

    // Filter out debts with zero balance or zero min payment
    var validDebts = debtData.filter(function(d) {
      return d.balance > 0 && d.minimumPayment > 0;
    });

    if (validDebts.length === 0) {
      document.getElementById('output_totalDebt').querySelector('.output-number').textContent = formatCurrencyLocal(0);
      document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(0);
      document.getElementById('output_payoffDate').querySelector('.output-number').textContent = '—';
      document.getElementById('output_totalMonths').querySelector('.output-number').textContent = '0';
      updateCharts(null, inputs);
      return;
    }

    var result = simulateAvalanche(validDebts, inputs.extraMonthlyPayment, inputs.compoundingFrequency);

    document.getElementById('output_totalDebt').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalDebt);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_payoffDate').querySelector('.output-number').textContent = formatDate(result.payoffDate);
    document.getElementById('output_totalMonths').querySelector('.output-number').textContent = formatMonths(result.totalMonths);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        extraMonthlyPayment: inputs.extraMonthlyPayment,
        compoundingFrequency: inputs.compoundingFrequency,
        debtCount: validDebts.length,
        totalDebt: result.totalDebt,
        totalInterest: result.totalInterest,
        totalMonths: result.totalMonths,
        payoffDate: formatDate(result.payoffDate)
      };
      window.logHistory(snapshot);
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
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    if (!result || !result.schedule || result.schedule.length === 0) {
      return {
        type: 'line',
        data: {
          labels: ['0'],
          datasets: [
            {
              label: 'Total Debt',
              data: [0],
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
            title: { display: true, text: 'No debts added yet', font: { size: 14 } }
          }
        }
      };
    }

    var schedule = result.schedule;
    var labels = schedule.map(function(d) { return d.month; });

    if (tab === 'progress') {
      var balanceData = schedule.map(function(d) { return d.totalBalance; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Remaining Debt',
              data: balanceData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#2F6F5E',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Debt Avalanche Progress', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var debtData = getDebtsFromUI();
      var names = debtData.map(function(d) { return d.name; });
      var balances = debtData.map(function(d) { return d.balance; });
      var colors = ['#C08A2E', '#2F6F5E', '#4A90D9', '#B23A3A', '#DCE1E3', '#8E44AD'];

      return {
        type: 'doughnut',
        data: {
          labels: names,
          datasets: [{
            data: balances,
            backgroundColor: colors.slice(0, balances.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Debt Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(2);
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'timeline') {
      var debtData2 = getDebtsFromUI();
      // Sort by highest interest for display
      var sorted = debtData2.slice().sort(function(a, b) {
        return b.interestRate - a.interestRate;
      });
      var payoffOrder = result.payoffOrder || [];

      var barData = sorted.map(function(d) {
        var found = payoffOrder.find(function(p) { return p.name === d.name; });
        return found ? found.paidOffMonth : 0;
      });

      var labels2 = sorted.map(function(d) { return d.name + ' (' + d.interestRate + '%)'; });

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [{
            label: 'Month Paid Off',
            data: barData,
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
            title: { display: true, text: 'Debt Payoff Timeline (Highest Rate First)', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var val = ctx.parsed.y;
                  if (val === 0 || val === '-') return 'Not paid off';
                  return 'Paid off in ' + val + ' months';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
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
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    debts = defaultDebts.slice();
    debtCounter = debts.length;
    renderDebts();
    document.getElementById('input_extraMonthlyPayment').value = 100;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;
  window.addDebt = addDebt;
  window.renderDebts = renderDebts;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    debts = defaultDebts.slice();
    debtCounter = debts.length;
    renderDebts();

    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    var addBtn = document.getElementById('addDebtBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        if (typeof window.addDebt === 'function') window.addDebt();
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
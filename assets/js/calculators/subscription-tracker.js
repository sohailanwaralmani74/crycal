/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Subscription Tracker Calculator
   Tool ID: subscription-tracker
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var subscriptionCounter = 0;
  var subscriptions = [];

  // ── Default subscriptions ──
  var defaultSubscriptions = [
    { id: 'sub_' + (++subscriptionCounter), name: 'Netflix', cost: 15.49, category: 'Entertainment' },
    { id: 'sub_' + (++subscriptionCounter), name: 'Spotify', cost: 10.99, category: 'Entertainment' },
    { id: 'sub_' + (++subscriptionCounter), name: 'Gym Membership', cost: 50.00, category: 'Fitness' },
    { id: 'sub_' + (++subscriptionCounter), name: 'Adobe Creative Cloud', cost: 54.99, category: 'Software' }
  ];

  // ── Get Inputs ──
  function getInputs() {
    return {
      extraMonthlyPayment: parseFloat(document.getElementById('input_extraMonthlyPayment').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get subscriptions from UI ──
  function getSubscriptionsFromUI() {
    var items = document.querySelectorAll('.subscription-item');
    var result = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.sub-name').value;
      var cost = parseFloat(item.querySelector('.sub-cost').value) || 0;
      var category = item.querySelector('.sub-category').value || 'Other';
      result.push({ id: id, name: name, cost: cost, category: category });
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
    var subscriptionData = getSubscriptionsFromUI();

    if (subscriptionData.length === 0) {
      document.getElementById('output_totalMonthly').querySelector('.output-number').textContent = formatCurrency(0);
      document.getElementById('output_totalYearly').querySelector('.output-number').textContent = formatCurrency(0);
      document.getElementById('output_totalSubscriptions').querySelector('.output-number').textContent = '0';
      document.getElementById('output_mostExpensive').querySelector('.output-number').textContent = '—';
      updateCharts(null, inputs);
      return;
    }

    // ── Calculate Totals ──
    var totalMonthly = 0;
    var maxCost = 0;
    var maxName = '';
    var categoryMap = {};

    subscriptionData.forEach(function(sub) {
      totalMonthly += sub.cost;
      if (sub.cost > maxCost) {
        maxCost = sub.cost;
        maxName = sub.name;
      }
      if (categoryMap[sub.category]) {
        categoryMap[sub.category] += sub.cost;
      } else {
        categoryMap[sub.category] = sub.cost;
      }
    });

    var totalYearly = totalMonthly * 12;
    var totalSubscriptions = subscriptionData.length;

    // ── Update Outputs ──
    document.getElementById('output_totalMonthly').querySelector('.output-number').textContent = formatCurrency(totalMonthly);
    document.getElementById('output_totalYearly').querySelector('.output-number').textContent = formatCurrency(totalYearly);
    document.getElementById('output_totalSubscriptions').querySelector('.output-number').textContent = totalSubscriptions;
    document.getElementById('output_mostExpensive').querySelector('.output-number').textContent = maxName + ' (' + formatCurrency(maxCost) + '/mo)';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';
      subscriptionData.forEach(function(sub) {
        var pct = totalMonthly > 0 ? (sub.cost / totalMonthly * 100) : 0;
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
        html += '<span style="color: var(--text-muted);">' + sub.name + ' (' + sub.category + ')</span>';
        html += '<span><strong>' + formatCurrency(sub.cost) + '</strong> (' + pct.toFixed(0) + '%)</span>';
        html += '</div>';
      });
      html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-top: 0.0625rem solid var(--border-default); font-weight: 600; grid-column: 1 / -1;">';
      html += '<span>Total Monthly</span>';
      html += '<span>' + formatCurrency(totalMonthly) + '</span>';
      html += '</div>';
      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      totalMonthly: totalMonthly,
      totalYearly: totalYearly,
      totalSubscriptions: totalSubscriptions,
      subscriptionData: subscriptionData,
      categoryMap: categoryMap
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        totalMonthly: totalMonthly,
        totalYearly: totalYearly,
        totalSubscriptions: totalSubscriptions
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

    if (!data || !data.subscriptionData || data.subscriptionData.length === 0) {
      return {
        type: 'doughnut',
        data: {
          labels: ['No subscriptions'],
          datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'No subscriptions added', font: { size: 14 } }
          }
        }
      };
    }

    var colors = ['#C08A2E', '#2F6F5E', '#4A90D9', '#B23A3A', '#8E44AD', '#2C3E50', '#F39C12', '#1ABC9C', '#DCE1E3'];

    if (tab === 'breakdown') {
      var subData = data.subscriptionData;
      var labels = subData.map(function(s) { return s.name; });
      var costs = subData.map(function(s) { return s.cost; });

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: costs,
            backgroundColor: colors.slice(0, costs.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Subscription Breakdown', font: { size: 14 } },
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
      var categories = data.categoryMap || {};
      var catLabels = Object.keys(categories);
      var catValues = catLabels.map(function(k) { return categories[k]; });

      if (catLabels.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No categories'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No category data', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'bar',
        data: {
          labels: catLabels,
          datasets: [{
            label: 'Monthly Cost',
            data: catValues,
            backgroundColor: colors.slice(0, catValues.length),
            borderColor: colors.slice(0, catValues.length).map(function(c) { return c; }),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Category Breakdown', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cost (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(2); }
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

  // ── Reset Tool ──
  function resetTool() {
    subscriptions = defaultSubscriptions.slice();
    subscriptionCounter = subscriptions.length;
    renderSubscriptions();
    document.getElementById('input_extraMonthlyPayment').value = 0;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Render Subscriptions ──
  function renderSubscriptions() {
    var container = document.getElementById('subscriptionList');
    if (!container) return;

    container.innerHTML = '';

    subscriptions.forEach(function(sub) {
      var div = document.createElement('div');
      div.className = 'subscription-item';
      div.dataset.id = sub.id;

      div.innerHTML = `
        <div class="subscription-item-row">
          <div class="sub-field">
            <label>Name</label>
            <input type="text" class="sub-name" value="${sub.name}" placeholder="e.g., Netflix">
          </div>
          <div class="sub-field">
            <label>Monthly Cost</label>
            <input type="number" class="sub-cost" value="${sub.cost}" step="0.01" min="0">
          </div>
          <div class="sub-field">
            <label>Category</label>
            <input type="text" class="sub-category" value="${sub.category}" placeholder="e.g., Entertainment">
          </div>
          <button class="btn-sub-remove" data-id="${sub.id}">✕</button>
        </div>
      `;

      container.appendChild(div);
    });

    // Event listeners for remove buttons
    container.querySelectorAll('.btn-sub-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.id;
        subscriptions = subscriptions.filter(function(s) { return s.id !== id; });
        renderSubscriptions();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    // Event listeners for input changes
    container.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        updateSubscriptionsFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
      input.addEventListener('change', function() {
        updateSubscriptionsFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    updateSubscriptionsFromUI();
  }

  // ── Update subscriptions array from UI ──
  function updateSubscriptionsFromUI() {
    var items = document.querySelectorAll('.subscription-item');
    var newSubscriptions = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var name = item.querySelector('.sub-name').value || 'Unnamed Subscription';
      var cost = parseFloat(item.querySelector('.sub-cost').value) || 0;
      var category = item.querySelector('.sub-category').value || 'Other';
      newSubscriptions.push({
        id: id,
        name: name,
        cost: cost,
        category: category
      });
    });
    subscriptions = newSubscriptions;
  }

  // ── Add Subscription ──
  function addSubscription() {
    subscriptions.push({
      id: 'sub_' + (++subscriptionCounter),
      name: 'New Subscription',
      cost: 9.99,
      category: 'Other'
    });
    renderSubscriptions();
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;
  window.addSubscription = addSubscription;
  window.renderSubscriptions = renderSubscriptions;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    subscriptions = defaultSubscriptions.slice();
    subscriptionCounter = subscriptions.length;
    renderSubscriptions();

    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    var addBtn = document.getElementById('addSubscriptionBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        if (typeof window.addSubscription === 'function') window.addSubscription();
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
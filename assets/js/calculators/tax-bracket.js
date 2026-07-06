/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Tax Bracket Calculator
   Tool ID: tax-bracket-calculator
   Three default brackets loaded on page load
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var bracketCounter = 0;
  var brackets = [];

  // ── THREE SAMPLE BRACKETS (global, non-US) ──
  var defaultBrackets = [
    { id: 'bracket_' + (++bracketCounter), from: 0, to: 10000, rate: 10 },
    { id: 'bracket_' + (++bracketCounter), from: 10001, to: 40000, rate: 20 },
    { id: 'bracket_' + (++bracketCounter), from: 40001, to: null, rate: 30 }
  ];

  // ── Get Inputs ──
  function getInputs() {
    return {
      taxableIncome: parseFloat(document.getElementById('input_taxableIncome').value) || 0
    };
  }

  // ── Get brackets from UI ──
  function getBracketsFromUI() {
    var items = document.querySelectorAll('#bracketList .debt-item');
    var result = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var from = parseFloat(item.querySelector('.bracket-from').value) || 0;
      var to = parseFloat(item.querySelector('.bracket-to').value);
      if (isNaN(to)) to = null;
      var rate = parseFloat(item.querySelector('.bracket-rate').value) || 0;
      result.push({ id: id, from: from, to: to, rate: rate });
    });
    return result;
  }

  // ── Calculate Tax ──
  function calculateTax(income, brackets) {
    if (!brackets || brackets.length === 0) {
      return { totalTax: 0, breakdown: [], marginalRate: 0 };
    }

    var sorted = brackets.slice().sort(function(a, b) {
      return a.from - b.from;
    });

    var remaining = income;
    var totalTax = 0;
    var breakdown = [];

    for (var i = 0; i < sorted.length; i++) {
      var bracket = sorted[i];
      var from = bracket.from;
      var to = bracket.to;
      var rate = bracket.rate;

      var maxIncome = (to !== null) ? to : Infinity;
      var taxableAmount = Math.max(0, Math.min(remaining, maxIncome - from + 1));
      if (taxableAmount <= 0) continue;

      var tax = taxableAmount * (rate / 100);
      totalTax += tax;
      remaining -= taxableAmount;

      breakdown.push({
        rate: rate,
        amount: taxableAmount,
        tax: tax,
        from: from,
        to: to !== null ? to : '∞'
      });

      if (remaining <= 0) break;
    }

    if (remaining > 0 && breakdown.length > 0) {
      var highestRate = breakdown[breakdown.length - 1].rate;
      var extraTax = remaining * (highestRate / 100);
      totalTax += extraTax;
      breakdown.push({
        rate: highestRate,
        amount: remaining,
        tax: extraTax,
        from: breakdown[breakdown.length - 1].to,
        to: '∞'
      });
    }

    return {
      totalTax: totalTax,
      breakdown: breakdown,
      marginalRate: breakdown.length > 0 ? breakdown[breakdown.length - 1].rate : 0
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
    var bracketData = getBracketsFromUI();
    var income = inputs.taxableIncome;

    if (bracketData.length === 0) {
      document.getElementById('output_totalTax').querySelector('.output-number').textContent = formatCurrency(0);
      document.getElementById('output_marginalRate').querySelector('.output-number').textContent = '0%';
      document.getElementById('output_effectiveRate').querySelector('.output-number').textContent = '0%';
      document.getElementById('output_taxableIncome').querySelector('.output-number').textContent = formatCurrency(income);
      var breakdownDiv = document.getElementById('taxBreakdownDetail');
      if (breakdownDiv) breakdownDiv.innerHTML = '';
      updateCharts(null, inputs);
      return;
    }

    var result = calculateTax(income, bracketData);
    var totalTax = result.totalTax;
    var effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

    document.getElementById('output_totalTax').querySelector('.output-number').textContent = formatCurrency(totalTax);
    document.getElementById('output_marginalRate').querySelector('.output-number').textContent = result.marginalRate + '%';
    document.getElementById('output_effectiveRate').querySelector('.output-number').textContent = effectiveRate.toFixed(1) + '%';
    document.getElementById('output_taxableIncome').querySelector('.output-number').textContent = formatCurrency(income);

    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      if (result.breakdown.length === 0) {
        breakdownDiv.innerHTML = '<p style="color: var(--text-muted);">No tax calculated.</p>';
      } else {
        var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1.5rem; margin-top: 0.5rem;">';
        result.breakdown.forEach(function(b) {
          var range = b.from + ' – ' + (b.to !== '∞' ? b.to : '∞');
          html += '<div style="display: flex; justify-content: space-between; padding: 0.2rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + b.rate + '% bracket (' + range + ')</span>';
          html += '<span><strong>' + formatCurrency(b.tax) + '</strong> (on ' + formatCurrency(b.amount) + ')</span>';
          html += '</div>';
        });
        html += '</div>';
        breakdownDiv.innerHTML = html;
      }
    }

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        taxableIncome: income,
        marginalRate: result.marginalRate,
        effectiveRate: effectiveRate.toFixed(1),
        totalTax: totalTax
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

    if (!result || !result.breakdown || result.breakdown.length === 0) {
      return {
        type: 'doughnut',
        data: {
          labels: ['No brackets'],
          datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'No tax brackets defined', font: { size: 14 } }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var breakdown = result.breakdown;
      var labels = breakdown.map(function(b) {
        var range = b.from + ' – ' + (b.to !== '∞' ? b.to : '∞');
        return b.rate + '% (' + range + ')';
      });
      var taxData = breakdown.map(function(b) { return b.tax; });
      var colors = ['#C08A2E', '#2F6F5E', '#4A90D9', '#B23A3A', '#8E44AD', '#2C3E50', '#DCE1E3'];

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: taxData,
            backgroundColor: colors.slice(0, taxData.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Tax Breakdown by Bracket', font: { size: 14 } },
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

    if (tab === 'distribution') {
      var breakdown2 = result.breakdown;
      var labels2 = breakdown2.map(function(b) {
        var range = b.from + ' – ' + (b.to !== '∞' ? b.to : '∞');
        return b.rate + '% (' + range + ')';
      });
      var incomeData = breakdown2.map(function(b) { return b.amount; });
      var colors2 = ['#C08A2E', '#2F6F5E', '#4A90D9', '#B23A3A', '#8E44AD', '#2C3E50', '#DCE1E3'];

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [{
            label: 'Taxable Income by Bracket',
            data: incomeData,
            backgroundColor: colors2.slice(0, incomeData.length),
            borderColor: colors2.slice(0, incomeData.length).map(function(c) { return c; }),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income Distribution by Bracket', font: { size: 14 } }
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

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_taxableIncome').value = 0;
    brackets = defaultBrackets.slice();
    bracketCounter = brackets.length;
    renderBrackets();
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Render Brackets ──
  function renderBrackets() {
    var container = document.getElementById('bracketList');
    if (!container) return;

    container.innerHTML = '';

    brackets.forEach(function(bracket) {
      var div = document.createElement('div');
      div.className = 'debt-item';
      div.dataset.id = bracket.id;

      div.innerHTML = `
        <div class="debt-item-row">
          <div class="debt-field">
            <label>From ($)</label>
            <input type="number" class="bracket-from" value="${bracket.from}" step="100" min="0">
          </div>
          <div class="debt-field">
            <label>To ($) Leave blank for ∞</label>
            <input type="number" class="bracket-to" value="${bracket.to !== null ? bracket.to : ''}" step="100" min="0" placeholder="∞">
          </div>
          <div class="debt-field">
            <label>Rate (%)</label>
            <input type="number" class="bracket-rate" value="${bracket.rate}" step="0.1" min="0">
          </div>
          <button class="btn-debt-remove" data-id="${bracket.id}">✕</button>
        </div>
      `;

      container.appendChild(div);
    });

    container.querySelectorAll('.btn-debt-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.id;
        brackets = brackets.filter(function(b) { return b.id !== id; });
        renderBrackets();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    container.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        updateBracketsFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
      input.addEventListener('change', function() {
        updateBracketsFromUI();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });

    updateBracketsFromUI();
  }

  // ── Update brackets array from UI ──
  function updateBracketsFromUI() {
    var items = document.querySelectorAll('#bracketList .debt-item');
    var newBrackets = [];
    items.forEach(function(item) {
      var id = item.dataset.id;
      var from = parseFloat(item.querySelector('.bracket-from').value) || 0;
      var to = parseFloat(item.querySelector('.bracket-to').value);
      if (isNaN(to)) to = null;
      var rate = parseFloat(item.querySelector('.bracket-rate').value) || 0;
      newBrackets.push({
        id: id,
        from: from,
        to: to,
        rate: rate
      });
    });
    brackets = newBrackets;
  }

  // ── Add Bracket ──
  function addBracket() {
    var last = brackets[brackets.length - 1];
    var newFrom = last ? (last.to !== null ? last.to + 1 : 1000000) : 0;
    brackets.push({
      id: 'bracket_' + (++bracketCounter),
      from: newFrom,
      to: null,
      rate: 0
    });
    renderBrackets();
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;
  window.addBracket = addBracket;
  window.renderBrackets = renderBrackets;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    // Ensure the bracket section is visible if this is the correct tool
    var container = document.getElementById('toolContainer');
    if (container) {
      var toolId = container.dataset.toolId;
      var bracketSection = document.getElementById('bracketSection');
      if (toolId === 'tax-bracket-calculator' && bracketSection) {
        bracketSection.style.display = 'block';
      }
    }

    // Load three sample brackets
    brackets = defaultBrackets.slice();
    bracketCounter = brackets.length;
    renderBrackets();

    var addBtn = document.getElementById('addBracketBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        if (typeof window.addBracket === 'function') window.addBracket();
      });
    }

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);
  });

})();
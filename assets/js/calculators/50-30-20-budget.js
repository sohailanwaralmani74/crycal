/* ═══════════════════════════════════════════════════════════
   Wanjaaro — 50/30/20 Budget Calculator
   Tool ID: 503020-budget
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      incomeType: document.getElementById('input_incomeType').value || 'net',
      totalIncome: parseFloat(document.getElementById('input_totalIncome').value) || 0,
      payFrequency: document.getElementById('input_payFrequency').value || 'monthly',
      taxRate: parseFloat(document.getElementById('input_taxRate').value) || 0,
      needsPercentage: parseFloat(document.getElementById('input_needsPercentage').value) || 50,
      wantsPercentage: parseFloat(document.getElementById('input_wantsPercentage').value) || 30,
      savingsPercentage: parseFloat(document.getElementById('input_savingsPercentage').value) || 20
    };
  }

  // ── Get Frequency Multiplier ──
  function getFrequencyMultiplier(frequency) {
    switch (frequency) {
      case 'bi-weekly': return 1;
      case 'weekly': return 1;
      default: return 1;
    }
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

  // ── Format Pay Frequency ──
  function formatPayFrequency(amount, frequency) {
    var formatted = formatCurrency(amount);
    switch (frequency) {
      case 'bi-weekly': return formatted + ' / 2 weeks';
      case 'weekly': return formatted + ' / week';
      default: return formatted + ' / month';
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Calculate Net Income ──
    var grossIncome = inputs.totalIncome;
    var taxRate = inputs.taxRate / 100;

    // If income is gross, apply tax to get net
    var netIncome = inputs.incomeType === 'gross' 
      ? grossIncome * (1 - taxRate) 
      : grossIncome;

    // Ensure we don't go negative
    netIncome = Math.max(0, netIncome);

    // ── Apply Percentages ──
    var needsPct = inputs.needsPercentage / 100;
    var wantsPct = inputs.wantsPercentage / 100;
    var savingsPct = inputs.savingsPercentage / 100;

    // Ensure percentages sum to 100%
    var totalPct = needsPct + wantsPct + savingsPct;
    if (totalPct > 0) {
      needsPct = needsPct / totalPct;
      wantsPct = wantsPct / totalPct;
      savingsPct = savingsPct / totalPct;
    } else {
      needsPct = 0.5;
      wantsPct = 0.3;
      savingsPct = 0.2;
    }

    var needsAmount = netIncome * needsPct;
    var wantsAmount = netIncome * wantsPct;
    var savingsAmount = netIncome * savingsPct;

    var freq = inputs.payFrequency;
    var netIncomeFormatted = formatPayFrequency(netIncome, freq);
    var needsFormatted = formatPayFrequency(needsAmount, freq);
    var wantsFormatted = formatPayFrequency(wantsAmount, freq);
    var savingsFormatted = formatPayFrequency(savingsAmount, freq);

    // ── Update Outputs ──
    document.getElementById('output_netIncome').querySelector('.output-number').textContent = netIncomeFormatted;
    document.getElementById('output_needsAmount').querySelector('.output-number').textContent = needsFormatted;
    document.getElementById('output_wantsAmount').querySelector('.output-number').textContent = wantsFormatted;
    document.getElementById('output_savingsAmount').querySelector('.output-number').textContent = savingsFormatted;
    document.getElementById('output_needsPercentage').querySelector('.output-number').textContent = (needsPct * 100).toFixed(1) + '%';
    document.getElementById('output_wantsPercentage').querySelector('.output-number').textContent = (wantsPct * 100).toFixed(1) + '%';
    document.getElementById('output_savingsPercentage').querySelector('.output-number').textContent = (savingsPct * 100).toFixed(1) + '%';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var items = [
        { label: 'Net Monthly Income', amount: netIncome, highlight: true },
        { label: 'Needs (' + (needsPct * 100).toFixed(0) + '%)', amount: needsAmount, color: '#2F6F5E' },
        { label: 'Wants (' + (wantsPct * 100).toFixed(0) + '%)', amount: wantsAmount, color: '#C08A2E' },
        { label: 'Savings / Debt (' + (savingsPct * 100).toFixed(0) + '%)', amount: savingsAmount, color: '#4A90D9' }
      ];

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';
      items.forEach(function(item) {
        var style = item.highlight ? 'font-weight: 600; border-top: 0.0625rem solid var(--border-default); padding-top: 0.3rem;' : '';
        var color = item.color ? 'color: ' + item.color + ';' : '';
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default); ' + style + '">';
        html += '<span style="' + (item.highlight ? 'font-weight: 600;' : 'color: var(--text-muted);') + '">' + item.label + '</span>';
        html += '<span style="' + color + '"><strong>' + formatCurrency(item.amount) + '</strong></span>';
        html += '</div>';
      });
      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      needsAmount: needsAmount,
      wantsAmount: wantsAmount,
      savingsAmount: savingsAmount,
      netIncome: netIncome,
      needsPct: needsPct,
      wantsPct: wantsPct,
      savingsPct: savingsPct
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        totalIncome: inputs.totalIncome,
        payFrequency: freq,
        needsAmount: needsAmount,
        wantsAmount: wantsAmount,
        savingsAmount: savingsAmount
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

    var categories = [
      { label: 'Needs', value: data.needsAmount, color: '#2F6F5E' },
      { label: 'Wants', value: data.wantsAmount, color: '#C08A2E' },
      { label: 'Savings / Debt', value: data.savingsAmount, color: '#4A90D9' }
    ];

    var filtered = categories.filter(function(c) { return c.value > 0; });

    if (filtered.length === 0) {
      return {
        type: 'doughnut',
        data: {
          labels: ['No data'],
          datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'No data to display', font: { size: 14 } }
          }
        }
      };
    }

    if (tab === 'breakdown') {
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
            title: { display: true, text: '50/30/20 Budget Breakdown', font: { size: 14 } },
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
      var needs = data.needsAmount;
      var wants = data.wantsAmount;
      var savings = data.savingsAmount;

      return {
        type: 'bar',
        data: {
          labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
          datasets: [{
            label: 'Amount',
            data: [needs, wants, savings],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A90D9'],
            borderColor: ['#1f4f42', '#A87520', '#3a7b8c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Budget Allocation', font: { size: 14 } }
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

    if (tab === 'distribution') {
      var total = data.netIncome;
      var pctData = [
        { label: 'Needs', value: total > 0 ? (data.needsPct * 100) : 0 },
        { label: 'Wants', value: total > 0 ? (data.wantsPct * 100) : 0 },
        { label: 'Savings', value: total > 0 ? (data.savingsPct * 100) : 0 }
      ];

      return {
        type: 'bar',
        data: {
          labels: pctData.map(function(d) { return d.label; }),
          datasets: [{
            label: 'Percentage of Income',
            data: pctData.map(function(d) { return d.value; }),
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A90D9'],
            borderColor: ['#1f4f42', '#A87520', '#3a7b8c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income Distribution', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: 'Percentage (%)' }
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
    document.getElementById('input_incomeType').value = 'net';
    document.getElementById('input_totalIncome').value = 5000;
    document.getElementById('input_payFrequency').value = 'monthly';
    document.getElementById('input_taxRate').value = 0;
    document.getElementById('input_needsPercentage').value = 50.0;
    document.getElementById('input_wantsPercentage').value = 30.0;
    document.getElementById('input_savingsPercentage').value = 20.0;
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
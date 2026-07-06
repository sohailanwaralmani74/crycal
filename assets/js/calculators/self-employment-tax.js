/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Self-Employment Tax Calculator
   Tool ID: self-employment-tax
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      netProfit: parseFloat(document.getElementById('input_netProfit').value) || 0,
      payFrequency: document.getElementById('input_payFrequency').value || 'yearly',
      incomeTaxRate: parseFloat(document.getElementById('input_incomeTaxRate').value) || 0,
      socialSecurityRate: parseFloat(document.getElementById('input_socialSecurityRate').value) || 0,
      socialSecurityCap: parseFloat(document.getElementById('input_socialSecurityCap').value) || 0,
      medicareRate: parseFloat(document.getElementById('input_medicareRate').value) || 0,
      pensionRate: parseFloat(document.getElementById('input_pensionRate').value) || 0,
      otherDeductions: parseFloat(document.getElementById('input_otherDeductions').value) || 0,
      expenseDeduction: parseFloat(document.getElementById('input_expenseDeduction').value) || 0
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

  // ── Format Pay Frequency ──
  function formatPayFrequency(amount, frequency) {
    var formatted = formatCurrency(amount);
    switch (frequency) {
      case 'monthly': return formatted + ' / month';
      case 'bi-weekly': return formatted + ' / 2 weeks';
      case 'weekly': return formatted + ' / week';
      default: return formatted + ' / year';
    }
  }

  // ── Get Frequency Multiplier ──
  function getFrequencyMultiplier(frequency) {
    switch (frequency) {
      case 'monthly': return 12;
      case 'bi-weekly': return 26;
      case 'weekly': return 52;
      default: return 1;
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var freq = inputs.payFrequency;
    var multiplier = getFrequencyMultiplier(freq);

    // ── Net Income After Expenses ──
    var netIncome = Math.max(0, inputs.netProfit - inputs.expenseDeduction);

    // ── Social Security (with cap) ──
    var ssCap = inputs.socialSecurityCap;
    var ssBase = (ssCap > 0) ? Math.min(netIncome, ssCap) : netIncome;
    var socialSecurity = ssBase * (inputs.socialSecurityRate / 100);

    // ── Medicare ──
    var medicare = netIncome * (inputs.medicareRate / 100);

    // ── Pension ──
    var pension = netIncome * (inputs.pensionRate / 100);

    // ── Income Tax ──
    var incomeTax = netIncome * (inputs.incomeTaxRate / 100);

    // ── Other Deductions ──
    var other = inputs.otherDeductions;

    // ── Total Tax ──
    var totalTax = incomeTax + socialSecurity + medicare + pension + other;

    // ── Self-Employment Tax (just social security + medicare) ──
    var selfEmploymentTax = socialSecurity + medicare;

    // ── Net Earnings ──
    var netEarnings = netIncome - totalTax;

    // ── Effective Rate ──
    var effectiveRate = inputs.netProfit > 0 ? (totalTax / inputs.netProfit) * 100 : 0;

    // ── Per Period ──
    var netProfitPerPeriod = inputs.netProfit / multiplier;
    var netIncomePerPeriod = netIncome / multiplier;
    var totalTaxPerPeriod = totalTax / multiplier;
    var incomeTaxPerPeriod = incomeTax / multiplier;
    var socialSecurityPerPeriod = socialSecurity / multiplier;
    var medicarePerPeriod = medicare / multiplier;
    var pensionPerPeriod = pension / multiplier;
    var otherPerPeriod = other / multiplier;
    var netEarningsPerPeriod = netEarnings / multiplier;
    var selfEmploymentTaxPerPeriod = selfEmploymentTax / multiplier;

    // ── Update Outputs ──
    document.getElementById('output_netIncomeAfterExpenses').querySelector('.output-number').textContent = formatPayFrequency(netIncomePerPeriod, freq);
    document.getElementById('output_totalTax').querySelector('.output-number').textContent = formatPayFrequency(totalTaxPerPeriod, freq);
    document.getElementById('output_selfEmploymentTax').querySelector('.output-number').textContent = formatPayFrequency(selfEmploymentTaxPerPeriod, freq);
    document.getElementById('output_incomeTax').querySelector('.output-number').textContent = formatPayFrequency(incomeTaxPerPeriod, freq);
    document.getElementById('output_netEarnings').querySelector('.output-number').textContent = formatPayFrequency(netEarningsPerPeriod, freq);
    document.getElementById('output_effectiveRate').querySelector('.output-number').textContent = effectiveRate.toFixed(1) + '%';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var items = [
        { label: 'Net Profit', amount: netProfitPerPeriod },
        { label: 'Business Expenses', amount: inputs.expenseDeduction / multiplier },
        { label: 'Net Income After Expenses', amount: netIncomePerPeriod, highlight: true },
        { label: 'Income Tax', amount: incomeTaxPerPeriod },
        { label: 'Social Security', amount: socialSecurityPerPeriod },
        { label: 'Medicare', amount: medicarePerPeriod },
        { label: 'Pension', amount: pensionPerPeriod },
        { label: 'Other Deductions', amount: otherPerPeriod },
        { label: 'Total Tax', amount: totalTaxPerPeriod, highlight: true },
        { label: 'Net Earnings', amount: netEarningsPerPeriod, highlight: true }
      ];

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';
      items.forEach(function(item) {
        var style = item.highlight ? 'font-weight: 600; border-top: 0.0625rem solid var(--border-default); padding-top: 0.3rem;' : '';
        var color = '';
        if (item.label === 'Net Earnings') {
          color = item.amount > 0 ? 'color: var(--profit);' : 'color: var(--loss);';
        }
        if (item.label === 'Income Tax' || item.label === 'Social Security' || item.label === 'Medicare' || item.label === 'Pension' || item.label === 'Other Deductions' || item.label === 'Total Tax') {
          color = 'color: var(--loss);';
        }
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
      netIncome: netIncomePerPeriod,
      incomeTax: incomeTaxPerPeriod,
      socialSecurity: socialSecurityPerPeriod,
      medicare: medicarePerPeriod,
      pension: pensionPerPeriod,
      other: otherPerPeriod,
      totalTax: totalTaxPerPeriod,
      netEarnings: netEarningsPerPeriod
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        netProfit: inputs.netProfit,
        payFrequency: freq,
        totalTax: totalTaxPerPeriod,
        netEarnings: netEarningsPerPeriod
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
      { label: 'Income Tax', value: data.incomeTax, color: '#C08A2E' },
      { label: 'Social Security', value: data.socialSecurity, color: '#4A90D9' },
      { label: 'Medicare', value: data.medicare, color: '#B23A3A' },
      { label: 'Pension', value: data.pension, color: '#8E44AD' },
      { label: 'Other Deductions', value: data.other, color: '#F39C12' },
      { label: 'Net Earnings', value: data.netEarnings, color: '#2F6F5E' }
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
            title: { display: true, text: 'Self-Employment Tax Breakdown', font: { size: 14 } },
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
      var netIncome = data.netIncome;
      var totalTax = data.totalTax;
      var netEarnings = data.netEarnings;

      return {
        type: 'bar',
        data: {
          labels: ['Net Income', 'Total Tax', 'Net Earnings'],
          datasets: [{
            label: 'Amount',
            data: [netIncome, totalTax, netEarnings],
            backgroundColor: ['#2C3E50', '#B23A3A', '#2F6F5E'],
            borderColor: ['#1a252f', '#8a2a2a', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Tax Comparison', font: { size: 14 } }
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
      var pctData = categories.map(function(c) {
        return { label: c.label, value: total > 0 ? (c.value / total) * 100 : 0 };
      });

      return {
        type: 'bar',
        data: {
          labels: pctData.map(function(d) { return d.label; }),
          datasets: [{
            label: 'Percentage of Net Income',
            data: pctData.map(function(d) { return d.value; }),
            backgroundColor: ['#C08A2E', '#4A90D9', '#B23A3A', '#8E44AD', '#F39C12', '#2F6F5E'],
            borderColor: ['#A87520', '#3a7b8c', '#8a2a2a', '#6c3483', '#c97d0c', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Distribution of Net Income', font: { size: 14 } }
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
    document.getElementById('input_netProfit').value = 80000;
    document.getElementById('input_payFrequency').value = 'yearly';
    document.getElementById('input_incomeTaxRate').value = 22.0;
    document.getElementById('input_socialSecurityRate').value = 12.4;
    document.getElementById('input_socialSecurityCap').value = 0;
    document.getElementById('input_medicareRate').value = 2.9;
    document.getElementById('input_pensionRate').value = 0;
    document.getElementById('input_otherDeductions').value = 0;
    document.getElementById('input_expenseDeduction').value = 0;
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
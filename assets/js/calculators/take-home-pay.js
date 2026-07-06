/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Take-Home Pay Calculator
   Tool ID: take-home-pay
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      grossSalary: parseFloat(document.getElementById('input_grossSalary').value) || 0,
      payFrequency: document.getElementById('input_payFrequency').value || 'yearly',
      incomeTaxRate: parseFloat(document.getElementById('input_incomeTaxRate').value) || 0,
      socialSecurityRate: parseFloat(document.getElementById('input_socialSecurityRate').value) || 0,
      medicareRate: parseFloat(document.getElementById('input_medicareRate').value) || 0,
      pensionRate: parseFloat(document.getElementById('input_pensionRate').value) || 0,
      otherDeductions: parseFloat(document.getElementById('input_otherDeductions').value) || 0
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
    var gross = inputs.grossSalary;
    var freq = inputs.payFrequency;

    // ── Calculate Each Deduction ──
    var incomeTax = gross * (inputs.incomeTaxRate / 100);
    var socialSecurity = gross * (inputs.socialSecurityRate / 100);
    var medicare = gross * (inputs.medicareRate / 100);
    var pension = gross * (inputs.pensionRate / 100);
    var other = inputs.otherDeductions;

    // ── Total Deductions ──
    var totalDeductions = incomeTax + socialSecurity + medicare + pension + other;

    // ── Take-Home Pay ──
    var takeHome = gross - totalDeductions;

    // ── Take-Home Percentage ──
    var takeHomePct = gross > 0 ? (takeHome / gross) * 100 : 0;

    // ── Per Pay Period ──
    var multiplier = getFrequencyMultiplier(freq);
    var grossPerPeriod = gross / multiplier;
    var takeHomePerPeriod = takeHome / multiplier;
    var totalDeductionsPerPeriod = totalDeductions / multiplier;
    var incomeTaxPerPeriod = incomeTax / multiplier;
    var socialSecurityPerPeriod = socialSecurity / multiplier;
    var medicarePerPeriod = medicare / multiplier;
    var pensionPerPeriod = pension / multiplier;
    var otherPerPeriod = other / multiplier;

    // ── Update Outputs ──
    document.getElementById('output_takeHomePay').querySelector('.output-number').textContent = formatPayFrequency(takeHomePerPeriod, freq);
    document.getElementById('output_totalDeductions').querySelector('.output-number').textContent = formatPayFrequency(totalDeductionsPerPeriod, freq);
    document.getElementById('output_incomeTaxAmount').querySelector('.output-number').textContent = formatPayFrequency(incomeTaxPerPeriod, freq);
    document.getElementById('output_socialSecurityAmount').querySelector('.output-number').textContent = formatPayFrequency(socialSecurityPerPeriod, freq);
    document.getElementById('output_medicareAmount').querySelector('.output-number').textContent = formatPayFrequency(medicarePerPeriod, freq);
    document.getElementById('output_pensionAmount').querySelector('.output-number').textContent = formatPayFrequency(pensionPerPeriod, freq);
    document.getElementById('output_takeHomePercentage').querySelector('.output-number').textContent = takeHomePct.toFixed(1) + '%';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var items = [
        { label: 'Gross Salary', amount: grossPerPeriod },
        { label: 'Income Tax', amount: incomeTaxPerPeriod },
        { label: 'Social Security', amount: socialSecurityPerPeriod },
        { label: 'Medicare', amount: medicarePerPeriod },
        { label: 'Pension', amount: pensionPerPeriod },
        { label: 'Other Deductions', amount: otherPerPeriod },
        { label: 'Take-Home Pay', amount: takeHomePerPeriod, highlight: true }
      ];

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';
      items.forEach(function(item) {
        if (item.amount !== 0 || item.label === 'Gross Salary' || item.label === 'Take-Home Pay') {
          var style = item.highlight ? 'font-weight: 700; border-top: 0.125rem solid var(--text-primary); padding-top: 0.3rem;' : '';
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default); ' + style + '">';
          html += '<span style="' + (item.highlight ? 'font-weight: 600;' : 'color: var(--text-muted);') + '">' + item.label + '</span>';
          html += '<span><strong>' + formatCurrency(item.amount) + '</strong></span>';
          html += '</div>';
        }
      });
      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      gross: grossPerPeriod,
      takeHome: takeHomePerPeriod,
      incomeTax: incomeTaxPerPeriod,
      socialSecurity: socialSecurityPerPeriod,
      medicare: medicarePerPeriod,
      pension: pensionPerPeriod,
      other: otherPerPeriod,
      takeHomePct: takeHomePct
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        grossSalary: gross,
        payFrequency: freq,
        incomeTaxRate: inputs.incomeTaxRate,
        takeHomePay: takeHomePerPeriod,
        totalDeductions: totalDeductionsPerPeriod
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
      { label: 'Take-Home Pay', value: data.takeHome, color: '#2F6F5E' }
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
            title: { display: true, text: 'Pay Breakdown', font: { size: 14 } },
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
      var gross = data.gross;
      var totalDeductions = categories.filter(function(c) { return c.label !== 'Take-Home Pay'; }).reduce(function(sum, c) { return sum + c.value; }, 0);
      var takeHome = data.takeHome;

      return {
        type: 'bar',
        data: {
          labels: ['Gross Pay', 'Total Deductions', 'Take-Home Pay'],
          datasets: [{
            label: 'Amount',
            data: [gross, totalDeductions, takeHome],
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
            title: { display: true, text: 'Pay Comparison', font: { size: 14 } }
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
      var gross2 = data.gross;
      var pctData = categories.map(function(c) {
        return { label: c.label, value: gross2 > 0 ? (c.value / gross2) * 100 : 0 };
      });

      return {
        type: 'bar',
        data: {
          labels: pctData.map(function(d) { return d.label; }),
          datasets: [{
            label: 'Percentage of Gross Pay',
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
            title: { display: true, text: 'Distribution of Gross Pay', font: { size: 14 } }
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
    document.getElementById('input_grossSalary').value = 75000;
    document.getElementById('input_payFrequency').value = 'bi-weekly';
    document.getElementById('input_incomeTaxRate').value = 20.0;
    document.getElementById('input_socialSecurityRate').value = 6.2;
    document.getElementById('input_medicareRate').value = 1.45;
    document.getElementById('input_pensionRate').value = 5.0;
    document.getElementById('input_otherDeductions').value = 0;
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
/* ═══════════════════════════════════════════════════════════
   CRYCAL — Salary Calculator
   Tool ID: salary
   Pure pay-period conversion math — no tax brackets, no region
   assumptions. Works with any currency and any work schedule.
═══════════════════════════════════════════════════════════ */

(function () {

  var chartInstance = null;
  var currentTab = 'compare';

  // ── Get Inputs ──
  function getInputs() {
    return {
      salaryAmount: parseFloat(document.getElementById('input_salaryAmount').value) || 0,
      payPeriod: (document.getElementById('input_payPeriod').value || 'annual').toLowerCase(),
      hoursPerDay: parseFloat(document.getElementById('input_hoursPerDay').value) || 8,
      daysPerWeek: parseFloat(document.getElementById('input_daysPerWeek').value) || 5,
      weeksPerYear: parseFloat(document.getElementById('input_weeksPerYear').value) || 52,
      taxRate: parseFloat(document.getElementById('input_taxRate').value) || 0,
      otherDeductions: parseFloat(document.getElementById('input_otherDeductions').value) || 0
    };
  }

  // ── Convert any amount at a given pay period into an annual figure ──
  // Shared by both the salary amount and Other Deductions, since deductions
  // are entered in the same period the user picked for their salary.
  function annualizeAmount(amount, payPeriod, hoursPerDay, daysPerWeek, weeksPerYear) {
    var hoursPerYear = hoursPerDay * daysPerWeek * weeksPerYear;
    var daysPerYear = daysPerWeek * weeksPerYear;

    switch (payPeriod) {
      case 'hourly': return amount * hoursPerYear;
      case 'daily': return amount * daysPerYear;
      case 'weekly': return amount * weeksPerYear;
      case 'biweekly': return amount * (weeksPerYear / 2);
      case 'monthly': return amount * 12;
      case 'annual':
      default:
        return amount;
    }
  }

  // ── Derive every pay period, plus tax/deductions, from the annual figure ──
  function calculateSalary(inputs) {
    var annual = annualizeAmount(inputs.salaryAmount, inputs.payPeriod, inputs.hoursPerDay, inputs.daysPerWeek, inputs.weeksPerYear);
    var hoursPerYear = Math.max(1, inputs.hoursPerDay * inputs.daysPerWeek * inputs.weeksPerYear);
    var daysPerYear = Math.max(1, inputs.daysPerWeek * inputs.weeksPerYear);
    var weeksPerYear = Math.max(1, inputs.weeksPerYear);

    // Other Deductions are entered in the same period as the salary, so
    // annualize them the same way before combining with the tax amount.
    var annualOtherDeductions = annualizeAmount(inputs.otherDeductions, inputs.payPeriod, inputs.hoursPerDay, inputs.daysPerWeek, inputs.weeksPerYear);
    var taxAmount = annual * (inputs.taxRate / 100);
    var totalDeductions = taxAmount + annualOtherDeductions;
    var takeHomePay = Math.max(0, annual - totalDeductions);

    return {
      hourlyRate: annual / hoursPerYear,
      dailyRate: annual / daysPerYear,
      weeklyRate: annual / weeksPerYear,
      biWeeklyRate: annual / (weeksPerYear / 2),
      monthlyRate: annual / 12,
      annualRate: annual,
      taxAmount: taxAmount,
      annualOtherDeductions: annualOtherDeductions,
      totalDeductions: totalDeductions,
      takeHomePay: takeHomePay
    };
  }

  // ── Format Currency ──
  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD';
    if (typeof formatCurrency === 'function') return formatCurrency(amount, code);
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: code, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    } catch (e) {
      return code + ' ' + amount.toFixed(2);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.salaryAmount <= 0) {
      document.querySelectorAll('.output-number').forEach(function (el) { el.textContent = '—'; });
      return;
    }

    var result = calculateSalary(inputs);

    document.getElementById('output_hourlyRate').querySelector('.output-number').textContent = formatCurrencyLocal(result.hourlyRate);
    document.getElementById('output_dailyRate').querySelector('.output-number').textContent = formatCurrencyLocal(result.dailyRate);
    document.getElementById('output_weeklyRate').querySelector('.output-number').textContent = formatCurrencyLocal(result.weeklyRate);
    document.getElementById('output_biWeeklyRate').querySelector('.output-number').textContent = formatCurrencyLocal(result.biWeeklyRate);
    document.getElementById('output_monthlyRate').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyRate);
    document.getElementById('output_annualRate').querySelector('.output-number').textContent = formatCurrencyLocal(result.annualRate);
    document.getElementById('output_totalDeductions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalDeductions);
    document.getElementById('output_takeHomePay').querySelector('.output-number').textContent = formatCurrencyLocal(result.takeHomePay);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory(inputs);
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
    var symbol = (typeof getCurrencySymbol === 'function')
      ? getCurrencySymbol((typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD')
      : '';

    if (tab === 'compare') {
      // Annual excluded — its scale dwarfs the others and would flatten this chart.
      return {
        type: 'bar',
        data: {
          labels: ['Hourly', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly'],
          datasets: [{
            label: 'Pay (' + symbol + ')',
            data: [result.hourlyRate, result.dailyRate, result.weeklyRate, result.biWeeklyRate, result.monthlyRate],
            backgroundColor: '#C08A2E',
            borderColor: '#A87520',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, title: { display: true, text: 'Pay by Period', font: { size: 14 } } },
          scales: { y: { beginAtZero: true, ticks: { callback: function (v) { return symbol + v.toFixed(0); } } } }
        }
      };
    }

    if (tab === 'raise') {
      var raises = [0, 3, 5, 10, 15, 20];
      var annualAtRaise = raises.map(function (pct) { return result.annualRate * (1 + pct / 100); });
      var colors = raises.map(function (pct) { return pct === 0 ? '#2F6F5E' : '#C08A2E'; });

      return {
        type: 'bar',
        data: {
          labels: raises.map(function (pct) { return '+' + pct + '%'; }),
          datasets: [{
            label: 'Annual Salary (' + symbol + ')',
            data: annualAtRaise,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, title: { display: true, text: 'Annual Salary at Different Raise Percentages', font: { size: 14 } } },
          scales: { y: { beginAtZero: true, ticks: { callback: function (v) { return symbol + v.toFixed(0); } } } }
        }
      };
    }

    if (tab === 'workdays') {
      var workingDays = Math.min(365, inputs.daysPerWeek * inputs.weeksPerYear);
      var offDays = Math.max(0, 365 - workingDays);

      return {
        type: 'doughnut',
        data: {
          labels: ['Working Days', 'Non-Working Days'],
          datasets: [{
            data: [workingDays, offDays],
            backgroundColor: ['#2F6F5E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Working Days vs Non-Working Days (Year)', font: { size: 14 } },
            tooltip: { callbacks: { label: function (ctx) { return ctx.label + ': ' + ctx.parsed.toFixed(0) + ' days'; } } }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'takehome') {
      var symbol2 = symbol;
      return {
        type: 'doughnut',
        data: {
          labels: ['Take-Home Pay', 'Tax', 'Other Deductions'],
          datasets: [{
            data: [result.takeHomePay, result.taxAmount, result.annualOtherDeductions],
            backgroundColor: ['#2F6F5E', '#B23A3A', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Annual Gross Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: { label: function (ctx) { return ctx.label + ': ' + symbol2 + ctx.parsed.toFixed(0); } }
            }
          },
          cutout: '60%'
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

  // ── Reset ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function (el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (el.type === 'number' || el.type === 'text') {
        el.value = defaultVal;
      } else if (el.tagName === 'SELECT') {
        if (defaultVal) el.value = defaultVal;
        else el.selectedIndex = 0;
      }
    });
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Init ──
  function init() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function (el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', init);

})();
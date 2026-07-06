/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Overtime Pay Calculator
   Tool ID: overtime-pay
   Tiered pay: regular hours -> overtime hours -> double-time hours,
   all thresholds/multipliers user-editable (no hardcoded country rule).
═══════════════════════════════════════════════════════════ */

(function () {

  var chartInstance = null;
  var currentTab = 'payBreakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      hourlyRate: parseFloat(document.getElementById('input_hourlyRate').value) || 0,
      hoursWorked: Math.max(0, parseFloat(document.getElementById('input_hoursWorked').value) || 0),
      regularThreshold: Math.max(0, parseFloat(document.getElementById('input_regularThreshold').value) || 0),
      overtimeMultiplier: parseFloat(document.getElementById('input_overtimeMultiplier').value) || 1,
      doubleTimeThreshold: Math.max(0, parseFloat(document.getElementById('input_doubleTimeThreshold').value) || 0),
      doubleTimeMultiplier: parseFloat(document.getElementById('input_doubleTimeMultiplier').value) || 1,
      periodsPerYear: Math.max(1, parseFloat(document.getElementById('input_periodsPerYear').value) || 52)
    };
  }

  // ── Split hours into regular / overtime / double-time tiers ──
  function splitHours(hoursWorked, regularThreshold, doubleTimeThreshold) {
    var regularHours = Math.min(hoursWorked, regularThreshold);
    var remaining = Math.max(0, hoursWorked - regularThreshold);

    // Double-time only kicks in if its threshold is set AND is actually
    // higher than the regular threshold — otherwise treat it as disabled.
    var dtEnabled = doubleTimeThreshold > regularThreshold;

    var overtimeHours, doubleTimeHours;
    if (dtEnabled) {
      var otCap = doubleTimeThreshold - regularThreshold;
      overtimeHours = Math.min(remaining, otCap);
      doubleTimeHours = Math.max(0, hoursWorked - doubleTimeThreshold);
    } else {
      overtimeHours = remaining;
      doubleTimeHours = 0;
    }

    return { regularHours: regularHours, overtimeHours: overtimeHours, doubleTimeHours: doubleTimeHours };
  }

  function calculateOvertime(inputs) {
    var hours = splitHours(inputs.hoursWorked, inputs.regularThreshold, inputs.doubleTimeThreshold);

    var regularPay = hours.regularHours * inputs.hourlyRate;
    var overtimePay = hours.overtimeHours * inputs.hourlyRate * inputs.overtimeMultiplier;
    var doubleTimePay = hours.doubleTimeHours * inputs.hourlyRate * inputs.doubleTimeMultiplier;
    var totalPay = regularPay + overtimePay + doubleTimePay;
    var annualProjection = totalPay * inputs.periodsPerYear;

    return {
      regularHours: hours.regularHours,
      overtimeHours: hours.overtimeHours,
      doubleTimeHours: hours.doubleTimeHours,
      regularPay: regularPay,
      overtimePay: overtimePay,
      doubleTimePay: doubleTimePay,
      totalPay: totalPay,
      annualProjection: annualProjection
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

    if (inputs.hourlyRate <= 0) {
      document.querySelectorAll('.output-number').forEach(function (el) { el.textContent = '—'; });
      return;
    }

    var result = calculateOvertime(inputs);

    document.getElementById('output_regularPay').querySelector('.output-number').textContent = formatCurrencyLocal(result.regularPay);
    document.getElementById('output_overtimePay').querySelector('.output-number').textContent = formatCurrencyLocal(result.overtimePay);
    document.getElementById('output_doubleTimePay').querySelector('.output-number').textContent = formatCurrencyLocal(result.doubleTimePay);
    document.getElementById('output_totalPay').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalPay);
    document.getElementById('output_annualProjection').querySelector('.output-number').textContent = formatCurrencyLocal(result.annualProjection);

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

    if (tab === 'payBreakdown') {
      var labels = ['Regular Pay', 'Overtime Pay'];
      var data = [result.regularPay, result.overtimePay];
      var colors = ['#2F6F5E', '#C08A2E'];
      if (result.doubleTimePay > 0) {
        labels.push('Double-Time Pay');
        data.push(result.doubleTimePay);
        colors.push('#B23A3A');
      }
      return {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Pay Breakdown (This Period)', font: { size: 14 } },
            tooltip: { callbacks: { label: function (ctx) { return ctx.label + ': ' + symbol + ctx.parsed.toFixed(2); } } }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'hoursBreakdown') {
      var hLabels = ['Regular Hours', 'Overtime Hours'];
      var hData = [result.regularHours, result.overtimeHours];
      var hColors = ['#2F6F5E', '#C08A2E'];
      if (result.doubleTimeHours > 0) {
        hLabels.push('Double-Time Hours');
        hData.push(result.doubleTimeHours);
        hColors.push('#B23A3A');
      }
      return {
        type: 'doughnut',
        data: { labels: hLabels, datasets: [{ data: hData, backgroundColor: hColors, borderWidth: 0 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Hours Breakdown (This Period)', font: { size: 14 } },
            tooltip: { callbacks: { label: function (ctx) { return ctx.label + ': ' + ctx.parsed.toFixed(1) + ' hrs'; } } }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'scenario') {
      // Show total pay if the person worked additional hours beyond what they entered.
      var extraHoursOptions = [0, 5, 10, 15, 20];
      var scenarioPay = extraHoursOptions.map(function (extra) {
        var scenarioInputs = {
          hourlyRate: inputs.hourlyRate,
          hoursWorked: inputs.hoursWorked + extra,
          regularThreshold: inputs.regularThreshold,
          overtimeMultiplier: inputs.overtimeMultiplier,
          doubleTimeThreshold: inputs.doubleTimeThreshold,
          doubleTimeMultiplier: inputs.doubleTimeMultiplier,
          periodsPerYear: inputs.periodsPerYear
        };
        return calculateOvertime(scenarioInputs).totalPay;
      });
      var colors2 = extraHoursOptions.map(function (e) { return e === 0 ? '#2F6F5E' : '#C08A2E'; });

      return {
        type: 'bar',
        data: {
          labels: extraHoursOptions.map(function (e) { return e === 0 ? 'Current' : '+' + e + ' hrs'; }),
          datasets: [{ label: 'Total Pay (' + symbol + ')', data: scenarioPay, backgroundColor: colors2, borderColor: colors2, borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, title: { display: true, text: 'Total Pay With Additional Hours', font: { size: 14 } } },
          scales: { y: { beginAtZero: true, ticks: { callback: function (v) { return symbol + v.toFixed(0); } } } }
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
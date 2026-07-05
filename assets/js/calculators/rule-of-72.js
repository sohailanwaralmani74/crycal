/* ═══════════════════════════════════════════════════════════
   CRYCAL — Rule of 72 Calculator
   Tool ID: rule-of-72
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      annualRate: parseFloat(document.getElementById('input_annualRate').value) || 0,
      targetTime: parseFloat(document.getElementById('input_targetTime').value) || 0,
      principal: parseFloat(document.getElementById('input_principal').value) || 0
    };
  }

  // ── Calculate Time to Double (Exact) ──
  function calculateExactTime(rate) {
    if (rate <= 0) return Infinity;
    var r = rate / 100;
    return Math.log(2) / Math.log(1 + r);
  }

  // ── Calculate Required Rate (Exact) ──
  function calculateRequiredRate(time) {
    if (time <= 0) return 0;
    return (Math.exp(Math.log(2) / time) - 1) * 100;
  }

  // ── Calculate Future Value ──
  function calculateFutureValue(principal, rate, time) {
    if (rate <= 0 || time <= 0) return principal;
    var r = rate / 100;
    return principal * Math.pow(1 + r, time);
  }

  // ── Main Calculation ──
  function calculateRuleOf72(inputs) {
    var rate = inputs.annualRate;
    var targetTime = inputs.targetTime;
    var principal = inputs.principal;

    var result = {
      timeToDouble: 0,
      requiredRate: 0,
      finalBalance: 0,
      totalGrowth: 0,
      ruleOf72Estimate: 0,
      exactTime: 0,
      exactRate: 0,
      yearData: []
    };

    // Mode 1: Calculate time to double (targetTime = 0)
    if (targetTime === 0) {
      result.ruleOf72Estimate = rate > 0 ? 72 / rate : Infinity;
      result.exactTime = calculateExactTime(rate);
      result.timeToDouble = result.exactTime;
      result.requiredRate = 0;

      // Generate year data until double
      var time = result.exactTime;
      if (isFinite(time) && principal > 0) {
        var steps = Math.max(30, Math.ceil(time * 2));
        var stepSize = time / steps;
        for (var i = 0; i <= steps; i++) {
          var year = i * stepSize;
          var balance = calculateFutureValue(principal, rate, year);
          result.yearData.push({
            year: year,
            balance: balance,
            doublingLine: principal * 2
          });
        }
        // Ensure the last point is exactly at doubling
        var finalBalance = calculateFutureValue(principal, rate, time);
        result.finalBalance = finalBalance;
        result.totalGrowth = finalBalance - principal;
      } else if (principal > 0) {
        // No growth (rate = 0)
        result.finalBalance = principal;
        result.totalGrowth = 0;
        result.yearData = [{ year: 0, balance: principal, doublingLine: principal * 2 }];
      }
    }
    // Mode 2: Calculate required rate (targetTime > 0)
    else {
      result.exactRate = calculateRequiredRate(targetTime);
      result.requiredRate = result.exactRate;
      result.timeToDouble = targetTime;
      result.ruleOf72Estimate = result.exactRate > 0 ? 72 / result.exactRate : 0;

      // Generate year data using the required rate
      if (principal > 0) {
        var t = targetTime;
        var steps2 = Math.max(30, Math.ceil(t * 2));
        var stepSize2 = t / steps2;
        for (var j = 0; j <= steps2; j++) {
          var year2 = j * stepSize2;
          var balance2 = calculateFutureValue(principal, result.exactRate, year2);
          result.yearData.push({
            year: year2,
            balance: balance2,
            doublingLine: principal * 2
          });
        }
        var finalBalance2 = calculateFutureValue(principal, result.exactRate, t);
        result.finalBalance = finalBalance2;
        result.totalGrowth = finalBalance2 - principal;
      }
    }

    return result;
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

  // ── Format Time ──
  function formatTime(years) {
    if (years === Infinity || !isFinite(years)) return '∞';
    if (years < 0.1) {
      var months = Math.round(years * 12);
      return months + ' month' + (months !== 1 ? 's' : '');
    }
    var y = Math.floor(years);
    var m = Math.round((years - y) * 12);
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateRuleOf72(inputs);

    // Update outputs
    document.getElementById('output_timeToDouble').querySelector('.output-number').textContent = formatTime(result.timeToDouble);
    document.getElementById('output_requiredRate').querySelector('.output-number').textContent = result.requiredRate.toFixed(2);
    document.getElementById('output_finalBalance').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalBalance);
    document.getElementById('output_totalGrowth').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalGrowth);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        annualRate: inputs.annualRate,
        targetTime: inputs.targetTime,
        principal: inputs.principal
      };
      window.logHistory(inputSnapshot);
    }

    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Chart Rendering ──
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
    var yearData = result.yearData;

    if (tab === 'growth') {
      if (!yearData || yearData.length === 0) {
        return {
          type: 'line',
          data: {
            labels: ['0'],
            datasets: [
              {
                label: 'Balance',
                data: [inputs.principal],
                borderColor: '#C08A2E',
                pointBackgroundColor: '#C08A2E'
              },
              {
                label: 'Doubling Target',
                data: [inputs.principal * 2],
                borderColor: '#B23A3A',
                borderDash: [5, 5],
                pointBackgroundColor: '#B23A3A',
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Growth to Doubling', font: { size: 14 } }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Balance (' + currencySymbol + ')' },
                ticks: {
                  callback: function(value) { return currencySymbol + value.toFixed(0); }
                }
              },
              x: {
                title: { display: true, text: 'Years' }
              }
            }
          }
        };
      }

      var labels = yearData.map(function(d) { return d.year.toFixed(1); });
      var balanceData = yearData.map(function(d) { return d.balance; });
      var doublingData = yearData.map(function(d) { return d.doublingLine; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Balance',
              data: balanceData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Doubling Target',
              data: doublingData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.1,
              borderDash: [6, 4],
              pointBackgroundColor: '#B23A3A',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Growth to Doubling', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Years' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var principal = inputs.principal;
      var growth = result.totalGrowth;

      if (growth < 0) growth = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Starting Amount', 'Growth'],
          datasets: [{
            data: [principal, growth],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Final Balance', font: { size: 14 } }
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
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) {
        el.value = defaultVal;
      } else if (el.type !== 'select-one') {
        el.value = '';
      }
    });
    if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') {
        el.value = defaultVal;
      }
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') {
        window.updateTool();
      }
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') {
          window.updateTool();
        }
      });
    }
  });

})();
/* ═══════════════════════════════════════════════════════════
   CRYCAL — Investment Calculator
   Tool ID: investment
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      initialInvestment: parseFloat(document.getElementById('input_initialInvestment').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0,
      annualReturn: parseFloat(document.getElementById('input_annualReturn').value) || 0,
      investmentPeriod: parseFloat(document.getElementById('input_investmentPeriod').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'annually': 1,
      'semi-annually': 2,
      'quarterly': 4,
      'monthly': 12,
      'daily': 365
    };
    return map[frequency] || 12;
  }

  // ── Calculate Future Value ──
  function calculateFutureValue(initial, monthly, rate, years, n) {
    var r = rate / 100;
    var PMT = monthly;
    var perPeriodContribution = PMT * (12 / n);

    var fvInitial = initial * Math.pow(1 + r / n, n * years);

    var fvContributions = 0;
    if (perPeriodContribution > 0 && r > 0) {
      fvContributions = perPeriodContribution * (Math.pow(1 + r / n, n * years) - 1) / (r / n);
    } else if (perPeriodContribution > 0 && r === 0) {
      fvContributions = perPeriodContribution * n * years;
    }

    return fvInitial + fvContributions;
  }

  // ── Calculate CAGR ──
  function calculateCAGR(initial, final, years) {
    if (initial <= 0 || years <= 0) return 0;
    return (Math.pow(final / initial, 1 / years) - 1) * 100;
  }

  // ── Main Calculation ──
  function calculateInvestment(inputs) {
    var initial = inputs.initialInvestment;
    var monthly = inputs.monthlyContribution;
    var rate = inputs.annualReturn;
    var years = inputs.investmentPeriod;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    var futureValue = calculateFutureValue(initial, monthly, rate, years, n);
    var totalContributions = initial + (monthly * 12 * years);
    var totalReturns = futureValue - totalContributions;
    var cagr = calculateCAGR(initial, futureValue, years);

    // Year-by-year data for charts
    var yearData = [];
    var steps = Math.max(50, Math.ceil(years * 12));
    var stepSize = years / steps;

    for (var i = 0; i <= steps; i++) {
      var t = i * stepSize;
      var fv = calculateFutureValue(initial, monthly, rate, t, n);
      var contribs = initial + (monthly * 12 * t);
      var returns = fv - contribs;
      yearData.push({
        year: t,
        total: fv,
        contributions: contribs,
        returns: returns
      });
    }

    return {
      futureValue: futureValue,
      totalContributions: totalContributions,
      totalReturns: totalReturns,
      cagr: cagr,
      yearData: yearData
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

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateInvestment(inputs);

    // Update outputs
    document.getElementById('output_futureValue').querySelector('.output-number').textContent = formatCurrencyLocal(result.futureValue);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalReturns').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalReturns);
    document.getElementById('output_cagr').querySelector('.output-number').textContent = result.cagr.toFixed(2);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        initialInvestment: inputs.initialInvestment,
        monthlyContribution: inputs.monthlyContribution,
        annualReturn: inputs.annualReturn,
        investmentPeriod: inputs.investmentPeriod,
        compoundingFrequency: inputs.compoundingFrequency
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
      var labels = yearData.map(function(d) { return d.year.toFixed(1); });
      var totalData = yearData.map(function(d) { return d.total; });
      var contribData = yearData.map(function(d) { return d.contributions; });
      var returnData = yearData.map(function(d) { return d.returns; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Value',
              data: totalData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Contributions',
              data: contribData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E'
            },
            {
              label: 'Returns',
              data: returnData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [3, 3],
              pointBackgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Investment Growth Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Value (' + currencySymbol + ')' },
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
      var final = yearData[yearData.length - 1];
      var contributions = final.contributions;
      var returns = final.returns;

      if (returns < 0) returns = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Total Returns'],
          datasets: [{
            data: [contributions, returns],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Final Value', font: { size: 14 } }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'contributions') {
      // Show a stacked bar or line of contributions vs returns over time
      var labels2 = yearData.map(function(d) { return d.year.toFixed(1); });
      var contribData2 = yearData.map(function(d) { return d.contributions; });
      var returnData2 = yearData.map(function(d) { return d.returns; });

      // Ensure returns don't go negative for stacking
      var positiveReturns = returnData2.map(function(v) { return v < 0 ? 0 : v; });

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Contributions',
              data: contribData2,
              backgroundColor: '#2F6F5E',
              borderColor: '#1f4f42',
              borderWidth: 0
            },
            {
              label: 'Returns',
              data: positiveReturns,
              backgroundColor: '#C08A2E',
              borderColor: '#A87520',
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Contributions vs Returns Over Time', font: { size: 14 } }
          },
          scales: {
            x: { stacked: true },
            y: {
              stacked: true,
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
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
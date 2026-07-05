/* ═══════════════════════════════════════════════════════════
   CRYCAL — Compound Interest Calculator
   Tool ID: compound-interest
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      principal: parseFloat(document.getElementById('input_principal').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0,
      annualRate: parseFloat(document.getElementById('input_annualRate').value) || 0,
      years: parseFloat(document.getElementById('input_years').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0
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

  // ── Calculate compound interest ──
  function calculateCompoundInterest(inputs) {
    var P = inputs.principal;
    var PMT = inputs.monthlyContribution;
    var r = inputs.annualRate / 100;
    var t = inputs.years;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var inflation = inputs.inflationRate / 100;

    // Future value of principal
    var FV_principal = P * Math.pow(1 + r / n, n * t);

    // Future value of monthly contributions (annuity)
    var perPeriodContribution = PMT * (12 / n);
    var FV_contributions = 0;
    if (perPeriodContribution > 0 && r > 0) {
      FV_contributions = perPeriodContribution * (Math.pow(1 + r / n, n * t) - 1) / (r / n);
    } else if (perPeriodContribution > 0 && r === 0) {
      FV_contributions = perPeriodContribution * n * t;
    }

    var futureValue = FV_principal + FV_contributions;
    var totalContributions = P + (inputs.monthlyContribution * 12 * t);
    var totalInterest = futureValue - totalContributions;

    // Inflation-adjusted future value
    var inflationAdjusted = futureValue / Math.pow(1 + inflation, t);

    // Year-by-year data for charts
    var yearData = [];
    for (var year = 0; year <= t; year++) {
      var fvP = P * Math.pow(1 + r / n, n * year);
      var fvC = 0;
      if (perPeriodContribution > 0 && r > 0) {
        fvC = perPeriodContribution * (Math.pow(1 + r / n, n * year) - 1) / (r / n);
      } else if (perPeriodContribution > 0 && r === 0) {
        fvC = perPeriodContribution * n * year;
      }
      var total = fvP + fvC;
      var contribs = P + (inputs.monthlyContribution * 12 * year);
      var interest = total - contribs;
      yearData.push({
        year: year,
        total: total,
        contributions: contribs,
        interest: interest
      });
    }

    return {
      futureValue: futureValue,
      totalContributions: totalContributions,
      totalInterest: totalInterest,
      inflationAdjusted: inflationAdjusted,
      yearData: yearData,
      perPeriodContribution: perPeriodContribution,
      n: n,
      r: r,
      t: t,
      P: P,
      PMT: PMT
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
      return getCurrencySymbol(code)  + "\u00A0\u00A0"+ amount.toFixed(3);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateCompoundInterest(inputs);

    // Update outputs
    document.getElementById('output_futureValue').querySelector('.output-number').textContent = formatCurrencyLocal(result.futureValue);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_inflationAdjusted').querySelector('.output-number').textContent = formatCurrencyLocal(result.inflationAdjusted);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        principal: inputs.principal,
        monthlyContribution: inputs.monthlyContribution,
        annualRate: inputs.annualRate,
        years: inputs.years,
        compoundingFrequency: inputs.compoundingFrequency,
        inflationRate: inputs.inflationRate
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
      var labels = yearData.map(function(d) { return d.year; });
      var totalData = yearData.map(function(d) { return d.total; });
      var contribData = yearData.map(function(d) { return d.contributions; });
      var interestData = yearData.map(function(d) { return d.interest; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Balance',
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
              label: 'Interest Earned',
              data: interestData,
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
            title: { display: true, text: 'Growth Over Time', font: { size: 14 } }
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
      var final = yearData[yearData.length - 1];
      var principal = inputs.principal;
      var contributions = final.contributions - principal;
      var interest = final.interest;

      return {
        type: 'bar',
        data: {
          labels: ['Final Balance'],
          datasets: [
            {
              label: 'Initial Principal',
              data: [principal],
              backgroundColor: '#2F6F5E',
              borderWidth: 0
            },
            {
              label: 'Contributions',
              data: [contributions],
              backgroundColor: '#DCE1E3',
              borderWidth: 0
            },
            {
              label: 'Interest Earned',
              data: [interest],
              backgroundColor: '#C08A2E',
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Breakdown of Final Balance', font: { size: 14 } }
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

    if (tab === 'contribution') {
      var final2 = yearData[yearData.length - 1];
      var principal2 = inputs.principal;
      var contributions2 = final2.contributions - principal2;
      var interest2 = final2.interest;

      if (interest2 < 0) interest2 = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Initial Principal', 'Total Contributions', 'Interest Earned'],
          datasets: [{
            data: [principal2, contributions2, interest2],
            backgroundColor: ['#2F6F5E', '#DCE1E3', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Allocation of Final Balance', font: { size: 14 } }
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
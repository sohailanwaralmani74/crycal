/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Roth IRA Calculator
   Tool ID: roth-ira
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      currentAge: parseFloat(document.getElementById('input_currentAge').value) || 0,
      retirementAge: parseFloat(document.getElementById('input_retirementAge').value) || 0,
      currentBalance: parseFloat(document.getElementById('input_currentBalance').value) || 0,
      annualContribution: parseFloat(document.getElementById('input_annualContribution').value) || 0,
      contributionIncrease: parseFloat(document.getElementById('input_contributionIncrease').value) || 0,
      annualReturn: parseFloat(document.getElementById('input_annualReturn').value) || 0,
      feeRate: parseFloat(document.getElementById('input_feeRate').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
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

  // ── Calculate Future Value with growing contributions ──
  function calculateFutureValue(current, annualContribution, growthRate, netReturn, years, n) {
    var r = netReturn / 100;
    var g = growthRate / 100;

    var fvCurrent = current * Math.pow(1 + r / n, n * years);

    var fvContributions = 0;
    if (annualContribution > 0) {
      for (var year = 0; year < years; year++) {
        var contrib = annualContribution * Math.pow(1 + g, year);
        var yearsLeft = years - year;
        var fvContrib = contrib * Math.pow(1 + r / n, n * yearsLeft);
        fvContributions += fvContrib;
      }
    }

    return fvCurrent + fvContributions;
  }

  // ── Get annual contribution for a specific year ──
  function getContributionForYear(annualContribution, growthRate, year) {
    var g = growthRate / 100;
    return annualContribution * Math.pow(1 + g, year);
  }

  // ── Main Calculation ──
  function calculateRothIRA(inputs) {
    var yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);
    var netReturn = inputs.annualReturn - inputs.feeRate;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);

    var finalBalance = calculateFutureValue(
      inputs.currentBalance,
      inputs.annualContribution,
      inputs.contributionIncrease,
      netReturn,
      yearsToRetirement,
      n
    );

    // Calculate total contributions with growth
    var totalContributions = inputs.currentBalance;
    var totalContributionsOnly = 0;
    for (var year = 0; year < yearsToRetirement; year++) {
      var contrib = getContributionForYear(inputs.annualContribution, inputs.contributionIncrease, year);
      totalContributions += contrib;
      totalContributionsOnly += contrib;
    }

    var totalReturns = finalBalance - totalContributions;

    var inflationAdjusted = finalBalance / Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);

    // Year‑by‑year data for charts
    var yearData = [];
    var steps = Math.max(50, Math.ceil(yearsToRetirement * 12));
    var stepSize = yearsToRetirement / steps;

    for (var i = 0; i <= steps; i++) {
      var t = i * stepSize;
      var fv = calculateFutureValue(
        inputs.currentBalance,
        inputs.annualContribution,
        inputs.contributionIncrease,
        netReturn,
        t,
        n
      );
      var age = inputs.currentAge + t;

      // Calculate contributions up to this point
      var contribTotal = inputs.currentBalance;
      for (var y = 0; y < Math.floor(t); y++) {
        var c = getContributionForYear(inputs.annualContribution, inputs.contributionIncrease, y);
        contribTotal += c;
      }
      // Partial year contribution
      if (t > 0) {
        var yearFrac = t - Math.floor(t);
        if (yearFrac > 0) {
          var cPartial = getContributionForYear(inputs.annualContribution, inputs.contributionIncrease, Math.floor(t)) * yearFrac;
          contribTotal += cPartial;
        }
      }

      var returns = fv - contribTotal;

      yearData.push({
        age: age,
        year: t,
        total: fv,
        contributions: contribTotal,
        returns: returns,
        inflationAdjusted: fv / Math.pow(1 + inputs.inflationRate / 100, t)
      });
    }

    return {
      finalBalance: finalBalance,
      totalContributions: totalContributions,
      totalContributionsOnly: totalContributionsOnly,
      totalReturns: totalReturns,
      inflationAdjusted: inflationAdjusted,
      yearData: yearData,
      yearsToRetirement: yearsToRetirement,
      netReturn: netReturn
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
    var result = calculateRothIRA(inputs);

    // Update outputs
    document.getElementById('output_finalBalance').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalBalance);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalReturns').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalReturns);
    document.getElementById('output_inflationAdjusted').querySelector('.output-number').textContent = formatCurrencyLocal(result.inflationAdjusted);
    document.getElementById('output_taxFreeWithdrawals').querySelector('.output-number').textContent = '✓ Qualified withdrawals are tax‑free';

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentBalance: inputs.currentBalance,
        annualContribution: inputs.annualContribution,
        contributionIncrease: inputs.contributionIncrease,
        annualReturn: inputs.annualReturn,
        feeRate: inputs.feeRate,
        inflationRate: inputs.inflationRate,
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
      var labels = yearData.map(function(d) { return d.age.toFixed(0); });
      var totalData = yearData.map(function(d) { return d.total; });
      var contribData = yearData.map(function(d) { return d.contributions; });
      var returnData = yearData.map(function(d) { return d.returns; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Roth IRA Balance',
              data: totalData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Total Contributions',
              data: contribData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E'
            },
            {
              label: 'Investment Returns',
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
            title: { display: true, text: 'Roth IRA Growth Over Time', font: { size: 14 } }
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
              title: { display: true, text: 'Age' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var contributions = inputs.currentBalance + result.totalContributionsOnly;
      var returns = result.totalReturns;

      if (returns < 0) returns = 0;

      return {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Investment Returns'],
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
            title: { display: true, text: 'Breakdown of Final Roth IRA Balance', font: { size: 14 } }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'contributions') {
      var labels2 = yearData.map(function(d) { return d.age.toFixed(0); });
      var contribData2 = yearData.map(function(d) { return d.contributions; });
      var returnData2 = yearData.map(function(d) { return d.returns > 0 ? d.returns : 0; });

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
              data: returnData2,
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
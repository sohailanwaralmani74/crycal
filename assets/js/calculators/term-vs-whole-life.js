/* ═══════════════════════════════════════════════════════════
   CRYCAL — Term vs Whole Life Calculator
   Tool ID: term-vs-whole-life
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      age: parseFloat(document.getElementById('input_age').value) || 0,
      coverageAmount: parseFloat(document.getElementById('input_coverageAmount').value) || 0,
      termLength: parseFloat(document.getElementById('input_termLength').value) || 0,
      investmentReturn: parseFloat(document.getElementById('input_investmentReturn').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value
    };
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'daily': 365,
      'monthly': 12,
      'quarterly': 4,
      'semi-annually': 2,
      'annually': 1
    };
    return map[frequency] || 12;
  }

  // ── Estimate Term Premium (monthly) ──
  function estimateTermPremium(age, coverage, termLength) {
    // Simplified model based on average term life rates
    // Base rate per $1,000 of coverage
    var baseRate = 0.15; // ~$0.15 per $1,000 per month for a healthy 30-year-old
    // Age factor: rates increase with age
    var ageFactor = 1 + (Math.max(0, age - 30) / 30) * 2; // doubles by age 60
    // Term factor: longer terms are slightly more expensive
    var termFactor = 1 + (termLength - 20) / 50;

    var monthlyRate = baseRate * ageFactor * termFactor;
    var premium = (coverage / 1000) * monthlyRate;

    // Round to nearest dollar
    return Math.round(premium);
  }

  // ── Estimate Whole Life Premium (monthly) ──
  function estimateWholeLifePremium(age, coverage) {
    // Whole life is typically 5-10x more expensive than term
    var termPremium = estimateTermPremium(age, coverage, 30);
    var multiple = 6 + (age - 30) * 0.05; // increases with age
    if (multiple < 5) multiple = 5;
    if (multiple > 12) multiple = 12;
    return Math.round(termPremium * multiple);
  }

  // ── Calculate Whole Life Cash Value ──
  function calculateCashValue(age, coverage, premium, termLength) {
    // Simplified cash value model
    // First 2 years: no cash value (typical for whole life)
    // Years 3-10: grows at about 3-4% of premiums paid
    // Years 10+: grows faster
    var totalPremiums = premium * 12 * termLength;
    var cashValue = 0;

    for (var year = 1; year <= termLength; year++) {
      var annualPremium = premium * 12;
      if (year <= 2) {
        // No cash value in first 2 years
        continue;
      } else if (year <= 10) {
        cashValue += annualPremium * 0.35; // ~35% of premiums paid
      } else {
        cashValue += annualPremium * 0.45; // ~45% of premiums paid
      }
      // Compound growth on existing cash value
      cashValue *= 1.025; // 2.5% guaranteed interest
    }

    // Cap at total premiums paid (simplified)
    return Math.min(cashValue, totalPremiums);
  }

  // ── Calculate Future Value of Invested Difference ──
  function calculateInvestedValue(monthlyInvestment, annualReturn, years, n) {
    if (monthlyInvestment <= 0 || years <= 0) return 0;
    var r = annualReturn / 100;
    var monthlyRate = Math.pow(1 + r / n, n / 12) - 1;

    if (monthlyRate <= 0) {
      return monthlyInvestment * 12 * years;
    }

    // Future value of monthly investments
    var totalMonths = years * 12;
    var fv = monthlyInvestment * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    return fv;
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(0);
    }
  }

  // ── Format Currency for Monthly ──
  function formatCurrencyMonthly(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount) + '/mo';
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(0) + '/mo';
    }
  }

  // ── Main Calculation ──
  function calculateTermVsWhole(inputs) {
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var termPremium = estimateTermPremium(inputs.age, inputs.coverageAmount, inputs.termLength);
    var wholeLifePremium = estimateWholeLifePremium(inputs.age, inputs.coverageAmount);
    var premiumDifference = wholeLifePremium - termPremium;

    var termTotalCost = termPremium * 12 * inputs.termLength;
    var wholeLifeTotalCost = wholeLifePremium * 12 * inputs.termLength;

    var cashValue = calculateCashValue(inputs.age, inputs.coverageAmount, wholeLifePremium, inputs.termLength);
    var investedValue = calculateInvestedValue(premiumDifference, inputs.investmentReturn, inputs.termLength, n);

    // Inflation-adjusted values
    var inflation = inputs.inflationRate / 100;
    var investedValueReal = investedValue / Math.pow(1 + inflation, inputs.termLength);
    var cashValueReal = cashValue / Math.pow(1 + inflation, inputs.termLength);

    // Recommendation
    var recommendation = '';
    if (investedValue > cashValue) {
      recommendation = 'Buy term life insurance and invest the difference.';
    } else if (cashValue > investedValue) {
      recommendation = 'Whole life insurance may be a better option for your situation.';
    } else {
      recommendation = 'The options are roughly equal. Consider your long-term goals.';
    }

    // Year-by-year data for charts
    var yearData = [];
    for (var year = 0; year <= inputs.termLength; year++) {
      var invValue = calculateInvestedValue(premiumDifference, inputs.investmentReturn, year, n);
      var cv = calculateCashValue(inputs.age, inputs.coverageAmount, wholeLifePremium, year);
      yearData.push({
        year: year,
        investedValue: invValue,
        cashValue: cv,
        premiumDifference: premiumDifference
      });
    }

    return {
      termPremium: termPremium,
      wholeLifePremium: wholeLifePremium,
      premiumDifference: premiumDifference,
      termTotalCost: termTotalCost,
      wholeLifeTotalCost: wholeLifeTotalCost,
      cashValue: cashValue,
      investedValue: investedValue,
      investedValueReal: investedValueReal,
      cashValueReal: cashValueReal,
      recommendation: recommendation,
      yearData: yearData,
      termLength: inputs.termLength
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateTermVsWhole(inputs);

    document.getElementById('output_termPremium').querySelector('.output-number').textContent = formatCurrencyMonthly(result.termPremium);
    document.getElementById('output_wholeLifePremium').querySelector('.output-number').textContent = formatCurrencyMonthly(result.wholeLifePremium);
    document.getElementById('output_premiumDifference').querySelector('.output-number').textContent = formatCurrencyMonthly(result.premiumDifference);
    document.getElementById('output_termTotalCost').querySelector('.output-number').textContent = formatCurrency(result.termTotalCost);
    document.getElementById('output_wholeLifeTotalCost').querySelector('.output-number').textContent = formatCurrency(result.wholeLifeTotalCost);
    document.getElementById('output_cashValueAtTermEnd').querySelector('.output-number').textContent = formatCurrency(result.cashValue);
    document.getElementById('output_investmentValue').querySelector('.output-number').textContent = formatCurrency(result.investedValue);
    document.getElementById('output_recommendation').querySelector('.output-number').textContent = result.recommendation;

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        age: inputs.age,
        coverageAmount: inputs.coverageAmount,
        termLength: inputs.termLength,
        investmentReturn: inputs.investmentReturn,
        termPremium: result.termPremium,
        wholeLifePremium: result.wholeLifePremium,
        premiumDifference: result.premiumDifference,
        cashValue: result.cashValue,
        investedValue: result.investedValue,
        recommendation: result.recommendation
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
    var yearData = result.yearData;

    if (tab === 'comparison') {
      var labels = yearData.map(function(d) { return d.year; });
      var investedData = yearData.map(function(d) { return d.investedValue; });
      var cashData = yearData.map(function(d) { return d.cashValue; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Invested Difference',
              data: investedData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#2F6F5E',
              pointRadius: 0
            },
            {
              label: 'Whole Life Cash Value',
              data: cashData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Invested Difference vs Cash Value', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Year' }
            }
          }
        }
      };
    }

    if (tab === 'growth') {
      var labels2 = yearData.map(function(d) { return d.year; });
      var termCostData = [];
      var wholeCostData = [];
      var termMonthly = result.termPremium;

      for (var i = 0; i < yearData.length; i++) {
        var year = yearData[i].year;
        termCostData.push(termMonthly * 12 * year);
        wholeCostData.push(result.wholeLifePremium * 12 * year);
      }

      return {
        type: 'line',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Term Life Total Cost',
              data: termCostData,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#4A90D9',
              pointRadius: 0
            },
            {
              label: 'Whole Life Total Cost',
              data: wholeCostData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [3, 3],
              pointBackgroundColor: '#B23A3A',
              pointRadius: 0
            },
            {
              label: 'Invested Difference Value',
              data: yearData.map(function(d) { return d.investedValue; }),
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#2F6F5E',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Costs and Growth Over Time', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Year' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var termCost = result.termTotalCost;
      var wholeCost = result.wholeLifeTotalCost;
      var cashValue = result.cashValue;
      var investedValue = result.investedValue;

      return {
        type: 'bar',
        data: {
          labels: ['Term Life', 'Whole Life', 'Cash Value', 'Invested Value'],
          datasets: [{
            label: 'Amount',
            data: [termCost, wholeCost, cashValue, investedValue],
            backgroundColor: ['#4A90D9', '#B23A3A', '#C08A2E', '#2F6F5E'],
            borderColor: ['#3a7b8c', '#8a2a2a', '#A87520', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Costs and Values at Term End', font: { size: 14 } }
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
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal) el.value = defaultVal;
      else if (el.type !== 'select-one') el.value = '';
    });
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
    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();
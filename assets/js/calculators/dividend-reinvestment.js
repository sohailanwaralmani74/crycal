/* ═══════════════════════════════════════════════════════════
   CRYCAL — Dividend Reinvestment Calculator
   Tool ID: dividend-reinvestment
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      initialInvestment: parseFloat(document.getElementById('input_initialInvestment').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('input_monthlyContribution').value) || 0,
      dividendYield: parseFloat(document.getElementById('input_dividendYield').value) || 0,
      dividendGrowthRate: parseFloat(document.getElementById('input_dividendGrowthRate').value) || 0,
      timeYears: parseFloat(document.getElementById('input_timeYears').value) || 0,
      reinvestDividends: document.getElementById('input_reinvestDividends').value === 'true'
    };
  }

  // ── Calculate Portfolio with DRIP ──
  function calculateDRIP(inputs) {
    var initial = inputs.initialInvestment;
    var PMT = inputs.monthlyContribution;
    var yieldRate = inputs.dividendYield / 100;
    var growthRate = inputs.dividendGrowthRate / 100;
    var years = inputs.timeYears;
    var reinvest = inputs.reinvestDividends;

    var yearData = [];
    var annualContribution = PMT * 12;

    // Start with initial investment
    var portfolioValue = initial;
    var totalContributions = initial;
    var totalDividends = 0;
    var totalShares = 0;
    var sharePrice = 100; // Base price (relative, used for share count)
    var shares = initial / sharePrice;

    // Year 0
    yearData.push({
      year: 0,
      portfolioValue: portfolioValue,
      totalContributions: totalContributions,
      totalDividends: 0,
      shares: shares,
      sharePrice: sharePrice,
      dividendPerShare: 0
    });

    // Simulate each year
    for (var year = 1; year <= years; year++) {
      // Apply share price growth (for simplicity, we use a modest 3% annual price growth)
      sharePrice *= 1.03;

      // Calculate dividend per share for this year (growing each year)
      var dividendPerShare = (yieldRate * sharePrice) * Math.pow(1 + growthRate, year - 1);

      // Calculate total dividends received this year
      var yearlyDividends = shares * dividendPerShare;
      totalDividends += yearlyDividends;

      // Add monthly contributions throughout the year (simplified: lump sum at start of year)
      // For more accuracy, we could model monthly, but annual is sufficient for this tool
      var addedShares = 0;
      if (PMT > 0) {
        addedShares = (PMT * 12) / sharePrice;
        totalContributions += PMT * 12;
      }

      // If reinvesting, use dividends to buy more shares
      if (reinvest) {
        var reinvestedShares = yearlyDividends / sharePrice;
        shares += reinvestedShares + addedShares;
      } else {
        shares += addedShares;
      }

      // Update portfolio value
      portfolioValue = shares * sharePrice;
      totalContributions = initial + annualContribution * year;

      yearData.push({
        year: year,
        portfolioValue: portfolioValue,
        totalContributions: totalContributions,
        totalDividends: totalDividends,
        shares: shares,
        sharePrice: sharePrice,
        dividendPerShare: dividendPerShare
      });
    }

    // Calculate without reinvestment (for comparison)
    var noReinvestValue = 0;
    var noReinvestDividends = 0;
    if (!reinvest) {
      noReinvestValue = portfolioValue;
      noReinvestDividends = totalDividends;
    } else {
      // Re-run without reinvestment
      var noReinvestPortfolio = initial;
      var noReinvestShares = initial / 100;
      var noReinvestTotal = 0;
      var noReinvestPrice = 100;

      for (var y = 1; y <= years; y++) {
        noReinvestPrice *= 1.03;
        var dpShare = (yieldRate * noReinvestPrice) * Math.pow(1 + growthRate, y - 1);
        var yDiv = noReinvestShares * dpShare;
        noReinvestTotal += yDiv;

        if (PMT > 0) {
          var addedShares = (PMT * 12) / noReinvestPrice;
          noReinvestShares += addedShares;
        }

        noReinvestPortfolio = noReinvestShares * noReinvestPrice;
      }
      noReinvestValue = noReinvestPortfolio;
      noReinvestDividends = noReinvestTotal;
    }

    var reinvestmentBenefit = reinvest ? portfolioValue - noReinvestValue : 0;

    return {
      finalValue: portfolioValue,
      totalContributions: totalContributions,
      totalDividends: totalDividends,
      valueWithoutReinvestment: noReinvestValue,
      reinvestmentBenefit: reinvestmentBenefit,
      yearData: yearData,
      totalShares: shares,
      finalSharePrice: sharePrice
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
    var result = calculateDRIP(inputs);

    // Update outputs
    document.getElementById('output_finalValue').querySelector('.output-number').textContent = formatCurrencyLocal(result.finalValue);
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalContributions);
    document.getElementById('output_totalDividends').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalDividends);
    document.getElementById('output_valueWithoutReinvestment').querySelector('.output-number').textContent = formatCurrencyLocal(result.valueWithoutReinvestment);
    document.getElementById('output_reinvestmentBenefit').querySelector('.output-number').textContent = formatCurrencyLocal(result.reinvestmentBenefit);

    // Update charts
    updateCharts(result, inputs);

    // Log history
    if (typeof window.logHistory === 'function') {
      var inputSnapshot = {
        initialInvestment: inputs.initialInvestment,
        monthlyContribution: inputs.monthlyContribution,
        dividendYield: inputs.dividendYield,
        dividendGrowthRate: inputs.dividendGrowthRate,
        timeYears: inputs.timeYears,
        reinvestDividends: inputs.reinvestDividends ? 'Yes' : 'No'
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
      var portfolioData = yearData.map(function(d) { return d.portfolioValue; });
      var contributionsData = yearData.map(function(d) { return d.totalContributions; });

      // Calculate dividends cumulative (approximate from yearData)
      var dividendsData = [];
      var cumDividends = 0;
      yearData.forEach(function(d, i) {
        if (i === 0) {
          dividendsData.push(0);
        } else {
          cumDividends += (yearData[i].totalDividends - (yearData[i-1] ? yearData[i-1].totalDividends : 0));
          dividendsData.push(cumDividends);
        }
      });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: portfolioData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E'
            },
            {
              label: 'Total Contributions',
              data: contributionsData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E'
            },
            {
              label: 'Total Dividends',
              data: dividendsData,
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
            title: { display: true, text: 'Portfolio Growth Over Time', font: { size: 14 } }
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

    if (tab === 'comparison') {
      // Compare portfolio with and without reinvestment
      var labels = ['With Reinvestment', 'Without Reinvestment'];
      var withData = [result.finalValue];
      var withoutData = [result.valueWithoutReinvestment];

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Final Portfolio Value',
              data: withData,
              backgroundColor: '#C08A2E',
              borderColor: '#A87520',
              borderWidth: 1
            },
            {
              label: 'Value Without Reinvestment',
              data: withoutData,
              backgroundColor: '#DCE1E3',
              borderColor: '#B0B5B7',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'With vs Without Reinvestment', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Value (' + currencySymbol + ')' },
              ticks: {
                callback: function(value) { return currencySymbol + value.toFixed(0); }
              }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var final = yearData[yearData.length - 1];
      var contributions = result.totalContributions;
      var dividends = result.totalDividends;

      return {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Total Dividends'],
          datasets: [{
            data: [contributions, dividends],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Breakdown of Final Portfolio', font: { size: 14 } }
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
/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Rent vs Buy Calculator
   Tool ID: rent-vs-buy
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      downPayment: parseFloat(document.getElementById('input_downPayment').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      propertyTax: parseFloat(document.getElementById('input_propertyTax').value) || 0,
      insurance: parseFloat(document.getElementById('input_insurance').value) || 0,
      maintenance: parseFloat(document.getElementById('input_maintenance').value) || 0,
      hoaFees: parseFloat(document.getElementById('input_hoaFees').value) || 0,
      monthlyRent: parseFloat(document.getElementById('input_monthlyRent').value) || 0,
      rentersInsurance: parseFloat(document.getElementById('input_rentersInsurance').value) || 0,
      rentIncrease: parseFloat(document.getElementById('input_rentIncrease').value) || 0,
      homeAppreciation: parseFloat(document.getElementById('input_homeAppreciation').value) || 0,
      investmentReturn: parseFloat(document.getElementById('input_investmentReturn').value) || 0,
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0,
      yearsToCompare: parseFloat(document.getElementById('input_yearsToCompare').value) || 0,
      sellingCosts: parseFloat(document.getElementById('input_sellingCosts').value) || 0,
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

  // ── Calculate Mortgage Payment ──
  function calculateMortgagePayment(loanAmount, annualRate, loanTerm) {
    if (loanAmount <= 0) return 0;
    var monthlyRate = annualRate / 100 / 12;
    var totalMonths = loanTerm * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // ── Calculate Future Value of Investment ──
  function calculateFutureValue(principal, returnRate, years, n) {
    var r = returnRate / 100;
    return principal * Math.pow(1 + r / n, n * years);
  }

  // ── Main Calculation ──
  function calculateRentVsBuy(inputs) {
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var totalMonths = inputs.yearsToCompare * 12;

    // --- BUY SCENARIO ---
    var loanAmount = Math.max(0, inputs.homePrice - inputs.downPayment);
    var monthlyMortgage = calculateMortgagePayment(loanAmount, inputs.interestRate, inputs.loanTerm);

    // Monthly costs (fixed)
    var monthlyTax = inputs.homePrice * (inputs.propertyTax / 100) / 12;
    var monthlyInsurance = inputs.homePrice * (inputs.insurance / 100) / 12;
    var monthlyMaintenance = inputs.homePrice * (inputs.maintenance / 100) / 12;
    var monthlyHOA = inputs.hoaFees;

    // Total monthly buy cost (excluding principal payment which builds equity)
    var monthlyBuyCost = monthlyMortgage + monthlyTax + monthlyInsurance + monthlyMaintenance + monthlyHOA;

    // Home appreciation
    var homeValueAtSale = inputs.homePrice * Math.pow(1 + inputs.homeAppreciation / 100, inputs.yearsToCompare);

    // Selling costs
    var sellingCosts = homeValueAtSale * (inputs.sellingCosts / 100);

    // Total buy cost over the period
    var totalBuyPayments = monthlyBuyCost * totalMonths;
    var totalBuyCost = inputs.downPayment + totalBuyPayments + sellingCosts;
    var buyNetGain = homeValueAtSale - totalBuyCost;

    // Investment return on down payment (opportunity cost)
    var investmentGrowth = calculateFutureValue(inputs.downPayment, inputs.investmentReturn, inputs.yearsToCompare, n);
    var buyNetGainWithOpportunity = buyNetGain - (investmentGrowth - inputs.downPayment);

    // --- RENT SCENARIO ---
    var monthlyRent = inputs.monthlyRent;
    var monthlyRentersInsurance = inputs.rentersInsurance;
    var rentIncrease = inputs.rentIncrease / 100;

    var totalRent = 0;
    var monthlyRentData = [];
    var cumulativeRent = 0;
    var currentRent = monthlyRent;

    for (var month = 1; month <= totalMonths; month++) {
      // Apply rent increase annually
      var yearIndex = Math.floor((month - 1) / 12);
      var adjustedRent = monthlyRent * Math.pow(1 + rentIncrease, yearIndex);
      var monthlyTotal = adjustedRent + monthlyRentersInsurance;
      totalRent += monthlyTotal;
      cumulativeRent += monthlyTotal;
      monthlyRentData.push({
        month: month,
        rent: adjustedRent,
        insurance: monthlyRentersInsurance,
        total: monthlyTotal,
        cumulative: cumulativeRent
      });
    }

    // Investment return on down payment (if renting, you keep your down payment and invest it)
    var rentNetGain = investmentGrowth - totalRent;

    // --- MONTHLY COMPARISON DATA ---
    var monthlyComparison = [];
    var cumulativeBuy = 0;
    var cumulativeRent2 = 0;
    var breakEvenMonth = null;
    var buyMonthlyTotal = 0;
    var rentMonthlyTotal = 0;

    for (var m = 1; m <= totalMonths; m++) {
      var yearIdx = Math.floor((m - 1) / 12);
      var monthlyBuy = monthlyMortgage + monthlyTax + monthlyInsurance + monthlyMaintenance + monthlyHOA;
      var monthlyRentAdjusted = monthlyRent * Math.pow(1 + rentIncrease, yearIdx) + monthlyRentersInsurance;

      cumulativeBuy += monthlyBuy;
      cumulativeRent2 += monthlyRentAdjusted;

      // Check break-even
      if (breakEvenMonth === null && cumulativeBuy <= cumulativeRent2) {
        breakEvenMonth = m;
      }

      monthlyComparison.push({
        month: m,
        buyCumulative: cumulativeBuy,
        rentCumulative: cumulativeRent2,
        buyMonthly: monthlyBuy,
        rentMonthly: monthlyRentAdjusted,
        buyTotal: cumulativeBuy,
        rentTotal: cumulativeRent2
      });

      buyMonthlyTotal += monthlyBuy;
      rentMonthlyTotal += monthlyRentAdjusted;
    }

    // If no break-even found, set to infinity
    if (breakEvenMonth === null && totalMonths > 0) {
      // Check if buying would ever be cheaper with appreciation considered
      var finalBuyCost = totalBuyCost;
      var finalRentCost = totalRent;
      if (finalBuyCost < finalRentCost) {
        breakEvenMonth = totalMonths; // Approximate
      }
    }

    var avgBuyMonthly = buyMonthlyTotal / totalMonths;
    var avgRentMonthly = rentMonthlyTotal / totalMonths;

    // Recommendation
    var recommendation = '';
    var buyTotalCost = totalBuyCost;
    var rentTotalCost = totalRent;

    if (buyTotalCost < rentTotalCost) {
      recommendation = 'Buying is cost-effective.';
    } else if (rentTotalCost < buyTotalCost) {
      recommendation = 'Renting is cost-effective.';
    } else {
      recommendation = 'Costs are almost equal.';
    }

    return {
      buyTotalCost: buyTotalCost,
      rentTotalCost: rentTotalCost,
      buyNetGain: buyNetGain,
      rentNetGain: rentNetGain,
      breakEvenMonth: breakEvenMonth,
      buyMonthlyCost: avgBuyMonthly,
      rentMonthlyCost: avgRentMonthly,
      recommendation: recommendation,
      monthlyComparison: monthlyComparison,
      homeValueAtSale: homeValueAtSale,
      totalBuyPayments: totalBuyPayments,
      totalRent: totalRent,
      investmentGrowth: investmentGrowth,
      loanAmount: loanAmount,
      monthlyMortgage: monthlyMortgage,
      buyNetGainWithOpportunity: buyNetGainWithOpportunity
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

  // ── Format Break-Even ──
  function formatBreakEven(month) {
    if (month === null || month === Infinity || month === undefined) return 'Never';
    if (month <= 0) return 'Immediately';
    var years = Math.floor(month / 12);
    var months = month % 12;
    if (years === 0) return months + ' month' + (months !== 1 ? 's' : '');
    if (months === 0) return years + ' year' + (years !== 1 ? 's' : '');
    return years + ' year' + (years !== 1 ? 's' : '') + ' ' + months + ' month' + (months !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var result = calculateRentVsBuy(inputs);

    document.getElementById('output_buyTotalCost').querySelector('.output-number').textContent = formatCurrencyLocal(result.buyTotalCost);
    document.getElementById('output_rentTotalCost').querySelector('.output-number').textContent = formatCurrencyLocal(result.rentTotalCost);
    document.getElementById('output_buyNetGain').querySelector('.output-number').textContent = formatCurrencyLocal(result.buyNetGain);
    document.getElementById('output_rentNetGain').querySelector('.output-number').textContent = formatCurrencyLocal(result.rentNetGain);
    document.getElementById('output_breakEvenMonth').querySelector('.output-number').textContent = formatBreakEven(result.breakEvenMonth);
    document.getElementById('output_buyMonthlyCost').querySelector('.output-number').textContent = formatCurrencyLocal(result.buyMonthlyCost);
    document.getElementById('output_rentMonthlyCost').querySelector('.output-number').textContent = formatCurrencyLocal(result.rentMonthlyCost);
    document.getElementById('output_recommendation').querySelector('.output-number').textContent = result.recommendation;

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        homePrice: inputs.homePrice,
        downPayment: inputs.downPayment,
        loanTerm: inputs.loanTerm,
        interestRate: inputs.interestRate,
        propertyTax: inputs.propertyTax,
        insurance: inputs.insurance,
        maintenance: inputs.maintenance,
        hoaFees: inputs.hoaFees,
        monthlyRent: inputs.monthlyRent,
        rentersInsurance: inputs.rentersInsurance,
        rentIncrease: inputs.rentIncrease,
        homeAppreciation: inputs.homeAppreciation,
        investmentReturn: inputs.investmentReturn,
        inflationRate: inputs.inflationRate,
        yearsToCompare: inputs.yearsToCompare,
        sellingCosts: inputs.sellingCosts,
        compoundingFrequency: inputs.compoundingFrequency
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
    var monthlyData = result.monthlyComparison;

    if (tab === 'comparison') {
      var labels = monthlyData.map(function(d) { return d.month; });
      var buyData = monthlyData.map(function(d) { return d.buyCumulative; });
      var rentData = monthlyData.map(function(d) { return d.rentCumulative; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Buying (Cumulative)',
              data: buyData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#2F6F5E'
            },
            {
              label: 'Renting (Cumulative)',
              data: rentData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Cost: Renting vs Buying', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cost (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      // Yearly breakdown for buying
      var buyMonthly = result.monthlyMortgage || 0;
      var taxMonthly = inputs.homePrice * (inputs.propertyTax / 100) / 12;
      var insuranceMonthly = inputs.homePrice * (inputs.insurance / 100) / 12;
      var maintenanceMonthly = inputs.homePrice * (inputs.maintenance / 100) / 12;
      var hoaMonthly = inputs.hoaFees || 0;

      return {
        type: 'bar',
        data: {
          labels: ['Buying', 'Renting'],
          datasets: [
            {
              label: 'Monthly Cost',
              data: [
                buyMonthly + taxMonthly + insuranceMonthly + maintenanceMonthly + hoaMonthly,
                inputs.monthlyRent + inputs.rentersInsurance
              ],
              backgroundColor: ['#2F6F5E', '#B23A3A'],
              borderColor: ['#1f4f42', '#8a2a2a'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Cost Breakdown', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cost (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            }
          }
        }
      };
    }

    if (tab === 'cumulative') {
      var labels2 = monthlyData.map(function(d) { return d.month; });
      var buyData2 = monthlyData.map(function(d) { return d.buyCumulative; });
      var rentData2 = monthlyData.map(function(d) { return d.rentCumulative; });

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [
            {
              label: 'Buying Cost',
              data: buyData2,
              backgroundColor: '#2F6F5E',
              borderColor: '#1f4f42',
              borderWidth: 0,
              borderRadius: 2
            },
            {
              label: 'Renting Cost',
              data: rentData2,
              backgroundColor: '#B23A3A',
              borderColor: '#8a2a2a',
              borderWidth: 0,
              borderRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Cost: Renting vs Buying', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cost (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      };
    }

    if (tab === 'breakEven') {
      var labels3 = monthlyData.map(function(d) { return d.month; });
      var diffData = monthlyData.map(function(d) {
        return d.buyCumulative - d.rentCumulative;
      });

      // Find break-even point for marker
      var breakEvenMonth = result.breakEvenMonth;
      var diffAtBreakEven = 0;
      if (breakEvenMonth !== null && breakEvenMonth !== Infinity && breakEvenMonth > 0) {
        var idx = Math.floor(breakEvenMonth) - 1;
        if (idx >= 0 && idx < monthlyData.length) {
          diffAtBreakEven = monthlyData[idx].buyCumulative - monthlyData[idx].rentCumulative;
        }
      }

      var colors = diffData.map(function(d) {
        return d <= 0 ? '#2F6F5E' : '#B23A3A';
      });

      return {
        type: 'bar',
        data: {
          labels: labels3,
          datasets: [
            {
              label: 'Cost Difference (Buy - Rent)',
              data: diffData,
              backgroundColor: colors,
              borderColor: colors.map(function(c) { return c === '#2F6F5E' ? '#1f4f42' : '#8a2a2a'; }),
              borderWidth: 1,
              borderRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Cost Difference (Buying - Renting)' + (breakEvenMonth ? ' | Break-Even: ' + formatBreakEven(breakEvenMonth) : ''),
              font: { size: 14 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Difference (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
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
    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);
    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
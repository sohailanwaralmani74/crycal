/* ═══════════════════════════════════════════════════════════
   CRYCAL — Mortgage Calculator
   Tool ID: mortgage
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'amortization';

  // ── Get Inputs ──
  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      downPayment: parseFloat(document.getElementById('input_downPayment').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      propertyTax: parseFloat(document.getElementById('input_propertyTax').value) || 0,
      insurance: parseFloat(document.getElementById('input_insurance').value) || 0,
      pmiRate: parseFloat(document.getElementById('input_pmiRate').value) || 0,
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

  // ── Calculate Mortgage ──
  function calculateMortgage(inputs) {
    var homePrice = inputs.homePrice;
    var downPayment = inputs.downPayment;
    var loanAmount = Math.max(0, homePrice - downPayment);
    var loanTerm = inputs.loanTerm;
    var annualRate = inputs.interestRate;
    var propertyTaxRate = inputs.propertyTax / 100;
    var insuranceRate = inputs.insurance / 100;
    var pmiRate = inputs.pmiRate / 100;
    var n = getCompoundsPerYear(inputs.compoundingFrequency);
    var totalMonths = loanTerm * 12;

    // Monthly payment (principal + interest) using standard mortgage formula
    var monthlyRate = annualRate / 100 / 12;
    var monthlyPaymentPI = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyPaymentPI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (loanAmount > 0 && monthlyRate === 0) {
      monthlyPaymentPI = loanAmount / totalMonths;
    }

    // Monthly property tax
    var monthlyTax = homePrice * propertyTaxRate / 12;

    // Monthly insurance
    var monthlyInsurance = homePrice * insuranceRate / 12;

    // Monthly PMI (only if down payment < 20%)
    var downPaymentPct = homePrice > 0 ? downPayment / homePrice : 0;
    var monthlyPMI = 0;
    if (downPaymentPct < 0.2 && loanAmount > 0) {
      monthlyPMI = loanAmount * pmiRate / 12;
    }

    // Total monthly payment
    var monthlyPayment = monthlyPaymentPI + monthlyTax + monthlyInsurance + monthlyPMI;

    // Total payment over life of loan
    var totalPayment = monthlyPayment * totalMonths;
    var totalInterest = totalPayment - loanAmount;

    // Amortization schedule
    var amortization = [];
    var remainingBalance = loanAmount;
    var cumulativeInterest = 0;
    var cumulativePrincipal = 0;

    for (var month = 1; month <= totalMonths; month++) {
      var interestPaid = remainingBalance * monthlyRate;
      var principalPaid = monthlyPaymentPI - interestPaid;
      if (principalPaid > remainingBalance) {
        principalPaid = remainingBalance;
      }
      remainingBalance = Math.max(0, remainingBalance - principalPaid);
      cumulativeInterest += interestPaid;
      cumulativePrincipal += principalPaid;

      amortization.push({
        month: month,
        payment: monthlyPaymentPI,
        principal: principalPaid,
        interest: interestPaid,
        remainingBalance: remainingBalance,
        cumulativeInterest: cumulativeInterest,
        cumulativePrincipal: cumulativePrincipal
      });
    }

    // Yearly data for chart (summarized)
    var yearlyData = [];
    for (var year = 1; year <= loanTerm; year++) {
      var startMonth = (year - 1) * 12;
      var endMonth = Math.min(year * 12, totalMonths);
      var yearPrincipal = 0;
      var yearInterest = 0;
      for (var m = startMonth; m < endMonth; m++) {
        if (amortization[m]) {
          yearPrincipal += amortization[m].principal;
          yearInterest += amortization[m].interest;
        }
      }
      var balance = amortization[endMonth - 1] ? amortization[endMonth - 1].remainingBalance : 0;
      yearlyData.push({
        year: year,
        principal: yearPrincipal,
        interest: yearInterest,
        remainingBalance: balance
      });
    }

    return {
      loanAmount: loanAmount,
      monthlyPaymentPI: monthlyPaymentPI,
      monthlyTax: monthlyTax,
      monthlyInsurance: monthlyInsurance,
      monthlyPMI: monthlyPMI,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      amortization: amortization,
      yearlyData: yearlyData,
      totalMonths: totalMonths,
      downPaymentPct: downPaymentPct * 100
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
    var result = calculateMortgage(inputs);

    document.getElementById('output_monthlyPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyPayment);
    document.getElementById('output_totalPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalPayment);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrencyLocal(result.totalInterest);
    document.getElementById('output_loanAmount').querySelector('.output-number').textContent = formatCurrencyLocal(result.loanAmount);
    document.getElementById('output_pmiPayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyPMI);
    document.getElementById('output_taxInsurancePayment').querySelector('.output-number').textContent = formatCurrencyLocal(result.monthlyTax + result.monthlyInsurance);

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        homePrice: inputs.homePrice,
        downPayment: inputs.downPayment,
        loanTerm: inputs.loanTerm,
        interestRate: inputs.interestRate,
        propertyTax: inputs.propertyTax,
        insurance: inputs.insurance,
        pmiRate: inputs.pmiRate,
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

    if (tab === 'amortization') {
      var yearlyData = result.yearlyData;
      var labels = yearlyData.map(function(d) { return d.year; });
      var balanceData = yearlyData.map(function(d) { return d.remainingBalance; });
      var principalData = yearlyData.map(function(d) { return d.principal; });
      var interestData = yearlyData.map(function(d) { return d.interest; });

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Principal Paid',
              data: principalData,
              backgroundColor: '#2F6F5E',
              borderColor: '#1f4f42',
              borderWidth: 0
            },
            {
              label: 'Interest Paid',
              data: interestData,
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
            title: { display: true, text: 'Amortization Schedule (Yearly)', font: { size: 14 } }
          },
          scales: {
            x: { stacked: true, title: { display: true, text: 'Year' } },
            y: {
              stacked: true,
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

    if (tab === 'breakdown') {
      var monthlyPI = result.monthlyPaymentPI;
      var monthlyTax = result.monthlyTax;
      var monthlyInsurance = result.monthlyInsurance;
      var monthlyPMI = result.monthlyPMI;

      return {
        type: 'doughnut',
        data: {
          labels: ['Principal & Interest', 'Property Tax', 'Insurance', 'PMI'],
          datasets: [{
            data: [monthlyPI, monthlyTax, monthlyInsurance, monthlyPMI],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#4A90D9', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Monthly Payment Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.label + ': ' + currencySymbol + ctx.parsed.toFixed(2);
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'monthly') {
      var amort = result.amortization;
      var monthlyLabels = amort.map(function(d) { return d.month; });
      var principalData2 = amort.map(function(d) { return d.principal; });
      var interestData2 = amort.map(function(d) { return d.interest; });

      // Only show a subset of months for performance
      var step = Math.max(1, Math.floor(monthlyLabels.length / 60));
      var filteredLabels = monthlyLabels.map(function(l, i) { return i % step === 0 ? l : ''; });

      return {
        type: 'line',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: 'Principal',
              data: principalData2,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 0
            },
            {
              label: 'Interest',
              data: interestData2,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Principal vs Interest', font: { size: 14 } }
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
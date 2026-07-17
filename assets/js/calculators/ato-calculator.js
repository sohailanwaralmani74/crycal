(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ──────────────────────────────────────────────────────────────
  // ⚙️ CONFIGURATION — UPDATE THESE VALUES FOR FUTURE YEARS
  // ──────────────────────────────────────────────────────────────
  var CONFIG = {
    // ── GST ──
    gstRate: 0.10,                    // 10% (unchanged)

    // ── Superannuation Guarantee ──
    superDefault: 0.12,               // 12% (2025/26)

    // ── Individual Tax Brackets (2025/26, excludes Medicare) ──
    individualRates: [
      { min: 0, max: 18200, rate: 0.00 },
      { min: 18201, max: 45000, rate: 0.16 },
      { min: 45001, max: 135000, rate: 0.30 },
      { min: 135001, max: 190000, rate: 0.37 },
      { min: 190001, max: Infinity, rate: 0.45 }
    ],

    // ── Company Tax Rates ──
    companyBaseRate: 0.25,            // 25% (base rate entities)
    companyStandardRate: 0.30,        // 30% (other companies)

    // ── Medicare Levy ──
    medicareLevy: 0.02,               // 2%

    // ── Financial Year Label ──
    financialYear: '2025/26'
  };
  // ──────────────────────────────────────────────────────────────

  // ── Calculate Individual Income Tax (progressive) ──
  function calculateIndividualTax(income) {
    var tax = 0;
    var brackets = CONFIG.individualRates;
    for (var i = 0; i < brackets.length; i++) {
      var bracket = brackets[i];
      if (income > bracket.max) {
        var taxableInBracket = bracket.max - bracket.min;
        tax += taxableInBracket * bracket.rate;
      } else if (income > bracket.min) {
        var taxableInBracket = income - bracket.min;
        tax += taxableInBracket * bracket.rate;
        break;
      }
    }
    return tax;
  }

  // ── Get Tax Rate for Business Type ──
  function getBusinessTaxRate(businessType, income) {
    if (businessType === 'company') {
      // Assume base rate entity for simplicity
      // Could add turnover input later for more accuracy
      return CONFIG.companyBaseRate;
    }
    // For sole traders, partnerships, trusts — use individual rates
    var brackets = CONFIG.individualRates;
    for (var i = 0; i < brackets.length; i++) {
      var bracket = brackets[i];
      if (income > bracket.min && income <= bracket.max) {
        return bracket.rate;
      }
    }
    return 0.45; // top rate
  }

  // ── Get Inputs ──
  function getInputs() {
    var businessType = document.getElementById('input_businessType').value;
    var totalIncome = parseFloat(document.getElementById('input_totalIncome').value) || 0;
    var gstCollected = parseFloat(document.getElementById('input_gstCollected').value) || 0;
    var gstPaid = parseFloat(document.getElementById('input_gstPaid').value) || 0;
    var paygWithholding = parseFloat(document.getElementById('input_paygWithholding').value) || 0;
    var superGuarantee = parseFloat(document.getElementById('input_superGuarantee').value) || 0;
    var deductions = parseFloat(document.getElementById('input_deductions').value) || 0;
    var paygInstalments = parseFloat(document.getElementById('input_paygInstalments').value) || 0;
    var gstFreq = document.getElementById('input_gstFreq').value;
    var superFreq = document.getElementById('input_superFreq').value;

    return {
      businessType: businessType,
      totalIncome: totalIncome,
      gstCollected: gstCollected,
      gstPaid: gstPaid,
      paygWithholding: paygWithholding,
      superGuarantee: superGuarantee / 100,
      deductions: deductions,
      paygInstalments: paygInstalments,
      gstFreq: gstFreq,
      superFreq: superFreq
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'AUD';
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Core Calculation ──
  function calculateATO(inputs) {
    var income = inputs.totalIncome;
    var gstCollected = inputs.gstCollected;
    var gstPaid = inputs.gstPaid;
    var payg = inputs.paygWithholding;
    var superRate = inputs.superGuarantee;
    var deductions = inputs.deductions;
    var instalments = inputs.paygInstalments;
    var gstFreq = inputs.gstFreq;
    var superFreq = inputs.superFreq;

    if (income <= 0) {
      return { error: 'Enter valid business income' };
    }

    // ── GST ──
    var netGst = gstCollected - gstPaid;

    // ── Superannuation Guarantee ──
    var superRateEffective = superRate > 0 ? superRate : CONFIG.superDefault;
    var superLiability = income * superRateEffective;

    // ── Income Tax (progressive) ──
    var taxableIncome = Math.max(0, income - deductions);
    var incomeTax = 0;

    if (inputs.businessType === 'company') {
      // Company flat rate — assume base rate entity
      incomeTax = taxableIncome * CONFIG.companyBaseRate;
    } else {
      // Individual / partnership / trust — progressive rates + Medicare
      incomeTax = calculateIndividualTax(taxableIncome);
      incomeTax += taxableIncome * CONFIG.medicareLevy;
    }

    // ── Total BAS Liability ──
    var totalBas = netGst + payg + superLiability + incomeTax;

    // ── Quarterly Payment ──
    var quarterlyPayment = totalBas / 4;

    // ── Annual Super ──
    var annualSuper = superLiability;

    // ── Effective Rate ──
    var effectiveRate = income > 0 ? totalBas / income : 0;

    // ── Data for Charts ──
    var chartData = {
      'GST': netGst,
      'PAYG Withholding': payg,
      'Superannuation': superLiability,
      'Income Tax': incomeTax
    };

    var comparisonData = {
      'Total Income': income,
      'Total BAS Liability': totalBas,
      'Net Income': income - totalBas
    };

    return {
      netGst: netGst,
      paygLiability: payg,
      superLiability: superLiability,
      incomeTax: incomeTax,
      totalBas: totalBas,
      quarterlyPayment: quarterlyPayment,
      annualSuper: annualSuper,
      effectiveRate: effectiveRate,
      chartData: chartData,
      comparisonData: comparisonData,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.totalIncome <= 0) {
      setOutputText('output_netGst', '—');
      setOutputText('output_paygLiability', '—');
      setOutputText('output_superLiability', '—');
      setOutputText('output_incomeTax', '—');
      setOutputText('output_totalBasLiability', '—');
      setOutputText('output_quarterlyPayment', '—');
      setOutputText('output_annualSuper', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateATO(inputs);

    if (result.error) {
      setOutputText('output_netGst', '—');
      setOutputText('output_paygLiability', '—');
      setOutputText('output_superLiability', '—');
      setOutputText('output_incomeTax', '—');
      setOutputText('output_totalBasLiability', '—');
      setOutputText('output_quarterlyPayment', '—');
      setOutputText('output_annualSuper', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_netGst', formatCurrency(result.netGst));
    setOutputText('output_paygLiability', formatCurrency(result.paygLiability));
    setOutputText('output_superLiability', formatCurrency(result.superLiability));
    setOutputText('output_incomeTax', formatCurrency(result.incomeTax));
    setOutputText('output_totalBasLiability', formatCurrency(result.totalBas));
    setOutputText('output_quarterlyPayment', formatCurrency(result.quarterlyPayment));
    setOutputText('output_annualSuper', formatCurrency(result.annualSuper));
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));

    var chartPayload = {
      chartData: result.chartData,
      comparisonData: result.comparisonData,
      totalBas: result.totalBas,
      totalIncome: inputs.totalIncome
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalIncome: inputs.totalIncome,
        businessType: inputs.businessType,
        totalBas: result.totalBas,
        effectiveRate: result.effectiveRate
      });
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.chartData);
      var values = Object.values(data.chartData);

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43', '#fbbf24', '#4ade80'],
            borderColor: ['#3a7b8c', '#B84A32', '#d4a030', '#3a9b6c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'BAS Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          }
        }
      };
    }

    if (tab === 'comparison') {
      var labels = Object.keys(data.comparisonData);
      var values = Object.values(data.comparisonData);

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount',
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43', '#4ade80'],
            borderColor: ['#3a7b8c', '#B84A32', '#3a9b6c'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Income vs Liability',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'AUD';
                    return new Intl.NumberFormat('en-AU', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
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
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_businessType').value = 'sole-trader';
    document.getElementById('input_totalIncome').value = 100000;
    document.getElementById('input_gstCollected').value = 10000;
    document.getElementById('input_gstPaid').value = 4000;
    document.getElementById('input_paygWithholding').value = 5000;
    document.getElementById('input_superGuarantee').value = 12.0;
    document.getElementById('input_deductions').value = 20000;
    document.getElementById('input_paygInstalments').value = 0;
    document.getElementById('input_gstFreq').value = 'quarterly';
    document.getElementById('input_superFreq').value = 'quarterly';
    updateTool();
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
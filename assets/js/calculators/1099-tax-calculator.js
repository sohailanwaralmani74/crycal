(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var filingStatus = document.getElementById('input_filingStatus').value;
    var federalIncome = parseFloat(document.getElementById('input_federalIncome').value) || 0;
    var stateIncome = parseFloat(document.getElementById('input_stateIncome').value) || 0;
    var businessExpenses = parseFloat(document.getElementById('input_businessExpenses').value) || 0;
    var otherDeductions = parseFloat(document.getElementById('input_otherDeductions').value) || 0;
    var dependents = parseFloat(document.getElementById('input_dependents').value) || 0;
    var childTaxCredit = parseFloat(document.getElementById('input_childTaxCredit').value) || 0;
    var otherCredits = parseFloat(document.getElementById('input_otherCredits').value) || 0;
    var estimatedPayments = parseFloat(document.getElementById('input_estimatedPayments').value) || 0;
    var stateTaxRate = parseFloat(document.getElementById('input_stateTaxRate').value) || 0;
    var federalTaxRate = parseFloat(document.getElementById('input_federalTaxRate').value) || 0;
    var savePercentage = parseFloat(document.getElementById('input_savePercentage').value) || 0;
    var quarterlyPayment = parseFloat(document.getElementById('input_quarterlyPayment').value) || 0;

    return {
      filingStatus: filingStatus,
      federalIncome: federalIncome,
      stateIncome: stateIncome || federalIncome,
      businessExpenses: businessExpenses,
      otherDeductions: otherDeductions,
      dependents: dependents,
      childTaxCredit: childTaxCredit,
      otherCredits: otherCredits,
      estimatedPayments: estimatedPayments,
      stateTaxRate: stateTaxRate / 100,
      federalTaxRate: federalTaxRate / 100,
      savePercentage: savePercentage / 100,
      quarterlyPayment: quarterlyPayment
    }
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
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
  function calculate1099Tax(inputs) {
    var income = inputs.federalIncome;
    var stateIncome = inputs.stateIncome;
    var expenses = inputs.businessExpenses;
    var deductions = inputs.otherDeductions;
    var dependents = inputs.dependents;
    var childCredit = inputs.childTaxCredit;
    var otherCredits = inputs.otherCredits;
    var estPayments = inputs.estimatedPayments;
    var stateRate = inputs.stateTaxRate;
    var fedRate = inputs.federalTaxRate;
    var savePercent = inputs.savePercentage;
    var quarterlyPaid = inputs.quarterlyPayment;

    if (income <= 0) {
      return { error: 'Enter valid 1099 income' };
    }

    // Net profit (income - expenses)
    var netProfit = Math.max(0, income - expenses);

    // ── Self-Employment Tax (15.3%) ──
    // 92.35% of net profit is subject to SE tax
    var seTaxableIncome = netProfit * 0.9235;
    var seTax = seTaxableIncome * 0.153;
    var seTaxDeduction = seTax * 0.5; // Deductible portion of SE tax

    // ── Taxable Income ──
    var taxableIncome = Math.max(0, netProfit - deductions - seTaxDeduction);

    // ── Federal Income Tax ──
    var federalTax = taxableIncome * fedRate;

    // ── State Income Tax ──
    var stateTaxable = Math.max(0, stateIncome - expenses - seTaxDeduction);
    var stateTax = stateTaxable * stateRate;

    // ── Child Tax Credit ──
    var childTaxCreditTotal = dependents * childCredit;

    // ── Total Tax ──
    var totalTaxBeforeCredits = seTax + federalTax + stateTax;
    var totalTax = Math.max(0, totalTaxBeforeCredits - childTaxCreditTotal - otherCredits);

    // ── Quarterly Payment ──
    var quarterlyTax = totalTax / 4;

    // ── Total Due ──
    var totalDue = Math.max(0, totalTax - estPayments - quarterlyPaid);

    // ── Savings Recommendation ──
    var saveAmount = income * savePercent;
    var savePerPaycheck = saveAmount / 24; // Bi-weekly

    // ── Effective Tax Rate ──
    var effectiveRate = income > 0 ? totalTax / income : 0;

    // ── Data for Charts ──
    var chartData = {
      'Self-Employment Tax': seTax,
      'Federal Income Tax': federalTax,
      'State Income Tax': stateTax
    }
    var comparisonData = {
      'Net Income': netProfit,
      'Total Tax': totalTax,
      'Take-Home': netProfit - totalTax
    }
    return {
      seTax: seTax,
      seTaxDeduction: seTaxDeduction,
      federalTax: federalTax,
      stateTax: stateTax,
      totalTax: totalTax,
      quarterlyTax: quarterlyTax,
      totalDue: totalDue,
      saveAmount: saveAmount,
      savePerPaycheck: savePerPaycheck,
      effectiveRate: effectiveRate,
      netProfit: netProfit,
      taxableIncome: taxableIncome,
      chartData: chartData,
      comparisonData: comparisonData,
      error: null
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.federalIncome <= 0) {
      setOutputText('output_estimatedTax', '—');
      setOutputText('output_selfEmploymentTax', '—');
      setOutputText('output_federalTax', '—');
      setOutputText('output_stateTax', '—');
      setOutputText('output_totalTax', '—');
      setOutputText('output_quarterlyTax', '—');
      setOutputText('output_totalDue', '—');
      setOutputText('output_savingsRecommendation', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculate1099Tax(inputs);

    if (result.error) {
      setOutputText('output_estimatedTax', '—');
      setOutputText('output_selfEmploymentTax', '—');
      setOutputText('output_federalTax', '—');
      setOutputText('output_stateTax', '—');
      setOutputText('output_totalTax', '—');
      setOutputText('output_quarterlyTax', '—');
      setOutputText('output_totalDue', '—');
      setOutputText('output_savingsRecommendation', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_estimatedTax', formatCurrency(result.totalTax));
    setOutputText('output_selfEmploymentTax', formatCurrency(result.seTax));
    setOutputText('output_federalTax', formatCurrency(result.federalTax));
    setOutputText('output_stateTax', formatCurrency(result.stateTax));
    setOutputText('output_totalTax', formatCurrency(result.totalTax));
    setOutputText('output_quarterlyTax', formatCurrency(result.quarterlyTax));
    setOutputText('output_totalDue', formatCurrency(result.totalDue));
    setOutputText('output_savingsRecommendation', formatCurrency(result.savePerPaycheck) + ' per paycheck');
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));

    var chartPayload = {
      chartData: result.chartData,
      comparisonData: result.comparisonData,
      totalTax: result.totalTax,
      netProfit: result.netProfit
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        federalIncome: inputs.federalIncome,
        filingStatus: inputs.filingStatus,
        totalTax: result.totalTax,
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
            backgroundColor: ['#D95B43', '#4A90D9', '#fbbf24'],
            borderColor: ['#B84A32', '#3a7b8c', '#d4a030'],
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
              text: 'Tax Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          }
        }
      }
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
              text: 'Income vs Tax',
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
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
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
      }
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
    document.getElementById('input_filingStatus').value = 'single';
    var _el_input_federalIncome = document.getElementById('input_federalIncome');
    _el_input_federalIncome.value = (_el_input_federalIncome.dataset && _el_input_federalIncome.dataset.default !== undefined) ? _el_input_federalIncome.dataset.default : (_el_input_federalIncome.getAttribute('value') || '');
    var _el_input_stateIncome = document.getElementById('input_stateIncome');
    _el_input_stateIncome.value = (_el_input_stateIncome.dataset && _el_input_stateIncome.dataset.default !== undefined) ? _el_input_stateIncome.dataset.default : (_el_input_stateIncome.getAttribute('value') || '');
    var _el_input_businessExpenses = document.getElementById('input_businessExpenses');
    _el_input_businessExpenses.value = (_el_input_businessExpenses.dataset && _el_input_businessExpenses.dataset.default !== undefined) ? _el_input_businessExpenses.dataset.default : (_el_input_businessExpenses.getAttribute('value') || '');
    var _el_input_otherDeductions = document.getElementById('input_otherDeductions');
    _el_input_otherDeductions.value = (_el_input_otherDeductions.dataset && _el_input_otherDeductions.dataset.default !== undefined) ? _el_input_otherDeductions.dataset.default : (_el_input_otherDeductions.getAttribute('value') || '');
    var _el_input_dependents = document.getElementById('input_dependents');
    _el_input_dependents.value = (_el_input_dependents.dataset && _el_input_dependents.dataset.default !== undefined) ? _el_input_dependents.dataset.default : (_el_input_dependents.getAttribute('value') || '');
    var _el_input_childTaxCredit = document.getElementById('input_childTaxCredit');
    _el_input_childTaxCredit.value = (_el_input_childTaxCredit.dataset && _el_input_childTaxCredit.dataset.default !== undefined) ? _el_input_childTaxCredit.dataset.default : (_el_input_childTaxCredit.getAttribute('value') || '');
    var _el_input_otherCredits = document.getElementById('input_otherCredits');
    _el_input_otherCredits.value = (_el_input_otherCredits.dataset && _el_input_otherCredits.dataset.default !== undefined) ? _el_input_otherCredits.dataset.default : (_el_input_otherCredits.getAttribute('value') || '');
    var _el_input_estimatedPayments = document.getElementById('input_estimatedPayments');
    _el_input_estimatedPayments.value = (_el_input_estimatedPayments.dataset && _el_input_estimatedPayments.dataset.default !== undefined) ? _el_input_estimatedPayments.dataset.default : (_el_input_estimatedPayments.getAttribute('value') || '');
    var _el_input_stateTaxRate = document.getElementById('input_stateTaxRate');
    _el_input_stateTaxRate.value = (_el_input_stateTaxRate.dataset && _el_input_stateTaxRate.dataset.default !== undefined) ? _el_input_stateTaxRate.dataset.default : (_el_input_stateTaxRate.getAttribute('value') || '');
    var _el_input_federalTaxRate = document.getElementById('input_federalTaxRate');
    _el_input_federalTaxRate.value = (_el_input_federalTaxRate.dataset && _el_input_federalTaxRate.dataset.default !== undefined) ? _el_input_federalTaxRate.dataset.default : (_el_input_federalTaxRate.getAttribute('value') || '');
    var _el_input_savePercentage = document.getElementById('input_savePercentage');
    _el_input_savePercentage.value = (_el_input_savePercentage.dataset && _el_input_savePercentage.dataset.default !== undefined) ? _el_input_savePercentage.dataset.default : (_el_input_savePercentage.getAttribute('value') || '');
    var _el_input_quarterlyPayment = document.getElementById('input_quarterlyPayment');
    _el_input_quarterlyPayment.value = (_el_input_quarterlyPayment.dataset && _el_input_quarterlyPayment.dataset.default !== undefined) ? _el_input_quarterlyPayment.dataset.default : (_el_input_quarterlyPayment.getAttribute('value') || '');
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

    
    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
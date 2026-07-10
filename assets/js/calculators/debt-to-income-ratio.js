(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var monthlyDebt = parseFloat(document.getElementById('input_monthlyDebt').value) || 0;
    var grossIncome = parseFloat(document.getElementById('input_grossIncome').value) || 0;

    return {
      monthlyDebt: monthlyDebt,
      grossIncome: grossIncome
    };
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Core Calculation ──
  function calculateDTI(inputs) {
    var debt = inputs.monthlyDebt;
    var income = inputs.grossIncome;

    if (income <= 0 || debt <= 0) {
      return {
        dti: 0,
        assessment: 'Enter valid values',
        maxLoanPayment: 0,
        maxTotalDebt: 0,
        category: '—',
        dataPoints: []
      };
    }

    var dti = (debt / income) * 100;
    var maxLoanPayment = income * 0.28;      // 28% rule
    var maxTotalDebt = income * 0.36;        // 36% rule

    // Assessment
    var assessment = '';
    var category = '';

    if (dti <= 20) {
      assessment = 'Excellent — Lenders view you very favorably.';
      category = 'Excellent';
    } else if (dti <= 36) {
      assessment = 'Good — You manage debt well. Most lenders will approve you.';
      category = 'Good';
    } else if (dti <= 42) {
      assessment = 'Acceptable — You may qualify but could face higher interest rates.';
      category = 'Acceptable';
    } else if (dti <= 49) {
      assessment = 'High — Loan approval may be difficult. Consider paying down debt.';
      category = 'High';
    } else {
      assessment = 'Very High — You have significant financial strain. Seek debt counseling.';
      category = 'Very High';
    }

    // Data points for chart
    var dataPoints = {
      'Monthly Debt': debt,
      'Remaining Income': income - debt
    };

    return {
      dti: dti,
      assessment: assessment,
      maxLoanPayment: maxLoanPayment,
      maxTotalDebt: maxTotalDebt,
      category: category,
      dataPoints: dataPoints
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.grossIncome <= 0) {
      setOutputText('output_dtiRatio', '—');
      setOutputText('output_dtiAssessment', 'Enter your gross monthly income');
      setOutputText('output_maxLoanPayment', '—');
      setOutputText('output_maxTotalDebt', '—');
      setOutputText('output_dtiCategory', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateDTI(inputs);

    setOutputText('output_dtiRatio', result.dti.toFixed(1) + '%');
    setOutputText('output_dtiAssessment', result.assessment);
    setOutputText('output_maxLoanPayment', formatCurrency(result.maxLoanPayment));
    setOutputText('output_maxTotalDebt', formatCurrency(result.maxTotalDebt));
    setOutputText('output_dtiCategory', result.category);

    var chartPayload = {
      dataPoints: result.dataPoints,
      dti: result.dti
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthlyDebt: inputs.monthlyDebt,
        grossIncome: inputs.grossIncome,
        dtiRatio: result.dti,
        dtiAssessment: result.category
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
    if (!data || !data.dataPoints) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.dataPoints);
      var values = Object.values(data.dataPoints);

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#D95B43', '#2F6F5E'],
            borderColor: ['#B84A32', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Monthly Income Allocation',
              font: { size: 14 }
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
    document.getElementById('input_monthlyDebt').value = 2000;
    document.getElementById('input_grossIncome').value = 6000;
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
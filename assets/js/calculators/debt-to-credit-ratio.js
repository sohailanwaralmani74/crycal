(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var totalDebt = parseFloat(document.getElementById('input_totalDebt').value) || 0;
    var totalCreditLimit = parseFloat(document.getElementById('input_totalCreditLimit').value) || 0;

    return {
      totalDebt: totalDebt,
      totalCreditLimit: totalCreditLimit
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
  function calculateUtilization(inputs) {
    var debt = inputs.totalDebt;
    var limit = inputs.totalCreditLimit;

    if (limit <= 0 || debt <= 0) {
      return {
        utilization: 0,
        assessment: 'Enter valid values',
        creditScoreImpact: '—',
        category: '—',
        remainingCredit: 0,
        dataPoints: {}
      };
    }

    var utilization = (debt / limit) * 100;
    var remaining = limit - debt;

    // Assessment
    var assessment = '';
    var category = '';
    var impact = '';

    if (utilization <= 10) {
      category = 'Excellent';
      assessment = 'Excellent — Ideal for your credit score.';
      impact = 'Very Positive — Top-tier credit score impact.';
    } else if (utilization <= 30) {
      category = 'Good';
      assessment = 'Good — Lenders view this favorably.';
      impact = 'Positive — Healthy credit score impact.';
    } else if (utilization <= 50) {
      category = 'Fair';
      assessment = 'Fair — May negatively impact your score.';
      impact = 'Negative — Consider reducing balances.';
    } else if (utilization <= 75) {
      category = 'Poor';
      assessment = 'Poor — Significant negative impact on credit.';
      impact = 'Very Negative — Pay down debt quickly.';
    } else {
      category = 'Very Poor';
      assessment = 'Very Poor — Severe negative impact. Seek debt counseling.';
      impact = 'Severe Negative — This is hurting your credit score.';
    }

    var dataPoints = {
      'Used Credit': debt,
      'Available Credit': remaining
    };

    return {
      utilization: utilization,
      assessment: assessment,
      creditScoreImpact: impact,
      category: category,
      remainingCredit: remaining,
      dataPoints: dataPoints
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.totalCreditLimit <= 0) {
      setOutputText('output_creditUtilization', '—');
      setOutputText('output_utilizationAssessment', 'Enter your total credit limit');
      setOutputText('output_creditScoreImpact', '—');
      setOutputText('output_utilizationCategory', '—');
      setOutputText('output_remainingCredit', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateUtilization(inputs);

    setOutputText('output_creditUtilization', result.utilization.toFixed(1) + '%');
    setOutputText('output_utilizationAssessment', result.assessment);
    setOutputText('output_creditScoreImpact', result.creditScoreImpact);
    setOutputText('output_utilizationCategory', result.category);
    setOutputText('output_remainingCredit', formatCurrency(result.remainingCredit));

    var chartPayload = {
      dataPoints: result.dataPoints,
      utilization: result.utilization
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalDebt: inputs.totalDebt,
        totalCreditLimit: inputs.totalCreditLimit,
        creditUtilization: result.utilization,
        utilizationCategory: result.category
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
              text: 'Credit Utilization Breakdown',
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
    document.getElementById('input_totalDebt').value = 5000;
    document.getElementById('input_totalCreditLimit').value = 20000;
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
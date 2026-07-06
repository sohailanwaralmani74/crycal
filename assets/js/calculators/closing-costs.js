/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Closing Costs Calculator
   Tool ID: closing-costs
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      loanAmount: parseFloat(document.getElementById('input_loanAmount').value) || 0,
      originationFee: parseFloat(document.getElementById('input_originationFee').value) || 0,
      appraisalFee: parseFloat(document.getElementById('input_appraisalFee').value) || 0,
      titleInsurance: parseFloat(document.getElementById('input_titleInsurance').value) || 0,
      escrowFees: parseFloat(document.getElementById('input_escrowFees').value) || 0,
      recordingFees: parseFloat(document.getElementById('input_recordingFees').value) || 0,
      inspectionFees: parseFloat(document.getElementById('input_inspectionFees').value) || 0,
      surveyFee: parseFloat(document.getElementById('input_surveyFee').value) || 0,
      prepaidInterest: parseFloat(document.getElementById('input_prepaidInterest').value) || 0,
      homeownersInsurance: parseFloat(document.getElementById('input_homeownersInsurance').value) || 0,
      propertyTaxEscrow: parseFloat(document.getElementById('input_propertyTaxEscrow').value) || 0,
      otherClosingCosts: parseFloat(document.getElementById('input_otherClosingCosts').value) || 0
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
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

    var totalClosingCosts = inputs.originationFee + inputs.appraisalFee + inputs.titleInsurance +
                            inputs.escrowFees + inputs.recordingFees + inputs.inspectionFees +
                            inputs.surveyFee + inputs.prepaidInterest + inputs.homeownersInsurance +
                            inputs.propertyTaxEscrow + inputs.otherClosingCosts;

    var percentOfLoan = inputs.loanAmount > 0 ? (totalClosingCosts / inputs.loanAmount) * 100 : 0;

    document.getElementById('output_totalClosingCosts').querySelector('.output-number').textContent = formatCurrency(totalClosingCosts);
    document.getElementById('output_percentOfLoan').querySelector('.output-number').textContent = percentOfLoan.toFixed(2) + '%';
    document.getElementById('output_originationFeeDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.originationFee);
    document.getElementById('output_appraisalFeeDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.appraisalFee);
    document.getElementById('output_titleInsuranceDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.titleInsurance);
    document.getElementById('output_escrowFeesDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.escrowFees);
    document.getElementById('output_recordingFeesDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.recordingFees);
    document.getElementById('output_inspectionFeesDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.inspectionFees);
    document.getElementById('output_surveyFeeDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.surveyFee);
    document.getElementById('output_prepaidInterestDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.prepaidInterest);
    document.getElementById('output_homeownersInsuranceDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.homeownersInsurance);
    document.getElementById('output_propertyTaxEscrowDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.propertyTaxEscrow);
    document.getElementById('output_otherClosingCostsDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.otherClosingCosts);

    updateCharts({
      totalClosingCosts: totalClosingCosts,
      loanAmount: inputs.loanAmount,
      originationFee: inputs.originationFee,
      appraisalFee: inputs.appraisalFee,
      titleInsurance: inputs.titleInsurance,
      escrowFees: inputs.escrowFees,
      recordingFees: inputs.recordingFees,
      inspectionFees: inputs.inspectionFees,
      surveyFee: inputs.surveyFee,
      prepaidInterest: inputs.prepaidInterest,
      homeownersInsurance: inputs.homeownersInsurance,
      propertyTaxEscrow: inputs.propertyTaxEscrow,
      otherClosingCosts: inputs.otherClosingCosts,
      percentOfLoan: percentOfLoan
    });

    if (typeof window.logHistory === 'function') {
      var snapshot = {
        loanAmount: inputs.loanAmount,
        totalClosingCosts: totalClosingCosts,
        percentOfLoan: percentOfLoan.toFixed(2)
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    var costCategories = [
      { label: 'Origination Fee', value: data.originationFee, color: '#C08A2E' },
      { label: 'Appraisal Fee', value: data.appraisalFee, color: '#2F6F5E' },
      { label: 'Title Insurance', value: data.titleInsurance, color: '#4A90D9' },
      { label: 'Escrow / Settlement', value: data.escrowFees, color: '#8E44AD' },
      { label: 'Recording Fees', value: data.recordingFees, color: '#2C3E50' },
      { label: 'Inspection Fees', value: data.inspectionFees, color: '#F39C12' },
      { label: 'Survey Fee', value: data.surveyFee, color: '#1ABC9C' },
      { label: 'Prepaid Interest', value: data.prepaidInterest, color: '#B23A3A' },
      { label: 'Homeowner\'s Insurance', value: data.homeownersInsurance, color: '#3498DB' },
      { label: 'Property Tax Escrow', value: data.propertyTaxEscrow, color: '#9B59B6' },
      { label: 'Other Costs', value: data.otherClosingCosts, color: '#DCE1E3' }
    ];

    var filtered = costCategories.filter(function(c) { return c.value > 0; });

    if (tab === 'breakdown') {
      if (filtered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No costs entered'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No closing costs entered', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'doughnut',
        data: {
          labels: filtered.map(function(f) { return f.label; }),
          datasets: [{
            data: filtered.map(function(f) { return f.value; }),
            backgroundColor: filtered.map(function(f) { return f.color; }),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Closing Costs Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toFixed(2) + ' (' + pct + '%)';
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      var total = data.totalClosingCosts;
      var loan = data.loanAmount;

      return {
        type: 'bar',
        data: {
          labels: ['Closing Costs', 'Loan Amount'],
          datasets: [{
            label: 'Amount',
            data: [total, loan],
            backgroundColor: ['#C08A2E', '#2F6F5E'],
            borderColor: ['#A87520', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Closing Costs vs Loan Amount', font: { size: 14 } }
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
    document.getElementById('input_loanAmount').value = 300000;
    document.getElementById('input_originationFee').value = 1500;
    document.getElementById('input_appraisalFee').value = 500;
    document.getElementById('input_titleInsurance').value = 2000;
    document.getElementById('input_escrowFees').value = 800;
    document.getElementById('input_recordingFees').value = 300;
    document.getElementById('input_inspectionFees').value = 400;
    document.getElementById('input_surveyFee').value = 250;
    document.getElementById('input_prepaidInterest').value = 500;
    document.getElementById('input_homeownersInsurance').value = 1200;
    document.getElementById('input_propertyTaxEscrow').value = 1500;
    document.getElementById('input_otherClosingCosts').value = 0;
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
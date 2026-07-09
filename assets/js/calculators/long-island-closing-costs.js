(function() {

  var chartInstance = null;
  var currentTab = 'buyerBreakdown';
  var lastChartData = null;

  // ── Fixed Rates ──
  var MORTGAGE_RECORDING_TAX = 0.0105;  // 1.05% for Nassau/Suffolk
  var NYS_TRANSFER_TAX = 0.004;          // 0.4%
  var COUNTY_TRANSFER_TAX = 0.002;       // ~0.20% (estimates vary)
  var MANSION_TAX_THRESHOLD = 1000000;
  var MANSION_TAX_RATE = 0.01;

  // ── Get Inputs ──
  function getInputs() {
    var purchasePrice = parseFloat(document.getElementById('input_purchasePrice').value) || 0;
    var loanAmount = parseFloat(document.getElementById('input_loanAmount').value) || 0;
    var downPaymentPercent = parseFloat(document.getElementById('input_downPaymentPercent').value) || 0;
    var annualPropertyTax = parseFloat(document.getElementById('input_annualPropertyTax').value) || 0;
    var escrowMonths = parseFloat(document.getElementById('input_escrowMonths').value) || 0;
    var titleInsurance = parseFloat(document.getElementById('input_titleInsurance').value) || 0;
    var attorneyFees = parseFloat(document.getElementById('input_attorneyFees').value) || 0;
    var bankFees = parseFloat(document.getElementById('input_bankFees').value) || 0;
    var sellerAgentCommission = parseFloat(document.getElementById('input_sellerAgentCommission').value) || 0;
    var buyerAgentCommission = parseFloat(document.getElementById('input_buyerAgentCommission').value) || 0;
    var homeInspection = parseFloat(document.getElementById('input_homeInspection').value) || 0;
    var appraisal = parseFloat(document.getElementById('input_appraisal').value) || 0;
    var survey = parseFloat(document.getElementById('input_survey').value) || 0;
    var miscFees = parseFloat(document.getElementById('input_miscFees').value) || 0;

    // Calculate loan amount if not directly entered
    if (loanAmount === 0 && downPaymentPercent > 0 && purchasePrice > 0) {
      loanAmount = purchasePrice * (1 - downPaymentPercent / 100);
    }

    return {
      purchasePrice: purchasePrice,
      loanAmount: loanAmount,
      downPaymentPercent: downPaymentPercent,
      annualPropertyTax: annualPropertyTax,
      escrowMonths: escrowMonths,
      titleInsurance: titleInsurance,
      attorneyFees: attorneyFees,
      bankFees: bankFees,
      sellerAgentCommission: sellerAgentCommission,
      buyerAgentCommission: buyerAgentCommission,
      homeInspection: homeInspection,
      appraisal: appraisal,
      survey: survey,
      miscFees: miscFees
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
  function calculateClosingCosts(inputs) {
    var P = inputs.purchasePrice;
    var L = inputs.loanAmount;
    var tax = inputs.annualPropertyTax;
    var escrowMonths = inputs.escrowMonths;

    // Buyer Costs
    var mortgageRecordingTax = L * MORTGAGE_RECORDING_TAX;
    var mansionTax = (P >= MANSION_TAX_THRESHOLD) ? P * MANSION_TAX_RATE : 0;
    var escrowAmount = (tax / 12) * escrowMonths;
    var buyerTotal = mortgageRecordingTax + mansionTax + inputs.titleInsurance +
                     inputs.attorneyFees + inputs.bankFees + escrowAmount +
                     inputs.homeInspection + inputs.appraisal + inputs.survey + inputs.miscFees;

    // Seller Costs
    var totalCommission = (inputs.sellerAgentCommission + inputs.buyerAgentCommission) / 100 * P;
    var nysTransferTax = P * NYS_TRANSFER_TAX;
    var countyTransferTax = P * COUNTY_TRANSFER_TAX;
    var sellerTotal = totalCommission + nysTransferTax + countyTransferTax +
                      inputs.attorneyFees + inputs.titleInsurance + inputs.miscFees;

    // Cash to Close (Buyer) = Down Payment + Buyer Costs
    var downPayment = P - L;
    var cashToClose = downPayment + buyerTotal;

    // Net Proceeds (Seller)
    var netProceeds = P - sellerTotal;

    return {
      buyerTotal: buyerTotal,
      sellerTotal: sellerTotal,
      mortgageRecordingTax: mortgageRecordingTax,
      mansionTax: mansionTax,
      escrowAmount: escrowAmount,
      totalCommission: totalCommission,
      nysTransferTax: nysTransferTax,
      countyTransferTax: countyTransferTax,
      downPayment: downPayment,
      cashToClose: cashToClose,
      netProceeds: netProceeds,
      // For charts
      buyerItems: {
        'Mortgage Recording Tax': mortgageRecordingTax,
        'Mansion Tax': mansionTax,
        'Title Insurance': inputs.titleInsurance,
        'Attorney Fees': inputs.attorneyFees,
        'Bank Fees': inputs.bankFees,
        'Property Tax Escrow': escrowAmount,
        'Home Inspection': inputs.homeInspection,
        'Appraisal': inputs.appraisal,
        'Survey': inputs.survey,
        'Miscellaneous': inputs.miscFees
      },
      sellerItems: {
        'Agent Commission': totalCommission,
        'NYS Transfer Tax': nysTransferTax,
        'County Transfer Tax': countyTransferTax,
        'Attorney Fees': inputs.attorneyFees,
        'Title Insurance': inputs.titleInsurance,
        'Miscellaneous': inputs.miscFees
      }
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.purchasePrice <= 0 || inputs.loanAmount <= 0) {
      setOutputText('output_buyerTotal', '—');
      setOutputText('output_sellerTotal', '—');
      setOutputText('output_mortgageRecordingTax', '—');
      setOutputText('output_nysTransferTax', '—');
      setOutputText('output_mansionTax', '—');
      setOutputText('output_escrowAmount', '—');
      setOutputText('output_totalCommission', '—');
      setOutputText('output_cashToClose', '—');
      setOutputText('output_netProceeds', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateClosingCosts(inputs);

    setOutputText('output_buyerTotal', formatCurrency(result.buyerTotal));
    setOutputText('output_sellerTotal', formatCurrency(result.sellerTotal));
    setOutputText('output_mortgageRecordingTax', formatCurrency(result.mortgageRecordingTax));
    setOutputText('output_nysTransferTax', formatCurrency(result.nysTransferTax));
    setOutputText('output_mansionTax', formatCurrency(result.mansionTax));
    setOutputText('output_escrowAmount', formatCurrency(result.escrowAmount));
    setOutputText('output_totalCommission', formatCurrency(result.totalCommission));
    setOutputText('output_cashToClose', formatCurrency(result.cashToClose));
    setOutputText('output_netProceeds', formatCurrency(result.netProceeds));

    var chartPayload = {
      buyerItems: result.buyerItems,
      sellerItems: result.sellerItems,
      buyerTotal: result.buyerTotal,
      sellerTotal: result.sellerTotal
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        purchasePrice: inputs.purchasePrice,
        downPaymentPercent: inputs.downPaymentPercent,
        annualPropertyTax: inputs.annualPropertyTax,
        buyerTotal: result.buyerTotal,
        sellerTotal: result.sellerTotal,
        cashToClose: result.cashToClose,
        netProceeds: result.netProceeds
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

    var colors = ['#C08A2E', '#2F6F5E', '#4A90D9', '#D95B43', '#5B4A9B', '#E8A838', '#3A7B8C', '#A87520', '#1f4f42', '#7B8C8C'];

    if (tab === 'buyerBreakdown') {
      var buyerLabels = Object.keys(data.buyerItems);
      var buyerValues = Object.values(data.buyerItems);
      if (buyerValues.every(function(v) { return v === 0; })) return null;

      return {
        type: 'doughnut',
        data: {
          labels: buyerLabels,
          datasets: [{
            data: buyerValues,
            backgroundColor: colors.slice(0, buyerLabels.length),
            borderColor: colors.slice(0, buyerLabels.length),
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
              text: 'Buyer Closing Cost Breakdown',
              font: { size: 14 }
            }
          }
        }
      };
    }

    if (tab === 'sellerBreakdown') {
      var sellerLabels = Object.keys(data.sellerItems);
      var sellerValues = Object.values(data.sellerItems);
      if (sellerValues.every(function(v) { return v === 0; })) return null;

      return {
        type: 'doughnut',
        data: {
          labels: sellerLabels,
          datasets: [{
            data: sellerValues,
            backgroundColor: ['#D95B43', '#4A90D9', '#2F6F5E', '#C08A2E', '#5B4A9B'],
            borderColor: ['#B84A32', '#3a7b8c', '#1f4f42', '#A87520', '#4A3B7B'],
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
              text: 'Seller Closing Cost Breakdown',
              font: { size: 14 }
            }
          }
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Buyer', 'Seller'],
          datasets: [{
            label: 'Total Closing Costs',
            data: [data.buyerTotal, data.sellerTotal],
            backgroundColor: ['#4A90D9', '#D95B43'],
            borderColor: ['#3a7b8c', '#B84A32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Buyer vs Seller Closing Costs',
              font: { size: 14 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Costs' },
              ticks: {
                callback: function(v) { return '$' + v.toFixed(0); }
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
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_purchasePrice').value = 685000;
    document.getElementById('input_loanAmount').value = 548000;
    document.getElementById('input_downPaymentPercent').value = 20;
    document.getElementById('input_annualPropertyTax').value = 12000;
    document.getElementById('input_escrowMonths').value = 6;
    document.getElementById('input_titleInsurance').value = 3500;
    document.getElementById('input_attorneyFees').value = 2500;
    document.getElementById('input_bankFees').value = 1500;
    document.getElementById('input_sellerAgentCommission').value = 3.0;
    document.getElementById('input_buyerAgentCommission').value = 3.0;
    document.getElementById('input_homeInspection').value = 600;
    document.getElementById('input_appraisal').value = 550;
    document.getElementById('input_survey').value = 500;
    document.getElementById('input_miscFees').value = 500;
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
(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalPurchaseAmount: parseFloat(document.getElementById('input_totalPurchaseAmount').value) || 0,
      initialMarginPercent: parseFloat(document.getElementById('input_initialMarginPercent').value) || 50,
      marginInterestRate: parseFloat(document.getElementById('input_marginInterestRate').value) || 0,
      maintenanceMarginPercent: parseFloat(document.getElementById('input_maintenanceMarginPercent').value) || 25
    };
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
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

  function calculateResults(inputs) {
    var total = inputs.totalPurchaseAmount;
    var initPct = inputs.initialMarginPercent / 100;
    var maintPct = inputs.maintenanceMarginPercent / 100;
    var rate = inputs.marginInterestRate / 100;

    if (total <= 0) return null;

    var investorEquity = total * initPct;
    var marginLoan = total - investorEquity;
    var annualInterest = marginLoan * rate;

    var maxDropPct = (1 - (1 - initPct) / (1 - maintPct)) * 100;

    return {
      investorEquity: investorEquity,
      marginLoan: marginLoan,
      annualInterest: annualInterest,
      maxDropPct: maxDropPct,
      total: total
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_investorEquityAmount', formatCurrencyLocal(result.investorEquity));
    setOutputText('output_borrowedMarginLoan', formatCurrencyLocal(result.marginLoan));
    setOutputText('output_annualMarginInterestCost', formatCurrencyLocal(result.annualInterest));
    setOutputText('output_marginCallPriceDropPercent', result.maxDropPct.toFixed(1) + '% Price Drop');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalPurchaseAmount: inputs.totalPurchaseAmount,
        initialMarginPercent: inputs.initialMarginPercent,
        marginInterestRate: inputs.marginInterestRate,
        investorEquityAmount: result.investorEquity,
        borrowedMarginLoan: result.marginLoan,
        annualMarginInterestCost: result.annualInterest
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Investor Cash Equity', 'Borrowed Margin Loan'],
          datasets: [{
            data: [result.investorEquity, result.marginLoan],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Stock Purchase Financing Composition' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'risk') {
      return {
        type: 'bar',
        data: {
          labels: ['Margin Call Risk Threshold'],
          datasets: [
            {
              label: 'Safe Price Buffer %',
              data: [result.maxDropPct],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Maintenance Margin Cutoff %',
              data: [inputs.maintenanceMarginPercent],
              backgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Maximum Allowable Stock Price Decline' }
          },
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });

    setTimeout(updateTool, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();

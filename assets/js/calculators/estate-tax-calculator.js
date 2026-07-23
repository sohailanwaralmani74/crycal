(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalGrossEstate: parseFloat(document.getElementById('input_totalGrossEstate').value) || 0,
      estateDebtsExpenses: parseFloat(document.getElementById('input_estateDebtsExpenses').value) || 0,
      maritalBequests: parseFloat(document.getElementById('input_maritalBequests').value) || 0,
      filingStatus: document.getElementById('input_filingStatus').value
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
    var gross = inputs.totalGrossEstate;
    var netEstate = Math.max(0, gross - inputs.estateDebtsExpenses - inputs.maritalBequests);

    var exemption = 13610000;
    if (inputs.filingStatus.indexOf('Married') !== -1) {
      exemption = 27220000;
    }

    var unusedExemption = Math.max(0, exemption - netEstate);
    var taxableOverExemption = Math.max(0, netEstate - exemption);
    var estateTaxOwed = taxableOverExemption * 0.40;

    return {
      netEstate: netEstate,
      unusedExemption: unusedExemption,
      taxableOverExemption: taxableOverExemption,
      estateTaxOwed: estateTaxOwed,
      exemption: exemption
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_netTaxableEstate', formatCurrencyLocal(result.netEstate));
    setOutputText('output_unusedExemptionRemaining', formatCurrencyLocal(result.unusedExemption));
    setOutputText('output_taxableAmountOverExemption', formatCurrencyLocal(result.taxableOverExemption));
    setOutputText('output_estimatedFederalEstateTax', formatCurrencyLocal(result.estateTaxOwed));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalGrossEstate: inputs.totalGrossEstate,
        filingStatus: inputs.filingStatus,
        netTaxableEstate: result.netEstate,
        unusedExemptionRemaining: result.unusedExemption,
        estimatedFederalEstateTax: result.estateTaxOwed
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
          labels: ['Net Estate', 'Debts & Expenses', 'Marital / Charitable Deductions'],
          datasets: [{
            data: [result.netEstate, inputs.estateDebtsExpenses, inputs.maritalBequests],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Gross Estate Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'taxability') {
      var exemptPortion = Math.min(result.netEstate, result.exemption);
      return {
        type: 'bar',
        data: {
          labels: ['Net Estate Taxability'],
          datasets: [
            {
              label: 'Exempt Net Estate Amount',
              data: [exemptPortion],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Taxable Amount Above Exemption',
              data: [result.taxableOverExemption],
              backgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Exempt vs Taxable Estate Share' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
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

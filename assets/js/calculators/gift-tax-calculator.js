(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalGiftAmount: parseFloat(document.getElementById('input_totalGiftAmount').value) || 0,
      giftYear: document.getElementById('input_giftYear').value,
      isGiftSplitting: document.getElementById('input_isGiftSplitting').value
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
    var gift = inputs.totalGiftAmount;
    if (gift <= 0) return null;

    var limit = 18000;
    if (inputs.giftYear.indexOf('2023') !== -1) limit = 17000;

    if (inputs.isGiftSplitting.indexOf('Yes') !== -1) {
      limit *= 2;
    }

    var taxFreeExclusion = Math.min(gift, limit);
    var reportable = Math.max(0, gift - taxFreeExclusion);

    return {
      taxFreeExclusion: taxFreeExclusion,
      reportable: reportable,
      gift: gift
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_annualExclusionApplied', formatCurrencyLocal(result.taxFreeExclusion));
    setOutputText('output_reportableGiftAmount', formatCurrencyLocal(result.reportable));
    setOutputText('output_estimatedTaxOwedNow', '$0.00 (Reduces Lifetime Exemption)');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalGiftAmount: inputs.totalGiftAmount,
        giftYear: inputs.giftYear,
        annualExclusionApplied: result.taxFreeExclusion,
        reportableGiftAmount: result.reportable
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
    if (tab === 'breakdown' || tab === 'lifetime') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Tax-Free Annual Exclusion', 'Reportable Gift Amount (Form 709)'],
          datasets: [{
            data: [result.taxFreeExclusion, result.reportable],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Gift Tax Exclusion Allocation' }
          },
          cutout: '60%'
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

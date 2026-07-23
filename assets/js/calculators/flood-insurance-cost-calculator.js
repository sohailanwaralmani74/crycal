(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      buildingCoverage: parseFloat(document.getElementById('input_buildingCoverage').value) || 0,
      contentsCoverage: parseFloat(document.getElementById('input_contentsCoverage').value) || 0,
      floodZoneRisk: document.getElementById('input_floodZoneRisk').value,
      deductibleAmount: parseFloat(document.getElementById('input_deductibleAmount').value) || 1250
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
    var bldg = inputs.buildingCoverage;
    var cont = inputs.contentsCoverage;
    var zone = inputs.floodZoneRisk;
    var ded = inputs.deductibleAmount;

    var baseRateBldg = 0.0025;
    var baseRateCont = 0.0040;

    if (zone.indexOf('Zone AE') !== -1) {
      baseRateBldg = 0.0075;
      baseRateCont = 0.0100;
    } else if (zone.indexOf('Zone VE') !== -1) {
      baseRateBldg = 0.0150;
      baseRateCont = 0.0180;
    } else if (zone.indexOf('Moderate-Low') !== -1) {
      baseRateBldg = 0.0020;
      baseRateCont = 0.0030;
    } else if (zone.indexOf('Low Risk') !== -1) {
      baseRateBldg = 0.0012;
      baseRateCont = 0.0020;
    }

    var bldgPrem = bldg * baseRateBldg;
    var contPrem = cont * baseRateCont;
    var rawPrem = bldgPrem + contPrem;

    var dedDiscount = Math.min(0.25, (ded / 10000) * 0.20);
    var annualPrem = Math.max(350, rawPrem * (1 - dedDiscount));
    var monthlyCost = annualPrem / 12;

    return {
      annualPrem: annualPrem,
      monthlyCost: monthlyCost,
      bldgPrem: bldgPrem,
      contPrem: contPrem
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_estimatedAnnualPremium', formatCurrencyLocal(result.annualPrem));
    setOutputText('output_estimatedMonthlyCost', formatCurrencyLocal(result.monthlyCost));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        buildingCoverage: inputs.buildingCoverage,
        contentsCoverage: inputs.contentsCoverage,
        floodZoneRisk: inputs.floodZoneRisk,
        estimatedAnnualPremium: result.annualPrem,
        estimatedMonthlyCost: result.monthlyCost
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
          labels: ['Building Structure Premium Portion', 'Personal Contents Premium Portion'],
          datasets: [{
            data: [result.bldgPrem, result.contPrem],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Flood Insurance Premium Share' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'risk') {
      return {
        type: 'bar',
        data: {
          labels: ['Estimated Annual Premium'],
          datasets: [{
            label: inputs.floodZoneRisk,
            data: [result.annualPrem],
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Annual Premium for Selected Zone' }
          },
          scales: {
            y: { beginAtZero: true }
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

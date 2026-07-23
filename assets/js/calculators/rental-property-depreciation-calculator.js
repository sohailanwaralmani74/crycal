(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      propertyPurchasePrice: parseFloat(document.getElementById('input_propertyPurchasePrice').value) || 0,
      landValuePercent: parseFloat(document.getElementById('input_landValuePercent').value) || 20,
      capitalImprovements: parseFloat(document.getElementById('input_capitalImprovements').value) || 0
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
    var price = inputs.propertyPurchasePrice;
    var landVal = price * (inputs.landValuePercent / 100);
    var buildingVal = Math.max(0, price - landVal);
    var costBasis = buildingVal + inputs.capitalImprovements;

    if (costBasis <= 0) return null;

    var annualDep = costBasis / 27.5;
    var monthlyDep = annualDep / 12;

    var timeline = [];
    var cumDep = 0;
    for (var yr = 1; yr <= 28; yr++) {
      if (yr <= 27) cumDep += annualDep;
      else cumDep += (annualDep / 2);
      timeline.push({ year: yr, cumDep: Math.min(costBasis, cumDep) });
    }

    return {
      landVal: landVal,
      costBasis: costBasis,
      annualDep: annualDep,
      monthlyDep: monthlyDep,
      timeline: timeline
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_depreciableCostBasis', formatCurrencyLocal(result.costBasis));
    setOutputText('output_annualDepreciationDeduction', formatCurrencyLocal(result.annualDep));
    setOutputText('output_monthlyDepreciationWriteoff', formatCurrencyLocal(result.monthlyDep));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        propertyPurchasePrice: inputs.propertyPurchasePrice,
        landValuePercent: inputs.landValuePercent,
        capitalImprovements: inputs.capitalImprovements,
        depreciableCostBasis: result.costBasis,
        annualDepreciationDeduction: result.annualDep
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
    var currencySymbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Depreciable Building Basis', 'Non-Depreciable Land Value'],
          datasets: [{
            data: [result.costBasis, result.landVal],
            backgroundColor: ['#2F6F5E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Real Estate Cost Basis Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'timeline') {
      var labels = result.timeline.map(function(d) { return 'Yr ' + d.year; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Accumulated Depreciation Write-Off',
            data: result.timeline.map(function(d) { return d.cumDep; }),
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: '27.5-Year Cumulative Tax Deduction Growth' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
            }
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

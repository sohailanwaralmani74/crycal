(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      currentAnnualTuition: parseFloat(document.getElementById('input_currentAnnualTuition').value) || 0,
      roomAndBoardAnnual: parseFloat(document.getElementById('input_roomAndBoardAnnual').value) || 0,
      yearsUntilCollege: parseFloat(document.getElementById('input_yearsUntilCollege').value) || 10,
      tuitionInflationRate: parseFloat(document.getElementById('input_tuitionInflationRate').value) || 5.0
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
    var baseAnnual = inputs.currentAnnualTuition + inputs.roomAndBoardAnnual;
    var yrs = inputs.yearsUntilCollege;
    var infl = inputs.tuitionInflationRate / 100;

    if (baseAnnual <= 0) return null;

    var startAnnual = baseAnnual * Math.pow(1 + infl, yrs);
    var total4Year = 0;
    var yearCosts = [];

    for (var i = 0; i < 4; i++) {
      var yrCost = startAnnual * Math.pow(1 + infl, i);
      total4Year += yrCost;
      yearCosts.push({ year: i + 1, cost: yrCost });
    }

    var totalMos = Math.max(1, yrs * 12);
    var reqMonthly = total4Year / totalMos;

    return {
      total4Year: total4Year,
      reqMonthly: reqMonthly,
      yearCosts: yearCosts,
      startAnnual: startAnnual,
      uninflatedTotal: baseAnnual * 4
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_projected4YearTotal', formatCurrencyLocal(result.total4Year));
    setOutputText('output_requiredMonthlySavings', formatCurrencyLocal(result.reqMonthly) + ' / mo');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAnnualTuition: inputs.currentAnnualTuition,
        roomAndBoardAnnual: inputs.roomAndBoardAnnual,
        yearsUntilCollege: inputs.yearsUntilCollege,
        tuitionInflationRate: inputs.tuitionInflationRate,
        projected4YearTotal: result.total4Year,
        requiredMonthlySavings: result.reqMonthly
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
        type: 'bar',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
          datasets: [{
            label: 'Projected Annual College Cost',
            data: result.yearCosts.map(function(d) { return d.cost; }),
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Projected 4-Year Annual College Outlay' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
    }

    if (tab === 'inflation') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Uninflated 4-Year Baseline', 'Tuition Inflation Added Cost'],
          datasets: [{
            data: [result.uninflatedTotal, Math.max(0, result.total4Year - result.uninflatedTotal)],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Impact of Education Inflation on 4-Year Total' }
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

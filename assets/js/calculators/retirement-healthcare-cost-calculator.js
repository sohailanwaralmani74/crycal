(function() {

  var chartInstance = null;
  var currentTab = 'annual';
  var lastChartData = null;

  function getInputs() {
    var currentAge = parseFloat(document.getElementById('input_currentAge').value) || 0;
    var retirementAge = parseFloat(document.getElementById('input_retirementAge').value) || 0;
    var lifeExpectancy = parseFloat(document.getElementById('input_lifeExpectancy').value) || 0;
    var currentAnnualHealthcareCost = parseFloat(document.getElementById('input_currentAnnualHealthcareCost').value) || 0;
    var healthcareInflationRate = parseFloat(document.getElementById('input_healthcareInflationRate').value) || 0;
    var discountRate = parseFloat(document.getElementById('input_discountRate').value) || 0;

    return {
      currentAge: currentAge,
      retirementAge: retirementAge,
      lifeExpectancy: lifeExpectancy,
      currentAnnualHealthcareCost: currentAnnualHealthcareCost,
      healthcareInflationRate: healthcareInflationRate / 100,
      discountRate: discountRate / 100
    };
  }

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

  var ALL_OUTPUTS = ['firstYearRetirementCost', 'totalLifetimeCost', 'presentValueOfCosts', 'averageAnnualCost'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateHealthcareCost(inputs) {
    var yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
    var retirementDuration = inputs.lifeExpectancy - inputs.retirementAge;

    if (inputs.currentAnnualHealthcareCost <= 0) {
      return { error: 'Enter a valid current annual healthcare cost' };
    }
    if (yearsUntilRetirement < 0 || retirementDuration <= 0) {
      return { error: 'Enter valid ages (retirement age and life expectancy must be after current age)' };
    }

    var firstYearCost = inputs.currentAnnualHealthcareCost * Math.pow(1 + inputs.healthcareInflationRate, yearsUntilRetirement);

    var totalLifetimeCost = 0;
    var presentValueOfCosts = 0;
    var annualPoints = [];
    var cumulativePoints = [];
    var cumulative = 0;

    for (var y = 0; y < retirementDuration; y++) {
      var yearCost = firstYearCost * Math.pow(1 + inputs.healthcareInflationRate, y);
      totalLifetimeCost += yearCost;
      cumulative += yearCost;

      var yearsFromNow = yearsUntilRetirement + y;
      var pv = yearCost / Math.pow(1 + inputs.discountRate, yearsFromNow);
      presentValueOfCosts += pv;

      annualPoints.push({ year: y + 1, cost: yearCost });
      cumulativePoints.push({ year: y + 1, cumulative: cumulative });
    }

    var averageAnnualCost = totalLifetimeCost / retirementDuration;

    return {
      firstYearRetirementCost: firstYearCost,
      totalLifetimeCost: totalLifetimeCost,
      presentValueOfCosts: presentValueOfCosts,
      averageAnnualCost: averageAnnualCost,
      annualPoints: annualPoints,
      cumulativePoints: cumulativePoints,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentAnnualHealthcareCost <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateHealthcareCost(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_firstYearRetirementCost', formatCurrency(result.firstYearRetirementCost));
    setOutputText('output_totalLifetimeCost', formatCurrency(result.totalLifetimeCost));
    setOutputText('output_presentValueOfCosts', formatCurrency(result.presentValueOfCosts));
    setOutputText('output_averageAnnualCost', formatCurrency(result.averageAnnualCost));

    var chartPayload = {
      annualPoints: result.annualPoints,
      cumulativePoints: result.cumulativePoints
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        lifeExpectancy: inputs.lifeExpectancy,
        totalLifetimeCost: result.totalLifetimeCost
      });
    }
  }

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

  function currencyTick(v) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
    } catch (e) { return '$' + v.toFixed(0); }
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'annual' && data.annualPoints && data.annualPoints.length > 0) {
      var labels = data.annualPoints.map(function(d) { return 'Yr ' + d.year; });
      var costs = data.annualPoints.map(function(d) { return d.cost; });

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{ label: 'Annual Healthcare Cost', data: costs, backgroundColor: 'rgba(74, 144, 217, 0.6)', borderColor: '#4A90D9', borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Annual Healthcare Cost in Retirement', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 15 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: currencyTick } }
          }
        }
      };
    }

    if (tab === 'cumulative' && data.cumulativePoints && data.cumulativePoints.length > 0) {
      var cLabels = data.cumulativePoints.map(function(d) { return 'Yr ' + d.year; });
      var cumulative = data.cumulativePoints.map(function(d) { return d.cumulative; });

      return {
        type: 'line',
        data: {
          labels: cLabels,
          datasets: [{ label: 'Cumulative Healthcare Cost', data: cumulative, borderColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Cumulative Healthcare Cost', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 15 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: currencyTick } }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {
    document.getElementById('input_currentAge').value = 55;
    document.getElementById('input_retirementAge').value = 65;
    document.getElementById('input_lifeExpectancy').value = 90;
    document.getElementById('input_currentAnnualHealthcareCost').value = 7000;
    document.getElementById('input_healthcareInflationRate').value = 5.5;
    document.getElementById('input_discountRate').value = 5;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

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

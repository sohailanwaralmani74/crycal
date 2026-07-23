(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      vehicleValue: parseFloat(document.getElementById('input_vehicleValue').value) || 0,
      driverAge: parseFloat(document.getElementById('input_driverAge').value) || 30,
      carCategory: document.getElementById('input_carCategory').value || 'sedan',
      coverageLevel: document.getElementById('input_coverageLevel').value || 'full-coverage',
      deductible: parseFloat(document.getElementById('input_deductible').value) || 500,
      drivingRecord: document.getElementById('input_drivingRecord').value || 'clean'
    };
  }

  function formatCurrency(amount) {
    try {
      var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + Math.round(amount);
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
    var baseRate = 600 + (inputs.vehicleValue * 0.015);

    // Age Factor
    var age = inputs.driverAge;
    var ageFactor = 1.0;
    if (age < 21) ageFactor = 2.2;
    else if (age < 25) ageFactor = 1.5;
    else if (age < 65) ageFactor = 1.0;
    else ageFactor = 1.15;

    // Category Factor
    var catFactor = 1.0;
    if (inputs.carCategory === 'sports') catFactor = 1.45;
    else if (inputs.carCategory === 'suv') catFactor = 0.95;
    else if (inputs.carCategory === 'truck') catFactor = 1.05;
    else if (inputs.carCategory === 'electric') catFactor = 1.20;

    // Coverage Factor
    var covFactor = 1.0;
    if (inputs.coverageLevel === 'state-min') covFactor = 0.45;
    else if (inputs.coverageLevel === 'standard') covFactor = 0.75;
    else if (inputs.coverageLevel === 'full-coverage') covFactor = 1.00;
    else if (inputs.coverageLevel === 'premium') covFactor = 1.30;

    // Deductible Factor
    var dedFactor = 1.0;
    if (inputs.deductible === 250) dedFactor = 1.12;
    else if (inputs.deductible === 500) dedFactor = 1.00;
    else if (inputs.deductible === 1000) dedFactor = 0.85;
    else if (inputs.deductible === 2000) dedFactor = 0.72;

    // Record Factor
    var recFactor = 1.0;
    if (inputs.drivingRecord === '1-ticket') recFactor = 1.20;
    else if (inputs.drivingRecord === '1-accident') recFactor = 1.45;
    else if (inputs.drivingRecord === 'major-violation') recFactor = 2.10;

    var annualPremium = baseRate * ageFactor * catFactor * covFactor * dedFactor * recFactor;
    var monthlyPremium = annualPremium / 12;
    var fiveYearTotal = annualPremium * 5;

    // Risk tier text
    var totalMultiplier = ageFactor * catFactor * recFactor;
    var riskTier = 'Standard Risk';
    if (totalMultiplier > 2.2) riskTier = 'High Risk (Preferred Rates Excluded)';
    else if (totalMultiplier > 1.4) riskTier = 'Moderate Risk';
    else if (totalMultiplier <= 1.0) riskTier = 'Low Risk (Preferred Tier)';

    return {
      annualPremium: annualPremium,
      monthlyPremium: monthlyPremium,
      fiveYearTotal: fiveYearTotal,
      riskTier: riskTier,
      baseRate: baseRate,
      ageFactor: ageFactor,
      catFactor: catFactor,
      recFactor: recFactor,
      dedFactor: dedFactor
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_estimatedAnnualPremium', formatCurrency(result.annualPremium));
    setOutputText('output_estimatedMonthlyPremium', formatCurrency(result.monthlyPremium));
    setOutputText('output_riskTier', result.riskTier);
    setOutputText('output_fiveYearInsuranceTotal', formatCurrency(result.fiveYearTotal));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehicleValue: inputs.vehicleValue,
        driverAge: inputs.driverAge,
        coverageLevel: inputs.coverageLevel,
        estimatedAnnualPremium: Math.round(result.annualPremium),
        estimatedMonthlyPremium: Math.round(result.monthlyPremium)
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
      var base = result.baseRate;
      var mult = result.ageFactor * result.catFactor * result.recFactor * result.dedFactor;

      return {
        type: 'bar',
        data: {
          labels: ['State Minimum', 'Standard', 'Full Coverage', 'Premium Coverage'],
          datasets: [{
            label: 'Estimated Annual Premium ',
            data: [
              Math.round(base * mult * 0.45),
              Math.round(base * mult * 0.75),
              Math.round(base * mult * 1.00),
              Math.round(base * mult * 1.30)
            ],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Premium Comparison by Coverage Tier', font: { size: 14 }, color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            }
          }
        }
      };
    } else if (tab === 'deductibleImpact') {
      var baseAnnual = result.annualPremium / result.dedFactor;
      var deductibles = [250, 500, 1000, 2000];
      var dedFactors = [1.12, 1.00, 0.85, 0.72];
      var premData = deductibles.map(function(d, i) {
        return Math.round(baseAnnual * dedFactors[i]);
      });

      return {
        type: 'bar',
        data: {
          labels: ['$250 Deductible', '$500 Deductible', '$1,000 Deductible', '$2,000 Deductible'],
          datasets: [{
            label: 'Annual Premium ',
            data: premData,
            backgroundColor: '#e11d48',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Premium Impact by Deductible Choice', font: { size: 14 }, color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
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
    document.getElementById('input_vehicleValue').value = 28000;
    document.getElementById('input_driverAge').value = 30;
    document.getElementById('input_carCategory').value = 'sedan';
    document.getElementById('input_coverageLevel').value = 'full-coverage';
    document.getElementById('input_deductible').value = 500;
    document.getElementById('input_drivingRecord').value = 'clean';
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

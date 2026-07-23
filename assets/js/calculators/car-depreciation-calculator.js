(function() {
  var chartInstance = null;
  var currentTab = 'depreciationCurve';

  var BASE_RATES = {
    sedan:   [0.20, 0.14, 0.12, 0.10, 0.08],
    suv:     [0.18, 0.13, 0.11, 0.09, 0.08],
    truck:   [0.15, 0.11, 0.10, 0.08, 0.07],
    luxury:  [0.25, 0.16, 0.14, 0.12, 0.10],
    electric:[0.27, 0.17, 0.15, 0.12, 0.10]
  };

  function getInputs() {
    return {
      initialValue: parseFloat(document.getElementById('input_initialValue').value) || 0,
      vehicleType: document.getElementById('input_vehicleType').value || 'sedan',
      vehicleAge: parseFloat(document.getElementById('input_vehicleAge').value) || 0,
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 12000
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
    var V0 = inputs.initialValue;
    var rates = BASE_RATES[inputs.vehicleType] || BASE_RATES.sedan;

    // Mileage factor: average is 12,000 miles/yr.
    var milesFactor = 1.0;
    if (inputs.annualMiles > 12000) {
      milesFactor += ((inputs.annualMiles - 12000) / 1000) * 0.015;
    } else if (inputs.annualMiles < 12000) {
      milesFactor -= ((12000 - inputs.annualMiles) / 1000) * 0.01;
    }
    milesFactor = Math.max(0.8, Math.min(1.4, milesFactor));

    // Calculate year 1 to 5 values
    var yearlyValues = [V0];
    var yearlyLosses = [];
    var currentVal = V0;

    for (var yr = 0; yr < 5; yr++) {
      // If vehicle starts at age > 0, soften rates slightly
      var rateIndex = Math.min(4, yr + inputs.vehicleAge);
      var effectiveRate = Math.min(0.35, rates[rateIndex] * milesFactor);

      var loss = currentVal * effectiveRate;
      currentVal = currentVal - loss;
      yearlyValues.push(currentVal);
      yearlyLosses.push(loss);
    }

    var valueYear1 = yearlyValues[1];
    var valueYear3 = yearlyValues[3];
    var valueYear5 = yearlyValues[5];
    var total5YearDepreciation = V0 - valueYear5;
    var depreciationPercent5Yr = V0 > 0 ? ((total5YearDepreciation / V0) * 100) : 0;

    return {
      V0: V0,
      valueYear1: valueYear1,
      valueYear3: valueYear3,
      valueYear5: valueYear5,
      total5YearDepreciation: total5YearDepreciation,
      depreciationPercent5Yr: depreciationPercent5Yr,
      yearlyValues: yearlyValues,
      yearlyLosses: yearlyLosses
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_valueYear1', formatCurrency(result.valueYear1));
    setOutputText('output_valueYear3', formatCurrency(result.valueYear3));
    setOutputText('output_valueYear5', formatCurrency(result.valueYear5));
    setOutputText('output_total5YearDepreciation', formatCurrency(result.total5YearDepreciation));
    setOutputText('output_depreciationPercent5Yr', result.depreciationPercent5Yr.toFixed(1) + '%');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        initialValue: inputs.initialValue,
        vehicleType: inputs.vehicleType,
        valueYear5: Math.round(result.valueYear5),
        total5YearDepreciation: Math.round(result.total5YearDepreciation),
        depreciationPercent5Yr: result.depreciationPercent5Yr.toFixed(1) + '%'
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
    if (tab === 'depreciationCurve') {
      var labels = ['Purchase', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      var chartValues = result.yearlyValues.map(function(val) { return Math.round(val); });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Vehicle Value ',
            data: chartValues,
            borderColor: '#e11d48',
            backgroundColor: 'rgba(225, 29, 72, 0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Vehicle Residual Value Trajectory ', font: { size: 14 }, color: '#e8edf0' }
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
    } else if (tab === 'yearlyLoss') {
      var labels2 = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      var lossesData = result.yearlyLosses.map(function(val) { return Math.round(val); });

      return {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [{
            label: 'Value Lost ',
            data: lossesData,
            backgroundColor: '#f59e0b',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Depreciation Dollar Loss', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_initialValue').value = 32000;
    document.getElementById('input_vehicleType').value = 'sedan';
    document.getElementById('input_vehicleAge').value = 0;
    document.getElementById('input_annualMiles').value = 12000;
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

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      vehicleValue: parseFloat(document.getElementById('input_vehicleValue').value) || 0,
      vehicleWeight: parseFloat(document.getElementById('input_vehicleWeight').value) || 3500,
      vehicleAge: parseFloat(document.getElementById('input_vehicleAge').value) || 0,
      stateFeeModel: document.getElementById('input_stateFeeModel').value || 'hybrid',
      adValoremRate: parseFloat(document.getElementById('input_adValoremRate').value) || 1.5
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
    var model = inputs.stateFeeModel;
    var baseFee = 45;
    var weightFee = 0;
    var adValoremTax = 0;

    if (model === 'flat') {
      baseFee = 65;
    } else if (model === 'weight-based') {
      baseFee = 45;
      if (inputs.vehicleWeight > 3000) {
        weightFee = Math.ceil((inputs.vehicleWeight - 3000) / 1000) * 20;
      }
    } else if (model === 'value-based') {
      baseFee = 40;
      adValoremTax = inputs.vehicleValue * (inputs.adValoremRate / 100);
    } else if (model === 'hybrid') {
      baseFee = 45;
      if (inputs.vehicleWeight > 3500) {
        weightFee = Math.ceil((inputs.vehicleWeight - 3500) / 1000) * 15;
      }
      adValoremTax = inputs.vehicleValue * (inputs.adValoremRate / 100);
    }

    var basePlusWeight = baseFee + weightFee;
    var totalAnnualFees = basePlusWeight + adValoremTax;
    var monthlyEquivalent = totalAnnualFees / 12;

    // 5-Year cumulative estimation assuming 15% annual vehicle depreciation
    var fiveYearTagTotal = 0;
    var tempVal = inputs.vehicleValue;
    var yearlyFeeList = [];

    for (var yr = 1; yr <= 5; yr++) {
      var yrTax = 0;
      if (model === 'value-based' || model === 'hybrid') {
        yrTax = tempVal * (inputs.adValoremRate / 100);
      }
      var yrTotal = basePlusWeight + yrTax;
      fiveYearTagTotal += yrTotal;
      yearlyFeeList.push(yrTotal);
      tempVal = tempVal * 0.85; // 15% depreciation
    }

    return {
      baseRegistrationFee: basePlusWeight,
      adValoremTax: adValoremTax,
      totalAnnualFees: totalAnnualFees,
      monthlyEquivalent: monthlyEquivalent,
      fiveYearTagTotal: fiveYearTagTotal,
      yearlyFeeList: yearlyFeeList
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_baseRegistrationFee', formatCurrency(result.baseRegistrationFee));
    setOutputText('output_adValoremTax', formatCurrency(result.adValoremTax));
    setOutputText('output_totalAnnualFees', formatCurrency(result.totalAnnualFees));
    setOutputText('output_monthlyEquivalent', formatCurrency(result.monthlyEquivalent));
    setOutputText('output_fiveYearTagTotal', formatCurrency(result.fiveYearTagTotal));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehicleValue: inputs.vehicleValue,
        stateFeeModel: inputs.stateFeeModel,
        baseRegistrationFee: Math.round(result.baseRegistrationFee),
        adValoremTax: Math.round(result.adValoremTax),
        totalAnnualFees: Math.round(result.totalAnnualFees)
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
          labels: ['Base Tag & Weight Fee', 'Ad Valorem Property Tax'],
          datasets: [{
            data: [
              Math.round(result.baseRegistrationFee),
              Math.round(result.adValoremTax)
            ],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 11 } } },
            title: { display: true, text: 'Annual Fee vs Tax Split', font: { size: 14 }, color: '#e8edf0' }
          }
        }
      };
    } else if (tab === 'ageTrend') {
      var labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      var chartValues = result.yearlyFeeList.map(function(val) { return Math.round(val); });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Annual DMV Fee ',
            data: chartValues,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Registration Renewal Trend (Depreciating Tax)', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_vehicleValue').value = 25000;
    document.getElementById('input_vehicleWeight').value = 3500;
    document.getElementById('input_vehicleAge').value = 3;
    document.getElementById('input_stateFeeModel').value = 'hybrid';
    document.getElementById('input_adValoremRate').value = 1.5;
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

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      purchasePrice: parseFloat(document.getElementById('input_purchasePrice').value) || 0,
      annualMiles: parseFloat(document.getElementById('input_annualMiles').value) || 0,
      mpg: parseFloat(document.getElementById('input_mpg').value) || 1,
      gasPrice: parseFloat(document.getElementById('input_gasPrice').value) || 0,
      annualInsurance: parseFloat(document.getElementById('input_annualInsurance').value) || 0,
      annualMaintenance: parseFloat(document.getElementById('input_annualMaintenance').value) || 0,
      annualTaxFees: parseFloat(document.getElementById('input_annualTaxFees').value) || 0,
      depreciationRate: parseFloat(document.getElementById('input_depreciationRate').value) || 15
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
    var P = inputs.purchasePrice;
    var rate = inputs.depreciationRate / 100;

    // 5-year depreciation
    var remainingValue = P * Math.pow(1 - rate, 5);
    var fiveYearDepreciation = Math.max(0, P - remainingValue);

    // 5-year fuel
    var annualGallons = inputs.annualMiles / Math.max(1, inputs.mpg);
    var annualFuel = annualGallons * inputs.gasPrice;
    var fiveYearFuel = annualFuel * 5;

    // 5-year insurance, maintenance, fees
    var fiveYearInsurance = inputs.annualInsurance * 5;
    var fiveYearMaintenance = inputs.annualMaintenance * 5;
    var fiveYearFees = inputs.annualTaxFees * 5;
    var fiveYearFixed = fiveYearInsurance + fiveYearMaintenance + fiveYearFees;

    var total5YearTco = fiveYearDepreciation + fiveYearFuel + fiveYearFixed;
    var monthlyTco = total5YearTco / 60;
    var total5YearMiles = inputs.annualMiles * 5;
    var costPerMile = total5YearMiles > 0 ? (total5YearTco / total5YearMiles) : 0;

    // Cumulative yearly breakdown for charts
    var yearlyCosts = [];
    var cumulativeTco = 0;
    var val = P;
    for (var year = 1; year <= 5; year++) {
      var nextVal = val * (1 - rate);
      var depYear = val - nextVal;
      val = nextVal;

      var yearlyTotal = depYear + annualFuel + inputs.annualInsurance + inputs.annualMaintenance + inputs.annualTaxFees;
      cumulativeTco += yearlyTotal;
      yearlyCosts.push({
        year: year,
        depreciation: depYear,
        fuel: annualFuel,
        fixed: inputs.annualInsurance + inputs.annualMaintenance + inputs.annualTaxFees,
        cumulative: cumulativeTco
      });
    }

    return {
      fiveYearDepreciation: fiveYearDepreciation,
      fiveYearFuel: fiveYearFuel,
      fiveYearInsurance: fiveYearInsurance,
      fiveYearMaintenance: fiveYearMaintenance,
      fiveYearFees: fiveYearFees,
      fiveYearFixed: fiveYearFixed,
      total5YearTco: total5YearTco,
      monthlyTco: monthlyTco,
      costPerMile: costPerMile,
      yearlyCosts: yearlyCosts
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);

    setOutputText('output_total5YearTco', formatCurrency(result.total5YearTco));
    setOutputText('output_monthlyTco', formatCurrency(result.monthlyTco));
    setOutputText('output_costPerMile', '$' + result.costPerMile.toFixed(2));
    setOutputText('output_fiveYearDepreciation', formatCurrency(result.fiveYearDepreciation));
    setOutputText('output_fiveYearFuel', formatCurrency(result.fiveYearFuel));
    setOutputText('output_fiveYearFixed', formatCurrency(result.fiveYearFixed));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        purchasePrice: inputs.purchasePrice,
        total5YearTco: Math.round(result.total5YearTco),
        monthlyTco: Math.round(result.monthlyTco),
        costPerMile: result.costPerMile.toFixed(2),
        fiveYearDepreciation: Math.round(result.fiveYearDepreciation)
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
          labels: ['Depreciation', 'Fuel', 'Insurance', 'Maintenance & Repairs', 'Taxes & Tag Fees'],
          datasets: [{
            data: [
              Math.round(result.fiveYearDepreciation),
              Math.round(result.fiveYearFuel),
              Math.round(result.fiveYearInsurance),
              Math.round(result.fiveYearMaintenance),
              Math.round(result.fiveYearFees)
            ],
            backgroundColor: ['#e11d48', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 11 } } },
            title: { display: true, text: '5-Year TCO Cost Breakdown', font: { size: 14 }, color: '#e8edf0' }
          }
        }
      };
    } else if (tab === 'yearly') {
      var labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      var cumulativeData = result.yearlyCosts.map(function(item) { return Math.round(item.cumulative); });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cumulative Ownership Cost ',
            data: cumulativeData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cumulative Cost Over 5 Years', font: { size: 14 }, color: '#e8edf0' }
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
    document.getElementById('input_purchasePrice').value = 35000;
    document.getElementById('input_annualMiles').value = 12000;
    document.getElementById('input_mpg').value = 28;
    document.getElementById('input_gasPrice').value = 3.50;
    document.getElementById('input_annualInsurance').value = 1600;
    document.getElementById('input_annualMaintenance').value = 800;
    document.getElementById('input_annualTaxFees').value = 400;
    document.getElementById('input_depreciationRate').value = 15;
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

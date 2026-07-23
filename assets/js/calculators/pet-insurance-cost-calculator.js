(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var petType = document.getElementById('input_petType').value.trim() || 'Dog';
    var petAge = parseFloat(document.getElementById('input_petAge').value) || 0;
    var breed = document.getElementById('input_breed').value.trim() || 'Mixed';
    var location = document.getElementById('input_location').value.trim() || 'Suburban';
    var coverageType = document.getElementById('input_coverageType').value.trim() || 'Comprehensive';
    var deductible = parseFloat(document.getElementById('input_deductible').value) || 0;
    var reimbursementRate = parseFloat(document.getElementById('input_reimbursementRate').value) || 0;
    var annualLimit = parseFloat(document.getElementById('input_annualLimit').value) || 0;
    var baseRate = parseFloat(document.getElementById('input_baseRate').value) || 0;

    return {
      petType: petType,
      petAge: petAge,
      breed: breed,
      location: location,
      coverageType: coverageType,
      deductible: deductible,
      reimbursementRate: reimbursementRate,
      annualLimit: annualLimit,
      baseRate: baseRate
    };
  }

  // ── Format Currency ──
  function formatCurrencyFull(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
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

  // ── Core Calculation ──
  function calculatePetInsurance(inputs) {
    var baseRate = inputs.baseRate;
    var age = inputs.petAge;
    var deductible = inputs.deductible;
    var reimbursement = inputs.reimbursementRate;
    var limit = inputs.annualLimit;

    if (baseRate <= 0 || age < 0) {
      return { error: 'Enter valid values' };
    }

    // ── Age Factor ──
    var ageFactor = 1.00;
    if (age < 2) ageFactor = 0.85;
    else if (age <= 5) ageFactor = 1.00;
    else if (age <= 8) ageFactor = 1.20;
    else ageFactor = 1.45;

    // ── Deductible Factor ──
    var deductibleFactor = 1.00;
    if (deductible <= 100) deductibleFactor = 1.15;
    else if (deductible <= 250) deductibleFactor = 1.05;
    else if (deductible <= 500) deductibleFactor = 1.00;
    else if (deductible <= 1000) deductibleFactor = 0.85;
    else deductibleFactor = 0.75;

    // ── Reimbursement Factor ──
    var reimbursementFactor = 1.00;
    if (reimbursement <= 70) reimbursementFactor = 0.85;
    else if (reimbursement <= 80) reimbursementFactor = 1.00;
    else if (reimbursement <= 90) reimbursementFactor = 1.15;
    else reimbursementFactor = 1.25;

    // ── Limit Factor ──
    var limitFactor = 1.00;
    if (limit <= 5000) limitFactor = 0.85;
    else if (limit <= 10000) limitFactor = 1.00;
    else if (limit <= 20000) limitFactor = 1.15;
    else limitFactor = 1.30;

    // ── Final Calculation ──
    var monthlyPremium = baseRate * ageFactor * deductibleFactor * reimbursementFactor * limitFactor;
    var annualPremium = monthlyPremium * 12;

    // ── Cost Range ──
    var lowerRange = monthlyPremium * 0.85;
    var upperRange = monthlyPremium * 1.15;

    // ── Data for Charts ──
    var chartData = {
      'Base Rate': baseRate,
      'Age Adjustment': baseRate * (ageFactor - 1),
      'Deductible Adjustment': baseRate * (deductibleFactor - 1),
      'Reimbursement Adjustment': baseRate * (reimbursementFactor - 1),
      'Limit Adjustment': baseRate * (limitFactor - 1)
    };

    // ── Clean up chart data ──
    var cleanChartData = {};
    for (var key in chartData) {
      if (Math.abs(chartData[key]) > 0.01) {
        cleanChartData[key] = chartData[key];
      }
    }

    return {
      monthlyPremium: monthlyPremium,
      annualPremium: annualPremium,
      costRange: formatCurrencyFull(lowerRange) + ' – ' + formatCurrencyFull(upperRange),
      chartData: cleanChartData,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.baseRate <= 0 || inputs.petAge < 0) {
      setOutputText('output_monthlyPremium', '—');
      setOutputText('output_annualPremium', '—');
      setOutputText('output_deductibleAmount', '—');
      setOutputText('output_reimbursementRateDisplay', '—');
      setOutputText('output_annualLimitDisplay', '—');
      setOutputText('output_costRange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculatePetInsurance(inputs);

    if (result.error) {
      setOutputText('output_monthlyPremium', '—');
      setOutputText('output_annualPremium', '—');
      setOutputText('output_deductibleAmount', '—');
      setOutputText('output_reimbursementRateDisplay', '—');
      setOutputText('output_annualLimitDisplay', '—');
      setOutputText('output_costRange', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_monthlyPremium', formatCurrencyFull(result.monthlyPremium) + '/mo');
    setOutputText('output_annualPremium', formatCurrencyFull(result.annualPremium) + '/yr');
    setOutputText('output_deductibleAmount', formatCurrencyFull(inputs.deductible));
    setOutputText('output_reimbursementRateDisplay', inputs.reimbursementRate + '%');
    setOutputText('output_annualLimitDisplay', inputs.annualLimit === 0 ? 'Unlimited' : formatCurrencyFull(inputs.annualLimit));
    setOutputText('output_costRange', result.costRange);

    var chartPayload = {
      chartData: result.chartData,
      monthlyPremium: result.monthlyPremium
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        petType: inputs.petType,
        petAge: inputs.petAge,
        coverageType: inputs.coverageType,
        monthlyPremium: result.monthlyPremium,
        annualPremium: result.annualPremium
      });
    }
  }

  // ── Charts ──
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

  function generateChartData(tab, data) {
    if (!data || !data.chartData || Object.keys(data.chartData).length === 0) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.chartData);
      var values = Object.values(data.chartData);

      var colors = ['#4A90D9', '#D95B43', '#fbbf24', '#4ade80', '#4A90D9'];

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Premium Component',
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: colors.slice(0, labels.length).map(function(c) {
              return c === '#4A90D9' ? '#3a7b8c' : c === '#D95B43' ? '#B84A32' : c === '#fbbf24' ? '#d4a030' : '#3a9b6c';
            }),
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Premium Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 9 } }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_petType').value = 'Dog';
    document.getElementById('input_petAge').value = 3;
    document.getElementById('input_breed').value = 'Mixed';
    document.getElementById('input_location').value = 'Suburban';
    document.getElementById('input_coverageType').value = 'Comprehensive';
    document.getElementById('input_deductible').value = 500;
    document.getElementById('input_reimbursementRate').value = 80;
    document.getElementById('input_annualLimit').value = 10000;
    document.getElementById('input_baseRate').value = 40;
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
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
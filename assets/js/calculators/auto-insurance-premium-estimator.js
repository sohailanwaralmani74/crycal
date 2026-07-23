(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Factor Mappings ──
  var AGE_FACTORS = {
    '16-25': 1.80,
    '26-30': 1.20,
    '31-65': 1.00,
    '66+': 1.15
  };

  var HISTORY_FACTORS = {
    'clean': 1.00,
    'one-accident': 1.35,
    'multiple-accidents': 1.80,
    'one-violation': 1.20,
    'multiple-violations': 1.60,
    'sr22': 2.50
  };

  var LOCATION_FACTORS = {
    'rural': 0.85,
    'suburban': 1.00,
    'urban': 1.25,
    'high-risk': 1.60
  };

  var COVERAGE_FACTORS = {
    'liability-only': 0.60,
    'comprehensive': 0.85,
    'full': 1.00,
    'premium-full': 1.25
  };

  var DEDUCTIBLE_FACTORS = {
    '250': 1.15,
    '500': 1.00,
    '1000': 0.85,
    '2000': 0.70,
    '5000': 0.55
  };

  var MILEAGE_FACTORS = {
    'low': 0.90,
    'medium': 1.00,
    'high': 1.10
  };

  // ── Get Age Factor ──
  function getAgeFactor(age) {
    if (age >= 16 && age <= 25) return AGE_FACTORS['16-25'];
    if (age >= 26 && age <= 30) return AGE_FACTORS['26-30'];
    if (age >= 31 && age <= 65) return AGE_FACTORS['31-65'];
    if (age >= 66) return AGE_FACTORS['66+'];
    return 1.00;
  }

  // ── Get Mileage Factor ──
  function getMileageFactor(miles) {
    if (miles <= 10000) return MILEAGE_FACTORS['low'];
    if (miles <= 15000) return MILEAGE_FACTORS['medium'];
    return MILEAGE_FACTORS['high'];
  }

  // ── Get Inputs ──
  function getInputs() {
    var vehicleValue = parseFloat(document.getElementById('input_vehicleValue').value) || 0;
    var driverAge = parseFloat(document.getElementById('input_driverAge').value) || 0;
    var drivingHistory = document.getElementById('input_drivingHistory').value;
    var location = document.getElementById('input_location').value;
    var coverageType = document.getElementById('input_coverageType').value;
    var deductible = document.getElementById('input_deductible').value;
    var annualMileage = parseFloat(document.getElementById('input_annualMileage').value) || 0;

    return {
      vehicleValue: vehicleValue,
      driverAge: driverAge,
      drivingHistory: drivingHistory,
      location: location,
      coverageType: coverageType,
      deductible: deductible,
      annualMileage: annualMileage
    };
  }

  // ── Format Currency ──
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
  function calculateAutoInsurance(inputs) {
    var vehicleValue = inputs.vehicleValue;
    var age = inputs.driverAge;
    var history = inputs.drivingHistory;
    var location = inputs.location;
    var coverage = inputs.coverageType;
    var deductible = inputs.deductible;
    var mileage = inputs.annualMileage;

    if (vehicleValue <= 0 || age < 16) {
      return { error: 'Enter valid vehicle value and driver age' };
    }

    // ── Base Rate ──
    var baseRate = 600 + (vehicleValue * 0.02);

    // ── Apply Factors ──
    var ageFactor = getAgeFactor(age);
    var historyFactor = HISTORY_FACTORS[history] || 1.00;
    var locationFactor = LOCATION_FACTORS[location] || 1.00;
    var coverageFactor = COVERAGE_FACTORS[coverage] || 1.00;
    var deductibleFactor = DEDUCTIBLE_FACTORS[deductible] || 1.00;
    var mileageFactor = getMileageFactor(mileage);

    var basePremium = baseRate;
    var totalPremium = baseRate * ageFactor * historyFactor * locationFactor * coverageFactor * deductibleFactor * mileageFactor;

    // ── Monthly Premium ──
    var monthlyPremium = totalPremium / 12;

    // ── Coverage Breakdown ──
    var breakdown = {
      'Base Rate': baseRate,
      'Age Adjustment': baseRate * (ageFactor - 1),
      'History Adjustment': baseRate * (historyFactor - 1),
      'Location Adjustment': baseRate * (locationFactor - 1),
      'Coverage Adjustment': baseRate * (coverageFactor - 1),
      'Deductible Adjustment': baseRate * (deductibleFactor - 1),
      'Mileage Adjustment': baseRate * (mileageFactor - 1)
    };

    // ── Risk Assessment ──
    var riskScore = 0;
    riskScore += age < 25 ? 2 : 0;
    riskScore += history === 'clean' ? 0 : history === 'one-accident' ? 1 : 2;
    riskScore += location === 'urban' || location === 'high-risk' ? 1 : 0;
    riskScore += mileage > 15000 ? 1 : 0;

    var riskAssessment = '';
    if (riskScore <= 1) {
      riskAssessment = '✅ Low Risk — You are a low-risk driver with favorable factors.';
    } else if (riskScore <= 3) {
      riskAssessment = '🟡 Moderate Risk — Some factors may be increasing your premium.';
    } else if (riskScore <= 5) {
      riskAssessment = '🟠 High Risk — Several risk factors are affecting your rate.';
    } else {
      riskAssessment = '🔴 Very High Risk — Multiple risk factors are significantly affecting your premium.';
    }

    // ── Recommendation ──
    var recommendation = '';
    if (totalPremium > 3000) {
      recommendation = 'Consider raising your deductible or reviewing your coverage options to lower your premium.';
    } else if (totalPremium > 2000) {
      recommendation = 'Your premium is moderate. Consider increasing your deductible or shopping for discounts.';
    } else if (totalPremium > 1000) {
      recommendation = 'Your premium is reasonable. Continue maintaining a clean driving record.';
    } else {
      recommendation = 'Your premium is excellent. Consider adding comprehensive coverage if not already included.';
    }

    // ── Data for Charts ──
    var chartData = {
      'Base Rate': breakdown['Base Rate'],
      'Age Adjustment': breakdown['Age Adjustment'],
      'History Adjustment': breakdown['History Adjustment'],
      'Location Adjustment': breakdown['Location Adjustment'],
      'Coverage Adjustment': breakdown['Coverage Adjustment'],
      'Deductible Adjustment': breakdown['Deductible Adjustment'],
      'Mileage Adjustment': breakdown['Mileage Adjustment']
    };

    // ── Clean up chart data (remove zero values) ──
    var cleanChartData = {};
    for (var key in chartData) {
      if (Math.abs(chartData[key]) > 0.01) {
        cleanChartData[key] = chartData[key];
      }
    }

    return {
      basePremium: basePremium,
      totalPremium: totalPremium,
      monthlyPremium: monthlyPremium,
      riskAssessment: riskAssessment,
      recommendation: recommendation,
      chartData: cleanChartData,
      breakdown: breakdown,
      riskScore: riskScore,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.vehicleValue <= 0 || inputs.driverAge < 16) {
      setOutputText('output_basePremium', '—');
      setOutputText('output_totalPremium', '—');
      setOutputText('output_monthlyPremium', '—');
      setOutputText('output_coverageBreakdown', '—');
      setOutputText('output_riskAssessment', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateAutoInsurance(inputs);

    if (result.error) {
      setOutputText('output_basePremium', '—');
      setOutputText('output_totalPremium', '—');
      setOutputText('output_monthlyPremium', '—');
      setOutputText('output_coverageBreakdown', '—');
      setOutputText('output_riskAssessment', '—');
      setOutputText('output_recommendation', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_basePremium', formatCurrency(result.basePremium));
    setOutputText('output_totalPremium', formatCurrency(result.totalPremium));
    setOutputText('output_monthlyPremium', formatCurrencyFull(result.monthlyPremium));
    setOutputText('output_coverageBreakdown', 'Base: ' + formatCurrency(result.basePremium) + ' | Total Adjustments: ' + formatCurrency(result.totalPremium - result.basePremium));
    setOutputText('output_riskAssessment', result.riskAssessment);
    setOutputText('output_recommendation', result.recommendation);

    var chartPayload = {
      chartData: result.chartData,
      totalPremium: result.totalPremium,
      basePremium: result.basePremium
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehicleValue: inputs.vehicleValue,
        driverAge: inputs.driverAge,
        drivingHistory: inputs.drivingHistory,
        totalPremium: result.totalPremium,
        monthlyPremium: result.monthlyPremium
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

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Premium Component',
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43', '#fbbf24', '#4ade80', '#4A90D9', '#D95B43', '#fbbf24'],
            borderColor: ['#3a7b8c', '#B84A32', '#d4a030', '#3a9b6c', '#3a7b8c', '#B84A32', '#d4a030'],
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
    document.getElementById('input_vehicleValue').value = 30000;
    document.getElementById('input_driverAge').value = 35;
    document.getElementById('input_drivingHistory').value = 'clean';
    document.getElementById('input_location').value = 'suburban';
    document.getElementById('input_coverageType').value = 'full';
    document.getElementById('input_deductible').value = '500';
    document.getElementById('input_annualMileage').value = 12000;
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
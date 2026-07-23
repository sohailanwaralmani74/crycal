(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var age = parseFloat(document.getElementById('input_age').value) || 0;
    var gender = document.getElementById('input_gender').value;
    var healthStatus = document.getElementById('input_healthStatus').value;
    var coverageAmount = parseFloat(document.getElementById('input_coverageAmount').value) || 0;
    var benefitPeriod = parseFloat(document.getElementById('input_benefitPeriod').value) || 0;
    var eliminationPeriod = parseFloat(document.getElementById('input_eliminationPeriod').value) || 0;
    var inflationProtection = document.getElementById('input_inflationProtection').value;
    var maritalStatus = document.getElementById('input_maritalStatus').value;
    var baseRate = parseFloat(document.getElementById('input_baseRate').value) || 0;
    var healthFactor = parseFloat(document.getElementById('input_healthFactor').value) || 1.00;
    var genderFactor = parseFloat(document.getElementById('input_genderFactor').value) || 1.00;

    return {
      age: age,
      gender: gender,
      healthStatus: healthStatus,
      coverageAmount: coverageAmount,
      benefitPeriod: benefitPeriod,
      eliminationPeriod: eliminationPeriod,
      inflationProtection: inflationProtection,
      maritalStatus: maritalStatus,
      baseRate: baseRate,
      healthFactor: healthFactor,
      genderFactor: genderFactor
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
  function calculateLTCInsurance(inputs) {
    var baseRate = inputs.baseRate;
    var healthFactor = inputs.healthFactor;
    var genderFactor = inputs.genderFactor;
    var benefitPeriod = inputs.benefitPeriod;
    var eliminationPeriod = inputs.eliminationPeriod;
    var inflationProtection = inputs.inflationProtection;
    var maritalStatus = inputs.maritalStatus;
    var coverage = inputs.coverageAmount;
    var age = inputs.age;

    if (baseRate <= 0 || age < 20 || age > 90 || coverage <= 0 || benefitPeriod <= 0) {
      return { error: 'Enter valid values' };
    }

    // ── Factors ──
    var periodFactor = 1.00;
    if (benefitPeriod <= 2) periodFactor = 0.65;
    else if (benefitPeriod <= 3) periodFactor = 0.80;
    else if (benefitPeriod <= 5) periodFactor = 1.00;
    else if (benefitPeriod <= 10) periodFactor = 1.30;
    else periodFactor = 1.60;

    var eliminationFactor = 1.00;
    if (eliminationPeriod <= 30) eliminationFactor = 1.20;
    else if (eliminationPeriod <= 60) eliminationFactor = 1.10;
    else if (eliminationPeriod <= 90) eliminationFactor = 1.00;
    else if (eliminationPeriod <= 180) eliminationFactor = 0.85;
    else eliminationFactor = 0.75;

    var inflationFactor = inflationProtection === 'yes' ? 1.45 : 1.00;

    var maritalFactor = 1.00;
    if (maritalStatus === 'married') maritalFactor = 0.90;
    else if (maritalStatus === 'domestic-partner') maritalFactor = 0.95;
    else maritalFactor = 1.00;

    var coverageFactor = coverage / 50000;

    // ── Annual Premium ──
    var annualPremium = baseRate * healthFactor * genderFactor * periodFactor * eliminationFactor * inflationFactor * maritalFactor * coverageFactor;

    // ── Monthly Premium ──
    var monthlyPremium = annualPremium / 12;

    // ── Daily Benefit ──
    var dailyBenefit = coverage / 365;

    // ── Total Lifetime Benefit ──
    var totalLifetimeBenefit = coverage * benefitPeriod;

    // ── Premium Breakdown ──
    var breakdown = {
      'Base Rate': baseRate * coverageFactor,
      'Health Adjustment': baseRate * coverageFactor * (healthFactor - 1),
      'Gender Adjustment': baseRate * coverageFactor * (genderFactor - 1),
      'Benefit Period Adjustment': baseRate * coverageFactor * (periodFactor - 1),
      'Elimination Period Adjustment': baseRate * coverageFactor * (eliminationFactor - 1),
      'Inflation Protection': baseRate * coverageFactor * (inflationFactor - 1),
      'Marital Status Adjustment': baseRate * coverageFactor * (maritalFactor - 1)
    };

    return {
      monthlyPremium: monthlyPremium,
      annualPremium: annualPremium,
      dailyBenefit: dailyBenefit,
      totalLifetimeBenefit: totalLifetimeBenefit,
      breakdown: breakdown,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.baseRate <= 0 || inputs.age < 20 || inputs.age > 90 || inputs.coverageAmount <= 0 || inputs.benefitPeriod <= 0) {
      setOutputText('output_monthlyPremium', '—');
      setOutputText('output_annualPremium', '—');
      setOutputText('output_dailyBenefit', '—');
      setOutputText('output_totalLifetimeBenefit', '—');
      setOutputText('output_premiumBreakdown', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateLTCInsurance(inputs);

    if (result.error) {
      setOutputText('output_monthlyPremium', '—');
      setOutputText('output_annualPremium', '—');
      setOutputText('output_dailyBenefit', '—');
      setOutputText('output_totalLifetimeBenefit', '—');
      setOutputText('output_premiumBreakdown', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_monthlyPremium', formatCurrencyFull(result.monthlyPremium) + '/mo');
    setOutputText('output_annualPremium', formatCurrencyFull(result.annualPremium) + '/yr');
    setOutputText('output_dailyBenefit', formatCurrencyFull(result.dailyBenefit) + '/day');
    setOutputText('output_totalLifetimeBenefit', formatCurrency(result.totalLifetimeBenefit));

    // ── Premium Breakdown (only show non‑zero components) ──
    var b = result.breakdown;
    var breakdownParts = [];
    breakdownParts.push('Base: ' + formatCurrency(b['Base Rate']));
    if (Math.abs(b['Health Adjustment']) > 0.01) {
      breakdownParts.push('Health: ' + formatCurrency(b['Health Adjustment']));
    }
    if (Math.abs(b['Gender Adjustment']) > 0.01) {
      breakdownParts.push('Gender: ' + formatCurrency(b['Gender Adjustment']));
    }
    if (Math.abs(b['Benefit Period Adjustment']) > 0.01) {
      breakdownParts.push('Period: ' + formatCurrency(b['Benefit Period Adjustment']));
    }
    if (Math.abs(b['Elimination Period Adjustment']) > 0.01) {
      breakdownParts.push('Elimination: ' + formatCurrency(b['Elimination Period Adjustment']));
    }
    if (Math.abs(b['Inflation Protection']) > 0.01) {
      breakdownParts.push('Inflation: ' + formatCurrency(b['Inflation Protection']));
    }
    if (Math.abs(b['Marital Status Adjustment']) > 0.01) {
      breakdownParts.push('Marital: ' + formatCurrency(b['Marital Status Adjustment']));
    }
    setOutputText('output_premiumBreakdown', breakdownParts.join(' | '));

    var chartPayload = {
      breakdown: result.breakdown,
      monthlyPremium: result.monthlyPremium,
      annualPremium: result.annualPremium
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        age: inputs.age,
        gender: inputs.gender,
        healthStatus: inputs.healthStatus,
        coverageAmount: inputs.coverageAmount,
        benefitPeriod: inputs.benefitPeriod,
        eliminationPeriod: inputs.eliminationPeriod,
        inflationProtection: inputs.inflationProtection,
        maritalStatus: inputs.maritalStatus,
        baseRate: inputs.baseRate,
        healthFactor: inputs.healthFactor,
        genderFactor: inputs.genderFactor,
        monthlyPremium: result.monthlyPremium,
        annualPremium: result.annualPremium,
        dailyBenefit: result.dailyBenefit,
        totalLifetimeBenefit: result.totalLifetimeBenefit
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
    if (!data || !data.breakdown) return null;

    if (tab === 'breakdown') {
      var b = data.breakdown;
      var labels = ['Base Rate', 'Health', 'Gender', 'Benefit Period', 'Elimination Period', 'Inflation Protection', 'Marital Status'];
      var values = [
        b['Base Rate'],
        b['Health Adjustment'],
        b['Gender Adjustment'],
        b['Benefit Period Adjustment'],
        b['Elimination Period Adjustment'],
        b['Inflation Protection'],
        b['Marital Status Adjustment']
      ];

      var colors = ['#4A90D9', '#D95B43', '#fbbf24', '#4ade80', '#4A90D9', '#D95B43', '#fbbf24'];

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Premium Component',
            data: values,
            backgroundColor: colors,
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
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxRotation: 20
              }
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
    document.getElementById('input_age').value = 55;
    document.getElementById('input_gender').value = 'male';
    document.getElementById('input_healthStatus').value = 'good';
    document.getElementById('input_coverageAmount').value = 50000;
    document.getElementById('input_benefitPeriod').value = 5;
    document.getElementById('input_eliminationPeriod').value = 90;
    document.getElementById('input_inflationProtection').value = 'no';
    document.getElementById('input_maritalStatus').value = 'single';
    document.getElementById('input_baseRate').value = 0;
    document.getElementById('input_healthFactor').value = 1.00;
    document.getElementById('input_genderFactor').value = 1.00;
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
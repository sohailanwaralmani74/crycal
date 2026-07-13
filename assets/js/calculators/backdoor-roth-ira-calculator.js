(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Roth IRA Income Limits (2024) ──
  var ROTH_LIMITS = {
    'single': { phaseOutStart: 146000, phaseOutEnd: 161000 },
    'married-joint': { phaseOutStart: 230000, phaseOutEnd: 240000 },
    'married-separate': { phaseOutStart: 0, phaseOutEnd: 10000 }
  };

  // ── Get Inputs ──
  function getInputs() {
    var annualIncome = parseFloat(document.getElementById('input_annualIncome').value) || 0;
    var filingStatus = document.getElementById('input_filingStatus').value;
    var contributionAmount = parseFloat(document.getElementById('input_contributionAmount').value) || 0;
    var existingIRA = parseFloat(document.getElementById('input_existingIRA').value) || 0;
    var taxRate = parseFloat(document.getElementById('input_taxRate').value) || 0;
    var growthRate = parseFloat(document.getElementById('input_growthRate').value) || 0;
    var investmentHorizon = parseFloat(document.getElementById('input_investmentHorizon').value) || 0;

    return {
      annualIncome: annualIncome,
      filingStatus: filingStatus,
      contributionAmount: contributionAmount,
      existingIRA: existingIRA,
      taxRate: taxRate / 100,
      growthRate: growthRate / 100,
      investmentHorizon: investmentHorizon
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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Core Calculation ──
  function calculateBackdoorRoth(inputs) {
    var income = inputs.annualIncome;
    var filingStatus = inputs.filingStatus;
    var contribution = inputs.contributionAmount;
    var existingIRA = inputs.existingIRA;
    var taxRate = inputs.taxRate;
    var growthRate = inputs.growthRate;
    var horizon = inputs.investmentHorizon;

    if (income <= 0 || contribution <= 0) {
      return { error: 'Enter valid income and contribution amount' };
    }

    // Check direct Roth IRA eligibility
    var limits = ROTH_LIMITS[filingStatus] || ROTH_LIMITS['single'];
    var directEligible = true;
    var eligibilityMessage = '';

    if (income > limits.phaseOutEnd) {
      directEligible = false;
      eligibilityMessage = 'Not eligible for direct Roth IRA. Backdoor Roth IRA recommended.';
    } else if (income > limits.phaseOutStart) {
      directEligible = false;
      var phaseOutRange = limits.phaseOutEnd - limits.phaseOutStart;
      var phaseOutPercent = (income - limits.phaseOutStart) / phaseOutRange;
      var reducedContribution = contribution * (1 - phaseOutPercent);
      eligibilityMessage = 'Partial direct Roth IRA eligibility. Reduced contribution: ' + formatCurrency(reducedContribution) + '. Backdoor Roth IRA may be better.';
    } else {
      eligibilityMessage = 'You are eligible for a direct Roth IRA contribution of up to $' + Math.min(contribution, 7000).toLocaleString() + '. Backdoor Roth IRA is not necessary.';
    }

    // Pro-rata calculation
    var totalIRA = existingIRA + contribution;
    var taxablePercentage = totalIRA > 0 ? existingIRA / totalIRA : 0;
    var taxableAmount = contribution * taxablePercentage;
    var nonTaxableAmount = contribution - taxableAmount;

    // Tax due
    var taxDue = taxableAmount * taxRate;

    // Future value calculations
    var rothValue = (contribution - taxDue) * Math.pow(1 + growthRate, horizon);
    var traditionalValue = contribution * Math.pow(1 + growthRate, horizon) * (1 - taxRate);

    // Tax-free growth savings
    var taxFreeSavings = rothValue - traditionalValue;

    // Recommendation
    var recommendation = '';
    if (directEligible && income < limits.phaseOutStart) {
      recommendation = 'You are eligible for a direct Roth IRA. A Backdoor Roth IRA is not needed.';
    } else if (existingIRA === 0) {
      recommendation = 'No existing Traditional IRA balance means no pro-rata tax. Backdoor Roth IRA is a clean conversion.';
    } else if (taxableAmount > contribution * 0.5) {
      recommendation = 'High existing IRA balance makes this conversion partially taxable (' + (taxablePercentage * 100).toFixed(1) + '% taxable). Consider rolling existing IRA into a 401(k) before conversion.';
    } else {
      recommendation = 'Backdoor Roth IRA conversion is recommended. Taxable portion: ' + formatCurrency(taxableAmount) + '.';
    }

    // Generate growth data
    var dataPoints = [];
    var maxYears = Math.min(horizon, 50);
    for (var i = 0; i <= maxYears; i++) {
      var rothGrowth = (contribution - taxDue) * Math.pow(1 + growthRate, i);
      var tradGrowth = contribution * Math.pow(1 + growthRate, i) * (1 - taxRate);

      dataPoints.push({
        year: i,
        rothGrowth: rothGrowth,
        tradGrowth: tradGrowth
      });
    }

    return {
      directEligible: directEligible,
      eligibilityMessage: eligibilityMessage,
      taxableAmount: taxableAmount,
      nonTaxableAmount: nonTaxableAmount,
      taxablePercentage: taxablePercentage,
      taxDue: taxDue,
      rothValue: rothValue,
      traditionalValue: traditionalValue,
      taxFreeSavings: taxFreeSavings,
      recommendation: recommendation,
      dataPoints: dataPoints,
      contribution: contribution,
      taxRate: taxRate,
      growthRate: growthRate,
      horizon: horizon
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.annualIncome <= 0 || inputs.contributionAmount <= 0) {
      setOutputText('output_eligibility', '—');
      setOutputText('output_taxableAmount', '—');
      setOutputText('output_taxDue', '—');
      setOutputText('output_rothValue', '—');
      setOutputText('output_traditionalValue', '—');
      setOutputText('output_savingsDifference', '—');
      setOutputText('output_recommendation', 'Enter your income and contribution amount');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateBackdoorRoth(inputs);

    if (result.error) {
      setOutputText('output_eligibility', '—');
      setOutputText('output_taxableAmount', '—');
      setOutputText('output_taxDue', '—');
      setOutputText('output_rothValue', '—');
      setOutputText('output_traditionalValue', '—');
      setOutputText('output_savingsDifference', '—');
      setOutputText('output_recommendation', result.error);
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_eligibility', result.eligibilityMessage);
    setOutputText('output_taxableAmount', formatCurrency(result.taxableAmount) + ' (' + (result.taxablePercentage * 100).toFixed(1) + '% of contribution)');
    setOutputText('output_taxDue', formatCurrency(result.taxDue));
    setOutputText('output_rothValue', formatCurrency(result.rothValue));
    setOutputText('output_traditionalValue', formatCurrency(result.traditionalValue));
    setOutputText('output_savingsDifference', formatCurrency(result.taxFreeSavings) + ' (Roth saves ' + ((result.taxFreeSavings / result.traditionalValue) * 100).toFixed(1) + '% more)');
    setOutputText('output_recommendation', result.recommendation);

    var chartPayload = {
      dataPoints: result.dataPoints,
      rothValue: result.rothValue,
      traditionalValue: result.traditionalValue,
      taxDue: result.taxDue,
      taxableAmount: result.taxableAmount,
      contribution: result.contribution,
      horizon: result.horizon
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualIncome: inputs.annualIncome,
        filingStatus: inputs.filingStatus,
        contributionAmount: inputs.contributionAmount,
        existingIRA: inputs.existingIRA,
        taxableAmount: result.taxableAmount,
        rothValue: result.rothValue
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
    if (!data || !data.dataPoints || data.dataPoints.length === 0) return null;

    if (tab === 'growth') {
      var labels = data.dataPoints.map(function(d) { return 'Year ' + d.year; });
      var rothData = data.dataPoints.map(function(d) { return d.rothGrowth; });
      var tradData = data.dataPoints.map(function(d) { return d.tradGrowth; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Roth IRA (Tax-Free)',
            data: rothData,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }, {
            label: 'Traditional IRA (Taxable)',
            data: tradData,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Roth vs Traditional IRA Growth Over Time',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxTicksLimit: 20
              }
            },
            y: {
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
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      };
    }

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Taxable Amount', 'Non-Taxable Amount'],
          datasets: [{
            data: [data.taxableAmount, data.contribution - data.taxableAmount],
            backgroundColor: ['#D95B43', '#4ade80'],
            borderColor: ['#B84A32', '#3a9b6c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Roth Conversion Tax Breakdown',
              font: { size: 14, color: '#e8edf0' }
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
    document.getElementById('input_annualIncome').value = 150000;
    document.getElementById('input_filingStatus').value = 'single';
    document.getElementById('input_contributionAmount').value = 7000;
    document.getElementById('input_existingIRA').value = 0;
    document.getElementById('input_taxRate').value = 24;
    document.getElementById('input_growthRate').value = 7.0;
    document.getElementById('input_investmentHorizon').value = 30;
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
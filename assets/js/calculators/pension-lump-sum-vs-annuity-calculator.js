(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var lumpSum = parseFloat(document.getElementById('input_lumpSum').value) || 0;
    var monthlyAnnuity = parseFloat(document.getElementById('input_monthlyAnnuity').value) || 0;
    var investmentReturn = parseFloat(document.getElementById('input_investmentReturn').value) || 0;
    var lifeExpectancy = parseFloat(document.getElementById('input_lifeExpectancy').value) || 85;
    var currentAge = parseFloat(document.getElementById('input_currentAge').value) || 65;
    var inflationRate = parseFloat(document.getElementById('input_inflationRate').value) || 0;

    // Cap values
    if (lifeExpectancy > 110) lifeExpectancy = 110;
    if (lifeExpectancy < currentAge) lifeExpectancy = currentAge;
    if (currentAge < 40) currentAge = 40;
    if (currentAge > 80) currentAge = 80;

    return {
      lumpSum: lumpSum,
      monthlyAnnuity: monthlyAnnuity,
      investmentReturn: investmentReturn / 100,
      lifeExpectancy: lifeExpectancy,
      currentAge: currentAge,
      inflationRate: inflationRate / 100
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
  function calculatePension(inputs) {
    var lumpSum = inputs.lumpSum;
    var monthlyAnnuity = inputs.monthlyAnnuity;
    var returnRate = inputs.investmentReturn;
    var lifeExpectancy = inputs.lifeExpectancy;
    var currentAge = inputs.currentAge;
    var inflationRate = inputs.inflationRate;

    if (lumpSum <= 0 || monthlyAnnuity <= 0) {
      return { error: 'Enter valid values' };
    }

    var years = lifeExpectancy - currentAge;
    var months = years * 12;

    // Total annuity payout (lifetime)
    var annualAnnuity = monthlyAnnuity * 12;
    var totalAnnuity = annualAnnuity * years;

    // Inflation-adjusted annuity value
    var realAnnuityValue = 0;
    for (var y = 0; y < years; y++) {
      var realPayment = annualAnnuity / Math.pow(1 + inflationRate, y);
      realAnnuityValue += realPayment;
    }

    // Lump sum if invested (future value)
    var lumpSumValue = lumpSum * Math.pow(1 + returnRate, years);

    // Break-even age
    var breakEvenAge = findBreakEven(lumpSum, monthlyAnnuity, returnRate, currentAge);

    // Difference
    var difference = lumpSumValue - totalAnnuity;

    // Recommendation
    var recommendation = '';
    if (lumpSumValue > totalAnnuity) {
      recommendation = 'Lump sum may be better — it could grow more than the annuity.';
    } else if (totalAnnuity > lumpSumValue) {
      recommendation = 'Annuity may be better — it provides more total value.';
    } else {
      recommendation = 'Both options are roughly equal.';
    }

    // Generate data points for chart
    var dataPoints = [];
    var maxYears = Math.max(years, 20);
    for (var i = 0; i <= maxYears; i++) {
      var age = currentAge + i;
      var cumAnnuity = i * annualAnnuity;
      var cumLumpSum = lumpSum * Math.pow(1 + returnRate, i);

      dataPoints.push({
        age: age,
        year: i,
        cumAnnuity: cumAnnuity,
        cumLumpSum: cumLumpSum
      });
    }

    return {
      totalAnnuity: totalAnnuity,
      realAnnuityValue: realAnnuityValue,
      lumpSumValue: lumpSumValue,
      breakEvenAge: breakEvenAge,
      difference: difference,
      recommendation: recommendation,
      dataPoints: dataPoints,
      lumpSum: lumpSum,
      monthlyAnnuity: monthlyAnnuity,
      returnRate: returnRate,
      years: years,
      currentAge: currentAge
    };
  }

  // ── Find Break-Even Age ──
  function findBreakEven(lumpSum, monthlyAnnuity, returnRate, currentAge) {
    var annualAnnuity = monthlyAnnuity * 12;

    for (var year = 1; year <= 60; year++) {
      var age = currentAge + year;
      var cumAnnuity = year * annualAnnuity;
      var cumLumpSum = lumpSum * Math.pow(1 + returnRate, year);

      if (cumLumpSum <= cumAnnuity && cumLumpSum > 0) {
        return Math.round(age);
      }
    }

    return null;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.lumpSum <= 0 || inputs.monthlyAnnuity <= 0) {
      setOutputText('output_annuityTotal', '—');
      setOutputText('output_lumpSumGrowth', '—');
      setOutputText('output_lumpSumValue', '—');
      setOutputText('output_breakEvenAge', '—');
      setOutputText('output_difference', '—');
      setOutputText('output_recommendation', 'Enter valid values');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculatePension(inputs);

    if (result.error) {
      setOutputText('output_annuityTotal', '—');
      setOutputText('output_lumpSumGrowth', '—');
      setOutputText('output_lumpSumValue', '—');
      setOutputText('output_breakEvenAge', '—');
      setOutputText('output_difference', '—');
      setOutputText('output_recommendation', result.error);
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_annuityTotal', formatCurrency(result.totalAnnuity));
    setOutputText('output_lumpSumGrowth', (result.returnRate * 100).toFixed(1) + '% annual return');
    setOutputText('output_lumpSumValue', formatCurrency(result.lumpSumValue));
    setOutputText('output_breakEvenAge', result.breakEvenAge ? 'Age ' + result.breakEvenAge : 'Never');
    setOutputText('output_difference', formatCurrency(Math.abs(result.difference)) + ' (' + (result.difference > 0 ? 'Lump Sum better' : 'Annuity better') + ')');
    setOutputText('output_recommendation', result.recommendation);

    var chartPayload = {
      dataPoints: result.dataPoints,
      totalAnnuity: result.totalAnnuity,
      lumpSumValue: result.lumpSumValue,
      breakEvenAge: result.breakEvenAge,
      lumpSum: result.lumpSum,
      monthlyAnnuity: result.monthlyAnnuity,
      years: result.years,
      currentAge: result.currentAge
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        lumpSum: inputs.lumpSum,
        monthlyAnnuity: inputs.monthlyAnnuity,
        investmentReturn: inputs.investmentReturn * 100,
        lumpSumValue: result.lumpSumValue,
        annuityTotal: result.totalAnnuity
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
      var labels = data.dataPoints.map(function(d) { return 'Age ' + d.age; });
      var annuityData = data.dataPoints.map(function(d) { return d.cumAnnuity; });
      var lumpSumData = data.dataPoints.map(function(d) { return d.cumLumpSum; });

      var datasets = [{
        label: 'Annuity Payout (Cumulative)',
        data: annuityData,
        borderColor: '#4A90D9',
        backgroundColor: 'rgba(74, 144, 217, 0.05)',
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2
      }, {
        label: 'Lump Sum (Invested)',
        data: lumpSumData,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.05)',
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2
      }];

      // Add break-even marker if available
      if (data.breakEvenAge) {
        // Find the data point closest to break-even age
        var breakEvenPoint = null;
        for (var i = 0; i < data.dataPoints.length; i++) {
          if (data.dataPoints[i].age >= data.breakEvenAge) {
            breakEvenPoint = data.dataPoints[i];
            break;
          }
        }

        if (breakEvenPoint) {
          // We can't easily add a marker in Chart.js v3 without a plugin
          // But we'll leave it as is
        }
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
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
              text: 'Annuity vs Lump Sum Growth Over Time',
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
          labels: ['Annuity Payout', 'Lump Sum Value'],
          datasets: [{
            data: [data.totalAnnuity, data.lumpSumValue],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderColor: ['#3a7b8c', '#3a9b6c'],
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
              text: 'Lump Sum vs Annuity Comparison',
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
    document.getElementById('input_lumpSum').value = 250000;
    document.getElementById('input_monthlyAnnuity').value = 1200;
    document.getElementById('input_investmentReturn').value = 6.0;
    document.getElementById('input_lifeExpectancy').value = 85;
    document.getElementById('input_currentAge').value = 65;
    document.getElementById('input_inflationRate').value = 2.5;
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
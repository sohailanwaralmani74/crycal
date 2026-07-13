(function() {

  var chartInstance = null;
  var currentTab = 'cumulative';
  var lastChartData = null;

  // ── FRA Adjustments ──
  var FRA_AGE_MAP = {
    '66': 66.0,
    '66-2': 66.1667,
    '66-4': 66.3333,
    '66-6': 66.5,
    '66-8': 66.6667,
    '66-10': 66.8333,
    '67': 67.0
  };

  // ── Get Inputs ──
  function getInputs() {
    var fraBenefit = parseFloat(document.getElementById('input_fraBenefit').value) || 0;
    var fraAge = document.getElementById('input_fraAge').value;
    var lifeExpectancy = parseFloat(document.getElementById('input_lifeExpectancy').value) || 85;

    // Cap life expectancy at 110
    if (lifeExpectancy > 110) lifeExpectancy = 110;
    if (lifeExpectancy < 60) lifeExpectancy = 60;

    return {
      fraBenefit: fraBenefit,
      fraAge: fraAge,
      lifeExpectancy: lifeExpectancy
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

  // ── Calculate Benefits ──
  function calculateBenefits(inputs) {
    var fraBenefit = inputs.fraBenefit;
    var fraAgeValue = FRA_AGE_MAP[inputs.fraAge] || 67;
    var lifeExpectancy = inputs.lifeExpectancy;

    if (fraBenefit <= 0 || !fraAgeValue) {
      return { error: 'Enter a valid FRA benefit' };
    }

    // Age 62 benefit: 30% reduction from FRA
    var monthsBeforeFRA = (fraAgeValue - 62) * 12;
    var reduction = 0;
    if (monthsBeforeFRA > 36) {
      reduction = 36 * (5/9) + (monthsBeforeFRA - 36) * (5/12);
    } else {
      reduction = monthsBeforeFRA * (5/9);
    }
    var reductionPercent = reduction / 100;
    var benefit62 = fraBenefit * (1 - reductionPercent);

    // Age 67 benefit = FRA benefit (if FRA is 67)
    var benefit67 = fraBenefit;

    // Age 70 benefit: 8% per year increase (2/3 of 1% per month)
    var monthsAfterFRA = (70 - fraAgeValue) * 12;
    var increase = monthsAfterFRA * (2/3);
    var increasePercent = increase / 100;
    var benefit70 = fraBenefit * (1 + increasePercent);

    // Total benefits by life expectancy
    var years = lifeExpectancy - 62;
    var months = years * 12;
    var total62 = benefit62 * months;

    years = lifeExpectancy - 67;
    months = years * 12;
    var total67 = benefit67 * months;

    years = lifeExpectancy - 70;
    months = years * 12;
    var total70 = benefit70 * months;

    // Break-even calculations
    var breakEven62vs67 = findBreakEven(benefit62, benefit67, 62, 67);
    var breakEven62vs70 = findBreakEven(benefit62, benefit70, 62, 70);
    var breakEven67vs70 = findBreakEven(benefit67, benefit70, 67, 70);

    // Generate cumulative data
    var cumulativeData = [];
    var maxAge = Math.max(breakEven62vs70 || 85, lifeExpectancy || 85, 85);
    for (var age = 62; age <= maxAge + 5; age += 0.5) {
      var cum62 = benefit62 * (age - 62) * 12;
      var cum67 = age >= 67 ? benefit67 * (age - 67) * 12 : 0;
      var cum70 = age >= 70 ? benefit70 * (age - 70) * 12 : 0;

      cumulativeData.push({
        age: age,
        cum62: cum62,
        cum67: cum67,
        cum70: cum70
      });
    }

    return {
      benefit62: benefit62,
      benefit67: benefit67,
      benefit70: benefit70,
      total62: total62,
      total67: total67,
      total70: total70,
      breakEven62vs67: breakEven62vs67,
      breakEven62vs70: breakEven62vs70,
      breakEven67vs70: breakEven67vs70,
      cumulativeData: cumulativeData,
      fraBenefit: fraBenefit,
      lifeExpectancy: lifeExpectancy
    };
  }

  // ── Find Break-Even Age ──
  function findBreakEven(benefitEarly, benefitLate, startAge, lateAge) {
    if (benefitEarly >= benefitLate) return null;

    for (var age = startAge; age <= 110; age += 0.5) {
      var cumEarly = benefitEarly * (age - startAge) * 12;
      var cumLate = benefitLate * (age - lateAge) * 12;

      if (age >= lateAge && cumLate >= cumEarly && cumEarly > 0) {
        return Math.round(age);
      }
    }

    return null;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.fraBenefit <= 0) {
      setOutputText('output_benefit62', '—');
      setOutputText('output_benefit67', '—');
      setOutputText('output_benefit70', '—');
      setOutputText('output_breakEven62vs67', '—');
      setOutputText('output_breakEven62vs70', '—');
      setOutputText('output_breakEven67vs70', '—');
      setOutputText('output_total62', '—');
      setOutputText('output_total67', '—');
      setOutputText('output_total70', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateBenefits(inputs);

    if (result.error) {
      setOutputText('output_benefit62', '—');
      setOutputText('output_benefit67', '—');
      setOutputText('output_benefit70', '—');
      setOutputText('output_breakEven62vs67', '—');
      setOutputText('output_breakEven62vs70', '—');
      setOutputText('output_breakEven67vs70', '—');
      setOutputText('output_total62', '—');
      setOutputText('output_total67', '—');
      setOutputText('output_total70', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_benefit62', formatCurrency(result.benefit62) + '/mo');
    setOutputText('output_benefit67', formatCurrency(result.benefit67) + '/mo');
    setOutputText('output_benefit70', formatCurrency(result.benefit70) + '/mo');
    setOutputText('output_breakEven62vs67', result.breakEven62vs67 ? 'Age ' + result.breakEven62vs67 : 'Never');
    setOutputText('output_breakEven62vs70', result.breakEven62vs70 ? 'Age ' + result.breakEven62vs70 : 'Never');
    setOutputText('output_breakEven67vs70', result.breakEven67vs70 ? 'Age ' + result.breakEven67vs70 : 'Never');
    setOutputText('output_total62', formatCurrency(result.total62));
    setOutputText('output_total67', formatCurrency(result.total67));
    setOutputText('output_total70', formatCurrency(result.total70));

    var chartPayload = {
      cumulativeData: result.cumulativeData,
      benefit62: result.benefit62,
      benefit67: result.benefit67,
      benefit70: result.benefit70,
      breakEven62vs67: result.breakEven62vs67,
      breakEven62vs70: result.breakEven62vs70,
      breakEven67vs70: result.breakEven67vs70,
      lifeExpectancy: result.lifeExpectancy
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        fraBenefit: inputs.fraBenefit,
        fraAge: inputs.fraAge,
        benefit62: result.benefit62,
        benefit67: result.benefit67,
        benefit70: result.benefit70,
        breakEven62vs70: result.breakEven62vs70
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
    if (!data || !data.cumulativeData || data.cumulativeData.length === 0) return null;

    if (tab === 'cumulative') {
      var labels = data.cumulativeData.filter(function(d) {
        return d.age % 2 === 0 || d.age === 62 || d.age === 67 || d.age === 70;
      }).map(function(d) { return 'Age ' + d.age; });

      var cum62 = data.cumulativeData.filter(function(d) {
        return d.age % 2 === 0 || d.age === 62 || d.age === 67 || d.age === 70;
      }).map(function(d) { return d.cum62; });

      var cum67 = data.cumulativeData.filter(function(d) {
        return d.age % 2 === 0 || d.age === 62 || d.age === 67 || d.age === 70;
      }).map(function(d) { return d.cum67; });

      var cum70 = data.cumulativeData.filter(function(d) {
        return d.age % 2 === 0 || d.age === 62 || d.age === 67 || d.age === 70;
      }).map(function(d) { return d.cum70; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Claim at 62',
            data: cum62,
            borderColor: '#D95B43',
            backgroundColor: 'rgba(217, 91, 67, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }, {
            label: 'Claim at 67',
            data: cum67,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.05)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }, {
            label: 'Claim at 70',
            data: cum70,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.05)',
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
              text: 'Cumulative Lifetime Benefits',
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Age 62', 'Age 67', 'Age 70'],
          datasets: [{
            label: 'Monthly Benefit',
            data: [data.benefit62, data.benefit67, data.benefit70],
            backgroundColor: ['#D95B43', '#4A90D9', '#4ade80'],
            borderColor: ['#B84A32', '#3a7b8c', '#3a9b6c'],
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
              text: 'Monthly Benefits by Claiming Age',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
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
    document.getElementById('input_fraBenefit').value = 2000;
    document.getElementById('input_fraAge').value = '67';
    document.getElementById('input_lifeExpectancy').value = 85;
    updateTool();
  }

  // ── Guard number inputs: hard-block any keystroke that pushes value past max ──
  function attachNumberInputGuards() {
    document.querySelectorAll('#inputsArea input[type="number"]').forEach(function(el) {
      var lastValid = el.value;

      el.addEventListener('input', function() {
        var max = parseFloat(el.max);

        // allow empty / mid-typing minus sign while user is typing
        if (el.value === '' || el.value === '-') {
          lastValid = el.value;
          return;
        }

        var val = parseFloat(el.value);

        // reject the keystroke outright if it crosses max
        if (!isNaN(max) && !isNaN(val) && val > max) {
          el.value = lastValid;
          return;
        }

        lastValid = el.value;
      });

      // on blur: fix empty values and enforce min
      el.addEventListener('blur', function() {
        var min = parseFloat(el.min);
        var val = parseFloat(el.value);

        if (el.value === '' || el.value === '-' || isNaN(val)) {
          el.value = el.dataset.default;
        } else if (!isNaN(min) && val < min) {
          el.value = min;
        }

        lastValid = el.value;
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    });
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

    attachNumberInputGuards();

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
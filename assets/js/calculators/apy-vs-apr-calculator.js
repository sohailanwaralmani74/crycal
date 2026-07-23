(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Compounding Frequency Mapping ──
  var COMPOUNDING_MAP = {
    'daily': 365,
    'weekly': 52,
    'bi-weekly': 26,
    'monthly': 12,
    'quarterly': 4,
    'semi-annually': 2,
    'annually': 1
  };

  var COMPOUNDING_LABELS = {
    'daily': 'Daily (365x/year)',
    'weekly': 'Weekly (52x/year)',
    'bi-weekly': 'Bi-Weekly (26x/year)',
    'monthly': 'Monthly (12x/year)',
    'quarterly': 'Quarterly (4x/year)',
    'semi-annually': 'Semi-Annually (2x/year)',
    'annually': 'Annually (1x/year)'
  };

  // ── Get Inputs ──
  function getInputs() {
    var calculationType = document.getElementById('input_calculationType').value;
    var rate = parseFloat(document.getElementById('input_rate').value) || 0;
    var compoundingFrequency = document.getElementById('input_compoundingFrequency').value;

    return {
      calculationType: calculationType,
      rate: rate / 100,
      compoundingFrequency: compoundingFrequency
    };
  }

  // ── Format Currency ──
  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(4) + '%';
  }

  function formatPercentShort(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
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
  function calculateAPYvsAPR(inputs) {
    var type = inputs.calculationType;
    var rate = inputs.rate;
    var freq = inputs.compoundingFrequency;
    var n = COMPOUNDING_MAP[freq] || 12;

    if (rate <= 0) {
      return { error: 'Enter a valid rate' };
    }

    var result = {};

    if (type === 'apr-to-apy') {
      // APR → APY
      var apy = Math.pow(1 + rate / n, n) - 1;
      var difference = apy - rate;

      result = {
        convertedRate: apy,
        rateDifference: difference,
        effectiveRate: apy,
        nominalRate: rate,
        formula: 'APY = (1 + APR ÷ n)^n − 1',
        explanation: 'APR of ' + formatPercentShort(rate) + ' compounded ' + COMPOUNDING_LABELS[freq] + ' results in APY of ' + formatPercentShort(apy) + '. The difference is ' + formatPercentShort(difference) + '.',
        direction: 'apr-to-apy'
      };
    } else {
      // APY → APR
      var apr = n * (Math.pow(1 + rate, 1 / n) - 1);
      var difference = rate - apr;

      result = {
        convertedRate: apr,
        rateDifference: difference,
        effectiveRate: rate,
        nominalRate: apr,
        formula: 'APR = n × ((1 + APY)^(1/n) − 1)',
        explanation: 'APY of ' + formatPercentShort(rate) + ' compounded ' + COMPOUNDING_LABELS[freq] + ' results in APR of ' + formatPercentShort(apr) + '. The difference is ' + formatPercentShort(difference) + '.',
        direction: 'apy-to-apr'
      };
    }

    return result;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.rate <= 0) {
      setOutputText('output_convertedRate', '—');
      setOutputText('output_rateDifference', '—');
      setOutputText('output_effectiveRate', '—');
      setOutputText('output_nominalRate', '—');
      setOutputText('output_formulaUsed', '—');
      setOutputText('output_explanation', 'Enter a valid rate');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateAPYvsAPR(inputs);

    if (result.error) {
      setOutputText('output_convertedRate', '—');
      setOutputText('output_rateDifference', '—');
      setOutputText('output_effectiveRate', '—');
      setOutputText('output_nominalRate', '—');
      setOutputText('output_formulaUsed', '—');
      setOutputText('output_explanation', result.error);
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_convertedRate', formatPercent(result.convertedRate));
    setOutputText('output_rateDifference', formatPercent(result.rateDifference));
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));
    setOutputText('output_nominalRate', formatPercent(result.nominalRate));
    setOutputText('output_formulaUsed', result.formula);
    setOutputText('output_explanation', result.explanation);

    var chartPayload = {
      nominalRate: result.nominalRate,
      effectiveRate: result.effectiveRate,
      rateDifference: result.rateDifference,
      direction: result.direction
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        calculationType: inputs.calculationType,
        rate: inputs.rate * 100,
        compoundingFrequency: inputs.compoundingFrequency,
        convertedRate: result.convertedRate * 100
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
    if (!data) return null;

    if (tab === 'breakdown') {
      var labels = [];
      var values = [];

      if (data.direction === 'apr-to-apy') {
        labels = ['Nominal APR', 'Effective APY'];
        values = [data.nominalRate * 100, data.effectiveRate * 100];
      } else {
        labels = ['Nominal APR', 'Effective APY'];
        values = [data.nominalRate * 100, data.effectiveRate * 100];
      }

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Rate (%)',
            data: values,
            backgroundColor: ['#D95B43', '#4ade80'],
            borderColor: ['#B84A32', '#3a9b6c'],
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
              text: data.direction === 'apr-to-apy' ? 'APR vs APY Comparison' : 'APY vs APR Comparison',
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
                  return v.toFixed(2) + '%';
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
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
    document.getElementById('input_calculationType').value = 'apr-to-apy';
    document.getElementById('input_rate').value = 6.0;
    document.getElementById('input_compoundingFrequency').value = 'monthly';
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
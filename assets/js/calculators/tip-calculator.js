(function() {

  var chartInstance = null;
  var lastChartData = null;

  function getInputs() {
    var billAmount = parseFloat(document.getElementById('input_billAmount').value) || 0;
    var tipPercentage = document.getElementById('input_tipPercentage').value || '20';
    var customTip = parseFloat(document.getElementById('input_customTip').value) || 0;
    var splitCount = parseInt(document.getElementById('input_splitCount').value) || 1;
    var roundUp = document.getElementById('input_roundUp')?.checked || false;
    var includeTax = document.getElementById('input_includeTax')?.checked || false;

    // Use custom tip if selected
    var effectiveTip = (tipPercentage === 'custom') ? customTip : parseFloat(tipPercentage);

    return {
      billAmount: billAmount,
      tipPercentage: effectiveTip,
      splitCount: Math.max(1, splitCount),
      roundUp: roundUp,
      includeTax: includeTax
    };
  }

  function formatCurrency(amount) {
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

  var ALL_OUTPUTS = ['tipAmount', 'totalBill', 'tipPerPerson', 'totalPerPerson'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateTip(inputs) {
    if (inputs.billAmount <= 0) {
      return { error: 'Enter a valid bill amount' };
    }
    if (inputs.tipPercentage < 0) {
      return { error: 'Enter a valid tip percentage' };
    }
    if (inputs.splitCount < 1) {
      return { error: 'At least 1 person is required' };
    }

    var bill = inputs.billAmount;
    var tipPercent = inputs.tipPercentage / 100;
    var split = inputs.splitCount;
    var roundUp = inputs.roundUp;

    // Calculate tip
    var tipAmount = bill * tipPercent;

    // Round up total if enabled
    var total = bill + tipAmount;
    if (roundUp) {
      var roundedTotal = Math.ceil(total);
      tipAmount = roundedTotal - bill;
      total = roundedTotal;
    }

    var tipPerPerson = tipAmount / split;
    var totalPerPerson = total / split;

    return {
      tipAmount: tipAmount,
      totalBill: total,
      tipPerPerson: tipPerPerson,
      totalPerPerson: totalPerPerson,
      billAmount: bill,
      splitCount: split,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    // Validate
    if (inputs.billAmount <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateTip(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_tipAmount', formatCurrency(result.tipAmount));
    setOutputText('output_totalBill', formatCurrency(result.totalBill));
    setOutputText('output_tipPerPerson', formatCurrency(result.tipPerPerson));
    setOutputText('output_totalPerPerson', formatCurrency(result.totalPerPerson));

    var chartPayload = {
      billAmount: result.billAmount,
      tipAmount: result.tipAmount,
      totalBill: result.totalBill,
      splitCount: result.splitCount
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    // Log history
    if (typeof window.logHistory === 'function') {
      window.logHistory({
        billAmount: inputs.billAmount,
        tipPercentage: inputs.tipPercentage,
        splitCount: inputs.splitCount,
        tipAmount: result.tipAmount,
        totalBill: result.totalBill,
        tipPerPerson: result.tipPerPerson,
        totalPerPerson: result.totalPerPerson
      });
    }
  }

  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(data) {
    if (!data || !data.billAmount || !data.tipAmount) return null;

    var labels = ['Bill Amount', 'Tip Amount'];
    var values = [data.billAmount, data.tipAmount];
    var colors = ['#4A90D9', '#28a745'];

    // If split, show per-person breakdown
    if (data.splitCount > 1) {
      return {
        type: 'bar',
        data: {
          labels: ['Bill Per Person', 'Tip Per Person', 'Total Per Person'],
          datasets: [{
            label: 'Per Person Breakdown',
            data: [
              data.billAmount / data.splitCount,
              data.tipAmount / data.splitCount,
              data.totalBill / data.splitCount
            ],
            backgroundColor: ['rgba(74, 144, 217, 0.7)', 'rgba(40, 167, 69, 0.7)', 'rgba(108, 117, 125, 0.7)'],
            borderColor: ['#4A90D9', '#28a745', '#6c757d'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Breakdown Per Person (Split ' + data.splitCount + ' Ways)', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 10 } } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: function(v) { try { var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v); } catch(e) { return '$' + v.toFixed(0); } } } }
          }
        }
      };
    }

    // Single person: show bill vs tip pie chart
    return {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#4A90D9', '#28a745'],
          borderColor: ['#2c6f9f', '#1e7e34'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 12 } } },
          title: { display: true, text: 'Bill vs Tip Breakdown', font: { size: 14, color: '#e8edf0' } },
          tooltip: {
            callbacks: {
              label: function(context) {
                var label = context.label || '';
                var value = context.parsed;
                var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                var percentage = ((value / total) * 100).toFixed(1);
                return label + ': ' + formatCurrency(value) + ' (' + percentage + '%)';
              }
            }
          }
        }
      }
    };
  }

  function resetTool() {
    var _el_billAmount = document.getElementById('input_billAmount');
    _el_billAmount.value = (_el_billAmount.dataset && _el_billAmount.dataset.default !== undefined) ? _el_billAmount.dataset.default : (_el_billAmount.getAttribute('value') || '');
    var _el_tipPercentage = document.getElementById('input_tipPercentage');
    if (_el_tipPercentage) {
      var defaultTip = (_el_tipPercentage.dataset && _el_tipPercentage.dataset.default !== undefined) ? _el_tipPercentage.dataset.default : (_el_tipPercentage.getAttribute('value') || '20');
      _el_tipPercentage.value = defaultTip;
    }
    var _el_customTip = document.getElementById('input_customTip');
    _el_customTip.value = (_el_customTip.dataset && _el_customTip.dataset.default !== undefined) ? _el_customTip.dataset.default : (_el_customTip.getAttribute('value') || '');
    var _el_splitCount = document.getElementById('input_splitCount');
    _el_splitCount.value = (_el_splitCount.dataset && _el_splitCount.dataset.default !== undefined) ? _el_splitCount.dataset.default : (_el_splitCount.getAttribute('value') || '');
    var _el_roundUp = document.getElementById('input_roundUp');
    if (_el_roundUp) _el_roundUp.checked = false;
    var _el_includeTax = document.getElementById('input_includeTax');
    if (_el_includeTax) _el_includeTax.checked = false;
    updateTool();
  }

  // Show/hide custom tip input
  function toggleCustomTip() {
    var tipSelect = document.getElementById('input_tipPercentage');
    var customGroup = document.getElementById('customTipGroup');
    if (tipSelect && customGroup) {
      customGroup.style.display = (tipSelect.value === 'custom') ? 'block' : 'none';
    }
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.toggleCustomTip = toggleCustomTip;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    // Handle conditional visibility
    var tipSelect = document.getElementById('input_tipPercentage');
    if (tipSelect) {
      tipSelect.addEventListener('change', function() {
        toggleCustomTip();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    var customTip = document.getElementById('input_customTip');
    if (customTip) {
      customTip.addEventListener('input', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    // Initial visibility
    toggleCustomTip();

    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
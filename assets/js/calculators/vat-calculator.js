(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var calculationType = document.getElementById('input_calculationType').value;
    var netAmount = parseFloat(document.getElementById('input_netAmount').value) || 0;
    var grossAmount = parseFloat(document.getElementById('input_grossAmount').value) || 0;
    var vatRate = parseFloat(document.getElementById('input_vatRate').value) || 0;

    return {
      calculationType: calculationType,
      netAmount: netAmount,
      grossAmount: grossAmount,
      vatRate: vatRate / 100
    };
  }

  // ── Format Currency ──
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

  function formatPercent(value) {
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
  function calculateVAT(inputs) {
    var type = inputs.calculationType;
    var net = inputs.netAmount;
    var gross = inputs.grossAmount;
    var rate = inputs.vatRate;

    var result = {};

    if (type === 'net-to-gross') {
      if (net <= 0) {
        return { error: 'Enter a valid net amount' };
      }
      var vatAmount = net * rate;
      var grossResult = net + vatAmount;
      result = {
        vatAmount: vatAmount,
        netAmount: net,
        grossAmount: grossResult,
        effectiveRate: rate
      };
    } else if (type === 'gross-to-net') {
      if (gross <= 0) {
        return { error: 'Enter a valid gross amount' };
      }
      var netResult = gross / (1 + rate);
      var vatAmountResult = gross - netResult;
      result = {
        vatAmount: vatAmountResult,
        netAmount: netResult,
        grossAmount: gross,
        effectiveRate: rate
      };
    } else if (type === 'vat-only') {
      // VAT Only: user enters either net or gross
      if (net > 0 && gross === 0) {
        var vatOnly = net * rate;
        result = {
          vatAmount: vatOnly,
          netAmount: net,
          grossAmount: net + vatOnly,
          effectiveRate: rate
        };
      } else if (gross > 0 && net === 0) {
        var netOnly = gross / (1 + rate);
        var vatOnlyGross = gross - netOnly;
        result = {
          vatAmount: vatOnlyGross,
          netAmount: netOnly,
          grossAmount: gross,
          effectiveRate: rate
        };
      } else if (net > 0 && gross > 0) {
        // Both provided — use net
        var vatBoth = net * rate;
        result = {
          vatAmount: vatBoth,
          netAmount: net,
          grossAmount: net + vatBoth,
          effectiveRate: rate
        };
      } else {
        return { error: 'Enter a net or gross amount' };
      }
    }

    return result;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.vatRate <= 0) {
      setOutputText('output_vatAmount', '—');
      setOutputText('output_netAmountResult', '—');
      setOutputText('output_grossAmountResult', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateVAT(inputs);

    if (result.error) {
      setOutputText('output_vatAmount', '—');
      setOutputText('output_netAmountResult', '—');
      setOutputText('output_grossAmountResult', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_vatAmount', formatCurrency(result.vatAmount));
    setOutputText('output_netAmountResult', formatCurrency(result.netAmount));
    setOutputText('output_grossAmountResult', formatCurrency(result.grossAmount));
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));

    var chartPayload = {
      netAmount: result.netAmount,
      vatAmount: result.vatAmount,
      grossAmount: result.grossAmount,
      vatRate: result.effectiveRate
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        calculationType: inputs.calculationType,
        vatRate: inputs.vatRate * 100,
        vatAmount: result.vatAmount,
        netAmountResult: result.netAmount,
        grossAmountResult: result.grossAmount
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
      return {
        type: 'doughnut',
        data: {
          labels: ['Net Amount', 'VAT Amount'],
          datasets: [{
            data: [data.netAmount, data.vatAmount],
            backgroundColor: ['#4A90D9', '#D95B43'],
            borderColor: ['#3a7b8c', '#B84A32'],
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
              text: 'Price Breakdown (VAT: ' + (data.vatRate * 100).toFixed(1) + '%)',
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
    document.getElementById('input_calculationType').value = 'net-to-gross';
    document.getElementById('input_netAmount').value = 1000;
    document.getElementById('input_grossAmount').value = 1200;
    document.getElementById('input_vatRate').value = 20.0;
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Toggle Input Visibility ──
  function toggleInputs() {
    var type = document.getElementById('input_calculationType').value;
    var netGroup = document.getElementById('input_netAmount').closest('.input-group');
    var grossGroup = document.getElementById('input_grossAmount').closest('.input-group');

    if (type === 'net-to-gross') {
      if (netGroup) netGroup.style.display = 'block';
      if (grossGroup) grossGroup.style.display = 'none';
    } else if (type === 'gross-to-net') {
      if (netGroup) netGroup.style.display = 'none';
      if (grossGroup) grossGroup.style.display = 'block';
    } else {
      if (netGroup) netGroup.style.display = 'block';
      if (grossGroup) grossGroup.style.display = 'block';
    }
  }

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    // Toggle inputs on type change
    var typeSelect = document.getElementById('input_calculationType');
    if (typeSelect) {
      typeSelect.addEventListener('change', function() {
        toggleInputs();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    // Initial toggle
    toggleInputs();

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
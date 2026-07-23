(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      amount: parseFloat(document.getElementById('input_amount').value) || 0,
      gstRate: parseFloat(document.getElementById('input_gstRate').value) || 0,
      calculationType: document.getElementById('input_calculationType').value
    };
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
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

  function calculateResults(inputs) {
    var amt = inputs.amount;
    var rate = inputs.gstRate / 100;
    if (amt <= 0) return null;

    var net = 0;
    var gst = 0;
    var gross = 0;

    if (inputs.calculationType.indexOf('Add GST') !== -1) {
      net = amt;
      gst = net * rate;
      gross = net + gst;
    } else {
      gross = amt;
      net = gross / (1 + rate);
      gst = gross - net;
    }

    return {
      net: net,
      gst: gst,
      gross: gross
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_netAmount', formatCurrencyLocal(result.net));
    setOutputText('output_gstAmount', formatCurrencyLocal(result.gst));
    setOutputText('output_grossAmount', formatCurrencyLocal(result.gross));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        amount: inputs.amount,
        gstRate: inputs.gstRate,
        calculationType: inputs.calculationType,
        netAmount: result.net,
        gstAmount: result.gst,
        grossAmount: result.gross
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
          labels: ['Net Product Price', 'GST Tax Amount'],
          datasets: [{
            data: [result.net, result.gst],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Total Gross Price Composition' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['GST Calculation Result'],
          datasets: [
            {
              label: 'Net Price (Exclusive)',
              data: [result.net],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'GST Tax Component',
              data: [result.gst],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Net Price vs GST Component' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
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
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });

    setTimeout(updateTool, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();

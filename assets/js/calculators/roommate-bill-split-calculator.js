(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalRent: parseFloat(document.getElementById('input_totalRent').value) || 0,
      totalUtilities: parseFloat(document.getElementById('input_totalUtilities').value) || 0,
      roommateCount: parseFloat(document.getElementById('input_roommateCount').value) || 2,
      splitMethod: document.getElementById('input_splitMethod').value
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
    var rent = inputs.totalRent;
    var util = inputs.totalUtilities;
    var rms = inputs.roommateCount;

    if (rent <= 0 || rms <= 0) return null;

    var totalOverhead = rent + util;
    var perPerson = totalOverhead / rms;

    return {
      totalOverhead: totalOverhead,
      perPerson: perPerson,
      rent: rent,
      util: util
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_totalHouseholdExpenses', formatCurrencyLocal(result.totalOverhead));
    setOutputText('output_sharePerRoommate', formatCurrencyLocal(result.perPerson) + ' / person');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalRent: inputs.totalRent,
        totalUtilities: inputs.totalUtilities,
        roommateCount: inputs.roommateCount,
        totalHouseholdExpenses: result.totalOverhead,
        sharePerRoommate: result.perPerson
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
          labels: ['Monthly Lease Rent', 'Monthly Household Utilities'],
          datasets: [{
            data: [result.rent, result.util],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Household Expense Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'perRoommate') {
      return {
        type: 'bar',
        data: {
          labels: ['Equal Roommate Split'],
          datasets: [{
            label: 'Individual Payment Per Person (' + inputs.roommateCount + ' Roommates)',
            data: [result.perPerson],
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Per-Person Monthly Share' }
          },
          scales: {
            y: { beginAtZero: true }
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

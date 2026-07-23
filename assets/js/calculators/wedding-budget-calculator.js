(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalWeddingBudget: parseFloat(document.getElementById('input_totalWeddingBudget').value) || 0,
      guestCount: parseFloat(document.getElementById('input_guestCount').value) || 120
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
    var b = inputs.totalWeddingBudget;
    var g = inputs.guestCount;

    if (b <= 0 || g <= 0) return null;

    var venue = b * 0.45;
    var photo = b * 0.12;
    var attire = b * 0.08;
    var music = b * 0.10;
    var decor = b * 0.10;
    var perGuest = b / g;

    return {
      venue: venue,
      photo: photo,
      attire: attire,
      music: music,
      decor: decor,
      perGuest: perGuest,
      budget: b
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_venueCateringBudget', formatCurrencyLocal(result.venue));
    setOutputText('output_photographyVideoBudget', formatCurrencyLocal(result.photo));
    setOutputText('output_attireBeautyBudget', formatCurrencyLocal(result.attire));
    setOutputText('output_musicEntertainmentBudget', formatCurrencyLocal(result.music));
    setOutputText('output_decorFlowersBudget', formatCurrencyLocal(result.decor));
    setOutputText('output_costPerGuest', formatCurrencyLocal(result.perGuest) + ' / guest');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalWeddingBudget: inputs.totalWeddingBudget,
        guestCount: inputs.guestCount,
        venueCateringBudget: result.venue,
        photographyVideoBudget: result.photo,
        costPerGuest: result.perGuest
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
          labels: ['Venue & Catering (45%)', 'Photography/Video (12%)', 'Music/DJ (10%)', 'Flowers & Decor (10%)', 'Attire & Beauty (8%)', 'Other/Cushion (15%)'],
          datasets: [{
            data: [result.venue, result.photo, result.music, result.decor, result.attire, result.budget * 0.15],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#B23A3A', '#DCE1E3', '#4A90E2', '#8899AA'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Wedding Category Allocation Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'perGuest') {
      return {
        type: 'bar',
        data: {
          labels: ['Cost Per Guest'],
          datasets: [{
            label: 'Cost Per Guest (' + inputs.guestCount + ' Guests)',
            data: [result.perGuest],
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Per-Guest Expenditure Metric' }
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

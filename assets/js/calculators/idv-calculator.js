(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Standard Depreciation Rates by Age ──
  var DEPRECIATION_RATES = {
    0: 5,    // Less than 1 year
    1: 15,   // 1 year
    2: 20,   // 2 years
    3: 30,   // 3 years
    4: 40,   // 4 years
    5: 50,   // 5 years
    6: 60,   // 6+ years (capped)
  };

  // ── Get Inputs ──
  function getInputs() {
    var exShowroomPrice = parseFloat(document.getElementById('input_exShowroomPrice').value) || 0;
    var registrationYear = parseInt(document.getElementById('input_registrationYear').value) || 2025;
    var depreciationRate = parseFloat(document.getElementById('input_depreciationRate').value) || 0;
    var accessories = parseFloat(document.getElementById('input_accessories').value) || 0;

    return {
      exShowroomPrice: exShowroomPrice,
      registrationYear: registrationYear,
      depreciationRate: depreciationRate / 100, // Convert to decimal
      accessories: accessories
    };
  }

  // ── Get Auto Depreciation Rate ──
  function getAutoDepreciationRate(registrationYear) {
    var currentYear = new Date().getFullYear();
    var age = currentYear - registrationYear;
    if (age < 0) age = 0;

    // Get the rate based on age
    var rate = DEPRECIATION_RATES[age] || DEPRECIATION_RATES[6];
    return rate / 100; // Return as decimal
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
  function calculateIDV(inputs) {
    var P = inputs.exShowroomPrice;
    var accessories = inputs.accessories;
    var rate = inputs.depreciationRate;

    // If rate is 0, auto-calculate it
    if (rate === 0) {
      rate = getAutoDepreciationRate(inputs.registrationYear);
    }

    var baseDepreciation = P * rate;
    var baseIDV = P - baseDepreciation;

    // Accessories depreciation
    var accessoriesDepreciation = accessories * rate;
    var accessoriesIDV = accessories - accessoriesDepreciation;

    var totalIDV = baseIDV + accessoriesIDV;
    var totalDepreciation = baseDepreciation + accessoriesDepreciation;

    // Premium estimate (roughly 2-3% of IDV)
    var premiumEstimate = totalIDV * 0.025;

    // Vehicle age
    var age = new Date().getFullYear() - inputs.registrationYear;

    return {
      idv: totalIDV,
      totalDepreciation: totalDepreciation,
      rate: rate,
      ratePercent: rate * 100,
      baseIDV: baseIDV,
      accessoriesIDV: accessoriesIDV,
      premiumEstimate: premiumEstimate,
      age: age
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.exShowroomPrice <= 0) {
      setOutputText('output_idv', '—');
      setOutputText('output_depreciationAmount', '—');
      setOutputText('output_depreciationPercent', '—');
      setOutputText('output_vehicleAge', '—');
      setOutputText('output_premiumEstimate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateIDV(inputs);

    setOutputText('output_idv', formatCurrency(result.idv));
    setOutputText('output_depreciationAmount', formatCurrency(result.totalDepreciation));
    setOutputText('output_depreciationPercent', result.ratePercent.toFixed(1) + '%');
    setOutputText('output_vehicleAge', result.age + ' years');
    setOutputText('output_premiumEstimate', formatCurrency(result.premiumEstimate));

    var chartPayload = {
      baseIDV: result.baseIDV,
      accessoriesIDV: result.accessoriesIDV,
      depreciation: result.totalDepreciation,
      totalIDV: result.idv,
      age: result.age
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        exShowroomPrice: inputs.exShowroomPrice,
        registrationYear: inputs.registrationYear,
        depreciationRate: result.ratePercent,
        idv: result.idv,
        premiumEstimate: result.premiumEstimate
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
          labels: ['Base IDV', 'Accessories IDV', 'Depreciation'],
          datasets: [{
            data: [data.baseIDV, data.accessoriesIDV, data.depreciation],
            backgroundColor: ['#2F6F5E', '#4A90D9', '#D95B43'],
            borderColor: ['#1f4f42', '#3a7b8c', '#B84A32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'IDV Breakdown (Age: ' + data.age + ' years)',
              font: { size: 14 }
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
    document.getElementById('input_exShowroomPrice').value = 1000000;
    document.getElementById('input_registrationYear').value = '2025';
    document.getElementById('input_depreciationRate').value = 15;
    document.getElementById('input_accessories').value = 0;
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Auto-calculate depreciation rate on year change ──
  function autoCalculateRate() {
    var yearEl = document.getElementById('input_registrationYear');
    var rateEl = document.getElementById('input_depreciationRate');
    if (!yearEl || !rateEl) return;

    var year = parseInt(yearEl.value) || 2025;
    var autoRate = getAutoDepreciationRate(year) * 100;

    // Only set if user hasn't manually changed it
    if (rateEl.dataset.userChanged !== 'true') {
      rateEl.value = autoRate;
    }
  }

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    // Auto-calculate rate on page load
    autoCalculateRate();

    // Listen for year changes
    var yearSelect = document.getElementById('input_registrationYear');
    if (yearSelect) {
      yearSelect.addEventListener('change', function() {
        autoCalculateRate();
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    // Track if user manually changed the rate
    var rateInput = document.getElementById('input_depreciationRate');
    if (rateInput) {
      rateInput.addEventListener('input', function() {
        rateInput.dataset.userChanged = 'true';
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

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
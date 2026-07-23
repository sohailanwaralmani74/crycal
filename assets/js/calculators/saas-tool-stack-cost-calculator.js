(function() {
  var chartInstance = null;
  var currentTab = 'stack';
  var lastChartData = null;

  function getInputs() {
    var totalEmployees = parseFloat(document.getElementById('input_totalEmployees').value) || 1;
    var perSeatToolsCost = parseFloat(document.getElementById('input_perSeatToolsCost').value) || 0;
    var flatMonthlyToolsCost = parseFloat(document.getElementById('input_flatMonthlyToolsCost').value) || 0;
    var unusedLicensesPercent = parseFloat(document.getElementById('input_unusedLicensesPercent').value) || 12;

    return {
      totalEmployees: totalEmployees,
      perSeatToolsCost: perSeatToolsCost,
      flatMonthlyToolsCost: flatMonthlyToolsCost,
      unusedLicensesPercent: unusedLicensesPercent / 100
    };
  }

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

  function calculateToolStackCost(inputs) {
    var ftes = inputs.totalEmployees;
    var perSeat = inputs.perSeatToolsCost;
    var flat = inputs.flatMonthlyToolsCost;
    var wasteRate = inputs.unusedLicensesPercent;

    if (ftes <= 0) {
      return { error: 'Total employees must be greater than zero.' };
    }

    var monthlyPerSeatSpend = ftes * perSeat;
    var totalMonthlyStackCost = monthlyPerSeatSpend + flat;
    var totalAnnualStackCost = totalMonthlyStackCost * 12;
    var annualWastedSpend = totalAnnualStackCost * wasteRate;
    var effectiveAnnualSpend = totalAnnualStackCost - annualWastedSpend;

    return {
      monthlyPerSeatSpend: monthlyPerSeatSpend,
      totalMonthlyStackCost: totalMonthlyStackCost,
      totalAnnualStackCost: totalAnnualStackCost,
      annualWastedSpend: annualWastedSpend,
      effectiveAnnualSpend: effectiveAnnualSpend,
      flat: flat,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateToolStackCost(inputs);

    if (result.error) {
      setOutputText('output_monthlyPerSeatSpend', '—');
      setOutputText('output_totalMonthlyStackCost', '—');
      setOutputText('output_totalAnnualStackCost', '—');
      setOutputText('output_annualWastedSpend', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_monthlyPerSeatSpend', formatCurrency(result.monthlyPerSeatSpend));
    setOutputText('output_totalMonthlyStackCost', formatCurrency(result.totalMonthlyStackCost));
    setOutputText('output_totalAnnualStackCost', formatCurrency(result.totalAnnualStackCost));
    setOutputText('output_annualWastedSpend', formatCurrency(result.annualWastedSpend));

    var chartPayload = {
      perSeatSpend: result.monthlyPerSeatSpend,
      flatSpend: result.flat,
      effectiveSpend: result.effectiveAnnualSpend,
      wastedSpend: result.annualWastedSpend
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalEmployees: inputs.totalEmployees,
        perSeatToolsCost: '$' + inputs.perSeatToolsCost + '/seat',
        totalMonthlyStackCost: formatCurrency(result.totalMonthlyStackCost),
        annualWastedSpend: formatCurrency(result.annualWastedSpend)
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
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'stack') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Per-Seat User Software Spend', 'Flat Enterprise Tools Spend'],
          datasets: [{
            data: [data.perSeatSpend, data.flatSpend],
            backgroundColor: ['#3b82f6', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Monthly SaaS Stack Cost Components ($)', color: '#e8edf0' }
          }
        }
      };
    }

    if (tab === 'waste') {
      return {
        type: 'bar',
        data: {
          labels: ['Effective Productive SaaS Budget', 'Wasted / Unused License Budget'],
          datasets: [{
            label: 'Annual Cost ($)',
            data: [data.effectiveSpend, data.wastedSpend],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual SaaS Spend: Effective vs Wasted Licenses ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    document.getElementById('input_totalEmployees').value = 45;
    document.getElementById('input_perSeatToolsCost').value = 160;
    document.getElementById('input_flatMonthlyToolsCost').value = 2500;
    document.getElementById('input_unusedLicensesPercent').value = 12;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

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

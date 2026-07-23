(function() {
  var chartInstance = null;
  var currentTab = 'tierCostBreakdown';
  var lastChartData = null;

  function getInputs() {
    return {
      tier1BasePrice: parseFloat(document.getElementById('input_tier1BasePrice').value) || 0,
      tier2Price: parseFloat(document.getElementById('input_tier2Price').value) || 0,
      tier3Price: parseFloat(document.getElementById('input_tier3Price').value) || 0,
      tier4Price: parseFloat(document.getElementById('input_tier4Price').value) || 0,
      totalSeatsPurchased: parseFloat(document.getElementById('input_totalSeatsPurchased').value) || 0,
      discountStructure: document.getElementById('input_discountStructure').value || 'Graduated Tiered'
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

  function formatPercent(val) {
    return (val * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateVolume(inputs) {
    var seats = inputs.totalSeatsPurchased;
    var unDiscountedTotal = seats * inputs.tier1BasePrice;

    var totalMonthlyBill = 0;
    var t1Cost = 0, t2Cost = 0, t3Cost = 0, t4Cost = 0;

    if (inputs.discountStructure === 'Flat Volume Discount') {
      var flatRate = inputs.tier1BasePrice;
      if (seats > 200) flatRate = inputs.tier4Price;
      else if (seats > 50) flatRate = inputs.tier3Price;
      else if (seats > 10) flatRate = inputs.tier2Price;

      totalMonthlyBill = seats * flatRate;
      t1Cost = totalMonthlyBill;
    } else {
      // Graduated Tiered
      var t1Seats = Math.min(seats, 10);
      var t2Seats = Math.max(0, Math.min(seats - 10, 40));
      var t3Seats = Math.max(0, Math.min(seats - 50, 150));
      var t4Seats = Math.max(0, seats - 200);

      t1Cost = t1Seats * inputs.tier1BasePrice;
      t2Cost = t2Seats * inputs.tier2Price;
      t3Cost = t3Seats * inputs.tier3Price;
      t4Cost = t4Seats * inputs.tier4Price;

      totalMonthlyBill = t1Cost + t2Cost + t3Cost + t4Cost;
    }

    var effectivePricePerSeat = seats > 0 ? totalMonthlyBill / seats : 0;
    var totalMonthlySavings = Math.max(0, unDiscountedTotal - totalMonthlyBill);
    var effectiveDiscountPercent = unDiscountedTotal > 0 ? totalMonthlySavings / unDiscountedTotal : 0;

    // Per-seat curve test
    var seatPoints = [5, 15, 30, 75, 150, 300];
    var curveEffectiveRates = seatPoints.map(function(s) {
      var bill = 0;
      var s1 = Math.min(s, 10);
      var s2 = Math.max(0, Math.min(s - 10, 40));
      var s3 = Math.max(0, Math.min(s - 50, 150));
      var s4 = Math.max(0, s - 200);
      bill = (s1 * inputs.tier1BasePrice) + (s2 * inputs.tier2Price) + (s3 * inputs.tier3Price) + (s4 * inputs.tier4Price);
      return bill / s;
    });

    return {
      totalMonthlyBill: totalMonthlyBill,
      effectivePricePerSeat: effectivePricePerSeat,
      unDiscountedTotal: unDiscountedTotal,
      totalMonthlySavings: totalMonthlySavings,
      effectiveDiscountPercent: effectiveDiscountPercent,
      t1Cost: t1Cost,
      t2Cost: t2Cost,
      t3Cost: t3Cost,
      t4Cost: t4Cost,
      seatPoints: seatPoints,
      curveEffectiveRates: curveEffectiveRates
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateVolume(inputs);

    setOutputText('output_totalMonthlyBill', formatCurrency(res.totalMonthlyBill));
    setOutputText('output_effectivePricePerSeat', formatCurrency(res.effectivePricePerSeat));
    setOutputText('output_un-discountedTotal', formatCurrency(res.unDiscountedTotal));
    setOutputText('output_totalMonthlySavings', formatCurrency(res.totalMonthlySavings));
    setOutputText('output_effectiveDiscountPercent', formatPercent(res.effectiveDiscountPercent));

    lastChartData = res;
    updateCharts(res);
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'tierCostBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Seats 1-10', 'Seats 11-50', 'Seats 51-200', 'Seats 201+'],
          datasets: [{
            data: [data.t1Cost, data.t2Cost, data.t3Cost, data.t4Cost],
            backgroundColor: ['#4A90D9', '#4ade80', '#fbbf24', '#a78bfa'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: 'Seat Cost Allocation ($)', color: '#e8edf0' }
          }
        }
      });
    } else if (currentTab === 'perSeatCurve') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.seatPoints.map(function(s) { return s + ' Seats'; }),
          datasets: [{
            label: 'Effective Price / Seat ($)',
            data: data.curveEffectiveRates,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: 'Effective Price / Seat vs Volume ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_tier1BasePrice').value = 25;
    document.getElementById('input_tier2Price').value = 20;
    document.getElementById('input_tier3Price').value = 15;
    document.getElementById('input_tier4Price').value = 10;
    document.getElementById('input_totalSeatsPurchased').value = 120;
    document.getElementById('input_discountStructure').value = 'Graduated Tiered';
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
  });
})();

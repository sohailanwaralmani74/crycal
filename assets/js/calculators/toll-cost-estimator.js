(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      num_gantry_passes: parseInt(document.getElementById('input_num_gantry_passes').value) || 6,
      avg_base_toll: parseFloat(document.getElementById('input_avg_base_toll').value) || 4.50,
      vehicle_axles: parseFloat(document.getElementById('input_vehicle_axles').value) || 1.0,
      payment_method: parseFloat(document.getElementById('input_payment_method').value) || 0.75,
      travel_time: parseFloat(document.getElementById('input_travel_time').value) || 1.0
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

  function calculateTolls(inp) {
    var plaza_rate = inp.avg_base_toll * inp.vehicle_axles * inp.payment_method * inp.travel_time;
    var total_cost = inp.num_gantry_passes * plaza_rate;

    var cash_plaza_rate = inp.avg_base_toll * inp.vehicle_axles * 1.20 * inp.travel_time;
    var cash_total = inp.num_gantry_passes * cash_plaza_rate;

    var transponder_savings = Math.max(0, cash_total - total_cost);

    var off_peak_total = inp.num_gantry_passes * (inp.avg_base_toll * inp.vehicle_axles * inp.payment_method * 1.0);
    var peak_surcharge = Math.max(0, total_cost - off_peak_total);

    return {
      total_cost: total_cost,
      plaza_rate: plaza_rate,
      transponder_savings: transponder_savings,
      cash_total: cash_total,
      peak_surcharge: peak_surcharge
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateTolls(inp);

    setOutputText('output_total_toll_cost', formatCurrency(res.total_cost));
    setOutputText('output_toll_per_plaza', formatCurrency(res.plaza_rate) + ' / plaza');
    setOutputText('output_transponder_savings', formatCurrency(res.transponder_savings) + ' saved');
    setOutputText('output_cash_toll_total', formatCurrency(res.cash_total));
    setOutputText('output_peak_surcharge_amount', formatCurrency(res.peak_surcharge));

    var chartData = {
      labels: ['Your Selection', 'Pay-by-Plate / Cash Rate'],
      values: [parseFloat(res.total_cost.toFixed(2)), parseFloat(res.cash_total.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        total_toll_cost: formatCurrency(res.total_cost),
        transponder_savings: formatCurrency(res.transponder_savings),
        cash_toll_total: formatCurrency(res.cash_total)
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
    if (!data) return;

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Total Toll Expense ',
          data: data.values,
          backgroundColor: ['#4A90D9', '#D95B43']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#8899aa' } },
          x: { ticks: { color: '#8899aa' } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_num_gantry_passes').value = 6;
    document.getElementById('input_avg_base_toll').value = 4.50;
    document.getElementById('input_vehicle_axles').value = "1.0";
    document.getElementById('input_payment_method').value = "0.75";
    document.getElementById('input_travel_time').value = "1.0";
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

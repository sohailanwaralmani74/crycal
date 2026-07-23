(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      vehicle_type: document.getElementById('input_vehicle_type').value || "sedan",
      package_tier: document.getElementById('input_package_tier').value || "full_detail",
      vehicle_condition: document.getElementById('input_vehicle_condition').value || "moderate",
      addon_paint_correction: document.getElementById('input_addon_paint_correction').value || "none",
      addon_headlight: document.getElementById('input_addon_headlight').value || "no",
      addon_engine_bay: document.getElementById('input_addon_engine_bay').value || "no"
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

  function calculateDetailing(inp) {
    var base_price = 220;
    var base_hours = 4.0;

    if (inp.package_tier === "express") {
      base_price = 80;
      base_hours = 1.5;
    } else if (inp.package_tier === "full_detail") {
      base_price = 220;
      base_hours = 4.0;
    } else if (inp.package_tier === "premium") {
      base_price = 450;
      base_hours = 7.0;
    } else if (inp.package_tier === "ceramic") {
      base_price = 900;
      base_hours = 14.0;
    }

    var size_mult = 1.0;
    if (inp.vehicle_type === "coupe") size_mult = 1.0;
    else if (inp.vehicle_type === "sedan") size_mult = 1.15;
    else if (inp.vehicle_type === "suv") size_mult = 1.35;
    else if (inp.vehicle_type === "truck") size_mult = 1.50;

    var cond_mult = 1.0;
    if (inp.vehicle_condition === "clean") cond_mult = 1.0;
    else if (inp.vehicle_condition === "moderate") cond_mult = 1.15;
    else if (inp.vehicle_condition === "heavy") cond_mult = 1.35;

    var base_adjusted = base_price * size_mult * cond_mult;
    var est_hours = base_hours * size_mult * cond_mult;

    var paint_addon = 0;
    if (inp.addon_paint_correction === "one_stage") paint_addon = 150;
    else if (inp.addon_paint_correction === "two_stage") paint_addon = 350;

    var headlight_addon = inp.addon_headlight === "yes" ? 60 : 0;
    var engine_addon = inp.addon_engine_bay === "yes" ? 75 : 0;

    var addons_total = paint_addon + headlight_addon + engine_addon;
    var total_cost = base_adjusted + addons_total;

    return {
      total_cost: total_cost,
      base_adjusted: base_adjusted,
      addons_total: addons_total,
      est_hours: est_hours,
      package_label: inp.package_tier.toUpperCase()
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateDetailing(inp);

    setOutputText('output_total_detail_cost', formatCurrency(res.total_cost));
    setOutputText('output_base_package_cost', formatCurrency(res.base_adjusted));
    setOutputText('output_addons_total', formatCurrency(res.addons_total));
    setOutputText('output_estimated_duration_hrs', res.est_hours.toFixed(1) + ' hours');
    setOutputText('output_cost_per_sqft', res.package_label + ' tier');

    var chartData = {
      labels: ['Adjusted Base Package', 'Add-on Treatments', 'Total Detail Price'],
      values: [parseFloat(res.base_adjusted.toFixed(2)), parseFloat(res.addons_total.toFixed(2)), parseFloat(res.total_cost.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        total_detail_cost: formatCurrency(res.total_cost),
        base_package_cost: formatCurrency(res.base_adjusted),
        addons_total: formatCurrency(res.addons_total)
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
          label: 'Price Breakdown ',
          data: data.values,
          backgroundColor: ['#4A90D9', '#fbbf24', '#4ade80']
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
    document.getElementById('input_vehicle_type').value = "sedan";
    document.getElementById('input_package_tier').value = "full_detail";
    document.getElementById('input_vehicle_condition').value = "moderate";
    document.getElementById('input_addon_paint_correction').value = "none";
    document.getElementById('input_addon_headlight').value = "no";
    document.getElementById('input_addon_engine_bay').value = "no";
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

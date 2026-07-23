(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      width: parseFloat(document.getElementById('input_width').value) || 225,
      aspect_ratio: parseFloat(document.getElementById('input_aspect_ratio').value) || 50,
      rim_diameter: parseFloat(document.getElementById('input_rim_diameter').value) || 17,
      load_deflection: parseFloat(document.getElementById('input_load_deflection').value) || 3.0
    };
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateRevs(inp) {
    var sw_unloaded = (inp.width * (inp.aspect_ratio / 100)) / 25.4;
    var sw_loaded = sw_unloaded * (1 - (inp.load_deflection / 100));
    var diam_loaded = inp.rim_diameter + (2 * sw_loaded);
    var circ_loaded = diam_loaded * Math.PI;

    var revs_mile = 63360 / circ_loaded;
    var revs_km = revs_mile / 1.609344;
    var dist_per_rev_ft = circ_loaded / 12.0;

    return {
      revs_mile: revs_mile,
      revs_km: revs_km,
      diam_loaded: diam_loaded,
      circ_loaded: circ_loaded,
      dist_per_rev_ft: dist_per_rev_ft
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateRevs(inp);

    setOutputText('output_revs_per_mile', Math.round(res.revs_mile) + ' revs/mi');
    setOutputText('output_revs_per_km', Math.round(res.revs_km) + ' revs/km');
    setOutputText('output_loaded_diameter', res.diam_loaded.toFixed(2) + ' in');
    setOutputText('output_loaded_circumference', res.circ_loaded.toFixed(2) + ' in');
    setOutputText('output_distance_per_rev', res.dist_per_rev_ft.toFixed(2) + ' ft / rev');

    var chartData = {
      labels: ['Revs / Mile', 'Revs / KM', 'Loaded Circumference (in)'],
      values: [Math.round(res.revs_mile), Math.round(res.revs_km), parseFloat(res.circ_loaded.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        revs_per_mile: Math.round(res.revs_mile) + ' revs/mi',
        revs_per_km: Math.round(res.revs_km) + ' revs/km',
        loaded_diameter: res.diam_loaded.toFixed(2) + ' in'
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
          label: 'Rotation Metric',
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
    document.getElementById('input_width').value = 225;
    document.getElementById('input_aspect_ratio').value = 50;
    document.getElementById('input_rim_diameter').value = 17;
    document.getElementById('input_load_deflection').value = 3.0;
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

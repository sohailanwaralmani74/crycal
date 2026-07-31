(function() {

  var chartInstance = null;
  var lastChartData = null;

  var UNIT_CONVERSIONS = {
    feet: 1,
    inches: 1 / 12,
    yards: 3,
    meters: 3.28084
  };

  function getInputs() {
    var length = parseFloat(document.getElementById('input_length').value) || 0;
    var width = parseFloat(document.getElementById('input_width').value) || 0;
    var height = parseFloat(document.getElementById('input_height').value) || 0;
    var unit = document.getElementById('input_unit')?.value || 'feet';
    var quantity = parseInt(document.getElementById('input_quantity').value) || 1;

    return {
      length: length,
      width: width,
      height: height,
      unit: unit,
      quantity: Math.max(1, quantity)
    };
  }

  function formatNumber(value, decimals) {
    decimals = decimals || 2;
    if (value >= 1000) {
      return value.toFixed(0).toLocaleString();
    }
    return value.toFixed(decimals);
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  var ALL_OUTPUTS = ['cubicFeet', 'cubicInches', 'cubicYards', 'cubicMeters'];

  function clearOutputs() {
    ALL_OUTPUTS.forEach(function(id) { setOutputText('output_' + id, '—'); });
  }

  function calculateCubicFeet(inputs) {
    if (inputs.length <= 0 || inputs.width <= 0 || inputs.height <= 0) {
      return { error: 'Enter valid length, width, and height' };
    }

    // Convert to feet
    var conversionFactor = UNIT_CONVERSIONS[inputs.unit] || 1;
    var lengthFt = inputs.length * conversionFactor;
    var widthFt = inputs.width * conversionFactor;
    var heightFt = inputs.height * conversionFactor;

    // Calculate volume in cubic feet
    var volumePerItem = lengthFt * widthFt * heightFt;
    var totalVolume = volumePerItem * inputs.quantity;

    // Convert to other units
    var cubicInches = totalVolume * 1728;
    var cubicYards = totalVolume / 27;
    var cubicMeters = totalVolume / 35.315;

    return {
      cubicFeet: totalVolume,
      cubicInches: cubicInches,
      cubicYards: cubicYards,
      cubicMeters: cubicMeters,
      lengthFt: lengthFt,
      widthFt: widthFt,
      heightFt: heightFt,
      quantity: inputs.quantity,
      volumePerItem: volumePerItem,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.length <= 0 || inputs.width <= 0 || inputs.height <= 0) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateCubicFeet(inputs);

    if (result.error) {
      clearOutputs();
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_cubicFeet', formatNumber(result.cubicFeet) + ' ft³');
    setOutputText('output_cubicInches', formatNumber(result.cubicInches) + ' in³');
    setOutputText('output_cubicYards', formatNumber(result.cubicYards) + ' yd³');
    setOutputText('output_cubicMeters', formatNumber(result.cubicMeters) + ' m³');

    var chartPayload = {
      length: result.lengthFt,
      width: result.widthFt,
      height: result.heightFt,
      quantity: result.quantity,
      volumePerItem: result.volumePerItem,
      cubicFeet: result.cubicFeet,
      cubicYards: result.cubicYards,
      cubicMeters: result.cubicMeters,
      cubicInches: result.cubicInches
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    // Log history
    if (typeof window.logHistory === 'function') {
      window.logHistory({
        length: inputs.length,
        width: inputs.width,
        height: inputs.height,
        unit: inputs.unit,
        quantity: inputs.quantity,
        cubicFeet: result.cubicFeet,
        cubicYards: result.cubicYards,
        cubicMeters: result.cubicMeters
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
    var chartData = generateChartData(data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(data) {
    if (!data || !data.cubicFeet) return null;

    // Show dimension breakdown (length, width, height)
    var labels = ['Length', 'Width', 'Height'];
    var values = [data.length, data.width, data.height];

    // If multiple items, also show volume breakdown
    if (data.quantity > 1) {
      return {
        type: 'bar',
        data: {
          labels: ['Volume Per Item', 'Total Volume (ft³)'],
          datasets: [{
            label: 'Volume Breakdown',
            data: [data.volumePerItem, data.cubicFeet],
            backgroundColor: ['rgba(74, 144, 217, 0.7)', 'rgba(40, 167, 69, 0.7)'],
            borderColor: ['#4A90D9', '#28a745'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Volume Breakdown (' + data.quantity + ' items)', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 10 } } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: function(v) { return v.toFixed(1) + ' ft³'; } } }
          }
        }
      };
    }

    // Single item: show dimensions
    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Dimensions (ft)',
          data: values,
          backgroundColor: ['rgba(74, 144, 217, 0.7)', 'rgba(40, 167, 69, 0.7)', 'rgba(255, 193, 7, 0.7)'],
          borderColor: ['#4A90D9', '#28a745', '#ffc107'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Dimension Breakdown', font: { size: 14, color: '#e8edf0' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: function(v) { return v.toFixed(1) + ' ft'; } } }
        }
      }
    };
  }

  function resetTool() {
    var _el_length = document.getElementById('input_length');
    _el_length.value = (_el_length.dataset && _el_length.dataset.default !== undefined) ? _el_length.dataset.default : (_el_length.getAttribute('value') || '');
    var _el_width = document.getElementById('input_width');
    _el_width.value = (_el_width.dataset && _el_width.dataset.default !== undefined) ? _el_width.dataset.default : (_el_width.getAttribute('value') || '');
    var _el_height = document.getElementById('input_height');
    _el_height.value = (_el_height.dataset && _el_height.dataset.default !== undefined) ? _el_height.dataset.default : (_el_height.getAttribute('value') || '');
    var _el_unit = document.getElementById('input_unit');
    if (_el_unit) {
      var defaultUnit = (_el_unit.dataset && _el_unit.dataset.default !== undefined) ? _el_unit.dataset.default : (_el_unit.getAttribute('value') || 'feet');
      _el_unit.value = defaultUnit;
    }
    var _el_quantity = document.getElementById('input_quantity');
    _el_quantity.value = (_el_quantity.dataset && _el_quantity.dataset.default !== undefined) ? _el_quantity.dataset.default : (_el_quantity.getAttribute('value') || '');
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    // Handle unit change
    var unitSelect = document.getElementById('input_unit');
    if (unitSelect) {
      unitSelect.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }

    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();
(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      trip_distance: parseFloat(document.getElementById('input_trip_distance').value) || 600,
      is_round_trip: parseFloat(document.getElementById('input_is_round_trip').value) || 2,
      vehicle_mpg: parseFloat(document.getElementById('input_vehicle_mpg').value) || 25.0,
      gas_price: parseFloat(document.getElementById('input_gas_price').value) || 3.60,
      num_passengers: parseInt(document.getElementById('input_num_passengers').value) || 3
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

  function calculateFuel(inp) {
    var total_miles = inp.trip_distance * inp.is_round_trip;
    var total_gallons = total_miles / Math.max(1, inp.vehicle_mpg);
    var total_cost = total_gallons * inp.gas_price;
    var cost_per_person = total_cost / Math.max(1, inp.num_passengers);
    var cost_per_mile = total_cost / Math.max(1, total_miles);

    return {
      total_miles: total_miles,
      total_gallons: total_gallons,
      total_cost: total_cost,
      cost_per_person: cost_per_person,
      cost_per_mile: cost_per_mile
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateFuel(inp);

    setOutputText('output_total_fuel_cost', formatCurrency(res.total_cost));
    setOutputText('output_cost_per_passenger', formatCurrency(res.cost_per_person) + ' / person');
    setOutputText('output_total_gallons', res.total_gallons.toFixed(1) + ' gallons');
    setOutputText('output_cost_per_mile', formatCurrency(res.cost_per_mile) + ' / mile');
    setOutputText('output_total_trip_miles', Math.round(res.total_miles).toLocaleString() + ' miles');

    var passengerLabels = [];
    var passengerValues = [];
    for (var i = 1; i <= inp.num_passengers; i++) {
      passengerLabels.push('Person ' + i);
      passengerValues.push(parseFloat(res.cost_per_person.toFixed(2)));
    }

    var chartData = {
      labels: passengerLabels,
      values: passengerValues
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        total_fuel_cost: formatCurrency(res.total_cost),
        cost_per_passenger: formatCurrency(res.cost_per_person),
        total_gallons: res.total_gallons.toFixed(1) + ' gal'
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
          label: 'Passenger Cost Share ',
          data: data.values,
          backgroundColor: '#4A90D9'
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
    document.getElementById('input_trip_distance').value = 600;
    document.getElementById('input_is_round_trip').value = "2";
    document.getElementById('input_vehicle_mpg').value = 25.0;
    document.getElementById('input_gas_price').value = 3.60;
    document.getElementById('input_num_passengers').value = 3;
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

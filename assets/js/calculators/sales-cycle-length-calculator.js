(function() {
  let chart;
  
  function updateTool() {
    const d = parseFloat(document.getElementById('input_total_days').value) || 0;
    const n = parseFloat(document.getElementById('input_number_deals').value) || 0;
    
    const avg = n > 0 ? (d / n).toFixed(2) : 0;
    document.getElementById('output_average_cycle').value = avg;
    
    if (window.logHistory) {
      window.logHistory([d, n, avg]);
    }
    updateChart(d, n, avg);
  }
  
  function updateChart(d, n, avg) {
    const ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Avg Cycle'],
        datasets: [{
          label: 'Days',
          data: [avg]
        }]
      }
    });
  }
  
  function resetTool() {
    document.getElementById('input_total_days').value = '';
    document.getElementById('input_number_deals').value = '';
    document.getElementById('output_average_cycle').value = '';
    if (chart) chart.destroy();
  }
  
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = function(tab) {};
})();

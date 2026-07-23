(function() {
  let chart;
  
  function updateTool() {
    const v = parseFloat(document.getElementById('input_visitors').value) || 0;
    const l = parseFloat(document.getElementById('input_leads').value) || 0;
    
    const rate = v > 0 ? ((l / v) * 100).toFixed(2) : 0;
    document.getElementById('output_conversion_rate').value = rate;
    
    if (window.logHistory) {
      window.logHistory([v, l, rate]);
    }
    updateChart(v, l);
  }
  
  function updateChart(v, l) {
    const ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Visitors', 'Leads'],
        datasets: [{
          label: 'Count',
          data: [v, l]
        }]
      }
    });
  }
  
  function resetTool() {
    document.getElementById('input_visitors').value = '';
    document.getElementById('input_leads').value = '';
    document.getElementById('output_conversion_rate').value = '';
    if (chart) chart.destroy();
  }
  
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = function(tab) {};
})();

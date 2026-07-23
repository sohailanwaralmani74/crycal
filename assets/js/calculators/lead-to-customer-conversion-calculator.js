(function() {
  let chart;
  
  function updateTool() {
    const l = parseFloat(document.getElementById('input_total_leads').value) || 0;
    const c = parseFloat(document.getElementById('input_new_customers').value) || 0;
    
    const rate = l > 0 ? ((c / l) * 100).toFixed(2) : 0;
    document.getElementById('output_l2c_rate').value = rate;
    
    if (window.logHistory) {
      window.logHistory([l, c, rate]);
    }
    updateChart(l, c);
  }
  
  function updateChart(l, c) {
    const ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Lost Leads', 'Customers'],
        datasets: [{
          data: [l - c, c]
        }]
      }
    });
  }
  
  function resetTool() {
    document.getElementById('input_total_leads').value = '';
    document.getElementById('input_new_customers').value = '';
    document.getElementById('output_l2c_rate').value = '';
    if (chart) chart.destroy();
  }
  
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = function(tab) {};
})();

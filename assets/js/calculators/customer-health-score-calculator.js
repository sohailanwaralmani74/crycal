(function() {
  let chart;
  
  function updateTool() {
    const u = parseFloat(document.getElementById('input_product_usage').value) || 0;
    const s = parseFloat(document.getElementById('input_support_tickets').value) || 0;
    const f = parseFloat(document.getElementById('input_customer_feedback').value) || 0;
    
    const health = ((u + s + f) / 3).toFixed(2);
    document.getElementById('output_health_score').value = health;
    
    if (window.logHistory) {
      window.logHistory([u, s, f, health]);
    }
    updateChart(u, s, f, health);
  }
  
  function updateChart(u, s, f, health) {
    const ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Usage', 'Support', 'Feedback', 'Total Health'],
        datasets: [{
          label: 'Scores',
          data: [u, s, f, health]
        }]
      }
    });
  }
  
  function resetTool() {
    document.getElementById('input_product_usage').value = '';
    document.getElementById('input_support_tickets').value = '';
    document.getElementById('input_customer_feedback').value = '';
    document.getElementById('output_health_score').value = '';
    if (chart) chart.destroy();
  }
  
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = function(tab) {};
})();

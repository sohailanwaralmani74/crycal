(function() {
  let chart;
  
  function updateTool() {
    const o = parseFloat(document.getElementById('input_onboarding_days').value) || 0;
    const i = parseFloat(document.getElementById('input_implementation_days').value) || 0;
    
    const ttv = (o + i).toFixed(2);
    document.getElementById('output_ttv').value = ttv;
    
    if (window.logHistory) {
      window.logHistory([o, i, ttv]);
    }
    updateChart(o, i);
  }
  
  function updateChart(o, i) {
    const ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Onboarding', 'Implementation'],
        datasets: [{
          data: [o, i]
        }]
      }
    });
  }
  
  function resetTool() {
    document.getElementById('input_onboarding_days').value = '';
    document.getElementById('input_implementation_days').value = '';
    document.getElementById('output_ttv').value = '';
    if (chart) chart.destroy();
  }
  
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = function(tab) {};
})();

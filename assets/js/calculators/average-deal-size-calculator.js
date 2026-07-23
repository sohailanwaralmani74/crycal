(function() {
    let currentChart = null;

    function calculate() {
        const rev = parseFloat(document.getElementById('input_total_revenue').value);
        const deals = parseFloat(document.getElementById('input_number_of_deals').value);
        
        if (isNaN(rev) || isNaN(deals) || deals === 0) return;

        const avg = rev / deals;
        
        document.getElementById('output_average_deal_size').value = avg.toFixed(2);
        window.logHistory([rev, deals, avg.toFixed(2)]);
        updateChart(avg);
    }

    function updateChart(avg) {
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (currentChart) currentChart.destroy();
        
        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Average Deal Size'],
                datasets: [{
                    label: 'Value ($)',
                    data: [avg],
                    backgroundColor: ['#007bff']
                }]
            }
        });
    }

    window.updateTool = calculate;
    window.resetTool = function() {
        document.getElementById('input_total_revenue').value = '';
        document.getElementById('input_number_of_deals').value = '';
        document.getElementById('output_average_deal_size').value = '';
        if (currentChart) currentChart.destroy();
    };
    window.switchChartTab = function(tabId) {};

    document.getElementById('input_total_revenue').addEventListener('input', calculate);
    document.getElementById('input_number_of_deals').addEventListener('input', calculate);
})();

(function() {
    let currentChart = null;

    function calculate() {
        const wonDeals = parseFloat(document.getElementById('input_won_deals').value);
        const totalOpp = parseFloat(document.getElementById('input_total_opportunities').value);
        
        if (isNaN(wonDeals) || isNaN(totalOpp) || totalOpp === 0) return;

        const winRate = (wonDeals / totalOpp) * 100;
        
        document.getElementById('output_win_rate').value = winRate.toFixed(2);

        window.logHistory([wonDeals, totalOpp, winRate.toFixed(2)]);
        updateChart(wonDeals, totalOpp - wonDeals);
    }

    function updateChart(won, lost) {
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (currentChart) currentChart.destroy();
        
        currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Won Deals', 'Lost Deals'],
                datasets: [{
                    data: [won, lost],
                    backgroundColor: ['#28a745', '#dc3545']
                }]
            }
        });
    }

    window.updateTool = calculate;
    window.resetTool = function() {
        document.getElementById('input_won_deals').value = '';
        document.getElementById('input_total_opportunities').value = '';
        document.getElementById('output_win_rate').value = '';
        if (currentChart) currentChart.destroy();
    };
    window.switchChartTab = function(tabId) {
        // Simple mock for tab switching
        console.log("Switched to tab:", tabId);
    };

    document.getElementById('input_won_deals').addEventListener('input', calculate);
    document.getElementById('input_total_opportunities').addEventListener('input', calculate);
})();

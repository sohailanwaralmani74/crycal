(function() {
    let currentChart = null;

    function calculate() {
        const achieved = parseFloat(document.getElementById('input_achieved_sales').value);
        const quota = parseFloat(document.getElementById('input_sales_quota').value);
        
        if (isNaN(achieved) || isNaN(quota) || quota === 0) return;

        const attainment = (achieved / quota) * 100;
        
        document.getElementById('output_quota_attainment').value = attainment.toFixed(2);
        window.logHistory([achieved, quota, attainment.toFixed(2)]);
        updateChart(achieved, Math.max(0, quota - achieved));
    }

    function updateChart(achieved, remaining) {
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (currentChart) currentChart.destroy();
        
        currentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Achieved', 'Remaining'],
                datasets: [{
                    data: [achieved, remaining],
                    backgroundColor: ['#28a745', '#e9ecef']
                }]
            }
        });
    }

    window.updateTool = calculate;
    window.resetTool = function() {
        document.getElementById('input_achieved_sales').value = '';
        document.getElementById('input_sales_quota').value = '';
        document.getElementById('output_quota_attainment').value = '';
        if (currentChart) currentChart.destroy();
    };
    window.switchChartTab = function(tabId) {};

    document.getElementById('input_achieved_sales').addEventListener('input', calculate);
    document.getElementById('input_sales_quota').addEventListener('input', calculate);
})();

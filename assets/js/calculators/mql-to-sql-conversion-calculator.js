(function() {
    let currentChart = null;

    function calculate() {
        const mqls = parseFloat(document.getElementById('input_mqls').value);
        const sqls = parseFloat(document.getElementById('input_sqls').value);
        
        if (isNaN(mqls) || isNaN(sqls) || mqls === 0) return;

        const rate = (sqls / mqls) * 100;
        
        document.getElementById('output_conversion_rate').value = rate.toFixed(2);
        window.logHistory([mqls, sqls, rate.toFixed(2)]);
        updateChart(sqls, mqls - sqls);
    }

    function updateChart(sqls, dropoff) {
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (currentChart) currentChart.destroy();
        
        currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Converted to SQL', 'Dropped/Disqualified'],
                datasets: [{
                    data: [sqls, dropoff],
                    backgroundColor: ['#007bff', '#6c757d']
                }]
            }
        });
    }

    window.updateTool = calculate;
    window.resetTool = function() {
        document.getElementById('input_mqls').value = '';
        document.getElementById('input_sqls').value = '';
        document.getElementById('output_conversion_rate').value = '';
        if (currentChart) currentChart.destroy();
    };
    window.switchChartTab = function(tabId) {};

    document.getElementById('input_mqls').addEventListener('input', calculate);
    document.getElementById('input_sqls').addEventListener('input', calculate);
})();

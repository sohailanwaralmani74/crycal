(function() {
    let currentChart = null;

    function calculate() {
        const pipe = parseFloat(document.getElementById('input_pipeline_value').value);
        const target = parseFloat(document.getElementById('input_sales_target').value);
        
        if (isNaN(pipe) || isNaN(target) || target === 0) return;

        const ratio = pipe / target;
        
        document.getElementById('output_coverage_ratio').value = ratio.toFixed(2);
        window.logHistory([pipe, target, ratio.toFixed(2)]);
        updateChart(pipe, target);
    }

    function updateChart(pipe, target) {
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (currentChart) currentChart.destroy();
        
        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pipeline', 'Target'],
                datasets: [{
                    label: 'Value ($)',
                    data: [pipe, target],
                    backgroundColor: ['#17a2b8', '#ffc107']
                }]
            }
        });
    }

    window.updateTool = calculate;
    window.resetTool = function() {
        document.getElementById('input_pipeline_value').value = '';
        document.getElementById('input_sales_target').value = '';
        document.getElementById('output_coverage_ratio').value = '';
        if (currentChart) currentChart.destroy();
    };
    window.switchChartTab = function(tabId) {};

    document.getElementById('input_pipeline_value').addEventListener('input', calculate);
    document.getElementById('input_sales_target').addEventListener('input', calculate);
})();

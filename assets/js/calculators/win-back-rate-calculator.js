(function() {
    let chartInstance = null;

    function calculate() {
        const churnedPool = parseFloat(document.getElementById('input_total_churned_pool').value) || 0;
        const reactivated = parseFloat(document.getElementById('input_reactivated_customers').value) || 0;

        if (reactivated > churnedPool) {
            alert('Reactivated customers cannot exceed the total churned pool.');
            return;
        }

        const winBackRate = churnedPool > 0 ? (reactivated / churnedPool) * 100 : 0;
        const unrecovered = churnedPool - reactivated;

        document.getElementById('output_win_back_rate').innerText = winBackRate.toFixed(2);
        document.getElementById('output_unrecovered_customers').innerText = unrecovered.toFixed(0);

        updateChart(reactivated, unrecovered);

        if (typeof window.logHistory === 'function') {
            window.logHistory([
                churnedPool,
                reactivated,
                winBackRate.toFixed(2) + '%',
                unrecovered
            ]);
        }
    }

    function updateChart(reactivated, unrecovered) {
        const ctx = document.getElementById('chartCanvas');
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Reactivated', 'Unrecovered'],
                datasets: [{
                    data: [reactivated, unrecovered],
                    backgroundColor: ['#27ae60', '#95a5a6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    window.updateTool = calculate;

    window.resetTool = function() {
        document.getElementById('input_total_churned_pool').value = '500';
        document.getElementById('input_reactivated_customers').value = '25';
        calculate();
    };

    window.switchChartTab = function(tabId) {
        const tabs = document.querySelectorAll('.chart-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[onclick="window.switchChartTab('${tabId}')"]`).classList.add('active');
        calculate();
    };

    document.addEventListener('DOMContentLoaded', calculate);
})();

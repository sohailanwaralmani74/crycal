(function() {
    let chartInstance = null;

    function calculate() {
        const totalChurned = parseFloat(document.getElementById('input_total_churned').value) || 0;
        const involuntaryChurned = parseFloat(document.getElementById('input_involuntary_churned').value) || 0;

        if (involuntaryChurned > totalChurned) {
            alert('Involuntary churned cannot be greater than total churned.');
            return;
        }

        const voluntaryChurned = totalChurned - involuntaryChurned;
        const voluntaryRate = totalChurned > 0 ? (voluntaryChurned / totalChurned) * 100 : 0;
        const involuntaryRate = totalChurned > 0 ? (involuntaryChurned / totalChurned) * 100 : 0;

        document.getElementById('output_voluntary_churned').innerText = voluntaryChurned.toFixed(0);
        document.getElementById('output_voluntary_rate').innerText = voluntaryRate.toFixed(2);
        document.getElementById('output_involuntary_rate').innerText = involuntaryRate.toFixed(2);

        updateChart(voluntaryChurned, involuntaryChurned);

        if (typeof window.logHistory === 'function') {
            window.logHistory([
                totalChurned,
                involuntaryChurned,
                voluntaryChurned,
                voluntaryRate.toFixed(2) + '%',
                involuntaryRate.toFixed(2) + '%'
            ]);
        }
    }

    function updateChart(voluntary, involuntary) {
        const ctx = document.getElementById('chartCanvas');
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Voluntary Churn', 'Involuntary Churn'],
                datasets: [{
                    data: [voluntary, involuntary],
                    backgroundColor: ['#e74c3c', '#f39c12']
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
        document.getElementById('input_total_churned').value = '100';
        document.getElementById('input_involuntary_churned').value = '20';
        calculate();
    };

    window.switchChartTab = function(tabId) {
        const tabs = document.querySelectorAll('.chart-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[onclick="window.switchChartTab('${tabId}')"]`).classList.add('active');
        // Both tabs could just show the same pie chart or a bar chart, we keep it simple here
        calculate();
    };

    document.addEventListener('DOMContentLoaded', calculate);
})();

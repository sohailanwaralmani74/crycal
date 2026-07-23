(function() {
    let chartInstance = null;

    function calculate() {
        const totalChurned = parseFloat(document.getElementById('input_total_churned').value) || 0;
        const earlyChurn = parseFloat(document.getElementById('input_month_1_to_3').value) || 0;
        const renewalChurn = parseFloat(document.getElementById('input_month_11_to_12').value) || 0;

        if (earlyChurn + renewalChurn > totalChurned) {
            alert('Sum of early and renewal churn cannot exceed total churn.');
            return;
        }

        const midTermChurn = totalChurned - earlyChurn - renewalChurn;

        const earlyRate = totalChurned > 0 ? (earlyChurn / totalChurned) * 100 : 0;
        const renewalRate = totalChurned > 0 ? (renewalChurn / totalChurned) * 100 : 0;
        const midTermRate = totalChurned > 0 ? (midTermChurn / totalChurned) * 100 : 0;

        document.getElementById('output_early_churn_rate').innerText = earlyRate.toFixed(2);
        document.getElementById('output_renewal_churn_rate').innerText = renewalRate.toFixed(2);
        document.getElementById('output_mid_term_churn_rate').innerText = midTermRate.toFixed(2);

        updateChart(earlyRate, midTermRate, renewalRate);

        if (typeof window.logHistory === 'function') {
            window.logHistory([
                totalChurned,
                earlyChurn,
                renewalChurn,
                earlyRate.toFixed(2) + '%',
                renewalRate.toFixed(2) + '%'
            ]);
        }
    }

    function updateChart(early, mid, late) {
        const ctx = document.getElementById('chartCanvas');
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Early (Months 1-3)', 'Mid-Term (4-10)', 'Renewal (11-12)'],
                datasets: [{
                    data: [early, mid, late],
                    backgroundColor: ['#e74c3c', '#f1c40f', '#3498db']
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
        document.getElementById('input_month_1_to_3').value = '15';
        document.getElementById('input_month_11_to_12').value = '70';
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

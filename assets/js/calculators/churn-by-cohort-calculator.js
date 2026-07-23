(function() {
    let chartInstance = null;

    function calculate() {
        const startingUsers = parseFloat(document.getElementById('input_starting_users').value) || 0;
        const activeUsers = parseFloat(document.getElementById('input_active_users').value) || 0;

        if (activeUsers > startingUsers) {
            alert('Active users cannot be greater than starting users.');
            return;
        }

        const churnedUsers = startingUsers - activeUsers;
        const churnRate = startingUsers > 0 ? (churnedUsers / startingUsers) * 100 : 0;
        const retentionRate = startingUsers > 0 ? (activeUsers / startingUsers) * 100 : 0;

        document.getElementById('output_churned_users').innerText = churnedUsers.toFixed(0);
        document.getElementById('output_cohort_churn_rate').innerText = churnRate.toFixed(2);
        document.getElementById('output_retention_rate').innerText = retentionRate.toFixed(2);

        updateChart(activeUsers, churnedUsers);

        if (typeof window.logHistory === 'function') {
            window.logHistory([
                startingUsers,
                activeUsers,
                churnedUsers,
                churnRate.toFixed(2) + '%',
                retentionRate.toFixed(2) + '%'
            ]);
        }
    }

    function updateChart(active, churned) {
        const ctx = document.getElementById('chartCanvas');
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Retained Users', 'Churned Users'],
                datasets: [{
                    data: [active, churned],
                    backgroundColor: ['#2ecc71', '#e74c3c']
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
        document.getElementById('input_starting_users').value = '500';
        document.getElementById('input_active_users').value = '400';
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

(function() {
    let chartInstance = null;

    function calculate() {
        const startSeats = parseFloat(document.getElementById('input_start_seats').value) || 0;
        const addedSeats = parseFloat(document.getElementById('input_added_seats').value) || 0;
        const endSeats = parseFloat(document.getElementById('input_end_seats').value) || 0;

        const expectedSeats = startSeats + addedSeats;
        const churnedSeats = expectedSeats - endSeats;
        const churnRate = startSeats > 0 ? (churnedSeats / startSeats) * 100 : 0;
        const netGrowth = addedSeats - churnedSeats;

        document.getElementById('output_churned_seats').innerText = churnedSeats.toFixed(0);
        document.getElementById('output_seat_churn_rate').innerText = churnRate.toFixed(2);
        document.getElementById('output_net_seat_growth').innerText = netGrowth.toFixed(0);

        updateChart(addedSeats, churnedSeats);

        if (typeof window.logHistory === 'function') {
            window.logHistory([
                startSeats,
                addedSeats,
                endSeats,
                churnedSeats,
                churnRate.toFixed(2) + '%'
            ]);
        }
    }

    function updateChart(added, churned) {
        const ctx = document.getElementById('chartCanvas');
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Added Seats', 'Churned Seats'],
                datasets: [{
                    label: 'Seat Changes',
                    data: [added, churned],
                    backgroundColor: ['#3498db', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    window.updateTool = calculate;

    window.resetTool = function() {
        document.getElementById('input_start_seats').value = '1000';
        document.getElementById('input_added_seats').value = '150';
        document.getElementById('input_end_seats').value = '1050';
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

(function() {
    let chart;
    window.updateTool = function() {
        const length = parseFloat(document.getElementById('input_cycle_length').value) || 0;
        const ae = parseFloat(document.getElementById('input_ae_cost').value) || 0;
        const sdr = parseFloat(document.getElementById('input_sdr_cost').value) || 0;
        
        const total = length * (ae + sdr);
        const monthly = (total / length) * 30;

        document.getElementById('output_total_cost').innerText = '$' + total.toFixed(2);
        document.getElementById('output_monthly_run_rate').innerText = '$' + monthly.toFixed(2);

        updateChart(length * ae, length * sdr);
        window.logHistory({
            cycle_length: length,
            ae_cost: ae,
            total_cost: '$' + total.toFixed(2)
        });
    };

    function updateChart(aeTotal, sdrTotal) {
        const ctx = document.getElementById('chart_costChart');
        if (!ctx) return;
        const activeTab = document.querySelector('.chart-tab.active')?.dataset.tab || 'breakdown';
        
        if (chart) chart.destroy();
        
        if (activeTab === 'breakdown') {
            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['AE Cost', 'SDR Cost'],
                    datasets: [{
                        data: [aeTotal, sdrTotal],
                        backgroundColor: ['#10b981', '#f59e0b']
                    }]
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Costs'],
                    datasets: [
                        { label: 'AE Total', data: [aeTotal], backgroundColor: '#10b981' },
                        { label: 'SDR Total', data: [sdrTotal], backgroundColor: '#f59e0b' }
                    ]
                }
            });
        }
    }

    window.switchChartTab = function(tabId) {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        window.updateTool();
    };

    window.resetTool = function() {
        document.getElementById('input_cycle_length').value = '90';
        document.getElementById('input_ae_cost').value = '500';
        document.getElementById('input_sdr_cost').value = '200';
        window.switchChartTab('breakdown');
        window.updateTool();
    };

    setTimeout(window.updateTool, 100);
})();

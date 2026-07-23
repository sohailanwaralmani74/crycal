(function() {
    let chart;
    window.updateTool = function() {
        const quota = parseFloat(document.getElementById('input_annual_quota').value) || 0;
        const ote = parseFloat(document.getElementById('input_annual_ote').value) || 0;
        const ratio = ote > 0 ? quota / ote : 0;
        const commission = quota > 0 ? (ote / 2) / quota * 100 : 0;

        document.getElementById('output_quota_ote_ratio').innerText = ratio.toFixed(2) + 'x';
        document.getElementById('output_commission_rate').innerText = commission.toFixed(2) + '%';

        updateChart(quota, ote);
        window.logHistory({
            annual_quota: quota,
            annual_ote: ote,
            quota_ote_ratio: ratio.toFixed(2) + 'x'
        });
    };

    function updateChart(quota, ote) {
        const ctx = document.getElementById('chart_ratioChart');
        if (!ctx) return;
        const activeTab = document.querySelector('.chart-tab.active')?.dataset.tab || 'breakdown';
        
        if (chart) chart.destroy();
        
        if (activeTab === 'breakdown') {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['OTE', 'Remaining Quota'],
                    datasets: [{
                        data: [ote, Math.max(0, quota - ote)],
                        backgroundColor: ['#3b82f6', '#e5e7eb']
                    }]
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Comparison'],
                    datasets: [
                        { label: 'Quota', data: [quota], backgroundColor: '#10b981' },
                        { label: 'OTE', data: [ote], backgroundColor: '#3b82f6' }
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
        document.getElementById('input_annual_quota').value = '1000000';
        document.getElementById('input_annual_ote').value = '200000';
        window.switchChartTab('breakdown');
        window.updateTool();
    };

    setTimeout(window.updateTool, 100);
})();

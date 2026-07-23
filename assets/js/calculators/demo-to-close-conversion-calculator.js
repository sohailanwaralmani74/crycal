(function() {
    let chart;
    window.updateTool = function() {
        const demos = parseFloat(document.getElementById('input_demos_held').value) || 0;
        const closed = parseFloat(document.getElementById('input_deals_closed').value) || 0;
        const avg = parseFloat(document.getElementById('input_avg_deal_size').value) || 0;
        
        const rate = demos > 0 ? (closed / demos) * 100 : 0;
        const revenue = closed * avg;

        document.getElementById('output_conversion_rate').innerText = rate.toFixed(2) + '%';
        document.getElementById('output_pipeline_value').innerText = '$' + revenue.toFixed(2);

        updateChart(closed, Math.max(0, demos - closed));
        window.logHistory({
            demos_held: demos,
            deals_closed: closed,
            conversion_rate: rate.toFixed(2) + '%'
        });
    };

    function updateChart(closed, lost) {
        const ctx = document.getElementById('chart_convChart');
        if (!ctx) return;
        const activeTab = document.querySelector('.chart-tab.active')?.dataset.tab || 'breakdown';
        
        if (chart) chart.destroy();
        
        if (activeTab === 'breakdown') {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Closed Won', 'Closed Lost / Pipeline'],
                    datasets: [{
                        data: [closed, lost],
                        backgroundColor: ['#10b981', '#ef4444']
                    }]
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Funnel'],
                    datasets: [
                        { label: 'Closed Won', data: [closed], backgroundColor: '#10b981' },
                        { label: 'Lost/Open', data: [lost], backgroundColor: '#ef4444' }
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
        document.getElementById('input_demos_held').value = '100';
        document.getElementById('input_deals_closed').value = '20';
        document.getElementById('input_avg_deal_size').value = '10000';
        window.switchChartTab('breakdown');
        window.updateTool();
    };

    setTimeout(window.updateTool, 100);
})();

(function() {
    let chart;
    window.updateTool = function() {
        const deal = parseFloat(document.getElementById('input_total_deal_size').value) || 0;
        const margin = parseFloat(document.getElementById('input_partner_margin').value) || 0;
        const cost = parseFloat(document.getElementById('input_internal_cost').value) || 0;
        
        const payout = deal * (margin / 100);
        const net = deal - payout - cost;

        document.getElementById('output_partner_payout').innerText = '$' + payout.toFixed(2);
        document.getElementById('output_net_revenue').innerText = '$' + net.toFixed(2);

        updateChart(net, payout, cost);
        window.logHistory({
            total_deal_size: deal,
            partner_margin: margin,
            net_revenue: '$' + net.toFixed(2)
        });
    };

    function updateChart(net, payout, cost) {
        const ctx = document.getElementById('chart_splitChart');
        if (!ctx) return;
        const activeTab = document.querySelector('.chart-tab.active')?.dataset.tab || 'breakdown';
        
        if (chart) chart.destroy();
        
        if (activeTab === 'breakdown') {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Net Revenue', 'Partner Payout', 'Internal Cost'],
                    datasets: [{
                        data: [Math.max(0, net), payout, cost],
                        backgroundColor: ['#10b981', '#3b82f6', '#ef4444']
                    }]
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Split Distribution'],
                    datasets: [
                        { label: 'Net Rev', data: [Math.max(0, net)], backgroundColor: '#10b981' },
                        { label: 'Payout', data: [payout], backgroundColor: '#3b82f6' },
                        { label: 'Cost', data: [cost], backgroundColor: '#ef4444' }
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
        document.getElementById('input_total_deal_size').value = '50000';
        document.getElementById('input_partner_margin').value = '20';
        document.getElementById('input_internal_cost').value = '5000';
        window.switchChartTab('breakdown');
        window.updateTool();
    };

    setTimeout(window.updateTool, 100);
})();

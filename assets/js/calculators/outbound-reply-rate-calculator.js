(function() {
    let chart;
    window.updateTool = function() {
        const sent = parseFloat(document.getElementById('input_emails_sent').value) || 0;
        const replies = parseFloat(document.getElementById('input_replies_received').value) || 0;
        const positive = parseFloat(document.getElementById('input_positive_replies').value) || 0;
        
        const replyRate = sent > 0 ? (replies / sent) * 100 : 0;
        const posRate = sent > 0 ? (positive / sent) * 100 : 0;

        document.getElementById('output_total_reply_rate').innerText = replyRate.toFixed(2) + '%';
        document.getElementById('output_positive_reply_rate').innerText = posRate.toFixed(2) + '%';

        updateChart(sent, replies, positive);
        window.logHistory({
            emails_sent: sent,
            replies_received: replies,
            positive_reply_rate: posRate.toFixed(2) + '%'
        });
    };

    function updateChart(sent, replies, positive) {
        const ctx = document.getElementById('chart_replyChart');
        if (!ctx) return;
        const activeTab = document.querySelector('.chart-tab.active')?.dataset.tab || 'breakdown';
        
        if (chart) chart.destroy();
        
        if (activeTab === 'breakdown') {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Positive', 'Negative/Neutral', 'No Reply'],
                    datasets: [{
                        data: [positive, Math.max(0, replies - positive), Math.max(0, sent - replies)],
                        backgroundColor: ['#10b981', '#f59e0b', '#e5e7eb']
                    }]
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Responses'],
                    datasets: [
                        { label: 'Positive', data: [positive], backgroundColor: '#10b981' },
                        { label: 'Other Replies', data: [Math.max(0, replies - positive)], backgroundColor: '#f59e0b' }
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
        document.getElementById('input_emails_sent').value = '1000';
        document.getElementById('input_replies_received').value = '50';
        document.getElementById('input_positive_replies').value = '10';
        window.switchChartTab('breakdown');
        window.updateTool();
    };

    setTimeout(window.updateTool, 100);
})();

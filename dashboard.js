document.addEventListener('DOMContentLoaded', () => {
    fetchRosterMatrix();
    fetchScrimLogs();

    document.getElementById('refreshBtn').addEventListener('click', () => {
        document.getElementById('lastUpdated').innerText = 'Syncing data matrix...';
        fetchRosterMatrix();
        fetchScrimLogs();
    });

    const modal = document.getElementById('scrimModal');
    document.getElementById('openModalBtn').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById('scrimForm').addEventListener('submit', function(e) {
        e.preventDefault();
        fetch('api/scrim_tracker.php', { method: 'POST', body: new FormData(this) })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                modal.classList.add('hidden');
                this.reset();
                fetchScrimLogs();
            }
        });
    });
});

function fetchRosterMatrix() {
    fetch('api/roster_stats.php').then(res => res.json()).then(players => {
        const container = document.getElementById('rosterGrid');
        container.innerHTML = '';
        players.forEach(p => {
            container.innerHTML += `
                <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 class="text-xl font-display font-black text-white">${p.handle}</h3>
                    <div class="grid grid-cols-3 gap-2 text-center text-xs">
                        <div class="bg-slate-950 p-2 rounded"><strong>${p.kd_ratio}</strong><br><span class="text-slate-400">K/D</span></div>
                        <div class="bg-slate-950 p-2 rounded"><strong>${p.kast_pct}%</strong><br><span class="text-slate-400">KAST</span></div>
                        <div class="bg-slate-950 p-2 rounded"><strong>${p.adr}</strong><br><span class="text-slate-400">ADR</span></div>
                    </div>
                </div>`;
        });
        document.getElementById('lastUpdated').innerText = 'Last updated: Live Sync Clean';
    });
}

function fetchScrimLogs() {
    fetch('api/scrim_tracker.php').then(res => res.json()).then(logs => {
        const tbody = document.getElementById('scrimTableBody');
        tbody.innerHTML = '';
        logs.forEach(log => {
            tbody.innerHTML += `
                <tr>
                    <td class="p-4 font-medium text-white">${log.map_name}</td>
                    <td class="p-4 text-slate-300">${log.opponent}</td>
                    <td class="p-4"><span class="px-2 py-0.5 rounded text-xs font-bold ${log.result === 'WIN'?'bg-emerald-500/10 text-emerald-400':'bg-rose-500/10 text-rose-400'}">${log.result}</span></td>
                    <td class="p-4 text-slate-300">${log.team_score} - ${log.opponent_score}</td>
                    <td class="p-4 text-right text-white font-bold">${log.points_earned}</td>
                </tr>`;
        });
    });
}
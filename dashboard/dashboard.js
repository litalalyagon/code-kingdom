// Password lock logic (moved from index.html)
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const CORRECT_HASH = '532036ad06ac907f62286d563cb088336afa4ef78575529b9e56f6748127aa18';

function setupPasswordLock() {
    const btn = document.getElementById('dashboard-password-btn');
    if (!btn) return; // If not on dashboard page
    btn.onclick = async function() {
        const val = document.getElementById('dashboard-password').value;
        const hash = await hashString(val);
        if (hash === CORRECT_HASH) {
            document.getElementById('password-lock').style.display = 'none';
            document.getElementById('dashboard-content').style.display = '';
        } else {
            document.getElementById('dashboard-password-error').style.display = '';
        }
    };
}
// Dashboard - Puzzle Solve Counter Graph
// Uses modular Firebase API, assumes firebaseConfig.js exports db
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from "../firebase/firebaseConfig.js";

async function loadPuzzleSolveData() {
    const puzzlesCol = collection(db, "whatsapp_puzzles");
    const snapshot = await getDocs(puzzlesCol);
    const data = [];
    snapshot.forEach(doc => {
        const d = doc.data();
        if (d.enabled === false) return;
        if (d.solve_counter !== undefined) {
            data.push({
                id: doc.id,
                solves: d.solve_counter,
                title: d.title || ''
            });
        }
    });
    // Sort by puzzle ID ascending
    data.sort((a, b) => a.id - b.id);
    return data;
}

async function renderPuzzleSolveChart() {
    const puzzleData = await loadPuzzleSolveData();
    const ctx = document.getElementById('puzzleSolveChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: puzzleData.map(d => d.id),
            datasets: [{
                label: 'מספר פתרונות',
                data: puzzleData.map(d => d.solves),
                borderColor: '#376ecb',
                backgroundColor: '#376ecb',
                fill: false,
                tension: 0.2,
                pointRadius: 5,
                pointHoverRadius: 7,
                showLine: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            // context[0].dataIndex gives the index in puzzleData
                            const idx = context[0].dataIndex;
                            const puzzle = puzzleData[idx];
                            return `חידה: ${puzzle.id}${puzzle.title ? ' - ' + puzzle.title : ''}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'מספר חידה' }
                },
                y: {
                    title: { display: true, text: 'מספר פתרונות' },
                    beginAtZero: true,
                    precision: 0,
                    ticks: {
                        stepSize: 1,
                        autoSkip: false,
                        maxTicksLimit: 15
                    }
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupPasswordLock();
    // Only render chart if dashboard-content is visible (after password)
    // Or always render, but keep hidden until unlocked
    renderPuzzleSolveChart();
});

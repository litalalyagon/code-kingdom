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
    const input = document.getElementById('dashboard-password');
    if (!btn || !input) return; // If not on dashboard page

    async function tryLogin() {
        const val = input.value.toUpperCase();
        const hash = await hashString(val);
        if (hash === CORRECT_HASH) {
            document.getElementById('password-lock').style.display = 'none';
            document.getElementById('dashboard-content').style.display = '';
        } else {
            document.getElementById('dashboard-password-error').style.display = '';
        }
    }

    btn.onclick = tryLogin;
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            tryLogin();
        }
    });
}
// Dashboard - Puzzle Solve Counter Graph
// Uses modular Firebase API, assumes firebaseConfig.js exports db
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from "../firebase/firebaseConfig.js";


let puzzleDataCache = null;
let puzzleChart = null;

async function loadPuzzleSolveData(enableCache = true) {
    if (enableCache && puzzleDataCache) return puzzleDataCache;
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
    puzzleDataCache = data;
    return data;
}

function sortPuzzleData(data, bySolvers) {
    const arr = [...data];
    if (bySolvers) {
        arr.sort((a, b) => a.solves - b.solves);
    } else {
        arr.sort((a, b) => a.id - b.id);
    }
    return arr;
}

function getLatestPuzzleId(data) {
    // Find the puzzle with the highest id (assuming id is numeric or stringified number)
    return data.reduce((max, d) => (+d.id > +max ? d.id : max), data[0]?.id);
}

async function renderPuzzleSolveChart(bySolvers = false, enableCache = true) {
    const allData = await loadPuzzleSolveData(enableCache);
    const puzzleData = sortPuzzleData(allData, bySolvers);
    const ctx = document.getElementById('puzzleSolveChart').getContext('2d');
    if (puzzleChart) {
        puzzleChart.destroy();
    }
    // Find latest puzzle id
    const latestId = getLatestPuzzleId(allData);
    // For bySolvers mode, color the latest puzzle differently
    let pointBackgroundColors = puzzleData.map(d => (bySolvers && d.id === latestId) ? '#e74c3c' : '#376ecb');
    let borderColor = '#376ecb';
    let backgroundColor = '#376ecb';
    puzzleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: puzzleData.map(d => d.id),
            datasets: [{
                label: 'מספר פתרונות',
                data: puzzleData.map(d => d.solves),
                borderColor,
                backgroundColor,
                fill: false,
                tension: 0.2,
                pointRadius: 5,
                pointHoverRadius: 7,
                showLine: true,
                pointBackgroundColor: pointBackgroundColors
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
                            const idx = context[0].dataIndex;
                            const puzzle = puzzleData[idx];
                            return `חידה: ${puzzle.id}${puzzle.title ? ' - ' + puzzle.title : ''}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: bySolvers ? 'חידות (ממויינות לפי מספר פותרים)' : 'מספר חידה' }
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
    // Setup chart switch
    const switchEl = document.getElementById('sortBySolversSwitch');
    if (switchEl) {
        switchEl.addEventListener('change', (e) => {
            renderPuzzleSolveChart(e.target.checked);
        });
    }
    renderPuzzleSolveChart();

    // Setup refresh button
    const refreshButton = document.getElementById('refreshButton');
    
    refreshButton.addEventListener('click', async () => {
        // Add rotating class for animation
        refreshButton.classList.add('rotating');
        
        try {
            // Reload data
            await renderPuzzleSolveChart(switchEl.checked, false); // Bypass cache
            
            // Visual feedback for success
            refreshButton.style.backgroundColor = '#27ae60';
            setTimeout(() => {
                refreshButton.style.backgroundColor = '';
            }, 1000);
        } catch (error) {
            console.error('Error refreshing data:', error);
            // Visual feedback for error
            refreshButton.style.backgroundColor = '#e74c3c';
            setTimeout(() => {
                refreshButton.style.backgroundColor = '';
            }, 1000);
        } finally {
            // Remove rotating class after animation
            setTimeout(() => {
                refreshButton.classList.remove('rotating');
            }, 500);
        }
    });
});
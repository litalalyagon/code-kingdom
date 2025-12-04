// Firebase Authentication for Dashboard
import { collection, getDocs, getCountFromServer, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { db } from "../firebase/firebaseConfig.js";

const auth = getAuth();

async function setupAuthLock() {
    const btn = document.getElementById('dashboard-password-btn');
    const input = document.getElementById('dashboard-password');
    const passwordLockEl = document.getElementById('password-lock');
    const errorEl = document.getElementById('dashboard-password-error');
    
    if (!btn || !input || !passwordLockEl) return;

    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Check if user has admin claim
            const idTokenResult = await user.getIdTokenResult();
            if (idTokenResult.claims.admin === true) {
                // User is admin, show dashboard
                passwordLockEl.style.display = 'none';
                document.getElementById('dashboard-content').style.display = '';
                setupSignOutButton();
                // Load dashboard data
                displayUserCount();
                renderPuzzleSolveChart();
            } else {
                // User is authenticated but not admin
                errorEl.textContent = 'רק מנהלים יכולים לגשת לדשבורד';
                errorEl.style.display = '';
                btn.disabled = false;
                btn.textContent = 'כניסה';
                await signOut(auth);
            }
        } else {
            // No user signed in
            passwordLockEl.style.display = '';
            document.getElementById('dashboard-content').style.display = 'none';
            btn.disabled = false;
            btn.textContent = 'כניסה';
        }
    });

    async function tryLogin() {
        const email = input.value.trim();
        const passwordInput = document.getElementById('dashboard-password-password');
        
        if (!passwordInput) {
            errorEl.textContent = 'שדה הסיסמה לא נמצא';
            errorEl.style.display = '';
            return;
        }
        
        const password = passwordInput.value;
        
        if (!email || !password) {
            errorEl.textContent = 'אנא הזן דוא"ל וסיסמה';
            errorEl.style.display = '';
            return;
        }

        try {
            errorEl.style.display = 'none';
            btn.disabled = true;
            btn.textContent = 'כניסה...';
            
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Sign in error:', error);
            let errorMsg = 'דוא"ל או סיסמה שגויים';
            if (error.code === 'auth/user-not-found') {
                errorMsg = 'משתמש לא נמצא';
            } else if (error.code === 'auth/wrong-password') {
                errorMsg = 'סיסמה שגויה';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = 'דוא"ל לא תקין';
            }
            errorEl.textContent = errorMsg;
            errorEl.style.display = '';
            btn.disabled = false;
            btn.textContent = 'כניסה';
        }
    }

    btn.onclick = tryLogin;
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') tryLogin();
    });
    
    // Also add Enter key support to password field
    const passwordInput = document.getElementById('dashboard-password-password');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') tryLogin();
        });
    }
}

function setupSignOutButton() {
    let signOutBtn = document.getElementById('dashboard-signout-btn');
    if (!signOutBtn) {
        // Create sign-out button if it doesn't exist
        const header = document.querySelector('h1');
        if (header) {
            signOutBtn = document.createElement('button');
            signOutBtn.id = 'dashboard-signout-btn';
            signOutBtn.textContent = 'התנתק';
            signOutBtn.style.cssText = 'position:absolute;top:1rem;right:1rem;padding:8px 16px;background:#e74c3c;color:#fff;border:none;border-radius:6px;cursor:pointer;';
            header.parentElement.insertBefore(signOutBtn, header.nextSibling);
        }
    }
    
    if (signOutBtn) {
        signOutBtn.onclick = async () => {
            if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
                await signOut(auth);
                document.getElementById('password-lock').style.display = '';
                document.getElementById('dashboard-content').style.display = 'none';
            }
        };
    }
}



let puzzleDataCache = null;
let puzzleChart = null;

async function loadUserCount() {
    try {
        const usersCol = collection(db, "users");
        const snapshot = await getCountFromServer(usersCol);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error loading user count:', error);
        return 0;
    }
}

async function displayUserCount() {
    try {
        const userCount = await loadUserCount();
        const completedCount = await loadCompletedUserCount();
        
        const userCountEl = document.getElementById('userCount');
        const completedCountEl = document.getElementById('completedUserCount');
        
        if (userCountEl) {
            userCountEl.textContent = userCount;
        }
        if (completedCountEl) {
            completedCountEl.textContent = completedCount;
        }
    } catch (error) {
        console.error('Error displaying user counts:', error);
    }
}

async function loadCompletedUserCount() {
    try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        
        let completedCount = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            // Check if completedStages array has exactly 13 items
            if (Array.isArray(data.completedStages) && data.completedStages.length === 13) {
                completedCount++;
            }
        });
        
        return completedCount;
    } catch (error) {
        console.error('Error loading completed user count:', error);
        return 0;
    }
}

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
    setupAuthLock();
    // Setup chart switch
    const switchEl = document.getElementById('sortBySolversSwitch');
    if (switchEl) {
        switchEl.addEventListener('change', (e) => {
            renderPuzzleSolveChart(e.target.checked);
        });
    }

    // Setup refresh button
    const refreshButton = document.getElementById('refreshButton');
    
    refreshButton.addEventListener('click', async () => {
        // Add rotating class for animation
        refreshButton.classList.add('rotating');
        
        try {
            // Reload data
            await renderPuzzleSolveChart(switchEl.checked, false); // Bypass cache
            await displayUserCount();
            
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
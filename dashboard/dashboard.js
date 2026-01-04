// Firebase Authentication for Dashboard
import { collection, getDocs, getCountFromServer, doc, getDoc, query, where, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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
                document.getElementById('dashboard-content').style.display = 'block';
                setupSignOutButton();
                // Load dashboard data
                displayUserCount();
                renderPuzzleSolveChart();
                renderStagesHistogram();
                loadPuzzleList();
            } else {
                // User is authenticated but not admin
                errorEl.textContent = 'רק מנהלים יכולים לגשת לדשבורד';
                errorEl.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'כניסה';
                await signOut(auth);
            }
        } else {
            // No user signed in
            passwordLockEl.style.display = 'block';
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
            errorEl.style.display = 'block';
            return;
        }
        
        const password = passwordInput.value;
        
        if (!email || !password) {
            errorEl.textContent = 'אנא הזן דוא"ל וסיסמה';
            errorEl.style.display = 'block';
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
            errorEl.style.display = 'block';
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

async function setupAddPuzzleForm() {
    const form = document.getElementById('addPuzzleForm');
    const statusEl = document.getElementById('addPuzzleStatus');
    
    if (!form || !statusEl) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-puzzle-btn');
        const title = document.getElementById('puzzleTitle').value.trim();
        const clue = document.getElementById('puzzleClue').value.trim();
        const answersInput = document.getElementById('puzzleAnswers').value.trim();
        
        // Parse answers from comma-separated string
        const answers = answersInput.split(',').map(a => a.trim()).filter(a => a.length > 0);
        
        if (!title || !clue || answers.length === 0) {
            statusEl.textContent = 'אנא מלא את כל השדות';
            statusEl.className = 'puzzle-status error';
            return;
        }
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> מוסיף...';
            statusEl.style.display = 'none';
            
            // Get all existing puzzles to determine next ID
            const puzzlesCol = collection(db, 'whatsapp_puzzles');
            const snapshot = await getDocs(puzzlesCol);
            
            // Find the highest numeric ID
            let maxId = 0;
            snapshot.forEach((doc) => {
                const id = parseInt(doc.id);
                if (!isNaN(id) && id > maxId) {
                    maxId = id;
                }
            });
            
            const newId = (maxId + 1).toString();
            
            // Create new puzzle object
            const newPuzzle = {
                answers: answers,
                clue: clue,
                title: title,
                date: new Date(),
                solve_counter: 0,
                enabled: false
            };
            
            // Add to Firestore
            await setDoc(doc(db, 'whatsapp_puzzles', newId), newPuzzle);
            
            // Success feedback
            statusEl.textContent = `החידה "${title}" נוספה בהצלחה! מזהה: ${newId}`;
            statusEl.className = 'puzzle-status success';
            
            // Reset form
            form.reset();
            
            // Clear cache and refresh chart
            puzzleDataCache = null;
            await renderPuzzleSolveChart();
            await loadPuzzleList();
            
        } catch (error) {
            console.error('Error adding puzzle:', error);
            statusEl.textContent = 'שגיאה בהוספת החידה: ' + error.message;
            statusEl.className = 'puzzle-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> הוסף חידה';
        }
    });
}

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

let stagesHistogramChart = null;

async function renderStagesHistogram(enableCache = true) {
    try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        
        // Initialize array to count users for each stage (0-13)
        const stagesCounts = new Array(14).fill(0);
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const stagesCount = Array.isArray(data.completedStages) ? data.completedStages.length : 0;
            if (stagesCount >= 0 && stagesCount <= 13) {
                stagesCounts[stagesCount]++;
            }
        });
        
        // Create chart
        const ctx = document.getElementById('stagesHistogramChart');
        if (!ctx) return;
        
        if (stagesHistogramChart) {
            stagesHistogramChart.destroy();
        }
        
        const labels = Array.from({length: 14}, (_, i) => `${i}/13`);
        
        stagesHistogramChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'מספר משתמשים',
                    data: stagesCounts,
                    backgroundColor: stagesCounts.map((_, i) => i === 13 ? '#27ae60' : '#376ecb'),
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'שלבים שהושלמו' }
                    },
                    y: {
                        title: { display: true, text: 'מספר משתמשים' },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering stages histogram:', error);
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
    
    // Initial render of charts (will happen after auth check)
    // These will be called from setupAuthLock when user is authenticated as admin

    // Setup refresh button
    const refreshButton = document.getElementById('refreshButton');
    
    refreshButton.addEventListener('click', async () => {
        // Add rotating class for animation
        refreshButton.classList.add('rotating');
        
        try {
            // Reload data
            await renderPuzzleSolveChart(switchEl.checked, false); // Bypass cache
            await renderStagesHistogram();
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
    
    // Setup add puzzle form
    setupAddPuzzleForm();
});

async function loadPuzzleList() {
    const container = document.getElementById('puzzleListContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">טוען חידות...</div>';
        
        const puzzlesCol = collection(db, 'whatsapp_puzzles');
        const snapshot = await getDocs(puzzlesCol);
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="no-puzzles">אין חידות במערכת</div>';
            return;
        }
        
        const puzzles = [];
        snapshot.forEach(doc => {
            puzzles.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by ID (numeric)
        puzzles.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        
        // Build HTML
        let html = '<div class="puzzle-items">';
        puzzles.forEach(puzzle => {
            const enabled = puzzle.enabled !== false;
            const statusClass = enabled ? 'enabled' : 'disabled';
            const iconClass = enabled ? 'fa-toggle-on' : 'fa-toggle-off';
            
            html += `
                <div class="puzzle-item">
                    <div class="puzzle-info">
                        <span class="puzzle-id">#${puzzle.id}</span>
                        <span class="puzzle-title">${puzzle.title || 'ללא כותרת'}</span>
                        <span class="puzzle-solves">${puzzle.solve_counter || 0} פתרונות</span>
                    </div>
                    <button class="toggle-puzzle-btn ${statusClass}" data-puzzle-id="${puzzle.id}" data-enabled="${enabled}">
                        <i class="fas ${iconClass}"></i>
                    </button>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.toggle-puzzle-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.currentTarget;
                const puzzleId = button.dataset.puzzleId;
                const currentEnabled = button.dataset.enabled === 'true';
                
                await togglePuzzleStatus(puzzleId, currentEnabled, button);
            });
        });
        
    } catch (error) {
        console.error('Error loading puzzle list:', error);
        container.innerHTML = '<div class="error">שגיאה בטעינת החידות</div>';
    }
}

async function togglePuzzleStatus(puzzleId, currentEnabled, buttonEl) {
    const newEnabled = !currentEnabled;
    
    try {
        // Update button to show loading state
        const originalHTML = buttonEl.innerHTML;
        buttonEl.disabled = true;
        buttonEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';
        
        // Update Firestore
        const puzzleRef = doc(db, 'whatsapp_puzzles', puzzleId);
        await updateDoc(puzzleRef, {
            enabled: newEnabled
        });
        
        // Update UI
        const statusClass = newEnabled ? 'enabled' : 'disabled';
        const iconClass = newEnabled ? 'fa-toggle-on' : 'fa-toggle-off';
        
        buttonEl.className = `toggle-puzzle-btn ${statusClass}`;
        buttonEl.dataset.enabled = newEnabled;
        buttonEl.innerHTML = `<i class="fas ${iconClass}"></i>`;
        buttonEl.disabled = false;
        
        // Clear cache and refresh chart
        puzzleDataCache = null;
        await renderPuzzleSolveChart();
        
    } catch (error) {
        console.error('Error toggling puzzle status:', error);
        alert('שגיאה בעדכון סטטוס החידה');
        buttonEl.disabled = false;
        buttonEl.innerHTML = originalHTML;
    }
}
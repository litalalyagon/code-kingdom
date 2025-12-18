import {doc, getDocs, updateDoc, collection, increment } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from "../firebase/firebaseConfig.js";

function markRiddleCompleted(riddleId) {
    const completedRiddles = JSON.parse(localStorage.getItem("completedRiddles") || "[]");

    if (completedRiddles.includes(riddleId)) {
        console.log("Already completed, no increment");
        return false; // don’t increment
    }

    completedRiddles.push(riddleId);
    localStorage.setItem("completedRiddles", JSON.stringify(completedRiddles));

    return true; // safe to increment
}

document.addEventListener('DOMContentLoaded', async function() {
    // const riddleTitle = document.getElementById('riddle-title');
    const form = document.getElementById('answerForm');
    const input = document.getElementById('answerInput');
    const message = document.getElementById('answerMessage');
    const clueMsg = document.getElementById('clueMessage');
    const dropdown = document.getElementById("puzzleDropdown");
    const counter = document.getElementById("solve-counter");
    const hintButton = document.getElementById("hintButton");

    let puzzles = [];
    let currentPuzzle = null;

    async function loadPuzzles() {
        const puzzlesCol = collection(db, "whatsapp_puzzles");
        const snapshot = await getDocs(puzzlesCol);
        puzzles = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let parsedDate = "";
            if (data.date) {
                let d;
                if (typeof data.date === 'object' && typeof data.date.toDate === 'function') {
                    d = data.date.toDate();
                } else {
                    d = new Date(data.date);
                }
                if (d && !isNaN(d.getTime())) {
                    let day = String(d.getDate()).padStart(2, '0');
                    let month = String(d.getMonth() + 1).padStart(2, '0');
                    let year = String(d.getFullYear()).slice(-2);
                    parsedDate = `${day}/${month}/${year}`;
                }
            }
            return {
                id: docSnap.id,
                ...data,
                parsedDate
            };
        });

        // filter only the enabled puzzles
        puzzles = puzzles.filter(p => p.enabled);

        // Sort puzzles by date, newest first
        puzzles.sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(a.date);
            const dateB = b.date?.toDate?.() || new Date(b.date);
            return dateB - dateA;
        });

        dropdown.innerHTML = "";
        puzzles.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.id;
            let dateText = p.parsedDate ? ` (${p.parsedDate})` : "";
            option.textContent = `חידה ${p.id}: ${p.title}${dateText}`;
            dropdown.appendChild(option);
        });

        // select latest puzzle by default (first in sorted array)
        if (puzzles.length > 0) {
            const latestPuzzle = puzzles[0];
            selectPuzzle(latestPuzzle.id);
            dropdown.value = latestPuzzle.id;
        }
    }

    // select puzzle by id
    function selectPuzzle(puzzleId) {
        currentPuzzle = puzzles.find((p) => p.id === puzzleId);
        if (currentPuzzle) {
            // riddleTitle.textContent = `חידה מספר ${currentPuzzle.id}: ${currentPuzzle.title}`;
            clueMsg.style.display = "none";
            // clear any previous success message and show the form/hint again
            message.innerHTML = "";
            if (form) form.style.display = '';
            if (hintButton) hintButton.style.display = '';
            input.value = "";
        //    counter.textContent = `נפתרה ${currentPuzzle.solve_counter} פעמים`;
        }
    }

    // listen for dropdown change
    dropdown.addEventListener("change", (e) => {
        selectPuzzle(e.target.value);
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!currentPuzzle) return;

        clueMsg.style.display = "none";
        if (input.value.trim() === "") {
            message.textContent = "אנא הכניסו תשובה.";
            message.style.color = "#e74c3c";
            message.style.cursor = "default";
        } else {
            const userAnswer = input.value.trim().toLowerCase();
            const isCorrect = currentPuzzle.answers.some(ans => ans.toLowerCase() === userAnswer);

            if (isCorrect) {
                // show success frame and hide the form so user sees the message clearly
                message.innerHTML = `
                    <div class="success-frame">
                        <button class="success-close" aria-label="סגור" title="סגור">&times;</button>
                        <h3>🎉 כל הכבוד! פתרתם את החידה!</h3>
                        <p>נהנתם מהחידה? יש לנו עוד הרבה תוכן מעניין בשבילכם:</p>
                        <div class="success-links">
                            <a href="/digital-games/" class="success-link">משחקי בריחה דיגיטליים לכל המשפחה</a>
                            <a href="/code-kingdom/" class="success-link">ספר התכנות לילדים "אורי והדס בממלכת הקוד"</a>
                        </div>
                        <p class="discount-code">
                            השתמשו בקוד 
                            <strong class="copy-code" data-code="PUZZLE10" title="לחצו להעתקה">PUZZLE10</strong> 
                            לקבלת הנחה על כל האתר! 🎁
                            <span class="copy-feedback"></span>
                        </p>
                    </div>
                `;
                // hide the riddle form and hint button while success frame is visible
                if (form) form.style.display = 'none';
                if (hintButton) hintButton.style.display = 'none';
                message.style.color = "";
                message.style.cursor = "default";
                message.style.textDecoration = "";

                // Add click event for copying discount code
                const codeElement = message.querySelector('.copy-code');
                const feedbackElement = message.querySelector('.copy-feedback');
                codeElement.addEventListener('click', async () => {
                    const code = codeElement.dataset.code;
                    try {
                        await navigator.clipboard.writeText(code);
                        feedbackElement.textContent = ' ✓ הועתק!';
                        feedbackElement.style.color = '#27ae60';
                        setTimeout(() => {
                            feedbackElement.textContent = '';
                        }, 2000);
                    } catch (err) {
                        feedbackElement.textContent = ' שגיאה בהעתקה';
                        feedbackElement.style.color = '#e74c3c';
                    }
                });
                // close (X) button to hide the success message and reveal the form again
                const closeBtn = message.querySelector('.success-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        message.innerHTML = '';
                        if (form) {
                            form.style.display = '';
                            // reset input and focus so user can try again
                            if (input) input.value = '';
                            if (input) input.focus();
                        }
                        if (hintButton) hintButton.style.display = '';
                    });
                }

                // Increment solve counter atomically
                if (markRiddleCompleted(currentPuzzle.id)) {
                    try {
                        const puzzleRef = doc(db, "whatsapp_puzzles", currentPuzzle.id);
                        await updateDoc(puzzleRef, {
                            solve_counter: increment(1)
                        });
                        currentPuzzle.solve_counter += 1; // Update local copy if needed
         //               counter.textContent = `נפתרה ${currentPuzzle.solve_counter} פעמים`;
                    } catch (error) {
                        console.error("Error updating solve counter:", error);
                    }
                }
            } else {
                message.textContent = "תשובה לא נכונה, נסו שוב!";
                message.style.color = "#ea3b28ff";
            }
        }
    });

    // show clue when hint button is clicked
    hintButton.addEventListener('click', function() {
        if (currentPuzzle) {
            clueMsg.textContent = currentPuzzle.clue;
            clueMsg.style.display = "block";
            clueMsg.style.color = "#376ecb";
        }
    });

    // load puzzles from db
    await loadPuzzles();
});
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
    const riddleTitle = document.getElementById('riddle-title');
    const form = document.getElementById('answerForm');
    const input = document.getElementById('answerInput');
    const message = document.getElementById('answerMessage');
    const clueMsg = document.getElementById('clueMessage');
    const dropdown = document.getElementById("puzzleDropdown");
    const counter = document.getElementById("solve-counter");

    let puzzles = [];
    let currentPuzzle = null;
    let lastWrong = false;

    async function loadPuzzles() {
        const puzzlesCol = collection(db, "whatsapp_puzzles");
        const snapshot = await getDocs(puzzlesCol);
        puzzles = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
        }));

        // dropdown.innerHTML = "";
        // puzzles.forEach((p) => {
        //     const option = document.createElement("option");
        //     option.value = p.id;
        //     option.textContent = `חידה ${p.id}: ${p.title}`;
        //     dropdown.appendChild(option);
        // });

        // select last puzzle by defualt
        if (puzzles.length > 0) {
            const lastPuzzle = puzzles[puzzles.length - 1];
            selectPuzzle(lastPuzzle.id);
            // dropdown.value = lastPuzzle.id; 
        }
    }

    // selec puzzle by id
    function selectPuzzle(puzzleId) {
        currentPuzzle = puzzles.find((p) => p.id === puzzleId);
        if (currentPuzzle) {
            riddleTitle.textContent = `חידה מספר ${currentPuzzle.id}: ${currentPuzzle.title}`;
            clueMsg.style.display = "none";
            message.textContent = "";
            input.value = "";
            counter.textContent = `נפתרה ${currentPuzzle.solve_counter} פעמים`;
        }
    }

    // listen for dropdown change
    // dropdown.addEventListener("change", (e) => {
    //     selectPuzzle(e.target.value);
    // });


    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!currentPuzzle) return;

        clueMsg.style.display = "none";
        if (input.value.trim() === "") {
            message.textContent = "אנא הכניסו תשובה.";
            message.style.color = "#e74c3c";
            message.style.cursor = "default";
            lastWrong = false;
        } else if (input.value.trim().toLowerCase() === currentPuzzle.answer.toLowerCase()) {
            message.textContent = "נכון! כל הכבוד 🎉";
            message.style.color = "#27ae60";
            message.style.cursor = "default";
            lastWrong = false;
            
           // Increment solve counter atomically
            if (markRiddleCompleted(currentPuzzle.id)) {
                try {
                    const puzzleRef = doc(db, "whatsapp_puzzles", currentPuzzle.id);
                    await updateDoc(puzzleRef, {
                        solve_counter: increment(1)
                    });
                    currentPuzzle.solve_counter += 1; // Update local copy if needed
                    counter.textContent = `נפתרה ${currentPuzzle.solve_counter} פעמים`;
                } catch (error) {
                    console.error("Error updating solve counter:", error);
                }
            }
        } else {
            message.textContent = "תשובה לא נכונה, נסו שוב. לחצו כאן לקבלת רמז.";
            message.style.color = "#e74c3c";
            message.style.cursor = "pointer";
            lastWrong = true;
        }
    });

    // show clue
    message.addEventListener('click', function() {
        if (lastWrong && currentPuzzle) {
            clueMsg.textContent = currentPuzzle.clue;
            clueMsg.style.display = "block";
            clueMsg.style.color = "#376ecb";
        }
    });

    // load puzzles from db
    await loadPuzzles();
});
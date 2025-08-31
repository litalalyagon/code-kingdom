import {doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from "../firebase/firebaseConfig.js";

document.addEventListener('DOMContentLoaded', async function() {
    const riddleTitle = document.getElementById('riddle-title');
    const form = document.getElementById('answerForm');
    const input = document.getElementById('answerInput');
    const message = document.getElementById('answerMessage');
    const clueMsg = document.getElementById('clueMessage');
    let currentPuzzle = null;
    let lastWrong = false;

    // Fetch the latest puzzle from Firestore
    try {

        const puzzlesRef = doc(db, 'whatsapp_puzzles', 'puzzles');
        const puzzlesDoc = await getDoc(puzzlesRef);
        if (puzzlesDoc.exists()) {
            const puzzlesList = puzzlesDoc.data().puzzles_list;
            currentPuzzle = puzzlesList[puzzlesList.length - 1];
            riddleTitle.textContent = `חידה מספר ${puzzlesList.length}: ${currentPuzzle.title}`;
        }
    } catch (error) {
        console.error("Error fetching puzzle:", error);
        riddleTitle.textContent = "שגיאה בטעינת החידה";
    }

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
        } else {
            message.textContent = "תשובה לא נכונה, נסו שוב. לחצו כאן לקבלת רמז.";
            message.style.color = "#e74c3c";
            message.style.cursor = "pointer";
            lastWrong = true;
        }
    });

    message.addEventListener('click', function() {
        if (lastWrong && currentPuzzle) {
            clueMsg.textContent = currentPuzzle.clue;
            clueMsg.style.display = "block";
            clueMsg.style.color = "#376ecb";
        }
    });
});
async function askQuestion() {

    const questionInput = document.getElementById("question");
    const responseBox = document.getElementById("response");
    const loading = document.getElementById("loading");
    const modeInput = document.getElementById("interviewMode");

    const question = questionInput.value.trim();
    const mode = modeInput.value;

    if (!question) {
        responseBox.innerHTML = `
            <p>Please enter an interview question first.</p>
        `;
        return;
    }

    loading.style.display = "block";
    responseBox.innerHTML = "";

    try {

        const response = await fetch("http://127.0.0.1:8000/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question,
                mode: mode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to get AI response.");
        }

        responseBox.innerHTML = `
            <p><strong>Interview Mode:</strong> ${mode}</p>

            <br>

            <p><strong>AI Answer:</strong></p>

            <p>${data.answer.replace(/\n/g, "<br>")}</p>
        `;

    speakQuestion(data.answer);
    } catch (error) {

        console.error(error);

        responseBox.innerHTML = `
            <p>❌ Failed to connect to AI.</p>
            <p>${error.message}</p>
        `;

    } finally {

        loading.style.display = "none";
    }
}


async function evaluateAnswer() {

    const questionInput = document.getElementById("question");
    const answerInput = document.getElementById("candidateAnswer");
    const evaluationBox = document.getElementById("evaluation");
    const modeInput = document.getElementById("interviewMode");

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const mode = modeInput.value;

    if (!question) {
        evaluationBox.innerHTML = `
            <p>Please enter an interview question first.</p>
        `;
        return;
    }

    if (!answer) {
        evaluationBox.innerHTML = `
            <p>Please write your answer before evaluating.</p>
        `;
        return;
    }

    evaluationBox.innerHTML = `
        <p>Evaluating your answer...</p>
    `;

    try {

        const response = await fetch("http://127.0.0.1:8000/evaluate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question,
                answer: answer,
                mode: mode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Evaluation failed.");
        }

        evaluationBox.innerHTML = `
            <strong>${mode.toUpperCase()} INTERVIEW EVALUATION</strong>

            <br><br>

            ${data.evaluation.replace(/\n/g, "<br>")}
        `;

    } catch (error) {

        console.error(error);

        evaluationBox.innerHTML = `
            <p>❌ Evaluation failed.</p>
            <p>${error.message}</p>
        `;
    }
}


// Press Enter to ask question

document.getElementById("question").addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            askQuestion();
        }

    }
);
// ------------------------------------------
// Voice Input - Test Version
// ------------------------------------------

let recognition = null;

function startVoiceInput() {

    const answerBox = document.getElementById("candidateAnswer");
    const voiceButton = document.querySelector(".voice-btn");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported. Please use Google Chrome.");
        return;
    }

    // Create recognition
    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = function () {

        console.log("🎤 Recognition STARTED");

        voiceButton.textContent = "🛑 Listening...";
        voiceButton.classList.add("recording");
    };

    recognition.onresult = function (event) {

        console.log("🎤 RESULT RECEIVED");

        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            transcript += event.results[i][0].transcript;
        }

        console.log("Recognized:", transcript);

        answerBox.value = transcript;
    };

    recognition.onerror = function (event) {

        console.error("❌ Speech Error:", event.error);

        alert("Speech error: " + event.error);

        voiceButton.textContent = "🎤 Start Speaking";
        voiceButton.classList.remove("recording");
    };

    recognition.onend = function () {

        console.log("🛑 Recognition ENDED");

        voiceButton.textContent = "🎤 Start Speaking";
        voiceButton.classList.remove("recording");
    };

    console.log("Starting recognition...");

    recognition.start();
}// ------------------------------------------
// Text to Speech - AI Question Voice
// ------------------------------------------

function speakQuestion(text) {

    if (!text || text.trim() === "") {
        return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}
function stopSpeaking() {
    window.speechSynthesis.cancel();
}

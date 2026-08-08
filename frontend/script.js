async function askQuestion() {

    const questionInput = document.getElementById("question");
    const responseBox = document.getElementById("response");
    const loading = document.getElementById("loading");

    const question = questionInput.value.trim();

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
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to get AI response.");
        }

        responseBox.innerHTML = `
            <p><strong>Question:</strong></p>
            <p>${data.question}</p>

            <br>

            <p><strong>AI Answer:</strong></p>
            <p>${data.answer.replace(/\n/g, "<br>")}</p>
        `;

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

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

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
                answer: answer
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Evaluation failed.");
        }

        evaluationBox.innerHTML = `
            <strong>AI Evaluation</strong>

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
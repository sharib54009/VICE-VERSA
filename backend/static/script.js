// Use relative URLs so the frontend served by Flask talks to the same origin.
const BASE_URL = "";
// ---------------- TAB SWITCH ---------------- //

function showTab(tab) {

    document.getElementById('login-form')
        .classList.remove('active');

    document.getElementById('signup-form')
        .classList.remove('active');

    document.getElementById(tab + '-form')
        .classList.add('active');
}


// ---------------- LOGIN ---------------- //

async function login() {

    const email =
        document.getElementById("login-email").value;

    const password =
        document.getElementById("login-password").value;

    try {

        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await res.json();

        document.getElementById("message").innerText =
            data.message;

        if (data.success) {

            window.location.href = "/app";
        }

    } catch (err) {
        console.log(err);

        document.getElementById("message").innerText =
            "Server connection failed";
    }
}


// ---------------- SIGNUP ---------------- //

async function signup() {

    const username =
        document.getElementById("signup-username").value;

    const email =
        document.getElementById("signup-email").value;

    const password =
        document.getElementById("signup-password").value;

    try {

        const res = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await res.json();

        document.getElementById("message").innerText =
            data.message;

        if (data.success) {

            window.location.href = "/app";
        }

    } catch (err) {
        console.log(err);
        document.getElementById("message").innerText =
            "Server connection failed";
    }
}


// ---------------- SPEECH TO TEXT ---------------- //

function startSpeech() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Speech recognition not supported");

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.start();

    recognition.onresult = function (e) {

        document.getElementById("main-textarea").value =
            e.results[0][0].transcript;
    };
}


// ---------------- TEXT TO SPEECH ---------------- //

function speakText() {

    const text =
        document.getElementById("main-textarea").value;

    const utter =
        new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utter);
}


// ---------------- CLEAR TEXT ---------------- //

function clearText() {

    document.getElementById("main-textarea").value = "";
}


// ---------------- SAVE TEXT ---------------- //

async function saveText() {

    const text =
        document.getElementById("main-textarea").value;

    try {

        const res = await fetch(`${BASE_URL}/save-text`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text
            })
        });

        const data = await res.json();

        alert(data.message);

    } catch (err) {
        console.log(err);
        alert("Server connection failed");
    }
}


// ---------------- LOAD HISTORY ---------------- //

async function loadHistory() {

    try {

        const res = await fetch(`${BASE_URL}/history`, { credentials: 'include' });

        const data = await res.json();

        const div =
            document.getElementById("history-list");

        div.innerHTML = data.history.map(i => `

            <div style="
                background:#f5f5f5;
                padding:10px;
                margin-bottom:10px;
                border-radius:10px;
                border:1px solid #ddd;
            ">

                <p>${i.text}</p>

                <small>${i.timestamp}</small>

            </div>

        `).join("");

    } catch (err) {

        console.log("History load failed");
        console.log(err);
    }
}
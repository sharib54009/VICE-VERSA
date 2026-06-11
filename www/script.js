const BASE_URL = "https://viceversa-1.onrender.com";

function showTab(tab) {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');

    document.getElementById(tab + '-form').classList.add('active');
}

// LOGIN
async function login() {
    try {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        document.getElementById("message").innerText = data.message;

        if (data.success) {
            window.location.href = "app.html";
        }

    } catch (error) {
        console.error(error);
        document.getElementById("message").innerText =
            "Unable to connect to server";
    }
}

// SIGNUP
async function signup() {
    try {
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

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

        document.getElementById("message").innerText = data.message;

        if (data.success) {
            window.location.href = "app.html";
        }

    } catch (error) {
        console.error(error);
        document.getElementById("message").innerText =
            "Unable to connect to server";
    }
}

// SPEECH TO TEXT
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

// TEXT TO SPEECH
function speakText() {
    const text =
        document.getElementById("main-textarea").value;

    const utter =
        new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utter);
}

// CLEAR TEXT
function clearText() {
    document.getElementById("main-textarea").value = "";
}

// SAVE TEXT
async function saveText() {
    try {
        const text =
            document.getElementById("main-textarea").value;

        const res = await fetch(`${BASE_URL}/save-text`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        const data = await res.json();

        alert(data.message);

    } catch (error) {
        console.error(error);
        alert("Unable to save text");
    }
}

// LOAD HISTORY
async function loadHistory() {
    try {
        const res = await fetch(`${BASE_URL}/history`, {
            credentials: 'include'
        });

        const data = await res.json();

        const div =
            document.getElementById("history-list");

        if (!div) return;

        div.innerHTML = data.history.map(i => `
            <div style="
                background:#f5f5f5;
                padding:10px;
                margin-bottom:10px;
                border-radius:10px;
            ">
                <p>${i.text}</p>
                <small>${i.timestamp}</small>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);
    }
}
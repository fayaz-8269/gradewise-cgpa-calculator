// AIML 5th Semester subjects. Professional elective is one combined row.
const semesterSubjects = {
    aiml: {
        "5": [
            { name: "Entrepreneurship, Management & Finance", credits: 3 },
            { name: "Database Management Systems", credits: 4 },
            { name: "Computer Networks", credits: 3 },
            { name: "Mathematics for Artificial Intelligence", credits: 3 },
            { name: "Computer Networks Laboratory", credits: 2 },
            { name: "Machine Learning Operations / Full Stack Development", credits: 3 },
            { name: "Open Elective", credits: 3 }
        ]
    }
};

function loadSemesterSubjects() {
    const branch = document.getElementById("branchSelect").value;
    const semester = document.getElementById("semesterSelect").value;
    const subjects = semesterSubjects[branch]?.[semester];
    const error = document.getElementById("setupError");

    error.textContent = "";
    if (!subjects) {
        error.textContent = "Subjects are not available for this selection yet.";
        return;
    }

    document.getElementById("subjectCount").value = subjects.length;
    createTable();

    subjects.forEach((subject, index) => {
        document.getElementById(`name${index}`).value = subject.name;
        document.getElementById(`credit${index}`).value = subject.credits;
    });
}

function createTable() {
    const countInput = document.getElementById("subjectCount");
    const n = Number(countInput.value);
    const error = document.getElementById("setupError");

    error.textContent = "";

    if (!Number.isInteger(n) || n < 1 || n > 30) {
        error.textContent = "Enter a whole number between 1 and 30.";
        return;
    }

    let rows = "";

    for (let i = 0; i < n; i++) {
        rows += `
        <tr>
            <td>
                <span class="subject-label">SUB ${i + 1}</span>
                <input type="text" id="name${i}"
                       aria-label="Subject ${i + 1} name"
                       placeholder="Subject name">
            </td>
            <td>
                <input type="number" id="internal${i}"
                       aria-label="Subject ${i + 1} internal marks"
                       min="0" max="50" step="any"
                       placeholder="0–50">
            </td>
            <td>
                <input type="number" id="sem${i}"
                       aria-label="Subject ${i + 1} semester marks"
                       min="0" max="100" step="any"
                       placeholder="0–100">
            </td>
            <td>
                <input type="number" id="credit${i}"
                       aria-label="Subject ${i + 1} credits"
                       min="0.01" max="100" step="any"
                       placeholder="Credits">
            </td>
        </tr>`;
    }

    document.getElementById("subjectTable").innerHTML = rows;
    document.getElementById("subjectsCard").hidden = false;
    document.getElementById("formError").textContent = "";
    document.getElementById("resultCard").style.display = "none";
    document.getElementById("messageCard").style.display = "none";
    document.getElementById("stats").hidden = true;
}
function calculateCGPA() {
    const n = Number(document.getElementById("subjectCount").value);
    const error = document.getElementById("formError");
    error.textContent = "";

    let totalCredits = 0;
    let weightedPoints = 0;

    for (let i = 0; i < n; i++) {
        const internalField = document.getElementById(`internal${i}`);
        const semField = document.getElementById(`sem${i}`);
        const creditField = document.getElementById(`credit${i}`);

        const internal = internalField.value.trim() === ""
            ? NaN : Number(internalField.value);

        const sem = semField.value.trim() === ""
            ? NaN : Number(semField.value);

        const credit = creditField.value.trim() === ""
            ? NaN : Number(creditField.value);

        if (!Number.isFinite(internal) || internal < 0 || internal > 50) {
            error.textContent =
                `Subject ${i + 1}: internal marks must be between 0 and 50.`;
            internalField.focus();
            return;
        }

        if (!Number.isFinite(sem) || sem < 0 || sem > 100) {
            error.textContent =
                `Subject ${i + 1}: semester marks must be between 0 and 100.`;
            semField.focus();
            return;
        }

        if (!Number.isFinite(credit) || credit <= 0) {
            error.textContent =
                `Subject ${i + 1}: enter credits greater than zero.`;
            creditField.focus();
            return;
        }

        const total = internal + (sem / 2);
        let gradePoint;

        if (total >= 90) gradePoint = 10;
        else if (total >= 80) gradePoint = 9;
        else if (total >= 70) gradePoint = 8;
        else if (total >= 60) gradePoint = 7;
        else if (total >= 50) gradePoint = 6;
        else if (total >= 40) gradePoint = 5;
        else gradePoint = 0;

        totalCredits += credit;
        weightedPoints += credit * gradePoint;
    }

    if (totalCredits <= 0) {
        error.textContent = "Total credits must be greater than zero.";
        return;
    }

    const cgpa = weightedPoints / totalCredits;

    document.getElementById("cgpaValue").textContent = cgpa.toFixed(2);

    document.getElementById("resultMessage").textContent =
        "Your weighted grade-point average is calculated from your subject credits.";

    document.getElementById("totalCredits").textContent =
        Number(totalCredits.toFixed(2)).toString();

    document.getElementById("weightedPoints").textContent =
        Number(weightedPoints.toFixed(2)).toString();

    document.getElementById("totalSubjects").textContent = n;

    showPerformanceMessage(cgpa);

    document.getElementById("resultCard").style.display = "block";
    document.getElementById("messageCard").style.display = "block";
    document.getElementById("stats").hidden = false;

    document.getElementById("resultCard").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function showPerformanceMessage(cgpa) {
    const level = document.getElementById("messageLevel");
    const title = document.getElementById("messageTitle");
    const message = document.getElementById("motivationMessage");
    const targetTitle = document.getElementById("targetTitle");
    const targetMessage = document.getElementById("targetMessage");

    if (cgpa >= 9) {
        level.textContent = "🏆 OUTSTANDING";
        title.textContent = "Amazing performance!";
        message.textContent =
            "Outstanding! 🌟 You're performing at an excellent level. Keep up the amazing work and continue aiming high.";
        targetTitle.textContent = "🎯 Maintain your excellence";
        targetMessage.textContent =
            "Your result is already in the 9+ range. Stay consistent and aim to maintain your performance.";
    } else if (cgpa >= 8) {
        level.textContent = "🥇 EXCELLENT";
        title.textContent = "You're doing great!";
        message.textContent =
            "Excellent work! 💜 You're very close to the top. Stay consistent and push towards a 9+ result.";
        targetTitle.textContent = "🎯 Your next target: 9.00";
        targetMessage.textContent =
            "Strengthen difficult topics, practise regularly, and review mistakes to work towards 9.00.";
    } else if (cgpa >= 7) {
        level.textContent = "🚀 VERY GOOD";
        title.textContent = "Good progress!";
        message.textContent =
            "Good progress! Strengthen your difficult subjects and keep practising. Your next goal is 8+.";
        targetTitle.textContent = "🎯 Your next target: 8.00";
        targetMessage.textContent =
            "Make a weekly revision plan and spend extra time on the subjects where you lose marks.";
    } else if (cgpa >= 6) {
        level.textContent = "📚 GOOD PROGRESS";
        title.textContent = "Keep building your skills!";
        message.textContent =
            "You're making progress! Focus on understanding concepts, revise regularly, and work towards a 7+ result.";
        targetTitle.textContent = "🎯 Your next target: 7.00";
        targetMessage.textContent =
            "Practise important questions, revise class notes, and clear doubts early.";
    } else if (cgpa >= 5) {
        level.textContent = "💪 ROOM TO IMPROVE";
        title.textContent = "Every step counts!";
        message.textContent =
            "Don't give up! Create a daily study plan, practise important questions, and take one step towards better results every day.";
        targetTitle.textContent = "🎯 Your next target: 6.00";
        targetMessage.textContent =
            "Start with short, focused study sessions and practise the topics you find most difficult.";
    } else if (cgpa >= 4) {
        level.textContent = "❤️ KEEP GOING";
        title.textContent = "You can improve!";
        message.textContent =
            "Every improvement starts somewhere. Identify your weak subjects, ask for help when needed, and build better study habits.";
        targetTitle.textContent = "🎯 Your next target: 5.00";
        targetMessage.textContent =
            "Review the basics, seek guidance from your teachers, and make a realistic study timetable.";
    } else {
        level.textContent = "🌱 START SMALL";
        title.textContent = "Your next step matters!";
        message.textContent =
            "This result suggests you may need more support. Don't lose hope. Review the basics, ask for help, and make a steady study plan.";
        targetTitle.textContent = "🎯 Build your foundation";
        targetMessage.textContent =
            "Focus on understanding each subject and check your college's minimum passing requirements.";
    }
}

function resetCalculator() {
    document.getElementById("subjectCount").value = "";
    document.getElementById("subjectTable").innerHTML = "";
    document.getElementById("subjectsCard").hidden = true;
    document.getElementById("resultCard").style.display = "none";
    document.getElementById("messageCard").style.display = "none";
    document.getElementById("stats").hidden = true;
    document.getElementById("setupError").textContent = "";
    document.getElementById("formError").textContent = "";
}

function applyTheme(isLight) {
    document.body.classList.toggle("light-theme", isLight);

    const button = document.getElementById("themeToggle");

    if (!button) return;

    if (isLight) {
        button.textContent = "Dark 🌙";
        button.setAttribute("aria-label", "Switch to dark mode");
        button.title = "Switch to dark mode";
    } else {
        button.textContent = "Light ☀️";
        button.setAttribute("aria-label", "Switch to light mode");
        button.title = "Switch to light mode";
    }
}

function toggleTheme() {
    const isLight = !document.body.classList.contains("light-theme");

    applyTheme(isLight);

    try {
        localStorage.setItem("gradewise-theme", isLight ? "light" : "dark");
    } catch (error) {
        // Theme switching still works if storage is unavailable.
    }
}

try {
    applyTheme(localStorage.getItem("gradewise-theme") === "light");
} catch (error) {
    applyTheme(false);
}

/* Custom cursor movement */
(() => {
    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    if (!finePointer.matches) return;

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    const glow = document.querySelector(".cursor-glow");

    if (!dot || !ring || !glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    function moveDot(element, x, y) {
        element.style.transform =
            `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        moveDot(dot, mouseX, mouseY);
        moveDot(glow, mouseX, mouseY);
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;

        moveDot(ring, ringX, ringY);
        requestAnimationFrame(animateRing);
    }

    animateRing();

    document.addEventListener("mouseover", (event) => {
        if (event.target.closest(
            "a, button, input, select, textarea, [role='button']"
        )) {
            document.body.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", (event) => {
        if (
            event.target.closest(
                "a, button, input, select, textarea, [role='button']"
            ) &&
            !event.relatedTarget?.closest(
                "a, button, input, select, textarea, [role='button']"
            )
        ) {
            document.body.classList.remove("cursor-hover");
        }
    });

    document.addEventListener("mousedown", () => {
        document.body.classList.add("cursor-click");
    });

    document.addEventListener("mouseup", () => {
        document.body.classList.remove("cursor-click");
    });

    window.addEventListener("blur", () => {
        document.body.classList.remove("cursor-hover", "cursor-click");
    });
})();

/* Floating effect for page sections */
(() => {
    const selector = [
        "header", "section", "main", "footer", "article",
        ".card", ".calculator-card", ".result-card",
        ".stat-card", ".subject-card"
    ].join(",");

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
    }

    document.querySelectorAll(selector).forEach((element) => {
        if (
            element.matches("main, footer, .stats") ||
            element.offsetWidth > 1100 ||
            element.offsetHeight > 850
        ) {
            return;
        }

        element.addEventListener("pointermove", (event) => {
            const rect = element.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const tiltY = (x - 0.5) * 4;
            const tiltX = (0.5 - y) * 4;

            element.style.transform =
                `perspective(1000px) translateY(-4px) ` +
                `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        element.addEventListener("pointerleave", () => {
            element.style.removeProperty("transform");
        });
    });
})();
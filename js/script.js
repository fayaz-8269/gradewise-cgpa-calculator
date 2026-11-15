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

function getGradeDetails(totalMarks) {
    if (totalMarks >= 90) return { grade: "O", point: 10, label: "Outstanding" };
    if (totalMarks >= 80) return { grade: "A+", point: 9, label: "Excellent" };
    if (totalMarks >= 70) return { grade: "A", point: 8, label: "Very Good" };
    if (totalMarks >= 60) return { grade: "B+", point: 7, label: "Good" };
    if (totalMarks >= 50) return { grade: "B", point: 6, label: "Above Average" };
    if (totalMarks >= 40) return { grade: "C", point: 5, label: "Pass" };
    return { grade: "F", point: 0, label: "Fail" };
}

function downloadPredictedGradeCard() {
    const jsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
    if (!jsPDFConstructor) {
        alert("The PDF generation library is still loading or could not be loaded from CDN. Please check your internet connection and try again.");
        return;
    }

    const countInput = document.getElementById("subjectCount");
    const n = Number(countInput ? countInput.value : 0);
    const cgpaEl = document.getElementById("cgpaValue");
    const calculatedCgpa = parseFloat(cgpaEl ? cgpaEl.textContent : "0");

    if (!Number.isInteger(n) || n < 1 || isNaN(calculatedCgpa) || calculatedCgpa <= 0) {
        alert("Please calculate your CGPA first before downloading the grade card.");
        return;
    }

    // Fetch student & academic details
    const studentName = document.getElementById("studentName")?.value.trim() || "Not Specified";
    const studentUsn = document.getElementById("studentUsn")?.value.trim().toUpperCase() || "Not Specified";

    const branchSelect = document.getElementById("branchSelect");
    let branchText = "General / Custom";
    if (branchSelect && branchSelect.value) {
        branchText = branchSelect.options[branchSelect.selectedIndex]?.text || branchSelect.value;
        if (branchSelect.value.toLowerCase() === "aiml") {
            branchText = "Artificial Intelligence & Machine Learning (AIML)";
        }
    }

    const semesterSelect = document.getElementById("semesterSelect");
    let semesterText = "Current Semester";
    if (semesterSelect && semesterSelect.value) {
        semesterText = semesterSelect.options[semesterSelect.selectedIndex]?.text || `Semester ${semesterSelect.value}`;
    }

    const academicYear = document.getElementById("academicYear")?.value.trim() || "2024-2025";
    const overallCgpa = "N/A";

    // Gather subjects data
    const tableRows = [];
    let totalCredits = 0;
    let totalCreditPoints = 0;

    for (let i = 0; i < n; i++) {
        const nameVal = document.getElementById(`name${i}`)?.value.trim() || `Subject ${i + 1}`;
        const internal = Number(document.getElementById(`internal${i}`)?.value || 0);
        const sem = Number(document.getElementById(`sem${i}`)?.value || 0);
        const credit = Number(document.getElementById(`credit${i}`)?.value || 0);

        const total = internal + (sem / 2);
        const gradeInfo = getGradeDetails(total);
        const creditPoints = credit * gradeInfo.point;

        totalCredits += credit;
        totalCreditPoints += creditPoints;

        tableRows.push([
            (i + 1).toString(),
            nameVal,
            credit.toString(),
            internal.toFixed(1).replace(/\.0$/, ""),
            sem.toFixed(1).replace(/\.0$/, ""),
            total.toFixed(1).replace(/\.0$/, ""),
            gradeInfo.grade,
            gradeInfo.point.toString(),
            creditPoints.toFixed(1).replace(/\.0$/, "")
        ]);
    }

    const predictedSGPA = totalCredits > 0 ? (totalCreditPoints / totalCredits).toFixed(2) : calculatedCgpa.toFixed(2);
    const levelText = document.getElementById("messageLevel")?.textContent?.trim() || "";

    // Create PDF document (A4 portrait)
    const doc = new jsPDFConstructor({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);

    // Decorative top header bar with Purple & Blue accents
    doc.setFillColor(124, 58, 237); // #7c3aed
    doc.rect(0, 0, pageWidth * 0.65, 3.5, "F");
    doc.setFillColor(37, 99, 235); // #2563eb
    doc.rect(pageWidth * 0.65, 0, pageWidth * 0.35, 3.5, "F");

    let y = 14;

    // Header branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 27, 75); // #1e1b4b
    doc.text("GradeWise", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // #64748b
    doc.text("YOUR ACADEMIC COMPANION", margin, y + 4.5);

    // Date & Report Tag
    const todayStr = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Generated: ${todayStr}`, pageWidth - margin, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("ACADEMIC PERFORMANCE REPORT", pageWidth - margin, y + 4.5, { align: "right" });

    // Header line divider
    y += 9;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);

    // Main Heading (Requirement 3: "PREDICTED CGPA GRADE CARD")
    y += 9;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42); // #0f172a
    doc.text("PREDICTED CGPA GRADE CARD", margin, y);

    // Accent underline
    doc.setFillColor(124, 58, 237);
    doc.rect(margin, y + 1.8, 38, 1, "F");

    // Student & Academic Information Box
    y += 6;
    const infoCardHeight = 28;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, infoCardHeight, 2, 2, "FD");

    const col1X = margin + 5;
    const col2X = margin + 68;
    const col3X = margin + 132;

    const row1Y = y + 7;
    const row2Y = y + 15;

    function drawInfoPair(label, value, x, textY, maxWidth) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(label, x, textY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        const displayVal = doc.splitTextToSize(value || "—", maxWidth || 55)[0];
        doc.text(displayVal, x, textY + 4);
    }

    drawInfoPair("STUDENT NAME", studentName, col1X, row1Y, 58);
    drawInfoPair("USN", studentUsn, col1X, row2Y + 1, 58);

    drawInfoPair("BRANCH", branchText, col2X, row1Y, 60);
    drawInfoPair("SEMESTER", semesterText, col2X, row2Y + 1, 60);

    drawInfoPair("ACADEMIC YEAR", academicYear, col3X, row1Y, 45);
    drawInfoPair("OVERALL CGPA", overallCgpa, col3X, row2Y + 1, 45);

    y += infoCardHeight + 6;

    // Subject Breakdown Table via autoTable
    if (typeof doc.autoTable === "function") {
        doc.autoTable({
            startY: y,
            head: [
                ["#", "SUBJECT NAME", "CREDITS", "CIE\n(/50)", "SEE\n(/100)", "TOTAL\n(/100)", "GRADE", "GRADE\nPOINT", "CREDIT\nPOINTS"]
            ],
            body: tableRows,
            foot: [
                [
                    { content: "TOTAL / SUMMARY", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
                    { content: totalCredits.toString(), styles: { halign: "center", fontStyle: "bold" } },
                    { content: "-", styles: { halign: "center" } },
                    { content: "-", styles: { halign: "center" } },
                    { content: "-", styles: { halign: "center" } },
                    { content: "-", styles: { halign: "center" } },
                    { content: "-", styles: { halign: "center" } },
                    { content: totalCreditPoints.toFixed(1).replace(/\.0$/, ""), styles: { halign: "center", fontStyle: "bold" } }
                ]
            ],
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 2.2,
                textColor: [30, 41, 59],
                lineColor: [226, 232, 240],
                lineWidth: 0.25,
                valign: "middle"
            },
            headStyles: {
                fillColor: [124, 58, 237],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 7.5,
                halign: "center",
                cellPadding: 2.8
            },
            footStyles: {
                fillColor: [30, 27, 75],
                textColor: [255, 255, 255],
                fontSize: 8,
                cellPadding: 2.5
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 8, halign: "center" },
                1: { cellWidth: "auto", halign: "left" },
                2: { cellWidth: 17, halign: "center" },
                3: { cellWidth: 15, halign: "center" },
                4: { cellWidth: 17, halign: "center" },
                5: { cellWidth: 17, halign: "center" },
                6: { cellWidth: 16, halign: "center", fontStyle: "bold" },
                7: { cellWidth: 16, halign: "center" },
                8: { cellWidth: 18, halign: "center", fontStyle: "bold" }
            },
            margin: { left: margin, right: margin }
        });
        y = doc.lastAutoTable.finalY + 7;
    }

    // Results & GPA Summary Box
    const cardWidth = (contentWidth - 6) / 2;
    const cardHeight = 30;

    if (y + cardHeight + 25 > pageHeight - margin) {
        doc.addPage();
        y = margin + 5;
    }

    // Card 1: SGPA & Overall CGPA Card
    doc.setFillColor(245, 243, 255);
    doc.setDrawColor(196, 181, 253);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, cardWidth, cardHeight, 2.5, 2.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(109, 40, 217);
    doc.text("PREDICTED SEMESTER GRADE POINT AVERAGE", margin + 6, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(124, 58, 237);
    doc.text(predictedSGPA, margin + 6, y + 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Overall CGPA: ${overallCgpa}`, margin + 6, y + 24);

    // Card 2: Academic Statistics & Remarks
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(margin + cardWidth + 6, y, cardWidth, cardHeight, 2.5, 2.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(29, 78, 216);
    doc.text("ACADEMIC PERFORMANCE SUMMARY", margin + cardWidth + 12, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Credits: ${totalCredits}   |   Weighted Points: ${totalCreditPoints.toFixed(1).replace(/\.0$/, "")}`, margin + cardWidth + 12, y + 14);

    if (levelText) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(37, 99, 235);
        doc.text(`Classification: ${levelText.replace(/^[^\w]+/, "").trim()}`, margin + cardWidth + 12, y + 21);
    } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Evaluated on 10.0 scale under standard credit weighting.", margin + cardWidth + 12, y + 21);
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Study smart, aim higher.", margin + cardWidth + 12, y + 26);

    // Disclaimer at bottom (Requirement 7)
    const footerY = pageHeight - 12;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
        "This is a predicted academic performance report generated by GradeWise. It is not an official university marks card.",
        pageWidth / 2,
        footerY,
        { align: "center" }
    );

    // Save and download PDF
    const safeUsn = studentUsn && studentUsn !== "NOT SPECIFIED" ? studentUsn.replace(/[^A-Za-z0-9_-]/g, "") : "";
    const fileName = safeUsn ? `${safeUsn}_Predicted_CGPA_Grade_Card.pdf` : "GradeWise_Predicted_CGPA_Grade_Card.pdf";
    doc.save(fileName);
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
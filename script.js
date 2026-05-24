// ==========================================
// SELECT ALL NAVBAR BUTTONS
// ==========================================

const navButtons = document.querySelectorAll(".nav-links .nav-button");
const sectionSwitchButtons = document.querySelectorAll("[data-section-switch]");


// ==========================================
// LAZY-LOAD NON-HERO IMAGES
// ==========================================

document.querySelectorAll("main img, .main-footer img").forEach(image => {

    image.loading = "lazy";
    image.decoding = "async";

});


// ==========================================
// BUTTERFLY CURSOR FOLLOWER
// ==========================================

const butterflyCursor = document.createElement("div");
butterflyCursor.className = "butterfly-cursor";
document.body.appendChild(butterflyCursor);

let butterflyTargetX = -9999;
let butterflyTargetY = -9999;
let butterflyCurrentX = -9999;
let butterflyCurrentY = -9999;

function animateButterflyCursor() {

    butterflyCurrentX += (butterflyTargetX - butterflyCurrentX) * 0.35;
    butterflyCurrentY += (butterflyTargetY - butterflyCurrentY) * 0.35;

    if (butterflyCurrentX < -1000 || butterflyCurrentY < -1000) {

        butterflyCursor.style.transform = "translate(-9999px, -9999px) scaleX(-1)";

    } else {

        butterflyCursor.style.transform = `translate(${butterflyCurrentX - 12}px, ${butterflyCurrentY - 10}px) scaleX(-1)`;

    }

    requestAnimationFrame(animateButterflyCursor);

}

function moveButterflyCursor(event) {

    butterflyTargetX = event.clientX;
    butterflyTargetY = event.clientY;

    if (butterflyCurrentX < -1000 || butterflyCurrentY < -1000) {

        butterflyCurrentX = butterflyTargetX;
        butterflyCurrentY = butterflyTargetY;

    }

}

window.addEventListener("mousemove", moveButterflyCursor);

window.addEventListener("mouseleave", () => {

    butterflyTargetX = -9999;
    butterflyTargetY = -9999;
    butterflyCurrentX = -9999;
    butterflyCurrentY = -9999;

});

animateButterflyCursor();


// ==========================================
// SELECT ALL PAGE SECTIONS
// ==========================================

const pageSections = document.querySelectorAll(".page-section");


// ==========================================
// ALUMNI TABLE FROM CSV
// ==========================================

const alumniTableBody = document.querySelector("[data-alumni-table-body]");
const alumniPrevButton = document.querySelector("[data-alumni-prev]");
const alumniNextButton = document.querySelector("[data-alumni-next]");
const alumniPageIndicator = document.querySelector("[data-alumni-page-indicator]");
const alumniMeta = document.querySelector("[data-alumni-meta]");

const alumniState = {
    rows: [],
    headers: [],
    currentPage: 1,
    rowsPerPage: 10
};

const embeddedAlumniCsvText = typeof window !== "undefined" ? window.ALUMNI_CSV_TEXT : "";

function hasEmbeddedAlumniCsv() {

    return typeof embeddedAlumniCsvText === "string" && embeddedAlumniCsvText.trim().length > 0;

}

function escapeHtml(value) {

    return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

}

function parseCsv(text) {

    const rows = [];
    let currentRow = [];
    let currentValue = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {

        const character = text[index];
        const nextCharacter = text[index + 1];

        if (inQuotes) {

            if (character === '"') {

                if (nextCharacter === '"') {

                    currentValue += '"';
                    index += 1;

                } else {

                    inQuotes = false;

                }

            } else {

                currentValue += character;

            }

            continue;

        }

        if (character === '"') {

            inQuotes = true;
            continue;

        }

        if (character === ",") {

            currentRow.push(currentValue);
            currentValue = "";
            continue;

        }

        if (character === "\n") {

            currentRow.push(currentValue);
            rows.push(currentRow);
            currentRow = [];
            currentValue = "";
            continue;

        }

        if (character === "\r") {

            continue;

        }

        currentValue += character;

    }

    currentRow.push(currentValue);

    if (currentRow.some(cell => cell.trim() !== "")) {

        rows.push(currentRow);

    }

    return rows;

}

function renderAlumniTable() {

    if (!alumniTableBody) {

        return;

    }

    const totalRows = alumniState.rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / alumniState.rowsPerPage));
    const currentPage = Math.min(alumniState.currentPage, totalPages);
    const startIndex = (currentPage - 1) * alumniState.rowsPerPage;
    const visibleRows = alumniState.rows.slice(startIndex, startIndex + alumniState.rowsPerPage);

    alumniState.currentPage = currentPage;

    if (!visibleRows.length) {

        alumniTableBody.innerHTML = `
            <tr>
                <td colspan="7">Data alumni belum tersedia.</td>
            </tr>
        `;

    } else {

        alumniTableBody.innerHTML = visibleRows.map((row, rowIndex) => {

            const [no, namaLengkap, fakultas, ormawa, jabatan, tahunMenjabat, lkmmTm] = row;

            return `
                <tr>
                    <td>${escapeHtml(no || String(startIndex + rowIndex + 1))}</td>
                    <td>${escapeHtml(namaLengkap || "-")}</td>
                    <td>${escapeHtml(fakultas || "-")}</td>
                    <td>${escapeHtml(ormawa || "-")}</td>
                    <td>${escapeHtml(jabatan || "-")}</td>
                    <td>${escapeHtml(tahunMenjabat || "-")}</td>
                    <td>${escapeHtml(lkmmTm || "-")}</td>
                </tr>
            `;

        }).join("");

    }

    if (alumniPageIndicator) {

        alumniPageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages}`;

    }

    if (alumniPrevButton) {

        alumniPrevButton.disabled = currentPage <= 1;

    }

    if (alumniNextButton) {

        alumniNextButton.disabled = currentPage >= totalPages;

    }

    if (alumniMeta) {

        alumniMeta.textContent = `${totalRows} baris data`;

    }

}

function wireAlumniPagination() {

    if (alumniPrevButton) {

        alumniPrevButton.addEventListener("click", () => {

            alumniState.currentPage = Math.max(1, alumniState.currentPage - 1);
            renderAlumniTable();

        });

    }

    if (alumniNextButton) {

        alumniNextButton.addEventListener("click", () => {

            const totalPages = Math.max(1, Math.ceil(alumniState.rows.length / alumniState.rowsPerPage));
            alumniState.currentPage = Math.min(totalPages, alumniState.currentPage + 1);
            renderAlumniTable();

        });

    }

}

async function loadAlumniTable() {

    if (!alumniTableBody) {

        return;

    }

    try {

        let csvText = "";

        if (window.location.protocol === "file:" && hasEmbeddedAlumniCsv()) {

            csvText = embeddedAlumniCsvText;

        } else {

            const response = await fetch("alumni.csv", { cache: "no-store" });

            if (!response.ok) {

                throw new Error(`Gagal memuat alumni.csv (${response.status})`);

            }

            csvText = await response.text();

        }

        if (!csvText && hasEmbeddedAlumniCsv()) {

            csvText = embeddedAlumniCsvText;

        }

        const parsedRows = parseCsv(csvText);

        if (!parsedRows.length) {

            throw new Error("CSV alumni kosong");

        }

        alumniState.headers = parsedRows[0];
        alumniState.rows = parsedRows.slice(1).filter(row => row.some(cell => cell.trim() !== ""));
        alumniState.currentPage = 1;
        renderAlumniTable();

    } catch (error) {

        console.error(error);

        alumniTableBody.innerHTML = `
            <tr>
                <td colspan="7">Data alumni belum bisa dimuat dari alumni.csv.</td>
            </tr>
        `;

        if (alumniMeta) {

            alumniMeta.textContent = "Gagal memuat data";

        }

        if (alumniPageIndicator) {

            alumniPageIndicator.textContent = "Halaman 0 dari 0";

        }

        if (alumniPrevButton) {

            alumniPrevButton.disabled = true;

        }

        if (alumniNextButton) {

            alumniNextButton.disabled = true;

        }

    }

}

wireAlumniPagination();
loadAlumniTable();


// ==========================================
// NAVIGATION SYSTEM
// ==========================================

function activateSection(targetSection) {

    navButtons.forEach(btn => {

        btn.classList.toggle("active", btn.getAttribute("data-section") === targetSection);

    });

    pageSections.forEach(section => {

        section.classList.remove("active-section");

    });

    const activeSection = document.getElementById(targetSection);

    if (activeSection) {

        activeSection.classList.add("active-section");

    }

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

}

navButtons.forEach(button => {

    button.addEventListener("click", (event) => {

        // Prevent page refresh
        event.preventDefault();

        activateSection(button.getAttribute("data-section"));

    });

});

sectionSwitchButtons.forEach(button => {

    button.addEventListener("click", (event) => {

        event.preventDefault();
        activateSection(button.getAttribute("data-section-switch"));

    });

});





// ==========================================
// FADE-UP ANIMATION ON SCROLL
// ==========================================

const fadeElements =
document.querySelectorAll(".fade-up");



function showOnScroll() {

    fadeElements.forEach(element => {

        const elementTop =
        element.getBoundingClientRect().top;

        const windowHeight =
        window.innerHeight;



        // Trigger animation
        if (elementTop < windowHeight - 100) {

            element.classList.add("show");

        }

    });

}



// Run animation on scroll
window.addEventListener("scroll", showOnScroll);



// Run animation on first load
showOnScroll();


// ==========================================
// TIME-BOUND LOCK FOR RECRUITMENT CARDS
// ==========================================

const timeLockedBoxes = document.querySelectorAll(".time-locked-box");

function padCountdownValue(value) {

    return String(value).padStart(2, "0");

}

function unlockBox(box) {

    box.classList.remove("is-locked");
    box.classList.add("is-unlocked");

}

function updateCountdownBox(box, nowMs) {

    const openTimeValue = box.getAttribute("data-open-time");
    const openTimeMs = Date.parse(openTimeValue);

    // Invalid date should not keep the section locked.
    if (Number.isNaN(openTimeMs)) {

        unlockBox(box);
        return false;

    }

    const remainingMs = openTimeMs - nowMs;

    if (remainingMs <= 0) {

        unlockBox(box);
        return false;

    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const dayElement = box.querySelector('[data-unit="days"]');
    const hourElement = box.querySelector('[data-unit="hours"]');
    const minuteElement = box.querySelector('[data-unit="minutes"]');
    const secondElement = box.querySelector('[data-unit="seconds"]');

    if (dayElement) {

        dayElement.textContent = padCountdownValue(days);

    }

    if (hourElement) {

        hourElement.textContent = padCountdownValue(hours);

    }

    if (minuteElement) {

        minuteElement.textContent = padCountdownValue(minutes);

    }

    if (secondElement) {

        secondElement.textContent = padCountdownValue(seconds);

    }

    return true;

}

function initTimeLocks() {

    if (!timeLockedBoxes.length) {

        return;

    }

    let hasActiveLock = false;
    const nowMs = Date.now();

    timeLockedBoxes.forEach(box => {

        const openTimeLabel = box.getAttribute("data-open-time-label");
        const openTimeElement = box.querySelector(".lock-open-time");

        if (openTimeElement && openTimeLabel) {

            openTimeElement.textContent = openTimeLabel;

        }

        if (updateCountdownBox(box, nowMs)) {

            hasActiveLock = true;

        }

    });

    if (!hasActiveLock) {

        return;

    }

    const countdownInterval = setInterval(() => {

        const currentNowMs = Date.now();
        let stillLocked = false;

        timeLockedBoxes.forEach(box => {

            if (box.classList.contains("is-locked") && updateCountdownBox(box, currentNowMs)) {

                stillLocked = true;

            }

        });

        if (!stillLocked) {

            clearInterval(countdownInterval);

        }

    }, 1000);

}

initTimeLocks();


// ==========================================
// GATED ANNOUNCEMENT LINKS
// ==========================================

const announcementLinks = document.querySelectorAll(".announcement-gated-link");

let announcementModal = null;
let announcementModalMessage = null;
let announcementModalTitle = null;
let announcementModalClose = null;

function createAnnouncementModal() {

    if (announcementModal) {

        return;

    }

    announcementModal = document.createElement("div");
    announcementModal.className = "announcement-modal";
    announcementModal.setAttribute("aria-hidden", "true");

    announcementModal.innerHTML = `
        <div class="announcement-modal-card" role="dialog" aria-modal="true" aria-label="Informasi Pengumuman">
            <h3>Recruitment</h3>
            <p class="announcement-modal-message"></p>
            <button type="button" class="announcement-modal-close">Oke, siap</button>
        </div>
    `;

    document.body.appendChild(announcementModal);

    announcementModalTitle = announcementModal.querySelector(".announcement-modal-card h3");
    announcementModalMessage = announcementModal.querySelector(".announcement-modal-message");
    announcementModalClose = announcementModal.querySelector(".announcement-modal-close");

    announcementModal.addEventListener("click", event => {

        if (event.target === announcementModal) {

            hideAnnouncementModal();

        }

    });

    if (announcementModalClose) {

        announcementModalClose.addEventListener("click", hideAnnouncementModal);

    }

    window.addEventListener("keydown", event => {

        if (event.key === "Escape" && announcementModal.classList.contains("show")) {

            hideAnnouncementModal();

        }

    });

}

function showAnnouncementModal(message, title = "Recruitment") {

    createAnnouncementModal();

    if (!announcementModal || !announcementModalMessage) {

        alert(message);
        return;

    }

    if (announcementModalTitle) {

        announcementModalTitle.textContent = title;

    }

    announcementModalMessage.textContent = message;
    announcementModal.classList.add("show");
    announcementModal.setAttribute("aria-hidden", "false");

    if (announcementModalClose) {

        announcementModalClose.focus();

    }

}

function hideAnnouncementModal() {

    if (!announcementModal) {

        return;

    }

    announcementModal.classList.remove("show");
    announcementModal.setAttribute("aria-hidden", "true");

}

function getUnlockTimeFromKey(lockKey) {

    if (!lockKey) {

        return NaN;

    }

    const sourceBox = document.querySelector(`.time-locked-box[data-lock-key="${lockKey}"]`);

    if (!sourceBox) {

        return NaN;

    }

    return Date.parse(sourceBox.getAttribute("data-open-time") || "");

}

function getUnlockTimeForAnnouncement(link) {

    const fixedUnlockTime = link.getAttribute("data-unlock-time");

    if (fixedUnlockTime) {

        return Date.parse(fixedUnlockTime);

    }

    const unlockFromKey = link.getAttribute("data-unlock-from");
    return getUnlockTimeFromKey(unlockFromKey);

}

function initAnnouncementGates() {

    if (!announcementLinks.length) {

        return;

    }

    announcementLinks.forEach(link => {

        link.addEventListener("click", event => {

            const unlockTimeMs = getUnlockTimeForAnnouncement(link);

            // Case 1: Time-gated content - show modal if time hasn't arrived yet
            if (!Number.isNaN(unlockTimeMs) && Date.now() < unlockTimeMs) {

                event.preventDefault();
                const message =
                    link.getAttribute("data-locked-message") ||
                    "Sabar yaa, see you very soon! ⸜(｡˃ ᵕ ˂ )⸝♡";
                showAnnouncementModal(message, "Recruitment");

            }
            // Case 2: Non-time-gated content (e.g., sejarah cards) - show modal with locked message if present
            else if (Number.isNaN(unlockTimeMs) && link.hasAttribute("data-locked-message")) {

                event.preventDefault();
                const message = link.getAttribute("data-locked-message");
                const title = link.querySelector("h3")?.textContent.trim() || "Sejarah LKMM TM";
                showAnnouncementModal(message, title);

            }

        });

    });

}

initAnnouncementGates();

// ==========================================
// BACKGROUND MUSIC
// ==========================================

const backgroundMusic =
document.getElementById("bg-music");

const musicToggle =
document.getElementById("music-toggle");

if (backgroundMusic && musicToggle) {

    backgroundMusic.volume = 0.4;

    let musicStarted = false;

    function startBackgroundMusic() {

        if (musicStarted) {

            return;

        }

        backgroundMusic.play()
        .then(() => {

            musicStarted = true;

        })
        .catch(() => {

            return;

        });

    }

    // Trigger musiknya
    window.addEventListener("click", startBackgroundMusic);

    window.addEventListener("scroll", startBackgroundMusic);

    window.addEventListener("mousemove", startBackgroundMusic);

    window.addEventListener("keydown", startBackgroundMusic);

    // Toggle button
    musicToggle.addEventListener("click", () => {

        if (backgroundMusic.paused) {

            backgroundMusic.play();
            musicToggle.textContent = "🔊";

        } else {

            backgroundMusic.pause();
            musicToggle.textContent = "🔇";

        }

    });

}
// ==========================================
// SELECT ALL NAVBAR BUTTONS
// ==========================================

const navButtons = document.querySelectorAll(".nav-button");


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
// NAVIGATION SYSTEM
// ==========================================

navButtons.forEach(button => {

    button.addEventListener("click", (event) => {

        // Prevent page refresh
        event.preventDefault();



        // ==================================
        // REMOVE ACTIVE NAVBAR
        // ==================================

        navButtons.forEach(btn => {

            btn.classList.remove("active");

        });



        // ==================================
        // ADD ACTIVE NAVBAR
        // ==================================

        button.classList.add("active");



        // ==================================
        // GET TARGET SECTION
        // ==================================

        const targetSection =
        button.getAttribute("data-section");



        // ==================================
        // HIDE ALL SECTIONS
        // ==================================

        pageSections.forEach(section => {

            section.classList.remove("active-section");

        });



        // ==================================
        // SHOW TARGET SECTION
        // ==================================

        const activeSection =
        document.getElementById(targetSection);

        activeSection.classList.add("active-section");



        // ==================================
        // SCROLL TO TOP SMOOTHLY
        // ==================================

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

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
            <h3>Open Recruitment</h3>
            <p class="announcement-modal-message"></p>
            <button type="button" class="announcement-modal-close">Oke, siap</button>
        </div>
    `;

    document.body.appendChild(announcementModal);

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

function showAnnouncementModal(message) {

    createAnnouncementModal();

    if (!announcementModal || !announcementModalMessage) {

        alert(message);
        return;

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

            if (!Number.isNaN(unlockTimeMs) && Date.now() < unlockTimeMs) {

                event.preventDefault();
                const message =
                    link.getAttribute("data-locked-message") ||
                    "Sabar yaa, see you very soon! ⸜(｡˃ ᵕ ˂ )⸝♡";
                showAnnouncementModal(message);

            }

        });

    });

}

initAnnouncementGates();
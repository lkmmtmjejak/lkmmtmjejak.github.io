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
// ANALYTICS: VIRTUAL PAGE VIEWS
// ==========================================

function trackVirtualPage(sectionName) {

    if (typeof gtag === "function") {

        gtag("event", "page_view", {
            page_path: `/#${sectionName}`,
            page_location: `${window.location.origin}${window.location.pathname}#${sectionName}`
        });

    }

}


// ==========================================
// ALUMNI TABLE FROM CSV
// ==========================================

const alumniTableBody = document.querySelector("[data-alumni-table-body]");
const alumniPrevButton = document.querySelector("[data-alumni-prev]");
const alumniNextButton = document.querySelector("[data-alumni-next]");
const alumniPageIndicator = document.querySelector("[data-alumni-page-indicator]");
const alumniMeta = document.querySelector("[data-alumni-meta]");
const alumniChartMount = document.querySelector("[data-alumni-chart]");
const alumniLevelChartMount = document.querySelector("[data-alumni-level-chart]");
const alumniOrgChartMount = document.querySelector("[data-alumni-org-chart]");
const alumniOrmawaChartMount = document.querySelector("[data-alumni-ormawa-chart]");

const alumniState = {
    rows: [],
    headers: [],
    currentPage: 1,
    rowsPerPage: 10,
    selectedFaculty: "",
    selectedLevel: "",
    selectedOrg: "",
    selectedOrmawa: ""
};

const alumniFacultyPalette = [
    "#b06d6d",
    "#d38a67",
    "#c4a14f",
    "#7f9c7a",
    "#6f97b8",
    "#9a79bf",
    "#c06f98",
    "#8f6b58"
];

// Color map for faculty abbreviations (muted / pastel tones)
const facultyColorMap = {
    FSAD: "#9CC7A1",   // green pastel
    FTIRS: "#D88A8A",  // red pastel
    FTSPK: "#3b3b3b",  // dark gray (near black)
    FTK: "#8FB6D6",    // blue pastel
    FTEIC: "#E6D29C",  // yellow pastel
    FDKBD: "#B7A0D6",  // purple pastel
    FV: "#E7B58C",     // orange pastel
    FKK: "#70B9AA"     // tosca/teal pastel
};

function getFacultyColor(faculty) {
    const abbr = getFacultyAbbrev(faculty);
    return facultyColorMap[abbr] || alumniFacultyPalette[Math.abs(String(faculty).length) % alumniFacultyPalette.length];
}

// Fakultas singkatan mapping
const alumniFacultyAbbrevMap = [
    { match: /sains/i, abbrev: "FSAD" },
    { match: /teknologi\s+industri|industri/i, abbrev: "FTIRS" },
    { match: /teknik\s+sipil|sipil/i, abbrev: "FTSPK" },
    { match: /kelautan/i, abbrev: "FTK" },
    { match: /elektro|informatika/i, abbrev: "FTEIC" },
    { match: /design|desain/i, abbrev: "FDKBD" },
    { match: /vokasi/i, abbrev: "FV" },
    { match: /kedokteran/i, abbrev: "FKK" }
];

function getFacultyAbbrev(faculty) {
    const facultyText = String(faculty || "");
    for (const item of alumniFacultyAbbrevMap) {
        if (item.match.test(facultyText)) return item.abbrev;
    }

    // fallback: take up to 3 initials from words after removing 'Fakultas'
    const cleaned = facultyText.replace(/^Fakultas\s+/i, "").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (!parts.length) return "-";
    const initials = parts.slice(0, 3).map(w => w[0]?.toUpperCase() || "").join("");
    return initials || cleaned.slice(0, 3).toUpperCase();

}

// Color map for level (pastel tones)
const levelColorMap = {
    "Kepemanduan": "#D4A574",        // terracotta pastel
    "Ketua dan Wakil Ketua": "#A89BD8", // lavender pastel
    "Top Management": "#7FD8BE",     // mint pastel
    "Middle Management": "#F4B183",   // peach pastel
    "General Member": "#9CC7A1"       // light green pastel
};

function getLevelColor(level) {
    const levelStr = String(level || "").trim();
    return levelColorMap[levelStr] || "#C8B6A0";  // fallback beige
}

// Color map for organizations (pastel tones)
const orgColorMap = {};  // Will be dynamically populated

function getOrgColor(org, index) {
    if (!orgColorMap[org]) {
        const orgPalette = [
            "#9CC7A1", "#D88A8A", "#8FB6D6", "#E6D29C", 
            "#B7A0D6", "#E7B58C", "#70B9AA", "#F4B183",
            "#C8B6A0", "#A89BD8", "#7FD8BE", "#D4A574"
        ];
        orgColorMap[org] = orgPalette[index % orgPalette.length];
    }
    return orgColorMap[org];
}

function getOrgAbbrev(org) {
    const orgText = String(org || "").trim();
    if (!orgText || orgText.length === 0 || orgText === "-") return "-";
    
    return orgText;
}

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

function inferAlumniLevel(ormawa, jabatan) {

    const normalizedOrmawa = String(ormawa || "").toLowerCase();
    const normalizedJabatan = String(jabatan || "").toLowerCase();

    if (normalizedOrmawa.includes("lkmm") || normalizedJabatan.includes("fasilitator") || normalizedJabatan.includes("pemandu")) {

        return "Kepemanduan";

    }

    if (normalizedJabatan.includes("ketua") || normalizedJabatan.includes("wakil ketua")) {

        return "Ketua dan Wakil Ketua";

    }

    if (normalizedJabatan.includes("kepala") || normalizedJabatan.includes("menko") || normalizedJabatan.includes("menteri") || normalizedJabatan.includes("sekretaris") || normalizedJabatan.includes("bendahara") || normalizedJabatan.includes("inspektur")) {

        return "Top Management";

    }

    if (normalizedJabatan.includes("staf") || normalizedJabatan.includes("staff") || normalizedJabatan.includes("anggota") || normalizedJabatan.includes("committee")) {

        return "Middle Management";

    }

    return "Tidak Diketahui";

}

function normalizeAlumniRow(row) {

    if (row.length >= 10) {

        return row.slice(0, 10);

    }

    if (row.length === 9) {

        return [...row, "Unknown"];

    }

    if (row.length === 8) {

        return [...row, "Tidak Diketahui", "Unknown"];

    }

    if (row.length === 7) {

        const [no, namaLengkap, fakultas, ormawa, jabatan, tahunMenjabat, lkmmTm] = row;

        return [no, namaLengkap, fakultas, ormawa, jabatan, tahunMenjabat, lkmmTm, inferAlumniLevel(ormawa, jabatan), "Tidak Diketahui", "Unknown"];

    }

    return row;

}

function getAlumniFaculty(row) {

    const faculty = String(row[2] || "").replace(/\s+/g, " ").trim();

    if (!faculty || faculty.toLowerCase() === "fakultas") {

        return "Fakultas Tidak Diketahui";

    }

    return faculty;

}

function getAlumniLevel(row) {

    const lvl = String(row[7] || "").trim();
    if (!lvl || lvl === "-") {
        return "Tidak Diketahui";
    }
    return lvl;

}

function getAlumniOrg(row) {

    const org = String(row[8] || "").replace(/\s+/g, " ").trim();

    if (!org || org === "-") {

        return "Tidak Diketahui";

    }

    return org;

}

function getAlumniSingkatan(row) {

    const singkatan = String(row[9] || "").replace(/\s+/g, " ").trim();

    if (!singkatan || singkatan === "-") {

        return "Unknown";

    }

    return singkatan;

}

function getAlumniOrmawa(row) {

    const ormawa = String(row[3] || "").replace(/\s+/g, " ").trim();

    if (!ormawa || ormawa === "-") {

        return "Tidak Diketahui";

    }

    return ormawa;

}

function getFilteredAlumniRows() {

    return alumniState.rows.filter(row => {
        if (alumniState.selectedFaculty && getAlumniFaculty(row) !== alumniState.selectedFaculty) {
            return false;
        }
        if (alumniState.selectedLevel && getAlumniLevel(row) !== alumniState.selectedLevel) {
            return false;
        }
        if (alumniState.selectedOrg && getAlumniOrg(row) !== alumniState.selectedOrg) {
            return false;
        }
        if (alumniState.selectedOrmawa && getAlumniSingkatan(row) !== alumniState.selectedOrmawa) {
            return false;
        }
        return true;
    });

}

function getAlumniFacultyGroups() {

    const groups = new Map();

    getFilteredAlumniRows().forEach(row => {

        const faculty = getAlumniFaculty(row);
        groups.set(faculty, (groups.get(faculty) || 0) + 1);

    });

    return Array.from(groups.entries())
    .map(([faculty, count]) => ({ faculty, count }))
    .sort((left, right) => right.count - left.count || left.faculty.localeCompare(right.faculty));

}

function getAlumniLevelGroups() {

    const groups = new Map();

    getFilteredAlumniRows().forEach(row => {

        const level = getAlumniLevel(row);
        groups.set(level, (groups.get(level) || 0) + 1);

    });

    return Array.from(groups.entries())
    .map(([level, count]) => ({ level, count }))
    .sort((left, right) => right.count - left.count || left.level.localeCompare(right.level));

}

function getAlumniOrgGroups() {

    const groups = new Map();

    getFilteredAlumniRows().forEach(row => {

        const org = getAlumniOrg(row);
        groups.set(org, (groups.get(org) || 0) + 1);

    });

    return Array.from(groups.entries())
    .map(([org, count]) => ({ org, count }))
    .sort((left, right) => right.count - left.count || left.org.localeCompare(right.org));

}

function getAlumniOrmawaGroups() {

    const groups = new Map();

    getFilteredAlumniRows().forEach(row => {

        const singkatan = getAlumniSingkatan(row);
        groups.set(singkatan, (groups.get(singkatan) || 0) + 1);

    });

    return Array.from(groups.entries())
    .map(([singkatan, count]) => ({ singkatan, count }))
    .sort((left, right) => {
        if (left.singkatan === "Unknown") return 1;
        if (right.singkatan === "Unknown") return -1;
        return right.count - left.count || left.singkatan.localeCompare(right.singkatan);
    });

}

function polarToCartesian(centerX, centerY, radius, angle) {

    const radians = (angle - 90) * Math.PI / 180;

    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };

}

function createPieSlicePath(centerX, centerY, radius, startAngle, endAngle) {

    const sliceAngle = endAngle - startAngle;
    
    // Handle edge case: if slice is 360 or very close to it (for single item pie)
    if (sliceAngle >= 359.9) {
        // Draw two semicircles to create full circle
        const topPoint = polarToCartesian(centerX, centerY, radius, startAngle);
        const bottomPoint = polarToCartesian(centerX, centerY, radius, startAngle + 180);
        
        return [
            `M ${centerX} ${centerY}`,
            `L ${topPoint.x} ${topPoint.y}`,
            `A ${radius} ${radius} 0 0 1 ${bottomPoint.x} ${bottomPoint.y}`,
            `A ${radius} ${radius} 0 0 1 ${topPoint.x} ${topPoint.y}`,
            "Z"
        ].join(" ");
    }

    const startPoint = polarToCartesian(centerX, centerY, radius, startAngle);
    const endPoint = polarToCartesian(centerX, centerY, radius, endAngle);
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return [
        `M ${centerX} ${centerY}`,
        `L ${startPoint.x} ${startPoint.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`,
        "Z"
    ].join(" ");

}

function formatFacultyDisplayName(faculty) {

    return faculty.replace(/^Fakultas\s+/i, "");

}

function setAlumniFacultyFilter(faculty) {

    alumniState.selectedFaculty = alumniState.selectedFaculty === faculty ? "" : faculty;
    alumniState.currentPage = 1;
    renderAlumniChart();
    renderAlumniLevelChart();
    renderAlumniOrgChart();
    renderAlumniOrmawaChart();
    renderAlumniTable();

}

function setAlumniLevelFilter(level) {

    alumniState.selectedLevel = alumniState.selectedLevel === level ? "" : level;
    alumniState.currentPage = 1;
    renderAlumniChart();
    renderAlumniLevelChart();
    renderAlumniOrgChart();
    renderAlumniOrmawaChart();
    renderAlumniTable();

}

function renderAlumniChart() {

    if (!alumniChartMount) {

        return;

    }

    const groups = getAlumniFacultyGroups();

    if (!groups.length) {

        alumniChartMount.innerHTML = `
            <div class="alumni-chart-empty">
                Data belum tersedia untuk divisualisasikan.
            </div>
        `;

        return;

    }

    const total = groups.reduce((sum, group) => sum + group.count, 0);
    // compact donut sizing for dashboard card
    const size = 160;
    const center = size / 2;
    const radius = 60;
    const selectedFaculty = alumniState.selectedFaculty;

    let currentAngle = 0;

    const slices = groups.map((group, index) => {

        const sliceAngle = (group.count / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const color = getFacultyColor(group.faculty);
        const isActive = !selectedFaculty || selectedFaculty === group.faculty;
        const opacity = selectedFaculty && !isActive ? 0.26 : 1;

        return `
            <path
                class="alumni-chart-slice${isActive ? " is-active" : ""}"
                data-faculty="${escapeHtml(group.faculty)}"
                d="${createPieSlicePath(center, center, radius, startAngle, endAngle)}"
                fill="${color}"
                fill-opacity="${opacity}"
                stroke="rgba(255, 251, 247, 0.96)"
                stroke-width="2"
            >
                <title>${escapeHtml(group.faculty)}: ${group.count} alumni</title>
            </path>
        `;

    }).join("");

    const activeGroup = selectedFaculty ? groups.find(group => group.faculty === selectedFaculty) : null;
    const centerValue = selectedFaculty && activeGroup ? String(activeGroup.count) : String(total);
    const centerLabel = ""; // no label inside chart per request

    // build a very compact inline legend: dot + ABBR (interactive & filterable)
    const legendInline = groups
    .filter(group => !selectedFaculty || selectedFaculty === group.faculty)
    .map((group, index) => {
        const color = getFacultyColor(group.faculty);
        const abbrev = escapeHtml(getFacultyAbbrev(group.faculty));
        const fullName = escapeHtml(group.faculty);

        return `<span class="alumni-inline-item" data-faculty="${escapeHtml(group.faculty)}" title="${fullName}"><span class="alumni-inline-dot" style="background:${color}"></span>${abbrev}</span>`;

    }).join(" ");

    alumniChartMount.innerHTML = `
        <div class="alumni-chart-header-row">
            <div>
                <h3>Sebaran Fakultas</h3>
            </div>
        </div>

        <div class="alumni-chart-view">
            <div class="alumni-chart-svg-wrap">
                <svg class="alumni-chart-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pie chart alumni per fakultas">
                    <circle cx="${center}" cy="${center}" r="${radius + 1}" fill="rgba(255, 251, 247, 0.78)"></circle>
                    ${slices}
                    <circle cx="${center}" cy="${center}" r="${Math.max(40, Math.floor(radius * 0.6))}" fill="rgba(255, 251, 247, 0.96)" stroke="rgba(122, 78, 78, 0.10)" stroke-width="1.5"></circle>
                    <text x="${center}" y="${center + 6}" class="alumni-chart-center-value">${centerValue}</text>
                </svg>
            </div>

            <div class="alumni-chart-inline-legend" aria-hidden="true">
                ${legendInline}
            </div>
        </div>
    `;

}

if (alumniChartMount) {

    alumniChartMount.addEventListener("click", event => {

        const facultyTarget = event.target.closest("[data-faculty]");
        const clearTarget = event.target.closest("[data-action='clear-faculty']");

        if (clearTarget) {

            setAlumniFacultyFilter("");
            return;

        }

        if (facultyTarget) {

            setAlumniFacultyFilter(facultyTarget.getAttribute("data-faculty") || "");

        }

    });

}

if (alumniLevelChartMount) {

    alumniLevelChartMount.addEventListener("click", event => {

        const levelTarget = event.target.closest("[data-level]");
        const clearTarget = event.target.closest("[data-action='clear-level']");

        if (clearTarget) {

            setAlumniLevelFilter("");
            return;

        }

        if (levelTarget) {

            setAlumniLevelFilter(levelTarget.getAttribute("data-level") || "");

        }

    });

}

function renderAlumniLevelChart() {

    if (!alumniLevelChartMount) {

        return;

    }

    const groups = getAlumniLevelGroups();

    if (!groups.length) {

        alumniLevelChartMount.innerHTML = `
            <div class="alumni-chart-empty">
                Data belum tersedia untuk divisualisasikan.
            </div>
        `;

        return;

    }

    const total = groups.reduce((sum, group) => sum + group.count, 0);
    const size = 160;
    const center = size / 2;
    const radius = 60;
    const selectedLevel = alumniState.selectedLevel;

    let currentAngle = 0;

    const slices = groups.map((group, index) => {

        const sliceAngle = (group.count / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const color = getLevelColor(group.level);
        const isActive = !selectedLevel || selectedLevel === group.level;
        const opacity = selectedLevel && !isActive ? 0.26 : 1;

        return `
            <path
                class="alumni-chart-slice${isActive ? " is-active" : ""}"
                data-level="${escapeHtml(group.level)}"
                d="${createPieSlicePath(center, center, radius, startAngle, endAngle)}"
                fill="${color}"
                fill-opacity="${opacity}"
                stroke="rgba(255, 251, 247, 0.96)"
                stroke-width="2"
            >
                <title>${escapeHtml(group.level)}: ${group.count} alumni</title>
            </path>
        `;

    }).join("");

    const activeGroup = selectedLevel ? groups.find(group => group.level === selectedLevel) : null;
    const centerValue = selectedLevel && activeGroup ? String(activeGroup.count) : String(total);

    const legendInline = groups
    .filter(group => !selectedLevel || selectedLevel === group.level)
    .map((group, index) => {
        const color = getLevelColor(group.level);
        const levelText = String(group.level || "-");

        return `<span class="alumni-inline-item" data-level="${escapeHtml(group.level)}" title="${escapeHtml(levelText)}"><span class="alumni-inline-dot" style="background:${color}"></span>${escapeHtml(levelText)}</span>`;

    }).join(" ");

    alumniLevelChartMount.innerHTML = `
        <div class="alumni-chart-header-row">
            <div>
                <h3>Sebaran Level</h3>
            </div>
        </div>

        <div class="alumni-chart-view">
            <div class="alumni-chart-svg-wrap">
                <svg class="alumni-chart-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pie chart alumni per level">
                    <circle cx="${center}" cy="${center}" r="${radius + 1}" fill="rgba(255, 251, 247, 0.78)"></circle>
                    ${slices}
                    <circle cx="${center}" cy="${center}" r="${Math.max(40, Math.floor(radius * 0.6))}" fill="rgba(255, 251, 247, 0.96)" stroke="rgba(122, 78, 78, 0.10)" stroke-width="1.5"></circle>
                    <text x="${center}" y="${center + 6}" class="alumni-chart-center-value">${centerValue}</text>
                </svg>
            </div>

            <div class="alumni-chart-inline-legend" aria-hidden="true">
                ${legendInline}
            </div>
        </div>
    `;

}

function setAlumniOrgFilter(org) {

    alumniState.selectedOrg = alumniState.selectedOrg === org ? "" : org;
    alumniState.currentPage = 1;
    renderAlumniChart();
    renderAlumniLevelChart();
    renderAlumniOrgChart();
    renderAlumniOrmawaChart();
    renderAlumniTable();

}

function renderAlumniOrgChart() {

    if (!alumniOrgChartMount) {

        return;

    }

    const groups = getAlumniOrgGroups();

    if (!groups.length) {

        alumniOrgChartMount.innerHTML = `
            <div class="alumni-chart-empty">
                Data belum tersedia untuk divisualisasikan.
            </div>
        `;

        return;

    }

    const total = groups.reduce((sum, group) => sum + group.count, 0);
    const size = 160;
    const center = size / 2;
    const radius = 60;
    const selectedOrg = alumniState.selectedOrg;

    let currentAngle = 0;

    const slices = groups.map((group, index) => {

        const sliceAngle = (group.count / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const color = getOrgColor(group.org, index);
        const isActive = !selectedOrg || selectedOrg === group.org;
        const opacity = selectedOrg && !isActive ? 0.26 : 1;

        return `
            <path
                class="alumni-chart-slice${isActive ? " is-active" : ""}"
                data-org="${escapeHtml(group.org)}"
                d="${createPieSlicePath(center, center, radius, startAngle, endAngle)}"
                fill="${color}"
                fill-opacity="${opacity}"
                stroke="rgba(255, 251, 247, 0.96)"
                stroke-width="2"
            >
                <title>${escapeHtml(group.org)}: ${group.count} alumni</title>
            </path>
        `;

    }).join("");

    const activeGroup = selectedOrg ? groups.find(group => group.org === selectedOrg) : null;
    const centerValue = selectedOrg && activeGroup ? String(activeGroup.count) : String(total);

    const legendInline = groups
    .filter(group => !selectedOrg || selectedOrg === group.org)
    .map((group, index) => {
        const color = getOrgColor(group.org, index);
        const orgShort = escapeHtml(getOrgAbbrev(group.org));
        const orgFull = escapeHtml(group.org);

        return `<span class="alumni-inline-item" data-org="${escapeHtml(group.org)}" title="${orgFull}"><span class="alumni-inline-dot" style="background:${color}"></span>${orgShort}</span>`;

    }).join(" ");

    alumniOrgChartMount.innerHTML = `
        <div class="alumni-chart-header-row">
            <div>
                <h3>Sebaran Organisasi</h3>
            </div>
        </div>

        <div class="alumni-chart-view">
            <div class="alumni-chart-svg-wrap">
                <svg class="alumni-chart-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pie chart alumni per organisasi">
                    <circle cx="${center}" cy="${center}" r="${radius + 1}" fill="rgba(255, 251, 247, 0.78)"></circle>
                    ${slices}
                    <circle cx="${center}" cy="${center}" r="${Math.max(40, Math.floor(radius * 0.6))}" fill="rgba(255, 251, 247, 0.96)" stroke="rgba(122, 78, 78, 0.10)" stroke-width="1.5"></circle>
                    <text x="${center}" y="${center + 6}" class="alumni-chart-center-value">${centerValue}</text>
                </svg>
            </div>

            <div class="alumni-chart-inline-legend" aria-hidden="true">
                ${legendInline}
            </div>
        </div>
    `;

}

if (alumniOrgChartMount) {

    alumniOrgChartMount.addEventListener("click", event => {

        const orgTarget = event.target.closest("[data-org]");
        const clearTarget = event.target.closest("[data-action='clear-org']");

        if (clearTarget) {

            setAlumniOrgFilter("");
            return;

        }

        if (orgTarget) {

            setAlumniOrgFilter(orgTarget.getAttribute("data-org") || "");

        }

    });

}

function renderAlumniOrmawaChart() {

    if (!alumniOrmawaChartMount) {

        return;

    }

    const groups = getAlumniOrmawaGroups();

    if (!groups.length) {

        alumniOrmawaChartMount.innerHTML = `
            <div class="alumni-barchart-placeholder">
                Data belum tersedia untuk divisualisasikan.
            </div>
        `;

        return;

    }

    const maxCount = Math.max(...groups.map(g => g.count));
    const chartHeight = 220;
    const minBarHeight = 20;

    // containerHeight reserves space for the chart area plus label/value.
    const containerHeight = chartHeight + 64;

    const bars = groups.map((group, index) => {

        const barHeight = Math.max(minBarHeight, (group.count / maxCount) * chartHeight);
        const color = getFacultyColor(group.singkatan);
        const truncatedLabel = group.singkatan.length > 12 ? group.singkatan.substring(0, 12) + "..." : group.singkatan;

        return `
            <div class="alumni-bar" data-singkatan="${escapeHtml(group.singkatan)}" title="${escapeHtml(group.singkatan)}" style="height: ${containerHeight}px;">
                <div class="alumni-bar-inner" style="height: ${chartHeight}px; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:6px; box-sizing:border-box; width:100%;">
                    <div class="alumni-bar-value">${group.count}</div>
                    <div class="alumni-bar-column" style="height: ${barHeight}px; background: ${color};"></div>
                </div>
                <div class="alumni-bar-label">${escapeHtml(truncatedLabel)}</div>
            </div>
        `;

    }).join("");

    alumniOrmawaChartMount.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: flex-end; padding-bottom: 8px;">
            ${bars}
        </div>
    `;

}

if (alumniOrmawaChartMount) {

    alumniOrmawaChartMount.addEventListener("click", event => {

        const singkatanTarget = event.target.closest("[data-singkatan]");

        if (singkatanTarget) {

            const singkatan = singkatanTarget.getAttribute("data-singkatan") || "";
            setAlumniOrmawaFilter(singkatan);

        }

    });

}

function setAlumniOrmawaFilter(ormawa) {

    alumniState.selectedOrmawa = alumniState.selectedOrmawa === ormawa ? "" : ormawa;
    alumniState.currentPage = 1;
    renderAlumniChart();
    renderAlumniLevelChart();
    renderAlumniOrgChart();
    renderAlumniOrmawaChart();
    renderAlumniTable();

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

    const filteredRows = getFilteredAlumniRows();
    const totalRows = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / alumniState.rowsPerPage));
    const currentPage = Math.min(alumniState.currentPage, totalPages);
    const startIndex = (currentPage - 1) * alumniState.rowsPerPage;
    const visibleRows = filteredRows.slice(startIndex, startIndex + alumniState.rowsPerPage);

    alumniState.currentPage = currentPage;

    if (!visibleRows.length) {

        alumniTableBody.innerHTML = `
            <tr>
                <td colspan="7">Data alumni belum tersedia.</td>
            </tr>
        `;

    } else {

        const formatTableCell = (val) => {
            const clean = String(val || "").trim();
            if (!clean || clean === "-") {
                return "Tidak Diketahui";
            }
            return clean;
        };

        alumniTableBody.innerHTML = visibleRows.map((row, rowIndex) => {

            const [no, namaLengkap, , ormawa, jabatan, tahunMenjabat, lkmmTm] = normalizeAlumniRow(row);

            return `
                <tr>
                    <td>${escapeHtml(no || String(startIndex + rowIndex + 1))}</td>
                    <td>${escapeHtml(formatTableCell(namaLengkap))}</td>
                    <td>${escapeHtml(getAlumniFaculty(row))}</td>
                    <td>${escapeHtml(formatTableCell(ormawa))}</td>
                    <td>${escapeHtml(formatTableCell(jabatan))}</td>
                    <td>${escapeHtml(formatTableCell(tahunMenjabat))}</td>
                    <td>${escapeHtml(formatTableCell(lkmmTm))}</td>
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

        alumniMeta.textContent = alumniState.selectedFaculty
            ? `${totalRows} baris data · ${formatFacultyDisplayName(alumniState.selectedFaculty)}`
            : `${totalRows} baris data`;

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

            const totalPages = Math.max(1, Math.ceil(getFilteredAlumniRows().length / alumniState.rowsPerPage));
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

        const meaningfulRows = parsedRows.filter(row => row.some(cell => cell.trim() !== ""));

        if (!meaningfulRows.length) {

            throw new Error("CSV alumni kosong");

        }

        alumniState.headers = meaningfulRows[0];
        alumniState.rows = meaningfulRows.slice(1).map(normalizeAlumniRow);
        alumniState.currentPage = 1;
        renderAlumniChart();
        renderAlumniLevelChart();
        renderAlumniOrgChart();
        renderAlumniOrmawaChart();
        renderAlumniTable();

    } catch (error) {

        console.error(error);

        alumniTableBody.innerHTML = `
            <tr>
                <td colspan="8">Data alumni belum bisa dimuat dari alumni.csv.</td>
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
        trackVirtualPage(targetSection);

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

 
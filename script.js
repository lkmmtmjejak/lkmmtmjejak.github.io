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
            <button type="button" class="announcement-modal-close" aria-label="Tutup modal">&times;</button>
            <h3>Recruitment</h3>
            <p class="announcement-modal-message"></p>
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

function showAnnouncementModal(message, title = "Recruitment", isWide = false) {

    createAnnouncementModal();

    if (!announcementModal || !announcementModalMessage) {

        alert(message);
        return;

    }

    const card = announcementModal.querySelector('.announcement-modal-card');
    if (card) {
        if (isWide) {
            card.classList.add('wide');
        } else {
            card.classList.remove('wide');
        }
    }

    if (announcementModalTitle) {

        announcementModalTitle.innerHTML = title;

    }

    announcementModalMessage.innerHTML = message;
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
    announcementModal.querySelector('.announcement-modal-card')?.classList.remove('wide');

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

// WIRE UP TATA TERTIB TES TULIS MODAL
const btnTataTertibTesTulis = document.getElementById("btn-tata-tertib-tes-tulis");
if (btnTataTertibTesTulis) {
    btnTataTertibTesTulis.addEventListener("click", (event) => {
        event.preventDefault();
        const tataTertibHtml = `
            <p style="text-align: center; font-weight: 700; margin-top: -8px; margin-bottom: 16px; font-size: 1.05rem; color: var(--accent-dark);">LKMM TM ITS &ldquo;JEJAK&rdquo; 2026</p>
            <ul style="text-align: left; padding-left: 18px; margin-bottom: 18px; font-size: 0.88rem; line-height: 1.5; color: var(--text); list-style-type: disc;">
                <li style="margin-bottom: 6px;">Tes Tulis dilaksanakan pada Sabtu, 20 Juni 2026 pukul 13.30 - selesai.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan hadir 15 menit sebelumnya untuk melakukan registrasi.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan mengenakan pakaian standar kuliah.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan mempersiapkan kartu identitas (KTP, KTM, SIM atau KRSM).</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan mempersiapkan alat tulis berupa bolpoin dan kertas.</li>
                <li style="margin-bottom: 6px;">Peserta dilarang mengoperasikan handphone dan barang elektronik lainnya selama tes tulis berlangsung.</li>
                <li style="margin-bottom: 6px;">Dilarang bertanya dalam bentuk apapun kepada siapapun selain kepada Tim Pemandu Jejak.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan menjaga ketertiban dan kondusifitas selama tes tulis berlangsung.</li>
                <li style="margin-bottom: 6px;">Dilarang meninggalkan tempat pengerjaan soal selama tes tulis berlangsung.</li>
                <li style="margin-bottom: 6px;">Peserta wajib menaati tata tertib selama Tes Tulis berlangsung.</li>
                <li style="margin-bottom: 6px;">Segala bentuk kecurangan dapat mempengaruhi status kepesertaan itu sendiri.</li>
                <li style="margin-bottom: 6px;">Kisi &ndash; kisi tes tulis: Wawasan KM ITS, Wawasan ITS, Wawasan LKMM, dan Pengetahuan Umum.</li>
            </ul>
            <p style="text-align: justify; font-size: 0.82rem; line-height: 1.45; color: var(--muted); border-top: 1px solid rgba(122, 78, 78, 0.12); padding-top: 10px; margin-top: 10px;">
                Apabila ada yang berhalangan hadir dikarenakan alasan akademik pada saat Tes Tulis berlangsung, diharapkan menghubungi OA Line Tim Pemandu LKMM TM ITS 2026 (<strong>@ajf2331n</strong>) untuk melakukan konfirmasi maksimal Minggu, 14 Juni 2026 pukul 20.00 WIB.
            </p>
            <div style="margin-top: 16px; text-align: center;">
                <a href="https://lin.ee/NpUKcdM" target="_blank" class="main-button" style="max-width: none; margin-top: 0; padding: 12px 20px; font-size: 0.96rem; background: linear-gradient(135deg, #06C755, #05B04B); box-shadow: 0 8px 20px rgba(6, 199, 85, 0.24); border-radius: 999px; box-sizing: border-box; text-decoration: none; font-weight: 700; color: #fff; display: inline-flex; justify-content: center; align-items: center; gap: 8px;">
                    💬 Hubungi OA Line Pemandu (@ajf2331n)
                </a>
            </div>
        `;
        showAnnouncementModal(tataTertibHtml, "TATA TERTIB TES TULIS", true);
    });
}

// WIRE UP TATA TERTIB INTERVIEW MODAL
const btnTataTertibInterview = document.getElementById("btn-tata-tertib-interview");
if (btnTataTertibInterview) {
    btnTataTertibInterview.addEventListener("click", (event) => {
        event.preventDefault();
        const tataTertibHtml = `
            <p style="text-align: center; font-weight: 700; margin-top: -8px; margin-bottom: 16px; font-size: 1.05rem; color: var(--accent-dark);">LKMM TM ITS &ldquo;JEJAK&rdquo; 2026</p>
            <ul style="text-align: left; padding-left: 18px; margin-bottom: 18px; font-size: 0.88rem; line-height: 1.5; color: var(--text); list-style-type: disc;">
                <li style="margin-bottom: 6px;">Interview dilaksanakan pada Senin, 29 Juni &ndash; Jumat, 3 Juli 2026.</li>
                <li style="margin-bottom: 6px;">Interview dilaksanakan melalui platform Zoom.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan mengenakan pakaian standar kuliah dan on cam.</li>
                <li style="margin-bottom: 6px;">Peserta wajib konfirmasi ke OA Line Pemandu LKMM TM ITS (<strong>@ajf2331n</strong>) terkait kesediaan mengikuti interview maksimal hari Sabtu tanggal 27 Juni 2026 pukul 20.00 WIB. Jika peserta tidak melakukan konfirmasi hingga batas maksimum, maka pemandu berhak menganggap peserta mengundurkan diri atau memberikan sanksi lainnya.</li>
                <li style="margin-bottom: 6px;">Peserta yang berhalangan hadir saat sesi interview diharapkan menukar jadwal dengan peserta lainnya (dengan persetujuan kedua belah pihak peserta), lalu dikonfirmasikan melalui OA Line Pemandu LKMM TM ITS paling lambat H-1 sebelum jadwal interview pengganti berlangsung.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan konfirmasi kembali terkait kehadiran, 15 menit sebelum waktu pelaksanaan interview, kemudian diberikan tautan zoom interview oleh Tim Pemandu LKMM TM ITS.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan menyalakan video dan memperlihatkan wajah ketika proses interview berlangsung, serta harus berada di tempat yang kondusif.</li>
                <li style="margin-bottom: 6px;">Peserta diwajibkan menggunakan identitas asli ketika bergabung dalam platform Zoom.</li>
                <li style="margin-bottom: 6px;">Apabila peserta mengalami kendala berupa tidak ada koneksi internet diwajibkan melakukan konfirmasi ke OA Line Pemandu LKMM TM ITS maksimal H-1 pelaksanaan interview.</li>
                <li style="margin-bottom: 6px;">Peserta yang tidak mengikuti interview dianggap mengundurkan diri dalam proses seleksi LKMM TM ITS 2026.</li>
                <li style="margin-bottom: 6px;">Peserta wajib menaati tata tertib selama interview berlangsung.</li>
                <li style="margin-bottom: 6px;">Keputusan Pemandu tidak dapat diganggu gugat.</li>
                <li style="margin-bottom: 6px;">Hal-hal yang belum ditetapkan dalam ketentuan di atas akan diputuskan kemudian berdasarkan keputusan Pemandu.</li>
            </ul>
            <div style="margin-top: 16px; text-align: center;">
                <a href="https://lin.ee/NpUKcdM" target="_blank" class="main-button" style="max-width: none; margin-top: 0; padding: 12px 20px; font-size: 0.96rem; background: linear-gradient(135deg, #06C755, #05B04B); box-shadow: 0 8px 20px rgba(6, 199, 85, 0.24); border-radius: 999px; box-sizing: border-box; text-decoration: none; font-weight: 700; color: #fff; display: inline-flex; justify-content: center; align-items: center; gap: 8px;">
                    💬 Hubungi OA Line Pemandu (@ajf2331n)
                </a>
            </div>
        `;
        showAnnouncementModal(tataTertibHtml, "TATA TERTIB INTERVIEW", true);
    });
}

// PARTICIPANTS LIST & MODAL LOGIC FOR LOLOS BERKAS
const lolosBerkasParticipants = [
    { nama: "Achmad Hafidur Rohman", nrp: "5002241158" },
    { nama: "Adrian Maulana Rizky", nrp: "5019241010" },
    { nama: "Ahmad Kholid Fauzi", nrp: "5007241094" },
    { nama: "Aidan Abdie Sidratul Muntaha", nrp: "5049241080" },
    { nama: "Ailsa Nabilah Arifin", nrp: "5029241076" },
    { nama: "Ali akbar fadilah", nrp: "5006241074" },
    { nama: "Alya Hasna Fadilah", nrp: "5024241044" },
    { nama: "Ananda Indah Febrianti", nrp: "2041241073" },
    { nama: "Ancha Juvero", nrp: "5007241056" },
    { nama: "Andhika Abhipraya Sunjaya", nrp: "5018241060" },
    { nama: "Andi Waldan Danish Savaraz Palinrungi", nrp: "5012241188" },
    { nama: "Andrea Felicia Ranggong", nrp: "5049241071" },
    { nama: "Anindya Galuh Candrasmoerti", nrp: "5049241099" },
    { nama: "Annisa Dessyifani", nrp: "2040241038" },
    { nama: "Ardiansyah Zacky Saputra", nrp: "2038241023" },
    { nama: "Arya Agung Suryokusumo", nrp: "5016241066" },
    { nama: "At-Thoriqul Mahsyar", nrp: "5001241099" },
    { nama: "Atrasinah Niha Bahiirah", nrp: "2041241004" },
    { nama: "Aussie Rezali Ramadhan Bawolje Junior", nrp: "5046241007" },
    { nama: "Barutama Alfaturrahman", nrp: "5018241011" },
    { nama: "Brammanda Nevan Susilo", nrp: "5012241001" },
    { nama: "Briu Fadil Hidayat", nrp: "5009241133" },
    { nama: "Briyan Ramadiawan", nrp: "5016241064" },
    { nama: "Cahaya Marsyabillah Suwandhi Putri", nrp: "5016241079" },
    { nama: "Chania Lamria Karien Silitonga", nrp: "5006241071" },
    { nama: "Christofher Halim Wijaya", nrp: "5020241020" },
    { nama: "Christopher Joenathan Hindarto", nrp: "5024241028" },
    { nama: "Christya Amanda", nrp: "5008241066" },
    { nama: "DARIS MUFID SASWANDIKA", nrp: "5018241102" },
    { nama: "Daud Rosevelt Simanjuntak", nrp: "50181241063" },
    { nama: "Dean Gathan Supriadi", nrp: "5045241018" },
    { nama: "Dewi Nailul Muna", nrp: "5014241055" },
    { nama: "Dhiwa Irfanul Hadi", nrp: "5004241070" },
    { nama: "Dika Fahreza Yusna", nrp: "5049241056" },
    { nama: "Dinar Aisyah Khairinnisa", nrp: "5014241026" },
    { nama: "Eilada Kaylie Aruneendria", nrp: "5023241078" },
    { nama: "Ekin Farhat Hauda", nrp: "2035241081" },
    { nama: "Elita Evelinanda", nrp: "5015241087" },
    { nama: "Evalia Dwi Kusumawati", nrp: "5003241043" },
    { nama: "Fairuz Aulia Rahman", nrp: "5016241050" },
    { nama: "Farhan Alam Mahmud", nrp: "5006241034" },
    { nama: "Fattah Rizkia Darmawan", nrp: "5011241090" },
    { nama: "Felicia Calista Siringoringo", nrp: "5021241079" },
    { nama: "Fikri Artha Maulana", nrp: "5007241184" },
    { nama: "Fikri Taqiyuddin Azfa Pratama", nrp: "5007241075" },
    { nama: "George Eldzen Edison", nrp: "5052241024" },
    { nama: "Ghaley Ikhbar Abdillah", nrp: "5012241074" },
    { nama: "Hadiyanul Faza Musyaffa", nrp: "5033241028" },
    { nama: "Hakan Maulana Yazid Zidane", nrp: "2042241008" },
    { nama: "Hardiansyah Eka Prasetyo", nrp: "5023241010" },
    { nama: "Himawan Rakha Bhadra", nrp: "5025241028" },
    { nama: "Ibnu Hylmi Rizqullah", nrp: "5018241019" },
    { nama: "Ibrohim", nrp: "504241062" },
    { nama: "Ilham Fathurachman Trinugraha", nrp: "5009241139" },
    { nama: "Jahfal Maulidiyahya Arlan Putera", nrp: "5012241054" },
    { nama: "Jasmine Ramadhania Putri Kusnaryanto", nrp: "5006241033" },
    { nama: "Josua Ruben Dion Sirait", nrp: "5007241061" },
    { nama: "Leon Hersamsi", nrp: "5055241049" },
    { nama: "Lucky Himawan Prasetya", nrp: "5025241147" },
    { nama: "M. Ariel Fitrah Faishal", nrp: "5016241052" },
    { nama: "M. Zaky Fahrezy", nrp: "5011241196" },
    { nama: "Malika Nur Indriati", nrp: "5014241127" },
    { nama: "Marcello Sergio Lontokan", nrp: "5017241072" },
    { nama: "Maulana Fajar Firmansyah", nrp: "2036241047" },
    { nama: "Misbah Alifia Fahmi", nrp: "5046241051" },
    { nama: "Moh. Fawwaz Azalia Alim", nrp: "5023241012" },
    { nama: "Muh. Zaki Ziyaul Haq", nrp: "5014241123" },
    { nama: "Muhamad Farhan Ibrahim Movic", nrp: "5021241054" },
    { nama: "Muhamad Fattur Rizqy Ilham", nrp: "5018241031" },
    { nama: "Muhammad Abid Al Kautsar", nrp: "5046241066" },
    { nama: "Muhammad Abid Rabbani", nrp: "5007241123" },
    { nama: "Muhammad Adi Anugerah Arrahman", nrp: "5025241118" },
    { nama: "Muhammad Assaifunnadhif Alkhifdzi", nrp: "5023241031" },
    { nama: "Muhammad Bintang Al Ghozali", nrp: "2042241060" },
    { nama: "Muhammad Farhan", nrp: "5003241063" },
    { nama: "Muhammad Gibran Adyatma Rachman", nrp: "5012241103" },
    { nama: "Muhammad Guntur Maulana Mursalim", nrp: "5005241101" },
    { nama: "Muhammad Ma'ash Nursalim", nrp: "2042241012" },
    { nama: "Muhammad Nauvel Al Abror", nrp: "5016241015" },
    { nama: "Muhammad Omar Dewantara", nrp: "2043241099" },
    { nama: "Muhammad Puji Prastyo", nrp: "2040241074" },
    { nama: "Muhammad Rafi Ardiansyah", nrp: "2035241065" },
    { nama: "Muhammad Zain Haqqani", nrp: "5001241086" },
    { nama: "Mukhamad Abyan Hilal", nrp: "2041241058" },
    { nama: "Na'ilah Salma", nrp: "5020241115" },
    { nama: "Nabil Fattah Risqullah", nrp: "5004241102" },
    { nama: "Najma Lail Arazy", nrp: "5025241243" },
    { nama: "Naufal Rafa Muhammad Hisyam", nrp: "5033241118" },
    { nama: "Nikita Cavalera H", nrp: "2040241053" },
    { nama: "Nuha Abidatul R", nrp: "5021241039" },
    { nama: "Nurfauziah Hanum", nrp: "5014241118" },
    { nama: "Panglima Nararya Hutama", nrp: "5006241068" },
    { nama: "Puan Amira Adla", nrp: "5033241012" },
    { nama: "Qitasandrina Alberta Chairunisa", nrp: "5050241043" },
    { nama: "Qonita Azzahira", nrp: "5012241062" },
    { nama: "Rafael Kevin Riskajaya", nrp: "5029241040" },
    { nama: "Renata Dea Elvira", nrp: "5029241006" },
    { nama: "Rizky Arkan Nashif", nrp: "5016241081" },
    { nama: "Rr. Allifza Aulia Artha Putri", nrp: "5021241010" },
    { nama: "Ryo Dwi Putro Adi", nrp: "5016241089" },
    { nama: "Selvia Adzania Arifiyanti", nrp: "5003241025" },
    { nama: "Shafira Nauraishma Zahida", nrp: "5025241235" },
    { nama: "Tesalonika Eunike Widodo", nrp: "5010241116" },
    { nama: "Tsabita Amalia Aufa", nrp: "5013240163" },
    { nama: "Valencia Caesari Sepverin", nrp: "5012241130" },
    { nama: "Wira Aryaguna", nrp: "5016241007" },
    { nama: "Yuan Cahya Adhitya", nrp: "5020241065" },
    { nama: "Yuditya Denis Fitran Syah", nrp: "5016241056" },
    { nama: "Zasqy'a Nitansyah Ramadhani", nrp: "5011241006" }
];

const btnLolosBerkas = document.getElementById("btn-lolos-berkas");
if (btnLolosBerkas) {
    btnLolosBerkas.addEventListener("click", (event) => {
        event.preventDefault();

        let rowsHtml = "";
        lolosBerkasParticipants.forEach((p, idx) => {
            const bg = idx % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(122, 78, 78, 0.02)';
            rowsHtml += `
                <tr style="background: ${bg}; border-bottom: 1px solid rgba(122, 78, 78, 0.08); transition: background-color 0.2s;">
                    <td style="padding: 10px 16px; color: var(--muted); font-weight: 600;">${idx + 1}</td>
                    <td style="padding: 10px 16px; font-weight: 600; color: var(--text);">${p.nama}</td>
                    <td style="padding: 10px 16px; color: var(--text); font-family: monospace; font-size: 0.9rem;">${p.nrp}</td>
                </tr>
            `;
        });

        const lolosBerkasHtml = `
            <div class="selection-search-wrapper" style="margin-bottom: 14px; position: relative;">
                <input type="text" id="selection-search" placeholder="Cari nama atau NRP..." style="width: 100%; padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(122, 78, 78, 0.18); background: #fff; color: #333; caret-color: var(--accent-dark); font-size: 0.94rem; outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); transition: border-color 0.2s; box-sizing: border-box;">
            </div>
            <div class="selection-table-container" style="max-height: 280px; overflow-y: auto; border: 1px solid rgba(122, 78, 78, 0.12); border-radius: 14px; background: #fff; box-shadow: 0 4px 12px rgba(64, 43, 43, 0.04);">
                <table style="width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; font-size: 0.88rem; margin: 0;">
                    <thead>
                        <tr>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); width: 50px; background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08);">No</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08);">Nama Lengkap</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); width: 120px; background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08);">NRP</th>
                        </tr>
                    </thead>
                    <tbody id="selection-table-body">
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 18px;">
                <a href="https://lin.ee/NpUKcdM" target="_blank" class="main-button" style="max-width: none; margin-top: 0; padding: 14px 20px; font-size: 1.05rem; background: linear-gradient(135deg, #06C755, #05B04B); box-shadow: 0 8px 20px rgba(6, 199, 85, 0.24); border-radius: 999px; box-sizing: border-box; text-decoration: none; font-weight: 700; color: #fff;">
                    💬 Hubungi OA Line Tim Pemandu
                </a>
            </div>
        `;

        showAnnouncementModal(lolosBerkasHtml, "Peserta Lolos Seleksi Pemberkasan <a href='https://its.id/m/LolosBerkasTM2026' target='_blank' class='announcement-title-link' title='Lihat Surat Resmi Kelolosan'>📄</a>", true);

        // Attach search filter listener
        const searchInput = document.getElementById("selection-search");
        const tableBody = document.getElementById("selection-table-body");
        if (searchInput && tableBody) {
            searchInput.focus();
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase().trim();
                let visibleCount = 0;
                const rows = tableBody.querySelectorAll("tr:not(#no-result-row)");
                rows.forEach((row) => {
                    const name = row.children[1].textContent.toLowerCase();
                    const nrp = row.children[2].textContent.toLowerCase();
                    if (name.includes(query) || nrp.includes(query)) {
                        row.style.display = "";
                        visibleCount++;
                    } else {
                        row.style.display = "none";
                    }
                });

                let noResultRow = document.getElementById("no-result-row");
                if (visibleCount === 0) {
                    if (!noResultRow) {
                        const tr = document.createElement("tr");
                        tr.id = "no-result-row";
                        tr.innerHTML = `<td colspan="3" style="padding: 20px; text-align: center; color: var(--muted); font-style: italic;">Nama atau NRP tidak ditemukan</td>`;
                        tableBody.appendChild(tr);
                    }
                } else if (noResultRow) {
                    noResultRow.remove();
                }
            });
        }
    });
}

// PARTICIPANTS LIST & MODAL LOGIC FOR LOLOS SELEKSI TES TULIS
const lolosTesTulisParticipants = [
    // Senin, 29 Juni 2026
    { hari: "Senin, 29 Juni 2026", sesi: "1", jam: "14.00-15.00", nama: "Achmad Hafidur Rohman", nrp: "5002241158" },
    { hari: "Senin, 29 Juni 2026", sesi: "2", jam: "15.30-16.30", nama: "Adrian Maulana Rizky", nrp: "5019241010" },
    { hari: "Senin, 29 Juni 2026", sesi: "2", jam: "15.30-16.30", nama: "Ahmad Kholid Fauzi", nrp: "5007241094" },
    { hari: "Senin, 29 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "Ailsa Nabilah Arifin", nrp: "5029241076" },
    { hari: "Senin, 29 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "Ali akbar fadilah", nrp: "5006241074" },
    { hari: "Senin, 29 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "Alya Hasna Fadilah", nrp: "5024241044" },
    { hari: "Senin, 29 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "Ananda Indah Febrianti", nrp: "2041241073" },
    { hari: "Senin, 29 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Ancha Juvero", nrp: "5007241056" },
    { hari: "Senin, 29 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Andhika Abhipraya Sunjaya", nrp: "5018241060" },
    { hari: "Senin, 29 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Andi Waldan Danish Savaraz Palinrungi", nrp: "5012241188" },
    { hari: "Senin, 29 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Annisa Dessyifani", nrp: "2040241038" },
    { hari: "Senin, 29 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Ardiansyah Zacky Saputra", nrp: "2038241023" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Arya Agung Suryokusumo", nrp: "5016241066" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "At-Thoriqul Mahsyar", nrp: "5001241099" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Atrasinah Niha Bahiirah", nrp: "2041241004" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Aussie Rezali Ramadhan Bawolje Junior", nrp: "5046241007" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Brammanda Nevan Susilo", nrp: "5012241001" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Briu Fadil Hidayat", nrp: "5009241133" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Briyan Ramadiawan", nrp: "5016241064" },
    { hari: "Senin, 29 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Cahaya Marsyabillah Suwandhi Putri", nrp: "5016241079" },

    // Selasa, 30 Juni 2026
    { hari: "Selasa, 30 Juni 2026", sesi: "1", jam: "14.00-15.00", nama: "Chania Lamria Karien Silitonga", nrp: "5006241071" },
    { hari: "Selasa, 30 Juni 2026", sesi: "2", jam: "15.30-16.30", nama: "Christofher Halim Wijaya", nrp: "5020241020" },
    { hari: "Selasa, 30 Juni 2026", sesi: "2", jam: "15.30-16.30", nama: "Christopher Joenathan Hindarto", nrp: "5024241028" },
    { hari: "Selasa, 30 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "Christya Amanda", nrp: "5008241066" },
    { hari: "Selasa, 30 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "DARIS MUFID SASWANDIKA", nrp: "5018241102" },
    { hari: "Selasa, 30 Juni 2026", sesi: "3", jam: "18.00-19.00", nama: "Daud Rosevelt Simanjuntak", nrp: "50181241063" },
    { hari: "Selasa, 30 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Dean Gathan Supriadi", nrp: "5045241018" },
    { hari: "Selasa, 30 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Dewi Nailul Muna", nrp: "5014241055" },
    { hari: "Selasa, 30 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Dhiwa Irfanul Hadi", nrp: "5004241070" },
    { hari: "Selasa, 30 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Dika Fahreza Yusna", nrp: "5049241056" },
    { hari: "Selasa, 30 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Dinar Aisyah Khairinnisa", nrp: "5014241026" },
    { hari: "Selasa, 30 Juni 2026", sesi: "4", jam: "19.30-20.30", nama: "Eilada Kaylie Aruneendria", nrp: "5023241078" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Ekin Farhat Hauda", nrp: "2035241081" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Elita Evelinanda", nrp: "5015241087" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Evalia Dwi Kusumawati", nrp: "5003241043" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Fairuz Aulia Rahman", nrp: "5016241050" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Farhan Alam Mahmud", nrp: "5006241034" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Fattah Rizkia Darmawan", nrp: "5011241090" },
    { hari: "Selasa, 30 Juni 2026", sesi: "5", jam: "21.00-22.00", nama: "Felicia Calista Siringoringo", nrp: "5021241079" },

    // Rabu, 1 Juli 2026
    { hari: "Rabu, 1 Juli 2026", sesi: "1", jam: "14.00-15.00", nama: "Fikri Artha Maulana", nrp: "5007241184" },
    { hari: "Rabu, 1 Juli 2026", sesi: "2", jam: "15.30-16.30", nama: "Fikri Taqiyuddin Azfa Pratama", nrp: "5007241075" },
    { hari: "Rabu, 1 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "George Eldzen Edison", nrp: "5052241024" },
    { hari: "Rabu, 1 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Ghaley Ikhbar Abdillah", nrp: "5012241074" },
    { hari: "Rabu, 1 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Hadiyanul Faza Musyaffa", nrp: "5033241028" },
    { hari: "Rabu, 1 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Hakan Maulana Yazid Zidane", nrp: "2042241008" },
    { hari: "Rabu, 1 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Hardyansyah Eka Prasetyo", nrp: "5023241010" },
    { hari: "Rabu, 1 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Himawan Rakha Bhadra", nrp: "5025241028" },
    { hari: "Rabu, 1 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Ibnu Hylmi Rizqullah", nrp: "5018241019" },
    { hari: "Rabu, 1 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Ibrohim", nrp: "5004241062" },
    { hari: "Rabu, 1 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Ilham Fathurachman Trinugraha", nrp: "5009241139" },
    { hari: "Rabu, 1 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Jahfal Maulidiyahya Arlan Putera", nrp: "5012241054" },
    { hari: "Rabu, 1 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Jasmine Ramadhania Putri Kusnaryanto", nrp: "5006241033" },
    { hari: "Rabu, 1 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Josua Ruben Dion Sirait", nrp: "5007241061" },
    { hari: "Rabu, 1 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Lucky Himawan Prasetya", nrp: "5025241147" },
    { hari: "Rabu, 1 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "M. Ariel Fitrah Faishal", nrp: "5016241052" },

    // Kamis, 2 Juli 2026
    { hari: "Kamis, 2 Juli 2026", sesi: "1", jam: "14.00-15.00", nama: "M. Zaky Fahrezy", nrp: "5011241196" },
    { hari: "Kamis, 2 Juli 2026", sesi: "2", jam: "15.30-16.30", nama: "Malika Nur Indriati", nrp: "5014241127" },
    { hari: "Kamis, 2 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Marcello Sergio Lontokan", nrp: "5017241072" },
    { hari: "Kamis, 2 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Maulana Fajar Firmansyah", nrp: "2036241047" },
    { hari: "Kamis, 2 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "MISBAH ALIFIA FAHMI", nrp: "5046241051" },
    { hari: "Kamis, 2 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Moh. Fawwaz Azalia Alim", nrp: "5023241012" },
    { hari: "Kamis, 2 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Muh. Zaki Ziyaul Haq", nrp: "5014241123" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhamad Farhan Ibrahim Movic", nrp: "5021241054" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhamad Fattur Rizqy Ilham", nrp: "5018241031" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhammad Abid Al Kautsar", nrp: "5046241066" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhammad Abid Rabbani", nrp: "5007241123" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhammad Adi Anugerah Arrahman", nrp: "5025241118" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhammad Assaifunnadhif Alkhifdzi", nrp: "5023241031" },
    { hari: "Kamis, 2 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Muhammad Bintang Al Ghozali", nrp: "2042241060" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Farhan", nrp: "5003241063" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Gibran Adyatma Rachman", nrp: "5012241103" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Guntur Maulana Mursalim", nrp: "5005241101" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Ma'ash Nursalim", nrp: "2042241012" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Nauvel Al Abror", nrp: "5016241015" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Omar Dewantara", nrp: "2043241099" },
    { hari: "Kamis, 2 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Muhammad Rafi Ardiansyah", nrp: "2035241065" },

    // Jumat, 3 Juli 2026
    { hari: "Jumat, 3 Juli 2026", sesi: "1", jam: "14.00-15.00", nama: "Muhammad Zain Haqqani", nrp: "5001241086" },
    { hari: "Jumat, 3 Juli 2026", sesi: "2", jam: "15.30-16.30", nama: "Mukhamad Abyan Hilal", nrp: "2041241058" },
    { hari: "Jumat, 3 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Na'ilah Salma", nrp: "5020241115" },
    { hari: "Jumat, 3 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Nabil Fattah Risqullah", nrp: "5004241102" },
    { hari: "Jumat, 3 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Najma Lail Arazy", nrp: "5025241243" },
    { hari: "Jumat, 3 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Naufal Rafa Muhammad Hisyam", nrp: "5033241118" },
    { hari: "Jumat, 3 Juli 2026", sesi: "3", jam: "18.00-19.00", nama: "Nikita Cavalera H", nrp: "2040241053" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Nuha Abidatul R", nrp: "5021241039" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Panglima Nararya Hutama", nrp: "5006241068" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Puan Amira Adla", nrp: "5033241012" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Qitasandrina Alberta Chairunisa", nrp: "5050241043" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Rizky Arkan Nashif", nrp: "5016241081" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Rr. Allifza Aulia Artha Putri", nrp: "5021241010" },
    { hari: "Jumat, 3 Juli 2026", sesi: "4", jam: "19.30-20.30", nama: "Ryo Dwi Putro Adi", nrp: "5016241089" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Selvia Adzania Arifiyanti", nrp: "5003241025" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Shafira Nauraishma Zahida", nrp: "5025241235" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Tesalonika Eunike Widodo", nrp: "5010241116" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Tsabita Amalia Aufa", nrp: "5013240163" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Wira Aryaguna", nrp: "5016241007" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Yuan Cahya Adhitya", nrp: "5020241065" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Yuditya Denis Fitran Syah", nrp: "5016241056" },
    { hari: "Jumat, 3 Juli 2026", sesi: "5", jam: "21.00-22.00", nama: "Zasqy'a Nitansyah Ramadhani", nrp: "5011241006" }
];

const btnLolosTesTulis = document.getElementById("btn-lolos-tes-tulis");
if (btnLolosTesTulis) {
    btnLolosTesTulis.addEventListener("click", (event) => {
        event.preventDefault();

        let rowsHtml = "";
        lolosTesTulisParticipants.forEach((p, idx) => {
            const bg = idx % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(122, 78, 78, 0.02)';
            rowsHtml += `
                <tr style="background: ${bg}; border-bottom: 1px solid rgba(122, 78, 78, 0.08); transition: background-color 0.2s;">
                    <td style="padding: 10px 16px; color: var(--muted); font-weight: 600; text-align: center;">${idx + 1}</td>
                    <td style="padding: 10px 16px; color: var(--text); white-space: nowrap;">${p.hari}</td>
                    <td style="padding: 10px 16px; color: var(--text); text-align: center; font-weight: 600;">${p.sesi}</td>
                    <td style="padding: 10px 16px; color: var(--text); white-space: nowrap; font-family: monospace;">${p.jam}</td>
                    <td style="padding: 10px 16px; font-weight: 600; color: var(--text);">${p.nama}</td>
                    <td style="padding: 10px 16px; color: var(--text); font-family: monospace; font-size: 0.9rem;">${p.nrp}</td>
                </tr>
            `;
        });

        const lolosTesTulisHtml = `
            <div class="selection-search-wrapper" style="margin-bottom: 14px; position: relative;">
                <input type="text" id="selection-search-tulis" placeholder="Cari nama, NRP, atau hari/tanggal..." style="width: 100%; padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(122, 78, 78, 0.18); background: #fff; color: #333; caret-color: var(--accent-dark); font-size: 0.94rem; outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); transition: border-color 0.2s; box-sizing: border-box;">
            </div>
            <div class="selection-table-container" style="max-height: 380px; overflow-y: auto; overflow-x: auto; border: 1px solid rgba(122, 78, 78, 0.12); border-radius: 14px; background: #fff; box-shadow: 0 4px 12px rgba(64, 43, 43, 0.04);">
                <table style="width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; font-size: 0.88rem; margin: 0; min-width: 680px;">
                    <thead>
                        <tr>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); width: 50px; background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08); text-align: center;">No</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08); white-space: nowrap;">Hari, Tanggal</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); width: 60px; background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08); text-align: center;">Sesi</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); width: 110px; background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08); white-space: nowrap;">Jam</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08);">Nama Lengkap</th>
                            <th style="padding: 12px 16px; font-weight: 700; color: var(--accent-dark); width: 120px; background: #faf4ee; border-bottom: 2px solid rgba(122, 78, 78, 0.15); position: sticky; top: 0; z-index: 10; box-shadow: 0 3px 6px rgba(64, 43, 43, 0.08);">NRP</th>
                        </tr>
                    </thead>
                    <tbody id="selection-table-body-tulis">
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 18px;">
                <a href="https://lin.ee/NpUKcdM" target="_blank" class="main-button" style="max-width: none; margin-top: 0; padding: 14px 20px; font-size: 1.05rem; background: linear-gradient(135deg, #06C755, #05B04B); box-shadow: 0 8px 20px rgba(6, 199, 85, 0.24); border-radius: 999px; box-sizing: border-box; text-decoration: none; font-weight: 700; color: #fff;">
                    💬 Hubungi OA Line Tim Pemandu
                </a>
            </div>
        `;

        showAnnouncementModal(lolosTesTulisHtml, "Peserta Lolos Seleksi Tes Tulis & Jadwal Interview", true);

        // Attach search filter listener
        const searchInput = document.getElementById("selection-search-tulis");
        const tableBody = document.getElementById("selection-table-body-tulis");
        if (searchInput && tableBody) {
            searchInput.focus();
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase().trim();
                let visibleCount = 0;
                const rows = tableBody.querySelectorAll("tr:not(#no-result-row-tulis)");
                rows.forEach((row) => {
                    const tanggal = row.children[1].textContent.toLowerCase();
                    const name = row.children[4].textContent.toLowerCase();
                    const nrp = row.children[5].textContent.toLowerCase();
                    if (name.includes(query) || nrp.includes(query) || tanggal.includes(query)) {
                        row.style.display = "";
                        visibleCount++;
                    } else {
                        row.style.display = "none";
                    }
                });

                let noResultRow = document.getElementById("no-result-row-tulis");
                if (visibleCount === 0) {
                    if (!noResultRow) {
                        const tr = document.createElement("tr");
                        tr.id = "no-result-row-tulis";
                        tr.innerHTML = `<td colspan="6" style="padding: 20px; text-align: center; color: var(--muted); font-style: italic;">Nama, NRP, atau tanggal tidak ditemukan</td>`;
                        tableBody.appendChild(tr);
                    }
                } else if (noResultRow) {
                    noResultRow.remove();
                }
            });
        }
    });
}

// WIRE UP JADWAL TES TULIS MODAL
const btnJadwalTesTulis = document.getElementById("btn-jadwal-tes-tulis");
if (btnJadwalTesTulis) {
    btnJadwalTesTulis.addEventListener("click", (event) => {
        event.preventDefault();
        const jadwalHtml = `
            <p style="text-align: center; font-weight: 700; margin-top: -8px; margin-bottom: 20px; font-size: 1.05rem; color: var(--accent-dark);">LKMM TM ITS &ldquo;JEJAK&rdquo; 2026</p>
            <div style="text-align: left; margin-bottom: 20px; font-size: 0.94rem; line-height: 1.6; color: var(--text); background: rgba(122, 78, 78, 0.03); border: 1px solid rgba(122, 78, 78, 0.1); padding: 16px; border-radius: 14px;">
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">📍</span>
                    <div>
                        <strong>Lokasi:</strong><br>
                        Lantai 7, Tower 1 ITS
                    </div>
                </div>
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">📅</span>
                    <div>
                        <strong>Hari, Tanggal:</strong><br>
                        Sabtu, 20 Juni 2026
                    </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">⏰</span>
                    <div>
                        <strong>Waktu:</strong><br>
                        13.30 WIB - selesai
                    </div>
                </div>
            </div>
            <p style="text-align: justify; font-size: 0.84rem; line-height: 1.45; color: var(--muted); border-top: 1px solid rgba(122, 78, 78, 0.12); padding-top: 10px; margin-top: 10px;">
                Bagi peserta yang berhalangan hadir dikarenakan alasan akademik pada saat Tes Tulis berlangsung, harap segera menghubungi OA Line Tim Pemandu LKMM TM ITS 2026 untuk melakukan konfirmasi.
            </p>
            <div style="margin-top: 16px; text-align: center;">
                <a href="https://lin.ee/NpUKcdM" target="_blank" class="main-button" style="max-width: none; margin-top: 0; padding: 12px 20px; font-size: 0.96rem; background: linear-gradient(135deg, #06C755, #05B04B); box-shadow: 0 8px 20px rgba(6, 199, 85, 0.24); border-radius: 999px; box-sizing: border-box; text-decoration: none; font-weight: 700; color: #fff; display: inline-flex; justify-content: center; align-items: center; gap: 8px;">
                    💬 Hubungi OA Line Pemandu
                </a>
            </div>
        `;
        showAnnouncementModal(jadwalHtml, "JADWAL TES TULIS", false);
    });
}

// WIRE UP JADWAL INTERVIEW MODAL
const btnJadwalInterview = document.getElementById("btn-jadwal-interview");
if (btnJadwalInterview) {
    btnJadwalInterview.addEventListener("click", (event) => {
        event.preventDefault();
        const jadwalHtml = `
            <p style="text-align: center; font-weight: 700; margin-top: -8px; margin-bottom: 20px; font-size: 1.05rem; color: var(--accent-dark);">LKMM TM ITS &ldquo;JEJAK&rdquo; 2026</p>
            <div style="text-align: left; margin-bottom: 20px; font-size: 0.94rem; line-height: 1.6; color: var(--text); background: rgba(122, 78, 78, 0.03); border: 1px solid rgba(122, 78, 78, 0.1); padding: 16px; border-radius: 14px;">
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">📍</span>
                    <div>
                        <strong>Lokasi:</strong><br>
                        Zoom Meeting (Online)
                    </div>
                </div>
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">📅</span>
                    <div>
                        <strong>Hari, Tanggal:</strong><br>
                        Senin - Jumat, 29 Juni - 3 Juli 2026
                    </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">⏰</span>
                    <div>
                        <strong>Waktu:</strong><br>
                        Sesuai sesi masing-masing
                    </div>
                </div>
            </div>

            <!-- SEARCH JADWAL -->
            <div style="text-align: left; margin-bottom: 20px;">
                <strong style="display: block; margin-bottom: 8px; font-size: 0.94rem; color: var(--accent-dark);">🔍 Cari Jadwal Interview Anda:</strong>
                <input type="text" id="search-int-schedule" placeholder="Ketik nama atau NRP Anda..." style="width: 100%; padding: 12px 16px; border-radius: 999px; border: 1px solid rgba(122, 78, 78, 0.18); background: #fff; color: #333; caret-color: var(--accent-dark); font-size: 0.94rem; outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); transition: border-color 0.2s; box-sizing: border-box;">
                
                <div id="search-int-result" style="margin-top: 12px; padding: 14px; border-radius: 14px; background: rgba(122, 78, 78, 0.02); border: 1px solid rgba(122, 78, 78, 0.08); min-height: 52px; box-sizing: border-box;">
                    <p style="margin: 0; color: var(--muted); font-style: italic; font-size: 0.86rem; text-align: center;">Ketik nama atau NRP di atas untuk melihat jadwal interview Anda.</p>
                </div>
            </div>

            <!-- WARNINGS -->
            <div style="text-align: left; font-size: 0.86rem; line-height: 1.5; color: var(--muted); border-top: 1px solid rgba(122, 78, 78, 0.12); padding-top: 14px;">
                <strong style="color: #c0392b; display: block; margin-bottom: 6px; font-size: 0.9rem;">⚠️ PENTING:</strong>
                <ul style="padding-left: 18px; margin: 0; list-style-type: decimal; color: var(--text);">
                    <li style="margin-bottom: 6px;">Wajib menghubungi pemandu mengenai bisa atau tidaknya mengikuti interview.</li>
                    <li style="margin-bottom: 6px;">Jika berhalangan hadir di sesi tersebut, segera cari pengganti sendiri dan wajib konfirmasi ke pemandu juga!</li>
                    <li style="margin-bottom: 6px;">Link Zoom hanya akan dibagikan ketika peserta menghubungi pemandu melalui OA Line.</li>
                </ul>
            </div>

            <div style="margin-top: 18px; text-align: center;">
                <a href="https://lin.ee/NpUKcdM" target="_blank" class="main-button" style="max-width: none; margin-top: 0; padding: 14px 20px; font-size: 1.02rem; background: linear-gradient(135deg, #06C755, #05B04B); box-shadow: 0 8px 20px rgba(6, 199, 85, 0.24); border-radius: 999px; box-sizing: border-box; text-decoration: none; font-weight: 700; color: #fff; display: inline-flex; justify-content: center; align-items: center; gap: 8px;">
                    💬 Hubungi OA Line Pemandu
                </a>
            </div>
        `;
        showAnnouncementModal(jadwalHtml, "JADWAL INTERVIEW", false);

        // Attach interactive search logic
        const searchInput = document.getElementById("search-int-schedule");
        const resultContainer = document.getElementById("search-int-result");

        if (searchInput && resultContainer) {
            searchInput.focus();
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase().trim();

                if (!query) {
                    resultContainer.innerHTML = `<p style="margin: 0; color: var(--muted); font-style: italic; font-size: 0.86rem; text-align: center;">Ketik nama atau NRP di atas untuk melihat jadwal interview Anda.</p>`;
                    return;
                }

                // Filter participants
                const matches = lolosTesTulisParticipants.filter(p => 
                    p.nama.toLowerCase().includes(query) || p.nrp.toLowerCase().includes(query)
                );

                if (matches.length === 0) {
                    resultContainer.innerHTML = `<p style="margin: 0; color: #c0392b; font-style: italic; font-size: 0.86rem; text-align: center; font-weight: 600;">Data tidak ditemukan. Pastikan nama atau NRP dimasukkan dengan benar.</p>`;
                } else {
                    // Render matches list
                    let listHtml = `<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px;">`;
                    matches.forEach((p, index) => {
                        const borderStyle = index === matches.length - 1 ? "" : "border-bottom: 1px solid rgba(122, 78, 78, 0.06); padding-bottom: 8px;";
                        listHtml += `
                            <li style="${borderStyle}">
                                <div style="font-weight: 700; color: var(--accent-dark); font-size: 0.92rem; margin-bottom: 3px;">${p.nama} (${p.nrp})</div>
                                <div style="font-size: 0.84rem; color: var(--text); display: grid; grid-template-columns: 50px 1fr; gap: 2px 4px;">
                                    <strong>Hari:</strong> <span>${p.hari}</span>
                                    <strong>Sesi:</strong> <span>Sesi ${p.sesi} (${p.jam})</span>
                                </div>
                            </li>
                        `;
                    });
                    listHtml += `</ul>`;
                    resultContainer.innerHTML = listHtml;
                }
            });
        }
    });
}

// ==========================================
// FAQ ACCORDION INTERACTIVITY
// ==========================================

function initFaqAccordion() {
    const faqHeaders = document.querySelectorAll(".faq-l1-header, .faq-l2-header, .faq-l3-header");

    faqHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isActive = item.classList.contains("active");

            // Close siblings at the same level
            const siblingsSelector = 
                item.classList.contains("faq-l1-item") ? ":scope > .faq-l1-item" :
                item.classList.contains("faq-l2-item") ? ":scope > .faq-l2-item" :
                ":scope > .faq-l3-item";
            
            const siblings = item.parentElement.querySelectorAll(siblingsSelector);
            
            siblings.forEach(sib => {
                if (sib !== item) {
                    sib.classList.remove("active");
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove("active");
            } else {
                item.classList.add("active");
            }
        });
    });
}

initFaqAccordion();
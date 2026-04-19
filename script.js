/* =========================
   ELEMENTS
========================= */
const gridSections = document.getElementById("pcGridSections");

const desktopSearch = document.getElementById("searchDesktop");
const mobileSearch = document.getElementById("searchMobile");

const desktopFilterButtons = document.querySelectorAll(".sidebar .filter-btn");
const desktopDropdownButtons = document.querySelectorAll(".sidebar .dropdown-btn");
const desktopResetButton = document.getElementById("resetFiltersDesktop");

const openPanelButtons = document.querySelectorAll(".filter-open-btn");
const closePanelButtons = document.querySelectorAll(".close-panel");
const overlay = document.getElementById("filterOverlay");
const panels = document.querySelectorAll(".filter-panel");

const panelFilterOptions = document.querySelectorAll(".filter-panel .filter-option");
const panelResetButtons = document.querySelectorAll(".filter-panel .reset-btn");
const panelApplyButtons = document.querySelectorAll(".filter-panel .apply-btn");

/* =========================
   STATE
========================= */
const state = {
  member: "all",
  benefit: "all",
  era: "all",
  search: ""
};

const draftState = {
  member: "all",
  benefit: "all",
  era: "all"
};

/* =========================
   HELPERS
========================= */
function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatEraLabel(era) {
  const eraMap = {
    all: "Eras",
    gbttf: "Go Back To The Future",
    biu: "Beat It Up",
    bothsides: "Both Sides"
  };

  return eraMap[era] || capitalize(era);
}

function formatBenefitLabel(benefit) {
  const benefitMap = {
    all: "Benefits",
    album: "Album",
    pob: "Pre-Order Benefit",
    ld: "Lucky Draw",
    fanmeeting: "Fan Meeting",
    merch: "Merchandise",
    etc: "Etc"
  };

  return benefitMap[benefit] || capitalize(benefit);
}

function formatMemberLabel(member) {
  const memberMap = {
    all: "Members",
    jeno: "Jeno",
    jaemin: "Jaemin",
    unit: "Unit"
  };

  return memberMap[member] || capitalize(member);
}

function getFilterLabel(type, value) {
  if (type === "member") return formatMemberLabel(value);
  if (type === "benefit") return formatBenefitLabel(value);
  if (type === "era") return formatEraLabel(value);
  return "";
}

function syncSearchInputs(value) {
  if (desktopSearch) desktopSearch.value = value;
  if (mobileSearch) mobileSearch.value = value;
}

function getFilteredData() {
  const keyword = state.search.toLowerCase().trim();

  return data.filter((item) => {
    const member = (item.member || "").toLowerCase();
    const benefit = (item.benefit || "").toLowerCase();
    const era = (item.era || "").toLowerCase();
    const title = (item.title || "").toLowerCase();

    const searchableText = `${title} ${member} ${benefit} ${era}`;

    const matchMember = state.member === "all" || member === state.member;
    const matchBenefit = state.benefit === "all" || benefit === state.benefit;
    const matchEra = state.era === "all" || era === state.era;
    const matchSearch = keyword === "" || searchableText.includes(keyword);

    return matchMember && matchBenefit && matchEra && matchSearch;
  });
}

/* =========================
   RENDER
========================= */
function renderCards() {
  if (!gridSections) return;

  const filteredData = getFilteredData();
  gridSections.innerHTML = "";

  if (!filteredData.length) {
    gridSections.innerHTML = `<p class="empty-state">No photocards found.</p>`;
    return;
  }

  const grouped = {};

  filteredData.forEach((item) => {
    const eraKey = item.era || "unknown";

    if (!grouped[eraKey]) {
      grouped[eraKey] = [];
    }

    grouped[eraKey].push(item);
  });

  Object.keys(grouped).forEach((era) => {
    const section = document.createElement("section");
    section.className = "era-section";

    const heading = document.createElement("h2");
    heading.className = "era-title";
    heading.textContent = formatEraLabel(era);

    const eraGrid = document.createElement("div");
    eraGrid.className = "pc-grid";

    grouped[era].forEach((item) => {
      const card = document.createElement("div");
      card.className = "pc-card";

      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="pc-info-bottom">
          <p class="member">${capitalize(item.member)}</p>
          <p class="title">${item.title}</p>
        </div>
      `;

      eraGrid.appendChild(card);
    });

    section.appendChild(heading);
    section.appendChild(eraGrid);
    gridSections.appendChild(section);
  });
}

function applyFilters() {
  renderCards();
  updateFilterLabels();
}

/* =========================
   ACTIVE STATES
========================= */
function updateDesktopActiveButtons() {
  desktopFilterButtons.forEach((button) => {
    const type = button.dataset.filterType;
    const value = button.dataset.filterValue;

    if (!type) return;

    button.classList.toggle("active", state[type] === value);
  });
}

function updatePanelActiveButtons() {
  panelFilterOptions.forEach((button) => {
    const type = button.dataset.filterType;
    const value = button.dataset.filterValue;

    if (!type) return;

    button.classList.toggle("active", draftState[type] === value);
  });
}

function updateFilterLabels() {
  desktopDropdownButtons.forEach((button) => {
    const type = button.dataset.labelType;
    const arrow = button.querySelector(".arrow");

    if (!type || !arrow) return;

    const isRotated = arrow.classList.contains("rotate");
    const label = getFilterLabel(type, state[type]);

    button.innerHTML = `${label} <span class="arrow ${isRotated ? "rotate" : ""}">▼</span>`;
    button.classList.toggle("active-label", state[type] !== "all");
  });

  openPanelButtons.forEach((button) => {
    const type = button.dataset.labelType;

    if (!type) return;

    button.textContent = getFilterLabel(type, state[type]);
    button.classList.toggle("active-label", state[type] !== "all");
  });
}

/* =========================
   PANEL / DROPDOWN HELPERS
========================= */
function copyStateToDraft() {
  draftState.member = state.member;
  draftState.benefit = state.benefit;
  draftState.era = state.era;
}

function closeDesktopDropdowns() {
  document.querySelectorAll(".sidebar .dropdown-menu").forEach((menu) => {
    menu.classList.remove("show");
  });

  document.querySelectorAll(".sidebar .arrow").forEach((arrow) => {
    arrow.classList.remove("rotate");
  });

  updateFilterLabels();
}

function closeAllPanels() {
  panels.forEach((panel) => {
    panel.classList.remove("show");
  });

  if (overlay) {
    overlay.classList.remove("show");
  }
}

function openPanel(panelId) {
  const targetPanel = document.getElementById(panelId);

  if (!targetPanel) return;

  copyStateToDraft();
  updatePanelActiveButtons();
  closeAllPanels();

  targetPanel.classList.add("show");

  if (overlay) {
    overlay.classList.add("show");
  }
}

/* =========================
   RESET / APPLY
========================= */
function resetAllState() {
  state.member = "all";
  state.benefit = "all";
  state.era = "all";
  state.search = "";

  copyStateToDraft();
  syncSearchInputs("");
  updateDesktopActiveButtons();
  updatePanelActiveButtons();
  applyFilters();
}

function resetDraftByPanel(panel) {
  if (!panel) return;

  const panelId = panel.id;

  if (panelId === "membersPanel") {
    draftState.member = "all";
  } else if (panelId === "benefitPanel") {
    draftState.benefit = "all";
  } else if (panelId === "eraPanel") {
    draftState.era = "all";
  } else if (panelId === "allFiltersPanel") {
    draftState.member = "all";
    draftState.benefit = "all";
    draftState.era = "all";
  }

  updatePanelActiveButtons();
}

function applyDraftByPanel(panel) {
  if (!panel) return;

  const panelId = panel.id;

  if (panelId === "membersPanel") {
    state.member = draftState.member;
  } else if (panelId === "benefitPanel") {
    state.benefit = draftState.benefit;
  } else if (panelId === "eraPanel") {
    state.era = draftState.era;
  } else if (panelId === "allFiltersPanel") {
    state.member = draftState.member;
    state.benefit = draftState.benefit;
    state.era = draftState.era;
  }

  updateDesktopActiveButtons();
  applyFilters();
  closeAllPanels();
}

/* =========================
   SUMMARY
========================= */
function updateSummary() {
  const count = {
    total: data.length,
    unit: 0,
    jeno: 0,
    jaemin: 0
  };

  data.forEach((item) => {
    if (item.member === "unit") {
      count.unit++;
    } else if (item.member === "jeno") {
      count.jeno++;
    } else if (item.member === "jaemin") {
      count.jaemin++;
    }
  });

  const summary = document.getElementById("pcSummary");

  if (!summary) return;

  summary.innerHTML = `
    <div class="summary-grid">
      <div class="summary-card">
        <span class="summary-label">Total</span>
        <strong class="summary-value">${count.total}</strong>
      </div>

      <div class="summary-card">
        <span class="summary-label">Unit</span>
        <strong class="summary-value">${count.unit}</strong>
      </div>

      <div class="summary-card">
        <span class="summary-label">Jeno</span>
        <strong class="summary-value">${count.jeno}</strong>
      </div>

      <div class="summary-card">
        <span class="summary-label">Jaemin</span>
        <strong class="summary-value">${count.jaemin}</strong>
      </div>
    </div>
  `;
}

/* =========================
   EVENTS
========================= */
desktopDropdownButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const menu = button.nextElementSibling;
    const arrow = button.querySelector(".arrow");

    document.querySelectorAll(".sidebar .dropdown-menu").forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.classList.remove("show");
      }
    });

    document.querySelectorAll(".sidebar .arrow").forEach((otherArrow) => {
      if (otherArrow !== arrow) {
        otherArrow.classList.remove("rotate");
      }
    });

    if (menu) {
      menu.classList.toggle("show");
    }

    if (arrow) {
      arrow.classList.toggle("rotate");
    }

    updateFilterLabels();
  });
});

desktopFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.filterType;
    const value = button.dataset.filterValue;

    if (!type) return;

    if (state[type] === value) {
      state[type] = "all";
    } else {
      state[type] = value;
    }

    updateDesktopActiveButtons();
    applyFilters();
    closeDesktopDropdowns();
  });
});

if (desktopResetButton) {
  desktopResetButton.addEventListener("click", () => {
    resetAllState();
    closeDesktopDropdowns();
  });
}

openPanelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPanel(button.dataset.panel);
  });
});

closePanelButtons.forEach((button) => {
  button.addEventListener("click", closeAllPanels);
});

if (overlay) {
  overlay.addEventListener("click", closeAllPanels);
}

panelFilterOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.filterType;
    const value = button.dataset.filterValue;

    if (!type) return;

    if (draftState[type] === value) {
      draftState[type] = "all";
    } else {
      draftState[type] = value;
    }

    updatePanelActiveButtons();
  });
});

panelResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetDraftByPanel(button.closest(".filter-panel"));
  });
});

panelApplyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyDraftByPanel(button.closest(".filter-panel"));
  });
});

if (desktopSearch) {
  desktopSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    syncSearchInputs(state.search);
    applyFilters();
  });
}

if (mobileSearch) {
  mobileSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    syncSearchInputs(state.search);
    applyFilters();
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".sidebar .dropdown-group")) {
    closeDesktopDropdowns();
  }
});

/* =========================
   INIT
========================= */
renderCards();
updateSummary();
copyStateToDraft();
updateDesktopActiveButtons();
updatePanelActiveButtons();
syncSearchInputs(state.search);
updateFilterLabels();
applyFilters();

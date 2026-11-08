const serviceGrid = document.getElementById("serviceGrid");
const searchInput = document.getElementById("serviceSearch");
const categoryFilters = document.getElementById("categoryFilters");
const serviceCount = document.getElementById("serviceCount");
const emptyState = document.getElementById("emptyState");
let allServices = [];
let activeCategory = "ସମସ୍ତ";

const categoryIcons = { "ପରିଚୟ ପତ୍ର":"▣", "ଯାନବାହନ":"⌁", "ସରକାରୀ ସେବା":"⌂", "ଡକ୍ୟୁମେଣ୍ଟ":"▤", "ବ୍ୟବସାୟ":"⌘" };

function makeCard(service) {
  const card = document.createElement("article");
  card.className = "service-card";
  const icon = document.createElement("div");
  icon.className = "service-icon";
  icon.textContent = service.icon || categoryIcons[service.category] || "✦";
  const title = document.createElement("h3");
  title.textContent = service.name;
  const description = document.createElement("p");
  description.textContent = service.description;
  const meta = document.createElement("div");
  meta.className = "service-meta";
  const tag = document.createElement("span");
  tag.className = "service-tag";
  tag.textContent = service.category;
  const link = document.createElement("a");
  link.className = "service-link";
  link.href = service.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "ଅଫିସିଆଲ୍ ପୋର୍ଟାଲ୍ ↗";
  meta.append(tag, link);
  card.append(icon, title, description, meta);
  return card;
}

function renderFilters() {
  const categories = ["ସମସ୍ତ", ...new Set(allServices.map(item => item.category))];
  categoryFilters.replaceChildren();
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn" + (category === activeCategory ? " active" : "");
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderServices();
    });
    categoryFilters.append(button);
  });
}

function renderServices() {
  const term = (searchInput.value || "").trim().toLocaleLowerCase();
  const filtered = allServices.filter(item => {
    const matchesCategory = activeCategory === "ସମସ୍ତ" || item.category === activeCategory;
    const searchable = [item.name, item.description, item.category, ...(item.keywords || [])].join(" ").toLocaleLowerCase();
    return matchesCategory && searchable.includes(term);
  });
  serviceGrid.replaceChildren(...filtered.map(makeCard));
  serviceCount.textContent = `${filtered.length}ଟି ସେବା ଦେଖାଯାଉଛି`;
  emptyState.hidden = filtered.length !== 0;
}

async function loadServices() {
  try {
    const response = await fetch("data/services.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load services");
    allServices = await response.json();
    renderFilters();
    renderServices();
  } catch (error) {
    serviceGrid.innerHTML = '<p class="loading">ସେବା ତାଲିକା ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ। ପରେ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।</p>';
    serviceCount.textContent = "ସେବା ଉପଲବ୍ଧ ନାହିଁ";
  }
}

searchInput.addEventListener("input", renderServices);
document.getElementById("year").textContent = new Date().getFullYear();
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
loadServices();
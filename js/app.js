import { getProfile, getProjects, getServices, postOrder } from "./api-service.js";

const ORDER_KEY = "week4-service-orders";
const state = { projects: [], category: "all" };
const $ = (selector) => document.querySelector(selector);

function showState(selector, message, type) {
    const element = $(selector);
    element.textContent = message;
    element.className = `state-message state-${type}`;
}

function renderProfile(profile) {
    $("#profile-name").textContent = profile.name;
    $("#profile-role").textContent = `${profile.role} · ${profile.institution}`;
    $("#profile-headline").textContent = profile.headline;
    $("#profile-bio").textContent = profile.bio;
    $("#profile-photo").src = profile.photo;
    $("#profile-photo").alt = profile.photoAlt;
    const target = $("#skills-list");
    target.replaceChildren();
    profile.skills.forEach((skill) => {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = '<div class="skill-item h-100"><i aria-hidden="true"></i><span></span></div>';
        col.querySelector("i").className = `bi ${skill.icon}`;
        col.querySelector("span").textContent = skill.label;
        target.append(col);
    });
}

function renderProjects() {
    const target = $("#projects-list");
    const projects = state.category === "all" ? state.projects : state.projects.filter((project) => project.category === state.category);
    target.replaceChildren();
    $("#project-count").textContent = `${String(projects.length).padStart(2, "0")} PROJECTS · 2026`;
    if (!projects.length) {
        showState("#project-state", "Belum ada project pada kategori ini.", "empty");
        return;
    }
    $("#project-state").className = "state-message d-none";
    projects.forEach((project) => {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = '<article class="project-card h-100"><span class="project-number"></span><i class="project-icon" aria-hidden="true"></i><h3></h3><p class="project-description"></p><p class="project-metric"></p><div class="project-tags"></div><button class="btn btn-link p-0 project-link" type="button" data-project-id="">Lihat detail <i class="bi bi-arrow-right" aria-hidden="true"></i></button></article>';
        col.querySelector(".project-number").textContent = project.number;
        col.querySelector(".project-icon").className = `project-icon bi ${project.icon}`;
        col.querySelector("h3").textContent = project.title;
        col.querySelector(".project-description").textContent = project.description;
        col.querySelector(".project-metric").textContent = project.metrics;
        col.querySelector("button").dataset.projectId = project.id;
        project.tags.forEach((tag) => {
            const badge = document.createElement("span");
            badge.className = "badge text-bg-soft me-1";
            badge.textContent = tag;
            col.querySelector(".project-tags").append(badge);
        });
        target.append(col);
    });
}

function renderServices(services) {
    const cards = $("#services-list");
    const select = $("#kategori");
    cards.replaceChildren();
    select.replaceChildren(new Option("Pilih layanan", ""));
    services.forEach((service) => {
        select.append(new Option(service.name, service.id));
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = '<article class="service-card h-100"><i class="service-icon bi" aria-hidden="true"></i><h3></h3><p></p><strong></strong><small></small><ul></ul></article>';
        col.querySelector(".service-icon").classList.add(service.icon);
        col.querySelector("h3").textContent = service.name;
        col.querySelector("p").textContent = service.description;
        col.querySelector("strong").textContent = service.price;
        col.querySelector("small").textContent = `Estimasi ${service.duration}`;
        service.features.forEach((feature) => { const item = document.createElement("li"); item.textContent = feature; col.querySelector("ul").append(item); });
        cards.append(col);
    });
    $("#services-state").className = "state-message d-none";
}

function openProject(projectId) {
    const project = state.projects.find((item) => item.id === projectId);
    if (!project) return;
    $("#modal-title").textContent = project.title;
    $("#modal-category").textContent = project.category;
    $("#modal-description").textContent = project.details;
    $("#modal-metric").textContent = `Metric: ${project.metrics}`;
    const tags = $("#modal-tags");
    tags.replaceChildren();
    project.tags.forEach((tag) => { const badge = document.createElement("span"); badge.className = "badge text-bg-soft me-1"; badge.textContent = tag; tags.append(badge); });
    bootstrap.Modal.getOrCreateInstance($("#project-modal")).show();
}

function orders() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]"); } catch { return []; }
}

function updateBadge() {
    const badge = $("#order-count");
    const count = orders().length;
    badge.textContent = count;
    badge.classList.toggle("d-none", count === 0);
}

function toast(message, error = false) {
    const element = $("#order-toast");
    $("#toast-message").textContent = message;
    element.classList.toggle("text-bg-danger", error);
    element.classList.toggle("text-bg-success", !error);
    bootstrap.Toast.getOrCreateInstance(element).show();
}

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    const button = form.querySelector("button[type=submit]");
    const label = button.querySelector(".submit-label");
    const payload = { ...Object.fromEntries(new FormData(form).entries()), submittedAt: new Date().toISOString() };
    button.disabled = true;
    label.textContent = "Mengirim...";
    try {
        await postOrder(payload);
        localStorage.setItem(ORDER_KEY, JSON.stringify([...orders(), payload]));
        updateBadge();
        toast("Permintaan berhasil disimpan di perangkat ini.");
        form.reset();
        form.classList.remove("was-validated");
    } catch (error) { toast(error.message, true); }
    finally { button.disabled = false; label.textContent = "Kirim permintaan"; }
}

function bindEvents() {
    document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => {
        document.querySelectorAll("[data-category]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        state.category = button.dataset.category;
        renderProjects();
    }));
    $("#projects-list").addEventListener("click", (event) => { const button = event.target.closest("[data-project-id]"); if (button) openProject(button.dataset.projectId); });
    $("#formKonsultasi").addEventListener("submit", handleSubmit);
}

async function init() {
    showState("#project-state", "Memuat project...", "loading");
    try {
        const [profile, projects, services] = await Promise.all([getProfile(), getProjects(), getServices()]);
        state.projects = projects;
        renderProfile(profile);
        renderProjects();
        renderServices(services);
        updateBadge();
        bindEvents();
    } catch (error) {
        showState("#project-state", `Data gagal dimuat: ${error.message}`, "error");
        showState("#services-state", "Layanan gagal dimuat. Silakan refresh halaman.", "error");
    }
}

init();

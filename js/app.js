/**
 * app.js — Application logic tier.
 * Mengatur state, rendering dinamis, filter, modal universal,
 * form submission, localStorage, dan UI feedback.
 */

import { getProfile, getProjects, getServices, postOrder } from "./api-service.js";

/* ===== CONSTANTS ===== */
const ORDER_KEY = "week4-service-orders";

/* ===== APPLICATION STATE ===== */
const state = { projects: [], category: "all" };

/* ===== DOM HELPERS ===== */
const $ = (selector) => document.querySelector(selector);

/* ===== SANITIZE HELPER (XSS Prevention) ===== */
function safeText(element, text) {
    element.textContent = text;
}

/* ===== UI STATE MANAGEMENT ===== */
function showState(selector, message, type) {
    const element = $(selector);
    element.textContent = message;
    element.className = `state-message state-${type}`;
}

/**
 * Menampilkan skeleton loading cards.
 * @param {string} targetSelector - Selector container.
 * @param {number} count - Jumlah skeleton cards.
 */
function showSkeleton(targetSelector, count) {
    const target = $(targetSelector);
    target.replaceChildren();
    for (let i = 0; i < count; i++) {
        const col = document.createElement("div");
        col.className = targetSelector === "#services-list" ? "col-md-4" : "col";
        col.innerHTML = `
            <div class="skeleton-card h-100 fade-in">
                <div class="skeleton-line h-icon"></div>
                <div class="skeleton-line h-lg w-60"></div>
                <div class="skeleton-line w-100"></div>
                <div class="skeleton-line w-80"></div>
                <div class="skeleton-line w-40"></div>
            </div>`;
        target.append(col);
    }
}

/* ===== RENDER FUNCTIONS ===== */

/** Render profil dari JSON data. */
function renderProfile(profile) {
    safeText($("#profile-name"), profile.name);
    safeText($("#profile-role"), `${profile.role} · ${profile.institution}`);
    safeText($("#profile-headline"), profile.headline);
    safeText($("#profile-bio"), profile.bio);
    $("#profile-photo").src = profile.photo;
    $("#profile-photo").alt = profile.photoAlt;

    const target = $("#skills-list");
    target.replaceChildren();
    profile.skills.forEach((skill) => {
        const col = document.createElement("div");
        col.className = "col fade-in";
        col.innerHTML = '<div class="skill-item h-100"><i aria-hidden="true"></i><span></span></div>';
        col.querySelector("i").className = `bi ${skill.icon}`;
        safeText(col.querySelector("span"), skill.label);
        target.append(col);
    });
}

/** Render project cards berdasarkan state filter. */
function renderProjects() {
    const target = $("#projects-list");
    const projects = state.category === "all"
        ? state.projects
        : state.projects.filter((p) => p.category === state.category);

    target.replaceChildren();
    safeText($("#project-count"), `${String(projects.length).padStart(2, "0")} PROJECTS · 2026`);

    if (!projects.length) {
        showState("#project-state", "Belum ada project pada kategori ini.", "empty");
        return;
    }

    $("#project-state").className = "state-message d-none";

    projects.forEach((project) => {
        const col = document.createElement("div");
        col.className = "col fade-in";
        col.innerHTML = `
            <article class="project-card h-100">
                <span class="project-number"></span>
                <i class="project-icon" aria-hidden="true"></i>
                <h3></h3>
                <p class="project-description"></p>
                <p class="project-metric"></p>
                <div class="project-tags"></div>
                <button class="btn btn-link p-0 project-link" type="button" data-project-id="">
                    Lihat detail <i class="bi bi-arrow-right" aria-hidden="true"></i>
                </button>
            </article>`;

        safeText(col.querySelector(".project-number"), project.number);
        col.querySelector(".project-icon").className = `project-icon bi ${project.icon}`;
        safeText(col.querySelector("h3"), project.title);
        safeText(col.querySelector(".project-description"), project.description);
        safeText(col.querySelector(".project-metric"), project.metrics);
        col.querySelector("button").dataset.projectId = project.id;

        project.tags.forEach((tag) => {
            const badge = document.createElement("span");
            badge.className = "badge text-bg-soft me-1";
            safeText(badge, tag);
            col.querySelector(".project-tags").append(badge);
        });

        target.append(col);
    });
}

/** Render service cards dan populate select form. */
function renderServices(services) {
    const cards = $("#services-list");
    const select = $("#kategori");

    cards.replaceChildren();
    select.replaceChildren(new Option("Pilih layanan", ""));

    services.forEach((service) => {
        select.append(new Option(service.name, service.id));

        const col = document.createElement("div");
        col.className = "col-md-4 fade-in";
        col.innerHTML = `
            <article class="service-card h-100">
                <i class="service-icon bi" aria-hidden="true"></i>
                <h3></h3>
                <p></p>
                <strong></strong>
                <small></small>
                <ul></ul>
            </article>`;

        col.querySelector(".service-icon").classList.add(service.icon);
        safeText(col.querySelector("h3"), service.name);
        safeText(col.querySelector("p"), service.description);
        safeText(col.querySelector("strong"), service.price);
        safeText(col.querySelector("small"), `Estimasi ${service.duration}`);

        service.features.forEach((feature) => {
            const item = document.createElement("li");
            safeText(item, feature);
            col.querySelector("ul").append(item);
        });

        cards.append(col);
    });

    $("#services-state").className = "state-message d-none";
}

/* ===== UNIVERSAL DYNAMIC MODAL ===== */

/**
 * Buka modal universal dan injeksi data project secara dinamis.
 * Menggunakan textContent untuk mencegah XSS.
 * @param {string} projectId - ID project dari data-project-id.
 */
function openProject(projectId) {
    const project = state.projects.find((item) => item.id === projectId);
    if (!project) return;

    // Injeksi data menggunakan textContent (aman dari XSS)
    safeText($("#modal-title"), project.title);
    safeText($("#modal-category"), project.category);
    safeText($("#modal-description"), project.details);
    safeText($("#modal-metric"), `📊 ${project.metrics}`);

    // Image
    const imgEl = $("#modal-image");
    imgEl.src = project.thumbnail || "images/foto-profil.jpeg";
    imgEl.alt = `Thumbnail ${project.title}`;

    // Link
    const linkEl = $("#modal-link");
    linkEl.href = project.link || "#";

    // Tags
    const tags = $("#modal-tags");
    tags.replaceChildren();
    project.tags.forEach((tag) => {
        const badge = document.createElement("span");
        badge.className = "badge text-bg-soft me-1";
        safeText(badge, tag);
        tags.append(badge);
    });

    bootstrap.Modal.getOrCreateInstance($("#project-modal")).show();
}

/* ===== LOCAL STORAGE & BADGE ===== */

/** Baca order dari localStorage. */
function orders() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    } catch {
        return [];
    }
}

/** Update badge count di navbar. */
function updateBadge() {
    const badge = $("#order-count");
    const count = orders().length;
    safeText(badge, count);
    badge.classList.toggle("d-none", count === 0);
}

/* ===== TOAST FEEDBACK ===== */

/**
 * Tampilkan toast notification dengan Bootstrap Toast API.
 * @param {string} message - Pesan toast.
 * @param {boolean} error - True jika error toast.
 */
function toast(message, error = false) {
    const element = $("#order-toast");
    const icon = $("#toast-icon");
    const title = $("#toast-title");

    safeText($("#toast-message"), message);

    // Set icon & title berdasarkan tipe
    if (error) {
        icon.className = "toast-icon bi bi-exclamation-triangle-fill text-danger";
        safeText(title, "Gagal");
        element.classList.add("border-danger");
        element.classList.remove("border-success");
    } else {
        icon.className = "toast-icon bi bi-check-circle-fill text-success";
        safeText(title, "Berhasil");
        element.classList.add("border-success");
        element.classList.remove("border-danger");
    }

    bootstrap.Toast.getOrCreateInstance(element).show();
}

/* ===== FORM HANDLER (Async POST, no reload) ===== */

/**
 * Handle form submission secara asinkron.
 * Payload dikirim via HTTP POST, disimpan ke localStorage,
 * dan feedback ditampilkan via Toast.
 */
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    form.classList.add("was-validated");

    if (!form.checkValidity()) return;

    const button = form.querySelector("button[type=submit]");
    const label = button.querySelector(".submit-label");
    const icon = button.querySelector(".bi-send");

    // Build payload DTO
    const payload = {
        ...Object.fromEntries(new FormData(form).entries()),
        submittedAt: new Date().toISOString()
    };

    // Set loading state pada button
    button.disabled = true;
    label.textContent = "Mengirim...";
    if (icon) {
        icon.className = "spinner-border spinner-border-sm ms-2";
        icon.setAttribute("role", "status");
    }

    try {
        // HTTP POST ke mock REST endpoint
        await postOrder(payload);

        // Simpan ke localStorage
        localStorage.setItem(ORDER_KEY, JSON.stringify([...orders(), payload]));
        updateBadge();

        // Success feedback
        toast("Permintaan berhasil disimpan di perangkat ini.");
        form.reset();
        form.classList.remove("was-validated");
    } catch (error) {
        // Error feedback
        toast(error.message, true);
    } finally {
        // Reset button state
        button.disabled = false;
        label.textContent = "Kirim permintaan";
        if (icon) {
            icon.className = "bi bi-send ms-2";
            icon.removeAttribute("role");
        }
    }
}

/* ===== EVENT BINDING ===== */

function bindEvents() {
    // Filter kategori — event delegation
    document.querySelectorAll("[data-category]").forEach((button) =>
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-category]").forEach((item) =>
                item.classList.remove("active")
            );
            button.classList.add("active");
            state.category = button.dataset.category;
            renderProjects();
        })
    );

    // Project detail — event delegation pada container
    $("#projects-list").addEventListener("click", (event) => {
        const button = event.target.closest("[data-project-id]");
        if (button) openProject(button.dataset.projectId);
    });

    // Form submit
    $("#formKonsultasi").addEventListener("submit", handleSubmit);
}

/* ===== INITIALIZATION ===== */

async function init() {
    // Tampilkan skeleton loading
    showState("#project-state", "Memuat project...", "loading");
    showState("#services-state", "Memuat layanan...", "loading");
    showSkeleton("#projects-list", 4);
    showSkeleton("#services-list", 3);

    try {
        // Fetch semua data secara paralel dengan Promise.all
        const [profile, projects, services] = await Promise.all([
            getProfile(),
            getProjects(),
            getServices()
        ]);

        // Simpan state dan render
        state.projects = projects;
        renderProfile(profile);
        renderProjects();
        renderServices(services);
        updateBadge();
        bindEvents();
    } catch (error) {
        // Error state: tampilkan pesan error yang jelas
        showState("#project-state", `Data gagal dimuat: ${error.message}`, "error");
        showState("#services-state", "Layanan gagal dimuat. Silakan refresh halaman.", "error");
        $("#projects-list").replaceChildren();
        $("#services-list").replaceChildren();
    }
}

// Jalankan aplikasi
init();

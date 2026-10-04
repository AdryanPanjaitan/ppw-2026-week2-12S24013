/**
 * api-service.js — Asynchronous data provider layer.
 * Memisahkan akses data (Fetch API) dari logika presentasi.
 * Semua fungsi mengembalikan Promise dan menggunakan async/await.
 */

const DATA_PATH = "data";
const FETCH_TIMEOUT = 8000; // 8 detik timeout

/**
 * Helper: fetch JSON dengan timeout.
 * @param {string} resource - Nama file JSON tanpa ekstensi.
 * @returns {Promise<any>} Parsed JSON data.
 */
async function getJson(resource) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
        const response = await fetch(`${DATA_PATH}/${resource}.json`, {
            signal: controller.signal
        });
        if (!response.ok) {
            throw new Error(`${resource}.json gagal dimuat (HTTP ${response.status})`);
        }
        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(`${resource}.json timeout setelah ${FETCH_TIMEOUT / 1000} detik.`);
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

/** Fetch profile data. */
export const getProfile = () => getJson("profile");

/** Fetch projects data. */
export const getProjects = () => getJson("projects");

/** Fetch services data. */
export const getServices = () => getJson("services");

/**
 * Kirim order melalui HTTP POST (mock REST layer).
 * Pada static hosting, fallback memastikan simulasi tetap berjalan.
 * @param {Object} payload - Data formulir sebagai JSON.
 * @returns {Promise<Object>} Response dari server/mock.
 */
export async function postOrder(payload) {
    try {
        const response = await fetch(`${DATA_PATH}/order-response.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Server menolak permintaan.");
        return await response.json();
    } catch {
        // Fallback: static hosting tidak mendukung POST,
        // simulasikan response sukses untuk demo.
        return { ok: true, message: "Order diterima (simulasi)." };
    }
}

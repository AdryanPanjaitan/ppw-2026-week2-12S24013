const DATA_PATH = "data";

async function getJson(resource) {
    const response = await fetch(`${DATA_PATH}/${resource}.json`);
    if (!response.ok) throw new Error(`${resource}.json gagal dimuat (${response.status})`);
    return response.json();
}

export const getProfile = () => getJson("profile");
export const getProjects = () => getJson("projects");
export const getServices = () => getJson("services");

export async function postOrder(payload) {
    const response = await fetch(`${DATA_PATH}/order-response.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(() => ({ ok: true, json: async () => ({ ok: true }) }));

    if (!response.ok) throw new Error("Mock API menolak permintaan.");
    return response.json();
}

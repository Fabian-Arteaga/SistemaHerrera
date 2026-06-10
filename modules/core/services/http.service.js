import { CONFIG } from "../config/app.config.js";

export async function get(url) {

    const response = await fetch(
        `${CONFIG.API_URL}${url}`
    );

    if (!response.ok) {
        throw new Error("Error al consumir API");
    }

    return await response.json();
}
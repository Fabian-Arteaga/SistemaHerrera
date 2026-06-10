import { get } from "../../core/services/http.service.js";

export async function getCatalog(
    page = 1,
    pageSize = 12
) {

    return await get(
        `/Products/catalog?Page=${page}&PageSize=${pageSize}`
    );
}
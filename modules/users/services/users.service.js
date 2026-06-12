import { CONFIG } from '../../core/config/app.config.js';

function getHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
}

export const UsersService = {
    getAllUsers: async () => {
        const r = await fetch(`${CONFIG.API_URL}/Users`, { method: 'GET', headers: getHeaders() });
        if (!r.ok) throw new Error("Error al obtener usuarios del servidor");
        return await r.json();
    },

   createUser: async (userData) => {
        const response = await fetch(`${CONFIG.API_URL}/Users`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error(`Fallo de conexión o error grave en el servidor (${response.status}).`);
        }

        if (!response.ok || data.success === false) {
            
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat().join('\n');
                throw new Error(errorMessages);
            }
            throw new Error(data.message || "Error desconocido al crear el usuario.");
        }

        return data;
    },

   updateUser: async (userData) => {
      
        const response = await fetch(`${CONFIG.API_URL}/Users/${userData.id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error(`Fallo de conexión o error grave en el servidor (${response.status}).`);
        }

        if (!response.ok || data.success === false) {
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat().join('\n');
                throw new Error(errorMessages);
            }
            throw new Error(data.message || "Error desconocido al actualizar el usuario.");
        }

        return data;
    },

    toggleStatus: async (id) => {
        const r = await fetch(`${CONFIG.API_URL}/Users/${id}/toggle-status`, { method: 'PATCH', headers: getHeaders() });
        if (!r.ok) throw new Error("Error al cambiar el estado del usuario");
        return await r.json();
    },
    
    getRoles: async () => {
        const response = await fetch(`${CONFIG.API_URL}/Roles`, { 
            method: 'GET', 
            headers: getHeaders() 
        });
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    }

};
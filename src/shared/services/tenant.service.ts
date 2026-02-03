export interface TenantConfig {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        foreground: string;
        cardBackground: string;
        border: string;
    };
    logo: string;
}

const MOCK_TENANTS: Record<string, TenantConfig> = {
    companyA: {
        id: "companyA",
        name: "Banco BBVA",
        displayName: "Banco BBVA",
        description: "Banco BBVA",
        theme: {

            primary: "#2563eb",      // blue-600
            secondary: "#1e40af",    // blue-800
            accent: "#3b82f6",       // blue-500
            background: "#ffffff",
            foreground: "#1e3a8a",   // blue-900
            cardBackground: "#eff6ff", // blue-50
            border: "#bfdbfe",       // blue-200

        },
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/BBVA_2019.svg/1280px-BBVA_2019.svg.png"
    },
    companyB: {
        id: "companyB",
        name: "Banco Bogota",
        displayName: "Banco Bogota",
        description: "Banco Bogota",
        theme: {
            primary: "#dc2626",         // Red 600 (Un rojo vibrante y profesional)
            secondary: "#be123c",       // Rose 700 (Un tono más profundo y elegante)
            accent: "#f43f5e",          // Rose 500 (Un rojo rosáceo para destacar)
            background: "#ffffff",
            foreground: "#7f1d1d",      // Red 900 (Rojo muy oscuro para legibilidad de texto)
            cardBackground: "#fef2f2",  // Red 50 (Un toque de calidez casi blanco)
            border: "#fecaca",          // Red 200 (Suave para separar elementos)
        },
        logo: "https://yt3.googleusercontent.com/NHLfZYbkHdBQSLrkeIarQ1NwKs4hqJ44t9lFut7k7JsMtxVmlKwVM06El423HHaHcCDsaP5m=s900-c-k-c0x00ffffff-no-rj",
    },
    companyC: {
        id: "companyC",
        name: "Falabella",
        displayName: "Falabella",
        description: "Falabella",
        theme: {
            primary: "#abd73c",        // Lima vibrante (Tu color base)
            secondary: "#2c3e50",      // Azul grisáceo profundo (Para contraste serio)
            accent: "#d4ff5f",         // Lima más claro/eléctrico (Para hovers o detalles)
            background: "#ffffff",     // Blanco puro
            foreground: "#1a1c18",     // Casi negro con matiz verde (Máxima legibilidad)
            cardBackground: "#f7f9f2", // Blanco roto con tinte lima (Muy suave)
            border: "#e2e8d4",         // Gris verdoso suave (Para estructura)
        },
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Falabella.svg/960px-Falabella.svg.png",
    },
};

export const fetchTenantConfig = async (
    tenantId: string
): Promise<TenantConfig> => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            const config = MOCK_TENANTS[tenantId];
            if (config) {
                resolve(config);
            } else {
                console.error(`[TenantService] Config NOT found for: ${tenantId}`);
                reject(new Error("Tenant not found"));
            }
        }, 1500); // 1.5s delay
    });
};

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
    logo: {
        width: string;
        height: string;
        url: string;
    };
}

const MOCK_TENANTS: Record<string, TenantConfig> = {
    companya: {
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
        logo: {
            width: "100px",
            height: "100px",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/BBVA_2019.svg/1280px-BBVA_2019.svg.png"
        }
    },
    companyb: {
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
        logo: {
            width: "200px",
            height: "200px",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Banco_de_Bogot%C3%A1_logo.svg/1280px-Banco_de_Bogot%C3%A1_logo.svg.png"
        }
    },
    companyc: {
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
        logo: {
            width: "128px",
            height: "128px",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Falabella.svg/960px-Falabella.svg.png"
        }
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

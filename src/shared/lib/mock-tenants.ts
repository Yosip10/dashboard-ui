export interface TenantConfig {
    id: string;
    name: string;
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
}export interface TenantConfig {
    id: string;
    name: string;
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

export const MOCK_TENANTS: Record<string, TenantConfig> = {
    comfandi: {
        id: "1",
        name: "Comfandi",
        description: "Comfandi",
        theme: {
            primary: "#05c3dd",        // Cian Eléctrico (Tu base: fresco y moderno)
            secondary: "#0e4a67",      // Azul Petróleo (Contraste profundo que equilibra el brillo del cian)
            accent: "#00e8ff",         // Turquesa Neón (Para estados hover o micro-interacciones)
            background: "#f0f9fb",     // Blanco Glaciar (Mantiene la frescura del primario)
            foreground: "#082f49",     // Azul Profundo (Máximo contraste para lectura)
            cardBackground: "#ffffff", // Blanco puro (Para limpieza visual y foco en el contenido)
            border: "#cffafe",         // Cian ultra suave (Estructura que no ensucia el diseño)
        },
        logo: {
            width: "100px",
            height: "100px",
            url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Logo-Comfandi.png"
        }
    },
    tuya: {
        id: "2",
        name: "Tuya",
        description: "Tuya",
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
            width: "150px",
            height: "150px",
            url: "https://ciandco.edu.co/wp-content/uploads/2018/12/tuya.png"
        }
    },
    sura: {
        id: "3",
        name: "Sura",
        description: "Sura",
        theme: {
            primary: "#2d6df6",        // Azul Eléctrico (Tu base: vibrante y confiable)
            secondary: "#1e293b",      // Slate profundo (Contraste elegante para navegación/headers)
            accent: "#00d4ff",         // Cian brillante (Para hovers, estados activos o alertas suaves)
            background: "#f8fafc",     // Gris azulado ultra claro (Menos fatiga visual que el blanco puro)
            foreground: "#0f172a",     // Azul noche casi negro (Legibilidad premium)
            cardBackground: "#ffffff", // Blanco puro (Para resaltar los elementos sobre el fondo grisáceo)
            border: "#e2e8f0",         // Gris frío suave (Para una estructura limpia y moderna)
        },
        logo: {
            width: "128px",
            height: "128px",
            url: "https://upload.wikimedia.org/wikipedia/commons/6/61/Seguros_SURA_Logo.svg"
        }
    },
};
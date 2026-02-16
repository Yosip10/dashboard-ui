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
        primaryForeground: string;
        backgroundIconSiderbar: string;
    };
    logo: {
        width: string;
        height: string;
        url: string;
    };
}

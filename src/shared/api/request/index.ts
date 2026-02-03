

export const getTenantFromUrl = () => {
    return new URLSearchParams(window.location.search).get("tenant")
}
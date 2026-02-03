import type { Group, UserModule } from "../types/auth";


export const handleRoleModule = (groups: Group[] = []): UserModule[] => {
    const modules: UserModule[] = [];

    groups.forEach((group) => {
        const modulesLinked = group.attributes?.modulesLinked || [];
        const realmRoles = group.realmRoles || [];

        modulesLinked.forEach((moduleStr: string) => {
            try {
                const moduleObj = JSON.parse(moduleStr);
                const moduleName = moduleObj.name.replace("MODULE-", "");

                // Filter permits for this module
                const permits = realmRoles.filter((role: string) =>
                    role.toLowerCase().includes(moduleName.toLowerCase())
                );

                modules.push({
                    name: moduleObj.name,
                    id: moduleObj.id,
                    permits: permits,
                });
            } catch (e) {
                console.error("Error parsing moduleLinked", e);
            }
        });
    });

    return modules;
};

export const handleRoleName = (groups: Group[] = []): string[] => {
    return groups.map((group) => group.name);
};

export const parseUserAttributes = (attributes: Record<string, string[]> = {}) => {
    const userObject: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(attributes)) {
        if (Array.isArray(value) && value.length > 0) {
            const firstElement = value[0];
            if (typeof firstElement === "string" || typeof firstElement === "number") {
                userObject[key] = firstElement;
            }
        }
    }
    return userObject;
};

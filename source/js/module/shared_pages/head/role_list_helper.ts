
// TODO: this is not full type of result
// TODO: it should be declared somewhere else as this type is server-related. But it will be declared here for a while
interface Permission {
    preset: 'ADMIN' | 'MANAGER' | 'COACH' | 'TEACHER' | 'PARENT' | 'STUDENT'
    role: string
}


export function getUserRoles(): Promise<Permission[]> {
    return (window as any).Server.roles.get().then(roles => {
        if (roles && roles.length) {
            const permissions = [];

            let isAlreadyHaveParentPermission = false;
            let isAlreadyHaveStudentPermission = false;

            roles.forEach(role => {
                role.permissions.forEach(permission => {
                    // Always add all permissions besides PARENT and STUDENT permissions.
                    // Add parent and student permissions only at once.
                    switch (true) {
                        case permission.preset === 'PARENT' && !isAlreadyHaveParentPermission:
                            permission.role = role.name;
                            permissions.push(permission);
                            isAlreadyHaveParentPermission = true;
                            break;
                        case permission.preset === 'STUDENT' && !isAlreadyHaveStudentPermission:
                            permission.role = role.name;
                            permissions.push(permission);
                            isAlreadyHaveStudentPermission = true;
                            break;
                        case permission.preset === 'PARENT' && isAlreadyHaveParentPermission:
                            break;
                        case permission.preset === 'STUDENT' && isAlreadyHaveStudentPermission:
                            break;
                        default:
                            permission.role = role.name;
                            permissions.push(permission);
                    }
                });
            });

            return permissions;
        }
    });
}

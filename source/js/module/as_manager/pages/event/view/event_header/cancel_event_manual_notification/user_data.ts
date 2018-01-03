
// TODO: I'm almost sure this type declaration should not be here. But it required by whole this directory so I place
// TODO: it to separate file

export interface UserData {
    id?: string
    _id: string
    extra?: {
        type: string
        parentOf?: {
            userId: string
            permissionId: string
            firstName: string
            lastName: string
        }
    },
    firstName: string
    lastName: string
    checked: boolean
    userId: string
    permissionId: string
}
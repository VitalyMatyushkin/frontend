
// TODO: I'm almost sure this type declaration should not be here. But it required by whole this directory so I place
// TODO: it to separate file

export interface UserData {
    extra?: {
        type: string
    },
    firstName: string
    lastName: string
    checked: boolean
    userId: string
    permissionId: string
}
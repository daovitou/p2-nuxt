export enum Actions {
    DASHBOARD = "DASHBOARD",
    CREATE_USER = "CREATE_USER",
    READ_USER = "READ_USER",
    UPDATE_USER = "UPDATE_USER",
    DELETE_USER = "DELETE_USER",
    CREATE_PAGE = "READ_PAGE",
    READ_PAGE = "READ_PAGE",
    UPDATE_PAGE = "UPDATE_PAGE",
    DELETE_PAGE = "DELETE_DELETE",
    CREATE_LANGUAGE = "CREATE_LANGUAGE",
    READ_LANGUAGE = "READ_LANGUAGE",
    UPDATE_LANGUAGE = "UPDATE_LANGUAGE",
    DELETE_LANGUAGE = "DELETE_LANGUAGE",
    CREATE_BOOK_CATEGORY = "CREATE_BOOK_CATEGORY",
    READ_BOOK_CATEGORY = "READ_BOOK_CATEGORY",
    UPDATE_BOOK_CATEGORY = "UPDATE_BOOK_CATEGORY",
    DELETE_BOOK_CATEGORY = "DELETE_BOOK_CATEGORY",
    CREATE_BOOK = "CREATE_BOOK",
    READ_BOOK = "READ_BOOK",
    UPDATE_BOOK = "UPDATE_BOOK",
    DELETE_BOOK = "DELETE_BOOK",
    CREATE_VIDEO_CATEGORY = "CREATE_VIDEO_CATEGORY",
    READ_VIDEO_CATEGORY = "READ_VIDEO_CATEGORY",
    UPDATE_VIDEO_CATEGORY = "UPDATE_VIDEO_CATEGORY",
    DELETE_VIDEO_CATEGORY = "DELETE_VIDEO_CATEGORY",
    CREATE_VIDEO = "CREATE_VIDEO",
    READ_VIDEO = "READ_VIDEO",
    UPDATE_VIDEO = "UPDATE_VIDEO",
    DELETE_VIDEO = "DELETE_VIDEO"
}
export const roles = {
    "Administrator": {
        role: "Administrator",
        permissions: Object.values(Actions)

        // permissions: [Actions.READ_USER,Actions.DELETE_USER]
    },
    "Editor": {
        role: "Editor",
        permissions: [
            Actions.DASHBOARD,
            Actions.CREATE_LANGUAGE,
            Actions.READ_LANGUAGE,
            Actions.UPDATE_LANGUAGE,
            Actions.DELETE_LANGUAGE,
            Actions.CREATE_BOOK_CATEGORY,
            Actions.READ_BOOK_CATEGORY,
            Actions.UPDATE_BOOK_CATEGORY,
            Actions.DELETE_BOOK_CATEGORY,
            Actions.CREATE_BOOK,
            Actions.READ_BOOK,
            Actions.UPDATE_BOOK,
            Actions.DELETE_BOOK,
            Actions.CREATE_VIDEO_CATEGORY,
            Actions.READ_VIDEO_CATEGORY,
            Actions.UPDATE_VIDEO_CATEGORY,
            Actions.DELETE_VIDEO_CATEGORY,
            Actions.CREATE_VIDEO,
            Actions.READ_VIDEO,
            Actions.UPDATE_VIDEO,
            Actions.DELETE_VIDEO,
            Actions.READ_PAGE,
            Actions.UPDATE_PAGE,
        ]
    },
    "Entry": {
        role: "Entry",
        permissions: [
            Actions.DASHBOARD,
            Actions.CREATE_BOOK,
            Actions.READ_BOOK,
            Actions.CREATE_VIDEO,
            Actions.READ_VIDEO,
        ]
    }
}

type Role = 'Administrator' | 'Editor' | 'Entry';
const checkRole = (action: Actions, role: Role) => {
    return roles[role].permissions.includes(action)
}

export const checkPermission = (action: Actions) => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
    if (checkRole(action, userStorage.role)) {
        return true
    } else {
        return false
    }
}
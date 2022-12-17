export interface UpdateUserType {
    user: UpdateUserElementType
}

interface UpdateUserElementType {
    username?: string;
    email?: string;
    password?: string;
}
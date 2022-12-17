export interface CreateUserType {
    user: CreateUserElementType

}

interface CreateUserElementType {
    username: string;
    email: string;
    password: string;
}
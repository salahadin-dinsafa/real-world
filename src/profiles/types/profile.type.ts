export interface Profile {
    profile: ProfileElement
}

interface ProfileElement {
    bio: string;
    following: boolean;
    image: string;
    username: string;

}
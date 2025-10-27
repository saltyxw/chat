export interface MessageType {
    id: number;
    text?: string;
    image?: string;
    video?: string;
    createdAt: string;
    sender: {
        id: number;
        name: string;
        avatarLink?: string;
    };
}

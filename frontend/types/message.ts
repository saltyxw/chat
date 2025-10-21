export type MessageType = {
    id: number;
    text: string;
    createdAt: Date;
    sender: {
        id: number;
        name: string;
        avatarLink?: string | null;
    };
}

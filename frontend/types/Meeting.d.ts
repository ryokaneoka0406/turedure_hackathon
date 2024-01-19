export type Meeting = {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    department: string;
    organizer: string;
};

export type MeetingsArray = Meeting[];
import { PushSubscription } from "web-push";

declare global {
    interface UserPrivateMetadata {
        subscription: (PushSubscription & { sessionId: string })[] | undefined;
    }

    interface UserUnsafeMetadata {
        mutedChannels: string[] | undefined;
    }
}
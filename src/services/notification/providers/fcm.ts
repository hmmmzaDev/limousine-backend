import admin from "firebase-admin";

let initialized = false;

function ensureInitialized() {
    if (!initialized) {
        try {
            if (admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                });
            }
            initialized = true;
        } catch (err) {
            // Do not throw during import; throw on use to surface errors clearly
            throw err;
        }
    }
}

export async function sendFcmNotification({
    token,
    title,
    body,
    data,
}: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
}) {
    ensureInitialized();

    const message: admin.messaging.Message = {
        token,
        notification: {
            title,
            body,
        },
        data,
    };

    const response = await admin.messaging().send(message);
    return response;
}

export default { sendFcmNotification };



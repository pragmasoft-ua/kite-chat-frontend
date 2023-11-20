import { openDB, DBSchema, IDBPDatabase, IDBPCursorWithValue } from 'idb';
import { ContentMsg } from './kite-types';

/**
 * The name of the database.
 */
const DB_NAME = 'k1teDB';

/**
 * The version of the database schema.
 */
const DB_VERSION = 1;

/**
 * The name of the object store for messages.
 */
const MESSAGES_STORE_NAME = 'MessagesStore';

/**
 * The key path used to identify messages.
 */
const MESSAGES_KEY = 'messageId';

/**
 * The schema of the IndexedDB database.
 */
interface KiteDBSchema extends DBSchema {
    [MESSAGES_STORE_NAME]: {
        value: ContentMsg;
        key: number;
        indexes: { [MESSAGES_KEY]: string };
    };
}

/**
 * The type for the IndexedDB database instance.
 */
export type KiteDB = IDBPDatabase<KiteDBSchema>;

/**
 * Function to opens the IndexedDB database.
 */
export async function openDatabase() {
    return await openDB<KiteDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            const store = db.createObjectStore(MESSAGES_STORE_NAME, {
                autoIncrement: true,
            });
            store.createIndex(MESSAGES_KEY, MESSAGES_KEY, { unique: true });
        },
    });
}

/**
 * Function to add a new message to the database.
 */
export async function addMessage(message: ContentMsg, db: KiteDB) {
    const tx = db.transaction(MESSAGES_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE_NAME);
    await store.add(message);
    await tx.done;
}

/**
 * Function to retrieve and return chat messages.
 */
export async function getMessages(db: KiteDB, lastMessageId?: string) {
    const tx = db.transaction(MESSAGES_STORE_NAME, 'readonly');
    const store = tx.objectStore(MESSAGES_STORE_NAME);

    if (lastMessageId) {
        // Retrieve only new messages based on the lastMessageId
        const index = await store.index(MESSAGES_KEY).getKey(lastMessageId);
        const cursor = await store.openCursor(IDBKeyRange.lowerBound(index), 'next');
        const result: ContentMsg[] = [];

        const iterateCursor = async (cursor: IDBPCursorWithValue<KiteDBSchema> | null) => {
            if (cursor) {
                result.push(cursor.value);
                await iterateCursor(await cursor.continue());
            }
        };

        await iterateCursor(await cursor?.continue() ?? null);

        return result;
    } else {
        // Retrieve all messages
        const messages = await store.getAll();
        return messages;
    }
}

/**
 * Function to retrieve a message by its messageId.
 */
export async function messageById(messageId: string, db: KiteDB) {
    const tx = db.transaction(MESSAGES_STORE_NAME, 'readonly');
    const store = tx.objectStore(MESSAGES_STORE_NAME);
    const message = await store.index(MESSAGES_KEY).get(messageId);
    return message;
}

/**
 * Function to modify an existing message in the database.
 */
export async function modifyMessage(messageId: string, modifiedMessage: ContentMsg, db: KiteDB) {
    const tx = db.transaction(MESSAGES_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE_NAME);

    const index = await store.index(MESSAGES_KEY).getKey(messageId);
    await store.put(modifiedMessage, index);
    await tx.done;
}
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

export class KiteDBManager {
  private db: IDBPDatabase<KiteDBSchema>;
  public onopen?: () => void;
  public onclosed?: () => void;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    this.db = await openDB<KiteDBSchema>(DB_NAME, DB_VERSION, {
      upgrade: (db) => {
        const store = db.createObjectStore(MESSAGES_STORE_NAME, {
          autoIncrement: true,
        });
        store.createIndex(MESSAGES_KEY, MESSAGES_KEY, { unique: true });
      },
    });
    this.onopen?.();
  }

  /**
   * Add a new message to the database.
   */
  public async addMessage(message: ContentMsg) {
    const tx = this.db.transaction(MESSAGES_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE_NAME);
    await store.add(message);
    await tx.done;
  }

  /**
   * Retrieve and return chat messages.
   */
  public async getMessages(lastMessageId?: string) {
    const tx = this.db.transaction(MESSAGES_STORE_NAME, 'readonly');
    const store = tx.objectStore(MESSAGES_STORE_NAME);
    const primaryKey = lastMessageId && (await store.index(MESSAGES_KEY).getKey(lastMessageId));

    if (primaryKey) {
      const cursor = await store.openCursor(IDBKeyRange.lowerBound(primaryKey), 'next');
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
      const messages = await store.getAll();
      return messages;
    }
  }

  /**
   * Retrieve a message by its messageId.
   */
  public async messageById(messageId: string) {
    const tx = this.db.transaction(MESSAGES_STORE_NAME, 'readonly');
    const store = tx.objectStore(MESSAGES_STORE_NAME);
    const message = await store.index(MESSAGES_KEY).get(messageId);
    return message;
  }

  /**
   * Modify an existing message in the database.
   */
  public async modifyMessage(messageId: string, modifiedMessage: ContentMsg) {
    const oldMessage = await this.messageById(messageId);

    const tx = this.db.transaction(MESSAGES_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE_NAME);

    const primaryKey = await store.index(MESSAGES_KEY).getKey(messageId);
    await store.put({ ...oldMessage, ...modifiedMessage }, primaryKey);
    await tx.done;
  }

  /**
   * Delete a message by its messageId.
   */
  public async deleteMessage(messageId: string) {
    const tx = this.db.transaction(MESSAGES_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE_NAME);

    const primaryKey = await store.index(MESSAGES_KEY).getKey(messageId);
    if (primaryKey) {
      await store.delete(primaryKey);
    }
    await tx.done;
  }

  public async closeDatabase() {
    this.db.close();

    this.onclosed?.();
  }
}

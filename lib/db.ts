import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface MyDB extends DBSchema {
  notes: {
    key: number;
    value: Note;
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'minterest-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<MyDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MyDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', {
          keyPath: 'id',
          autoIncrement: true,
        });
        notesStore.createIndex('by-date', 'createdAt');
      }
    },
  });

  return dbInstance;
}

export async function addNote(note: Omit<Note, 'id'>): Promise<number> {
  const db = await getDB();
  return await db.add('notes', note as Note);
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB();
  return await db.getAll('notes');
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  const db = await getDB();
  return await db.get('notes', id);
}

export async function updateNote(id: number, note: Partial<Note>): Promise<void> {
  const db = await getDB();
  const existingNote = await db.get('notes', id);
  if (existingNote) {
    await db.put('notes', { ...existingNote, ...note, id });
  }
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}

export async function clearAllNotes(): Promise<void> {
  const db = await getDB();
  await db.clear('notes');
}

import Dexie, { type EntityTable } from "dexie";

export interface Moment {
  id: number;
  createdAt: string; // ISO8601
  imageBlob?: Blob; // original image
  thumbBlob?: Blob; // 200x200 thumbnail
  memo?: string;
}

class MomentsDB extends Dexie {
  moments!: EntityTable<Moment, "id">;

  constructor() {
    super("moments-db");
    this.version(1).stores({
      moments: "++id, createdAt",
    });
  }
}

export const db = new MomentsDB();

export async function getAllMoments(): Promise<Moment[]> {
  return db.moments.orderBy("createdAt").reverse().toArray();
}

export async function getMoment(id: number): Promise<Moment | undefined> {
  return db.moments.get(id);
}

export async function addMoment(data: {
  memo?: string;
  imageBlob?: Blob;
  thumbBlob?: Blob;
}): Promise<number> {
  return db.moments.add({
    createdAt: new Date().toISOString(),
    ...data,
  } as Moment);
}

export async function deleteMoment(id: number): Promise<void> {
  return db.moments.delete(id);
}

import {PrismaClient} from "@prisma/client";

let db: PrismaClient;

console.log('Restarting DB')

declare global {
    var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
    const db = new PrismaClient();
    db.$connect();
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
        global.__db.$connect();
    }
    db = global.__db;
}

export {db}


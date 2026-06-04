import type * as express from 'express';
import { User } from "generated/prisma";

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}
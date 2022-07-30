import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../libs/prisma';

dotenv.config();

export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {
    let success = false;

    if (req.headers.authorization) {

        const [authType, token] = req.headers.authorization.split(' ');

        if (authType === 'Bearer') {
            try {
                const decoded: any = jwt.verify(token, (process.env.JWT_PRIVATE_KEY as string));

                if (decoded) {
                    let user = await prisma.user.findFirst({ where: { id: decoded.id } });

                    if (user && user.role === "ADMIN") {
                        success = true;
                    };
                }
            } catch (err) { }
        }
    }

    if (success) {
        next();
    } else {
        res.json({ notAllowed: true });
        return;
    }
};
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createRef, uploadImg } from "../libs/firebase";
import { findUserByEmail, createUser, listAllUsers } from "../libs/prismaUtils";


dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json({ error: errors.mapped() });
        return;
    };

    const { name, surname, email, password } = matchedData(req);

    const hasUser = await findUserByEmail(email);

    if (hasUser) {
        res.json({ error: 'E-mail já existente!' })
        return
    }

    const passwordHash = await bcrypt.hash(password, 8);

    let data = {
        name, surname, email, passwordHash
    }

    let newUser = await createUser(data)

    const token = jwt.sign(
        { id: newUser.id },
        (process.env.JWT_PRIVATE_KEY as string),
        { expiresIn: '2 days' }
    )

    res.status(201).json({ name: newUser.name, email: newUser.email, token })
};

export const listUsers = async (req: Request, res: Response) => {
    let file = req.file;

    if (file) {
        let newRef = createRef(`images/immortal-renegate/${Date.now()}.jpg`);
        try {
            uploadImg(newRef, file?.buffer);
        } catch (err) {
            console.log(err)
        }
    }

    const users = await listAllUsers();
    const fUsers: {
        name: string,
        surname: string,
        favorites: { Novel: { title: string } }[];
    }[] = users.map((i) => (
        { name: i.name, surname: i.surname, favorites: i.favorites }
    ))

    res.json({ users: fUsers })
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
        res.json({ error: 'Email e/ou Senha incorretos!' })
        return
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
        res.json({ error: 'Email e/ou Senha incorretos!' })
        return
    }

    const token = jwt.sign(
        { id: user.id },
        (process.env.JWT_PRIVATE_KEY as string),
        { expiresIn: '2 days' }
    )

    res.json({ token });
}
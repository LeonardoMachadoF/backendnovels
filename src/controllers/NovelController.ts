import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { createRef, getUrl, uploadImg } from '../libs/firebase';
import { createNovelWithData, findNovelById, findNovelBySlug, linkCategoryWithNovel, listAllNovels, listChaptersByNovelId, removeNovelWithId } from '../libs/prismaUtils';
import { DataNovel } from '../types/DataNovel';
import prisma from '../libs/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const listNovels = async (req: Request, res: Response) => {
    let novels = await listAllNovels();

    novels ? res.json({ novels }) : res.json({ error: 'Nenhum resultado encontrado!' });
};

export const listNovel = async (req: Request, res: Response) => {
    const params = req.params;
    const auth = req.headers.authorization;
    let user_id: string;

    if (!params.slug) {
        res.json({ error: 'Nenhum resultado encontrado!' })
        return
    }

    let include = true;

    let novel = await findNovelBySlug(params.slug, include = true)
    if (!novel) {
        res.json({ error: 'Nenhum resultado encontrado!' })
        return
    }

    let chapters = await listChaptersByNovelId(novel.id);

    let views = await prisma.viewsOnNovel.count();

    if (req.headers.authorization) {

        const [authType, token] = req.headers.authorization.split(' ');

        if (authType === 'Bearer') {
            try {
                const decoded: any = jwt.verify(token, (process.env.JWT_PRIVATE_KEY as string));

                if (decoded) {
                    await prisma.viewsOnNovel.create({
                        data: {
                            novel_id: novel.id,
                            user_id: decoded.id
                        }
                    })
                }
            } catch (err) {
                await prisma.viewsOnNovel.create({
                    data: {
                        novel_id: novel.id,
                        user_id: 'bb15dcf5-5ed4-493b-b8e6-5142e11ffe68'
                    }
                })
            }
        }
    }

    res.json({ novel, chapters, views });
};

export const addNovel = async (req: Request, res: Response) => {
    const file = req.file;
    const errors = validationResult(req)


    if (!errors.isEmpty()) {
        res.json({ error: errors.mapped() });
        return;
    };

    const { title, description, country_id, artist_id, author_id, category_id } = matchedData(req);

    let slug = title.toLowerCase().split(' ').join('-');

    let hasSlug = await findNovelBySlug(slug);

    if (hasSlug) {
        slug = slug + Math.floor(Math.random() * 10)
    }

    let imagesUrl = '';

    if (file) {
        const ref = createRef(`novel/${slug}/${slug + '-' + Math.floor(Math.random() * 100)}.jpg`)
        await uploadImg(ref, file.buffer);
        let url = await getUrl(ref);

        if (url) {
            imagesUrl = url.split('&token')[0];
        } else {
            imagesUrl = ''
        }
    }

    let data: DataNovel = {
        slug,
        title,
        artist_id,
        author_id,
        imagesUrl,
        description,
        country_id
    }

    const newNovel = await createNovelWithData(data);

    let promise = [];
    for (let i in category_id.split(", ")) {
        promise.push(linkCategoryWithNovel(category_id.split(", ")[i].trim(), newNovel.id));
    }
    await Promise.all(promise).catch(v => console.log(v));

    res.status(201).json({ status: true })
}

export const removeNovel = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.json({ error: 'Nenhuma novel encontrada!' })
        return
    }

    const novel = await findNovelById(id)

    if (!novel) {
        res.json({ error: 'Nenhuma novel encontrada!' })
        return
    }

    await removeNovelWithId(id)

    res.json({ status: true });
}

export const addFavorite = async (req: Request, res: Response) => {
    const { novel_id } = req.query;

    if (!req.headers.authorization) {
        res.json({ error: 'Nenhum usuário encontrado!' })
        return;
    }

    if (!novel_id) {
        res.json({ error: 'Nenhum resultado encontrado!' })
        return;
    }

    const [authType, token] = req.headers.authorization.split(' ');

    if (!token) {
        res.json({ error: 'Nenhum usuário encontrado!' })
        return;
    }

    let user: any = jwt.verify(token, (process.env.JWT_PRIVATE_KEY as string))

    if (user.id) {
        let alreadyFavorited = await prisma.favoriteOnUser.findFirst({
            where: {
                novel_id: (novel_id as string),
                user_id: user.id
            }
        })
        if (!alreadyFavorited) {
            let favorited = await prisma.favoriteOnUser.create({
                data: {
                    novel_id: (novel_id as string),
                    user_id: user.id
                }
            })
            if (favorited) {
                res.status(201).json({ status: true })
                return
            } else {
                res.json({ error: 'Este item já esta nos seus favoritos' })
                return;
            }
        }
        res.json({ error: 'Este item já esta nos seus favoritos' })
        return
    }

    res.json({ error: 'Algo inexperado aconteceu, por favor, tente mais tarde!' })
}

export const getPopularNovels = async (req: Request, res: Response) => {
    let novels = await prisma.novel.findMany({
        select: {
            title: true,
            categories: { select: { Category: { select: { name: true } } } },
            author: { select: { name: true } },
            status: true,
            slug: true,
            artist: { select: { name: true } },
            description: true,
            imagesUrl: true,
        },
    })

    res.json({ novels })
}
import { DataChapter, DataNovel } from '../types/DataNovel';
import prisma from './prisma'

//USERS

export const listAllUsers = async () => {
    return await prisma.user.findMany({
        include: {
            favorites: {
                select: {
                    Novel: {
                        select: {
                            title: true,
                            imagesUrl: true
                        }
                    }
                }
            }
        }
    });
}

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findFirst({ where: { email } });
};

export const createUser = async (data: any) => {
    return await prisma.user.create({ data });
};

//NOVELS

export const listAllNovels = async () => {
    return await prisma.novel.findMany({
        include: {
            categories: {
                select: {
                    Category: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            },
            artist: true,
            author: true,
            origin: true
        }
    })
}

export const findNovelById = async (id: string) => {
    return await prisma.novel.findFirst({ where: { id } })
};

export const findNovelBySlug = async (slug: string, include?: boolean) => {

    type Data = {
        where: {
            slug: string
        },
        include?: {
            categories: boolean,
            artist: {
                select: {
                    name: boolean
                }
            },
            author: {
                select: {
                    name: boolean
                }
            }
        }
    }

    let data: Data = {
        where: { slug }
    }

    if (include) {
        data.include = { categories: true, artist: { select: { name: true } }, author: { select: { name: true } } };
    }

    return await prisma.novel.findFirst(data);
};

export const createNovelWithData = async (data: DataNovel) => {
    return await prisma.novel.create({
        data
    })
}


export const linkCategoryWithNovel = async (category_id: string, newNovelId: string) => {
    return await prisma.categoriesOnNovels.create({
        data: {
            category_id,
            novel_id: newNovelId
        }
    })
}


export const removeNovelWithId = async (id: string) => {

    await prisma.chapter.deleteMany({
        where: {
            novel_id: id
        }
    })

    await prisma.categoriesOnNovels.deleteMany({
        where: {
            novel_id: id
        }
    })

    return await prisma.novel.delete({
        where: {
            id
        }
    })
}

//CHAPTERS

export const listChaptersByNovelId = async (novelId: string) => {
    return await prisma.chapter.findMany({
        where: { novel_id: novelId },
        select: {
            id: true,
            slug: true,
            volume: true,
            number: true
        }
    })
}

export const listAllChapters = async () => {
    return await prisma.chapter.findMany({
        select: {
            id: true,
            volume: true,
            number: true,
            createdAt: true,
            novel: { select: { title: true, rate: true } }
        },
        orderBy: [
            { volume: 'asc' },
            { number: 'asc' }
        ]
    })
}

export const findChapterByIdVolNum = async (novel_id: string, volume: number, number: number) => {
    return await prisma.chapter.findFirst({
        where: {
            AND: [
                { novel_id },
                { volume },
                { number }
            ]
        }
    })
}

export const deleteChapterById = async (id: string) => {
    return await prisma.chapter.delete({ where: { id } })
}

export const createChapterWithData = async (data: DataChapter) => {
    return await prisma.chapter.create({
        data
    });
}
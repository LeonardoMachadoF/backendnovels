import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { createChapterWithData, deleteChapterById, findChapterByIdVolNum, findNovelBySlug, listAllChapters } from '../libs/prismaUtils';



export const listChapters = async (req: Request, res: Response) => {
    const chapters = await listAllChapters()

    if (chapters) {
        res.json({ chapters })
    } else {
        res.json({ error: 'Nenhum capítulo encontrado!' })
    }
}

export const showChapter = async (req: Request, res: Response) => {
    let { volume, number, slug } = req.params;

    if (!slug || !volume || !number) {
        res.json({ error: 'Nenhum resultado encontrado!' })
        return
    }

    const novel = await findNovelBySlug(slug)

    if (!novel) {
        res.json({ error: 'Nenhum resultado encontrado!' })
        return
    }

    const chapter = await findChapterByIdVolNum(novel.id, parseInt(volume), parseInt(number))

    if (!chapter) {
        res.json({ error: 'Nenhum resultado encontrado!' })
        return
    }

    res.json({ chapter, images: novel.imagesUrl });
};

export const removeChapter = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id) {
        let deletedChapter = await deleteChapterById(id).catch(() => { })
        if (deletedChapter) {
            res.json({ status: 'success' });
            return
        }
    }
    res.json({ error: 'Capítulo não encontrado!' });
}

export const addChapter = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json({ error: errors.mapped() });
        return;
    };

    const { volume, number, title, content, novel_id } = matchedData(req);

    const slug = `volume-${volume}-number-${number}`;

    const hasChapter = await findChapterByIdVolNum(novel_id, parseInt(volume), parseInt(number))

    let data = {
        title,
        volume: parseInt(volume),
        number: parseInt(number),
        content,
        slug,
        novel_id
    }

    if (!hasChapter) {
        const newChapter = await createChapterWithData(data).catch(() => { });
        if (newChapter) {
            res.json({ id: newChapter.id, slug });
            return;
        } else {
            res.json({ error: 'Id de novel inexistente!' })
            return;
        }
    }

    res.json({ error: 'Capitulo já existente!' })
}


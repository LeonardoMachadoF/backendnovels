import { Router } from "express";
import * as UserController from '../controllers/UserController';
import * as NovelController from '../controllers/NovelController';
import * as ChapterController from '../controllers/ChapterController'
import multer from "multer";
import { chapterValidator, loginValidator, novelValidator, userValidator } from "../validators/UserValidator";
import { privateRoute } from "../validators/PrivateRoute";

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fieldSize: 20000000 }
})

const router = Router();

router.get('/user', privateRoute, upload.single('img'), UserController.listUsers)
router.post('/user/register', userValidator, UserController.registerUser)
router.post('/user/login', loginValidator, UserController.loginUser)

router.get('/novels', NovelController.listNovels)
router.get('/novels/popular', NovelController.getPopularNovels)
router.post('/novel', privateRoute, upload.single('img'), novelValidator, NovelController.addNovel)
router.delete('/novel/:id', privateRoute, NovelController.removeNovel)
router.get('/novel/addfavorite', NovelController.addFavorite)
router.get('/novel/:slug', NovelController.listNovel)

router.get('/chapter', ChapterController.listChapters);
router.delete('/chapter/:id', privateRoute, ChapterController.removeChapter);
router.post('/chapter', chapterValidator, ChapterController.addChapter);
router.get('/chapter/:slug-volume-:volume-chapter-:number', ChapterController.showChapter);

export default router


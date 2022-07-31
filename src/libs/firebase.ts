import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, StorageReference, uploadBytes } from "firebase/storage";
import dotenv from 'dotenv';

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export const listAllPhotos = async (ref: StorageReference) => {
    const res = await listAll(ref);
    let imagesUrl: string[] = [];
    for (let i in res.items) {
        let photoURL = await getDownloadURL(res.items[i])
        imagesUrl.push(photoURL);
    }
    return imagesUrl
}

export const createRef = (path: string) => {
    return ref(storage, path)
}

export const uploadImg = async (ref: StorageReference, file: any) => {
    await uploadBytes(ref, file);
}

export const getUrl = async (ref: StorageReference) => {
    return await getDownloadURL(ref);
}
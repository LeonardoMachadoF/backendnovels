import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, StorageReference, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA9VglKD3jkke0C6mWYmqDD2alPmurwnBc",
    authDomain: "noveldb-8b92b.firebaseapp.com",
    projectId: "noveldb-8b92b",
    storageBucket: "noveldb-8b92b.appspot.com",
    messagingSenderId: "648223718178",
    appId: "1:648223718178:web:9c70e48853484df095037b"
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
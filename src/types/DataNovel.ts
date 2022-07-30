export type DataNovel = {
    slug: string,
    title: string,
    artist_id: string,
    author_id: string,
    imagesUrl: string,
    description: string,
    country_id: string
}

export type DataChapter = {
    title: any;
    volume: number;
    number: number;
    content: any;
    slug: string;
    novel_id: any;
}
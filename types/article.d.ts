export interface Article {
    publish_date: string;
    update_date: string;
    id: number;
    authors: string;
    title: string;
    image: {
        square_tiny: string;
        screen_tiny: string;
        square_small: string;
        original: string;
    };
    deck: string;
    body: string;
    lede: string;
    categories: {
        id: number;
        name: string;
    }[];
    associations: {
        id: number;
        name: string;
    }[];
    site_detail_url: string;
}

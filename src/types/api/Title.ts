export interface TitleInfo {
  id: number;
  name: string;
  rus_name: string;
  eng_name: string;
  slug: string;
  slug_url: string;
  cover: TitleCover;
  background: Background;
  ageRestriction: AgeRestriction;
  site: number;
  type: Type;
  summary: string;
  is_licensed: boolean;
  authors: Author[];
  model: string;
  status: Status;
  artists: Artist[];
  releaseDateString: string;
}

export interface TitleCover {
  filename: string;
  thumbnail: string;
  default: string;
  md: string;
}

export interface Background {
  filename: string | null;
  url: string;
}

export interface AgeRestriction {
  id: number;
  label: string;
}

export interface Type {
  id: number;
  label: string;
}

export interface Author {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  rus_name: string | null;
  alt_name: string | null;
  cover: AuthorCover;
  subscription: AuthorSubscription;
  confirmed: boolean;
  user_id: number;
}

export interface AuthorCover {
  filename: string | null;
  thumbnail: string;
  default: string;
  md: string;
}

export interface AuthorSubscription {
  is_subscribed: boolean;
  source_type: string;
  source_id: number;
  relation: null;
}

export interface Status {
  id: number;
  label: string;
}

export interface Artist {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  rus_name: string | null;
  alt_name: string | null;
  cover: ArtistCover;
  subscription: ArtistSubscription;
  confirmed: boolean;
  user_id: number;
}

export interface ArtistCover {
  filename: string | null;
  thumbnail: string;
  default: string;
  md: string;
}

export interface ArtistSubscription {
  is_subscribed: boolean;
  source_type: string;
  source_id: number;
  relation: null;
}

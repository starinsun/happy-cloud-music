interface ArtistType {
  name: string;
  img1v1Url: string;
  [props: string]: any;
}

interface AlbumType {
  name: string;
  id: number;
  picUrl: string;
  [props: string]: any;
}

export interface RecommendRawListType {
  id: number;
  name: "";
  ar: ArtistType[];
  al: AlbumType;
  dt: number;
  [props: string]: any;
}

export interface RecommendListType {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  copywriter: string;
  [props: string]: any;
}

export interface BannerType {
  imageUrl: string;
  scm: string;
  [props: string]: string;
}

interface albumType {
  name: string;
  [props: string]: any;
}

export interface artistType {
  img1v1Url: string;
  name: string;
  [props: string]: any;
}

export interface RawListType {
  album: albumType;
  artists: artistType[];
  duration: number;
  id: number;
  name: string;
  [props: string]: any;
}

export interface PlayListType {
  singer: artistType[];
  album: albumType;
  interval: number;
  mid: number;
  name: string;
  audio: string;
  img: string;
  lyric: string;
}

export interface SearchListType {
  data: PlayListType[];
  hasMore: boolean;
}

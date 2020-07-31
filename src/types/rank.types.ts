export interface RankSingerType {
  first: string;
  second: string;
}

export interface RankType {
  tracks?: RankSingerType[];
  coverImgUrl: string;
  name: string;
  id: number;
  [props: string]: any;
}

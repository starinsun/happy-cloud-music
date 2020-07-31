import { localFavor, localSearch } from "../utils/utils";
import { IState } from "../types/store.types";

const state: IState = {
  singer: {
    id: 0,
    name: "",
    img1v1Url: "",
  },
  playing: false,
  fullscreen: false,
  playlist: [],
  sequencelist: [],
  mode: 0,
  currentIdx: -1,
  disc: {
    id: 0,
    name: "",
    picUrl: "",
    playCount: 0,
    copywriter: "",
  },
  rank: {
    id: 0,
    name: "",
    coverImgUrl: "",
  },
  history: localSearch(),
  favor: localFavor(),
};

export default state;

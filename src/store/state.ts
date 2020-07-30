import { localFavor, localSearch } from "../utils/utils";
import { IState } from "../types/store.types";

const state: IState = {
  singer: {},
  songs: [],
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
  rank: {},
  history: localSearch(),
  favor: localFavor(),
};

export default state;

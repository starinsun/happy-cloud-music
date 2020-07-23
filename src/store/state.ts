import { localFavor, localSearch } from "../utils/utils";
import { IState } from "../utils/types";

const state: IState= {
  singer: {},
  songs: [],
  playing: false,
  fullscreen: false,
  playlist: [],
  sequencelist: [],
  mode: 0,
  currentIdx: -1,
  disc: {},
  rank: {},
  history: localSearch(),
  favor: localFavor()
};

export default state
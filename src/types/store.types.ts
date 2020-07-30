import { RecommendListType } from "./recommend.types";

export interface IState {
  singer: object;
  songs: any[];
  playing: boolean;
  fullscreen: boolean;
  playlist: any[];
  sequencelist: any[];
  mode: number;
  currentIdx: number;
  disc: RecommendListType;
  rank: object;
  history: any;
  favor: any;
}

export enum MutationTypes {
  SET_SINGER = "SET_SINGER",
  SET_SINGER_SONGS = "SET_SINGER_SONGS",
  SET_PLAYING_STATE = "SET_PLAYING_STATE",
  SET_FULL_SCREEN = "SET_FULL_SCREEN",
  SET_PLAYLIST = "SET_PLAYLIST",
  SET_SEQUENCE_LIST = "SET_SEQUENCE_LIST",
  SET_MODE = "SET_MODE",
  SET_CURRENT_IDX = "SET_CURRENT_IDX",
  SET_DISC = "SET_DISC",
  SET_RANK = "SET_RANK",
  SET_SEARCH_HISTORY = "SET_SEARCH_HISTORY",
  SET_FAVOR = "SET_FAVOR",
}

export enum ActionTypes {
  SELECT_PLAY = "SELECT_PLAY",
  RANDOW_PLAY = "RANDOW_PLAY",
  INSERT_SONG = "INSERT_SONG",
  SAVE_HISTORY = "SAVE_HISTORY",
  DELETE_HISTORY = "DELETE_HISTORY",
  CLEAR_HISTORY = "CLEAR_HISTORY",
  DELETE_SONG = "DELETE_SONG",
  DELETE_ALL = "DELETE_ALL",
  SAVE_FAVOR = "SAVE_FAVOR",
  DELETE_FAVOR = "DELETE_FAVOR",
}

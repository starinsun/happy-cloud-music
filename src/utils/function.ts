import { RawListType, PlayListType } from "../types/search.types";
import { getAudioUrl, getLyric } from "../config/http.config";

export async function normalise(list: RawListType[]) {
  let arr1: any[] = await Promise.all(list.map((item) => getAudioUrl(item.id)));
  let arr2: string[] = await Promise.all(list.map((item) => getLyric(item.id)));
  return list.map((item, idx) => {
    let final: PlayListType = {};
    final.name = item.name;
    final.interval = item.duration;
    final.singer = item.artists;
    final.mid = item.id;
    final.album = item.album;
    final.audio = arr1[idx] ? arr1[idx] : "error";
    final.lyric = arr2[idx] ? arr2[idx] : "暂无歌词";
    final.img = "";
    return final;
  });
}

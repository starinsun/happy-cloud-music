import { RawListType, PlayListType } from "../types/search.types";
import { getAudioUrl, getLyric } from "../config/http.config";
import { RecommendRawListType } from "../types/recommend.types";

export async function normalise(list: RawListType[]) {
  let arr1: any[] = await Promise.all(list.map((item) => getAudioUrl(item.id)));
  let arr2: string[] = await Promise.all(list.map((item) => getLyric(item.id)));
  return list.map((item, idx) => {
    let final: PlayListType = {
      name: "",
      interval: 0,
      singer: [],
      mid: 0,
      album: { name: "" },
      audio: "",
      lyric: "",
      img: "",
    };
    final.name = item.name;
    final.interval = Math.floor(item.duration / 1000);
    final.singer = item.artists;
    final.mid = item.id;
    final.album = item.album;
    final.audio = arr1[idx] ? arr1[idx] : "error";
    final.lyric = arr2[idx] ? arr2[idx] : "暂无歌词";
    final.img = item.artists[0].img1v1Url;
    return final;
  });
}

export async function recmmendNomarlise(list: RecommendRawListType[]) {
  list = list.slice(0, 33);
  let arr1: any[] = await Promise.all(list.map((item) => getAudioUrl(item.id)));
  let arr2: string[] = await Promise.all(list.map((item) => getLyric(item.id)));
  return list.map((item, idx) => {
    let final: PlayListType = {
      name: "",
      interval: 0,
      singer: [],
      mid: 0,
      album: { name: "" },
      audio: "",
      lyric: "",
      img: "",
    };
    final.name = item.name;
    final.interval = Math.floor(item.dt / 1000);
    final.singer = item.ar;
    final.mid = item.id;
    final.album = item.al;
    final.audio = arr1[idx] ? arr1[idx] : "error";
    final.lyric = arr2[idx] ? arr2[idx] : "暂无歌词";
    final.img = item.al.picUrl
      ? item.al.picUrl
      : "https://eswang.gitee.io/blog_pic/image/default.png";
    return final;
  });
}

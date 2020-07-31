import { singerTag } from "../utils/help";
import { normalise, recmmendNomarlise } from "../utils/function";

const baseUrl = "http://106.15.37.245:3200/";

export async function getRecommendBanner() {
  let res = await fetch(`${baseUrl}banner`).then((v) => v.json());
  return res.banners;
}

export async function getSongList() {
  let res = await fetch(`${baseUrl}personalized`).then((v) => v.json());
  return res.result;
}

export async function getPlayListDetail(id: number) {
  let res = await fetch(`${baseUrl}playlist/detail?id=${id}`).then((v) =>
    v.json()
  );
  return await recmmendNomarlise(res.playlist.tracks);
}

export async function getSingerList() {
  let res = Promise.all(
    singerTag.map((item) =>
      fetch(
        `${baseUrl}artist/list?type=-1&area=-1&initial=${item.key}&limit=15`
      )
        .then((v) => v.json())
        .then((v) => v.artists)
    )
  );
  return res;
}

export async function getSingerDetail(id: number) {
  let res = await fetch(`${baseUrl}artists?id=${id}`).then((v) => v.json());
  return {
    hotSongs: await recmmendNomarlise(res.hotSongs),
    artist: res.artist,
  };
}

export async function getRankList() {
  let res = await fetch(`${baseUrl}toplist/detail`).then((v) => v.json());
  let detail = res.list.slice(0, 3);
  let rest = res.list.slice(3);
  return { detail, rest };
}

export async function getHotkey() {
  let res = await fetch(`${baseUrl}search/hot`).then((v) => v.json());
  return res.result.hots;
}

export async function getSearchRes(key: string, offset: number, limit = 10) {
  let res = await fetch(
    `${baseUrl}search?keywords=${key}&offset=${offset * limit}&limit=${limit}`
  ).then((v) => v.json());
  return {
    data: await normalise(res.result.songs),
    hasMore: res.result.hasMore,
  };
}

export async function getAudioUrl(id: number) {
  let res = await fetch(`${baseUrl}song/url?id=${id}`).then((v) => v.json());
  return res?.data[0]?.url;
}

export async function getLyric(id: number) {
  let res = await fetch(`${baseUrl}lyric?id=${id}`).then((v) => v.json());
  return res?.lrc?.lyric;
}

// @ts-ignore
import storage from "good-storage";

export const getCount = (count: number) => {
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + "万";
  } else {
    return Math.floor(count / 10000000) / 10 + "亿";
  }
};

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LEN = 15;

const FAVOR_KEY = "__favor__";
const FAVOR_MAX_LEN = 100;

function insertArray(arr: string[], val: string, compare: any, maxLen: number) {
  const idx = arr.findIndex(compare);
  if (idx === 0) {
    return;
  }
  if (idx > 0) {
    arr.splice(idx, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
function deleteFromArray(arr: string[], compare: any) {
  const idx = arr.findIndex(compare);
  if (idx > -1) {
    arr.splice(idx, 1);
  }
}

export function saveSearch(query: string) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item: any) => item === query, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function localSearch() {
  return storage.get(SEARCH_KEY);
}

export function deleteSearch(query: string) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item: any) => item === query);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearList() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function setFavor(song: any) {
  let songs = storage.get(FAVOR_KEY, []);
  insertArray(songs, song, (item: any) => item.mid === song.mid, FAVOR_MAX_LEN);
  storage.set(FAVOR_KEY, songs);
  return songs;
}

export function delFavor(song: any) {
  let songs = storage.get(FAVOR_KEY, []);
  deleteFromArray(songs, (item: any) => item.mid === song.mid);
  storage.set(FAVOR_KEY, songs);
  return songs;
}

export function localFavor() {
  return storage.get(FAVOR_KEY, []);
}

"use es6";

export const addCachedData = (cacheName, data) => {
  window.localStorage.setItem(cacheName, data);
};

export const removeCachedData = (cacheName) => {
  localStorage.removeItem(cacheName);
};

export const getCachedData = async (cacheName) => {
  const response = window.localStorage.getItem(cacheName);
  if (!!response) {
    return response;
  } else {
    return null;
  }
};

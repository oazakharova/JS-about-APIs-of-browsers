const likeHistoryLSKey = "likeHistory";

function setInitialLikeHistoryInLS() {
  localStorage.setItem(likeHistoryLSKey, JSON.stringify(initialLikeHistory));
}

function getLikeHistoryFromLS() {
  let likeHistory = localStorage.getItem(likeHistoryLSKey);
  if (!likeHistory) {
    localStorage.setItem(likeHistoryLSKey, JSON.stringify(likeHistory));
  }
  return JSON.parse(likeHistory);
}

function updateLikeHistoryInLS(likeHistory) {
  localStorage.setItem(likeHistoryLSKey, JSON.stringify(likeHistory));
}

export {
  setInitialLikeHistoryInLS,
  getLikeHistoryFromLS,
  updateLikeHistoryInLS,
};

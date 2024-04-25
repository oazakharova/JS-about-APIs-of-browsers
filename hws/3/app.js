"use strict";

/*
Цель: Разработать веб-приложение, которое будет отображать
новое случайное изображение из коллекции Unsplash, давая пользователю
возможность узнать больше о фотографе и сделать "лайк" изображению.

Разработка веб-приложения:

• Создайте HTML-страницу с элементами: изображение, имя фотографа,
кнопка "лайк" и счетчик лайков.

• Используя JavaScript и ваш API-ключ, получите случайное изображение
из Unsplash каждый раз, когда пользователь загружает страницу.
Обратите внимание, что должно подгружаться всегда случайное изображение,
для этого есть отдельная ручка (эндпоинт) у API.

• Отобразите информацию о фотографе под изображением.

• Реализуйте функционал "лайка". Каждый раз, когда пользователь нажимает
кнопку "лайк", счетчик должен увеличиваться на единицу.
Одну фотографию пользователь может лайкнуть только один раз.
Также должна быть возможность снять лайк, если ему разонравилась картинка.

• Добавьте функцию сохранения количества лайков в локальное хранилище,
чтобы при новой загрузке страницы счетчик не сбрасывался,
если будет показана та же самая картинка.

• Реализуйте возможность просмотра предыдущих фото с сохранением их
в истории просмотров в localstorage.

• Реализовать все с помощью async/await, без цепочек then.
*/

import {
  setInitialLikeHistoryInLS,
  getLikeHistoryFromLS,
  updateLikeHistoryInLS,
} from "./storage.js";

const APIkey = "";
//const APIkey = "";
//const APIkey = "";

const containerEl = document.querySelector(".container");

(async function () {
  try {
    const randomImage = await getRandomImage();
    renderRandomImage(randomImage);
    createLikeHistory();
  } catch (error) {
    alert(error);
  }
})();

async function getRandomImage() {
  const response = await fetch(`https://api.unsplash.com/photos/random`, {
    headers: { Authorization: "Client-ID " + APIkey },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const json = await response.json();
  return json;
}

function renderRandomImage(randomImage) {
  // img
  const imageEl = document.createElement("img");
  imageEl.src = randomImage.urls.small;
  imageEl.alt = randomImage.alt_description;
  containerEl.append(imageEl);

  // author
  const authorEl = document.createElement("p");
  authorEl.textContent = randomImage.user.name;
  containerEl.append(authorEl);

  // like (btn)
  const likeEl = document.createElement("button");
  likeEl.classList.add("fa-regular");
  likeEl.classList.add("fa-heart");
  containerEl.append(likeEl);

  // счетчик лайков
  const likeCounterEl = document.createElement("p");
  likeCounterEl.classList.add("likeCounter");
  likeCounterEl.textContent = randomImage.likes;
  containerEl.append(likeCounterEl);

  // проверка, была ли ранее добавлена эта картинка в понравившиеся
  const historyLS = getLikeHistoryFromLS() || [];
  const wasLiked = historyLS.some((img) => img.id === randomImage.id);

  if (wasLiked) {
    // закрасить лайк
    likeEl.classList.remove("fa-regular");
    likeEl.classList.add("fa-solid");
    likeEl.style.color = "red";
  }

  // нажатие на кнопку лайк
  likeEl.addEventListener("click", () => {
    // если лайка еще не было
    if (likeEl.classList.contains("fa-regular")) {
      // закрасить лайк
      likeEl.classList.remove("fa-regular");
      likeEl.classList.add("fa-solid");
      likeEl.style.color = "red";

      // увеличить счетчик лайков
      const likeCounterEl = document.querySelector(".likeCounter");
      likeCounterEl.textContent = parseInt(likeCounterEl.textContent) + 1;

      // увеличение лайков в объекте случайной картинки
      randomImage.likes++;

      // записать в LS
      const historyLS = getLikeHistoryFromLS() || [];
      historyLS.push(randomImage);
      updateLikeHistoryInLS(historyLS);

      renderLikeHistoryFromLS(randomImage);
    } else {
      // если лайк уже стоит
      // убрать заливку кнопки
      likeEl.classList.add("fa-regular");
      likeEl.classList.remove("fa-solid");
      likeEl.style.color = "black";

      // уменьшить счетчик лайков
      const likeCounterEl = document.querySelector(".likeCounter");
      likeCounterEl.textContent = parseInt(likeCounterEl.textContent) - 1;

      // уменьшение количества лайков в объекте случайной картинки
      randomImage.likes--;

      // удалить из LS разонравившуюся img
      const historyLS = getLikeHistoryFromLS();
      const index = historyLS.indexOf(randomImage);
      historyLS.splice(index, 1);
      updateLikeHistoryInLS(historyLS);

      // удалить из истории понравившихся картинок
      const historyInnerContainerEl = document.querySelector(
        ".historyInnerContainer"
      );
      historyInnerContainerEl.textContent = ""; // очистка ранее отображенных картинок

      // добавление всех картинок из LS
      historyLS.forEach((image) => {
        const historyItemEl = createImg(image);
        historyInnerContainerEl.append(historyItemEl);
      });
    }
  });
}

function createLikeHistory() {
  // history wrap
  const historyWrapEl = document.createElement("div");
  containerEl.append(historyWrapEl);

  // history btn
  const historyEl = document.createElement("button");
  historyEl.classList.add("historyBtn");
  historyEl.textContent = "Show history";
  historyWrapEl.append(historyEl);

  historyEl.addEventListener("click", () => {
    if (historyContainerEl.style.display === "none") {
      historyEl.textContent = "Hide history";
      historyContainerEl.style.display = "block";
    } else {
      historyEl.textContent = "Show history";
      historyContainerEl.style.display = "none";
    }
  });

  // history container
  const historyContainerEl = document.createElement("div");
  historyContainerEl.classList.add("historyContainer");
  historyContainerEl.style.display = "none";
  containerEl.append(historyContainerEl);

  // header
  const historyHeaderEl = document.createElement("h5");
  historyHeaderEl.textContent = "History:";
  historyContainerEl.append(historyHeaderEl);

  // внутренний контейнер для картинок
  const historyInnerContainerEl = document.createElement("div");
  historyInnerContainerEl.classList.add("historyInnerContainer");
  historyContainerEl.append(historyInnerContainerEl);

  // добавление всех картинок из LS
  const historyLS = getLikeHistoryFromLS() || [];
  historyLS.forEach((image) => {
    const historyItemEl = document.createElement("img");
    historyItemEl.src = image.urls.small;
    historyItemEl.alt = image.alt_description;

    historyItemEl.style.width = "150px";
    historyItemEl.style.height = "250px";
    historyItemEl.style.marginRight = "15px";
    historyItemEl.style.objectFit = "cover";

    historyInnerContainerEl.append(historyItemEl);
  });
}

function renderLikeHistoryFromLS(randomImage) {
  // добавить к истории понравившихся картинок
  const historyInnerContainerEl = document.querySelector(
    ".historyInnerContainer"
  );

  const historyItemEl = createImg(randomImage);
  historyInnerContainerEl.append(historyItemEl);
}
function createImg(randomImage) {
  const historyItemEl = document.createElement("img");
  historyItemEl.src = randomImage.urls.small;
  historyItemEl.alt = randomImage.alt_description;

  historyItemEl.style.width = "150px";
  historyItemEl.style.height = "250px";
  historyItemEl.style.marginRight = "15px";
  historyItemEl.style.objectFit = "cover";

  return historyItemEl;
}

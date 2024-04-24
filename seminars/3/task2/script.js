"use strict";

/*
Бесконечная лента фотографий.

Для создания бесконечной ленты с фотографиями с использованием Unsplash API
выполните следующие шаги:

1. Зарегистрируйтесь на Unsplash:
○ Перейдите на веб-сайт Unsplash (https://unsplash.com/).
○ Нажмите кнопку "Join", чтобы создать аккаунт, если его еще нет.
○ Войдите в свой аккаунт Unsplash.

2. Создайте приложение:
○ После входа в аккаунт Unsplash, перейдите на страницу разработчика Unsplash
(https://unsplash.com/developers).
○ Нажмите на кнопку "Your apps".
○ Нажмите "New Application" (Новое приложение).
○ Заполните информацию о вашем приложении, такую как имя, описание и сайт
(вы можете использовать http://localhost для тестового сайта).
○ После заполнения информации, нажмите "Create Application" (Создать приложение).

3. Получите API-ключ:
○ После создания приложения, вы получите API-ключ. Этот ключ будет
отображаться в вашей панели управления приложением.
○ API-ключ представляет собой строку вида YOUR_ACCESS_KEY. Скопируйте его.

4. Измените код HTML и JavaScript:
○ Откройте вашу HTML-страницу в текстовом редакторе или
интегрированной среде разработки.
○ Замените 'YOUR_ACCESS_KEY' в коде JavaScript на ваш собственный API-ключ.

5. Реализуйте загрузку фотографий при открытии страницы.
6. Реализуйте бесконечную подгрузку фотографий при прокручивании страницы.
*/

const APIkey = "Vt_mWjlZ4JkzlQH4k86O0m4zZ3lHjib1nlZorbk7UNQ";
let isFetching = false;
let page = 1;

async function getImages(currentPage) {
  isFetching = true;

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${currentPage}&per_page=10`,
      { headers: { Authorization: "Client-ID " + APIkey } }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const json = await response.json();
    // return new Promise((resolve, reject) => {
    // 	reject(new Error('Ошибка'));
    // });
    console.log(json);
    return json;
  } finally {
    isFetching = false;
  }
}

(async function () {
  try {
    const result = await getImages(page++);
    renderImages(result);
  } catch (error) {
    alert(error);
  }
})();

// const result = await getImages(page++);
// renderImages(result);

// getImages(page++)
// 	.then((result) => {
// 		renderImages(result);
// 	})
// 	.catch((error) => {
// 		alert(error);
// 	});

function renderImages(photoArray) {
  const photoContEl = document.querySelector("#photo-container");
  photoArray.forEach((photo) => {
    photoContEl.insertAdjacentHTML(
      "beforeend",
      `<img class="photo" src="${photo.urls.regular}">`
    );
  });
}

window.addEventListener("scroll", async () => {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );

  if (window.scrollY >= scrollHeight * 0.75 && !isFetching) {
    try {
      renderImages(await getImages(page++));
    } catch (error) {
      alert(error);
    }
  }
});

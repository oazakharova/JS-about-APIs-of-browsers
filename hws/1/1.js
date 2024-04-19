"use strict";

/*
Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.

На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
Каждая строка таблицы должна содержать информацию о занятии, а именно:
- название занятия
- время проведения занятия
- максимальное количество участников
- текущее количество участников
- кнопка "записаться"
- кнопка "отменить запись"

Если максимальное количество участников достигнуто,
либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.

Кнопка "отменить запись" активна в случае, если пользователь записан на занятие,
иначе она должна быть неактивна.

Пользователь может записаться на один курс только один раз.

При нажатии на кнопку "записаться" увеличьте количество записанных участников.

Если пользователь нажимает "отменить запись", уменьшите количество записанных
участников.
Обновляйте состояние кнопок и количество участников в реальном времени.

Если количество участников уже максимально, то пользователь не может записаться,
даже если он не записывался ранее.

Сохраняйте данные в LocalStorage,
чтобы они сохранялись и отображались при перезагрузке страницы.

Начальные данные (JSON):
[
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]
*/

// импорт
import {
  setInitialSheduleInLS,
  getSheduleFromLS,
  updateSheduleInLS,
} from "./storage.js";

// переменные

const sectionEl = document.querySelector(".section");

let shedule = getSheduleFromLS();
if (!shedule) {
  shedule = setInitialSheduleInLS();
}

showSheduleOnHTML(shedule);

// логика работы кнопок

// логика работы кнопки "записаться"
const subscribeBtnEls = document.querySelectorAll(".subscribeBtn");
subscribeBtnEls.forEach((btn) => {
  const lesson = btn.closest(".lesson");
  const lessonId = +lesson.dataset.lessonId;

  const maxParticipants = +lesson.querySelector(".maxParticipants").textContent;

  const currentParticipants = +lesson.querySelector(".currentParticipants")
    .textContent;

  // кнопка сразу становится неактивной без клика, если запись уже полная
  if (currentParticipants === maxParticipants) {
    btn.disabled = true;
  }

  // клик
  btn.addEventListener("click", (e) => {
    // актуализация количества текущих записей из localStorage
    const shedule = getSheduleFromLS();
    const currentParticipants = shedule.find(
      (lesson) => lesson.id === lessonId
    ).currentParticipants;

    const unsubscribeBtn = lesson.querySelector(".unsubscribeBtn");

    if (currentParticipants < maxParticipants) {
      // обновление количества записавшихся на странице
      lesson.querySelector(".currentParticipants").textContent =
        currentParticipants + 1;

      // обновление количества записанных в localStorage
      shedule.forEach((lesson) => {
        if (lesson.id === lessonId) {
          lesson.currentParticipants += 1;
        }
      });

      // обновление количества записанных в localStorage
      updateSheduleInLS(shedule);

      // деактивация кнопки для предотвращения повторной записи
      btn.disabled = true;

      // активация кнопки отменить запись
      unsubscribeBtn.disabled = false;
    }
  });
});

// логика работы кнопки "отменить запись"
const unsubscribeBtnEls = document.querySelectorAll(".unsubscribeBtn");
unsubscribeBtnEls.forEach((btn) => {
  const lesson = btn.closest(".lesson");
  const lessonId = +lesson.dataset.lessonId;

  // первоначальное состояние - кнопка неактивна, пока не было записи на курс
  btn.disabled = true;

  btn.addEventListener("click", (e) => {
    const subscribeBtn = lesson.querySelector(".subscribeBtn");

    // актуализация количества текущих записей из localStorage
    const shedule = getSheduleFromLS();
    const currentParticipants = shedule.find(
      (lesson) => lesson.id === lessonId
    ).currentParticipants;

    // обновление количества записавшихся на странице
    lesson.querySelector(".currentParticipants").textContent =
      currentParticipants - 1;

    // обновление количества записанных в localStorage
    shedule.forEach((lesson) => {
      if (lesson.id === lessonId) {
        lesson.currentParticipants -= 1;
      }
    });

    // обновление количества записанных в localStorage
    updateSheduleInLS(shedule);

    // деактивация кнопки для предотвращения повторной записи
    btn.disabled = true;

    // активация кнопки записаться
    subscribeBtn.disabled = false;
  });
});

// функции
function showSheduleOnHTML(shedule) {
  // заголовок секции
  const titleEl = document.createElement("h1");
  titleEl.textContent = "Расписание занятий:";
  sectionEl.append(titleEl);

  // создание таблицы
  const tableEl = document.createElement("table");
  sectionEl.append(tableEl);

  // создание строки
  const theadEl = document.createElement("thead");
  tableEl.append(theadEl);

  // создание заголовка строки
  const trEl = document.createElement("tr");
  theadEl.append(trEl);

  // создание заголовка столбца
  const thEl = document.createElement("th");
  thEl.textContent = "Название занятия";
  trEl.append(thEl);

  // создание заголовка столбца
  const thEl2 = document.createElement("th");
  thEl2.textContent = "Время проведения занятия";
  trEl.append(thEl2);

  // создание заголовка столбца
  const thEl3 = document.createElement("th");
  thEl3.textContent = "Максимальное количество участников";
  trEl.append(thEl3);

  // создание заголовка столбца
  const thEl4 = document.createElement("th");
  thEl4.textContent = "Текущее количество участников";
  trEl.append(thEl4);

  // создание заголовка столбца
  const thEl5 = document.createElement("th");
  thEl5.textContent = "Записаться";
  trEl.append(thEl5);

  // создание заголовка столбца
  const thEl6 = document.createElement("th");
  thEl6.textContent = "Отменить запись";
  trEl.append(thEl6);

  // создание строки
  const tbodyEl = document.createElement("tbody");
  tableEl.append(tbodyEl);

  // наполнение таблицы
  shedule.forEach((item) => {
    // создание строки - в нее добавляются все ячейки
    const trEl = document.createElement("tr");
    trEl.dataset.lessonId = item.id;
    trEl.classList.add("lesson");
    tbodyEl.append(trEl);

    // название занятия
    const tdEl = document.createElement("td");
    tdEl.classList.add("lessonName");
    tdEl.textContent = item.name;
    trEl.append(tdEl);

    // время проведения занятия
    const tdEl2 = document.createElement("td");
    tdEl2.classList.add("lessonTime");
    tdEl2.textContent = item.time;
    trEl.append(tdEl2);

    // максимальное количество участников
    const tdEl3 = document.createElement("td");
    tdEl3.classList.add("maxParticipants");
    tdEl3.textContent = item.maxParticipants;
    trEl.append(tdEl3);

    // текущее количество участников
    const tdEl4 = document.createElement("td");
    tdEl4.classList.add("currentParticipants");
    tdEl4.textContent = item.currentParticipants;
    trEl.append(tdEl4);

    // ячейка записаться
    const tdEl5 = document.createElement("td");
    trEl.append(tdEl5);

    // кнопка записаться
    const subscribeBtn = document.createElement("button");
    subscribeBtn.classList.add("subscribeBtn");
    subscribeBtn.textContent = "Записаться";
    tdEl5.append(subscribeBtn);

    // ячейка отменить запись
    const tdEl6 = document.createElement("td");
    trEl.append(tdEl6);

    // кнопка отменить запись
    const unsubscribeBtn = document.createElement("button");
    unsubscribeBtn.classList.add("unsubscribeBtn");
    unsubscribeBtn.textContent = "Отменить запись";
    tdEl6.append(unsubscribeBtn);
  });
}

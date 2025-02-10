# Индивидуальная (лабораторная) работа №2

## Цель работы

Ознакомиться с продвинутыми функциями JavaScript, включая асинхронный JavaScript, модули и обработку ошибок.

## Описание лабораторной работы

Капитан Смит часто ощущает скуку, так как его дни полностью заполнены поездками с одного места на другое. Мы можем помочь ему найти занятие по душе.  
Для этого разрабатывается мини-приложение, которое предлагает капитану Смиту новое слово при каждом обновлении страницы.

## Инструкция по запуску проекта

1. Создайте структуру проекта:
   ```
   /LI_02
   ├── index.html
   ├── index.css
   ├── /src
       ├── activity.js
       ├── main.js
   ├── JS02 пошаговое решение.md
   ```
2. Заполните файлы следующим содержимым:

### `index.html`

```html
<!doctype html>
<html lang="ru">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Activity for Captain Smith</title>
</head>
<body>
<h1>Hey, Captain Smith, you learned a new word:</h1>
<i id="activity"></i>
<script type="module" src="./src/main.js"></script>
</body>
</html>
```

### `src/activity.js`

```js
export async function getRandomActivity() {
    try {
        let response = await fetch("https://random-word-api.herokuapp.com/word");
        let data = await response.json();
        return data[0];
    } catch (error) {
        console.error(error);
        throw new Error("К сожалению, произошла ошибка");
    }
}
```

### `src/main.js`

```js
import { getRandomActivity } from "./activity.js";

async function updateActivity() {
    try {
        let activity = await getRandomActivity();
        document.getElementById("activity").textContent = activity;
    } catch (error) {
        document.getElementById("activity").textContent = error.message;
    } finally {
        setTimeout(updateActivity, 60000);
    }
}

updateActivity();
```

3. Откройте `index.html` в браузере или запустите локальный сервер.

## Контрольные вопросы

1. _Какое значение возвращает функция fetch?_ 
   Функция fetch() возвращает Promise, который разрешается в объект Response.

2. _Что представляет собой Promise?_
    Promise – это объект в JavaScript, представляющий результат асинхронной операции, который может находиться в одном из трёх состояний:
    1. pending – ожидание (операция ещё не завершена).
    2. fulfilled – выполнено успешно (возвращает результат).
    3. rejected – ошибка (возвращает причину ошибки).

3. _Какие методы доступны у объекта Promise?_
   Основные методы для обработки результата:
    1. then(onFulfilled, onRejected) – обработка успешного (resolve) и ошибочного (reject) результата.
    2. catch(onRejected) – обработка ошибки (аналогично then(null, onRejected)).
    3. finally(onFinally) – выполняется в любом случае, независимо от результата.

4. _Каковы основные различия между использованием async / await и Promise?_
    1. Promise использует .then() и .catch(), async/await — await для ожидания и try/catch для обработки ошибок.
    2. В Promise через .catch(), в async/await — через try/catch.

## Источники

1. [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. [MDN Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

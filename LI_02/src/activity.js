/**
 * Функция getRandomActivity выполняет запрос к API для получения случайного слова.
 * Использует async/await для асинхронной работы с fetch.
 * В случае успешного запроса возвращает первое слово из массива.
 * В случае ошибки выбрасывает исключение с сообщением об ошибке.
 * 
 * @returns {string} Первое слово из массива данных.
 * @throws {Error} В случае ошибки запроса или обработки данных.
 */
export async function getRandomActivity() {
    try {
        let response = await fetch("https://random-word-api.herokuapp.com/word"); // Выполняем запрос к API для получения случайного слова
        let data = await response.json(); // Преобразуем ответ в формат JSON
        return data[0]; // Возвращаем первое слово из массива
    } catch (error) {
        console.error(error); // Логируем ошибку и выбрасываем исключение с сообщением
        throw new Error("К сожалению, произошла ошибка");
    }
}
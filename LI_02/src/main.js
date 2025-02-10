import { getRandomActivity } from "./activity.js";
/**
 * Функция updateActivity вызывает getRandomActivity и отображает полученные данные на странице.
 * В случае ошибки отображает сообщение об ошибке.
 */
async function updateActivity() {
    try {
        let activity = await getRandomActivity();
        document.getElementById("activity").textContent = activity;
    } catch (error) {
        document.getElementById("activity").textContent = error.message;
    } finally {
        setTimeout(updateActivity, 60000); // Корректный повторный вызов
    }
}

updateActivity(); // Первоначальный вызов

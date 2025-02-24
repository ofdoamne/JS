/**
 * Класс Transaction представляет собой объект транзакции.
 */
class Transaction {
    /**
     * Создает экземпляр транзакции.
     * @param {number} id - Уникальный идентификатор транзакции.
     * @param {string} date - Дата и время транзакции в формате 'YYYY-MM-DD HH:MM:SS'.
     * @param {number} amount - Сумма транзакции.
     * @param {string} category - Категория транзакции (Deposit или Withdrawal).
     * @param {string} description - Краткое описание транзакции.
     */
    constructor(id, date, amount, category, description) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.category = category;
        this.description = description;
    }
}

let transactions = [] // список всех транзакций
let transactionIDCounter = 1; // счетчик ID
let totalSum = 0; // общая сумма всех транзакций

document.getElementById("addTransactionBtn").addEventListener("click", function() {
    
    // получаем данные из формы и записываеи их в переменные
    const stringAmount = document.getElementById("amount").value; 
    const amount = Number(stringAmount) // сразу преобразуем amount в числовое знач

    const description = document.getElementById("description").value;
    const shortDescription = description.split(" ").slice(0, 4).join(" "); // сразу преобразуем description под условие задания (первые 4 символа)

    // вызываем функцию добаления транзакции
    addTransaction(amount, shortDescription)

    // очистка формы после нажатия на [добавить]
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
});

/**
 * Функция добавления новой транзакции.
 * @param {number} amount - Сумма транзакции.
 * @param {string} shortDescription - Краткое описание (первые 4 слова).
 */
function addTransaction(amount, shortDescription) {

    const id = transactionIDCounter; // присваиваем ID новой транзакии по счетчику
    transactionIDCounter++; // добавляем значение счетчику
    const date = new Date().toISOString().split('.')[0].replace('T', ' '); // получаем дату/время добавления транзакции
    const category = amount > 0 ? "Deposit" : "Withdrawal"; // устанавливаем категорию (плюс или минус)

    const newTransaction = new Transaction(id, date, amount, category, shortDescription) // создаем экземпляр класса Transaction

    transactions.push(newTransaction) // добавляем экземпляр в список всех транзакций

    // добавляем строку в таблице
    const row = document.createElement("tr");

    // добавляем ячейки для каждого столбца
    const cellID = document.createElement("td"); // ячейка ID
    cellID.textContent = newTransaction.id; // записываем в ячейку ID созданного экземпляра транзакции
    row.appendChild(cellID); // добавляем созданную ячейку ID в созданную строку таблицы

    // то же самое с date
    const cellDate = document.createElement("td");
    cellDate.textContent = newTransaction.date;
    row.appendChild(cellDate);

    // то же самое с category
    const cellCategory = document.createElement("td");
    cellCategory.textContent = newTransaction.category;
    row.appendChild(cellCategory);

    // то же самое с description
    const cellDescription = document.createElement("td");
    cellDescription.textContent = newTransaction.description;
    row.appendChild(cellDescription);

    const cellActive = document.createElement("td"); // создаем ячейку для кнопки Удалить
    const deleteButton = document.createElement("button"); // создаем кнопку
    deleteButton.textContent = "Удалить"; // добавляем текст к кнопке
    cellActive.appendChild(deleteButton); // добавляем кнопку в ячейку
    row.appendChild(cellActive); // добавляем ячейку с кнопкой в строку

    deleteButton.addEventListener("click", deleteTransaction) // вызов по клику функции удаления

    // проверка значения amount
    if (amount <= 0) {
        row.style.color = "red";  // Если значение меньше или равно 0, красим строку в красный
    } else {
        row.style.color = "green";  // Если значение больше 0, красим строку в зеленый
    }

    
    document.getElementById("tebleBody").appendChild(row); // добавляем сформированную строку в общую таблицу

    calculateTotal() // вызов функции подсчета общей суммы (transactions должен быть обновлен)
}

/**
 * Функция удаления транзакции.
 */
function deleteTransaction() {
    const row = this.closest("tr"); // получаем ближайший родительский элемент - строку, в которой находится кнопка, которая была прожата
    const transactionId = row.querySelector("td").textContent; // ID транзакции находится в первой ячейке строки таблицы (первая <td>)
    row.remove(); // удаляем строку из таблицы
    transactions = transactions.filter(t => t.id !== Number(transactionId)); // удаляем транзакцию из массива по ID
    calculateTotal(); // вызов функции подсчета общей суммы (transactions должен быть обновлен)
}

/**
 * Функция пересчета общей суммы всех транзакций.
 */
function calculateTotal() {
    totalSum = transactions.reduce((sum, transaction) => sum + transaction.amount, 0); // проходим по каждой транзакции массива transactions и складывает их сумму 
    document.getElementById("totalSum").textContent = totalSum; // обновляем отображение общей суммы
}


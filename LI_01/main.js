// класс представляет собой отдельную транзакцию и преобразует исходный объект (с полученной информацией) в экземпляр, у которого есть свойства и метод возвращать строковое представление транзакции в формате JSON
/**
 * Класс, представляющий транзакцию.
 */
class Transaction {
    /**
     * Создает экземпляр транзакции.
     * @param {Object} params - Параметры транзакции.
     * @param {string} params.transaction_id - Уникальный идентификатор транзакции.
     * @param {string} params.transaction_date - Дата транзакции в формате YYYY-MM-DD.
     * @param {number} params.transaction_amount - Сумма транзакции.
     * @param {string} params.transaction_type - Тип транзакции (например, "покупка" или "возврат").
     * @param {string} params.transaction_description - Описание транзакции.
     * @param {string} params.merchant_name - Название продавца.
     * @param {string} params.card_type - Тип используемой карты (например, "Visa" или "MasterCard").
     */
    constructor({ 
        transaction_id, 
        transaction_date, 
        transaction_amount, 
        transaction_type, 
        transaction_description, 
        merchant_name, 
        card_type 
    }) {
        this.transaction_id = transaction_id;
        this.transaction_date = transaction_date;
        this.transaction_amount = transaction_amount;
        this.transaction_type = transaction_type;
        this.transaction_description = transaction_description;
        this.merchant_name = merchant_name;
        this.card_type = card_type;
    }

    /**
     * Возвращает строковое представление объекта в формате JSON.
     * @returns {string} JSON-строка, представляющая объект транзакции.
     */
    string() {
        return JSON.stringify(this, null, 2);
    }
}

/**
 * Класс для анализа транзакций.
 */
class TransactionAnalyzer {
    /**
     * Создает экземпляр TransactionAnalyzer.
     * @param {Array<Object>} transactions - Массив объектов транзакций.
     */
    constructor(transactions) {
        /**
         * Массив объектов Transaction.
         * @type {Transaction[]}
         */
        this.transactions = transactions.map(transaction => new Transaction(transaction));
    }

    /**
     * Добавляет новую транзакцию в массив.
     * @param {Object} newTransaction - Объект новой транзакции.
     */
    addTransaction(newTransaction) {
        this.transactions.push(new Transaction(newTransaction));
    }

    /**
     * Получает все транзакции в виде строки, разделенной новой строкой.
     * 
     * @returns {string} Строка с транзакциями.
     */
    getAllTransactions() {
        return this.transactions.map(transaction => transaction.string()).join('\n');
    }

    /**
     * Получает массив уникальных типов транзакций.
     * 
     * @returns {Array} Массив уникальных типов транзакций.
     */
    getUniqueTransactionType() {
        const allTypeTransactions = this.transactions.map(transaction => transaction.transaction_type);
        const uniqueTypeTransactions = [...new Set(allTypeTransactions)];
        return uniqueTypeTransactions;
    }

    /**
     * Рассчитывает общую сумму всех транзакций.
     * 
     * @returns {number} Общая сумма всех транзакций.
     */
    calculateTotalAmount() {
        // метод .reduce аккумулирует значения из массива в одно значение total (счетчик = 0), порядковый элемент (transaction) массива функция Number преобразует переменную в число
        return this.transactions.reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
    }

    /**
     * Рассчитывает общую сумму транзакций за указанный период.
     * 
     * Фильтрует транзакции по году, месяцу и дню, если они указаны, и суммирует их значения.
     * 
     * @param {number} year - Год для фильтрации (можно пропустить).
     * @param {number} month - Месяц для фильтрации (можно пропустить).
     * @param {number} day - День для фильтрации (можно пропустить).
     * 
     * @returns {number} Общая сумма транзакций за указанный период.
     */
    calculateTotalAmountByDate(year, month, day) {
        // фильтрация исходного массива транзакций по заданным данным и запись транзакций, удовлетворяющих условиям фильтрации, в filteredTransactions
        // фильтр перебирает все элементы (транзакции) и применяет к каждому функцию-обработчик (проверку)
        const filteredTransactions = this.transactions.filter(transaction => {
            // получаем дату транзакции в формате Date
            const transactionDate = new Date(transaction.transaction_date);
    
            // Проверяем год 
            // если в запросе метода указан год (year), то проверяем соответствует ли он году в очередной транзакции (transactionDate.getFullYear()) и записываем результат: true или false 
            // если в запросе не указан год, устанавливаем true и фильтруем дальше
            const yearMatches = year ? transactionDate.getFullYear() === year : true;
    
            // Проверяем месяц + 1 (месяцы начинаются с 0) по аналогии
            const monthMatches = month ? transactionDate.getMonth() + 1 === month : true;
    
            // Проверяем день по аналогии 
            const dayMatches = day ? transactionDate.getDate() === day : true;
            
            // возвращаем результат логического AND (если есть хоть один false, то не записываем эту транзакцию через фильтр в filteredTransactions - транзакция исключается из результатов)
            return yearMatches && monthMatches && dayMatches;
        });
    
        // Суммируем транзакции, если они есть
        // метод .reduce аккумулирует значения из массива в одно значение total (сумма транзакций)
        // счетчик задан = 0
        // для каждой порядковой транзакции (transaction) преобразуем строковое значение суммы в число и добавляем к аккумулятору
        return filteredTransactions.reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
    }

    /**
     * Возвращает транзакции указанного типа ("debit" или "credit").
     * 
     * Фильтрует транзакции по типу и возвращает их в удобном формате для вывода.
     * 
     * @param {string} type - Тип транзакции ("debit" или "credit").
     * 
     * @returns {string} Строка, содержащая транзакции указанного типа, разделенные новой строкой.
     */
    getTransactionByType(type) {
        // фильтруем все транзакции на соответсвие указанному типу 
        const transactionsByType = this.transactions.filter(transaction => transaction.transaction_type === type);
        // преобразуем в удобную форму для вывода
        return transactionsByType.map(transaction => transaction.string()).join('\n');
    }

    /**
     * Возвращает транзакции, проведенные в указанном диапазоне дат.
     * 
     * Фильтрует транзакции по дате, проверяя, попадает ли дата транзакции в указанный диапазон от `startDate` до `endDate`.
     * 
     * @param {string} startDate - Дата начала диапазона (в формате строки).
     * @param {string} endDate - Дата конца диапазона (в формате строки).
     * 
     * @returns {string} Строка, содержащая транзакции в указанном диапазоне дат, разделенные новой строкой.
     */
    getTransactionsInDateRange(startDate, endDate) {
        // переводим строковые значения дат в экземпляры Date
        const start = new Date(startDate);
        const end = new Date(endDate);
        // в filteredTransactions записываем результат фильтрации транзакций 
        const filteredTransactions = this.transactions.filter(transaction => {
            // в переменную transactionDate записываем дату очередной транзакции в экземпляры Date
            const transactionDate = new Date(transaction.transaction_date);
            // проверка если дата из транзакции >= start и (логическое AND) <= end
            return transactionDate >= start && transactionDate <= end;
        });
        // преобразуем отфильтрованный массив filteredTransactions в удобную форму для вывода
        return filteredTransactions.map(transaction => transaction.string()).join('\n');
    }

    /**
     * Возвращает транзакции, совершенные с указанным торговым местом или компанией.
     * 
     * Фильтрует транзакции по названию торгового места или компании.
     * 
     * @param {string} merchantName - Название торгового места или компании.
     * 
     * @returns {string} Строка, содержащая транзакции с указанным торговым местом или компанией, разделенные новой строкой.
     */
    getTransactionsByMerchant(merchantName) {
        // в переменную transactionsByMerchant записывается результат фильтрации всех транзакций на соответсвие заначения по свойству .merchant_name переданному значению merchantName
        const transactionsByMerchant = this.transactions.filter(transaction => transaction.merchant_name === merchantName);
        // преобразуем отфильтрованный массив transactionsByMerchant в удобную форму для вывода
        return transactionsByMerchant.map(transaction => transaction.string()).join('\n');
    }

    /**
     * Рассчитывает среднее значение всех транзакций.
     * 
     * Использует метод `calculateTotalAmount()` для вычисления общей суммы транзакций и делит ее на количество транзакций.
     * 
     * @returns {number} Среднее значение всех транзакций, округленное до целого числа.
     */
    calculateAverageTransactionAmount() {
        // вычисляем по методу .calculateTotalAmount() общую сумму всех транзакций 
        const totalAmount = this.calculateTotalAmount();
        // делим на общее число транзакций и округляем до целого
        return Math.round(totalAmount / this.transactions.length);
    }

    /**
     * Возвращает транзакции с суммой в заданном диапазоне от `minAmount` до `maxAmount`.
     * 
     * Фильтрует транзакции по сумме и возвращает подходящие транзакции вместе с общей суммой этих транзакций.
     * 
     * @param {number} minAmount - Минимальная сумма для фильтрации.
     * @param {number} maxAmount - Максимальная сумма для фильтрации.
     * 
     * @returns {string} Строка, содержащая общую сумму и подходящие транзакции в указанном диапазоне.
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        // в переменную filteredTransactions записываем отфильтрованнные данные 
        const filteredTransactions = this.transactions.filter(transaction => {
            // записываем в переменную выручку от одной очередной транзакции
            const transactionAmount = Number(transaction.transaction_amount);
            // возвращаем, если выручка в этой транзакции входит в диапазон 
            return transactionAmount >= minAmount && transactionAmount <= maxAmount;
        });
        // формируем удобный вывод информации
        const transactionsString = filteredTransactions.map(transaction => transaction.string()).join('\n');
        const totalAmount = filteredTransactions.reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
        return `Обыщая сумм подходящих транзакций: ${totalAmount} \n Подходящие транзакции: \n ${transactionsString}`;
    }

    /**
     * Вычисляет общую сумму дебетовых транзакций.
     * 
     * Фильтрует транзакции по типу "debit" и суммирует их значения.
     * 
     * @returns {number} Общая сумма дебетовых транзакций.
     */
    calculateTotalDebitAmount() {
        const totalDebitTransaction = this.transactions.filter(transaction => transaction.transaction_type === "debit");
        const totalDebitAmount = totalDebitTransaction.reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
        return totalDebitAmount;
    }

    /**
     * Возвращает месяц с наибольшим количеством транзакций.
     * 
     * Подсчитывает выручку по месяцам и находит месяц с максимальной выручкой.
     * 
     * @returns {string} Месяц с максимальной выручкой и соответствующая сумма.
     */
    findMostTransactionsMonth() {
        let monthlyRevenue = 0; // Максимальная выручка
        let mostTransactionsMonth = 0; // Месяц с максимальной выручкой
    
        // создаем объект для подсчета выручки по месяцам
        const revenueByMonth = this.transactions.reduce((acc, transaction) => {
            const transactionDate = new Date(transaction.transaction_date);
            const transactionMonth = transactionDate.getMonth() + 1; // получаем месяц (с добавлением 1)
    
            // если такого месяца нет в объекте, инициализируем его значением 0
            if (!acc[transactionMonth]) {
                acc[transactionMonth] = 0;
            }
    
            // добавляем сумму транзакции в соответствующий месяц
            acc[transactionMonth] += transaction.transaction_amount;
    
            return acc;
        }, {});
    
        // Находим месяц с максимальной выручкой
        for (let month = 1; month <= 12; month++) {
            const revenue = revenueByMonth[month] || 0; // если данных для месяца нет, считаем, что выручка равна 0
            if (revenue > monthlyRevenue) {
                monthlyRevenue = revenue;
                mostTransactionsMonth = month;
            }
        }
    
        return `Месяц с максимальной выручкой: ${mostTransactionsMonth}, сумма: ${monthlyRevenue}`;
    }
    
    /**
     * Возвращает месяц, в котором было больше всего дебетовых транзакций.
     * 
     * Подсчитывает количество дебетовых транзакций по месяцам и находит месяц с максимальным их количеством.
     * 
     * @returns {string} Месяц с максимальным количеством дебетовых транзакций и их количество.
     */
    findMostDebitTransactionMonth() {
        let maxDebitCount = 0; // Инициализируем максимальное количество транзакций
        let monthWithMostDebit = 0; // Инициализируем месяц с максимальным количеством транзакций
    
        // Подсчитываем количество транзакций для каждого месяца
        const transactionCountByMonth = this.transactions.reduce((acc, transaction) => {
            const transactionMonth = new Date(transaction.transaction_date).getMonth() + 1; // Месяц
    
            if (transaction.transaction_type === "debit") {
                acc[transactionMonth] = (acc[transactionMonth] || 0) + 1; // Увеличиваем счетчик для месяца
            }
            return acc;
        }, {});
    
        // Поиск месяца с максимальным количеством транзакций
        for (let month = 1; month <= 12; month++) {
            const currentCount = transactionCountByMonth[month] || 0; // Получаем количество транзакций для месяца
            if (currentCount > maxDebitCount) {
                maxDebitCount = currentCount; // Обновляем максимальное количество транзакций
                monthWithMostDebit = month; // Обновляем месяц с максимальным количеством транзакций
            }
        }
    
        // Возвращаем месяц с максимальным количеством транзакций и его количество
        return `Месяц с максимальным количеством debit операций: ${monthWithMostDebit}, их количество: ${maxDebitCount}`;
    }
    
    /**
     * Возвращает тип транзакций, которых больше всего.
     * 
     * Подсчитывает количество транзакций каждого типа ("credit", "debit", "equal") и возвращает тот тип, который встречается чаще.
     * 
     * @returns {string} Тип транзакций, которого больше всего ("credit", "debit" или "equal").
     */
    mostTransactionTypes() {
        let creditTransactions = 0;
        let debitTransactions = 0;
        let equalTransactions = 0;

        for (const transaction of this.transactions) {
            if (transaction.transaction_type === "credit") {
                creditTransactions++;
            } else if (transaction.transaction_type === "debit") {
                debitTransactions++;
            } else if (transaction.transaction_type === "equal") {
                equalTransactions++;
            }
        }
        if (debitTransactions > creditTransactions && debitTransactions > equalTransactions) {
            return "debit";
        } else if (creditTransactions > debitTransactions && creditTransactions > equalTransactions) {
            return "credit";
        } else {
            return "equal";
        }
    }
    
    /**
     * Возвращает транзакции, совершенные до указанной даты.
     * 
     * Фильтрует транзакции по дате, возвращая те, которые были совершены до `date`.
     * 
     * @param {string} date - Дата, до которой нужно вернуть транзакции (в формате строки).
     * 
     * @returns {string} Строка, содержащая транзакции, совершенные до указанной даты, разделенные новой строкой.
     */
    getTransactionsBeforeDate(date) {
        const dateByMethod = new Date(date);
        const filteredTransactions = this.transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate < dateByMethod;
            });
        return filteredTransactions.map(transaction => transaction.string()).join('\n');
    }

    /**
     * Возвращает транзакцию по ее уникальному идентификатору.
     * 
     * Ищет транзакцию с указанным уникальным идентификатором `id` и возвращает ее строковое представление.
     * 
     * @param {string} id - Уникальный идентификатор транзакции.
     * 
     * @returns {string} Строковое представление транзакции с указанным идентификатором.
     */
    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id).string();
    }

    /**
     * Возвращает новый массив, содержащий только описания транзакций.
     * 
     * Преобразует все транзакции в массив строк, содержащих описания каждой транзакции.
     * 
     * @returns {Array<string>} Массив строк, содержащих описания транзакций.
     */
    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }

}

// Импортируем данные из файла 'transaction.json', который содержит массив объектов транзакций
const data = require('./files/transaction.json');

// Создаем новый экземпляр класса TransactionAnalyzer, передавая в конструктор массив данных из файла
const analyzerData = new TransactionAnalyzer(data);

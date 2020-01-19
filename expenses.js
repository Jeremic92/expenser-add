var storage = {
    bank: [],
    addExpense: function (amount, currency, name, category, date, splurge) {
        this.bank.push({
            amount: amount,
            currency: currency,
            name: name,
            category: category, 
            date: date,
            splurge: splurge
        });
    }
};

var expensesStorage = {
    set: function() {
        localStorage.setItem('item', JSON.stringify(storage.bank));
    },
    get: function() {
        return JSON.parse(localStorage.getItem('item'));
    }
};

var handlers = {
    addExpense: function(event) {
        event.preventDefault();
        var amount = document.getElementById('amount');
        amount.focus();
        var currency = document.getElementById('currency');
        var name = document.getElementById('name');
        var category = document.getElementById('category');
        var date = document.getElementById('date');
        var splurge = document.getElementById('splurge');
        storage.addExpense(amount.valueAsNumber, currency.value, name.value, category.value, date.value, splurge.value);
        
        amount.value = '';
        currency.value = '';
        name.value = '';
        category.value ='';
        date.value = '';
        splurge.value = '';

        see.displayExpenses();
    }
};

var see = {
    displayExpenses: function () {
        var costUl = document.querySelector('ul');
        costUl.innerHTML = '';
        storage.bank.forEach(function (expense, index) {
            var costLi = document.createElement('li');
            costLi.id = index;
            costLi.appendChild(this.createCostForm(expense));
            costUl.appendChild(costLi);
        }, this);
        expensesStorage.set();
    },
    
    createCostForm: function (expense) {
        var costForm = document.createElement('form');
        costForm.appendChild(this.createAmountInput(expense.amount));
        costForm.appendChild(this.createCurrencyInput(expense.currency));
        costForm.appendChild(this.createNameInput(expense.name));
        costForm.appendChild(this.createCategoryInput(expense.category));
        costForm.appendChild(this.createDateInput(expense.date));
        costForm.appendChild(this.createRangeInput(expense.splurge));
        costForm.appendChild(this.createDeleteButton());
        costForm.appendChild(this.createEditButton());
        return costForm;
    },
    
    createAmountInput: function (value) {
        var amount = document.createElement('input');
        amount.type = 'number';
        amount.disabled = true;
        amount.name = 'amount';
        amount.value = value;
        return amount;
    },
    
    createCurrencyInput: function (value) {
        var worldCurrency = ['RSD', 'EUR', 'USD', 'CHF', 'GBP', 'SEK', 'AUD'];
        var currency = document.createElement('select');
        for (var i = 0; i < worldCurrency.length; i++) {
            var changeCurrency = document.createElement('option');
            changeCurrency.value = worldCurrency[i];
            changeCurrency.text = worldCurrency[i];
            currency.appendChild(changeCurrency);
        }
        currency.disabled = true;
        currency.name = 'currency';
        currency.value = value;
        return currency;
    },
    
    createNameInput: function (value) {
        var name = document.createElement('input');
        name.type = 'text';
        name.disabled = true;
        name.name = 'name';
        name.value = value;
        return name;
    },
    
    createCategoryInput: function (value) {
        // TODO: add all options
        var options = ['Groceres', 'Rent', 'Bills', 'Clothes', 'Transporation', 'Gift'];
        var category = document.createElement('select');
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement('option');
            option.value = options[i];
            option.text = options[i];
            category.appendChild(option);
        }
        category.disabled = true;
        category.name = 'category';
        category.value = value;
        return category;
    },
    
    createDateInput: function (value) {
        var date = document.createElement('input'); 
        date.type = 'date';
        date.disabled = true;
        date.name = 'date';
        date.value = value;
        return date;   
    },

    createRangeInput: function (value) {
        var splurge = document.createElement('input');
        splurge.type = 'range';
        splurge.disabled = true;
        splurge.value = value;
        splurge.name = 'splurge';
        return splurge;
    },
     
    createDeleteButton: function () {
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.type = 'button';
        deleteButton.addEventListener('click', function(event) {
            var liId = event.target.parentElement.parentElement.id;
            // event.target.closest('li').id;
            storage.bank.splice(liId, 1);
            see.displayExpenses();
        });
        return deleteButton;
    },
    
    createEditButton: function () {
        var button = document.createElement('button');
        button.textContent = 'Edit';
        button.className = 'editButton';
        button.type = 'button';
        button.addEventListener('click', function(event) {
            handleEditButton(event);
        });
        return button;
    },
    
    createSaveButton: function () {
        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'saveButton';
        saveButton.type = 'button';
        saveButton.addEventListener('click', function(event) {
            handleSaveButton(event);
        });
        return saveButton;  
    },

    createExpensesDay: function () {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var dayIndex = document.getElementById('choseDay').value;
        document.getElementById('day').textContent = this.getSelectedExpenseCategory(days, 'choseDay');
        document.getElementById('sum').textContent = this.getSumOfThatDay(dayIndex);
        document.getElementById('percentDay').textContent = this.getPersentageOfThatDay(days, dayIndex);
    },

    getSumOfThatDay: function (dayIndex) {
        var expensesOnThatDay = storage.bank.filter(function (expense) {
            if (parseInt(dayIndex) === new Date(expense.date).getDay()) {
                return true;
            }
        });
        var amountOnThatDay = expensesOnThatDay.map(function (expense) {
            return expense.amount;
        });
        var sum = amountOnThatDay.reduce(function (current, next) {
            return current += next;
        }, 0);
        return sum;
    },

    getPersentageOfThatDay: function (days, dayIndex) {
        debugger;
        var expensesForAllDay = storage.bank.filter(function () {
            if(days) {
                return true;
            }
        });
        var amountForAllDays = expensesForAllDay.map(function (expense) {
            return expense.amount;
        });
        var sumForAllDays = amountForAllDays.reduce(function (current, next) {
            return current += next;
        });
        var percentForSumThatDay = ((this.getSumOfThatDay(dayIndex) / sumForAllDays) * 100).toFixed(2);
        return percentForSumThatDay;
    },

    populateExpneseMonthLabels: function () {
        var months = ['January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'Octobre', 'November', 'Desember'];
        var selectedMonth = this.getSelectedExpenseMonths(months);
        var selectedMonthId = this.getSelectedExpenseMonthsId(selectedMonthId);
        document.getElementById('month').textContent = selectedMonth;
        document.getElementById('total').textContent = this.getSumOfAllExpenseMonthAmounts(selectedMonthId);
        document.getElementById('percentMonth').textContent = this.createPercentOfMonths(selectedMonthId);
    },  
    
    getSelectedExpenseMonths: function (months) {
        var selectedMonth = document.getElementById('choseMonth').value;
        return months[selectedMonth];
    },   
    
    getSelectedExpenseMonthsId: function (selectedMonthId) {
        var selectedMonthId = parseInt(document.getElementById('choseMonth').value);
         return selectedMonthId;
    },

    getSumOfAllExpenseMonthAmounts: function (selectedMonthId) {
        var expensesOnThatMonth = storage.bank.filter(function (expense) {
            if(selectedMonthId === new Date(expense.date).getMonth()) {
                return true;
            };
        });
        var amountOnThatMonth = expensesOnThatMonth.map(function (expense) {
            return expense.amount;
        });
        var sumOfAllAmounts = amountOnThatMonth.reduce(function (current, next) {
            return current += next;
        }, 0);
        return sumOfAllAmounts;
    },  

    createPercentOfMonths: function (selectedMonthId) {
        var sumOfAllAmounts = this.getSumOfAllExpenseMonthAmounts(selectedMonthId);
        var expenseOfAllMonth = storage.bank.filter(function () {  
            if(month) {
                return true;
            }
        });
        var amountOfAllMonths = expenseOfAllMonth.map(function (expense) {
            return expense.amount;
        });
        var sumOfAllMonths = amountOfAllMonths.reduce(function (current, next) {
            return current += next;
        });
        var percentOfAllThatMonth = ((sumOfAllAmounts / sumOfAllMonths) * 100).toFixed(2);
        return percentOfAllThatMonth;
    }, 

    populateExpenseCategoryLabels: function () {
        var categories = ['Groceres', 'Rent', 'Bills', 'Clothes', 'Transporation', 'Gift']; // van funkcije
        var selectedCategory = this.getSelectedExpenseCategory(categories, 'choseCategory');
        document.getElementById('categories').textContent = selectedCategory;
        document.getElementById('all').textContent = this.getSumOfAllExpenseCategoryAmounts(selectedCategory);
        document.getElementById('percentCategory').textContent = this.createPercentOfCategories(selectedCategory);
    },

    getSelectedExpenseCategory: function (categories, id) {
        var selectedCategoryId = parseInt(document.getElementById(id).value);
        return categories[selectedCategoryId];
    },

    getSumOfAllExpenseCategoryAmounts: function (selectedCategory) {
        var expensesOnThatCategory = storage.bank.filter(function (expense) {
            if(selectedCategory === expense.category) { /* selectedCategory sam definisao u 243 i ta variabal se odnosi na niz categories, 
                                                            a expnese.categori nam se odnosi na metodu createCategoryInput (red 95), ovo je false???
                                                            takodje zasto prolazi vise puta kroz if petlju kad je pri drugom vec true? Zato sto imamo
                                                            vise unetih expenses-a. A drugi i treci put nam je true jer imamo
                                                            2 polja u kojima je izabrana isti category.
                                                            Ovo je primer za 3 ista category-a
                                                        */
                return true;   
            }
        });

        var amountOnThatCategory = expensesOnThatCategory.map(function (expense) {
            return expense.amount;
        });

        var sumOfAllAmounts = amountOnThatCategory.reduce(function (current, next) {
            return current += next;
        }, 0);

        return sumOfAllAmounts;
    },

    createPercentOfCategories: function (selectedCategory) {
        var sumOfAllAmounts = this.getSumOfAllExpenseCategoryAmounts(selectedCategory);
        var expensesOfAllCategories = storage.bank.filter(function () {
            if(categories) { // categories is span element in html > that not good
                return true;
            }
        });
        var amountOfAllCategories = expensesOfAllCategories.map(function (expense) {
            return expense.amount;
        });
        var sumOfAllCategories = amountOfAllCategories.reduce(function (current, next) {
            return current += next;
        });
        var percentOfAllThatCategories = ((sumOfAllAmounts / sumOfAllCategories) * 100).toFixed(2);
        return percentOfAllThatCategories;
    },
};

function handleEditButton (event) {
    event.target.parentElement.querySelectorAll('input, select').forEach(function(element) {
        element.disabled = false;
        // TODO: the first input in the form should be focused, not the last
    });
    event.target.parentElement.elements[0].focus(); //the line as same as line 159
    // document.forms[index + 1].elements[0].focus();
    event.target.parentElement.appendChild(see.createSaveButton());
    event.target.remove();
}; 

function handleSaveButton (event) {
    var position = parseInt(event.target.parentElement.parentElement.id);
    // var position = parseInt(event.target.closest('li').id);
    var liExpense = storage.bank[position];
    event.target.parentElement.querySelectorAll('input, select').forEach(function(element) {
        if (element.name === 'amount') {
            liExpense[element.name] = element.valueAsNumber;
        } else {
            liExpense[element.name] = element.value;
        }
    });
    see.displayExpenses();
    event.target.parentElement.appendChild(see.createEditButton());
    event.target.remove();
}
storage.bank = expensesStorage.get() || [];
see.displayExpenses();


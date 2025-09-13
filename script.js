let balance = document.getElementById("balance");
let income = document.getElementById("incomeInput");
let expense = document.getElementById("expenseInput");
let incomeDescription = document.getElementById("incomeDescription");
let expenseDescription = document.getElementById("expenseDescription");
let transactionList = document.getElementById("transactionList");
let currentBalance = 0;

// Track totals
let totalIncome = 0;
let totalExpense = 0;

// Formatter for Philippine Peso
const peso = new Intl.NumberFormat("fil-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

// Load Data on page Start
window.onload = function () {
  // load balance if saved
  if (localStorage.getItem("currentBalance")) {
    currentBalance = parseFloat(localStorage.getItem("currentBalance"));
  }

  // load total income if saved
  if (localStorage.getItem("totalIncome")) {
    totalIncome = parseFloat(localStorage.getItem("totalIncome"));
  }

  // load total expense if saved
  if (localStorage.getItem("totalExpense")) {
    totalExpense = parseFloat(localStorage.getItem("totalExpense"));
  }

  // load transaction history (array of objects)
  let savedTransactions = JSON.parse(localStorage.getItem("transactions"));
  savedTransactions.forEach((t) => {
    let li = document.createElement("li");
    li.textContent = t.text;
    li.style.color = t.color;
    transactionList.appendChild(li);
  });

  updateChart();
};

// Chart.js setup
const ctx = document.getElementById("financeChart").getContext("2d");
const financeChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Finance Overview",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4caf50", "#f44336"], // green, red
      },
    ],
  },
});

// Function to update chart whenever data changes
function updateChart() {
  financeChart.data.datasets[0].data = [totalIncome, totalExpense];
  financeChart.update();
}

// Save Data to LocalStorage
function saveData() {
  // Save balance, income, and expense
  localStorage.setItem("currentBalance", currentBalance);
  localStorage.setItem("totalIncome", totalIncome);
  localStorage.setItem("totalExpense", totalExpense);

  // save all transactions (loop through list items and store them)
  let allTransactions = [];
  document.querySelectorAll("#transactionList li").forEach((li) => {
    allTransactions.push({
      text: li.textContent,
      color: li.style.color,
    });
  });

  localStorage.setItem("transactions", JSON.stringify(allTransactions));
}

// Add income
document.getElementById("addIncome").addEventListener("click", function () {
  // only accept valid numbers
  let incomeValue = parseFloat(income.value);
  if (!isNaN(incomeValue) && incomeValue > 0) {
    currentBalance += incomeValue; // update balance
    balance.textContent = peso.format(currentBalance); // show formatted

    totalIncome += incomeValue; // add to total income
    updateChart(); // refresh chart

    // add new transaction item
    let li = document.createElement("li");
    li.textContent = incomeDescription.value + ": +" + incomeValue;
    li.style.color = "green";
    transactionList.appendChild(li);

    // clear inputs
    income.value = "";
    incomeDescription.value = "";

    saveData(); // saved to local storage
  }
});

// Add expenses
document.getElementById("addExpense").addEventListener("click", function () {
  let expenseValue = parseFloat(expense.value);
  if (!isNaN(expenseValue) && expenseValue > 0) {
    currentBalance -= expenseValue; // decrease balance
    balance.textContent = peso.format(currentBalance);

    totalExpense += expenseValue; // add to total expense
    updateChart(); // refresh chart

    // add new transaction item
    let li = document.createElement("li");
    li.textContent = expenseDescription.value + ": -" + expenseValue;
    li.style.color = "red";
    transactionList.appendChild(li);

    // clear inputs
    expense.value = "";
    expenseDescription.value = "";

    saveData();
  }
});

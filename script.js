const spentType = {
  EXPENSE: 1,  
  INCOME: 2
    
}

let nowDate = new Date().toISOString().split("T")[0];

// Main sheet code

function Amounts(){let income = 0;
  let expense = 0;
  getData()
    .filter((iteam) => iteam.amountType === "2")
    .forEach((iteam) => {
      income += iteam.productOrServiceAmount;
    });

  getData()
    .filter((iteam) => iteam.amountType === "1")
    .forEach((iteam) => {
      expense += iteam.productOrServiceAmount;
    });

  document.querySelector(".expenseAmount").textContent = expense;
  document.querySelector(".incomeAmount").textContent = income;
  document.querySelector(".totalAmount").textContent = (income-expense);
}



// TButton code 
let allbutton = document.getElementById('allBtn');
let incomebutton = document.getElementById("incomeBtn");
let expensebutton = document.getElementById("expenseBtn");



document.getElementById('TBtnContainer').addEventListener('click', function(event){
     
      [allbutton, incomebutton, expensebutton].forEach((btn) => {
        if (event.target === btn) {
          btn.classList.add("filterBtnCol");
        } else {
          btn.classList.remove("filterBtnCol");
        }
      });
     
      let selectedButton = event.target.getAttribute("data-transaction-type");
      if(selectedButton === "0"){
        renderData(getData());
      }else{
        let data = getData().filter(
          (iteam) => iteam.amountType === selectedButton,
        );
        renderData(data);
      }
      

});

// FORM CODE 



let form = document.getElementById("formContainer")
let overlay = document.getElementById("overlay")
const addBtn = document.getElementById('addButton')
addBtn.addEventListener('click', function(){
    form.classList.remove("hidden");
    overlay.classList.remove('hidden')
    
})

document.getElementById('cancleBtn').addEventListener('click', function(){
    form.classList.add("hidden");
    overlay.classList.add('hidden')
})

overlay.addEventListener('click',function(){
    form.classList.add("hidden");
    overlay.classList.add("hidden");
})

//Form data code
         /// Expense button
let amountTypeB = document.getElementById("amountTypeBtn");
const typeSelectorBtn = document.querySelector('.typeSelector')
let amount_Type = 1;

// console.log(typeSelectorBtn)

amountTypeB.addEventListener("click", function() {
  if (amountTypeB.textContent.trim() === "−Expense") {
    amountTypeB.textContent = "+Income";
    amount_Type = spentType.INCOME;
    typeSelectorBtn.setAttribute('disabled', 'true')
  } else {
    amountTypeB.textContent = "−Expense";
    amount_Type = spentType.EXPENSE;
    typeSelectorBtn.removeAttribute("disabled");
  }

  amountTypeB.classList.toggle("amountTypeCol");
});


// Local storage
const addForm = document.querySelector('.addForm')

function saveData(arr) {
  localStorage.setItem("spendList", JSON.stringify(arr));
}
function getData() {
  return JSON.parse(localStorage.getItem("spendList")) || [];
}
let data = getData();

addForm.addEventListener('submit', function(event){
  event.preventDefault()

  const FD = new FormData(addForm)

  FD.append("amountType", amount_Type);
  FD.append("id", Date.now());

  const obj = Object.fromEntries(FD.entries());
  obj.productOrServiceAmount = Number(obj.productOrServiceAmount);

  data.push(obj);
  saveData(data);

  addForm.reset() ;   
  document.querySelector(".dateFeild").value = nowDate;
  renderData(getData());
  Amounts();
  
})



// rendering data
const mainListContainer = document.getElementById("transactionList");
renderData(getData());
Amounts();
function renderData(data){
  let html = "";

  let transIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
 
  data.forEach( function(element){
    
    if (element.amountType === "1") {
      html += `
      <li id='${element.id}' class="transaction expense">
        <span>${element.date}</span>
        <span>${element.type}</span>
        <span>${element.iteam_Descripction == "" ? null : element.iteam_Descripction}</span>
        <span>${element.productOrServiceAmount}</span>
        <button class="TransBtn">${transIcon}</button>
      </li>
    `;
    } else {
      html += `
      <li id='${element.id}' class="transaction income">
        <span>${element.date}</span>
        <span>${element.type ?? null}</span>
        <span>${element.iteam_Descripction == "" ? null : element.iteam_Descripction}</span>
        <span>${element.productOrServiceAmount}</span>
        <button class="TransBtn">${transIcon}</button>
      </li>
    `;
    }
    
  })
  mainListContainer.innerHTML = html;
} 

// Deleting data

mainListContainer.addEventListener('click', function(event){
  const Btn = event.target.closest(".TransBtn");
  if(!Btn) return;

  const li = Btn.closest("li")
  if(!li) return;
  const ListId = li.id ;

  const index = getData().findIndex( (iteam) => iteam.id === ListId )
  
  data.splice(index, 1);
  saveData(data);
  li.remove();

  Amounts()
})










const anchorlink = document.querySelectorAll(".a-link");
const sections = document.querySelectorAll(".section");

const formOne = document.getElementById("formone");

const productName = document.getElementById("productName");
const price = document.getElementById("price");
const stock = document.getElementById("stock");

const formTwo = document.getElementById("formtwo");

const customerName = document.getElementById("customerName");
const address = document.getElementById("address");
const email = document.getElementById("email");

const gotoCartBtn = document.querySelector(".gotoCartBtn");

const cart = document.querySelector(".cart");

const selectCustomer = document.querySelector(".select-form-customer");

const cartItems = document.querySelector(".cartItems");

const totalUpdatedAmount = document.querySelector(".totalAmount");

const goToBillBtn = document.querySelector(".goToBillBtn");

const billContent = document.querySelector(".bill-content");

let productsArray = [];

let customersArray = [];

let purchaseDetails = [];

let totalCost = [];

function storeProductsData() {
  let prodName = productName.value;
  let totalstock = stock.value;
  let fullprice = price.value;

  let products = {
    name: prodName,
    price: totalstock,
    stock: fullprice,
  };
  productsArray.push(products);

  localStorage.setItem("productsData", JSON.stringify(productsArray));
}

function fetchdata() {
  if (localStorage.getItem("productsData")) {
    productsArray = JSON.parse(localStorage.getItem("productsData"));
  }

  if (localStorage.getItem("customersData")) {
    customersArray = JSON.parse(localStorage.getItem("customersData"));
  }
}

function storeCustomersDate() {
  let custName = customerName.value;
  let adrs = address.value;
  let emailId = email.value;

  let customers = {
    customerName: custName,
    address: adrs,
    email: emailId,
  };

  customersArray.push(customers);

  localStorage.setItem("customersData", JSON.stringify(customersArray));

  formOne.reset();
}

function processProductsData(e) {
  e.preventDefault();

  storeProductsData();

  formOne.reset();
}

function processCustomersData(e) {
  e.preventDefault();

  ValidateEmail();
}

// Event Listener
formOne.addEventListener("submit", processProductsData);

formTwo.addEventListener("submit", processCustomersData);

anchorlink.forEach((link, index) => {
  link.addEventListener("click", () => {
    removeactivepage();
    removehighlight();
    sections[index].classList.add("active-page");
    anchorlink[index].classList.add("highlight");
  });
});

function removeactivepage() {
  sections.forEach((section) => {
    section.classList.remove("active-page");
  });
}

function removehighlight() {
  anchorlink.forEach((link) => {
    link.classList.remove("highlight");
  });
}

function moveToCart() {
  removeactivepage();
  sections[1].classList.add("active-page");
  removehighlight();
  anchorlink[1].classList.add("highlight");
}

function populateCart() {
  const select = document.createElement("select");
  select.classList.add("select-customer");
  customersArray.forEach((cust) => {
    const option = document.createElement("option");
    option.setAttribute("value", `${cust.customerName}`);

    option.innerText = cust.customerName;

    select.appendChild(option);
  });
  selectCustomer.appendChild(select);
}

// populate cart item

let cartItem;

let productNumbers;

let selectProdForm;

function populateCartItem() {
  cartItem = document.createElement("div");
  cartItem.classList.add("cartItem");

  selectProdForm = document.createElement("form");
  selectProdForm.classList.add("select-form-prod");

  const prodoption = document.createElement("select");

  prodoption.classList.add("select-product");

  productsArray.forEach((prod) => {
    const option = document.createElement("option");
    option.setAttribute("value", `${prod.name}`);

    option.innerText = prod.name;

    prodoption.appendChild(option);
  });

  selectProdForm.appendChild(prodoption);
  cartItem.appendChild(selectProdForm);
  cartItems.appendChild(cartItem);

  productNumbers = document.createElement("div");

  productNumbers.classList.add("productNumber");

  selectClick();
}

function fillDetails(SelectedproductName, itemIdx) {
  let choosenProduct = SelectedproductName;

  const found = productsArray.find((prod) => prod.name == choosenProduct);

  cartItems.children[itemIdx].appendChild(productNumbers);
  productNumbers.innerHTML = "";

  let prodPrice = document.createElement("p");
  prodPrice.innerText = found.price;
  productNumbers.appendChild(prodPrice);

  let prodStock = document.createElement("p");
  prodStock.innerText = found.stock;
  productNumbers.appendChild(prodStock);

  let quantity = document.createElement("input");
  quantity.setAttribute("type", "number");
  quantity.classList.add("qtyInput");
  productNumbers.appendChild(quantity);

  let amount = document.createElement("p");
  productNumbers.appendChild(amount);
  amount.classList.add("individualAmount");

  let totalamount;
  let totalQty;

  let qtyInputs = document.querySelectorAll(".qtyInput");

  qtyInputs.forEach((qtyInput, idx) => {
    qtyInput.addEventListener("input", (e) => {
      totalQty = e.target.value;
      totalamount = `${totalQty * prodPrice.innerText}`;
      amount.innerText = totalamount;

      console.log(idx, e, totalQty, prodPrice.innerText);

      PurchaseDetailsArrayUpdate();
    });
  });
}

function updateTotalAmount(money) {
  totalCost.push(money);
}

function PurchaseDetailsArrayUpdate() {
  const individualAmounts = document.querySelectorAll(".individualAmount");

  let allAmounts = [];
  individualAmounts.forEach((amount) => {
    allAmounts.push(+amount.innerText);
  });

  let sum = allAmounts.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  totalUpdatedAmount.innerText = `${sum}`;
}

gotoCartBtn.addEventListener("click", moveToCart);

fetchdata();

if (customersArray.length > 0) {
  populateCart();
}

const addProductBtn = document.querySelector(".add-product-btn");

addProductBtn.addEventListener("click", () => {
  if (productsArray.length > 0) {
    populateCartItem();
  } else {
    alert(
      "you have not entered products in main page form, so your products list is empty"
    );
  }
});

function selectClick() {
  if (cartItems.children.length == 1) {
    const selectformprod = document.querySelector(".select-form-prod");

    selectformprod.addEventListener("click", (e) => {
      let SelectedproductName = e.target.value;
      localStorage.setItem("SelectedproductName", SelectedproductName);

      fillDetails(SelectedproductName, 0);
    });
  }

  if (cartItems.children.length > 1) {
    const selectformprod = document.querySelectorAll(".select-form-prod");

    selectformprod.forEach((formProd, idx) => {
      formProd.addEventListener("change", (e) => {
        let SelectedproductName = e.target.value;
        localStorage.setItem("SelectedproductName", SelectedproductName);
        fillDetails(SelectedproductName, idx);
      });
    });
  }
}

// ------------bill-----------

function fillBillData() {
  if (customersArray.length > 0) {
    const selectedCustomer = document.querySelector(".select-customer");
    let customerFullName = selectedCustomer.value;
  }

  const selectedProducts = document.querySelectorAll(".select-product");

  let productNames = [];
  selectedProducts.forEach((prod, idx) => {
    productNames.push(prod.value);
  });

  function removeDuplicates(productNames) {
    return productNames.filter(
      (item, index) => productNames.indexOf(item) === index
    );
  }

  let sortedArr = removeDuplicates(productNames);

  if (customersArray.length > 0) {
    billContent.innerHTML = `
    <p>Customer Name : ${customerFullName}</p>
    <p>Products Purchased: ${sortedArr}</p>
    <p>Total Amount :${totalUpdatedAmount.innerText}</p>
    `;
  } else {
    billContent.innerHTML = `
    <p>Products Purchased: ${sortedArr}</p>
    <p>Total Amount :${totalUpdatedAmount.innerText}</p>
    `;
  }
}

function moveToBill() {
  removeactivepage();
  sections[2].classList.add("active-page");
  removehighlight();
  anchorlink[2].classList.add("highlight");

  if (cartItems.children.length > 0) {
    fillBillData();
  }
}

goToBillBtn.addEventListener("click", moveToBill);

function ValidateEmail() {
  let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.value.match(mailFormat)) {
    storeCustomersDate();
    formTwo.reset();
  } else {
    alert("You have entered an invalid email address!");
  }
}

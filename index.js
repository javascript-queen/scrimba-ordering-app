/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable dot-notation */
// https://github.com/elkinsd96/Restaurant-Ordering-App-Scrimba/blob/main/index.js
import { menuArray, orderArray } from './data.js';

function getFeedHtml() {
  let feedHtml = '';
  menuArray.forEach((item) => {
    feedHtml += `
    <div  class="menu">
      <img class="item-icon" src="${item.image}">
      <div class="item-info">
        <h2 class="item-title">${item.name}</h2>
        <p class="item-ingredients">${item.ingredients.join(', ')}</p>
        <p class="item-price">¥${item.price}</p>
      </div>
      <button class="add-button" data-add="${item.id}">+</button>
    </div>
  `;
  });
  return feedHtml;
}

// render the order structure without items (otherwise you'll be repeating them)

function getOrderHtml() {
  let orderCheckout = '';
  orderCheckout
  += `
  <div id="order" class="hidden">
    <h2>Your order</h2>
  </div>
  `;
  orderArray.forEach((orderItem) => {
    orderCheckout
    += `
    <div class="order-item">
      <p>${orderItem.name}</p>
      <p id="remove" data-remove="${orderItem.id}">remove</p>
      <p>(x${orderItem.amount})</p>
      <p>¥${orderItem.price * orderItem.amount}</p>
    </div>
  `;
  });

  orderCheckout += `
  <div class="hidden" id="total">
      <h2>Total price:</h2>
      <p>¥${getTotal()}</p>
      <button class="order-button" data-order="order">Ready!</button>
  </div>
  `;
  return orderCheckout;
}

function render() {
  document.getElementById('menu-items').innerHTML = getFeedHtml();
  document.getElementById('order-checkout').innerHTML = getOrderHtml();
  if (orderArray.length > 0) {
    toggleOrder();
  }
}

document.addEventListener('click', (event) => {
  // Add item to a cart
  if (event.target.dataset.add) {
    addItem(event.target.dataset.add);
  } else if (event.target.dataset.remove) {
    removeItem(event.target.dataset.remove);
  } else if (event.target.dataset.order) {
    toggleOrderForm();
    toggleButtons(true);
  } else if (event.target.dataset.close) {
    toggleOrderForm(false);
  }
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  toggleOrderForm();
  getOrderConfirmHTML();
});

// Add item to a cart function
function addItem(itemId) {
  menuArray.forEach((item) => {
    if (item.id == itemId) {
      if (isItemInOrder(orderArray, itemId) == true) {
        addItemAmount(itemId);
      } else {
        orderArray.push(item);
        orderArray.forEach((orderItem) => {
          if (orderItem.id == itemId) {
            orderItem['amount'] = 0;
          }
        });
        addItemAmount(itemId);
      }
    }
  });
  render();
}

// remove item from order

function removeItem(itemId) {
  orderArray.forEach((orderItem) => {
    if (orderItem.id == itemId) {
      if (orderItem.amount > 1) {
        decreaseItemAmount(itemId);
      } else {
        decreaseItemAmount(itemId);
        const index = orderArray.indexOf(orderItem);
        orderArray.splice(index, 1);
      }
    }
  });
  if (orderArray.length == 0) {
    toggleOrder();
  }
  render();
}

// Checks if an item has been already added to the order

function isItemInOrder(itemsArray, itemId) {
  let isTrue = false;
  if (itemsArray != null) {
    itemsArray.forEach((orderItem) => {
      if (orderItem.id == itemId) {
        isTrue = true;
      }
    });
  }
  return isTrue;
}

// Increases item amount in the order
function addItemAmount(itemId) {
  orderArray.forEach((orderItem) => {
    if (orderItem.id == itemId) {
      orderItem.amount += 1;
    }
  });
}

function decreaseItemAmount(itemId) {
  orderArray.forEach((orderItem) => {
    if (orderItem.id == itemId) {
      orderItem.amount -= 1;
    }
  });
}

function getTotal() {
  let total = 0;
  orderArray.forEach((orderItem) => {
    total += orderItem.price * orderItem.amount;
  });
  return total;
}

function toggleOrder() {
  document.getElementById('order').classList.toggle('hidden');
  document.getElementById('total').classList.toggle('hidden');
}

function toggleOrderForm() {
  document.getElementById('payment-form').classList.toggle('hidden');
}

// Enables and disables buttons
function toggleButtons(bool) {
  const addBtn = document.querySelector('.add-button');
  const orderBtn = document.querySelector('.order-button');
  if (bool == true) {
    addBtn.disabled = true;
    orderBtn.disabled = true;
  } else {
    addBtn.disabled = false;
    orderBtn.disabled = false;
  }
}

function getOrderConfirmHTML() {
  const orderConfirmHTML = document.getElementById('order-checkout');
  orderConfirmHTML.innerHTML = `
      <div class="order-confirm-box">
          <div class="order-confirm">
              <p class="order-confirm-text">Thanks, ${document.getElementById('name').value}! We're working on your tea!</p>
          </div>
      </div>
      `;
  return orderConfirmHTML;
}

render();

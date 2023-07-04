// import setStore from "./localStorage.js";
// import { getStore } from "./localStorage.js";
const listData = [
  {
    id: 1,
    name: "Nike Air Force Mid 07",
    price: 1200,
    num: 10,
    image: "./asset/img/anh1.jpg",
  },
  {
    id: 2,
    name: "Nike Air Force Mid 08",
    price: 1500,
    num: 10,
    image: "./asset/img/anh2.jpg",
  },
  {
    id: 3,
    name: "Nike Air Force Mid 09",
    price: 2000,
    num: 10,
    image: "./asset/img/anh3.jpg",
  },
  {
    id: 4,
    name: "Nike Air Force Mid 10",
    price: 1900,
    num: 10,
    image: "./asset/img/anh4.jpg",
  },
  {
    id: 5,
    name: "Nike Air Force Mid 11",
    price: 2200,
    num: 10,
    image: "./asset/img/anh5.jpg",
  },
  {
    id: 6,
    name: "Nike Air Force Mid 12",
    price: 1350,
    num: 10,
    image: "./asset/img/anh6.jpg",
  },
  {
    id: 7,
    name: "Nike Air Force Mid 13",
    price: 2300,
    num: 10,
    image: "./asset/img/anh7.jpg",
  },
  {
    id: 8,
    name: "Nike Air Force Mid 14",
    price: 1280,
    num: 10,
    image: "./asset/img/anh6.jpg",
  },
];
const data = getStore(keyLocalStorageListSP);

if (!data.length) {
  setStore(keyLocalStorageListSP, listData);
}

// setStore(keyLocalStorageListSP, listData);
// console.log(typeof localStorage.getItem(keyLocalStorageListSP));

function renderListSp() {
  let html = "";

  data.forEach(
    (item) =>
      (html += `
        <div class="product-item">
            <img src=${item.image} >
            <h3 class="product--name">${item.name}</h3>
            <div class="product--footer">
                <p class="product-price">$${item.price}</p>
                <p class="product-num">Quantity: ${item.num}</p>
            </div>
            <button onclick="addToCart(${item.id}, ${item.num})"  class="addcart" ><i class="fa-solid fa-cart-plus"></i></button>
        </div>        
        `)
  );
  document.querySelector(".list-product").innerHTML = html;
}
renderListSp();

// Bài 4: Thêm sản phẩm vào giỏ hàng

let cartData = [];
// console.log(cartData);
function addToCart(id, num) {
  const elementNoti = document.querySelector(".noti-addSP");
  const elementNotiFail = document.querySelector(".noti-addSP-fail");

  const itemCart = {
    idSp: id,
    soluong: 1,
  };

  const cartData = localStorage.getItem(keyLocalStorageItemCart);
  console.log(cartData);

  if (typeof cartData === "string") {
    const parsedCartData = JSON.parse(cartData);

    const existingItem = parsedCartData.find((item) => item.idSp === id);

    if (existingItem && existingItem.soluong < num) {
      existingItem.soluong += 1;
      elementNoti.style.display = "block";
      setTimeout(() => {
        elementNoti.style.display = "none";
      }, 1000);
    }
    if (existingItem && existingItem.soluong >= num) {
      elementNotiFail.style.display = "block";
      setTimeout(() => {
        elementNotiFail.style.display = "none";
      }, 1000);
    }
    if (!existingItem) {
      parsedCartData.push(itemCart);
      elementNoti.style.display = "block";
      setTimeout(() => {
        elementNoti.style.display = "none";
      }, 1000);
    }
    setStore(keyLocalStorageItemCart, parsedCartData);
  } else {
    localStorage.setItem(keyLocalStorageItemCart, JSON.stringify([itemCart]));
  }
  loadcart();
}

//show số lượng giỏ hàng
function loadcart() {
  const listItemCart = JSON.parse(
    localStorage.getItem(keyLocalStorageItemCart)
  );
  console.log(listItemCart);
  if (listItemCart != null) {
    const numItems = listItemCart.length;
    document.querySelector(".num").innerHTML = numItems;
  }
}
loadcart();

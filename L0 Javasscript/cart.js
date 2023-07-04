// Bài 5,6

let listItemCart = JSON.parse(localStorage.getItem(keyLocalStorageItemCart));
console.log(listItemCart);
let listSanPham = JSON.parse(localStorage.getItem(keyLocalStorageListSP));
console.log(listSanPham);
renderListItemCart(listItemCart, listSanPham);

function renderListItemCart(listItemCart, listSanPham) {
  const tableCart = document.querySelector(".carts ");
  let html = "";
  if (listItemCart) {
    if (listItemCart.length === 0) {
      tableCart.innerHTML = `
      <img class="cart-empty" src="./asset/img/empty-cart1.jpg" >
      <button class="cart-back"> <i class="fa-solid fa-arrow-left"></i> <a href="./index.html">Back to Shopping</a></button>
  
      `;
    } else {
      let totalCart = 0;

      listItemCart.forEach((item) => {
        let isExist = listSanPham.find((sanpham) => sanpham.id == item.idSp);

        const tt = item.soluong * isExist.price;
        totalCart += tt;

        if (isExist) {
          html += `
          <tr>
            <td class="cart-img">
                <img  src=${isExist.image} >
                <div class="cart-name">
                    <h3>${isExist.name}</h3>
                    <p>Quantity: ${isExist.num}</p>
                </div>
            </td>
            <td class="cart-num">
                <span onclick="decrement(${isExist.id})">-</span>
                <span>${item.soluong}</span>
                <span onclick="increment(${isExist.id},${isExist.num})">+</span>
            </td>
            <td>$${isExist.price}</td>
            <td>$${tt}</td>
            <td><span onclick="deleteItem(${isExist.id})"><i class="fa-regular fa-circle-xmark"></i></span></td>
        </tr>
          `;
        }
      });
      document.querySelector("#rendercart").innerHTML = html;
      document.querySelector(".cart-total").innerHTML = "Total: $ " + totalCart;
    }
  } else {
    tableCart.innerHTML = `
      <img class="cart-empty" src="./asset/img/empty-cart1.jpg" >
      <button class="cart-back"> <i class="fa-solid fa-arrow-left"></i> <a href="./index.html">Back to Shopping</a></button>
  
      `;
  }
}

function updateLocal() {
  setStore(keyLocalStorageItemCart, listItemCart);
  renderListItemCart(listItemCart, listSanPham);
}
function increment(id, num) {
  let exitsItem = listItemCart.find((item) => item.idSp === id);
  console.log(exitsItem);
  if (exitsItem.soluong < num) {
    exitsItem.soluong++;
    // exitsItem.price += price;
  } else {
    alert(
      "Hiện tại mặt hàng này tại của hàng chỉ có " +
        num +
        " sản phẩm. Quý khách không thể đặt thêm"
    );
  }
  updateLocal();
}

function decrement(id) {
  let exitsItem = listItemCart.find((item) => item.idSp === id);

  if (exitsItem.soluong <= 1) {
    if (confirm("bạn có muốn xõa sản phẩm này khỏi giỏ hàng ko?")) {
      exitsItem.soluong--;
      console.log(exitsItem);
      listItemCart = listItemCart.filter((item) => item.soluong > 0);
    }
  } else {
    exitsItem.soluong--;
  }
  updateLocal();
}
function deleteItem(id) {
  if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng ko?")) {
    listItemCart = listItemCart.filter((item) => item.idSp !== id);
    updateLocal();
    loadcart();
  }
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

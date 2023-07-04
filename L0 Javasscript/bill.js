billApi
  .getBill("http://localhost:3000/bill")
  .then((data) => {
    renderData(data);
    return data.map((item) => item.detail);
  })
  .then((data) => {
    data.forEach((item, index) => {
      let html = "";
      item.forEach((renderItem) => {
        let { id, image, name, price, soluong, total } = renderItem;
        html += `
            <div class="rows infor-product" data-id= ${id}>
                <span class="thumbnail grid-2">
                    <img src="${image}" alt="shoes"/>
                </span>
                <span class="name-product grid-4">${name}</span>
                <span class="unit-price text-right grid-2">${price}</span>
                <span class="amount text-right grid-2">${soluong}</span>
                <span class="total text-right grid-2">${total}</span>
            </div>`;
      });
      document.querySelectorAll(".list-product-content")[index].innerHTML =
        html;
    });
    let details = document.querySelectorAll(".detail");
    details.forEach(
      (item) =>
        (item.onclick = () => {
          item.querySelector(".list-products").classList.toggle("active");
          item.querySelector(".up").classList.toggle("active");
          item.querySelector(".down").classList.toggle("active");
        })
    );
  })
  .catch((err) =>
    showError("Hiện đang xảy ra lỗi. Vui lòng liên hệ quản trị viên")
  );

function renderData(data) {
  let html = "";
  data.forEach((item) => {
    let { id, fullname, date, numberItem, totalItem, totalPrice } = item;
    html += `
                <div class="rows" data-id="${id}">
                    <div class="code grid-2">
                        <p class="code-content">${id}</p>
                        <div class="detail">
                            <small>Chi tiết   
                                <span class="down"><i class="fa-solid fa-caret-down"></i></span>
                                <span class="up"><i class="fa-solid fa-caret-up"></i></span>
                            </small>
                            <div class="list-products list">
                                <div class="rows list-product-titles">
                                    <span class="name-product grid-6">Tên sản phẩm</span>
                                    <span class="unit-price text-right grid-2">Đơn giá</span>
                                    <span class="amount text-right grid-2">Tổng số</span>
                                    <span class="total text-right grid-2">Tổng tiền</span>
                                </div>
                                <div class="list-product-content"></div>
                                
                            </div>
                        </div>
                    </div>
                    <p class="customer-name grid-2">${fullname}</p>
                    <p class="date grid-2">${date}</p>
                    <p class="items grid-2">${numberItem}</p>
                    <p class="total-items grid-2">${totalItem}</p>
                    <p class="total-price">${totalPrice}</p>
                    <div class="return">
                        <span class="return-btn" onclick="handleDeleteBill('${id}')">
                            <i class="fa-regular fa-rectangle-xmark"></i>
                        </span>
                    </div>
                </div>
    `;
  });
  document.querySelector(".list-content").innerHTML = html;
}

async function handleDeleteBill(id) {
  if (confirm("Bạn có chắc muốn xóa đơn hàng này không ?")) {
    updateQuantityProduct(id);
    await billApi.deleteBill(id);
    alert("Đơn hàng của bạn đã xóa!!!");
  }
}

function updateQuantityProduct(id) {
  const billById = billApi.getBill(`http://localhost:3000/bill/${id}`);
  billById
    .then((bill) => {
      const ListProducts = getStore(keyLocalStorageListSP);
      const productsInBill = bill.detail;
      productsInBill.forEach((item) => {
        let isExist = ListProducts.find((product) => product.id === item.id);
        if (isExist) {
          isExist.num += item.soluong;
        }
      });
      setStore(keyLocalStorageListSP, ListProducts);
      document.querySelector(`[data-id='${id}']`).remove();
    })
    .catch((err) =>
      showError("Hiện đang xảy ra lỗi. Vui lòng liên hệ quản trị viên")
    );
}

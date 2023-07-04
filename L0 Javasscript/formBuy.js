// async function logJSONData() {
//   const response = await fetch("https://provinces.open-api.vn/api/p/");
//   const jsonData = await response.json();
//   return jsonData;
// }

const host = "https://provinces.open-api.vn/api/";
const city = document.querySelector("#city");
const district = document.querySelector("#district");
const ward = document.querySelector("#ward");
const form = document.querySelector("#form-infoBuyer");

function showForm() {
  form.style.display = "block";
  form.querySelector('[name="last-name"]').focus();
}

function hideForm() {
  form.style.display = "none";
  city.value = "";
  if (!city.value) {
    ward.setAttribute("disabled", true);
    ward.innerHTML =
      '<option disabled value="" selected>chọn phường/xã</option>';
    district.setAttribute("disabled", true);
    district.innerHTML = `<option value="" selected class="option-value">chọn quận/huyện</option>`;
  }
}

function GetProvinceAPI(api) {
  return {
    getCity: async function (api) {
      const res = await fetch(api);
      const jsonData = await res.json();
      return jsonData;
    },
    getDistricts: async function (api, id) {
      const res = await fetch(`${api}p/${id}?depth=2`);
      const jsonData = await res.json();
      return jsonData;
    },
    getWards: async function (api, id) {
      const res = await fetch(`${api}d/${id}?depth=2`);
      const jsonData = await res.json();
      return jsonData;
    },
  };
}
const getApi = GetProvinceAPI();

function renderData(data, selector) {
  let html = '<option disabled value="" selected>chọn tỉnh/thành phố</option>';
  data.forEach((item) => {
    html += `<option class="option-value" data-id = '${item.code}' value="${item.name}" checked>${item.name}</option>`;
    document.getElementById(`${selector}`).innerHTML = html;
  });
}

getApi
  .getCity(host)
  .then((data) => {
    renderData(data, "city");
    city.removeAttribute("disabled");
  })
  .catch((err) => console.log(err));

city.onchange = () => {
  const id = city.querySelector("option:checked").getAttribute("data-id");
  city.style.border = "1px solid black";
  city.style.boxShadow = "0 0 3px black";
  ward.setAttribute("disabled", true);
  ward.innerHTML = '<option disabled value="" selected>chọn phường/xã</option>';
  district.setAttribute("disabled", true);
  district.innerHTML = `<option value="" selected class="option-value">đang tải...</option>`;

  getApi
    .getDistricts(host, id)
    .then((data) => {
      renderData(data.districts, "district");
      district.querySelector("option[disabled]").innerText = "chọn quận/huyện";
      district.removeAttribute("disabled");
    })
    .catch((err) => alert("Hiện đang có lỗi, xin quý khách thông cảm!"));
};

district.onchange = () => {
  const id = district.querySelector("option:checked").getAttribute("data-id");
  district.style.border = "1px solid black";
  district.style.boxShadow = "0 0 3px black";
  ward.innerHTML = `<option value="" selected class="option-value">đang tải...</option>`;
  getApi
    .getWards(host, id)
    .then((data) => {
      renderData(data.wards, "ward");
      ward.querySelector("option[disabled]").innerText = "chọn phường/xã";
      ward.removeAttribute("disabled");
    })
    .catch((err) => alert("Hiện đang có lỗi, xin quý khách thông cảm!"));
};

function checkValidate() {
  let result = true;
  form.querySelectorAll("select:not(:disabled)").forEach((item) => {
    if (!item.value) {
      item.style.border = "1px solid var(--red)";
      item.style.boxShadow = "0 0 6px var(--red)";
      result = false;
    }
  });
  form.querySelectorAll("input").forEach((input) => {
    const inputParent = input.parentElement; // truy cập đến phần tử cha của nó
    if (!input.value) {
      inputParent.querySelector(".validate").innerText =
        "Vui lòng nhập trường này";
      result = false;
    } else if (!checkPhoneEmail()) {
      result = false;
    }
  });
  return result;
}

function checkPhoneEmail() {
  let result = true;
  const phoneNumber = form.querySelector("input.phone-number");
  const email = form.querySelector('input[name= "email"]');
  const emailParent = email.parentElement;
  const phoneParent = phoneNumber.parentElement;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  const email_regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (!phoneNumber.value) {
    phoneParent.querySelector("span.validate").innerText =
      "Vui lòng nhập trường này";
    result = false;
  } else if (!vnf_regex.test(phoneNumber.value)) {
    phoneParent.querySelector("span.validate").innerHTML =
      "Số điện thoại không hợp lệ";
    result = false;
  }

  if (!email.value) {
    emailParent.querySelector(".validate").innerHTML =
      "Vui lòng nhập trường này";
    result = false;
  } else if (!email_regex.test(email.value)) {
    emailParent.querySelector("span.validate").innerHTML = "Email không hợp lệ";
    result = false;
  }

  return result;
}
form
  .querySelectorAll("input")
  .forEach(
    (item) =>
      (item.oninput = () =>
        (item.parentElement.querySelector(".validate").innerText = ""))
  );

form.querySelectorAll("select").forEach(
  (item) =>
    (item.onblur = () => {
      item.style.border = "1px solid black";
      item.style.boxShadow = "0 0 3px black";
    })
);
// Enter Click

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (checkValidate()) {
    billApi.postBill(createBill());
    form.style.display = "none";
    localStorage.removeItem(keyLocalStorageItemCart);
  }
});
// --------tao ham fetch Bill

// tao ham random
const randomId = function () {
  return Math.random().toString(36).substring(2, 12);
};

// tạo bill
function createBill() {
  const firstName = form.querySelector('input[name="first-name"]').value;
  const lastName = form.querySelector('input[name="last-name"]').value;
  const houseAddress = form.querySelector("input.house-address").value;
  const date = new Date();
  const detail = [];

  const listItemsCart = getStore(keyLocalStorageItemCart);
  const listSanPham = getStore(keyLocalStorageListSP);

  let totalItem = 0;
  let totalPrice = 0;
  listItemsCart.forEach((item) => {
    let isExist = listSanPham.find((product) => product.id === item.idSp);
    const total = item.soluong * isExist.price;
    totalItem += item.soluong;
    totalPrice += total;
    // console.log(totalItem);
    // console.log(totalPrice);
    const { name, price, id, image } = isExist;
    const { soluong } = item;
    detail.push({ id, image, name, price, soluong, total });
    console.log(detail);

    let newListSanPham = listSanPham.map((sanpham) => {
      if (sanpham.id === item.idSp) {
        // console.log(sanpham.num, item.soluong);
        sanpham.num -= item.soluong;
        console.log(sanpham.num);
      }
      // console.log(sanpham);
      return sanpham;
    });
    setStore(keyLocalStorageListSP, newListSanPham);
  });
  return {
    id: randomId(),
    fullname: `${firstName} ${lastName}`,
    date: date.toLocaleDateString(),
    numberItem: listItemsCart.length,
    totalItem: totalItem,
    totalPrice: totalPrice,
    address: `${houseAddress} , ${ward.value} , ${district.value} , ${city.value}`,
    detail: detail,
  };
}
// createBill();

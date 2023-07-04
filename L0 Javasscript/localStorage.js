const keyLocalStorageListSP = "DANHSACHSP";
const keyLocalStorageItemCart = "DANHSACHITEMCART";
function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getStore(key) {
  let data = [];
  if (localStorage.getItem(key)) {
    data = JSON.parse(localStorage.getItem(key));
  }
  return data;
}
// export default setStore;

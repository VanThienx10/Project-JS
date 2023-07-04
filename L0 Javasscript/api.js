const billApi = (function (api) {
  return {
    getBill: async function (api) {
      const res = await fetch(api);
      const jsonData = await res.json();
      return jsonData;
    },
    postBill: async function (data = {}) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      const res = await fetch(api, options);
      return res.json();
    },
    deleteBill: async function (id) {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(api + "/" + id, options);
      return response.json();
    },
  };
})("http://localhost:3000/bill");

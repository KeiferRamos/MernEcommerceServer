const container = document.getElementById("container");

const displayViews = () => {
  container.innerHTML = `
        <div class="login-form">
          <p id="label">login admin</p>
          <div>
            <input type="text" id="email" placeholder="email"/><br/>
            <input type="text" id="password" placeholder="password"/><br/>
            <button id="submit-btn">submit</button>
          </div>
        </div>
      `;
  const label = document.getElementById("label");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const submitBtn = document.getElementById("submit-btn");

  const getData = async () => {
    const { data } = await axios.post("/api/v1/admin/login", {
      email: email.value,
      password: password.value,
    });
    return data;
  };

  submitBtn.addEventListener("click", async () => {
    try {
      const data = await getData();
      displayCustomer(data);
    } catch (err) {
      label.innerHTML = err.response.data.msg;
    }
    setTimeout(() => {
      label.innerHTML = "login admin";
    }, 1200);
  });
};

const displayCustomer = (data) => {
  const displayOrders = data.customer.map((person) => {
    const {
      modeOfpayment,
      moreInfo,
      orders,
      orderSummary,
      orderState,
      email,
      _id,
    } = person;

    return `
      <div class="customer">
        <div class="sub-con">${displayCustomerInfo({ ...moreInfo })}</div>
        <div class="sub-con">${displayPaymentInfo(modeOfpayment)}</div>
        <div class="sub-con">
          <h3>Customer Orders</h3>
          ${displayCustomerOrder(orders)}
        </div>
        <div class="sub-con">${displayOrderSummary(orderSummary)}</div>
          <button id="deliver-btn" data-email=${email} data-id=${_id}
          ${orderState !== "pending" && "disabled"} >
          ${orderState == "pending" ? "deliver" : orderState}</button>
      </div>
    `;
  });

  container.innerHTML = displayOrders.join("");
  container.querySelectorAll("#deliver-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      try {
        const { id, email } = e.target.dataset;
        await axios.patch("/api/v1/admin", { id, email });
        e.target.disabled = true;
        e.target.innerHTML = "delivered";
      } catch (err) {
        console.log(err);
      }
    });
  });
};

const displayCustomerInfo = ({ fullName, address }) => {
  const { firstName, lastName } = fullName;
  const { streetAddress, Barangay, City, Region, ZipCode } = address;
  return `
    <div>
      <h3>Customer Info</h3>
      <p>name: ${firstName} ${lastName}</p>
      <p>address: ${streetAddress}, ${Barangay}, ${City}, ${Region}, ${ZipCode}</p>
    </div>
  `;
};

const displayPaymentInfo = (modeOfpayment) => {
  const { selected, details } = modeOfpayment;
  return `
        <h3>Payment Info</h3>
        <p> selected payment method: ${selected}</p>
        <div>${
          selected == "online payment" ? PaymentDetails(details) : ""
        }</div>
      `;
};

const PaymentDetails = (detail) => {
  const { option, cardNumber, ExpDate, SecurityCode, username } = detail;
  return `
        <div>
          <p>payment option: ${option}</p>
          <p>card number: ${cardNumber}</p>
          <p>expiration date: ${ExpDate}</p>
          <p>security code: ${SecurityCode}</p>
          <p>username: ${username}</p>
        </div>
      `;
};

const displayCustomerOrder = (orders) => {
  return orders
    .map((order) => {
      const { color, item, quantity } = order;
      const { name, price } = item;
      return `
          <div>
            <p>item name: ${name}</p>
            <p>item price: ${price}</p>
            <p>item color: ${color}</p>
            <p>quantity: ${quantity}</p>
          </div>
          <br/>
        `;
    })
    .join("");
};

const displayOrderSummary = (orderSummary) => {
  const { itemQuantity, TotalPrice, ItemPrice, ShippingFee } = orderSummary;
  return `
        <h3>Order Summary</h3>
        <p>item quantity: ${itemQuantity}</p>
        <p>Item price: ${ItemPrice}</p>
        <p> Shipping fee: ${ShippingFee}</p>
        <p>Total price: ${TotalPrice}</p>
        <br/>
      `;
};

displayViews();

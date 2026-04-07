let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  cartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
}

function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  let existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();

  showToast(`${product.name} added 🛒`);
}

function removeFromCart(id){
cart = cart.filter(i=>i.id!==id);
saveCart(); updateCartUI();
}

function updateQuantity(id,qty){
let item = cart.find(i=>i.id===id);
if(!item)return;
item.quantity=qty;
if(qty<=0){removeFromCart(id)} else{saveCart();updateCartUI();}
}

function getTotal(){
return cart.reduce((t,i)=>t+i.price*i.quantity,0);
}

function getCartCount(){
return cart.reduce((c,i)=>c+i.quantity,0);
}

function updateCartUI(){
let container=document.getElementById("cart-items");
let total=document.getElementById("cart-total");
let count=document.getElementById("cart-count");

if(container){
container.innerHTML="";
cart.forEach(item=>{
let div=document.createElement("div");
div.className="cart-item";
div.innerHTML = `
  <div class="cart-item-row">

    <span class="item-name">${item.name}</span>

    <div class="cart-controls">

      <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>

      <span class="qty-number">${item.quantity}</span>

      <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>

      <button class="delete-btn" onclick="removeFromCart('${item.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>

    </div>

  </div>
`;
container.appendChild(div);
});
}

if(total) total.innerText="Total: KES "+getTotal();
if(count) count.innerText=getCartCount();
}

window.onload=updateCartUI;

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav-container");

  if (window.scrollY > 20) {
    nav.style.background = "rgba(10, 8, 18, 0.6)";
    nav.style.backdropFilter = "blur(20px)";
  } else {
    nav.style.background = "rgba(10, 8, 18, 0.1)";
    nav.style.backdropFilter = "blur(16px)";
  }
});

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function(e) {
    if (this.href.includes("#")) return;

    e.preventDefault();
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location = this.href;
    }, 400);
  });
});

/* -------- WHATSAPP CHECKOUT -------- */
function checkoutWhatsApp() {

  if (cart.length === 0) {
    alert("Cart is empty 🛒");
    return;
  }

  const name = document.getElementById("user-name").value;
  const phoneInput = document.getElementById("user-phone").value;
  const location = document.getElementById("user-location").value;
  const payment = document.getElementById("payment-method").value;

  if (!name || !phoneInput || !location) {
    alert("Please fill all details");
    return;
  }

  let message = `🛒 *Midnight Collection Order*%0A%0A`;

  message += `👤 Name: ${name}%0A`;
  message += `📞 Contact: ${phoneInput}%0A`;
  message += `📍 Location: ${location}%0A`;
  message += `💳 Payment: ${payment}%0A%0A`;

  cart.forEach(item => {
    message += `• ${item.name} x${item.quantity} = KES ${item.price * item.quantity}%0A`;
  });

  message += `%0A💰 *Total: KES ${getTotal()}*`;

  let phone = "254716669697";

  let url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");

  // clear cart
  cart = [];
  saveCart();
  updateCartUI();
}
const tg = window.Telegram.WebApp;
tg.expand();

const PRODUCTS = [
  {
    id: "b1",
    title: "Букет №1",
    price: 3990,
    image_url: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800"
  },
  {
    id: "b2",
    title: "Букет №2",
    price: 2490,
    image_url: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800"
  },
  {
    id: "b3",
    title: "Букет №3",
    price: 5490,
    image_url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800"
  }
];

const cart = new Map();

function money(n){
  return new Intl.NumberFormat('ru-RU').format(n) + " ₽";
}

function renderProducts(){
  const root = document.getElementById("products");
  root.innerHTML = "";

  PRODUCTS.forEach(p => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <img src="${p.image_url}" />
      <div>${p.title}</div>
      <div><b>${money(p.price)}</b></div>
      <button>Добавить</button>
    `;
    el.querySelector("button").onclick = () => {
      cart.set(p.id, (cart.get(p.id) || 0) + 1);
      renderCart();
    };
    root.appendChild(el);
  });
}

function renderCart(){
  let total = 0;
  let text = [];

  for (const [id, qty] of cart.entries()){
    const p = PRODUCTS.find(x => x.id === id);
    total += p.price * qty;
    text.push(`${p.title} ×${qty}`);
  }

  document.getElementById("cartText").textContent =
    text.length ? text.join(", ") : "пусто";

  document.getElementById("totalText").textContent = money(total);
}

function submitOrder(){
  if (cart.size === 0) {
    tg.showAlert("Корзина пустая");
    return;
  }

  const address = document.getElementById("address").value.trim();
  if (!address) {
    tg.showAlert("Укажи адрес или самовывоз");
    return;
  }

  const payload = {
    address,
    items: Array.from(cart.entries())
  };

  tg.sendData(JSON.stringify(payload));
  tg.close();
}

document.getElementById("submitBtn").onclick = submitOrder;

renderProducts();
renderCart();

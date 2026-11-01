
const products = [
  {
    id: 1,
    name: "Oversize Graphic Tee",
    category: "เสื้อยืด",
    price: 290,
    stock: 20,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
  },
  {
    id: 2,
    name: "Basic Crop Top",
    category: "เสื้อครอป",
    price: 199,
    stock: 15,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"
  },
  {
    id: 3,
    name: "Pink Hoodie",
    category: "เสื้อกันหนาว",
    price: 390,
    stock: 10,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
  },
  {
    id: 4,
    name: "Baggy Jeans",
    category: "กางเกง",
    price: 490,
    stock: 12,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
  },
  {
    id: 5,
    name: "White T-Shirt",
    category: "เสื้อยืด",
    price: 250,
    stock: 18,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500"
  },
  {
    id: 6,
    name: "Cute Crop Shirt",
    category: "เสื้อครอป",
    price: 220,
    stock: 8,
    image: "https://cdn.ray-web.jp/images/30/50/40/34/png/rzbibivyegh60uc4msponos0rskopk.webp"
  },
  {
    id: 7,
    name: "Casual Hoodie",
    category: "เสื้อกันหนาว",
    price: 450,
    stock: 14,
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=500"
  },
  {
    id: 8,
    name: "Street Jeans",
    category: "กางเกง",
    price: 550,
    stock: 9,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
  }
];

let cart = [];
let currentCategory = "all";

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalElement = document.getElementById("total");

// แสดงสินค้า
function displayProducts() {
  const keyword = document.getElementById("search")
    .value.toLowerCase();

  const filtered = products.filter(product => {
    const matchCategory =
      currentCategory === "all" ||
      product.category === currentCategory;

    const matchSearch =
      product.name.toLowerCase().includes(keyword);

    return matchCategory && matchSearch;
  });

  productList.innerHTML = "";

  if (filtered.length === 0) {
    productList.innerHTML = "<p>ไม่พบสินค้าที่ค้นหา</p>";
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">฿${product.price.toLocaleString()}</p>
        <p class="stock">
          คงเหลือ ${product.stock} ชิ้น
        </p>
        <button class="add-btn"
          ${product.stock === 0 ? "disabled" : ""}
          onclick="addToCart(${product.id})">
          ${product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
        </button>
      </div>
    `;

    productList.appendChild(card);
  });
}

// เลือกหมวดหมู่สินค้า
document.querySelectorAll("#categories button")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("#categories button")
        .forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");

      currentCategory = button.dataset.category;
      displayProducts();
    });
  });

// ค้นหาสินค้า
document.getElementById("search")
  .addEventListener("input", displayProducts);

// เพิ่มสินค้าลงตะกร้า
function addToCart(id) {
  const product = products.find(p => p.id === id);

  if (!product || product.stock <= 0) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  product.stock--;

  displayProducts();
  updateCart();
  alert("เพิ่มสินค้าลงตะกร้าเรียบร้อย!");
}

// แสดงข้อมูลตะกร้า
function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.textContent = "ยังไม่มีสินค้าในตะกร้า";
  }

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;

    total += subtotal;
    count += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <span>${item.name}</span>
      <span>฿${item.price.toLocaleString()}</span>
      <span>
        <button onclick="changeQuantity(${item.id}, -1)">−</button>
        ${item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </span>
      <span>฿${subtotal.toLocaleString()}</span>
    `;

    cartItems.appendChild(row);
  });

  cartCount.textContent = count;
  totalElement.textContent = total.toLocaleString();
}

// ปรับจำนวนสินค้า
function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  const product = products.find(p => p.id === id);

  if (!item || !product) return;

  if (amount > 0) {
    if (product.stock <= 0) {
      alert("สินค้าในสต็อกไม่เพียงพอ");
      return;
    }

    item.quantity++;
    product.stock--;
  } else {
    item.quantity--;
    product.stock++;

    if (item.quantity <= 0) {
      cart = cart.filter(p => p.id !== id);
    }
  }

  displayProducts();
  updateCart();
}

// ล้างตะกร้า
document.getElementById("clear-cart")
  .addEventListener("click", () => {
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        product.stock += item.quantity;
      }
    });

    cart = [];

    displayProducts();
    updateCart();
  });

// เริ่มต้นเว็บไซต์
displayProducts();
updateCart();

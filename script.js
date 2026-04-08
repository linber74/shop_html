const categories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories']
const container = document.getElementById('products');
    

Promise.all(
  categories.map(category =>
    fetch(`https://dummyjson.com/products/category/${category}`)
    .then(res => res.json())
  )
)
.then(results => {
  const products = [];
  results.forEach(data => {
    data.products.forEach(p => products.push(p));
  });

  products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'col';
      div.innerHTML = `
       <div class="card h-100 text-center bg-light">
       <img src="${product.images[0]}" class="card-img-top p-3 product-img"  style="height: 200px; object-fit: contain;
       transition: transform 0.3s;">
       <div class="card-body d-flex flex-column"> 
       <h5 class ="card-title"> ${product.title}</h5>
       <p class = "card-description"> ${product.description}</p>
    
        <p class ="card-text mt-auto">${product.price} USD</p>
        <button class="btn btn-primary order-button"
            data-id="${product.id}"
            data-title="${product.title}"
            data-price="${product.price}"
            data-image="${product.images[0]}">Order</button>
        </div>
        </div>

      `;

        // image hover effect
        const img = div.querySelector('.product-img');
        img.addEventListener('mouseover', () => {
          img.style.transform = 'scale(1.1)';
        });
        img.addEventListener('mouseout', () => {
          img.style.transform = 'scale(1)';
        });

        // order button hover effect
        const orderButton = div.querySelector('.order-button');
        orderButton.addEventListener('mouseover', () => {
          orderButton.style.backgroundColor = '#0056b3';
          orderButton.style.transform = 'scale(1.05)';
        });
        orderButton.addEventListener('mouseout', () => {
          orderButton.style.backgroundColor = '#007bff';
          orderButton.style.transform = 'scale(1)';
        });

        orderButton.addEventListener('click',() => {
          const cartProduct = {
             id: orderButton.dataset.id,
             title: orderButton.dataset.title,
             price: parseFloat(orderButton.dataset.price),
             image: orderButton.dataset.image
          };
          addToCart(cartProduct);
        });

      container.appendChild(div);
    });
  })

  .catch(error => {
    console.error('Something went wrong:', error);
  });
   

function getCart() {
    let data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    updateCartUI();
}

function increaseQuantity(id) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        updateCartUI();
    }
}

function decreaseQuantity(id) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }
        saveCart(cart);
        updateCartUI();
    }
}

function removeItem(id) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart(cart);
        updateCartUI();
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();
    const cartItemContainer = document.getElementById('cartItem');
    cartItemContainer.innerHTML = '';

    let totalSum = 0;

    cart.forEach( item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" 
              style="width: 50px; height: 50px; object-fit: contain;"
              onerror="this.style.display='none">
            <span>${item.title}</span>
            <span>${item.price} USD</span>
            <span>Quantity: ${item.quantity}</span>
           
            <button class="btn btn-sm btn-secondary increase" data-id="${item.id}">+</button>
            <button class="btn btn-sm btn-secondary decrease" data-id="${item.id}">-</button>
            <button class="btn btn-sm btn-danger remove" data-id="${item.id}">Ta bort</button>
        `;

        const increaseBtn = div.querySelector('.increase');
          increaseBtn.addEventListener('click', () => increaseQuantity(item.id));
        
        const decreaseBtn = div.querySelector('.decrease');
          decreaseBtn.addEventListener('click', () => decreaseQuantity(item.id));

        const removeBtn = div.querySelector('.remove');
          removeBtn.addEventListener('click', () => removeItem(item.id));



        cartItemContainer.appendChild(div);
         totalSum += item.price * item.quantity;
    });

    document.getElementById('cartTotal').textContent = totalSum.toFixed(2);
    document.getElementById('cartCount').textContent = cart.length;
}

const openCart = document.getElementById('openCart');
const cartPanel = document.getElementById('cartPanel');


const offcanvas = new bootstrap.Offcanvas(cartPanel);
openCart.addEventListener('click', () => offcanvas.show());

const checkout = new bootstrap.Modal(document.getElementById('orderModal'));
document.getElementById('checkout').addEventListener('click', () => {
    const fields = ['name', 'email', 'phone', 'address', 'postal', 'city'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('is-invalid', 'is-valid');
    });
    document.getElementById('orderConfirmation').classList.add('d-none');
    checkout.show();
});

''
document.getElementById('clearCart').addEventListener('click', () => clearCart());

document.addEventListener('DOMContentLoaded', () => updateCartUI());




function formValidation() {
  
  const form = document.querySelector("form");

  const name = document.getElementById('name');
  const address = document.getElementById('address')
  const postal = document.getElementById('postal')
  const city = document.getElementById('city')
  const email = document.getElementById('email')
  const phone = document.getElementById('phone')

  name.addEventListener ('input', () => validateField(name, 2, 50, null));
  address.addEventListener ('input', () => validateField(address, 2, 50, null));
  postal.addEventListener ('input', () => validateField(postal, 5, 5, /^[0-9]{5}$/));
  city.addEventListener ('input', () => validateField(city, 2, 50, null));
  email.addEventListener ('input', () => validateField(email, 1, 50, /@/));
  phone.addEventListener ('input', () => validateField(phone, 1, 20, /^[0-9()\-]+$/));

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = validateField(name, 2, 50, null) &
    validateField(address, 2, 50, null) &
    validateField(postal, 5, 5, /^[0-9]{5}$/) &
    validateField(city, 2, 50, null) &
    validateField(email, 1, 50, /@/) &
    validateField(phone, 1, 20, /^[0-9()\-]+$/);

    if (isValid){
      document.getElementById('orderConfirmation').classList.remove('d-none');
      clearCart();
      form.reset();
      setTimeout(() => { checkout.hide();}, 7000);
    }

    setTimeout(() => {
    document.getElementById('orderConfirmation').classList.add('d-none');
}, 4000);
  });

}

formValidation();

function validateField (field, minLength, maxLength, regex) {
  value = field.value.trim();

  if (value.length < minLength || value.length > maxLength){
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    return false;
  }

  if (regex && !regex.test(value)) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid')
    return false;
  }

  field.classList.add('is-valid');
  field.classList.remove('is-invalid');
  return true;
}

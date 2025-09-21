// API functions for backend communication
async function saveAppointment(appointmentData) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving appointment:', error);
    return { error: 'Failed to save appointment' };
  }
}

async function saveSubscriber(email) {
  try {
    const response = await fetch('/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving subscriber:', error);
    return { error: 'Failed to save subscriber' };
  }
}

// Cart logic (frontend only - no backend changes needed)
const cart = [];
function updateCart() {
  const cartList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} - Ksh ${(item.price * item.qty).toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price * item.qty;
  });
  cartTotal.textContent = cart.length ? `Total: Ksh ${total.toFixed(2)}` : "Your cart is empty.";
}

// Newsletter signup form handler
document.getElementById("newsletterForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  const response = document.getElementById("newsletterResponse");
  
  if (!email) {
    response.textContent = "Please enter a valid email address.";
    response.style.color = "red";
    return;
  }
  
  const result = await saveSubscriber(email);
  
  if (result.error) {
    response.textContent = result.error;
    response.style.color = "red";
  } else if (result.message === "Email already subscribed") {
    response.textContent = "This email is already subscribed to our newsletter.";
    response.style.color = "orange";
  } else {
    response.textContent = "Thank you for subscribing! You'll receive updates and tips from VetGuard Solutions.";
    response.style.color = "green";
    document.getElementById("newsletterForm").reset();
  }
});

// Show more info for livestock services
document.addEventListener('DOMContentLoaded', function() {
  const livestockCards = document.querySelectorAll('.card');
  livestockCards.forEach(card => {
    card.addEventListener('click', function() {
      const service = card.querySelector('h3').textContent;
      let info = '';
      switch(service) {
        case '🐄 Livestock Disease Management':
          info = 'We diagnose, treat, and prevent major livestock diseases in Eastern Africa, including East Coast Fever, Rift Valley Fever, Brucellosis, Mastitis, and Trypanosomiasis. Our team uses modern diagnostics and proven therapies.';
          break;
        case '🦟 Parasite Control':
          info = 'Our parasite control programs target ticks, worms, and flies, using safe and effective treatments to protect your herd and flock.';
          break;
        case '🧬 Reproductive Health & Breeding':
          info = 'We offer fertility assessment, artificial insemination, pregnancy diagnosis, and management of reproductive disorders for cattle, goats, sheep, and more.';
          break;
        case '💧 Herd Health & Biosecurity':
          info = 'Our experts help you plan herd health, conduct farm biosecurity audits, and respond to outbreaks of contagious diseases.';
          break;
        case '🛠️ Livestock Surgery':
          info = 'We perform minor and major surgical procedures, including wound management, dehorning, castration, and cesarean sections.';
          break;
        case '📋 Extension & Farmer Training':
          info = 'We provide on-farm training and extension services for farmers, covering disease prevention, animal husbandry, and best practices.';
          break;
        default:
          info = '';
      }
      if(info) {
        alert(info);
      }
    });
  });
});

// Scroll to Contact Section
function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: 'smooth' });
}

// Contact Form Submission - KEEP THIS VERSION
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // This prevents the form from submitting traditionally

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const serviceType = document.getElementById("serviceType").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const message = document.getElementById("message").value.trim();
    const response = document.getElementById("formResponse");

    // Basic validation
    if (!name || !email || !phone || !serviceType || !appointmentDate || !message) {
      response.textContent = "Please fill out all fields.";
      response.style.color = "red";
      return;
    }

    // Save to backend API
    const appointmentData = {
      name, email, phone, serviceType, appointmentDate, message,
      timestamp: new Date().toISOString()
    };
    const result = await saveAppointment(appointmentData);

    if (result && result.message === 'Appointment created successfully') {
      response.textContent = `Thank you, ${name}! Your appointment for '${serviceType}' on ${appointmentDate} has been received. We will contact you at ${phone} or ${email}.`;
      response.style.color = "green";
    } else {
      response.textContent = "Failed to book appointment. Please try again later.";
      response.style.color = "red";
    }

    // Reset form
    contactForm.reset();
  });
}
// ...existing code...

// Product rendering functions (unchanged)
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  for (let i = 0; i < 300; i++) {
    const name = productNames[i % productNames.length] + (i >= productNames.length ? ` #${i+1}` : "");
    const price = getRandomPrice();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${getProductImage(name)}" alt="${name}">
      <h4>${name}</h4>
      <p class="price">Ksh ${price}</p>
      <button data-name="${name}" data-price="${price}">Add to Cart</button>
    `;
    grid.appendChild(card);
  }
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", function() {
  // Load cart from localStorage if needed
  const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (savedCart.length > 0) {
    cart.push(...savedCart);
    updateCart();
  }
  
  // Add product event listeners
  document.getElementById("product-grid").addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
      const name = e.target.getAttribute("data-name");
      const price = parseFloat(e.target.getAttribute("data-price"));
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      updateCart();
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  });
  
  // Add checkout functionality if needed
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      alert("Thank you for your order! This is a demo - in a real application, you would proceed to payment.");
      cart.length = 0;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    });
  }
});
/* Kilaza — site estático (catálogo + carrinho placeholder)
   Observação: sem backend. Para pedidos/pagamentos reais, integrar plataforma ou API.
*/

const SETTINGS = {
  // WhatsApp principal (Muinhe Bin Mufahaia)
  whatsappNumber: "244938749898", // com DDI, sem + e sem espaços
  whatsappDefaultMessage: "Olá! Gostaria de solicitar uma cotação." ,
};

const PRODUCTS = [
  {
    id: "sudfloc",
    slug: "sudfloc",
    name: "SUDFLOC (polímero catiônico)",
    category: "SUDFLOC (Polímeros/Coagulantes)",
    short: "Polímero catiônico (polieletrólito) para coagulação/floculação e clarificação.",
    description: "SUDFLOC é um polímero catiônico (polieletrólito) utilizado em processos de tratamento de água (potável, industrial e águas residuais) como coagulante primário ou como auxílio coagulante, promovendo agregação de partículas, formação de flocos e melhoria da clarificação/remoção de sólidos. A Kilaza possui exclusividade de representação para Angola do fornecedor AECI Water (África do Sul).",
    packaging: "Sob consulta",
    note: "Fichas técnicas/grades e recomendações de dosagem/preparação sob consulta.",
    priceLabel: "Sob consulta",
    docs: [{ label: "Ficha técnica (exemplo) SUDFLOC 475 (PDF)", url: "docs/SUDFLOC-475-Fact-Sheet.pdf" }],
  },
  {
    id: "cloro-granulado",
    slug: "hipoclorito-de-calcio-granulado",
    name: "Hipoclorito de cálcio (granulado)",
    category: "Desinfetantes (Cloração)",
    short: "Desinfetante sólido para cloração de água potável (calcium hypochlorite).",
    description: "O hipoclorito de cálcio (calcium hypochlorite) é um desinfetante oxidante usado na cloração de água, contribuindo para inativação microbiológica e manutenção de residual de cloro conforme o processo. A Kilaza comercializa este produto e pode orientar a aplicação e boas práticas de manuseio. Fornecedor: Jalaqua International (informação a confirmar/validar com a Kilaza).",
    packaging: "Sacos / baldes (sob consulta)",
    note: "Produto oxidante — seguir ficha de segurança (MSDS) e boas práticas",
    priceLabel: "Sob consulta",
  },
  {
    id: "cloro-pastilhas",
    slug: "hipoclorito-de-calcio-tabletes",
    name: "Hipoclorito de cálcio (tabletes/pastilhas)",
    category: "Desinfetantes (Cloração)",
    short: "Tabletes/pastilhas para cloração com dosagem prática.",
    description: "Tabletes/pastilhas à base de hipoclorito de cálcio, usadas para desinfeção e manutenção de residual em aplicações específicas. A Kilaza pode apoiar na definição de dosagem e rotina operacional. Fornecedor: Jalaqua International (informação a confirmar/validar com a Kilaza).",
    packaging: "Baldes (sob consulta)",
    note: "Produto oxidante — seguir ficha de segurança (MSDS) e boas práticas",
    priceLabel: "Sob consulta",
  },
  {
    id: "cal",
    slug: "cal",
    name: "Cal (hidratada/virgem)",
    category: "Correção de pH/Alcalinidade",
    short: "Correção de pH e apoio a processos de coagulação.",
    description: "Cal para ajuste de pH e alcalinidade, podendo apoiar etapas do tratamento conforme o processo. Especificação e embalagem sob consulta.",
    packaging: "Sacos (sob consulta)",
    note: "Armazenamento adequado recomendado",
    priceLabel: "Sob consulta",
  },
];

function formatWhatsAppLink(message) {
  const base = `https://wa.me/${SETTINGS.whatsappNumber}`;
  const text = encodeURIComponent(message || SETTINGS.whatsappDefaultMessage);
  return `${base}?text=${text}`;
}

function getCart() {
  try { return JSON.parse(localStorage.getItem("kilaza_cart") || "[]"); }
  catch { return []; }
}

function setCart(cart) {
  localStorage.setItem("kilaza_cart", JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find(i => i.productId === productId);
  if (found) found.qty += qty;
  else cart.push({ productId, qty });
  setCart(cart);
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  const next = cart.filter(i => i.qty > 0);
  setCart(next);
}

function clearCart() { setCart([]); }

function cartCount() {
  return getCart().reduce((sum, i) => sum + (i.qty || 0), 0);
}

function updateCartBadges() {
  const count = cartCount();
  document.querySelectorAll('#cartBadge').forEach(el => el.textContent = String(count));
}

function productBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug);
}

function productById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.substring(2), v);
    else node.setAttribute(k, v);
  });
  ([]).concat(children).forEach(ch => {
    if (ch === null || ch === undefined) return;
    if (typeof ch === 'string') node.appendChild(document.createTextNode(ch));
    else node.appendChild(ch);
  });
  return node;
}

function mountFeatured() {
  const wrap = document.querySelector('#featuredProducts');
  if (!wrap) return;
  const featured = PRODUCTS.slice(0, 4);
  wrap.innerHTML = '';
  featured.forEach(p => wrap.appendChild(productCard(p)));
}

function productCard(p) {
  const card = el('article', { class: 'card product-card' }, [
    el('div', { class: 'product-card__top' }, [
      el('span', { class: 'tag' }, [el('i', { class: 'fa-solid fa-tag' }), p.category]),
      el('span', { class: 'price' }, [p.priceLabel]),
    ]),
    el('h3', {}, [p.name]),
    el('p', {}, [p.short]),
    el('div', { class: 'product-card__actions' }, [
      el('a', { class: 'btn btn--ghost', href: `produto.html?slug=${encodeURIComponent(p.slug)}` }, [el('i', { class: 'fa-regular fa-eye' }), 'Ver']),
      el('button', { class: 'btn btn--primary', type: 'button', onclick: () => { addToCart(p.id, 1); toast(`Adicionado: ${p.name}`);} }, [el('i', { class: 'fa-solid fa-cart-plus' }), 'Adicionar']),
    ])
  ]);
  return card;
}

function mountShop() {
  const grid = document.querySelector('#productsGrid');
  if (!grid) return;

  const searchInput = document.querySelector('#searchInput');
  const categorySelect = document.querySelector('#categorySelect');
  const sortSelect = document.querySelector('#sortSelect');

  // categories
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category))).sort();
  cats.forEach(c => categorySelect.appendChild(el('option', { value: c }, [c])));

  function render() {
    const q = (searchInput.value || '').trim().toLowerCase();

    // suporte a filtro via hash (ex.: loja.html#categoria=sudfloc)
    const hash = new URLSearchParams((location.hash || '').replace(/^#/, ''));
    const hashCat = (hash.get('categoria') || '').toLowerCase();
    const cat = categorySelect.value || (hashCat === 'sudfloc' ? 'SUDFLOC (Polímeros/Coagulantes)' : '');

    let items = PRODUCTS.filter(p => {
      const matchesQ = !q || (p.name + ' ' + p.short + ' ' + p.category).toLowerCase().includes(q);
      const matchesCat = !cat || p.category === cat;
      return matchesQ && matchesCat;
    });

    const sort = sortSelect.value;
    if (sort === 'name_asc') items = items.slice().sort((a,b) => a.name.localeCompare(b.name));

    grid.innerHTML = '';
    if (!items.length) {
      grid.appendChild(el('div', { class: 'card', style: 'grid-column: 1 / -1' }, [
        el('h3', {}, ['Nenhum produto encontrado']),
        el('p', { class: 'muted' }, ['Tente outra palavra-chave ou selecione outra categoria.'])
      ]));
      return;
    }
    items.forEach(p => grid.appendChild(productCard(p)));
  }

  [searchInput, categorySelect, sortSelect].forEach(ctrl => ctrl.addEventListener('input', render));
  [categorySelect, sortSelect].forEach(ctrl => ctrl.addEventListener('change', render));

  render();
}

function mountProduct() {
  const host = document.querySelector('#productView');
  if (!host) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const p = productBySlug(slug) || PRODUCTS[0];

  const bc = document.querySelector('#bcName');
  if (bc) bc.textContent = p.name;

  host.innerHTML = '';
  host.appendChild(el('div', { class: 'product__media' }, [
    el('div', { class: 'tag' }, [el('i', { class: 'fa-solid fa-tag' }), p.category]),
    el('h1', { style: 'margin: 14px 0 8px; font-size: 28px;' }, [p.name]),
    el('p', { class: 'muted', style: 'margin:0; max-width: 46ch;' }, [p.short]),
  ]));

  const docsBlock = (p.docs && p.docs.length)
    ? el('div', { class: 'card' }, [
        el('h2', { class: 'h4' }, ['Documentos']),
        el('div', { class: 'stack' }, p.docs.map(d =>
          el('a', { class: 'btn btn--ghost', href: d.url, target: '_blank', rel: 'noopener' }, [
            el('i', { class: 'fa-regular fa-file-pdf' }),
            d.label
          ])
        ))
      ])
    : null;

  host.appendChild(el('div', { class: 'product__panel' }, [
    el('div', { class: 'card' }, [
      el('h2', { class: 'h4' }, ['Descrição']),
      el('p', { class: 'muted' }, [p.description]),
      el('div', { class: 'kv' }, [
        el('div', {}, [el('strong', {}, ['Embalagem: ']), p.packaging]),
        el('div', {}, [el('strong', {}, ['Observação: ']), p.note]),
        el('div', {}, [el('strong', {}, ['Preço: ']), p.priceLabel]),
      ])
    ]),
    docsBlock,
    el('div', { class: 'card' }, [
      el('h2', { class: 'h4' }, ['Ações']),
      el('div', { class: 'stack' }, [
        el('button', { class: 'btn btn--primary', type: 'button', onclick: () => { addToCart(p.id, 1); toast(`Adicionado: ${p.name}`);} }, [el('i', { class: 'fa-solid fa-cart-plus' }), 'Adicionar ao carrinho']),
        el('a', { class: 'btn btn--whatsapp', target: '_blank', rel: 'noopener', href: formatWhatsAppLink(`Olá! Gostaria de solicitar uma cotação para ${p.name}.`) }, [el('i', { class: 'fa-brands fa-whatsapp' }), 'Pedir cotação no WhatsApp']),
        el('a', { class: 'btn btn--ghost', href: 'carrinho.html' }, [el('i', { class: 'fa-solid fa-cart-shopping' }), 'Ver carrinho'])
      ].filter(Boolean))
    ])
  ].filter(Boolean)));
}

function mountCart() {
  const host = document.querySelector('#cartItems');
  if (!host) return;

  const clearBtn = document.querySelector('#clearCart');
  clearBtn?.addEventListener('click', () => { clearCart(); render(); });

  const buyerName = document.querySelector('#buyerName');
  const buyerCompany = document.querySelector('#buyerCompany');
  const buyerCity = document.querySelector('#buyerCity');
  const whatsOrder = document.querySelector('#whatsOrder');

  function buildWhatsText(cart) {
    const lines = [];
    lines.push('Olá! Gostaria de solicitar uma cotação/pedido:');
    lines.push('');
    cart.forEach(i => {
      const p = productById(i.productId);
      if (!p) return;
      lines.push(`- ${p.name} (qtd: ${i.qty})`);
    });
    lines.push('');
    const name = buyerName?.value?.trim();
    const comp = buyerCompany?.value?.trim();
    const city = buyerCity?.value?.trim();
    if (name) lines.push(`Nome: ${name}`);
    if (comp) lines.push(`Empresa: ${comp}`);
    if (city) lines.push(`Local: ${city}`);
    lines.push('');
    lines.push('Pode enviar disponibilidade, prazos e valores?');
    return lines.join('\n');
  }

  function render() {
    const cart = getCart();
    host.innerHTML = '';

    const countEl = document.querySelector('#summaryCount');
    if (countEl) countEl.textContent = String(cartCount());

    if (!cart.length) {
      host.appendChild(el('div', { class: 'muted' }, ['Seu carrinho está vazio.']))
      whatsOrder.href = formatWhatsAppLink('Olá! Gostaria de solicitar uma cotação.');
      return;
    }

    cart.forEach(i => {
      const p = productById(i.productId);
      if (!p) return;
      host.appendChild(el('div', { class: 'cart-row' }, [
        el('div', { class: 'cart-row__meta' }, [
          el('strong', {}, [p.name]),
          el('span', {}, [p.category])
        ]),
        el('div', { class: 'qty' }, [
          el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { changeQty(p.id, -1); render(); } }, [el('i', { class: 'fa-solid fa-minus' })]),
          el('span', { style: 'min-width: 28px; text-align:center; font-weight:800' }, [String(i.qty)]),
          el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { changeQty(p.id, +1); render(); } }, [el('i', { class: 'fa-solid fa-plus' })]),
        ])
      ]));
    });

    const msg = buildWhatsText(cart);
    whatsOrder.href = formatWhatsAppLink(msg);
  }

  [buyerName, buyerCompany, buyerCity].forEach(inp => inp?.addEventListener('input', render));
  render();
}

function mountCheckout() {
  const form = document.querySelector('#checkoutForm');
  const host = document.querySelector('#checkoutCart');
  if (!form || !host) return;

  function renderCart() {
    const cart = getCart();
    host.innerHTML = '';
    if (!cart.length) {
      host.appendChild(el('div', { class: 'muted' }, ['Carrinho vazio.']))
      return;
    }
    cart.forEach(i => {
      const p = productById(i.productId);
      if (!p) return;
      host.appendChild(el('div', { class: 'cart-row' }, [
        el('div', { class: 'cart-row__meta' }, [
          el('strong', {}, [p.name]),
          el('span', {}, [`qtd: ${i.qty}`])
        ]),
        el('span', { class: 'tag' }, [p.priceLabel])
      ]));
    });
  }

  function buildWhatsTextFromForm() {
    const data = new FormData(form);
    const nome = (data.get('nome') || '').toString().trim();
    const tel = (data.get('telefone') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const morada = (data.get('morada') || '').toString().trim();

    const cart = getCart();
    const lines = [];
    lines.push('Olá! Pedido/Cotação via site (checkout):');
    lines.push('');
    cart.forEach(i => {
      const p = productById(i.productId);
      if (!p) return;
      lines.push(`- ${p.name} (qtd: ${i.qty})`);
    });
    lines.push('');
    if (nome) lines.push(`Nome: ${nome}`);
    if (tel) lines.push(`Telefone: ${tel}`);
    if (email) lines.push(`E-mail: ${email}`);
    if (morada) lines.push(`Local/Morada: ${morada}`);
    lines.push('');
    lines.push('Pode confirmar disponibilidade, prazos e valores?');
    return lines.join('\n');
  }

  const checkoutWhats = document.querySelector('#checkoutWhats');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.querySelector('#checkoutStatus');
    status.textContent = 'Pedido simulado. Use o WhatsApp para concluir.';
    checkoutWhats.href = formatWhatsAppLink(buildWhatsTextFromForm());
  });

  checkoutWhats.href = formatWhatsAppLink('Olá! Gostaria de solicitar uma cotação/pedido.');
  renderCart();
}

function mountContact() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const whats = document.querySelector('#whatsCta');
  const floatWhats = document.querySelector('#floatWhats');

  function refreshWhats() {
    const data = new FormData(form);
    const nome = (data.get('nome') || '').toString().trim();
    const empresa = (data.get('empresa') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const msg = (data.get('mensagem') || '').toString().trim();

    const lines = [];
    lines.push('Olá! Contato via site:');
    if (nome) lines.push(`Nome: ${nome}`);
    if (empresa) lines.push(`Empresa: ${empresa}`);
    if (email) lines.push(`E-mail: ${email}`);
    lines.push('');
    if (msg) lines.push(msg);

    const url = formatWhatsAppLink(lines.join('\n'));
    if (whats) whats.href = url;
    if (floatWhats) floatWhats.href = url;
  }

  ['input','change'].forEach(evt => form.addEventListener(evt, refreshWhats));
  refreshWhats();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.querySelector('#contactStatus');
    status.textContent = 'Mensagem registrada (simulação). Para atendimento imediato, use o WhatsApp.';
  });
}

function mountNav() {
  const btn = document.querySelector('#navToggle');
  const nav = document.querySelector('#navMenu');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

function toast(text) {
  const t = el('div', { class: 'card', style: 'position: fixed; left: 16px; bottom: 16px; z-index: 80; max-width: 360px; border-radius: 16px; background: rgba(7,26,43,.92); border: 1px solid rgba(255,255,255,.16);' }, [
    el('div', { style: 'display:flex; gap:10px; align-items:flex-start' }, [
      el('div', { class: 'tag' }, [el('i', { class: 'fa-solid fa-circle-check', style: 'color: var(--ok)' }), 'Carrinho']),
      el('div', {}, [
        el('strong', { style: 'display:block; margin-bottom: 4px' }, ['OK']),
        el('div', { class: 'muted', style: 'font-size: 13px; line-height: 1.4' }, [text])
      ])
    ])
  ]);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function setYear() {
  document.querySelectorAll('#year').forEach(el => el.textContent = String(new Date().getFullYear()));
}

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  mountNav();
  updateCartBadges();
  mountFeatured();
  mountShop();
  mountProduct();
  mountCart();
  mountCheckout();
  mountContact();

  // Fallback WhatsApp floating button
  const floatWhats = document.querySelector('#floatWhats');
  if (floatWhats && (!floatWhats.getAttribute('href') || floatWhats.getAttribute('href') === '#')) {
    floatWhats.href = formatWhatsAppLink();
  }
});

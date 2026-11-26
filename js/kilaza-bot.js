/* ============================================================
   Kilaza · Assistente virtual (bot FAQ) — v2.0
   Novidades v2: mascote robô-garçon 🤖 + balão "Em que posso ajudar?"
   ============================================================ */
(function () {
  "use strict";

  var SETTINGS = {
    whatsappNumber: "244938749898",
    whatsappDefaultMessage: "Olá! Vim pelo site da Kilaza e gostaria de solicitar uma cotação.",
    brandName: "Kilabot",
    tagline: "Assistente virtual",
    greeting: "Seja muito bem-vindo(a) 😊 Diga-me como posso ajudar."
  };

  var M = {
    boasVindas: '<span style="font-size:15.5px;font-weight:700">' + SETTINGS.greeting + '</span><br><br>Escolha uma opção:',
    produtos:
      "<b>🧪 Produtos em destaque</b><br>• <b>SUDFLOC</b> (polímero catiônico) — coagulação/floculação e clarificação<br>• <b>Hipoclorito de cálcio (granulado)</b> — desinfetante para cloração de água potável<br>• <b>Hipoclorito de cálcio (tabletes/pastilhas)</b> — cloração com dosagem prática<br>• <b>Cal</b> (hidratada/virgem) — correcção de pH e alcalinidade<br><br>Embalagens e preços sob consulta — peça a sua cotação! 👇",
    servicos:
      "<b>🛠️ Serviços</b><br>• <b>Testes de laboratório</b> — análise da qualidade da água para indicar o Sudfloc ideal e optimizar a dosagem<br>• <b>Monitorização e acompanhamento</b> — visitas técnicas, ajustes de dosagem e boas práticas<br>• <b>Fornecimento e logística</b> — planeamento de reposição para evitar rupturas no abastecimento",
    cotacao:
      "📝 <b>Pedir cotação</b><br>Com todo o gosto! Para preparar a melhor proposta, envie-nos:<br><b>1.</b> Nome da empresa<br><b>2.</b> NIF da empresa<br><b>3.</b> Morada da empresa<br><b>4.</b> Email da empresa<br><b>5.</b> Produto ou necessidades (ex.: Sudfloc, Hipoclorito, etc.)<br><b>6.</b> Quantidade<br><b>7.</b> Local de entrega<br><br>Toque no botão abaixo — o modelo vai já preparado para o nosso WhatsApp. 👇",
    contactos:
      "📞 <b>Contactos</b><br><br><b>Muinhe Bin Mufahaia</b><br>📧 Bin.kilaza@gmail.com<br>📱 +244 938 749 898<br><br><b>Paulo Medeiros</b><br>📱 +244 923 430 189<br><br>📍 Bairro Camama, Jardim do Éden, Rua das Margaridas, Casa nº 31 — Luanda, Angola",
    empresa:
      "ℹ️ <b>Quem somos</b><br>A <b>Kilaza — Comércio e Transporte, Lda</b> actua no comércio, fornecimento e suporte técnico para tratamento de água potável em Angola.<br><br>✔️ Representação exclusiva do Sudfloc (AECI Water — África do Sul)<br>✔️ Produtos para água potável: Sudfloc, cloro granulado e pastilhas, cal e outros<br>✔️ Testes de laboratório e acompanhamento técnico",
    entrega:
      "🚚 <b>Fornecimento e logística</b><br>Planeamos a reposição dos produtos para evitar rupturas no abastecimento da sua operação:<br>• Planeamento de entregas contínuas<br>• Boas práticas de armazenamento<br>• Suporte para especificação técnica<br><br>Fale connosco pelo WhatsApp para planear o seu fornecimento.",
    laboratorio:
      "🔬 <b>Testes de laboratório</b><br>Realizamos a análise da qualidade da água bruta para:<br>• Indicar o tipo de Sudfloc ideal<br>• Optimizar a dosagem dos produtos<br>• Acompanhar os parâmetros da operação<br><br>Podemos agendar — diga-nos a sua necessidade pelo WhatsApp!",
    fallback:
      "Desculpe, não tenho a certeza de ter compreendido. 🤔<br>Pode escolher uma das opções abaixo, ou falar directamente connosco no WhatsApp:"
  };

  var OPEN = false;

  /* Mascote: robô-garçon em SVG (idêntico em todos os ecrãs) */
  var MASCOTE_SVG =
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">'
    + '<ellipse cx="32" cy="60" rx="15" ry="3" fill="rgba(0,0,0,.15)"/>'
    + '<path d="M20 58 Q20 38 32 38 Q44 38 44 58 Z" fill="#1e293b"/>'
    + '<polygon points="32,38 27,40 32,47 37,40" fill="#fff"/>'
    + '<polygon points="28,41 31.4,42.5 28.6,44.5" fill="#dc2626"/>'
    + '<polygon points="36,41 32.6,42.5 35.4,44.5" fill="#dc2626"/>'
    + '<circle cx="32" cy="43" r="1.6" fill="#b91c1c"/>'
    + '<path d="M21 42 Q17 46 18 52" stroke="#1e293b" stroke-width="4" fill="none" stroke-linecap="round"/>'
    + '<path d="M43 42 Q49 40 52 36" stroke="#1e293b" stroke-width="4" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="53" cy="33" rx="8" ry="2.4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>'
    + '<rect x="50" y="35" width="6" height="2" rx="1" fill="#94a3b8"/>'
    + '<path d="M51 26.5 L55 26.5 L54.4 31 L51.6 31 Z" fill="#38bdf8"/>'
    + '<rect x="29.5" y="34" width="5" height="4" rx="2" fill="#fcd7b0"/>'
    + '<circle cx="32" cy="24" r="12" fill="#fcd7b0"/>'
    + '<path d="M19.5 14 Q19.5 6 32 6 Q44.5 6 44.5 14 Z" fill="#334155"/>'
    + '<rect x="19" y="12.5" width="26" height="4.5" rx="2.2" fill="#1e293b"/>'
    + '<path d="M19 16 Q32 21.5 45 16 Q32 19 19 16 Z" fill="#0f172a"/>'
    + '<circle cx="32" cy="14.7" r="1.6" fill="#f59e0b"/>'
    + '<circle cx="27.5" cy="24" r="1.6" fill="#0c4a6e"/>'
    + '<circle cx="36.5" cy="24" r="1.6" fill="#0c4a6e"/>'
    + '<path d="M28.5 29 Q32 32 35.5 29" stroke="#a1611f" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    + '</svg>';

  var css = ""
    + ".kbz-btn{position:fixed;bottom:22px;right:22px;z-index:99990;width:70px;height:70px;border-radius:50%;border:none;cursor:pointer;"
    + "background:radial-gradient(circle at 30% 25%,#f0f9ff,#bae6fd);padding:6px;"
    + "box-shadow:0 6px 20px rgba(14,165,233,.5);transition:transform .2s}"
    + ".kbz-btn:hover{transform:scale(1.08)}"
    + ".kbz-btn svg{width:100%;height:100%;display:block}"
    + ".kbz-bubble{position:fixed;bottom:104px;right:22px;z-index:99990;background:#fff;color:#0c4a6e;"
    + "border:1.5px solid #bae6fd;border-radius:14px;border-bottom-right-radius:4px;padding:9px 13px;"
    + "font-family:Inter,system-ui,sans-serif;font-size:13.5px;font-weight:600;"
    + "box-shadow:0 6px 18px rgba(2,32,71,.18);max-width:220px;animation:kbzFloat 2.5s ease-in-out infinite}"
    + ".kbz-bubble svg{width:30px;height:30px;flex:none;display:block}"
    + "@keyframes kbzFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}"
    + ".kbz-panel{position:fixed;bottom:104px;right:22px;z-index:99991;width:360px;max-width:calc(100vw - 32px);"
    + "height:auto;min-height:380px;max-height:calc(100vh - 130px);background:#fff;border-radius:16px;overflow:hidden;display:none;"
    + "flex-direction:column;box-shadow:0 12px 40px rgba(2,32,71,.25);font-family:Inter,system-ui,sans-serif}"
    + ".kbz-panel.kbz-open{display:flex}"
    + ".kbz-head{background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}"
    + ".kbz-head .kbz-logo{width:44px;height:44px;border-radius:11px;background:#fff;display:grid;place-items:center;overflow:hidden}"
    + ".kbz-head .kbz-logo svg{width:36px;height:36px}"
    + ".kbz-head h3{margin:0;font-size:16.5px;font-weight:800;letter-spacing:.4px}"
    + ".kbz-head p{margin:3px 0 0;font-size:10.5px;opacity:.95;letter-spacing:1.4px;text-transform:uppercase;font-weight:600}"
    + ".kbz-close{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:.85}"
    + ".kbz-msgs{flex:1 1 auto;min-height:0;overflow-y:auto;padding:14px;background:#f1f7fb;display:flex;flex-direction:column;gap:10px}"
    + ".kbz-msg{max-width:82%;padding:9px 12px;border-radius:14px;font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased;color:#173a54}"
    + ".kbz-msg.bot{background:#fff;border:1px solid #e2eef6;border-bottom-left-radius:4px;align-self:flex-start}"
    + ".kbz-msg.user{background:#0ea5e9;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}"
    + ".kbz-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px 2px;background:#f1f7fb}"
    + ".kbz-chip{background:#fff;border:1.5px solid #0ea5e9;color:#0369a1;border-radius:999px;padding:6px 12px;"
    + "font-size:13px;font-weight:700;letter-spacing:.2px;cursor:pointer;font-family:inherit;transition:background .15s}"
    + ".kbz-chip:hover{background:#e0f2fe}"
    + ".kbz-chip.kbz-wa{background:#25d366;border-color:#25d366;color:#fff}"
    + ".kbz-chip.kbz-wa:hover{background:#1fb855}"
    + ".kbz-foot{padding:8px 14px 14px;background:#f1f7fb}"
    + ".kbz-typing{display:inline-flex;gap:4px;padding:12px 14px}"
    + ".kbz-typing span{width:7px;height:7px;border-radius:50%;background:#8ec5e6;animation:kbzBlink 1.2s infinite}"
    + ".kbz-typing span:nth-child(2){animation-delay:.2s}.kbz-typing span:nth-child(3){animation-delay:.4s}"
    + "@keyframes kbzBlink{0%,80%,100%{opacity:.3}40%{opacity:1}}"
    + "@media(max-width:480px){.kbz-panel{width:calc(100vw - 24px);right:12px;bottom:100px;height:70vh}.kbz-bubble{right:14px}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var fw = document.getElementById("floatWhats");
  if (fw) fw.style.display = "none";

  var btn = document.createElement("button");
  btn.className = "kbz-btn";
  btn.setAttribute("aria-label", "Abrir assistente Kilaza");
  btn.innerHTML = MASCOTE_SVG;
  document.body.appendChild(btn);

  var bubble = document.createElement("div");
  bubble.className = "kbz-bubble";
  bubble.innerHTML = '<span>Em que posso ajudar?</span>';
  document.body.appendChild(bubble);

  var panel = document.createElement("div");
  panel.className = "kbz-panel";
  panel.innerHTML =
      '<div class="kbz-head">'
    +   '<div class="kbz-logo">' + MASCOTE_SVG + '</div>'
    +   '<div><h3>' + SETTINGS.brandName + '</h3><p>' + SETTINGS.tagline + '</p></div>'
    +   '<button class="kbz-close" aria-label="Fechar">✕</button>'
    + '</div>'
    + '<div class="kbz-msgs" id="kbz-msgs"></div>'
    + '<div class="kbz-chips" id="kbz-chips"></div>'
    + '<div class="kbz-foot" id="kbz-foot"></div>';
  document.body.appendChild(panel);

  var msgs  = panel.querySelector("#kbz-msgs");
  var chips = panel.querySelector("#kbz-chips");

  function scrollBottom(){ msgs.scrollTop = msgs.scrollHeight; }

  function addMsg(html, who){
    var d = document.createElement("div");
    d.className = "kbz-msg " + who;
    d.innerHTML = html;
    msgs.appendChild(d);
    scrollBottom();
    return d;
  }

  function botSay(html, delay){
    var t = document.createElement("div");
    t.className = "kbz-msg bot kbz-typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    msgs.appendChild(t);
    scrollBottom();
    setTimeout(function(){ t.remove(); addMsg(html, "bot"); }, delay || 500);
  }

  function waLink(text){
    return "https://wa.me/" + SETTINGS.whatsappNumber + "?text=" + encodeURIComponent(text || SETTINGS.whatsappDefaultMessage);
  }

  function goWhatsApp(text){
    window.open(waLink(text), "_blank", "noopener");
  }

  function showChips(){
    chips.innerHTML = "";
    [["🧪 Produtos","produtos"],["🛠️ Serviços","servicos"],["📝 Pedir cotação","cotacao"],
     ["ℹ️ Quem somos","empresa"],["📞 Contactos","contactos"]].forEach(function(c){
      var b = document.createElement("button");
      b.className = "kbz-chip";
      b.textContent = c[0];
      b.onclick = function(){ handle(c[1], c[0]); };
      chips.appendChild(b);
    });
    var wa = document.createElement("button");
    wa.className = "kbz-chip kbz-wa";
    wa.innerHTML = "🟢 Falar no WhatsApp";
    wa.onclick = function(){ goWhatsApp(); };
    chips.appendChild(wa);
  }

  function reply(key, label){
    var text = M[key] || M.fallback;
    botSay(text, 550);
    if (key === "cotacao") {
      setTimeout(function(){
        var d = addMsg(
            '<a class="kbz-chip kbz-wa" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener" href="'
          + waLink("Olá! Gostaria de solicitar uma cotação.\n\n1. Nome da empresa: ________\n2. NIF da empresa: ________\n3. Morada da empresa: ________\n4. Email da empresa: ________\n5. Produto ou necessidades (ex.: Sudfloc, Hipoclorito, etc.): ________\n6. Quantidade: ________\n7. Local de entrega: ________")
          + '">🟢 Abrir WhatsApp com o pedido pronto</a>', "bot");
        d.style.maxWidth = "95%";
      }, 750);
    }
  }

  function handle(key, label){
    msgs.innerHTML = "";
    addMsg(label, "user");
    reply(key, label);
  }

  function openPanel(){
    OPEN = true;
    panel.classList.add("kbz-open");
    bubble.style.display = "none";
    if (!msgs.children.length){
      botSay(M.boasVindas, 400);
      setTimeout(showChips, 500);
    }
  }

  function closePanel(){
    OPEN = false;
    panel.classList.remove("kbz-open");
    bubble.style.display = "";
  }

  btn.onclick = function(){ OPEN ? closePanel() : openPanel(); };
  panel.querySelector(".kbz-close").onclick = closePanel;
})();

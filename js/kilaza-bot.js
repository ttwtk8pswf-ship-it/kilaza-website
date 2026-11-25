/* ============================================================
   Kilaza · Assistente virtual (bot FAQ) — v1.0
   Incorpora no site kilaza.com com uma linha:
   <script src="js/kilaza-bot.js"></script>
   ============================================================ */
(function () {
  "use strict";

  var SETTINGS = {
    whatsappNumber: "244938749898",
    whatsappDefaultMessage: "Olá! Vim pelo site da Kilaza e gostaria de solicitar uma cotação.",
    brandName: "Kilaza",
    tagline: "Assistente virtual · Tratamento de Água"
  };

  var M = {
    boasVindas:
      "Olá! 👋 Bem-vindo à <b>Kilaza</b> — Comércio e Transporte, Lda.<br>Representante exclusivo do <b>Sudfloc</b> (AECI Water — África do Sul) para o mercado angolano.<br><br>Como posso ajudar? Escolha uma opção:",
    produtos:
      "<b>🧪 Produtos</b><br>• Sudfloc — floculante para tratamento de água potável<br>• Cloro granulado e pastilhas<br>• Cal e outros químicos do processo<br><br>Trabalhamos com formulações conforme a necessidade da sua operação.",
    servicos:
      "<b>🛠️ Serviços</b><br>• <b>Testes de laboratório</b> — análise da qualidade da água para indicar o Sudfloc ideal e optimizar a dosagem<br>• <b>Monitorização e acompanhamento</b> — visitas técnicas, ajustes de dosagem e boas práticas<br>• <b>Fornecimento e logística</b> — planeamento de reposição para evitar rupturas no abastecimento",
    cotacao:
      "📝 <b>Pedir cotação</b><br>Com todo o gosto! Para preparar a melhor proposta, indique-nos:<br>1. Produto ou necessidade (ex.: Sudfloc, cloro, cal…)<br>2. Quantidade aproximada<br>3. Local de entrega<br><br>Toque no botão abaixo e a mensagem vai já preparada para o nosso WhatsApp. 👇",
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
  var lastMenu = M.boasVindas;

  var css = ""
    + ".kbz-btn{position:fixed;bottom:22px;right:22px;z-index:99990;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;"
    + "background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#fff;font-size:26px;display:grid;place-items:center;"
    + "box-shadow:0 6px 20px rgba(14,165,233,.45);transition:transform .2s}"
    + ".kbz-btn:hover{transform:scale(1.08)}"
    + ".kbz-panel{position:fixed;bottom:94px;right:22px;z-index:99991;width:360px;max-width:calc(100vw - 32px);"
    + "height:520px;max-height:calc(100vh - 130px);background:#fff;border-radius:16px;overflow:hidden;display:none;"
    + "flex-direction:column;box-shadow:0 12px 40px rgba(2,32,71,.25);font-family:Inter,system-ui,sans-serif}"
    + ".kbz-panel.kbz-open{display:flex}"
    + ".kbz-head{background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}"
    + ".kbz-head .kbz-logo{width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-weight:800;font-size:15px;letter-spacing:.5px}"
    + ".kbz-head h3{margin:0;font-size:15px;font-weight:700}"
    + ".kbz-head p{margin:2px 0 0;font-size:11.5px;opacity:.9}"
    + ".kbz-close{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:.85}"
    + ".kbz-msgs{flex:1;overflow-y:auto;padding:14px;background:#f1f7fb;display:flex;flex-direction:column;gap:10px}"
    + ".kbz-msg{max-width:82%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.45;color:#1e3a52}"
    + ".kbz-msg.bot{background:#fff;border:1px solid #e2eef6;border-bottom-left-radius:4px;align-self:flex-start}"
    + ".kbz-msg.user{background:#0ea5e9;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}"
    + ".kbz-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px 2px;background:#f1f7fb}"
    + ".kbz-chip{background:#fff;border:1.5px solid #0ea5e9;color:#0369a1;border-radius:999px;padding:6px 12px;"
    + "font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .15s}"
    + ".kbz-chip:hover{background:#e0f2fe}"
    + ".kbz-chip.kbz-wa{background:#25d366;border-color:#25d366;color:#fff}"
    + ".kbz-chip.kbz-wa:hover{background:#1fb855}"
    + ".kbz-foot{padding:8px 14px 14px;background:#f1f7fb}"
    + ".kbz-typing{display:inline-flex;gap:4px;padding:12px 14px}"
    + ".kbz-typing span{width:7px;height:7px;border-radius:50%;background:#8ec5e6;animation:kbzBlink 1.2s infinite}"
    + ".kbz-typing span:nth-child(2){animation-delay:.2s}.kbz-typing span:nth-child(3){animation-delay:.4s}"
    + "@keyframes kbzBlink{0%,80%,100%{opacity:.3}40%{opacity:1}}"
    + "@media(max-width:480px){.kbz-panel{width:calc(100vw - 24px);right:12px;bottom:88px;height:70vh}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
var fw = document.getElementById("floatWhats");
if (fw) fw.style.display = "none";

  var btn = document.createElement("button");
  btn.className = "kbz-btn";
  btn.setAttribute("aria-label", "Abrir assistente Kilaza");
  btn.innerHTML = "💬";
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.className = "kbz-panel";
  panel.innerHTML =
      '<div class="kbz-head">'
    +   '<div class="kbz-logo">K</div>'
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
          + waLink("Olá! Gostaria de solicitar uma cotação.\n\nProduto: \nQuantidade: \nLocal de entrega: ")
          + '">🟢 Abrir WhatsApp com o pedido pronto</a>', "bot");
        d.style.maxWidth = "95%";
      }, 750);
    }
  }

  function handle(key, label){
    addMsg(label, "user");
    reply(key, label);
  }

  function openPanel(){
    OPEN = true;
    panel.classList.add("kbz-open");
    btn.innerHTML = "✕";
    if (!msgs.children.length){
      botSay(M.boasVindas, 400);
      setTimeout(showChips, 500);
    }
  }

  function closePanel(){
    OPEN = false;
    panel.classList.remove("kbz-open");
    btn.innerHTML = "💬";
  }

  btn.onclick = function(){ OPEN ? closePanel() : openPanel(); };
  panel.querySelector(".kbz-close").onclick = closePanel;
})();

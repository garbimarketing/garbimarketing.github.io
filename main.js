(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Datos de config.js ---------- */
  $$("[data-cfg]").forEach(function (el) {
    var v = C[el.dataset.cfg];
    if (v) el.textContent = v;
  });
  $$("[data-channel]").forEach(function (el) {
    var v = C[el.dataset.channel];
    if (!v) { el.hidden = true; return; }
    if (el.tagName === "A") el.href = v;
  });
  $$("[data-profile]").forEach(function (el) {
    var v = C[el.dataset.profile];
    if (v) { el.href = v; el.target = "_blank"; el.rel = "noopener"; el.hidden = false; }
  });
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var burger = $("#burger"), menu = $("#menu");
  function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Cabecera con borde al hacer scroll ---------- */
  var head = $("#top");
  function onScroll() { head.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Copiar email / teléfono ---------- */
  function copyText(text, btn) {
    function ok() { var t = btn.textContent; btn.textContent = "Copiado"; setTimeout(function () { btn.textContent = t; }, 1600); }
    function fallback() {
      var target = btn.parentElement.querySelector("[data-cfg]");
      if (!target) return;
      var r = document.createRange(); r.selectNodeContents(target);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    try {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } catch (e) { fallback(); }
  }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(C[b.dataset.copy] || "", b); });
  });

  /* ---------- Botones de servicio: preseleccionan el formulario ---------- */
  var select = $("#f-service");
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var name = a.dataset.service;
      $$("option", select).forEach(function (o) { if (o.textContent === name) select.value = name; });
    });
  });

  /* ---------- Formulario ---------- */
  var form = $("#form"), fields = $("#form-fields"), done = $("#done"), err = $("#err"), submit = $("#submit");
  var mode = C.formEndpoint ? "formspree" : (C.email ? "mailto" : "none");

  if (mode === "mailto") {
    submit.textContent = "Preparar email";
    $("#form-note").textContent = "Se abrirá tu correo con el mensaje ya escrito para que solo tengas que enviarlo.";
  } else if (mode === "none") {
    submit.textContent = "Enviar consulta";
    $("#form-note").textContent = "Formulario pendiente de configurar.";
  }

  function showError(msg) { err.textContent = msg; err.hidden = false; }
  function showDone(title, text, actionsHtml) {
    $("#done-title").textContent = title;
    $("#done-text").textContent = text;
    $("#done-actions").innerHTML = actionsHtml || "";
    fields.hidden = true; done.hidden = false; done.focus();
    var again = $("#again");
    if (again) again.addEventListener("click", function () { done.hidden = true; fields.hidden = false; });
  }

  /* Validación campo a campo: el mensaje aparece debajo del campo que falla */
  function fieldErr(id, msg) {
    var input = $("#" + id), box = $("#e-" + id.replace("f-", ""));
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (box) box.textContent = msg || "";
    return !msg;
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function isPhone(v) { return /^[+()\d\s.-]+$/.test(v) && v.replace(/\D/g, "").length >= 9; }
  function check(id) {
    var v = String(($("#" + id) || {}).value || "").trim();
    if (id === "f-name") return fieldErr(id, v ? "" : "¿Cómo te llamas?");
    if (id === "f-company") return fieldErr(id, v ? "" : "Dinos el nombre de tu negocio o a qué te dedicas.");
    if (id === "f-email") return fieldErr(id, !v ? "Déjanos un correo o un teléfono para contestarte." : (isEmail(v) || isPhone(v)) ? "" : "Revisa el correo o el teléfono: parece que no está completo.");
    if (id === "f-ok") return fieldErr(id, $("#f-ok").checked ? "" : "Necesitamos tu permiso para poder contestarte.");
    return true;
  }
  ["f-name", "f-company", "f-email"].forEach(function (id) {
    var el = $("#" + id);
    el.addEventListener("blur", function () { if (el.value.trim()) check(id); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(id); });
  });
  $("#f-ok").addEventListener("change", function () { check("f-ok"); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.hidden = true;
    var ids = ["f-name", "f-company", "f-email", "f-ok"], firstBad = null;
    ids.forEach(function (id) { if (!check(id) && !firstBad) firstBad = id; });
    if (firstBad) { $("#" + firstBad).focus(); return; }
    var d = new FormData(form);
    var name = String(d.get("nombre") || "").trim();
    var company = String(d.get("empresa") || "").trim();
    var contact = String(d.get("contacto") || "").trim();
    var goals = d.getAll("objetivos");
    var msg = String(d.get("mensaje") || "").trim();
    if (isEmail(contact)) d.append("_replyto", contact);

    if (mode === "none") {
      return showError("El formulario aún no está conectado. Mientras tanto, escríbenos por nuestras redes o vuelve en unos días.");
    }

    if (mode === "mailto") {
      var body = "Hola, soy " + name + " (" + company + ").\n\nMe interesa: " + d.get("servicio") +
        (goals.length ? "\nMe gustaría: " + goals.join(", ") : "") +
        (msg ? "\n\n" + msg : "") + "\n\nPodéis contactarme en: " + contact;
      var href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Consulta de " + company) + "&body=" + encodeURIComponent(body);
      window.location.href = href;
      return showDone("Tu correo está listo",
        "Hemos abierto tu aplicación de correo con el mensaje escrito. Solo tienes que pulsar enviar. Si no se ha abierto, escríbenos a " + C.email + ".",
        '<button class="btn ghost" type="button" id="again">Volver al formulario</button>');
    }

    // Formspree
    submit.disabled = true; submit.textContent = "Enviando…";
    fetch(C.formEndpoint, { method: "POST", body: d, headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("bad");
        form.reset();
        showDone("¡Gracias, " + name + "!", "Hemos recibido tu consulta. Te contestaremos nosotros para quedar y conocer tu negocio.");
      })
      .catch(function () {
        showError("No se ha podido enviar. Inténtalo de nuevo" + (C.email ? " o escríbenos a " + C.email : "") + ".");
      })
      .then(function () { submit.disabled = false; submit.textContent = "Enviar consulta"; });
  });
})();

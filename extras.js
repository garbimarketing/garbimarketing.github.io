/* Buscador que se escribe solo (servicio de marketing digital) */
(function(){
  var tile=document.querySelector(".t-digital"); if(!tile) return;
  var el=tile.querySelector(".typed"); var text=el.getAttribute("data-text"); var ph=el.textContent;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer=null, done=false;
  function type(){
    if(done) return; clearInterval(timer);
    if(reduce){el.textContent=text;el.classList.add("on");tile.classList.add("found");done=true;return;}
    var i=0; el.textContent=""; el.classList.add("on"); tile.classList.add("typing");
    timer=setInterval(function(){
      i++; el.textContent=text.slice(0,i);
      if(i>=text.length){clearInterval(timer);done=true;setTimeout(function(){tile.classList.add("found");},250);}
    },70);
  }
  function reset(){clearInterval(timer);done=false;el.textContent=ph;el.classList.remove("on");tile.classList.remove("typing","found");}
  tile.addEventListener("mouseenter",type);
  tile.addEventListener("mouseleave",reset);
  tile.addEventListener("focusin",type);
  // En móvil (sin ratón) se escribe al aparecer en pantalla
  if(window.matchMedia("(hover: none)").matches && "IntersectionObserver" in window){
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){type();o.disconnect();}});},{threshold:.6}).observe(tile);
  }
})();

/* Subrayado de «desapercibidas»: se traza cuando el titular entra en pantalla */
(function(){
  var hl=document.querySelector(".hero .hl"); if(!hl) return;
  document.documentElement.classList.add("js-ul");
  if(!("IntersectionObserver" in window)){hl.classList.add("in");return;}
  new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){hl.classList.add("in");o.disconnect();}});},{threshold:.6}).observe(hl);
})();

/* Corazones en «Redes sociales» */
(function(){
  var tile=document.querySelector(".t-redes"); if(!tile) return;
  var box=tile.querySelector(".hearts"); var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var likes=tile.querySelector(".ig-actions .heart"); var count=document.createElement("span"); count.className="likes"; count.textContent="Me gusta";
  if(likes) likes.insertAdjacentElement("afterend",count);
  var timer=null;
  function burst(){
    if(reduce||!box) return; clearInterval(timer); tile.classList.add("liking"); var n=0;
    timer=setInterval(function(){
      var s=document.createElement("span"); s.className="heart-fly";
      s.style.left=(15+Math.random()*65)+"%"; s.style.setProperty("--dx",(Math.random()*40-20)+"px"); s.style.setProperty("--r",(Math.random()*30-15)+"deg");
      box.appendChild(s); setTimeout(function(){s.remove();},1700);
      if(++n>=9){clearInterval(timer);setTimeout(function(){tile.classList.remove("liking");},400);}
    },160);
  }
  tile.addEventListener("mouseenter",burst);
  if(window.matchMedia("(hover: none)").matches && "IntersectionObserver" in window){
    new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)burst();});},{threshold:.6}).observe(tile);
  }
})();

/* En móvil (sin ratón): branding y estrategia se activan al aparecer; CTA siempre al aparecer */
(function(){
  if(!("IntersectionObserver" in window)){document.querySelectorAll(".cta-band").forEach(function(e){e.classList.add("in","arrived");});return;}
  var touch=window.matchMedia("(hover: none)").matches;
  var cta=document.querySelector(".cta-band");
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(cta){
    if(reduce){cta.classList.add("in","arrived");}
    else{
      cta.classList.add("js-guide");
      var nd=cta.querySelector(".hz-needle");
      if(nd) nd.addEventListener("animationend",function(ev){if(ev.animationName==="guide") cta.classList.add("arrived");});
    }
  }
  var io=new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){var t=e.target.classList.contains("hz-wrap")?e.target.closest(".cta-band"):e.target; t.classList.add(t.classList.contains("cta-band")?"in":"reveal");o.unobserve(e.target);}});},{threshold:.45});
  if(cta) io.observe(cta.querySelector(".hz-wrap")||cta);
  if(touch){document.querySelectorAll(".t-brand,.t-strat").forEach(function(el){io.observe(el);});}
})();

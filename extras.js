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
  var likeTxt=tile.querySelector(".ig-likes"); var liked=false;
  var timer=null;
  function burst(){
    if(likeTxt&&!liked){liked=true;likeTxt.textContent="88 Me gusta";tile.classList.add("liked");}
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
  if(touch){document.querySelectorAll(".t-brand,.t-strat,.t-ads").forEach(function(el){io.observe(el);});}
})();

/* Branding: deslizador antes/después arrastrable */
(function(){
  var ba=document.querySelector(".t-brand .ba"); if(!ba) return;
  var down=false;
  function set(x){var r=ba.getBoundingClientRect();var p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));ba.style.setProperty("--split",p+"%");
    ba.classList.toggle("show-after",p<12);ba.classList.toggle("show-before",p>88);}
  ba.addEventListener("pointerdown",function(e){down=true;ba.classList.add("touched","dragging");set(e.clientX);try{ba.setPointerCapture(e.pointerId);}catch(_){}} );
  ba.addEventListener("pointermove",function(e){if(down)set(e.clientX);});
  function up(){down=false;ba.classList.remove("dragging");}
  ba.addEventListener("pointerup",up);ba.addEventListener("pointercancel",up);
})();

/* Publicidad: contador del presupuesto */
(function(){
  var t=document.querySelector(".t-ads"); if(!t) return; var n=t.querySelector(".ad-eur i"); if(!n) return;
  var from=+n.dataset.from,to=+n.dataset.to,raf=null,reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function run(target){cancelAnimationFrame(raf);var start=+n.textContent,t0=null;if(reduce){n.textContent=target;return;}
    function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1400);k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;n.textContent=Math.round(start+(target-start)*k);if(k<1)raf=requestAnimationFrame(step);}
    raf=requestAnimationFrame(step);}
  t.addEventListener("mouseenter",function(){run(to);});
  t.addEventListener("mouseleave",function(){if(!t.classList.contains("reveal"))run(from);});
  new MutationObserver(function(){if(t.classList.contains("reveal"))run(to);}).observe(t,{attributes:true,attributeFilter:["class"]});
})();

/* Cómo trabajamos: la bola recorre la línea y enciende cada paso */
(function(){
  var sec=document.getElementById("proceso"); if(!sec) return;
  var track=sec.querySelector(".track"), dot=sec.querySelector(".track-dot"), fill=sec.querySelector(".track-fill"),
      nodes=[].slice.call(sec.querySelectorAll(".track-node")), items=[].slice.call(sec.querySelectorAll(".steps li"));
  if(!track||!dot||items.length!==4) return;
  var D=13, N=7;
  function xFor(k){
    var tr=track.getBoundingClientRect(), w=tr.width-D;
    var lefts=items.map(function(li){return li.getBoundingClientRect().left;});
    var distinct=lefts.filter(function(v,ix,a){return a.indexOf(v)===ix;}).length===4;
    if(distinct){return Math.max(0,Math.min(w,lefts[k]-tr.left));}
    return w*k/3;
  }
  function placeNodes(){nodes.forEach(function(n,k){n.style.left=(xFor(k)+(D-N)/2)+"px";});}
  placeNodes();
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var i=-1, timer=null, running=false, MOVE=1150, STAY=1600;
  function moveTo(k,instant){
    [dot,fill].forEach(function(el){el&&el.classList.toggle("no-move",!!instant);});
    var x=xFor(k); dot.style.transform="translateX("+x+"px)"; if(fill) fill.style.width=(x+D/2)+"px";
  }
  function activate(k){
    items.forEach(function(li,ix){li.classList.toggle("is-active",ix===k);});
    nodes.forEach(function(n,ix){n.classList.toggle("on",ix<=k);});
    dot.classList.add("arrive"); setTimeout(function(){dot.classList.remove("arrive");},500);
  }
  function goTo(k){ moveTo(k,false); timer=setTimeout(function(){activate(k); timer=setTimeout(next,STAY);},MOVE); }
  function restart(){
    /* la bola termina su recorrido hasta el final de la línea y se desvanece; todo se apaga a la vez */
    var tr=track.getBoundingClientRect();
    dot.classList.remove("no-move"); dot.style.transform="translateX("+(tr.width-D)+"px)"; dot.classList.add("hide");
    if(fill){ fill.classList.remove("no-move"); fill.style.width=tr.width+"px"; fill.style.opacity="0"; }
    items.forEach(function(li){li.classList.remove("is-active");}); nodes.forEach(function(n){n.classList.remove("on");});
    timer=setTimeout(function(){
      moveTo(0,true); if(fill){ fill.style.width="0px"; } void dot.offsetWidth;
      timer=setTimeout(function(){
        if(fill) fill.style.opacity="1";
        dot.classList.remove("hide");
        timer=setTimeout(function(){ i=0; activate(0); timer=setTimeout(next,STAY); },350);
      },250);
    },1150);
  }
  function next(){ if(!running) return; if(i>=3){restart();return;} i++; goTo(i); }
  function start(){ if(running) return; running=true;
    if(i<0){ moveTo(0,true); i=0; activate(0); timer=setTimeout(next,STAY); } else timer=setTimeout(next,400); }
  function stop(){ running=false; clearTimeout(timer); }
  new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting&&!document.hidden) start(); else stop(); });},{threshold:0,rootMargin:"-15% 0px -15% 0px"}).observe(sec);
  document.addEventListener("visibilitychange",function(){ if(document.hidden) stop(); });
  window.addEventListener("resize",function(){ placeNodes(); if(i>=0) moveTo(i,true); });
})();

/* Servicios: panel de detalle («Ver qué incluye») */
(function(){
  var sheet=document.getElementById("svc-sheet"), data=document.querySelector(".svc-data");
  var mores=[].slice.call(document.querySelectorAll(".svc-more"));
  if(!sheet||!data||typeof sheet.showModal!=="function"){mores.forEach(function(b){b.hidden=true;});return;}
  var arts=[].slice.call(data.querySelectorAll("article[data-key]")), keys=arts.map(function(a){return a.dataset.key;});
  var body=sheet.querySelector(".sheet-body"), tabs=sheet.querySelector(".sheet-tabs"), idx=sheet.querySelector(".sheet-idx"),
      cta=sheet.querySelector(".sheet-cta"), nextB=sheet.querySelector(".sheet-next"), nextName=nextB.querySelector("b"),
      select=document.getElementById("f-service"), root=document.documentElement;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches, cur=-1, back=null, closing=false;
  var tabBtns=arts.map(function(a,k){
    var b=document.createElement("button"); b.type="button"; b.setAttribute("role","tab"); b.textContent=a.dataset.short;
    b.addEventListener("click",function(){show(k,true);}); tabs.appendChild(b); return b;
  });
  tabs.addEventListener("keydown",function(e){
    var d=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0; if(!d) return; e.preventDefault();
    var k=(cur+d+arts.length)%arts.length; show(k,true); tabBtns[k].focus();
  });
  function pad(n){return (n<10?"0":"")+n;}
  function show(k,animate,dir){
    if(k===cur&&body.firstChild) return; if(dir===undefined) dir=cur<0?0:(k>cur?1:-1); cur=k; var a=arts[k], c=a.cloneNode(true);
    var h=c.querySelector(".sv-title"); if(h) h.id="sheet-title";
    body.textContent=""; body.appendChild(c); body.scrollTop=0; body.dispatchEvent(new CustomEvent("sheet:show",{detail:c}));
    tabBtns.forEach(function(b,ix){b.setAttribute("aria-selected",ix===k?"true":"false");b.tabIndex=ix===k?0:-1;});
    var tb=tabBtns[k]; tabs.scrollTo({left:tb.offsetLeft-tabs.clientWidth/2+tb.offsetWidth/2,behavior:animate&&!reduce?"smooth":"auto"});
    idx.textContent=pad(k+1); cta.dataset.service=a.dataset.form;
    nextName.textContent=arts[(k+1)%arts.length].dataset.name;
    body.classList.remove("swap","from-r","from-l"); void body.offsetWidth; body.classList.add("swap"); if(animate&&dir) body.classList.add(dir>0?"from-r":"from-l");
  }
  function open(key,from){
    var k=keys.indexOf(key); if(k<0) return; back=from||null; cur=-1; show(k,false);
    root.classList.add("sheet-lock"); sheet.classList.remove("closing"); sheet.showModal();
    sheet.querySelector(".sheet-x").focus({preventScroll:true});
    requestAnimationFrame(function(){requestAnimationFrame(function(){sheet.classList.add("is-open");});});
  }
  function close(after){
    if(!sheet.open||closing) return; closing=true;
    sheet.classList.remove("is-open"); sheet.classList.add("closing");
    setTimeout(function(){
      sheet.close(); sheet.classList.remove("closing"); root.classList.remove("sheet-lock"); closing=false;
      if(after) after(); else if(back) back.focus({preventScroll:true});
    },reduce?0:360);
  }
  sheet.addEventListener("cancel",function(e){e.preventDefault();close();});
  sheet.addEventListener("click",function(e){if(e.target===sheet) close();});
  sheet.querySelector(".sheet-x").addEventListener("click",function(){close();});
  function step(d){ show((cur+d+arts.length)%arts.length,true,d); }
  nextB.addEventListener("click",function(){step(1);});
  sheet.querySelector(".sheet-arrow.s-prev").addEventListener("click",function(){step(-1);});
  sheet.querySelector(".sheet-arrow.s-next").addEventListener("click",function(){step(1);});
  /* teclado: flechas izquierda/derecha (fuera de campos y de la lista de pestañas) */
  sheet.addEventListener("keydown",function(e){
    if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft") return;
    if(e.target.closest(".sheet-tabs,input,textarea,select")) return;
    e.preventDefault(); step(e.key==="ArrowRight"?1:-1);
  });
  /* móvil: deslizar el dedo para cambiar de servicio (no dentro del móvil de ejemplo) */
  var tx=null, ty=0;
  body.addEventListener("touchstart",function(e){ if(e.target.closest(".cd-stage,.cd-formats")){tx=null;return;} tx=e.touches[0].clientX; ty=e.touches[0].clientY; },{passive:true});
  body.addEventListener("touchend",function(e){ if(tx===null) return; var dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty; tx=null; if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6) step(dx<0?1:-1); },{passive:true});
  body.addEventListener("click",function(e){var g=e.target.closest(".sv-go"); if(!g) return; var k=keys.indexOf(g.dataset.goto); if(k>=0){show(k,true); tabBtns[k].focus({preventScroll:true});}});
  cta.addEventListener("click",function(e){
    e.preventDefault(); var name=cta.dataset.service;
    if(select)[].forEach.call(select.options,function(o){if(o.textContent===name) select.value=name;});
    close(function(){
      var c=document.getElementById("contacto"); if(!c) return;
      c.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
      if(window.matchMedia("(hover: hover)").matches){var f=document.getElementById("f-name"); if(f) setTimeout(function(){f.focus({preventScroll:true});},reduce?0:700);}
    });
  });
  mores.forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();open(b.dataset.svc,b);});});
  [].forEach.call(document.querySelectorAll(".tile[data-svc]"),function(t){
    t.addEventListener("click",function(e){
      if(e.target.closest("a,button,.ba,input,select,textarea")) return;
      var sel=window.getSelection&&String(window.getSelection()); if(sel) return;
      open(t.dataset.svc,t.querySelector(".svc-more"));
    });
  });
  /* enlace directo: garbimarketing.github.io/#servicio-redes */
  var m=location.hash.match(/^#servicio-(\w+)/); if(m&&keys.indexOf(m[1])>=0) setTimeout(function(){open(m[1]);},300);
})();

/* «Cuéntanos tu idea»: lleva al formulario y, con ratón, deja el cursor en el primer campo */
(function(){
  [].forEach.call(document.querySelectorAll("[data-focus-form]"),function(a){
    a.addEventListener("click",function(){
      if(!window.matchMedia("(hover: hover)").matches) return;
      var f=document.getElementById("f-name"); if(f) setTimeout(function(){f.focus({preventScroll:true});},800);
    });
  });
})();

/* Por qué nosotros: entrada progresiva (cada pieza solo se anima cuando está a la vista) */
(function(){
  var sec=document.querySelector(".why-block"); if(!sec) return;
  var head=sec.querySelector(".sec-head"), kicker=head&&head.querySelector(".kicker"), h=head&&head.querySelector("h2"),
      intro=head&&head.querySelector(".sec-intro"), nav=sec.querySelector(".why-nav"), lis=[].slice.call(sec.querySelectorAll(".why li"));
  if(!head||!h) return;
  /* la brújula se mueve muy poco solo mientras la sección se ve */
  if("IntersectionObserver" in window) new IntersectionObserver(function(es){es.forEach(function(e){sec.classList.toggle("seen",e.isIntersecting);});}).observe(sec);
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)) return;
  /* titular palabra a palabra (el texto no cambia; los lectores de pantalla lo leen entero) */
  h.classList.add("why-h"); h.setAttribute("aria-label",h.textContent.replace(/\s+/g," ").trim());
  var ia=0, ib=0;
  (function split(node,inEm){
    [].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var f=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if(!part) return;
          if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(part));return;}
          var w=document.createElement("span"); w.setAttribute("aria-hidden","true");
          if(inEm){w.className="w wb";var x=document.createElement("span");x.textContent=part;w.appendChild(x);w.style.setProperty("--i",ib++);}
          else{w.className="w wa";w.textContent=part;w.style.setProperty("--i",ia++);}
          f.appendChild(w);
        });
        n.parentNode.replaceChild(f,n);
      } else if(n.nodeType===1) split(n,inEm||n.tagName==="EM");
    });
  })(h,false);
  /* orden y momento mínimo de cada paso (segundos desde que la sección llega) */
  var steps=[[kicker,0],[h,.15],[intro,1.25],[lis[0],1.45],[lis[1],1.6],[lis[2],1.75],[lis[3],1.9],[nav,2.3]]
    .filter(function(s){return s[0];}).map(function(s){s[0].setAttribute("data-step","");return {el:s[0],t:s[1]*1000,vis:false,done:false};});
  document.documentElement.classList.add("js-why");
  var t0=null, last=0, GAP=130;
  function reveal(s){
    s.done=true; var now=performance.now(), at=Math.max(now,last+GAP); last=at;
    setTimeout(function(){
      s.el.classList.add("on");
      if(s.el===nav){ var n=nav.querySelector(".wn-needle"); n&&n.addEventListener("animationend",function(ev){if(ev.animationName==="wn-seek") nav.classList.add("settled");},{once:true}); }
    },at-now);
  }
  function tick(){
    if(t0===null) return; var el=performance.now()-t0, pending=false;
    steps.forEach(function(s){ if(s.done) return; if(s.vis&&el>=s.t) reveal(s); else pending=true; });
    if(pending) setTimeout(tick,60);
  }
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){
    steps.forEach(function(s){ if(s.el===e.target) s.vis=e.isIntersecting; });
  }); tick();},{threshold:.25});
  steps.forEach(function(s){vio.observe(s.el);});
  /* la secuencia arranca cuando el encabezado ya está bien dentro de la pantalla */
  new IntersectionObserver(function(es,o){es.forEach(function(e){ if(e.isIntersecting){ t0=performance.now(); o.disconnect(); tick(); } });},{rootMargin:"0px 0px -18% 0px"}).observe(head);
})();

/* Creación de contenido: enfoca, dispara y el mismo producto pasa a reel */
(function(){
  var t=document.querySelector(".t-cont"); if(!t) return;
  var time=t.querySelector(".reel .time"); var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){ if(time) time.textContent="0:15"; return; }
  var timers=[], raf=null, running=false;
  function later(fn,ms){timers.push(setTimeout(fn,ms));}
  function count(){
    var t0=performance.now(), D=2800;
    (function step(now){ var k=Math.min(1,(now-t0)/D); time.textContent="0:"+("0"+Math.round(k*15)).slice(-2); if(k<1) raf=requestAnimationFrame(step); })(t0);
  }
  function play(){
    if(running) return; running=true; reset(true);
    t.classList.add("shoot");
    later(function(){t.classList.add("shot");},1200);
    later(function(){t.classList.add("playing"); count();},1250);
    later(function(){t.classList.remove("playing"); t.classList.add("ended");},4150);
  }
  function reset(keep){
    timers.forEach(clearTimeout); timers=[]; cancelAnimationFrame(raf);
    t.classList.remove("shoot","shot","playing","ended"); if(time) time.textContent="0:00";
    if(!keep) running=false;
  }
  t.addEventListener("mouseenter",play);
  t.addEventListener("mouseleave",function(){reset(false);});
  /* en móvil: se dispara una vez al aparecer */
  if(window.matchMedia("(hover: none)").matches && "IntersectionObserver" in window){
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){play();o.disconnect();}});},{threshold:.55}).observe(t);
  }
})();

/* Fichas de servicio: demo con formatos seleccionables + pasos y beneficios que se encienden */
(function(){
  var sheet=document.getElementById("svc-sheet"), body=sheet&&sheet.querySelector(".sheet-body"); if(!body) return;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches, timers=[], io=null;
  if(!reduce) document.documentElement.classList.add("js-sv");
  function later(fn,ms){timers.push(setTimeout(function(){ if(sheet.open) fn(); },ms));}
  function stop(){timers.forEach(function(t){clearTimeout(t);clearInterval(t);});timers=[];}
  function run(scr){
    /* carrusel */
    var track=scr.querySelector(".cd-track");
    if(track){ var dots=[].slice.call(scr.querySelectorAll(".cd-dots i")), cnt=scr.querySelector(".cd-count"), i=0;
      var go=function(n){ i=n%3; track.style.transform="translateX("+(-100*i)+"%)"; dots.forEach(function(d,k){d.classList.toggle("on",k===i);}); if(cnt) cnt.textContent=(i+1)+"/3"; };
      go(0); if(!reduce) timers.push(setInterval(function(){ if(sheet.open) go(i+1); },1900)); scr.onclick=function(){go(i+1);}; }
    /* encuesta */
    var a=scr.querySelector(".cd-poll .a"); if(a){ a.classList.remove("pick"); reduce?a.classList.add("pick"):later(function(){a.classList.add("pick");},1500); }
    /* texto que se escribe */
    [].forEach.call(scr.querySelectorAll("[data-type]"),function(el){
      var t=el.dataset.type; if(reduce){el.textContent=t;return;} el.textContent=""; var k=0;
      later(function(){ var iv=setInterval(function(){ k++; el.textContent=t.slice(0,k); if(k>=t.length) clearInterval(iv); },45); timers.push(iv); },500);
    });
    /* contador */
    [].forEach.call(scr.querySelectorAll("[data-count-to]"),function(el){
      var to=+el.dataset.countTo; if(reduce){el.textContent=to;return;} el.textContent="0";
      later(function(){ var t0=performance.now(); (function st(now){ var k=Math.min(1,(now-t0)/900); el.textContent=Math.round(to*k); if(k<1&&sheet.open) requestAnimationFrame(st); })(t0); },600);
    });
    /* comprobaciones una a una */
    [].forEach.call(scr.querySelectorAll(".dg-check p,.pd-follow p,.st-meas li"),function(p,k){ p.classList.remove("ok"); reduce?p.classList.add("ok"):later(function(){p.classList.add("ok");},(p.closest(".st-meas")?1900:500)+k*450); });
  }
  body.addEventListener("sheet:show",function(ev){
    stop(); if(io) io.disconnect();
    var root=ev.detail; if(!root) return;
    /* pasos y beneficios */
    if(!reduce&&"IntersectionObserver" in window){
      io=new IntersectionObserver(function(es){es.forEach(function(x){ if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target);} });},{root:body,threshold:.6});
      [].forEach.call(root.querySelectorAll(".sv-steps,.sv-gain"),function(el){io.observe(el);});
    }
    var cd=root.querySelector(".cd"); if(!cd) return;
    var btns=[].slice.call(cd.querySelectorAll(".cd-f")), scrs=[].slice.call(cd.querySelectorAll(".cd-scr")), desc=cd.querySelector(".cd-desc");
    function pick(k){
      stop();
      btns.forEach(function(b){var on=b.dataset.fmt===k; b.classList.toggle("on",on); b.setAttribute("aria-pressed",on?"true":"false"); if(on&&desc) desc.textContent=b.querySelector("span span").textContent;});
      scrs.forEach(function(sc){ var on=sc.dataset.scr===k; if(on){ sc.classList.remove("on"); void sc.offsetWidth; } sc.classList.toggle("on",on); if(on) run(sc); });
    }
    btns.forEach(function(b){ b.addEventListener("click",function(){pick(b.dataset.fmt);}); });
    pick(btns[0].dataset.fmt);
  });
})();

/* «Protección de datos» abre el detalle junto al formulario */
(function(){
  function openGdpr(){ if(location.hash==="#privacidad"){ var d=document.querySelector(".gdpr"); if(d) d.open=true; } }
  window.addEventListener("hashchange",openGdpr); openGdpr();
  [].forEach.call(document.querySelectorAll('a[href="#privacidad"]'),function(a){a.addEventListener("click",function(){var d=document.querySelector(".gdpr"); if(d) d.open=true;});});
})();

/* Contacto: los tres pasos se encienden al llegar */
(function(){
  var n=document.querySelector(".next"); if(!n) return;
  if(!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches){n.classList.add("in");return;}
  new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){n.classList.add("in");o.disconnect();}});},{threshold:.6}).observe(n);
})();

/* Separador entre secciones: la aguja busca el rumbo al aparecer */
(function(){
  var s=document.querySelector(".sec-wind"); if(!s) return;
  if(!("IntersectionObserver" in window)){s.classList.add("in");return;}
  new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){s.classList.add("in");o.disconnect();}});},{threshold:.6}).observe(s);
})();

/* Preguntas: la conversación aparece al llegar */
(function(){
  var a=document.querySelector(".faq-art"); if(!a) return;
  if(!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches){a.classList.add("in");return;}
  document.documentElement.classList.add("js-faq");
  new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){a.classList.add("in");o.disconnect();}});},{threshold:.4}).observe(a);
})();

/* Preguntas · «¿En cuál te ves?»: cada situación prepara el formulario y te lleva a él */
(function(){
  var box=document.querySelector(".faq-pick"); if(!box) return;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches, foot=box.querySelector(".fp-foot");
  if(!reduce&&"IntersectionObserver" in window){
    document.documentElement.classList.add("js-fp");
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){box.classList.add("in");o.disconnect();}});},{threshold:.3}).observe(box);
  }
  [].forEach.call(box.querySelectorAll(".sit"),function(b){
    b.addEventListener("click",function(){
      [].forEach.call(box.querySelectorAll(".sit"),function(x){x.classList.toggle("go",x===b);});
      /* objetivo marcado y mensaje empezado (si está vacío) */
      [].forEach.call(document.querySelectorAll('input[name="objetivos"]'),function(c){ if(c.value===b.dataset.goal) c.checked=true; });
      var msg=document.getElementById("f-msg"); if(msg&&!msg.value.trim()) msg.value=b.dataset.msg+" ";
      if(foot) foot.textContent="Te dejamos el formulario preparado ↓";
      var c=document.getElementById("contacto");
      setTimeout(function(){
        if(c) c.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
        if(window.matchMedia("(hover: hover)").matches){ var f=document.getElementById("f-name"); if(f) setTimeout(function(){f.focus({preventScroll:true});},reduce?0:800); }
      },reduce?0:350);
    });
  });
})();

/* Preguntas · «¿Qué necesita tu negocio ahora mismo?»: cada opción muestra su propia respuesta */
(function(){
  var box=document.querySelector(".faq-route"); if(!box) return;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var opts=[].slice.call(box.querySelectorAll(".fr-opt")), ans=box.querySelector(".fr-ans"), cta=box.querySelector(".fr-cta"), cur=null, t=null;
  function tpl(k){return box.querySelector('template[data-k="'+k+'"]');}
  function render(){ ans.innerHTML=cur.innerHTML; }
  function pick(k,animate){
    var next=tpl(k); if(!next||next===cur) return; cur=next;
    opts.forEach(function(o){var on=o.dataset.k===k; o.classList.toggle("on",on); o.setAttribute("aria-checked",on?"true":"false"); o.tabIndex=on?0:-1;});
    if(!animate||reduce){ render(); return; }
    /* la respuesta sale, cambia y entra; la altura se adapta sin saltos */
    clearTimeout(t); var h0=ans.offsetHeight; ans.style.height=h0+"px"; ans.classList.add("out");
    t=setTimeout(function(){
      render(); ans.style.height="auto"; var h1=ans.offsetHeight; ans.style.height=h0+"px"; void ans.offsetHeight;
      ans.style.height=h1+"px"; ans.classList.remove("out"); ans.classList.add("in");
      t=setTimeout(function(){ ans.style.height=""; ans.classList.remove("in"); },450);
    },180);
  }
  opts.forEach(function(o,i){
    o.addEventListener("click",function(){pick(o.dataset.k,true);});
    o.addEventListener("keydown",function(e){
      var d=(e.key==="ArrowDown"||e.key==="ArrowRight")?1:(e.key==="ArrowUp"||e.key==="ArrowLeft")?-1:0; if(!d) return;
      e.preventDefault(); var n=opts[(i+d+opts.length)%opts.length]; n.focus(); pick(n.dataset.k,true);
    });
  });
  /* «Cuéntanos tu idea»: formulario con el motivo ya seleccionado */
  cta.addEventListener("click",function(e){
    e.preventDefault(); if(!cur) return;
    var sel=document.getElementById("f-service"); if(sel)[].forEach.call(sel.options,function(op){ if(op.textContent===cur.dataset.service) sel.value=op.textContent; });
    [].forEach.call(document.querySelectorAll('input[name="objetivos"]'),function(c){ if(c.value===cur.dataset.goal) c.checked=true; });
    var msg=document.getElementById("f-msg"); if(msg&&!msg.value.trim()) msg.value=cur.dataset.msg+" ";
    var c=document.getElementById("contacto"); if(c) c.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
    if(window.matchMedia("(hover: hover)").matches){ var f=document.getElementById("f-name"); if(f) setTimeout(function(){f.focus({preventScroll:true});},reduce?0:800); }
  });
  pick(opts[0].dataset.k,false);
  if(!reduce&&"IntersectionObserver" in window){
    document.documentElement.classList.add("js-fr");
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){box.classList.add("in");o.disconnect();}});},{threshold:.25}).observe(box);
  }
})();

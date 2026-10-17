(function () {
  "use strict";

  /* ============ SOZLAMALAR (faqat shu qismni tahrirlang) ============ */
  var CONFIG = {
    groomName: "Nodirbek",
    brideName: "Jasminaxon",
    weddingDate: "2026-11-04",   // YYYY-MM-DD
    weddingTime: "17:00",        // HH:MM
    venueName: "Marhabo to‘yxonasi",
    venueAddress: "Jizzax viloyati, Zomin tumani",
    mapUrl: "https://yandex.ru/maps/-/CXFBVVkG",
    shareUrl: "",                // bo'sh bo'lsa avto-aniqlanadi
    coverTitle: "Nikoh to‘yiga taklif",

    // Bismillah va oyat rasmning o'zida bor, shuning uchun faqat tarjima:
    ayahTranslation: "“Uning alomatlaridan biri — sizlar taskin topishingiz uchun o‘zlaringizdan juftlar yaratgani va o‘rtangizda mehr-muhabbat hamda rahm-shafqat paydo qilganidir.”",
    ayahSource: "Rum surasi, 21-oyat",

    sweetLine: "Ikki qalbni birlashtirgan muhabbat, bir umrga bog‘lagan taqdir…",
    heading: "Nikoh to‘yimizga marhamat!",
    invitation: "Allohning izni, ota-onalarimizning duosi ila boshlanayotgan yangi hayotimiz quvonchiga sherik bo‘ling. Tashrifingiz va ezgu duolaringiz biz uchun eng go‘zal tuhfa bo‘ladi.",

    closingDua: "Alloh ushbu kunimizni xayrli va barakali qilsin.",
    closingAmin: "Omin.",
    closingWait: "Sizni intizorlik bilan kutamiz",
    signature: "Hurmat bilan, Nodirbek va Jasminaxonning ota-onalari"
  };

  /* ============ KOD ============ */
  document.documentElement.className = "js";
  var $ = function (id) { return document.getElementById(id); };
  var str = function (v) { return typeof v === "string" ? v.trim() : ""; };
  var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
  var MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  var DAYS = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];

  function put(id, value) {
    var el = $(id), v = str(value);
    if (!el || !v) return false;
    el.textContent = v; el.hidden = false; return true;
  }

  var groom = str(CONFIG.groomName), bride = str(CONFIG.brideName);
  put("kuyov", groom); put("kelin", bride);
  put("cvGroom", groom); put("cvBride", bride);
  var mono = groom && bride ? groom.charAt(0).toUpperCase() + " & " + bride.charAt(0).toUpperCase() : (groom || bride).charAt(0).toUpperCase();
  put("mono", mono); put("mono2", mono);
  var names = groom && bride ? groom + " va " + bride : (groom || bride);
  if (names) document.title = names + " | Nikoh to‘yi";

  try {
    var g = (new URLSearchParams(location.search).get("mehmon") || "").trim().slice(0, 60);
    if (g) put("guest", "Hurmatli " + g + ",");
  } catch (e) {}

  put("cvTitle", CONFIG.coverTitle);
  put("tarjima", CONFIG.ayahTranslation);
  put("manba", CONFIG.ayahSource);
  put("sweet", CONFIG.sweetLine);
  put("heading", CONFIG.heading);
  put("invite", CONFIG.invitation);
  put("dua", CONFIG.closingDua);
  put("omin", CONFIG.closingAmin);
  put("wait", CONFIG.closingWait);
  put("sign", CONFIG.signature);

  /* Sana va sanagich */
  var target = null;
  var dStr = str(CONFIG.weddingDate), tStr = str(CONFIG.weddingTime) || "00:00";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr) && /^\d{1,2}:\d{2}$/.test(tStr)) {
    var parts = tStr.split(":");
    var dt = new Date(dStr + "T" + pad(parseInt(parts[0], 10)) + ":" + pad(parseInt(parts[1], 10)));
    if (!isNaN(dt.getTime())) target = dt;
  }
  if (target) {
    put("dDay", String(target.getDate()));
    put("dMonth", MONTHS[target.getMonth()]);
    put("dYear", target.getFullYear() + "-yil");
    put("dWeek", DAYS[target.getDay()]);
    put("dTime", tStr);
    /* Taqvimga qo'shish (.ics) */
    try {
      var stamp = function (x) { return x.getFullYear() + pad(x.getMonth() + 1) + pad(x.getDate()) + "T" + pad(x.getHours()) + pad(x.getMinutes()) + "00"; };
      var esc = function (s) { return String(s || "").replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n"); };
      var venue = [str(CONFIG.venueName), str(CONFIG.venueAddress)].filter(Boolean).join(", ");
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Taklifnoma//UZ", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
        "UID:" + stamp(target) + "@taklifnoma", "DTSTAMP:" + stamp(new Date()),
        "DTSTART:" + stamp(target), "DTEND:" + stamp(new Date(target.getTime() + 5 * 3600000)),
        "SUMMARY:" + esc((names ? names + " — " : "") + "Nikoh to‘yi"),
        "LOCATION:" + esc(venue),
        "DESCRIPTION:" + esc("Nikoh to‘yiga taklif" + (str(CONFIG.mapUrl) ? "\nXarita: " + str(CONFIG.mapUrl) : "")),
        "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      $("calBtn").href = (window.URL && URL.createObjectURL) ? URL.createObjectURL(blob) : "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
      $("calBtn").hidden = false;
    } catch (e) {}
    $("secCount").hidden = false;
    tick();
    setInterval(tick, 1000);
  }
  function tick() {
    var diff = target.getTime() - Date.now();
    if (diff <= 0) {
      $("count").hidden = true;
      put("countMsg", "To‘y kuni keldi yoki o‘tib ketdi. Qatnashganlarga rahmat!");
      return;
    }
    var s = Math.floor(diff / 1000);
    $("cd").textContent = Math.floor(s / 86400);
    $("ch").textContent = pad(Math.floor((s % 86400) / 3600));
    $("cm").textContent = pad(Math.floor((s % 3600) / 60));
    $("cs").textContent = pad(s % 60);
  }

  /* Manzil */
  put("vName", CONFIG.venueName);
  put("vAddr", CONFIG.venueAddress);
  var map = str(CONFIG.mapUrl);
  if (/^https:\/\//i.test(map)) {
    $("mapBtn").href = map;
  } else if (str(CONFIG.venueName) || str(CONFIG.venueAddress)) {
    $("mapBtn").href = "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent((str(CONFIG.venueName) + " " + str(CONFIG.venueAddress)).trim());
  } else {
    $("mapBtn").hidden = true;
  }

  /* Ulashish */
  var toastEl = $("toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, 2600);
  }
  var shareUrl = str(CONFIG.shareUrl) || (location.protocol === "file:" ? location.href : location.origin + location.pathname);

  function copyFallback() {
    function done(ok) { toast(ok ? "Havola nusxalandi" : "Nusxalab bo‘lmadi."); }
    function legacy() {
      var ta = document.createElement("textarea");
      ta.value = shareUrl; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(function () { done(true); }, legacy);
    } else legacy();
  }
  $("shareBtn").addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({ title: document.title, text: "Nikoh to‘yi taklifnomasi", url: shareUrl }).catch(function (err) {
        if (err && err.name === "AbortError") return;
        copyFallback();
      });
    } else copyFallback();
  });

  /* Skroll paytida mayin chiqish */
  function startReveal() {
    var blocks = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(blocks, function (b) { b.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(blocks, function (b) { io.observe(b); });
  }

  /* Kumush zarralar */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var box = $("particles");
  if (box && !reduce) {
    for (var i = 0; i < 16; i++) {
      var sp = document.createElement("span"), sz = 2 + Math.random() * 2.5;
      sp.style.left = (Math.random() * 100) + "%";
      sp.style.top = (40 + Math.random() * 55) + "%";
      sp.style.width = sp.style.height = sz + "px";
      sp.style.animationDuration = (14 + Math.random() * 10) + "s";
      sp.style.animationDelay = (2 + Math.random() * 12) + "s";
      box.appendChild(sp);
    }
  }

  /* Animatsiyali fon: sekin tushuvchi chaqnashlar (4 qirrali yulduzcha) va gulbarglar */
  var fxCv = $("fx"), pg = $("page");
  if (fxCv && pg && !reduce) {
    var ctx = fxCv.getContext("2d"), W = 0, H = 0, ps = [], last = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var makeP = function (y) {
      var petal = Math.random() < .3;
      return { x: rnd(0, W), y: y, petal: petal, s: petal ? rnd(5, 9) : rnd(3, 7), vy: petal ? rnd(10, 22) : rnd(5, 13),
               amp: rnd(8, 24), ph: rnd(0, 6.28), sp: rnd(.25, .7), rot: rnd(0, 6.28), a: rnd(.35, .8) };
    };
    var size = function () {
      W = pg.clientWidth; H = pg.offsetHeight;
      fxCv.width = W * dpr; fxCv.height = H * dpr;
      fxCv.style.width = W + "px"; fxCv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(60, Math.round(H / 26));
      while (ps.length < n) ps.push(makeP(rnd(0, H)));
      ps.length = n;
    };
    var sparkle = function (x, y, s, a) {
      ctx.fillStyle = "rgba(112,140,196," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y);
      ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y);
      ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255," + Math.min(1, a * 1.2).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, s * .16, 0, 6.283); ctx.fill();
    };
    var petal = function (x, y, s, rot, flip, a) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(Math.max(.25, Math.abs(flip)) * .6, 1);
      var g = ctx.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, "rgba(31,53,86," + (a * .26).toFixed(3) + ")");
      g.addColorStop(1, "rgba(120,150,205," + (a * .12).toFixed(3) + ")");
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(0, -s); ctx.bezierCurveTo(s * .95, -s * .4, s * .7, s * .65, 0, s);
      ctx.bezierCurveTo(-s * .7, s * .65, -s * .95, -s * .4, 0, -s); ctx.fill();
      ctx.restore();
    };
    var frame = function (t) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = t; return; }
      var dt = Math.min((t - last) / 1000 || 0, .05); last = t;
      if (Math.abs(pg.offsetHeight - H) > 4 || pg.clientWidth !== W) size();
      var top = pg.getBoundingClientRect().top, y0 = -top - 40, y1 = -top + window.innerHeight + 40;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.y += p.vy * dt; p.ph += p.sp * dt; p.rot += dt * .5;
        if (p.y > H + 12) { p.y = -12; p.x = rnd(0, W); }
        if (p.y < y0 || p.y > y1) continue;
        var x = p.x + Math.sin(p.ph) * p.amp;
        if (p.petal) petal(x, p.y, p.s, p.rot, Math.cos(p.ph * 2), p.a);
        else {
          var tw = .5 + .5 * Math.sin(p.ph * 4);
          sparkle(x, p.y, p.s * (.55 + .45 * tw), p.a * (.35 + .65 * tw));
        }
      }
    };
    size();
    window.addEventListener("resize", size);
    requestAnimationFrame(frame);
  }

  /* Muqovani ochish */
  var cover = $("cover"), opened = false;
  $("open").addEventListener("click", function () {
    if (opened) return;
    opened = true;
    cover.classList.add("leave");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    setTimeout(startReveal, 800);
    setTimeout(function () { cover.classList.add("gone"); }, 2100);
  });
})();
/* ============================================================
   Stillwater Studio — vanilla JS
   ============================================================ */
(function () {
  "use strict";

  /* ---------- data ---------- */
  const CLASSES = [
    { name: "Slow Flow Vinyasa", level: "All levels", desc: "An unhurried vinyasa linking breath to movement. Warming, fluid and grounding.", seed: "slowflow", price: 16, dur: 60 },
    { name: "Reformer Pilates", level: "Advanced", desc: "Equipment-based pilates on the reformer. Builds deep core strength and control.", seed: "reformer", price: 22, dur: 50 },
    { name: "Mat Pilates", level: "All levels", desc: "Classical mat work for posture, stability and a strong, supple centre.", seed: "matpilates", price: 16, dur: 45 },
    { name: "Restorative Yoga", level: "Beginner", desc: "Long, supported holds with bolsters and blankets. The deepest kind of rest.", seed: "restorative", price: 16, dur: 75 },
    { name: "Power Yoga", level: "Advanced", desc: "A stronger, faster flow that builds heat, stamina and focus.", seed: "poweryoga", price: 18, dur: 60 },
    { name: "Yin & Breath", level: "Beginner", desc: "Gentle floor poses and breathwork to release tension and quiet the mind.", seed: "yinbreath", price: 16, dur: 60 }
  ];

  const SCHEDULE = [
    { day: "Mon", time: "07:00", cls: 0 },
    { day: "Mon", time: "18:30", cls: 1 },
    { day: "Tue", time: "09:30", cls: 3 },
    { day: "Tue", time: "19:00", cls: 4 },
    { day: "Wed", time: "07:00", cls: 2 },
    { day: "Wed", time: "18:00", cls: 0 },
    { day: "Thu", time: "10:00", cls: 5 },
    { day: "Thu", time: "18:30", cls: 1 },
    { day: "Fri", time: "07:30", cls: 4 },
    { day: "Sat", time: "09:00", cls: 0 },
    { day: "Sat", time: "10:30", cls: 2 },
    { day: "Sun", time: "10:00", cls: 3 }
  ];

  const DAY_FULL = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

  const INSTRUCTORS = [
    { name: "Maya Thornbury", role: "Founder · Vinyasa & Yin", seed: "maya", bio: "Maya founded Stillwater after fifteen years teaching across Bristol and Rishikesh. Her classes are slow, precise and quietly transformative." },
    { name: "Daniel Osei", role: "Reformer & Mat Pilates", seed: "daniel", bio: "A former physiotherapist, Daniel brings anatomical depth to every reformer session. Expect strong cores and patient, clear cueing." },
    { name: "Priya Raman", role: "Power & Vinyasa", seed: "priya", bio: "Priya's power classes are challenging and joyful in equal measure. She believes strength and softness are the same practice." },
    { name: "Lena Fischer", role: "Restorative & Breath", seed: "lena", bio: "Lena trained in trauma-informed yoga and breathwork. Her restorative classes are where the whole studio exhales." }
  ];

  const TESTIMONIALS = [
    { quote: "I came in with a stiff back and a busy head. Six months on, both have softened. Stillwater is the calmest hour of my week.", name: "Hannah W.", meta: "Unlimited member · 1 year", seed: "hannah", stars: 5 },
    { quote: "The teachers actually know your name and your limits. As a complete beginner I never once felt out of place.", name: "Tom R.", meta: "Eight a month · 8 months", seed: "tomr", stars: 5 },
    { quote: "The reformer classes are the best in Bristol, honestly. Daniel's cueing changed how I move entirely.", name: "Sofia L.", meta: "Unlimited member · 2 years", seed: "sofia", stars: 5 },
    { quote: "A genuinely beautiful space. Morning light, no mirrors, no pressure. I leave every class lighter.", name: "James P.", meta: "Drop-in regular", seed: "jamesp", stars: 4 },
    { quote: "I was nervous about yoga in a group. Restorative with Lena felt like being looked after. I'm hooked.", name: "Aisha K.", meta: "Eight a month · 4 months", seed: "aisha", stars: 5 },
    { quote: "Rolling membership, no contract, easy to freeze when I travel. They make it effortless to keep showing up.", name: "Marcus D.", meta: "Unlimited member · 6 months", seed: "marcusd", stars: 5 }
  ];

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  function closeNav() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- class cards ---------- */
  const classGrid = $("#classCardGrid");
  if (classGrid) {
    CLASSES.forEach(function (c) {
      const card = document.createElement("article");
      card.className = "class-card reveal";
      card.innerHTML =
        '<div class="class-card-img"><img src="https://picsum.photos/seed/sw-' + c.seed + '/600/380" alt="' + c.name + ' class in progress at Stillwater Studio" loading="lazy" width="600" height="380"></div>' +
        '<div class="class-card-body">' +
        '<span class="class-tag">' + c.level + '</span>' +
        '<h3>' + c.name + '</h3>' +
        '<p>' + c.desc + '</p>' +
        '<p class="class-card-meta">' + c.dur + ' min · from £' + c.price + '</p>' +
        '</div>';
      classGrid.appendChild(card);
    });
  }

  /* ---------- timetable ---------- */
  const ttGrid = $("#ttGrid");
  const ttEmpty = $("#ttEmpty");
  const ttCount = $("#ttCount");
  const dayFilter = $("#dayFilter");
  let activeLevel = "all";

  function renderTimetable() {
    const day = dayFilter ? dayFilter.value : "all";
    const rows = SCHEDULE.filter(function (s) {
      const c = CLASSES[s.cls];
      const dayOk = day === "all" || s.day === day;
      const lvlOk = activeLevel === "all" || c.level === activeLevel;
      return dayOk && lvlOk;
    });

    ttGrid.innerHTML = "";
    if (!rows.length) {
      ttEmpty.hidden = false;
      ttCount.textContent = "";
      return;
    }
    ttEmpty.hidden = true;
    ttCount.textContent = "Showing " + rows.length + " class" + (rows.length === 1 ? "" : "es") + ".";

    rows.forEach(function (s) {
      const c = CLASSES[s.cls];
      const card = document.createElement("div");
      card.className = "tt-card";
      card.setAttribute("role", "listitem");
      card.innerHTML =
        '<span class="tt-day">' + DAY_FULL[s.day] + ' · ' + s.time + '</span>' +
        '<span class="tt-name">' + c.name + '</span>' +
        '<span class="tt-info">' + c.dur + ' min · with ' + teacherFor(s.cls) + '<span class="tt-level">' + c.level + '</span></span>' +
        '<button class="btn btn--ghost tt-book" type="button">Book</button>';
      card.querySelector(".tt-book").addEventListener("click", function () {
        openBooking(c.name + " · " + DAY_FULL[s.day] + " " + s.time, c.price);
      });
      ttGrid.appendChild(card);
    });
  }

  function teacherFor(idx) {
    // simple stable mapping for flavour
    const map = [0, 1, 1, 3, 2, 3];
    return INSTRUCTORS[map[idx]].name.split(" ")[0];
  }

  if (dayFilter) dayFilter.addEventListener("change", renderTimetable);
  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$(".chip").forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      activeLevel = chip.dataset.level;
      renderTimetable();
    });
  });
  renderTimetable();

  /* ---------- pricing toggle ---------- */
  const billToggle = $("#billToggle");
  const billMonthlyLbl = $("#billMonthlyLbl");
  const billAnnualLbl = $("#billAnnualLbl");
  if (billToggle) {
    billToggle.addEventListener("click", function () {
      const annual = billToggle.getAttribute("aria-checked") !== "true";
      billToggle.setAttribute("aria-checked", String(annual));
      billMonthlyLbl.classList.toggle("is-active", !annual);
      billAnnualLbl.classList.toggle("is-active", annual);
      $$(".amount").forEach(function (el) {
        const v = annual ? el.dataset.annual : el.dataset.monthly;
        el.style.opacity = "0";
        setTimeout(function () {
          el.textContent = "£" + v;
          el.style.opacity = "1";
        }, 180);
      });
    });
  }

  /* ---------- instructors ---------- */
  const instGrid = $("#instGrid");
  if (instGrid) {
    INSTRUCTORS.forEach(function (i) {
      const card = document.createElement("article");
      card.className = "inst-card reveal";
      card.innerHTML =
        '<div class="inst-photo"><img src="https://picsum.photos/seed/sw-' + i.seed + '/420/420" alt="Portrait of ' + i.name + ', ' + i.role + '" loading="lazy" width="420" height="420"></div>' +
        '<div class="inst-body"><h3>' + i.name + '</h3><p class="inst-role">' + i.role + '</p><p>' + i.bio + '</p></div>';
      instGrid.appendChild(card);
    });
  }

  /* ---------- testimonials ---------- */
  const testGrid = $("#testGrid");
  function starSvg(filled) {
    return '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z" fill="' + (filled ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  }
  if (testGrid) {
    TESTIMONIALS.forEach(function (t) {
      let stars = "";
      for (let i = 0; i < 5; i++) stars += starSvg(i < t.stars);
      const card = document.createElement("article");
      card.className = "test-card reveal";
      card.innerHTML =
        '<div class="stars" role="img" aria-label="' + t.stars + ' out of 5 stars">' + stars + '</div>' +
        '<blockquote class="test-quote">' + t.quote + '</blockquote>' +
        '<div class="test-author"><span class="test-avatar"><img src="https://picsum.photos/seed/sw-' + t.seed + '/84/84" alt="" loading="lazy" width="42" height="42"></span>' +
        '<span><span class="test-name">' + t.name + '</span><br><span class="test-meta">' + t.meta + '</span></span></div>';
      testGrid.appendChild(card);
    });
  }

  /* ---------- form validation helpers ---------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setMsg(input, msg) {
    const span = document.querySelector('.field-msg[data-for="' + input.id + '"]');
    if (span) span.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validateRequired(input, label) {
    if (!input.value.trim()) { setMsg(input, "Please enter your " + label + "."); return false; }
    setMsg(input, ""); return true;
  }
  function validateEmail(input) {
    if (!input.value.trim()) { setMsg(input, "Please enter your email."); return false; }
    if (!emailRe.test(input.value.trim())) { setMsg(input, "That email does not look right."); return false; }
    setMsg(input, ""); return true;
  }

  /* ---------- newsletter ---------- */
  const newsForm = $("#newsForm");
  if (newsForm) {
    const email = $("#newsEmail");
    const err = $("#newsError");
    const ok = $("#newsSuccess");
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      ok.hidden = true;
      if (!emailRe.test(email.value.trim())) {
        err.hidden = false;
        err.textContent = "Please enter a valid email address.";
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
      }
      err.hidden = true;
      email.setAttribute("aria-invalid", "false");
      ok.hidden = false;
      newsForm.reset();
    });
  }

  /* ---------- contact ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    const name = $("#cfName"), email = $("#cfEmail"), msg = $("#cfMsg"), ok = $("#cfSuccess");
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const a = validateRequired(name, "name");
      const b = validateEmail(email);
      const c = validateRequired(msg, "message");
      if (a && b && c) {
        ok.hidden = false;
        contactForm.reset();
        ok.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        ok.hidden = true;
        (!a ? name : !b ? email : msg).focus();
      }
    });
  }

  /* ---------- booking modal ---------- */
  const modal = $("#bookingModal");
  const modalPanel = $("#modalPanel");
  const modalClose = $("#modalClose");
  const modalClassLine = $("#modalClassLine");
  const bookingForm = $("#bookingForm");
  const bookingSuccess = $("#bookingSuccess");
  const bookingSuccessLine = $("#bookingSuccessLine");
  const bookingDone = $("#bookingDone");
  let lastFocused = null;

  function openBooking(label, price) {
    lastFocused = document.activeElement;
    modalClassLine.textContent = label;
    // reset to form view
    bookingForm.hidden = false;
    bookingSuccess.hidden = true;
    bookingForm.reset();
    $$(".field-msg", bookingForm).forEach(function (s) { s.textContent = ""; });
    $$("input", bookingForm).forEach(function (i) { i.setAttribute("aria-invalid", "false"); });
    // update drop-in price label if present
    const dropOpt = bookingForm.querySelector('input[value^="Drop-in"]');
    if (dropOpt && price) {
      dropOpt.value = "Drop-in (£" + price + ")";
      dropOpt.closest(".option").querySelector("em").textContent = "£" + price;
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () { $("#bkName").focus(); }, 40);
    document.addEventListener("keydown", onModalKey);
  }

  function closeBooking() {
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
    if (lastFocused) lastFocused.focus();
  }

  function onModalKey(e) {
    if (e.key === "Escape") { closeBooking(); return; }
    if (e.key === "Tab") {
      const f = $$('button, [href], input, select, textarea', modalPanel).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  $$("[data-close]").forEach(function (el) { el.addEventListener("click", closeBooking); });
  if (modalClose) modalClose.addEventListener("click", closeBooking);
  if (bookingDone) bookingDone.addEventListener("click", closeBooking);

  // pricing "Choose plan" buttons open the modal too
  $$(".book-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openBooking("Membership: " + btn.dataset.plan, null);
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = $("#bkName"), email = $("#bkEmail");
      const a = validateRequired(name, "name");
      const b = validateEmail(email);
      const chosen = bookingForm.querySelector('input[name="option"]:checked');
      const optMsg = document.querySelector('.field-msg[data-for="bkOptions"]');
      let c = true;
      if (!chosen) { optMsg.textContent = "Please choose how you would like to pay."; c = false; }
      else { optMsg.textContent = ""; }

      if (a && b && c) {
        bookingForm.hidden = true;
        bookingSuccess.hidden = false;
        bookingSuccessLine.textContent = modalClassLine.textContent + " — booked with " + chosen.value + ".";
        bookingDone.focus();
      } else {
        (!a ? name : !b ? email : (chosen ? name : bookingForm.querySelector('input[name="option"]'))).focus();
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    // observe existing + dynamically added reveals
    function observeAll() { $$(".reveal:not(.is-visible)").forEach(function (el) { io.observe(el); }); }
    observeAll();
    // re-observe after dynamic content injection (next tick)
    setTimeout(observeAll, 60);
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

})();

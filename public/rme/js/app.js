/* RME Innovations — landing app
   Estimator, chat scaffold (Artemis/Airtable/Resend/Twilio wire-up points),
   scroll reveals, mobile nav, PWA registration. */

(() => {
  "use strict";

  document.body.classList.add("js");

  /* ================= Estimator ================= */
  // Planning assumptions — disclosed in the UI. Tune per rate-schedule data.
  const MODELS = {
    commercial: {
      rate: 0.28,          // blended $/kWh, NorCal commercial
      escalation: 0.04,    // utility rate escalation per year
      production: 1450,    // kWh per kW per year, NorCal
      costPerWatt: 2.20,   // installed, before incentives
      offset: 0.90,        // share of usage the system covers
      itc: 0.30,           // federal investment tax credit
      depreciation: 0.17,  // approx. MACRS/bonus benefit as share of gross cost
      min: 500, max: 20000, start: 4000, step: 100,
      assumptions: "Assumes a blended commercial rate of $0.28/kWh escalating 4%/yr, 1,450 kWh/kW·yr Northern California production, $2.20/W installed, 90% usage offset, 30% federal ITC, and accelerated depreciation benefit ≈17% of system cost. Planning estimate only — not a quote."
    },
    residential: {
      rate: 0.40,
      escalation: 0.04,
      production: 1450,
      costPerWatt: 2.80,
      offset: 0.90,
      itc: 0.30,
      depreciation: 0,
      min: 100, max: 1200, start: 320, step: 10,
      assumptions: "Assumes an average residential rate of $0.40/kWh escalating 4%/yr, 1,450 kWh/kW·yr Northern California production, $2.80/W installed, 90% usage offset, and the 30% federal ITC. Planning estimate only — not a quote."
    }
  };

  let mode = "commercial";

  const $ = (sel) => document.querySelector(sel);
  const slider = $("#billSlider");
  const billValue = $("#billValue");

  const fmt$ = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const fmt$k = (n) => n >= 1_000_000
    ? "$" + (n / 1_000_000).toFixed(2) + "M"
    : "$" + Math.round(n / 1000).toLocaleString("en-US") + "k";

  function compute(bill, m) {
    const monthlyKwh = bill / m.rate;
    const sizeKw = (monthlyKwh * 12 * m.offset) / m.production;
    const grossCost = sizeKw * 1000 * m.costPerWatt;
    const netCost = grossCost * (1 - m.itc - m.depreciation);
    const year1Savings = bill * 12 * m.offset;
    const payback = netCost / year1Savings;

    // 25-year picture with escalation
    let utility25 = 0, residual25 = 0;
    for (let y = 0; y < 25; y++) {
      const esc = Math.pow(1 + m.escalation, y);
      utility25 += bill * 12 * esc;                  // do nothing
      residual25 += bill * 12 * (1 - m.offset) * esc; // remaining grid usage
    }
    const solar25 = netCost + residual25;
    return { sizeKw, netCost, year1Savings, payback, utility25, solar25 };
  }

  function render() {
    if (!slider) return;
    const m = MODELS[mode];
    const bill = Number(slider.value);
    const r = compute(bill, m);

    billValue.textContent = fmt$(bill);
    const pct = ((bill - m.min) / (m.max - m.min)) * 100;
    slider.style.setProperty("--fill", pct + "%");

    $("#statSize").textContent = r.sizeKw >= 100
      ? Math.round(r.sizeKw) + " kW" : r.sizeKw.toFixed(1) + " kW";
    $("#statNet").textContent = fmt$k(r.netCost);
    $("#statYear1").textContent = fmt$k(r.year1Savings) + "/yr";
    $("#statPayback").textContent = r.payback.toFixed(1) + " yrs";

    const maxBar = Math.max(r.utility25, r.solar25);
    $("#barUtility").style.width = (r.utility25 / maxBar) * 100 + "%";
    $("#barSolar").style.width = (r.solar25 / maxBar) * 100 + "%";
    $("#numUtility").textContent = fmt$k(r.utility25);
    $("#numSolar").textContent = fmt$k(r.solar25);
    $("#numDelta").textContent = fmt$k(r.utility25 - r.solar25);

    $("#assumptions").textContent = m.assumptions;
    $("#sliderMin").textContent = fmt$(m.min);
    $("#sliderMax").textContent = fmt$(m.max);
  }

  document.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      document.querySelectorAll(".seg-btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      const m = MODELS[mode];
      slider.min = m.min; slider.max = m.max; slider.step = m.step; slider.value = m.start;
      render();
    });
  });

  if (slider) {
    slider.addEventListener("input", render);
    render();
  }

  /* ================= Chat — SMS-style journey =================
     Journey: Usage → Proposal (Artemis) → Site survey → Final design +
     financing → Install → PTO. Front-end flow only; integration wire-up
     points are artemisProposal() and sendLead():
       - Artemis (solar design)  → POST usage + address for preliminary proposal
       - Airtable                → create CRM record
       - Resend                  → transactional email to sales + prospect
       - Twilio (+ ElevenLabs)   → SMS follow-up / outbound voice agent
  */
  const chatRoot = $("#chat");
  const fab = chatRoot.querySelector(".chat-fab");
  const panel = chatRoot.querySelector(".chat-panel");
  const log = chatRoot.querySelector(".chat-log");
  const quick = chatRoot.querySelector(".chat-quick");
  const form = chatRoot.querySelector(".chat-input-row");
  const input = chatRoot.querySelector(".chat-input");
  const backBtn = chatRoot.querySelector(".chat-back");
  const proposalBtn = chatRoot.querySelector(".chat-proposal-btn");
  const journeyItems = [...chatRoot.querySelectorAll(".journey-bar li")];
  const sheet = chatRoot.querySelector(".proposal-sheet");

  const BILL_MIDPOINTS = {
    "<1000": 600, "1000-5000": 3000, "5000-15000": 10000, ">15000": 18000,
    "<200": 150, "200-400": 300, "400-700": 550, ">700": 850
  };

  const lead = { source: "rme-landing", createdAt: new Date().toISOString() };
  let step = null;
  let started = false;
  let proposal = null;
  let lastDelivered = null;

  /* --- journey --- */
  function setStage(i) {
    journeyItems.forEach((li, idx) => {
      li.classList.toggle("done", idx < i);
      li.classList.toggle("active", idx === i);
    });
  }
  setStage(0);

  /* --- message primitives --- */
  function timeNow() {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  function addDivider() {
    const d = document.createElement("div");
    d.className = "time-divider";
    d.textContent = "Today " + timeNow();
    log.appendChild(d);
  }
  function addMsg(text, who) {
    const el = document.createElement("div");
    el.className = "msg msg-" + who;
    el.textContent = text;
    log.appendChild(el);
    if (who === "user") {
      if (lastDelivered) lastDelivered.remove();
      lastDelivered = document.createElement("div");
      lastDelivered.className = "delivered";
      lastDelivered.textContent = "Delivered";
      log.appendChild(lastDelivered);
    }
    log.scrollTop = log.scrollHeight;
  }
  function botSay(text, delay = 800) {
    const t = document.createElement("div");
    t.className = "msg msg-bot msg-typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return new Promise((res) => setTimeout(() => { t.remove(); addMsg(text, "bot"); res(); }, delay));
  }
  function setQuick(options) {
    quick.innerHTML = "";
    options.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quick-btn";
      b.textContent = opt.label;
      b.addEventListener("click", () => handleAnswer(opt.value, opt.label));
      quick.appendChild(b);
    });
  }

  /* --- proposal math (same planning assumptions as the estimator) --- */
  function buildProposal() {
    const m = MODELS[lead.propertyType === "commercial" ? "commercial" : "residential"];
    const bill = BILL_MIDPOINTS[lead.monthlyBill] || 400;
    const r = compute(bill, m);
    const panels = Math.ceil((r.sizeKw * 1000) / 440);
    const production = Math.round(r.sizeKw * m.production);
    const gross = r.sizeKw * 1000 * m.costPerWatt;
    const itc = gross * m.itc;
    const dep = gross * m.depreciation;
    const apr = 0.0699 / 12, n = 300;
    const monthly = r.netCost * apr / (1 - Math.pow(1 + apr, -n));
    proposal = { bill, m, r, panels, production, gross, itc, dep, monthly };

    $("#propName").textContent = lead.name ? lead.name.split(" ")[0] : "you";
    $("#propMeta").textContent = (lead.propertyType === "commercial" ? "Commercial" : "Residential") +
      " · ZIP " + (lead.zip || "—") + " · based on ~" + fmt$(bill) + "/mo usage · " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    $("#propSize").textContent = r.sizeKw >= 100 ? Math.round(r.sizeKw) + " kW" : r.sizeKw.toFixed(1) + " kW";
    $("#propSave").textContent = fmt$k(r.utility25 - r.solar25);
    $("#propPanels").textContent = panels + " × 440W";
    $("#propProd").textContent = production.toLocaleString() + " kWh";
    $("#propGross").textContent = fmt$k(gross);
    $("#propItc").textContent = "−" + fmt$k(itc);
    $("#propDepRow").style.display = dep > 0 ? "" : "none";
    $("#propDep").textContent = "−" + fmt$k(dep);
    $("#propNet").textContent = fmt$k(r.netCost);
    $("#propPayback").textContent = r.payback.toFixed(1) + " yrs";
    $("#propMonthly").textContent = fmt$(monthly) + "/mo";
  }

  function postProposalCard() {
    const r = proposal.r;
    const card = document.createElement("div");
    card.className = "msg-proposal";
    card.innerHTML =
      '<div class="mp-head"><span class="mp-kicker">PRELIMINARY PROPOSAL · RME</span><strong>' +
      (r.sizeKw >= 100 ? Math.round(r.sizeKw) + " kW" : r.sizeKw.toFixed(1) + " kW") + " solar system</strong></div>" +
      '<div class="mp-rows">' +
      '<div class="mp-row"><span>First-year savings</span><b>' + fmt$k(r.year1Savings) + "/yr</b></div>" +
      '<div class="mp-row"><span>Net cost after incentives</span><b>' + fmt$k(r.netCost) + "</b></div>" +
      '<div class="mp-row"><span>Est. payback</span><b>' + r.payback.toFixed(1) + " yrs</b></div>" +
      '<div class="mp-row"><span>25-yr savings</span><b>' + fmt$k(r.utility25 - r.solar25) + "</b></div>" +
      "</div>" +
      '<button class="mp-cta">View full proposal</button>';
    card.querySelector(".mp-cta").addEventListener("click", openSheet);
    log.appendChild(card);
    log.scrollTop = log.scrollHeight;
  }

  /* --- Artemis stub: replace with real API at integration time ---
     POST /api/artemis/preliminary { usage, zip, propertyType } → proposal */
  function artemisProposal() {
    return new Promise((res) => setTimeout(res, 2400));
  }

  function openSheet() {
    sheet.hidden = false;
  }
  function closeSheet() {
    sheet.hidden = true;
  }
  sheet.querySelector(".prop-close").addEventListener("click", closeSheet);
  sheet.querySelector(".prop-questions").addEventListener("click", async () => {
    closeSheet();
    await botSay("Ask away — and anything I can't answer, your specialist covers on the survey call. Nothing is locked in until you sign the final design.");
  });
  sheet.querySelector(".prop-accept").addEventListener("click", () => {
    closeSheet();
    handleAnswer("accept", "Let's schedule the site survey ✓");
  });
  proposalBtn.addEventListener("click", openSheet);

  /* --- flow --- */
  async function startFlow(track) {
    if (started) return;
    started = true;
    lead.entryPoint = track || "chat-fab";
    addDivider();
    await botSay("Hey! This is the RME Solar team in Rocklin ☀ (licensed, CSLB #1077450). I can get you real numbers in about a minute.", 900);
    await botSay("Is this for a business property or your home?");
    step = "type";
    setQuick([
      { label: "🏭 Business / commercial", value: "commercial" },
      { label: "🏡 My home", value: "residential" }
    ]);
  }

  async function handleAnswer(value, label) {
    addMsg(label || value, "user");
    quick.innerHTML = "";

    switch (step) {
      case "type":
        lead.propertyType = value;
        step = "name";
        await botSay(value === "commercial"
          ? "Great — commercial is our specialty. Who am I texting with?"
          : "Perfect. Who am I texting with?");
        break;

      case "name":
        lead.name = value;
        step = "zip";
        await botSay("Thanks, " + value.split(" ")[0] + "! What's the property ZIP? (We cover the Bay Area to Yuba County, out to Auburn and Colfax, down to Napa.)");
        break;

      case "zip":
        lead.zip = value;
        step = "bill";
        await botSay("Got it. Roughly, what's the average monthly electric bill there? Ballpark is fine — this drives your system size.");
        setQuick(lead.propertyType === "commercial"
          ? [
              { label: "Under $1,000", value: "<1000" },
              { label: "$1,000–$5,000", value: "1000-5000" },
              { label: "$5,000–$15,000", value: "5000-15000" },
              { label: "Over $15,000", value: ">15000" }
            ]
          : [
              { label: "Under $200", value: "<200" },
              { label: "$200–$400", value: "200-400" },
              { label: "$400–$700", value: "400-700" },
              { label: "Over $700", value: ">700" }
            ]);
        break;

      case "bill":
        lead.monthlyBill = value;
        step = "contact";
        await botSay("And the best phone or email for your numbers? A real " +
          (lead.propertyType === "commercial" ? "commercial specialist" : "home energy specialist") +
          " follows up personally — usually same day.");
        break;

      case "contact":
        lead.contact = value;
        step = "proposal";
        await sendLead(lead);
        setStage(1);
        await botSay("Perfect — running your numbers now. Give me a few seconds…", 700);
        await artemisProposal();
        buildProposal();
        proposalBtn.hidden = false;
        await botSay("Done ✓ Here's your preliminary proposal, " + (lead.name ? lead.name.split(" ")[0] : "") + ":", 600);
        postProposalCard();
        await botSay("Tap the card for the full breakdown — it stays pinned up top ↑ whenever you want it. If the numbers look right, the next step is a free site survey: we come out, look at the roof and panel, and turn this into an engineered design.", 1000);
        setQuick([
          { label: "✓ Looks good — schedule my survey", value: "accept" },
          { label: "I have questions", value: "questions" }
        ]);
        break;

      case "proposal":
        if (value === "accept") {
          step = "survey";
          setStage(2);
          await botSay("Love it. When's easiest for a quick site visit?");
          setQuick([
            { label: "Weekday mornings", value: "weekday-am" },
            { label: "Weekday afternoons", value: "weekday-pm" },
            { label: "Weekends", value: "weekend" }
          ]);
        } else {
          await botSay("Totally fair — what's on your mind? I'll answer what I can, and your specialist covers the rest. Nothing is locked in until you sign the final design.");
        }
        break;

      case "survey":
        lead.surveyWindow = value;
        step = "done";
        await sendLead(lead);
        setStage(3);
        await botSay("Booked as a preference ✓ Your specialist will text you to lock the exact time.", 900);
        await botSay("Here's the road from here: after the survey we finalize your design + financing (own it or finance it — your call), then our licensed crew installs, and PTO — permission to operate — is when the utility flips your system live. We handle every permit and form in between.", 1300);
        await botSay("Watch the progress bar up top — it moves with you the whole way. Talk soon, " + (lead.name ? lead.name.split(" ")[0] : "") + "! ☀");
        setQuick([{ label: "📄 View my proposal", value: "view" }]);
        break;

      case "done":
        if (value === "view") { openSheet(); }
        else { await botSay("I've flagged that for your specialist — you'll hear back shortly. Anything else, just text me here."); }
        setQuick([{ label: "📄 View my proposal", value: "view" }]);
        break;

      default:
        await botSay("A specialist can answer that better than I can — leave a phone or email and we'll get right back to you.");
        step = "contact";
    }
  }

  /* Integration wire-up point — replace with real endpoints at deploy.
     Planned chain:
       1. POST https://hooks.example/artemis   (preliminary design from usage)
       2. POST https://hooks.example/airtable  (CRM record)
       3. POST https://hooks.example/resend    (email to sales + prospect)
       4. POST https://hooks.example/twilio    (SMS confirm; ElevenLabs voice follow-up)
  */
  async function sendLead(data) {
    try {
      const stash = JSON.parse(localStorage.getItem("rme_leads") || "[]");
      stash.push(JSON.parse(JSON.stringify(data)));
      localStorage.setItem("rme_leads", JSON.stringify(stash));
      console.info("[RME] lead captured (localStorage stub):", data);
    } catch (e) {
      console.warn("[RME] lead stash failed", e);
    }
  }

  function openChat(track) {
    panel.hidden = false;
    document.body.classList.add("chat-open");
    fab.setAttribute("aria-expanded", "true");
    startFlow(track);
    if (window.matchMedia("(min-width: 641px)").matches) input.focus();
  }
  function closeChat() {
    panel.hidden = true;
    document.body.classList.remove("chat-open");
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", () => (panel.hidden ? openChat() : closeChat()));
  backBtn.addEventListener("click", closeChat);

  document.querySelectorAll("[data-open-chat]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openChat(a.dataset.track);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    if (!started) startFlow("typed");
    else handleAnswer(v);
  });

  /* ================= Header scroll state ================= */
  const header = document.getElementById("siteHeader");
  const onScrollHeader = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ================= Count-up counters ================= */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      counterIO.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
      const t0 = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".count").forEach((el) => counterIO.observe(el));

  /* ================= Parallax on photo bands ================= */
  const pxEls = [...document.querySelectorAll("[data-parallax]")];
  if (pxEls.length && !reduceMotion) {
    let ticking = false;
    const updateParallax = () => {
      ticking = false;
      const vh = window.innerHeight;
      pxEls.forEach((wrap) => {
        const r = wrap.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height); // -0.5..0.5
        const img = wrap.querySelector("img");
        if (img) img.style.transform = "translateY(" + (progress * -7) + "%) scale(1.06)";
      });
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
    }, { passive: true });
    updateParallax();
  }

  /* ================= Scroll reveals ================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px 120px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ================= Mobile nav ================= */
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  toggle.addEventListener("click", () => {
    const open = !mobileNav.hidden;
    mobileNav.hidden = open;
    toggle.setAttribute("aria-expanded", String(!open));
  });
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileNav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ================= PWA ================= */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/rme/sw.js").catch((e) =>
        console.warn("[RME] SW registration failed", e));
    });
  }
})();

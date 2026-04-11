// ============================================================
// WEBHOOK — غيّر هنا فقط
// ============================================================
const WEBHOOK_URL = "https://lachelle-sigillary-lala.ngrok-free.dev/webhook-test/CashLedger";
// ============================================================

const T = {
  ar: {
    dir:"rtl",lang:"ar",
    title:"نظام إدارة العهدة",subtitle:"سجّل عمليات العهدة المالية بدقة واحترافية",
    balance:"الرصيد الحالي",sar:"ريال",
    receive:"استلام عهدة",disburse:"صرف عهدة",
    receiveDesc:"يزيد الرصيد",disburseDesc:"ينقص الرصيد",
    amount:"المبلغ (ريال سعودي)",amountPlaceholder:"أدخل المبلغ",
    description:"وصف العملية",descPlaceholder:"اكتب وصفاً...",
    date:"تاريخ اليوم",
    enablePhotos:"تفعيل إضافة الصور",
    uploadHint:"اضغط أو اسحب لرفع الصور",uploadSub:"PNG, JPG, WEBP — حتى 5MB",
    imageUrl:"رابط الصورة",copyLink:"نسخ",
    submit:"تأكيد العملية",sending:"جاري الإرسال...",
    successTitle:"تمت العملية بنجاح!",successSub:"تم تسجيل العملية وإرسالها بنجاح",
    newOp:"عملية جديدة",progress:"اكتمال النموذج",
    uploaded:"تم الحفظ",errorSend:"حدث خطأ أثناء الإرسال",
    balanceAfter:"الرصيد بعد العملية",imgCopied:"تم نسخ الرابط",
    section1:"العملية المالية",section2:"بيانات العملية",section3:"الصور والمرفقات",
    noPhotosNeeded:"لا حاجة لإضافة صور لهذه العملية",
  },
  en: {
    dir:"ltr",lang:"en",
    title:"Custody Management System",subtitle:"Record financial custody operations accurately",
    balance:"Current Balance",sar:"SAR",
    receive:"Receive Custody",disburse:"Disburse Custody",
    receiveDesc:"Increases Balance",disburseDesc:"Decreases Balance",
    amount:"Amount (SAR)",amountPlaceholder:"Enter amount",
    description:"Description",descPlaceholder:"Describe the operation...",
    date:"Today's Date",
    enablePhotos:"Enable Photo Uploads",
    uploadHint:"Click or drag to upload photos",uploadSub:"PNG, JPG, WEBP — up to 5MB",
    imageUrl:"Image URL",copyLink:"Copy",
    submit:"Confirm Operation",sending:"Sending...",
    successTitle:"Operation Completed!",successSub:"Operation recorded and submitted",
    newOp:"New Operation",progress:"Form Completion",
    uploaded:"Saved",errorSend:"An error occurred",
    balanceAfter:"Balance After Operation",imgCopied:"Link copied",
    section1:"Financial Operation",section2:"Operation Details",section3:"Photos & Attachments",
    noPhotosNeeded:"No photos needed for this operation",
  },
  ur: {
    dir:"rtl",lang:"ur",
    title:"تحویل مینجمنٹ سسٹم",subtitle:"مالی تحویل کے عمل کو درست طریقے سے ریکارڈ کریں",
    balance:"موجودہ بیلنس",sar:"ریال",
    receive:"تحویل وصول کریں",disburse:"تحویل ادا کریں",
    receiveDesc:"بیلنس بڑھتا ہے",disburseDesc:"بیلنس گھٹتا ہے",
    amount:"رقم (سعودی ریال)",amountPlaceholder:"رقم درج کریں",
    description:"تفصیل",descPlaceholder:"تفصیل لکھیں...",
    date:"آج کی تاریخ",
    enablePhotos:"تصاویر شامل کریں",
    uploadHint:"تصاویر اپلوڈ کرنے کے لیے کلک کریں",uploadSub:"PNG, JPG, WEBP — 5MB تک",
    imageUrl:"تصویر کا لنک",copyLink:"کاپی",
    submit:"آپریشن کی تصدیق کریں",sending:"بھیجا جا رہا ہے...",
    successTitle:"آپریشن مکمل ہو گیا!",successSub:"آپریشن کامیابی سے ریکارڈ ہو گیا",
    newOp:"نیا آپریشن",progress:"فارم تکمیل",
    uploaded:"محفوظ",errorSend:"بھیجنے میں خطا",
    balanceAfter:"آپریشن کے بعد بیلنس",imgCopied:"لنک کاپی ہو گیا",
    section1:"مالی آپریشن",section2:"آپریشن کی تفصیلات",section3:"تصاویر و منسلکات",
    noPhotosNeeded:"اس آپریشن کے لیے تصاویر کی ضرورت نہیں",
  },
};

// ── State ─────────────────────────────────────────────────
let lang = "ar", t = T.ar;
let balance = 0;
let opType = null;
let photosOn = false;
let imgs = [];
let ledger = [];
try { ledger = JSON.parse(localStorage.getItem("braveLedger") || "[]"); } catch(e) {}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyLang("ar");
  document.getElementById("opDate").value = today();
  bind();
  rebuildBalance();
  renderLedger();
  animateIn();
});

function today() { return new Date().toISOString().split("T")[0]; }

// ── Stagger animation ─────────────────────────────────────
function animateIn() {
  const els = document.querySelectorAll(".hero-card, .card, .submit-wrap, .ledger");
  els.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = `opacity .5s ${i*55}ms ease, transform .5s ${i*55}ms cubic-bezier(.4,0,.2,1)`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }));
  });
}

// ── Language ──────────────────────────────────────────────
function applyLang(l) {
  lang = l; t = T[l];
  document.documentElement.setAttribute("dir", t.dir);
  document.documentElement.setAttribute("lang", t.lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (t[k] !== undefined) el.textContent = t[k];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const k = el.getAttribute("data-i18n-placeholder");
    if (t[k] !== undefined) el.placeholder = t[k];
  });
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.lang === l));
  updatePreview();
}

// ── Bind events ───────────────────────────────────────────
function bind() {
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.addEventListener("click", () => applyLang(b.dataset.lang)));

  document.querySelectorAll(".op-card").forEach(c =>
    c.addEventListener("click", () => pickOp(c.dataset.type)));

  const tog   = document.getElementById("photosToggle");
  const sec   = document.getElementById("uploadSection");
  const noMsg = document.getElementById("noPhotosMsg");
  tog.addEventListener("change", () => {
    photosOn = tog.checked;
    if (photosOn) { noMsg.classList.add("hidden"); sec.classList.remove("hidden"); }
    else          { noMsg.classList.remove("hidden"); sec.classList.add("hidden"); }
    updateProgress();
  });

  const zone = document.getElementById("uploadZone");
  const fi   = document.getElementById("fileInput");
  zone.addEventListener("click", () => fi.click());
  zone.addEventListener("dragover",  e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("drag-over"); addFiles(e.dataTransfer.files); });
  fi.addEventListener("change", () => { addFiles(fi.files); fi.value = ""; });

  document.getElementById("amount").addEventListener("input", () => { updateProgress(); updatePreview(); });
  document.getElementById("description").addEventListener("input", updateProgress);
  document.getElementById("submitBtn").addEventListener("click", doSubmit);
  document.getElementById("newOpBtn").addEventListener("click", resetForm);
}

// ── Op select ─────────────────────────────────────────────
function pickOp(type) {
  opType = type;
  document.querySelectorAll(".op-card").forEach(c => {
    const sel = c.dataset.type === type;
    if (sel && !c.classList.contains("selected")) {
      c.classList.add("selected");
      c.animate([{transform:"scale(1)"},{transform:"scale(1.04)"},{transform:"scale(1)"}],
        {duration:280, easing:"cubic-bezier(.34,1.56,.64,1)"});
    } else if (!sel) c.classList.remove("selected");
  });
  updatePreview(); updateProgress();
}

function updatePreview() {
  const amt = parseFloat(document.getElementById("amount")?.value) || 0;
  const el  = document.getElementById("balancePreview");
  if (!el) return;
  let nb = balance;
  if (opType === "receive")  nb = balance + amt;
  if (opType === "disburse") nb = balance - amt;
  el.textContent = fmt(nb) + " " + t.sar;
  el.classList.toggle("negative", nb < 0);
}

function updateProgress() {
  const pct = Math.round(
    [opType !== null, parseFloat(document.getElementById("amount")?.value) > 0]
    .filter(Boolean).length / 2 * 100);
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressPct").textContent = pct + "%";
}

// ── Upload ────────────────────────────────────────────────
function addFiles(files) {
  [...files].forEach(f => {
    if (!f.type.startsWith("image/")) return;
    if (f.size > 5*1024*1024) { showToast("الصورة أكبر من 5MB", "error"); return; }
    addImg(f);
  });
}

async function addImg(file) {
  const id       = "i_" + Date.now() + "_" + Math.random().toString(36).slice(2,6);
  const localUrl = URL.createObjectURL(file);

  // Convert to base64 for sending to n8n
  const base64full = await toBase64(file);
  const base64data = base64full.split(",")[1]; // strip data:image/...;base64,

  imgs.push({ id, url: localUrl, name: file.name,
              base64: base64data, mimeType: file.type });

  const list = document.getElementById("imageList");
  const item = document.createElement("div");
  item.className = "img-item"; item.id = id;
  item.innerHTML = `
    <div class="img-thumb" style="background-image:url('${localUrl}')"></div>
    <div class="img-info">
      <span class="img-name">${file.name}</span>
      <span class="img-status">✅ ${t.uploaded} — سيُرفع عند الإرسال</span>
    </div>
    <button class="del-btn" onclick="removeImg('${id}')">✕</button>`;
  list.appendChild(item);

  const zone = document.getElementById("uploadZone");
  zone.classList.add("done");
  setTimeout(() => zone.classList.remove("done"), 1200);
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function removeImg(id) {
  imgs = imgs.filter(i => i.id !== id);
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = "opacity .2s, transform .2s, max-height .25s";
  el.style.opacity = "0"; el.style.transform = "translateX(12px)";
  el.style.maxHeight = el.offsetHeight + "px";
  requestAnimationFrame(() => { el.style.maxHeight = "0"; el.style.margin = "0"; el.style.padding = "0"; });
  setTimeout(() => el.remove(), 280);
}

function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => showToast(t.imgCopied));
}

// ── Validate ──────────────────────────────────────────────
function validate() {
  let ok = true;
  if (!opType) { shake("section1"); ok = false; }
  const a = document.getElementById("amount");
  if (!(parseFloat(a.value) > 0)) { shake(a); ok = false; }
  return ok;
}

function shake(t) {
  const el = typeof t === "string" ? document.getElementById(t) : t;
  el.classList.remove("shake"); void el.offsetWidth;
  el.classList.add("shake"); setTimeout(() => el.classList.remove("shake"), 600);
}

// ── Submit ────────────────────────────────────────────────
async function doSubmit() {
  if (!validate()) return;
  const btn = document.getElementById("submitBtn");
  btn.disabled = true; btn.classList.add("loading");
  btn.querySelector(".btn-txt").textContent = t.sending;

  const amount = parseFloat(document.getElementById("amount").value);
  const desc   = document.getElementById("description").value;
  const date   = document.getElementById("opDate").value;
  const bBefore = balance;
  const bAfter  = opType === "receive" ? balance + amount : balance - amount;

  // Send images as base64 so n8n can upload them to Google Drive
  const imageFiles = imgs.map(i => ({
    name:     i.name,
    mimeType: i.mimeType,
    base64:   i.base64,
  }));

  const payload = { operationType: opType, amount, description: desc, date,
    photosEnabled: photosOn,
    imageFiles,                    // base64 images for n8n → Drive
    balanceBefore: bBefore, balanceAfter: bAfter,
    lang, timestamp: new Date().toISOString() };

  try {
    if (opType === "receive") balance += amount;
    else balance -= amount;

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain", "ngrok-skip-browser-warning": "true" },
      body: JSON.stringify(payload), mode: "no-cors",
    }).catch(() => {});

    addToLedger({ operationType: opType, amount, description: desc, date,
      imageUrls: imgs.map(i => i.url),
      balanceBefore: bBefore, balanceAfter: bAfter,
      timestamp: payload.timestamp });

    showSuccess(payload);
  } catch(err) {
    if (opType === "receive") balance -= amount; else balance += amount;
    showToast(t.errorSend, "error");
    btn.disabled = false; btn.classList.remove("loading");
    btn.querySelector(".btn-txt").textContent = t.submit;
  }
}

function showSuccess(payload) {
  const form = document.getElementById("formContent");
  const succ = document.getElementById("successScreen");
  form.style.transition = "opacity .3s, transform .3s";
  form.style.opacity = "0"; form.style.transform = "translateY(-10px)";
  setTimeout(() => {
    form.classList.add("hidden"); form.style.opacity = ""; form.style.transform = "";
    succ.classList.remove("hidden");
    succ.style.opacity = "0"; succ.style.transform = "translateY(14px)";
    succ.style.transition = "opacity .4s ease, transform .4s cubic-bezier(.34,1.56,.64,1)";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      succ.style.opacity = "1"; succ.style.transform = "translateY(0)";
    }));
    document.getElementById("finalBalance").textContent = fmt(payload.balanceAfter) + " " + t.sar;
    document.getElementById("finalBalance").classList.toggle("negative", payload.balanceAfter < 0);
    document.getElementById("balanceAmount").textContent = fmt(balance);
    document.getElementById("balanceDisplay").classList.toggle("negative-balance", balance < 0);
    launchConfetti();
  }, 280);
}

function resetForm() {
  opType = null; photosOn = false; imgs = [];
  const succ = document.getElementById("successScreen");
  const form = document.getElementById("formContent");
  succ.style.transition = "opacity .22s"; succ.style.opacity = "0";
  setTimeout(() => {
    succ.classList.add("hidden"); succ.style.opacity = "";
    form.classList.remove("hidden");
    form.style.opacity = "0"; form.style.transform = "translateY(10px)";
    form.style.transition = "opacity .35s ease, transform .35s cubic-bezier(.4,0,.2,1)";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      form.style.opacity = "1"; form.style.transform = "translateY(0)";
    }));
  }, 240);
  document.querySelectorAll(".op-card").forEach(c => c.classList.remove("selected"));
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("photosToggle").checked = false;
  document.getElementById("uploadSection").classList.add("hidden");
  document.getElementById("noPhotosMsg").classList.remove("hidden");
  document.getElementById("imageList").innerHTML = "";
  const btn = document.getElementById("submitBtn");
  btn.disabled = false; btn.classList.remove("loading");
  btn.querySelector(".btn-txt").textContent = t.submit;
  document.getElementById("opDate").value = today();
  updateProgress(); updatePreview();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Ledger ────────────────────────────────────────────────
function rebuildBalance() {
  balance = ledger.reduce((a, r) =>
    r.operationType === "receive" ? a + r.amount : a - r.amount, 0);
  document.getElementById("balanceAmount").textContent = fmt(balance);
}

function addToLedger(entry) {
  ledger.push(entry);
  try { localStorage.setItem("braveLedger", JSON.stringify(ledger)); } catch(e) {}
  renderLedger();
  setTimeout(() =>
    document.getElementById("ledgerSection")
      .scrollIntoView({ behavior: "smooth", block: "nearest" }), 500);
}

function clearLedger() {
  if (!confirm("هل تريد مسح كل السجل؟")) return;
  ledger = []; balance = 0;
  try { localStorage.removeItem("braveLedger"); } catch(e) {}
  document.getElementById("balanceAmount").textContent = "0.00";
  renderLedger();
}

function renderLedger() {
  const tbody = document.getElementById("ledgerBody");
  const empty = document.getElementById("ledgerEmpty");

  let tR = 0, tD = 0;
  ledger.forEach(r => r.operationType === "receive" ? (tR += r.amount) : (tD += r.amount));
  document.getElementById("totalReceive").textContent  = fmt(tR);
  document.getElementById("totalDisburse").textContent = fmt(tD);
  const b = tR - tD;
  const bEl = document.getElementById("ledgerBalance");
  bEl.textContent = fmt(b); bEl.classList.toggle("neg", b < 0);
  const badge = document.getElementById("ledgerCount");
  badge.textContent = ledger.length;
  badge.classList.remove("bump");
  requestAnimationFrame(() => badge.classList.add("bump"));

  [...tbody.querySelectorAll("tr:not(#ledgerEmpty)")].forEach(r => r.remove());

  if (!ledger.length) { empty.style.display = ""; return; }
  empty.style.display = "none";

  let run = 0;
  ledger.forEach((row, i) => {
    run = row.operationType === "receive" ? run + row.amount : run - row.amount;
    const isR = row.operationType === "receive";
    const imgHtml = row.imageUrls?.filter(u => u).length
      ? row.imageUrls.filter(u => u).map(u =>
          `<a href="${u}" target="_blank" class="img-link">🔗</a>`).join("")
      : "—";

    const tr = document.createElement("tr");
    tr.className = isR ? "tr-receive" : "tr-disburse";
    tr.style.opacity = "0";
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.date || "—"}</td>
      <td><span class="badge ${isR ? "badge-r" : "badge-d"}">${isR ? "📥 استلام" : "📤 صرف"}</span></td>
      <td class="${isR ? "td-amt-r" : "td-amt-d"}">${fmt(row.amount)}</td>
      <td class="td-desc">${row.description || "—"}</td>
      <td>${imgHtml}</td>
      <td class="td-bal ${run < 0 ? "neg" : ""}">${fmt(run)}</td>`;
    tbody.appendChild(tr);

    // Stagger row animation
    setTimeout(() => {
      tr.style.transition = "opacity .3s ease, transform .3s cubic-bezier(.4,0,.2,1)";
      tr.style.opacity = "1";
    }, 40 * i);
  });
}

// ── Confetti ──────────────────────────────────────────────
function launchConfetti() {
  const c = document.getElementById("confettiCanvas");
  const ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight; c.style.display = "block";
  const cols = ["#FF6B00","#FFB347","#1A1208","#fff","#FF9A3C","#FFD580"];
  const ps = Array.from({length:130}, () => ({
    x:Math.random()*c.width, y:-10-Math.random()*200,
    r:4+Math.random()*8, d:1+Math.random()*3,
    color:cols[~~(Math.random()*cols.length)],
    tilt:Math.random()*10-5, ta:0, ts:.1+Math.random()*.3,
  }));
  let f = 0;
  (function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{
      ctx.beginPath(); ctx.lineWidth=p.r; ctx.strokeStyle=p.color;
      ctx.moveTo(p.x+p.tilt+p.r/4,p.y); ctx.lineTo(p.x+p.tilt,p.y+p.tilt+p.r/4); ctx.stroke();
      p.y+=p.d; p.ta+=p.ts; p.tilt=Math.sin(p.ta)*12;
      if(p.y>c.height){p.y=-10;p.x=Math.random()*c.width;}
    });
    if(++f<200) requestAnimationFrame(draw);
    else{ ctx.clearRect(0,0,c.width,c.height); c.style.display="none"; }
  })();
}

// ── Helpers ───────────────────────────────────────────────
function fmt(n) {
  return Number(n).toLocaleString("ar-SA", {minimumFractionDigits:2, maximumFractionDigits:2});
}
function showToast(msg, type="success") {
  const el = document.getElementById("toast");
  el.textContent = msg; el.className = "toast show " + type;
  setTimeout(() => el.classList.remove("show"), 3500);
}

// Cloud sync for kit.js progress stores. Include as a module after kit.js; shows a login line in #cloud.
import * as C from "./cloud.js?v=18";
const AC = window.AC, box = document.getElementById("cloud");
let user = null; const timers = {};
function merge(a, b) { const o = Object.assign({}, a); for (const k in b) { if (!o[k] || (b[k][1] || 0) > (o[k][1] || 0)) o[k] = b[k]; } return o; }
function render(msg) { if (!box || !C.enabled) { if (box) box.innerHTML = ""; return; }
  if (!user) { box.innerHTML = '☁️ প্রগ্রেস সব ডিভাইসে রাখতে <button class="btn" id="si">Google দিয়ে লগইন করুন</button>';
    document.getElementById("si").onclick = () => C.signIn().catch(() => {}); return; }
  box.innerHTML = msg || "☁️ প্রগ্রেস আপনার অ্যাকাউন্টে সেভ হচ্ছে"; }
AC.onStoreChange = s => { if (!user) return; clearTimeout(timers[s.name]);
  timers[s.name] = setTimeout(async () => { try { await C.saveProg(user, s.name, s.d); render(); }
    catch (e) { console.warn(e); render("⚠️ ক্লাউডে সেভ হয়নি, এই ডিভাইসে আছে"); } }, 1500); };
AC.cloud = C;
render();
if (C.enabled) C.onUser(async u => { if (u && u.cached) return; user = u || null; render(); AC.user = user;
  if (AC.onUser) AC.onUser(user);
  if (!user) return;
  for (const name in AC.stores) { const s = AC.stores[name];
    try { const c = await C.loadProg(user, name) || {}; const m = merge(s.d, c); s.apply(m);
      if (JSON.stringify(m) !== JSON.stringify(c)) await C.saveProg(user, name, m); } catch (e) { console.warn(e); } } });

// Shared login + progress sync for Accent Coach (Firebase Auth + Firestore).
import { firebaseConfig, ADMIN_UID, APPCHECK_SITE_KEY } from "./firebase-config.js?v=9";
const V = "10.12.2", G = "https://www.gstatic.com/firebasejs/" + V + "/";
let F = null, ready = null;

export const enabled = !!firebaseConfig;

export function init() {
  if (!enabled) return Promise.resolve(null);
  if (ready) return ready;
  ready = Promise.all([import(G + "firebase-app.js"), import(G + "firebase-auth.js"), import(G + "firebase-firestore-lite.js")])
    .then(async ([app, auth, fs]) => {
      const a = app.initializeApp(firebaseConfig);
      if (APPCHECK_SITE_KEY) {
        try {
          const ac = await import(G + "firebase-app-check.js");
          ac.initializeAppCheck(a, { provider: new ac.ReCaptchaEnterpriseProvider(APPCHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
        } catch (e) { console.warn("App Check not started", e); }
      }
      F = { auth: auth.getAuth(a), db: fs.getFirestore(a), A: auth, S: fs };
      return F;
    });
  return ready;
}

export async function onUser(cb) {
  const f = await init(); if (!f) { cb(null); return; }
  f.A.onAuthStateChanged(f.auth, u => cb(u));
}
export async function signIn() {
  const f = await init(); if (!f) return null;
  const p = new f.A.GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
  try { return (await f.A.signInWithPopup(f.auth, p)).user; }
  catch (e) { if (e && /popup/.test(e.code || "")) { await f.A.signInWithRedirect(f.auth, p); return null; } throw e; }
}
export async function signOutUser() { const f = await init(); if (f) await f.A.signOut(f.auth); }
export const isAdmin = u => !!u && u.uid === ADMIN_UID;

// ---------- progress helpers ----------
export const today = () => new Date().toLocaleDateString("en-CA");
function addDays(s, n) { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-CA"); }
export function streakOf(doneAt) {
  const ds = [...new Set(Object.values(doneAt || {}))].sort();
  if (!ds.length) return { streak: 0, best: 0, last: null };
  let best = 1, run = 1;
  for (let i = 1; i < ds.length; i++) { run = ds[i] === addDays(ds[i - 1], 1) ? run + 1 : 1; best = Math.max(best, run); }
  const last = ds[ds.length - 1], t = today();
  let streak = 0;
  if (last === t || last === addDays(t, -1)) { streak = 1; for (let i = ds.length - 1; i > 0 && ds[i - 1] === addDays(ds[i], -1); i--) streak++; }
  return { streak, best, last };
}
export function merge(local, cloud) {
  local = local || { day: 1, step: 0, done: {} }; if (!cloud) return local;
  const done = Object.assign({}, cloud.done || {}, local.done || {});
  const doneAt = Object.assign({}, cloud.doneAt || {}, local.doneAt || {});
  const useCloud = (cloud.day || 1) > (local.day || 1);
  return Object.assign({}, local, { done, doneAt, day: useCloud ? cloud.day : (local.day || 1), step: useCloud ? (cloud.step || 0) : (local.step || 0), showOnBoard: cloud.showOnBoard !== false });
}
export async function loadProgress(u) {
  const f = await init(); if (!f || !u) return null;
  const s = await f.S.getDoc(f.S.doc(f.db, "users", u.uid));
  return s.exists() ? s.data() : null;
}
export async function saveProgress(u, st) {
  const f = await init(); if (!f || !u) return;
  const { streak, best, last } = streakOf(st.doneAt);
  const daysDone = Object.keys(st.done || {}).filter(k => st.done[k]).length;
  const S = f.S, ref = S.doc(f.db, "users", u.uid);
  const data = {
    name: u.displayName || "", email: u.email || "", photo: u.photoURL || "",
    day: Math.min(30, Math.max(1, st.day | 0 || 1)), step: st.step | 0, done: st.done || {}, doneAt: st.doneAt || {},
    streak, best, lastPractice: last || "", daysDone, showOnBoard: st.showOnBoard !== false, updatedAt: S.serverTimestamp()
  };
  const ex = await S.getDoc(ref);
  if (!ex.exists()) data.createdAt = S.serverTimestamp();
  await S.setDoc(ref, data, { merge: true });
  const bref = S.doc(f.db, "board", u.uid);
  if (data.showOnBoard && daysDone > 0) await S.setDoc(bref, { name: (u.displayName || "Learner").split(" ")[0] || "Learner", daysDone, streak, updatedAt: S.serverTimestamp() });
  else await S.deleteDoc(bref).catch(() => {});
}
export async function listUsers() {
  const f = await init(); const S = f.S;
  const q = await S.getDocs(S.collection(f.db, "users"));
  return q.docs.map(d => Object.assign({ uid: d.id }, d.data()));
}
export async function listBoard() {
  const f = await init(); if (!f) return [];
  const S = f.S;
  const q = await S.getDocs(S.query(S.collection(f.db, "board"), S.orderBy("daysDone", "desc"), S.limit(100)));
  return q.docs.map(d => Object.assign({ uid: d.id }, d.data())).sort((a, b) => b.daysDone - a.daysDone || b.streak - a.streak);
}

// ---------- daily reminder (free: calendar event) ----------
export function reminderLinks(hhmm) {
  const [h, m] = (hhmm || "20:00").split(":").map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1);
  const p = n => String(n).padStart(2, "0");
  const s = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(h)}${p(m)}00`;
  const e2 = new Date(d.getTime() + 40 * 60000);
  const e = `${e2.getFullYear()}${p(e2.getMonth() + 1)}${p(e2.getDate())}T${p(e2.getHours())}${p(e2.getMinutes())}00`;
  const url = "https://md-al-mamun22.github.io/accent-coach/app.html";
  const title = "Accent Coach: 40-minute practice", det = "Time for today's English practice: " + url;
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Accent Coach//EN", "BEGIN:VEVENT", "UID:accent-coach-daily@md-al-mamun22.github.io",
    "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", "DTSTART:" + s, "DTEND:" + e, "RRULE:FREQ=DAILY",
    "SUMMARY:" + title, "DESCRIPTION:" + det, "URL:" + url, "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + title, "TRIGGER:PT0M", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const icsUrl = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const gcal = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&details=" + encodeURIComponent(det) + "&dates=" + s + "/" + e + "&recur=" + encodeURIComponent("RRULE:FREQ=DAILY");
  return { icsUrl, gcal };
}

/* Accent Coach shared learning kit: audio, speaking check, local + cloud progress. */
(function () {
  var AC = window.AC = window.AC || {};
  AC.bn = function (n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; }); };
  AC.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  AC.dayNo = function () { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };
  AC.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  // ---------- audio: Mamun's recorded voice when available, browser voice otherwise ----------
  var VOICE = {}, ready = fetch("audio/phr/index.json").then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
    .then(function (l) { (l || []).forEach(function (f) { VOICE[f.replace(/\.mp3$/, "")] = f; }); });
  AC.voiceReady = ready;
  AC.hasVoice = function (id) { return !!VOICE[id]; };
  var synthVoice = null;
  function pick() { if (!("speechSynthesis" in window)) return; var vs = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)/i.test(v.lang); });
    synthVoice = vs.find(function (v) { return /en-US/i.test(v.lang) && /Google|Samantha|Natural|Aria|Jenny/i.test(v.name); }) || vs.find(function (v) { return /en-US/i.test(v.lang); }) || vs[0] || null; }
  if ("speechSynthesis" in window) { pick(); speechSynthesis.onvoiceschanged = pick; }
  AC.otherVoice = function () { if (!("speechSynthesis" in window)) return null; var vs = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)/i.test(v.lang); });
    return vs.find(function (v) { return v !== synthVoice && /female|Samantha|Zira|Aria|Jenny|UK English Female/i.test(v.name); }) || vs.find(function (v) { return v !== synthVoice; }) || synthVoice; };
  var audio = AC.audio = new Audio();
  AC.stop = function () { audio.pause(); audio.onended = null; if (window.speechSynthesis) speechSynthesis.cancel(); };
  // say(text, id, done, opts): plays audio/phr/<id>.mp3 if it exists, otherwise speaks with the browser voice.
  AC.say = function (text, id, done, opts) {
    AC.stop(); opts = opts || {};
    if (id && VOICE[id] && !opts.tts) { audio.src = "audio/phr/" + VOICE[id]; audio.onended = function () { done && done(); };
      audio.play().catch(function () { done && done(); }); return; }
    if (!("speechSynthesis" in window)) { done && done(); return; }
    var u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = opts.rate || 0.92;
    var v = opts.alt ? AC.otherVoice() : synthVoice; if (v) u.voice = v;
    if (opts.alt) u.pitch = 1.15;
    u.onend = function () { done && done(); }; u.onerror = function () { done && done(); };
    speechSynthesis.speak(u);
  };

  // ---------- speaking check: record + browser speech recognition where available ----------
  var REC = window.SpeechRecognition || window.webkitSpeechRecognition;
  function norm(t) { return String(t).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim(); }
  function score(target, heard) { var t = norm(target).split(" "), h = " " + norm(heard) + " ", hit = 0;
    t.forEach(function (w) { if (h.indexOf(" " + w + " ") >= 0) hit++; }); return t.length ? hit / t.length : 0; }
  // speak(btn, target, playRef): btn sits inside .spk next to a .spkres span.
  AC.speak = function (btn, target, playRef, onOk) {
    var res = btn.parentNode.querySelector(".spkres");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { res.textContent = "এই ব্রাউজারে মাইক্রোফোন ব্যবহার করা যাচ্ছে না।"; return; }
    AC.stop();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var chunks = [], mr = new MediaRecorder(stream), heard = [], done = false, r = null;
      var words = norm(target).split(" ").length, limit = Math.min(12000, 3000 + words * 550);
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = function () { stream.getTracks().forEach(function (t) { t.stop(); });
        var url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || "audio/webm" }));
        var mine = document.createElement("button"); mine.className = "btn"; mine.textContent = "▶ আমার কণ্ঠ";
        mine.onclick = function () { AC.stop(); audio.src = url; audio.play().catch(function () {}); };
        var his = document.createElement("button"); his.className = "btn"; his.textContent = "▶ সঠিক উচ্চারণ"; his.onclick = playRef;
        res.appendChild(mine); res.appendChild(his); };
      function finish() { if (done) return; done = true; try { mr.stop(); } catch (e) {} try { r && r.stop(); } catch (e) {}
        btn.disabled = false; btn.textContent = "🎙 আবার বলুন";
        if (!REC) { res.textContent = "নিজের কণ্ঠ আর সঠিক উচ্চারণ শুনে মিলিয়ে দেখুন:"; return; }
        var best = 0, bestH = ""; heard.forEach(function (h) { var s = score(target, h); if (s > best) { best = s; bestH = h; } });
        if (best >= 0.8) { res.textContent = "✅ চমৎকার! প্রায় পুরোটা ঠিকভাবে বোঝা গেছে।"; onOk && onOk(); }
        else if (best >= 0.5) res.textContent = "👍 অনেকটা ঠিক। শোনা গেছে: “" + bestH + "”। আরেকবার চেষ্টা করুন।";
        else res.textContent = heard.length ? "🤔 শোনা গেছে: “" + heard[0] + "”। ধীরে, স্পষ্ট করে আবার বলুন।" : "🤔 কিছু শোনা যায়নি। আবার একটু জোরে বলুন।"; }
      mr.start(); btn.disabled = true; btn.textContent = "🔴 বলুন…"; res.textContent = "";
      if (REC) { r = new REC(); r.lang = "en-US"; r.maxAlternatives = 5; r.interimResults = false;
        r.onresult = function (e) { for (var i = 0; i < e.results[0].length; i++) heard.push(e.results[0][i].transcript); };
        r.onend = finish; r.onerror = finish; try { r.start(); } catch (e) {} }
      setTimeout(finish, REC ? limit : Math.min(8000, 2000 + words * 450));
    }).catch(function () { res.textContent = "মাইক্রোফোনের অনুমতি পাওয়া যায়নি।"; });
  };

  // ---------- progress store: {key: [value, changedAtMs]}, saved locally and synced to the account ----------
  AC.stores = {};
  AC.store = function (name) {
    var KEY = "ac-prog-" + name, d = {};
    try { d = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
    var s = { name: name, d: d, listeners: [],
      get: function (k) { var e = s.d[k]; return e ? e[0] : 0; },
      set: function (k, v) { s.d[k] = [v, Date.now()]; s.save(); },
      save: function () { try { localStorage.setItem(KEY, JSON.stringify(s.d)); } catch (e) {} if (AC.onStoreChange) AC.onStoreChange(s); },
      apply: function (nd) { s.d = nd; try { localStorage.setItem(KEY, JSON.stringify(s.d)); } catch (e) {} s.listeners.forEach(function (f) { f(); }); },
      onSync: function (f) { s.listeners.push(f); } };
    AC.stores[name] = s; return s;
  };
  AC.peek = function (name) { try { return JSON.parse(localStorage.getItem("ac-prog-" + name) || "{}") || {}; } catch (e) { return {}; } };
})();

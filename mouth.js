// Animated mouth-shape guide for the Sound step (front view of lips, teeth and tongue).
(function(){
const P={
 rest:{w:110,h:4,rd:0,tt:0,tb:0,ty:0,to:0,tuck:0},
 V:{w:112,h:8,rd:0,tt:1,tb:0,ty:.2,to:0,tuck:1,v:1,air:1},
 F:{w:112,h:8,rd:0,tt:1,tb:0,ty:.2,to:0,tuck:1,v:0,air:1},
 W:{w:54,h:18,rd:1,tt:0,tb:0,ty:.1,v:1},
 P0:{w:104,h:0,rd:.1,tt:0,tb:0,ty:.1},
 P1:{w:108,h:16,rd:.2,tt:.4,tb:0,ty:.2,air:1},
 TH:{w:118,h:22,rd:0,tt:1,tb:1,ty:.6,to:1,air:1},
 DH:{w:118,h:22,rd:0,tt:1,tb:1,ty:.6,to:1,v:1,air:1},
 S:{w:126,h:8,rd:0,tt:1,tb:1,ty:.5,air:1},
 Z:{w:126,h:8,rd:0,tt:1,tb:1,ty:.5,v:1,air:1},
 SH:{w:78,h:16,rd:.75,tt:1,tb:1,ty:.4,air:1},
 T:{w:116,h:24,rd:0,tt:1,tb:.6,ty:1},
 D:{w:116,h:24,rd:0,tt:1,tb:.6,ty:1,v:1},
 I:{w:118,h:22,rd:0,tt:.6,tb:.3,ty:.5,v:1},
 II:{w:142,h:14,rd:0,tt:1,tb:.8,ty:.6,v:1},
 AE:{w:140,h:56,rd:0,tt:.8,tb:.6,ty:.2,v:1},
 E:{w:124,h:34,rd:0,tt:.7,tb:.4,ty:.35,v:1},
 UH:{w:104,h:34,rd:.1,tt:.4,tb:0,ty:.2,v:1},
 AA:{w:106,h:66,rd:.15,tt:.5,tb:.2,ty:.1,v:1},
 U:{w:74,h:24,rd:.6,tt:.2,tb:0,ty:.3,v:1},
 UU:{w:48,h:18,rd:1,tt:0,tb:0,ty:.3,v:1},
 O:{w:76,h:42,rd:.8,tt:.1,tb:0,ty:.2,v:1},
 AW:{w:80,h:52,rd:.75,tt:.2,tb:0,ty:.15,v:1},
 ER:{w:94,h:24,rd:.35,tt:.3,tb:0,ty:.4,v:1},
 SCHWA:{w:100,h:16,rd:.1,tt:.2,tb:0,ty:.3,v:1},
 R:{w:78,h:22,rd:.6,tt:.3,tb:0,ty:.3,v:1},
 L:{w:112,h:40,rd:0,tt:.8,tb:.4,ty:1,v:1},
 DL:{w:100,h:30,rd:.3,tt:.5,tb:.1,ty:.2,v:1},
 NG:{w:104,h:34,rd:.1,tt:.5,tb:.2,ty:.05,v:1},
 FT1:{w:110,h:28,rd:0,tt:.8,tb:.4,ty:1,v:1},
 FT2:{w:110,h:28,rd:0,tt:.8,tb:.4,ty:.3,v:1}
};
// label, pose (or [from,to] glide), tip, example-word matcher
const SND={
 vw:[["V","V","Upore-r dat nicher thot-e halka chhoy. Gola kape.",/^v/i],["W","W","Thot gol kore samne. Dat kothao lage na, tarpor khule jay.",/^(w|one)/i]],
 fp:[["F","F","Upore-r dat nicher thot-e, shudhu batash.",/^f|coffee/i],["P",["P0","P1"],"Dui thot bondho, tarpor joray khule batash (phu).",/^p|price|help/i]],
 th1:[["TH (θ)","TH","Jibh-er dogha dui dater majhe, shudhu batash. Gola kape na.",/./]],
 th2:[["TH (ð)","DH","Jibh dater majhe, ebar gola kape.",/./]],
 zs:[["Z","Z","Dat kachakachi, jibh dater pichhone, gola kape (zzz).",/^z|busy|business|easy/i],["S","S","Dat kachakachi, thot chora, shudhu batash (sss).",/^s(ee|ir)/i],["SH","SH","Thot samne gol, jibh ektu pichhone (shh).",/^sh|sure/i]],
 sc:[["S","S","S shuru theke sorasori, age kono \"e\" na.",/^s/i],["T","T","Jibh-er dogha upore-r dater thik pichhone chhoy, tarpor chharo.",/^t/i],["D","D","T-er motoi, kintu gola kape.",/^d/i]],
 ii:[["ɪ ship","I","Thot halka chora, dhila, khub choto.",/^(ship|live|fill|sit)$/i],["iː sheep","II","Puro hashi, thot chora, lomba kore.",/^(sheep|leave|feel|seat)$/i]],
 ae:[["æ cat","AE","Mukh boro kore khola, choyal niche, thot chora.",/^(cat|bad|man|plan|answer)$/i],["e bed","E","Mukh majhari khola, halka chora.",/^(bed|men|help)$/i]],
 ua:[["ʌ cup","UH","Mukh halka khola, dhila, choto.",/^(cup|love|money|monday|just)$/i],["ɑː car","AA","Mukh boro kore khola, choyal niche, lomba.",/^(car|start|heart)$/i]],
 uo:[["ʊ book","U","Thot halka gol, choto.",/^(book|good)$/i],["uː food","UU","Thot puro gol, samne, lomba.",/^(food|new)$/i],["oʊ go",["O","UU"],"O theke shuru kore thot aro gol hoye U-te jay.",/^(go|home|phone)$/i],["ɔː call","AW","Mukh khola, thot gol, lomba.",/^(call|talk)$/i]],
 er:[["ɜː bird","ER","Mukh dhila, majhkhane, thot halka samne.",/^(work|first|person|learn)$/i],["ə schwa","SCHWA","Ekdom dhila, choto \"uh\". Stress chhara syllable-e.",/./]],
 dp:[["eɪ day",["E","II"],"E theke I-te glide.",/^(day|make|late)$/i],["aɪ time",["AA","II"],"A theke I-te glide.",/^(time|right)$/i],["aʊ now",["AA","UU"],"A theke U-te glide, shesh-e thot gol.",/^(now|out)$/i],["ɔɪ voice",["AW","II"],"O theke I-te glide.",/^(choice|voice)$/i]],
 rl:[["R","R","Jibh kothao chhoy na, pichhone peche gol. Thot halka gol.",/^r/i],["L","L","Jibh-er dogha upore-r dater pichhone chhoy.",/^(light|lead)$/i],["Dark L","DL","Shesh-e L: jibh-er pichhon upore, \"ul\" er moto.",/^(call|will|feel|people)$/i]],
 ft:[["Flap T",["FT1","FT2"],"Duto vowel-er majhe T halka \"d\": jibh druto ek-bar chhuye chole jay.",/^(water|better|little|getting)$/i],["NG","NG","Jibh-er pichhon upore uthe bondho kore, nak diye sound. Shesh-e \"g\" bolbe na.",/ng$/i]]
};
window.MOUTH_KEYS=Object.keys(SND);
const NS="http://www.w3.org/2000/svg";
const lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const K=["w","h","rd","tt","tb","ty","to","tuck","v","air"];
const full=p=>{const o={};K.forEach(k=>o[k]=p[k]||0);return o};
function shape(cx,cy,a,ht,hb,rd){const f=.5+.5*rd;
  return `M${cx-a},${cy} C${cx-a*f},${cy-ht*4/3} ${cx+a*f},${cy-ht*4/3} ${cx+a},${cy} C${cx+a*f},${cy+hb*4/3} ${cx-a*f},${cy+hb*4/3} ${cx-a},${cy} Z`}
function teeth(x,y,w,h,up){let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#fbfaf6"/>`;const n=Math.max(4,Math.round(w/16));
  for(let i=1;i<n;i++){const xx=x+w*i/n;s+=`<line x1="${xx}" y1="${up?y+h*.35:y}" x2="${xx}" y2="${up?y+h:y+h*.65}" stroke="#e2ded4" stroke-width="1.5"/>`}return s}
function draw(el,p,id){
  const cx=160,cy=112,a=p.w/2,h=p.h,rd=p.rd;
  const lipT=13+5*rd,lipB=17+5*rd-6*p.tuck,ao=a+15+6*rd;
  let s=`<defs><clipPath id="${id}c"><path d="${shape(cx,cy,a,h/2,h/2,rd)}"/></clipPath></defs>`;
  s+=`<rect x="0" y="0" width="320" height="230" rx="22" fill="var(--skin)"/><g transform="translate(160 118) scale(1.5) translate(-160 -112)">`;
  // nose shadow + chin hint
  s+=`<path d="M142 44 Q160 54 178 44" stroke="var(--skin-d)" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="${shape(cx,cy,ao,h/2+lipT,h/2+lipB,Math.max(rd,.4))}" fill="#c9605a"/>`;
  s+=`<path d="M${cx-ao+6},${cy} Q${cx},${cy-h/2-lipT*.15} ${cx+ao-6},${cy}" stroke="#b04f4a" stroke-width="2" fill="none" opacity=".5"/>`;
  s+=`<path d="${shape(cx,cy,a,h/2,h/2,rd)}" fill="#3a1518"/>`;
  s+=`<g clip-path="url(#${id}c)">`;
  const tongueY=cy+h/2+14-p.ty*(h*.85+14);
  s+=`<ellipse cx="${cx}" cy="${tongueY+18}" rx="${a*.8}" ry="22" fill="#e07c7c"/><ellipse cx="${cx}" cy="${tongueY+8}" rx="${a*.35}" ry="5" fill="#ec9a96" opacity=".7"/>`;
  if(p.tb>0)s+=teeth(cx-a*.82,cy+h/2-p.tb*11,a*1.64,24,false);
  if(p.tt>0)s+=teeth(cx-a*.86,cy-h/2-22+p.tt*13,a*1.72,22,true);
  s+=`</g>`;
  if(p.to>0)s+=`<ellipse cx="${cx}" cy="${cy+2}" rx="${30*p.to}" ry="${8*p.to}" fill="#e07c7c" stroke="#c96464" stroke-width="1.5"/>`+(p.tt>0?`<g opacity="${p.to}">${teeth(cx-34,cy-h/2-6,68,8,true)}</g>`:"");
  if(p.tuck>0)s+=`<g opacity="${p.tuck}">${teeth(cx-a*.8,cy-10,a*1.6,13,true)}</g>`;
  // air lines
  s+=`<g class="airl" opacity="${p.air}"><path d="M${cx-30},${cy+48} q10,10 0,20 M${cx},${cy+52} q10,10 0,20 M${cx+30},${cy+48} q10,10 0,20" stroke="#7aa7d6" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
  s+=`</g>`;el.innerHTML=s;
}
function anim(m,to,dur){return new Promise(res=>{const from=m._p;const t0=performance.now();cancelAnimationFrame(m._raf);
  const step=now=>{const t=Math.min(1,(now-t0)/dur),e=ease(t),cur={};K.forEach(k=>cur[k]=lerp(from[k],to[k],e));m._p=cur;draw(m._svg,cur,m._id);
    if(t<1)m._raf=requestAnimationFrame(step);else res()};m._raf=requestAnimationFrame(step)})}
let uid=0;
window.mouthHTML=function(k){const L=SND[k];if(!L)return"";
  return `<div class="mouth" data-k="${k}"><div class="msvg"><svg viewBox="0 0 320 230" role="img" aria-label="Mouth shape"></svg><div class="mind"><span class="ind iv">🎵 Gola kape</span><span class="ind ia">💨 Batash</span></div></div>
  <div class="mctl"><b class="mh">Mukh dekhte kemon</b><div class="mchips">${L.map((x,i)=>`<button class="mchip" data-i="${i}">${x[0]}</button>`).join("")}</div>
  <div class="mtip"><b></b><span>Upore-r sound chapo, mukh-er shape dekho.</span></div>
  ${L.length>1?`<button class="mcmp">▶ Pashapashi dekho</button>`:`<button class="mcmp">▶ Abar dekho</button>`}</div></div>`};
function poseOf(spec){return Array.isArray(spec)?spec:[spec]}
async function show(m,i,play){const L=SND[m.dataset.k],x=L[i];m.querySelectorAll(".mchip").forEach((c,j)=>c.classList.toggle("on",j===i));
  m.querySelector(".mtip b").textContent=x[0];m.querySelector(".mtip span").textContent=x[2];
  const seq=poseOf(x[1]).map(n=>full(P[n]));const last=seq[seq.length-1];
  m.querySelector(".iv").classList.toggle("on",!!last.v);m.querySelector(".ia").classList.toggle("on",!!last.air);
  if(play&&window.playWord){try{const card=m.closest(".sndcard");const w=card&&[...card.querySelectorAll("[data-clip]")].map(b=>b.dataset.clip).find(t=>x[3].test(t));if(w)window.playWord(w)}catch(e){}}
  await anim(m,full(P.rest),seq.length>1?180:120);
  for(const p of seq)await anim(m,p,seq.length>1?420:380);
}
window.initMouths=function(root){(root||document).querySelectorAll(".mouth").forEach(m=>{if(m._init)return;m._init=1;m._id="m"+(uid++);m._svg=m.querySelector("svg");m._p=full(P.rest);draw(m._svg,m._p,m._id);
  m.querySelectorAll(".mchip").forEach(c=>c.addEventListener("click",()=>show(m,+c.dataset.i,true)));
  m.querySelector(".mcmp").addEventListener("click",async()=>{const L=SND[m.dataset.k];for(let i=0;i<L.length;i++){await show(m,i,true);await new Promise(r=>setTimeout(r,1100))}});
  setTimeout(()=>show(m,0,false),250)})};
// sync with word buttons inside a sound card
document.addEventListener("click",e=>{const b=e.target.closest("[data-clip]");if(!b)return;const card=b.closest(".sndcard");if(!card)return;const m=card.querySelector(".mouth");if(!m||!m._init)return;
  const L=SND[m.dataset.k];const i=L.findIndex(x=>x[3].test(b.dataset.clip));if(i>=0)show(m,i,false)});
})();

// Accent Coach: animated mouth guide for the Sound step.
// Two views: "Samne theke" (front: lips, teeth, tongue) and "Pash theke" (side cut-away: tongue, teeth, lips, palate, nose, voice box).
(function(){
"use strict";
// ---------- poses ----------
// front: fw width, fh opening, frd round, ftt top teeth, ftb bottom teeth, fy tongue height, fto tongue out
// side : jaw, lr lip round/protrude, lc lips closed, tk lower lip tucked under top teeth,
//        tongue tip (tx,ty), mid (mx,my), back (bx,by), nas air through nose
const B={fw:110,fh:4,frd:0,ftt:0,ftb:0,fy:0,fto:0,jaw:.05,lr:0,lc:.9,tk:0,tx:272,ty:172,mx:212,my:170,bx:150,by:168,nas:0,v:0,air:0};
const P={
 rest:{},
 V:{fw:112,fh:8,ftt:1,fy:.2,tk:1,jaw:.12,lc:0,tx:272,ty:174,v:1,air:1},
 F:{fw:112,fh:8,ftt:1,fy:.2,tk:1,jaw:.12,lc:0,tx:272,ty:174,air:1},
 W:{fw:54,fh:18,frd:1,fy:.1,jaw:.2,lr:1,lc:.35,bx:158,by:146,mx:214,my:168,tx:270,ty:180,v:1,air:1},
 P0:{fw:104,fh:0,frd:.1,fy:.1,jaw:.06,lc:1},
 P1:{fw:108,fh:18,frd:.2,ftt:.4,fy:.2,jaw:.22,lc:0,air:1},
 TH:{fw:118,fh:22,ftt:1,ftb:1,fy:.6,fto:1,jaw:.22,lc:0,tx:298,ty:156,mx:236,my:156,bx:152,by:168,air:1},
 DH:{fw:118,fh:22,ftt:1,ftb:1,fy:.6,fto:1,jaw:.22,lc:0,tx:298,ty:156,mx:236,my:156,bx:152,by:168,v:1,air:1},
 S:{fw:126,fh:8,ftt:1,ftb:1,fy:.5,jaw:.08,lc:0,tx:274,ty:138,mx:222,my:148,bx:152,by:166,air:1},
 Z:{fw:126,fh:8,ftt:1,ftb:1,fy:.5,jaw:.08,lc:0,tx:274,ty:138,mx:222,my:148,bx:152,by:166,v:1,air:1},
 SH:{fw:78,fh:16,frd:.75,ftt:1,ftb:1,fy:.4,jaw:.1,lr:.7,lc:0,tx:262,ty:136,mx:214,my:136,bx:152,by:162,air:1},
 T:{fw:116,fh:24,ftt:1,ftb:.6,fy:1,jaw:.18,lc:0,tx:279,ty:128,mx:228,my:146,bx:152,by:168},
 D:{fw:116,fh:24,ftt:1,ftb:.6,fy:1,jaw:.18,lc:0,tx:279,ty:128,mx:228,my:146,bx:152,by:168,v:1},
 I:{fw:118,fh:22,ftt:.6,ftb:.3,fy:.5,jaw:.18,lc:0,bx:150,by:158,mx:220,my:140,tx:274,ty:168,v:1,air:1},
 II:{fw:142,fh:14,ftt:1,ftb:.8,fy:.6,jaw:.1,lc:0,bx:150,by:156,mx:224,my:128,tx:274,ty:162,v:1,air:1},
 AE:{fw:140,fh:56,ftt:.8,ftb:.6,fy:.2,jaw:.75,lc:0,bx:150,by:186,mx:214,my:188,tx:277,ty:194,v:1,air:1},
 E:{fw:124,fh:34,ftt:.7,ftb:.4,fy:.35,jaw:.4,lc:0,bx:150,by:170,mx:216,my:158,tx:275,ty:178,v:1,air:1},
 UH:{fw:104,fh:34,frd:.1,ftt:.4,fy:.2,jaw:.45,lc:0,bx:150,by:170,mx:212,my:172,tx:274,ty:184,v:1,air:1},
 AA:{fw:106,fh:66,frd:.15,ftt:.5,ftb:.2,fy:.1,jaw:.85,lc:0,bx:144,by:182,mx:210,my:196,tx:276,ty:200,v:1,air:1},
 U:{fw:74,fh:24,frd:.6,ftt:.2,fy:.3,jaw:.3,lr:.6,lc:0,bx:156,by:146,mx:212,my:166,tx:272,ty:180,v:1,air:1},
 UU:{fw:48,fh:18,frd:1,fy:.3,jaw:.2,lr:1,lc:.2,bx:160,by:132,mx:212,my:160,tx:272,ty:178,v:1,air:1},
 O:{fw:76,fh:42,frd:.8,ftt:.1,fy:.2,jaw:.5,lr:.8,lc:0,bx:152,by:156,mx:210,my:176,tx:273,ty:186,v:1,air:1},
 AW:{fw:80,fh:52,frd:.75,ftt:.2,fy:.15,jaw:.6,lr:.75,lc:0,bx:150,by:160,mx:210,my:182,tx:274,ty:190,v:1,air:1},
 ER:{fw:94,fh:24,frd:.35,ftt:.3,fy:.4,jaw:.3,lr:.35,lc:0,bx:156,by:150,mx:220,my:150,tx:262,ty:160,v:1,air:1},
 SCHWA:{fw:100,fh:16,frd:.1,ftt:.2,fy:.3,jaw:.25,lc:0,bx:150,by:166,mx:212,my:162,tx:273,ty:176,v:1,air:1},
 R:{fw:78,fh:22,frd:.6,ftt:.3,fy:.3,jaw:.2,lr:.5,lc:0,bx:160,by:154,mx:226,my:150,tx:256,ty:138,v:1,air:1},
 L:{fw:112,fh:40,ftt:.8,ftb:.4,fy:1,jaw:.3,lc:0,bx:150,by:172,mx:222,my:170,tx:279,ty:128,v:1,air:1},
 DL:{fw:100,fh:30,frd:.3,ftt:.5,ftb:.1,fy:.2,jaw:.25,lc:0,bx:154,by:140,mx:212,my:170,tx:270,ty:178,v:1,air:1},
 NG:{fw:104,fh:34,frd:.1,ftt:.5,ftb:.2,fy:.05,jaw:.25,lc:0,bx:138,by:122,mx:200,my:166,tx:270,ty:184,nas:1,v:1,air:1},
 FT1:{fw:110,fh:28,ftt:.8,ftb:.4,fy:1,jaw:.25,lc:0,tx:279,ty:128,mx:228,my:150,bx:152,by:170,v:1},
 FT2:{fw:110,fh:28,ftt:.8,ftb:.4,fy:.3,jaw:.25,lc:0,tx:274,ty:178,mx:214,my:168,bx:152,by:170,v:1,air:1}
};
Object.keys(P).forEach(k=>P[k]=Object.assign({},B,P[k]));
const K=Object.keys(B);

// label, pose (or [from,to] glide), tip, example-word matcher, steps, callouts [anchor,text]
const SND={
 vw:[["V","V","Upore-r dat nicher thot-e halka chhoy. Gola kape.",/^v/i,["Nicher thot upore-r dater niche anon","Dat thote halka rakho (kamor na)","Gola kapiye batash chharo: vvv"],[["lip","Nicher thot"],["throat","Gola kape"]]],
     ["W","W","Thot gol kore samne. Dat kothao lage na, tarpor khule jay.",/^(w|one)/i,["Thot gol kore samne thelo (oo)","Dat-e thot lagbe na","Thot khule porer vowel-e jao"],[["lip","Thot gol"],["throat","Gola kape"]]]],
 fp:[["F","F","Upore-r dat nicher thot-e, shudhu batash.",/^f|coffee/i,["Nicher thot upore-r dater niche anon","Dat thote halka rakho","Shudhu batash: ffff (gola kape na)"],[["lip","Nicher thot"]]],
     ["P",["P0","P1"],"Dui thot bondho, tarpor joray khule batash (phu).",/^p|price|help/i,["Dui thot bondho koro","Mukher bhitore batash jomao","Thot hothat khule: phu!"],[["lip","Thot"]]]],
 th1:[["TH (θ)","TH","Jibh-er dogha dui dater majhe, shudhu batash. Gola kape na.",/./,["Mukh halka kholo","Jibh-er dogha upor-nicher dater majhe ber koro","Shudhu batash chharo (gola kape na)"],[["tip","Jibh dater majhe"]]]],
 th2:[["TH (ð)","DH","Jibh dater majhe, ebar gola kape.",/./,["Mukh halka kholo","Jibh-er dogha dater majhe","Gola kapiye bolo (the, this)"],[["tip","Jibh dater majhe"],["throat","Gola kape"]]]],
 zs:[["Z","Z","Dat kachakachi, jibh dater pichhone, gola kape (zzz).",/^z|busy|business|easy/i,["Dat kachakachi anon","Jibh-er dogha upore-r mari-r kache (chhobe na)","Gola kapiye: zzzz"],[["tip","Jibh mari-r kache"],["throat","Gola kape"]]],
     ["S","S","Dat kachakachi, thot chora, shudhu batash (sss).",/^s(ee|ir)/i,["Dat kachakachi, thot chora","Jibh-er dogha mari-r kache","Shudhu batash: ssss"],[["tip","Jibh mari-r kache"]]],
     ["SH","SH","Thot samne gol, jibh ektu pichhone (shh).",/^sh|sure/i,["Thot samne gol kore thelo","Jibh ektu pichhone, upore uthao","Batash: shhh"],[["lip","Thot samne"],["tip","Jibh pichhone"]]]],
 sc:[["S","S","S shuru theke sorasori, age kono \"e\" na.",/^s/i,["Thot chora, dat kachakachi","Jibh-er dogha mari-r kache","Sorasori ssss, age \"e\" na"],[["tip","Jibh mari-r kache"]]],
     ["T","T","Jibh-er dogha upore-r dater thik pichhone chhoy, tarpor chharo.",/^t/i,["Jibh-er dogha upore-r mari-te chhoyao","Batash atkao","Jibh chhere dao: t"],[["ridge","Jibh ekhane chhoy"]]],
     ["D","D","T-er motoi, kintu gola kape.",/^d/i,["Jibh-er dogha upore-r mari-te","Gola kapao","Jibh chhere dao: d"],[["ridge","Jibh ekhane chhoy"],["throat","Gola kape"]]]],
 ii:[["ɪ ship","I","Thot halka chora, dhila, khub choto.",/^(ship|live|fill|sit)$/i,["Mukh halka kholo, dhila","Jibh samne, majhari uchu","Choto kore bolo: ɪ"],[["mid","Jibh majhari uchu"]]],
     ["iː sheep","II","Puro hashi, thot chora, lomba kore.",/^(sheep|leave|feel|seat)$/i,["Hashi-r moto thot chora","Jibh samne, onek uchu","Lomba kore bolo: iiː"],[["mid","Jibh onek uchu"],["lip","Hashi"]]]],
 ae:[["æ cat","AE","Mukh boro kore khola, choyal niche, thot chora.",/^(cat|bad|man|plan|answer)$/i,["Choyal onek niche namao","Thot chora","Jibh niche, samne: æ"],[["jaw","Choyal niche"]]],
     ["e bed","E","Mukh majhari khola, halka chora.",/^(bed|men|help)$/i,["Mukh majhari kholo","Jibh samne, majhari","Bolo: e"],[["mid","Jibh majhari"]]]],
 ua:[["ʌ cup","UH","Mukh halka khola, dhila, choto.",/^(cup|love|money|monday|just)$/i,["Mukh halka kholo","Jibh dhila, majhkhane","Choto kore: ʌ"],[["mid","Jibh dhila"]]],
     ["ɑː car","AA","Mukh boro kore khola, choyal niche, lomba.",/^(car|start|heart)$/i,["Choyal onek niche","Jibh niche, pichhone","Lomba kore: ɑː"],[["jaw","Choyal niche"],["back","Jibh pichhone niche"]]]],
 uo:[["ʊ book","U","Thot halka gol, choto.",/^(book|good)$/i,["Thot halka gol","Jibh-er pichhon halka upore","Choto kore: ʊ"],[["lip","Thot halka gol"]]],
     ["uː food","UU","Thot puro gol, samne, lomba.",/^(food|new)$/i,["Thot puro gol, samne","Jibh-er pichhon upore","Lomba kore: uː"],[["lip","Thot gol"],["back","Jibh pichhone upore"]]],
     ["oʊ go",["O","UU"],"O theke shuru kore thot aro gol hoye U-te jay.",/^(go|home|phone)$/i,["O diye shuru (mukh gol, khola)","Thot aro gol kore","U-te shesh: oʊ"],[["lip","Thot gol hoy"]]],
     ["ɔː call","AW","Mukh khola, thot gol, lomba.",/^(call|talk)$/i,["Choyal namao","Thot gol","Lomba kore: ɔː"],[["lip","Thot gol"]]]],
 er:[["ɜː bird","ER","Mukh dhila, majhkhane, thot halka samne.",/^(work|first|person|learn)$/i,["Mukh dhila, majhari","Jibh majhkhane","Lomba kore: ɜː"],[["mid","Jibh majhkhane"]]],
     ["ə schwa","SCHWA","Ekdom dhila, choto \"uh\". Stress chhara syllable-e.",/./,["Shob dhila koro","Jibh majhkhane, aram-e","Khub choto: ə"],[["mid","Jibh dhila"]]]],
 dp:[["eɪ day",["E","II"],"E theke I-te glide.",/^(day|make|late)$/i,["E diye shuru","Jibh upore uthte thake","I-te shesh: eɪ"],[["mid","Jibh uthe"]]],
     ["aɪ time",["AA","II"],"A theke I-te glide.",/^(time|right)$/i,["A diye shuru (mukh khola)","Choyal uthe, jibh samne","I-te shesh: aɪ"],[["jaw","Choyal uthe"]]],
     ["aʊ now",["AA","UU"],"A theke U-te glide, shesh-e thot gol.",/^(now|out)$/i,["A diye shuru","Thot gol hote thake","U-te shesh: aʊ"],[["lip","Thot gol hoy"]]],
     ["ɔɪ voice",["AW","II"],"O theke I-te glide.",/^(choice|voice)$/i,["Gol O diye shuru","Thot chora hoy, jibh uthe","I-te shesh: ɔɪ"],[["mid","Jibh uthe"]]]],
 rl:[["R","R","Jibh kothao chhoy na, pichhone peche gol. Thot halka gol.",/^r/i,["Thot halka gol","Jibh-er dogha upore uthao, kintu chhobe na","Jibh peche, gola kapiye: r"],[["tip","Jibh chhoy na"]]],
     ["L","L","Jibh-er dogha upore-r dater pichhone chhoy.",/^(light|lead)$/i,["Mukh halka kholo","Jibh-er dogha upore-r mari-te chhoyao","Jibh-er pash diye batash: l"],[["ridge","Jibh ekhane chhoy"]]],
     ["Dark L","DL","Shesh-e L: jibh-er pichhon upore, \"ul\" er moto.",/^(call|will|feel|people)$/i,["Shobdo-r shesh-e L","Jibh-er pichhon upore uthao","\"ul\" er moto: dark L"],[["back","Jibh-er pichhon upore"]]]],
 ft:[["Flap T",["FT1","FT2"],"Duto vowel-er majhe T halka \"d\": jibh druto ek-bar chhuye chole jay.",/^(water|better|little|getting)$/i,["Vowel diye shuru","Jibh druto ek-bar mari chhoy","Sathe sathe chhere dao: wa-der"],[["ridge","Ek-bar chhoy"]]],
     ["NG","NG","Jibh-er pichhon upore uthe bondho kore, nak diye sound. Shesh-e \"g\" bolbe na.",/ng$/i,["Mukh halka khola","Jibh-er pichhon upore uthe pichhon bondho","Batash nak diye: ng (g na)"],[["back","Jibh pichhone bondho"],["nose","Batash nak diye"]]]]
};

// ---------- helpers ----------
const lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const C={skin:"#f3d3bb",skin2:"#e7b998",lip:"#cf6a66",lip2:"#b5524f",cav:"#4a1f27",tongue:"#e46f78",tongue2:"#b84d57",tooth:"#fffdf7",tline:"#ddd6c9",hl:"#c5e83a"};
function cr(pts){let d="";for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
  const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
  d+=` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`}return d}
function lens(cx,cy,a,ht,hb,rd){const f=.5+.5*rd;return `M${cx-a},${cy} C${cx-a*f},${cy-ht*4/3} ${cx+a*f},${cy-ht*4/3} ${cx+a},${cy} C${cx+a*f},${cy+hb*4/3} ${cx-a*f},${cy+hb*4/3} ${cx-a},${cy} Z`}
function teethRow(cx,y,a,h,up){const n=6,ws=[.8,.95,1.15,1.15,.95,.8],tot=ws.reduce((s,x)=>s+x,0);let x=cx-a,s="";
  ws.forEach(w=>{const ww=w/tot*2*a;s+=`<rect x="${(x+1).toFixed(1)}" y="${up?y:y}" width="${(ww-2).toFixed(1)}" height="${h}" rx="${Math.min(5,ww/3).toFixed(1)}" fill="${C.tooth}" stroke="${C.tline}" stroke-width="1.2"/>`;x+=ww});return s}

// ---------- front view ----------
function drawFront(svg,p,id){
  const cx=160,cy=118,a=p.fw/2,h=p.fh,rd=p.frd;
  const lipT=13+5*rd,lipB=17+5*rd-6*p.tk,ao=a+15+6*rd;
  let s=`<defs><clipPath id="${id}c"><path d="${lens(cx,cy,a,h/2,h/2,rd)}"/></clipPath>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lip}"/><stop offset="1" stop-color="${C.lip2}"/></linearGradient></defs>`;
  s+=`<rect width="320" height="236" rx="18" fill="${C.skin}"/>`;
  s+=`<g transform="translate(160 122) scale(1.45) translate(-160 -118)">`;
  s+=`<path d="M146 64 Q160 72 174 64" stroke="${C.skin2}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="${lens(cx,cy,ao,h/2+lipT,h/2+lipB,Math.max(rd,.4))}" fill="url(#${id}g)"/>`;
  s+=`<path d="M${cx-ao*.55},${cy-h/2-lipT*.7} Q${cx},${cy-h/2-lipT*.95} ${cx+ao*.55},${cy-h/2-lipT*.7}" stroke="#e08c86" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>`;
  s+=`<path d="${lens(cx,cy,a,h/2,h/2,rd)}" fill="${C.cav}"/><g clip-path="url(#${id}c)">`;
  const tY=cy+h/2+14-p.fy*(h*.85+14);
  s+=`<path d="M${cx-a*.85},${tY+40} Q${cx-a*.8},${tY} ${cx},${tY-2} Q${cx+a*.8},${tY} ${cx+a*.85},${tY+40} Z" fill="${C.tongue}"/><path d="M${cx},${tY+3} L${cx},${tY+16}" stroke="${C.tongue2}" stroke-width="1.5" opacity=".6"/>`;
  if(p.ftb>0)s+=teethRow(cx,cy+h/2-p.ftb*10,a*.82,22,false);
  if(p.ftt>0)s+=teethRow(cx,cy-h/2-22+p.ftt*13,a*.86,22,true);
  s+=`</g>`;
  if(p.fto>.02){const o=p.fto;s+=`<path d="M${cx-24*o},${cy-1} Q${cx-22*o},${cy+11*o} ${cx},${cy+12*o} Q${cx+22*o},${cy+11*o} ${cx+24*o},${cy-1} Z" fill="${C.tongue}" stroke="${C.tongue2}" stroke-width="1.2"/>`;
    }
  if(p.tk>.02)s+=`<g opacity="${p.tk}">${teethRow(cx,cy-11,a*.8,13,true)}</g>`;
  s+=`</g><text x="14" y="24" class="vt">Samne theke</text>`;
  svg.innerHTML=s;
}

// ---------- side view (cut-away, facing right) ----------
function sideGeo(p){const dy=p.jaw*34;
  const ul=151+p.lc*3, xs=-p.tk*10;
  let ll=lerp(158+dy,154,p.lc); ll=lerp(ll,150,p.tk);
  return {dy,ul,ll,xs,lipX:310+p.lr*10}}
function drawSide(svg,p,id,callouts){
  const g=sideGeo(p),dy=g.dy;
  let s=`<defs><marker id="${id}ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#3d8be0"/></marker></defs><rect x="92" y="60" width="252" height="222" fill="#efe9e3"/>`;
  // head silhouette
  s+=`<path d="M0,0 L236,0 C250,20 262,40 272,58 C290,78 312,96 326,108 C333,114 328,124 312,124 C304,124 300,126 300,132 L296,150 L296,${170+dy} C300,${190+dy} 306,${205+dy} 300,${222+dy} C292,${240+dy} 270,${246+dy} 240,${246+dy} C215,${246+dy} 205,266 200,300 L0,300 Z" fill="${C.skin}"/>`;
  // one airway: nose + mouth + throat (light), then palate + soft palate drawn over it
  s+=`<path d="M312,123 C302,108 284,98 262,96 C225,90 190,86 160,90 C136,94 120,104 112,120 L106,254 L134,254 C140,236 146,${220+dy*.6} 160,${214+dy*.8} L270,${192+dy} L283,${160+dy} L287,154 L286,131 L300,128 Z" fill="#fdeeea" stroke="#d9a48e" stroke-width="1.5" stroke-linejoin="round"/>`;
  const vx=lerp(112,124,p.nas),vy=lerp(112,146,p.nas);
  s+=`<path d="M286,129 C278,116 266,108 252,106 C225,101 195,99 165,102 C150,104 140,108 134,113 Q124,118 ${vx},${vy}" stroke="#d9a48e" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M286,129 C278,116 266,108 252,106 C225,101 195,99 165,102 C150,104 140,108 134,113 Q124,118 ${vx},${vy}" stroke="${C.skin}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  s+=`<text x="268" y="88" class="lb">Nak</text><text x="200" y="120" class="lb">Talu</text><text x="140" y="270" class="lb">Gola</text>`;
  // voice box
  s+=`<g class="vox" opacity="${(.25+.75*p.v).toFixed(2)}"><path d="M112,236 L134,236" stroke="#8a4e57" stroke-width="3"/><path class="vz" d="M114,${244} l4,-5 l4,5 l4,-5 l4,5 l4,-5" stroke="${p.v>.5?C.hl:"#8a4e57"}" stroke-width="2.5" fill="none" stroke-linejoin="round"/></g>`;
  // tongue
  const R=[124,254],Bk=[p.bx,p.by+dy*.25],M=[p.mx,p.my],T=[p.tx,p.ty];
  s+=`<path d="M${R[0]},${R[1]}${cr([R,Bk,M,T])} C${T[0]+5},${T[1]+3} ${T[0]+3},${T[1]+10} ${T[0]-6},${T[1]+12} Q${T[0]-8},${196+dy} 258,${198+dy} Q200,${206+dy} 168,${222+dy*.8} Q140,236 ${R[0]},${R[1]} Z" fill="${C.tongue}" stroke="${C.tongue2}" stroke-width="1.5"/>`;
  // teeth
  s+=`<path d="M279,127 L292,129 Q295,141 290,154 L285,154 Q281,141 279,127 Z" fill="${C.tooth}" stroke="${C.tline}" stroke-width="1.2"/>`;
  s+=`<path d="M281,${184+dy} Q280,${170+dy} 284,${157+dy} L289,${157+dy} Q292,${170+dy} 291,${184+dy} Z" fill="${C.tooth}" stroke="${C.tline}" stroke-width="1.2"/>`;
  // lips
  const lx=g.lipX;
  s+=`<path d="M294,127 C303,127 ${lx-1},133 ${lx},141 C${lx},147 ${lx-5},${g.ul} 298,${g.ul} L292,${g.ul-1} Z" fill="${C.lip}"/>`;
  const L0=g.ll,x0=g.xs;
  s+=`<path d="M${292+x0},${L0} C${300+x0},${L0-1} ${lx-1+x0},${L0+4} ${lx+x0},${L0+11} C${lx-1+x0},${L0+20} ${300+x0},${L0+24} ${294+x0},${L0+24} L${292+x0},${L0+12} Z" fill="${C.lip2}"/>`;
  // air flow
  const mouthY=(Math.min(p.my,p.ty)+108)/2;
  const airD=p.nas>.5?`M121,240 C119,190 116,150 124,118 C140,96 200,88 262,96 C290,102 306,112 330,124`:`M121,240 C119,200 120,165 138,140 C170,${mouthY-6} 230,${mouthY} 286,${(g.ul+g.ll)/2} L332,${(g.ul+g.ll)/2}`;
  s+=`<path class="air" d="${airD}" stroke="#3d8be0" stroke-width="2.6" fill="none" stroke-dasharray="5 7" stroke-linecap="round" marker-end="url(#${id}ar)" opacity="${(p.air*.95).toFixed(2)}"/>`;
  // callouts
  const A={tip:[p.tx,p.ty],mid:[p.mx,p.my],back:[p.bx,p.by+dy*.25],lip:[lx-2,(g.ul+g.ll)/2],ridge:[279,128],throat:[124,240],jaw:[287,166+dy],nose:[312,120]};
  (callouts||[]).forEach((c,i)=>{const a=A[c[0]];if(!a)return;const ly=76+i*24,lx2=98;const w=c[1].length*6.1+16;
    s+=`<circle cx="${a[0]}" cy="${a[1]}" r="6" fill="none" stroke="#16171a" stroke-width="4"/><circle cx="${a[0]}" cy="${a[1]}" r="6" fill="none" stroke="${C.hl}" stroke-width="2.5"/><path d="M${lx2+w},${ly} L${a[0]-6},${a[1]-5}" stroke="#1d1f23" stroke-width="1.1" stroke-dasharray="3 2.5"/>`;
    s+=`<rect x="${lx2}" y="${ly-10}" width="${w}" height="19" rx="9.5" fill="#16171a"/><text x="${lx2+8}" y="${ly+3.5}" class="ct">${c[1]}</text>`});
  s+=`<text x="336" y="274" text-anchor="end" class="vt">Pash theke</text>`;
  svg.innerHTML=s;
}

// ---------- animation ----------
function anim(m,to,dur){return new Promise(res=>{const from=m._p,t0=performance.now();cancelAnimationFrame(m._raf);
  const step=now=>{const t=Math.min(1,(now-t0)/dur),e=ease(t),cur={};K.forEach(k=>cur[k]=lerp(from[k],to[k],e));m._p=cur;render(m);
    if(t<1)m._raf=requestAnimationFrame(step);else res()};m._raf=requestAnimationFrame(step)})}
function render(m){drawFront(m._f,m._p,m._id+"f");drawSide(m._s,m._p,m._id+"s",m._co)}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let uid=0;
window.mouthHTML=function(k){const L=SND[k];if(!L)return"";
  return `<div class="mouth" data-k="${k}">
  <div class="mviews"><svg class="mf" viewBox="0 0 320 236" role="img" aria-label="Mukh samne theke"></svg><svg class="ms" viewBox="92 60 252 222" role="img" aria-label="Mukh pash theke"></svg></div>
  <div class="mctl"><div class="mrow"><div class="mchips">${L.map((x,i)=>`<button class="mchip" data-i="${i}">${x[0]}</button>`).join("")}</div>
  <div class="mind"><span class="ind iv">🎵 Gola kape</span><span class="ind ia">💨 Batash</span><span class="ind in">👃 Nak diye</span></div></div>
  <ol class="msteps"></ol>
  <div class="mrow"><button class="mcmp">${L.length>1?"▶ Pashapashi dekho":"▶ Abar dekho"}</button><button class="mslow" aria-pressed="false">🐢 Dhire</button></div></div></div>`};
async function show(m,i,play){
  const run=++m._run,L=SND[m.dataset.k],x=L[i],slow=m._slow?1.9:1;
  m.querySelectorAll(".mchip").forEach((c,j)=>c.classList.toggle("on",j===i));
  const ol=m.querySelector(".msteps");ol.innerHTML=x[4].map(t=>`<li>${t}</li>`).join("");const li=ol.querySelectorAll("li");
  const on=n=>li.forEach((e,j)=>e.classList.toggle("on",j===n));
  m._co=x[5];
  const seq=(Array.isArray(x[1])?x[1]:[x[1]]).map(n=>P[n]);const last=seq[seq.length-1];
  const ind=()=>{const c=m._p;m.querySelector(".iv").classList.toggle("on",c.v>.5);m.querySelector(".ia").classList.toggle("on",c.air>.5);m.querySelector(".in").classList.toggle("on",c.nas>.5)};
  await anim(m,P.rest,200*slow);if(run!==m._run)return;
  if(seq.length>1){ // glide: start shape, glide, end
    on(0);await anim(m,seq[0],450*slow);if(run!==m._run)return;ind();await wait(300*slow);
    on(1);await anim(m,seq[1],800*slow);if(run!==m._run)return;on(2);ind();
    if(play)playEx(m,x);return}
  const t=last,ph1=Object.assign({},m._p,{fw:t.fw,fh:t.fh,frd:t.frd,jaw:t.jaw,lr:t.lr,lc:t.lc,ftt:t.ftt,ftb:t.ftb});
  on(0);await anim(m,ph1,420*slow);if(run!==m._run)return;
  on(1);await anim(m,Object.assign({},t,{v:0,air:0}),480*slow);if(run!==m._run)return;
  on(2);await anim(m,t,250*slow);ind();if(play)playEx(m,x);
}
function playEx(m,x){try{const card=m.closest(".sndcard");const w=card&&[...card.querySelectorAll("[data-clip]")].map(b=>b.dataset.clip).find(t=>x[3].test(t));if(w&&window.playWord)window.playWord(w)}catch(e){}}
window.initMouths=function(root){(root||document).querySelectorAll(".mouth").forEach(m=>{if(m._init)return;m._init=1;m._id="m"+(uid++);m._run=0;
  m._f=m.querySelector(".mf");m._s=m.querySelector(".ms");m._p=Object.assign({},P.rest);m._co=[];render(m);
  m.querySelectorAll(".mchip").forEach(c=>c.addEventListener("click",()=>show(m,+c.dataset.i,true)));
  m.querySelector(".mslow").addEventListener("click",e=>{m._slow=!m._slow;e.currentTarget.setAttribute("aria-pressed",m._slow);e.currentTarget.classList.toggle("on",m._slow)});
  m.querySelector(".mcmp").addEventListener("click",async()=>{const L=SND[m.dataset.k];const run0=m._run+1;for(let i=0;i<L.length;i++){await show(m,i,true);if(m._run!==run0+i)return;await wait(1300);if(m._run!==run0+i)return}});
  setTimeout(()=>show(m,0,false),250)})};
document.addEventListener("click",e=>{const b=e.target.closest("[data-clip]");if(!b)return;const card=b.closest(".sndcard");if(!card)return;const m=card.querySelector(".mouth");if(!m||!m._init)return;
  const L=SND[m.dataset.k];const i=L.findIndex(x=>x[3].test(b.dataset.clip));if(i>=0)show(m,i,false)});
})();

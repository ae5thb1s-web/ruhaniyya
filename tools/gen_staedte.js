// Erzeugt hosting/gebetszeiten/<stadt>/index.html (Diyanet/DITIB-Methode wie auf der Hauptseite)
const fs=require('fs'),path=require('path'),H=process.argv[2]||path.join(__dirname,'..');
const body=fs.readFileSync(H+'/index.html','utf8');
const grab=(a,b)=>{const i=body.indexOf(a),j=body.indexOf(b,i);return body.slice(i,j)};
const CALC=grab('const rad=x=>','function moonLon')+grab('/* Methoden.','function asr2');
eval(CALC.replace(/^const /gm,'var '));
const CJ=JSON.parse(fs.readFileSync(__dirname+'/cities.json','utf8'));const CN={DE:'Deutschland',AT:'Österreich',CH:'Schweiz',LI:'Liechtenstein'},CTZ={DE:'Europe/Berlin',AT:'Europe/Vienna',CH:'Europe/Zurich',LI:'Europe/Vaduz'},IN={DE:'in Deutschland',AT:'in Österreich',CH:'in der Schweiz',LI:'in Liechtenstein'};
const C=[];for(const iso of ['DE','AT','CH','LI'])for(const c of CJ[iso])C.push([c[0],c[1],c[2],iso,CTZ[iso],CN[iso],iso]);for(const c of CJ.WORLD)C.push([c[0],c[1],c[2],'WORLD',c[3],c[4],c[5]]);CN.WORLD='weltweit';IN.WORLD='weltweit';
const slug=n=>n.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[().]/g,'').replace(/\//g,'-').trim().replace(/\s+/g,'-');
const K=[21.4225,39.8262];const KON=t=>({Europe:'Europa',Asia:'Asien',Africa:'Afrika',America:'Amerika',Australia:'Australien'})[t.split('/')[0]];
const qibla=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),dl=rad(K[1]-lo);return fixA(deg(Math.atan2(Math.sin(dl),Math.cos(p1)*Math.tan(p2)-Math.sin(p1)*Math.cos(dl))))};
const dist=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),dp=p2-p1,dl=rad(K[1]-lo);const a=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 6371*2*Math.asin(Math.sqrt(a))};
let TZ='Europe/Berlin';const fmt=d=>d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:TZ});
const now=new Date(),Y=+now.toLocaleString('en',{year:'numeric',timeZone:TZ}),M=+now.toLocaleString('en',{month:'numeric',timeZone:TZ})-1;
const MON=new Date(Date.UTC(Y,M,15)).toLocaleDateString('de-DE',{month:'long',year:'numeric'});
const PN=['Fadschr','Sonnenaufgang','Dhuhr','Asr','Maghrib','Ischa'];
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const A=o=>esc(JSON.stringify(o)).replace(/"/g,"&quot;");

const css=`:root{--bg:#0F0C14;--card:#1a1424;--line:#2d2340;--tx:#ece4f7;--mut:#b7a8cc;--p:#B65CFF;--p2:#C784FF}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:17px/1.55 "Source Sans 3",system-ui,sans-serif}
a{color:var(--p2)}header{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line)}
header img{width:40px;height:40px;border-radius:50%}header b{font-family:"Reem Kufi",sans-serif;font-size:24px;color:var(--p2)}header small{display:block;color:var(--mut);font-size:13px}
main{max-width:860px;margin:0 auto;padding:18px 16px 40px}h1{font-family:"Reem Kufi",sans-serif;font-size:32px;line-height:1.2;margin:.3em 0}
h2{font-family:"Reem Kufi",sans-serif;font-size:22px;margin:1.6em 0 .5em}.mut{color:var(--mut)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}.t{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;text-align:center}
.t span{display:block;color:var(--mut);font-size:14px}.t b{font-size:28px}.t.on{border-color:var(--p);box-shadow:0 0 0 2px var(--p) inset}
.btn{display:inline-block;background:#8f3fe0;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600;margin:6px 0}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:15px}th,td{padding:7px 4px;text-align:center;border-bottom:1px solid var(--line)}th{color:var(--mut);font-weight:600}tr.today td{background:#2a1a40;font-weight:700}
.cities{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.cities a{display:block;padding:6px 12px;border:1px solid var(--line);border-radius:20px;text-decoration:none;color:var(--tx)}
footer{border-top:1px solid var(--line);padding:18px 16px;color:var(--mut);font-size:14px;text-align:center}
@media(max-width:560px){.grid{grid-template-columns:repeat(2,1fr)}h1{font-size:26px}table{font-size:13px}}`;
const head=(t,d,u)=>`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title><meta name="description" content="${esc(d)}"><link rel="canonical" href="${u}"><link rel="alternate" hreflang="de" href="${u}"><link rel="alternate" hreflang="tr" href="${u.replace('/gebetszeiten/','/tr/namaz-vakitleri/')}"><link rel="alternate" hreflang="x-default" href="${u}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/fonts.css"><meta name="theme-color" content="#8B1CF0">
<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}"><meta property="og:url" content="${u}"><meta property="og:image" content="https://ruhaniyya.live/logo.png"><meta property="og:locale" content="de_DE">
<style>${css}</style><script src="/gebetszeiten/i18n.js"></script></head><body><header><a href="/"><img src="/logo-96.png" alt="Ruhaniyya" width="40" height="40"></a><div><b>Ruhaniyya</b><small data-i="tag">Weg des spirituellen Islam</small></div><select id="lsel" aria-label="Sprache / Language" style="margin-inline-start:auto;background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:10px;padding:6px 8px;font:inherit"><option value="de">DE</option><option value="en">EN</option><option value="tr">TR</option><option value="ar">AR</option><option value="fa">FA</option><option value="ku">KU</option></select></header><main>`;
const foot=`</main><footer><a href="/">ruhaniyya.live</a> · <a href="/gebetszeiten/" data-i="fz">Gebetszeiten DACH</a> · <a href="/impressum.html" data-i="imp">Impressum</a> · <a href="/datenschutz.html" data-i="dat">Datenschutz</a></footer><script>RH.run()</script>`;
const days=new Date(Date.UTC(Y,M+1,0)).getUTCDate();
const pages=[];
for(const [n,la,lo,iso,tz,land,ciso] of C){TZ=tz;
  const s=slug(n),u=`https://ruhaniyya.live/gebetszeiten/${s}/`,q=Math.round(qibla(la,lo)),km=Math.round(dist(la,lo));
  let rows='';for(let d=1;d<=days;d++){const dt=new Date(Y,M,d),t=prayerTimes(dt,la,lo,tz);rows+=`<tr data-d="${d}"><td>${dt.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'})}</td>${t.map(x=>`<td>${fmt(x)}</td>`).join('')}</tr>`}
  const near=C.filter(c=>c[0]!==n).map(c=>[c,(c[1]-la)**2+((c[2]-lo)*Math.cos(rad(la)))**2]).sort((a,b)=>a[1]-b[1]).slice(0,8).map(([c])=>`<li><a href="/gebetszeiten/${slug(c[0])}/">${c[0]}</a></li>`).join('');
  const T=`Gebetszeiten ${n} heute – ${MON} | Ruhaniyya`,D=`Gebetszeiten für ${n} heute und für ${MON}: Fadschr, Sonnenaufgang, Dhuhr, Asr, Maghrib, Ischa nach Diyanet/DITIB-Methode. Qibla-Richtung ${q}°.`;
  const ld={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":`Wie ist die Qibla-Richtung in ${n}?`,"acceptedAnswer":{"@type":"Answer","text":`Die Qibla liegt von ${n} aus bei etwa ${q}° von Norden (im Uhrzeigersinn), die Kaaba ist rund ${km.toLocaleString('de-DE')} km entfernt.`}},{"@type":"Question","name":`Nach welcher Methode werden die Gebetszeiten für ${n} berechnet?`,"acceptedAnswer":{"@type":"Answer","text":`Nach der Methode der türkischen Religionsbehörde Diyanet, die auch DITIB verwendet: Fadschr bei 18°, Ischa bei ${/^(Europe|America|Atlantic)\//.test(tz)&&tz!=='Europe/Istanbul'?16:17}° Sonnentiefe, mit den üblichen Diyanet-Zuschlägen.`}}]};
  const html=head(T,D,u)+`<i hidden data-ti="title" data-a="${A({n})}"></i><p class="mut"><a href="/gebetszeiten/#${iso==='WORLD'?KON(tz):iso}" data-i="r${iso==='WORLD'?KON(tz):iso}">Gebetszeiten ${iso==='WORLD'?KON(tz):CN[iso]}</a> › ${n}${iso==='WORLD'&&land?', <span data-ln="'+ciso+'">'+land+'</span>':''}</p>
<h1 data-i="h1" data-a="${A({n})}">Gebetszeiten ${n}</h1><p class="mut" id="today">Heute</p>
<div class="grid" id="now"></div>
<a class="btn" id="live" href="/#gebetszeiten" data-i="live">Live-Gebetszeiten, Gebetsuhr und Qibla-Globus öffnen</a>
<h2 data-i="qh" data-a="${A({n})}">Qibla-Richtung in ${n}</h2><p data-i="qp" data-a="${A({n,q,km})}">Von ${n} aus liegt die Qibla bei <b>${q}°</b> von Norden, im Uhrzeigersinn gemessen. Die Kaaba in Mekka ist etwa <b>${km.toLocaleString('de-DE')} km</b> entfernt. Auf der <a href="/#gebetszeiten">Hauptseite</a> kannst du die Richtung mit dem Kompass deines Handys prüfen.</p>
<h2 data-i="mh" data-a="${A({n})}">Gebetszeiten ${n} im <span id="mon">${MON}</span></h2>
<div style="overflow-x:auto"><table><thead><tr><th data-i="day">Tag</th>${PN.map((p,i)=>`<th data-pn="${i}">${p}</th>`).join('')}</tr></thead><tbody id="tb">${rows}</tbody></table></div>
<p class="mut"><span data-i="calc" data-a="${A({i:/^(Europe|America|Atlantic)\//.test(tz)&&tz!=='Europe/Istanbul'?16:17})}">Berechnet nach der Methode der Diyanet, die auch DITIB verwendet (Fadschr 18°, Ischa ${/^(Europe|America|Atlantic)\//.test(tz)&&tz!=='Europe/Istanbul'?16:17}°, mit Diyanet-Zuschlägen), abgeglichen mit den amtlichen Diyanet-Tabellen: höchstens eine Minute Abweichung. Im Zweifel gilt der Kalender deiner Gemeinde.</span>${iso==='WORLD'?` <span data-i="world" data-a="${A({l:land||n,iso:ciso})}">Vor Ort wird oft eine andere Berechnungsmethode verwendet, dann können die Zeiten stärker abweichen. Uhrzeiten in Ortszeit ${land?land:n}.</span>`:''}</p>
<h2 data-i="fh" data-a="${A({n})}">Freitagsgebet in ${n}</h2><p data-i="fp">Das Freitagsgebet (Dschumʿa) findet zur Dhuhr-Zeit statt. Viele Moscheen beginnen mit der Predigt etwas früher, frag am besten bei deiner Gemeinde nach.</p>
<h2 data-i="nh">Gebetszeiten in der Nähe</h2><ul class="cities">${near}</ul>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>const LAT=${la},LNG=${lo},N=${JSON.stringify(n)};
${CALC}
const PN=${JSON.stringify(PN)},TZ=${JSON.stringify(tz)},f=d=>d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",timeZone:TZ}),DE=RH.L==="de";
const now=new Date(),Y=+now.toLocaleString("en",{year:"numeric",timeZone:TZ}),M=+now.toLocaleString("en",{month:"numeric",timeZone:TZ})-1,D=+now.toLocaleString("en",{day:"numeric",timeZone:TZ});
const t=prayerTimes(new Date(Y,M,D),LAT,LNG,TZ);let nx=t.findIndex(x=>x>now);
document.getElementById("today").textContent=(DE?"Heute":RH.t("today"))+RH.c+(DE?new Date(Y,M,D).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):RH.d(new Date(Y,M,D,12),"long"));
document.getElementById("now").innerHTML=t.map((x,i)=>'<div class="t'+(i===nx?' on':'')+'"><span>'+RH.pn(i)+(i===nx?' · '+(DE?'als Nächstes':RH.t('next')):'')+'</span><b>'+f(x)+'</b></div>').join("");
if(${Y}!==Y||${M}!==M||!DE){const n=new Date(Date.UTC(Y,M+1,0)).getUTCDate();let r="";for(let d=1;d<=n;d++){const dt=new Date(Y,M,d);r+='<tr data-d="'+d+'"><td>'+(DE?dt.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}):RH.d(new Date(Y,M,d,12),"row"))+'</td>'+prayerTimes(dt,LAT,LNG,TZ).map(x=>"<td>"+f(x)+"</td>").join("")+"</tr>"}document.getElementById("tb").innerHTML=r;if(DE)document.getElementById("mon").textContent=new Date(Date.UTC(Y,M,15)).toLocaleDateString("de-DE",{month:"long",year:"numeric"})}
const tr=document.querySelector('#tb tr[data-d="'+D+'"]');if(tr)tr.className="today";
document.getElementById("live").addEventListener("click",()=>{try{localStorage.setItem("rh_place",JSON.stringify({n:N,c:${JSON.stringify(land)},lat:LAT,lng:LNG,tz:TZ,iso:${JSON.stringify(ciso)}}))}catch(e){}});
</script>`+foot+`</body></html>`;
  fs.mkdirSync(`${H}/gebetszeiten/${s}`,{recursive:true});fs.writeFileSync(`${H}/gebetszeiten/${s}/index.html`,html);pages.push([n,s,iso,tz]);
}
let lists='';const KON0=t=>({Europe:'Europa',Asia:'Asien',Africa:'Afrika',America:'Amerika',Australia:'Australien'})[t.split('/')[0]];for(const iso of ['DE','AT','CH','LI','Europa','Asien','Afrika','Amerika','Australien']){if(!IN[iso])IN[iso]=iso==='Australien'?'in Australien':'in '+iso;const P=pages.filter(p=>p[2]===iso||(p[2]==='WORLD'&&KON(p[3])===iso)).sort((a,b)=>a[0].localeCompare(b[0],'de'));lists+=`<h2 id="${iso}" data-i="r${iso}">Gebetszeiten ${IN[iso]}</h2><ul class="cities">${P.map(([n,s])=>`<li><a href="/gebetszeiten/${s}/">${n}</a></li>`).join('')}</ul>`}
fs.writeFileSync(`${H}/gebetszeiten/index.html`,head(`Gebetszeiten Deutschland, Österreich, Schweiz & weltweit – ${MON} | Ruhaniyya`,`Gebetszeiten für ${pages.length} Städte in Deutschland, Österreich, der Schweiz und weltweit: heute und für den ganzen Monat, nach Diyanet/DITIB-Methode, mit Qibla-Richtung.`,'https://ruhaniyya.live/gebetszeiten/')+
`<i hidden data-ti="ititle"></i><h1 data-i="ih1">Gebetszeiten in Deutschland, Österreich, der Schweiz und weltweit</h1><p data-i="ip">Wähle deine Stadt für die heutigen Gebetszeiten, den Monatsplan für ${MON} und die Qibla-Richtung. Für jeden anderen Ort der Welt nutze die <a href="/#gebetszeiten">Gebetszeiten auf der Hauptseite</a>, dort findest du auch deinen Standort.</p>${lists}`+foot+'</body></html>');
const today=new Date().toISOString().slice(0,10);
let sm=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://ruhaniyya.live/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n  <url><loc>https://ruhaniyya.live/gebetszeiten/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
for(const [,s] of pages)sm+=`  <url><loc>https://ruhaniyya.live/gebetszeiten/${s}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
sm+=`  <url><loc>https://ruhaniyya.live/impressum.html</loc><priority>0.2</priority></url>\n  <url><loc>https://ruhaniyya.live/datenschutz.html</loc><priority>0.2</priority></url>\n</urlset>\n`;
fs.writeFileSync(`${H}/sitemap.xml`,sm);fs.copyFileSync(__dirname+'/i18n.js',`${H}/gebetszeiten/i18n.js`);console.log(pages.length,'Seiten');

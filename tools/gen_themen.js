// Erzeugt eigene Themenseiten (für Google): /fastentage/, /weisse-tage/, /ramadan-2027/, /islamischer-kalender/, /qibla/, /horoskop/, /moscheen/, /tasbih/
// Aufruf: TZ=Europe/Berlin node gen.js <zielordner>   (Zielordner = Repo-Wurzel, dort liegt auch sitemap.xml)
const fs=require('fs'),path=require('path');
const OUT=process.argv[2]||path.join(__dirname,'..');
const page=fs.readFileSync(OUT+'/index.html','utf8');
const cut=(a,b)=>{const i=page.indexOf(a),j=page.indexOf(b,i);if(i<0||j<0)throw new Error('nicht gefunden: '+a);return page.slice(i,j)};
// Kalender- und Mondcode der Hauptseite übernehmen (gleiche Berechnung wie auf ruhaniyya.live)
const store={get:(k,d)=>d},LANG='de',trT=s=>s,trF=(k,v)=>k.replace(/\{(\w+)\}/g,(m,n)=>v[n]),MN=i=>MONTHS[i];
let CAL=cut('const MONTHS=','function moonPhaseName');
CAL=CAL.replace(/^const arDigits[^\n]*\n/m,'').replace(/^const th=hijri[\s\S]*$/m,'');
const mk=hoff=>new Function('store','LANG','trT','trF','MN',CAL.replace('const HCAL=store.get("rh_hcal","sicht")==="uq"?"uq":"sicht",HOFF=HCAL==="sicht"?1:0;','const HOFF='+hoff+';')+';return {MONTHS,hijri,classify,phaseOnDay,lunation,jdOf,dateOfJd,addDays,midnight,REC_M};')(store,LANG,trT,trF,i=>MONTHS_[i]);
const MONTHS_=JSON.parse(cut('const MONTHS=[','];').slice('const MONTHS='.length)+']');
const S=mk(1),U=mk(0); // S = Mondsichtung (Standard der Seite), U = Umm al-Qura / Diyanet
const TS=cut('(()=>{const SUB=','const GR=');
const PRE=new Function(TS.replace('(()=>{','')+';return PRE;')();

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const D=(d,o)=>d.toLocaleDateString('de-DE',Object.assign({timeZone:'Europe/Berlin'},o||{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
const DS=d=>D(d,{weekday:'short',day:'numeric',month:'long',year:'numeric'});
const T=d=>d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'});
const today=S.midnight(new Date()),GEN=D(today,{day:'numeric',month:'long',year:'numeric'});
const fh=h=>`${h.d}. ${S.MONTHS[h.m-1]} ${h.y}`;

const css=`:root{--bg:#0F0C14;--card:#1a1424;--line:#2d2340;--tx:#ece4f7;--mut:#b7a8cc;--p:#B65CFF;--p2:#C784FF;--g:#3ddc97}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:17px/1.6 "Source Sans 3",system-ui,sans-serif}
a{color:var(--p2)}header{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line)}
header img{width:40px;height:40px;border-radius:50%}header b{font-family:"Reem Kufi",sans-serif;font-size:24px;color:var(--p2)}header small{display:block;color:var(--mut);font-size:13px}
main{max-width:860px;margin:0 auto;padding:18px 16px 40px}h1{font-family:"Reem Kufi",sans-serif;font-size:32px;line-height:1.2;margin:.3em 0}
h2{font-family:"Reem Kufi",sans-serif;font-size:22px;margin:1.6em 0 .5em}h3{font-size:18px;margin:1.2em 0 .3em}.mut{color:var(--mut)}.lead{font-size:19px}
.btn{display:inline-block;background:#8f3fe0;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600;margin:6px 0}
.box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:12px 0}.box b.big{font-size:24px;display:block}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:15px}th,td{padding:7px 6px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--mut);font-weight:600}
.tw{overflow-x:auto}.ar{font-family:Amiri,"Noto Naskh Arabic",serif;font-size:1.3em;direction:rtl;display:block}
.links{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.links a{display:block;padding:6px 12px;border:1px solid var(--line);border-radius:20px;text-decoration:none;color:var(--tx)}
footer{border-top:1px solid var(--line);padding:18px 16px;color:var(--mut);font-size:14px;text-align:center}
@media(max-width:560px){h1{font-size:26px}table{font-size:14px}}`;
const PAGES=[['fastentage','Fastentage'],['weisse-tage','Weiße Tage'],['ramadan-2027','Ramadan 2027'],['islamischer-kalender','Islamischer Kalender'],['qibla','Qibla-Richtung'],['tasbih','Tasbīḥ & Dhikr'],['moscheen','Moscheen in der Nähe'],['horoskop','Horoskop'],['gebet-lernen','Beten lernen'],['was-bricht-das-fasten','Was bricht das Fasten?'],['laylat-al-qadr','Laylat al-Qadr'],['gebetszeiten','Gebetszeiten']];
const TRA={'weisse-tage':'tr/beyaz-gunler','ramadan-2027':'tr/ramazan-2027'};
function html(slug,title,desc,body,faq){
  const u=`https://ruhaniyya.live/${slug}/`;
  const ld=[{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Ruhaniyya","item":"https://ruhaniyya.live/"},{"@type":"ListItem","position":2,"name":title.split(' – ')[0].split(' | ')[0],"item":u}]}];
  if(faq&&faq.length)ld.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))});
  const faqH=faq&&faq.length?`<h2>Häufige Fragen</h2>`+faq.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join(''):'';
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${u}">${TRA[slug]?`<link rel="alternate" hreflang="de" href="${u}"><link rel="alternate" hreflang="tr" href="https://ruhaniyya.live/${TRA[slug]}/"><link rel="alternate" hreflang="x-default" href="${u}">`:''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/fonts.css"><meta name="theme-color" content="#8B1CF0">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${u}"><meta property="og:image" content="https://ruhaniyya.live/logo.png"><meta property="og:locale" content="de_DE"><meta property="og:site_name" content="Ruhaniyya">
<style>${css}</style>${ld.map(x=>`<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('')}</head><body><header><a href="/"><img src="/logo.png" alt="Ruhaniyya" width="40" height="40"></a><div><b>Ruhaniyya</b><small>Weg des spirituellen Islam</small></div></header><main>
<p class="mut"><a href="/">Ruhaniyya</a> › ${esc(title.split(' – ')[0].split(' | ')[0])}</p>
${body}${faqH}
<h2>Mehr auf Ruhaniyya</h2><ul class="links">${PAGES.filter(p=>p[0]!==slug).map(([s,n])=>`<li><a href="/${s}/">${n}</a></li>`).join('')}</ul>
<p class="mut" style="margin-top:2em">Stand: ${GEN}. Die Daten werden mit derselben Berechnung erzeugt wie auf <a href="/">ruhaniyya.live</a>.</p>
</main><footer><a href="/">ruhaniyya.live</a> · <a href="/gebetszeiten/">Gebetszeiten</a> · <a href="/impressum.html">Impressum</a> · <a href="/datenschutz.html">Datenschutz</a></footer></body></html>`}
const write=(slug,h)=>{fs.mkdirSync(path.join(OUT,slug),{recursive:true});fs.writeFileSync(path.join(OUT,slug,'index.html'),h)};

/* ---------- Fastentage der nächsten 12 Monate ---------- */
const DAYS=[];for(let i=0;i<400;i++){const d=S.addDays(today,i);DAYS.push({d,h:S.hijri(d),u:U.hijri(d),c:S.classify(d),p:S.phaseOnDay(d)})}
const yr=today.getFullYear();
// Weiße Tage: Vollmondtag in der Mitte (Regel der Seite), Ramadan ausgenommen
const bid=[];DAYS.forEach((x,i)=>{if(x.p&&x.p.t==='full'&&i>0&&i<DAYS.length-1&&x.h.m!==9)bid.push({a:DAYS[i-1].d,m:x.d,b:DAYS[i+1].d,at:x.p.at,h:x.h})});
// Monatsanfänge (Sichtung und Umm al-Qura)
const starts=[];DAYS.forEach((x,i)=>{if(x.h.d===1)starts.push({m:x.h.m,y:x.h.y,s:x.d,u:null});});
starts.forEach(s=>{const k=DAYS.find(x=>x.u.d===1&&x.u.m===s.m&&x.u.y===s.y);s.u=k?k.d:null});
const findH=(m,d,y,cal)=>{const k=DAYS.find(x=>(cal==='u'?x.u:x.h).m===m&&(cal==='u'?x.u:x.h).d===d&&(!y||(cal==='u'?x.u:x.h).y===y));return k?k.d:null};
const bidRows=bid.slice(0,12).map(b=>`<tr><td><b>${D(b.a,{day:'numeric',month:'short'})} – ${D(b.b,{day:'numeric',month:'short',year:'numeric'})}</b></td><td>${S.MONTHS[b.h.m-1]} ${b.h.y}</td><td>Vollmond am ${D(b.m,{weekday:'short',day:'numeric',month:'long'})} um ${T(b.at)} Uhr</td></tr>`).join('');
const nb=bid[0];
write('weisse-tage',html('weisse-tage',`Weiße Tage ${yr}/${yr+1}: alle Termine (Ayyām al-Bīḍ) | Ruhaniyya`,
 `Die nächsten Weißen Tage: ${D(nb.a,{day:'numeric',month:'long'})} bis ${D(nb.b,{day:'numeric',month:'long',year:'numeric'})}. Alle Termine der Ayyām al-Bīḍ für die nächsten 12 Monate, mit Vollmond-Uhrzeit.`,
 `<h1>Weiße Tage (Ayyām al-Bīḍ): die nächsten Termine</h1>
<div class="box"><span class="mut">Die nächsten Weißen Tage</span><b class="big">${D(nb.a,{weekday:'short',day:'numeric',month:'long'})} – ${D(nb.b,{weekday:'short',day:'numeric',month:'long',year:'numeric'})}</b>Vollmond am ${D(nb.m)} um ${T(nb.at)} Uhr (deutsche Zeit)</div>
<p class="lead">Die Weißen Tage sind die drei Tage um den Vollmond, im Mondkalender der 13., 14. und 15. Tag. Der Prophet <span>ﷺ</span> empfahl, an ihnen zu fasten: „Wenn du im Monat drei Tage fastest, dann faste den 13., 14. und 15.“ (at-Tirmidhī 761, an-Nasāʾī 2424). Wer drei Tage im Monat fastet, ist, als hätte er das ganze Jahr gefastet (al-Buchārī 1979).</p>
<a class="btn" href="/#fasten">Fastenkalender mit Erinnerung öffnen</a>
<h2>Alle Weißen Tage der nächsten 12 Monate</h2>
<p>Auf Ruhaniyya liegt der Vollmondtag immer in der Mitte der drei Tage, so wie man es am Himmel sieht. Im Ramadan entfallen die Weißen Tage, weil ohnehin der ganze Monat gefastet wird.</p>
<div class="tw"><table><thead><tr><th>Weiße Tage</th><th>Mondmonat</th><th>Vollmond</th></tr></thead><tbody>${bidRows}</tbody></table></div>
<p class="mut">Im Kalender der Hauptseite kannst du auch die Regel „13.–15. des Mondmonats“ wählen. Je nach Kalender (Mondsichtung oder Umm al-Qura/Diyanet) kann ein Tag Unterschied entstehen.</p>`,
 [[`Wann sind die nächsten Weißen Tage?`,`Die nächsten Weißen Tage sind von ${D(nb.a)} bis ${D(nb.b)}. Der Vollmond ist am ${D(nb.m)} um ${T(nb.at)} Uhr.`],
  ['Warum heißen sie Weiße Tage?','Weil die Nächte um den Vollmond hell sind: der Mond leuchtet die ganze Nacht. Arabisch heißen sie al-Ayyām al-Bīḍ.'],
  ['Muss man an den Weißen Tagen fasten?','Nein, das Fasten ist Sunnah, also empfohlen, aber keine Pflicht.'],
  ['Kann ich die Weißen Tage mit Montag und Donnerstag verbinden?','Ja. Fällt ein Weißer Tag auf einen Montag oder Donnerstag, gilt das Fasten für beides.']]));

/* Fastentage-Übersicht */
const N60=DAYS.slice(0,60).filter(x=>x.c.some(c=>c.k!=='no'));
const listRows=N60.map(x=>`<tr><td><b>${DS(x.d)}</b></td><td>${x.c.filter(c=>c.k!=='no').map(c=>esc(c.t)).join(', ')}</td><td class="mut">${fh(x.h)}</td></tr>`).join('');
const spec=DAYS.filter(x=>x.c.some(c=>c.g==='special'&&/Arafa|Ashura|Tasuʿa/.test(c.t))).map(x=>`<li><b>${x.c.filter(c=>/Arafa|Ashura|Tasuʿa/.test(c.t)).map(c=>c.t).join(', ')}:</b> ${D(x.d)}</li>`).join('');
write('fastentage',html('fastentage',`Sunnah-Fastentage ${yr}/${yr+1}: Kalender mit allen Terminen | Ruhaniyya`,
 `Wann fasten? Montag und Donnerstag, Weiße Tage, Arafa, Ashura, Schawwal: alle Sunnah-Fastentage der nächsten Wochen mit Datum, plus Kalender mit Erinnerung.`,
 `<h1>Sunnah-Fastentage: alle Termine</h1>
<p class="lead">Neben dem Ramadan hat der Prophet <span>ﷺ</span> an bestimmten Tagen gefastet und dazu ermutigt. Hier findest du alle empfohlenen Fastentage der nächsten 60 Tage, berechnet nach dem Mondkalender.</p>
<a class="btn" href="/#fasten">Fastenkalender mit Erinnerung öffnen</a>
<h2>Die nächsten Fastentage</h2><div class="tw"><table><thead><tr><th>Datum</th><th>Fastentag</th><th>Mondkalender</th></tr></thead><tbody>${listRows}</tbody></table></div>
<h2>Besondere Tage im kommenden Jahr</h2><ul>${spec}</ul>
<h2>Welche Fastentage gibt es?</h2>
<h3>Montag und Donnerstag</h3><p>„Die Taten werden am Montag und Donnerstag vorgelegt, und ich möchte, dass meine Taten vorgelegt werden, während ich faste.“ (at-Tirmidhī 747)</p>
<h3>Die Weißen Tage</h3><p>Die drei Tage um den Vollmond (13. bis 15. des Mondmonats). <a href="/weisse-tage/">Alle Termine der Weißen Tage</a>.</p>
<h3>Der Tag von Arafa</h3><p>Der 9. Dhu l-Hiddscha. Das Fasten an diesem Tag sühnt die Sünden des vergangenen und des kommenden Jahres (Muslim 1162).</p>
<h3>Ashura und Tasuʿa</h3><p>Der 10. Muharram, am besten zusammen mit dem 9. Das Fasten an Ashura sühnt die Sünden des vergangenen Jahres (Muslim 1162).</p>
<h3>Sechs Tage im Schawwal</h3><p>Wer den Ramadan fastet und danach sechs Tage im Schawwal, ist wie einer, der das ganze Jahr fastet (Muslim 1164).</p>
<h3>An welchen Tagen nicht gefastet wird</h3><p>Am Eid al-Fitr, am Eid al-Adha und an den drei Taschriq-Tagen danach wird nicht gefastet.</p>`,
 [['An welchen Tagen sollte man als Muslim fasten?','Pflicht ist der Ramadan. Sunnah sind unter anderem Montag und Donnerstag, die drei Weißen Tage um den Vollmond, der Tag von Arafa, Ashura mit Tasuʿa und sechs Tage im Schawwal.'],
  ['Darf man freitags fasten?','Den Freitag allein zu fasten ist unerwünscht (al-Buchārī 1985). Mit dem Tag davor oder danach, oder wenn er auf einen Weißen Tag oder Arafa fällt, ist es erlaubt.'],
  ['Wie bekomme ich eine Erinnerung?','Im Fastenkalender auf ruhaniyya.live kannst du Erinnerungen aktivieren oder alle Fastentage in deinen Handykalender übernehmen.']]));

/* ---------- Ramadan 2027 ---------- */
const R0s=findH(9,1,1448,'s'),R0u=findH(9,1,1448,'u'),Es=findH(10,1,1448,'s'),Eu=findH(10,1,1448,'u'),Rlast=S.addDays(Es,-1);
const Arafa=findH(12,9,1448,'s'),ArafaU=findH(12,9,1448,'u'),Adha=findH(12,10,1448,'s'),AdhaU=findH(12,10,1448,'u'),Mu=findH(1,1,1449,'s'),Ash=findH(1,10,1449,'s');
const qadr=[21,23,25,27,29].map(n=>{const d=findH(9,n,1448,'s');return `<li>${n}. Nacht: Nacht vor ${D(d)}${n===27?' (von vielen besonders erhofft)':''}</li>`}).join('');
write('ramadan-2027',html('ramadan-2027',`Ramadan 2027: Beginn ${D(R0u,{day:'numeric',month:'long'})}, Ende und Eid al-Fitr | Ruhaniyya`,
 `Ramadan 2027 beginnt voraussichtlich am ${D(R0u,{weekday:'long',day:'numeric',month:'long',year:'numeric'})} (Diyanet/Umm al-Qura) bzw. ${D(R0s,{day:'numeric',month:'long'})} nach Mondsichtung. Eid al-Fitr, Laylat al-Qadr, Arafa und Eid al-Adha 2027.`,
 `<h1>Ramadan 2027: wann beginnt er?</h1>
<div class="box"><span class="mut">Erster Fastentag (Ramadan 1448)</span><b class="big">${D(R0u)}</b>nach Diyanet / Umm al-Qura · nach Mondsichtung oft einen Tag später: ${D(R0s)}</div>
<p class="lead">Der Ramadan 1448 nach der Hidschra fällt in den Februar und März 2027. Der Monat beginnt mit dem Neulicht, deshalb nennen Diyanet (Türkei, DITIB) und der saudische Umm-al-Qura-Kalender ihre Termine vorab, während Gemeinden, die auf die Mondsichtung warten, oft einen Tag später beginnen.</p>
<a class="btn" href="/#fasten">Ramadan im Fastenkalender ansehen</a>
<h2>Die wichtigsten Termine 2027</h2>
<div class="tw"><table><thead><tr><th>Ereignis</th><th>Diyanet / Umm al-Qura</th><th>Mondsichtung</th></tr></thead><tbody>
<tr><td>Erster Tarawih (Vorabend)</td><td>${D(S.addDays(R0u,-1))}</td><td>${D(S.addDays(R0s,-1))}</td></tr>
<tr><td><b>Erster Fastentag</b></td><td><b>${D(R0u)}</b></td><td><b>${D(R0s)}</b></td></tr>
<tr><td>Letzter Fastentag</td><td>${D(S.addDays(Eu,-1))}</td><td>${D(Rlast)}</td></tr>
<tr><td><b>Eid al-Fitr (Ramazan Bayramı)</b></td><td><b>${D(Eu)}</b></td><td><b>${D(Es)}</b></td></tr>
<tr><td>Tag von Arafa</td><td>${D(ArafaU)}</td><td>${D(Arafa)}</td></tr>
<tr><td><b>Eid al-Adha (Kurban Bayramı)</b></td><td><b>${D(AdhaU)}</b></td><td><b>${D(Adha)}</b></td></tr>
<tr><td>Islamisches Neujahr 1449</td><td>${D(findH(1,1,1449,'u'))}</td><td>${D(Mu)}</td></tr>
<tr><td>Ashura</td><td>${D(findH(1,10,1449,'u'))}</td><td>${D(Ash)}</td></tr>
</tbody></table></div>
<h2>Laylat al-Qadr 2027</h2><p>Die Nacht der Bestimmung liegt in den ungeraden Nächten der letzten zehn Tage (al-Buchārī 2017). Die islamische Nacht beginnt am Abend vor dem Tag. Nach Mondsichtung:</p><ul>${qadr}</ul>
<h2>Gebetszeiten und Fastenzeiten im Ramadan</h2><p>Das Fasten beginnt mit Fadschr (Imsak) und endet mit Maghrib. Die genauen Zeiten für deine Stadt findest du unter <a href="/gebetszeiten/">Gebetszeiten</a>, zum Beispiel für <a href="/gebetszeiten/berlin/">Berlin</a>, <a href="/gebetszeiten/koeln/">Köln</a> oder <a href="/gebetszeiten/hamburg/">Hamburg</a>.</p>`,
 [['Wann beginnt der Ramadan 2027?',`Nach Diyanet und Umm al-Qura ist der erste Fastentag ${D(R0u)}. Gemeinden, die auf die Mondsichtung warten, beginnen oft am ${D(R0s)}.`],
  ['Wann ist Eid al-Fitr 2027?',`Eid al-Fitr ist voraussichtlich am ${D(Eu)} (Diyanet/Umm al-Qura) bzw. ${D(Es)} nach Mondsichtung.`],
  ['Wann ist Eid al-Adha 2027?',`Eid al-Adha ist voraussichtlich am ${D(AdhaU)} (Diyanet/Umm al-Qura) bzw. ${D(Adha)} nach Mondsichtung.`],
  ['Warum gibt es unterschiedliche Daten?','Manche Länder und Gemeinden richten sich nach einem vorab berechneten Kalender (Diyanet, Umm al-Qura), andere warten auf die tatsächliche Sichtung der Mondsichel. Dadurch kann ein Tag Unterschied entstehen. Im Zweifel gilt die Ankündigung deiner Gemeinde.']]));

/* ---------- Islamischer Kalender ---------- */
const th=S.hijri(today),thu=U.hijri(today);
const stRows=starts.slice(0,13).map(s=>`<tr><td><b>${S.MONTHS[s.m-1]} ${s.y}</b>${S.REC_M[s.m]?' ⭐':''}${s.m===9?' 🌙':''}</td><td>${s.u?D(s.u,{weekday:'short',day:'numeric',month:'long',year:'numeric'}):'–'}</td><td>${D(s.s,{weekday:'short',day:'numeric',month:'long',year:'numeric'})}</td></tr>`).join('');
write('islamischer-kalender',html('islamischer-kalender',`Islamischer Kalender ${yr}/${yr+1}: Hijri-Datum heute und Monatsanfänge | Ruhaniyya`,
 `Heute ist ${fh(th)} (nach Mondsichtung). Islamischer Kalender mit allen Monatsanfängen der nächsten 12 Monate, Ramadan, Eid und den heiligen Monaten.`,
 `<h1>Islamischer Kalender (Hijri-Kalender)</h1>
<div class="box"><span class="mut">Heute, ${D(today)}</span><b class="big">${fh(th)} n. H.</b>nach Mondsichtung · nach Diyanet / Umm al-Qura: ${fh(thu)}</div>
<p class="lead">Der islamische Kalender ist ein reiner Mondkalender. Jeder Monat beginnt mit der ersten sichtbaren Mondsichel und hat 29 oder 30 Tage, das Jahr ist dadurch etwa 11 Tage kürzer als das Sonnenjahr. Die Zählung beginnt mit der Hidschra, der Auswanderung des Propheten <span>ﷺ</span> nach Medina im Jahr 622.</p>
<a class="btn" href="/#kalender">Mondkalender mit Mondphasen öffnen</a>
<h2>Monatsanfänge der nächsten 12 Monate</h2>
<div class="tw"><table><thead><tr><th>Monat</th><th>Diyanet / Umm al-Qura</th><th>Mondsichtung</th></tr></thead><tbody>${stRows}</tbody></table></div>
<p class="mut">⭐ empfohlener Fastenmonat bzw. heiliger Monat · 🌙 Ramadan. Mehr dazu: <a href="/ramadan-2027/">Ramadan 2027</a>, <a href="/fastentage/">Fastentage</a>, <a href="/weisse-tage/">Weiße Tage</a>.</p>
<h2>Die zwölf islamischen Monate</h2><ol>${S.MONTHS.map((m,i)=>`<li><b>${m}</b>${S.REC_M[i+1]?': '+esc(S.REC_M[i+1].replace(/^Empfohlener Fastenmonat: /,'')):i===8?': Monat des Fastens':''}</li>`).join('')}</ol>`,
 [['Welches islamische Datum ist heute?',`Heute, ${D(today)}, ist ${fh(th)} nach Mondsichtung bzw. ${fh(thu)} nach Diyanet und Umm al-Qura.`],
  ['Welches islamische Jahr haben wir?',`Wir sind im Jahr ${th.y} nach der Hidschra.`],
  ['Welche Monate sind heilig?','Muharram, Radschab, Dhu l-Qaʿda und Dhu l-Hiddscha (Qur\'an 9:36).']]));

/* ---------- Qibla ---------- */
const CJ=JSON.parse(fs.readFileSync(path.join(__dirname,'cities.json'),'utf8'));
const slug=n=>n.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[().]/g,'').replace(/\//g,'-').trim().replace(/\s+/g,'-');
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI,K=[21.4225,39.8262];
const qib=(la,lo)=>{const dl=rad(K[1]-lo);return Math.round((deg(Math.atan2(Math.sin(dl),Math.cos(rad(la))*Math.tan(rad(K[0]))-Math.sin(rad(la))*Math.cos(dl)))+360)%360)};
const dist=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),a=Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(rad(K[1]-lo)/2)**2;return Math.round(6371*2*Math.asin(Math.sqrt(a)))};
const hasPage=n=>fs.existsSync(path.join(OUT,'gebetszeiten',slug(n)));
const qRows=list=>list.map(c=>`<tr><td>${hasPage(c[0])?`<a href="/gebetszeiten/${slug(c[0])}/">${c[0]}</a>`:c[0]}</td><td><b>${qib(c[1],c[2])}°</b></td><td>${dist(c[1],c[2]).toLocaleString('de-DE')} km</td></tr>`).join('');
const dirName=q=>['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'][Math.round(q/45)%8];
write('qibla',html('qibla',`Qibla-Richtung Deutschland: Gebetsrichtung für deine Stadt | Ruhaniyya`,
 `In Deutschland liegt die Qibla etwa im Südosten (Berlin ${qib(52.52,13.405)}°, Köln ${qib(50.938,6.96)}°, München ${qib(48.137,11.575)}°). Qibla-Richtung für über 60 deutsche Städte, Österreich und die Schweiz, mit Kompass.`,
 `<h1>Qibla-Richtung: die Gebetsrichtung nach Mekka</h1>
<p class="lead">Die Qibla ist die Richtung zur Kaaba in Mekka, in die Muslime beten. Von Deutschland aus liegt sie im <b>Südosten</b>, je nach Stadt zwischen etwa ${Math.min(...CJ.DE.map(c=>qib(c[1],c[2])))}° und ${Math.max(...CJ.DE.map(c=>qib(c[1],c[2])))}° von Norden, im Uhrzeigersinn gemessen.</p>
<a class="btn" href="/#gebetszeiten">Qibla mit Globus und Handy-Kompass prüfen</a>
<h2>So findest du die Qibla</h2><ol><li>Öffne auf ruhaniyya.live die Gebetszeiten und wähle deinen Ort.</li><li>Tippe unter dem Globus auf „Richtung prüfen“ und erlaube den Kompass.</li><li>Drehe dich, bis der Pfeil grün wird: dann schaust du Richtung Kaaba.</li></ol>
<p>Ohne Handy: Die Gradzahl unten gibt die Richtung von Norden aus an. 90° ist Osten, 180° ist Süden. Ein Wert um 130° bedeutet also Südosten, etwas mehr Richtung Osten als Süden.</p>
<h2>Qibla in Deutschland</h2><div class="tw"><table><thead><tr><th>Stadt</th><th>Qibla</th><th>Entfernung zur Kaaba</th></tr></thead><tbody>${qRows(CJ.DE)}</tbody></table></div>
<h2>Qibla in Österreich und der Schweiz</h2><div class="tw"><table><thead><tr><th>Stadt</th><th>Qibla</th><th>Entfernung zur Kaaba</th></tr></thead><tbody>${qRows([...CJ.AT,...CJ.CH])}</tbody></table></div>`,
 [['In welche Richtung beten Muslime in Deutschland?',`Nach Südosten. In Berlin liegt die Qibla bei ${qib(52.52,13.405)}°, in Köln bei ${qib(50.938,6.96)}°, in München bei ${qib(48.137,11.575)}° von Norden.`],
  ['Wie genau muss die Qibla sein?','Es reicht, sich nach bestem Wissen in die Richtung der Kaaba zu wenden. Kleine Abweichungen machen das Gebet nicht ungültig.'],
  ['Warum zeigt die Qibla nicht genau nach Süden?','Mekka liegt von Mitteleuropa aus südöstlich. Gemessen wird auf dem kürzesten Weg über die Erdkugel (Großkreis), deshalb weicht die Richtung etwas von einer flachen Karte ab.']]));

/* ---------- Tasbih ---------- */
const tsH=PRE.filter(p=>p.id!=='frei').map(p=>`<div class="box"><h3 style="margin-top:0">${esc(p.n)}</h3><p class="mut">${esc(p.g)} · ${esc(p.w)}${p.src?' · '+esc(p.src):''}</p>${p.ph.map(([x,n])=>`<span class="ar">${x.a}</span><p><b>${esc(x.t)}</b>${n>1?` (${n}×)`:''}<br>${esc(x.m)}</p>`).join('')}</div>`).join('');
write('tasbih',html('tasbih',`Tasbīḥ-Zähler online & Dhikr nach dem Gebet (mit Quellen) | Ruhaniyya`,
 `Kostenloser Tasbih-Zähler fürs Handy: Subhanallah, Alhamdulillah, Allahu akbar 33× nach dem Gebet, Istighfar, Salawat und mehr, mit Arabisch, Umschrift, Bedeutung und Hadith-Quelle.`,
 `<h1>Tasbīḥ und Dhikr: was, wann und wie oft</h1>
<p class="lead">Dhikr ist das Gedenken Allahs. „Wahrlich, im Gedenken Allahs finden die Herzen Ruhe.“ (Qur'an 13:28) Hier findest du die bekanntesten Dhikr-Formeln aus der Sunnah, jeweils mit arabischem Text, Umschrift, Bedeutung und Quelle. Auf ruhaniyya.live kannst du sie mit dem Tasbīḥ-Zähler direkt am Handy zählen.</p>
<a class="btn" href="/#tasbih">Tasbīḥ-Zähler öffnen</a>${tsH}`,
 [['Was sagt man nach dem Gebet?','Nach jedem Pflichtgebet 33-mal Subḥān Allāh, 33-mal Al-ḥamdu li-llāh, 33-mal Allāhu akbar und einmal Lā ilāha illā llāh waḥdahū lā scharīka lah … (Muslim 597).'],
  ['Was ist Tasbīḥ Fāṭima?','33-mal Subḥān Allāh, 33-mal Al-ḥamdu li-llāh und 34-mal Allāhu akbar vor dem Schlafen. Der Prophet ﷺ lehrte es seiner Tochter Fāṭima (al-Buchārī 5361, Muslim 2727).'],
  ['Brauche ich eine Gebetskette?','Nein. Man kann an den Fingern zählen, mit einer Misbaḥa oder mit dem Zähler auf ruhaniyya.live.']]));

/* ---------- Moscheen ---------- */
write('moscheen',html('moscheen',`Moschee in der Nähe finden: DITIB und andere Moscheen | Ruhaniyya`,
 `Moscheen in deiner Nähe finden, DITIB-Moscheen zuerst, mit Entfernung, Adresse und Route. Kostenlos, ohne Anmeldung, für ganz Deutschland, Österreich und die Schweiz.`,
 `<h1>Moschee in der Nähe finden</h1>
<p class="lead">Mit der Moscheesuche auf ruhaniyya.live findest du Moscheen und Gemeinden rund um deinen Ort. DITIB-Gemeinden werden zuerst gezeigt, außerdem alle anderen Moscheen mit Entfernung, Adresse und einem Link für die Route.</p>
<a class="btn" href="/#moscheen">Moscheen in meiner Nähe anzeigen</a>
<h2>So funktioniert es</h2><ol><li>Erlaube deinen Standort oder gib einen Ort, eine Postleitzahl oder Adresse ein.</li><li>Die Suche zeigt Moscheen im Umkreis von 15 km, bei wenigen Treffern bis 40 km.</li><li>Filtere nach „Nur DITIB“ oder „Andere Gemeinden“ und starte die Route mit einem Tipp.</li></ol>
<p>Die Daten stammen von OpenStreetMap. Fehlt deine Moschee, kannst du sie dort kostenlos eintragen. Gebetszeiten der Gemeinde, besonders für das Freitagsgebet, erfragst du am besten direkt vor Ort.</p>
<p>„Wer für Allah eine Moschee baut, dem baut Allah ein Haus im Paradies.“ (al-Buchārī 450)</p>
<h2>Gebetszeiten deiner Stadt</h2><p>Die Gebetszeiten nach Diyanet/DITIB-Methode findest du für fast 200 Städte, zum Beispiel <a href="/gebetszeiten/berlin/">Berlin</a>, <a href="/gebetszeiten/hamburg/">Hamburg</a>, <a href="/gebetszeiten/muenchen/">München</a>, <a href="/gebetszeiten/koeln/">Köln</a> und <a href="/gebetszeiten/frankfurt-am-main/">Frankfurt</a>.</p>`,
 [['Wie finde ich die nächste DITIB-Moschee?','Öffne die Moscheesuche auf ruhaniyya.live, erlaube den Standort und wähle den Filter „Nur DITIB“.'],
  ['Kostet die Moscheesuche etwas?','Nein, sie ist kostenlos und ohne Anmeldung nutzbar.']]));

/* ---------- Horoskop ---------- */
write('horoskop',html('horoskop',`Horoskop heute: Planeten in den Sternzeichen, Geburtshoroskop | Ruhaniyya`,
 `In welchem Sternzeichen stehen Sonne, Mond und Planeten heute? Astronomisch genau berechnet, mit Aszendent, Häusern, rückläufigen Planeten, Finsternissen und kostenlosem Geburtshoroskop.`,
 `<h1>Horoskop: wo die Planeten heute stehen</h1>
<p class="lead">Das Horoskop auf ruhaniyya.live zeigt, in welchem Tierkreiszeichen Sonne, Mond und Planeten gerade stehen, auf die Bogenminute genau berechnet. Dazu kommen dein persönliches Geburtshoroskop, rückläufige Planeten, der Mond ohne Kurs, Neumond und Vollmond sowie die Sonnen- und Mondfinsternisse der nächsten zwei Jahre.</p>
<a class="btn" href="/#sterne">Horoskop öffnen</a>
<h2>Was du dort findest</h2><ul>
<li><b>Planeten heute:</b> Zeichen, Grad, Haus und Sternbild für Sonne, Mond, Merkur bis Pluto, Mondknoten, Chiron und Lilith.</li>
<li><b>Mein Geburtshoroskop:</b> Aszendent, Häuser nach Placidus, Aspekte, Elemente und Qualitäten. Deine Geburtsdaten bleiben nur auf deinem Gerät.</li>
<li><b>Himmelsereignisse:</b> sichtbare Planeten am Abendhimmel, Finsternisse mit Sichtbarkeit von deinem Ort, Neumond und Vollmond der nächsten zwölf Monate, Rückläufigkeiten mit Schattenphase.</li></ul>
<h2>Ein ehrlicher Hinweis</h2><p>Die Stände der Planeten sind astronomisch berechnet (Astronomy Engine, geprüft gegen die Ephemeriden des NASA Jet Propulsion Laboratory). Die Deutungen geben die westliche astrologische Tradition wieder. Sie sind keine Wissenschaft und keine Vorhersage. Viele Gelehrte sehen die Sterndeutung kritisch (Muslim 2230), denn das Verborgene und die Zukunft kennt allein Allah (Qur'an 27:65).</p>
<p>Bei einer Sonnen- oder Mondfinsternis ist das Finsternisgebet Sunnah: „Sonne und Mond sind zwei Zeichen Allahs … Wenn ihr das seht, dann betet und ruft Allah an.“ (al-Buchārī 1043)</p>`,
 [['Ist das Horoskop kostenlos?','Ja, auch das Geburtshoroskop ist kostenlos und ohne Anmeldung.'],
  ['Wie genau sind die Planetenstände?','Etwa eine Bogenminute genau, berechnet mit der Astronomy Engine.']]));


/* ---------- Artikel ---------- */
write('gebet-lernen',html('gebet-lernen','Beten lernen: Wie betet man als Muslim? Schritt für Schritt | Ruhaniyya',
 'Das islamische Gebet (Salah) Schritt für Schritt erklärt: Wudu, Absicht, Takbīr, Fātiḥa, Rukūʿ, Sudschūd und Salām, mit Anzahl der Rakʿas jedes Gebets.',
 `<h1>Beten lernen: das Gebet Schritt für Schritt</h1>
<p class="lead">Das Gebet (Ṣalāh) ist die zweite Säule des Islam. Fünfmal am Tag steht der Muslim vor Allah. Der Prophet <span>ﷺ</span> sagte: „Betet so, wie ihr mich beten seht.“ (al-Buchārī 631) Diese Anleitung zeigt den Ablauf, wie ihn die Rechtsschulen gemeinsam lehren. Kleine Unterschiede zwischen den Schulen gibt es, frag im Zweifel in deiner Gemeinde.</p>
<a class="btn" href="/gebetszeiten/">Gebetszeiten für deine Stadt</a>
<h2>Vor dem Gebet</h2><ul><li><b>Reinheit:</b> die Gebetswaschung (Wuḍūʾ), saubere Kleidung und ein sauberer Platz.</li><li><b>Bedeckung:</b> Männer mindestens vom Nabel bis zu den Knien, Frauen alles außer Gesicht und Händen.</li><li><b>Qibla:</b> Richtung Kaaba, in Deutschland etwa Südosten. <a href="/qibla/">Qibla für deine Stadt</a>.</li><li><b>Gebetszeit:</b> Jedes Gebet hat sein Zeitfenster.</li></ul>
<h2>Die Gebetswaschung (Wuḍūʾ)</h2><ol><li>Absicht im Herzen, „Bismillāh“ sagen.</li><li>Hände dreimal waschen.</li><li>Mund und Nase dreimal ausspülen.</li><li>Gesicht dreimal waschen.</li><li>Arme bis über die Ellbogen dreimal waschen, rechts zuerst.</li><li>Mit nassen Händen über den Kopf streichen, dann die Ohren.</li><li>Füße bis über die Knöchel dreimal waschen, rechts zuerst.</li></ol>
<h2>Ablauf einer Rakʿa</h2><ol>
<li><b>Absicht (Niyya)</b> im Herzen für das jeweilige Gebet.</li>
<li><b>Takbīr:</b> Hände heben und „Allāhu akbar“ sagen.</li>
<li><b>Stehen (Qiyām):</b> die Sure al-Fātiḥa rezitieren, in den ersten zwei Rakʿas danach eine weitere Sure oder einige Verse.</li>
<li><b>Verbeugung (Rukūʿ):</b> „Allāhu akbar“, Hände auf die Knie, Rücken gerade, dreimal „Subḥāna rabbiya l-ʿaẓīm“.</li>
<li><b>Aufrichten:</b> „Samiʿa llāhu liman ḥamidah“, im Stehen „Rabbanā wa laka l-ḥamd“.</li>
<li><b>Niederwerfung (Sudschūd):</b> „Allāhu akbar“, Stirn, Nase, Hände, Knie und Zehen berühren den Boden, dreimal „Subḥāna rabbiya l-aʿlā“.</li>
<li><b>Sitzen</b> zwischen den beiden Niederwerfungen, dann die <b>zweite Niederwerfung</b>.</li></ol>
<p>Nach jeder zweiten Rakʿa und am Ende sitzt man und spricht das <b>Taschahhud</b>, am Ende zusätzlich die Ṣalawāt auf den Propheten <span>ﷺ</span>. Das Gebet endet mit dem <b>Salām</b>: Kopf nach rechts und links drehen und „As-salāmu ʿalaykum wa raḥmatu llāh“ sagen.</p>
<h2>Wie viele Rakʿas hat jedes Gebet?</h2><div class="tw"><table><thead><tr><th>Gebet</th><th>Pflicht (Farḍ)</th><th>Zeit</th></tr></thead><tbody>
<tr><td>Fadschr</td><td>2</td><td>Morgendämmerung bis Sonnenaufgang</td></tr><tr><td>Dhuhr</td><td>4</td><td>nach dem Zenit</td></tr><tr><td>Asr</td><td>4</td><td>Nachmittag</td></tr><tr><td>Maghrib</td><td>3</td><td>nach Sonnenuntergang</td></tr><tr><td>Ischa</td><td>4</td><td>Nacht</td></tr></tbody></table></div>
<p>Dazu kommen die Sunnah-Gebete, zum Beispiel zwei Rakʿas vor Fadschr. Nach dem Gebet: <a href="/tasbih/">Dhikr nach dem Gebet</a>.</p>`,
 [['Wie oft beten Muslime am Tag?','Fünfmal: Fadschr, Dhuhr, Asr, Maghrib und Ischa.'],
  ['Muss ich Arabisch können, um zu beten?','Die Fātiḥa und die festen Formeln werden auf Arabisch gesprochen. Am Anfang kann man mit wenigen kurzen Suren beginnen und Schritt für Schritt mehr lernen.'],
  ['Was mache ich, wenn ich ein Gebet verpasst habe?','Ein verpasstes Pflichtgebet wird so bald wie möglich nachgeholt (Qaḍāʾ).']]));

write('was-bricht-das-fasten',html('was-bricht-das-fasten','Was bricht das Fasten? Erlaubt und verboten im Ramadan | Ruhaniyya',
 'Was bricht das Fasten im Ramadan und was nicht? Essen, Trinken, Zähneputzen, Spritzen, Blutabnahme, Duschen, Parfüm, Augentropfen: eine Übersicht mit Quellen.',
 `<h1>Was bricht das Fasten, was nicht?</h1>
<p class="lead">Gefastet wird von der Morgendämmerung (Fadschr) bis zum Sonnenuntergang (Maghrib). Hier eine Übersicht, was das Fasten nach Meinung der Gelehrten bricht und was nicht. Bei einzelnen Fragen gibt es Unterschiede zwischen den Rechtsschulen. Bei Krankheit sprich bitte auch mit deinem Arzt und frag einen Gelehrten deines Vertrauens.</p>
<a class="btn" href="/ramadan-2027/">Ramadan 2027: alle Termine</a>
<h2>Das bricht das Fasten</h2><ul><li>Absichtlich essen oder trinken, auch Rauchen.</li><li>Geschlechtsverkehr während der Fastenzeit.</li><li>Absichtliches Erbrechen.</li><li>Einsetzen von Menstruation oder Wochenbettblutung.</li><li>Nährstoffinfusionen, die Essen ersetzen.</li></ul>
<h2>Das bricht das Fasten nicht</h2><ul><li><b>Aus Versehen essen oder trinken:</b> „Wer vergisst, dass er fastet, und isst oder trinkt, der soll sein Fasten vollenden, denn Allah hat ihn gespeist und getränkt.“ (al-Buchārī 1933, Muslim 1155)</li><li>Unabsichtliches Erbrechen.</li><li>Duschen, Baden, Schwimmen ohne Wasser zu schlucken.</li><li>Zähneputzen und Miswāk, ohne etwas zu schlucken.</li><li>Speichel schlucken.</li><li>Parfüm, Creme, Augentropfen (nach vielen Gelehrten).</li><li>Blutabnahme und Spritzen, die keine Nahrung ersetzen (nach vielen Gelehrten).</li></ul>
<h2>Wer muss nicht fasten?</h2><p>Kranke, Reisende, Schwangere und Stillende, wenn sie um sich oder das Kind fürchten, Ältere, die es nicht schaffen, sowie Frauen während der Menstruation. Verpasste Tage werden später nachgeholt, wer dauerhaft nicht fasten kann, gibt stattdessen Fidya (Qur'an 2:184).</p>
<h2>Suḥūr und Ifṭār</h2><p>„Nehmt das Suḥūr ein, denn im Suḥūr liegt Segen.“ (al-Buchārī 1923) Das Fasten wird bei Sonnenuntergang gebrochen, am besten mit Datteln oder Wasser. Die Uhrzeiten für deine Stadt: <a href="/gebetszeiten/">Gebetszeiten</a>.</p>`,
 [['Bricht Zähneputzen das Fasten?','Nein, solange nichts geschluckt wird. Viele empfehlen, tagsüber keine Zahnpasta zu benutzen, um nichts zu schlucken.'],
  ['Was passiert, wenn ich aus Versehen esse?','Das Fasten bleibt gültig. Sobald man sich erinnert, hört man auf und fastet weiter (al-Buchārī 1933).'],
  ['Bricht eine Blutabnahme das Fasten?','Nach vielen Gelehrten nicht. Bei größeren Blutspenden gibt es unterschiedliche Meinungen.']]));

const qd=[21,23,25,27,29].map(n=>{const d=findH(9,n,1448,'s');return `<li>${n}. Nacht: ${D(S.addDays(d,-1))}, abends${n===27?' (von vielen besonders erhofft)':''}</li>`}).join('');
write('laylat-al-qadr',html('laylat-al-qadr',`Laylat al-Qadr 2027: Datum der Nacht der Bestimmung, Dua und Bedeutung | Ruhaniyya`,
 `Laylat al-Qadr 2027 (Kadir Gecesi): die ungeraden Nächte ab ${D(S.addDays(findH(9,21,1448,'s'),-1),{day:'numeric',month:'long'})}, die 27. Nacht am ${D(S.addDays(findH(9,27,1448,'s'),-1),{day:'numeric',month:'long'})} abends. Bedeutung, Dua und was man tun sollte.`,
 `<h1>Laylat al-Qadr: die Nacht der Bestimmung</h1>
<p class="lead">„Die Nacht der Bestimmung ist besser als tausend Monate.“ (Qur'an 97:3) In dieser Nacht wurde der Qur'an herabgesandt. Wer sie im Glauben und in der Hoffnung auf Lohn im Gebet verbringt, dem werden seine früheren Sünden vergeben (al-Buchārī 1901).</p>
<h2>Wann ist Laylat al-Qadr 2027?</h2><p>Der Prophet <span>ﷺ</span> sagte: „Sucht sie in den ungeraden Nächten der letzten zehn.“ (al-Buchārī 2017) Die islamische Nacht beginnt am Abend vor dem Tag. Nach Mondsichtung im Ramadan 1448:</p><ul>${qd}</ul>
<p class="mut">Nach Diyanet / Umm al-Qura liegen die Nächte einen Tag früher. <a href="/ramadan-2027/">Alle Termine des Ramadan 2027</a>.</p>
<h2>Das Bittgebet (Duʿāʾ)</h2><p>ʿĀʾischa fragte, was sie in dieser Nacht sagen solle. Der Prophet <span>ﷺ</span> antwortete (at-Tirmidhī 3513):</p>
<div class="box"><span class="ar">اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي</span><p><b>Allāhumma innaka ʿafuwwun tuḥibbu l-ʿafwa faʿfu ʿannī</b><br>O Allah, Du bist der Verzeihende, Du liebst das Verzeihen, so verzeih mir.</p></div>
<h2>Was man in den letzten zehn Nächten tun kann</h2><ul><li>Nachtgebet (Qiyām, Tarawīḥ, Tahadschud)</li><li>Qur'an lesen</li><li>Dhikr und Bittgebete, <a href="/tasbih/">Dhikr mit Zähler</a></li><li>Ṣadaqa geben</li><li>Iʿtikāf in der Moschee, wer kann</li></ul>`,
 [['Wann ist Laylat al-Qadr 2027?',`In den ungeraden Nächten der letzten zehn Ramadan-Nächte. Die 27. Nacht ist nach Mondsichtung am ${D(S.addDays(findH(9,27,1448,'s'),-1))}, abends.`],
  ['Was sagt man in Laylat al-Qadr?','Allāhumma innaka ʿafuwwun tuḥibbu l-ʿafwa faʿfu ʿannī (at-Tirmidhī 3513).']]));
/* ---------- Sitemap ---------- */
const sm=path.join(OUT,'sitemap.xml');let x=fs.readFileSync(sm,'utf8');const day=new Date().toISOString().slice(0,10);
for(const s of ['fastentage','weisse-tage','ramadan-2027','islamischer-kalender','qibla','tasbih','moscheen','horoskop','gebet-lernen','was-bricht-das-fasten','laylat-al-qadr']){
  const u=`https://ruhaniyya.live/${s}/`;x=x.replace(new RegExp(`\\s*<url><loc>${u.replace(/[.]/g,'\\.')}</loc>.*?</url>`),'');
  x=x.replace('  <url><loc>https://ruhaniyya.live/gebetszeiten/</loc>',`  <url><loc>${u}</loc><lastmod>${day}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://ruhaniyya.live/gebetszeiten/</loc>`)}
fs.writeFileSync(sm,x);console.log('8 Themenseiten geschrieben, Sitemap ergänzt');

/* ---------- Türkçe: Beyaz günler, Ramazan 2027 ---------- */
const DT=(d,o)=>d.toLocaleDateString('tr-TR',Object.assign({timeZone:'Europe/Berlin'},o||{day:'numeric',month:'long',year:'numeric',weekday:'long'}));
const TT=d=>d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'});
const AYLAR=['Muharrem','Safer','Rebiülevvel','Rebiülahir','Cemaziyelevvel','Cemaziyelahir','Recep','Şaban','Ramazan','Şevval','Zilkade','Zilhicce'];
function htmlTR(slug,de,title,desc,body,faq){
  const u=`https://ruhaniyya.live/tr/${slug}/`,deU=`https://ruhaniyya.live/${de}/`;
  const ld={"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))};
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${u}"><link rel="alternate" hreflang="tr" href="${u}"><link rel="alternate" hreflang="de" href="${deU}"><link rel="alternate" hreflang="x-default" href="${deU}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/fonts.css"><meta name="theme-color" content="#8B1CF0">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${u}"><meta property="og:image" content="https://ruhaniyya.live/logo.png"><meta property="og:locale" content="tr_TR">
<style>${css}</style><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><header><a href="/"><img src="/logo.png" alt="Ruhaniyya" width="40" height="40"></a><div><b>Ruhaniyya</b><small>Manevi İslam'ın yolu</small></div><a href="/${de}/" hreflang="de" style="margin-inline-start:auto;color:var(--mut);text-decoration:none;border:1px solid var(--line);border-radius:10px;padding:6px 10px">DE</a></header><main>
${body}<h2>Sık sorulan sorular</h2>${faq.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}
<h2>Ruhaniyya'da daha fazlası</h2><ul class="links"><li><a href="/tr/namaz-vakitleri/">Namaz vakitleri</a></li><li><a href="/tr/beyaz-gunler/">Beyaz günler</a></li><li><a href="/tr/ramazan-2027/">Ramazan 2027</a></li><li><a href="/#fasten">Oruç takvimi</a></li><li><a href="/#moscheen">Cami bul</a></li></ul>
<p class="mut" style="margin-top:2em">Güncelleme: ${DT(today,{day:'numeric',month:'long',year:'numeric'})}.</p>
</main><footer><a href="/">ruhaniyya.live</a> · <a href="/tr/namaz-vakitleri/">Namaz vakitleri</a> · <a href="/impressum.html">Künye</a> · <a href="/datenschutz.html">Gizlilik</a></footer></body></html>`}
const bidTR=bid.slice(0,12).map(b=>`<tr><td><b>${DT(b.a,{day:'numeric',month:'short'})} – ${DT(b.b,{day:'numeric',month:'short',year:'numeric'})}</b></td><td>${AYLAR[b.h.m-1]} ${b.h.y}</td><td>Dolunay ${DT(b.m,{day:'numeric',month:'long',weekday:'short'})}, saat ${TT(b.at)}</td></tr>`).join('');
write('tr/beyaz-gunler',htmlTR('beyaz-gunler','weisse-tage',`Beyaz Günler ${yr}/${yr+1}: Eyyam-ı Biyz orucu tarihleri | Ruhaniyya`,
 `Sonraki beyaz günler: ${DT(nb.a,{day:'numeric',month:'long'})} – ${DT(nb.b,{day:'numeric',month:'long',year:'numeric'})}. Önümüzdeki 12 ayın tüm Eyyam-ı Biyz oruç tarihleri, dolunay saatiyle.`,
 `<h1>Beyaz Günler (Eyyam-ı Biyz): sonraki tarihler</h1>
<div class="box"><span class="mut">Sonraki beyaz günler</span><b class="big">${DT(nb.a,{day:'numeric',month:'long',weekday:'short'})} – ${DT(nb.b,{day:'numeric',month:'long',year:'numeric',weekday:'short'})}</b>Dolunay: ${DT(nb.m)}, saat ${TT(nb.at)} (Almanya saati)</div>
<p class="lead">Beyaz günler, dolunayın etrafındaki üç gündür; hicri takvimde ayın 13, 14 ve 15. günleri. Peygamber Efendimiz <span>ﷺ</span> bu günlerde oruç tutmayı tavsiye etmiştir: “Ayda üç gün oruç tutacaksan 13, 14 ve 15. günleri tut.” (Tirmizî 761, Nesâî 2424). Her ay üç gün oruç tutan, bütün yılı oruçlu geçirmiş gibidir (Buhârî 1979).</p>
<a class="btn" href="/#fasten">Oruç takvimini hatırlatıcıyla aç</a>
<h2>Önümüzdeki 12 ayın beyaz günleri</h2><p>Ruhaniyya'da dolunay günü her zaman üç günün ortasındadır. Ramazan'da beyaz günler ayrıca sayılmaz, çünkü bütün ay oruç tutulur.</p>
<div class="tw"><table><thead><tr><th>Beyaz günler</th><th>Hicri ay</th><th>Dolunay</th></tr></thead><tbody>${bidTR}</tbody></table></div>`,
 [['Sonraki beyaz günler ne zaman?',`Sonraki beyaz günler ${DT(nb.a)} ile ${DT(nb.b)} arasındadır. Dolunay ${DT(nb.m)} saat ${TT(nb.at)}'dadır.`],
  ['Beyaz günler orucu farz mı?','Hayır, sünnettir; yani tavsiye edilir ama farz değildir.'],
  ['Neden beyaz günler deniyor?','Dolunay gecelerinde ay bütün gece parladığı için geceler aydınlıktır. Arapçası el-Eyyâmü\'l-Bîd\'dir.']]));
write('tr/ramazan-2027',htmlTR('ramazan-2027','ramadan-2027',`Ramazan 2027 ne zaman? Başlangıç ${DT(R0u,{day:'numeric',month:'long'})}, Ramazan Bayramı | Ruhaniyya`,
 `2027 Ramazan ayı Diyanet takvimine göre ${DT(R0u)} başlıyor. Ramazan Bayramı ${DT(Eu,{day:'numeric',month:'long'})}, Kadir Gecesi, Arefe ve Kurban Bayramı 2027 tarihleri.`,
 `<h1>Ramazan 2027 ne zaman başlıyor?</h1>
<div class="box"><span class="mut">İlk oruç günü (Ramazan 1448)</span><b class="big">${DT(R0u)}</b>Diyanet / Ümmü'l-Kurâ · hilal gözlemine göre çoğu zaman bir gün sonra: ${DT(R0s)}</div>
<p class="lead">Hicri 1448 yılının Ramazan ayı Şubat ve Mart 2027'ye denk geliyor. Diyanet ve DİTİB tarihleri önceden hesaplanmış takvime göre ilan eder; hilalin görülmesini bekleyen cemaatler çoğu zaman bir gün sonra başlar.</p>
<a class="btn" href="/tr/namaz-vakitleri/">Şehrinin imsakiyesi</a>
<h2>2027 önemli günler</h2><div class="tw"><table><thead><tr><th>Gün</th><th>Diyanet / Ümmü'l-Kurâ</th><th>Hilal gözlemi</th></tr></thead><tbody>
<tr><td>İlk teravih (arife akşamı)</td><td>${DT(S.addDays(R0u,-1))}</td><td>${DT(S.addDays(R0s,-1))}</td></tr>
<tr><td><b>İlk oruç</b></td><td><b>${DT(R0u)}</b></td><td><b>${DT(R0s)}</b></td></tr>
<tr><td>Kadir Gecesi (27. gece)</td><td>${DT(S.addDays(findH(9,27,1448,'u'),-1))} akşamı</td><td>${DT(S.addDays(findH(9,27,1448,'s'),-1))} akşamı</td></tr>
<tr><td><b>Ramazan Bayramı</b></td><td><b>${DT(Eu)}</b></td><td><b>${DT(Es)}</b></td></tr>
<tr><td>Arefe</td><td>${DT(ArafaU)}</td><td>${DT(Arafa)}</td></tr>
<tr><td><b>Kurban Bayramı</b></td><td><b>${DT(AdhaU)}</b></td><td><b>${DT(Adha)}</b></td></tr>
<tr><td>Hicri Yılbaşı 1449</td><td>${DT(findH(1,1,1449,'u'))}</td><td>${DT(Mu)}</td></tr>
<tr><td>Aşure</td><td>${DT(findH(1,10,1449,'u'))}</td><td>${DT(Ash)}</td></tr></tbody></table></div>
<h2>İmsakiye</h2><p>Oruç imsak vaktinde başlar, akşam ezanıyla (iftar) biter. Şehrinin vakitleri: <a href="/tr/namaz-vakitleri/berlin/">Berlin</a>, <a href="/tr/namaz-vakitleri/koeln/">Köln</a>, <a href="/tr/namaz-vakitleri/hamburg/">Hamburg</a>, <a href="/tr/namaz-vakitleri/muenchen/">Münih</a>, <a href="/tr/namaz-vakitleri/wien/">Viyana</a> ve <a href="/tr/namaz-vakitleri/">diğer şehirler</a>.</p>`,
 [['2027 Ramazan ne zaman başlıyor?',`Diyanet'e göre ilk oruç ${DT(R0u)}. Hilal gözlemine göre ${DT(R0s)} olabilir.`],
  ['2027 Ramazan Bayramı ne zaman?',`Ramazan Bayramı ${DT(Eu)} (Diyanet) veya hilal gözlemine göre ${DT(Es)}.`],
  ['2027 Kurban Bayramı ne zaman?',`Kurban Bayramı ${DT(AdhaU)} (Diyanet) veya hilal gözlemine göre ${DT(Adha)}.`]]));
{const sm=path.join(OUT,'sitemap.xml');let x=fs.readFileSync(sm,'utf8');const day=new Date().toISOString().slice(0,10);
 for(const s of ['tr/beyaz-gunler','tr/ramazan-2027']){const u=`https://ruhaniyya.live/${s}/`;x=x.replace(new RegExp(`\\s*<url><loc>${u.replace(/[.]/g,'\\.')}</loc>.*?</url>`),'');x=x.replace('</urlset>',`  <url><loc>${u}</loc><lastmod>${day}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>`)}
 fs.writeFileSync(sm,x);console.log('2 türkische Themenseiten')}

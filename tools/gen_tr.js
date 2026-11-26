// Türkçe şehir sayfaları: /tr/namaz-vakitleri/<şehir>/ (Diyanet/DİTİB yöntemi, ana sayfadakiyle aynı hesap)
// Aufruf: node gen_tr.js <repo>   (liest den Rechencode aus <repo>/index.html, schreibt nach <repo>/tr/namaz-vakitleri/ und ergänzt sitemap.xml)
const fs=require('fs'),path=require('path');const OUT=process.argv[2]||path.join(__dirname,'..');
const body=fs.readFileSync(OUT+'/index.html','utf8');
const grab=(a,b)=>{const i=body.indexOf(a),j=body.indexOf(b,i);if(i<0||j<0)throw new Error('fehlt: '+a);return body.slice(i,j)};
const CALC=grab('const rad=x=>','function moonLon')+grab('/* Methoden.','function asr2');
eval(CALC.replace(/^const /gm,'var '));
const CJ=JSON.parse(fs.readFileSync(__dirname+'/cities.json','utf8'));
const slug=n=>n.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[().]/g,'').replace(/\//g,'-').trim().replace(/\s+/g,'-');
// Türkçe şehir ve ülke adları (yalnızca farklı olanlar)
const TRN={'München':'Münih','Frankfurt am Main':'Frankfurt','Köln':'Köln','Nürnberg':'Nürnberg','Halle (Saale)':'Halle','Freiburg im Breisgau':'Freiburg','Ludwigshafen am Rhein':'Ludwigshafen','Mülheim an der Ruhr':'Mülheim','Offenbach am Main':'Offenbach','Wien':'Viyana','Zürich':'Zürih','Genf':'Cenevre','Basel':'Basel','Bern':'Bern','Luzern':'Luzern','Biel/Bienne':'Biel','St. Gallen':'St. Gallen','Fribourg':'Fribourg',
 'Istanbul':'İstanbul','Izmir':'İzmir','Brüssel':'Brüksel','Kopenhagen':'Kopenhag','Rom':'Roma','Pristina':'Priştine','Tirana':'Tiran','Skopje':'Üsküp','Mekka':'Mekke','Medina':'Medine','Riad':'Riyad','Kairo':'Kahire','Al-Quds (Jerusalem)':'Kudüs','Damaskus':'Şam','Bagdad':'Bağdat','Teheran':'Tahran','Karatschi':'Karaçi','Casablanca':'Kazablanka','Algier':'Cezayir','Mexiko-Stadt':'Meksiko','Tokio':'Tokyo','Singapur':'Singapur','Delhi':'Delhi','Taschkent':'Taşkent','Almaty':'Almatı','Bischkek':'Bişkek','Duschanbe':'Duşanbe','Kuwait-Stadt':'Kuveyt','Maskat':'Maskat','Manama':'Manama','Sanaa':'Sana','Abu Dhabi':'Abu Dabi','Dschidda':'Cidde','Gaza':'Gazze','Khartum':'Hartum','Addis Abeba':'Addis Ababa','Mogadischu':'Mogadişu','Tripolis':'Trablus','Kapstadt':'Cape Town','Moskau':'Moskova','Kasan':'Kazan','Grosny':'Grozni','Antwerpen':'Anvers','Athen':'Atina','Belgrad':'Belgrad','Mailand':'Milano','Lissabon':'Lizbon','Warschau':'Varşova','Prag':'Prag','Peking':'Pekin','Seoul':'Seul','Bandar Seri Begawan':'Bandar Seri Begawan','Erbil':'Erbil','Sarajevo':'Saraybosna'};
const trn=n=>TRN[n]||n;
const LAND={DE:'Almanya',AT:'Avusturya',CH:'İsviçre',LI:'Lihtenştayn'};
const LANDW={'Türkei':'Türkiye','Vereinigtes Königreich':'Birleşik Krallık','Frankreich':'Fransa','Belgien':'Belçika','Niederlande':'Hollanda','Dänemark':'Danimarka','Schweden':'İsveç','Norwegen':'Norveç','Spanien':'İspanya','Italien':'İtalya','Bosnien und Herzegowina':'Bosna-Hersek','Kosovo':'Kosova','Albanien':'Arnavutluk','Nordmazedonien':'Kuzey Makedonya','Saudi-Arabien':'Suudi Arabistan','Vereinigte Arabische Emirate':'Birleşik Arap Emirlikleri','Katar':'Katar','Ägypten':'Mısır','Jordanien':'Ürdün','Syrien':'Suriye','Libanon':'Lübnan','Irak':'Irak','Iran':'İran','Afghanistan':'Afganistan','Pakistan':'Pakistan','Aserbaidschan':'Azerbaycan','Marokko':'Fas','Algerien':'Cezayir','Tunesien':'Tunus','Malaysia':'Malezya','Indonesien':'Endonezya','USA':'ABD','Kanada':'Kanada','Mexiko':'Meksika','Brasilien':'Brezilya','Argentinien':'Arjantin','Japan':'Japonya','China':'Çin','Südkorea':'Güney Kore','Singapur':'Singapur','Thailand':'Tayland','Philippinen':'Filipinler','Indien':'Hindistan','Bangladesch':'Bangladeş','Usbekistan':'Özbekistan','Kasachstan':'Kazakistan','Kirgisistan':'Kırgızistan','Tadschikistan':'Tacikistan','Kuwait':'Kuveyt','Oman':'Umman','Bahrain':'Bahreyn','Jemen':'Yemen','Brunei':'Brunei','Nigeria':'Nijerya','Senegal':'Senegal','Sudan':'Sudan','Äthiopien':'Etiyopya','Kenia':'Kenya','Somalia':'Somali','Libyen':'Libya','Südafrika':'Güney Afrika','Australien':'Avustralya','Russland':'Rusya','Griechenland':'Yunanistan','Serbien':'Sırbistan','Montenegro':'Karadağ','Portugal':'Portekiz','Irland':'İrlanda','Polen':'Polonya','Tschechien':'Çekya','Ungarn':'Macaristan','Finnland':'Finlandiya'};
const KITA={Europe:'Avrupa',Asia:'Asya',Africa:'Afrika',America:'Amerika',Australia:'Avustralya'};
const C=[];const CTZ={DE:'Europe/Berlin',AT:'Europe/Vienna',CH:'Europe/Zurich',LI:'Europe/Vaduz'};
for(const iso of ['DE','AT','CH','LI'])for(const c of CJ[iso])C.push({n:c[0],la:c[1],lo:c[2],iso,tz:CTZ[iso],land:LAND[iso]});
for(const c of CJ.WORLD)C.push({n:c[0],la:c[1],lo:c[2],iso:'WORLD',tz:c[3],land:LANDW[c[4]]||c[4]||'',k:KITA[c[3].split('/')[0]]});
const K=[21.4225,39.8262];
const qibla=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),dl=rad(K[1]-lo);return fixA(deg(Math.atan2(Math.sin(dl),Math.cos(p1)*Math.tan(p2)-Math.sin(p1)*Math.cos(dl))))};
const dist=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),dp=p2-p1,dl=rad(K[1]-lo);const a=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 6371*2*Math.asin(Math.sqrt(a))};
let TZ='Europe/Berlin';const fmt=d=>d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:TZ});
const now=new Date(),Y=+now.toLocaleString('en',{year:'numeric',timeZone:TZ}),M=+now.toLocaleString('en',{month:'numeric',timeZone:TZ})-1;
const MON=new Date(Date.UTC(Y,M,15)).toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
const PN=['İmsak','Güneş','Öğle','İkindi','Akşam','Yatsı'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const css=fs.readFileSync(__dirname+'/gen_staedte.js','utf8').match(/const css=`([\s\S]*?)`;/)[1];
const DEU=s=>`https://ruhaniyya.live/gebetszeiten/${s}`,TRU=s=>`https://ruhaniyya.live/tr/namaz-vakitleri/${s}`;
const head=(t,d,u,de)=>`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title><meta name="description" content="${esc(d)}"><link rel="canonical" href="${u}">
<link rel="alternate" hreflang="tr" href="${u}"><link rel="alternate" hreflang="de" href="${de}"><link rel="alternate" hreflang="x-default" href="${de}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/fonts.css"><meta name="theme-color" content="#8B1CF0">
<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}"><meta property="og:url" content="${u}"><meta property="og:image" content="https://ruhaniyya.live/logo.png"><meta property="og:locale" content="tr_TR">
<style>${css}</style></head><body><header><a href="/"><img src="/logo.png" alt="Ruhaniyya" width="40" height="40"></a><div><b>Ruhaniyya</b><small>Manevi İslam'ın yolu</small></div><a href="${de.replace('https://ruhaniyya.live','')}" hreflang="de" style="margin-inline-start:auto;color:var(--mut);text-decoration:none;border:1px solid var(--line);border-radius:10px;padding:6px 10px">DE</a></header><main>`;
const foot=`</main><footer><a href="/">ruhaniyya.live</a> · <a href="/tr/namaz-vakitleri/">Namaz vakitleri</a> · <a href="/tr/beyaz-gunler/">Beyaz günler</a> · <a href="/tr/ramazan-2027/">Ramazan 2027</a> · <a href="/impressum.html">Künye</a> · <a href="/datenschutz.html">Gizlilik</a></footer>`;
const days=new Date(Date.UTC(Y,M+1,0)).getUTCDate();
const isha=tz=>/^(Europe|America|Atlantic)\//.test(tz)&&tz!=='Europe/Istanbul'?16:17;
const pages=[];
for(const c of C){TZ=c.tz;const s=slug(c.n),n=trn(c.n),u=TRU(s)+'/',q=Math.round(qibla(c.la,c.lo)),km=Math.round(dist(c.la,c.lo));
  let rows='';for(let d=1;d<=days;d++){const dt=new Date(Y,M,d),t=prayerTimes(dt,c.la,c.lo,c.tz);rows+=`<tr data-d="${d}"><td>${dt.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',weekday:'short'})}</td>${t.map(x=>`<td>${fmt(x)}</td>`).join('')}</tr>`}
  const near=C.filter(x=>x.n!==c.n).map(x=>[x,(x.la-c.la)**2+((x.lo-c.lo)*Math.cos(rad(c.la)))**2]).sort((a,b)=>a[1]-b[1]).slice(0,8).map(([x])=>`<li><a href="/tr/namaz-vakitleri/${slug(x.n)}/">${trn(x.n)}</a></li>`).join('');
  const T=`${n} Namaz Vakitleri – ${MON} | Ezan Vakti | Ruhaniyya`,D=`${n} namaz vakitleri bugün ve ${MON} için: İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı. Diyanet/DİTİB yöntemiyle hesaplanır. Kıble yönü ${q}°.`;
  const ld={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
   {"@type":"Question","name":`${n} için kıble yönü nedir?`,"acceptedAnswer":{"@type":"Answer","text":`${n} şehrinden kıble kuzeyden saat yönünde yaklaşık ${q}° yönündedir. Kâbe yaklaşık ${km.toLocaleString('tr-TR')} km uzaklıktadır.`}},
   {"@type":"Question","name":`${n} namaz vakitleri hangi yöntemle hesaplanıyor?`,"acceptedAnswer":{"@type":"Answer","text":`DİTİB'in de kullandığı Diyanet İşleri Başkanlığı yöntemiyle: İmsak 18°, Yatsı ${isha(c.tz)}°, Diyanet temkinleriyle.`}}]};
  const html=head(T,D,u,DEU(s)+'/')+`<p class="mut"><a href="/tr/namaz-vakitleri/">Namaz vakitleri</a> › ${c.iso==='WORLD'?(c.k||''):c.land} › ${esc(n)}${c.iso==='WORLD'&&c.land?', '+c.land:''}</p>
<h1>${esc(n)} Namaz Vakitleri</h1><p class="mut" id="today">Bugün</p>
<div class="grid" id="now"></div>
<a class="btn" id="live" href="/#gebetszeiten">Canlı namaz vakitleri, namaz saati ve kıble küresi</a>
<h2>${esc(n)} kıble yönü</h2><p>${esc(n)} şehrinden kıble, kuzeyden saat yönünde ölçüldüğünde <b>${q}°</b> yönündedir. Mekke'deki Kâbe yaklaşık <b>${km.toLocaleString('tr-TR')} km</b> uzaklıktadır. <a href="/#gebetszeiten">Ana sayfada</a> yönü telefonunun pusulasıyla kontrol edebilirsin.</p>
<h2>${esc(n)} imsakiye ve namaz vakitleri – <span id="mon">${MON}</span></h2>
<div style="overflow-x:auto"><table><thead><tr><th>Gün</th>${PN.map(p=>`<th>${p}</th>`).join('')}</tr></thead><tbody id="tb">${rows}</tbody></table></div>
<p class="mut">DİTİB'in de kullandığı Diyanet yöntemiyle hesaplanmıştır (İmsak 18°, Yatsı ${isha(c.tz)}°, Diyanet temkinleriyle) ve resmî Diyanet takvimleriyle karşılaştırılmıştır: en fazla bir dakika fark. Şüphede cemaatinin takvimi geçerlidir.${c.iso==='WORLD'?` Yerel olarak farklı bir hesaplama yöntemi kullanılabilir, bu durumda vakitler daha fazla farklı olabilir. Saatler yerel saattir.`:''}</p>
<h2>${esc(n)} cuma namazı</h2><p>Cuma namazı öğle vaktinde kılınır. Birçok camide hutbe biraz daha erken başlar, en iyisi camine sor. Yakındaki camileri <a href="/#moscheen">cami bulucu</a> ile bulabilirsin.</p>
<h2>Yakındaki şehirler</h2><ul class="cities">${near}</ul>
<p class="mut">Beyaz günler: <a href="/tr/beyaz-gunler/">sonraki tarihler</a> · Ramazan: <a href="/tr/ramazan-2027/">Ramazan 2027 ne zaman?</a></p>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>const LAT=${c.la},LNG=${c.lo},N=${JSON.stringify(c.n)};
${CALC}
const PN=${JSON.stringify(PN)},TZ=${JSON.stringify(c.tz)},f=d=>d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit",timeZone:TZ});
const now=new Date(),Y=+now.toLocaleString("en",{year:"numeric",timeZone:TZ}),M=+now.toLocaleString("en",{month:"numeric",timeZone:TZ})-1,D=+now.toLocaleString("en",{day:"numeric",timeZone:TZ});
const t=prayerTimes(new Date(Y,M,D),LAT,LNG,TZ);let nx=t.findIndex(x=>x>now);
document.getElementById("today").textContent="Bugün, "+new Date(Y,M,D).toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
document.getElementById("now").innerHTML=t.map((x,i)=>'<div class="t'+(i===nx?' on':'')+'"><span>'+PN[i]+(i===nx?' · sıradaki':'')+'</span><b>'+f(x)+'</b></div>').join("");
if(${Y}!==Y||${M}!==M){const n=new Date(Date.UTC(Y,M+1,0)).getUTCDate();let r="";for(let d=1;d<=n;d++){const dt=new Date(Y,M,d);r+='<tr data-d="'+d+'"><td>'+dt.toLocaleDateString("tr-TR",{day:"2-digit",month:"2-digit",weekday:"short"})+'</td>'+prayerTimes(dt,LAT,LNG,TZ).map(x=>"<td>"+f(x)+"</td>").join("")+"</tr>"}document.getElementById("tb").innerHTML=r;document.getElementById("mon").textContent=new Date(Date.UTC(Y,M,15)).toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}
const tr=document.querySelector('#tb tr[data-d="'+D+'"]');if(tr)tr.className="today";
document.getElementById("live").addEventListener("click",()=>{try{localStorage.setItem("rh_lang",JSON.stringify("tr"));localStorage.setItem("rh_place",JSON.stringify({n:N,c:${JSON.stringify(c.land)},lat:LAT,lng:LNG,tz:TZ,iso:${JSON.stringify(c.iso==='WORLD'?'':c.iso)}}))}catch(e){}});
</script>`+foot+`</body></html>`;
  const dir=path.join(OUT,'tr/namaz-vakitleri',s);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(dir+'/index.html',html);pages.push({s,n,iso:c.iso,k:c.k});
}
// Übersicht
const groups=[['DE','Almanya'],['AT','Avusturya'],['CH','İsviçre'],['LI','Lihtenştayn'],['Avrupa','Avrupa'],['Asya','Asya'],['Afrika','Afrika'],['Amerika','Amerika'],['Avustralya','Avustralya']];
let lists='';for(const [g,name] of groups){const P=pages.filter(p=>p.iso===g||(p.iso==='WORLD'&&p.k===g)).sort((a,b)=>a.n.localeCompare(b.n,'tr'));if(!P.length)continue;
  lists+=`<h2 id="${g}">${name} namaz vakitleri</h2><ul class="cities">${P.map(p=>`<li><a href="/tr/namaz-vakitleri/${p.s}/">${esc(p.n)}</a></li>`).join('')}</ul>`}
fs.writeFileSync(path.join(OUT,'tr/namaz-vakitleri/index.html'),head(`Almanya Namaz Vakitleri – ${MON} | Avusturya, İsviçre ve dünya | Ruhaniyya`,`${pages.length} şehir için namaz vakitleri: Almanya, Avusturya, İsviçre ve dünya genelinde. Bugünkü vakitler, aylık imsakiye ve kıble yönü, Diyanet/DİTİB yöntemiyle.`,'https://ruhaniyya.live/tr/namaz-vakitleri/','https://ruhaniyya.live/gebetszeiten/')+
`<h1>Almanya, Avusturya, İsviçre ve dünya namaz vakitleri</h1><p>Bugünkü namaz vakitleri, ${MON} aylık takvimi ve kıble yönü için şehrini seç. Vakitler DİTİB'in de kullandığı Diyanet yöntemiyle hesaplanır. Dünyanın başka bir yeri için <a href="/#gebetszeiten">ana sayfadaki namaz vakitlerini</a> kullan.</p>${lists}`+foot+'</body></html>');
// Sitemap
const sm=path.join(OUT,'sitemap.xml');let x=fs.readFileSync(sm,'utf8');x=x.replace(/\s*<url><loc>https:\/\/ruhaniyya\.live\/tr\/namaz-vakitleri\/[^<]*<\/loc>.*?<\/url>/g,'');
const day=new Date().toISOString().slice(0,10);
const add=[`  <url><loc>https://ruhaniyya.live/tr/namaz-vakitleri/</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,...pages.map(p=>`  <url><loc>https://ruhaniyya.live/tr/namaz-vakitleri/${p.s}/</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`)].join('\n');
x=x.replace('</urlset>',add+'\n</urlset>');fs.writeFileSync(sm,x);console.log(pages.length,'türkische Seiten');

/* Sprache der Städteseiten: liest die auf der Hauptseite gewählte Sprache (rh_lang) und übersetzt markierte Texte. */
(function(){
var L="de";try{L=JSON.parse(localStorage.getItem("rh_lang"))||"de"}catch(e){}
var IX={en:0,tr:1,ar:2,fa:3,ku:4};if(L!=="de"&&!(L in IX))L="de";
var LOC={de:"de-DE",en:"en-GB",tr:"tr-TR",ar:"ar-u-nu-latn",fa:"fa-u-ca-gregory-nu-latn",ku:"de-DE"};
var KU_WD=["Yekşem","Duşem","Sêşem","Çarşem","Pêncşem","În","Şemî"],KU_WS=["Ye","Du","Sê","Ça","Pê","În","Şe"],KU_MO=["Çile","Sibat","Adar","Nîsan","Gulan","Hezîran","Tîrmeh","Tebax","Îlon","Cotmeh","Mijdar","Kanûn"];
var T={
tag:["Path of spiritual Islam","Manevi İslam'ın yolu","طريق الإسلام الروحي","راه اسلام معنوی","Rêya Îslama manewî"],
h1:["Prayer times {n}","{n} namaz vakitleri","مواقيت الصلاة في {n}","اوقات نماز {n}","Demên nimêjê li {n}"],
title:["Prayer times {n} today – {mon} | Ruhaniyya","{n} namaz vakitleri bugün – {mon} | Ruhaniyya","مواقيت الصلاة في {n} اليوم – {mon} | روحانية","اوقات نماز {n} امروز – {mon} | روحانیه","Demên nimêjê li {n} îro – {mon} | Ruhaniyya"],
today:["Today","Bugün","اليوم","امروز","Îro"],
next:["next","sıradaki","التالية","بعدی","ya bê"],
live:["Open live prayer times, prayer clock and Qibla globe","Canlı namaz vakitlerini, namaz saatini ve kıble küresini aç","افتح مواقيت الصلاة المباشرة وساعة الصلاة وكرة القبلة","باز کردن اوقات نماز زنده، ساعت نماز و کرهٔ قبله","Demên nimêjê yên zindî, demjimêra nimêjê û globa qibleyê veke"],
qh:["Qibla direction in {n}","{n} kıble yönü","اتجاه القبلة في {n}","جهت قبله در {n}","Aliyê qibleyê li {n}"],
qp:["From {n}, the Qibla lies at <b>{q}°</b> from north, measured clockwise. The Kaaba in Mecca is about <b>{km} km</b> away. On the <a href=\"/#gebetszeiten\">main page</a> you can check the direction with your phone's compass.","{n} şehrinden kıble, kuzeyden saat yönünde ölçüldüğünde <b>{q}°</b> yönündedir. Mekke'deki Kâbe yaklaşık <b>{km} km</b> uzaklıktadır. <a href=\"/#gebetszeiten\">Ana sayfada</a> yönü telefonunun pusulasıyla kontrol edebilirsin.","من {n} تقع القبلة على <b>{q}°</b> من الشمال، مقيسةً باتجاه عقارب الساعة. وتبعد الكعبة في مكة نحو <b>{km} كم</b>. في <a href=\"/#gebetszeiten\">الصفحة الرئيسية</a> يمكنك التحقق من الاتجاه ببوصلة هاتفك.","از {n} قبله در <b>{q}°</b> از شمال قرار دارد، در جهت عقربه‌های ساعت. کعبه در مکه حدود <b>{km} کیلومتر</b> فاصله دارد. در <a href=\"/#gebetszeiten\">صفحهٔ اصلی</a> می‌توانی جهت را با قطب‌نمای گوشی‌ات بررسی کنی.","Ji {n} qible li <b>{q}°</b> ji bakur e, li gor aliyê demjimêrê tê pîvandin. Kabe li Mekkeyê nêzî <b>{km} km</b> dûr e. Li <a href=\"/#gebetszeiten\">rûpela sereke</a> tu dikarî aliyê bi kumpasa telefona xwe kontrol bikî."],
mh:["Prayer times {n} in {mon}","{n} namaz vakitleri – {mon}","مواقيت الصلاة في {n} – {mon}","اوقات نماز {n} در {mon}","Demên nimêjê li {n} di {mon} de"],
day:["Day","Gün","اليوم","روز","Roj"],
calc:["Calculated with the method of Diyanet, which DITIB also uses (Fajr 18°, Isha {i}°, with the Diyanet safety margins), checked against the official Diyanet tables: at most one minute difference. If in doubt, your community's calendar applies.","DİTİB'in de kullandığı Diyanet yöntemiyle hesaplanmıştır (İmsak 18°, Yatsı {i}°, Diyanet temkinleriyle) ve resmî Diyanet takvimleriyle karşılaştırılmıştır: en fazla bir dakika fark. Şüphede cemaatinin takvimi geçerlidir.","محسوبة بطريقة ديانت التي تعتمدها DITIB أيضًا (الفجر 18°، العشاء {i}°، مع احتياطات ديانت)، ومقارنة بالجداول الرسمية لديانت: فرق دقيقة واحدة على الأكثر. وعند الشك يُعتمد تقويم جماعتك.","محاسبه‌شده با روش دیانت که DITIB هم از آن استفاده می‌کند (صبح ۱۸°، عشا {i}°، با احتیاط‌های دیانت) و مقایسه‌شده با جدول‌های رسمی دیانت: حداکثر یک دقیقه اختلاف. در صورت تردید، تقویم جماعت تو ملاک است.","Bi rêbaza Diyanetê hatiye hesabkirin, ku DITIB jî bi kar tîne (Sibe 18°, Eşa {i}°, bi temkînên Diyanetê), û bi tabloyên fermî yên Diyanetê hatiye berhevkirin: herî zêde yek deqe cudahî. Di gumanê de salnameya civata te derbas dibe."],
world:["Locally a different calculation method is often used, so times may differ more. Times are in local time ({l}).","Yerel olarak çoğu zaman farklı bir hesaplama yöntemi kullanılır, bu durumda vakitler daha fazla farklı olabilir. Saatler yerel saattir ({l}).","غالبًا ما تُستخدم محليًا طريقة حساب أخرى، فقد تختلف الأوقات أكثر. الأوقات بالتوقيت المحلي ({l}).","در محل اغلب روش محاسبهٔ دیگری به کار می‌رود و ممکن است اوقات بیشتر فرق کند. ساعت‌ها به وقت محلی ({l}) است.","Li cih pir caran rêbazeke din a hesabkirinê tê bikaranîn, wê demê dem dikarin bêtir cuda bin. Dem bi saeta herêmî ne ({l})."],
fh:["Friday prayer in {n}","{n} cuma namazı","صلاة الجمعة في {n}","نماز جمعه در {n}","Nimêja înê li {n}"],
fp:["The Friday prayer (Jumuʿa) takes place at Dhuhr time. Many mosques start the sermon a little earlier, so it is best to ask your community.","Cuma namazı öğle vaktinde kılınır. Birçok camide hutbe biraz daha erken başlar, en iyisi cemaatine sor.","تُقام صلاة الجمعة في وقت الظهر. وتبدأ كثير من المساجد الخطبة قبل ذلك بقليل، فالأفضل أن تسأل جماعتك.","نماز جمعه در وقت ظهر برگزار می‌شود. بسیاری از مساجد خطبه را کمی زودتر شروع می‌کنند؛ بهتر است از جماعت خود بپرسی.","Nimêja înê di dema nîvroyê de tê kirin. Gelek mizgeft xutbeyê hinekî zûtir dest pê dikin, çêtir e ji civata xwe bipirsî."],
nh:["Prayer times nearby","Yakındaki namaz vakitleri","مواقيت الصلاة في المدن القريبة","اوقات نماز در نزدیکی","Demên nimêjê li nêzîk"],
fz:["Prayer times","Namaz vakitleri","مواقيت الصلاة","اوقات نماز","Demên nimêjê"],
imp:["Legal notice","Künye","بيانات الناشر","اطلاعات حقوقی","Agahiyên qanûnî"],
dat:["Privacy","Gizlilik","الخصوصية","حریم خصوصی","Nepenî"],
ih1:["Prayer times in Germany, Austria, Switzerland and worldwide","Almanya, Avusturya, İsviçre ve dünya genelinde namaz vakitleri","مواقيت الصلاة في ألمانيا والنمسا وسويسرا وحول العالم","اوقات نماز در آلمان، اتریش، سوئیس و سراسر جهان","Demên nimêjê li Almanya, Awistirya, Swîsre û li seranserê cîhanê"],
ititle:["Prayer times Germany, Austria, Switzerland & worldwide – {mon} | Ruhaniyya","Almanya, Avusturya, İsviçre ve dünya namaz vakitleri – {mon} | Ruhaniyya","مواقيت الصلاة في ألمانيا والنمسا وسويسرا والعالم – {mon} | روحانية","اوقات نماز آلمان، اتریش، سوئیس و جهان – {mon} | روحانیه","Demên nimêjê Almanya, Awistirya, Swîsre û cîhan – {mon} | Ruhaniyya"],
ip:["Choose your city for today's prayer times, the monthly schedule for {mon} and the Qibla direction. For any other place in the world, use the <a href=\"/#gebetszeiten\">prayer times on the main page</a>, where you can also use your location.","Bugünkü namaz vakitleri, {mon} aylık takvimi ve kıble yönü için şehrini seç. Dünyanın başka herhangi bir yeri için <a href=\"/#gebetszeiten\">ana sayfadaki namaz vakitlerini</a> kullan, orada konumunu da bulabilirsin.","اختر مدينتك لمواقيت الصلاة اليوم وجدول شهر {mon} واتجاه القبلة. ولأي مكان آخر في العالم استخدم <a href=\"/#gebetszeiten\">مواقيت الصلاة في الصفحة الرئيسية</a>، وهناك تجد موقعك أيضًا.","شهر خود را برای اوقات نماز امروز، برنامهٔ ماه {mon} و جهت قبله انتخاب کن. برای هر جای دیگر جهان از <a href=\"/#gebetszeiten\">اوقات نماز در صفحهٔ اصلی</a> استفاده کن؛ آنجا موقعیت خودت را هم پیدا می‌کنی.","Ji bo demên nimêjê yên îro, plana mehê ya {mon} û aliyê qibleyê bajarê xwe hilbijêre. Ji bo her cihekî din ê cîhanê <a href=\"/#gebetszeiten\">demên nimêjê yên li rûpela sereke</a> bi kar bîne, li wir tu cihê xwe jî dibînî."],
rDE:["Prayer times in Germany","Almanya'da namaz vakitleri","مواقيت الصلاة في ألمانيا","اوقات نماز در آلمان","Demên nimêjê li Almanyayê"],
rAT:["Prayer times in Austria","Avusturya'da namaz vakitleri","مواقيت الصلاة في النمسا","اوقات نماز در اتریش","Demên nimêjê li Awistiryayê"],
rCH:["Prayer times in Switzerland","İsviçre'de namaz vakitleri","مواقيت الصلاة في سويسرا","اوقات نماز در سوئیس","Demên nimêjê li Swîsreyê"],
rLI:["Prayer times in Liechtenstein","Lihtenştayn'da namaz vakitleri","مواقيت الصلاة في ليختنشتاين","اوقات نماز در لیختن‌اشتاین","Demên nimêjê li Lîxtenştaynê"],
rEuropa:["Prayer times in Europe","Avrupa'da namaz vakitleri","مواقيت الصلاة في أوروبا","اوقات نماز در اروپا","Demên nimêjê li Ewropayê"],
rAsien:["Prayer times in Asia","Asya'da namaz vakitleri","مواقيت الصلاة في آسيا","اوقات نماز در آسیا","Demên nimêjê li Asyayê"],
rAfrika:["Prayer times in Africa","Afrika'da namaz vakitleri","مواقيت الصلاة في أفريقيا","اوقات نماز در آفریقا","Demên nimêjê li Afrîkayê"],
rAmerika:["Prayer times in America","Amerika'da namaz vakitleri","مواقيت الصلاة في الأمريكتين","اوقات نماز در آمریکا","Demên nimêjê li Amerîkayê"],
rAustralien:["Prayer times in Australia","Avustralya'da namaz vakitleri","مواقيت الصلاة في أستراليا","اوقات نماز در استرالیا","Demên nimêjê li Awistralyayê"]
};
var PN=[["Fajr","İmsak","الفجر","صبح","Sibe"],["Sunrise","Güneş","الشروق","طلوع آفتاب","Hilatina rojê"],["Dhuhr","Öğle","الظهر","ظهر","Nîvro"],["Asr","İkindi","العصر","عصر","Îkindî"],["Maghrib","Akşam","المغرب","مغرب","Mexrib"],["Isha","Yatsı","العشاء","عشا","Eşa"]];
var PND=["Fadschr","Sonnenaufgang","Dhuhr","Asr","Maghrib","Ischa"];
function t(k,v){var s=L==="de"||!T[k]?null:T[k][IX[L]];if(s==null)return null;return s.replace(/\{(\w+)\}/g,function(m,n){return v&&v[n]!=null?v[n]:m})}
function parts(d,tz){var p={};new Intl.DateTimeFormat("en-US",{timeZone:tz,weekday:"short",year:"numeric",month:"numeric",day:"numeric"}).formatToParts(d).forEach(function(x){p[x.type]=x.value});p.w=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday);return p}
/* Datum in der gewählten Sprache. kind: "long" = Wochentag + Datum, "row" = kurzer Wochentag + TT.MM., "mon" = Monat Jahr */
function d(dt,kind,tz){
  if(L==="ku"){var p=parts(dt,tz);if(kind==="mon")return KU_MO[p.month-1]+" "+p.year;if(kind==="row")return KU_WS[p.w]+", "+("0"+p.day).slice(-2)+"."+("0"+p.month).slice(-2)+".";return KU_WD[p.w]+", "+p.day+" "+KU_MO[p.month-1]+" "+p.year}
  var o=kind==="mon"?{month:"long",year:"numeric"}:kind==="row"?{weekday:"short",day:"2-digit",month:"2-digit"}:{weekday:"long",day:"numeric",month:"long",year:"numeric"};if(tz)o.timeZone=tz;
  return dt.toLocaleDateString(LOC[L],o)}
function n(x){return x.toLocaleString(L==="en"?"en-GB":L==="ar"||L==="fa"?LOC[L]:"de-DE")}
function region(iso,de){if(L==="de"||!iso||iso==="WORLD")return de;try{var dn=new Intl.DisplayNames([L==="ku"?"ku":L],{type:"region"});var r=dn.of(iso);return r&&r!==iso?r:de}catch(e){return de}}
function run(){
  var h=document.documentElement;
  var sel=document.getElementById("lsel");if(sel){sel.value=L;sel.addEventListener("change",function(){try{localStorage.setItem("rh_lang",JSON.stringify(sel.value))}catch(e){}location.reload()})}
  if(L==="de")return;
  h.lang=L;h.dir=(L==="ar"||L==="fa")?"rtl":"ltr";
  var mon=d(new Date(),"mon");
  [].forEach.call(document.querySelectorAll("[data-i]"),function(el){var v={};try{v=JSON.parse(el.getAttribute("data-a")||"{}")}catch(e){}v.mon=mon;if(v.km!=null)v.km=n(v.km);if(v.iso)v.l=region(v.iso,v.l);var s=t(el.getAttribute("data-i"),v);if(s!=null)el.innerHTML=s});
  [].forEach.call(document.querySelectorAll("[data-pn]"),function(el){el.textContent=PN[+el.getAttribute("data-pn")][IX[L]]});
  [].forEach.call(document.querySelectorAll("[data-ln]"),function(el){el.textContent=region(el.getAttribute("data-ln"),el.textContent)});
  var ti=document.querySelector("[data-ti]");if(ti){var v={};try{v=JSON.parse(ti.getAttribute("data-a")||"{}")}catch(e){}v.mon=mon;var s=t(ti.getAttribute("data-ti"),v);if(s)document.title=s}
}
window.RH={L:L,c:(L==="ar"||L==="fa")?"، ":", ",t:function(k,v){return t(k,v)},pn:function(i){return L==="de"?PND[i]:PN[i][IX[L]]},d:d,run:run};
})();

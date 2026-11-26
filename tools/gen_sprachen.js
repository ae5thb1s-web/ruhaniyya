// Seiten in weiteren Sprachen: Startseiten /en/ /tr/ /ar/ /fa/ /ku/, Städteseiten (en, ar, fa, ku),
// Weiße Tage, Ramadan 2027 und Hijri-Kalender (en, ar, fa, ku), weitere türkische Seiten, hreflang für alles.
// Aufruf: TZ=Europe/Berlin node tools/gen_sprachen.js <repo>
const fs=require('fs'),path=require('path');const OUT=process.argv[2]||path.join(__dirname,'..');
const page=fs.readFileSync(OUT+'/index.html','utf8');
const cut=(a,b)=>{const i=page.indexOf(a),j=page.indexOf(b,i);if(i<0||j<0)throw new Error('fehlt: '+a);return page.slice(i,j)};
// Gebetszeiten
const CALC=cut('const rad=x=>','function moonLon')+cut('/* Methoden.','function asr2');
eval(CALC.replace(/^const /gm,'var '));
// Mondkalender (wie gen_themen.js)
const store={get:(k,d)=>d},trT=s=>s,trF=(k,v)=>k.replace(/\{(\w+)\}/g,(m,n)=>v[n]);
let CAL=cut('const MONTHS=','function moonPhaseName').replace(/^const arDigits[^\n]*\n/m,'').replace(/^const th=hijri[\s\S]*$/m,'');
const MONTHS_=JSON.parse(cut('const MONTHS=[','];').slice('const MONTHS='.length)+']');
const mk=hoff=>new Function('store','LANG','trT','trF','MN',CAL.replace('const HCAL=store.get("rh_hcal","sicht")==="uq"?"uq":"sicht",HOFF=HCAL==="sicht"?1:0;','const HOFF='+hoff+';')+';return {hijri,phaseOnDay,addDays,midnight};')(store,'de',trT,trF,i=>MONTHS_[i]);
const S=mk(1),U=mk(0);
const today=S.midnight(new Date());
const DAYS=[];for(let i=0;i<400;i++){const d=S.addDays(today,i);DAYS.push({d,h:S.hijri(d),u:U.hijri(d),p:S.phaseOnDay(d)})}
const bid=[];DAYS.forEach((x,i)=>{if(x.p&&x.p.t==='full'&&i>0&&i<DAYS.length-1&&x.h.m!==9)bid.push({a:DAYS[i-1].d,m:x.d,b:DAYS[i+1].d,at:x.p.at,h:x.h})});
const starts=[];DAYS.forEach(x=>{if(x.h.d===1)starts.push({m:x.h.m,y:x.h.y,s:x.d,u:(DAYS.find(k=>k.u.d===1&&k.u.m===x.h.m&&k.u.y===x.h.y)||{}).d})});
const findH=(m,d,y,c)=>{const k=DAYS.find(x=>(c==='u'?x.u:x.h).m===m&&(c==='u'?x.u:x.h).d===d&&(c==='u'?x.u:x.h).y===y);return k?k.d:null};
const R={s:findH(9,1,1448,'s'),u:findH(9,1,1448,'u'),es:findH(10,1,1448,'s'),eu:findH(10,1,1448,'u'),as:findH(12,10,1448,'s'),au:findH(12,10,1448,'u'),fs:findH(12,9,1448,'s'),fu:findH(12,9,1448,'u'),q27:findH(9,27,1448,'s')};

/* ---------- Sprachen ---------- */
const L={
 en:{loc:'en-GB',og:'en_GB',dir:'ltr',ix:0,city:'prayer-times',wt:'white-days',ra:'ramadan-2027',ka:'islamic-calendar',
  MO:['Muharram','Safar','Rabiʿ al-Awwal','Rabiʿ al-Thani','Jumada al-Ula','Jumada al-Akhirah','Rajab','Shaʿban','Ramadan','Shawwal','Dhu al-Qaʿdah','Dhu al-Hijjah'],
  tag:'Path of spiritual Islam',home:['Ruhaniyya – Prayer times, Qibla, Islamic calendar & fasting days','Free prayer times worldwide (Diyanet/DITIB method), Qibla direction with compass, Islamic moon calendar with Sunnah fasting days, daily verse and hadith, tasbih counter and horoscope. No sign-up.'],
  nav:['Prayer times','White days','Ramadan 2027','Islamic calendar'],more:'More on Ruhaniyya',upd:'Updated',faqH:'Frequently asked questions',
  cityIdx:['Prayer times in Germany, Austria, Switzerland and worldwide','Choose your city for today\'s prayer times, the monthly timetable and the Qibla direction, calculated with the Diyanet/DITIB method.'],
  wtP:{title:'White Days {y}: all dates (Ayyam al-Bid) | Ruhaniyya',desc:'Next White Days: {a} to {b}. All dates of the Ayyam al-Bid fasting days for the next 12 months, with the time of the full moon.',h1:'White Days (Ayyam al-Bid): next dates',next:'Next White Days',full:'Full moon: {d} at {t} (German time)',
   lead:'The White Days are the three days around the full moon, the 13th, 14th and 15th of the lunar month. The Prophet ﷺ recommended fasting on them: “If you fast three days of the month, fast the 13th, 14th and 15th.” (at-Tirmidhi 761, an-Nasa\'i 2424). Whoever fasts three days every month is as if he fasted the whole year (al-Bukhari 1979).',
   btn:'Open fasting calendar with reminders',h2:'All White Days of the next 12 months',note:'On Ruhaniyya the full-moon day is always the middle day, as you see it in the sky. In Ramadan the White Days are not counted separately, since the whole month is fasted.',th:['White Days','Lunar month','Full moon'],fm:'{d}, {t}',
   faq:[['When are the next White Days?','The next White Days are from {a} to {b}. The full moon is on {m} at {t}.'],['Is fasting the White Days obligatory?','No, it is Sunnah: recommended, not obligatory.']]},
  raP:{title:'Ramadan 2027: start {d}, end and Eid al-Fitr | Ruhaniyya',desc:'Ramadan 2027 starts on {u} (Diyanet/Umm al-Qura) or {s} by moon sighting. Eid al-Fitr, Laylat al-Qadr, Arafah and Eid al-Adha 2027.',h1:'Ramadan 2027: when does it start?',box:'First day of fasting (Ramadan 1448)',boxn:'Diyanet / Umm al-Qura · by moon sighting often one day later: {s}',
   lead:'Ramadan 1448 AH falls in February and March 2027. Diyanet (Turkey, DITIB) and the Saudi Umm al-Qura calendar announce their dates in advance, while communities that wait for the sighting of the crescent often start one day later.',th:['Event','Diyanet / Umm al-Qura','Moon sighting'],rows:['First fasting day','Eid al-Fitr','Day of Arafah','Eid al-Adha','27th night (Laylat al-Qadr), evening of'],
   faq:[['When does Ramadan 2027 start?','According to Diyanet and Umm al-Qura the first day of fasting is {u}. Communities following moon sighting often start on {s}.'],['When is Eid al-Fitr 2027?','Eid al-Fitr is expected on {eu} (Diyanet/Umm al-Qura) or {es} by moon sighting.']]},
  kaP:{title:'Islamic calendar {y}: Hijri date today and month starts | Ruhaniyya',desc:'Today is {h} (moon sighting). Islamic calendar with all month starts of the next 12 months.',h1:'Islamic (Hijri) calendar',today:'Today, {d}',lead:'The Islamic calendar is a pure lunar calendar. Each month starts with the first visible crescent and has 29 or 30 days, so the year is about 11 days shorter than the solar year. It counts from the Hijra of the Prophet ﷺ to Medina in 622.',
   h2:'Month starts of the next 12 months',th:['Month','Diyanet / Umm al-Qura','Moon sighting'],uq:'Diyanet / Umm al-Qura: {h}',faq:[['What is the Islamic date today?','Today, {d}, is {h} by moon sighting.']]}},
 ar:{loc:'ar-u-nu-latn',og:'ar_AR',dir:'rtl',ix:2,city:'mawaqit-salat',wt:'ayyam-bid',ra:'ramadan-2027',ka:'taqwim-hijri',
  MO:['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'],
  tag:'طريق الإسلام الروحي',home:['روحانية – مواقيت الصلاة والقبلة والتقويم الهجري وأيام الصيام','مواقيت الصلاة مجانًا في كل العالم (طريقة ديانت)، اتجاه القبلة بالبوصلة، التقويم الهجري مع أيام صيام السنة، آية وحديث كل يوم، عدّاد التسبيح. بلا تسجيل.'],
  nav:['مواقيت الصلاة','الأيام البيض','رمضان 2027','التقويم الهجري'],more:'المزيد على روحانية',upd:'آخر تحديث',faqH:'أسئلة شائعة',
  cityIdx:['مواقيت الصلاة في ألمانيا والنمسا وسويسرا والعالم','اختر مدينتك لمواقيت الصلاة اليوم وجدول الشهر واتجاه القبلة، محسوبة بطريقة ديانت التي تعتمدها DITIB.'],
  wtP:{title:'الأيام البيض {y}: كل المواعيد | روحانية',desc:'الأيام البيض القادمة: من {a} إلى {b}. مواعيد صيام الأيام البيض للأشهر الاثني عشر القادمة مع وقت البدر.',h1:'الأيام البيض: المواعيد القادمة',next:'الأيام البيض القادمة',full:'البدر: {d} الساعة {t} (بتوقيت ألمانيا)',
   lead:'الأيام البيض هي الأيام الثلاثة حول البدر، أي الثالث عشر والرابع عشر والخامس عشر من الشهر القمري. قال النبي ﷺ: «إذا صمت من الشهر ثلاثًا فصم ثلاث عشرة وأربع عشرة وخمس عشرة» (الترمذي 761، النسائي 2424). وصيام ثلاثة أيام من كل شهر كصيام الدهر (البخاري 1979).',
   btn:'افتح تقويم الصيام مع التذكير',h2:'الأيام البيض في الأشهر الاثني عشر القادمة',note:'في روحانية يكون يوم البدر دائمًا في الوسط كما يُرى في السماء. ولا تُعدّ الأيام البيض في رمضان لأن الشهر كله صيام.',th:['الأيام البيض','الشهر القمري','البدر'],fm:'{d}، {t}',
   faq:[['متى الأيام البيض القادمة؟','الأيام البيض القادمة من {a} إلى {b}، والبدر يوم {m} الساعة {t}.'],['هل صيام الأيام البيض واجب؟','لا، هو سنة مستحبة وليس فرضًا.']]},
  raP:{title:'رمضان 2027: البداية {d} وعيد الفطر | روحانية',desc:'يبدأ رمضان 2027 يوم {u} حسب ديانت وأم القرى، أو {s} حسب رؤية الهلال. عيد الفطر وليلة القدر ويوم عرفة وعيد الأضحى 2027.',h1:'رمضان 2027: متى يبدأ؟',box:'أول يوم صيام (رمضان 1448)',boxn:'ديانت / أم القرى · وحسب رؤية الهلال غالبًا بعد يوم: {s}',
   lead:'يقع رمضان 1448 هـ في فبراير ومارس 2027. تعلن رئاسة الشؤون الدينية التركية (ديانت) وتقويم أم القرى مواعيدهما مسبقًا، بينما تبدأ الجماعات التي تنتظر رؤية الهلال غالبًا بعد يوم.',th:['المناسبة','ديانت / أم القرى','رؤية الهلال'],rows:['أول يوم صيام','عيد الفطر','يوم عرفة','عيد الأضحى','ليلة 27 (ليلة القدر)، مساء'],
   faq:[['متى يبدأ رمضان 2027؟','حسب ديانت وأم القرى أول أيام الصيام {u}، وحسب رؤية الهلال غالبًا {s}.'],['متى عيد الفطر 2027؟','عيد الفطر متوقع يوم {eu} (ديانت/أم القرى) أو {es} حسب رؤية الهلال.']]},
  kaP:{title:'التقويم الهجري {y}: التاريخ الهجري اليوم وبدايات الأشهر | روحانية',desc:'اليوم هو {h} (حسب رؤية الهلال). التقويم الهجري مع بدايات الأشهر في الاثني عشر شهرًا القادمة.',h1:'التقويم الهجري',today:'اليوم، {d}',lead:'التقويم الهجري تقويم قمري خالص، يبدأ كل شهر برؤية الهلال ويكون 29 أو 30 يومًا، فالسنة أقصر من السنة الشمسية بنحو 11 يومًا. ويبدأ العدّ من هجرة النبي ﷺ إلى المدينة سنة 622.',
   h2:'بدايات الأشهر في الاثني عشر شهرًا القادمة',th:['الشهر','ديانت / أم القرى','رؤية الهلال'],uq:'ديانت / أم القرى: {h}',faq:[['ما التاريخ الهجري اليوم؟','اليوم، {d}، هو {h} حسب رؤية الهلال.']]}},
 fa:{loc:'fa-u-ca-gregory-nu-latn',og:'fa_IR',dir:'rtl',ix:3,city:'owghat-sharei',wt:'ayyam-bid',ra:'ramazan-2027',ka:'taghvim-ghamari',
  MO:['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذی‌القعده','ذی‌الحجه'],
  tag:'راه اسلام معنوی',home:['روحانیه – اوقات شرعی، قبله، تقویم قمری و روزهای روزه','اوقات نماز رایگان در سراسر جهان (روش دیانت)، جهت قبله با قطب‌نما، تقویم قمری با روزهای روزهٔ مستحب، آیه و حدیث روز، تسبیح‌شمار. بدون ثبت‌نام.'],
  nav:['اوقات شرعی','ایام البیض','رمضان ۲۰۲۷','تقویم قمری'],more:'بیشتر در روحانیه',upd:'به‌روزرسانی',faqH:'پرسش‌های رایج',
  cityIdx:['اوقات شرعی در آلمان، اتریش، سوئیس و سراسر جهان','شهر خود را برای اوقات نماز امروز، جدول ماهانه و جهت قبله انتخاب کن؛ محاسبه با روش دیانت که DITIB هم به کار می‌برد.'],
  wtP:{title:'ایام البیض {y}: همهٔ تاریخ‌ها | روحانیه',desc:'ایام البیض بعدی: {a} تا {b}. تاریخ روزه‌های ایام البیض برای دوازده ماه آینده، با زمان ماه کامل.',h1:'ایام البیض: تاریخ‌های بعدی',next:'ایام البیض بعدی',full:'ماه کامل: {d} ساعت {t} (به وقت آلمان)',
   lead:'ایام البیض سه روز اطراف ماه کامل است، یعنی روزهای سیزدهم، چهاردهم و پانزدهم ماه قمری. پیامبر ﷺ فرمود: «اگر در ماه سه روز روزه می‌گیری، سیزدهم و چهاردهم و پانزدهم را روزه بگیر» (ترمذی ۷۶۱، نسائی ۲۴۲۴). کسی که هر ماه سه روز روزه بگیرد، گویی تمام سال را روزه گرفته است (بخاری ۱۹۷۹).',
   btn:'باز کردن تقویم روزه با یادآوری',h2:'ایام البیض دوازده ماه آینده',note:'در روحانیه روز ماه کامل همیشه روز وسط است، همان‌طور که در آسمان دیده می‌شود. در رمضان ایام البیض جداگانه شمرده نمی‌شود، چون تمام ماه روزه است.',th:['ایام البیض','ماه قمری','ماه کامل'],fm:'{d}، {t}',
   faq:[['ایام البیض بعدی کی است؟','ایام البیض بعدی از {a} تا {b} است. ماه کامل {m} ساعت {t} است.'],['آیا روزهٔ ایام البیض واجب است؟','نه، سنت و مستحب است.']]},
  raP:{title:'رمضان ۲۰۲۷: آغاز {d}، پایان و عید فطر | روحانیه',desc:'رمضان ۲۰۲۷ طبق دیانت و ام‌القری {u} آغاز می‌شود، یا با رؤیت هلال {s}. عید فطر، شب قدر، روز عرفه و عید قربان ۲۰۲۷.',h1:'رمضان ۲۰۲۷ کی شروع می‌شود؟',box:'نخستین روز روزه (رمضان ۱۴۴۸)',boxn:'دیانت / ام‌القری · با رؤیت هلال اغلب یک روز بعد: {s}',
   lead:'رمضان ۱۴۴۸ قمری در فوریه و مارس ۲۰۲۷ است. دیانت (ترکیه، DITIB) و تقویم ام‌القری تاریخ‌ها را از پیش اعلام می‌کنند، و جماعت‌هایی که منتظر رؤیت هلال‌اند اغلب یک روز بعد شروع می‌کنند.',th:['مناسبت','دیانت / ام‌القری','رؤیت هلال'],rows:['نخستین روز روزه','عید فطر','روز عرفه','عید قربان','شب ۲۷ (شب قدر)، شامگاه'],
   faq:[['رمضان ۲۰۲۷ کی شروع می‌شود؟','طبق دیانت و ام‌القری نخستین روز روزه {u} است و با رؤیت هلال اغلب {s}.'],['عید فطر ۲۰۲۷ کی است؟','عید فطر احتمالاً {eu} (دیانت/ام‌القری) یا {es} با رؤیت هلال است.']]},
  kaP:{title:'تقویم قمری {y}: تاریخ قمری امروز و آغاز ماه‌ها | روحانیه',desc:'امروز {h} است (با رؤیت هلال). تقویم قمری با آغاز همهٔ ماه‌ها در دوازده ماه آینده.',h1:'تقویم قمری (هجری قمری)',today:'امروز، {d}',lead:'تقویم هجری قمری یک تقویم کاملاً قمری است. هر ماه با دیده شدن هلال آغاز می‌شود و ۲۹ یا ۳۰ روز دارد، بنابراین سال حدود ۱۱ روز از سال خورشیدی کوتاه‌تر است. مبدأ آن هجرت پیامبر ﷺ به مدینه در سال ۶۲۲ است.',
   h2:'آغاز ماه‌ها در دوازده ماه آینده',th:['ماه','دیانت / ام‌القری','رؤیت هلال'],uq:'دیانت / ام‌القری: {h}',faq:[['تاریخ قمری امروز چیست؟','امروز، {d}، با رؤیت هلال {h} است.']]}},
 ku:{loc:'ku',og:'ku_TR',dir:'ltr',ix:4,city:'demen-nimeje',wt:'rojen-spi',ra:'remezan-2027',ka:'salnameya-hicri',
  MO:['Mihrem','Sefer','Rebîulewel','Rebîulaxir','Cemazîyelewel','Cemazîyelaxir','Receb','Şeban','Remezan','Şewal','Zilqade','Zilhice'],
  tag:'Rêya Îslama manewî',home:['Ruhaniyya – Demên nimêjê, qible, salnameya hicrî û rojên rojiyê','Demên nimêjê belaş li seranserê cîhanê (rêbaza Diyanetê), aliyê qibleyê bi kumpasê, salnameya heyvê bi rojên rojiyê yên sunnet, ayet û hedîsa rojê, jimarê tesbîhê. Bê qeydkirin.'],
  nav:['Demên nimêjê','Rojên spî','Remezan 2027','Salnameya hicrî'],more:'Zêdetir li Ruhaniyya',upd:'Nûkirin',faqH:'Pirsên pir tên pirsîn',
  cityIdx:['Demên nimêjê li Almanya, Awistirya, Swîsre û cîhanê','Ji bo demên nimêjê yên îro, plana mehê û aliyê qibleyê bajarê xwe hilbijêre; bi rêbaza Diyanetê tê hesabkirin.'],
  wtP:{title:'Rojên Spî {y}: hemû dîrok | Ruhaniyya',desc:'Rojên spî yên bê: {a} heta {b}. Hemû dîrokên rojiya rojên spî ji bo 12 mehên bê, bi dema heyva temam.',h1:'Rojên Spî (Eyyamul-Bîd): dîrokên bê',next:'Rojên spî yên bê',full:'Heyva temam: {d}, saet {t} (dema Almanyayê)',
   lead:'Rojên spî sê rojên li dora heyva temam in, roja 13., 14. û 15. ya meha heyvê. Pêxember ﷺ got: “Heke tu di mehê de sê rojan rojiyê bigirî, 13., 14. û 15. bigire.” (Tirmizî 761, Nesayî 2424). Yê her meh sê rojan rojiyê bigire, wek ku tevahiya salê rojî girtibe (Buxarî 1979).',
   btn:'Salnameya rojiyê bi bîranînê veke',h2:'Rojên spî yên 12 mehên bê',note:'Li Ruhaniyya roja heyva temam her tim di navê de ye, wek ku li ezmên tê dîtin. Di Remezanê de rojên spî cuda nayên hejmartin.',th:['Rojên spî','Meha heyvê','Heyva temam'],fm:'{d}, {t}',
   faq:[['Rojên spî yên bê kengê ne?','Rojên spî yên bê ji {a} heta {b} ne. Heyva temam {m}, saet {t} e.'],['Ma rojiya rojên spî ferz e?','Na, sunnet e.']]},
  raP:{title:'Remezan 2027: destpêk {d} û Cejna Remezanê | Ruhaniyya',desc:'Remezana 2027 li gor Diyanetê {u} dest pê dike, li gor dîtina heyvê {s}. Cejna Remezanê, Şeva Qedrê, Roja Erefeyê û Cejna Qurbanê 2027.',h1:'Remezan 2027 kengê dest pê dike?',box:'Roja rojiyê ya yekem (Remezan 1448)',boxn:'Diyanet / Ummul-Qura · li gor dîtina heyvê pir caran rojek paşê: {s}',
   lead:'Remezana 1448 a hicrî dikeve Sibat û Adara 2027an. Diyanet (Tirkiye, DITIB) û salnameya Ummul-Qurayê dîrokan ji berê ve ragihînin; civatên ku li benda dîtina heyvê ne pir caran rojek paşê dest pê dikin.',th:['Bûyer','Diyanet / Ummul-Qura','Dîtina heyvê'],rows:['Roja rojiyê ya yekem','Cejna Remezanê','Roja Erefeyê','Cejna Qurbanê','Şeva 27an (Şeva Qedrê), êvara'],
   faq:[['Remezan 2027 kengê dest pê dike?','Li gor Diyanetê roja yekem {u} ye, li gor dîtina heyvê pir caran {s}.'],['Cejna Remezanê 2027 kengê ye?','Cejna Remezanê {eu} (Diyanet) an {es} li gor dîtina heyvê ye.']]},
  kaP:{title:'Salnameya hicrî {y}: dîroka hicrî ya îro | Ruhaniyya',desc:'Îro {h} ye (li gor dîtina heyvê). Salnameya hicrî bi destpêka hemû mehan ji bo 12 mehên bê.',h1:'Salnameya hicrî (heyvê)',today:'Îro, {d}',lead:'Salnameya hicrî salnameyeke heyvê ye. Her meh bi dîtina heyva nû dest pê dike û 29 an 30 roj e, ji ber vê sal nêzî 11 rojan ji sala rojê kurttir e. Destpêka wê hicreta Pêxember ﷺ ya bo Medîneyê ye, sala 622an.',
   h2:'Destpêka mehan di 12 mehên bê de',th:['Meh','Diyanet / Ummul-Qura','Dîtina heyvê'],uq:'Diyanet / Ummul-Qura: {h}',faq:[['Dîroka hicrî ya îro çi ye?','Îro, {d}, li gor dîtina heyvê {h} ye.']]}}
};
const KU_WD=['Yekşem','Duşem','Sêşem','Çarşem','Pêncşem','În','Şemî'],KU_MO=['Çile','Sibat','Adar','Nîsan','Gulan','Hezîran','Tîrmeh','Tebax','Îlon','Cotmeh','Mijdar','Kanûn'];
function DL(lg,d,kind){if(lg==='ku'){const p={};new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Berlin',weekday:'short',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(d).forEach(x=>p[x.type]=x.value);const w=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday);
  return kind==='short'?`${+p.day} ${KU_MO[p.month-1]}`:kind==='mon'?`${KU_MO[p.month-1]} ${p.year}`:`${KU_WD[w]}, ${+p.day} ${KU_MO[p.month-1]} ${p.year}`}
 const o=kind==='short'?{day:'numeric',month:'long'}:kind==='mon'?{month:'long',year:'numeric'}:{weekday:'long',day:'numeric',month:'long',year:'numeric'};return d.toLocaleDateString(L[lg].loc,Object.assign({timeZone:'Europe/Berlin'},o))}
const TM=d=>d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'});
const F=(s,v)=>s.replace(/\{(\w+)\}/g,(m,n)=>v[n]!=null?v[n]:m);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const css=fs.readFileSync(path.join(__dirname,'gen_themen.js'),'utf8').match(/const css=`([\s\S]*?)`;/)[1];
const write=(rel,h)=>{const d=path.join(OUT,rel);fs.mkdirSync(d,{recursive:true});fs.writeFileSync(path.join(d,'index.html'),h)};
const SM=new Set();
function shell(lg,rel,title,desc,body,faq){const c=L[lg],u=`https://ruhaniyya.live/${rel}/`;SM.add(u);
 const ld=faq&&faq.length?`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))})}</script>`:'';
 return `<!doctype html><html lang="${lg}" dir="${c.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${u}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/fonts.css"><meta name="theme-color" content="#8B1CF0">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${u}"><meta property="og:image" content="https://ruhaniyya.live/logo.png"><meta property="og:locale" content="${c.og}">
<style>${css}${c.dir==='rtl'?'th,td{text-align:right}':''}</style>${ld}</head><body><header><a href="/${lg}/"><img src="/logo.png" alt="Ruhaniyya" width="40" height="40"></a><div><b>Ruhaniyya</b><small>${esc(c.tag)}</small></div></header><main>
${body}${faq&&faq.length?`<h2>${c.faqH}</h2>`+faq.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join(''):''}
<h2>${c.more}</h2><ul class="links"><li><a href="/${lg}/${c.city}/">${c.nav[0]}</a></li><li><a href="/${lg}/${c.wt}/">${c.nav[1]}</a></li><li><a href="/${lg}/${c.ra}/">${c.nav[2]}</a></li><li><a href="/${lg}/${c.ka}/">${c.nav[3]}</a></li><li><a href="/${lg}/">Ruhaniyya</a></li></ul>
<p class="mut" style="margin-top:2em">${c.upd}: ${DL(lg,today)}</p>
</main><footer><a href="/${lg}/">ruhaniyya.live</a> · <a href="/${lg}/${c.city}/">${c.nav[0]}</a> · <a href="/impressum.html">Impressum</a> · <a href="/datenschutz.html">Datenschutz</a></footer></body></html>`}
const yr=today.getFullYear(),YR=`${yr}/${yr+1}`;
const fh=(lg,h)=>`${h.d} ${L[lg].MO[h.m-1]} ${h.y}`;
const TRMO=['Muharrem','Safer','Rebiülevvel','Rebiülahir','Cemaziyelevvel','Cemaziyelahir','Recep','Şaban','Ramazan','Şevval','Zilkade','Zilhicce'];

/* ---------- Weiße Tage, Ramadan, Kalender: en ar fa ku ---------- */
const nb=bid[0];
for(const lg of ['en','ar','fa','ku']){const c=L[lg],w=c.wtP,r=c.raP,k=c.kaP;
 const v={a:DL(lg,nb.a,'short'),b:DL(lg,nb.b),m:DL(lg,nb.m),t:TM(nb.at),y:YR};
 write(`${lg}/${c.wt}`,shell(lg,`${lg}/${c.wt}`,F(w.title,v),F(w.desc,v),`<h1>${w.h1}</h1>
<div class="box"><span class="mut">${w.next}</span><b class="big">${DL(lg,nb.a,'short')} – ${DL(lg,nb.b)}</b>${F(w.full,{d:DL(lg,nb.m),t:TM(nb.at)})}</div>
<p class="lead">${w.lead}</p><a class="btn" href="/${lg}/#fasten">${w.btn}</a>
<h2>${w.h2}</h2><p>${w.note}</p><div class="tw"><table><thead><tr>${w.th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${bid.slice(0,12).map(b=>`<tr><td><b>${DL(lg,b.a,'short')} – ${DL(lg,b.b,'short')}</b></td><td>${c.MO[b.h.m-1]} ${b.h.y}</td><td>${F(w.fm,{d:DL(lg,b.m),t:TM(b.at)})}</td></tr>`).join('')}</tbody></table></div>`,w.faq.map(([q,a])=>[q,F(a,v)])));
 const rv={d:DL(lg,R.u,'short'),u:DL(lg,R.u),s:DL(lg,R.s),eu:DL(lg,R.eu),es:DL(lg,R.es)};
 const rows=[[R.u,R.s],[R.eu,R.es],[R.fu,R.fs],[R.au,R.as],[S.addDays(R.q27,-2),S.addDays(R.q27,-1)]];
 write(`${lg}/${c.ra}`,shell(lg,`${lg}/${c.ra}`,F(r.title,rv),F(r.desc,rv),`<h1>${r.h1}</h1>
<div class="box"><span class="mut">${r.box}</span><b class="big">${DL(lg,R.u)}</b>${F(r.boxn,{s:DL(lg,R.s)})}</div><p class="lead">${r.lead}</p><a class="btn" href="/${lg}/${c.city}/">${c.nav[0]}</a>
<div class="tw"><table><thead><tr>${r.th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((x,i)=>`<tr><td>${r.rows[i]}</td><td>${DL(lg,x[0])}</td><td>${DL(lg,x[1])}</td></tr>`).join('')}</tbody></table></div>`,r.faq.map(([q,a])=>[q,F(a,rv)])));
 const th=S.hijri(today),tu=U.hijri(today),kv={y:YR,h:fh(lg,th),d:DL(lg,today)};
 write(`${lg}/${c.ka}`,shell(lg,`${lg}/${c.ka}`,F(k.title,kv),F(k.desc,kv),`<h1>${k.h1}</h1>
<div class="box"><span class="mut">${F(k.today,{d:DL(lg,today)})}</span><b class="big">${fh(lg,th)}</b>${F(k.uq,{h:fh(lg,tu)})}</div><p class="lead">${k.lead}</p>
<h2>${k.h2}</h2><div class="tw"><table><thead><tr>${k.th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${starts.slice(0,13).map(s=>`<tr><td><b>${c.MO[s.m-1]} ${s.y}</b></td><td>${s.u?DL(lg,s.u):'–'}</td><td>${DL(lg,s.s)}</td></tr>`).join('')}</tbody></table></div>`,k.faq.map(([q,a])=>[q,F(a,kv)])));
}

/* ---------- Städteseiten en ar fa ku ---------- */
const TX=new Function(fs.readFileSync(path.join(__dirname,'i18n.js'),'utf8').match(/var T=(\{[\s\S]*?\n\});/)[0]+';return T;')();
const PNL=new Function(fs.readFileSync(path.join(__dirname,'i18n.js'),'utf8').match(/var PN=(\[[\s\S]*?\]\]);/)[0]+';return PN;')();
const NM=JSON.parse(fs.readFileSync(path.join(__dirname,'namen.json'),'utf8'));
const CJ=JSON.parse(fs.readFileSync(path.join(__dirname,'cities.json'),'utf8'));
const slug=n=>n.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[().]/g,'').replace(/\//g,'-').trim().replace(/\s+/g,'-');
const CT=[];const CTZ={DE:'Europe/Berlin',AT:'Europe/Vienna',CH:'Europe/Zurich',LI:'Europe/Vaduz'};
for(const iso of ['DE','AT','CH','LI'])for(const x of CJ[iso])CT.push({n:x[0],la:x[1],lo:x[2],iso,tz:CTZ[iso],cc:iso});
for(const x of CJ.WORLD)CT.push({n:x[0],la:x[1],lo:x[2],iso:'WORLD',tz:x[3],cc:x[5]||''});
const westG=x=>x.iso!=='WORLD'||(/^(Europe|America|Australia)\//.test(x.tz)&&x.tz!=='Europe/Istanbul');
function cname(lg,x){if(lg==='en'||lg==='ku')return NM[lg][x.n]||(lg==='ku'&&NM.en[x.n]&&x.iso==='WORLD'?NM.en[x.n]:x.n).replace(' (Jerusalem)','');
 if(lg==='ar')return NM.ar[x.n]||x.n;
 if(NM.fa_override[x.n])return NM.fa_override[x.n];const a=NM.ar[x.n];if(!a)return x.n;
 let f=a.replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/ة/g,'ه').replace(/[أإ]/g,'ا');if(westG(x))f=f.replace(/غ/g,'گ');return f}
const region=(lg,cc)=>{if(!cc)return '';try{const r=new Intl.DisplayNames([lg==='ku'?'ku':lg],{type:'region'}).of(cc);return r&&r!==cc?r:new Intl.DisplayNames(['en'],{type:'region'}).of(cc)}catch(e){return cc}};
const K=[21.4225,39.8262];
const qib=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),dl=rad(K[1]-lo);return Math.round(fixA(deg(Math.atan2(Math.sin(dl),Math.cos(p1)*Math.tan(p2)-Math.sin(p1)*Math.cos(dl)))))};
const dist=(la,lo)=>{const p1=rad(la),p2=rad(K[0]),a=Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(rad(K[1]-lo)/2)**2;return Math.round(6371*2*Math.asin(Math.sqrt(a)))};
const isha=tz=>/^(Europe|America|Atlantic)\//.test(tz)&&tz!=='Europe/Istanbul'?16:17;
const now=new Date();
for(const lg of ['en','ar','fa','ku']){const c=L[lg],ix=c.ix,t=k=>TX[k][ix],pn=PNL.map(p=>p[ix]);
 const nfmt=n=>n.toLocaleString(lg==='en'?'en-GB':lg==='ku'?'de-DE':c.loc);
 const pages=[];
 for(const x of CT){const s=slug(x.n),n=cname(lg,x),rel=`${lg}/${c.city}/${s}`,q=qib(x.la,x.lo),km=dist(x.la,x.lo);
  const Y=+now.toLocaleString('en',{year:'numeric',timeZone:x.tz}),M=+now.toLocaleString('en',{month:'numeric',timeZone:x.tz})-1,nd=new Date(Date.UTC(Y,M+1,0)).getUTCDate();
  const mon=lg==='ku'?`${KU_MO[M]} ${Y}`:new Date(Date.UTC(Y,M,15)).toLocaleDateString(c.loc,{month:'long',year:'numeric'});
  const f=d=>d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:x.tz});
  let rows='';for(let d=1;d<=nd;d++){const dt=new Date(Y,M,d),tt=prayerTimes(dt,x.la,x.lo,x.tz);
   const dl=lg==='ku'?`${['Ye','Du','Sê','Ça','Pê','În','Şe'][dt.getDay()]}, ${String(d).padStart(2,'0')}.${String(M+1).padStart(2,'0')}.`:dt.toLocaleDateString(c.loc,{weekday:'short',day:'2-digit',month:'2-digit'});
   rows+=`<tr data-d="${d}"><td>${dl}</td>${tt.map(z=>`<td>${f(z)}</td>`).join('')}</tr>`}
  const near=CT.filter(y=>y.n!==x.n).map(y=>[y,(y.la-x.la)**2+((y.lo-x.lo)*Math.cos(rad(x.la)))**2]).sort((a,b)=>a[1]-b[1]).slice(0,8).map(([y])=>`<li><a href="/${lg}/${c.city}/${slug(y.n)}/">${esc(cname(lg,y))}</a></li>`).join('');
  const land=region(lg,x.cc);
  const title=F(t('title'),{n,mon}),desc=`${F(t('h1'),{n})}: ${pn.join(', ')}. ${F(t('calc'),{i:isha(x.tz)}).split(/[.。]/)[0]}. ${F(t('qh'),{n})}: ${q}°.`;
  const faq=[[F(t('qh'),{n})+'?',F(t('qp'),{n,q,km:nfmt(km)}).replace(/<[^>]+>/g,'')]];
  const body=`<p class="mut"><a href="/${lg}/${c.city}/">${c.nav[0]}</a> › ${esc(land)} › ${esc(n)}</p><h1>${esc(F(t('h1'),{n}))}</h1><p class="mut" id="today">${t('today')}</p><div class="grid" id="now"></div>
<a class="btn" href="/${lg}/#gebetszeiten">${t('live')}</a>
<h2>${esc(F(t('qh'),{n}))}</h2><p>${F(t('qp'),{n:esc(n),q,km:nfmt(km)}).replace('href="/#gebetszeiten"',`href="/${lg}/#gebetszeiten"`)}</p>
<h2>${esc(F(t('mh'),{n,mon}))}</h2><div style="overflow-x:auto"><table><thead><tr><th>${t('day')}</th>${pn.map(p=>`<th>${p}</th>`).join('')}</tr></thead><tbody id="tb">${rows}</tbody></table></div>
<p class="mut">${F(t('calc'),{i:isha(x.tz)})}${x.iso==='WORLD'?' '+F(t('world'),{l:land||n}):''}</p>
<h2>${esc(F(t('fh'),{n}))}</h2><p>${t('fp')}</p><h2>${t('nh')}</h2><ul class="cities">${near}</ul>
<script>(function(){var TZ=${JSON.stringify(x.tz)},LAT=${x.la},LNG=${x.lo};${CALC}
var PN=${JSON.stringify(pn)},f=function(d){return d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",timeZone:TZ})};var now=new Date(),Y=+now.toLocaleString("en",{year:"numeric",timeZone:TZ}),M=+now.toLocaleString("en",{month:"numeric",timeZone:TZ})-1,D=+now.toLocaleString("en",{day:"numeric",timeZone:TZ});
var t=prayerTimes(new Date(Y,M,D),LAT,LNG,TZ),nx=t.findIndex(function(x){return x>now});
document.getElementById("now").innerHTML=t.map(function(x,i){return '<div class="t'+(i===nx?' on':'')+'"><span>'+PN[i]+(i===nx?' · ${t('next')}':'')+'</span><b>'+f(x)+'</b></div>'}).join("");
var tr=document.querySelector('#tb tr[data-d="'+D+'"]');if(tr&&${Y}===Y&&${M}===M)tr.className="today";})();</script>`;
  write(rel,shell(lg,rel,title,desc,body.replace(/<style>/,''),faq).replace('</style>','.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}.t{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;text-align:center}.t span{display:block;color:var(--mut);font-size:14px}.t b{font-size:28px}.t.on{border-color:var(--p);box-shadow:0 0 0 2px var(--p) inset}.cities{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.cities a{display:block;padding:6px 12px;border:1px solid var(--line);border-radius:20px;text-decoration:none;color:var(--tx)}tr.today td{background:#2a1a40;font-weight:700}@media(max-width:560px){.grid{grid-template-columns:repeat(2,1fr)}}</style>'));
  pages.push({s,n,x});
 }
 const groups=[['DE'],['AT'],['CH'],['LI'],['Europe'],['Asia'],['Africa'],['America'],['Australia']];
 const KON=tz=>tz.split('/')[0];
 let lists='';for(const [g] of groups){const P=pages.filter(p=>p.x.iso===g||(p.x.iso==='WORLD'&&KON(p.x.tz)===g)).sort((a,b)=>a.n.localeCompare(b.n,lg));if(!P.length)continue;
  const gname=g.length===2?region(lg,g):({en:{Europe:'Europe',Asia:'Asia',Africa:'Africa',America:'America',Australia:'Australia'},ar:{Europe:'أوروبا',Asia:'آسيا',Africa:'أفريقيا',America:'أمريكا',Australia:'أستراليا'},fa:{Europe:'اروپا',Asia:'آسیا',Africa:'آفریقا',America:'آمریکا',Australia:'استرالیا'},ku:{Europe:'Ewropa',Asia:'Asya',Africa:'Afrîka',America:'Amerîka',Australia:'Awistralya'}})[lg][g];
  lists+=`<h2>${esc(gname)}</h2><ul class="links">${P.map(p=>`<li><a href="/${lg}/${c.city}/${p.s}/">${esc(p.n)}</a></li>`).join('')}</ul>`}
 write(`${lg}/${c.city}`,shell(lg,`${lg}/${c.city}`,`${c.cityIdx[0]} | Ruhaniyya`,c.cityIdx[1],`<h1>${c.cityIdx[0]}</h1><p class="lead">${c.cityIdx[1]}</p>${lists}`,[]));
}

/* ---------- Startseiten je Sprache ---------- */
const HOMES={tr:['Ruhaniyya – Namaz vakitleri, kıble, hicri takvim ve oruç günleri','Dünya genelinde ücretsiz namaz vakitleri (Diyanet/DİTİB yöntemi), pusulalı kıble yönü, sünnet oruç günleriyle hicri takvim, günün ayeti ve hadisi, tesbih sayacı. Kayıt gerekmez.'],
 en:L.en.home,ar:L.ar.home,fa:L.fa.home,ku:L.ku.home};
const LANGURL={de:'/',en:'/en/',tr:'/tr/',ar:'/ar/',fa:'/fa/',ku:'/ku/'};
for(const lg of Object.keys(HOMES)){let h=page;const [ti,de]=HOMES[lg],u=`https://ruhaniyya.live/${lg}/`;SM.add(u);
 h=h.replace('<html lang="de">',`<html lang="${lg}"${lg==='ar'||lg==='fa'?' dir="rtl"':''}>`);
 h=h.replace(/<title>[^<]*<\/title>/,`<title>${esc(ti)}</title>`).replace(/<meta name="description" content="[^"]*"/,`<meta name="description" content="${esc(de)}"`);
 h=h.replace(/<meta property="og:title" content="[^"]*"/,`<meta property="og:title" content="${esc(ti)}"`).replace(/<meta property="og:description" content="[^"]*"/,`<meta property="og:description" content="${esc(de)}"`);
 h=h.replace('<link rel="canonical" href="https://ruhaniyya.live/">',`<link rel="canonical" href="${u}">`).replace('<meta property="og:url" content="https://ruhaniyya.live/">',`<meta property="og:url" content="${u}">`);
 h=h.replace('<meta property="og:locale" content="de_DE">',`<meta property="og:locale" content="${({tr:'tr_TR',en:'en_GB',ar:'ar_AR',fa:'fa_IR',ku:'ku_TR'})[lg]}">`).replace('"inLanguage":"de"',`"inLanguage":"${lg}"`);
 h=h.replace(/(href|src)="(datenschutz\.html|impressum\.html|favicon\.svg|fonts\.css|manifest\.webmanifest)"/g,'$1="/$2"');
 h=h.replace('<meta charset="utf-8">',`<meta charset="utf-8">\n<script>window.__LANG=${JSON.stringify(lg)}</script>`);
 const a='let LANG=store.get("rh_lang","de");';if(!h.includes(a))throw new Error('LANG-Zeile fehlt');h=h.replace(a,'let LANG=window.__LANG||store.get("rh_lang","de");');
 const b='$("#langSel").addEventListener("change",()=>{store.set("rh_lang",$("#langSel").value);location.reload()});';if(!h.includes(b))throw new Error('langSel fehlt');
 h=h.replace(b,`$("#langSel").addEventListener("change",()=>{store.set("rh_lang",$("#langSel").value);location.href=${JSON.stringify(LANGURL)}[$("#langSel").value]||"/"});`);
 fs.mkdirSync(path.join(OUT,lg),{recursive:true});fs.writeFileSync(path.join(OUT,lg,'index.html'),h)}

/* ---------- hreflang ---------- */
function setAlt(file,map){if(!fs.existsSync(file))return;let h=fs.readFileSync(file,'utf8');h=h.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g,'');
 const tags=Object.entries(map).map(([l,u])=>`<link rel="alternate" hreflang="${l}" href="https://ruhaniyya.live${u}">`).join('')+(map.de?`<link rel="alternate" hreflang="x-default" href="https://ruhaniyya.live${map.de}">`:'');
 h=h.replace('</head>',tags+'\n</head>');fs.writeFileSync(file,h)}
const P=(...a)=>path.join(OUT,...a,'index.html');
const homeMap={de:'/',en:'/en/',tr:'/tr/',ar:'/ar/',fa:'/fa/',ku:'/ku/'};
for(const [l,u] of Object.entries(homeMap))setAlt(path.join(OUT,u,'index.html'),homeMap);
const cityMap=s=>({de:`/gebetszeiten/${s}/`,tr:`/tr/namaz-vakitleri/${s}/`,en:`/en/${L.en.city}/${s}/`,ar:`/ar/${L.ar.city}/${s}/`,fa:`/fa/${L.fa.city}/${s}/`,ku:`/ku/${L.ku.city}/${s}/`});
for(const x of CT){const m=cityMap(slug(x.n));for(const u of Object.values(m))setAlt(path.join(OUT,u,'index.html'),m)}
{const m={de:'/gebetszeiten/',tr:'/tr/namaz-vakitleri/',en:`/en/${L.en.city}/`,ar:`/ar/${L.ar.city}/`,fa:`/fa/${L.fa.city}/`,ku:`/ku/${L.ku.city}/`};for(const u of Object.values(m))setAlt(path.join(OUT,u,'index.html'),m)}
for(const [de,tr] of [['/fastentage/','/tr/oruc-gunleri/'],['/qibla/','/tr/kible/'],['/gebet-lernen/','/tr/namaz-kilmak/'],['/was-bricht-das-fasten/','/tr/orucu-bozan-seyler/'],['/laylat-al-qadr/','/tr/kadir-gecesi/']]){const m={de,tr};for(const u of Object.values(m))setAlt(path.join(OUT,u,'index.html'),m)}
for(const [de,tr,key] of [['/weisse-tage/','/tr/beyaz-gunler/','wt'],['/ramadan-2027/','/tr/ramazan-2027/','ra'],['/islamischer-kalender/','/tr/hicri-takvim/','ka']]){
 const m={de,tr};for(const lg of ['en','ar','fa','ku'])m[lg]=`/${lg}/${L[lg][key]}/`;for(const u of Object.values(m))setAlt(path.join(OUT,u,'index.html'),m)}

/* ---------- Sitemap ---------- */
for(const x of CT)for(const lg of ['en','ar','fa','ku'])SM.add(`https://ruhaniyya.live/${lg}/${L[lg].city}/${slug(x.n)}/`);
for(const lg of ['en','ar','fa','ku'])SM.add(`https://ruhaniyya.live/${lg}/${L[lg].city}/`);
const sm=path.join(OUT,'sitemap.xml');let xml=fs.readFileSync(sm,'utf8');const day=new Date().toISOString().slice(0,10);
for(const u of SM)xml=xml.replace(new RegExp(`\\s*<url><loc>${u.replace(/[.]/g,'\\.')}</loc>.*?</url>`),'');
xml=xml.replace('</urlset>',[...SM].map(u=>`  <url><loc>${u}</loc><lastmod>${day}</lastmod><changefreq>${u.split('/').length>6?'monthly':'weekly'}</changefreq><priority>${u.split('/').length>6?'0.6':'0.8'}</priority></url>`).join('\n')+'\n</urlset>');
fs.writeFileSync(sm,xml);console.log(SM.size,'Seiten in weiteren Sprachen');

// Setzt die Versionsnummern (?v=...) der Dateien in /assets/ in index.html auf den aktuellen Inhalt,
// damit Browser nach einer Änderung die neue Datei laden und sonst die gespeicherte nehmen.
// Aufruf: node tools/gen_version.js <repo>
const fs=require('fs'),path=require('path'),crypto=require('crypto');const OUT=process.argv[2]||path.join(__dirname,'..');
const f=path.join(OUT,'index.html');let h=fs.readFileSync(f,'utf8');
h=h.replace(/\/assets\/([\w-]+\.js)\?v=[0-9a-f]+/g,(m,n)=>`/assets/${n}?v=${crypto.createHash('sha1').update(fs.readFileSync(path.join(OUT,'assets',n))).digest('hex').slice(0,8)}`);
fs.writeFileSync(f,h);console.log('Versionen gesetzt');

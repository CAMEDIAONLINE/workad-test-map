# Map kompilieren & deployen (WorkAdventure – camedia)

Diese Doku beschreibt, wie die WorkAdventure-Karte aus diesem Repo (`workadventure-map-starter-kit`) kompiliert und veröffentlicht wird, und listet die Stolperfallen auf, die schon mal Zeit gekostet haben.

## 1. Kurzfassung

```bash
npm install
npm run build
```

Danach liegt die fertige, deploybare Karte im Ordner `dist/`. Der Upload auf den eigenen Hetzner-Server erfolgt manuell (siehe Abschnitt 5) – es gibt **keine** automatische Veröffentlichung über GitHub.

## 2. Wie der Build funktioniert

- `npm run build` = `tsc && vite build` (siehe `package.json`).
- Das Vite-Plugin `wa-map-optimizer-vite` (konfiguriert in `vite.config.ts`) durchsucht **rekursiv das komplette Projektverzeichnis** nach `*.tmj`-Dateien (`getMaps()`), außer in Ordnern, die exakt `dist` oder `node_modules` heißen.
- **Jede gefundene `.tmj`-Datei wird als eigene Karte gebaut und optimiert** – auch wenn sie gar nicht dafür gedacht ist. Aktuell liegt nur `camedia.tmj` im Projektroot (die Beispiel-Karten `conference.tmj`/`office.tmj` aus dem Starter-Kit liegen archiviert in `#archiv/` mit `.bak`-Endung, siehe Abschnitt 3).
- Für jede Karte wird u. a.:
  - das Tileset-Bild in optimierte "Chunk"-PNGs zusammengefasst,
  - das `mapImage`-Property auf die kopierte Bilddatei umgeschrieben,
  - das `script`-Property (normalerweise `src/main.ts`) auf die im Build erzeugte, gehashte JS-Datei umgeschrieben (z. B. `assets/main-8aa1738c.js`).

## 3. Wichtige Regel: Projektverzeichnis sauber halten

**Weil jede `.tmj`-Datei irgendwo im Repo automatisch mitgebaut wird**, dürfen im Projekt keine "losen" oder alten `.tmj`-Dateien herumliegen, die nicht veröffentlicht werden sollen. Das führt sonst zu Fehlern oder unnötigem Build-Output.

Konkret passiert (ist uns beim Testen genau so passiert):

- Ein alter, umbenannter Build-Ordner wie `dist_old/` wird **nicht** ausgeschlossen (nur der Ordner, der exakt `dist` heißt, wird übersprungen). Die darin liegende bereits gebaute `camedia.tmj` wird dann als zusätzliche "Karte" erkannt und mitgebaut – das erzeugt doppelte, unnötige JS-Chunks und verlangsamt/verwirrt den Build.
  → **Alte Build-Ordner nicht im Projektverzeichnis liegen lassen**, sondern außerhalb des Repos sichern (siehe `../workad-test-map_dist_old_backup`) oder löschen.
- Archivierte Kartenversionen (z. B. alte Stände von `camedia.tmj`) bitte mit einer **anderen Dateiendung als `.tmj`** ablegen, sonst werden sie beim Build ebenfalls als eigene Karte behandelt.
  → Konvention in diesem Projekt: Ordner **`#archiv/`**, Dateien darin enden auf **`.tmj.bak`** (z. B. `#archiv/camedia.tmj.bak`). So bleiben sie im Repo auffindbar, werden aber von `getMaps()` ignoriert (es wird nur auf `.endsWith(".tmj")` geprüft).

## 4. Bekannter Fehler & Fix: "Undefined main script file"

**Symptom:** `npm run build` bricht ab mit

```text
[map-optimizer] Undefined main script file
```

**Ursache:** Seit dem Umstieg auf Vite 6 / Rollup 4 (Paket-Update von `vite ^4.5.3` auf `^6.1.0`, siehe `package-lock.json`-Historie) hat Rollup die Standard-Zeichen für Datei-Hashes von reinem Hex (`0-9a-f`) auf ein Base64-ähnliches Alphabet umgestellt (z. B. `main-CQ2vNrkH.js` statt `main-8aa1738c.js`). Das `wa-map-optimizer-vite`-Plugin sucht die gebaute Script-Datei aber weiterhin mit einer Regex, die **nur reine Hex-Hashes** erkennt (`^main-[a-fA-F0-9]{8}\.js$`). Bei einem "bunten" Hash wie `CQ2vNrkH` schlägt der Abgleich fehl → das `script`-Property in der `.tmj` wird nicht automatisch korrigiert → Build-Fehler bzw. (früher, bevor der Fehler den Build hart abbrechen ließ) ein kaputtes `script`-Property in der ausgelieferten Karte.

**Das war vermutlich genau der manuelle Nacharbeits-Schritt, an den du dich erinnert hast:** von Hand in der gebauten `dist/camedia.tmj` das `script`-Property von `src/main.ts` auf `assets/main-<hash-aus-dist/assets>.js` ändern (so stand es auch – als Handarbeit gedacht – im alten `README.md`).

**Fix (bereits eingebaut in `vite.config.ts`):** Rollup wird angewiesen, wieder reine Hex-Hashes zu erzeugen:

```ts
build: {
    rollupOptions: {
        input: { ... },
        output: {
            hashCharacters: "hex",
        },
    },
},
```

Damit läuft die automatische Korrektur des `script`-Properties wieder wie vorgesehen – **kein manueller Eingriff in der `.tmj` mehr nötig.**

## 5. Deployment

**Wichtig:** Die Karte wird **nicht** über GitHub veröffentlicht, sondern auf den eigenen Hetzner-Server hochgeladen, auf dem WorkAdventure selbst gehostet läuft (self-hosted `map-storage`-Service, Docker-Compose-Stack in `wa-docker-compose.yaml` / `wa-env.env`). `UPLOAD_MODE=GH_PAGES` in `.env` und der GitHub-Actions-Workflow (`.github/workflows/build-and-deploy.yml`) sind Reste aus der Starter-Kit-Vorlage und werden hier nicht genutzt.

### Upload zum eigenen map-storage-Server

1. `npm run build` ausführen (siehe oben) → Ergebnis liegt in `dist/`.
2. Den **Inhalt** von `dist/` zu einer ZIP-Datei packen – die Dateien (`camedia.tmj`, `index.html`, `assets/`, `images/`, …) müssen direkt auf Root-Ebene im ZIP liegen, **nicht** in einem `dist/`-Unterordner.
3. Im Browser einloggen unter **`https://office.camedia.tools/map-storage/`** (HTTP-Basic-Auth, User `mapadmin`, Passwort siehe `MAP_STORAGE_AUTHENTICATION_PASSWORD` in `wa-env.env`).
4. ZIP dort hochladen – **in das Root-Verzeichnis**, nicht in einen Unterordner. Grund: `START_ROOM_URL=/~/camedia.wam` in `wa-env.env` erwartet die Karte im Root des map-storage. Der Server erzeugt beim Entpacken automatisch eine `camedia.wam`-Begleitdatei neben `camedia.tmj`.

**Warum nicht das eingebaute `npm run upload`-CLI-Tool?** Das offizielle Tool (`@workadventure/upload-maps`) authentifiziert sich ausschließlich per `Authorization: Bearer <API-Key>`. Der Server hat aber `MAP_STORAGE_ENABLE_BEARER_AUTHENTICATION=false` und nur `MAP_STORAGE_ENABLE_BASIC_AUTHENTICATION=true` aktiv – das CLI-Tool würde also mit 401/403 abgewiesen. Der Browser-Upload über die map-storage-Oberfläche (Basic Auth) ist hier der richtige Weg, solange die Server-Konfiguration nicht angepasst wird.

## 6. Bekannte lokale Umgebungs-Stolperfallen

Beim ersten Build in dieser Umgebung traten zusätzlich zwei bekannte npm/native-Modul-Probleme auf (nichts Map-Spezifisches, aber gut zu wissen):

- `Cannot find module @rollup/rollup-linux-x64-gnu` → Fix: `npm install` erneut ausführen (bekannter npm-Optional-Dependencies-Bug).
- `Cannot find module '../build/Release/sharp-linux-x64.node'` → Fix: `npm install --platform=linux --arch=x64 sharp`.

## 7. Bekannter Fehler & Fix: "Your map must have a layer named \"floorLayer\""

**Symptom:** Beim Hochladen des ZIPs liefert der map-storage-Server diesen Validierungsfehler zurück:

```json
{"camedia.tmj":{"layers":[{"type":"error","message":"Your map must have a layer named \"floorLayer\" of type \"Object Layer\".", ...}]}}
```

**Ursache:** WorkAdventure verlangt von jeder Karte eine Object Layer, die exakt `floorLayer` heißt (Doku: [WA Maps Rules](https://docs.workadventu.re/map-building/wa-maps.md#workadventure-maps-rules)). Sie ist u. a. die Ablage für "Areas" (z. B. die alten Jitsi-Meeting-Room-Zonen, aber auch die Areas, die der browserbasierte WorkAdventure-Map-Editor selbst anlegt). Beim Export/Umbenennen der überarbeiteten Karte (`camedia-lifekit.tmj` → `camedia.tmj`) fehlte diese Layer komplett – die alte `#archiv/camedia.tmj.bak` hatte sie noch (dort mit den alten `jitsiRoom`-Area-Objekten befüllt).

**Fix:** Eine Object Layer namens `floorLayer` wurde in `camedia.tmj` ergänzt (Struktur an `entryPoints` angelehnt).

**Nachtrag:** Die Layer allein reicht nicht – `src/main.ts` (Pause-Teleport-Script) hört per `WA.room.area.onEnter(...)` auf zwei konkrete Areas **innerhalb** dieser Layer:

- **`conference-room`** (Area, `x:384 y:288 w:512 h:544`, Property `focusable:true`, `zoom_margin:0.5`)
- **`pause-room`** (Area, `x:128 y:864 w:224 h:192`, Property `silent:true`)

Beide waren beim Export der neuen Karte ebenfalls verschwunden (nicht nur die Layer selbst) und wurden mit den Koordinaten aus der alten Karte wieder ergänzt. Die alte `jitsiRoom`/`jitsiTrigger`-Property auf `conference-room` wurde bewusst **nicht** übernommen – die LiveKit-Konfiguration für diese Area wird künftig direkt im WorkAdventure-Map-Editor im Browser gesetzt.

> ⚠️ Die Koordinaten wurden 1:1 aus der alten Karte übernommen (Annahme: Raumaufteilung unverändert). **Bitte in Tiled/im Map-Editor visuell prüfen**, ob `conference-room` und `pause-room` noch an der richtigen Stelle liegen – falls die Räume beim Jitsi-Umbau verschoben wurden, müssen die Areas entsprechend angepasst werden.
>
> **Für die Zukunft:** Falls die Karte erneut aus Tiled neu exportiert/umbenannt wird, prüfen, ob `floorLayer` **und** die beiden Areas `conference-room`/`pause-room` noch vorhanden sind, bevor hochgeladen wird – sonst reagiert der Pause-Button nicht mehr.

## 8. Aktueller Stand der Kartendateien (Jitsi → LiveKit Migration)

- Die alte, Jitsi-basierte `camedia.tmj` liegt jetzt archiviert unter `#archiv/camedia.tmj.bak`.
- Die in Tiled überarbeitete Version (vormals `camedia-lifekit.tmj`, Jitsi-Räume entfernt, LiveKit wird künftig direkt im WorkAdventure-Editor konfiguriert statt in Tiled) wurde zu `camedia.tmj` umbenannt und ist jetzt die aktive Kartenquelle.
- `conference.tmj` und `office.tmj` sind unveränderte Beispiel-Karten aus dem Starter-Kit und werden aktuell als "Nebenprodukt" mitgebaut (siehe Abschnitt 3) – falls das nicht gewünscht ist, müssten sie ebenfalls aus dem Projektroot entfernt bzw. umbenannt werden.

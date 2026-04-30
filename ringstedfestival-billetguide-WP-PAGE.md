# Ringsted Festival, billetguide — opsætningsguide til WordPress

Denne guide hjælper jer med at bygge billetguiden som en **selvstændig side** på ringstedfestival.dk med Kadence-temaet, så styling, fonts og farver matcher festivalens hjemmeside automatisk.

---

## Side-indstillinger

- **Titel:** Sådan håndterer du dine billetter
- **Slug:** `/billetguide/` eller `/saadan-haandterer-du-dine-billetter/`
- **Page Layout:** Standard (med festivalens hero, hvis I bruger en featured image til toppen)
- **Featured image:** Brug fx jeres "Årets kram"-billede som banner

---

## Sidens indhold, sektion for sektion

### 🎯 Intro (lige under sidens titel)

**Block:** Paragraph eller Kadence Advanced Text

```
En hjælp til alle, der køber, deler eller modtager billetter til Ringsted Festival. Guiden er delt i to dele: én hvis du har billetter, du vil sende eller administrere, og én hvis du har modtaget en billet fra en anden.
```

**Block:** Spacer (40px)

---

## 📤 DEL 1: Jeg har billetter, jeg vil sende eller administrere

**Block:** Kadence Advanced Heading (H2)
- Tekst: `Jeg har billetter`
- Styling: Standard (festivalens NexaRustSans)

**Block:** Spacer (24px)

---

### 1. Opret din profil først

**Block:** Kadence Advanced Heading (H3)
- Tekst: `1. Opret din profil først`

**Block:** Paragraph
```
Inden du kan administrere dine billetter, skal du have en profil i festival-appen. Det tager kun et øjeblik og bekræftes med MitID.
```

**Block:** Kadence Info Box (eller bare Heading + Paragraph)
- Titel: `Opret profil i appen`
- Beskrivelse:
```
Download festival-appen, opret din profil og bekræft med MitID. Du bruger kun MitID første gang, derefter åbner du appen med Face ID, fingeraftryk eller PIN.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=rLiCF5IL7A0&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Sådan opretter du din profil`

**Block:** Spacer (40px)

---

### 2. Indløs og importer billetter

**Block:** Kadence Advanced Heading (H3)
- Tekst: `2. Indløs og importer billetter`

**Block:** Paragraph
```
Når din profil er oprettet, skal billetterne indløses i appen. Der er flere måder at gøre det på.
```

#### 2a. Indløs fra billede ⭐ ANBEFALET

**Block:** Kadence Info Box (med "Anbefalet"-tag)
- Titel: `Indløs fra billede (anbefalet)`
- Beskrivelse:
```
Den nemmeste og hurtigste måde. Tag et screenshot af din billet eller gem PDF'en som billede. Vælg "Fra billede" i appen og vælg billedet fra dine Fotos. Appen scanner billedet og finder automatisk billetkoden.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=_trzUuKu3nQ&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Indløs billet fra billede`

#### 2b. Indløs flere billetter

**Block:** Kadence Info Box
- Titel: `Indløs flere billetter`
- Beskrivelse:
```
Har du købt flere billetter i samme ordre? Åbn den e-mail, du modtog, tryk på PDF-vedhæftningen, og brug delingsikonet (firkant med pil opad) til at dele filen til festival-appen. Alle billetkoder i PDF'en importeres automatisk på én gang, så du slipper for at indlæse hver billet enkeltvis.
```

#### 2c. Scan QR-kode

**Block:** Kadence Info Box
- Titel: `Scan QR-kode`
- Beskrivelse:
```
Har du printet din billet ud? Du kan scanne QR-koden direkte med kameraet. Vælg "Scan QR" og ret kameraet mod koden på den udprintede billet.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=2HqqOJQqeJw&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Scan QR-kode`

#### 2d. Importér fra fil (PDF)

**Block:** Kadence Info Box
- Titel: `Importér fra fil (PDF)`
- Beskrivelse:
```
Alternativ, hvis PDF'en allerede ligger på telefonen. Vælg "Fra fil" i appen, find filen og åbn den. Appen scanner PDF'en og finder alle billetkoder automatisk.
```

#### 2e. Indsæt fra udklipsholder

**Block:** Kadence Info Box
- Titel: `Indsæt fra udklipsholder`
- Beskrivelse:
```
Hvis du har kopieret en billetkode til udklipsholderen, kan du vælge "Indsæt fra udklipsholder". Appen finder automatisk billetkoden i den kopierede tekst.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=icj5xmh61jA&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Indløs via billetkode`

**Block:** Spacer (40px)

---

### 3. Videregiv billet til en anden person

**Block:** Kadence Advanced Heading (H3)
- Tekst: `3. Videregiv billet til en anden person`

**Block:** Paragraph
```
Du kan videregive hele din billet, eller udvalgte adgange, permanent til en anden person. Modtageren bliver den nye ejer og skal have appen med en MitID-verificeret profil.
```

**Block:** Kadence Info Box (advarsel/orange)
- Tekst:
```
Ved salg eller overdragelse: Billetprisen må ikke overstige den originale købspris. Ringsted Festival er ikke part i økonomiske aftaler mellem brugere. Begge parter skal have en gyldig, MitID-verificeret konto.
```

#### 3a. Videregiv hele din billet

**Block:** Kadence Info Box
- Titel: `Videregiv hele din billet`
- Beskrivelse:
```
Gå til "Dine billetter" og vælg "Videregiv billet". Alle adgange på billetten (fx alle dage på en partout, eller en campingbillet, som dækker hele festivalen) videregives samlet til modtageren. Indtast modtagerens navn og e-mail. Modtageren skal have en profil bekræftet med MitID og får en e-mail med et link til at acceptere videregivelsen.

Bemærk: Denne handling er permanent og kan ikke fortrydes. Hvis du ønsker billetten retur, skal modtageren videregive den tilbage til dig.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=mu4cNi4uWWY&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Send billet til én ven`

#### 3b. Videregiv enkelt adgang

**Block:** Kadence Info Box
- Titel: `Videregiv enkelt adgang`
- Beskrivelse:
```
Har du en billet med flere adgange, fx en partout (torsdag, fredag, lørdag) eller en glamcamp-billet med 2 eller 4 adgange? Du kan videregive udvalgte adgange enkeltvis til forskellige personer. Gå til "Dine billetter", vælg den specifikke adgang og tryk "Videregiv". Indtast modtagerens navn og e-mail.

Bemærk: En standard campingbillet dækker hele festivalens periode og kan ikke stykkes ud, den overdrages som helhed. Hver adgang videregives permanent. Modtageren skal have en profil bekræftet med MitID.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=EshLLKeDjRE&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Glamcamp-tildeling`

#### 3c. Videresend billetkode til flere

**Block:** Kadence Info Box
- Titel: `Videresend billetkode til flere`
- Beskrivelse:
```
Hvis du har importeret billetkoder, men ikke indløst dem alle, kan du videresende koderne til andre via telefonens delingsmenu. Modtagerne får et link hver og kan selv indløse billetten i deres egen app. Praktisk når du har flere billetter at dele ud til venner og familie.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=Um9FXCxKezo&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Send til flere venner`

**Block:** Spacer (40px)

---

### 4. Camping-billetter, sådan virker de

**Block:** Kadence Advanced Heading (H3)
- Tekst: `4. Camping-billetter, sådan virker de`

**Block:** Paragraph
```
Der er to typer campingbilletter med forskellige flows. Det er vigtigt at kende forskellen, så I alle kommer ind, hvor I skal.
```

#### 4a. Glamcamp (2 eller 4 adgange på én billet)

**Block:** Kadence Info Box (med orange accent)
- Titel: `Glamcamp (2 eller 4 adgange på én billet)`
- Beskrivelse:
```
En glamcamp-billet er én billet med 2 eller 4 adgange, der dækker både teltet/hytten og personerne i den.

Den første adgang aktiveres automatisk på din profil, når du aktiverer billetten (du er ordreholder).

De øvrige 1 eller 3 adgange skal du derefter videregive enkeltvis til de personer, der skal være med i din lejr eller glamcamp-enhed.

Hver modtager skal have egen profil med MitID for at kunne acceptere adgangen. Brug "Videregiv enkelt adgang" i appen, samme flow som for partout-adgange (se sektion 3 ovenfor).
```

#### 4b. Almindelig campingbillet

**Block:** Kadence Info Box
- Titel: `Almindelig campingbillet`
- Beskrivelse:
```
En almindelig campingbillet (til de øvrige campingområder) er kun en plads-billet, den giver dig ret til at sætte din campingvogn, telt eller anden enhed op på området.

Campingbilletten giver ikke i sig selv adgang til selve festivalen. Hver person, der skal opholde sig på campingområdet eller komme ind på festivalen, skal have en gyldig festivalbillet ud over campingbilletten.

Standard campingbilletter dækker hele festivalens periode og kan ikke stykkes ud, de overdrages som helhed.
```

**Block:** Spacer (40px)

---

### 5. Giv adgang til et barn eller en ledsager

**Block:** Kadence Advanced Heading (H3)
- Tekst: `5. Giv adgang til et barn eller en ledsager`

**Block:** Paragraph
```
Du kan give adgang til børn under 13 eller ledsagere uden, at de behøver egen telefon, app eller profil. Adgangen forbliver på din profil, og du er ansvarlig for personen ved ind- og udgang.
```

#### 4a. Giv adgang til et barn

**Block:** Kadence Info Box
- Titel: `Giv adgang til et barn (under 13)`
- Beskrivelse:
```
Gå til "Dine billetter", vælg en adgang og tryk "Tilknyt barn". Indtast barnets navn og alder. Barnet behøver ikke egen telefon, app eller profil og skal være sammen med dig, når I skal ind og ud af festivalpladsen.

Tip: Du kan købe et chip-armbånd i webshoppen (afhentes ved Service Desk) eller ved indgangen, når du ankommer. Armbåndet knyttes til din profil, og barnet kan bære det som adgang og handle på din Beats-konto, praktisk hvis barnet vil rundt på egen hånd inden for festivalpladsen. Du kan have flere armbånd tilknyttet din profil og kan sætte et maks-forbrug per armbånd.

MitID kan først udstedes fra 13 år, derfor er børn under 13 altid på en voksens billet.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=MF58g1Mb04U&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Tildel billet til barn`

#### 4b. Giv adgang til en ledsager

**Block:** Kadence Info Box
- Titel: `Giv adgang til en ledsager`
- Beskrivelse:
```
Samme flow som for et barn, blot med "Tilknyt ledsager". Gå til "Dine billetter", vælg en adgang og tryk "Tilknyt ledsager". Indtast ledsagerens navn. Ledsageren behøver hverken egen telefon, app eller profil, og I skal være sammen ved ind- og udgang af festivalpladsen.

Brug videoen ovenfor som reference, princippet er det samme.
```

**Block:** Spacer (40px)

---

### 6. Administrer dine billetter

**Block:** Kadence Advanced Heading (H3)
- Tekst: `6. Administrer dine billetter`

**Block:** Kadence Info Box
- Titel: `Gensend invitation, hvis modtageren ikke når at acceptere`
- Beskrivelse:
```
Invitationslinks udløber efter 72 timer, men kan gensendes. Gå til "Dine billetter", find den udløbede videregivelse og tryk "Gensend". Det gamle link bliver ugyldigt, og et nyt 72-timers link sendes til samme e-mail. Du kan gensende så mange gange, det er nødvendigt.
```

**Block:** Spacer (60px)

---

### 6. Hurtigoversigt for afsender

**Block:** Kadence Advanced Heading (H3)
- Tekst: `Hurtigoversigt`

**Block:** Table (Kadence eller standard)

| Funktion | Modtager kræver | Permanent? |
|---|---|---|
| Indløs billet | Kun dig selv | — |
| Videregiv hele billet | App + MitID-verificeret profil | Ja, modtager skal sende retur |
| Videregiv enkelt adgang | App + MitID-verificeret profil | Ja, modtager skal sende retur |
| Videresend billetkode | App + profil | Ja, når indløst |
| Tilknyt barn (under 13) | Ingenting | Nej, kan ændres |
| Tilknyt ledsager | Ingenting | Nej, kan ændres |
| Gensend invitation | — | — |

**Block:** Separator (visuel skillelinje)

---

## 📥 DEL 2: Jeg modtager en billet

**Block:** Kadence Advanced Heading (H2)
- Tekst: `Jeg modtager en billet`

**Block:** Spacer (24px)

---

### 1. Du har modtaget en billet via e-mail

**Block:** Paragraph
```
Nogen har videregivet en billet eller en adgang til dig. Du skal acceptere videregivelsen i appen.
```

**Block:** Kadence Info Box (advarsel/orange)
```
Ved køb fra privatperson: Sørg for, at prisen ikke overstiger den originale billetpris. Ringsted Festival er ikke part i økonomiske aftaler mellem brugere. Begge parter skal have en gyldig, MitID-verificeret konto.
```

#### 1a. Acceptér en videregivet billet

**Block:** Kadence Info Box
- Titel: `Acceptér en videregivet billet`
- Beskrivelse:
```
Du modtager en e-mail med et link til at hente din billet. Tryk på linket, det åbner festival-appen, hvor du kan se billetdetaljerne. Vælg "Acceptér" for at modtage billetten, eller "Afvis", hvis du ikke ønsker den. Når du accepterer, er billetten din.

Linket er gyldigt i 72 timer. Hvis det udløber, kan afsenderen gensende det til dig. Du skal have en MitID-verificeret profil i appen.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=X4JJTtoQxNo&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Accepter billetanmodning`

#### 1b. Har du fået tilsendt en billetkode?

**Block:** Kadence Info Box
- Titel: `Har du fået tilsendt en billetkode?`
- Beskrivelse:
```
Har du fået tilsendt en billetkode fra en ven eller kollega? Åbn festival-appen, vælg "Indløs billetter" og indtast koden manuelt. Har du modtaget et link sammen med koden, kan du trykke på linket for at indløse automatisk.
```

**Block:** YouTube embed
- URL: `https://www.youtube.com/watch?v=icj5xmh61jA&list=PLe3LoO_gw0GPT6XJkMgEanKI0P8sL1PpD`
- Caption: `Se video: Billetkode`

**Block:** Spacer (40px)

---

### 2. Dit barn eller din ledsager har fået adgang

**Block:** Kadence Advanced Heading (H3)
- Tekst: `Dit barn eller din ledsager har fået adgang`

**Block:** Kadence Info Box
- Titel: `Barn under 13 eller ledsager`
- Beskrivelse:
```
Hvis du er tilknyttet en billet som barn eller ledsager, behøver du ikke gøre noget i appen. Du følges bare ind og ud af pladsen sammen med den ansvarlige person.

Børn under 13 og ledsagere behøver hverken telefon, app eller profil. Du følges ind og ud af pladsen sammen med den voksne, der har tilknyttet dig, og det er den voksne, der fremviser sin app ved scanneren.

Tip: Du kan få et chip-armbånd til selv at gå ind og ud og handle ved barerne. Armbåndet købes i webshoppen (afhentes ved Service Desk) eller direkte ved indgangen, og det kobles til den ansvarliges profil. Den ansvarlige kan sætte et maks-forbrug på armbåndet, hvis det ønskes.

MitID kan først udstedes fra 13 år, derfor er børn under 13 altid på en voksens billet.
```

**Block:** Spacer (40px)

---

### 3. Hurtigoversigt for modtager

**Block:** Kadence Advanced Heading (H3)
- Tekst: `Hurtigoversigt`

**Block:** Table

| Scenarie | Hvad kræves af dig? | Handling |
|---|---|---|
| Billet videregivet (e-mail-link) | App + MitID-verificeret profil | Acceptér eller afvis i appen |
| Billetkode (SMS/Messenger) | App + profil | Tryk link eller indtast koden |
| Barn under 13 / Ledsager | Ingenting | Følg med den ansvarlige person |

**Block:** Separator

---

## ⚖️ Vilkår for videregivelse af billetter mellem brugere

**Block:** Kadence Advanced Heading (H2)
- Tekst: `Vilkår for videregivelse af billetter`

**Block:** Paragraph (mindre tekst, italic eller dim color)
```
Gældende for alle videregivelser og overdragelser af billetter og adgange til Ringsted Festival.
```

**Block:** Group/Container med 7 paragraphs (én per punkt):

**1. Platformens rolle**
```
Livecloud ApS ("Livecloud") og Ringsted Festival ("Arrangøren") stiller en digital platform til rådighed, som gør det muligt for brugere at videregive billetter og adgange til andre brugere. Livecloud og Arrangøren er ikke part i nogen økonomisk transaktion mellem brugere og påtager sig intet ansvar for aftaler, betalinger eller tvister, der måtte opstå i forbindelse med videregivelse af billetter. Det understreges, at eventuel betaling mellem parterne ikke kan ske via app'en, det må parterne aftale særskilt.
```

**2. Prisbegrænsning ved videresalg**
```
Ved salg eller overdragelse af en billet til en anden person må salgsprisen ikke overstige den originale købspris inklusive gebyrer. Overtrædelse af denne bestemmelse kan medføre annullering af billetten uden kompensation. Det er afsenderens og modtagerens ansvar at sikre, at prisen overholder denne begrænsning.
```

**3. Køb sikkert gennem app'en**
```
Det frarådes at købe billetter udstedt som PDF. Billetter bør alene købes gennem overførsel via arrangørens app, der sikrer, at både afsender og modtager er MitID-verificerede, og at billetten ikke kan være solgt til flere.
```

**4. Identitetsverificering**
```
Både afsender og modtager skal have en gyldig konto i systemet, verificeret med MitID (dansk digital identitet). Verifikationen sikrer, at begge parter kan identificeres, og at billetten knyttes til en verificeret person. Livecloud forbeholder sig retten til at afvise videregivelser, hvor en eller begge parter ikke er behørigt verificeret.
```

**5. Permanent videregivelse**
```
Videregivelse af en billet er permanent. Når modtageren har accepteret videregivelsen, er billetten modtagerens ejendom. Ønsker afsenderen billetten retur, skal modtageren selv foretage en ny videregivelse. Livecloud og Arrangøren kan ikke formidle eller gennemtvinge returnering af en videregivet billet.
```

**6. Ansvarsfraskrivelse**
```
Livecloud og Arrangøren er ikke ansvarlige for: (a) tab som følge af videregivelser mellem brugere, (b) manglende betaling mellem afsender og modtager, (c) tvister vedrørende pris, kvalitet eller vilkår aftalt mellem brugere, (d) tekniske problemer, der forhindrer rettidig accept af en videregivelse. Det er brugerens eget ansvar at sikre, at videregivelsen sker til den rette person.
```

**7. Børn og ledsagere**
```
Tilknytning af børn under 13 år og ledsagere er ikke en videregivelse, adgangen forbliver på den ansvarlige persons profil. Den ansvarlige person bærer det fulde ansvar for tilknyttede personer, herunder adgang til og adfærd på festivalområdet. Chip-armbånd kan købes i webshoppen (afhentes ved Service Desk) eller ved indgangen og knyttes til den ansvarlige persons profil. Man kan have flere armbånd tilknyttet sin profil, og der kan sættes et maks-forbrug per armbånd. Armbåndet er ikke adgangsgivende i sig selv, det virker kun, når det er knyttet til en profil med en gyldig adgang. Armbåndet er personens ansvar, og eventuelle køb foretaget med armbåndet debiteres personens Beats-konto.
```

**8. Misbrug**
```
Livecloud forbeholder sig retten til at spærre konti, annullere billetter og nægte adgang ved mistanke om misbrug, herunder men ikke begrænset til: systematisk videresalg over købspris, forsøg på videregivelse med uverificerede konti, eller anden brug, der strider mod disse vilkår eller Arrangørens betingelser.
```

**Block:** Paragraph (mindre tekst, italic)
```
Sidst opdateret: april 2026. Disse vilkår kan ændres. Den til enhver tid gældende version er tilgængelig på Ringsted Festivals hjemmeside.
```

---

## 📞 Kontakt

**Block:** Kadence Info Box eller Paragraph (centreret)
```
Spørgsmål? Skriv til kontor@ringstedfestival.dk
```

---

## 📋 Anbefalinger til Kadence-blokke

For at det ser ensartet og festival-agtigt ud, brug disse Kadence-blokke konsekvent:

| Indholdstype | Anbefalet Kadence-blok |
|---|---|
| Sektion-overskrift (h2) | **Advanced Heading**, NexaRustSans, rød (festival accent) |
| Underoverskrift (h3) | **Advanced Heading**, NexaRustSans, hvid eller dark text |
| Brødtekst | **Paragraph** med Raleway, standard farve |
| Card med titel + beskrivelse | **Info Box** (med festivalens accent-farve som border eller baggrund) |
| Video | **YouTube Embed** (Gutenberg's egen) |
| Skillelinjer mellem dele | **Separator** (med festival-rød som farve) |
| Anbefalet/highlight | **Info Box** med "Anbefalet"-badge eller orange/rød accent |
| Hurtigoversigt | **Table** (eller Kadence Pricing Table for visuel pop) |

### Tips
- **Brug accordions** (Kadence Accordion-blok) til vilkår-sektionen, så de fylder mindre når de er lukkede
- **Tag-style "Anbefalet"** kan laves som en lille Info Box med rød baggrund eller en custom HTML span
- **Sticky table of contents** (Kadence Table of Contents) i sidebaren kan hjælpe brugeren navigere
- **Featured image i hero** med et af festivalens egne billeder giver det rigtige look uden ekstra arbejde

---

## ✅ Tjekliste når siden er bygget

- [ ] Alle 9 videoer er linket via YouTube-blokke
- [ ] Sammenligningstabeller har visuel ensartethed (samme stil i begge)
- [ ] Vilkår-sektionen er sat op (evt. som accordion for at spare plads)
- [ ] Anchor-links / table of contents fungerer (så folk kan springe til relevante sektioner)
- [ ] Mobile preview ser fornuftig ud (Kadence skulle håndtere det automatisk)
- [ ] Featured image er sat (hvis ønsket)
- [ ] Side er linket fra hovedmenu eller fra "Praktisk info" / "FAQ"-side

---

Hvis I vil have nogle af disse afsnit som klar HTML der kan limes ind direkte, eller skal jeg lave det som en Kadence-template-fil (.json) der kan importeres direkte i WordPress, sig bare til.

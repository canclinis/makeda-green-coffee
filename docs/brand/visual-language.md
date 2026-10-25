# Makeda brand language

This file is the whole brand. Color, type, logo, photography, layout, and the Italian profile text are all here. Nothing else in the repo is a brand source. The live site stays in British English until the user asks to sync copy.

## Color

Chrome uses four flat colors. Photography is the only place other hues appear.

| Name     | Hex       | Where it goes                             | Type on it   |
| -------- | --------- | ----------------------------------------- | ------------ |
| Burgundy | `#5c1022` | Page section frame, logo plate, CTA bands | White        |
| Black    | `#000000` | Section title bars, legal footer          | White        |
| White    | `#ffffff` | Body fields, cover title half             | Ink or black |
| Ink      | `#111111` | Body copy                                 | —            |

Cherry red, leaf green, skin, and earth stay inside photographs. They are not UI colors.

## Type

One family: Montserrat (weights 400, 600, 700), or a geometric sans of the same kind. Helvetica Neue and Arial are the fallbacks.

- **Section title.** Uppercase, bold, wide tracking, white, centered in a black bar.
- **Cover title.** Uppercase, bold, wide tracking, black, centered in the white half. Two lines: COMPANY / PROFILE.
- **Body.** Regular, sentence case, left aligned, ink on white. Plain paragraphs. A blank line between them.
- **Legal line.** Uppercase, small, white, centered, tight leading.
- **Wordmark.** “Makeda” in bold title case. “GREEN COFFEE” under it, smaller, uppercase, tracked.

## Logo

White mark on a burgundy plate.

The symbol is one solid white silhouette: the shape of Africa, and inside it a woman in profile facing right. She wears a striped headwrap and a round earring, and holds a small cup with a wisp of steam. Flat shape, no line drawing.

The wordmark sits centered under the symbol, white: Makeda, then GREEN COFFEE.

Site assets in `static/images/`: full lockups `logo-hero.png` (burgundy, horizontal) and `logo-footer.png` (white, vertical); symbol only `logo-symbol-burgundy.jpg` (source: Drive `Logo Instagram3.jpg`, burgundy mark on white, no wordmark).

On the cover the plate is a tall block in the top-right. Its bottom edge drops a little below the white block beside it and overlaps the photograph. On the site the same mark is small: burgundy logo in the white nav, and again in the footer.

The cover also has a separate black coffee-bean glyph, vertical, with the center crease, centered under COMPANY PROFILE. That glyph is cover-only. It is not the logo.

## Photography

Documentary and close. Natural light. No caption, no type on the picture, no added props.

- **Cover.** Black-and-white macro of a pile of coffee cherries. High contrast. A dried leaf among the fruit. The photo fills everything below the top band.
- **Who we are.** Color. Cherries still on the branch: ripe red and unripe green together, leaves, daylight.
- **Mission.** Color. A farmer working in the bushes. Headwrap, woven basket on the back, hands in the foliage, eyes on the cherries. A person at work.
- **Contact.** Color. The same cherry pile as the cover.

The photo is a full-width band, edge to edge inside the frame.

## Page section

Interior pages share one stack, top to bottom. A thick burgundy frame runs down the left, the right, and across the top. The black legal bar closes the bottom. The frame is a real margin, not a hairline.

1. **Photo band.** About the top third. Full width inside the frame.
2. **Black title bar.** Full width. Tall enough that the title has clear space above and below.
3. **White body.** The rest of the section. Text inset from the frame, left aligned, a comfortable measure. A short page keeps the empty white. Type does not stretch to fill it.
4. **Legal bar.** Black, five centered lines:

```
MAKEDA GREEN COFFEE AB
BROBY ÄNGSVÄG 11, 153 92 HÖLÖ, SWEDEN
ORG NO. 5594367913
VAT NO. SE559436791301
F-SKATT APPROVED
```

## Cover

No title bar, no body copy, no legal line.

The top band is split in half:

- **Left, white.** COMPANY over PROFILE, black caps, widely tracked, centered in that half. The bean glyph centered beneath.
- **Right, burgundy.** The logo plate, overlapping the photo along its bottom edge.

Under the band: the black-and-white cherry photograph, full width.

## Interior pages

### Chi siamo

Title: CHI SIAMO.

Four paragraphs of plain prose: the project, Antonio, Giovanni, Giacomo. No founder photos, no timeline, no cards.

### La nostra missione

Title: LA NOSTRA MISSIONE.

One lead sentence, then four items. Each item is a dash at the left margin and a sentence. Space between items, as separate blocks, not a tight list. The first item starts with a capital. The next three start lowercase. Every item ends with a semicolon except the last, which ends with a full stop. The items share one grammatical form (on the site, each opens with an -ing verb: importing, bringing, improving, following).

### Contatti

Title: CONTATTI.

One column of rows in the white field, with room around the stack. A simple black line icon on the left, text on the right, space between rows.

| Icon      | Text                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| Telephone | +46 70 874 96 26 (SWEDEN), then +39 349 76 46 077 (ITALIA), stacked beside the one icon |
| Envelope  | info@makedagreencoffee.com                                                              |
| Globe     | www.makedagreencoffee.com, underlined                                                   |
| Instagram | makedagreencoffee, underlined                                                           |
| Vimeo     | Makeda Green Coffee, underlined                                                         |

## Website

The site uses the same materials. It is not a framed printout of the sheet.

| Surface             | Treatment                                                                             |
| ------------------- | ------------------------------------------------------------------------------------- |
| Sticky nav          | White strip, burgundy logo, uppercase Montserrat links                                |
| Hero                | Full-bleed video, picture to the viewport edges                                       |
| Order / contact CTA | Burgundy band, white uppercase type, white button                                     |
| Project / Coffee    | White body; section labels use the black title bar                                    |
| Mission / About     | Black title bar, then a single white column                                           |
| Footer              | Black strip, burgundy top edge. Logo, site links, contact, company details, copyright |
| Contact             | The form is high contrast, on a dark field or a white field inside the frame          |

New sections follow photo, black title, white body, black footer unless the user asks otherwise.

Motion stays quiet. A section arrives as type on a flat field.

Keep these out of the chrome: orange and yellow highlights, gradient-filled words, Darwin Pro or Playfair, a staggered zigzag of mission points, a black letterbox around the hero video.

## Voice

Taken from the homepage. New sentences should sound like those.

We speak as the company, to one person. Warm, plain, and direct. A short sentence carries the feeling. The next one carries the fact.

Name the place, the people, and the coffee. Kivu, the farmers, the roasteries, Resistance Coffee. Use a plain word when it will do.

Body copy is sentence case. Uppercase is for section titles and the legal line.

An exclamation is rare. The homepage uses one: ‘We’re a Swedish company with an Italian soul!’

One thought per sentence. Join two clauses with a full stop, not a comma. Lists keep the same grammatical shape all the way through.

Button and dialog labels are sentence case: Order now, Get in touch, Discover our coffees. CSS may set them in capitals; the source text stays sentence case.

### British English

The site is written in British English (`<html lang="en-GB">`).

- **Spelling.** -ise and -isation (organisation, prioritise), -our (colour, favour), -re (metres, centre), programme, enquiry, hand-pick, travelled.
- **Trade terms stay as the trade writes them.** _Specialty coffee_ follows SCA usage, also in the UK. Green coffee, washing station, screen size, raised beds.
- **Punctuation.** Curly apostrophes (’) and single curly quotes (‘ ’), double quotes (“ ”) only inside a quote. No serial comma: ‘sustainability, transparency and fair trade’. The full stop goes outside the closing quote unless the quote is a full sentence.
- **Titles of films and documents** in italics: _Amuka_.
- **Places.** First mention in prose: the Democratic Republic of the Congo. After that, or in a list: the DR Congo, or the Congo. Kivu, Lake Kivu, South-East Asia.
- **Numbers.** Comma for thousands (1,850). A space before units (60 kg, 1,850 m). En dash for ranges (1,850–2,050 m).
- **Status words.** In stock, Arriving soon. Count nouns agree with the number: 1 bag, 42 bags.

A prefilled mail subject is the first line of that letter. It says what the person wants, and which button they used, so the inbox can tell the messages apart.

| Where they start                           | Subject                   |
| ------------------------------------------ | ------------------------- |
| Order now, on the homepage                 | I’d like to order coffee  |
| Email icon or the form on the contact page | I’d like to get in touch  |
| Order on a coffee lot                      | Enquiry: {coffee}, {year} |

The homepage lines this follows:

- Bring home a unique coffee, a symbol of strength and courage.
- We are not intermediaries. We follow every stage, from the field to delivery.
- We don’t just trade coffee. We build relationships.

## Profile text

Italian profile text, kept here for comparison with the live English site. Published English stays as it is until the user asks to sync. When the two differ, say so in the reply.

### Chi siamo

Makeda Green Coffee nasce nel 2021 come progetto che mette al centro la sostenibilità e il commercio equo-solidale. L'obbiettivo principale è quello di promuovere il caffè, collaborando direttamente con cooperative, nelle torrefazioni d'Europa. I due soci fondatori, Giovanni e Antonio, sono amici fraterni, che da più di 15 anni si impegnano in ONG e progetti sui diritti umani.

Antonio è un regista, ha diretto molti documentari da zone di guerra: Afghanistan, Libia, Iraq, R.D.Congo. Durante le riprese del suo ultimo film in R.D. Congo (“Amuka”), Antonio ha incontrato una cooperativa di contadini del caffè nel Kivu. Nonostante le enormi difficoltà dettate dalla guerra la produzione del caffè è ripartita e molti contadini producono un caffè di alta qualità.

Giovanni lavora da molti anni per ONG in Italia, Messico, Sud-Est asiatico e Svezia in molti progetti sui diritti umani, sostenibilità e agricoltura biologica. Si è innamorato della storia e della passione dei contadini del Kivu.

Nel 2022 si è unito Giacomo che ha lavorato per decenni nell’industria cinematografica, sviluppando competenze in ambito manageriale e commerciale. È un grande appassionato di caffè.

### La nostra missione

Makeda Green Coffee ha i seguenti obbiettivi principali:

- Importare il miglior caffè dalle cooperative locali per sostenere l'economia della zona;
- favorire la commercializzazione di caffè verde da parte di torrefattori europei interessati a un prodotto di qualità che offra vantaggi e prezzi equi per i piccoli e medi produttori diretti;
- promuovere la qualità della coltivazione e della lavorazione del caffè nelle cooperative reinvestendo parte dei profitti dell'azienda in attrezzature, formazione e supporto logistico;
- seguire direttamente tutte le fasi dal campo fino alla porta delle torrefazioni. Lavoriamo direttamente con l'agronomo della cooperativa senza ricorrere ad alcun intermediario;

### Contatti

+46 70 874 96 26 (SWEDEN)

+39 349 76 46 077 (ITALIA)

info@makedagreencoffee.com

www.makedagreencoffee.com

makedagreencoffee

Makeda Green Coffee

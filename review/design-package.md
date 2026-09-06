# Nexora Homes — Design Package

Tier 1, single journey. Written before generation. Every line of copy here ships verbatim.

## 0. What the supplied assets established

The brand is **Nexora Homes**. Tagline on the logo: "Ultra luxury needs future technology."
Mark: a gold N built from two roofline strokes, a wifi arc above it, a four-pane window below.
Contact: 03234508739, DHA Phase 6, @nexorahomes on Instagram, Facebook and TikTok.

Product line, from the photos: a 4 inch HD touch control panel with Alexa and a gold dynamic
clock face, a wide multi-zone control panel with a thermostat dial, a smart door lock with
camera, keypad and fingerprint ring, 4 gang soft-touch glass switches in white, grey and black,
and a dimmer knob panel.

Service model: supply and install. Call to action: WhatsApp.

**Correction made before any generation.** An earlier draft of this package was built on a
"runs locally, no cloud, no subscription" premise. The supplied photos show Alexa-connected
panels, so that claim would have been false on their own site. It is removed. The premise below
is built on what the products actually are.

## 1. The brand premise

One idea: **the wall**. Every product Nexora sells replaces something ugly on a wall with black
glass. The plastic switch, the keyhole, the thermostat, the remote. One material, one language,
through the whole house. The site teaches that and sells the finished room, not the box.

The premise line: **the switch is the last ugly thing in a beautiful room.**

**Design direction: black glass and gold.** Both are sampled from the brand's own materials
rather than reached for. The logo is a gold mark on black. The products are black glass. The
4 inch panel's own clock face is gold. The canvas is a warm near-black, the tone of glass in a
dark room, never pure black. Gold appears only on the call to action, focus states, the
travelling head of the signature line, and two moments of emphasis.

**The signature element: the line.** Nexora's mark is built from angular strokes. One continuous
gold hairline made of those same strokes runs the length of the page like conduit inside a wall,
turning at 45 and 90 degrees only, never curving. It draws itself as the visitor scrolls, branches
into each section as it arrives, and carries a bright head at its tip. The film shows light
travelling through a house; the line is the page doing the same thing with the brand's own
geometry. The boldness budget is spent here and almost nowhere else. Remove it and the page loses
its spine.

## 2. The palette as CSS tokens

Finalized against the approved footage after the video gate.

```css
:root{
  --canvas:#0b0a09;         /* warm near-black: black glass in an unlit room */
  --canvas-2:#100e0c;       /* the raised ground under alternating sections */
  --panel:#17140f;          /* cards and raised surfaces */
  --line:#2a251c;           /* structural hairlines */
  --line-strong:#4a4133;    /* interactive borders, contrast checked */
  --accent:#e8c766;         /* the logo's gold: CTA and rare emphasis */
  --accent-hover:#f5e0a0;
  --accent-muted:#6b5a33;   /* whisper level: borders, glows, particles */
  --accent-core:#fff6dd;    /* the hottest point of the travelling head */
  --text-primary:#f4f1ea;
  --text-secondary:#a8a094;
}
```

## 3. The type trio

- **Display: Sora**, 600 and 700. Geometric, confident at very large sizes, future-facing
  without being a costume. Not Space Grotesk, which is the habitual reach here.
- **Body: Manrope**, 400 and 500. Quiet and round, excellent small.
- **Mono: JetBrains Mono**, 400 and 500. Kickers, spec readouts, small labels.

Never Inter, never Roboto.

## 4. The band map

Hero height 400vh. Ranges are starting points, validated by the flick test.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.15 | Close on the 4 inch panel waking on a dark wall | "This runs the whole house." | Blur-to-sharp. Focus arrives as the screen does. |
| 2 | 0.19 to 0.36 | Camera pulls back and drifts, the first room lights | "Lights, locks, curtains, air." | Grid snap-align. Four words land in order, the way four zones come on. |
| 3 | 0.40 to 0.58 | Light travelling room to room down the house | "Every room, one language." | Drift-down. Words fall with the camera. |
| 4 | 0.62 to 0.78 | The house nearly full, camera easing to rest | "No switches. No clutter. No remotes." | Word-punch with overshoot. Three lights landing, three words punching. A deliberate staccato device. |
| 5 | 0.82 to 1.00 | Wide, the living room alive at night, the panel a small gold point on the far wall | Headline: "Ultra luxury needs future technology." Subline: "Nexora Homes fits smart panels, locks and switches into homes across DHA. We supply it, we install it, and we set it up before we leave." CTA: "WhatsApp us" | Word-by-word rise into a staged settle. Headline, then subline, then the CTA row. |

The settle headline is the brand's own tagline, taken from the logo. Band 1 opens settled via the
one-time load ramp. Band 5 skips the ease-out.

## 5. The static-hero copy block

For phones and reduced motion, composed over the ending frame:

- Headline: "Ultra luxury needs future technology."
- Subline: "Smart panels, locks and switches, supplied and installed across DHA."
- CTA: "WhatsApp us"

## 6. The below-fold outline

Every section funnels to the WhatsApp action at `#talk`.

**Nav.** The Nexora Homes mark, redrawn as clean SVG. Links: Range, How it works, Questions.
Button: "WhatsApp us".

**S1 — The problem.** Kicker: `THE LAST UGLY THING`. Headline: "Your house is beautiful. Your
switches are not." Body: "You spent two years on the marble, the joinery and the light fittings.
Then a builder screwed a plastic rocker switch onto every wall at shoulder height, and a
thermostat next to it, and a keyhole in the door. Five remotes in a drawer. Nothing matches
anything." Pull quote: "Three different apps to turn on the lights."

**S2 — The range.** Kicker: `WHAT GOES ON THE WALL`. Headline: "One material, through the whole
house." Four product cards, each using the real supplied photo, crisp and untouched:
- "Control panels" / "A 4 inch or wide HD touch screen that runs scenes, lights, climate and
  cameras from one place on the wall. Works with Alexa."
- "Touch switches" / "Glass gang switches in white, grey or black. They replace the rocker switch
  and keep the same back box."
- "Smart locks" / "Camera, keypad, fingerprint and app. Your door stops needing a key."
- "Dimmers and knobs" / "A single glass dial for fan speed and light level, where a plastic
  regulator used to be."

**S3 — How it works.** Kicker: `THREE STEPS`. Headline: "We come, we fit, we set it up."
Three steps, each with its own generated still, all three treated identically:
1. "We visit your home." / "Free, and usually an hour. We look at your wiring, your rooms and
   what you actually want to control."
2. "We fit the glass." / "Most switches go into the back box that is already in your wall. No
   rewiring, no chasing walls, no dust."
3. "We set it up before we leave." / "Scenes named, rooms grouped, phones paired, everyone in
   the house shown how it works."

**S4 — The interactive moment.** Kicker: `TRY IT`. Headline: "Hold it, and watch the house wake."
A press-and-hold control labelled "Hold to turn the house on." As the visitor holds, a drawn wall
elevation lights room by room in the same order the film does, and the glass panels along it come
up one at a time. Completing it reveals three lines in sequence: "Every light, one press." /
"Every room, one screen." / "Every guest, no instructions." Releasing early eases the progress
back down rather than snapping it to zero. Reduced motion gets the finished state with no hold.
The visitor performs the brand's one idea: one touch, the whole house.

**S5 — Why Nexora.** Kicker: `WHY US`. Headline: "The part most people get wrong is the fitting."
Three reasons: "We fit it ourselves." / "Our own team, not a subcontractor who has seen the
product once." Then "We work around your build." / "Whether the walls are open or the house has
been finished for ten years." Then "We stay after." / "Something stops behaving, you message us
on the same number you booked on."

**S6 — Questions (FAQ).** The real objections:
- "Do I have to rewire my house?" / "Almost never. The glass switches fit the back box already in
  your wall. Panels need a neutral wire, and we check for that on the visit before you commit to
  anything."
- "What happens when the internet drops?" / "Touch still works. The switches and panels control
  the lights on your wall wiring, so the room behaves normally. What you lose until the
  connection returns is control from outside the house and voice."
- "Can my parents and my guests use it?" / "Yes. The glass switches work like switches. You press
  where the light is drawn and the light comes on. Nobody has to open an app to sit down in a
  room."
- "How long does the fitting take?" / "A few rooms is a day. A full house is usually two to four,
  and we work around you rather than shutting the house down."
- "What does it cost?" / "It depends on how many points and which panels, so we quote after the
  visit rather than guessing. The visit is free and there is no obligation."
- "Do you work outside DHA?" / "Yes. Message us with where the house is and we will tell you
  straight away."

**S7 — The call to action.** Kicker: `NEXT STEP`. Headline: "Send us a photo of your wall."
Subline: "That is genuinely all we need to start. Message us on WhatsApp and we will tell you what
is possible in that room." Primary: "WhatsApp 0323 450 8739" linking to wa.me. Secondary, the
form: labels "Name", "Your area", "What you want to control". Button: "Send". Success state:
"Got it. We will message you back today."

**Form handling:** the form posts nowhere on a static site, so it shows a JS-only success state
and the copy never promises an inbox. The primary action is the WhatsApp link, which genuinely
reaches the business. This is stated to the user plainly before build.

**Footer.** The mark, the premise line, nav repeat, DHA Phase 6, the phone number, and the three
social links. No fictional-brand disclosure: this is a real business.

## 7. The vector layer plan

- **The line.** One hand-drawn SVG path down the page spine built only from horizontal, vertical
  and 45 degree strokes, echoing the logo's geometry. Stroke-dashoffset driven by scroll,
  delta-gated. A gold head element rides the tip. Reduced motion shows it fully drawn.
- **Section sigils.** A small hand-drawn mark per section, cut from the same stroke geometry,
  drawn on entrance.
- **Particles.** Whisper-level dust in the warm light, six to nine per section, 18 to 30 second
  drifts with negative delays. Paused off-screen and on hidden tabs.
- **Background environment.** One fixed layer: a slow warm radial drift at 90 seconds plus fine
  grain, so the page reads as one room.

## 8. The engineering list

The streamed Blob fetch with the loading ring and 20 second watchdog, the dt-normalized lerp in a
rAF loop that rests, gated seeks with the error-path deadlock escape, delta-gated DOM writes, band
pacing validated by the flick test, the four-layer legibility system with the worst-frame audit at
3.5:1 or better, the five static-hero gates matched character for character in CSS and JS and kept
live with change listeners, complete-without-video, reduced motion honored live in both directions,
and the whole quality floor.

## 9. The copy gate

Every viewer-facing line above ships verbatim. The built page must pass the grep gate before anyone
sees it: zero em dashes, zero stock words, plus the body-copy sweep for AI tells. The staccato
triplet in band 4 and the three-line reveal in S4 are deliberate brand devices chosen here on
purpose. They stay.

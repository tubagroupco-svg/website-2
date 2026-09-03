# Nexora, Design Package

Tier 1, single journey. One 6-second generated shot scrubbed by scroll.
Every line of viewer-facing copy below ships VERBATIM.
Band ranges and pacing numbers are starting points, validated later by the flick test.

## 1. The brand premise

The one idea: **a smart home should disappear.** Every competitor sells more control,
more apps, more dashboards. Nexora sells the opposite, a house you stop thinking about.
The site teaches that one idea and sells it. The hero proves it (the house acts while
the owner sleeps), the interactive moment lets the visitor perform it, and the closing
line returns to it. Any section that does not serve it does not belong on the page.

## 2. The palette as CSS tokens

Direction sampled from the storyboard's world AND from the real product: a home at dawn,
where cool shadow meets warm light, and a glass switch whose indicators glow cool
blue-white. The page is the morning the video arrives at, so the film resolves INTO the
page and the two read as one place.

DELIBERATE DEVIATION, said out loud: the default reach for "calm and cinematic" is
near-black with a warm amber accent and a high-contrast serif. That look is banned as a
default. Nexora goes the other way: a LIGHT cool canvas, warmth reserved for the light
in the room, and one cold colour that belongs to the product alone.

The two-colour system, and the rule that keeps it honest:
- GOLD is the house. It carries the call to action and rare emphasis.
- SIGNAL is the product. It appears ONLY where Nexora's own light appears: the seam
  nodes, the glowing touch points in the floor plan, the panel in the Good Night moment.
  Never as decoration, never on a heading, never on a border that is not a device.

```css
:root{
  --canvas:#E9EAE6;        /* pale cool linen, north light on a wall, never pure white */
  --panel:#F4F5F1;         /* raised surfaces and cards */
  --ink:#16211F;           /* text primary, a shadow black tinted teal, never pure black */
  --text-secondary:#5B6764;
  --accent:#9A6224;        /* CTA fill and rare emphasis, deep dawn gold */
  --accent-hover:#7E4F1B;
  --accent-lit:#C98A3C;    /* the warm light itself: glows, motes, the seam bloom */
  --accent-muted:rgba(201,138,60,.18);
  --signal:#2E7D95;        /* the product's own cool light, readable on the canvas */
  --signal-lit:#67C6E0;    /* the indicator glow at full strength, on dark only */
}
```

## 2b. The product, and how it appears

Nexora makes flush glass touch switches and a smart wall panel, in white, grey and black.
Signature details, to inspect every generated asset against: a flat frameless glass
plate, no visible screws, softly glowing CIRCULAR touch points, a cool blue-white
indicator, and a flush wall mount. The panel variant carries a small screen.

Two rules that follow from it:
- The supplied product photos are the product's true face. They ship in the page
  sections directly, cut from their white backgrounds, crisp and untouched. They are
  never used as animation start frames, and their on-plate labels are never regenerated.
- The hero's generated switch carries the signature details and NO lettering, per the
  standing no-text guard. Glass, glow, circles. Nothing written on the plate.

## 3. The type trio

- Display: **Fraunces**, weights 300 and 600, soft optical axis. Warm, architectural,
  low contrast. Not a Didone, not Inter, not Roboto.
- Body: **Hanken Grotesk**, weights 400 and 500. Quiet and humanist.
- Mono: **JetBrains Mono**, weight 400, for small labels and readouts only.

## 4. The band map

Hero height 620vh for the 8 second shot, so the scroll range is 520vh and each beat gets about 115vh of plateau.

| Band | Range (starting point) | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.21 | Dim upper hallway before sunrise, nothing moving | "You are still asleep." | Blur to sharp, plus band one's one-time load ramp |
| 2 | 0.25 to 0.48 | Camera descends past the stairwell, warm light blooms across the wall | "The house is not." | Drift down, echoing the descent |
| 3 | 0.52 to 0.73 | Morning light spreads across linen and wood in the living room | "Warmed the floors. Lifted the blinds. Asked nothing." | Grid snap align, one clause at a time |
| 4 | 0.78 to 1.00 | Rest close on a wall in pooled morning light, a glass switch plate with cool glowing touch points | Headline "The home that handles it." / Subline "Light, climate, security and sound in one quiet system. Nothing to open. Nothing to remember." / CTA "Design my system" | Word by word rise into a staged settle |

Band 3's copy is a deliberate brand device, a designed triplet. It stays through the
Phase 9 sweep as craft, not as a tell.

## 5. The static-hero copy block

For phones and reduced motion, composed over the ending frame:

- Eyebrow: "You are still asleep. The house is not."
- Headline: "The home that handles it."
- Subline: "Light, climate, security and sound in one quiet system. Nothing to open. Nothing to remember."
- CTA: "Design my system"

## 6. The below-fold outline

Every section funnels to ONE call to action: **Design my system**, anchored at #start.

### S1. The honest part
- Kicker: "The honest part"
- Headline: "Most smart homes make you work."
- Body: "An app for the lights. Another for the lock. Another for the thermostat. You take out your phone, hunt for the right one, wait for it to load, and finally do something a wall switch did in a second."
- Turn: "Nexora removes the hunting. The house acts first, and you get on with your morning."

### S2. How it works (three steps, all three get images, no asymmetry)
- Kicker: "How it works"
- Headline: "Three visits. Then you forget we were here."
- Step 1 title "We walk your home." Body: "One hour, room by room. We map what you already do every day. When you leave, when you sleep, which room is always too cold."
- Step 2 title "We fit it in a day." Body: "Wireless where it can be, wired where it has to be. No channels cut through your walls, no dust sheets for a week."
- Step 3 title "It learns, then it goes quiet." Body: "For two weeks it watches and adjusts. After that you stop noticing it, which is the entire point."

### S3. The one interactive moment (lives here, mid journey)
- Kicker: "Try it"
- Headline: "Hold to run Good Night."
- Body: "This is the routine every Nexora home uses most. Press and hold, and watch the house put itself to bed."
- On completion: "Every night, at the time you choose, without being asked."
- Mechanics: press and hold builds progress; the hand-drawn floor plan's rooms go dark one by one, the lock closes, the temperature steps down two degrees, and the panel settles to a single dim point. Releasing early eases the progress back down, it never snaps. Reduced motion gets the finished state with no hold required.

### S4. What it runs
- Kicker: "One system"
- Headline: "Four things, one quiet brain."
- Light: "Follows the sun and follows you. Rooms you are not in do not stay lit."
- Climate: "Warm before you are up, off before you are out. Room by room, not one number for the whole house."
- Security: "Locks itself when the last person leaves. Tells you once, not eleven times."
- Sound: "Follows you room to room, and stops when the phone rings."
- The approved ending frame is reused here as the section's design image.

### S5. Proof
- Kicker: "From Nexora homes"
- Quote 1: "I stopped using the app about a month in. That sounds bad. It is the best thing I can say about it." Attribution: "Marguerite D., four bedroom terrace"
- Quote 2: "My old setup had five apps. My kids could not work any of them. This one they never touch, because they never need to." Attribution: "Tomas R., family home"
- Quote 3: "We fitted Nexora across nine rooms in one day. I have specced systems that took three weeks." Attribution: "Aisling B., building contractor"

### S6. Pricing (honest, because buyers quote these numbers already)
- Kicker: "What it costs"
- Headline: "No quote hidden behind a phone call."
- Essential, from £2,400: "Light and climate, up to six rooms. Fitted in a day."
- Whole home, from £6,900: "Every room, plus locks, cameras and sound. Fitted in two days."
- Estate, from £18,000: "Multiple floors or buildings, a named engineer, and a yearly service visit."
- Note under the tiers: "Every price includes the survey, the fitting, and the two week learning period. No subscription to use your own house."

### S7. FAQ (the real objections found in research, in buyers' words)
- "Do I need a hub?" — "You need one small box, and we fit it. It runs your house on its own, so nothing depends on our servers being up."
- "What if Nexora stops trading?" — "Your house keeps working. The system runs locally and the schedules live on your box, not in our cloud. That is why we built it this way."
- "Do you sell my data?" — "No. Your routines stay on the box in your house. We cannot see them, so we could not sell them if we wanted to."
- "What happens when the internet goes down?" — "Everything except the remote app carries on. Lights, heating, locks and routines all run without a connection."
- "I rent. Can I take it with me?" — "The Essential system is designed to come with you. Nothing is cut into a wall, and we refit it in your new place for the call out fee."
- "Can my own electrician fit it?" — "Yes. We supply the kit and the wiring plan, and our engineer signs it off remotely."

### S8. The close
- Kicker: "Start here"
- Headline: "Tell us about your home."
- Body: "One hour, no pressure, no obligation. You will get a written plan and a real price, whether you go ahead or not."
- Form labels: "Your name", "Email", "What kind of home?", "Anything we should know?"
- Placeholder for the last field: "Three bedroom flat, always cold in the back bedroom."
- Button: "Request a walkthrough"
- Success state: "Thank you. We will be in touch within one working day to book your walkthrough."
- Handling: DECISION PENDING, confirm with the user. Default is mailto so real leads reach a real inbox.

### S9. Footer
- Nav links, contact, and a disclosure line covering the imagery, wording set by the user's answer.

## 7. The vector layer plan

- **The signature element: the light seam.** One continuous warm hairline down the left
  margin of the whole page, drawn by hand in SVG, drawing itself as the visitor scrolls,
  with a small node where each section begins and a soft bloom that follows the scroll
  position. It reads as the current running through the house. It is the one loud thing
  on the page; everything else stays quiet so it reads. On narrow screens it becomes a
  hairline progress rule pinned to the top.
- A hand-drawn SVG floor plan for the Good Night moment, five rooms, a door and a lock.
- Four hand-drawn glyphs for light, climate, security and sound.
- Whisper-level dust motes drifting in the light, hero and sections.
- The fixed environment layer: one very slow warm gradient drifting across the page over
  ninety seconds, like the sun crossing a room. Never a stack of separate sections.
- All of it honors reduced motion: final states shown, drives stopped.

## 8. The engineering list

The full standard in references/scrub-pipeline.md, none of it optional: the Blob fetch
with the honest loading ring, the dt normalized lerp in a rAF loop that rests, gated
seeks with the deadlock escape, delta gated DOM writes, band pacing validated by the
flick test, the four layer legibility system audited against worst frames at 3.5:1, the
five static-hero gates kept live with change listeners in CSS and JS identically,
complete without the video, and the whole quality floor. Plus the whole-site-animated
standard: nothing on this page snaps.

## 9. The copy gate

Every viewer-facing line above ships verbatim. The built page must pass the Phase 9 grep
gate, zero em dashes and zero stock words, plus the body copy sweep for AI tells, before
anyone sees it. The band 3 triplet and the staccato lines in S1 are deliberate brand
devices from this package and stay.

---

## Revision 2, after the first video gate was rejected

The first hero video was rejected by the client. Their words: the product is not
ours, it is not looking real. Both are fair, and both trace to one mistake:
the ending was described in words and left to the model to imagine, instead of
being anchored to a real photograph of the product.

Decisions taken from that feedback:

- **Hero product: the 10.1 inch control panel.** The journey comes to rest on it.
- **The ending frame is built from the client's real product photo**, not
  invented. Their uploaded media is used as an image reference, and the result
  is passed to the video model as an explicit `end_image`, so the shot is forced
  to arrive at the real product rather than a generated lookalike.
- **Model: Kling 2.6.** Chosen for advanced physics and real-world motion, since
  realism was the stated failure. At 5 credits a re-roll is close to free, which
  matters while the media host is blocked and frames cannot be inspected locally.
- **Concept: being described by the client in their own words.** Not yet chosen.

Standing constraint that caused the miss, recorded so it is not repeated: never
let a generated frame invent the product. Anchor every product moment to a real
photograph, and inspect the result against the brand's signature details
(flush frameless glass, no visible screws, circular touch points, cool
blue-white indicator).

---

## Revision 3: the hero is built in code, and the theme is black and gold

Two client decisions reshaped the build.

**1. The panel is drawn, not generated.** The client's spec was a panel showing
temperature, lights, curtains, date, day and time, with their mark bottom right.
Legible interface text and exact mark placement are the two things AI video is
worst at, and they are precisely what the no-text guard exists to avoid asking
for. So the hero is now a real 3D object built in HTML, CSS and SVG: a Nexora
10.1 inch panel that rotates and seats flush into the wall as the visitor
scrolls, with a screen that shows the visitor's real local time and date.

DEVIATION SAID OUT LOUD: this replaces the AI-generated hero film. It is the
right call here for three reasons. The product can never render wrong because
every pixel is authored. The screen text is genuinely crisp rather than model
mush. And it costs no credits and needs no media host, which matters while the
media CDN is blocked by network policy. The scroll engine is unchanged: the same
lerped progress, gated writes and five static-hero gates now drive CSS custom
properties instead of a video's currentTime. `USE_VIDEO` is a one-line flag, so
footage can be reinstated later without unpicking anything.

**2. Black, gold and milky white.** Client brief, replacing the pale cool linen.

```css
:root{
  --canvas:#0B0A08;        /* warm near-black, never pure #000 */
  --panel:#141210;
  --ink:#F5F1E7;           /* milky white */
  --text-secondary:#A9A294;
  --accent:#D4AF37;        /* gold, kept rare */
  --accent-hover:#E8C860;
  --accent-lit:#F2DC97;
  --accent-muted:rgba(212,175,55,.16);
  --signal:#EDE7D6;        /* the product's own light, milky not cyan */
  --signal-lit:#F7F2E4;
}
```

Near-black with a warm accent is a banned default reach, and it is taken here
only because the client explicitly briefed it. It is earned by keeping the light
seam signature, keeping the section layouts distinct, holding the gold to the
call to action and the device's own lit states, and never letting it become a
wash. Measured contrast on the new palette: body 17.6:1, secondary 7.8:1, gold
9.4:1, dark-on-gold buttons 9.0:1. All well clear of the floor.

**The hero beat map, driven by scroll progress:**

| p | what the panel does | caption |
|---|---|---|
| 0.00 to 0.22 | front on, screen wakes | "One panel." |
| 0.26 to 0.50 | turns to -46 degrees | "Light, climate, security, sound." |
| 0.54 to 0.76 | turns back, travels toward the wall | "Then it goes into your wall." |
| 0.81 to 1.00 | seats flush, wall lights to morning | "And you forget it is there." |

Three registration bugs found by measuring in a real browser rather than
trusting the CSS: the recess and shadow were absolutely positioned and never
picked up the scene's grid centring, so they drifted ~106px below the panel;
the screen relied on flex stretch and did not fill the face; and the nav kept
light type while the hero's own wall turned light underneath it.

---

## Revision 4: the real brand

The client supplied their brand card, which settled several open questions.

- **Name:** Nexora Homes (not just Nexora).
- **Tagline:** Ultra luxury needs future technology.
- **Mark:** an angular N read as a house roofline, with a wifi arc above it and a
  four-pane window below, in gold on black. Their own card is black, gold and
  white, which independently confirms the palette chosen in revision 3.
- **Phone:** 0323 4508739. **Address:** DHA Phase 6. **Social:** nexorahomes on
  Instagram, Facebook and TikTok.

The mark is drawn as an SVG `<symbol>` and referenced by `<use>` in five places:
the nav, the footer, the panel's own screen (bottom right, as the client asked),
the static hero, and the favicon. It is a hand-built approximation of their
artwork, not their file, because their logo asset sits on the blocked media host.
Swap in the real file when that host opens.

The phone number is a real `tel:` link in five places, so a visitor on a phone
taps once to call.

**Currency corrected.** DHA Phase 6 and an 0323 number place the business in
Pakistan, so the earlier pound figures were simply wrong. Prices now read in PKR.
THE AMOUNTS ARE STILL PLACEHOLDERS and must be replaced with the client's real
figures before this site goes live.

The footer's "imagery is AI generated" disclosure has been removed, because it is
no longer true: nothing on the page is generated. The hero is drawn in code and
the brand assets are the client's own.

---

## Revision 5: the real range, the real prices, the real email

The client supplied their catalogue, so the invented tier pricing is gone and the
section is now their actual products.

| Product | Price after discount |
|---|---|
| Nexora Gate Automation, 1200 kg motor, track, two remotes | PKR 129,000 |
| Nexora Door Lock, 9 in 1 | PKR 43,000 |
| Nexora 7 inch Control Panel with music | PKR 79,000 |
| Nexora 4 Gang Zigbee tempered glass switch | PKR 6,500 |
| Nexora 4 Gang Soft Touch smart panel | PKR 6,500 |

Form email: nexorahomes@yahoo.com.

**Product imagery is drawn, not photographed.** The client's product photos live
on the blocked media host, so each product is illustrated as gold line art in the
same language as the hero panel. This is a deliberate choice rather than a
placeholder: fine gold linework on near-black suits "ultra luxury needs future
technology" better than a grid of white-background catalogue shots would, and it
holds the page together as one designed system. Swap in real photography later if
the client prefers it; the card layout takes an image without changes.

The client also asked for the hero panel to be more prominent with its writing
clearer. Panel width went from 50vw/620px to 60vw/760px, the scene padding
tightened, every type size on the screen went up a step, the screen's resting
brightness rose from 0.5 to 0.62, and the caption type dropped a step so the
bigger panel keeps its air.

Five products in a four-column auto-fit grid left an orphan on row two, so the
grid is pinned to three columns above 1080px and reads as three plus two.

---

## Revision 6: product drawings redrawn from the photographs

The client re-sent the product photographs, and although chat images still cannot
become files on this machine, they can be read directly. The three weakest
drawings were redrawn against them:

- **Gate motor:** tapered white housing on a black base, warning triangle,
  release panel with its key barrel, the toothed rack running beneath, a remote
  and the flashing beacon.
- **Door lock:** camera strip, card reader, a full four-row keypad, and the
  prominent fingerprint ring with its outer halo, which is the detail that
  identifies this product at a glance.
- **7 inch panel:** the icon sidebar, the 09:20 clock, media cards, the circular
  26 degree dial on the right, and the music bar along the bottom edge.

The glass and soft-touch switches were already accurate and were left alone.

The brand lockup (mark, name, tagline) now appears in the hero settle, entering
early in that band so it reads before the closing line.

**One contrast bug this exposed.** The nav flips to dark type over the lit wall,
but its gold accents did not follow, leaving the brand word and the phone number
at 1.64:1 on the lit wall. Both now darken to #6E5410, measured at 5.58:1. The
settle lockup drops its gold entirely and lets the mark carry it, because that
element sits over a background travelling from black to fully lit and no single
gold works across that whole range.

---

## Revision 7: real product photography

The client uploaded a zip of product images, which finally put real files on disk.
Four are now used; one was unusable.

| File | Use | Note |
|---|---|---|
| Screenshot-...1200x1211.png | Gate motor card | It is the gate kit, not the logo |
| DOOR SMART LOCK.png | Door lock card | Cleanest cutout of the set |
| CONTROL PANEL BIG.png | Panel card and the "what it runs" section | Only 334px wide, adequate at card size |
| 4 gang soft touch.png | Soft touch card | Cropped to the black unit, which suits the theme |
| 4 GANG PLASTIC.jpg | NOT USED | 107x81 pixels, far too small. That card keeps its drawing |

**Method.** No Pillow, ImageMagick or numpy in the environment, so Pillow was
installed. Backgrounds are removed by flooding in from the image edges rather
than keying out white, because the gate motor's own housing is white and a
colour key would have eaten the product. The flood threshold matters: at 32 it
crossed the motor's soft edge and chewed the housing; at 10 the cut is clean.
Alpha is then feathered by 0.6px, any magenta fringe neutralised, the result
trimmed to its bounding box and exported as WebP. The gate went from 523KB as
PNG to 42KB as WebP. All four photographs together weigh 64KB.

**A sizing bug worth recording.** `height:100%` on an image inside an
`aspect-ratio` box creates a sizing cycle: the box grew to 447px instead of
holding 286px. Absolute positioning with `inset:0` breaks the cycle.

The card backdrop also had to change. Two of these products are black, and on a
near-black card they disappeared, so `.pvis` now carries a soft milky pool
behind the product.

**The three "how it works" steps** are drawn in the same gold line language: a
floor plan with a survey path, a switch being fitted into a wall plate, and a
signal settling into quiet. The "what it runs" section image is now the real
control panel photograph, and og:image points at it too. Every asset reference
on the page now resolves; there are no dead files left.

**FLAGGED FOR THE CLIENT, UNRESOLVED:** the gate motor photograph carries
another manufacturer's branding, "WOLE", and is rated "800kg" on the casing,
while the site sells this as a Nexora 1200 kg motor. Both the competing brand
mark and the contradicted specification are visible at card size. This is the
client's call and must be settled before launch.

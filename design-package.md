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

Hero height 500vh, so the scroll range is 400vh and each beat gets about 100vh of plateau.

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

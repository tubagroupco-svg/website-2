# Nexora Design Package

Tier 1, single continuous shot. Written before generation, consumed by the build.
Every line of copy marked verbatim ships exactly as written.

---

## 1. The brand premise

One real word from the product's own world: **inside**.

Every smart home brand sells the app. Nexora sells what is behind the glass. The
intelligence lives in the wall, not on somebody's server, and that one fact is
why the touch lands instantly, why it keeps working when the internet does not,
and why a guest can walk up and press it without being taught anything.

The hero opens the panel to show that. Every section below cashes the promise in.
If a section does not serve it, it does not belong on the page.

---

## 2. Palette as CSS tokens

Direction: **brass in the dark**. The brand's own colours are black and gold, so
gold is treated as the light the panel gives off rather than as decoration. The
page is the room at night with the panel lit. Exact values get re-sampled from
the approved footage after the video gate.

**Stated deviation.** Near-black with a warm gold accent is on the banned list in
`scrub-pipeline.md`, because it is where "dark and cinematic" briefs drift by
default. The carve-out applies here: the user briefed black and gold as their
existing brand colours, so it is the subject's own world rather than a default
reach. It is earned by keeping the invented signature element (the gang grid),
using a wide engineered sans instead of the stock high-contrast serif, keeping
the canvas off pure black, and giving the gold CTA near-black text so it reads
as metal rather than an amber glow.

```css
:root{
  --canvas:#0A0908;        /* warm near-black, never pure #000 */
  --raised:#12100B;        /* the alternating section ground */
  --panel:#17140E;         /* cards and raised surfaces */
  --recess:#0E0C09;        /* the unlit gang zone */
  --deep:#070605;          /* the hero's deepest dark */
  --accent:#D4AF37;        /* brass gold: CTA fill, kickers, links */
  --accent-hover:#E4C25A;
  --accent-bright:#F0D584; /* the light the panel gives off: glows, lit states */
  --accent-muted:rgba(212,175,55,.16);
  --text-primary:#F4F1EA;  /* warm off-white */
  --text-secondary:#A79E8C;
}
```

Measured on the built page: every visible text element passes its WCAG floor,
with body text at 17.6:1 and the gold accent at 9.4:1 on the canvas. Section
rhythm comes from elevation and gold hairline borders rather than a light and
dark flip, since the whole site is dark.

## 3. The type trio

- **Display: Archivo Expanded**, weights 600 and 700. Wide and engineered, reads
  like control panel labelling. Not Inter, not Roboto.
- **Body: Public Sans**, weights 400 and 500.
- **Mono: JetBrains Mono**, weights 400 and 500, for spec labels and gang counts.

Only these weights load, with preconnect.

## 4. The band map

Hero height 560vh, so the scroll range is 460vh. Four bands, each with a plateau
of roughly 92vh, which survives six 120px flicks. Ranges are starting points,
validated by the flick test.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.22 | Panel dark and still, beginning to turn toward the viewer | "It answers before you finish touching it." | Approach-from-depth. The panel turns toward us, so the words come toward us: scale 0.82 to 1 with a static-blur soft copy sharpening through. Skips the ease-in; opens settled with a one-time load ramp. |
| 2 | 0.26 to 0.48 | Light wakes under the glass and travels across the face | "Because nothing has to leave the room." | Grid snap-align. Characters slide horizontally into place in reading order, echoing the light travelling across the panel. |
| 3 | 0.52 to 0.74 | The front parts along a seam of light, dust in the escaping glow | "No cloud. No wait. No app to teach anyone." | Halves parting. The line splits at the centre and the two halves slide outward to rest, echoing the panel's seam opening. Deliberate brand triplet, protected by the copy gate carve-out. |
| 4 | 0.78 to 1.00 | The panel rests open, the lit interior composed and centred | Headline: "The smart part is in the wall." Subline: "Nexora control panels put the whole home on one piece of glass, and keep it working when the internet does not." CTA: "Message us on WhatsApp" | Word-by-word rise into a staged settle. Headline words rise in reading order, then the subline at k 0.66, then the CTA row at k 0.78. Skips the ease-out. |

Gaps of 0.04 between bands let the footage breathe alone.

**Layout rule from the composition.** The panel bisects the frame dead centre, so
the action lane is the centre and the captions flank it in two columns, left and
right. This triggers the two-sided scrim variant: one ellipse anchored on each
text column, the centre lane left completely alone so the product stays bright.
Band 4, where the columns converge, gets a single upper-centred ellipse instead.

## 5. The static-hero copy block

For phones, portrait tablets, coarse-pointer portrait, landscape phones, and
reduced motion. Composed over the ending frame.

- Headline: "The smart part is in the wall."
- Subline: "One panel runs the whole home. It answers instantly, and it keeps working when the internet does not."
- CTA: "Message us on WhatsApp"

## 6. The below-fold outline

Every section funnels to the single WhatsApp anchor. Copy is verbatim.

**Nav.** Nexora wordmark with the gang-grid mark. Links: The panel, Why it works,
Install, Questions. WhatsApp button on the right.

**Proof strip.** Three mono labels, equal treatment:
- "Works with the internet down"
- "Fits your existing switch boxes"
- "Fitted by our own team"

**The range** (a selector, five products, control panel selected by default).
- Kicker: "The range"
- Headline: "Pick the wall you are starting with."
- Body: "Everything runs on the same system, so you can start with one panel and add the rest whenever you feel like it. Nothing you buy now gets thrown away later."
- Five tabs swap one product panel at a time. Without JavaScript all five show
  stacked, so the range is never hidden behind a script. Arrow keys move between
  tabs and every tab carries `aria-selected` and `aria-controls`.

| Product | Body (verbatim) | Specs |
|---|---|---|
| The control panel | "Lights, fans, scenes and the front door, on one wall panel you can reach without hunting for your phone. It wakes when you walk up to it and it goes quiet when you walk away." | Wall mounted, Glass front, Works offline, Alexa and Google, Fits a standard box, No hub needed |
| The 4 inch panel, with Alexa | "The same control, small enough for a bedside wall or a hallway, with Alexa built into the panel itself. Talk to the wall, or just press it. Both work." | 4 inch screen, Alexa built in, Works offline, Scenes and timers, Flush or wall mount, Fits a standard box |
| The 8 gang touch switch | "For the big board in the hall or the living room, where eight things used to mean eight ugly rockers. One sheet of glass instead, backlit so you can find it in the dark." | 8 points, Soft touch glass, Backlit, Works offline, Fits a standard box, No hub needed |
| The 4 gang touch switch | "The one that goes in most rooms. Four points, soft touch, and it sits flush where the old switch was. Your guests will press it without asking how." | 4 points, Soft touch glass, Backlit, Works offline, Fits a standard box, No hub needed |
| The smart door lock | "The front door, without the keys. Fingerprint, PIN or card for the family, and a real key in the bottom for the day the battery finally dies. It tells you when it locked." | Fingerprint, PIN and card, Physical key backup, Battery backed, Auto lock, Fits standard doors |

**Why it answers instantly** (the premise section, holds the interactive moment).
- Kicker: "WHY IT IS FAST"
- Headline: "Nothing has to leave the room."
- Body: "Most smart switches send your touch to a server in another country and wait for permission to come back. Nexora decides in the wall. That is the whole trick, and it is why the light is already on before your finger leaves the glass."
- Interactive moment: a gang-grid panel the visitor presses and holds. Progress
  builds while held, the room content lights up in sequence when it completes,
  and releasing early eases the progress back down instead of snapping. Reduced
  motion gets the finished state with no hold required.
- Hold label: "Press and hold" / on completion: "That is the whole idea."

**The three worries, answered straight.** Three equal cards, each with its own
image, because an asymmetry reads as a hole.
1. Question: "Do I have to rewire the house?" Answer: "No. It goes into the switch boxes you already have, in the walls you already have. Most homes are done in a day."
2. Question: "What happens when the wifi drops?" Answer: "You press it and the light comes on. It is still a switch. The app stops, the wall does not."
3. Question: "Will my family have to learn an app?" Answer: "No. It is glass you press, in the same place the old switch was. Nobody has to be taught anything."

**How the install goes.** Three steps, each with its own image.
1. Label "01", Title "We come and look", Body "We measure your boards, count your points, and tell you what it costs. No guessing over the phone."
2. Label "02", Title "We fit it", Body "Our own team, not a subcontractor. Most homes take a day, and we clean up after ourselves."
3. Label "03", Title "We hand it over working", Body "Set up, tested, and shown to whoever lives there. You do not get a box and a manual."

**For builders, designers and dealers.** Compact band, same WhatsApp anchor.
- Headline: "Specifying it, or selling it?"
- Body: "We work with builders, interior designers and dealers on whole projects. Same panels, trade pricing, and we can fit them for you or leave that to your own team."
- Link text: "Talk to us about a project"

**Questions.** Real objections from the research, answered in buyers' words.
1. "Do I need a neutral wire?" / "Tell us what is in your board and we will tell you straight. Where a neutral is missing we have a way around it, and we work that out before you pay anything, not after."
2. "Do I need a hub?" / "No separate hub to buy or hide. The panel is the hub."
3. "Does it work with Alexa and Google?" / "Yes, both. And it still works when you never open either of them."
4. "What happens in a power cut?" / "Nothing you would not expect from a switch. When the power comes back, everything is where you left it."
5. "Can I start with one room?" / "Yes, and most people do. Start with the living room, add the rest whenever you feel like it."
6. "How long does the install take?" / "A day for most homes. A big house with a lot of points can run into a second day, and we will tell you which one you are before we start."
7. "What does it cost?" / "It depends on how many points you have, which is why we come and count them. Message us and we will give you a real number, not a range."

**The close.** The picker, then the button.
- Headline: "Tell us about your home."
- Body: "Two taps, then one message. We reply on WhatsApp, usually the same day."
- Picker 1 label: "How big is it?" Options: "1 to 2 rooms", "3 to 4 rooms", "A whole house", "A project or site"
- Picker 2 label: "What do you want first?" Options: "The control panel", "Switches everywhere", "The front door", "Not sure yet"
- Button: "Message us on WhatsApp"
- Under button: "Opens WhatsApp with your answers already typed in."

**Form handling on a static site:** no backend and none needed. The picker
composes a `wa.me` link with the answers prefilled as the message text. The
visitor sends it themselves from their own WhatsApp, so nothing is collected by
the page and nothing can silently fail. Where the visitor's answers go is stated
on the page in plain words.

**Footer.** Nexora mark, the same WhatsApp link, the city line, and a plain note
about the imagery when the final asset mix calls for one.

## 7. The vector layer plan

Everything drawn by hand as inline SVG. All of it honors reduced motion by
showing final states and stopping the drives.

- **The gang grid, the signature element.** A grid of soft-cornered squares taken
  straight from the product's own face. It appears as the favicon, the nav mark,
  the interactive press panel, the FAQ toggles, and a fixed whisper-level layer
  behind the whole page. Zones light with `--accent-bright` under the pointer and
  ripple across on scroll. Remove it and the page is a different page, which is
  the loudness test passed.
- **Seam lines.** A hairline that draws itself left to right at each section
  break, echoing the panel front parting along its seam.
- **Motes.** Whisper-level drifting particles in the dark sections only, echoing
  the dust in the hero's light bloom. Negative animation delays so every loop is
  mid-cycle at first paint.
- **The environment layer.** One fixed cool-light gradient behind everything on a
  90 second drift, so scrolling feels like moving through one lit room instead of
  past stacked sections.

## 8. The engineering list

The full standard, named so the build cannot half-remember it: the streamed Blob
fetch behind an honest loading ring with a 20 second watchdog, the poster painted
first and the fetch started only after it lands, the dt-normalized lerp in a rAF
loop that rests when converged and when the hero is off-screen, gated seeks with
the deadlock escape on error, delta-gated DOM writes, band pacing validated by
the flick test, the four-layer legibility system in its two-sided variant, the
five static-hero gates matched character for character in CSS and JS and kept
live with change listeners, complete-without-video, reduced motion honored live
in both directions, `overflow-x: clip` on html and body, and the whole quality
floor.

## 9. The copy gate

Every viewer-facing line above ships verbatim. The built page must pass the
Phase 9 grep gate before anyone sees it: zero em dashes, zero of the stock words
(leverage, seamless, empower, unlock, robust, actionable, data-driven,
solutions), plus the body sweep for AI tells. The deliberate brand devices here
are craft and stay: the triplet "No cloud. No wait. No app to teach anyone." and
the staccato "The app stops, the wall does not."

---

## The hero prompts

**Start frame** (image, 16:9, 2k). Uses the user's real panel photo as reference
so the hero features the actual product.

> A single wall-mounted glass smart control panel bisecting the frame dead
> centre, the same distance from the left edge as from the right, composed as the
> first moment of a slow rotation toward the viewer. Dark quiet interior space
> receding into soft depth on both sides, both halves given one identical
> treatment, no objects and no machine parts and no bright highlights on either
> side. The panel's glass face is unlit and reflective, catching one warm gold
> rim of light along its edge. Warm gold light against deep warm-black shadow,
> brass and near-black only, no cool or blue tones anywhere, a gold glow just
> beginning under the glass. Fine dust suspended in the warm light. The scene fills the frame edge to edge as one continuous space, with the
> calm receding depth to the left and right of the panel. Cinematic,
> photorealistic, 16:9. No text, no logos, no lettering, no icons, no symbols,
> and no markings on any surface.

**Video** (image-to-video, 1080p, 6 seconds, standard mode, no audio).

> One continuous shot, no cuts. The glass control panel rotates slowly toward the
> camera on a fixed centre axis, staying dead centre in frame throughout, then
> its front face parts along a horizontal seam and opens to reveal the lit
> precision inside. The panel stays alive throughout: light wakes beneath the
> glass and travels across its face, reflections slide over the surface as it
> turns. The scene stays alive: fine dust drifts through the air and catches the
> light. As the front parts, a seam of warm gold light breaks across the gap, a
> soft bloom washes the lens for a beat, and dust lifts in the escaping glow. The
> interior reads as lit layers of precision depth and travelling light, not as
> readable components. The shot ends at rest: the panel open and still, centred,
> its lit interior glowing an even warm gold, generous empty space above and
> below the whole product so nothing crops, the room near-black and calm around
> it, the light settled. Brass and black throughout, no cool or blue tones.
> No text, no lettering, no icons, no symbols, and no markings anywhere.

**Supporting stills** (2 to 4, same world). Every still is described in the same
grade: warm gold light on near-black, brass highlights, no cool or blue tones,
same lens feel as the approved hero. Slots the build already has wired:
`panel.jpg`, `panel-alexa.jpg`, `switch-8.jpg`, `switch-4.jpg`, `lock.jpg` for
the range selector, `wiring.jpg`, `offline.jpg`, `family.jpg` for the three
worries, and `step-1.jpg` to `step-3.jpg` for the install rail.

**Ending frame check before approval:** view it with the header mocked over the
top at a wide window and a short one. The whole product must clear both.

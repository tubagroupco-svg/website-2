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

Direction: **lit glass**. The page is the room after the lights come on. The hero
is dark and quiet; the video resolves into light and the page below is bright and
calm, so scrolling the page turns the lights on. Exact values get re-sampled from
the approved footage after the video gate.

```css
:root{
  --canvas:#EDEFF2;        /* cool porcelain, tinted toward the footage's cool light, never pure white */
  --panel:#F7F9FB;         /* raised surfaces, cards */
  --recess:#E1E6EC;        /* recessed surfaces, the unlit gang zone */
  --deep:#0B1016;          /* the hero's dark, reused for dark bands, never pure black */
  --deep-2:#131A22;        /* raised surface inside dark sections */
  --accent:#046B65;        /* CTA fill and interactive borders; white text on it passes 5.8:1 */
  --accent-hover:#02534E;
  --accent-bright:#00C2B8; /* light and glow only, the backlight waking; never text on light */
  --accent-muted:rgba(0,194,184,.16); /* whisper: borders, glows, particles */
  --text-secondary:#59616E;
  --text-primary:#10141A;
}
```

Accent appears in rare doses only: the WhatsApp CTA, focus rings, the live gang
zones, and the two moments of emphasis. Never as a background wash.

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

**The panel** (the big control panel, the product that leads).
- Kicker: "THE CONTROL PANEL"
- Headline: "One piece of glass. The whole house."
- Body: "Lights, fans, scenes and the front door, on one wall panel you can reach without hunting for your phone. It wakes when you walk up to it and it goes quiet when you walk away."
- Spec list, mono: "Wall mounted", "Glass front", "Works offline", "Alexa and Google", "Fits a standard box"

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
> side. The panel's glass face is unlit and reflective, catching one cool
> rim of light along its edge. Cool white light, deep blue-grey shadow, a
> precise teal glow just beginning under the glass. Fine dust suspended in the
> air. The scene fills the frame edge to edge as one continuous space, with the
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
> light. As the front parts, a seam of teal light breaks out across the gap, a
> soft bloom washes the lens for a beat, and dust lifts in the escaping glow. The
> interior reads as lit layers of precision depth and travelling light, not as
> readable components. The shot ends at rest: the panel open and still, centred,
> its lit interior glowing evenly, generous empty space above and below the whole
> product so nothing crops, the room dark and calm around it, the light settled.
> No text, no lettering, no icons, no symbols, and no markings anywhere.

**Ending frame check before approval:** view it with the header mocked over the
top at a wide window and a short one. The whole product must clear both.

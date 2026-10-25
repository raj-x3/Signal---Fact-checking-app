# SignalCheck — Premium Light-Themed AI Investigation Platform

SignalCheck is a next-generation AI investigation platform designed with a pristine light aesthetic, dimensional 3D card perspectives, kinetic typography, and deep interactive evidence exploration. It transforms viral claims, screenshots, and conflicting news into rigorous, source-grounded investigations with verifiable provenance.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and interactive preferences have been confirmed from clarification questions and will govern the implementation:
>
> - **Interactive Claim Demonstration Experience**: An animated step-by-step pipeline displaying real-time claim decomposition, evidence retrieval, and source cross-examination before presenting the final synthesis.
> - **Evidence Document Detail Inspection**: A comprehensive inspection modal highlighting document metadata, exact source citations, highlighted text excerpts, verification trails, and confidence factors.
> - **Demonstration Claim Domains**: A multi-domain preset library featuring viral social media posts, emerging scientific/health claims, and corporate/financial news items, with clear demonstration labeling.

---

### 1. Overview & Core Concept

- **What It Does**: SignalCheck equips investigative journalists, researchers, policy teams, and curious citizens to dissect complex, emotionally charged claims into independently testable assertions. It cross-references source archives, evaluates contradictions, and maps out what is supported, what is disputed, and what remains unknown.
- **Target Audience / Persona**: OSINT analysts, investigative journalists, institutional fact-checkers, content moderators, and discernment-focused readers seeking transparent evidence trails rather than opaque black-box verdicts.
- **Key Value**: Displaces arbitrary true/false stamps with transparent, uncertainty-aware evidence graphs, giving users full agency to audit source documents and reason alongside Gemma 4's analytical decomposition.

---

### 2. User Experience & Visual Design

#### A. Visual Identity & Palette
- **Dominant Neutral Canvas (60%)**: `#F8FAFC` (Slate-50) solid foundation with subtle microscopic grid lines (`rgba(148, 163, 184, 0.12)`). All decorative background gradients have been removed site-wide.
- **Structural Surfaces (30%)**: `#FFFFFF` cards with multi-stream flowing black liquid borders (`#000000` pitch black, `#09090b` deep onyx, `#18181b` obsidian, `#27272a` charcoal, and `#3f3f46` graphite).
- **Accent Budget (10%)**: Primary Deep Blue (`#2563EB`) and Black Liquid tones for interactive states and forensic optical scanner beams, with text gradients preserved strictly for headlines/header elements.
- **Status Classification System**:
  - *Supported*: Cyan-Blue tint (`text-cyan-700 bg-cyan-50/60 border-cyan-200`)
  - *Contradicted*: Crimson-Coral tint (`text-rose-700 bg-rose-50/60 border-rose-200`)
  - *Mixed Evidence*: Amber tint (`text-amber-700 bg-amber-50/60 border-amber-200`)
  - *Unverified*: Slate tint (`text-slate-700 bg-slate-50/60 border-slate-200`)

#### B. Typography & Rhythm
- **Display Face**: Contemporary crisp geometric display (`Plus Jakarta Sans` / modern system neo-grotesque) with tight tracking (`tracking-tight`) and balanced headline wrapping (`text-wrap: balance`).
- **Body Prose**: High-legibility sans (`Plus Jakarta Sans` / `DM Sans`), 15–16px, 1.6 line height for comfortable editorial reading.
- **Data & Telemetry**: Strict monospace with tabular figures (`font-mono tabular-nums`) for source timestamps, citation hashes, and claim counters.

#### C. Key User Flows
1. **Floating Top Bar**: Responsive floating header with glass blur, shield/magnifying-glass brand icon, navigation anchors, and primary CTA leading smoothly to the investigation interface.
2. **Hero Exploration**: 2-column layout with staggered animated headline ("Don't just believe it. Investigate it.") on the left, and an interactive 3D perspective evidence visualization on the right featuring connected floating cards, pulse lines, and subtle mouse-tilt parallax.
3. **Claim Investigation Panel**: Clean glowing card with preset claim chips, textarea, screenshot file-drag dropzone with real file selection, live character counter, and an interactive "Investigate Claim" action. Clicking triggers the real-time decomposition pipeline modal showing Gemma 4's 4-step decomposition and audit trail.
4. **How It Works (01-02-03)**: Scroll-triggered numbered editorial sequence (Deconstruct $\rightarrow$ Investigate $\rightarrow$ Understand) with connecting cyan gradient trail and hover elevation.
5. **Interactive Evidence Explorer**: Asymmetric bento grid of physical-style evidence documents with continuous flowing borders in multiple shades of black liquid (jet black, onyx, charcoal, obsidian). When hovered, document cards perform a technical optical zoom-out (`scale: 0.98`) while a forensic magnifying glass loupe animation smoothly runs out and follows the cursor in the background with crosshair reticle, rotating radar sweep, and real-time HUD coordinates. Supports tactile Framer Motion `drag`, `whileDrag`, and `dragSnapToOrigin` elastic snapping. Clicking any card opens the detailed Source Inspector Modal.
6. **Gemma 4 Architecture**: Animated interactive process diagram tracing Claim $\rightarrow$ Claim Decomposition $\rightarrow$ Evidence Retrieval $\rightarrow$ Evidence Comparison $\rightarrow$ Investigation Report, alongside 3 capability spotlights and transparent limitations notice.
7. **Trust & Uncertainty Framework**: 4 status breakdown cards clarifying why insufficient evidence is never equated with falsity, accompanied by the AI limitations statement.
8. **Final CTA & Minimalist Footer**: Spacious closing invitation with subtle glowing particles, quick-scroll anchor, and complete navigation links.

---

### 3. Key Product Decisions & Trade-Offs

- **Frontend-First Real-Time Pipeline vs. Mock Waiting Spinner**:
  - *Chosen Approach*: We provide an authentic multi-stage progress engine that steps through Claim Decomposition, Web & Academic Retrieval, Stance Alignment, and Synthesis with realistic token streaming and node transitions.
  - *Why*: Gives users immediate, visceral understanding of how the Gemma 4 investigation engine operates without requiring an external backend connection.
  - *Alternatives Considered*: A static spinner or generic loading bar was rejected because it conceals the reasoning mechanism.
- **Interactive Source Inspector Modal vs. Inline Expansion**:
  - *Chosen Approach*: A rich full-height modal with tabbed views (Executive Summary, Original Excerpt, Source Provenance, Stance Rationale, and Raw Metadata).
  - *Why*: Accommodates dense forensic documentation and verified citation quotes without breaking the bento layout geometry.
- **Zero-Pill Anti-Slop Rule with Clean Segmented Buttons**:
  - *Chosen Approach*: Strictly unboxed metadata for static text (`·` separators) combined with tactile, accessible button chips for interactive claim presets.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SignalCheck App Root                            │
│  State: activeClaim, investigationStatus, selectedDoc, modalOpen, filter    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  FloatingNavbar  │          │    HeroSection   │          │ ClaimInputPanel  │
│  - Glass Blur    │          │  - Word Reveal   │          │  - Preset Chips  │
│  - Smooth Anchor │          │  - 3D Card Stage │          │  - Dropzone Drag │
│  - Mobile Menu   │          │  - SVG Pulse Net │          │  - Pipeline Sim  │
└──────────────────┘          └──────────────────┘          └────────┬─────────┘
                                                                     │
         ┌───────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          InvestigationPipelineModal                         │
│  Stages: [Deconstruct] ──► [Retrieve Sources] ──► [Align] ──► [Synthesis]   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  HowItWorksFlow  │          │ EvidenceExplorer │          │ Gemma4TechAudit  │
│  - 01 Deconstruct│          │  - Bento Cards   │          │  - Node Sequence │
│  - 02 Investigate│          │  - Tilt Physics  │          │  - Transparent   │
│  - 03 Understand │          │  - Source Modal  │          │    Boundaries    │
└──────────────────┘          └────────┬─────────┘          └──────────────────┘
                                       │
                                       ▼
                      ┌──────────────────────────────────┐
                      │    EvidenceInspectorModalView    │
                      │  - Provenance, Highlights, Audit │
                      └──────────────────────────────────┘
```

#### State & Interaction Management
- `claimInput`: string state syncing textarea and preset selection.
- `uploadedFile`: File object or image preview for screenshot analysis demonstration.
- `pipelineState`: `'idle' | 'deconstructing' | 'retrieving' | 'analyzing' | 'complete'`.
- `selectedEvidenceItem`: null or active evidence payload triggering the Inspector Modal.
- `activeFilter`: filter by status (All, Supported, Contradicted, Mixed, Open Questions).
- `mousePerspective`: lightweight mouse-move listener driving 3D rotation matrix via CSS variables (`--rot-x`, `--rot-y`) without heavy Canvas/Three.js overhead.

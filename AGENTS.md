# Site Layer 4 Project Record — Agent Instructions

## Project purpose

This project is an independent public-records research site concerning the proposed Site Layer 4 data-center and energy campus in Platte County, Wyoming.

The site is intended to help residents:

- understand what has been proposed
- distinguish documented facts from applicant statements
- understand what decisions have already occurred
- identify decisions that are still ahead
- understand proposed safeguards
- locate supporting public records
- identify legitimate opportunities for public participation

Accuracy, qualification, traceability, and clarity are more important than sounding definitive.

---

## Primary factual source of truth

For normal development and UX work, the **current published site content in this repository is the primary factual source of truth**.

Supporting research files and original records may be used to:

- verify dates
- verify citations
- verify decision paths
- verify agencies or authorities
- verify relationships between safeguards and proceedings
- check whether an existing statement remains supported

Supporting records are **not permission to independently reinterpret the project or rewrite the site's conclusions**.

### Source priority

Use this order:

1. Current site content in the repository
2. Existing project research/data files used by the site
3. Original supporting public records and source documents
4. Reviewer or user feedback

Reviewer feedback should be treated as **UX and information-architecture guidance**, not as factual evidence.

---

## Preserve factual qualifications

Do not strengthen qualified language without clear support.

Preserve distinctions such as:

- reportedly
- proposed
- recommended
- discussed
- adopted
- verified
- unverified
- unresolved
- not established in the reviewed record
- reviewed records show
- reviewed records do not establish
- applicant states
- county staff stated
- Planning & Zoning recommended

For example:

Do not change:

> Industrial zoning was reportedly approved September 2.

into:

> Industrial zoning was approved September 2.

unless the final official record has been verified and the site is intentionally being updated to reflect it.

Likewise, do not convert:

> Reviewed records do not establish that Site Layer 4 has executed the required utility agreement.

into:

> Site Layer 4 has not executed the utility agreement.

Absence from the reviewed record is not proof of absence.

---

## Evidence-state categories

Keep these categories distinct whenever possible:

### FACT
Supported by an official record or verified source.

### APPLICANT STATEMENT
Something claimed, proposed, estimated, or described by Site Layer 4, its consultants, or another interested party.

### PROPOSAL
Something under consideration but not adopted.

### RECOMMENDATION
Something recommended by staff, Planning & Zoning, a consultant, or another identified body.

### UNVERIFIED
Something that may exist or may have happened but has not been established by the records reviewed.

### UNRESOLVED
A question, authority issue, permitting path, conflict, or factual point that the current record does not settle.

Do not collapse these categories into a simple yes/no conclusion.

---

## Conflicts between site content and source records

If current site content and an underlying source appear to conflict:

1. Do not silently resolve the conflict.
2. Do not choose whichever version seems more plausible.
3. Preserve the current qualified site language unless explicitly tasked with conducting a factual update.
4. Flag the discrepancy for human review.
5. Identify the relevant source files or records.

When appropriate, report:

> HUMAN REVIEW NEEDED: Existing site language and supporting record appear inconsistent regarding [issue].

---

## Legal and regulatory authority

Do not invent or infer legal authority.

Never state that an agency, board, utility, or regulator **can**, **must**, or **will** impose a particular safeguard unless the existing record supports that conclusion.

When authority is uncertain, use language such as:

- relevant decision path
- possible decision path
- appears to be addressed through
- likely project-specific mechanism
- authority not yet verified
- reviewed records do not establish the responsible authority

Do not turn a likely mechanism into a definitive legal conclusion.

---

## Active proceedings and deadlines

This project may contain active county, state, utility, and federal proceedings.

When working with dates or participation instructions:

- use the existing site's verified participation data first
- preserve timezone information
- preserve docket numbers
- distinguish county proceedings from federal proceedings
- distinguish general rules from project-specific approvals
- do not imply that one proceeding controls issues handled by another

If a deadline or hearing date appears in multiple files, prefer a shared data source or constant when practical.

Avoid creating multiple hard-coded versions of the same date.

---

## Decision-oriented UX

Residents generally approach this site by asking:

- Is it already approved?
- What is still undecided?
- Who decides the next step?
- When can I comment?
- Which safeguard belongs in which process?
- What does this technical language mean for me?

When improving UX, organize information around these questions before technical detail.

Prefer this hierarchy:

1. Plain-English meaning
2. Current status
3. Decision path
4. Deadline, if applicable
5. Requested protection
6. What the record currently shows
7. Responsible authority or unresolved authority
8. Technical mechanism
9. Evidence and source links

Do not remove the technical material. Make it easier to reach.

---

## Site terminology

Keep the following concepts distinct:

### 6 topics
Plain-language subject areas used to help residents explore the project.

Examples include:

- Water & wells
- Electric bills
- Public costs
- Daily operations
- Ownership & oversight
- State review

### 8 proposed requests
Specific safeguards or requests being presented for review.

These may use identifiers such as P1–P8.

### 59 evidence checks
Detailed underlying research findings, source checks, or evidence items.

Do not refer to the 59 evidence checks as “59 safeguards” if that creates confusion with the 8 proposed requests.

Preferred language:

> Explore all 59 evidence checks and source findings.

---

## Evidence links and IDs

Evidence IDs must remain consistent.

Examples may include identifiers such as:

- W01
- W02
- C04
- E03

Do not casually rename IDs if doing so could break anchors, filters, or cross-references.

If ranges are displayed, such as:

> W01–W05

make sure users can actually reach all items represented by that range.

Preferred options:

- link each item individually, or
- link the full range to a filtered evidence view

Do not create dead or fake anchors.

---

## Cross-linking

Dense research sections should connect to plain-language sections and vice versa.

Preferred navigation flow:

**Overview topic → proposed request → evidence → source**

and:

**Evidence → related safeguard → related plain-language topic**

Avoid leaving users trapped in a highly technical section with no path back to context.

---

## Content editing rules

When editing existing content:

### Do

- improve hierarchy
- shorten repetitive explanations
- add plain-English summaries
- improve navigation
- clarify decision paths
- consolidate duplicate content
- normalize formatting
- preserve citations
- preserve evidence status
- reuse existing verified explanations
- centralize repeated data where practical

### Do not

- invent new factual claims
- speculate about project motives
- state unsupported legal conclusions
- remove meaningful qualifications
- rewrite applicant claims as objective fact
- assume an unlocated document does not exist
- merge unrelated government processes
- imply project approval based solely on rezoning
- imply project rejection because a safeguard is unverified
- use reviewer feedback as evidence

---

## Tone

The site should be:

- independent
- factual
- skeptical without being sensational
- understandable to non-specialists
- transparent about uncertainty
- precise about who said what
- neutral on whether the project should ultimately proceed

Avoid:

- advocacy slogans
- alarmist language
- corporate promotional language
- bureaucratic jargon when a plain-English explanation can come first

The goal is to make the public record understandable, not to tell residents what conclusion to reach.

---

## Development conventions

Before making substantial changes:

1. Locate the components/pages involved.
2. Locate the underlying data source.
3. Check whether information is duplicated elsewhere.
4. Prefer reusable data and components where practical.
5. Avoid introducing a second source of truth.

For recurring concepts, prefer shared structures for:

- deadlines
- decision types
- status labels
- evidence links
- topic mappings
- proposed requests

Examples of reusable UI patterns may include:

- `DecisionBadge`
- `StatusBadge`
- `EvidenceLink`
- `ProposedRequest`
- `TopicLink`

Use the existing architecture rather than forcing these names if equivalent components already exist.

---

## Before completing a task

Check for:

- broken internal links
- broken evidence anchors
- inconsistent evidence IDs
- duplicated dates
- contradictory labels
- removed qualifiers
- unsupported authority claims
- mobile layout issues
- keyboard/focus accessibility
- accidental changes to source URLs

If factual uncertainty remains, do not guess.

Report it.

---

## Final implementation report

After substantial work, summarize:

- files changed
- UX changes
- content changes
- shared components/data introduced
- factual wording that was preserved
- unresolved mappings
- discrepancies requiring human review
- TODO items requiring confirmation

When uncertain, prefer:

> Needs human verification.

over inventing an answer.
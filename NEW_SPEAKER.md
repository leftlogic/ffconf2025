# Adding a New Speaker to ffconf2025

This guide describes the steps and required information for an AI agent to add a new speaker to the ffconf2025 website. Follow these instructions to ensure consistency and completeness.

## Required Information from the User

- **Speaker Name**
- **Talk Title**
- **Talk Description**
- **Speaker Image URL** (e.g. `/assets/speakers/NAME-duo.jpg`)
- **Tags** (comma-separated, e.g. `#web, #ai`)
- **The Person** (short bio or story)
- **On the Web** (optional: links to website, social, etc.)

## Steps to Add a New Speaker

### 1. Create the Speaker's HTML Page
- Duplicate an existing speaker page (e.g. `hannah.html`).
  - **Be sure to copy the full `<head>` section, including all meta tags, icons, fonts, analytics scripts, and stylesheets.**
- Update the following:
  - Speaker image
  - Speaker name
  - Talk title
  - "The Topic" section (description)
  - Tags
  - "The Person" section
  - "On the web" section (if provided)
- Save as `NAME.html` (lowercase, hyphens for spaces).

### 2. Update `index.html`
- Add a new `<li>` inside `<ul class="sessions">` for the speaker:
  - Use the same structure as other speakers.
  - Link the talk title to the new speaker page.
  - Include the speaker name, description, and tags.
  - Set `data-speaker` to the speaker's identifier (usually lowercase name).
  - Example:
    ```html
    <li class="ffconf-session boxed" data-id="X" data-order="X" id="X">
      <div class="details">
        <h3><a href="/NAME.html">TALK TITLE</a></h3>
        <p class="speaker-name">A talk by SPEAKER NAME</p>
        <p>TALK DESCRIPTION</p>
        <p class="tags">TAGS</p>
      </div>
      <div data-speaker="NAME" class="speaker-image">
        <div></div>
      </div>
    </li>
    ```
- Place the new `<li>` before the "more speakers" info item.

### 3. Update `style.css`
- Add a new rule for the speaker image:
  ```css
  [data-speaker='NAME'] {
    --p-image-url: url(/assets/speakers/NAME-duo.jpg);
  }
  ```
- Place this with the other `[data-speaker='...']` rules.

### 4. (Optional) Add Speaker Links
- In the speaker's HTML page, add an "On the web" section:
  ```html
  <p>On the web: <a href="LINK1">Website</a>, <a href="LINK2">Social</a></p>
  ```

## Checklist
- [ ] Speaker HTML page created and filled out
- [ ] Session added to `index.html` in the correct place
- [ ] CSS updated for speaker image
- [ ] "On the web" links included if provided

---

**Note:**
- Always check for manual edits before making changes.
- Use the same structure and formatting as existing speakers.
- Confirm all required information is provided by the user before proceeding.

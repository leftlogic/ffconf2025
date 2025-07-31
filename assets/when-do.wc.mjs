/**
 * Remy Sharp
 * MIT
 *
 * Designed initially for the purpose of moving through a conference schedule
 * and also display elements, such as "buy buttons" for events
 *
 * 2023-07-14
 * - supports show, hide and scroll into view
 * 2025-07-31
 * - supports show="timestamp" and hide="timestamp" properties for time-based visibility
 * - show+hide: visible only between timestamps
 * - show only: hidden until timestamp passes
 * - hide only: visible until timestamp passes
 */

/**
 * @readonly
 * @enum {string}
 */
const DO_OPTIONS = {
  SHOW: 'show',
  HIDE: 'hide',
  SCROLL: 'scroll', // special state that assumes it's visible, and when it ticks
};

/**
 *
 * @param {string} s
 * @returns { { from: number, until: number }[] }
 */
function parse(s) {
  const dates = s.split(',').map((_) => _.trim());

  const isValid = (d) => d instanceof Date && !isNaN(d);

  return dates.map((_) => {
    const [a, b = Infinity] = _.split(/\s+/).map((_) => {
      if (_.trim() === '') return undefined;
      const d = new Date(_);

      if (!isValid(d)) {
        throw new Error(`Cannot parse the following timestamp: "${_}"`);
      }

      return d;
    });

    return { from: a.getTime(), until: b };
  });
}

/** @type {WhenDo[]} */
const whenables = [];

setInterval(() => {
  // FIXME - go through "whenables" in order of timestamp
  for (let i = 0; i < whenables.length; i++) {
    const when = whenables[i];
    
    if (when.useTimestampLogic) {
      // New timestamp-based logic: show/hide based on shouldBeVisible
      if (when.shouldBeVisible()) {
        when.show();
      } else {
        when.hide();
      }
    } else {
      // Legacy datetime/do attribute logic
      const inRange = when.inRange();

      if (inRange) {
        when[when.do]();
      } else {
        when[when.do === DO_OPTIONS.HIDE ? DO_OPTIONS.SHOW : DO_OPTIONS.HIDE]();
      }
    }
  }
}, 1000);

class WhenDo extends HTMLElement {
  state = undefined;
  triggered = false;

  constructor() {
    const ref = super();

    // Check for new show/hide timestamp attributes
    const showAttr = this.attributes.show?.value;
    const hideAttr = this.attributes.hide?.value;

    if (showAttr || hideAttr) {
      // New timestamp-based visibility logic
      this.showTimestamp = showAttr ? new Date(showAttr).getTime() : null;
      this.hideTimestamp = hideAttr ? new Date(hideAttr).getTime() : null;
      this.useTimestampLogic = true;
    } else {
      // Legacy datetime/do attribute logic
      /** @type {keyof typeof DO_OPTIONS} */
      this.do = this.attributes.do.value || DO_OPTIONS.SHOW;

      if (
        ![DO_OPTIONS.SHOW, DO_OPTIONS.HIDE, DO_OPTIONS.SCROLL].includes(this.do)
      ) {
        throw new Error(
          `when-do "do" property requires either "show", "hide" or "scroll"`
        );
      }

      if (this.attributes.datetime?.value) {
        this.dates = parse(this.attributes.datetime.value);
      }

      this.useTimestampLogic = false;
    }

    // FIXME queue up the animations/scroll from boot time

    if (this.shouldBeVisible()) {
      this.show();
    } else {
      this.hide();
    }

    whenables.push(ref);
  }

  shouldBeVisible() {
    if (this.useTimestampLogic) {
      const now = Date.now();
      
      // If both show and hide are set: show only between the time window
      if (this.showTimestamp && this.hideTimestamp) {
        return now >= this.showTimestamp && now < this.hideTimestamp;
      }
      
      // If only show is set: hidden until timestamp passes
      if (this.showTimestamp && !this.hideTimestamp) {
        return now >= this.showTimestamp;
      }
      
      // If only hide is set: shown until timestamp passes
      if (!this.showTimestamp && this.hideTimestamp) {
        return now < this.hideTimestamp;
      }
      
      return false;
    } else {
      // Legacy logic: use inRange with do attribute
      return this.inRange();
    }
  }

  inRange() {
    const now = Date.now();

    let res = false;

    for (let i = 0; i < this.dates.length; i++) {
      const { from, until } = this.dates[i];
      if (now >= from && from < until) {
        res = true;
        break;
      }
    }

    return res;
  }

  checkTriggered() {
    if (this.triggered === false) {
      this.triggered = true;
      if (this.attributes.apply) {
        this.classList.add(this.attributes.apply.value);
      }
    }
  }

  scroll() {
    if (this.state === DO_OPTIONS.SCROLL) return; // nop
    this.show();
    if (this.firstElementChild) {
      this.firstElementChild.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    }

    this.state = DO_OPTIONS.SCROLL;
    this.checkTriggered();
  }

  show() {
    if (this.state === DO_OPTIONS.SHOW) return; // nop
    this.setAttribute('style', 'display: contents');
    this.state = DO_OPTIONS.SHOW;
    this.checkTriggered();
  }

  hide() {
    if (this.state === DO_OPTIONS.HIDE) return; // nop
    this.setAttribute('style', 'display: none');
    this.state = DO_OPTIONS.HIDE;
    this.checkTriggered();
  }
}

customElements.define('when-do', WhenDo);

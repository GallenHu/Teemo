export default class ScrollUtils {
  private lastScrollTime = 0;
  private throttleDelay = 800;
  private el: HTMLElement | null = null;
  private userScrollEvent?: (direction: 'up' | 'down') => void;

  constructor(el: HTMLElement | null, scrollEvent: (direction: 'up' | 'down') => void) {
    this.el = el;
    this.userScrollEvent = scrollEvent;

    if (el) {
      el.addEventListener('wheel', this.throttledScroll.bind(this));
    }

    return this;
  }

  private throttledScroll(e: WheelEvent) {
    const now = Date.now();
    if (now - this.lastScrollTime >= this.throttleDelay) {
      // execute the scroll function
      this.scroll(e);
      this.lastScrollTime = now;
    }
  }

  private scroll(e: WheelEvent) {
    const direction = e.deltaY > 0 ? 'down' : 'up';

    this.userScrollEvent && this.userScrollEvent(direction);
  }

  public destroy() {
    this.el?.removeEventListener('wheel', this.throttledScroll);
  }
}

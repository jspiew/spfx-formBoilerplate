import * as React from "react";

const container = document.querySelector("#spPageChromeAppDiv div[class*='pageLayout_']> div > div") as HTMLElement;

export function NavAnchor<T>(props: { field: keyof T}) {
  return (
    <a id={`navAnchor_${props.field}`}/>
  );
}

export function navigate<T>(field: keyof T) {
  const navNode = document.getElementById(`navAnchor_${field}`);

  scrollTo(container, navNode.offsetTop - 30, 150);
}

function scrollTo(element: HTMLElement, to: number, duration: number) {
    const start = element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 10;

    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) { return c / 2 * t * t + b; }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animateScroll = () => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
}

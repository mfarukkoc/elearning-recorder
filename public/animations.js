AOS.init(); // animate on scroll initializiton

//Auto hiding scroll-bar animation

// add padding top to show content behind navbar

document.body.style.paddingTop =
  document.querySelector(".navbar").offsetHeight + 6 + "px";

// check if element exists
if (document.querySelector(".smart-scroll")) {
  // detect scroll top or down
  let last_scroll_top = 0;
  document.addEventListener("scroll", (e) => {
    let scroll_top = window.scrollY;
    if (scroll_top < last_scroll_top) {
      document.querySelector(".smart-scroll").classList.remove("scrolled-down");
      document.querySelector(".smart-scroll").classList.add("scrolled-up");
    } else {
      document.querySelector(".smart-scroll").classList.remove("scrolled-up");
      document.querySelector(".smart-scroll").classList.add("scrolled-down");
    }
    last_scroll_top = scroll_top;
  });
}

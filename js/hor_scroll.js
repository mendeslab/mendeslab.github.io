const track = document.getElementById("image-track");

// Calculates the maximum scroll percentage dynamically based on actual
// element dimensions. Uses offsetWidth (visible width) as the divisor
// because translate() percentages are relative to the element's own
// rendered width, not its scroll width.
function getMaxScroll() {
    const totalWidth = track.scrollWidth;
    const visibleWidth = track.offsetWidth;
    return -((totalWidth - visibleWidth) / visibleWidth * 100);
}

// ============================================================
// MOUSE EVENTS (desktop)
// ============================================================

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = e => {
    // If mouse barely moved, treat as a click — don't interfere
    const delta = Math.abs(parseFloat(track.dataset.mouseDownAt) - e.clientX);
    if (delta < 5) {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
        return;
    }
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = e => {
    if (track.dataset.mouseDownAt === "0") return;
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), getMaxScroll());
    track.dataset.percentage = nextPercentage;
    track.animate({
        transform: `translate(${nextPercentage}%, 0%)`
    }, { duration: 1200, fill: "forwards" });
    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}

// ============================================================
// TOUCH EVENTS (mobile/tablet)
// Mirror the mouse logic using e.touches[0].clientX for finger position.
// ============================================================

window.addEventListener("touchstart", e => {
    track.dataset.mouseDownAt = e.touches[0].clientX;
});

window.addEventListener("touchend", e => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
});

window.addEventListener("touchmove", e => {
    if (track.dataset.mouseDownAt === "0") return;
    const touchDelta = parseFloat(track.dataset.mouseDownAt) - e.touches[0].clientX,
        maxDelta = window.innerWidth / 2;
    const percentage = (touchDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), getMaxScroll());
    track.dataset.percentage = nextPercentage;
    track.animate({
        transform: `translate(${nextPercentage}%, 0%)`
    }, { duration: 1200, fill: "forwards" });
    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
    }
});

// ============================================================
// RESIZE HANDLER
// Resets scroll position when the window is resized, since
// percentages are relative to element width which changes
// with the viewport.
// ============================================================

window.addEventListener("resize", () => {
    track.dataset.percentage = "0";
    track.dataset.prevPercentage = "0";
    track.dataset.mouseDownAt = "0";
    track.animate({
        transform: `translate(0%, 0%)`
    }, { duration: 300, fill: "forwards" });
    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `100% center`
        }, { duration: 300, fill: "forwards" });
    }
});

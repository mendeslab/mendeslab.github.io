const track = document.getElementById("image-track");

// ============================================================
// MOUSE EVENTS (desktop)
// ============================================================

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
    track.dataset.mouseMoved = "false";
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
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
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
// Touch events mirror the mouse logic but use e.touches[0].clientX
// to get the finger's horizontal position.
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
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

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

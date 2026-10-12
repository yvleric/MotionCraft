// Initialize Locomotive Scroll with responsive configurations
const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    smartphone: {
        smooth: false
    },
    tablet: {
        smooth: false
    }
});

// Update scroll calculations after images and content load
window.addEventListener("load", function () {
    scroll.update();
});

let resizeTimer;
window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        scroll.update();
    }, 200);
});

function videoconAnimation() {
    const videocon = document.querySelector("#video-container");
    const playbtn = document.querySelector("#play");
    const video = videocon.querySelector("video");

    const isHoverDevice = () => window.matchMedia("(min-width: 769px) and (hover: hover) and (pointer: fine)").matches;

    // Desktop hover & cursor follow animation
    videocon.addEventListener("mouseenter", function () {
        if (!isHoverDevice()) return;
        gsap.to(playbtn, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    videocon.addEventListener("mouseleave", function () {
        if (!isHoverDevice()) return;
        gsap.to(playbtn, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    videocon.addEventListener("mousemove", function (dets) {
        if (!isHoverDevice()) return;
        gsap.to(playbtn, {
            left: dets.clientX,
            top: dets.clientY,
            duration: 0.15,
            ease: "power1.out"
        });
    });

    // Tap/Click interaction to toggle play/pause
    videocon.addEventListener("click", function () {
        if (video.paused) {
            video.play();
            playbtn.textContent = "PAUSE";
        } else {
            video.pause();
            playbtn.textContent = "PLAY";
        }

        // On mobile, keep text synced
        if (!isHoverDevice()) {
            gsap.fromTo(playbtn, { scale: 0.85 }, { scale: 1, duration: 0.25, ease: "back.out(2)" });
        }
    });
}
videoconAnimation();

function loadingAnimation() {
    gsap.from("#page1 h1", {
        y: 80,
        opacity: 0,
        delay: 0.3,
        duration: 0.9,
        stagger: 0.25,
        ease: "power3.out"
    });

    gsap.from("#page1 #video-container", {
        scale: 0.94,
        opacity: 0,
        delay: 1.0,
        duration: 0.7,
        ease: "power2.out"
    });
}
loadingAnimation();
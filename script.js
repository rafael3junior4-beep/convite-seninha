// ========================================
// STRAWBERRY LETTER — SCRIPT FINAL
// ========================================

"use strict";

// ========================================
// ELEMENTOS DO HTML
// ========================================

const elements = {
    intro: document.getElementById("intro"),
    introTitle: document.getElementById("introTitle"),
    mainCard: document.getElementById("mainCard"),
    btnYes: document.getElementById("yes"),
    btnNo: document.getElementById("no"),
    catDance: document.getElementById("catDance"),
    bgMusic: document.getElementById("bgMusic"),
    musicControl: document.getElementById("musicControl"),
    matchingPictures: document.getElementById("matchingPictures"),
    successScreen: document.getElementById("successScreen"),
    openLetter: document.getElementById("openLetter"),
    letterScreen: document.getElementById("letterScreen"),
    closeLetter: document.getElementById("closeLetter")
};

const {
    intro,
    introTitle,
    mainCard,
    btnYes,
    btnNo,
    catDance,
    bgMusic,
    musicControl,
    matchingPictures,
    successScreen,
    openLetter,
    letterScreen,
    closeLetter
} = elements;

// ========================================
// VERIFICAÇÃO DOS ELEMENTOS
// ========================================

const missingElements = Object.entries(elements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

if (missingElements.length > 0) {
    console.error(
        "❌ Elementos não encontrados no HTML:",
        missingElements
    );
} else {
    console.log(
        "🍓 Todos os elementos principais foram encontrados."
    );
}

// ========================================
// CONFIGURAÇÕES
// ========================================

const INTRO_TEXTS = [
    "Oi, Seninha...",
    "Desde que pensei em te fazer um convite...",
    "Queria que fosse de um jeito especial...",
    "Então fiz esse cantinho só para você. 💜"
];

const NO_BUTTON_TEXTS = [
    "Tem certeza? 🥺",
    "Pensa mais um pouquinho 🍓",
    "O Sim parece melhor 😸",
    "Quase conseguiu 😂",
    "Nem tenta 😭"
];

const TIMINGS = {
    typing: 80,
    phrasePause: 1300,
    introFade: 1500,
    cardFade: 700,
    catShow: 2400,
    successShow: 5700
};

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

let invitationAccepted = false;
let noTextIndex = 0;
let volumeIntervalId = null;
let lastFocusedElement = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function wait(milliseconds) {
    return new Promise((resolve) => {
        window.setTimeout(
            resolve,
            milliseconds
        );
    });
}

function showMainCard() {
    if (!mainCard) {
        return;
    }

    mainCard.classList.add(
        "is-visible"
    );

    mainCard.classList.remove(
        "is-leaving"
    );

    matchingPictures?.classList.add(
        "visible"
    );
}

function hideIntro() {
    if (!intro) {
        showMainCard();
        return;
    }

    intro.classList.add(
        "is-hidden"
    );

    window.setTimeout(() => {
        intro.hidden = true;

        showMainCard();
    }, prefersReducedMotion
        ? 20
        : TIMINGS.introFade
    );
}

// ========================================
// INTRODUÇÃO COM DIGITAÇÃO
// ========================================

async function runIntro() {
    if (!intro || !introTitle) {
        showMainCard();
        return;
    }

    if (prefersReducedMotion) {
        introTitle.textContent =
            INTRO_TEXTS.at(-1);

        await wait(400);

        hideIntro();

        return;
    }

    for (const text of INTRO_TEXTS) {
        introTitle.textContent = "";

        for (const character of text) {
            introTitle.textContent +=
                character;

            await wait(
                TIMINGS.typing
            );
        }

        await wait(
            TIMINGS.phrasePause
        );
    }

    hideIntro();
}

// ========================================
// ESTRELAS
// ========================================

function createStars(quantity = 45) {
    const fragment =
        document.createDocumentFragment();

    for (
        let index = 0;
        index < quantity;
        index++
    ) {
        const star =
            document.createElement("span");

        star.className = "star";
        star.textContent = "✦";

        star.setAttribute(
            "aria-hidden",
            "true"
        );

        star.style.left =
            `${Math.random() * 100}vw`;

        star.style.top =
            `${Math.random() * 100}vh`;

        star.style.fontSize =
            `${Math.random() * 10 + 7}px`;

        star.style.animationDuration =
            `${Math.random() * 4 + 2}s`;

        star.style.animationDelay =
            `${Math.random() * 3}s`;

        fragment.appendChild(
            star
        );
    }

    document.body.appendChild(
        fragment
    );
}

// ========================================
// BOTÃO “NÃO” FUGINDO
// ========================================

function moveNoButton() {
    if (!btnNo || invitationAccepted) {
        return;
    }

    const margin = 20;
    const buttonWidth = btnNo.offsetWidth;
    const buttonHeight = btnNo.offsetHeight;

    const availableWidth =
        window.innerWidth - buttonWidth - margin * 2;

    const availableHeight =
        window.innerHeight - buttonHeight - margin * 2;

    const x =
        margin + Math.random() * Math.max(availableWidth, 0);

    const y =
        margin + Math.random() * Math.max(availableHeight, 0);

    btnNo.style.position = "fixed";
    btnNo.style.zIndex = "10000";
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;

    btnNo.textContent =
        NO_BUTTON_TEXTS[noTextIndex];

    noTextIndex =
        (noTextIndex + 1) %
        NO_BUTTON_TEXTS.length;
}

function keepNoButtonInsideViewport() {
    if (
        !btnNo ||
        btnNo.style.position !==
        "fixed"
    ) {
        return;
    }

    const margin = 16;

    const rect =
        btnNo.getBoundingClientRect();

    const x = Math.min(
        Math.max(
            rect.left,
            margin
        ),
        window.innerWidth -
        rect.width -
        margin
    );

    const y = Math.min(
        Math.max(
            rect.top,
            margin
        ),
        window.innerHeight -
        rect.height -
        margin
    );

    btnNo.style.left =
        `${Math.max(
            margin,
            x
        )}px`;

    btnNo.style.top =
        `${Math.max(
            margin,
            y
        )}px`;
}

// ========================================
// PARTÍCULAS
// ========================================

function createCelebrationRain() {
    const particles = [
        "🍓",
        "🍓",
        "🍓",
        "🍓",
        "🍓",
        "🍓",
        "✨",
        "✨",
        "🌸"
    ];

    const total =
        prefersReducedMotion
            ? 18
            : 55;

    for (
        let index = 0;
        index < total;
        index++
    ) {
        window.setTimeout(() => {
            const particle =
                document.createElement(
                    "span"
                );

            particle.className =
                "celebration-particle";

            particle.setAttribute(
                "aria-hidden",
                "true"
            );

            particle.textContent =
                particles[
                    Math.floor(
                        Math.random() *
                        particles.length
                    )
                ];

            particle.style.left =
                `${Math.random() * 100}vw`;

            particle.style.fontSize =
                `${18 +
                Math.random() * 22}px`;

            particle.style.animationDuration =
                `${4 +
                Math.random() * 4}s`;

            document.body.appendChild(
                particle
            );

            particle.addEventListener(
                "animationend",
                () => {
                    particle.remove();
                },
                {
                    once: true
                }
            );

            window.setTimeout(() => {
                particle.remove();
            }, 10000);

        }, index * 45);
    }
}

// ========================================
// MÚSICA
// ========================================

function updateMusicControl() {
    if (
        !musicControl ||
        !bgMusic
    ) {
        return;
    }

    const paused =
        bgMusic.paused;

    musicControl.textContent =
        paused
            ? "🔇"
            : "🔊";

    musicControl.setAttribute(
        "aria-label",
        paused
            ? "Continuar música"
            : "Pausar música"
    );

    musicControl.setAttribute(
        "aria-pressed",
        String(paused)
    );
}

async function playMusic(
    initialVolume = 0.25
) {
    if (!bgMusic) {
        return false;
    }

    try {
        bgMusic.volume =
            initialVolume;

        await bgMusic.play();

        musicControl?.classList.add(
            "is-visible"
        );

        updateMusicControl();

        console.log(
            "🎵 Música iniciada."
        );

        return true;

    } catch (error) {
        console.error(
            "❌ Não foi possível tocar a música:",
            error
        );

        return false;
    }
}

function increaseMusicVolume(
    targetVolume,
    duration
) {
    if (!bgMusic) {
        return;
    }

    if (
        volumeIntervalId !== null
    ) {
        window.clearInterval(
            volumeIntervalId
        );
    }

    const finalVolume =
        Math.min(
            Math.max(
                targetVolume,
                0
            ),
            1
        );

    const initialVolume =
        bgMusic.volume;

    const difference =
        finalVolume -
        initialVolume;

    const steps = 30;

    const intervalTime =
        Math.max(
            16,
            duration / steps
        );

    let currentStep = 0;

    volumeIntervalId =
        window.setInterval(() => {
            currentStep += 1;

            const progress =
                currentStep / steps;

            bgMusic.volume =
                Math.min(
                    Math.max(
                        initialVolume +
                        difference *
                        progress,
                        0
                    ),
                    1
                );

            if (
                currentStep >= steps
            ) {
                window.clearInterval(
                    volumeIntervalId
                );

                volumeIntervalId =
                    null;

                bgMusic.volume =
                    finalVolume;
            }

        }, intervalTime);
}

async function toggleMusic() {
    if (!bgMusic) {
        return;
    }

    if (bgMusic.paused) {
        try {
            await bgMusic.play();

        } catch (error) {
            console.error(
                "Não foi possível continuar a música:",
                error
            );
        }

    } else {
        bgMusic.pause();
    }

    updateMusicControl();
}

// ========================================
// ACEITAR CONVITE
// ========================================
async function restartCatGif() {
    const originalPath =
        catDance.dataset.originalSrc ||
        catDance.getAttribute("src");

    if (!originalPath) {
        return;
    }

    catDance.dataset.originalSrc =
        originalPath.split("?")[0];

    catDance.classList.remove(
        "is-visible"
    );

    catDance.style.display = "none";

    const freshGifUrl =
        `${catDance.dataset.originalSrc}?restart=${Date.now()}`;

    catDance.removeAttribute("src");

    void catDance.offsetWidth;

    catDance.setAttribute(
        "src",
        freshGifUrl
    );

    catDance.onload = () => {
        catDance.style.display = "";

        requestAnimationFrame(() => {
            catDance.classList.add(
                "is-visible"
            );
        });
    };


    const gifPath =
        catDance.currentSrc ||
        catDance.getAttribute(
            "src"
        );

    if (!gifPath) {
        return;
    }

    catDance.classList.remove(
        "is-visible"
    );

    catDance.setAttribute(
        "src",
        ""
    );

    requestAnimationFrame(() => {
        catDance.setAttribute(
            "src",
            gifPath
        );

        catDance.classList.add(
            "is-visible"
        );
    });
}

async function acceptInvitation() {
    if (invitationAccepted) {
        return;
    }

    invitationAccepted =
        true;

    if (btnYes) {
        btnYes.disabled =
            true;
    }

    if (btnNo) {
        btnNo.disabled =
            true;

        btnNo.style.opacity =
            "0";

        btnNo.style.pointerEvents =
            "none";
    }

    await playMusic(0.25);

    mainCard?.classList.add(
        "is-leaving"
    );

    createCelebrationRain();

    window.setTimeout(() => {
        mainCard?.classList.remove(
            "is-visible"
        );

        mainCard?.classList.remove(
            "is-leaving"
        );

        matchingPictures?.classList.add(
            "joined"
        );

        if (!prefersReducedMotion) {
            increaseMusicVolume(
                0.52,
                1800
            );

        } else if (bgMusic) {
            bgMusic.volume =
                0.52;
        }

    }, prefersReducedMotion
        ? 20
        : TIMINGS.cardFade
    );

    window.setTimeout(
        restartCatGif,
        prefersReducedMotion
            ? 200
            : TIMINGS.catShow
    );

    window.setTimeout(() => {
        catDance?.classList.remove(
            "is-visible"
        );

        matchingPictures?.classList.add(
            "background-mode"
        );

        successScreen?.classList.add(
            "is-visible"
        );

        openLetter?.focus({
            preventScroll: true
        });

    }, prefersReducedMotion
        ? 900
        : TIMINGS.successShow
    );
}

// ========================================
// CARTINHA
// ========================================

function openLetterModal() {
    if (!letterScreen) {
        return;
    }

    lastFocusedElement =
        document.activeElement;

    letterScreen.classList.add(
        "is-visible"
    );

    letterScreen.setAttribute(
        "aria-hidden",
        "false"
    );

    if (successScreen) {
        successScreen.style.opacity =
            "0.45";
    }

    document.body.classList.add(
        "letter-open"
    );

    closeLetter?.focus({
        preventScroll: true
    });
}

function closeLetterModal() {
    if (!letterScreen) {
        return;
    }

    letterScreen.classList.remove(
        "is-visible"
    );

    letterScreen.setAttribute(
        "aria-hidden",
        "true"
    );

    if (successScreen) {
        successScreen.style.opacity =
            "1";
    }

    document.body.classList.remove(
        "letter-open"
    );

    if (
        lastFocusedElement
        instanceof
        HTMLElement
    ) {
        lastFocusedElement.focus({
            preventScroll: true
        });
    }
}

function trapFocus(event) {
    if (
        event.key !== "Tab" ||
        !letterScreen?.classList.contains(
            "is-visible"
        )
    ) {
        return;
    }

    const focusable =
        letterScreen.querySelectorAll(
            `
            button,
            [href],
            input,
            select,
            textarea,
            [tabindex]:not([tabindex="-1"])
            `
        );

    if (
        focusable.length === 0
    ) {
        return;
    }

    const first =
        focusable[0];

    const last =
        focusable[
            focusable.length - 1
        ];

    if (
        event.shiftKey &&
        document.activeElement ===
        first
    ) {
        event.preventDefault();

        last.focus();

    } else if (
        !event.shiftKey &&
        document.activeElement ===
        last
    ) {
        event.preventDefault();

        first.focus();
    }
}

// ========================================
// EVENTOS
// ========================================

btnNo?.addEventListener(
    "mouseenter",
    moveNoButton
);
btnNo?.addEventListener(
    "touchstart",
    (event) => {
        event.preventDefault();

        moveNoButton();
    },
    {
        passive: false
    }
);

btnYes?.addEventListener(
    "click",
    acceptInvitation
);

openLetter?.addEventListener(
    "click",
    openLetterModal
);

closeLetter?.addEventListener(
    "click",
    closeLetterModal
);

musicControl?.addEventListener(
    "click",
    toggleMusic
);

letterScreen?.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            letterScreen
        ) {
            closeLetterModal();
        }
    }
);

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            letterScreen?.classList.contains(
                "is-visible"
            )
        ) {
            closeLetterModal();
        }

        trapFocus(event);
    }
);

window.addEventListener(
    "resize",
    keepNoButtonInsideViewport
);

bgMusic?.addEventListener(
    "play",
    updateMusicControl
);

bgMusic?.addEventListener(
    "pause",
    updateMusicControl
);

bgMusic?.addEventListener(
    "canplaythrough",
    () => {
        console.log(
            "✅ Arquivo de música carregado."
        );
    }
);

bgMusic?.addEventListener(
    "error",
    () => {
        console.error(
            "❌ Erro ao carregar o arquivo de música.",
            bgMusic.error
        );
    }
);

// ========================================
// INICIALIZAÇÃO
// ========================================

function initializeSite() {
    catDance?.classList.remove(
        "is-visible"
    );

    successScreen?.classList.remove(
        "is-visible"
    );

    letterScreen?.classList.remove(
        "is-visible"
    );

    letterScreen?.setAttribute(
        "aria-hidden",
        "true"
    );

    musicControl?.classList.remove(
        "is-visible"
    );

    createStars(
        prefersReducedMotion
            ? 20
            : 45
    );

    runIntro();
}

initializeSite();
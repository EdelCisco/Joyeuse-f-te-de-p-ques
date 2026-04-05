// Liste des messages affiches tour a tour dans la carte de benediction.
const messagesBenediction = [
    "Aujourd'hui, la lumiere renait et rappelle que les plus belles victoires commencent dans le cœur.",
    "Que cette fete vous apporte une paix profonde, une joie sincere et un courage neuf pour demain.",
    "Paques nous rappelle qu'apres l'ombre, la vie sait toujours refleurir avec eclat.",
    "Recevez ce jour comme une promesse: l'amour peut relever, restaurer et faire naitre un nouveau depart."
];

// Recuperation des elements que le script va manipuler.
const elementTexteBenediction = document.querySelector("#texte-benediction");
const elementsApparition = document.querySelectorAll(".apparition");
const couchePetales = document.querySelector(".petales-flottants");
const prefereMouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let indexMessageActif = 0;

// Remplace le texte de benediction avec ou sans animation selon le navigateur.
function afficherBenediction(index) {
    if (!elementTexteBenediction) {
        return;
    }

    const nouveauMessage = messagesBenediction[index];

    if (prefereMouvementReduit || typeof elementTexteBenediction.animate !== "function") {
        elementTexteBenediction.textContent = nouveauMessage;
        return;
    }

    const animationSortie = elementTexteBenediction.animate(
        [
            { opacity: 1, transform: "translateY(0px)" },
            { opacity: 0, transform: "translateY(12px)" }
        ],
        {
            duration: 280,
            fill: "forwards",
            easing: "ease"
        }
    );

    animationSortie.onfinish = () => {
        elementTexteBenediction.textContent = nouveauMessage;
        elementTexteBenediction.animate(
            [
                { opacity: 0, transform: "translateY(-12px)" },
                { opacity: 1, transform: "translateY(0px)" }
            ],
            {
                duration: 360,
                fill: "forwards",
                easing: "ease"
            }
        );
    };
}

// Lance le changement automatique du message si l'utilisateur accepte les animations.
function lancerRotationBenediction() {
    if (!elementTexteBenediction || prefereMouvementReduit) {
        return;
    }

    window.setInterval(() => {
        indexMessageActif = (indexMessageActif + 1) % messagesBenediction.length;
        afficherBenediction(indexMessageActif);
    }, 4200);
}

// Anime les nombres des cartes pour leur donner un effet plus vivant.
function animerCompteur(elementCompteur) {
    const cible = Number(elementCompteur.dataset.cible || 0);

    if (prefereMouvementReduit) {
        elementCompteur.textContent = String(cible);
        return;
    }

    const duree = 1600;
    const debut = performance.now();

    function mettreAJour(maintenant) {
        const progression = Math.min((maintenant - debut) / duree, 1);
        const progressionAdoucie = 1 - Math.pow(1 - progression, 3);
        elementCompteur.textContent = String(Math.round(cible * progressionAdoucie));

        if (progression < 1) {
            requestAnimationFrame(mettreAJour);
        }
    }

    requestAnimationFrame(mettreAJour);
}

// Rend un bloc visible et demarre son compteur si la carte en contient un.
function revelerElement(element) {
    element.classList.add("est-visible");

    if (!element.classList.contains("carte-instant")) {
        return;
    }

    const elementCompteur = element.querySelector(".nombre-instant");
    if (elementCompteur && !elementCompteur.dataset.anime) {
        elementCompteur.dataset.anime = "true";
        animerCompteur(elementCompteur);
    }
}

// Observe les elements qui doivent apparaitre au scroll.
function configurerApparitions() {
    if (!("IntersectionObserver" in window)) {
        elementsApparition.forEach(revelerElement);
        return;
    }

    const observateur = new IntersectionObserver(
        (entrees) => {
            entrees.forEach((entree) => {
                if (!entree.isIntersecting) {
                    return;
                }

                revelerElement(entree.target);
                observateur.unobserve(entree.target);
            });
        },
        {
            threshold: 0.2
        }
    );

    elementsApparition.forEach((element) => observateur.observe(element));
}

// Cree un petale decoratif avec une position et une vitesse aleatoires.
function creerPetale() {
    if (!couchePetales || prefereMouvementReduit) {
        return;
    }

    const petale = document.createElement("span");
    const couleursPetales = ["#ff9fb2", "#ffd17a", "#fff2a6", "#a7df9f"];

    petale.className = "petale";
    petale.style.left = `${Math.random() * 100}%`;
    petale.style.background = couleursPetales[Math.floor(Math.random() * couleursPetales.length)];
    petale.style.animationDuration = `${6 + Math.random() * 6}s`;
    petale.style.setProperty("--derive-horizontal", `${-120 + Math.random() * 240}px`);
    couchePetales.appendChild(petale);

    window.setTimeout(() => {
        petale.remove();
    }, 12000);
}

// Lance une pluie legere de petales decoratifs.
function lancerPetales() {
    if (!couchePetales || prefereMouvementReduit) {
        return;
    }

    for (let index = 0; index < 10; index += 1) {
        window.setTimeout(creerPetale, index * 260);
    }

    window.setInterval(creerPetale, 900);
}

// Demarrage general de la page.
configurerApparitions();
lancerRotationBenediction();
lancerPetales();

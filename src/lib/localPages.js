function block(style, text, markDefs = []) {
  return {
    _type: "block",
    _key: `${style}-${text.slice(0, 16)}`,
    style,
    markDefs,
    children: [{ _type: "span", _key: `${style}-span`, marks: [], text }],
  };
}

function linkBlock(textBefore, linkText, href, textAfter = "") {
  return {
    _type: "block",
    _key: `link-${linkText.slice(0, 12)}`,
    style: "normal",
    markDefs: [{ _key: "link-1", _type: "link", href }],
    children: [
      { _type: "span", _key: "before", marks: [], text: textBefore },
      { _type: "span", _key: "link", marks: ["link-1"], text: linkText },
      { _type: "span", _key: "after", marks: [], text: textAfter },
    ],
  };
}

export const LOCAL_PAGES = {
  "despre-noi": {
    title: "Despre noi",
    description:
      "Afla cum este construit Psihorelatii.ro, cum selectam temele si care sunt limitele continutului publicat.",
    body: [
      block("normal", "Psihorelatii.ro este un proiect editorial independent, construit pentru oameni care cauta explicatii clare despre relatii, atasament, reglare emotionala si dezvoltare personala."),
      block("h2", "Cum lucram"),
      block("normal", "Publicam ghiduri explicative, exemple practice si articole structurate usor de parcurs. Scopul nostru este sa transformam conceptele psihologice in informatii utile, accesibile si oneste."),
      block("h2", "Ce nu promitem"),
      block("normal", "Nu promitem vindecari rapide, diagnostice, retete universale sau rezultate garantate. Continutul are rol informativ si educational si nu inlocuieste evaluarea individuala facuta de un specialist acreditat."),
      block("h2", "Cum actualizam continutul"),
      block("normal", "Revizuim periodic articolele importante, corectam erorile raportate si rescriem materialele care nu mai sunt suficient de clare sau actuale."),
      block("h2", "Transparanta"),
      block("normal", "Marcăm separat continutul sponsorizat, colaborarile comerciale si eventualele linkuri de afiliere. Editorialul si monetizarea trebuie sa ramana distincte."),
      block("h2", "Contact"),
      linkBlock("Pentru intrebari, corectii sau propuneri editoriale, foloseste ", "pagina de contact", "https://psihorelatii.ro/contact", "."),
    ],
  },
  contact: {
    title: "Contact",
    description:
      "Trimite intrebari, corectii sau propuneri editoriale catre Psihorelatii.ro.",
    body: [
      block("normal", "Daca ai observat o eroare, un link stricat sau vrei sa ne trimiti o sugestie editoriala, ne poti scrie la adresa contact@psihorelatii.ro."),
      block("h2", "Pentru ce ne poti scrie"),
      block("normal", "Corectii factuale, solicitari privind drepturile de autor, propuneri de colaborare si intrebari generale despre continutul publicat."),
      block("h2", "Timp de raspuns"),
      block("normal", "Incercam sa raspundem in 1-3 zile lucratoare."),
      block("h2", "Nota importanta"),
      block("normal", "Mesajele trimise catre noi nu reprezinta sedinte de consiliere sau asistenta psihologica. In situatii urgente, cauta sprijin specializat local."),
    ],
  },
  disclaimer: {
    title: "Declinarea responsabilitatii",
    description:
      "Limitele continutului publicat pe Psihorelatii.ro si modul in care trebuie folosite informatiile de pe site.",
    body: [
      block("normal", "Psihorelatii.ro este un site informativ. Articolele publicate au scop educational si nu inlocuiesc sfatul personalizat oferit de un psiholog, psihoterapeut sau medic."),
      block("h2", "Limitele continutului"),
      block("normal", "Depunem eforturi pentru a publica materiale clare si corecte, dar nu garantam ca fiecare articol este complet sau potrivit pentru orice situatie individuala."),
      block("h2", "Deciziile utilizatorului"),
      block("normal", "Folosirea informatiilor de pe site se face pe propria raspundere. Daca traversati o situatie severa sau urgenta, solicitati sprijin profesionist."),
      block("h2", "Linkuri externe"),
      block("normal", "Putem face trimitere catre resurse externe utile, dar nu controlam continutul si politicile acelor site-uri."),
      block("h2", "Drepturi de autor"),
      block("normal", "Textele, imaginile si structura site-ului sunt protejate. Reproducerea integrala fara acord nu este permisa."),
    ],
  },
  "politica-afiliere": {
    title: "Politica de afiliere si reclame",
    description:
      "Cum tratam eventualele linkuri de afiliere, colaborarile comerciale si reclamele de pe Psihorelatii.ro.",
    body: [
      block("normal", "Pentru a sustine functionarea site-ului, unele pagini pot include linkuri de afiliere sau mentionari comerciale. Atunci cand exista un interes financiar, il semnalam cat mai clar."),
      block("h2", "Ce inseamna un link de afiliere"),
      block("normal", "Un link de afiliere poate genera un comision pentru site daca utilizatorul face o achizitie dupa accesarea lui. Pretul pentru utilizator nu ar trebui sa creasca din acest motiv."),
      block("h2", "Cum alegem recomandarile"),
      block("normal", "Nu publicam recomandari doar pentru comision. Prioritatea ramane relevanta pentru cititor si coerenta cu tema articolului."),
      block("h2", "Continut sponsorizat"),
      block("normal", "Daca publicam materiale sponsorizate, acestea trebuie marcate distinct fata de continutul editorial obisnuit."),
      block("h2", "Reclame automate"),
      block("normal", "Site-ul poate afisa in viitor reclame automate prin platforme terte. Prezenta acestor reclame nu inseamna recomandare editoriala individuala."),
    ],
  },
};

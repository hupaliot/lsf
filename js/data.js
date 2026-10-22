/* Contenu pédagogique de l'application.
 * Les descriptions de configurations manuelles sont indicatives : la référence
 * reste la vidéo (lien Elix) ou, mieux, une personne sourde qui signe. */

window.LSF_DATA = {
  lessons: [
    {
      id: "intro",
      title: "Qu'est-ce que la LSF ?",
      duration: "5 min",
      body: `
        <p>La <strong>Langue des Signes Française (LSF)</strong> est une langue à part entière,
        avec son propre vocabulaire et sa propre grammaire. Ce n'est <em>pas</em> du français
        traduit mot à mot avec les mains.</p>
        <p>Elle est <strong>visuelle et gestuelle</strong> : elle utilise les mains, mais aussi
        le regard, les expressions du visage, la posture et l'espace autour du corps.</p>
        <ul>
          <li>Elle n'est pas universelle : chaque pays a sa langue des signes (ASL aux États-Unis,
          BSL au Royaume-Uni…). La LSF est d'ailleurs à l'origine de l'ASL.</li>
          <li>En France, elle est reconnue comme <strong>langue à part entière par la loi du 11 février 2005</strong>.</li>
          <li>Il existe des variations régionales, comme les accents à l'oral.</li>
        </ul>
        <p class="tip">💡 Conseil : apprenez toujours un signe en le voyant en mouvement (vidéo ou personne),
        jamais uniquement à partir d'une description écrite.</p>`,
      quiz: [
        { q: "La LSF est-elle la même langue des signes dans tous les pays ?",
          options: ["Oui, elle est universelle", "Non, chaque pays a sa propre langue des signes", "Seulement en Europe"],
          answer: 1 },
        { q: "Depuis quelle loi la LSF est-elle reconnue comme langue à part entière en France ?",
          options: ["Loi de 1880", "Loi du 11 février 2005", "Loi de 1991"],
          answer: 1 },
        { q: "La LSF, c'est…",
          options: ["Du français signé mot à mot", "Une langue avec sa propre grammaire", "Un code uniquement basé sur l'alphabet"],
          answer: 1 }
      ]
    },
    {
      id: "parametres",
      title: "Les 5 paramètres d'un signe",
      duration: "7 min",
      body: `
        <p>Chaque signe se décrit avec cinq paramètres. Changer un seul paramètre peut changer le sens !</p>
        <ol>
          <li><strong>La configuration</strong> : la forme de la main (poing fermé, main plate, index tendu…).</li>
          <li><strong>L'emplacement</strong> : où le signe est réalisé (devant le torse, près du front, du menton…).</li>
          <li><strong>Le mouvement</strong> : le déplacement de la main (droit, circulaire, répété…).</li>
          <li><strong>L'orientation</strong> : la direction vers laquelle la paume et les doigts sont tournés.</li>
          <li><strong>L'expression du visage</strong> (et du corps) : elle fait partie du signe et de la grammaire.</li>
        </ol>
        <p class="tip">💡 Quand vous regardez une vidéo, observez chaque paramètre l'un après l'autre :
        forme de la main, puis emplacement, puis mouvement, puis orientation, puis visage.</p>`,
      quiz: [
        { q: "La forme de la main s'appelle…",
          options: ["L'orientation", "La configuration", "L'emplacement"],
          answer: 1 },
        { q: "L'expression du visage dans un signe est…",
          options: ["Facultative, juste pour être expressif", "Un paramètre à part entière", "Interdite"],
          answer: 1 },
        { q: "Combien de paramètres décrivent un signe ?",
          options: ["3", "5", "26"],
          answer: 1 }
      ]
    },
    {
      id: "grammaire",
      title: "Grammaire de base",
      duration: "8 min",
      body: `
        <p>La grammaire de la LSF est <strong>spatiale</strong> et suit souvent une logique visuelle :
        on pose le décor avant l'action.</p>
        <h3>Ordre fréquent des éléments</h3>
        <p><strong>Temps → Lieu → Personnages → Action</strong></p>
        <p>Exemple : « Demain, je vais à la piscine » se signe plutôt
        <span class="gloss">DEMAIN PISCINE MOI ALLER</span>.</p>
        <h3>Le temps</h3>
        <p>On situe le moment au début de la phrase. Une ligne imaginaire passe par le corps :
        le passé est derrière, le présent au niveau du corps, le futur devant.</p>
        <h3>L'espace de signation</h3>
        <p>On place des personnes ou des objets dans l'espace devant soi, puis on y fait référence
        en pointant ou en orientant les signes vers ces emplacements.</p>
        <h3>Les questions</h3>
        <p>Le signe interrogatif (QUI, OÙ, QUAND…) se place souvent en fin de phrase, avec une expression
        du visage adaptée (sourcils froncés pour une question ouverte, haussés pour une question oui/non).</p>
        <p class="tip">💡 Les mots en MAJUSCULES sont des <em>gloses</em> : une façon d'écrire les signes avec des mots français.</p>`,
      quiz: [
        { q: "Quel est l'ordre fréquent d'une phrase en LSF ?",
          options: ["Action → Temps → Lieu", "Temps → Lieu → Personnages → Action", "Sujet → Verbe → Complément, comme en français"],
          answer: 1 },
        { q: "Sur la ligne du temps, le futur se situe…",
          options: ["Derrière soi", "Devant soi", "Au-dessus de la tête"],
          answer: 1 },
        { q: "Pour une question oui/non, les sourcils sont généralement…",
          options: ["Froncés", "Haussés", "Immobiles"],
          answer: 1 },
        { q: "Comment appelle-t-on l'écriture des signes en mots français en majuscules ?",
          options: ["Des gloses", "Des sous-titres", "De la dactylologie"],
          answer: 0 }
      ]
    },
    {
      id: "dactylologie",
      title: "La dactylologie (alphabet)",
      duration: "4 min",
      body: `
        <p>La <strong>dactylologie</strong> est l'alphabet manuel : une configuration de main par lettre.
        Elle se fait avec la main dominante, devant l'épaule, paume généralement tournée vers l'interlocuteur.</p>
        <p>On l'utilise pour :</p>
        <ul>
          <li>épeler un <strong>prénom</strong>, un nom propre ou un mot sans signe connu ;</li>
          <li>préciser l'orthographe d'un mot français.</li>
        </ul>
        <p>Attention : on n'épelle pas tout ! En conversation, on utilise les signes.
        Chaque personne reçoit aussi un <strong>signe-nom</strong> (un « prénom signé »), attribué par la communauté sourde.</p>
        <p class="tip">💡 Entraînez-vous avec le mode « miroir » de la page Alphabet pour vérifier votre main.</p>`,
      quiz: [
        { q: "À quoi sert principalement la dactylologie ?",
          options: ["À signer toutes les phrases", "À épeler les noms propres et mots sans signe", "À compter"],
          answer: 1 },
        { q: "Qui attribue habituellement un signe-nom ?",
          options: ["On le choisit soi-même", "La communauté sourde", "L'état civil"],
          answer: 1 }
      ]
    },
    {
      id: "culture",
      title: "Culture et histoire sourdes",
      duration: "8 min",
      body: `
        <h3>Quelques dates</h3>
        <ul>
          <li><strong>XVIIIe siècle</strong> : l'abbé Charles-Michel de l'Épée fonde à Paris une école
          pour enfants sourds et s'appuie sur leurs signes pour enseigner.</li>
          <li><strong>1880, congrès de Milan</strong> : un congrès d'éducateurs (entendants pour la plupart)
          préconise l'oralisme et écarte les langues des signes de l'école. Une longue période d'interdiction commence.</li>
          <li><strong>Années 1970-1980, le « Réveil sourd »</strong> : la communauté sourde se mobilise pour la
          reconnaissance de sa langue et de sa culture.</li>
          <li><strong>2005</strong> : la loi reconnaît la LSF comme langue à part entière.</li>
        </ul>
        <h3>Savoir-vivre</h3>
        <ul>
          <li>Pour attirer l'attention : un geste de la main dans le champ de vision, une petite tape sur l'épaule
          ou le bras, ou faire clignoter la lumière.</li>
          <li>Gardez le <strong>contact visuel</strong> : détourner le regard revient à « couper la parole ».</li>
          <li>On dit « sourd », pas « sourd-muet » ni « malentendant » par défaut : beaucoup de personnes sourdes
          préfèrent le mot « sourd ».</li>
          <li>Ne passez pas entre deux personnes qui signent sans vous excuser… ou passez vite !</li>
        </ul>`,
      quiz: [
        { q: "Que s'est-il passé lors du congrès de Milan en 1880 ?",
          options: ["La LSF a été reconnue", "Les langues des signes ont été écartées de l'école", "L'alphabet a été inventé"],
          answer: 1 },
        { q: "Comment attirer poliment l'attention d'une personne sourde ?",
          options: ["Crier plus fort", "Toucher légèrement son épaule ou faire un signe dans son champ de vision", "Lui toucher le visage"],
          answer: 1 },
        { q: "Qui a fondé une école pour enfants sourds à Paris au XVIIIe siècle ?",
          options: ["Louis Braille", "L'abbé de l'Épée", "Victor Hugo"],
          answer: 1 },
        { q: "Quel terme est généralement préféré ?",
          options: ["Sourd-muet", "Sourd", "Handicapé auditif"],
          answer: 1 }
      ]
    }
  ],

  /* Alphabet dactylologique : descriptions indicatives, main dominante,
   * paume vers l'interlocuteur sauf mention contraire. */
  alphabet: [
    { l: "A", d: "Poing fermé, le pouce tendu le long du côté de l'index." },
    { l: "B", d: "Main plate, quatre doigts tendus et serrés vers le haut, pouce replié dans la paume." },
    { l: "C", d: "Doigts serrés et pouce courbés pour dessiner la lettre C (vue de côté)." },
    { l: "D", d: "Index tendu vers le haut ; les autres doigts courbés touchent le bout du pouce et forment un rond." },
    { l: "E", d: "Doigts repliés, le bout des doigts posé au-dessus du pouce replié." },
    { l: "F", d: "Pouce et index se touchent en anneau ; majeur, annulaire et auriculaire tendus." },
    { l: "G", d: "Poing fermé, index tendu vers le haut et pouce écarté sur le côté, paume vers soi." },
    { l: "H", d: "Index et majeur tendus et serrés, pointés sur le côté, paume vers soi." },
    { l: "I", d: "Poing fermé, seul l'auriculaire (petit doigt) tendu vers le haut." },
    { l: "J", d: "Comme le I, puis dessiner un J dans l'air avec l'auriculaire." },
    { l: "K", d: "Index tendu vers le haut, majeur tendu vers l'avant, pouce posé entre les deux." },
    { l: "L", d: "Pouce et index tendus en forme de L, autres doigts repliés." },
    { l: "M", d: "Index, majeur et annulaire tendus vers le bas, pouce replié sous eux." },
    { l: "N", d: "Index et majeur tendus vers le bas, pouce replié sous eux." },
    { l: "O", d: "Tous les doigts et le pouce se rejoignent pour former un O." },
    { l: "P", d: "Comme le K, mais la main orientée vers le bas." },
    { l: "Q", d: "Pouce et index tendus vers le bas, presque parallèles." },
    { l: "R", d: "Index et majeur croisés, tendus vers le haut." },
    { l: "S", d: "Poing fermé, le pouce replié par-dessus les doigts." },
    { l: "T", d: "Index tendu vers le haut, pouce posé contre la base de l'index ; ensemble ils évoquent un T." },
    { l: "U", d: "Index et majeur tendus et serrés vers le haut." },
    { l: "V", d: "Index et majeur tendus et écartés en V." },
    { l: "W", d: "Index, majeur et annulaire tendus et écartés." },
    { l: "X", d: "Index replié en crochet, autres doigts fermés." },
    { l: "Y", d: "Pouce et auriculaire tendus, autres doigts repliés." },
    { l: "Z", d: "Index tendu : dessiner un Z dans l'air devant soi." }
  ],

  spellingWords: [
    "PAPA", "MAMAN", "LUNE", "CHAT", "PAIN", "LIVRE", "SOLEIL", "PARIS", "LYON",
    "ECOLE", "JARDIN", "MUSIQUE", "VELO", "ZOE", "HUGO", "LEA", "NOAH", "KIWI", "QUAI", "WAGON"
  ],

  /* Vos propres vidéos, prioritaires sur les vidéos en ligne. Déposez le fichier
   * dans videos/ puis déclarez-le ici, par exemple :
   *   "bonjour": { src: "videos/bonjour.mp4", author: "Camille", license: "CC BY-SA 4.0" }
   * ou simplement "bonjour": "videos/bonjour.mp4". */
  localVideos: {},

  /* Vocabulaire par thème. Les vidéos sont cherchées automatiquement sur
   * Lingua Libre (Wikimedia Commons) ; à défaut, un lien Elix est proposé. */
  themes: [
    { id: "salutations", title: "Salutations & politesse", icon: "👋", words: [
      "bonjour", "au revoir", "merci", "s'il vous plaît", "pardon", "oui", "non",
      "ça va", "bienvenue", "à bientôt", "enchanté", "bonsoir"
    ]},
    { id: "presentation", title: "Se présenter", icon: "🙋", words: [
      "moi", "toi", "nom", "prénom", "âge", "habiter", "sourd", "entendant",
      "apprendre", "langue des signes", "comprendre", "répéter"
    ]},
    { id: "famille", title: "La famille", icon: "👪", words: [
      "famille", "mère", "père", "frère", "sœur", "enfant", "bébé",
      "grand-mère", "grand-père", "ami", "mari", "femme"
    ]},
    { id: "questions", title: "Les questions", icon: "❓", words: [
      "qui", "quoi", "où", "quand", "pourquoi", "comment", "combien", "quel"
    ]},
    { id: "nombres", title: "Les nombres", icon: "🔢", words: [
      "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"
    ]},
    { id: "temps", title: "Le temps", icon: "🕒", words: [
      "aujourd'hui", "demain", "hier", "maintenant", "matin", "soir",
      "semaine", "mois", "année", "heure", "lundi", "dimanche"
    ]},
    { id: "emotions", title: "Émotions", icon: "😊", words: [
      "content", "triste", "fatigué", "colère", "peur", "aimer",
      "surpris", "malade", "calme", "stressé"
    ]},
    { id: "nourriture", title: "Manger & boire", icon: "🍞", words: [
      "manger", "boire", "eau", "pain", "café", "fromage", "pomme",
      "faim", "soif", "restaurant", "bon", "petit-déjeuner"
    ]},
    { id: "couleurs", title: "Les couleurs", icon: "🎨", words: [
      "couleur", "rouge", "bleu", "vert", "jaune", "noir", "blanc", "orange", "rose", "violet"
    ]},
    { id: "actions", title: "Verbes courants", icon: "🏃", words: [
      "aller", "venir", "travailler", "voir", "savoir", "vouloir", "pouvoir",
      "aider", "attendre", "dormir", "jouer", "signer"
    ]}
  ]
};

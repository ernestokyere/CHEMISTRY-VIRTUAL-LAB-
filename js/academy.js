/* =========================================================
   CHEMLAB
   PROFESSIONAL CHEMISTRY ACADEMY
   Stage 5.3 — Subject Explorer & Topic Learning Interface
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. STATE
       ===================================================== */

    const ACADEMY_STATE = {

        initialized: false,

        currentSubject: null,

        currentTopic: null,

        subjects: [],

        filteredSubjects: [],

        filteredTopics: [],

        searchQuery: "",

        topicSearchQuery: "",

        currentLevel: "all",

        view: "subjects",

        loading: false

    };


    /* =====================================================
       02. CURRICULUM
       ===================================================== */

    const ACADEMY_CURRICULUM = [

        {
            id: "foundations",

            name: "Foundations of Chemistry",

            shortName: "Foundations",

            category: "Foundation Chemistry",

            icon: "∑",

            description:
                "Build the essential scientific and mathematical foundations required for chemistry.",

            level: "foundation",

            colorClass: "blue",

            topics: [

                {
                    id: "measurements-scientific-units",
                    title: "Measurements & Scientific Units",
                    description:
                        "Understand SI units, measurements, unit conversions and scientific notation.",
                    lessons: 4,
                    difficulty: "Beginner",
                    duration: 25
                },

                {
                    id: "significant-figures",
                    title: "Significant Figures",
                    description:
                        "Learn how significant figures communicate measurement precision.",
                    lessons: 4,
                    difficulty: "Beginner",
                    duration: 25
                },

                {
                    id: "dimensional-analysis",
                    title: "Dimensional Analysis",
                    description:
                        "Use units and conversion factors to solve chemistry calculations.",
                    lessons: 5,
                    difficulty: "Beginner",
                    duration: 30
                },

                {
                    id: "atomic-structure",
                    title: "Atomic Structure",
                    description:
                        "Explore protons, neutrons, electrons, isotopes and atomic models.",
                    lessons: 6,
                    difficulty: "Beginner",
                    duration: 35
                },

                {
                    id: "periodic-table",
                    title: "The Periodic Table",
                    description:
                        "Understand periodic organization, groups, periods and element properties.",
                    lessons: 5,
                    difficulty: "Beginner",
                    duration: 30
                },

                {
                    id: "chemical-formulas-equations",
                    title: "Chemical Formulas & Equations",
                    description:
                        "Read chemical formulas and represent chemical changes using equations.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 35
                },

                {
                    id: "mole-concept",
                    title: "The Mole Concept",
                    description:
                        "Understand the mole, Avogadro's constant and chemical quantities.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "stoichiometry",
                    title: "Stoichiometry",
                    description:
                        "Use balanced equations to calculate quantities of reactants and products.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "concentration-solutions",
                    title: "Concentration & Solutions",
                    description:
                        "Understand molarity, solution preparation, dilution and concentration.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "measurement-uncertainty",
                    title: "Measurement Uncertainty",
                    description:
                        "Explore uncertainty, precision, accuracy and reporting measurements.",
                    lessons: 5,
                    difficulty: "Intermediate",
                    duration: 35
                }

            ]

        },


        /* =================================================
           INORGANIC CHEMISTRY
           ================================================= */

        {
            id: "inorganic",

            name: "Inorganic Chemistry",

            shortName: "Inorganic",

            category: "Core Chemistry",

            icon: "◇",

            description:
                "Explore the chemistry of elements, compounds, bonding, acids, bases and coordination systems.",

            level: "undergraduate",

            colorClass: "purple",

            topics: [

                {
                    id: "periodic-trends",
                    title: "Periodic Trends",
                    description:
                        "Analyze atomic radius, ionization energy, electron affinity and electronegativity.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "chemical-bonding",
                    title: "Chemical Bonding",
                    description:
                        "Study ionic, covalent and metallic bonding and their properties.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "molecular-structure",
                    title: "Molecular Structure",
                    description:
                        "Explore Lewis structures, molecular geometry, polarity and bonding theories.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "acids-bases",
                    title: "Acids & Bases",
                    description:
                        "Understand acid-base theories, pH, pOH, buffers and neutralization.",
                    lessons: 8,
                    difficulty: "Intermediate",
                    duration: 50
                },

                {
                    id: "oxidation-reduction",
                    title: "Oxidation-Reduction Chemistry",
                    description:
                        "Study oxidation states, electron transfer and redox reactions.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "coordination-chemistry",
                    title: "Coordination Chemistry",
                    description:
                        "Explore metal complexes, ligands, coordination numbers and structures.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "qualitative-inorganic-analysis",
                    title: "Qualitative Inorganic Analysis",
                    description:
                        "Learn the principles behind identifying inorganic ions and compounds.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                }

            ]

        },


        /* =================================================
           ORGANIC CHEMISTRY
           ================================================= */

        {
            id: "organic",

            name: "Organic Chemistry",

            shortName: "Organic",

            category: "Core Chemistry",

            icon: "⌬",

            description:
                "Study carbon chemistry, structures, functional groups, reactions and mechanisms.",

            level: "undergraduate",

            colorClass: "orange",

            topics: [

                {
                    id: "organic-structures",
                    title: "Organic Structures",
                    description:
                        "Learn how carbon atoms form chains, rings and molecular structures.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "organic-nomenclature",
                    title: "Organic Nomenclature",
                    description:
                        "Learn systematic naming of organic compounds.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "isomerism-stereochemistry",
                    title: "Isomerism & Stereochemistry",
                    description:
                        "Understand structural isomers, stereoisomers and molecular orientation.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "functional-groups",
                    title: "Functional Groups",
                    description:
                        "Identify the major functional groups and predict their characteristic chemistry.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "hydrocarbons",
                    title: "Hydrocarbons",
                    description:
                        "Study alkanes, alkenes, alkynes and aromatic hydrocarbons.",
                    lessons: 8,
                    difficulty: "Intermediate",
                    duration: 50
                },

                {
                    id: "alcohols-ethers",
                    title: "Alcohols & Ethers",
                    description:
                        "Explore structures, properties and reactions of alcohols and ethers.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "aldehydes-ketones",
                    title: "Aldehydes & Ketones",
                    description:
                        "Study carbonyl chemistry and common reactions of aldehydes and ketones.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "carboxylic-acids-derivatives",
                    title: "Carboxylic Acids & Derivatives",
                    description:
                        "Understand carboxylic acids, esters, amides and related compounds.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "organic-reaction-mechanisms",
                    title: "Organic Reaction Mechanisms",
                    description:
                        "Develop a deeper understanding of how organic reactions occur.",
                    lessons: 9,
                    difficulty: "Advanced",
                    duration: 60
                }

            ]

        },


        /* =================================================
           PHYSICAL CHEMISTRY
           ================================================= */

        {
            id: "physical",

            name: "Physical Chemistry",

            shortName: "Physical",

            category: "Advanced Chemistry",

            icon: "Δ",

            description:
                "Understand the mathematical and theoretical principles governing chemical systems.",

            level: "advanced",

            colorClass: "red",

            topics: [

                {
                    id: "gas-laws",
                    title: "Gas Laws",
                    description:
                        "Study pressure, volume, temperature and amount relationships in gases.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "kinetic-molecular-theory",
                    title: "Kinetic Molecular Theory",
                    description:
                        "Connect molecular motion with macroscopic gas behavior.",
                    lessons: 6,
                    difficulty: "Advanced",
                    duration: 45
                },

                {
                    id: "thermochemistry",
                    title: "Thermochemistry",
                    description:
                        "Study heat, energy changes and enthalpy in chemical systems.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 50
                },

                {
                    id: "chemical-thermodynamics",
                    title: "Chemical Thermodynamics",
                    description:
                        "Explore entropy, Gibbs energy and thermodynamic spontaneity.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 60
                },

                {
                    id: "chemical-equilibrium",
                    title: "Chemical Equilibrium",
                    description:
                        "Understand equilibrium constants, reaction quotients and Le Chatelier's principle.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "chemical-kinetics",
                    title: "Chemical Kinetics",
                    description:
                        "Study reaction rates, rate laws, mechanisms and activation energy.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 60
                },

                {
                    id: "phase-equilibria",
                    title: "Phase Equilibria",
                    description:
                        "Explore phase behavior, phase diagrams and equilibrium between phases.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 55
                }

            ]

        },


        /* =================================================
           ANALYTICAL CHEMISTRY
           ================================================= */

        {
            id: "analytical",

            name: "Analytical Chemistry",

            shortName: "Analytical",

            category: "Applied Chemistry",

            icon: "◫",

            description:
                "Develop the skills needed to measure, quantify and interpret chemical information.",

            level: "undergraduate",

            colorClass: "green",

            topics: [

                {
                    id: "accuracy-precision-error",
                    title: "Accuracy, Precision & Error",
                    description:
                        "Understand measurement quality, systematic error and random error.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "chemical-statistics",
                    title: "Chemical Statistics",
                    description:
                        "Apply statistical methods to chemical measurements and experimental data.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "volumetric-analysis",
                    title: "Volumetric Analysis",
                    description:
                        "Understand quantitative analysis based on measured solution volumes.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "titration-analysis",
                    title: "Titration Analysis",
                    description:
                        "Explore titration principles, equivalence points and quantitative calculations.",
                    lessons: 8,
                    difficulty: "Intermediate",
                    duration: 50
                },

                {
                    id: "spectrophotometry",
                    title: "Spectrophotometry",
                    description:
                        "Understand absorbance, transmittance and quantitative optical measurements.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "chromatography",
                    title: "Chromatography",
                    description:
                        "Learn the principles of separating and analyzing chemical mixtures.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                }

            ]

        },


        /* =================================================
           BIOCHEMISTRY
           ================================================= */

        {
            id: "biochemistry",

            name: "Biochemistry",

            shortName: "Biochemistry",

            category: "Life Science",

            icon: "⬡",

            description:
                "Explore the chemistry of biological molecules and biochemical processes.",

            level: "undergraduate",

            colorClass: "teal",

            topics: [

                {
                    id: "amino-acids-proteins",
                    title: "Amino Acids & Proteins",
                    description:
                        "Study amino acid structures and the organization of proteins.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "enzymes",
                    title: "Enzymes",
                    description:
                        "Understand enzyme structure, catalysis and factors affecting activity.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "carbohydrates",
                    title: "Carbohydrates",
                    description:
                        "Explore monosaccharides, polysaccharides and carbohydrate chemistry.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "lipids-membranes",
                    title: "Lipids & Membranes",
                    description:
                        "Study lipid structures and their roles in biological membranes.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "dna-rna-chemistry",
                    title: "DNA & RNA Chemistry",
                    description:
                        "Understand the chemical structures and properties of nucleic acids.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "enzyme-kinetics",
                    title: "Enzyme Kinetics",
                    description:
                        "Analyze enzyme rates, kinetic models and experimental behavior.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                }

            ]

        },


        /* =================================================
           ENVIRONMENTAL CHEMISTRY
           ================================================= */

        {
            id: "environmental",

            name: "Environmental Chemistry",

            shortName: "Environmental",

            category: "Applied Chemistry",

            icon: "◌",

            description:
                "Understand chemical processes affecting water, air, soil and environmental systems.",

            level: "undergraduate",

            colorClass: "green",

            topics: [

                {
                    id: "water-chemistry",
                    title: "Water Chemistry",
                    description:
                        "Study the chemical properties and quality of natural and treated water.",
                    lessons: 7,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "atmospheric-chemistry",
                    title: "Atmospheric Chemistry",
                    description:
                        "Explore chemical processes occurring in Earth's atmosphere.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "soil-chemistry",
                    title: "Soil Chemistry",
                    description:
                        "Understand chemical processes controlling soil composition and fertility.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                },

                {
                    id: "green-chemistry",
                    title: "Green Chemistry",
                    description:
                        "Explore principles for reducing environmental impact through chemical design.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 40
                }

            ]

        },


        /* =================================================
           ELECTROCHEMISTRY
           ================================================= */

        {
            id: "electrochemistry",

            name: "Electrochemistry",

            shortName: "Electrochemistry",

            category: "Advanced Chemistry",

            icon: "⚡",

            description:
                "Study chemical systems involving electron transfer, electrical potential and electrochemical cells.",

            level: "advanced",

            colorClass: "yellow",

            topics: [

                {
                    id: "electrochemical-cells",
                    title: "Electrochemical Cells",
                    description:
                        "Understand galvanic and electrochemical cell principles.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "electrode-potentials",
                    title: "Electrode Potentials",
                    description:
                        "Explore standard potentials and their role in predicting redox behavior.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "nernst-equation",
                    title: "Nernst Equation",
                    description:
                        "Relate electrode potential to concentration and reaction conditions.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 60
                },

                {
                    id: "electrolysis",
                    title: "Electrolysis",
                    description:
                        "Understand the principles governing electrochemical decomposition.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "corrosion",
                    title: "Corrosion",
                    description:
                        "Study electrochemical corrosion and methods of corrosion control.",
                    lessons: 6,
                    difficulty: "Advanced",
                    duration: 45
                }

            ]

        },


        /* =================================================
           MATERIALS & INDUSTRIAL CHEMISTRY
           ================================================= */

        {
            id: "materials",

            name: "Materials & Industrial Chemistry",

            shortName: "Materials",

            category: "Industrial Chemistry",

            icon: "▣",

            description:
                "Explore chemical principles behind materials, industrial processes and catalysts.",

            level: "advanced",

            colorClass: "orange",

            topics: [

                {
                    id: "polymer-chemistry",
                    title: "Polymer Chemistry",
                    description:
                        "Study polymer structures, properties and polymerization concepts.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "metals-alloys",
                    title: "Metals & Alloys",
                    description:
                        "Explore metal properties, structures, alloys and applications.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "catalysis",
                    title: "Catalysis",
                    description:
                        "Understand how catalysts affect reaction pathways and rates.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "industrial-chemical-processes",
                    title: "Industrial Chemical Processes",
                    description:
                        "Explore major principles used in large-scale chemical manufacturing.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                }

            ]

        },


        /* =================================================
           INSTRUMENTAL CHEMISTRY
           ================================================= */

        {
            id: "instrumental",

            name: "Instrumental & Spectroscopic Chemistry",

            shortName: "Instrumental",

            category: "Advanced Analytical Chemistry",

            icon: "⌁",

            description:
                "Learn how modern instruments generate chemical information and analytical data.",

            level: "advanced",

            colorClass: "purple",

            topics: [

                {
                    id: "uv-visible-spectroscopy",
                    title: "UV-Visible Spectroscopy",
                    description:
                        "Understand electronic absorption and quantitative UV-Visible measurements.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "infrared-spectroscopy",
                    title: "Infrared Spectroscopy",
                    description:
                        "Use vibrational information to understand molecular functional groups.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "nmr-spectroscopy",
                    title: "NMR Spectroscopy",
                    description:
                        "Explore the fundamental principles of nuclear magnetic resonance.",
                    lessons: 9,
                    difficulty: "Advanced",
                    duration: 65
                },

                {
                    id: "mass-spectrometry",
                    title: "Mass Spectrometry",
                    description:
                        "Understand molecular mass, ions and mass spectral interpretation.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 60
                },

                {
                    id: "hplc-gas-chromatography",
                    title: "HPLC & Gas Chromatography",
                    description:
                        "Explore advanced chromatographic separation and analysis.",
                    lessons: 9,
                    difficulty: "Advanced",
                    duration: 65
                }

            ]

        },


        /* =================================================
           NUCLEAR CHEMISTRY
           ================================================= */

        {
            id: "nuclear",

            name: "Nuclear & Radiochemistry",

            shortName: "Nuclear Chemistry",

            category: "Advanced Chemistry",

            icon: "◎",

            description:
                "Study nuclear structure, radioactivity, decay processes and radiochemical concepts.",

            level: "advanced",

            colorClass: "red",

            topics: [

                {
                    id: "nuclear-structure",
                    title: "Nuclear Structure",
                    description:
                        "Understand nuclei, isotopes, nuclear forces and nuclear stability.",
                    lessons: 6,
                    difficulty: "Advanced",
                    duration: 45
                },

                {
                    id: "radioactivity-decay",
                    title: "Radioactivity & Decay",
                    description:
                        "Explore radioactive processes and the major modes of nuclear decay.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "half-life-nuclear-kinetics",
                    title: "Half-Life & Nuclear Kinetics",
                    description:
                        "Understand radioactive half-life and mathematical decay models.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "radiochemical-analysis",
                    title: "Radiochemical Analysis",
                    description:
                        "Study the analytical principles behind radiochemical measurements.",
                    lessons: 6,
                    difficulty: "Advanced",
                    duration: 45
                }

            ]

        },


        /* =================================================
           RESEARCH & LABORATORY SCIENCE
           ================================================= */

        {
            id: "research",

            name: "Research & Laboratory Science",

            shortName: "Research",

            category: "Research Science",

            icon: "⌘",

            description:
                "Develop the scientific reasoning, data analysis and research skills needed for laboratory science.",

            level: "advanced",

            colorClass: "teal",

            topics: [

                {
                    id: "experimental-design",
                    title: "Experimental Design",
                    description:
                        "Learn how to construct meaningful scientific experiments and controls.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "scientific-data-analysis",
                    title: "Scientific Data Analysis",
                    description:
                        "Organize, interpret and communicate quantitative scientific data.",
                    lessons: 8,
                    difficulty: "Advanced",
                    duration: 55
                },

                {
                    id: "error-uncertainty-analysis",
                    title: "Error & Uncertainty Analysis",
                    description:
                        "Evaluate uncertainty and understand how it affects scientific conclusions.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                },

                {
                    id: "scientific-writing",
                    title: "Scientific Writing",
                    description:
                        "Learn how to communicate scientific methods, results and conclusions.",
                    lessons: 6,
                    difficulty: "Intermediate",
                    duration: 45
                },

                {
                    id: "research-methodology",
                    title: "Research Methodology",
                    description:
                        "Understand the structure and workflow of scientific research.",
                    lessons: 7,
                    difficulty: "Advanced",
                    duration: 50
                }

            ]

        }

    ];


    /* =====================================================
       03. UTILITY FUNCTIONS
       ===================================================== */

    function getSubjects() {

        return ACADEMY_CURRICULUM.slice();

    }


    function getSubject(subjectId) {

        return ACADEMY_CURRICULUM.find(
            subject => subject.id === subjectId
        ) || null;

    }


    function getTopic(subjectId, topicId) {

        const subject = getSubject(subjectId);

        if (!subject) {
            return null;
        }

        return subject.topics.find(
            topic => topic.id === topicId
        ) || null;

    }


    function getTotalTopics() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) => total + subject.topics.length,
            0
        );

    }


    function getTotalLessons() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) => {

                return total + subject.topics.reduce(
                    (topicTotal, topic) =>
                        topicTotal + topic.lessons,
                    0
                );

            },
            0
        );

    }


    function normalizeText(value) {

        return String(value || "")
            .toLowerCase()
            .trim();

    }


    function getTopicProgress(subjectId, topicId) {

        const key =
            "chemlab_topic_progress_" +
            subjectId +
            "_" +
            topicId;

        const value =
            Number(localStorage.getItem(key));

        if (!Number.isFinite(value)) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(100, value)
        );

    }


    function saveTopicProgress(
        subjectId,
        topicId,
        progress
    ) {

        const value = Math.max(
            0,
            Math.min(100, Number(progress) || 0)
        );

        const key =
            "chemlab_topic_progress_" +
            subjectId +
            "_" +
            topicId;

        localStorage.setItem(
            key,
            String(value)
        );

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:topic-progress-updated",
                {
                    detail: {
                        subjectId,
                        topicId,
                        progress: value
                    }
                }
            )
        );

        return value;

    }


    /* =====================================================
       04. SEARCH
       ===================================================== */

    function search(query) {

        const searchTerm =
            normalizeText(query);

        ACADEMY_STATE.searchQuery =
            searchTerm;

        if (!searchTerm) {

            ACADEMY_STATE.filteredSubjects =
                ACADEMY_STATE.subjects.slice();

            return ACADEMY_STATE.filteredSubjects;

        }


        ACADEMY_STATE.filteredSubjects =
            ACADEMY_STATE.subjects.filter(
                subject => {

                    const subjectText =
                        normalizeText(
                            [
                                subject.name,
                                subject.shortName,
                                subject.category,
                                subject.description,
                                ...subject.topics.map(
                                    topic =>
                                        topic.title +
                                        " " +
                                        topic.description
                                )
                            ].join(" ")
                        );

                    return subjectText.includes(
                        searchTerm
                    );

                }
            );


        return ACADEMY_STATE.filteredSubjects;

    }


    /* =====================================================
       05. LEVEL FILTER
       ===================================================== */

    function filterByLevel(level) {

        const selectedLevel =
            normalizeText(level) || "all";

        ACADEMY_STATE.currentLevel =
            selectedLevel;

        let results =
            ACADEMY_STATE.subjects.slice();


        if (selectedLevel !== "all") {

            results =
                results.filter(
                    subject =>
                        subject.level === selectedLevel
                );

        }


        if (ACADEMY_STATE.searchQuery) {

            const searchTerm =
                ACADEMY_STATE.searchQuery;

            results =
                results.filter(
                    subject => {

                        const text =
                            normalizeText(
                                [
                                    subject.name,
                                    subject.shortName,
                                    subject.category,
                                    subject.description,
                                    ...subject.topics.map(
                                        topic =>
                                            topic.title +
                                            " " +
                                            topic.description
                                    )
                                ].join(" ")
                            );

                        return text.includes(
                            searchTerm
                        );

                    }
                );

        }


        ACADEMY_STATE.filteredSubjects =
            results;


        return results;

    }


    /* =====================================================
       06. TOPIC SEARCH
       ===================================================== */

    function searchTopics(query) {

        const subject =
            ACADEMY_STATE.currentSubject;

        if (!subject) {
            return [];
        }


        const searchTerm =
            normalizeText(query);

        ACADEMY_STATE.topicSearchQuery =
            searchTerm;


        if (!searchTerm) {

            ACADEMY_STATE.filteredTopics =
                subject.topics.slice();

            return ACADEMY_STATE.filteredTopics;

        }


        ACADEMY_STATE.filteredTopics =
            subject.topics.filter(
                topic => {

                    const text =
                        normalizeText(
                            [
                                topic.title,
                                topic.description,
                                topic.difficulty
                            ].join(" ")
                        );

                    return text.includes(
                        searchTerm
                    );

                }
            );


        return ACADEMY_STATE.filteredTopics;

    }


    /* =====================================================
       07. SUBJECT SELECTION
       ===================================================== */

    function openSubject(subjectId) {

        const subject =
            getSubject(subjectId);

        if (!subject) {
            return null;
        }


        ACADEMY_STATE.currentSubject =
            subject;

        ACADEMY_STATE.currentTopic =
            null;

        ACADEMY_STATE.filteredTopics =
            subject.topics.slice();

        ACADEMY_STATE.topicSearchQuery =
            "";

        ACADEMY_STATE.view =
            "topics";


        renderSubjectExplorer();


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-subject-opened",
                {
                    detail: {
                        subject
                    }
                }
            )
        );


        return subject;

    }


    /* =====================================================
       08. TOPIC SELECTION
       ===================================================== */

    function openTopic(
        subjectId,
        topicId
    ) {

        const subject =
            getSubject(subjectId);

        if (!subject) {
            return null;
        }


        const topic =
            getTopic(
                subjectId,
                topicId
            );

        if (!topic) {
            return null;
        }


        ACADEMY_STATE.currentSubject =
            subject;

        ACADEMY_STATE.currentTopic =
            topic;

        ACADEMY_STATE.view =
            "topic";


        renderTopicLearning();


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-topic-opened",
                {
                    detail: {
                        subject,
                        topic
                    }
                }
            )
        );


        return topic;

    }


    /* =====================================================
       09. RETURN TO SUBJECTS
       ===================================================== */

    function closeExplorer() {

        ACADEMY_STATE.currentSubject =
            null;

        ACADEMY_STATE.currentTopic =
            null;

        ACADEMY_STATE.filteredTopics =
            [];

        ACADEMY_STATE.view =
            "subjects";


        showSubjectGrid();


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-explorer-closed"
            )
        );

    }


    /* =====================================================
       10. DOM HELPERS
       ===================================================== */

    function getLearnSection() {

        return document.querySelector(
            '[data-page="learn"]'
        );

    }


    function createElement(
        tag,
        className,
        textContent
    ) {

        const element =
            document.createElement(tag);


        if (className) {
            element.className =
                className;
        }


        if (
            textContent !== undefined &&
            textContent !== null
        ) {

            element.textContent =
                textContent;

        }


        return element;

    }


    /* =====================================================
       11. SUBJECT GRID
       ===================================================== */

    function getSubjectGrid() {

        return document.getElementById(
            "academySubjectGrid"
        );

    }


    function showSubjectGrid() {

        const grid =
            getSubjectGrid();

        if (!grid) {
            return;
        }


        grid.hidden = false;


        const explorer =
            document.getElementById(
                "academySubjectExplorer"
            );

        if (explorer) {
            explorer.remove();
        }


        const topicView =
            document.getElementById(
                "academyTopicLearning"
            );

        if (topicView) {
            topicView.remove();
        }


        renderSubjectCards();

    }


    /* =====================================================
       12. RENDER SUBJECT CARDS
       ===================================================== */

    function renderSubjectCards() {

        const grid =
            getSubjectGrid();

        if (!grid) {
            return;
        }


        const results =
            ACADEMY_STATE.filteredSubjects;


        grid.innerHTML = "";


        results.forEach(
            subject => {

                const card =
                    createElement(
                        "article",
                        "academy-subject-card"
                    );


                card.dataset.academySubject =
                    subject.id;


                const header =
                    createElement(
                        "div",
                        "academy-subject-header"
                    );


                const icon =
                    createElement(
                        "span",
                        "academy-subject-icon",
                        subject.icon
                    );


                const level =
                    createElement(
                        "span",
                        "academy-subject-level",
                        subject.level.toUpperCase()
                    );


                header.appendChild(icon);
                header.appendChild(level);


                const title =
                    createElement(
                        "h3",
                        "",
                        subject.name
                    );


                const description =
                    createElement(
                        "p",
                        "",
                        subject.description
                    );


                const meta =
                    createElement(
                        "div",
                        "academy-subject-meta"
                    );


                const topicCount =
                    createElement(
                        "span",
                        "",
                        subject.topics.length +
                        " Topics"
                    );


                const separator =
                    createElement(
                        "span",
                        "",
                        "•"
                    );


                const category =
                    createElement(
                        "span",
                        "",
                        subject.category
                    );


                meta.appendChild(topicCount);
                meta.appendChild(separator);
                meta.appendChild(category);


                const progressWrapper =
                    createElement(
                        "div",
                        "academy-subject-progress"
                    );


                const progressLabel =
                    createElement(
                        "div",
                        "academy-progress-label"
                    );


                const progressText =
                    createElement(
                        "span",
                        "",
                        "Mastery"
                    );


                let subjectProgress = 0;


                if (subject.topics.length) {

                    subjectProgress =
                        Math.round(
                            subject.topics.reduce(
                                (total, topic) =>
                                    total +
                                    getTopicProgress(
                                        subject.id,
                                        topic.id
                                    ),
                                0
                            ) /
                            subject.topics.length
                        );

                }


                const progressValue =
                    createElement(
                        "strong",
                        "",
                        subjectProgress + "%"
                    );


                progressLabel.appendChild(
                    progressText
                );

                progressLabel.appendChild(
                    progressValue
                );


                const progress =
                    createElement(
                        "div",
                        "progress"
                    );


                const progressBar =
                    createElement(
                        "span",
                        "progress-bar"
                    );


                progressBar.style.width =
                    subjectProgress + "%";


                progress.appendChild(
                    progressBar
                );


                progressWrapper.appendChild(
                    progressLabel
                );

                progressWrapper.appendChild(
                    progress
                );


                const button =
                    createElement(
                        "button",
                        "button button-secondary academy-explore-button"
                    );


                button.type = "button";


                button.dataset.academySubject =
                    subject.id;


                const buttonText =
                    createElement(
                        "span",
                        "",
                        "Explore Subject"
                    );


                const arrow =
                    createElement(
                        "span",
                        "",
                        "→"
                    );


                button.appendChild(
                    buttonText
                );

                button.appendChild(
                    arrow
                );


                card.appendChild(header);
                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(meta);
                card.appendChild(progressWrapper);
                card.appendChild(button);


                grid.appendChild(card);

            }
        );


        updateResultsLabel(
            results.length
        );


        renderEmptyState(
            results.length === 0
        );

    }


    /* =====================================================
       13. RESULTS LABEL
       ===================================================== */

    function updateResultsLabel(count) {

        const label =
            document.getElementById(
                "academyResultsLabel"
            );

        if (!label) {
            return;
        }


        if (
            ACADEMY_STATE.searchQuery
        ) {

            label.textContent =
                count +
                (
                    count === 1
                        ? " result"
                        : " results"
                );

            return;

        }


        if (
            ACADEMY_STATE.currentLevel !==
            "all"
        ) {

            label.textContent =
                count +
                (
                    count === 1
                        ? " subject"
                        : " subjects"
                );

            return;

        }


        label.textContent =
            "All subject areas";

    }


    /* =====================================================
       14. EMPTY STATE
       ===================================================== */

    function renderEmptyState(isEmpty) {

        const empty =
            document.getElementById(
                "academyEmptyState"
            );

        if (!empty) {
            return;
        }


        empty.hidden =
            !isEmpty;

    }


    /* =====================================================
       15. SUBJECT EXPLORER
       ===================================================== */

    function renderSubjectExplorer() {

        const learnSection =
            getLearnSection();

        if (!learnSection) {
            return;
        }


        const grid =
            getSubjectGrid();

        if (grid) {
            grid.hidden = true;
        }


        const oldTopicView =
            document.getElementById(
                "academyTopicLearning"
            );

        if (oldTopicView) {
            oldTopicView.remove();
        }


        const oldExplorer =
            document.getElementById(
                "academySubjectExplorer"
            );

        if (oldExplorer) {
            oldExplorer.remove();
        }


        const subject =
            ACADEMY_STATE.currentSubject;


        if (!subject) {
            return;
        }


        const explorer =
            createElement(
                "section",
                "academy-subject-explorer card"
            );


        explorer.id =
            "academySubjectExplorer";


        /* ---------------------------------------------
           HEADER
           --------------------------------------------- */

        const header =
            createElement(
                "div",
                "academy-explorer-header"
            );


        const backButton =
            createElement(
                "button",
                "button button-secondary academy-back-button"
            );


        backButton.type = "button";

        backButton.textContent =
            "← All Subjects";


        backButton.addEventListener(
            "click",
            closeExplorer
        );


        const titleArea =
            createElement(
                "div",
                "academy-explorer-title-area"
            );


        const eyebrow =
            createElement(
                "span",
                "eyebrow",
                subject.category
            );


        const title =
            createElement(
                "h2",
                "",
                subject.name
            );


        const description =
            createElement(
                "p",
                "",
                subject.description
            );


        titleArea.appendChild(
            eyebrow
        );

        titleArea.appendChild(
            title
        );

        titleArea.appendChild(
            description
        );


        header.appendChild(
            backButton
        );

        header.appendChild(
            titleArea
        );


        explorer.appendChild(
            header
        );


        /* ---------------------------------------------
           SUBJECT SUMMARY
           --------------------------------------------- */

        const summary =
            createElement(
                "div",
                "academy-explorer-summary"
            );


        const totalLessons =
            subject.topics.reduce(
                (total, topic) =>
                    total + topic.lessons,
                0
            );


        const totalMinutes =
            subject.topics.reduce(
                (total, topic) =>
                    total + topic.duration,
                0
            );


        const summaryItems = [

            [
                "TOPICS",
                subject.topics.length
            ],

            [
                "LESSONS",
                totalLessons
            ],

            [
                "EST. STUDY TIME",
                formatMinutes(totalMinutes)
            ],

            [
                "LEVEL",
                subject.level
            ]

        ];


        summaryItems.forEach(
            item => {

                const summaryCard =
                    createElement(
                        "div",
                        "academy-explorer-stat"
                    );


                const label =
                    createElement(
                        "span",
                        "",
                        item[0]
                    );


                const value =
                    createElement(
                        "strong",
                        "",
                        String(item[1])
                    );


                summaryCard.appendChild(
                    label
                );

                summaryCard.appendChild(
                    value
                );


                summary.appendChild(
                    summaryCard
                );

            }
        );


        explorer.appendChild(
            summary
        );


        /* ---------------------------------------------
           TOPIC TOOLBAR
           --------------------------------------------- */

        const toolbar =
            createElement(
                "div",
                "academy-topic-toolbar"
            );


        const topicSearch =
            createElement(
                "input",
                "form-input"
            );


        topicSearch.type =
            "search";

        topicSearch.placeholder =
            "Search topics in this subject...";

        topicSearch.value =
            ACADEMY_STATE.topicSearchQuery;


        topicSearch.addEventListener(
            "input",
            function () {

                searchTopics(
                    topicSearch.value
                );

                renderTopicCards(
                    topicGrid
                );

            }
        );


        toolbar.appendChild(
            topicSearch
        );


        explorer.appendChild(
            toolbar
        );


        /* ---------------------------------------------
           TOPIC GRID
           --------------------------------------------- */

        const topicGrid =
            createElement(
                "div",
                "academy-topic-grid"
            );


        topicGrid.id =
            "academyTopicGrid";


        explorer.appendChild(
            topicGrid
        );


        learnSection.appendChild(
            explorer
        );


        renderTopicCards(
            topicGrid
        );

    }


    /* =====================================================
       16. RENDER TOPIC CARDS
       ===================================================== */

    function renderTopicCards(grid) {

        if (!grid) {
            return;
        }


        grid.innerHTML = "";


        const topics =
            ACADEMY_STATE.filteredTopics;


        if (!topics.length) {

            const empty =
                createElement(
                    "div",
                    "academy-topic-empty"
                );


            const icon =
                createElement(
                    "div",
                    "academy-empty-icon",
                    "⌕"
                );


            const title =
                createElement(
                    "h3",
                    "",
                    "No topics found"
                );


            const text =
                createElement(
                    "p",
                    "",
                    "Try a different topic search."
                );


            empty.appendChild(icon);
            empty.appendChild(title);
            empty.appendChild(text);


            grid.appendChild(
                empty
            );

            return;

        }


        topics.forEach(
            topic => {

                const card =
                    createElement(
                        "article",
                        "academy-topic-card"
                    );


                card.dataset.academyTopic =
                    topic.id;


                const header =
                    createElement(
                        "div",
                        "academy-topic-card-header"
                    );


                const difficulty =
                    createElement(
                        "span",
                        "academy-topic-difficulty",
                        topic.difficulty
                    );


                const duration =
                    createElement(
                        "span",
                        "academy-topic-duration",
                        formatMinutes(
                            topic.duration
                        )
                    );


                header.appendChild(
                    difficulty
                );

                header.appendChild(
                    duration
                );


                const title =
                    createElement(
                        "h3",
                        "",
                        topic.title
                    );


                const description =
                    createElement(
                        "p",
                        "",
                        topic.description
                    );


                const meta =
                    createElement(
                        "div",
                        "academy-topic-meta"
                    );


                const lessons =
                    createElement(
                        "span",
                        "",
                        topic.lessons +
                        (
                            topic.lessons === 1
                                ? " lesson"
                                : " lessons"
                        )
                    );


                meta.appendChild(
                    lessons
                );


                const progressValue =
                    getTopicProgress(
                        ACADEMY_STATE.currentSubject.id,
                        topic.id
                    );


                const progressWrapper =
                    createElement(
                        "div",
                        "academy-topic-progress"
                    );


                const progressLabel =
                    createElement(
                        "div",
                        "academy-progress-label"
                    );


                progressLabel.appendChild(
                    createElement(
                        "span",
                        "",
                        "Progress"
                    )
                );


                progressLabel.appendChild(
                    createElement(
                        "strong",
                        "",
                        progressValue + "%"
                    )
                );


                const progress =
                    createElement(
                        "div",
                        "progress"
                    );


                const progressBar =
                    createElement(
                        "span",
                        "progress-bar"
                    );


                progressBar.style.width =
                    progressValue + "%";


                progress.appendChild(
                    progressBar
                );


                progressWrapper.appendChild(
                    progressLabel
                );

                progressWrapper.appendChild(
                    progress
                );


                const button =
                    createElement(
                        "button",
                        "button button-primary"
                    );


                button.type =
                    "button";


                button.textContent =
                    progressValue > 0
                        ? "Continue Learning →"
                        : "Start Topic →";


                button.dataset.academyTopic =
                    topic.id;


                card.appendChild(
                    header
                );

                card.appendChild(
                    title
                );

                card.appendChild(
                    description
                );

                card.appendChild(
                    meta
                );

                card.appendChild(
                    progressWrapper
                );

                card.appendChild(
                    button
                );


                grid.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       17. TOPIC LEARNING VIEW
       ===================================================== */

    function renderTopicLearning() {

        const learnSection =
            getLearnSection();

        if (!learnSection) {
            return;
        }


        const subject =
            ACADEMY_STATE.currentSubject;

        const topic =
            ACADEMY_STATE.currentTopic;


        if (!subject || !topic) {
            return;
        }


        const grid =
            getSubjectGrid();

        if (grid) {
            grid.hidden = true;
        }


        const explorer =
            document.getElementById(
                "academySubjectExplorer"
            );

        if (explorer) {
            explorer.remove();
        }


        const oldTopicView =
            document.getElementById(
                "academyTopicLearning"
            );

        if (oldTopicView) {
            oldTopicView.remove();
        }


        const view =
            createElement(
                "section",
                "academy-topic-learning card"
            );


        view.id =
            "academyTopicLearning";


        /* ---------------------------------------------
           BACK
           --------------------------------------------- */

        const back =
            createElement(
                "button",
                "button button-secondary academy-back-button",
                "← Back to " + subject.shortName
            );


        back.type =
            "button";


        back.addEventListener(
            "click",
            function () {

                openSubject(
                    subject.id
                );

            }
        );


        view.appendChild(
            back
        );


        /* ---------------------------------------------
           TOPIC HEADER
           --------------------------------------------- */

        const header =
            createElement(
                "div",
                "academy-topic-learning-header"
            );


        const eyebrow =
            createElement(
                "span",
                "eyebrow",
                subject.name
            );


        const title =
            createElement(
                "h2",
                "",
                topic.title
            );


        const description =
            createElement(
                "p",
                "",
                topic.description
            );


        header.appendChild(
            eyebrow
        );

        header.appendChild(
            title
        );

        header.appendChild(
            description
        );


        view.appendChild(
            header
        );


        /* ---------------------------------------------
           TOPIC METADATA
           --------------------------------------------- */

        const metadata =
            createElement(
                "div",
                "academy-topic-learning-meta"
            );


        const metadataItems = [

            [
                "DIFFICULTY",
                topic.difficulty
            ],

            [
                "LESSONS",
                topic.lessons
            ],

            [
                "EST. TIME",
                formatMinutes(topic.duration)
            ],

            [
                "LEVEL",
                subject.level
            ]

        ];


        metadataItems.forEach(
            item => {

                const itemElement =
                    createElement(
                        "div",
                        "academy-topic-meta-item"
                    );


                itemElement.appendChild(
                    createElement(
                        "span",
                        "",
                        item[0]
                    )
                );


                itemElement.appendChild(
                    createElement(
                        "strong",
                        "",
                        String(item[1])
                    )
                );


                metadata.appendChild(
                    itemElement
                );

            }
        );


        view.appendChild(
            metadata
        );


        /* ---------------------------------------------
           PROGRESS
           --------------------------------------------- */

        const currentProgress =
            getTopicProgress(
                subject.id,
                topic.id
            );


        const progressCard =
            createElement(
                "div",
                "academy-topic-learning-progress"
            );


        const progressHeader =
            createElement(
                "div",
                "academy-progress-label"
            );


        progressHeader.appendChild(
            createElement(
                "span",
                "",
                "Topic Progress"
            )
        );


        const progressValue =
            createElement(
                "strong",
                "",
                currentProgress + "%"
            );


        progressHeader.appendChild(
            progressValue
        );


        const progress =
            createElement(
                "div",
                "progress"
            );


        const progressBar =
            createElement(
                "span",
                "progress-bar"
            );


        progressBar.style.width =
            currentProgress + "%";


        progress.appendChild(
            progressBar
        );


        progressCard.appendChild(
            progressHeader
        );

        progressCard.appendChild(
            progress
        );


        view.appendChild(
            progressCard
        );


        /* ---------------------------------------------
           LEARNING STRUCTURE
           --------------------------------------------- */

        const lessonGrid =
            createElement(
                "div",
                "academy-lesson-preview-grid"
            );


        const learningItems = [

            {
                number: "01",
                title: "Concept",
                description:
                    "Understand the key chemistry ideas and terminology."
            },

            {
                number: "02",
                title: "Worked Examples",
                description:
                    "Study how the concept is applied to chemistry problems."
            },

            {
                number: "03",
                title: "Practice",
                description:
                    "Test your understanding with structured questions."
            },

            {
                number: "04",
                title: "Laboratory Connection",
                description:
                    "Connect the topic with practical chemistry and experimentation."
            }

        ];


        learningItems.forEach(
            item => {

                const card =
                    createElement(
                        "article",
                        "academy-lesson-preview-card"
                    );


                const number =
                    createElement(
                        "span",
                        "academy-path-number",
                        item.number
                    );


                const itemTitle =
                    createElement(
                        "h3",
                        "",
                        item.title
                    );


                const itemDescription =
                    createElement(
                        "p",
                        "",
                        item.description
                    );


                card.appendChild(
                    number
                );

                card.appendChild(
                    itemTitle
                );

                card.appendChild(
                    itemDescription
                );


                lessonGrid.appendChild(
                    card
                );

            }
        );


        view.appendChild(
            lessonGrid
        );


        /* ---------------------------------------------
           ACTIONS
           --------------------------------------------- */

        const actions =
            createElement(
                "div",
                "academy-topic-actions"
            );


        const startButton =
            createElement(
                "button",
                "button button-primary",
                currentProgress > 0
                    ? "Continue Topic →"
                    : "Start Learning →"
            );


        startButton.type =
            "button";


        startButton.addEventListener(
            "click",
            function () {

                const nextProgress =
                    Math.min(
                        100,
                        currentProgress === 0
                            ? 10
                            : currentProgress + 10
                    );


                saveTopicProgress(
                    subject.id,
                    topic.id,
                    nextProgress
                );


                renderTopicLearning();

            }
        );


        const practiceButton =
            createElement(
                "button",
                "button button-secondary",
                "Practice Topic"
            );


        practiceButton.type =
            "button";


        practiceButton.addEventListener(
            "click",
            function () {

                document.dispatchEvent(
                    new CustomEvent(
                        "chemlab:academy-practice-topic",
                        {
                            detail: {
                                subject,
                                topic
                            }
                        }
                    )
                );


                if (
                    window.CHEMLAB_UI &&
                    typeof window.CHEMLAB_UI.showToast ===
                    "function"
                ) {

                    window.CHEMLAB_UI.showToast(
                        "Topic practice will be connected to the Assessment Engine."
                    );

                }

            }
        );


        const laboratoryButton =
            createElement(
                "button",
                "button button-secondary",
                "Apply in Laboratory"
            );


        laboratoryButton.type =
            "button";


        laboratoryButton.addEventListener(
            "click",
            function () {

                const event =
                    new CustomEvent(
                        "chemlab:academy-laboratory-topic",
                        {
                            detail: {
                                subject,
                                topic
                            }
                        }
                    );


                document.dispatchEvent(
                    event
                );


                if (
                    window.CHEMLAB_ROUTER &&
                    typeof window.CHEMLAB_ROUTER.navigate ===
                    "function"
                ) {

                    window.CHEMLAB_ROUTER.navigate(
                        "laboratory"
                    );

                }

            }
        );


        actions.appendChild(
            startButton
        );

        actions.appendChild(
            practiceButton
        );

        actions.appendChild(
            laboratoryButton
        );


        view.appendChild(
            actions
        );


        learnSection.appendChild(
            view
        );

    }


    /* =====================================================
       18. FORMAT TIME
       ===================================================== */

    function formatMinutes(minutes) {

        const value =
            Number(minutes) || 0;


        if (value < 60) {

            return value + " min";

        }


        const hours =
            Math.floor(
                value / 60
            );


        const remaining =
            value % 60;


        if (!remaining) {

            return (
                hours +
                (
                    hours === 1
                        ? " hr"
                        : " hrs"
                )
            );

        }


        return (
            hours +
            (
                hours === 1
                    ? " hr "
                    : " hrs "
            ) +
            remaining +
            " min"
        );

    }


    /* =====================================================
       19. BIND SEARCH
       ===================================================== */

    function bindSearch() {

        const input =
            document.getElementById(
                "academySearchInput"
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function () {

                search(
                    input.value
                );


                filterByLevel(
                    ACADEMY_STATE.currentLevel
                );


                renderSubjectCards();


                document.dispatchEvent(
                    new CustomEvent(
                        "chemlab:academy-search",
                        {
                            detail: {
                                query:
                                    input.value
                            }
                        }
                    )
                );

            }
        );

    }


    /* =====================================================
       20. BIND LEVEL FILTERS
       ===================================================== */

    function bindLevelFilters() {

        const buttons =
            document.querySelectorAll(
                "[data-academy-level]"
            );


        buttons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        buttons.forEach(
                            item =>
                                item.classList.remove(
                                    "is-active"
                                )
                        );


                        button.classList.add(
                            "is-active"
                        );


                        filterByLevel(
                            button.dataset.academyLevel
                        );


                        renderSubjectCards();


                        document.dispatchEvent(
                            new CustomEvent(
                                "chemlab:academy-filter",
                                {
                                    detail: {
                                        level:
                                            button.dataset.academyLevel
                                    }
                                }
                            )
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       21. BIND SUBJECT + TOPIC EVENTS
       ===================================================== */

    function bindAcademyClicks() {

        document.addEventListener(
            "click",
            function (event) {

                const subjectButton =
                    event.target.closest(
                        "[data-academy-subject]"
                    );


                if (
                    subjectButton &&
                    subjectButton.dataset.academySubject
                ) {

                    const subjectId =
                        subjectButton.dataset.academySubject;


                    if (
                        ACADEMY_STATE.view ===
                        "topics"
                    ) {

                        return;

                    }


                    openSubject(
                        subjectId
                    );


                    return;

                }


                const topicButton =
                    event.target.closest(
                        "[data-academy-topic]"
                    );


                if (
                    topicButton &&
                    topicButton.dataset.academyTopic
                ) {

                    const subject =
                        ACADEMY_STATE.currentSubject;


                    if (!subject) {

                        const topicId =
                            topicButton.dataset.academyTopic;


                        for (
                            const candidate
                            of ACADEMY_STATE.subjects
                        ) {

                            const topic =
                                candidate.topics.find(
                                    item =>
                                        item.id ===
                                        topicId
                                );


                            if (topic) {

                                openTopic(
                                    candidate.id,
                                    topic.id
                                );

                                return;

                            }

                        }

                        return;

                    }


                    openTopic(
                        subject.id,
                        topicButton.dataset.academyTopic
                    );

                }

            }
        );

    }


    /* =====================================================
       22. CLEAR SEARCH
       ===================================================== */

    function bindClearSearch() {

        const button =
            document.getElementById(
                "academyClearSearch"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                const input =
                    document.getElementById(
                        "academySearchInput"
                    );


                if (input) {
                    input.value = "";
                }


                ACADEMY_STATE.searchQuery =
                    "";


                ACADEMY_STATE.currentLevel =
                    "all";


                const filters =
                    document.querySelectorAll(
                        "[data-academy-level]"
                    );


                filters.forEach(
                    filter => {

                        filter.classList.toggle(
                            "is-active",
                            filter.dataset.academyLevel ===
                            "all"
                        );

                    }
                );


                ACADEMY_STATE.filteredSubjects =
                    ACADEMY_STATE.subjects.slice();


                renderSubjectCards();

            }
        );

    }


    /* =====================================================
       23. UPDATE ACADEMY STATISTICS
       ===================================================== */

    function renderStatistics() {

        const subjectCount =
            document.getElementById(
                "academySubjectCount"
            );


        const topicCount =
            document.getElementById(
                "academyTopicCount"
            );


        const lessonCount =
            document.getElementById(
                "academyLessonCount"
            );


        if (subjectCount) {

            subjectCount.textContent =
                ACADEMY_CURRICULUM.length;

        }


        if (topicCount) {

            topicCount.textContent =
                getTotalTopics();

        }


        if (lessonCount) {

            lessonCount.textContent =
                getTotalLessons();

        }

    }


    /* =====================================================
       24. INITIALIZE
       ===================================================== */

    function initialize() {

        if (ACADEMY_STATE.initialized) {
            return;
        }


        ACADEMY_STATE.loading =
            true;


        ACADEMY_STATE.subjects =
            getSubjects();


        ACADEMY_STATE.filteredSubjects =
            ACADEMY_STATE.subjects.slice();


        ACADEMY_STATE.filteredTopics =
            [];


        renderStatistics();

        bindSearch();

        bindLevelFilters();

        bindAcademyClicks();

        bindClearSearch();


        renderSubjectCards();


        ACADEMY_STATE.loading =
            false;

        ACADEMY_STATE.initialized =
            true;


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-ready",
                {
                    detail: {
                        subjects:
                            ACADEMY_CURRICULUM.length,

                        topics:
                            getTotalTopics(),

                        lessons:
                            getTotalLessons()
                    }
                }
            )
        );

    }


    /* =====================================================
       25. REFRESH
       ===================================================== */

    function refresh() {

        ACADEMY_STATE.subjects =
            getSubjects();


        ACADEMY_STATE.filteredSubjects =
            ACADEMY_STATE.subjects.slice();


        renderStatistics();


        if (
            ACADEMY_STATE.view ===
            "topics" &&
            ACADEMY_STATE.currentSubject
        ) {

            openSubject(
                ACADEMY_STATE.currentSubject.id
            );

            return;

        }


        if (
            ACADEMY_STATE.view ===
            "topic" &&
            ACADEMY_STATE.currentSubject &&
            ACADEMY_STATE.currentTopic
        ) {

            openTopic(
                ACADEMY_STATE.currentSubject.id,
                ACADEMY_STATE.currentTopic.id
            );

            return;

        }


        renderSubjectCards();

    }


    /* =====================================================
       26. PUBLIC API
       ===================================================== */

    window.CHEMLAB_ACADEMY = {

        initialize,

        refresh,

        getSubjects,

        getSubject,

        getTopic,

        getTotalTopics,

        getTotalLessons,

        search,

        searchTopics,

        filterByLevel,

        openSubject,

        openTopic,

        closeExplorer,

        getTopicProgress,

        saveTopicProgress,

        getState:
            function () {

                return {
                    initialized:
                        ACADEMY_STATE.initialized,

                    currentSubject:
                        ACADEMY_STATE.currentSubject,

                    currentTopic:
                        ACADEMY_STATE.currentTopic,

                    searchQuery:
                        ACADEMY_STATE.searchQuery,

                    topicSearchQuery:
                        ACADEMY_STATE.topicSearchQuery,

                    currentLevel:
                        ACADEMY_STATE.currentLevel,

                    view:
                        ACADEMY_STATE.view,

                    subjectCount:
                        ACADEMY_STATE.subjects.length,

                    topicCount:
                        getTotalTopics(),

                    lessonCount:
                        getTotalLessons()
                };

            }

    };


    /* =====================================================
       27. GLOBAL EVENTS
       ===================================================== */

    document.addEventListener(
        "chemlab:topic-progress-updated",
        function () {

            if (
                ACADEMY_STATE.view ===
                "topics" ||
                ACADEMY_STATE.view ===
                "subjects"
            ) {

                renderSubjectCards();

            }

        }
    );


    /* =====================================================
       28. DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


})();

/* =========================================================
   CHEMLAB
   LEARNING ACADEMY ENGINE
   Stage 5.1
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       ACADEMY STATE
       ===================================================== */

    const ACADEMY_STATE = {

        initialized: false,

        currentSubject: null,

        currentTopic: null,

        subjects: [],

        filteredSubjects: [],

        searchQuery: "",

        loading: false

    };


    /* =====================================================
       ACADEMY CURRICULUM
       ===================================================== */

    const ACADEMY_CURRICULUM = [

        {
            id: "foundations",

            name: "Foundations of Chemistry",

            shortName: "Foundations",

            category: "foundation",

            icon: "◈",

            description:
                "Build the core scientific and chemical knowledge needed for advanced study.",

            level: "Foundation",

            colorClass: "academy-foundations",

            topics: [

                {
                    id: "measurements",

                    title:
                        "Measurements & Scientific Units",

                    description:
                        "Learn SI units, laboratory measurements, precision and scientific notation.",

                    lessons: 6,

                    difficulty: "Beginner",

                    duration: "45 min"

                },

                {
                    id: "significant-figures",

                    title:
                        "Significant Figures",

                    description:
                        "Understand precision, rounding and significant figures in chemical calculations.",

                    lessons: 5,

                    difficulty: "Beginner",

                    duration: "35 min"

                },

                {
                    id: "dimensional-analysis",

                    title:
                        "Dimensional Analysis",

                    description:
                        "Use units and conversion factors to solve quantitative chemistry problems.",

                    lessons: 5,

                    difficulty: "Beginner",

                    duration: "40 min"

                },

                {
                    id: "atomic-structure",

                    title:
                        "Atomic Structure",

                    description:
                        "Explore protons, neutrons, electrons, isotopes and atomic models.",

                    lessons: 7,

                    difficulty: "Beginner",

                    duration: "50 min"

                },

                {
                    id: "periodic-table",

                    title:
                        "The Periodic Table",

                    description:
                        "Understand groups, periods, periodic trends and chemical behavior.",

                    lessons: 8,

                    difficulty: "Beginner",

                    duration: "60 min"

                },

                {
                    id: "chemical-formulas",

                    title:
                        "Chemical Formulas & Equations",

                    description:
                        "Read formulas, write equations and represent chemical reactions.",

                    lessons: 7,

                    difficulty: "Beginner",

                    duration: "55 min"

                },

                {
                    id: "mole-concept",

                    title:
                        "The Mole Concept",

                    description:
                        "Connect particles, moles, molar mass and chemical quantities.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "stoichiometry",

                    title:
                        "Stoichiometry",

                    description:
                        "Use balanced equations to calculate quantities of reactants and products.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "75 min"

                },

                {
                    id: "solutions",

                    title:
                        "Concentration & Solutions",

                    description:
                        "Study molarity, dilution, solution preparation and concentration calculations.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "60 min"

                },

                {
                    id: "uncertainty",

                    title:
                        "Measurement Uncertainty",

                    description:
                        "Understand uncertainty, experimental error and reliable measurements.",

                    lessons: 6,

                    difficulty: "Intermediate",

                    duration: "50 min"

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

            category: "inorganic",

            icon: "◇",

            description:
                "Study elements, compounds, bonding, coordination chemistry and inorganic reactions.",

            level: "Undergraduate",

            colorClass: "academy-inorganic",

            topics: [

                {
                    id: "periodic-trends",

                    title:
                        "Periodic Trends",

                    description:
                        "Explore atomic radius, ionization energy, electron affinity and electronegativity.",

                    lessons: 7,

                    difficulty: "Intermediate",

                    duration: "55 min"

                },

                {
                    id: "chemical-bonding",

                    title:
                        "Chemical Bonding",

                    description:
                        "Study ionic, covalent and metallic bonding and their properties.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "molecular-structure",

                    title:
                        "Molecular Structure",

                    description:
                        "Understand Lewis structures, VSEPR theory, polarity and molecular geometry.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "acids-bases",

                    title:
                        "Acids & Bases",

                    description:
                        "Study acid-base theories, pH, buffers and acid-base equilibria.",

                    lessons: 10,

                    difficulty: "Intermediate",

                    duration: "80 min"

                },

                {
                    id: "redox",

                    title:
                        "Oxidation-Reduction Chemistry",

                    description:
                        "Understand oxidation states, electron transfer and redox reactions.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "coordination",

                    title:
                        "Coordination Chemistry",

                    description:
                        "Explore metal complexes, ligands, coordination numbers and geometry.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "75 min"

                },

                {
                    id: "qualitative-analysis",

                    title:
                        "Qualitative Inorganic Analysis",

                    description:
                        "Learn the principles used to identify inorganic ions and compounds.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "80 min"

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

            category: "organic",

            icon: "⌬",

            description:
                "Study carbon compounds, functional groups, mechanisms, reactions and synthesis.",

            level: "Undergraduate",

            colorClass: "academy-organic",

            topics: [

                {
                    id: "organic-structures",

                    title:
                        "Organic Structures",

                    description:
                        "Learn structural formulas, representations and bonding in organic molecules.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "60 min"

                },

                {
                    id: "nomenclature",

                    title:
                        "Organic Nomenclature",

                    description:
                        "Learn systematic naming of organic compounds.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "isomerism",

                    title:
                        "Isomerism & Stereochemistry",

                    description:
                        "Explore structural isomers, stereoisomers, chirality and configuration.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                },

                {
                    id: "functional-groups",

                    title:
                        "Functional Groups",

                    description:
                        "Identify and understand the behavior of major organic functional groups.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "hydrocarbons",

                    title:
                        "Hydrocarbons",

                    description:
                        "Study alkanes, alkenes, alkynes and aromatic hydrocarbons.",

                    lessons: 10,

                    difficulty: "Intermediate",

                    duration: "80 min"

                },

                {
                    id: "alcohols-ethers",

                    title:
                        "Alcohols & Ethers",

                    description:
                        "Explore structures, properties and reactions of alcohols and ethers.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "carbonyl",

                    title:
                        "Aldehydes & Ketones",

                    description:
                        "Study carbonyl chemistry and important reaction patterns.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "75 min"

                },

                {
                    id: "carboxylic-acids",

                    title:
                        "Carboxylic Acids & Derivatives",

                    description:
                        "Understand acids, esters, amides and related compounds.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                },

                {
                    id: "mechanisms",

                    title:
                        "Organic Reaction Mechanisms",

                    description:
                        "Understand how and why organic reactions occur.",

                    lessons: 12,

                    difficulty: "Advanced",

                    duration: "100 min"

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

            category: "physical",

            icon: "∑",

            description:
                "Use mathematics and physical principles to understand chemical systems.",

            level: "Undergraduate",

            colorClass: "academy-physical",

            topics: [

                {
                    id: "gas-laws",

                    title:
                        "Gas Laws",

                    description:
                        "Study pressure, volume, temperature and the behavior of gases.",

                    lessons: 7,

                    difficulty: "Intermediate",

                    duration: "60 min"

                },

                {
                    id: "kinetic-theory",

                    title:
                        "Kinetic Molecular Theory",

                    description:
                        "Connect molecular motion with macroscopic gas behavior.",

                    lessons: 6,

                    difficulty: "Intermediate",

                    duration: "50 min"

                },

                {
                    id: "thermochemistry",

                    title:
                        "Thermochemistry",

                    description:
                        "Study heat, energy changes, enthalpy and calorimetry.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "thermodynamics",

                    title:
                        "Chemical Thermodynamics",

                    description:
                        "Explore entropy, Gibbs energy and spontaneity.",

                    lessons: 11,

                    difficulty: "Advanced",

                    duration: "90 min"

                },

                {
                    id: "equilibrium",

                    title:
                        "Chemical Equilibrium",

                    description:
                        "Understand equilibrium constants, Le Chatelier's principle and equilibrium calculations.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                },

                {
                    id: "kinetics",

                    title:
                        "Chemical Kinetics",

                    description:
                        "Study reaction rates, rate laws, activation energy and reaction mechanisms.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                },

                {
                    id: "phase-equilibria",

                    title:
                        "Phase Equilibria",

                    description:
                        "Study phase behavior, phase diagrams and equilibrium between phases.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "70 min"

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

            category: "analytical",

            icon: "⌁",

            description:
                "Learn how chemists identify, measure and quantify substances.",

            level: "Undergraduate",

            colorClass: "academy-analytical",

            topics: [

                {
                    id: "accuracy-precision",

                    title:
                        "Accuracy, Precision & Error",

                    description:
                        "Understand measurement quality, error and uncertainty.",

                    lessons: 7,

                    difficulty: "Intermediate",

                    duration: "55 min"

                },

                {
                    id: "statistics",

                    title:
                        "Chemical Statistics",

                    description:
                        "Use statistical methods to evaluate chemical measurements.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "75 min"

                },

                {
                    id: "volumetric-analysis",

                    title:
                        "Volumetric Analysis",

                    description:
                        "Understand quantitative analysis using measured solution volumes.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "titration",

                    title:
                        "Titration Analysis",

                    description:
                        "Study equivalence, endpoints, calculations and titration curves.",

                    lessons: 10,

                    difficulty: "Intermediate",

                    duration: "80 min"

                },

                {
                    id: "spectrophotometry",

                    title:
                        "Spectrophotometry",

                    description:
                        "Understand absorbance, transmittance, calibration and quantitative analysis.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                },

                {
                    id: "chromatography",

                    title:
                        "Chromatography",

                    description:
                        "Explore separation and analysis using chromatographic techniques.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

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

            category: "biochemistry",

            icon: "⌁",

            description:
                "Explore the chemistry of biological molecules and biochemical systems.",

            level: "Undergraduate",

            colorClass: "academy-biochemistry",

            topics: [

                {
                    id: "amino-acids",

                    title:
                        "Amino Acids & Proteins",

                    description:
                        "Study amino acids, peptide bonds and protein structure.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "enzymes",

                    title:
                        "Enzymes",

                    description:
                        "Understand enzyme structure, catalysis and factors affecting activity.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "carbohydrates",

                    title:
                        "Carbohydrates",

                    description:
                        "Study monosaccharides, disaccharides and polysaccharides.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "60 min"

                },

                {
                    id: "lipids",

                    title:
                        "Lipids & Membranes",

                    description:
                        "Explore lipid structures, properties and biological membranes.",

                    lessons: 7,

                    difficulty: "Intermediate",

                    duration: "55 min"

                },

                {
                    id: "nucleic-acids",

                    title:
                        "DNA & RNA Chemistry",

                    description:
                        "Understand the chemical structure of nucleic acids.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "70 min"

                },

                {
                    id: "enzyme-kinetics",

                    title:
                        "Enzyme Kinetics",

                    description:
                        "Analyze enzyme reaction rates and kinetic models.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "75 min"

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

            category: "environmental",

            icon: "◌",

            description:
                "Understand chemical processes in water, air, soil and environmental systems.",

            level: "Undergraduate",

            colorClass: "academy-environmental",

            topics: [

                {
                    id: "water-chemistry",

                    title:
                        "Water Chemistry",

                    description:
                        "Study the chemical properties and quality of natural and treated water.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "air-pollution",

                    title:
                        "Atmospheric Chemistry",

                    description:
                        "Explore chemical processes and pollutants in the atmosphere.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "soil-chemistry",

                    title:
                        "Soil Chemistry",

                    description:
                        "Understand chemical processes occurring in soils.",

                    lessons: 7,

                    difficulty: "Intermediate",

                    duration: "55 min"

                },

                {
                    id: "green-chemistry",

                    title:
                        "Green Chemistry",

                    description:
                        "Learn principles for reducing environmental impact through chemistry.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "60 min"

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

            category: "electrochemistry",

            icon: "⚡",

            description:
                "Study chemical reactions involving electron transfer and electrical energy.",

            level: "Undergraduate",

            colorClass: "academy-electrochemistry",

            topics: [

                {
                    id: "electrochemical-cells",

                    title:
                        "Electrochemical Cells",

                    description:
                        "Understand galvanic cells, electrodes and electron flow.",

                    lessons: 9,

                    difficulty: "Intermediate",

                    duration: "70 min"

                },

                {
                    id: "electrode-potentials",

                    title:
                        "Electrode Potentials",

                    description:
                        "Study standard potentials and their relationship to redox chemistry.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "65 min"

                },

                {
                    id: "nernst-equation",

                    title:
                        "The Nernst Equation",

                    description:
                        "Relate electrode potential to chemical conditions.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "70 min"

                },

                {
                    id: "electrolysis",

                    title:
                        "Electrolysis",

                    description:
                        "Study the relationship between electrical energy and chemical change.",

                    lessons: 8,

                    difficulty: "Intermediate",

                    duration: "65 min"

                },

                {
                    id: "corrosion",

                    title:
                        "Corrosion",

                    description:
                        "Understand electrochemical corrosion and protection principles.",

                    lessons: 7,

                    difficulty: "Intermediate",

                    duration: "55 min"

                }

            ]

        },


        /* =================================================
           MATERIALS & INDUSTRIAL
           ================================================= */

        {
            id: "materials",

            name: "Materials & Industrial Chemistry",

            shortName: "Materials",

            category: "materials",

            icon: "▣",

            description:
                "Explore chemistry applied to materials, manufacturing and industrial processes.",

            level: "Advanced",

            colorClass: "academy-materials",

            topics: [

                {
                    id: "polymers",

                    title:
                        "Polymer Chemistry",

                    description:
                        "Study polymer structures, formation and properties.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "70 min"

                },

                {
                    id: "metals-alloys",

                    title:
                        "Metals & Alloys",

                    description:
                        "Explore metallic materials, alloys and their chemical properties.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "65 min"

                },

                {
                    id: "catalysis",

                    title:
                        "Catalysis",

                    description:
                        "Understand catalysts and their role in chemical processes.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "65 min"

                },

                {
                    id: "industrial-processes",

                    title:
                        "Industrial Chemical Processes",

                    description:
                        "Explore major chemical processes and industrial chemistry concepts.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "80 min"

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

            category: "instrumental",

            icon: "⌘",

            description:
                "Learn how modern instruments are used to identify and quantify chemical substances.",

            level: "Advanced",

            colorClass: "academy-instrumental",

            topics: [

                {
                    id: "uv-vis",

                    title:
                        "UV-Visible Spectroscopy",

                    description:
                        "Understand electronic absorption and quantitative spectroscopic analysis.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                },

                {
                    id: "infrared",

                    title:
                        "Infrared Spectroscopy",

                    description:
                        "Use vibrational information to understand molecular structure.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "75 min"

                },

                {
                    id: "nmr",

                    title:
                        "NMR Spectroscopy",

                    description:
                        "Learn the fundamentals of nuclear magnetic resonance and chemical environments.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "90 min"

                },

                {
                    id: "mass-spectrometry",

                    title:
                        "Mass Spectrometry",

                    description:
                        "Understand mass-to-charge measurements and molecular identification.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "80 min"

                },

                {
                    id: "hplc-gc",

                    title:
                        "HPLC & Gas Chromatography",

                    description:
                        "Explore advanced chromatographic analysis and instrumentation.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                }

            ]

        },


        /* =================================================
           NUCLEAR CHEMISTRY
           ================================================= */

        {
            id: "nuclear",

            name: "Nuclear & Radiochemistry",

            shortName: "Nuclear",

            category: "nuclear",

            icon: "◉",

            description:
                "Study nuclear structure, radioactivity, decay and radiochemical concepts.",

            level: "Advanced",

            colorClass: "academy-nuclear",

            topics: [

                {
                    id: "nuclear-structure",

                    title:
                        "Nuclear Structure",

                    description:
                        "Understand nuclei, isotopes and nuclear stability.",

                    lessons: 7,

                    difficulty: "Advanced",

                    duration: "60 min"

                },

                {
                    id: "radioactivity",

                    title:
                        "Radioactivity & Decay",

                    description:
                        "Study radioactive decay and nuclear transformations.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "65 min"

                },

                {
                    id: "half-life",

                    title:
                        "Half-Life & Nuclear Kinetics",

                    description:
                        "Understand radioactive half-life and decay calculations.",

                    lessons: 7,

                    difficulty: "Advanced",

                    duration: "60 min"

                },

                {
                    id: "radiochemical-analysis",

                    title:
                        "Radiochemical Analysis",

                    description:
                        "Explore analytical applications of radioisotopes.",

                    lessons: 7,

                    difficulty: "Advanced",

                    duration: "60 min"

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

            category: "research",

            icon: "⌕",

            description:
                "Develop the scientific reasoning and research skills needed for laboratory work.",

            level: "Advanced",

            colorClass: "academy-research",

            topics: [

                {
                    id: "experimental-design",

                    title:
                        "Experimental Design",

                    description:
                        "Learn hypotheses, variables, controls and experimental planning.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "65 min"

                },

                {
                    id: "data-analysis",

                    title:
                        "Scientific Data Analysis",

                    description:
                        "Analyze experimental measurements using tables, graphs and statistics.",

                    lessons: 9,

                    difficulty: "Advanced",

                    duration: "75 min"

                },

                {
                    id: "error-analysis",

                    title:
                        "Error & Uncertainty Analysis",

                    description:
                        "Evaluate uncertainty and communicate confidence in experimental results.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "70 min"

                },

                {
                    id: "scientific-writing",

                    title:
                        "Scientific Writing",

                    description:
                        "Learn how to communicate laboratory findings clearly and scientifically.",

                    lessons: 8,

                    difficulty: "Advanced",

                    duration: "65 min"

                },

                {
                    id: "research-methodology",

                    title:
                        "Research Methodology",

                    description:
                        "Develop skills for planning, conducting and communicating scientific research.",

                    lessons: 10,

                    difficulty: "Advanced",

                    duration: "85 min"

                }

            ]

        }

    ];


    /* =====================================================
       HELPERS
       ===================================================== */

    function $(selector) {

        return document.querySelector(selector);

    }


    function $$(selector) {

        return Array.from(
            document.querySelectorAll(selector)
        );

    }


    function normalize(value) {

        return String(value || "")
            .trim()
            .toLowerCase();

    }


    /* =====================================================
       CURRICULUM ACCESS
       ===================================================== */

    function getSubjects() {

        return ACADEMY_CURRICULUM;

    }


    function getSubject(subjectId) {

        return ACADEMY_CURRICULUM.find(
            subject =>
                subject.id === subjectId
        ) || null;

    }


    function getTopic(
        subjectId,
        topicId
    ) {

        const subject =
            getSubject(subjectId);

        if (!subject) {
            return null;
        }

        return subject.topics.find(
            topic =>
                topic.id === topicId
        ) || null;

    }


    function getTotalTopics() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) =>
                total + subject.topics.length,
            0
        );

    }


    function getTotalLessons() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) => {

                return total +
                    subject.topics.reduce(
                        (
                            topicTotal,
                            topic
                        ) =>
                            topicTotal +
                            topic.lessons,
                        0
                    );

            },
            0
        );

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function search(query) {

        const searchTerm =
            normalize(query);

        ACADEMY_STATE.searchQuery =
            searchTerm;

        if (!searchTerm) {

            ACADEMY_STATE.filteredSubjects =
                [...ACADEMY_CURRICULUM];

            return ACADEMY_STATE.filteredSubjects;

        }


        ACADEMY_STATE.filteredSubjects =
            ACADEMY_CURRICULUM
                .map(subject => {

                    const subjectMatches =
                        normalize(
                            `${subject.name} ${subject.description}`
                        ).includes(searchTerm);


                    const topics =
                        subject.topics.filter(
                            topic => {

                                return normalize(
                                    `${topic.title} ${topic.description}`
                                ).includes(
                                    searchTerm
                                );

                            }
                        );


                    if (
                        subjectMatches ||
                        topics.length
                    ) {

                        return {

                            ...subject,

                            topics:
                                subjectMatches
                                    ? [...subject.topics]
                                    : topics

                        };

                    }

                    return null;

                })
                .filter(Boolean);


        return ACADEMY_STATE.filteredSubjects;
    }


    /* =====================================================
       RENDER SUBJECT COUNT
       ===================================================== */

    function renderAcademyStats() {

        setText(
            "#academySubjectCount",
            ACADEMY_CURRICULUM.length
        );

        setText(
            "#academyTopicCount",
            getTotalTopics()
        );

        setText(
            "#academyLessonCount",
            getTotalLessons()
        );

    }


    /* =====================================================
       SUBJECT FILTER
       ===================================================== */

    function filterByLevel(level) {

        const normalizedLevel =
            normalize(level);

        if (
            !normalizedLevel ||
            normalizedLevel === "all"
        ) {

            ACADEMY_STATE.filteredSubjects =
                [...ACADEMY_CURRICULUM];

            return;

        }


        ACADEMY_STATE.filteredSubjects =
            ACADEMY_CURRICULUM.filter(
                subject =>
                    normalize(
                        subject.level
                    ) === normalizedLevel
            );

    }


    /* =====================================================
       UI HELPERS
       ===================================================== */

    function setText(
        selector,
        value
    ) {

        const element =
            $(selector);

        if (!element) {
            return;
        }

        element.textContent =
            value;
    }


    /* =====================================================
       TOPIC NAVIGATION
       ===================================================== */

    function openSubject(subjectId) {

        const subject =
            getSubject(subjectId);

        if (!subject) {
            return;
        }

        ACADEMY_STATE.currentSubject =
            subject;

        ACADEMY_STATE.currentTopic =
            null;


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

    }


    function openTopic(
        subjectId,
        topicId
    ) {

        const subject =
            getSubject(subjectId);

        const topic =
            getTopic(
                subjectId,
                topicId
            );

        if (
            !subject ||
            !topic
        ) {
            return;
        }


        ACADEMY_STATE.currentSubject =
            subject;

        ACADEMY_STATE.currentTopic =
            topic;


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

    }


    /* =====================================================
       ACADEMY SEARCH UI
       ===================================================== */

    function bindSearch() {

        const input =
            $("#academySearchInput");

        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function () {

                search(
                    this.value
                );

                document.dispatchEvent(
                    new CustomEvent(
                        "chemlab:academy-search",
                        {
                            detail: {
                                query:
                                    this.value,

                                results:
                                    ACADEMY_STATE.filteredSubjects
                            }
                        }
                    )
                );

            }
        );

    }


    /* =====================================================
       LEVEL FILTER UI
       ===================================================== */

    function bindLevelFilters() {

        $$(
            "[data-academy-level]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const level =
                        this.dataset.academyLevel;

                    filterByLevel(
                        level
                    );


                    $$(
                        "[data-academy-level]"
                    ).forEach(item => {

                        item.classList.remove(
                            "is-active"
                        );

                    });


                    this.classList.add(
                        "is-active"
                    );


                    document.dispatchEvent(
                        new CustomEvent(
                            "chemlab:academy-filter",
                            {
                                detail: {
                                    level,

                                    results:
                                        ACADEMY_STATE.filteredSubjects
                                }
                            }
                        )
                    );

                }
            );

        });

    }


    /* =====================================================
       ACADEMY INITIALIZATION
       ===================================================== */

    function initialize() {

        if (
            ACADEMY_STATE.initialized
        ) {
            return;
        }


        ACADEMY_STATE.subjects =
            [...ACADEMY_CURRICULUM];

        ACADEMY_STATE.filteredSubjects =
            [...ACADEMY_CURRICULUM];


        bindSearch();

        bindLevelFilters();

        renderAcademyStats();


        ACADEMY_STATE.initialized =
            true;


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-ready",
                {
                    detail: {
                        subjects:
                            ACADEMY_CURRICULUM,

                        totalTopics:
                            getTotalTopics(),

                        totalLessons:
                            getTotalLessons()
                    }
                }
            )
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_ACADEMY = {

        initialize,

        getSubjects,

        getSubject,

        getTopic,

        search,

        filterByLevel,

        openSubject,

        openTopic,

        getTotalTopics,

        getTotalLessons,

        getState: function () {

            return {

                initialized:
                    ACADEMY_STATE.initialized,

                currentSubject:
                    ACADEMY_STATE.currentSubject,

                currentTopic:
                    ACADEMY_STATE.currentTopic,

                subjects:
                    [...ACADEMY_STATE.subjects],

                filteredSubjects:
                    [...ACADEMY_STATE.filteredSubjects],

                searchQuery:
                    ACADEMY_STATE.searchQuery

            };

        }

    };


})();

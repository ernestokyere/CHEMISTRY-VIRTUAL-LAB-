/* =========================================================
   CHEMLAB
   CHEMISTRY ACADEMY ENGINE
   Stage 5.5 — Unified Learning System
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const STORAGE = {
        progress: "chemlab_academy_progress",
        xp: "chemlab_science_xp"
    };


    const ACADEMY_STATE = {
        initialized: false,
        currentSubject: null,
        currentTopic: null,
        currentLesson: null,

        subjects: [],
        filteredSubjects: [],

        searchQuery: "",
        levelFilter: "all",

        loading: false
    };


    /* =====================================================
       CURRICULUM
       ===================================================== */

    const ACADEMY_CURRICULUM = [

        /* =================================================
           1. FOUNDATIONS
           ================================================= */

        {
            id: "foundations",
            title: "Foundations of Chemistry",
            description:
                "Build the scientific and mathematical foundations required for serious chemistry.",
            level: "Foundation",
            icon: "⚗",
            topics: [

                {
                    id: "measurements-scientific-units",
                    title: "Measurements & Scientific Units",
                    description:
                        "Learn how chemists measure, record, convert, and interpret scientific quantities.",
                    difficulty: "Beginner",
                    duration: 120,
                    lessons: 10,
                    icon: "📏"
                },

                {
                    id: "significant-figures",
                    title: "Significant Figures",
                    description:
                        "Understand precision, rounding, and significant figures in chemical calculations.",
                    difficulty: "Beginner",
                    duration: 45,
                    lessons: 5,
                    icon: "🔢"
                },

                {
                    id: "dimensional-analysis",
                    title: "Dimensional Analysis",
                    description:
                        "Use units as a powerful tool for solving chemistry calculations.",
                    difficulty: "Beginner",
                    duration: 50,
                    lessons: 5,
                    icon: "↔"
                },

                {
                    id: "atomic-structure-periodic-table",
                    title: "Atomic Structure & the Periodic Table",
                    description:
                        "Explore atoms, subatomic particles, isotopes, electron configuration, and periodic trends.",
                    difficulty: "Intermediate",
                    duration: 150,
                    lessons: 12,
                    icon: "⚛"
                },

                {
                    id: "chemical-formulas",
                    title: "Chemical Formulas & Equations",
                    description:
                        "Learn how chemical substances and reactions are represented symbolically.",
                    difficulty: "Beginner",
                    duration: 60,
                    lessons: 6,
                    icon: "🧪"
                },

                {
                    id: "mole-concept",
                    title: "The Mole Concept",
                    description:
                        "Master moles, molar mass, Avogadro's constant, and chemical quantity.",
                    difficulty: "Intermediate",
                    duration: 70,
                    lessons: 7,
                    icon: "◉"
                },

                {
                    id: "stoichiometry",
                    title: "Stoichiometry",
                    description:
                        "Calculate quantities of reactants and products in chemical reactions.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "⚖"
                },

                {
                    id: "solutions",
                    title: "Solutions & Concentration",
                    description:
                        "Understand concentration, dilution, solution preparation, and related calculations.",
                    difficulty: "Intermediate",
                    duration: 70,
                    lessons: 6,
                    icon: "🧴"
                },

                {
                    id: "uncertainty",
                    title: "Uncertainty & Experimental Error",
                    description:
                        "Understand uncertainty, error, accuracy, precision, and scientific reporting.",
                    difficulty: "Intermediate",
                    duration: 65,
                    lessons: 6,
                    icon: "±"
                }
            ]
        },


        /* =================================================
           2. INORGANIC
           ================================================= */

        {
            id: "inorganic",
            title: "Inorganic Chemistry",
            description:
                "Study elements, compounds, bonding, reactions, coordination chemistry, and inorganic systems.",
            level: "Undergraduate",
            icon: "◈",
            topics: [

                {
                    id: "periodic-chemistry",
                    title: "Periodic Chemistry",
                    description:
                        "Explore chemical behavior across the periodic table.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "▦"
                },

                {
                    id: "chemical-bonding",
                    title: "Chemical Bonding",
                    description:
                        "Study ionic, covalent, metallic, and intermolecular bonding.",
                    difficulty: "Intermediate",
                    duration: 100,
                    lessons: 9,
                    icon: "🔗"
                },

                {
                    id: "acids-bases",
                    title: "Acids & Bases",
                    description:
                        "Understand acid-base theories, pH, buffers, and neutralization.",
                    difficulty: "Intermediate",
                    duration: 100,
                    lessons: 10,
                    icon: "pH"
                },

                {
                    id: "redox",
                    title: "Redox Chemistry",
                    description:
                        "Explore oxidation, reduction, oxidation states, and electron transfer.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "⇄"
                },

                {
                    id: "precipitation",
                    title: "Precipitation Chemistry",
                    description:
                        "Study precipitation reactions, solubility, and ionic equilibria.",
                    difficulty: "Advanced",
                    duration: 80,
                    lessons: 7,
                    icon: "↓"
                },

                {
                    id: "coordination",
                    title: "Coordination Chemistry",
                    description:
                        "Explore coordination compounds, ligands, geometry, and complex ions.",
                    difficulty: "Advanced",
                    duration: 110,
                    lessons: 9,
                    icon: "◇"
                },

                {
                    id: "qualitative-analysis",
                    title: "Qualitative Analysis",
                    description:
                        "Learn the principles behind identifying ions and chemical species.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 10,
                    icon: "🔍"
                }
            ]
        },


        /* =================================================
           3. ORGANIC
           ================================================= */

        {
            id: "organic",
            title: "Organic Chemistry",
            description:
                "Study carbon compounds, structures, reactions, mechanisms, synthesis, and spectroscopy.",
            level: "Undergraduate",
            icon: "⌬",
            topics: [

                {
                    id: "organic-structures",
                    title: "Organic Structures",
                    description: "Representations and structures of organic molecules.",
                    difficulty: "Intermediate",
                    duration: 80,
                    lessons: 8,
                    icon: "⌬"
                },

                {
                    id: "nomenclature",
                    title: "Organic Nomenclature",
                    description: "Systematic naming of organic compounds.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "N"
                },

                {
                    id: "isomerism",
                    title: "Isomerism",
                    description: "Structural and stereoisomerism in organic molecules.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 9,
                    icon: "↔"
                },

                {
                    id: "functional-groups",
                    title: "Functional Groups",
                    description: "Identify and understand major organic functional groups.",
                    difficulty: "Intermediate",
                    duration: 80,
                    lessons: 8,
                    icon: "ƒ"
                },

                {
                    id: "organic-reactions",
                    title: "Organic Reactions",
                    description: "Understand major reaction classes in organic chemistry.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 12,
                    icon: "⚗"
                },

                {
                    id: "reaction-mechanisms",
                    title: "Reaction Mechanisms",
                    description: "Explore how organic reactions occur at the molecular level.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 10,
                    icon: "→"
                },

                {
                    id: "organic-synthesis",
                    title: "Organic Synthesis",
                    description: "Plan and analyze multistep synthetic pathways.",
                    difficulty: "Advanced",
                    duration: 140,
                    lessons: 10,
                    icon: "🧩"
                },

                {
                    id: "purification",
                    title: "Purification Techniques",
                    description: "Study extraction, recrystallization, distillation, and chromatography.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 8,
                    icon: "◇"
                }
            ]
        },


        /* =================================================
           4. PHYSICAL
           ================================================= */

        {
            id: "physical",
            title: "Physical Chemistry",
            description:
                "Use mathematics and physics to understand chemical systems.",
            level: "Undergraduate",
            icon: "∑",
            topics: [

                {
                    id: "gas-laws",
                    title: "Gas Laws",
                    description: "Pressure, volume, temperature, and gas behavior.",
                    difficulty: "Intermediate",
                    duration: 70,
                    lessons: 7,
                    icon: "◎"
                },

                {
                    id: "kinetic-theory",
                    title: "Kinetic Theory",
                    description: "Particle motion and molecular interpretation of gases.",
                    difficulty: "Intermediate",
                    duration: 80,
                    lessons: 7,
                    icon: "↯"
                },

                {
                    id: "thermochemistry",
                    title: "Thermochemistry",
                    description: "Energy changes accompanying chemical processes.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "Δ"
                },

                {
                    id: "thermodynamics",
                    title: "Thermodynamics",
                    description: "Energy, entropy, spontaneity, and thermodynamic systems.",
                    difficulty: "Advanced",
                    duration: 130,
                    lessons: 11,
                    icon: "∇"
                },

                {
                    id: "equilibrium",
                    title: "Chemical Equilibrium",
                    description: "Dynamic equilibrium and equilibrium constants.",
                    difficulty: "Advanced",
                    duration: 110,
                    lessons: 10,
                    icon: "⇌"
                },

                {
                    id: "kinetics",
                    title: "Chemical Kinetics",
                    description: "Reaction rates, rate laws, mechanisms, and activation energy.",
                    difficulty: "Advanced",
                    duration: 110,
                    lessons: 10,
                    icon: "⏱"
                },

                {
                    id: "quantum",
                    title: "Quantum Chemistry Fundamentals",
                    description: "Introductory quantum concepts applied to chemical systems.",
                    difficulty: "Advanced",
                    duration: 130,
                    lessons: 10,
                    icon: "Ψ"
                }
            ]
        },


        /* =================================================
           5. ANALYTICAL
           ================================================= */

        {
            id: "analytical",
            title: "Analytical Chemistry",
            description:
                "Learn how chemists identify, measure, quantify, and validate chemical information.",
            level: "Undergraduate",
            icon: "⌁",
            topics: [

                {
                    id: "accuracy-precision",
                    title: "Accuracy & Precision",
                    description: "Evaluate the quality of experimental measurements.",
                    difficulty: "Intermediate",
                    duration: 60,
                    lessons: 6,
                    icon: "◎"
                },

                {
                    id: "statistics",
                    title: "Analytical Statistics",
                    description: "Use statistics to interpret chemical measurements.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 8,
                    icon: "∑"
                },

                {
                    id: "calibration",
                    title: "Calibration Methods",
                    description: "Understand calibration curves and analytical standards.",
                    difficulty: "Advanced",
                    duration: 90,
                    lessons: 8,
                    icon: "⌁"
                },

                {
                    id: "titration",
                    title: "Titration",
                    description: "Explore volumetric analysis and titration calculations.",
                    difficulty: "Intermediate",
                    duration: 100,
                    lessons: 9,
                    icon: "⚗"
                },

                {
                    id: "gravimetry",
                    title: "Gravimetric Analysis",
                    description: "Quantitative analysis based on mass measurements.",
                    difficulty: "Advanced",
                    duration: 90,
                    lessons: 7,
                    icon: "⚖"
                },

                {
                    id: "spectrophotometry",
                    title: "Spectrophotometry",
                    description: "Measure chemical species through light absorption.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 10,
                    icon: "◐"
                },

                {
                    id: "chromatography",
                    title: "Chromatography",
                    description: "Separate and analyze chemical mixtures.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 10,
                    icon: "▥"
                }
            ]
        },


        /* =================================================
           6. BIOCHEMISTRY
           ================================================= */

        {
            id: "biochemistry",
            title: "Biochemistry",
            description:
                "Explore the chemistry of living systems.",
            level: "Undergraduate",
            icon: "🧬",
            topics: [

                {
                    id: "biomolecules",
                    title: "Biomolecules",
                    description: "Carbohydrates, lipids, proteins, and nucleic acids.",
                    difficulty: "Intermediate",
                    duration: 100,
                    lessons: 9,
                    icon: "🧬"
                },

                {
                    id: "enzymes",
                    title: "Enzymes",
                    description: "Structure, function, catalysis, and enzyme kinetics.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 9,
                    icon: "⚙"
                },

                {
                    id: "metabolism",
                    title: "Metabolism",
                    description: "Chemical pathways involved in energy and biosynthesis.",
                    difficulty: "Advanced",
                    duration: 130,
                    lessons: 11,
                    icon: "↻"
                }
            ]
        },


        /* =================================================
           7. ENVIRONMENTAL
           ================================================= */

        {
            id: "environmental",
            title: "Environmental Chemistry",
            description:
                "Understand chemical processes affecting air, water, soil, and ecosystems.",
            level: "Undergraduate",
            icon: "🌍",
            topics: [

                {
                    id: "atmospheric",
                    title: "Atmospheric Chemistry",
                    description: "Chemical processes in Earth's atmosphere.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "☁"
                },

                {
                    id: "water-chemistry",
                    title: "Water Chemistry",
                    description: "Chemical properties and analysis of water systems.",
                    difficulty: "Intermediate",
                    duration: 100,
                    lessons: 9,
                    icon: "💧"
                },

                {
                    id: "pollution",
                    title: "Pollution Chemistry",
                    description: "Chemical sources and consequences of environmental pollution.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 8,
                    icon: "⚠"
                }
            ]
        },


        /* =================================================
           8. ELECTROCHEMISTRY
           ================================================= */

        {
            id: "electrochemistry",
            title: "Electrochemistry",
            description:
                "Study chemical systems involving electrical energy and electron transfer.",
            level: "Undergraduate",
            icon: "⚡",
            topics: [

                {
                    id: "electrochemical-cells",
                    title: "Electrochemical Cells",
                    description: "Understand galvanic and electrochemical cells.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "🔋"
                },

                {
                    id: "electrolysis",
                    title: "Electrolysis",
                    description: "Explore chemical changes driven by electrical energy.",
                    difficulty: "Intermediate",
                    duration: 90,
                    lessons: 8,
                    icon: "⚡"
                },

                {
                    id: "electrode-potentials",
                    title: "Electrode Potentials",
                    description: "Study standard potentials and electrochemical driving forces.",
                    difficulty: "Advanced",
                    duration: 110,
                    lessons: 9,
                    icon: "Δ"
                }
            ]
        },


        /* =================================================
           9. MATERIALS & INDUSTRIAL
           ================================================= */

        {
            id: "materials-industrial",
            title: "Materials & Industrial Chemistry",
            description:
                "Explore chemical principles behind materials and industrial processes.",
            level: "Advanced",
            icon: "⬡",
            topics: [

                {
                    id: "polymers",
                    title: "Polymers",
                    description: "Structure, synthesis, properties, and applications of polymers.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 8,
                    icon: "⌁"
                },

                {
                    id: "industrial-processes",
                    title: "Industrial Chemical Processes",
                    description: "Study chemistry at industrial scale.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 10,
                    icon: "🏭"
                },

                {
                    id: "materials",
                    title: "Materials Chemistry",
                    description: "Understand chemical structure and material properties.",
                    difficulty: "Advanced",
                    duration: 110,
                    lessons: 9,
                    icon: "⬡"
                }
            ]
        },


        /* =================================================
           10. INSTRUMENTAL
           ================================================= */

        {
            id: "instrumental",
            title: "Instrumental & Spectroscopic Chemistry",
            description:
                "Learn how modern instruments reveal chemical structure and composition.",
            level: "Advanced",
            icon: "⌬",
            topics: [

                {
                    id: "uv-visible",
                    title: "UV-Visible Spectroscopy",
                    description: "Analyze molecular absorption in the ultraviolet and visible regions.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 9,
                    icon: "◐"
                },

                {
                    id: "ir",
                    title: "Infrared Spectroscopy",
                    description: "Use vibrational spectra to identify chemical groups.",
                    difficulty: "Advanced",
                    duration: 110,
                    lessons: 9,
                    icon: "≋"
                },

                {
                    id: "nmr",
                    title: "NMR Spectroscopy",
                    description: "Explore nuclear magnetic resonance and molecular structure.",
                    difficulty: "Advanced",
                    duration: 140,
                    lessons: 11,
                    icon: "⌬"
                },

                {
                    id: "mass-spectrometry",
                    title: "Mass Spectrometry",
                    description: "Analyze molecular mass and fragmentation patterns.",
                    difficulty: "Advanced",
                    duration: 120,
                    lessons: 10,
                    icon: "m/z"
                }
            ]
        },


        /* =================================================
           11. NUCLEAR
           ================================================= */

        {
            id: "nuclear",
            title: "Nuclear & Radiochemistry",
            description:
                "Explore nuclear structure, radioactivity, decay, and applications.",
            level: "Advanced",
            icon: "☢",
            topics: [

                {
                    id: "nuclear-structure",
                    title: "Nuclear Structure",
                    description: "Study nuclei, isotopes, and nuclear stability.",
                    difficulty: "Advanced",
                    duration: 90,
                    lessons: 8,
                    icon: "◎"
                },

                {
                    id: "radioactivity",
                    title: "Radioactivity",
                    description: "Understand radioactive decay and nuclear transformations.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 9,
                    icon: "☢"
                },

                {
                    id: "nuclear-applications",
                    title: "Nuclear Applications",
                    description: "Explore scientific and medical applications of nuclear chemistry.",
                    difficulty: "Advanced",
                    duration: 90,
                    lessons: 8,
                    icon: "⚛"
                }
            ]
        },


        /* =================================================
           12. RESEARCH
           ================================================= */

        {
            id: "research",
            title: "Research & Laboratory Science",
            description:
                "Develop the skills needed for scientific investigation and laboratory research.",
            level: "Advanced",
            icon: "🔬",
            topics: [

                {
                    id: "scientific-method",
                    title: "The Scientific Method",
                    description: "Design investigations using scientific reasoning.",
                    difficulty: "Intermediate",
                    duration: 70,
                    lessons: 7,
                    icon: "→"
                },

                {
                    id: "experimental-design",
                    title: "Experimental Design",
                    description: "Design reliable and reproducible experiments.",
                    difficulty: "Advanced",
                    duration: 100,
                    lessons: 9,
                    icon: "🧪"
                },

                {
                    id: "laboratory-safety",
                    title: "Laboratory Safety",
                    description: "Understand safe laboratory practice and risk awareness.",
                    difficulty: "Foundation",
                    duration: 60,
                    lessons: 6,
                    icon: "🛡"
                },

                {
                    id: "scientific-reporting",
                    title: "Scientific Reporting",
                    description: "Communicate experimental findings professionally.",
                    difficulty: "Advanced",
                    duration: 80,
                    lessons: 7,
                    icon: "📄"
                }
            ]
        }
    ];


    /* =====================================================
       LESSON CONTENT
       ===================================================== */

    const LESSON_CONTENT = {


        /* =================================================
           MEASUREMENTS
           ================================================= */

        "measurements-scientific-units": [

            {
                id: "measurement-1",
                title: "What Is a Scientific Measurement?",
                type: "lesson",
                duration: 10,

                objectives: [
                    "Define scientific measurement.",
                    "Identify the parts of a measured quantity.",
                    "Explain why measurements are important in chemistry."
                ],

                content: [
                    {
                        heading: "Measurement in chemistry",
                        text:
                            "A scientific measurement is a quantitative description of a physical quantity. In chemistry, measurements allow scientists to describe matter, compare substances, perform calculations, and communicate experimental results."
                    },
                    {
                        heading: "Every measurement has two parts",
                        text:
                            "A measurement consists of a numerical value and a unit. For example, 25.0 mL contains the numerical value 25.0 and the unit millilitre."
                    }
                ],

                keyPoints: [
                    "Measurements describe physical quantities.",
                    "A numerical value without a unit is incomplete.",
                    "Measurements are fundamental to experimental chemistry."
                ],

                workedExample: {
                    question: "A sample has a mass of 12.5 g. Identify the quantity, numerical value, and unit.",
                    answer:
                        "The quantity is mass, the numerical value is 12.5, and the unit is gram (g)."
                },

                knowledgeCheck: {
                    question: "Which statement best describes a scientific measurement?",
                    options: [
                        "A number written without a unit",
                        "A qualitative description only",
                        "A quantitative value expressed with an appropriate unit",
                        "An estimate that cannot be recorded"
                    ],
                    answer: 2
                }
            },


            {
                id: "measurement-2",
                title: "The SI System of Units",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Explain the purpose of the SI system.",
                    "Identify common SI base units used in chemistry.",
                    "Distinguish between base and derived units."
                ],

                content: [
                    {
                        heading: "International measurement",
                        text:
                            "The International System of Units, abbreviated SI, provides a consistent framework for scientific measurement."
                    },
                    {
                        heading: "Important SI quantities",
                        text:
                            "Chemistry frequently uses metre for length, kilogram for mass, second for time, kelvin for temperature, mole for amount of substance, and ampere for electric current."
                    }
                ],

                keyPoints: [
                    "SI provides a common measurement language.",
                    "The mole is the SI base unit for amount of substance.",
                    "Many chemistry units are derived from SI units."
                ],

                workedExample: {
                    question: "Which SI base unit represents amount of substance?",
                    answer: "The mole (mol)."
                },

                knowledgeCheck: {
                    question: "Which is the SI base unit for temperature?",
                    options: [
                        "Degree Celsius",
                        "Kelvin",
                        "Joule",
                        "Pascal"
                    ],
                    answer: 1
                }
            },


            {
                id: "measurement-3",
                title: "Common Chemistry Units",
                type: "lesson",
                duration: 10,

                objectives: [
                    "Recognize common chemistry units.",
                    "Connect units to physical quantities.",
                    "Distinguish between common laboratory units."
                ],

                content: [
                    {
                        heading: "Mass",
                        text:
                            "Chemists commonly measure mass using grams or kilograms."
                    },
                    {
                        heading: "Volume",
                        text:
                            "Laboratory liquid volumes are commonly reported in litres, millilitres, or cubic centimetres."
                    },
                    {
                        heading: "Temperature",
                        text:
                            "Temperature may be reported in degrees Celsius in laboratory work, while kelvin is the SI base unit."
                    }
                ],

                keyPoints: [
                    "Mass can be measured in g or kg.",
                    "Volume can be measured in L or mL.",
                    "Temperature has both Celsius and kelvin scales commonly encountered in chemistry."
                ],

                workedExample: {
                    question: "Convert 2.5 L to mL.",
                    answer: "2.5 L × 1000 mL/L = 2500 mL."
                },

                knowledgeCheck: {
                    question: "Which unit is commonly used for laboratory liquid volume?",
                    options: [
                        "mL",
                        "kg",
                        "K",
                        "mol"
                    ],
                    answer: 0
                }
            },


            {
                id: "measurement-4",
                title: "Scientific Notation",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Write very large and small numbers in scientific notation.",
                    "Interpret powers of ten.",
                    "Use scientific notation in chemistry."
                ],

                content: [
                    {
                        heading: "Why scientific notation matters",
                        text:
                            "Chemistry frequently deals with extremely small particles and extremely large numbers. Scientific notation makes these quantities easier to write and calculate."
                    },
                    {
                        heading: "Basic form",
                        text:
                            "Scientific notation is written as a × 10ⁿ, where a is at least 1 but less than 10."
                    }
                ],

                keyPoints: [
                    "Scientific notation uses powers of ten.",
                    "The coefficient is normally between 1 and 10.",
                    "Negative exponents represent numbers smaller than one."
                ],

                workedExample: {
                    question: "Write 0.00045 in scientific notation.",
                    answer: "4.5 × 10⁻⁴."
                },

                knowledgeCheck: {
                    question: "Which is the scientific notation for 560000?",
                    options: [
                        "5.6 × 10⁵",
                        "56 × 10⁴",
                        "0.56 × 10⁶",
                        "5.6 × 10⁶"
                    ],
                    answer: 0
                }
            },


            {
                id: "measurement-5",
                title: "Significant Figures",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Identify significant figures.",
                    "Distinguish significant digits from placeholders.",
                    "Explain why significant figures matter."
                ],

                content: [
                    {
                        heading: "Meaning of significant figures",
                        text:
                            "Significant figures communicate the precision supported by a measurement. They prevent calculated results from appearing more precise than the measurements used."
                    },
                    {
                        heading: "Zeros",
                        text:
                            "Zeros may be significant depending on their position. Zeros between non-zero digits are significant, while leading zeros generally are not."
                    }
                ],

                keyPoints: [
                    "Significant figures communicate measurement precision.",
                    "Leading zeros are generally not significant.",
                    "Zeros between non-zero digits are significant."
                ],

                workedExample: {
                    question: "How many significant figures are in 0.00450?",
                    answer: "Three significant figures: 4, 5, and the final zero."
                },

                knowledgeCheck: {
                    question: "How many significant figures are in 0.00450?",
                    options: [
                        "2",
                        "3",
                        "4",
                        "5"
                    ],
                    answer: 1
                }
            },


            {
                id: "measurement-6",
                title: "Accuracy and Precision",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Define accuracy.",
                    "Define precision.",
                    "Distinguish accuracy from precision."
                ],

                content: [
                    {
                        heading: "Accuracy",
                        text:
                            "Accuracy describes how close a measurement is to an accepted or reference value."
                    },
                    {
                        heading: "Precision",
                        text:
                            "Precision describes how closely repeated measurements agree with one another."
                    }
                ],

                keyPoints: [
                    "Accuracy concerns closeness to a reference value.",
                    "Precision concerns agreement between repeated measurements.",
                    "A measurement can be precise without being accurate."
                ],

                workedExample: {
                    question:
                        "Three measurements are 10.01, 10.02, and 10.01 when the reference value is 10.00. What characteristic do they demonstrate?",
                    answer:
                        "They demonstrate high precision and are also close to the reference value, indicating good accuracy."
                },

                knowledgeCheck: {
                    question: "Precision primarily describes:",
                    options: [
                        "Closeness to the accepted value",
                        "Agreement among repeated measurements",
                        "The size of the instrument",
                        "The unit used"
                    ],
                    answer: 1
                }
            },


            {
                id: "measurement-7",
                title: "Measurement Uncertainty",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Explain measurement uncertainty.",
                    "Recognize why instruments have limits.",
                    "Report measurements appropriately."
                ],

                content: [
                    {
                        heading: "No measurement is perfectly exact",
                        text:
                            "Real measurements contain uncertainty because instruments have finite resolution and experimental conditions are not perfectly controlled."
                    },
                    {
                        heading: "Reporting uncertainty",
                        text:
                            "Scientists communicate uncertainty through appropriate significant figures, uncertainty estimates, or stated instrument limitations."
                    }
                ],

                keyPoints: [
                    "Measurements contain uncertainty.",
                    "Instrument resolution affects uncertainty.",
                    "Scientific reporting should communicate realistic precision."
                ],

                workedExample: {
                    question:
                        "Why should a digital balance reading not normally be reported with many extra invented decimal places?",
                    answer:
                        "Because the instrument does not provide information supporting those additional digits."
                },

                knowledgeCheck: {
                    question: "What contributes to measurement uncertainty?",
                    options: [
                        "Instrument limitations",
                        "Only mathematical errors",
                        "The chemical formula",
                        "The color of the sample"
                    ],
                    answer: 0
                }
            },


            {
                id: "measurement-8",
                title: "Dimensional Analysis",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Use units to organize calculations.",
                    "Set up conversion factors.",
                    "Check whether an answer has appropriate units."
                ],

                content: [
                    {
                        heading: "Units as a calculation tool",
                        text:
                            "Dimensional analysis treats units as algebraic quantities. Conversion factors are arranged so unwanted units cancel."
                    }
                ],

                keyPoints: [
                    "Units can be cancelled algebraically.",
                    "Conversion factors equal one.",
                    "The final unit should match the requested quantity."
                ],

                workedExample: {
                    question: "Convert 2.5 L to mL.",
                    answer:
                        "2.5 L × (1000 mL / 1 L) = 2500 mL."
                },

                knowledgeCheck: {
                    question: "In dimensional analysis, unwanted units should:",
                    options: [
                        "Remain in the final answer",
                        "Cancel",
                        "Be squared",
                        "Be ignored"
                    ],
                    answer: 1
                }
            },


            {
                id: "measurement-9",
                title: "Unit Conversions in Chemistry",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Convert between common chemistry units.",
                    "Use metric prefixes.",
                    "Check conversions for reasonableness."
                ],

                content: [
                    {
                        heading: "Metric prefixes",
                        text:
                            "Prefixes such as kilo-, centi-, milli-, and micro- represent powers of ten and make unit conversion systematic."
                    }
                ],

                keyPoints: [
                    "Metric prefixes represent powers of ten.",
                    "Always identify the starting and desired units.",
                    "Use conversion factors instead of guessing."
                ],

                workedExample: {
                    question: "Convert 3500 mg to g.",
                    answer:
                        "3500 mg × (1 g / 1000 mg) = 3.5 g."
                },

                knowledgeCheck: {
                    question: "1000 mg is equal to:",
                    options: [
                        "0.001 g",
                        "0.1 g",
                        "1 g",
                        "10 g"
                    ],
                    answer: 2
                }
            },


            {
                id: "measurement-10",
                title: "Reading Scientific Data",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Interpret tables and graphs.",
                    "Identify trends in experimental data.",
                    "Distinguish observations from conclusions."
                ],

                content: [
                    {
                        heading: "Scientific data",
                        text:
                            "Chemists use tables, graphs, measurements, and calculated quantities to communicate experimental results."
                    },
                    {
                        heading: "Interpretation",
                        text:
                            "A useful interpretation identifies patterns supported by the data without claiming more than the evidence shows."
                    }
                ],

                keyPoints: [
                    "Tables organize measurements.",
                    "Graphs reveal relationships and trends.",
                    "Conclusions should be supported by the data."
                ],

                workedExample: {
                    question:
                        "A graph shows that reaction rate increases as temperature increases. What relationship is suggested?",
                    answer:
                        "The data suggest that reaction rate increases with increasing temperature over the measured range."
                },

                knowledgeCheck: {
                    question: "A scientific conclusion should primarily be based on:",
                    options: [
                        "Personal preference",
                        "Experimental evidence",
                        "A guess",
                        "The most attractive graph"
                    ],
                    answer: 1
                }
            }
        ],


        /* =================================================
           ATOMIC STRUCTURE + PERIODIC TABLE
           ================================================= */

        "atomic-structure-periodic-table": [

            {
                id: "atomic-1",
                title: "Introduction to Atomic Structure",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Describe the basic structure of an atom.",
                    "Identify the nucleus and electron region.",
                    "Explain why atomic structure matters in chemistry."
                ],

                content: [
                    {
                        heading: "What is an atom?",
                        text:
                            "An atom is the basic unit of an element that retains the chemical identity of that element. Modern chemistry describes atoms using a dense nucleus surrounded by electrons."
                    },
                    {
                        heading: "The nucleus",
                        text:
                            "The nucleus contains protons and neutrons. Electrons occupy regions around the nucleus described by quantum mechanical models."
                    }
                ],

                keyPoints: [
                    "Atoms contain protons, neutrons, and electrons.",
                    "The nucleus contains protons and neutrons.",
                    "Electrons occupy regions around the nucleus."
                ],

                workedExample: {
                    question: "Which particles are found in the atomic nucleus?",
                    answer: "Protons and neutrons."
                },

                knowledgeCheck: {
                    question: "Where are most of an atom's protons located?",
                    options: [
                        "In the electron cloud",
                        "In the nucleus",
                        "Outside the atom",
                        "Between atoms"
                    ],
                    answer: 1
                }
            },


            {
                id: "atomic-2",
                title: "Subatomic Particles",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Identify protons, neutrons, and electrons.",
                    "Compare their charges.",
                    "Relate particles to atomic mass and charge."
                ],

                content: [
                    {
                        heading: "The three major particles",
                        text:
                            "Protons have positive charge, electrons have negative charge, and neutrons have no net electric charge."
                    },
                    {
                        heading: "Relative masses",
                        text:
                            "Protons and neutrons have much greater mass than electrons. This is why nearly all of an atom's mass is associated with its nucleus."
                    }
                ],

                keyPoints: [
                    "Proton: positive.",
                    "Neutron: neutral.",
                    "Electron: negative."
                ],

                workedExample: {
                    question: "Which subatomic particle determines whether an atom is positively or negatively charged when its number changes?",
                    answer:
                        "Electrons. Losing electrons can produce a positive ion, while gaining electrons can produce a negative ion."
                },

                knowledgeCheck: {
                    question: "Which particle has a negative charge?",
                    options: [
                        "Proton",
                        "Neutron",
                        "Electron",
                        "Nucleus"
                    ],
                    answer: 2
                }
            },


            {
                id: "atomic-3",
                title: "Atomic Number and Mass Number",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Define atomic number.",
                    "Define mass number.",
                    "Determine numbers of protons and neutrons."
                ],

                content: [
                    {
                        heading: "Atomic number",
                        text:
                            "The atomic number, Z, is the number of protons in an atom's nucleus. It identifies the element."
                    },
                    {
                        heading: "Mass number",
                        text:
                            "The mass number, A, is the total number of protons and neutrons in the nucleus."
                    }
                ],

                keyPoints: [
                    "Z = number of protons.",
                    "A = protons + neutrons.",
                    "Neutrons = A − Z."
                ],

                workedExample: {
                    question:
                        "An atom has atomic number 8 and mass number 16. How many neutrons does it have?",
                    answer:
                        "Neutrons = 16 − 8 = 8."
                },

                knowledgeCheck: {
                    question: "What does the atomic number represent?",
                    options: [
                        "Number of neutrons",
                        "Number of protons",
                        "Protons + neutrons",
                        "Number of electron shells"
                    ],
                    answer: 1
                }
            },


            {
                id: "atomic-4",
                title: "Isotopes and Relative Atomic Mass",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Define isotopes.",
                    "Explain why isotopes have the same atomic number.",
                    "Understand weighted average atomic mass."
                ],

                content: [
                    {
                        heading: "Isotopes",
                        text:
                            "Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons."
                    },
                    {
                        heading: "Relative atomic mass",
                        text:
                            "The atomic mass shown on the periodic table reflects a weighted average based on the naturally occurring isotopes of an element."
                    }
                ],

                keyPoints: [
                    "Isotopes have the same number of protons.",
                    "Isotopes differ in neutron number.",
                    "Periodic-table atomic masses are weighted averages."
                ],

                workedExample: {
                    question:
                        "Why are two isotopes still atoms of the same element?",
                    answer:
                        "They have the same number of protons and therefore the same atomic number."
                },

                knowledgeCheck: {
                    question: "Isotopes of an element differ in their number of:",
                    options: [
                        "Protons",
                        "Electrons only",
                        "Neutrons",
                        "Atomic numbers"
                    ],
                    answer: 2
                }
            },


            {
                id: "atomic-5",
                title: "Electron Configuration",
                type: "lesson",
                duration: 15,

                objectives: [
                    "Explain electron configuration.",
                    "Describe electron energy levels.",
                    "Write simple electron configurations."
                ],

                content: [
                    {
                        heading: "Electrons and energy",
                        text:
                            "Electrons occupy quantized energy states around the nucleus. Their arrangement influences chemical behavior."
                    },
                    {
                        heading: "Configuration",
                        text:
                            "Electron configuration describes how electrons are distributed among available orbitals and energy levels."
                    }
                ],

                keyPoints: [
                    "Electrons occupy quantized states.",
                    "Electron arrangement affects chemical behavior.",
                    "Electron configuration describes electron distribution."
                ],

                workedExample: {
                    question:
                        "How many electrons does a neutral atom of oxygen have?",
                    answer:
                        "Oxygen has atomic number 8, so a neutral oxygen atom has 8 electrons."
                },

                knowledgeCheck: {
                    question: "A neutral atom's number of electrons equals its number of:",
                    options: [
                        "Neutrons",
                        "Protons",
                        "Nuclei",
                        "Isotopes"
                    ],
                    answer: 1
                }
            },


            {
                id: "atomic-6",
                title: "Orbitals and Quantum Numbers",
                type: "lesson",
                duration: 15,

                objectives: [
                    "Describe atomic orbitals.",
                    "Recognize s, p, d, and f orbital types.",
                    "Understand the role of quantum numbers."
                ],

                content: [
                    {
                        heading: "Atomic orbitals",
                        text:
                            "An orbital is a mathematical description of a region where an electron has a high probability of being found."
                    },
                    {
                        heading: "Orbital types",
                        text:
                            "The major orbital types are s, p, d, and f. They differ in their shapes, energies, and numbers of orbitals available."
                    }
                ],

                keyPoints: [
                    "Orbitals describe probable electron locations.",
                    "s, p, d, and f are orbital types.",
                    "Quantum numbers describe electron states."
                ],

                workedExample: {
                    question:
                        "How many orbitals are associated with a p subshell?",
                    answer: "Three orbitals."
                },

                knowledgeCheck: {
                    question: "Which is an orbital type?",
                    options: [
                        "s",
                        "q",
                        "x",
                        "zeta"
                    ],
                    answer: 0
                }
            },


            {
                id: "atomic-7",
                title: "Electron Arrangement and Ions",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Explain ion formation.",
                    "Distinguish cations from anions.",
                    "Relate electron gain or loss to charge."
                ],

                content: [
                    {
                        heading: "Ion formation",
                        text:
                            "An ion forms when an atom or group of atoms gains or loses electrons."
                    },
                    {
                        heading: "Cations and anions",
                        text:
                            "A cation has a positive charge and generally results from electron loss. An anion has a negative charge and generally results from electron gain."
                    }
                ],

                keyPoints: [
                    "Electron loss produces positive charge.",
                    "Electron gain produces negative charge.",
                    "Ions have unequal numbers of protons and electrons."
                ],

                workedExample: {
                    question:
                        "What happens when a neutral sodium atom loses one electron?",
                    answer:
                        "It becomes a positively charged sodium ion, Na⁺."
                },

                knowledgeCheck: {
                    question: "An ion with a negative charge is called a:",
                    options: [
                        "Cation",
                        "Anion",
                        "Proton",
                        "Isotope"
                    ],
                    answer: 1
                }
            },


            {
                id: "atomic-8",
                title: "The Periodic Table",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Explain how the periodic table is organized.",
                    "Identify periods and groups.",
                    "Relate position to electron structure."
                ],

                content: [
                    {
                        heading: "Organization",
                        text:
                            "The periodic table arranges elements by increasing atomic number. Its structure reveals repeating patterns in chemical properties."
                    },
                    {
                        heading: "Periods and groups",
                        text:
                            "Horizontal rows are called periods. Vertical columns are called groups or families."
                    }
                ],

                keyPoints: [
                    "Elements are arranged by atomic number.",
                    "Rows are periods.",
                    "Columns are groups."
                ],

                workedExample: {
                    question:
                        "What do elements in the same group generally have in common?",
                    answer:
                        "They often have related valence-electron arrangements and therefore similar chemical behavior."
                },

                knowledgeCheck: {
                    question: "Vertical columns of the periodic table are called:",
                    options: [
                        "Periods",
                        "Groups",
                        "Blocks",
                        "Series"
                    ],
                    answer: 1
                }
            },


            {
                id: "atomic-9",
                title: "Atomic Radius",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Define atomic radius.",
                    "Describe its periodic trend.",
                    "Explain the trend using atomic structure."
                ],

                content: [
                    {
                        heading: "Atomic size",
                        text:
                            "Atomic radius is a measure related to the size of an atom. It is influenced by the number of electron shells and the attraction between the nucleus and electrons."
                    },
                    {
                        heading: "Periodic trend",
                        text:
                            "Atomic radius generally increases down a group because additional electron shells are occupied. Across a period, it generally decreases as effective nuclear attraction increases."
                    }
                ],

                keyPoints: [
                    "Atomic radius generally increases down a group.",
                    "Atomic radius generally decreases across a period.",
                    "Electron shells and nuclear attraction help explain the trend."
                ],

                workedExample: {
                    question:
                        "Which generally has the larger atomic radius: an element near the top or bottom of the same group?",
                    answer:
                        "The element lower in the group generally has the larger atomic radius."
                },

                knowledgeCheck: {
                    question: "Atomic radius generally increases:",
                    options: [
                        "Up a group",
                        "Down a group",
                        "Across a period from left to right",
                        "Toward the top-right corner"
                    ],
                    answer: 1
                }
            },


            {
                id: "atomic-10",
                title: "Ionization Energy",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Define ionization energy.",
                    "Describe its periodic trend.",
                    "Relate ionization energy to electron attraction."
                ],

                content: [
                    {
                        heading: "Ionization energy",
                        text:
                            "Ionization energy is the energy required to remove an electron from an isolated gaseous atom or ion under specified conditions."
                    },
                    {
                        heading: "Periodic trend",
                        text:
                            "First ionization energy generally increases across a period and decreases down a group, although there are some important exceptions."
                    }
                ],

                keyPoints: [
                    "Ionization energy concerns electron removal.",
                    "It generally increases across a period.",
                    "It generally decreases down a group."
                ],

                workedExample: {
                    question:
                        "Why does ionization energy generally decrease down a group?",
                    answer:
                        "Outer electrons are generally farther from the nucleus and more shielded by inner electrons."
                },

                knowledgeCheck: {
                    question: "Ionization energy is associated with:",
                    options: [
                        "Removing an electron",
                        "Adding a neutron",
                        "Changing a proton into an electron",
                        "Increasing atomic mass only"
                    ],
                    answer: 0
                }
            },


            {
                id: "atomic-11",
                title: "Electronegativity and Electron Affinity",
                type: "lesson",
                duration: 15,

                objectives: [
                    "Define electronegativity.",
                    "Explain electron affinity conceptually.",
                    "Compare the two properties."
                ],

                content: [
                    {
                        heading: "Electronegativity",
                        text:
                            "Electronegativity describes the tendency of an atom in a chemical bond to attract shared electrons."
                    },
                    {
                        heading: "Electron affinity",
                        text:
                            "Electron affinity concerns the energy change associated with adding an electron to an isolated gaseous atom."
                    }
                ],

                keyPoints: [
                    "Electronegativity concerns bonded atoms.",
                    "Electron affinity concerns electron addition to isolated gaseous species.",
                    "Both properties are related to electron attraction but are not identical."
                ],

                workedExample: {
                    question:
                        "Which concept specifically describes attraction for shared bonding electrons?",
                    answer: "Electronegativity."
                },

                knowledgeCheck: {
                    question: "Electronegativity describes an atom's tendency to:",
                    options: [
                        "Attract shared electrons",
                        "Lose neutrons",
                        "Increase its mass",
                        "Become radioactive"
                    ],
                    answer: 0
                }
            },


            {
                id: "atomic-12",
                title: "Understanding Periodic Trends",
                type: "lesson",
                duration: 16,

                objectives: [
                    "Combine major periodic trends.",
                    "Explain trends using atomic structure.",
                    "Predict general changes in properties."
                ],

                content: [
                    {
                        heading: "Periodic patterns",
                        text:
                            "The periodic table is more than a list of elements. Its arrangement allows chemists to recognize repeating patterns in atomic size, ionization energy, electronegativity, and other properties."
                    },
                    {
                        heading: "Why trends occur",
                        text:
                            "Major factors include nuclear charge, electron shielding, distance from the nucleus, and electron arrangement."
                    }
                ],

                keyPoints: [
                    "Periodic trends arise from atomic structure.",
                    "Nuclear attraction and shielding are important.",
                    "The periodic table can be used to make qualitative predictions."
                ],

                workedExample: {
                    question:
                        "What two broad factors are especially useful when explaining periodic trends?",
                    answer:
                        "Effective nuclear attraction and electron shielding/distance."
                },

                knowledgeCheck: {
                    question: "Which concept helps explain many periodic trends?",
                    options: [
                        "Effective nuclear attraction",
                        "The color of an element",
                        "The shape of the laboratory",
                        "Sample volume alone"
                    ],
                    answer: 0
                }
        ],


        /* =================================================
           CHEMICAL FORMULAS & EQUATIONS
           ================================================= */

        "chemical-formulas": [

            {
                id: "formula-1",
                title: "What Chemical Formulas Represent",
                type: "lesson",
                duration: 10,

                objectives: [
                    "Explain what a chemical formula represents.",
                    "Identify the elements present in a compound.",
                    "Interpret subscripts in chemical formulas."
                ],

                content: [
                    {
                        heading: "A symbolic language for chemistry",
                        text:
                            "Chemical formulas provide a compact way of representing the composition of substances. They show which elements are present and, in many cases, the relative numbers of their atoms or ions."
                    },
                    {
                        heading: "Reading a formula",
                        text:
                            "In H₂O, the symbols H and O identify hydrogen and oxygen. The subscript 2 tells us that the formula contains two hydrogen atoms for every one oxygen atom in a single molecule of water."
                    },
                    {
                        heading: "Subscripts matter",
                        text:
                            "A subscript belongs to the element symbol immediately before it. If no subscript is written, the number is understood to be one."
                    }
                ],

                keyPoints: [
                    "Chemical formulas represent the composition of substances.",
                    "Element symbols identify the elements present.",
                    "A subscript indicates how many atoms or ions are represented.",
                    "No subscript means one."
                ],

                workedExample: {
                    question:
                        "How many hydrogen and oxygen atoms are represented by one H₂O molecule?",
                    answer:
                        "H₂O represents 2 hydrogen atoms and 1 oxygen atom."
                },

                knowledgeCheck: {
                    question:
                        "What does the subscript 2 in H₂O indicate?",
                    options: [
                        "There are two oxygen atoms",
                        "There are two hydrogen atoms",
                        "There are two molecules",
                        "The substance has charge −2"
                    ],
                    answer: 1
                }
            },


            {
                id: "formula-2",
                title: "Chemical Symbols and Formulas",
                type: "lesson",
                duration: 10,

                objectives: [
                    "Recognize chemical element symbols.",
                    "Construct simple chemical formulas.",
                    "Distinguish element symbols from subscripts."
                ],

                content: [
                    {
                        heading: "Element symbols",
                        text:
                            "Each chemical element has a symbol. The first letter is capitalized, while a second letter, when present, is lowercase. Examples include H for hydrogen, O for oxygen, Na for sodium, and Cl for chlorine."
                    },
                    {
                        heading: "Combining symbols",
                        text:
                            "Chemical formulas combine element symbols with subscripts to communicate composition. For example, CO₂ represents carbon and oxygen in a 1:2 ratio."
                    }
                ],

                keyPoints: [
                    "The first letter of an element symbol is capitalized.",
                    "A second letter is lowercase.",
                    "Subscripts describe numerical relationships between atoms or ions."
                ],

                workedExample: {
                    question:
                        "How many total atoms are represented by one CO₂ molecule?",
                    answer:
                        "One carbon atom plus two oxygen atoms gives a total of three atoms."
                },

                knowledgeCheck: {
                    question:
                        "Which formula represents two oxygen atoms for every one carbon atom?",
                    options: [
                        "CO",
                        "CO₂",
                        "C₂O",
                        "C₂O₂"
                    ],
                    answer: 1
                }
            },


            {
                id: "formula-3",
                title: "Ionic and Molecular Formulas",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Distinguish ionic and molecular substances.",
                    "Interpret formulas of ionic compounds.",
                    "Interpret formulas of molecular compounds."
                ],

                content: [
                    {
                        heading: "Ionic compounds",
                        text:
                            "Ionic compounds contain positively and negatively charged ions arranged in an extended structure. Their formulas show the simplest whole-number ratio of the ions."
                    },
                    {
                        heading: "Molecular compounds",
                        text:
                            "Molecular substances consist of discrete molecules. Their formulas indicate the types and numbers of atoms in each molecule."
                    },
                    {
                        heading: "Charge balance",
                        text:
                            "For an ionic compound, the overall electrical charge of the formula unit is zero. The numbers of positive and negative ions must therefore balance."
                    }
                ],

                keyPoints: [
                    "Ionic formulas represent ratios of ions.",
                    "Molecular formulas represent individual molecules.",
                    "Ionic compounds must have overall electrical neutrality."
                ],

                workedExample: {
                    question:
                        "Why is the formula of magnesium chloride MgCl₂ rather than MgCl?",
                    answer:
                        "Magnesium forms Mg²⁺ ions while chloride is Cl⁻. Two chloride ions are needed to balance the +2 charge of one magnesium ion."
                },

                knowledgeCheck: {
                    question:
                        "What must be true of an ionic compound's overall formula?",
                    options: [
                        "Its total charge is positive",
                        "Its total charge is negative",
                        "Its overall charge is zero",
                        "It must contain oxygen"
                    ],
                    answer: 2
                }
            },


            {
                id: "formula-4",
                title: "Writing Chemical Equations",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Explain what a chemical equation represents.",
                    "Identify reactants and products.",
                    "Interpret the arrow in a chemical equation."
                ],

                content: [
                    {
                        heading: "Chemical equations",
                        text:
                            "A chemical equation represents a chemical reaction using formulas and symbols. It communicates which substances participate and which substances are formed."
                    },
                    {
                        heading: "Reactants and products",
                        text:
                            "The substances on the left side of the equation are called reactants. The substances on the right side are products."
                    },
                    {
                        heading: "The reaction arrow",
                        text:
                            "The arrow connects reactants to products and indicates the direction represented by the equation."
                    }
                ],

                keyPoints: [
                    "Reactants appear on the left.",
                    "Products appear on the right.",
                    "The arrow connects reactants and products.",
                    "Chemical formulas identify the substances involved."
                ],

                workedExample: {
                    question:
                        "In the equation H₂ + O₂ → H₂O, which substance is a reactant?",
                    answer:
                        "Hydrogen (H₂) and oxygen (O₂) are the reactants."
                },

                knowledgeCheck: {
                    question:
                        "Where are the products normally written in a chemical equation?",
                    options: [
                        "Before the arrow",
                        "After the arrow",
                        "Above the equation only",
                        "Inside the element symbols"
                    ],
                    answer: 1
                }
            },


            {
                id: "formula-5",
                title: "Balancing Chemical Equations",
                type: "lesson",
                duration: 15,

                objectives: [
                    "Explain why chemical equations must be balanced.",
                    "Distinguish coefficients from subscripts.",
                    "Use coefficients to balance simple equations."
                ],

                content: [
                    {
                        heading: "Conservation of atoms",
                        text:
                            "Chemical reactions rearrange atoms rather than creating or destroying them. A balanced equation therefore contains the same number of atoms of each element on both sides."
                    },
                    {
                        heading: "Coefficients",
                        text:
                            "Coefficients are numbers placed in front of chemical formulas. They change the number of particles represented without changing the identity of the substance."
                    },
                    {
                        heading: "Never change subscripts to balance",
                        text:
                            "Changing a subscript changes the chemical formula and therefore changes the substance being represented. Balancing is accomplished by adjusting coefficients."
                    }
                ],

                keyPoints: [
                    "Balanced equations obey conservation of atoms.",
                    "Coefficients change quantities.",
                    "Subscripts define chemical composition.",
                    "Do not change subscripts when balancing equations."
                ],

                workedExample: {
                    question:
                        "Balance: H₂ + O₂ → H₂O.",
                    answer:
                        "The balanced equation is 2H₂ + O₂ → 2H₂O."
                },

                knowledgeCheck: {
                    question:
                        "Which part of a chemical equation should normally be changed when balancing it?",
                    options: [
                        "Element symbols",
                        "Subscripts",
                        "Coefficients",
                        "Atomic numbers"
                    ],
                    answer: 2
                }
            },


            {
                id: "formula-6",
                title: "Interpreting Chemical Equations",
                type: "lesson",
                duration: 12,

                objectives: [
                    "Interpret coefficients as particle ratios.",
                    "Connect equations with mole ratios.",
                    "Use balanced equations to understand reaction quantities."
                ],

                content: [
                    {
                        heading: "Coefficients represent ratios",
                        text:
                            "In a balanced chemical equation, coefficients provide ratios between the amounts of reacting and produced substances."
                    },
                    {
                        heading: "Mole ratios",
                        text:
                            "Because chemical equations represent particle relationships, their coefficients can also be interpreted as mole ratios. These ratios become essential in stoichiometric calculations."
                    }
                ],

                keyPoints: [
                    "Balanced coefficients represent quantitative ratios.",
                    "Coefficients can be interpreted as mole ratios.",
                    "Stoichiometry uses these ratios to relate reactants and products."
                ],

                workedExample: {
                    question:
                        "In 2H₂ + O₂ → 2H₂O, what is the mole ratio of H₂ to O₂?",
                    answer:
                        "The mole ratio H₂:O₂ is 2:1."
                },

                knowledgeCheck: {
                    question:
                        "What do coefficients in a balanced equation primarily provide?",
                    options: [
                        "Mole ratios",
                        "Atomic numbers",
                        "Element symbols",
                        "Melting points"
                    ],
                    answer: 0
                }

                           /* =================================================
           MOLE CONCEPT
           ================================================= */

        "mole-concept": [

            {
                id: "mole-1",
                title: "What Is a Mole?",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Explain what a mole represents.",
                    "Understand why chemists use the mole.",
                    "Relate the mole to very large numbers of particles."
                ],

                content: [
                    {
                        heading: "The counting problem in chemistry",
                        text:
                            "Atoms, molecules, and ions are extremely small, so chemists need a practical way to count enormous numbers of particles. The mole is the SI unit used for the amount of substance."
                    },
                    {
                        heading: "What does one mole mean?",
                        text:
                            "One mole of a substance contains exactly 6.02214076 × 10²³ specified particles. The particles may be atoms, molecules, ions, electrons, or other specified entities."
                    },
                    {
                        heading: "Why the mole matters",
                        text:
                            "The mole connects the microscopic world of particles with measurable laboratory quantities such as mass and volume."
                    }
                ],

                keyPoints: [
                    "The mole is the SI unit for amount of substance.",
                    "One mole contains 6.02214076 × 10²³ specified entities.",
                    "The mole connects particles with measurable quantities."
                ],

                workedExample: {
                    question:
                        "How many particles are present in 1 mole of a substance?",
                    answer:
                        "1 mole contains 6.02214076 × 10²³ specified particles."
                },

                knowledgeCheck: {
                    question: "What does the mole measure?",
                    options: [
                        "Temperature",
                        "Amount of substance",
                        "Density",
                        "Pressure"
                    ],
                    answer: 1
                }
            },


            {
                id: "mole-2",
                title: "Avogadro's Constant",
                type: "lesson",
                duration: 14,

                objectives: [
                    "Define Avogadro's constant.",
                    "Use Avogadro's constant in particle calculations.",
                    "Distinguish between amount of substance and number of particles."
                ],

                content: [
                    {
                        heading: "Avogadro's constant",
                        text:
                            "Avogadro's constant, represented by Nₐ, is exactly 6.02214076 × 10²³ mol⁻¹. It relates the amount of substance in moles to the number of specified entities."
                    },
                    {
                        heading: "The particle relationship",
                        text:
                            "The number of particles can be calculated from the amount of substance using N = nNₐ, where N is the number of particles and n is the amount in moles."
                    },
                    {
                        heading: "Using the relationship",
                        text:
                            "If the amount of substance increases, the number of corresponding particles increases proportionally."
                    }
                ],

                keyPoints: [
                    "Nₐ = 6.02214076 × 10²³ mol⁻¹.",
                    "N = nNₐ.",
                    "Avogadro's constant connects moles and particles."
                ],

                workedExample: {
                    question:
                        "How many molecules are present in 2.00 mol of a molecular substance?",
                    answer:
                        "N = nNₐ = 2.00 × 6.02214076 × 10²³ = 1.2044 × 10²⁴ molecules."
                },

                knowledgeCheck: {
                    question: "What is the value of Avogadro's constant?",
                    options: [
                        "6.02214076 × 10²³ mol⁻¹",
                        "9.81 m s⁻²",
                        "3.00 × 10⁸ m s⁻¹",
                        "1.602 × 10⁻¹⁹ C"
                    ],
                    answer: 0
                }
            },


            {
                id: "mole-3",
                title: "Molar Mass",
                type: "lesson",
                duration: 15,

                objectives: [
                    "Define molar mass.",
                    "Calculate molar mass from a chemical formula.",
                    "Use units correctly when reporting molar mass."
                ],

                content: [
                    {
                        heading: "What is molar mass?",
                        text:
                            "Molar mass is the mass of one mole of a substance. Its common unit is grams per mole, written g mol⁻¹."
                    },
                    {
                        heading: "Calculating molar mass",
                        text:
                            "To calculate molar mass, add the relative atomic masses of all atoms represented in the chemical formula, taking subscripts into account."
                    },
                    {
                        heading: "Example: water",
                        text:
                            "Water has the formula H₂O. Its molar mass is approximately 2(1.008) + 16.00 = 18.016 g mol⁻¹."
                    }
                ],

                keyPoints: [
                    "Molar mass is the mass of one mole.",
                    "The usual unit is g mol⁻¹.",
                    "Subscripts in formulas determine how many atoms are included."
                ],

                workedExample: {
                    question:
                        "Calculate the approximate molar mass of CO₂ using C = 12.01 and O = 16.00.",
                    answer:
                        "M(CO₂) = 12.01 + 2(16.00) = 44.01 g mol⁻¹."
                },

                knowledgeCheck: {
                    question: "What is the usual unit for molar mass?",
                    options: [
                        "mol g⁻¹",
                        "g mol⁻¹",
                        "g L⁻¹",
                        "mol L⁻¹"
                    ],
                    answer: 1
                }
            },


            {
                id: "mole-4",
                title: "Converting Mass to Moles",
                type: "lesson",
                duration: 16,

                objectives: [
                    "Convert a measured mass into amount of substance.",
                    "Use the molar mass equation.",
                    "Select appropriate units for calculations."
                ],

                content: [
                    {
                        heading: "The mass–mole relationship",
                        text:
                            "The amount of substance can be calculated from mass and molar mass using n = m/M."
                    },
                    {
                        heading: "Meaning of the symbols",
                        text:
                            "In the equation n = m/M, n is the amount in moles, m is the mass in grams, and M is the molar mass in grams per mole."
                    },
                    {
                        heading: "A reliable calculation method",
                        text:
                            "First determine the correct molar mass. Then divide the measured mass by the molar mass and report the answer with appropriate significant figures."
                    }
                ],

                keyPoints: [
                    "n = m/M.",
                    "Mass should normally be expressed in grams when M is in g mol⁻¹.",
                    "Always determine the correct molar mass before calculating."
                ],

                workedExample: {
                    question:
                        "How many moles are present in 18.0 g of H₂O if its molar mass is 18.0 g mol⁻¹?",
                    answer:
                        "n = m/M = 18.0 g ÷ 18.0 g mol⁻¹ = 1.00 mol."
                },

                knowledgeCheck: {
                    question: "Which equation calculates moles from mass and molar mass?",
                    options: [
                        "n = mM",
                        "n = M/m",
                        "n = m/M",
                        "n = M + m"
                    ],
                    answer: 2
                }
            },


            {
                id: "mole-5",
                title: "Converting Moles to Particles",
                type: "lesson",
                duration: 15,

                objectives: [
                    "Convert moles into numbers of particles.",
                    "Apply Avogadro's constant correctly.",
                    "Identify the type of particles represented by a formula."
                ],

                content: [
                    {
                        heading: "From moles to particles",
                        text:
                            "The number of specified particles can be calculated using N = nNₐ."
                    },
                    {
                        heading: "Choosing the correct particle",
                        text:
                            "The chemical substance determines what the particles represent. For example, a sample of an elemental metal may be described in terms of atoms, while a molecular substance may be described in terms of molecules."
                    },
                    {
                        heading: "Keeping track of units",
                        text:
                            "The units mol × mol⁻¹ cancel, leaving the number of particles."
                    }
                ],

                keyPoints: [
                    "N = nNₐ.",
                    "Nₐ = 6.02214076 × 10²³ mol⁻¹.",
                    "Always identify what the particles represent."
                ],

                workedExample: {
                    question:
                        "How many molecules are present in 0.500 mol of CO₂?",
                    answer:
                        "N = 0.500 × 6.02214076 × 10²³ = 3.011 × 10²³ molecules."
                },

                knowledgeCheck: {
                    question: "Which quantity is multiplied by Avogadro's constant to find the number of particles?",
                    options: [
                        "Mass",
                        "Density",
                        "Amount in moles",
                        "Temperature"
                    ],
                    answer: 2
                }
            },


            {
                id: "mole-6",
                title: "Mole Relationships in Compounds",
                type: "lesson",
                duration: 16,

                objectives: [
                    "Interpret subscripts in chemical formulas.",
                    "Determine mole ratios of elements in compounds.",
                    "Connect chemical formulas with particle and mole relationships."
                ],

                content: [
                    {
                        heading: "Subscripts carry information",
                        text:
                            "The subscripts in a chemical formula show the relative number of atoms of each element in one formula unit or molecule."
                    },
                    {
                        heading: "Example: H₂O",
                        text:
                            "The formula H₂O represents two hydrogen atoms for every one oxygen atom. Therefore, one mole of H₂O contains two moles of hydrogen atoms and one mole of oxygen atoms."
                    },
                    {
                        heading: "Example: Al₂(SO₄)₃",
                        text:
                            "The formula Al₂(SO₄)₃ contains two aluminium atoms, three sulfur atoms, and twelve oxygen atoms per formula unit. The corresponding mole relationship is 2 mol Al : 3 mol S : 12 mol O."
                    }
                ],

                keyPoints: [
                    "Subscripts show relative atom numbers.",
                    "Parentheses multiply everything inside them.",
                    "Chemical formulas provide mole relationships between elements."
                ],

                workedExample: {
                    question:
                        "How many moles of oxygen atoms are present in 2.00 mol of H₂O?",
                    answer:
                        "Each mole of H₂O contains 1 mole of oxygen atoms, so 2.00 mol H₂O contains 2.00 mol oxygen atoms."
                },

                knowledgeCheck: {
                    question: "How many moles of oxygen atoms are represented by 1 mol of CO₂?",
                    options: [
                        "1 mol",
                        "2 mol",
                        "3 mol",
                        "4 mol"
                    ],
                    answer: 1
                }
            },


            {
                id: "mole-7",
                title: "Combining Mole Calculations",
                type: "lesson",
                duration: 18,

                objectives: [
                    "Combine mass, moles, and particle calculations.",
                    "Choose an appropriate sequence of equations.",
                    "Solve multi-step mole problems systematically."
                ],

                content: [
                    {
                        heading: "The mole calculation pathway",
                        text:
                            "Many chemistry calculations require more than one step. A common pathway is mass → moles → particles, or particles → moles → mass."
                    },
                    {
                        heading: "A systematic approach",
                        text:
                            "Start by identifying the quantity given and the quantity required. Choose an equation that connects them, track units carefully, and use the result of one step as the input for the next."
                    },
                    {
                        heading: "Core relationships",
                        text:
                            "The three important relationships are n = m/M, N = nNₐ, and m = nM. Together they allow chemists to move between mass, amount of substance, and number of particles."
                    }
                ],

                keyPoints: [
                    "Use n = m/M to connect mass and moles.",
                    "Use N = nNₐ to connect moles and particles.",
                    "Use m = nM to convert moles back to mass.",
                    "Track units at every step."
                ],

                workedExample: {
                    question:
                        "How many molecules are present in 36.0 g of H₂O if M(H₂O) = 18.0 g mol⁻¹?",
                    answer:
                        "Step 1: n = m/M = 36.0/18.0 = 2.00 mol. Step 2: N = nNₐ = 2.00 × 6.02214076 × 10²³ = 1.2044 × 10²⁴ molecules."
                },

                knowledgeCheck: {
                    question:
                        "Which sequence is appropriate for converting mass directly into number of particles?",
                    options: [
                        "Mass → particles",
                        "Mass → moles → particles",
                        "Particles → mass → moles",
                        "Mass → temperature → particles"
                    ],
                    answer: 1
                }
            }

        ]

    
    /* =====================================================
       HELPERS
       ===================================================== */

    function $(selector, root = document) {
        return root.querySelector(selector);
    }


    function $$(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function slug(value) {
        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
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


    function getLessons(topicId) {
        return LESSON_CONTENT[topicId] || [];
    }


    function getLesson(topicId, lessonId) {
        return getLessons(topicId).find(
            lesson => lesson.id === lessonId
        ) || null;
    }


    function getProgress() {
        try {
            return JSON.parse(
                localStorage.getItem(STORAGE.progress) || "{}"
            );
        } catch (error) {
            return {};
        }
    }


    function saveProgress(progress) {
        localStorage.setItem(
            STORAGE.progress,
            JSON.stringify(progress)
        );
    }


    function getTopicProgress(topicId) {
        const progress = getProgress();

        return progress[topicId] || {
            completedLessons: [],
            topicCompleted: false,
            rewardClaimed: false
        };
    }


    function setTopicProgress(topicId, data) {
        const progress = getProgress();

        progress[topicId] = {
            ...getTopicProgress(topicId),
            ...data
        };

        saveProgress(progress);
    }


    function isLessonCompleted(topicId, lessonId) {
        return getTopicProgress(topicId)
            .completedLessons
            .includes(lessonId);
    }


    function getCompletedLessonCount(topicId) {
        return getTopicProgress(topicId)
            .completedLessons
            .length;
    }


    function getTopicCompletionPercent(topicId) {
        const lessons = getLessons(topicId);

        if (!lessons.length) {
            return 0;
        }

        return Math.round(
            (getCompletedLessonCount(topicId) / lessons.length) * 100
        );
    }


    /* =====================================================
       XP SYSTEM
       ===================================================== */

    function getXP() {
        return Number(
            localStorage.getItem(STORAGE.xp) || 0
        );
    }


    function addXP(amount) {
        const current = getXP();
        const updated = current + Number(amount || 0);

        localStorage.setItem(
            STORAGE.xp,
            String(updated)
        );

        if (
            window.CHEMLAB_DASHBOARD &&
            typeof window.CHEMLAB_DASHBOARD.addXP === "function"
        ) {
            window.CHEMLAB_DASHBOARD.addXP(amount);
        }

        document.dispatchEvent(
            new CustomEvent("chemlab:academy-xp", {
                detail: {
                    amount,
                    total: updated
                }
            })
        );

        return updated;
    }


    /* =====================================================
       DOM OVERLAY
       ===================================================== */

    function ensureAcademyOverlay() {

        if ($("#academyLearningOverlay")) {
            return $("#academyLearningOverlay");
        }

        const overlay = document.createElement("div");

        overlay.id = "academyLearningOverlay";
        overlay.className = "academy-learning-overlay";

        overlay.innerHTML = `
            <div
                class="academy-learning-overlay-backdrop"
                data-academy-close
            ></div>

            <div
                class="academy-learning-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Chemistry Academy"
            >
                <button
                    type="button"
                    class="academy-learning-close"
                    data-academy-close
                    aria-label="Close"
                >
                    ×
                </button>

                <div id="academyLearningContent"></div>
            </div>
        `;

        document.body.appendChild(overlay);

        return overlay;
    }


    function openOverlay() {
        const overlay = ensureAcademyOverlay();

        overlay.classList.add("is-open");
        document.body.classList.add("academy-modal-open");
    }


    function closeOverlay() {
        const overlay = $("#academyLearningOverlay");

        if (!overlay) {
            return;
        }

        overlay.classList.remove("is-open");
        document.body.classList.remove("academy-modal-open");
    }


    function setOverlayContent(html) {
        const overlay = ensureAcademyOverlay();
        const content = $("#academyLearningContent", overlay);

        if (!content) {
            return;
        }

        content.innerHTML = html;
        openOverlay();
    }


    /* =====================================================
       TOPIC EXPLORER
       ===================================================== */

    function renderTopicExplorer(subjectId) {

        const subject = getSubject(subjectId);

        if (!subject) {
            return;
        }

        ACADEMY_STATE.currentSubject = subjectId;
        ACADEMY_STATE.currentTopic = null;
        ACADEMY_STATE.currentLesson = null;

        const topics = subject.topics;

        const topicCards = topics.map(topic => {

            const lessons = getLessons(topic.id);

            const availableLessons = lessons.length;
            const completed = getCompletedLessonCount(topic.id);

            const percent = availableLessons
                ? Math.round((completed / availableLessons) * 100)
                : 0;

            return `
                <article
                    class="academy-topic-preview-card"
                    data-topic-open="${escapeHTML(topic.id)}"
                >

                    <div class="academy-topic-preview-icon">
                        ${escapeHTML(topic.icon || "⚗")}
                    </div>

                    <div class="academy-topic-preview-body">

                        <div class="academy-topic-preview-meta">
                            <span>
                                ${escapeHTML(topic.difficulty)}
                            </span>

                            <span>
                                ${topic.duration} min
                            </span>
                        </div>

                        <h3>
                            ${escapeHTML(topic.title)}
                        </h3>

                        <p>
                            ${escapeHTML(topic.description)}
                        </p>

                        <div class="academy-topic-preview-progress">
                            <div>
                                <span>
                                    ${completed}/${availableLessons || topic.lessons}
                                    lessons
                                </span>

                                <strong>
                                    ${percent}%
                                </strong>
                            </div>

                            <div class="academy-progress-track">
                                <span
                                    style="width:${percent}%"
                                ></span>
                            </div>
                        </div>

                    </div>

                </article>
            `;
        }).join("");


        setOverlayContent(`
            <section class="academy-topic-explorer">

                <div class="academy-topic-learning-header">

                    <button
                        type="button"
                        class="button button-secondary"
                        data-academy-close
                    >
                        ← Back to Academy
                    </button>

                    <span class="academy-topic-learning-level">
                        ${escapeHTML(subject.level)}
                    </span>

                </div>

                <div class="academy-topic-learning-hero">

                    <div class="academy-topic-learning-icon">
                        ${escapeHTML(subject.icon || "⚗")}
                    </div>

                    <div>
                        <div class="academy-topic-learning-eyebrow">
                            CHEMISTRY ACADEMY
                        </div>

                        <h1>
                            ${escapeHTML(subject.title)}
                        </h1>

                        <p>
                            ${escapeHTML(subject.description)}
                        </p>
                    </div>

                </div>

                <div class="academy-topic-learning-grid">
                    ${topicCards}
                </div>

            </section>
        `);
    }


    /* =====================================================
       LESSON VIEWER
       ===================================================== */

    function renderLesson(subjectId, topicId, lessonIndex) {

        const subject = getSubject(subjectId);
        const topic = getTopic(subjectId, topicId);
        const lessons = getLessons(topicId);

        if (!subject || !topic || !lessons.length) {
            renderUnavailableTopic(subjectId, topicId);
            return;
        }

        const safeIndex = Math.max(
            0,
            Math.min(
                Number(lessonIndex) || 0,
                lessons.length - 1
            )
        );

        const lesson = lessons[safeIndex];

        ACADEMY_STATE.currentSubject = subjectId;
        ACADEMY_STATE.currentTopic = topicId;
        ACADEMY_STATE.currentLesson = lesson.id;


        const completed = isLessonCompleted(
            topicId,
            lesson.id
        );

        const progress = Math.round(
            ((safeIndex + (completed ? 1 : 0)) / lessons.length) * 100
        );


        const objectives = (lesson.objectives || [])
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");


        const content = (lesson.content || [])
            .map(block => `
                <section class="academy-lesson-content-block">

                    <h3>
                        ${escapeHTML(block.heading)}
                    </h3>

                    <p>
                        ${escapeHTML(block.text)}
                    </p>

                </section>
            `)
            .join("");


        const keyPoints = (lesson.keyPoints || [])
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");


        const workedExample = lesson.workedExample
            ? `
                <section class="academy-worked-example">

                    <div class="academy-block-label">
                        WORKED EXAMPLE
                    </div>

                    <h3>
                        ${escapeHTML(
                            lesson.workedExample.question
                        )}
                    </h3>

                    <div class="academy-example-answer">
                        ${escapeHTML(
                            lesson.workedExample.answer
                        )}
                    </div>

                </section>
            `
            : "";


        const knowledgeCheck = renderKnowledgeCheck(
            lesson,
            topicId
        );


        setOverlayContent(`
            <section class="academy-lesson-viewer">

                <div class="academy-lesson-top">

                    <div>

                        <div class="academy-lesson-breadcrumb">
                            ${escapeHTML(subject.title)}
                            /
                            ${escapeHTML(topic.title)}
                        </div>

                        <div class="academy-lesson-position">
                            Lesson ${safeIndex + 1}
                            of ${lessons.length}
                        </div>

                    </div>

                    <button
                        type="button"
                        class="button button-secondary"
                        data-topic-back="${escapeHTML(subjectId)}"
                    >
                        ← Topic
                    </button>

                </div>


                <div class="academy-lesson-progress">

                    <div class="academy-progress-track">
                        <span
                            style="width:${Math.min(progress, 100)}%"
                        ></span>
                    </div>

                    <span>
                        ${Math.min(progress, 100)}%
                    </span>

                </div>


                <div class="academy-lesson-header">

                    <div class="academy-lesson-type">
                        ${escapeHTML(
                            lesson.type || "LESSON"
                        )}
                    </div>

                    <h1>
                        ${escapeHTML(lesson.title)}
                    </h1>

                    <div class="academy-lesson-meta">
                        ${lesson.duration} min
                        ·
                        ${escapeHTML(topic.difficulty)}
                    </div>

                </div>


                <div class="academy-lesson-layout">

                    <main class="academy-lesson-main">

                        <section class="academy-lesson-objectives">

                            <div class="academy-block-label">
                                LEARNING OBJECTIVES
                            </div>

                            <ul>
                                ${objectives}
                            </ul>

                        </section>


                        <section class="academy-lesson-body">
                            ${content}
                        </section>


                        <section class="academy-key-points">

                            <div class="academy-block-label">
                                KEY POINTS
                            </div>

                            <ul>
                                ${keyPoints}
                            </ul>

                        </section>


                        ${workedExample}


                        ${knowledgeCheck}


                        <div class="academy-lesson-actions">

                            <button
                                type="button"
                                class="button button-secondary"
                                data-lesson-prev
                                ${safeIndex === 0 ? "disabled" : ""}
                            >
                                ← Previous
                            </button>

                            <button
                                type="button"
                                class="button button-primary"
                                data-lesson-complete
                                data-subject-id="${escapeHTML(subjectId)}"
                                data-topic-id="${escapeHTML(topicId)}"
                                data-lesson-id="${escapeHTML(lesson.id)}"
                            >
                                ${
                                    completed
                                        ? "✓ Completed"
                                        : "Mark Lesson Complete"
                                }
                            </button>

                            <button
                                type="button"
                                class="button button-primary"
                                data-lesson-next
                                ${
                                    safeIndex === lessons.length - 1
                                        ? "disabled"
                                        : ""
                                }
                            >
                                Next →
                            </button>

                        </div>

                    </main>


                    <aside class="academy-lesson-sidebar">

                        <div class="academy-lesson-sidebar-title">
                            ${escapeHTML(topic.title)}
                        </div>

                        <div class="academy-lesson-sidebar-list">

                            ${lessons.map((item, index) => {

                                const itemCompleted =
                                    isLessonCompleted(
                                        topicId,
                                        item.id
                                    );

                                return `
                                    <button
                                        type="button"
                                        class="
                                            academy-lesson-sidebar-item
                                            ${index === safeIndex ? "is-active" : ""}
                                            ${itemCompleted ? "is-completed" : ""}
                                        "
                                        data-lesson-index="${index}"
                                    >

                                        <span>
                                            ${index + 1}
                                        </span>

                                        <strong>
                                            ${escapeHTML(item.title)}
                                        </strong>

                                        ${
                                            itemCompleted
                                                ? `<em>✓</em>`
                                                : ""
                                        }

                                    </button>
                                `;
                            }).join("")}

                        </div>

                    </aside>

                </div>

            </section>
        `);
    }


    /* =====================================================
       KNOWLEDGE CHECK
       ===================================================== */

    function renderKnowledgeCheck(lesson, topicId) {

        if (!lesson.knowledgeCheck) {
            return "";
        }

        const check = lesson.knowledgeCheck;

        return `
            <section
                class="academy-knowledge-check"
                data-knowledge-check
            >

                <div class="academy-block-label">
                    KNOWLEDGE CHECK
                </div>

                <h3>
                    ${escapeHTML(check.question)}
                </h3>

                <div class="academy-check-options">

                    ${check.options.map((option, index) => `
                        <button
                            type="button"
                            class="academy-check-option"
                            data-check-answer="${index}"
                            data-correct-answer="${check.answer}"
                        >
                            <span>
                                ${String.fromCharCode(65 + index)}
                            </span>

                            ${escapeHTML(option)}
                        </button>
                    `).join("")}

                </div>

                <div
                    class="academy-check-feedback"
                    data-check-feedback
                ></div>

            </section>
        `;
    }


    /* =====================================================
       UNAVAILABLE TOPIC
       ===================================================== */

    function renderUnavailableTopic(subjectId, topicId) {

        const subject = getSubject(subjectId);
        const topic = getTopic(subjectId, topicId);

        if (!subject || !topic) {
            return;
        }

        setOverlayContent(`
            <section class="academy-empty-state">

                <div class="academy-empty-state-icon">
                    ⚗
                </div>

                <h2>
                    ${escapeHTML(topic.title)}
                </h2>

                <p>
                    This topic is part of the ChemLab Academy curriculum.
                    Detailed lessons are being prepared for this module.
                </p>

                <button
                    type="button"
                    class="button button-primary"
                    data-topic-back="${escapeHTML(subjectId)}"
                >
                    ← Back to ${escapeHTML(subject.title)}
                </button>

            </section>
        `);
    }


    /* =====================================================
       OPEN SUBJECT
       ===================================================== */

    function openSubject(subjectId) {

        const subject = getSubject(subjectId);

        if (!subject) {
            return;
        }

        renderTopicExplorer(subjectId);

        document.dispatchEvent(
            new CustomEvent("chemlab:academy-subject-opened", {
                detail: {
                    subjectId,
                    subject
                }
            })
        );
    }


    /* =====================================================
       OPEN TOPIC
       ===================================================== */

    function openTopic(subjectId, topicId) {

        const topic = getTopic(subjectId, topicId);

        if (!topic) {
            return;
        }

        const lessons = getLessons(topicId);

        if (lessons.length) {
            openLesson(subjectId, topicId, 0);
        } else {
            renderUnavailableTopic(
                subjectId,
                topicId
            );
        }

        document.dispatchEvent(
            new CustomEvent("chemlab:academy-topic-opened", {
                detail: {
                    subjectId,
                    topicId,
                    topic
                }
            })
        );
    }


    /* =====================================================
       OPEN LESSON
       ===================================================== */

    function openLesson(
        subjectId,
        topicId,
        lessonIndex = 0
    ) {

        const lessons = getLessons(topicId);

        if (!lessons.length) {
            renderUnavailableTopic(
                subjectId,
                topicId
            );

            return;
        }

        renderLesson(
            subjectId,
            topicId,
            lessonIndex
        );

        document.dispatchEvent(
            new CustomEvent("chemlab:academy-lesson-opened", {
                detail: {
                    subjectId,
                    topicId,
                    lessonIndex
                }
            })
        );
    }


    /* =====================================================
       COMPLETE LESSON
       ===================================================== */

    function markLessonCompleted(
        subjectId,
        topicId,
        lessonId
    ) {

        if (isLessonCompleted(topicId, lessonId)) {
            return;
        }

        const topicProgress =
            getTopicProgress(topicId);

        topicProgress.completedLessons =
            Array.from(
                new Set([
                    ...topicProgress.completedLessons,
                    lessonId
                ])
            );

        setTopicProgress(
            topicId,
            topicProgress
        );

        addXP(10);

        const lessons = getLessons(topicId);

        if (
            lessons.length &&
            topicProgress.completedLessons.length >=
                lessons.length &&
            !topicProgress.rewardClaimed
        ) {

            topicProgress.topicCompleted = true;
            topicProgress.rewardClaimed = true;

            setTopicProgress(
                topicId,
                topicProgress
            );

            addXP(25);

            showTopicCompletion(
                subjectId,
                topicId
            );

        } else {

            renderLesson(
                subjectId,
                topicId,
                Math.max(
                    0,
                    lessons.findIndex(
                        lesson => lesson.id === lessonId
                    )
                )
            );
        }

        document.dispatchEvent(
            new CustomEvent("chemlab:academy-lesson-completed", {
                detail: {
                    subjectId,
                    topicId,
                    lessonId
                }
            })
        );
    }


    /* =====================================================
       TOPIC COMPLETION
       ===================================================== */

    function showTopicCompletion(
        subjectId,
        topicId
    ) {

        const subject = getSubject(subjectId);
        const topic = getTopic(subjectId, topicId);

        if (!subject || !topic) {
            return;
        }

        setOverlayContent(`
            <section class="academy-completion-panel">

                <div class="academy-completion-icon">
                    ✓
                </div>

                <div class="academy-block-label">
                    TOPIC COMPLETED
                </div>

                <h1>
                    ${escapeHTML(topic.title)}
                </h1>

                <p>
                    You have completed every available lesson
                    in this topic.
                </p>

                <div class="academy-completion-reward">
                    <strong>+25 XP</strong>
                    <span>Topic completion reward</span>
                </div>

                <div class="academy-topic-actions">

                    <button
                        type="button"
                        class="button button-secondary"
                        data-topic-back="${escapeHTML(subjectId)}"
                    >
                        Explore More Topics
                    </button>

                    <button
                        type="button"
                        class="button button-primary"
                        data-academy-close
                    >
                        Return to Academy
                    </button>

                </div>

            </section>
        `);
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function search(query) {

        ACADEMY_STATE.searchQuery =
            String(query || "").trim().toLowerCase();

        applyFilters();

        return ACADEMY_STATE.filteredSubjects;
    }


    function filterByLevel(level) {

        ACADEMY_STATE.levelFilter =
            String(level || "all").toLowerCase();

        applyFilters();

        return ACADEMY_STATE.filteredSubjects;
    }


    function applyFilters() {

        const query =
            ACADEMY_STATE.searchQuery;

        const level =
            ACADEMY_STATE.levelFilter;

        ACADEMY_STATE.filteredSubjects =
            ACADEMY_CURRICULUM
                .map(subject => {

                    const subjectMatches =
                        !query ||
                        subject.title
                            .toLowerCase()
                            .includes(query) ||
                        subject.description
                            .toLowerCase()
                            .includes(query);

                    const topics =
                        subject.topics.filter(topic => {

                            const topicMatches =
                                !query ||
                                topic.title
                                    .toLowerCase()
                                    .includes(query) ||
                                topic.description
                                    .toLowerCase()
                                    .includes(query);

                            return topicMatches;
                        });

                    const levelMatches =
                        level === "all" ||
                        subject.level.toLowerCase() === level;

                    if (
                        levelMatches &&
                        (subjectMatches || topics.length)
                    ) {

                        return {
                            ...subject,
                            topics:
                                subjectMatches
                                    ? subject.topics
                                    : topics
                        };
                    }

                    return null;

                })
                .filter(Boolean);

        updateAcademyStats();
    }


    /* =====================================================
       ACADEMY STATS
       ===================================================== */

    function getTotalTopics() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) =>
                total + subject.topics.length,
            0
        );
    }


    function getTotalLessons() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) =>
                total +
                subject.topics.reduce(
                    (sum, topic) =>
                        sum + (
                            getLessons(topic.id).length ||
                            topic.lessons ||
                            0
                        ),
                    0
                ),
            0
        );
    }


    function updateAcademyStats() {

        const subjectCount =
            $("#academySubjectCount");

        const topicCount =
            $("#academyTopicCount");

        const lessonCount =
            $("#academyLessonCount");


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
       STATIC CARD CLICK HANDLING
       ===================================================== */

    function bindAcademyClicks() {

        document.addEventListener(
            "click",
            event => {

                const subjectCard =
                    event.target.closest(
                        "[data-academy-subject]"
                    );

                if (subjectCard) {

                    const subjectId =
                        subjectCard.dataset.academySubject;

                    if (subjectId) {
                        openSubject(subjectId);
                    }

                    return;
                }


                const topicCard =
                    event.target.closest(
                        "[data-academy-topic]"
                    );

                if (topicCard) {

                    const topicId =
                        topicCard.dataset.academyTopic;

                    const subjectId =
                        topicCard.dataset.academySubject ||
                        ACADEMY_STATE.currentSubject ||
                        "foundations";

                    if (topicId) {
                        openTopic(
                            subjectId,
                            topicId
                        );
                    }

                    return;
                }


                const topicOpen =
                    event.target.closest(
                        "[data-topic-open]"
                    );

                if (topicOpen) {

                    const topicId =
                        topicOpen.dataset.topicOpen;

                    if (
                        ACADEMY_STATE.currentSubject &&
                        topicId
                    ) {

                        openTopic(
                            ACADEMY_STATE.currentSubject,
                            topicId
                        );
                    }

                    return;
                }


                const lessonIndexButton =
                    event.target.closest(
                        "[data-lesson-index]"
                    );

                if (lessonIndexButton) {

                    const index =
                        Number(
                            lessonIndexButton.dataset.lessonIndex
                        );

                    openLesson(
                        ACADEMY_STATE.currentSubject,
                        ACADEMY_STATE.currentTopic,
                        index
                    );

                    return;
                }


                if (
                    event.target.closest(
                        "[data-lesson-complete]"
                    )
                ) {

                    const button =
                        event.target.closest(
                            "[data-lesson-complete]"
                        );

                    markLessonCompleted(
                        button.dataset.subjectId,
                        button.dataset.topicId,
                        button.dataset.lessonId
                    );

                    return;
                }


                if (
                    event.target.closest(
                        "[data-lesson-next]"
                    )
                ) {

                    const lessons =
                        getLessons(
                            ACADEMY_STATE.currentTopic
                        );

                    const currentIndex =
                        lessons.findIndex(
                            lesson =>
                                lesson.id ===
                                ACADEMY_STATE.currentLesson
                        );

                    if (
                        currentIndex >= 0 &&
                        currentIndex < lessons.length - 1
                    ) {

                        openLesson(
                            ACADEMY_STATE.currentSubject,
                            ACADEMY_STATE.currentTopic,
                            currentIndex + 1
                        );
                    }

                    return;
                }


                if (
                    event.target.closest(
                        "[data-lesson-prev]"
                    )
                ) {

                    const lessons =
                        getLessons(
                            ACADEMY_STATE.currentTopic
                        );

                    const currentIndex =
                        lessons.findIndex(
                            lesson =>
                                lesson.id ===
                                ACADEMY_STATE.currentLesson
                        );

                    if (currentIndex > 0) {

                        openLesson(
                            ACADEMY_STATE.currentSubject,
                            ACADEMY_STATE.currentTopic,
                            currentIndex - 1
                        );
                    }

                    return;
                }


                const topicBack =
                    event.target.closest(
                        "[data-topic-back]"
                    );

                if (topicBack) {

                    openSubject(
                        topicBack.dataset.topicBack
                    );

                    return;
                }


                const close =
                    event.target.closest(
                        "[data-academy-close]"
                    );

                if (close) {
                    closeOverlay();
                }
            }
        );
    }


    /* =====================================================
       KNOWLEDGE CHECK HANDLING
       ===================================================== */

    function bindKnowledgeChecks() {

        document.addEventListener(
            "click",
            event => {

                const answerButton =
                    event.target.closest(
                        "[data-check-answer]"
                    );

                if (!answerButton) {
                    return;
                }

                const container =
                    answerButton.closest(
                        "[data-knowledge-check]"
                    );

                if (!container) {
                    return;
                }

                const buttons =
                    $$(
                        "[data-check-answer]",
                        container
                    );

                const selected =
                    Number(
                        answerButton.dataset.checkAnswer
                    );

                const correct =
                    Number(
                        answerButton.dataset.correctAnswer
                    );

                const feedback =
                    $(
                        "[data-check-feedback]",
                        container
                    );

                buttons.forEach(button => {
                    button.disabled = true;
                });


                if (selected === correct) {

                    answerButton.classList.add(
                        "is-correct"
                    );

                    if (feedback) {
                        feedback.textContent =
                            "Correct. Excellent work.";
                    }

                    if (!container.dataset.rewarded) {

                        container.dataset.rewarded =
                            "true";

                        addXP(5);
                    }

                } else {

                    answerButton.classList.add(
                        "is-incorrect"
                    );

                    if (buttons[correct]) {
                        buttons[correct].classList.add(
                            "is-correct"
                        );
                    }

                    if (feedback) {
                        feedback.textContent =
                            "Not quite. Review the lesson and try the concept again.";
                    }
                }
            }
        );
    }


    /* =====================================================
       SEARCH UI
       ===================================================== */

    function bindSearch() {

        const input =
            $("#academySearchInput");

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            event => {
                search(event.target.value);
            }
        );


        $$("[data-academy-level]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        $$(
                            "[data-academy-level]"
                        ).forEach(item => {
                            item.classList.remove(
                                "is-active"
                            );
                        });

                        button.classList.add(
                            "is-active"
                        );

                        filterByLevel(
                            button.dataset.academyLevel
                        );
                    }
                );
            });
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initialize() {

        if (ACADEMY_STATE.initialized) {
            return;
        }

        ACADEMY_STATE.loading = true;

        ACADEMY_STATE.subjects =
            ACADEMY_CURRICULUM;

        ACADEMY_STATE.filteredSubjects =
            ACADEMY_CURRICULUM;

        bindAcademyClicks();
        bindKnowledgeChecks();
        bindSearch();

        ensureAcademyOverlay();

        updateAcademyStats();

        ACADEMY_STATE.initialized = true;
        ACADEMY_STATE.loading = false;


        document.dispatchEvent(
            new CustomEvent("chemlab:academy-ready", {
                detail: {
                    subjects:
                        ACADEMY_CURRICULUM.length,
                    topics:
                        getTotalTopics(),
                    lessons:
                        getTotalLessons()
                }
            })
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_ACADEMY = {

        initialize,

        getSubjects: () =>
            ACADEMY_CURRICULUM,

        getSubject,

        getTopic,

        getLessons,

        getLesson,

        search,

        filterByLevel,

        openSubject,

        openTopic,

        openLesson,

        markLessonCompleted,

        getTotalTopics,

        getTotalLessons,

        getTopicProgress,

        getTopicCompletionPercent,

        isLessonCompleted,

        getXP,

        addXP,

        close: closeOverlay,

        getState: () => ({
            ...ACADEMY_STATE
        })
    };


    /* =====================================================
       AUTO INITIALIZE
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }

})();

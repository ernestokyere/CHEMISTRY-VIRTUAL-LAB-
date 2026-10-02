/* =========================================================
   CHEMLAB
   CHEMISTRY ACADEMY ENGINE
   Stage 5.5 — Chemistry Content Engine
   Part 1: Foundations of Chemistry
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       STATE
       ===================================================== */

    const STATE = {
        initialized: false,

        view: "subjects",

        currentSubject: null,
        currentTopic: null,
        currentLessonIndex: 0,

        subjects: [],
        filteredSubjects: [],
        filteredTopics: [],

        searchQuery: "",
        topicSearchQuery: "",
        currentLevel: "all",

        loading: false
    };


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE = {
        topicProgress: "chemlab_topic_progress_",
        lessonCompleted: "chemlab_lesson_completed_"
    };


    /* =====================================================
       CURRICULUM
       ===================================================== */

    const CURRICULUM = [

        {
            id: "foundations",
            title: "Foundations of Chemistry",
            shortTitle: "Foundations",
            icon: "🧪",
            description:
                "The mathematical, atomic, molecular and experimental foundations required for university-level chemistry.",

            levels: [
                "foundation",
                "undergraduate",
                "advanced"
            ],

            topics: [

                {
                    id: "measurements-scientific-units",
                    title: "Measurements & Scientific Units",
                    level: "foundation",
                    description:
                        "Learn how chemists measure physical quantities and communicate measurements using the SI system.",
                    lessons: [
                        "scientific-measurement",
                        "si-units",
                        "chemistry-units",
                        "scientific-notation"
                    ]
                },

                {
                    id: "significant-figures",
                    title: "Significant Figures",
                    level: "foundation",
                    description:
                        "Learn how significant figures communicate the precision of experimental measurements.",
                    lessons: [
                        "meaning-significant-figures",
                        "counting-significant-figures",
                        "calculations-significant-figures",
                        "rounding-results"
                    ]
                },

                {
                    id: "dimensional-analysis",
                    title: "Dimensional Analysis",
                    level: "foundation",
                    description:
                        "Use units as mathematical tools for converting quantities and checking equations.",
                    lessons: [
                        "dimensional-analysis-basics",
                        "unit-conversions",
                        "multi-step-conversions",
                        "dimensional-analysis-chemistry"
                    ]
                },

                {
                 {
    id: "atomic-structure-periodic-table",
    title: "Atomic Structure & the Periodic Table",
    description:
        "Explore the structure of atoms, electron configuration, isotopes, ions, and the principles behind periodic trends.",
    level: "foundation",
    difficulty: "Intermediate",
    estimatedMinutes: 150,
    lessons: 12,
    icon: "⚛",
    tags: [
        "atoms",
        "electrons",
        "isotopes",
        "periodic table",
        "periodic trends"
    ]
},

                {
                    id: "isotopes-atomic-mass",
                    title: "Isotopes & Atomic Mass",
                    level: "foundation",
                    description:
                        "Understand isotopes and calculate weighted average atomic masses.",
                    lessons: [
                        "isotopes",
                        "isotopic-abundance",
                        "average-atomic-mass",
                        "mass-spectrometry-introduction"
                    ]
                },

                {
                    id: "periodic-table",
                    title: "The Periodic Table",
                    level: "foundation",
                    description:
                        "Explore periodic organization, groups, periods and chemical trends.",
                    lessons: [
                        "periodic-organization",
                        "groups-periods-blocks",
                        "atomic-radius",
                        "ionization-electronegativity"
                    ]
                },

                {
                    id: "chemical-formulas",
                    title: "Chemical Formulas",
                    level: "foundation",
                    description:
                        "Interpret molecular, empirical and ionic formulas.",
                    lessons: [
                        "chemical-formula-language",
                        "ionic-formulas",
                        "molecular-formulas",
                        "empirical-formulas"
                    ]
                },

                {
                    id: "chemical-equations",
                    title: "Chemical Equations",
                    level: "foundation",
                    description:
                        "Represent chemical reactions using balanced chemical equations.",
                    lessons: [
                        "chemical-equation-language",
                        "balancing-equations",
                        "reaction-information",
                        "reaction-types"
                    ]
                },

                {
                    id: "mole-concept",
                    title: "The Mole Concept",
                    level: "foundation",
                    description:
                        "Connect microscopic particles with measurable amounts of chemical substance.",
                    lessons: [
                        "counting-particles",
                        "avogadro-constant",
                        "moles-and-particles",
                        "moles-and-mass"
                    ]
                },

                {
                    id: "molar-mass",
                    title: "Molar Mass",
                    level: "foundation",
                    description:
                        "Calculate molar mass and use it to convert between mass and amount of substance.",
                    lessons: [
                        "molar-mass-definition",
                        "calculating-molar-mass",
                        "mass-to-moles",
                        "moles-to-mass"
                    ]
                },

                {
                    id: "stoichiometry",
                    title: "Stoichiometry",
                    level: "undergraduate",
                    description:
                        "Use balanced chemical equations to calculate relationships between reactants and products.",
                    lessons: [
                        "stoichiometric-ratios",
                        "mole-to-mole",
                        "mass-to-mass",
                        "stoichiometric-problem-solving"
                    ]
                },

                {
                    id: "limiting-reagents",
                    title: "Limiting Reagents",
                    level: "undergraduate",
                    description:
                        "Determine which reactant limits a chemical reaction and calculate theoretical product.",
                    lessons: [
                        "limiting-reactant-concept",
                        "identifying-limiting-reactant",
                        "excess-reactant",
                        "theoretical-yield"
                    ]
                },

                {
                    id: "yield",
                    title: "Theoretical & Percent Yield",
                    level: "undergraduate",
                    description:
                        "Compare theoretical and experimental quantities of products.",
                    lessons: [
                        "theoretical-yield",
                        "actual-yield",
                        "percent-yield",
                        "interpreting-yield"
                    ]
                },

                {
                    id: "concentration",
                    title: "Concentration",
                    level: "foundation",
                    description:
                        "Describe the amount of dissolved substance relative to solution volume.",
                    lessons: [
                        "concentration-concept",
                        "molarity",
                        "mass-concentration",
                        "concentration-calculations"
                    ]
                },

                {
                    id: "dilution",
                    title: "Dilution",
                    level: "foundation",
                    description:
                        "Understand how solution concentration changes when solvent is added.",
                    lessons: [
                        "dilution-concept",
                        "dilution-equation",
                        "dilution-calculations",
                        "serial-dilution"
                    ]
                },

                {
                    id: "solution-preparation",
                    title: "Solution Preparation",
                    level: "undergraduate",
                    description:
                        "Learn the scientific principles behind preparing solutions of known concentration.",
                    lessons: [
                        "solution-preparation-principles",
                        "volumetric-flask",
                        "solid-solute-preparation",
                        "solution-dilution-preparation"
                    ]
                },

                {
                    id: "experimental-uncertainty",
                    title: "Experimental Uncertainty",
                    level: "undergraduate",
                    description:
                        "Understand uncertainty and how it affects scientific measurements.",
                    lessons: [
                        "measurement-uncertainty",
                        "absolute-uncertainty",
                        "relative-uncertainty",
                        "propagation-introduction"
                    ]
                },

                {
                    id: "accuracy-precision",
                    title: "Accuracy & Precision",
                    level: "foundation",
                    description:
                        "Distinguish accuracy from precision and interpret experimental results.",
                    lessons: [
                        "accuracy",
                        "precision",
                        "systematic-random-error",
                        "evaluating-results"
                    ]
                },

                {
                    id: "chemical-data-analysis",
                    title: "Introduction to Chemical Data Analysis",
                    level: "undergraduate",
                    description:
                        "Use tables, averages, graphs and basic statistics to interpret chemical data.",
                    lessons: [
                        "organizing-data",
                        "mean-and-range",
                        "graphs-in-chemistry",
                        "interpreting-experimental-data"
                    ]
                }
            ]
        },

        {
            id: "inorganic",
            title: "Inorganic Chemistry",
            shortTitle: "Inorganic",
            icon: "⚛️",
            description:
                "Explore elements, bonding, coordination chemistry, acids, bases and inorganic reactions.",
            levels: [
                "foundation",
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "organic",
            title: "Organic Chemistry",
            shortTitle: "Organic",
            icon: "🧬",
            description:
                "Study carbon compounds, functional groups, mechanisms, reactions and synthesis.",
            levels: [
                "foundation",
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "physical",
            title: "Physical Chemistry",
            shortTitle: "Physical",
            icon: "📐",
            description:
                "Study energy, equilibrium, kinetics, thermodynamics and molecular behavior.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "analytical",
            title: "Analytical Chemistry",
            shortTitle: "Analytical",
            icon: "🔬",
            description:
                "Learn quantitative and qualitative methods used to identify and measure chemical substances.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "biochemistry",
            title: "Biochemistry",
            shortTitle: "Biochemistry",
            icon: "🧬",
            description:
                "Explore the chemistry of biological molecules, enzymes and metabolic systems.",
            levels: [
                "foundation",
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "environmental",
            title: "Environmental Chemistry",
            shortTitle: "Environmental",
            icon: "🌍",
            description:
                "Study chemical processes in water, soil, atmosphere and environmental systems.",
            levels: [
                "foundation",
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "electrochemistry",
            title: "Electrochemistry",
            shortTitle: "Electrochemistry",
            icon: "⚡",
            description:
                "Study oxidation-reduction reactions, electrochemical cells and electrical energy.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "materials",
            title: "Materials & Industrial Chemistry",
            shortTitle: "Materials",
            icon: "🏭",
            description:
                "Explore polymers, metals, ceramics, catalysts and major industrial chemical processes.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "instrumental",
            title: "Instrumental & Spectroscopic Chemistry",
            shortTitle: "Instrumental",
            icon: "📊",
            description:
                "Learn the principles behind spectroscopy, chromatography and modern chemical instruments.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "nuclear",
            title: "Nuclear & Radiochemistry",
            shortTitle: "Nuclear",
            icon: "☢️",
            description:
                "Study nuclear structure, radioactivity, decay and applications of radioisotopes.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        },

        {
            id: "research",
            title: "Research & Laboratory Science",
            shortTitle: "Research",
            icon: "🧪",
            description:
                "Develop experimental design, scientific reasoning, data analysis and research communication skills.",
            levels: [
                "undergraduate",
                "advanced"
            ],
            topics: []
        }
    ];

/* =========================================================
   CHEMLAB
   STAGE 5.5 — EXPANDED LESSON CONTENT
   FOUNDATIONS OF CHEMISTRY
   ========================================================= */

const LESSON_CONTENT = {

    /* =====================================================
       MEASUREMENTS & SCIENTIFIC UNITS
       ===================================================== */

    "measurements-scientific-units": [

        /* -------------------------------------------------
           LESSON 1
           ------------------------------------------------- */

        {
            id: "what-is-a-scientific-measurement",

            title: "What Is a Scientific Measurement?",

            type: "concept",

            duration: 8,

            objectives: [
                "Explain what a scientific measurement is.",
                "Identify the numerical value and unit in a measurement.",
                "Distinguish measured quantities from observations.",
                "Explain why units are essential in chemistry."
            ],

            content: `
                <p>
                    Chemistry is an experimental science. Chemists do not
                    simply describe what happens; they observe, measure,
                    record, compare, and analyze evidence.
                </p>

                <p>
                    A <strong>scientific measurement</strong> is a quantitative
                    description of a physical quantity obtained by comparing
                    it with an agreed standard.
                </p>

                <div class="lesson-callout">
                    <strong>Key idea:</strong>
                    A measurement normally contains two essential parts:
                    a numerical value and a unit.
                </div>

                <div class="lesson-equation">
                    Measurement = Numerical Value + Unit
                </div>

                <p>
                    For example, if the mass of a sample is recorded as
                    <strong>12.5 g</strong>, the number
                    <strong>12.5</strong> tells us the magnitude of the
                    measurement, while <strong>g</strong> tells us what unit
                    was used.
                </p>

                <p>
                    A number without an appropriate unit can be ambiguous.
                    Saying that a sample has a mass of "12.5" does not tell
                    another scientist whether the value is in grams,
                    kilograms, milligrams, or another unit.
                </p>

                <p>
                    Measurements are also not perfectly exact. Every physical
                    measuring instrument has a limit to how finely it can
                    distinguish values. This is why chemistry places great
                    importance on significant figures, uncertainty, accuracy,
                    and precision.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Quantity</th>
                                <th>Example</th>
                                <th>Unit</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Mass</td>
                                <td>12.50 g</td>
                                <td>gram (g)</td>
                            </tr>

                            <tr>
                                <td>Volume</td>
                                <td>25.0 mL</td>
                                <td>millilitre (mL)</td>
                            </tr>

                            <tr>
                                <td>Temperature</td>
                                <td>298 K</td>
                                <td>kelvin (K)</td>
                            </tr>

                            <tr>
                                <td>Time</td>
                                <td>45.2 s</td>
                                <td>second (s)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,

            keyPoints: [
                "Measurements provide quantitative information.",
                "A measurement normally contains a numerical value and a unit.",
                "Units communicate what a numerical value represents.",
                "Measurements have limitations and associated uncertainty.",
                "Chemistry depends heavily on reliable quantitative measurements."
            ],

            workedExample: {
                question:
                    "A student measures the volume of a liquid as 35.0 mL. Identify the numerical value and the unit.",

                solution: `
                    <strong>Numerical value:</strong> 35.0<br>
                    <strong>Unit:</strong> mL (millilitres)
                `
            },

            knowledgeCheck: {
                question:
                    "Which statement best describes a scientific measurement?",

                options: [
                    "A number written without a unit",
                    "A qualitative description of an object",
                    "A quantitative value expressed with an appropriate unit",
                    "A prediction about what will happen"
                ],

                answer: 2,

                explanation:
                    "A scientific measurement gives quantitative information and is normally expressed with an appropriate unit."
            }
        },


        /* -------------------------------------------------
           LESSON 2
           ------------------------------------------------- */

        {
            id: "si-system-of-units",

            title: "The SI System of Units",

            type: "concept",

            duration: 10,

            objectives: [
                "Define the SI system.",
                "Identify common SI base quantities used in chemistry.",
                "Recognize SI symbols and units.",
                "Explain why standardized units are important."
            ],

            content: `
                <p>
                    Scientists around the world need a common language for
                    measurements. The
                    <strong>International System of Units (SI)</strong>
                    provides a standardized system for expressing physical
                    quantities.
                </p>

                <p>
                    The SI system is built from a set of
                    <strong>base quantities</strong>. Other units can be
                    derived from these fundamental units.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Quantity</th>
                                <th>SI Unit</th>
                                <th>Symbol</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Length</td>
                                <td>metre</td>
                                <td>m</td>
                            </tr>

                            <tr>
                                <td>Mass</td>
                                <td>kilogram</td>
                                <td>kg</td>
                            </tr>

                            <tr>
                                <td>Time</td>
                                <td>second</td>
                                <td>s</td>
                            </tr>

                            <tr>
                                <td>Temperature</td>
                                <td>kelvin</td>
                                <td>K</td>
                            </tr>

                            <tr>
                                <td>Amount of substance</td>
                                <td>mole</td>
                                <td>mol</td>
                            </tr>

                            <tr>
                                <td>Electric current</td>
                                <td>ampere</td>
                                <td>A</td>
                            </tr>

                            <tr>
                                <td>Luminous intensity</td>
                                <td>candela</td>
                                <td>cd</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    Chemistry frequently uses several derived quantities.
                    For example, volume can be expressed in cubic metres
                    (<strong>m³</strong>), while concentration may be expressed
                    in moles per cubic metre or moles per litre.
                </p>

                <div class="lesson-callout">
                    <strong>Important:</strong>
                    The kilogram is the SI base unit for mass, although grams
                    and milligrams are extremely common in laboratory work.
                </div>

                <p>
                    Standardized units allow measurements made in different
                    laboratories, countries, and experiments to be compared
                    consistently.
                </p>
            `,

            keyPoints: [
                "SI stands for International System of Units.",
                "SI provides internationally standardized measurement units.",
                "The mole is the SI base unit for amount of substance.",
                "The kelvin is the SI base unit for thermodynamic temperature.",
                "Derived units are constructed from base units."
            ],

            workedExample: {
                question:
                    "What is the SI base unit for amount of substance?",

                solution: `
                    The SI base unit for amount of substance is the
                    <strong>mole (mol)</strong>.
                `
            },

            knowledgeCheck: {
                question:
                    "Which is the SI base unit for temperature?",

                options: [
                    "Degree Celsius (°C)",
                    "Kelvin (K)",
                    "Joule (J)",
                    "Pascal (Pa)"
                ],

                answer: 1,

                explanation:
                    "The kelvin (K) is the SI base unit for thermodynamic temperature."
            }
        },


        /* -------------------------------------------------
           LESSON 3
           ------------------------------------------------- */

        {
            id: "common-chemistry-units",

            title: "Common Chemistry Units",

            type: "concept",

            duration: 10,

            objectives: [
                "Identify common units used in chemistry.",
                "Match physical quantities with appropriate units.",
                "Distinguish SI units from commonly used laboratory units.",
                "Recognize common prefixes such as milli-, micro-, and kilo-."
            ],

            content: `
                <p>
                    Although SI units provide the international foundation,
                    chemists frequently use related units that are convenient
                    for laboratory measurements.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Quantity</th>
                                <th>Common Units</th>
                                <th>Typical Use</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Mass</td>
                                <td>g, mg, kg</td>
                                <td>Weighing substances</td>
                            </tr>

                            <tr>
                                <td>Volume</td>
                                <td>L, mL, cm³</td>
                                <td>Measuring liquids</td>
                            </tr>

                            <tr>
                                <td>Temperature</td>
                                <td>°C, K</td>
                                <td>Thermal measurements</td>
                            </tr>

                            <tr>
                                <td>Pressure</td>
                                <td>Pa, kPa, atm</td>
                                <td>Gas and atmospheric studies</td>
                            </tr>

                            <tr>
                                <td>Energy</td>
                                <td>J, kJ</td>
                                <td>Thermochemistry</td>
                            </tr>

                            <tr>
                                <td>Amount</td>
                                <td>mol</td>
                                <td>Stoichiometric calculations</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    Chemistry also uses prefixes to represent very large or
                    very small quantities.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Prefix</th>
                                <th>Symbol</th>
                                <th>Factor</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>kilo</td>
                                <td>k</td>
                                <td>10³</td>
                            </tr>

                            <tr>
                                <td>milli</td>
                                <td>m</td>
                                <td>10⁻³</td>
                            </tr>

                            <tr>
                                <td>micro</td>
                                <td>µ</td>
                                <td>10⁻⁶</td>
                            </tr>

                            <tr>
                                <td>nano</td>
                                <td>n</td>
                                <td>10⁻⁹</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="lesson-callout">
                    <strong>Remember:</strong>
                    A prefix changes the scale of a unit. It does not change
                    the physical quantity being measured.
                </div>
            `,

            keyPoints: [
                "Chemists use many units depending on the quantity and scale.",
                "Millilitres and litres are common units for laboratory volume.",
                "Grams and milligrams are common laboratory mass units.",
                "Prefixes represent powers of ten.",
                "Unit conversions are essential when performing calculations."
            ],

            workedExample: {
                question:
                    "How many millilitres are in 2.5 litres?",

                solution: `
                    Since 1 L = 1000 mL:

                    <div class="lesson-equation">
                        2.5 L × 1000 mL/L = 2500 mL
                    </div>

                    Therefore, <strong>2.5 L = 2500 mL</strong>.
                `
            },

            knowledgeCheck: {
                question:
                    "Which prefix represents 10⁻³?",

                options: [
                    "kilo-",
                    "micro-",
                    "milli-",
                    "nano-"
                ],

                answer: 2,

                explanation:
                    "The prefix milli- represents one thousandth, or 10⁻³."
            }
        },


        /* -------------------------------------------------
           LESSON 4
           ------------------------------------------------- */

        {
            id: "scientific-notation",

            title: "Scientific Notation",

            type: "calculation",

            duration: 12,

            objectives: [
                "Explain scientific notation.",
                "Convert ordinary numbers into scientific notation.",
                "Convert scientific notation back to ordinary numbers.",
                "Use scientific notation to represent very large and very small quantities."
            ],

            content: `
                <p>
                    Chemistry frequently deals with quantities that are
                    extremely large or extremely small.
                </p>

                <p>
                    For example, atoms are incredibly small, while a laboratory
                    may contain an enormous number of particles. Writing such
                    numbers in ordinary decimal form can be inconvenient and
                    can make mistakes more likely.
                </p>

                <p>
                    <strong>Scientific notation</strong> provides a compact way
                    of representing these numbers.
                </p>

                <div class="lesson-equation">
                    a × 10ⁿ
                </div>

                <p>
                    In scientific notation, <strong>a</strong> is a number
                    greater than or equal to 1 but less than 10, while
                    <strong>n</strong> is an integer.
                </p>

                <div class="lesson-callout">
                    <strong>Moving the decimal left</strong> produces a
                    positive exponent when converting a large number.
                    Moving it right produces a negative exponent for a number
                    smaller than one.
                </div>

                <h3>Example: Large Number</h3>

                <div class="lesson-equation">
                    450000 = 4.5 × 10⁵
                </div>

                <h3>Example: Small Number</h3>

                <div class="lesson-equation">
                    0.00032 = 3.2 × 10⁻⁴
                </div>

                <p>
                    Scientific notation is especially useful when working with
                    atomic dimensions, particle counts, concentrations,
                    physical constants, and very small measurements.
                </p>
            `,

            keyPoints: [
                "Scientific notation expresses numbers as a × 10ⁿ.",
                "The coefficient a must be at least 1 and less than 10.",
                "Large numbers normally have positive exponents.",
                "Numbers between 0 and 1 normally have negative exponents.",
                "Scientific notation reduces ambiguity and simplifies calculations."
            ],

            workedExample: {
                question:
                    "Express 0.00000560 in scientific notation.",

                solution: `
                    Move the decimal point five places to the right:

                    <div class="lesson-equation">
                        0.00000560 = 5.60 × 10⁻⁶
                    </div>

                    Therefore, the answer is
                    <strong>5.60 × 10⁻⁶</strong>.
                `
            },

            knowledgeCheck: {
                question:
                    "Which is the correct scientific notation for 720000?",

                options: [
                    "72 × 10⁴",
                    "7.2 × 10⁵",
                    "0.72 × 10⁶",
                    "720 × 10³"
                ],

                answer: 1,

                explanation:
                    "Scientific notation requires the coefficient to be at least 1 and less than 10, so 720000 = 7.2 × 10⁵."
            }
        },


        /* -------------------------------------------------
           LESSON 5
           ------------------------------------------------- */

        {
            id: "significant-figures",

            title: "Significant Figures",

            type: "calculation",

            duration: 14,

            objectives: [
                "Define significant figures.",
                "Identify significant and non-significant zeros.",
                "Count significant figures in measured values.",
                "Explain why significant figures matter in chemistry."
            ],

            content: `
                <p>
                    Measurements contain information about their precision.
                    <strong>Significant figures</strong> are the digits in a
                    measured value that communicate its meaningful precision.
                </p>

                <div class="lesson-callout">
                    <strong>Important:</strong>
                    Significant figures are not simply all the digits written
                    in a number. Their purpose is to communicate the precision
                    supported by the measurement.
                </div>

                <h3>Basic Rules</h3>

                <p>
                    Non-zero digits are always significant.
                </p>

                <div class="lesson-equation">
                    245 → 3 significant figures
                </div>

                <p>
                    Zeros between non-zero digits are significant.
                </p>

                <div class="lesson-equation">
                    1005 → 4 significant figures
                </div>

                <p>
                    Leading zeros are not significant.
                </p>

                <div class="lesson-equation">
                    0.0045 → 2 significant figures
                </div>

                <p>
                    Trailing zeros after a decimal point are significant.
                </p>

                <div class="lesson-equation">
                    4.500 → 4 significant figures
                </div>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Value</th>
                                <th>Significant Figures</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>25.4</td>
                                <td>3</td>
                            </tr>

                            <tr>
                                <td>0.0052</td>
                                <td>2</td>
                            </tr>

                            <tr>
                                <td>1005</td>
                                <td>4</td>
                            </tr>

                            <tr>
                                <td>7.00</td>
                                <td>3</td>
                            </tr>

                            <tr>
                                <td>0.0400</td>
                                <td>3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    Significant figures become especially important when
                    reporting calculated results because the final answer
                    should not imply greater precision than the measurements
                    support.
                </p>
            `,

            keyPoints: [
                "Significant figures communicate meaningful measurement precision.",
                "Non-zero digits are significant.",
                "Zeros between non-zero digits are significant.",
                "Leading zeros are not significant.",
                "Trailing zeros after a decimal point are significant."
            ],

            workedExample: {
                question:
                    "How many significant figures are present in 0.03040?",

                solution: `
                    The leading zeros are not significant.

                    The digits 3, 0, 4, and the final zero are significant.

                    Therefore:

                    <div class="lesson-equation">
                        0.03040 → 4 significant figures
                    </div>
                `
            },

            knowledgeCheck: {
                question:
                    "How many significant figures are in 0.00450?",

                options: [
                    "2",
                    "3",
                    "4",
                    "5"
                ],

                answer: 1,

                explanation:
                    "The leading zeros are not significant. The digits 4, 5, and the final zero are significant, giving 3 significant figures."
            }
        },


        /* -------------------------------------------------
           LESSON 6
           ------------------------------------------------- */

        {
            id: "accuracy-and-precision",

            title: "Accuracy and Precision",

            type: "concept",

            duration: 10,

            objectives: [
                "Define accuracy.",
                "Define precision.",
                "Distinguish accuracy from precision.",
                "Explain why both matter in laboratory measurements."
            ],

            content: `
                <p>
                    Two important ideas in experimental chemistry are
                    <strong>accuracy</strong> and <strong>precision</strong>.
                    Although the words are sometimes used interchangeably in
                    everyday language, they have different scientific meanings.
                </p>

                <h3>Accuracy</h3>

                <p>
                    <strong>Accuracy</strong> describes how close a measured
                    value is to an accepted or reference value.
                </p>

                <h3>Precision</h3>

                <p>
                    <strong>Precision</strong> describes how closely repeated
                    measurements agree with one another.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Situation</th>
                                <th>Accuracy</th>
                                <th>Precision</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Values close to reference and each other</td>
                                <td>High</td>
                                <td>High</td>
                            </tr>

                            <tr>
                                <td>Values close to each other but far from reference</td>
                                <td>Low</td>
                                <td>High</td>
                            </tr>

                            <tr>
                                <td>Values spread out but centered around reference</td>
                                <td>Generally high overall</td>
                                <td>Low</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="lesson-callout">
                    <strong>Remember:</strong>
                    A measurement can be precise without being accurate.
                    Repeating the same systematic error can produce tightly
                    grouped but inaccurate results.
                </div>

                <p>
                    Good experimental practice aims to produce measurements
                    that are both accurate and precise, while recognizing that
                    real measurements always have limitations.
                </p>
            `,

            keyPoints: [
                "Accuracy refers to closeness to an accepted value.",
                "Precision refers to agreement among repeated measurements.",
                "A result can be precise but inaccurate.",
                "Systematic errors can affect accuracy.",
                "Random variation can affect precision."
            ],

            workedExample: {
                question:
                    "A balance repeatedly gives 10.21 g for a standard sample whose accepted value is 10.00 g. What does this suggest?",

                solution: `
                    The repeated results are close to one another, indicating
                    good <strong>precision</strong>. However, they are not close
                    to the accepted value, indicating lower <strong>accuracy</strong>.
                `
            },

            knowledgeCheck: {
                question:
                    "What does precision describe?",

                options: [
                    "How close a result is to the accepted value",
                    "How close repeated measurements are to one another",
                    "The unit used for a measurement",
                    "The size of the laboratory instrument"
                ],

                answer: 1,

                explanation:
                    "Precision describes the degree of agreement among repeated measurements."
            }
        },


        /* -------------------------------------------------
           LESSON 7
           ------------------------------------------------- */

        {
            id: "measurement-uncertainty",

            title: "Measurement Uncertainty",

            type: "concept",

            duration: 12,

            objectives: [
                "Explain measurement uncertainty.",
                "Identify sources of uncertainty.",
                "Understand why measurements cannot be perfectly exact.",
                "Relate instrument resolution to reported measurements."
            ],

            content: `
                <p>
                    No physical measurement is perfectly exact. Every
                    measurement has some degree of
                    <strong>uncertainty</strong>.
                </p>

                <p>
                    Measurement uncertainty represents the range within which
                    the true value is expected to lie, according to the
                    measurement method and its limitations.
                </p>

                <div class="lesson-callout">
                    <strong>Key idea:</strong>
                    Uncertainty does not mean that an experiment has failed.
                    It is a normal and important part of scientific measurement.
                </div>

                <p>
                    Sources of uncertainty may include the measuring
                    instrument, environmental conditions, sample preparation,
                    reading technique, and natural variation.
                </p>

                <h3>Instrument Resolution</h3>

                <p>
                    The smallest scale division or display increment of an
                    instrument influences how precisely a measurement can be
                    reported.
                </p>

                <p>
                    For example, an instrument displaying mass to the nearest
                    0.01 g communicates a different level of measurement detail
                    from an instrument displaying only to the nearest gram.
                </p>

                <div class="lesson-equation">
                    Reported measurement = measured value ± uncertainty
                </div>

                <p>
                    In advanced analytical chemistry, uncertainty can be
                    quantified using statistical and experimental methods.
                    These methods allow scientists to communicate the quality
                    and limitations of their results.
                </p>
            `,

            keyPoints: [
                "Every physical measurement has uncertainty.",
                "Uncertainty can arise from instruments, environment, technique, and samples.",
                "Instrument resolution affects how a measurement can be reported.",
                "Uncertainty should be communicated rather than ignored.",
                "Advanced chemistry uses statistical methods to estimate uncertainty."
            ],

            workedExample: {
                question:
                    "Why should a student avoid reporting more decimal places than an instrument can support?",

                solution: `
                    Reporting unsupported decimal places gives the impression
                    of greater precision than the measuring instrument can
                    actually provide. The reported value should reflect the
                    measurement capability of the instrument.
                `
            },

            knowledgeCheck: {
                question:
                    "Which statement about measurement uncertainty is correct?",

                options: [
                    "It means every measurement is useless",
                    "It is a normal limitation of physical measurement",
                    "It only occurs when a student makes a mistake",
                    "It can always be completely eliminated"
                ],

                answer: 1,

                explanation:
                    "Uncertainty is an inherent part of physical measurement and should be properly considered and reported."
            }
        },


        /* -------------------------------------------------
           LESSON 8
           ------------------------------------------------- */

        {
            id: "dimensional-analysis",

            title: "Dimensional Analysis",

            type: "calculation",

            duration: 14,

            objectives: [
                "Explain dimensional analysis.",
                "Use conversion factors to change units.",
                "Cancel units systematically.",
                "Check whether a calculation has physically meaningful units."
            ],

            content: `
                <p>
                    <strong>Dimensional analysis</strong> is a systematic
                    method for converting quantities from one unit to another.
                    It is also a powerful way to check whether a calculation
                    is dimensionally consistent.
                </p>

                <p>
                    The central idea is to multiply by a conversion factor that
                    is equal to one.
                </p>

                <div class="lesson-equation">
                    1 L = 1000 mL
                </div>

                <p>
                    Therefore, either of the following ratios represents a
                    valid conversion factor:
                </p>

                <div class="lesson-equation">
                    1000 mL / 1 L
                    &nbsp;&nbsp;&nbsp; or &nbsp;&nbsp;&nbsp;
                    1 L / 1000 mL
                </div>

                <p>
                    The correct form is selected so that unwanted units cancel.
                </p>

                <div class="lesson-equation">
                    2.5 L ×
                    (1000 mL / 1 L)
                    = 2500 mL
                </div>

                <p>
                    Notice that the unit L appears in both the numerator and
                    denominator and therefore cancels.
                </p>

                <div class="lesson-callout">
                    <strong>Useful habit:</strong>
                    Always write units during chemistry calculations. Units
                    provide an immediate check on whether your setup makes
                    sense.
                </div>
            `,

            keyPoints: [
                "Dimensional analysis uses conversion factors to change units.",
                "Conversion factors are ratios equal to one.",
                "Units should be treated algebraically.",
                "Unwanted units should cancel.",
                "Dimensional analysis can reveal calculation errors."
            ],

            workedExample: {
                question:
                    "Convert 750 mL to litres.",

                solution: `
                    Use:

                    <div class="lesson-equation">
                        1 L = 1000 mL
                    </div>

                    Therefore:

                    <div class="lesson-equation">
                        750 mL ×
                        (1 L / 1000 mL)
                        = 0.750 L
                    </div>

                    Therefore, <strong>750 mL = 0.750 L</strong>.
                `
            },

            knowledgeCheck: {
                question:
                    "What is the main purpose of dimensional analysis?",

                options: [
                    "To remove units from every answer",
                    "To convert units and check dimensional consistency",
                    "To increase the precision of an instrument",
                    "To determine the colour of a chemical"
                ],

                answer: 1,

                explanation:
                    "Dimensional analysis is used for unit conversion and for checking whether calculations are dimensionally consistent."
            }
        },


        /* -------------------------------------------------
           LESSON 9
           ------------------------------------------------- */

        {
            id: "unit-conversions-in-chemistry",

            title: "Unit Conversions in Chemistry",

            type: "calculation",

            duration: 14,

            objectives: [
                "Perform common chemistry unit conversions.",
                "Convert between metric prefixes.",
                "Use multiple conversion factors.",
                "Maintain appropriate significant figures."
            ],

            content: `
                <p>
                    Chemistry calculations frequently require conversion
                    between different units before an equation can be used.
                </p>

                <p>
                    Metric prefixes make many conversions straightforward
                    because they represent powers of ten.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Relationship</th>
                                <th>Equivalent</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>1 kg</td>
                                <td>1000 g</td>
                            </tr>

                            <tr>
                                <td>1 g</td>
                                <td>1000 mg</td>
                            </tr>

                            <tr>
                                <td>1 L</td>
                                <td>1000 mL</td>
                            </tr>

                            <tr>
                                <td>1 mL</td>
                                <td>1 cm³</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    Some chemistry problems require more than one conversion
                    step. Dimensional analysis allows these steps to be linked
                    together without losing track of the units.
                </p>

                <div class="lesson-equation">
                    2.4 kg ×
                    (1000 g / 1 kg)
                    = 2400 g
                </div>

                <p>
                    When converting measured quantities, remember that the
                    precision of the final result should remain consistent with
                    the information supplied by the original measurement.
                </p>
            `,

            keyPoints: [
                "Metric conversions are based on powers of ten.",
                "Dimensional analysis is useful for multi-step conversions.",
                "Write units at every step.",
                "The final unit should match the quantity being requested.",
                "Reported precision should be appropriate for the original measurement."
            ],

            workedExample: {
                question:
                    "Convert 0.0250 kg to grams.",

                solution: `
                    <div class="lesson-equation">
                        0.0250 kg ×
                        (1000 g / 1 kg)
                        = 25.0 g
                    </div>

                    Therefore, <strong>0.0250 kg = 25.0 g</strong>.
                `
            },

            knowledgeCheck: {
                question:
                    "How many grams are equivalent to 0.500 kg?",

                options: [
                    "0.0500 g",
                    "5.00 g",
                    "50.0 g",
                    "500 g"
                ],

                answer: 3,

                explanation:
                    "Since 1 kg = 1000 g, 0.500 kg × 1000 g/kg = 500 g."
            }
        },


        /* -------------------------------------------------
           LESSON 10
           ------------------------------------------------- */

        {
            id: "reading-scientific-data",

            title: "Reading Scientific Data",

            type: "data-analysis",

            duration: 12,

            objectives: [
                "Identify important information in scientific data.",
                "Distinguish variables and units.",
                "Interpret tables of experimental measurements.",
                "Recognize trends and unusual values."
            ],

            content: `
                <p>
                    Chemistry produces data in many forms, including tables,
                    graphs, instrument displays, spectra, and recorded
                    observations.
                </p>

                <p>
                    Before interpreting data, first identify
                    <strong>what was measured</strong>, <strong>the units</strong>,
                    and <strong>the conditions</strong> under which the
                    measurements were obtained.
                </p>

                <div class="lesson-table-wrapper">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>Trial</th>
                                <th>Temperature (°C)</th>
                                <th>Mass (g)</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>24.8</td>
                                <td>5.02</td>
                            </tr>

                            <tr>
                                <td>2</td>
                                <td>25.0</td>
                                <td>5.01</td>
                            </tr>

                            <tr>
                                <td>3</td>
                                <td>25.1</td>
                                <td>5.03</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    From this table, we can see that the temperature varies
                    slightly between trials while the measured mass remains
                    close to 5.02 g.
                </p>

                <p>
                    When interpreting scientific data, avoid making claims that
                    are not supported by the measurements. A small difference
                    may simply represent normal experimental variation.
                </p>

                <div class="lesson-callout">
                    <strong>Scientific habit:</strong>
                    Separate what the data directly show from explanations or
                    hypotheses about why the data look that way.
                </div>

                <p>
                    Good data analysis considers numerical patterns,
                    uncertainties, units, experimental conditions, and possible
                    sources of variation.
                </p>
            `,

            keyPoints: [
                "Always identify the measured quantity and its unit.",
                "Check the experimental conditions before interpreting results.",
                "Look for trends and repeated patterns.",
                "Consider variation and uncertainty.",
                "Do not claim more than the data support."
            ],

            workedExample: {
                question:
                    "Three mass measurements are 4.98 g, 5.01 g, and 5.00 g. What general observation can be made?",

                solution: `
                    The three measurements are close to one another,
                    indicating that the measurements show relatively little
                    variation.
                `
            },

            knowledgeCheck: {
                question:
                    "What should you identify first when reading a scientific data table?",

                options: [
                    "The colour of the table",
                    "The measured quantities and their units",
                    "The name of the student",
                    "The largest number only"
                ],

                answer: 1,

                explanation:
                    "Understanding what was measured and the units used is essential before interpreting scientific data."
            }
        }

    ]

};
   
   "atomic-structure-periodic-table": [

    /* =====================================================
       LESSON 1
       ===================================================== */

    {
        id: "introduction-to-atomic-structure",
        title: "Introduction to Atomic Structure",
        type: "concept",
        duration: 10,

        objectives: [
            "Explain what an atom is.",
            "Describe the basic structure of an atom.",
            "Distinguish between the nucleus and the electron cloud.",
            "Explain why atomic structure is important in chemistry."
        ],

        content: `
            <p>
                Matter is made of particles, and one of the fundamental
                particles used to describe ordinary matter is the
                <strong>atom</strong>.
            </p>

            <p>
                An atom is the smallest unit of an element that retains
                the chemical identity of that element.
            </p>

            <p>
                Modern atomic structure consists of a small,
                dense <strong>nucleus</strong> surrounded by a region
                occupied by electrons.
            </p>

            <h4>The nucleus</h4>

            <p>
                The nucleus contains positively charged
                <strong>protons</strong> and electrically neutral
                <strong>neutrons</strong>.
            </p>

            <p>
                Almost all of an atom's mass is concentrated in its
                nucleus.
            </p>

            <h4>The electron region</h4>

            <p>
                Electrons are negatively charged particles associated
                with regions around the nucleus. They occupy
                <strong>atomic orbitals</strong>, which describe regions
                where electrons are likely to be found.
            </p>

            <div class="academy-callout">
                <strong>Key idea:</strong>
                Chemical behavior is strongly influenced by the
                arrangement of electrons, especially the outermost
                electrons.
            </div>
        `,

        keyPoints: [
            "Atoms are fundamental units of elements.",
            "The nucleus contains protons and neutrons.",
            "Electrons occupy regions around the nucleus.",
            "Most atomic mass is concentrated in the nucleus.",
            "Electron arrangement strongly influences chemical behavior."
        ],

        workedExample: {
            question:
                "Which part of an atom contains protons and neutrons?",

            steps: [
                "Identify the two particles mentioned.",
                "Both protons and neutrons are located in the nucleus.",
                "Therefore, the answer is the nucleus."
            ],

            answer: "The nucleus."
        },

        knowledgeCheck: {
            question:
                "Which statement correctly describes the nucleus of an atom?",

            options: [
                "It contains only electrons.",
                "It contains protons and neutrons.",
                "It contains only neutrons.",
                "It contains negatively charged particles."
            ],

            answer: 1,

            explanation:
                "The nucleus contains positively charged protons and neutral neutrons."
        }
    },


    /* =====================================================
       LESSON 2
       ===================================================== */

    {
        id: "subatomic-particles",
        title: "Subatomic Particles",
        type: "concept",
        duration: 12,

        objectives: [
            "Identify the three major subatomic particles.",
            "Compare their charges and relative masses.",
            "Locate each particle within an atom.",
            "Explain why electrons contribute little to atomic mass."
        ],

        content: `
            <p>
                The three major subatomic particles used to describe
                atoms are <strong>protons</strong>,
                <strong>neutrons</strong>, and <strong>electrons</strong>.
            </p>

            <table class="academy-table">
                <thead>
                    <tr>
                        <th>Particle</th>
                        <th>Charge</th>
                        <th>Relative mass</th>
                        <th>Location</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Proton</td>
                        <td>+1</td>
                        <td>≈ 1</td>
                        <td>Nucleus</td>
                    </tr>

                    <tr>
                        <td>Neutron</td>
                        <td>0</td>
                        <td>≈ 1</td>
                        <td>Nucleus</td>
                    </tr>

                    <tr>
                        <td>Electron</td>
                        <td>−1</td>
                        <td>≈ 1/1836</td>
                        <td>Electron region</td>
                    </tr>
                </tbody>
            </table>

            <p>
                Protons and electrons have equal-sized opposite
                charges. A neutral atom therefore contains equal
                numbers of protons and electrons.
            </p>

            <p>
                Neutrons have no net electrical charge. Changing the
                number of neutrons produces different isotopes of the
                same element.
            </p>

            <div class="academy-callout">
                <strong>Remember:</strong>
                The number of protons determines which element an atom is.
            </div>
        `,

        keyPoints: [
            "Protons have a +1 charge.",
            "Neutrons have no charge.",
            "Electrons have a −1 charge.",
            "Protons and neutrons are in the nucleus.",
            "The proton number identifies the element."
        ],

        workedExample: {
            question:
                "An atom contains 11 protons and 11 electrons. What is its net charge?",

            steps: [
                "Each proton contributes +1.",
                "Each electron contributes −1.",
                "Total charge = +11 − 11.",
                "Therefore, the net charge is zero."
            ],

            answer: "The atom is electrically neutral."
        },

        knowledgeCheck: {
            question:
                "Which subatomic particle determines the identity of an element?",

            options: [
                "Electron",
                "Neutron",
                "Proton",
                "Orbital"
            ],

            answer: 2,

            explanation:
                "The number of protons is the atomic number and uniquely identifies the element."
        }
    },


    /* =====================================================
       LESSON 3
       ===================================================== */

    {
        id: "atomic-number-and-mass-number",
        title: "Atomic Number and Mass Number",
        type: "concept",
        duration: 12,

        objectives: [
            "Define atomic number.",
            "Define mass number.",
            "Calculate numbers of protons, neutrons, and electrons.",
            "Interpret nuclear notation."
        ],

        content: `
            <p>
                The <strong>atomic number (Z)</strong> is the number
                of protons in the nucleus of an atom.
            </p>

            <p>
                The atomic number identifies the element.
            </p>

            <p>
                The <strong>mass number (A)</strong> is the total number
                of protons and neutrons:
            </p>

            <div class="academy-equation">
                A = Z + N
            </div>

            <p>where:</p>

            <ul>
                <li><strong>A</strong> = mass number</li>
                <li><strong>Z</strong> = number of protons</li>
                <li><strong>N</strong> = number of neutrons</li>
            </ul>

            <p>
                Therefore:
            </p>

            <div class="academy-equation">
                N = A − Z
            </div>

            <p>
                For a neutral atom, the number of electrons equals the
                number of protons.
            </p>
        `,

        keyPoints: [
            "Atomic number = number of protons.",
            "Mass number = protons + neutrons.",
            "Neutrons = mass number − atomic number.",
            "Neutral atoms have equal numbers of protons and electrons."
        ],

        workedExample: {
            question:
                "An atom has atomic number 17 and mass number 35. How many protons, neutrons, and electrons does a neutral atom contain?",

            steps: [
                "Protons = atomic number = 17.",
                "Neutrons = 35 − 17 = 18.",
                "Because the atom is neutral, electrons = 17."
            ],

            answer:
                "17 protons, 18 neutrons, and 17 electrons."
        },

        knowledgeCheck: {
            question:
                "An atom has mass number 23 and atomic number 11. How many neutrons does it have?",

            options: [
                "11",
                "12",
                "23",
                "34"
            ],

            answer: 1,

            explanation:
                "Neutrons = mass number − atomic number = 23 − 11 = 12."
        }
    },


    /* =====================================================
       LESSON 4
       ===================================================== */

    {
        id: "isotopes-and-relative-atomic-mass",
        title: "Isotopes and Relative Atomic Mass",
        type: "concept",
        duration: 14,

        objectives: [
            "Define isotopes.",
            "Explain why isotopes are atoms of the same element.",
            "Distinguish isotopes by their neutron numbers.",
            "Calculate a weighted average relative atomic mass."
        ],

        content: `
            <p>
                <strong>Isotopes</strong> are atoms of the same element
                that have the same number of protons but different
                numbers of neutrons.
            </p>

            <p>
                Because they have the same number of protons, isotopes
                have the same atomic number.
            </p>

            <p>
                Their different neutron numbers give them different
                mass numbers.
            </p>

            <div class="academy-callout">
                <strong>Example:</strong>
                Carbon-12 and Carbon-14 are both carbon because each
                contains 6 protons. They differ in neutron number.
            </div>

            <h4>Relative atomic mass</h4>

            <p>
                The relative atomic mass of an element accounts for the
                naturally occurring isotopes and their relative
                abundances.
            </p>

            <div class="academy-equation">
                Relative atomic mass =
                Σ(isotope mass × fractional abundance)
            </div>

            <p>
                This is a weighted average rather than a simple average.
            </p>
        `,

        keyPoints: [
            "Isotopes have the same proton number.",
            "Isotopes have different neutron numbers.",
            "Different isotopes have different mass numbers.",
            "Relative atomic mass is a weighted average."
        ],

        workedExample: {
            question:
                "An element has two isotopes: isotope X has mass 10 and abundance 20%, while isotope Y has mass 11 and abundance 80%. Find its relative atomic mass.",

            steps: [
                "Convert percentages to fractions: 0.20 and 0.80.",
                "Calculate 10 × 0.20 = 2.0.",
                "Calculate 11 × 0.80 = 8.8.",
                "Add the contributions: 2.0 + 8.8 = 10.8."
            ],

            answer: "Relative atomic mass = 10.8."
        },

        knowledgeCheck: {
            question:
                "What must be different between two isotopes of the same element?",

            options: [
                "Number of protons",
                "Number of neutrons",
                "Atomic number",
                "Element identity"
            ],

            answer: 1,

            explanation:
                "Isotopes have the same number of protons but different numbers of neutrons."
        }
    },


    /* =====================================================
       LESSON 5
       ===================================================== */

    {
        id: "electron-configuration",
        title: "Electron Configuration",
        type: "concept",
        duration: 16,

        objectives: [
            "Explain the meaning of electron configuration.",
            "Describe the main electron subshells.",
            "Apply the basic rules for filling electrons.",
            "Write simple electron configurations."
        ],

        content: `
            <p>
                An atom's <strong>electron configuration</strong>
                describes how its electrons are distributed among
                atomic orbitals.
            </p>

            <p>
                Electrons occupy energy levels and subshells.
                The commonly encountered subshells are:
            </p>

            <ul>
                <li>s</li>
                <li>p</li>
                <li>d</li>
                <li>f</li>
            </ul>

            <p>
                Their maximum electron capacities are:
            </p>

            <table class="academy-table">
                <thead>
                    <tr>
                        <th>Subshell</th>
                        <th>Maximum electrons</th>
                    </tr>
                </thead>

                <tbody>
                    <tr><td>s</td><td>2</td></tr>
                    <tr><td>p</td><td>6</td></tr>
                    <tr><td>d</td><td>10</td></tr>
                    <tr><td>f</td><td>14</td></tr>
                </tbody>
            </table>

            <p>
                In the ground state, electrons generally occupy
                available orbitals in order of increasing energy.
            </p>

            <p>
                For example, hydrogen has one electron:
            </p>

            <div class="academy-equation">
                1s¹
            </div>

            <p>
                Helium has two:
            </p>

            <div class="academy-equation">
                1s²
            </div>

            <p>
                A neutral carbon atom contains six electrons:
            </p>

            <div class="academy-equation">
                1s² 2s² 2p²
            </div>
        `,

        keyPoints: [
            "Electron configuration describes electron distribution.",
            "s, p, d and f are major subshell types.",
            "s holds 2 electrons.",
            "p holds 6 electrons.",
            "d holds 10 electrons.",
            "f holds 14 electrons."
        ],

        workedExample: {
            question:
                "Write the electron configuration of oxygen, which has atomic number 8.",

            steps: [
                "A neutral oxygen atom has 8 electrons.",
                "Place 2 electrons in 1s.",
                "Place 2 electrons in 2s.",
                "The remaining 4 electrons occupy 2p."
            ],

            answer: "1s² 2s² 2p⁴."
        },

        knowledgeCheck: {
            question:
                "What is the maximum number of electrons in a p subshell?",

            options: [
                "2",
                "4",
                "6",
                "10"
            ],

            answer: 2,

            explanation:
                "A p subshell contains three orbitals, each capable of holding two electrons, for a total of six."
        }
    },


    /* =====================================================
       LESSON 6
       ===================================================== */

    {
        id: "orbitals-and-quantum-numbers",
        title: "Orbitals and Quantum Numbers",
        type: "concept",
        duration: 16,

        objectives: [
            "Define an atomic orbital.",
            "Describe the shapes of s and p orbitals.",
            "Identify the four quantum numbers.",
            "Explain what quantum numbers tell us about electrons."
        ],

        content: `
            <p>
                An <strong>atomic orbital</strong> is a mathematical
                description of a region around the nucleus where an
                electron has a high probability of being found.
            </p>

            <p>
                An orbital is not a fixed circular path followed by an
                electron.
            </p>

            <h4>Quantum numbers</h4>

            <p>
                Four quantum numbers are used to describe the state of
                an electron:
            </p>

            <ul>
                <li><strong>n</strong> — principal quantum number</li>
                <li><strong>l</strong> — angular momentum quantum number</li>
                <li><strong>mₗ</strong> — magnetic quantum number</li>
                <li><strong>mₛ</strong> — spin quantum number</li>
            </ul>

            <p>
                The principal quantum number identifies the main energy
                level.
            </p>

            <p>
                The angular momentum quantum number identifies the
                subshell type.
            </p>

            <p>
                The magnetic quantum number identifies the orientation
                of an orbital within a subshell.
            </p>

            <p>
                The spin quantum number describes one of two allowed
                electron spin states.
            </p>

            <div class="academy-callout">
                Quantum numbers provide a precise way to describe
                electron states in atoms.
            </div>
        `,

        keyPoints: [
            "Orbitals describe probable electron locations.",
            "Orbitals are not classical circular electron paths.",
            "Four quantum numbers describe an electron state.",
            "The principal quantum number identifies the main energy level.",
            "The spin quantum number has two allowed values."
        ],

        workedExample: {
            question:
                "Which quantum number identifies the principal energy level of an electron?",

            steps: [
                "Identify the quantum number associated with the main energy level.",
                "This is the principal quantum number.",
                "It is represented by n."
            ],

            answer: "The principal quantum number, n."
        },

        knowledgeCheck: {
            question:
                "Which quantum number describes electron spin?",

            options: [
                "n",
                "l",
                "mₗ",
                "mₛ"
            ],

            answer: 3,

            explanation:
                "The spin quantum number is represented by mₛ."
        }
    },


    /* =====================================================
       LESSON 7
       ===================================================== */

    {
        id: "electron-arrangement-and-ions",
        title: "Electron Arrangement and Ions",
        type: "concept",
        duration: 14,

        objectives: [
            "Explain how ions form.",
            "Distinguish cations from anions.",
            "Relate electron loss or gain to charge.",
            "Write simple electron arrangements for ions."
        ],

        content: `
            <p>
                An <strong>ion</strong> is an atom or group of atoms
                with a net electrical charge.
            </p>

            <h4>Cations</h4>

            <p>
                A positively charged ion is called a
                <strong>cation</strong>. It forms when an atom loses
                one or more electrons.
            </p>

            <h4>Anions</h4>

            <p>
                A negatively charged ion is called an
                <strong>anion</strong>. It forms when an atom gains
                one or more electrons.
            </p>

            <p>
                The number of protons does not change when an ordinary
                ion forms. The charge changes because the number of
                electrons changes.
            </p>

            <div class="academy-callout">
                <strong>Example:</strong>
                A sodium atom has 11 protons and 11 electrons.
                Na⁺ has 11 protons but 10 electrons.
            </div>
        `,

        keyPoints: [
            "Cations are positively charged.",
            "Anions are negatively charged.",
            "Cations form by electron loss.",
            "Anions form by electron gain.",
            "Ion formation changes electron number, not proton number."
        ],

        workedExample: {
            question:
                "How many electrons are present in Mg²⁺ if magnesium has atomic number 12?",

            steps: [
                "Neutral magnesium has 12 electrons.",
                "A 2+ charge means two electrons have been removed.",
                "12 − 2 = 10."
            ],

            answer: "Mg²⁺ contains 10 electrons."
        },

        knowledgeCheck: {
            question:
                "What happens when an atom forms a 1− ion?",

            options: [
                "It loses one electron.",
                "It gains one electron.",
                "It loses one proton.",
                "It gains one proton."
            ],

            answer: 1,

            explanation:
                "A 1− ion has one more electron than the neutral atom."
        }
    },


    /* =====================================================
       LESSON 8
       ===================================================== */

    {
        id: "the-periodic-table",
        title: "The Periodic Table",
        type: "concept",
        duration: 14,

        objectives: [
            "Explain how elements are arranged in the periodic table.",
            "Distinguish periods from groups.",
            "Identify metals, nonmetals, and metalloids.",
            "Relate electron configuration to periodic-table position."
        ],

        content: `
            <p>
                The modern periodic table arranges elements in order of
                increasing <strong>atomic number</strong>.
            </p>

            <h4>Periods</h4>

            <p>
                Horizontal rows are called <strong>periods</strong>.
                Elements in the same period have electrons occupying
                the same principal energy-level range.
            </p>

            <h4>Groups</h4>

            <p>
                Vertical columns are called <strong>groups</strong>.
                Elements within a group often have related chemical
                behavior because of similarities in their outer-electron
                arrangements.
            </p>

            <p>
                Important regions include:
            </p>

            <ul>
                <li>alkali metals</li>
                <li>alkaline earth metals</li>
                <li>transition metals</li>
                <li>halogens</li>
                <li>noble gases</li>
                <li>lanthanides</li>
                <li>actinides</li>
            </ul>
        `,

        keyPoints: [
            "Elements are arranged by increasing atomic number.",
            "Rows are periods.",
            "Columns are groups.",
            "Elements in the same group often have similar chemical behavior.",
            "The periodic table contains metals, nonmetals, and metalloids."
        ],

        workedExample: {
            question:
                "What is the difference between a group and a period?",

            steps: [
                "Look at the direction of arrangement.",
                "A group is a vertical column.",
                "A period is a horizontal row."
            ],

            answer:
                "A group is a vertical column; a period is a horizontal row."
        },

        knowledgeCheck: {
            question:
                "What property is used to arrange elements in the modern periodic table?",

            options: [
                "Atomic mass only",
                "Density",
                "Atomic number",
                "Melting point"
            ],

            answer: 2,

            explanation:
                "Elements are arranged in increasing atomic number."
        }
    },


    /* =====================================================
       LESSON 9
       ===================================================== */

    {
        id: "atomic-radius",
        title: "Atomic Radius",
        type: "concept",
        duration: 12,

        objectives: [
            "Define atomic radius.",
            "Describe its general trend across a period.",
            "Describe its general trend down a group.",
            "Explain the trends using effective nuclear attraction and energy levels."
        ],

        content: `
            <p>
                Atomic radius is a measure used to describe the size of
                an atom.
            </p>

            <h4>Across a period</h4>

            <p>
                Atomic radius generally <strong>decreases</strong> from
                left to right across a period.
            </p>

            <p>
                As atomic number increases, the nucleus gains positive
                charge while electrons are added to the same principal
                energy-level region. The increased effective attraction
                tends to pull the electron cloud closer to the nucleus.
            </p>

            <h4>Down a group</h4>

            <p>
                Atomic radius generally <strong>increases</strong>
                down a group because additional occupied energy levels
                are introduced.
            </p>

            <div class="academy-callout">
                General trend:
                <strong>larger down a group, smaller across a period.</strong>
            </div>
        `,

        keyPoints: [
            "Atomic radius measures atomic size.",
            "Radius generally decreases across a period.",
            "Radius generally increases down a group.",
            "Additional energy levels increase size.",
            "Effective nuclear attraction influences size."
        ],

        workedExample: {
            question:
                "Which generally has the larger atomic radius: sodium or chlorine?",

            steps: [
                "Sodium and chlorine are in the same period.",
                "Atomic radius generally decreases from left to right.",
                "Sodium is to the left of chlorine."
            ],

            answer: "Sodium generally has the larger atomic radius."
        },

        knowledgeCheck: {
            question:
                "What generally happens to atomic radius down a group?",

            options: [
                "It decreases.",
                "It remains exactly constant.",
                "It increases.",
                "It becomes zero."
            ],

            answer: 2,

            explanation:
                "Additional occupied energy levels are added down a group, increasing atomic size."
        }
    },


    /* =====================================================
       LESSON 10
       ===================================================== */

    {
        id: "ionization-energy",
        title: "Ionization Energy",
        type: "concept",
        duration: 14,

        objectives: [
            "Define first ionization energy.",
            "Describe its general periodic trend.",
            "Explain the effect of atomic size and nuclear attraction.",
            "Recognize that periodic trends can contain exceptions."
        ],

        content: `
            <p>
                The <strong>first ionization energy</strong> is the
                energy required to remove one electron from each atom
                in one mole of gaseous atoms to form one mole of gaseous
                1+ ions.
            </p>

            <p>
                In general, first ionization energy tends to
                <strong>increase across a period</strong>.
            </p>

            <p>
                This is associated with increasing effective nuclear
                attraction for the outer electron.
            </p>

            <p>
                It generally <strong>decreases down a group</strong>
                because the outer electron is farther from the nucleus
                and more strongly shielded by inner electrons.
            </p>

            <div class="academy-callout">
                High ionization energy means that removing an electron
                requires relatively more energy.
            </div>
        `,

        keyPoints: [
            "Ionization energy measures the energy needed to remove an electron.",
            "It generally increases across a period.",
            "It generally decreases down a group.",
            "Distance from the nucleus and shielding affect ionization energy.",
            "Real periodic data contain some notable exceptions."
        ],

        workedExample: {
            question:
                "Which generally has the higher first ionization energy: magnesium or sodium?",

            steps: [
                "Both elements are in period 3.",
                "Ionization energy generally increases across a period.",
                "Magnesium lies to the right of sodium."
            ],

            answer:
                "Magnesium generally has the higher first ionization energy."
        },

        knowledgeCheck: {
            question:
                "Which trend is generally correct for first ionization energy?",

            options: [
                "Decreases across a period and increases down a group.",
                "Increases across a period and decreases down a group.",
                "Always remains constant.",
                "Only changes with atomic mass."
            ],

            answer: 1,

            explanation:
                "First ionization energy generally increases across periods and decreases down groups."
        }
    },


    /* =====================================================
       LESSON 11
       ===================================================== */

    {
        id: "electronegativity-and-electron-affinity",
        title: "Electronegativity and Electron Affinity",
        type: "concept",
        duration: 14,

        objectives: [
            "Define electronegativity.",
            "Explain electron affinity at an introductory level.",
            "Distinguish electronegativity from ionization energy.",
            "Describe general periodic trends."
        ],

        content: `
            <p>
                <strong>Electronegativity</strong> describes the ability
                of an atom in a chemical bond to attract shared
                electrons toward itself.
            </p>

            <p>
                Electronegativity generally increases across a period
                and decreases down a group.
            </p>

            <p>
                Fluorine is commonly assigned the highest
                electronegativity on the Pauling scale.
            </p>

            <h4>Electron affinity</h4>

            <p>
                Electron affinity concerns the energy change associated
                with adding an electron to a gaseous atom.
            </p>

            <p>
                Electron affinity and electronegativity are related to
                an atom's attraction for electrons, but they are not the
                same quantity.
            </p>

            <div class="academy-callout">
                <strong>Important distinction:</strong>
                Electronegativity describes attraction for shared
                electrons in a bond, while electron affinity describes
                an energy change associated with adding an electron to
                an isolated gaseous atom.
            </div>
        `,

        keyPoints: [
            "Electronegativity describes attraction for bonding electrons.",
            "Electronegativity generally increases across a period.",
            "Electronegativity generally decreases down a group.",
            "Electron affinity concerns adding an electron to a gaseous atom.",
            "The two concepts are related but not identical."
        ],

        workedExample: {
            question:
                "Why is fluorine strongly electronegative?",

            steps: [
                "Fluorine is small compared with many other atoms.",
                "Its bonding electrons experience strong attraction from the nucleus.",
                "It therefore strongly attracts shared electrons."
            ],

            answer:
                "Its small atomic size and strong effective nuclear attraction give it a strong attraction for shared electrons."
        },

        knowledgeCheck: {
            question:
                "Electronegativity describes an atom's ability to attract:",

            options: [
                "Neutrons in the nucleus",
                "Shared bonding electrons",
                "Only its own protons",
                "Atomic nuclei from outside the atom"
            ],

            answer: 1,

            explanation:
                "Electronegativity describes attraction for shared electrons in a chemical bond."
        }
    },


    /* =====================================================
       LESSON 12
       ===================================================== */

    {
        id: "understanding-periodic-trends",
        title: "Understanding Periodic Trends",
        type: "concept",
        duration: 16,

        objectives: [
            "Compare major periodic trends.",
            "Explain trends using nuclear charge, shielding, and energy levels.",
            "Predict relative atomic properties using periodic position.",
            "Apply periodic trends to chemical reasoning."
        ],

        content: `
            <p>
                Periodic trends allow chemists to predict how atomic
                properties change according to position in the periodic
                table.
            </p>

            <table class="academy-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Across a period</th>
                        <th>Down a group</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Atomic radius</td>
                        <td>Generally decreases</td>
                        <td>Generally increases</td>
                    </tr>

                    <tr>
                        <td>First ionization energy</td>
                        <td>Generally increases</td>
                        <td>Generally decreases</td>
                    </tr>

                    <tr>
                        <td>Electronegativity</td>
                        <td>Generally increases</td>
                        <td>Generally decreases</td>
                    </tr>
                </tbody>
            </table>

            <h4>Why do these trends occur?</h4>

            <p>
                Three major ideas are especially important:
            </p>

            <ul>
                <li><strong>Nuclear charge</strong> — the positive charge of the nucleus.</li>
                <li><strong>Shielding</strong> — reduction in nuclear attraction caused by inner electrons.</li>
                <li><strong>Energy levels</strong> — additional occupied levels place outer electrons farther from the nucleus.</li>
            </ul>

            <p>
                These factors work together to determine how strongly
                electrons are attracted to the nucleus.
            </p>

            <div class="academy-callout">
                <strong>Scientific reasoning:</strong>
                Do not memorize trends without understanding them.
                Use nuclear charge, shielding, distance, and electron
                arrangement to explain the observed pattern.
            </div>
        `,

        keyPoints: [
            "Atomic radius generally decreases across a period.",
            "Atomic radius generally increases down a group.",
            "Ionization energy generally increases across a period.",
            "Ionization energy generally decreases down a group.",
            "Electronegativity generally increases across a period.",
            "Shielding and distance influence attraction to the nucleus."
        ],

        workedExample: {
            question:
                "Which element would generally have the stronger attraction for bonding electrons: sodium or chlorine?",

            steps: [
                "Sodium and chlorine are in the same period.",
                "Electronegativity generally increases from left to right.",
                "Chlorine is farther to the right.",
                "Therefore chlorine generally has the stronger attraction for shared electrons."
            ],

            answer: "Chlorine."
        },

        knowledgeCheck: {
            question:
                "Which combination best explains why atomic radius generally increases down a group?",

            options: [
                "Fewer energy levels and less shielding",
                "More occupied energy levels and greater shielding",
                "Lower atomic number only",
                "Fewer electrons in every atom"
            ],

            answer: 1,

            explanation:
                "Atoms gain additional occupied energy levels down a group, and increased shielding contributes to a larger atomic radius."
        }
    }

]

    /* =====================================================
       HELPERS
       ===================================================== */

    function getElement(selector) {
        return document.querySelector(selector);
    }

    function getAll(selector) {
        return Array.from(document.querySelectorAll(selector));
    }

    function escapeHTML(value) {
        const div = document.createElement("div");
        div.textContent = value ?? "";
        return div.innerHTML;
    }

    function getSubject(subjectId) {
        return STATE.subjects.find(subject => subject.id === subjectId) || null;
    }

    function getTopic(subjectId, topicId) {
        const subject = getSubject(subjectId);

        if (!subject) {
            return null;
        }

        return subject.topics.find(topic => topic.id === topicId) || null;
    }

    function getLessons(subjectId, topicId) {
        const topic = getTopic(subjectId, topicId);

        if (!topic) {
            return [];
        }

        return topic.lessons.map(id => ({
            id,
            content: LESSON_CONTENT[id] || null
        }));
    }

    function getTopicStorageKey(subjectId, topicId) {
        return `${STORAGE.topicProgress}${subjectId}_${topicId}`;
    }

    function getLessonStorageKey(subjectId, topicId, index) {
        return `${STORAGE.lessonCompleted}${subjectId}_${topicId}_${index}`;
    }

    function getTopicProgress(subjectId, topicId) {
        const value = Number(
            localStorage.getItem(
                getTopicStorageKey(subjectId, topicId)
            )
        );

        return Number.isFinite(value)
            ? Math.max(0, Math.min(100, value))
            : 0;
    }

    function setTopicProgress(subjectId, topicId, progress) {
        const safeProgress = Math.max(
            0,
            Math.min(100, Math.round(progress))
        );

        localStorage.setItem(
            getTopicStorageKey(subjectId, topicId),
            String(safeProgress)
        );

        document.dispatchEvent(
            new CustomEvent("chemlab:topic-progress-updated", {
                detail: {
                    subjectId,
                    topicId,
                    progress: safeProgress
                }
            })
        );
    }

    function isLessonCompleted(subjectId, topicId, index) {
        return (
            localStorage.getItem(
                getLessonStorageKey(subjectId, topicId, index)
            ) === "true"
        );
    }

    function addScienceXP(amount) {
        if (
            window.CHEMLAB_DASHBOARD &&
            typeof window.CHEMLAB_DASHBOARD.addXP === "function"
        ) {
            window.CHEMLAB_DASHBOARD.addXP(amount);
        }
    }


    /* =====================================================
       LESSON PROGRESS
       ===================================================== */

    function calculateTopicProgress(subjectId, topicId) {
        const lessons = getLessons(subjectId, topicId);

        if (!lessons.length) {
            return 0;
        }

        const completed = lessons.filter(
            (_, index) =>
                isLessonCompleted(
                    subjectId,
                    topicId,
                    index
                )
        ).length;

        return Math.round(
            (completed / lessons.length) * 100
        );
    }


    /* =====================================================
       MARK LESSON COMPLETE
       ===================================================== */

    function markLessonCompleted(
        subjectId,
        topicId,
        index
    ) {

        const key = getLessonStorageKey(
            subjectId,
            topicId,
            index
        );

        if (localStorage.getItem(key) === "true") {
            return;
        }

        localStorage.setItem(key, "true");

        addScienceXP(10);

        const progress = calculateTopicProgress(
            subjectId,
            topicId
        );

        setTopicProgress(
            subjectId,
            topicId,
            progress
        );

        document.dispatchEvent(
            new CustomEvent("chemlab:lesson-completed", {
                detail: {
                    subjectId,
                    topicId,
                    lessonIndex: index,
                    progress
                }
            })
        );
    }


    /* =====================================================
       KNOWLEDGE CHECK
       ===================================================== */

    function renderKnowledgeCheck(lesson) {

        if (
            !lesson ||
            !lesson.knowledgeCheck
        ) {
            return "";
        }

        const check = lesson.knowledgeCheck;

        return `
            <section class="academy-knowledge-check">

                <div class="academy-lesson-block-header">
                    <span class="academy-lesson-block-icon">
                        📝
                    </span>

                    <div>
                        <h3>Knowledge Check</h3>
                        <p>Test your understanding.</p>
                    </div>
                </div>

                <div class="academy-check-question">
                    ${check.question}
                </div>

                <div class="academy-check-options">

                    ${check.options.map((option, index) => `
                        <button
                            type="button"
                            class="academy-check-option"
                            data-answer-index="${index}"
                        >
                            <span class="academy-check-letter">
                                ${String.fromCharCode(65 + index)}
                            </span>

                            <span>
                                ${option}
                            </span>
                        </button>
                    `).join("")}

                </div>

                <div
                    class="academy-check-feedback"
                    id="academyCheckFeedback"
                    hidden
                ></div>

            </section>
        `;
    }


    /* =====================================================
       BIND KNOWLEDGE CHECK
       ===================================================== */

    function bindKnowledgeCheck(lesson) {

        if (
            !lesson ||
            !lesson.knowledgeCheck
        ) {
            return;
        }

        const buttons = getAll(
            ".academy-check-option"
        );

        const feedback = getElement(
            "#academyCheckFeedback"
        );

        buttons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    if (
                        button.dataset.answered === "true"
                    ) {
                        return;
                    }

                    button.dataset.answered = "true";

                    const selected =
                        Number(
                            button.dataset.answerIndex
                        );

                    const correct =
                        lesson.knowledgeCheck.answer;

                    buttons.forEach(
                        item => {
                            item.disabled = true;
                        }
                    );

                    if (selected === correct) {

                        button.classList.add(
                            "is-correct"
                        );

                        feedback.hidden = false;

                        feedback.className =
                            "academy-check-feedback is-correct";

                        feedback.innerHTML = `
                            <strong>Correct.</strong>
                            ${lesson.knowledgeCheck.explanation}
                        `;

                        addScienceXP(5);

                    } else {

                        button.classList.add(
                            "is-incorrect"
                        );

                        buttons[correct]?.classList.add(
                            "is-correct"
                        );

                        feedback.hidden = false;

                        feedback.className =
                            "academy-check-feedback is-incorrect";

                        feedback.innerHTML = `
                            <strong>Review this concept.</strong>
                            ${lesson.knowledgeCheck.explanation}
                        `;
                    }
                }
            );
        });
    }


    /* =====================================================
       LESSON VIEW
       ===================================================== */

    function openLesson(
        subjectId,
        topicId,
        lessonIndex = 0
    ) {

        const subject =
            getSubject(subjectId);

        const topic =
            getTopic(
                subjectId,
                topicId
            );

        if (!subject || !topic) {
            return;
        }

        const lessons =
            getLessons(
                subjectId,
                topicId
            );

        if (!lessons.length) {
            return;
        }

        const safeIndex = Math.max(
            0,
            Math.min(
                lessonIndex,
                lessons.length - 1
            )
        );

        STATE.view = "lesson";
        STATE.currentSubject = subject;
        STATE.currentTopic = topic;
        STATE.currentLessonIndex = safeIndex;

        renderLesson();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-lesson-opened",
                {
                    detail: {
                        subjectId,
                        topicId,
                        lessonIndex: safeIndex
                    }
                }
            )
        );
    }


    /* =====================================================
       RENDER LESSON
       ===================================================== */

    function renderLesson() {

        const container =
            getElement("#academyLessonContainer");

        if (!container) {
            return;
        }

        const subject =
            STATE.currentSubject;

        const topic =
            STATE.currentTopic;

        if (!subject || !topic) {
            return;
        }

        const lessons =
            getLessons(
                subject.id,
                topic.id
            );

        const current =
            lessons[
                STATE.currentLessonIndex
            ];

        if (!current || !current.content) {

            container.innerHTML = `
                <div class="academy-empty-state">

                    <div class="academy-empty-state-icon">
                        📚
                    </div>

                    <h2>Lesson content is being prepared</h2>

                    <p>
                        This topic is already part of the ChemLab
                        curriculum. Detailed lesson content will be
                        added in the next content release.
                    </p>

                    <button
                        type="button"
                        class="button button-secondary"
                        id="academyBackToTopic"
                    >
                        Back to Topic
                    </button>

                </div>
            `;

            container.hidden = false;

            getElement("#academyBackToTopic")
                ?.addEventListener(
                    "click",
                    () => {
                        openTopic(
                            subject.id,
                            topic.id
                        );
                    }
                );

            return;
        }

        const lesson =
            current.content;

        const progress =
            calculateTopicProgress(
                subject.id,
                topic.id
            );

        const completed =
            isLessonCompleted(
                subject.id,
                topic.id,
                STATE.currentLessonIndex
            );

        const atFirst =
            STATE.currentLessonIndex === 0;

        const atLast =
            STATE.currentLessonIndex ===
            lessons.length - 1;

        container.hidden = false;

        container.innerHTML = `

            <div class="academy-lesson-viewer">

                <div class="academy-lesson-top">

                    <button
                        type="button"
                        class="button button-ghost"
                        id="academyLessonBack"
                    >
                        ← Back to Topic
                    </button>

                    <span class="academy-lesson-position">
                        Lesson
                        ${STATE.currentLessonIndex + 1}
                        of
                        ${lessons.length}
                    </span>

                </div>


                <div class="academy-lesson-progress">

                    <div
                        class="academy-lesson-progress-bar"
                        style="width:${progress}%"
                    ></div>

                </div>


                <header class="academy-lesson-header">

                    <span class="academy-eyebrow">
                        ${escapeHTML(subject.title)}
                    </span>

                    <h1>
                        ${escapeHTML(lesson.title)}
                    </h1>

                    <p>
                        ${escapeHTML(topic.description)}
                    </p>

                </header>


                <div class="academy-lesson-body-grid">

                    <main class="academy-lesson-main">


                        <section class="academy-lesson-block academy-lesson-objectives">

                            <div class="academy-lesson-block-header">

                                <span class="academy-lesson-block-icon">
                                    🎯
                                </span>

                                <div>
                                    <h2>Learning Objectives</h2>

                                    <p>
                                        By the end of this lesson,
                                        you should be able to:
                                    </p>
                                </div>

                            </div>

                            <ul>

                                ${lesson.objectives
                                    .map(
                                        objective => `
                                            <li>
                                                ${escapeHTML(
                                                    objective
                                                )}
                                            </li>
                                        `
                                    )
                                    .join("")}

                            </ul>

                        </section>


                        <section class="academy-lesson-block">

                            <div class="academy-lesson-block-header">

                                <span class="academy-lesson-block-icon">
                                    📖
                                </span>

                                <div>
                                    <h2>Lesson</h2>
                                    <p>
                                        Core chemistry concepts
                                    </p>
                                </div>

                            </div>

                            <div class="academy-lesson-content">

                                ${lesson.content}

                            </div>

                        </section>


                        <section class="academy-lesson-block academy-key-points">

                            <div class="academy-lesson-block-header">

                                <span class="academy-lesson-block-icon">
                                    💡
                                </span>

                                <div>
                                    <h2>Key Points</h2>
                                    <p>
                                        Remember these ideas.
                                    </p>
                                </div>

                            </div>

                            <ul>

                                ${lesson.keyPoints
                                    .map(
                                        point => `
                                            <li>
                                                ${escapeHTML(point)}
                                            </li>
                                        `
                                    )
                                    .join("")}

                            </ul>

                        </section>


                        <section class="academy-lesson-block academy-worked-example">

                            <div class="academy-lesson-block-header">

                                <span class="academy-lesson-block-icon">
                                    🧮
                                </span>

                                <div>
                                    <h2>Worked Example</h2>
                                    <p>
                                        Follow the reasoning step by step.
                                    </p>
                                </div>

                            </div>

                            <div class="academy-example-question">

                                <strong>Problem</strong>

                                <p>
                                    ${lesson.workedExample.question}
                                </p>

                            </div>

                            <div class="academy-example-answer">

                                <strong>Solution</strong>

                                <p>
                                    ${lesson.workedExample.solution}
                                </p>

                            </div>

                        </section>


                        ${renderKnowledgeCheck(lesson)}


                        <footer class="academy-lesson-footer">

                            <div class="academy-lesson-navigation">

                                <button
                                    type="button"
                                    class="button button-secondary"
                                    id="academyPreviousLesson"
                                    ${atFirst ? "disabled" : ""}
                                >
                                    ← Previous
                                </button>


                                <button
                                    type="button"
                                    class="button button-primary"
                                    id="academyCompleteLesson"
                                    ${completed ? "disabled" : ""}
                                >
                                    ${completed
                                        ? "✓ Lesson Completed"
                                        : "Mark Lesson Complete"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="button button-primary"
                                    id="academyNextLesson"
                                    ${atLast ? "disabled" : ""}
                                >
                                    Next →
                                </button>

                            </div>

                        </footer>

                    </main>


                    <aside class="academy-lesson-sidebar">

                        <div class="academy-lesson-sidebar-card">

                            <div class="academy-sidebar-heading">

                                <span>
                                    Topic Progress
                                </span>

                                <strong>
                                    ${progress}%
                                </strong>

                            </div>

                            <div class="progress-bar">

                                <div
                                    class="progress-fill"
                                    style="width:${progress}%"
                                ></div>

                            </div>

                        </div>


                        <div class="academy-lesson-sidebar-card">

                            <h3>
                                ${escapeHTML(topic.title)}
                            </h3>

                            <div class="academy-lesson-list">

                                ${lessons
                                    .map(
                                        (item, index) => {

                                            const itemCompleted =
                                                isLessonCompleted(
                                                    subject.id,
                                                    topic.id,
                                                    index
                                                );

                                            const itemActive =
                                                index ===
                                                STATE.currentLessonIndex;

                                            const itemTitle =
                                                item.content
                                                    ?.title ||
                                                `Lesson ${index + 1}`;

                                            return `

                                                <button
                                                    type="button"
                                                    class="
                                                        academy-lesson-list-item
                                                        ${itemActive ? "is-active" : ""}
                                                        ${itemCompleted ? "is-completed" : ""}
                                                    "
                                                    data-lesson-index="${index}"
                                                >

                                                    <span class="academy-lesson-list-number">

                                                        ${
                                                            itemCompleted
                                                                ? "✓"
                                                                : index + 1
                                                        }

                                                    </span>

                                                    <span>
                                                        ${escapeHTML(
                                                            itemTitle
                                                        )}
                                                    </span>

                                                </button>

                                            `;
                                        }
                                    )
                                    .join("")}

                            </div>

                        </div>

                    </aside>

                </div>

            </div>
        `;


        /* ================================================
           EVENTS
           ================================================ */

        getElement("#academyLessonBack")
            ?.addEventListener(
                "click",
                () => {
                    openTopic(
                        subject.id,
                        topic.id
                    );
                }
            );


        getElement("#academyCompleteLesson")
            ?.addEventListener(
                "click",
                () => {

                    markLessonCompleted(
                        subject.id,
                        topic.id,
                        STATE.currentLessonIndex
                    );

                    renderLesson();
                }
            );


        getElement("#academyPreviousLesson")
            ?.addEventListener(
                "click",
                () => {

                    if (!atFirst) {

                        openLesson(
                            subject.id,
                            topic.id,
                            STATE.currentLessonIndex - 1
                        );
                    }
                }
            );


        getElement("#academyNextLesson")
            ?.addEventListener(
                "click",
                () => {

                    markLessonCompleted(
                        subject.id,
                        topic.id,
                        STATE.currentLessonIndex
                    );

                    if (!atLast) {

                        openLesson(
                            subject.id,
                            topic.id,
                            STATE.currentLessonIndex + 1
                        );

                    } else {

                        showTopicCompletion();
                    }
                }
            );


        getAll(
            ".academy-lesson-list-item"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openLesson(
                        subject.id,
                        topic.id,
                        Number(
                            button.dataset.lessonIndex
                        )
                    );
                }
            );

        });


        bindKnowledgeCheck(lesson);
    }


    /* =====================================================
       TOPIC VIEW
       ===================================================== */

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

        if (!subject || !topic) {
            return;
        }

        STATE.view = "topic";
        STATE.currentSubject = subject;
        STATE.currentTopic = topic;

        renderTopic();

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-topic-opened",
                {
                    detail: {
                        subjectId,
                        topicId
                    }
                }
            )
        );
    }


    function renderTopic() {

        const container =
            getElement("#academyTopicContainer");

        const lessonContainer =
            getElement("#academyLessonContainer");

        if (!container) {
            return;
        }

        lessonContainer &&
            (lessonContainer.hidden = true);

        const subject =
            STATE.currentSubject;

        const topic =
            STATE.currentTopic;

        const lessons =
            getLessons(
                subject.id,
                topic.id
            );

        const progress =
            calculateTopicProgress(
                subject.id,
                topic.id
            );

        container.hidden = false;

        container.innerHTML = `

            <div class="academy-topic-learning">

                <header class="academy-topic-learning-header">

                    <button
                        type="button"
                        class="button button-ghost"
                        id="academyTopicBack"
                    >
                        ← Back to Subject
                    </button>

                    <span class="academy-eyebrow">
                        ${escapeHTML(subject.title)}
                    </span>

                    <h1>
                        ${escapeHTML(topic.title)}
                    </h1>

                    <p>
                        ${escapeHTML(topic.description)}
                    </p>

                    <div class="academy-topic-learning-meta">

                        <span class="academy-topic-meta-item">
                            📚 ${lessons.length} Lessons
                        </span>

                        <span class="academy-topic-meta-item">
                            📈 ${progress}% Complete
                        </span>

                    </div>

                </header>


                <div class="academy-lesson-preview-grid">

                    ${lessons
                        .map(
                            (lesson, index) => {

                                const completed =
                                    isLessonCompleted(
                                        subject.id,
                                        topic.id,
                                        index
                                    );

                                const title =
                                    lesson.content?.title ||
                                    `Lesson ${index + 1}`;

                                return `

                                    <button
                                        type="button"
                                        class="academy-lesson-preview-card"
                                        data-topic-lesson="${index}"
                                    >

                                        <span class="academy-path-number">

                                            ${
                                                completed
                                                    ? "✓"
                                                    : index + 1
                                            }

                                        </span>

                                        <span class="academy-lesson-status">

                                            ${
                                                completed
                                                    ? "Completed"
                                                    : "Start Lesson"
                                            }

                                        </span>

                                        <h3>
                                            ${escapeHTML(title)}
                                        </h3>

                                        <span>
                                            ${completed
                                                ? "Review lesson"
                                                : "Learn concept →"
                                            }
                                        </span>

                                    </button>

                                `;
                            }
                        )
                        .join("")}

                </div>


                <div class="academy-topic-actions">

                    <button
                        type="button"
                        class="button button-primary"
                        id="academyStartTopic"
                    >
                        ${
                            progress > 0
                                ? "Continue Learning"
                                : "Start Topic"
                        }
                    </button>

                </div>

            </div>
        `;


        getElement("#academyTopicBack")
            ?.addEventListener(
                "click",
                () => {
                    openSubject(
                        subject.id
                    );
                }
            );


        getElement("#academyStartTopic")
            ?.addEventListener(
                "click",
                () => {

                    const nextLesson =
                        lessons.findIndex(
                            (_, index) =>
                                !isLessonCompleted(
                                    subject.id,
                                    topic.id,
                                    index
                                )
                        );

                    openLesson(
                        subject.id,
                        topic.id,
                        nextLesson >= 0
                            ? nextLesson
                            : 0
                    );
                }
            );


        getAll(
            "[data-topic-lesson]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openLesson(
                        subject.id,
                        topic.id,
                        Number(
                            button.dataset.topicLesson
                        )
                    );
                }
            );

        });
    }


    /* =====================================================
       SUBJECT VIEW
       ===================================================== */

    function openSubject(subjectId) {

        const subject =
            getSubject(subjectId);

        if (!subject) {
            return;
        }

        STATE.currentSubject = subject;
        STATE.view = "subject";

        renderSubjectExplorer();

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-subject-opened",
                {
                    detail: {
                        subjectId
                    }
                }
            )
        );
    }


    function renderSubjectExplorer() {

        const grid =
            getElement("#academySubjectGrid");

        const explorer =
            getElement("#academySubjectExplorer");

        if (!grid || !explorer) {
            return;
        }

        const subject =
            STATE.currentSubject;

        grid.hidden = true;

        explorer.hidden = false;

        explorer.innerHTML = `

            <div class="academy-topic-learning">

                <header class="academy-topic-learning-header">

                    <button
                        type="button"
                        class="button button-ghost"
                        id="academyExplorerBack"
                    >
                        ← All Subjects
                    </button>

                    <span class="academy-eyebrow">
                        Chemistry Academy
                    </span>

                    <h1>
                        ${escapeHTML(subject.title)}
                    </h1>

                    <p>
                        ${escapeHTML(subject.description)}
                    </p>

                </header>


                <div class="academy-lesson-preview-grid">

                    ${
                        subject.topics.length
                            ? subject.topics
                                .map(
                                    topic => {

                                        const progress =
                                            calculateTopicProgress(
                                                subject.id,
                                                topic.id
                                            );

                                        return `

                                            <button
                                                type="button"
                                                class="academy-lesson-preview-card"
                                                data-academy-topic="${topic.id}"
                                            >

                                                <span class="academy-path-number">
                                                    ${subject.topics.indexOf(topic) + 1}
                                                </span>

                                                <span class="academy-lesson-status">
                                                    ${progress}%
                                                </span>

                                                <h3>
                                                    ${escapeHTML(
                                                        topic.title
                                                    )}
                                                </h3>

                                                <span>
                                                    ${escapeHTML(
                                                        topic.description
                                                    )}
                                                </span>

                                            </button>

                                        `;
                                    }
                                )
                                .join("")
                            :
                                `
                                    <div class="academy-empty-state">

                                        <div class="academy-empty-state-icon">
                                            📚
                                        </div>

                                        <h2>
                                            More content is coming
                                        </h2>

                                        <p>
                                            This chemistry area is already
                                            part of the ChemLab curriculum.
                                            Detailed topics will be released
                                            progressively.
                                        </p>

                                    </div>
                                `
                    }

                </div>

            </div>
        `;


        getElement("#academyExplorerBack")
            ?.addEventListener(
                "click",
                closeExplorer
            );


        getAll(
            "[data-academy-topic]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openTopic(
                        subject.id,
                        button.dataset.academyTopic
                    );
                }
            );

        });
    }


    function closeExplorer() {

        const grid =
            getElement("#academySubjectGrid");

        const explorer =
            getElement("#academySubjectExplorer");

        const topic =
            getElement("#academyTopicContainer");

        const lesson =
            getElement("#academyLessonContainer");

        if (grid) {
            grid.hidden = false;
        }

        if (explorer) {
            explorer.hidden = true;
        }

        if (topic) {
            topic.hidden = true;
        }

        if (lesson) {
            lesson.hidden = true;
        }

        STATE.view = "subjects";
        STATE.currentSubject = null;
        STATE.currentTopic = null;

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-explorer-closed"
            )
        );
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function search(query) {

        STATE.searchQuery =
            String(query || "")
                .trim()
                .toLowerCase();

        STATE.filteredSubjects =
            STATE.subjects.filter(
                subject =>
                    subject.title
                        .toLowerCase()
                        .includes(
                            STATE.searchQuery
                        ) ||
                    subject.description
                        .toLowerCase()
                        .includes(
                            STATE.searchQuery
                        ) ||
                    subject.topics.some(
                        topic =>
                            topic.title
                                .toLowerCase()
                                .includes(
                                    STATE.searchQuery
                                )
                    )
            );

        renderSubjectGrid();

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-search",
                {
                    detail: {
                        query: STATE.searchQuery
                    }
                }
            )
        );
    }


    /* =====================================================
       LEVEL FILTER
       ===================================================== */

    function filterByLevel(level) {

        STATE.currentLevel =
            level || "all";

        if (
            STATE.currentLevel === "all"
        ) {

            STATE.filteredSubjects =
                [...STATE.subjects];

        } else {

            STATE.filteredSubjects =
                STATE.subjects.filter(
                    subject =>
                        subject.levels.includes(
                            STATE.currentLevel
                        )
                );
        }

        renderSubjectGrid();

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-filter",
                {
                    detail: {
                        level:
                            STATE.currentLevel
                    }
                }
            )
        );
    }


    /* =====================================================
       SUBJECT GRID
       ===================================================== */

    function renderSubjectGrid() {

        const grid =
            getElement("#academySubjectGrid");

        const empty =
            getElement("#academyEmptyState");

        if (!grid) {
            return;
        }

        let subjects =
            STATE.filteredSubjects;

        if (
            STATE.searchQuery
        ) {

            subjects =
                subjects.filter(
                    subject =>
                        subject.title
                            .toLowerCase()
                            .includes(
                                STATE.searchQuery
                            ) ||
                        subject.description
                            .toLowerCase()
                            .includes(
                                STATE.searchQuery
                            )
                );
        }

        grid.innerHTML =
            subjects
                .map(
                    subject => `

                        <article
                            class="card academy-subject-card"
                            data-academy-subject="${subject.id}"
                        >

                            <div class="academy-subject-icon">
                                ${subject.icon}
                            </div>

                            <div class="academy-subject-content">

                                <span class="badge">
                                    ${subject.topics.length}
                                    Topics
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        subject.title
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        subject.description
                                    )}
                                </p>

                                <button
                                    type="button"
                                    class="button button-secondary academy-open-subject"
                                    data-subject-id="${subject.id}"
                                >
                                    Explore Subject →
                                </button>

                            </div>

                        </article>

                    `
                )
                .join("");

        grid.hidden = false;

        if (empty) {
            empty.hidden =
                subjects.length !== 0;
        }

        getAll(
            ".academy-open-subject"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openSubject(
                        button.dataset.subjectId
                    );
                }
            );

        });
    }


    /* =====================================================
       STATS
       ===================================================== */

    function updateStats() {

        const subjectCount =
            STATE.subjects.length;

        const topicCount =
            STATE.subjects.reduce(
                (total, subject) =>
                    total + subject.topics.length,
                0
            );

        const lessonCount =
            Object.keys(
                LESSON_CONTENT
            ).length;


        const subjectElement =
            getElement(
                "#academySubjectCount"
            );

        const topicElement =
            getElement(
                "#academyTopicCount"
            );

        const lessonElement =
            getElement(
                "#academyLessonCount"
            );


        if (subjectElement) {
            subjectElement.textContent =
                subjectCount;
        }

        if (topicElement) {
            topicElement.textContent =
                topicCount;
        }

        if (lessonElement) {
            lessonElement.textContent =
                lessonCount;
        }
    }


    /* =====================================================
       BIND UI
       ===================================================== */

    function bindUI() {

        const searchInput =
            getElement(
                "#academySearchInput"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                event => {

                    search(
                        event.target.value
                    );

                }
            );
        }


        getAll(
            "[data-academy-level]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    getAll(
                        "[data-academy-level]"
                    ).forEach(
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
                }
            );

        });


        const clearSearch =
            getElement(
                "#academyClearSearch"
            );

        if (clearSearch) {

            clearSearch.addEventListener(
                "click",
                () => {

                    if (searchInput) {
                        searchInput.value = "";
                    }

                    STATE.searchQuery = "";

                    STATE.filteredSubjects =
                        [...STATE.subjects];

                    renderSubjectGrid();
                }
            );
        }
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        if (STATE.initialized) {
            return;
        }

        STATE.subjects =
            CURRICULUM.map(
                subject => ({
                    ...subject,
                    topics: [...subject.topics]
                })
            );

        STATE.filteredSubjects =
            [...STATE.subjects];

        STATE.initialized = true;

        bindUI();
        updateStats();
        renderSubjectGrid();

        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-ready"
            )
        );

        console.log(
            "[ChemLab Academy] Stage 5.5 initialized."
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CHEMLAB_ACADEMY = {

        initialize,

        getSubject,

        getTopic,

        getLessons,

        getTotalTopics: function () {

            return STATE.subjects.reduce(
                (total, subject) =>
                    total + subject.topics.length,
                0
            );
        },

        getTotalLessons: function () {

            return Object.keys(
                LESSON_CONTENT
            ).length;
        },

        search,

        filterByLevel,

        openSubject,

        openTopic,

        openLesson,

        closeExplorer,

        getTopicProgress,

        setTopicProgress,

        isLessonCompleted,

        markLessonCompleted,

        addScienceXP,

        getState: function () {

            return {
                ...STATE,
                subjects: [...STATE.subjects],
                filteredSubjects: [
                    ...STATE.filteredSubjects
                ]
            };
        }
    };


    /* =====================================================
       AUTO INITIALIZE
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

})();

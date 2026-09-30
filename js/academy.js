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
                    id: "atomic-structure",
                    title: "Atomic Structure",
                    level: "foundation",
                    description:
                        "Understand protons, neutrons, electrons and the structure of atoms.",
                    lessons: [
                        "development-atomic-model",
                        "subatomic-particles",
                        "atomic-number-mass-number",
                        "electron-structure"
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


    /* =====================================================
       LESSON CONTENT
       ===================================================== */

    const LESSON_CONTENT = {

        /* =================================================
           MEASUREMENTS
           ================================================= */

        "scientific-measurement": {

            title: "What Is a Scientific Measurement?",

            objectives: [
                "Define a scientific measurement.",
                "Identify the numerical value and unit in a measurement.",
                "Explain why measurements are essential in chemistry.",
                "Distinguish measured quantities from qualitative observations."
            ],

            content: `
                <p>
                    Chemistry is an experimental science. Chemists do not simply
                    describe substances; they measure physical and chemical
                    properties and use those measurements to develop explanations.
                </p>

                <p>
                    A <strong>measurement</strong> is a quantitative description
                    of a physical quantity obtained by comparing it with an
                    accepted reference standard.
                </p>

                <p>
                    A complete measurement normally contains two parts:
                    a <strong>numerical value</strong> and a
                    <strong>unit</strong>.
                </p>

                <div class="lesson-equation">
                    Measurement = Numerical value × Unit
                </div>

                <p>
                    For example, if the mass of a sample is reported as
                    <strong>12.5 g</strong>, the number <strong>12.5</strong>
                    gives the numerical value while <strong>g</strong>
                    identifies the unit.
                </p>

                <p>
                    Without the unit, the value is incomplete because the same
                    numerical value could represent grams, kilograms, milligrams
                    or another quantity.
                </p>

                <div class="lesson-callout">
                    <strong>Important:</strong>
                    A measurement should always be reported with an appropriate
                    unit unless the context explicitly defines the unit.
                </div>

                <h3>Measured quantities in chemistry</h3>

                <p>
                    Common measurements include mass, volume, temperature,
                    time, pressure and amount of substance.
                </p>

                <table class="lesson-table">
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Example</th>
                            <th>Common unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mass</td>
                            <td>25.4 g</td>
                            <td>gram (g)</td>
                        </tr>
                        <tr>
                            <td>Volume</td>
                            <td>50.0 mL</td>
                            <td>millilitre (mL)</td>
                        </tr>
                        <tr>
                            <td>Temperature</td>
                            <td>298 K</td>
                            <td>kelvin (K)</td>
                        </tr>
                        <tr>
                            <td>Time</td>
                            <td>120 s</td>
                            <td>second (s)</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Measurements versus observations</h3>

                <p>
                    A qualitative observation describes what is seen, heard,
                    smelled or otherwise observed without necessarily assigning
                    a numerical value.
                </p>

                <p>
                    For example, saying that a solution becomes
                    <strong>blue</strong> is a qualitative observation.
                    Reporting a temperature of <strong>25.4 °C</strong>
                    is a quantitative measurement.
                </p>
            `,

            keyPoints: [
                "A measurement contains a numerical value and a unit.",
                "Units provide meaning to numerical values.",
                "Chemistry relies heavily on quantitative measurements.",
                "Qualitative observations and quantitative measurements are different types of scientific evidence."
            ],

            workedExample: {
                question:
                    "A student records the volume of a liquid as 35.0 mL. Identify the numerical value and the unit.",
                solution:
                    "<strong>Numerical value:</strong> 35.0<br><strong>Unit:</strong> mL (millilitre)"
            },

            knowledgeCheck: {
                question:
                    "Which statement represents a complete scientific measurement?",
                options: [
                    "25",
                    "25 grams",
                    "Large mass",
                    "Approximately heavy"
                ],
                answer: 1,
                explanation:
                    "A complete quantitative measurement contains a numerical value together with a unit."
            }
        },


        /* =================================================
           SI UNITS
           ================================================= */

        "si-units": {

            title: "The SI System of Units",

            objectives: [
                "Explain the purpose of the SI system.",
                "Identify important SI base units used in chemistry.",
                "Distinguish base units from derived units.",
                "Recognize common SI prefixes."
            ],

            content: `
                <p>
                    Scientists around the world need a consistent way to
                    communicate measurements. The
                    <strong>International System of Units (SI)</strong>
                    provides a standardized system of measurement.
                </p>

                <p>
                    Chemistry uses SI units extensively because chemical
                    calculations often combine measurements from different
                    experiments and instruments.
                </p>

                <h3>Important SI base quantities</h3>

                <table class="lesson-table">
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>SI base unit</th>
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
                    </tbody>
                </table>

                <h3>Derived units</h3>

                <p>
                    Many quantities used in chemistry are derived from base
                    quantities.
                </p>

                <p>
                    For example, volume can be expressed as a cubic length:
                </p>

                <div class="lesson-equation">
                    Volume = length × length × length
                </div>

                <p>
                    Therefore the SI unit for volume is
                    <strong>m³</strong>.
                </p>

                <p>
                    Chemistry commonly uses litres and millilitres for
                    laboratory volume measurements. These are accepted for use
                    with SI even though the litre is not an SI base unit.
                </p>

                <h3>Common prefixes</h3>

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
                            <td>centi</td>
                            <td>c</td>
                            <td>10⁻²</td>
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

                <div class="lesson-callout">
                    <strong>Scientific habit:</strong>
                    Always check the unit before beginning a calculation.
                    Many chemistry errors are unit errors rather than
                    mathematical errors.
                </div>
            `,

            keyPoints: [
                "SI provides a standardized scientific measurement system.",
                "The mole is the SI base unit for amount of substance.",
                "Derived units are constructed from base units.",
                "Prefixes represent powers of ten."
            ],

            workedExample: {
                question:
                    "Convert 3.5 km into metres.",
                solution:
                    "1 km = 1000 m.<br><br>Therefore:<br><strong>3.5 km × 1000 m/km = 3500 m</strong>"
            },

            knowledgeCheck: {
                question:
                    "Which is the SI base unit for amount of substance?",
                options: [
                    "gram",
                    "litre",
                    "mole",
                    "millilitre"
                ],
                answer: 2,
                explanation:
                    "The mole (mol) is the SI base unit for amount of substance."
            }
        },


        /* =================================================
           COMMON CHEMISTRY UNITS
           ================================================= */

        "chemistry-units": {

            title: "Common Chemistry Units",

            objectives: [
                "Identify common units used in chemistry.",
                "Relate common laboratory units to SI units.",
                "Recognize units used for mass, volume, temperature and pressure.",
                "Avoid confusing similar units."
            ],

            content: `
                <p>
                    Although SI units provide the scientific foundation,
                    chemistry laboratories frequently use practical units
                    that are convenient for experimental work.
                </p>

                <h3>Mass</h3>

                <p>
                    Mass is commonly reported in grams (g), milligrams (mg)
                    and kilograms (kg).
                </p>

                <div class="lesson-equation">
                    1 kg = 1000 g
                </div>

                <div class="lesson-equation">
                    1 g = 1000 mg
                </div>

                <h3>Volume</h3>

                <p>
                    Laboratory volumes are frequently measured in litres (L)
                    and millilitres (mL).
                </p>

                <div class="lesson-equation">
                    1 L = 1000 mL
                </div>

                <p>
                    A useful relationship is:
                </p>

                <div class="lesson-equation">
                    1 mL = 1 cm³
                </div>

                <h3>Temperature</h3>

                <p>
                    Celsius is widely used in everyday laboratory work,
                    while kelvin is the SI base unit for thermodynamic
                    temperature.
                </p>

                <div class="lesson-equation">
                    T(K) = T(°C) + 273.15
                </div>

                <h3>Pressure</h3>

                <p>
                    Pressure may be reported in pascals (Pa), kilopascals
                    (kPa), atmospheres (atm), or millimetres of mercury
                    (mmHg), depending on the context.
                </p>

                <table class="lesson-table">
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Common chemistry units</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mass</td>
                            <td>g, mg, kg</td>
                        </tr>
                        <tr>
                            <td>Volume</td>
                            <td>L, mL, cm³</td>
                        </tr>
                        <tr>
                            <td>Temperature</td>
                            <td>°C, K</td>
                        </tr>
                        <tr>
                            <td>Pressure</td>
                            <td>Pa, kPa, atm, mmHg</td>
                        </tr>
                        <tr>
                            <td>Amount of substance</td>
                            <td>mol, mmol</td>
                        </tr>
                    </tbody>
                </table>
            `,

            keyPoints: [
                "Chemistry uses both SI units and practical laboratory units.",
                "1 L equals 1000 mL.",
                "1 mL equals 1 cm³.",
                "Kelvin is the SI base unit for temperature."
            ],

            workedExample: {
                question:
                    "Convert 250 mL to litres.",
                solution:
                    "Because 1000 mL = 1 L:<br><br><strong>250 mL ÷ 1000 = 0.250 L</strong>"
            },

            knowledgeCheck: {
                question:
                    "How many millilitres are in 2.00 L?",
                options: [
                    "20.0 mL",
                    "200 mL",
                    "2000 mL",
                    "20,000 mL"
                ],
                answer: 2,
                explanation:
                    "Since 1 L = 1000 mL, 2.00 L = 2000 mL."
            }
        },


        /* =================================================
           SCIENTIFIC NOTATION
           ================================================= */

        "scientific-notation": {

            title: "Scientific Notation",

            objectives: [
                "Write very large and very small numbers in scientific notation.",
                "Identify the coefficient and exponent.",
                "Convert between decimal notation and scientific notation.",
                "Apply scientific notation to chemistry measurements."
            ],

            content: `
                <p>
                    Chemistry frequently deals with extremely large and
                    extremely small quantities. Scientific notation provides
                    a compact way of representing these values.
                </p>

                <p>
                    A number written in scientific notation has the form:
                </p>

                <div class="lesson-equation">
                    a × 10ⁿ
                </div>

                <p>
                    where <strong>a</strong> is normally between 1 and 10,
                    and <strong>n</strong> is an integer.
                </p>

                <h3>Large numbers</h3>

                <p>
                    When a decimal point is moved to the left, the exponent
                    becomes positive.
                </p>

                <div class="lesson-equation">
                    300000 = 3.00 × 10⁵
                </div>

                <h3>Small numbers</h3>

                <p>
                    When a decimal point is moved to the right, the exponent
                    becomes negative.
                </p>

                <div class="lesson-equation">
                    0.00045 = 4.5 × 10⁻⁴
                </div>

                <h3>Why chemistry uses scientific notation</h3>

                <p>
                    Scientific notation makes it easier to communicate values
                    such as molecular dimensions, particle masses, atomic
                    quantities and concentrations.
                </p>

                <div class="lesson-callout">
                    <strong>Remember:</strong>
                    The sign of the exponent tells you the direction in which
                    the decimal point was moved.
                </div>

                <h3>Multiplication</h3>

                <p>
                    When multiplying numbers in scientific notation, multiply
                    the coefficients and add the exponents.
                </p>

                <div class="lesson-equation">
                    (2 × 10³)(3 × 10²) = 6 × 10⁵
                </div>

                <h3>Division</h3>

                <p>
                    When dividing, divide the coefficients and subtract the
                    exponent in the denominator from the exponent in the
                    numerator.
                </p>

                <div class="lesson-equation">
                    (6 × 10⁵) ÷ (2 × 10²) = 3 × 10³
                </div>
            `,

            keyPoints: [
                "Scientific notation has the form a × 10ⁿ.",
                "Large numbers generally have positive exponents.",
                "Small numbers generally have negative exponents.",
                "Multiplication adds exponents.",
                "Division subtracts exponents."
            ],

            workedExample: {
                question:
                    "Write 0.0000072 in scientific notation.",
                solution:
                    "Move the decimal point six places to the right:<br><br><strong>0.0000072 = 7.2 × 10⁻⁶</strong>"
            },

            knowledgeCheck: {
                question:
                    "Which is the correct scientific notation for 450000?",
                options: [
                    "4.5 × 10⁵",
                    "45 × 10⁴",
                    "0.45 × 10⁶",
                    "4.5 × 10⁻⁵"
                ],
                answer: 0,
                explanation:
                    "450000 becomes 4.5 × 10⁵ when the decimal point is moved five places to the left."
            }
        },


        /* =================================================
           SIGNIFICANT FIGURES
           ================================================= */

        "meaning-significant-figures": {

            title: "Why Significant Figures Matter",

            objectives: [
                "Define significant figures.",
                "Explain the relationship between significant figures and measurement precision.",
                "Distinguish exact numbers from measured values."
            ],

            content: `
                <p>
                    Measurements in chemistry are not infinitely precise.
                    Every measuring instrument has a limit to how finely it
                    can resolve a quantity.
                </p>

                <p>
                    <strong>Significant figures</strong> are the digits in a
                    measurement that carry meaningful information about its
                    precision.
                </p>

                <p>
                    Consider the measurements:
                </p>

                <div class="lesson-equation">
                    2 g &nbsp;&nbsp; versus &nbsp;&nbsp; 2.00 g
                </div>

                <p>
                    These values communicate different levels of reported
                    precision. The second measurement contains more
                    information about the precision of the measurement.
                </p>

                <div class="lesson-callout">
                    Significant figures do not make an instrument more accurate.
                    They communicate the precision with which a result has been
                    measured or calculated.
                </div>

                <h3>Exact numbers</h3>

                <p>
                    Some numbers are exact because they arise from definitions
                    or counting rather than measurement.
                </p>

                <p>
                    For example, if a laboratory tray contains exactly
                    <strong>12 test tubes</strong>, the number 12 is a counted
                    quantity rather than an experimentally measured quantity.
                </p>
            `,

            keyPoints: [
                "Significant figures communicate meaningful measurement precision.",
                "Measured quantities have limited precision.",
                "More displayed digits do not automatically mean greater accuracy.",
                "Exact counted quantities differ from measured quantities."
            ],

            workedExample: {
                question:
                    "Which measurement communicates greater reported precision: 5 g or 5.00 g?",
                solution:
                    "<strong>5.00 g</strong> communicates greater reported precision because it contains three significant figures rather than one."
            },

            knowledgeCheck: {
                question:
                    "What do significant figures primarily communicate?",
                options: [
                    "The color of a substance",
                    "The precision of a measurement",
                    "The chemical formula",
                    "The reaction mechanism"
                ],
                answer: 1,
                explanation:
                    "Significant figures communicate the precision represented by a measurement."
            }
        },


        /* =================================================
           COUNTING SIGNIFICANT FIGURES
           ================================================= */

        "counting-significant-figures": {

            title: "Counting Significant Figures",

            objectives: [
                "Identify significant and non-significant zeros.",
                "Count significant figures in decimal measurements.",
                "Count significant figures in scientific notation."
            ],

            content: `
                <p>
                    Several rules help determine which digits are significant.
                </p>

                <h3>Rule 1 — Non-zero digits</h3>

                <p>
                    All non-zero digits are significant.
                </p>

                <div class="lesson-equation">
                    347 → 3 significant figures
                </div>

                <h3>Rule 2 — Zeros between non-zero digits</h3>

                <p>
                    Zeros between significant non-zero digits are significant.
                </p>

                <div class="lesson-equation">
                    1002 → 4 significant figures
                </div>

                <h3>Rule 3 — Leading zeros</h3>

                <p>
                    Zeros at the beginning of a decimal number are not
                    significant. They only locate the decimal point.
                </p>

                <div class="lesson-equation">
                    0.0045 → 2 significant figures
                </div>

                <h3>Rule 4 — Trailing zeros after a decimal</h3>

                <p>
                    Trailing zeros after a decimal point are significant.
                </p>

                <div class="lesson-equation">
                    2.500 → 4 significant figures
                </div>

                <h3>Scientific notation</h3>

                <p>
                    In scientific notation, every digit in the coefficient is
                    significant.
                </p>

                <div class="lesson-equation">
                    4.50 × 10³ → 3 significant figures
                </div>
            `,

            keyPoints: [
                "All non-zero digits are significant.",
                "Zeros between non-zero digits are significant.",
                "Leading zeros are not significant.",
                "Trailing decimal zeros are significant.",
                "Scientific notation makes significant figures explicit."
            ],

            workedExample: {
                question:
                    "How many significant figures are in 0.00450?",
                solution:
                    "The leading zeros are not significant. The digits 4, 5 and the trailing decimal zero are significant.<br><br><strong>Answer: 3 significant figures.</strong>"
            },

            knowledgeCheck: {
                question:
                    "How many significant figures are in 0.02050?",
                options: [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                answer: 2,
                explanation:
                    "The significant digits are 2, 0, 5 and 0. The leading zeros are not significant."
            }
        },


        /* =================================================
           DIMENSIONAL ANALYSIS
           ================================================= */

        "dimensional-analysis-basics": {

            title: "Dimensional Analysis Basics",

            objectives: [
                "Explain dimensional analysis.",
                "Use units as mathematical factors.",
                "Recognize when units cancel correctly.",
                "Use dimensional analysis to check calculations."
            ],

            content: `
                <p>
                    <strong>Dimensional analysis</strong> is a method of
                    solving problems by treating units as mathematical
                    quantities.
                </p>

                <p>
                    The central idea is simple:
                    <strong>units must be consistent with the quantity being
                    calculated.</strong>
                </p>

                <p>
                    Conversion factors are written as ratios equal to one.
                </p>

                <div class="lesson-equation">
                    1 m = 100 cm
                </div>

                <p>
                    Therefore either of the following ratios represents a
                    valid conversion factor:
                </p>

                <div class="lesson-equation">
                    1 m / 100 cm
                    &nbsp;&nbsp;&nbsp; or &nbsp;&nbsp;&nbsp;
                    100 cm / 1 m
                </div>

                <h3>Why units cancel</h3>

                <p>
                    Suppose we want to convert metres to centimetres:
                </p>

                <div class="lesson-equation">
                    2 m × (100 cm / 1 m)
                </div>

                <p>
                    The unit <strong>m</strong> appears in both the numerator
                    and denominator, so it cancels.
                </p>

                <div class="lesson-equation">
                    2 m × (100 cm / 1 m) = 200 cm
                </div>

                <div class="lesson-callout">
                    <strong>Powerful habit:</strong>
                    Write the units at every stage of a chemistry calculation.
                    If the unwanted unit does not cancel, the conversion setup
                    needs to be reconsidered.
                </div>
            `,

            keyPoints: [
                "Dimensional analysis treats units as mathematical quantities.",
                "Conversion factors are ratios equivalent to one.",
                "Units should cancel in a valid conversion.",
                "The final unit should match the quantity requested."
            ],

            workedExample: {
                question:
                    "Convert 5.0 km to metres using dimensional analysis.",
                solution:
                    "5.0 km × (1000 m / 1 km) = <strong>5000 m</strong><br><br>The km units cancel, leaving metres."
            },

            knowledgeCheck: {
                question:
                    "What should happen to an unwanted unit during dimensional analysis?",
                options: [
                    "It should become larger",
                    "It should remain in the final answer",
                    "It should cancel",
                    "It should be ignored"
                ],
                answer: 2,
                explanation:
                    "A correctly constructed conversion causes the unwanted unit to cancel."
            }
        },


        /* =================================================
           UNIT CONVERSIONS
           ================================================= */

        "unit-conversions": {

            title: "Unit Conversions",

            objectives: [
                "Construct conversion factors.",
                "Convert between common chemistry units.",
                "Track units through a calculation."
            ],

            content: `
                <p>
                    Unit conversion changes the way a quantity is expressed
                    without changing the physical quantity itself.
                </p>

                <p>
                    For example, 1 L and 1000 mL represent the same volume.
                    Only the numerical representation changes.
                </p>

                <h3>Example: litres to millilitres</h3>

                <div class="lesson-equation">
                    1 L = 1000 mL
                </div>

                <p>
                    To convert 0.750 L:
                </p>

                <div class="lesson-equation">
                    0.750 L × (1000 mL / 1 L)
                </div>

                <div class="lesson-equation">
                    = 750 mL
                </div>

                <h3>Example: milligrams to grams</h3>

                <div class="lesson-equation">
                    1 g = 1000 mg
                </div>

                <p>
                    Therefore:
                </p>

                <div class="lesson-equation">
                    2500 mg × (1 g / 1000 mg)
                    = 2.5 g
                </div>

                <div class="lesson-callout">
                    Notice that the conversion factor is selected so that the
                    original unit cancels.
                </div>
            `,

            keyPoints: [
                "Unit conversion changes the numerical representation, not the physical quantity.",
                "Choose conversion factors so unwanted units cancel.",
                "Keep units visible throughout the calculation."
            ],

            workedExample: {
                question:
                    "Convert 3500 mg to grams.",
                solution:
                    "3500 mg × (1 g / 1000 mg) = <strong>3.5 g</strong>"
            },

            knowledgeCheck: {
                question:
                    "Which conversion factor should be used to convert grams to milligrams?",
                options: [
                    "1 g / 1000 mg",
                    "1000 mg / 1 g",
                    "1 mg / 1000 g",
                    "100 g / 1 mg"
                ],
                answer: 1,
                explanation:
                    "1000 mg equals 1 g, so the factor 1000 mg / 1 g converts grams to milligrams."
            }
        },


        /* =================================================
           MULTI-STEP CONVERSIONS
           ================================================= */

        "multi-step-conversions": {

            title: "Multi-Step Conversions",

            objectives: [
                "Perform conversions requiring more than one conversion factor.",
                "Keep track of units through multiple steps.",
                "Use dimensional analysis to connect different units."
            ],

            content: `
                <p>
                    Some chemistry calculations require several conversion
                    factors. The same principle still applies:
                    choose each factor so that unwanted units cancel.
                </p>

                <h3>Example</h3>

                <p>
                    Convert 2.5 hours to seconds.
                </p>

                <div class="lesson-equation">
                    2.5 h
                    × (60 min / 1 h)
                    × (60 s / 1 min)
                </div>

                <p>
                    The hours cancel first, followed by minutes.
                </p>

                <div class="lesson-equation">
                    2.5 × 60 × 60 s
                    = 9000 s
                </div>

                <h3>The unit pathway</h3>

                <div class="lesson-equation">
                    h → min → s
                </div>

                <p>
                    Thinking of a conversion as a pathway can make complex
                    unit problems easier to organize.
                </p>
            `,

            keyPoints: [
                "Multi-step conversions use several conversion factors.",
                "Each factor should cancel an unwanted unit.",
                "A clear unit pathway reduces mistakes."
            ],

            workedExample: {
                question:
                    "Convert 3.0 days to seconds.",
                solution:
                    "3.0 days × (24 h/day) × (60 min/h) × (60 s/min)<br><br><strong>= 259200 s</strong>"
            },

            knowledgeCheck: {
                question:
                    "In a multi-step conversion, what should happen after every conversion factor is applied?",
                options: [
                    "A new unwanted unit should appear",
                    "The calculation should become unitless",
                    "One unwanted unit should cancel",
                    "All numbers should become zero"
                ],
                answer: 2,
                explanation:
                    "Each conversion factor is selected to cancel an unwanted unit."
            }
        },


        /* =================================================
           DIMENSIONAL ANALYSIS IN CHEMISTRY
           ================================================= */

        "dimensional-analysis-chemistry": {

            title: "Dimensional Analysis in Chemistry",

            objectives: [
                "Apply dimensional analysis to chemistry quantities.",
                "Use molar mass as a conversion factor.",
                "Connect mass, moles and particles."
            ],

            content: `
                <p>
                    Dimensional analysis becomes especially powerful in
                    chemistry because many chemical quantities are connected
                    through defined relationships.
                </p>

                <p>
                    For example, molar mass connects mass and amount of
                    substance:
                </p>

                <div class="lesson-equation">
                    Molar mass = grams / mole
                </div>

                <p>
                    This means molar mass can be used as a conversion factor
                    between grams and moles.
                </p>

                <h3>Mass → moles</h3>

                <div class="lesson-equation">
                    grams × (1 mol / molar mass in grams)
                </div>

                <h3>Moles → mass</h3>

                <div class="lesson-equation">
                    moles × (molar mass in grams / 1 mol)
                </div>

                <p>
                    The same approach can later be extended to particles using
                    the Avogadro constant.
                </p>

                <div class="lesson-callout">
                    Dimensional analysis provides a common mathematical
                    framework for many chemistry calculations, including
                    stoichiometry.
                </div>
            `,

            keyPoints: [
                "Molar mass connects mass and amount of substance.",
                "Conversion factors can connect grams and moles.",
                "Units provide a logical pathway through chemistry calculations.",
                "Dimensional analysis becomes central to stoichiometry."
            ],

            workedExample: {
                question:
                    "How many moles are present in 18.0 g of water? Use a molar mass of 18.0 g/mol.",
                solution:
                    "18.0 g × (1 mol / 18.0 g) = <strong>1.00 mol H₂O</strong>"
            },

            knowledgeCheck: {
                question:
                    "Which quantity connects grams and moles?",
                options: [
                    "Density",
                    "Molar mass",
                    "Temperature",
                    "Pressure"
                ],
                answer: 1,
                explanation:
                    "Molar mass expresses grams per mole and therefore connects mass with amount of substance."
            }
        }

    };


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

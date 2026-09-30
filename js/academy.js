/* =========================================================
   CHEMLAB
   PROFESSIONAL CHEMISTRY ACADEMY
   Stage 5.4 — Lesson Viewer & Learning Engine
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. STATE
       ===================================================== */

    const ACADEMY_STATE = {

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
       02. LESSON CONTENT
       ===================================================== */

    const LESSON_CONTENT = {

        "measurements-scientific-units": [

            {
                id: "measurement-introduction",

                title: "What Is a Scientific Measurement?",

                type: "concept",

                objectives: [
                    "Understand what a measurement represents.",
                    "Distinguish between a numerical value and a unit.",
                    "Explain why standardized units are important in chemistry."
                ],

                content: `
                    <p>
                        Chemistry is an experimental science. Scientists use
                        measurements to describe substances, observations and
                        changes quantitatively.
                    </p>

                    <p>
                        A measurement normally consists of a
                        <strong>numerical value</strong> and a
                        <strong>unit</strong>.
                    </p>

                    <div class="lesson-equation">
                        Measurement = numerical value × unit
                    </div>

                    <p>
                        For example, a mass might be reported as
                        <strong>25.0 g</strong>. The number tells us the
                        magnitude of the measurement, while the unit tells us
                        what physical quantity is being measured.
                    </p>

                    <p>
                        Without a unit, a numerical value may be ambiguous.
                        Scientific communication therefore depends on clearly
                        defined units.
                    </p>
                `,

                keyPoints: [
                    "Measurements describe physical quantities.",
                    "A measurement requires both a value and a unit.",
                    "Standardized units allow scientists to communicate consistently."
                ],

                example: {
                    title: "Worked Example",
                    question:
                        "A sample has a measured mass of 18.5 g. Identify the numerical value and the unit.",
                    answer:
                        "The numerical value is 18.5 and the unit is grams (g)."
                },

                check: {
                    question:
                        "Why is the unit important when reporting a measurement?",
                    options: [
                        "It identifies what the numerical value represents.",
                        "It makes every measurement larger.",
                        "It removes all experimental uncertainty.",
                        "It replaces the numerical value."
                    ],
                    answer: 0
                }
            },


            {
                id: "si-system",

                title: "The SI System of Units",

                type: "concept",

                objectives: [
                    "Identify common SI base units used in chemistry.",
                    "Recognize common derived units.",
                    "Understand why scientists use standardized units."
                ],

                content: `
                    <p>
                        The <strong>International System of Units (SI)</strong>
                        provides a standardized framework for scientific
                        measurement.
                    </p>

                    <p>
                        Chemistry commonly uses quantities such as mass,
                        length, time, temperature and amount of substance.
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

                            </tbody>

                        </table>

                    </div>

                    <p>
                        Chemistry also uses derived units. For example,
                        concentration may be expressed in mol/L, while pressure
                        can be expressed in pascals.
                    </p>
                `,

                keyPoints: [
                    "SI provides standardized scientific units.",
                    "The mole is the SI base unit for amount of substance.",
                    "Derived units are constructed from base units."
                ],

                example: {
                    title: "Think About It",
                    question:
                        "Which SI base unit is associated with amount of substance?",
                    answer:
                        "The mole, symbol mol."
                },

                check: {
                    question:
                        "Which unit represents amount of substance in the SI system?",
                    options: [
                        "kilogram",
                        "mole",
                        "kelvin",
                        "metre"
                    ],
                    answer: 1
                }
            },


            {
                id: "units-in-chemistry",

                title: "Common Chemistry Units",

                type: "concept",

                objectives: [
                    "Recognize common chemistry units.",
                    "Distinguish between mass, volume, temperature and amount of substance.",
                    "Select appropriate units for common laboratory measurements."
                ],

                content: `
                    <p>
                        Chemists frequently work with measurements that are
                        smaller or more convenient than the SI base units.
                    </p>

                    <p>
                        Common laboratory units include grams, milligrams,
                        litres, millilitres, degrees Celsius and moles.
                    </p>

                    <div class="lesson-callout">
                        <strong>Important:</strong>
                        Always check the unit before performing a calculation.
                        Many chemistry errors begin with incompatible units.
                    </div>

                    <p>
                        For example, a balance may report mass in grams,
                        while a volumetric instrument may report volume in
                        millilitres.
                    </p>

                    <p>
                        Before combining measurements in an equation, determine
                        whether the units are compatible with the equation.
                    </p>
                `,

                keyPoints: [
                    "Laboratories use many practical units.",
                    "Unit compatibility matters in calculations.",
                    "Always identify units before substituting values into equations."
                ],

                example: {
                    title: "Worked Example",
                    question:
                        "A solution volume is reported as 250 mL. What type of quantity is being measured?",
                    answer:
                        "The quantity is volume."
                },

                check: {
                    question:
                        "What should you check before using two measured quantities in a calculation?",
                    options: [
                        "Whether their units are compatible.",
                        "Whether their numbers look similar.",
                        "Whether both values are integers.",
                        "Whether the units can be ignored."
                    ],
                    answer: 0
                }
            },


            {
                id: "scientific-notation",

                title: "Scientific Notation",

                type: "calculation",

                objectives: [
                    "Write very large and very small numbers in scientific notation.",
                    "Interpret powers of ten.",
                    "Use scientific notation when working with chemistry quantities."
                ],

                content: `
                    <p>
                        Chemistry often deals with extremely small particles and
                        very large numbers of particles. Scientific notation
                        provides a convenient way to represent these values.
                    </p>

                    <div class="lesson-equation">
                        a × 10<sup>n</sup>
                    </div>

                    <p>
                        In scientific notation, <strong>a</strong> is normally
                        between 1 and 10, while <strong>n</strong> is an integer.
                    </p>

                    <p>
                        For example, 0.00045 can be written as
                        <strong>4.5 × 10<sup>−4</sup></strong>.
                    </p>

                    <p>
                        Moving the decimal point to the right produces a
                        negative exponent. Moving it to the left produces a
                        positive exponent.
                    </p>
                `,

                keyPoints: [
                    "Scientific notation uses powers of ten.",
                    "Small numbers normally have negative exponents.",
                    "Large numbers normally have positive exponents."
                ],

                example: {
                    title: "Worked Example",
                    question:
                        "Write 0.0000032 in scientific notation.",
                    answer:
                        "3.2 × 10⁻⁶."
                },

                check: {
                    question:
                        "Which is the correct scientific notation for 0.00052?",
                    options: [
                        "5.2 × 10⁻⁴",
                        "5.2 × 10⁴",
                        "52 × 10⁻⁵",
                        "0.52 × 10⁻³"
                    ],
                    answer: 0
                }
            }

        ]

    };


    /* =====================================================
       03. CURRICULUM
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


        {
            id: "inorganic",
            name: "Inorganic Chemistry",
            shortName: "Inorganic",
            category: "Core Chemistry",
            icon: "◇",
            description:
                "Explore the chemistry of elements, compounds, bonding, acids, bases and coordination systems.",
            level: "undergraduate",
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


        {
            id: "organic",
            name: "Organic Chemistry",
            shortName: "Organic",
            category: "Core Chemistry",
            icon: "⌬",
            description:
                "Study carbon chemistry, structures, functional groups, reactions and mechanisms.",
            level: "undergraduate",
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


        {
            id: "physical",
            name: "Physical Chemistry",
            shortName: "Physical",
            category: "Advanced Chemistry",
            icon: "Δ",
            description:
                "Understand the mathematical and theoretical principles governing chemical systems.",
            level: "advanced",
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


        {
            id: "analytical",
            name: "Analytical Chemistry",
            shortName: "Analytical",
            category: "Applied Chemistry",
            icon: "◫",
            description:
                "Develop the skills needed to measure, quantify and interpret chemical information.",
            level: "undergraduate",
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


        {
            id: "biochemistry",
            name: "Biochemistry",
            shortName: "Biochemistry",
            category: "Life Science",
            icon: "⬡",
            description:
                "Explore the chemistry of biological molecules and biochemical processes.",
            level: "undergraduate",
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


        {
            id: "environmental",
            name: "Environmental Chemistry",
            shortName: "Environmental",
            category: "Applied Chemistry",
            icon: "◌",
            description:
                "Understand chemical processes affecting water, air, soil and environmental systems.",
            level: "undergraduate",
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


        {
            id: "electrochemistry",
            name: "Electrochemistry",
            shortName: "Electrochemistry",
            category: "Advanced Chemistry",
            icon: "⚡",
            description:
                "Study chemical systems involving electron transfer, electrical potential and electrochemical cells.",
            level: "advanced",
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


        {
            id: "materials",
            name: "Materials & Industrial Chemistry",
            shortName: "Materials",
            category: "Industrial Chemistry",
            icon: "▣",
            description:
                "Explore chemical principles behind materials, industrial processes and catalysts.",
            level: "advanced",
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


        {
            id: "instrumental",
            name: "Instrumental & Spectroscopic Chemistry",
            shortName: "Instrumental",
            category: "Advanced Analytical Chemistry",
            icon: "⌁",
            description:
                "Learn how modern instruments generate chemical information and analytical data.",
            level: "advanced",
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


        {
            id: "nuclear",
            name: "Nuclear & Radiochemistry",
            shortName: "Nuclear Chemistry",
            category: "Advanced Chemistry",
            icon: "◎",
            description:
                "Study nuclear structure, radioactivity, decay processes and radiochemical concepts.",
            level: "advanced",
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


        {
            id: "research",
            name: "Research & Laboratory Science",
            shortName: "Research",
            category: "Research Science",
            icon: "⌘",
            description:
                "Develop the scientific reasoning, data analysis and research skills needed for laboratory science.",
            level: "advanced",
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
       04. HELPERS
       ===================================================== */

    function normalizeText(value) {

        return String(value || "")
            .toLowerCase()
            .trim();

    }


    function getSubject(subjectId) {

        return ACADEMY_CURRICULUM.find(
            subject => subject.id === subjectId
        ) || null;

    }


    function getTopic(subjectId, topicId) {

        const subject =
            getSubject(subjectId);

        if (!subject) {
            return null;
        }

        return subject.topics.find(
            topic => topic.id === topicId
        ) || null;

    }


    function getLessons(
        subjectId,
        topicId
    ) {

        return LESSON_CONTENT[topicId] || [];

    }


    function getProgressKey(
        subjectId,
        topicId
    ) {

        return (
            "chemlab_topic_progress_" +
            subjectId +
            "_" +
            topicId
        );

    }


    function getLessonKey(
        subjectId,
        topicId,
        lessonIndex
    ) {

        return (
            "chemlab_lesson_completed_" +
            subjectId +
            "_" +
            topicId +
            "_" +
            lessonIndex
        );

    }


    function getTopicProgress(
        subjectId,
        topicId
    ) {

        const value =
            Number(
                localStorage.getItem(
                    getProgressKey(
                        subjectId,
                        topicId
                    )
                )
            );


        return Number.isFinite(value)
            ? Math.max(0, Math.min(100, value))
            : 0;

    }


    function setTopicProgress(
        subjectId,
        topicId,
        progress
    ) {

        const value =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(progress) || 0
                )
            );


        localStorage.setItem(
            getProgressKey(
                subjectId,
                topicId
            ),
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


    function isLessonCompleted(
        subjectId,
        topicId,
        lessonIndex
    ) {

        return (
            localStorage.getItem(
                getLessonKey(
                    subjectId,
                    topicId,
                    lessonIndex
                )
            ) === "true"
        );

    }


    function markLessonCompleted(
        subjectId,
        topicId,
        lessonIndex
    ) {

        localStorage.setItem(
            getLessonKey(
                subjectId,
                topicId,
                lessonIndex
            ),
            "true"
        );


        const lessons =
            getLessons(
                subjectId,
                topicId
            );


        if (!lessons.length) {
            return;
        }


        const completed =
            lessons.reduce(
                (count, lesson, index) => {

                    return count +
                        (
                            isLessonCompleted(
                                subjectId,
                                topicId,
                                index
                            )
                                ? 1
                                : 0
                        );

                },
                0
            );


        const progress =
            Math.round(
                (completed / lessons.length) *
                100
            );


        setTopicProgress(
            subjectId,
            topicId,
            progress
        );


        addScienceXP(10);


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:lesson-completed",
                {
                    detail: {
                        subjectId,
                        topicId,
                        lessonIndex,
                        progress
                    }
                }
            )
        );

    }


    function addScienceXP(amount) {

        const value =
            Math.max(
                0,
                Number(amount) || 0
            );


        const key =
            "chemlab_science_xp";


        const current =
            Number(
                localStorage.getItem(key)
            ) || 0;


        localStorage.setItem(
            key,
            String(
                current + value
            )
        );


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:xp-updated",
                {
                    detail: {
                        amount: value,
                        total: current + value
                    }
                }
            )
        );

    }


    function formatMinutes(minutes) {

        const value =
            Number(minutes) || 0;


        if (value < 60) {
            return value + " min";
        }


        const hours =
            Math.floor(value / 60);


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
       05. LESSON VIEWER
       ===================================================== */

    function openLesson(
        subjectId,
        topicId,
        lessonIndex
    ) {

        const subject =
            getSubject(subjectId);

        const topic =
            getTopic(
                subjectId,
                topicId
            );


        if (!subject || !topic) {
            return null;
        }


        const lessons =
            getLessons(
                subjectId,
                topicId
            );


        if (!lessons.length) {

            openTopic(
                subjectId,
                topicId
            );

            return null;

        }


        const safeIndex =
            Math.max(
                0,
                Math.min(
                    lessons.length - 1,
                    Number(lessonIndex) || 0
                )
            );


        ACADEMY_STATE.currentSubject =
            subject;

        ACADEMY_STATE.currentTopic =
            topic;

        ACADEMY_STATE.currentLessonIndex =
            safeIndex;

        ACADEMY_STATE.view =
            "lesson";


        renderLesson();


        document.dispatchEvent(
            new CustomEvent(
                "chemlab:academy-lesson-opened",
                {
                    detail: {
                        subject,
                        topic,
                        lesson:
                            lessons[safeIndex],
                        lessonIndex:
                            safeIndex
                    }
                }
            )
        );


        return lessons[safeIndex];

    }


    /* =====================================================
       06. RENDER LESSON
       ===================================================== */

    function renderLesson() {

        const learnSection =
            document.querySelector(
                '[data-page="learn"]'
            );


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


        const lessons =
            getLessons(
                subject.id,
                topic.id
            );


        if (!lessons.length) {

            renderNoLessonContent(
                learnSection
            );

            return;

        }


        const lesson =
            lessons[
                ACADEMY_STATE.currentLessonIndex
            ];


        const existing =
            document.getElementById(
                "academyLessonViewer"
            );


        if (existing) {
            existing.remove();
        }


        const subjectGrid =
            document.getElementById(
                "academySubjectGrid"
            );


        if (subjectGrid) {
            subjectGrid.hidden = true;
        }


        const explorer =
            document.getElementById(
                "academySubjectExplorer"
            );


        if (explorer) {
            explorer.remove();
        }


        const topicLearning =
            document.getElementById(
                "academyTopicLearning"
            );


        if (topicLearning) {
            topicLearning.remove();
        }


        const viewer =
            document.createElement(
                "section"
            );


        viewer.id =
            "academyLessonViewer";


        viewer.className =
            "academy-lesson-viewer";


        /* ---------------------------------------------
           TOP NAVIGATION
           --------------------------------------------- */

        const top =
            document.createElement(
                "div"
            );


        top.className =
            "academy-lesson-top";


        const backButton =
            createButton(
                "← Back to " + topic.title,
                "button button-secondary"
            );


        backButton.addEventListener(
            "click",
            function () {

                openTopic(
                    subject.id,
                    topic.id
                );

            }
        );


        const lessonPosition =
            document.createElement(
                "span"
            );


        lessonPosition.className =
            "academy-lesson-position";


        lessonPosition.textContent =
            "Lesson " +
            (ACADEMY_STATE.currentLessonIndex + 1) +
            " of " +
            lessons.length;


        top.appendChild(
            backButton
        );

        top.appendChild(
            lessonPosition
        );


        viewer.appendChild(
            top
        );


        /* ---------------------------------------------
           PROGRESS BAR
           --------------------------------------------- */

        const progressWrapper =
            document.createElement(
                "div"
            );


        progressWrapper.className =
            "academy-lesson-progress";


        const progressValue =
            lessons.length
                ? Math.round(
                    (
                        ACADEMY_STATE.currentLessonIndex
                        /
                        lessons.length
                    ) * 100
                )
                : 0;


        const progressBar =
            document.createElement(
                "span"
            );


        progressBar.style.width =
            progressValue + "%";


        progressWrapper.appendChild(
            progressBar
        );


        viewer.appendChild(
            progressWrapper
        );


        /* ---------------------------------------------
           HEADER
           --------------------------------------------- */

        const header =
            document.createElement(
                "header"
            );


        header.className =
            "academy-lesson-header";


        const eyebrow =
            document.createElement(
                "span"
            );


        eyebrow.className =
            "eyebrow";


        eyebrow.textContent =
            topic.title;


        const title =
            document.createElement(
                "h1"
            );


        title.textContent =
            lesson.title;


        const subtitle =
            document.createElement(
                "p"
            );


        subtitle.textContent =
            "Lesson " +
            (ACADEMY_STATE.currentLessonIndex + 1) +
            " • " +
            subject.name;


        header.appendChild(
            eyebrow
        );

        header.appendChild(
            title
        );

        header.appendChild(
            subtitle
        );


        viewer.appendChild(
            header
        );


        /* ---------------------------------------------
           LESSON BODY
           --------------------------------------------- */

        const bodyGrid =
            document.createElement(
                "div"
            );


        bodyGrid.className =
            "academy-lesson-body-grid";


        const main =
            document.createElement(
                "main"
            );


        main.className =
            "academy-lesson-main";


        /* Learning objectives */

        const objectives =
            document.createElement(
                "section"
            );


        objectives.className =
            "academy-lesson-block";


        const objectivesTitle =
            document.createElement(
                "h2"
            );


        objectivesTitle.textContent =
            "Learning Objectives";


        objectives.appendChild(
            objectivesTitle
        );


        const objectivesList =
            document.createElement(
                "ul"
            );


        objectivesList.className =
            "academy-lesson-objectives";


        (lesson.objectives || [])
            .forEach(
                objective => {

                    const item =
                        document.createElement(
                            "li"
                        );


                    item.textContent =
                        objective;


                    objectivesList.appendChild(
                        item
                    );

                }
            );


        objectives.appendChild(
            objectivesList
        );


        main.appendChild(
            objectives
        );


        /* Lesson content */

        const content =
            document.createElement(
                "section"
            );


        content.className =
            "academy-lesson-block academy-lesson-content";


        content.innerHTML =
            lesson.content || "";


        main.appendChild(
            content
        );


        /* Key points */

        if (
            lesson.keyPoints &&
            lesson.keyPoints.length
        ) {

            const keyBlock =
                document.createElement(
                    "section"
                );


            keyBlock.className =
                "academy-lesson-block academy-key-points";


            const keyTitle =
                document.createElement(
                    "h2"
                );


            keyTitle.textContent =
                "Key Points";


            keyBlock.appendChild(
                keyTitle
            );


            const list =
                document.createElement(
                    "ul"
                );


            lesson.keyPoints.forEach(
                point => {

                    const item =
                        document.createElement(
                            "li"
                        );


                    item.textContent =
                        point;


                    list.appendChild(
                        item
                    );

                }
            );


            keyBlock.appendChild(
                list
            );


            main.appendChild(
                keyBlock
            );

        }


        /* Worked example */

        if (lesson.example) {

            const example =
                document.createElement(
                    "section"
                );


            example.className =
                "academy-lesson-block academy-worked-example";


            const exampleTitle =
                document.createElement(
                    "h2"
                );


            exampleTitle.textContent =
                lesson.example.title ||
                "Worked Example";


            const question =
                document.createElement(
                    "p"
                );


            question.innerHTML =
                "<strong>Question:</strong> " +
                lesson.example.question;


            const answer =
                document.createElement(
                    "div"
                );


            answer.className =
                "academy-example-answer";


            answer.innerHTML =
                "<strong>Answer:</strong> " +
                lesson.example.answer;


            example.appendChild(
                exampleTitle
            );

            example.appendChild(
                question
            );

            example.appendChild(
                answer
            );


            main.appendChild(
                example
            );

        }


        /* Knowledge check */

        if (lesson.check) {

            renderKnowledgeCheck(
                main,
                lesson.check,
                subject.id,
                topic.id,
                ACADEMY_STATE.currentLessonIndex
            );

        }


        bodyGrid.appendChild(
            main
        );


        /* ---------------------------------------------
           SIDEBAR
           --------------------------------------------- */

        const side =
            document.createElement(
                "aside"
            );


        side.className =
            "academy-lesson-sidebar";


        const sideCard =
            document.createElement(
                "div"
            );


        sideCard.className =
            "academy-lesson-sidebar-card";


        const sideTitle =
            document.createElement(
                "h3"
            );


        sideTitle.textContent =
            "Your Progress";


        sideCard.appendChild(
            sideTitle
        );


        const completed =
            lessons.reduce(
                (count, item, index) =>
                    count +
                    (
                        isLessonCompleted(
                            subject.id,
                            topic.id,
                            index
                        )
                            ? 1
                            : 0
                    ),
                0
            );


        const completion =
            Math.round(
                (
                    completed /
                    lessons.length
                ) * 100
            );


        const progressText =
            document.createElement(
                "strong"
            );


        progressText.textContent =
            completion + "%";


        sideCard.appendChild(
            progressText
        );


        const progress =
            document.createElement(
                "div"
            );


        progress.className =
            "progress";


        const progressFill =
            document.createElement(
                "span"
            );


        progressFill.className =
            "progress-bar";


        progressFill.style.width =
            completion + "%";


        progress.appendChild(
            progressFill
        );


        sideCard.appendChild(
            progress
        );


        const sideMeta =
            document.createElement(
                "p"
            );


        sideMeta.textContent =
            completed +
            " of " +
            lessons.length +
            " lessons completed";


        sideCard.appendChild(
            sideMeta
        );


        /* Lesson list */

        const lessonList =
            document.createElement(
                "div"
            );


        lessonList.className =
            "academy-lesson-list";


        lessons.forEach(
            (item, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "academy-lesson-list-item";


                if (
                    index ===
                    ACADEMY_STATE.currentLessonIndex
                ) {

                    button.classList.add(
                        "is-active"
                    );

                }


                if (
                    isLessonCompleted(
                        subject.id,
                        topic.id,
                        index
                    )
                ) {

                    button.classList.add(
                        "is-complete"
                    );

                }


                const number =
                    document.createElement(
                        "span"
                    );


                number.textContent =
                    String(index + 1)
                        .padStart(2, "0");


                const name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    item.title;


                button.appendChild(
                    number
                );

                button.appendChild(
                    name
                );


                button.addEventListener(
                    "click",
                    function () {

                        openLesson(
                            subject.id,
                            topic.id,
                            index
                        );

                    }
                );


                lessonList.appendChild(
                    button
                );

            }
        );


        sideCard.appendChild(
            lessonList
        );


        side.appendChild(
            sideCard
        );


        bodyGrid.appendChild(
            side
        );


        viewer.appendChild(
            bodyGrid
        );


        /* ---------------------------------------------
           COMPLETE + NAVIGATION
           --------------------------------------------- */

        const footer =
            document.createElement(
                "div"
            );


        footer.className =
            "academy-lesson-footer";


        const completedAlready =
            isLessonCompleted(
                subject.id,
                topic.id,
                ACADEMY_STATE.currentLessonIndex
            );


        const completeButton =
            createButton(
                completedAlready
                    ? "✓ Lesson Completed"
                    : "Mark Lesson Complete",
                completedAlready
                    ? "button button-secondary is-complete"
                    : "button button-primary"
            );


        completeButton.disabled =
            completedAlready;


        completeButton.addEventListener(
            "click",
            function () {

                markLessonCompleted(
                    subject.id,
                    topic.id,
                    ACADEMY_STATE.currentLessonIndex
                );


                renderLesson();

            }
        );


        const navigation =
            document.createElement(
                "div"
            );


        navigation.className =
            "academy-lesson-navigation";


        const previous =
            createButton(
                "← Previous",
                "button button-secondary"
            );


        previous.disabled =
            ACADEMY_STATE.currentLessonIndex === 0;


        previous.addEventListener(
            "click",
            function () {

                openLesson(
                    subject.id,
                    topic.id,
                    ACADEMY_STATE.currentLessonIndex - 1
                );

            }
        );


        const next =
            createButton(
                ACADEMY_STATE.currentLessonIndex ===
                lessons.length - 1
                    ? "Finish Topic"
                    : "Next Lesson →",
                "button button-primary"
            );


        next.addEventListener(
            "click",
            function () {

                if (
                    !isLessonCompleted(
                        subject.id,
                        topic.id,
                        ACADEMY_STATE.currentLessonIndex
                    )
                ) {

                    markLessonCompleted(
                        subject.id,
                        topic.id,
                        ACADEMY_STATE.currentLessonIndex
                    );

                }


                if (
                    ACADEMY_STATE.currentLessonIndex <
                    lessons.length - 1
                ) {

                    openLesson(
                        subject.id,
                        topic.id,
                        ACADEMY_STATE.currentLessonIndex + 1
                    );

                } else {

                    setTopicProgress(
                        subject.id,
                        topic.id,
                        100
                    );


                    showTopicCompletion(
                        subject,
                        topic
                    );

                }

            }
        );


        navigation.appendChild(
            previous
        );

        navigation.appendChild(
            next
        );


        footer.appendChild(
            completeButton
        );

        footer.appendChild(
            navigation
        );


        viewer.appendChild(
            footer
        );


        learnSection.appendChild(
            viewer
        );

    }


    /* =====================================================
       07. KNOWLEDGE CHECK
       ===================================================== */

    function renderKnowledgeCheck(
        parent,
        check,
        subjectId,
        topicId,
        lessonIndex
    ) {

        const block =
            document.createElement(
                "section"
            );


        block.className =
            "academy-knowledge-check academy-lesson-block";


        const title =
            document.createElement(
                "h2"
            );


        title.textContent =
            "Knowledge Check";


        block.appendChild(
            title
        );


        const question =
            document.createElement(
                "p"
            );


        question.className =
            "academy-check-question";


        question.textContent =
            check.question;


        block.appendChild(
            question
        );


        const options =
            document.createElement(
                "div"
            );


        options.className =
            "academy-check-options";


        let selected =
            null;


        check.options.forEach(
            (option, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "academy-check-option";


                button.textContent =
                    option;


                button.addEventListener(
                    "click",
                    function () {

                        selected =
                            index;


                        options
                            .querySelectorAll(
                                ".academy-check-option"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "is-selected"
                                    )
                            );


                        button.classList.add(
                            "is-selected"
                        );

                    }
                );


                options.appendChild(
                    button
                );

            }
        );


        block.appendChild(
            options
        );


        const feedback =
            document.createElement(
                "div"
            );


        feedback.className =
            "academy-check-feedback";


        const checkButton =
            createButton(
                "Check Answer",
                "button button-primary"
            );


        checkButton.addEventListener(
            "click",
            function () {

                if (selected === null) {

                    feedback.textContent =
                        "Select an answer first.";

                    feedback.className =
                        "academy-check-feedback is-warning";

                    return;

                }


                if (
                    selected ===
                    check.answer
                ) {

                    feedback.textContent =
                        "Correct. You understand this concept.";

                    feedback.className =
                        "academy-check-feedback is-success";


                    addScienceXP(5);

                } else {

                    feedback.textContent =
                        "Not quite. Review the lesson explanation and try again.";

                    feedback.className =
                        "academy-check-feedback is-error";

                }

            }
        );


        block.appendChild(
            checkButton
        );

        block.appendChild(
            feedback
        );


        parent.appendChild(
            block
        );

    }


    /* =====================================================
       08. TOPIC COMPLETION
       ===================================================== */

    function showTopicCompletion(
        subject,
        topic
    ) {

        const viewer =
            document.getElementById(
                "academyLessonViewer"
            );


        if (!viewer) {
            return;
        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "academy-completion-panel";


        const icon =
            document.createElement(
                "div"
            );


        icon.className =
            "academy-completion-icon";


        icon.textContent =
            "✓";


        const title =
            document.createElement(
                "h2"
            );


        title.textContent =
            "Topic Complete";


        const text =
            document.createElement(
                "p"
            );


        text.textContent =
            "You completed the available lessons for " +
            topic.title +
            ".";


        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "academy-topic-actions";


        const back =
            createButton(
                "Back to Subject",
                "button button-secondary"
            );


        back.addEventListener(
            "click",
            function () {

                openTopic(
                    subject.id,
                    topic.id
                );

            }
        );


        const next =
            createButton(
                "Explore More Topics →",
                "button button-primary"
            );


        next.addEventListener(
            "click",
            function () {

                openSubject(
                    subject.id
                );

            }
        );


        actions.appendChild(
            back
        );

        actions.appendChild(
            next
        );


        overlay.appendChild(
            icon
        );

        overlay.appendChild(
            title
        );

        overlay.appendChild(
            text
        );

        overlay.appendChild(
            actions
        );


        viewer.appendChild(
            overlay
        );


        addScienceXP(25);

    }


    /* =====================================================
       09. NO LESSON CONTENT
       ===================================================== */

    function renderNoLessonContent(
        learnSection
    ) {

        const existing =
            document.getElementById(
                "academyLessonViewer"
            );


        if (existing) {
            existing.remove();
        }


        const message =
            document.createElement(
                "section"
            );


        message.id =
            "academyLessonViewer";


        message.className =
            "academy-lesson-viewer card";


        message.innerHTML = `
            <div class="academy-empty-state">
                <div class="academy-empty-icon">📖</div>
                <h2>Lesson content is being prepared</h2>
                <p>
                    This topic is already part of the ChemLab curriculum.
                    Its detailed lesson content will be added to the Academy
                    content library.
                </p>
            </div>
        `;


        learnSection.appendChild(
            message
        );

    }


    /* =====================================================
       10. BUTTON HELPER
       ===================================================== */

    function createButton(
        text,
        className
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            className;


        button.textContent =
            text;


        return button;

    }


    /* =====================================================
       11. SUBJECT EXPLORER
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
            return null;
        }


        ACADEMY_STATE.currentSubject =
            subject;

        ACADEMY_STATE.currentTopic =
            topic;

        ACADEMY_STATE.currentLessonIndex =
            0;

        ACADEMY_STATE.view =
            "topic";


        renderTopic();


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


    function renderTopic() {

        const learnSection =
            document.querySelector(
                '[data-page="learn"]'
            );


        if (!learnSection) {
            return;
        }


        document
            .getElementById(
                "academySubjectGrid"
            )
            ?.setAttribute(
                "hidden",
                ""
            );


        document
            .getElementById(
                "academySubjectExplorer"
            )
            ?.remove();


        document
            .getElementById(
                "academyLessonViewer"
            )
            ?.remove();


        const old =
            document.getElementById(
                "academyTopicLearning"
            );


        if (old) {
            old.remove();
        }


        const subject =
            ACADEMY_STATE.currentSubject;

        const topic =
            ACADEMY_STATE.currentTopic;


        const lessons =
            getLessons(
                subject.id,
                topic.id
            );


        const wrapper =
            document.createElement(
                "section"
            );


        wrapper.id =
            "academyTopicLearning";


        wrapper.className =
            "academy-topic-learning card";


        const back =
            createButton(
                "← Back to " + subject.name,
                "button button-secondary"
            );


        back.addEventListener(
            "click",
            function () {

                openSubject(
                    subject.id
                );

            }
        );


        wrapper.appendChild(
            back
        );


        const header =
            document.createElement(
                "div"
            );


        header.className =
            "academy-topic-learning-header";


        header.innerHTML = `
            <span class="eyebrow">${subject.name}</span>
            <h2>${topic.title}</h2>
            <p>${topic.description}</p>
        `;


        wrapper.appendChild(
            header
        );


        const metadata =
            document.createElement(
                "div"
            );


        metadata.className =
            "academy-topic-learning-meta";


        const items = [

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
            ]

        ];


        items.forEach(
            item => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "academy-topic-meta-item";


                card.innerHTML =
                    `
                        <span>${item[0]}</span>
                        <strong>${item[1]}</strong>
                    `;


                metadata.appendChild(
                    card
                );

            }
        );


        wrapper.appendChild(
            metadata
        );


        const lessonGrid =
            document.createElement(
                "div"
            );


        lessonGrid.className =
            "academy-lesson-preview-grid";


        if (!lessons.length) {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "academy-empty-state";


            empty.innerHTML = `
                <div class="academy-empty-icon">📖</div>
                <h3>Lesson content is being prepared</h3>
                <p>
                    This topic is included in the ChemLab curriculum,
                    and detailed lessons will be added progressively.
                </p>
            `;


            lessonGrid.appendChild(
                empty
            );

        } else {

            lessons.forEach(
                (lesson, index) => {

                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "academy-lesson-preview-card";


                    if (
                        isLessonCompleted(
                            subject.id,
                            topic.id,
                            index
                        )
                    ) {

                        card.classList.add(
                            "is-complete"
                        );

                    }


                    card.innerHTML = `
                        <span class="academy-path-number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <h3>
                            ${lesson.title}
                        </h3>

                        <p>
                            ${lesson.type === "calculation"
                                ? "Concepts, calculations and guided examples."
                                : "Concept explanation, examples and knowledge check."
                            }
                        </p>

                        <span class="academy-lesson-status">
                            ${
                                isLessonCompleted(
                                    subject.id,
                                    topic.id,
                                    index
                                )
                                    ? "✓ Completed"
                                    : "Not started"
                            }
                        </span>
                    `;


                    const button =
                        createButton(
                            isLessonCompleted(
                                subject.id,
                                topic.id,
                                index
                            )
                                ? "Review Lesson →"
                                : "Start Lesson →",
                            "button button-primary"
                        );


                    button.addEventListener(
                        "click",
                        function () {

                            openLesson(
                                subject.id,
                                topic.id,
                                index
                            );

                        }
                    );


                    card.appendChild(
                        button
                    );


                    lessonGrid.appendChild(
                        card
                    );

                }
            );

        }


        wrapper.appendChild(
            lessonGrid
        );


        learnSection.appendChild(
            wrapper
        );

    }


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


    function renderSubjectExplorer() {

        const learnSection =
            document.querySelector(
                '[data-page="learn"]'
            );


        if (!learnSection) {
            return;
        }


        document
            .getElementById(
                "academySubjectGrid"
            )
            ?.setAttribute(
                "hidden",
                ""
            );


        document
            .getElementById(
                "academyTopicLearning"
            )
            ?.remove();


        document
            .getElementById(
                "academyLessonViewer"
            )
            ?.remove();


        const old =
            document.getElementById(
                "academySubjectExplorer"
            );


        if (old) {
            old.remove();
        }


        const subject =
            ACADEMY_STATE.currentSubject;


        const explorer =
            document.createElement(
                "section"
            );


        explorer.id =
            "academySubjectExplorer";


        explorer.className =
            "academy-subject-explorer card";


        const back =
            createButton(
                "← All Subjects",
                "button button-secondary"
            );


        back.addEventListener(
            "click",
            function () {

                closeExplorer();

            }
        );


        explorer.appendChild(
            back
        );


        explorer.innerHTML += `
            <div class="academy-explorer-header">
                <span class="eyebrow">
                    ${subject.category}
                </span>

                <h2>
                    ${subject.name}
                </h2>

                <p>
                    ${subject.description}
                </p>
            </div>
        `;


        const search =
            document.createElement(
                "input"
            );


        search.type =
            "search";


        search.className =
            "form-input academy-topic-search";


        search.placeholder =
            "Search topics in this subject...";


        search.addEventListener(
            "input",
            function () {

                renderTopicCards(
                    subject,
                    search.value,
                    explorer
                );

            }
        );


        explorer.appendChild(
            search
        );


        renderTopicCards(
            subject,
            "",
            explorer
        );


        learnSection.appendChild(
            explorer
        );

    }


    function renderTopicCards(
        subject,
        query,
        container
    ) {

        const oldGrid =
            container.querySelector(
                ".academy-topic-grid"
            );


        if (oldGrid) {
            oldGrid.remove();
        }


        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "academy-topic-grid";


        const term =
            normalizeText(query);


        const topics =
            subject.topics.filter(
                topic => {

                    if (!term) {
                        return true;
                    }


                    return normalizeText(
                        topic.title +
                        " " +
                        topic.description +
                        " " +
                        topic.difficulty
                    ).includes(term);

                }
            );


        topics.forEach(
            topic => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "academy-topic-card";


                const progress =
                    getTopicProgress(
                        subject.id,
                        topic.id
                    );


                card.innerHTML = `
                    <div class="academy-topic-card-header">

                        <span class="academy-topic-difficulty">
                            ${topic.difficulty}
                        </span>

                        <span class="academy-topic-duration">
                            ${formatMinutes(topic.duration)}
                        </span>

                    </div>

                    <h3>
                        ${topic.title}
                    </h3>

                    <p>
                        ${topic.description}
                    </p>

                    <div class="academy-topic-meta">
                        ${topic.lessons}
                        ${topic.lessons === 1 ? "lesson" : "lessons"}
                    </div>

                    <div class="academy-topic-progress">

                        <div class="academy-progress-label">
                            <span>Progress</span>
                            <strong>${progress}%</strong>
                        </div>

                        <div class="progress">
                            <span
                                class="progress-bar"
                                style="width:${progress}%"
                            ></span>
                        </div>

                    </div>
                `;


                const button =
                    createButton(
                        progress > 0
                            ? "Continue Learning →"
                            : "Explore Topic →",
                        "button button-primary"
                    );


                button.addEventListener(
                    "click",
                    function () {

                        openTopic(
                            subject.id,
                            topic.id
                        );

                    }
                );


                card.appendChild(
                    button
                );


                grid.appendChild(
                    card
                );

            }
        );


        if (!topics.length) {

            grid.innerHTML = `
                <div class="academy-empty-state">
                    <div class="academy-empty-icon">⌕</div>
                    <h3>No topics found</h3>
                    <p>
                        Try another search term.
                    </p>
                </div>
            `;

        }


        container.appendChild(
            grid
        );

    }


    function closeExplorer() {

        ACADEMY_STATE.currentSubject =
            null;

        ACADEMY_STATE.currentTopic =
            null;

        ACADEMY_STATE.view =
            "subjects";


        document
            .getElementById(
                "academySubjectExplorer"
            )
            ?.remove();


        document
            .getElementById(
                "academyTopicLearning"
            )
            ?.remove();


        document
            .getElementById(
                "academyLessonViewer"
            )
            ?.remove();


        const grid =
            document.getElementById(
                "academySubjectGrid"
            );


        if (grid) {
            grid.hidden = false;
        }

    }


    /* =====================================================
       12. SEARCH
       ===================================================== */

    function search(query) {

        const term =
            normalizeText(query);


        ACADEMY_STATE.searchQuery =
            term;


        let results =
            ACADEMY_CURRICULUM.slice();


        if (term) {

            results =
                results.filter(
                    subject =>
                        normalizeText(
                            subject.name +
                            " " +
                            subject.description +
                            " " +
                            subject.category +
                            " " +
                            subject.topics
                                .map(
                                    topic =>
                                        topic.title +
                                        " " +
                                        topic.description
                                )
                                .join(" ")
                        ).includes(term)
                );

        }


        if (
            ACADEMY_STATE.currentLevel !==
            "all"
        ) {

            results =
                results.filter(
                    subject =>
                        subject.level ===
                        ACADEMY_STATE.currentLevel
                );

        }


        ACADEMY_STATE.filteredSubjects =
            results;


        return results;

    }


    /* =====================================================
       13. LEVEL FILTER
       ===================================================== */

    function filterByLevel(level) {

        ACADEMY_STATE.currentLevel =
            normalizeText(level) ||
            "all";


        return search(
            ACADEMY_STATE.searchQuery
        );

    }


    /* =====================================================
       14. STATISTICS
       ===================================================== */

    function getTotalTopics() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) =>
                total +
                subject.topics.length,
            0
        );

    }


    function getTotalLessons() {

        return ACADEMY_CURRICULUM.reduce(
            (total, subject) =>
                total +
                subject.topics.reduce(
                    (sum, topic) =>
                        sum + topic.lessons,
                    0
                ),
            0
        );

    }


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
       15. SEARCH BINDING
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


                renderSubjectGrid();


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
       16. FILTER BINDING
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


                        renderSubjectGrid();

                    }
                );

            }
        );

    }


    /* =====================================================
       17. SUBJECT GRID
       ===================================================== */

    function renderSubjectGrid() {

        const grid =
            document.getElementById(
                "academySubjectGrid"
            );


        if (!grid) {
            return;
        }


        grid.innerHTML = "";


        ACADEMY_STATE.filteredSubjects
            .forEach(
                subject => {

                    const progress =
                        subject.topics.length
                            ? Math.round(
                                subject.topics.reduce(
                                    (sum, topic) =>
                                        sum +
                                        getTopicProgress(
                                            subject.id,
                                            topic.id
                                        ),
                                    0
                                ) /
                                subject.topics.length
                            )
                            : 0;


                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "academy-subject-card";


                    card.innerHTML = `
                        <div class="academy-subject-header">

                            <span class="academy-subject-icon">
                                ${subject.icon}
                            </span>

                            <span class="academy-subject-level">
                                ${subject.level.toUpperCase()}
                            </span>

                        </div>

                        <h3>
                            ${subject.name}
                        </h3>

                        <p>
                            ${subject.description}
                        </p>

                        <div class="academy-subject-meta">

                            <span>
                                ${subject.topics.length} Topics
                            </span>

                            <span>•</span>

                            <span>
                                ${subject.category}
                            </span>

                        </div>

                        <div class="academy-subject-progress">

                            <div class="academy-progress-label">

                                <span>
                                    Mastery
                                </span>

                                <strong>
                                    ${progress}%
                                </strong>

                            </div>

                            <div class="progress">

                                <span
                                    class="progress-bar"
                                    style="width:${progress}%"
                                ></span>

                            </div>

                        </div>
                    `;


                    const button =
                        createButton(
                            "Explore Subject →",
                            "button button-secondary academy-explore-button"
                        );


                    button.addEventListener(
                        "click",
                        function () {

                            openSubject(
                                subject.id
                            );

                        }
                    );


                    card.appendChild(
                        button
                    );


                    grid.appendChild(
                        card
                    );

                }
            );


        if (
            !ACADEMY_STATE.filteredSubjects.length
        ) {

            grid.innerHTML = `
                <div class="academy-empty-state">
                    <div class="academy-empty-icon">⌕</div>
                    <h3>No chemistry subjects found</h3>
                    <p>
                        Try another search or academic level.
                    </p>
                </div>
            `;

        }

    }


    /* =====================================================
       18. INITIALIZE
       ===================================================== */

    function initialize() {

        if (ACADEMY_STATE.initialized) {
            return;
        }


        ACADEMY_STATE.subjects =
            ACADEMY_CURRICULUM.slice();


        ACADEMY_STATE.filteredSubjects =
            ACADEMY_CURRICULUM.slice();


        renderStatistics();

        bindSearch();

        bindLevelFilters();

        renderSubjectGrid();


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
       19. PUBLIC API
       ===================================================== */

    window.CHEMLAB_ACADEMY = {

        initialize,

        getSubject,

        getTopic,

        getLessons,

        getTotalTopics,

        getTotalLessons,

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

        getState:
            function () {

                return {
                    initialized:
                        ACADEMY_STATE.initialized,

                    view:
                        ACADEMY_STATE.view,

                    currentSubject:
                        ACADEMY_STATE.currentSubject,

                    currentTopic:
                        ACADEMY_STATE.currentTopic,

                    currentLessonIndex:
                        ACADEMY_STATE.currentLessonIndex,

                    searchQuery:
                        ACADEMY_STATE.searchQuery,

                    currentLevel:
                        ACADEMY_STATE.currentLevel
                };

            }

    };


    /* =====================================================
       20. START
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

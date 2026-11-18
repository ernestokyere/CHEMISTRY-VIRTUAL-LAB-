
"use strict";

window.ChemLab = {
  version: "1.0.0",
  initialized: false,

  config: {
    name: "ChemLab",
    description: "Digital Chemistry Laboratory",
    theme: "light",
    academicLevels: ["SHS", "University"]
  },

  state: {
    currentRoute: "dashboard",
    user: null
  },

  init() {
    if (this.initialized) return;

    this.initialized = true;

    console.info(
      `ChemLab v${this.version} initialized.`
    );
  }
};

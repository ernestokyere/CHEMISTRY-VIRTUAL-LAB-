
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  if (!window.ChemLab) {
    console.error("ChemLab core failed to load.");
    return;
  }

  if (!window.ChemLabRouter) {
    console.error("ChemLab router failed to load.");
    return;
  }

  ChemLab.init();

  const yearElement =
    document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }

  document.documentElement.dataset.theme = "light";

  ChemLabRouter.start();

  console.info("ChemLab application ready.");

});

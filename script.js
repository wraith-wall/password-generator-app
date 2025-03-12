"use strict";
const slider = document.getElementById("char-length");
const output = document.getElementById("char-length-value");
const checkboxes = document.querySelectorAll(".app__checkbox");
const generateBtn = document.querySelector(".app__generate");
const passwordSpan = document.querySelector(".app__password");
const strengthValue = document.querySelector(".app__strength-value");
const bars = document.querySelectorAll(".app__bar");
const copyBtn = document.querySelector(".app__copy");
const copiedSpan = document.querySelector(".app__copied");

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

copyBtn.addEventListener("click", () => {
  const password = document.querySelector(".app__password").textContent;
  navigator.clipboard
    .writeText(password)
    .then(() => {
      copiedSpan.textContent = "copied";
      setTimeout(() => {
        copiedSpan.textContent = "";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

slider.addEventListener("input", () => {
  output.value = slider.value;
  updateTrackColor();
});

function updateTrackColor() {
  const value = slider.value;
  const min = slider.min || 0;
  const max = slider.max || 20;
  const percent = ((value - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, #a4ffaf ${percent}%, #18171f ${percent}%)`;
}
output.value = slider.value;

function calculateStrength(length, charTypesUsed) {
  if (length <= 3) return null;
  const score = length * charTypesUsed;
  if (score < 10) return "too weak!";
  if (score < 20) return "weak";
  if (score < 30) return "medium";
  return "strong";
}

function generatePassword(length) {
  let charSet = "";
  let password = "";
  let charTypesUsed = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      if (checkbox.id === "uppercase") {
        charSet += uppercase;
        charTypesUsed++;
      }
      if (checkbox.id === "lowercase") {
        charSet += lowercase;
        charTypesUsed++;
      }
      if (checkbox.id === "numbers") {
        charSet += numbers;
        charTypesUsed++;
      }
      if (checkbox.id === "symbols") {
        charSet += symbols;
        charTypesUsed++;
      }
    }
  });

  if (charSet === "") {
    charSet = uppercase + lowercase + numbers + symbols;
    charTypesUsed = 4;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  }

  return { password, charTypesUsed };
}

function updateBars(strength) {
  bars.forEach((bar) => {
    bar.className = "app__bar";
  });

  if (strength) {
    switch (strength) {
      case "too weak!":
        bars[0].className = "app__bar filled-too-weak";
        break;
      case "weak":
        bars[0].className = "app__bar filled-weak";
        bars[1].className = "app__bar filled-weak";
        break;
      case "medium":
        bars[0].className = "app__bar filled-medium";
        bars[1].className = "app__bar filled-medium";
        bars[2].className = "app__bar filled-medium";
        break;
      case "strong":
        bars.forEach((bar) => (bar.className = "app__bar filled-strong"));
        break;
    }
  }
}

generateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const length = parseInt(slider.value);

  if (length > 3) {
    const { password, charTypesUsed } = generatePassword(length);
    passwordSpan.textContent = password;
    passwordSpan.style.opacity = "1";
    const strength = calculateStrength(length, charTypesUsed);
    strengthValue.textContent = strength || "";
    updateBars(strength);
  } else {
    passwordSpan.textContent = "Too short!";
    strengthValue.textContent = "";
    updateBars(null);
  }
});

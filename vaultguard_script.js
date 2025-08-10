let serviceInput = document.querySelector("#service");
let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let saveCredentialBtn = document.querySelector("#saveCredential");
let credentialsList = document.querySelector("#credentialsList");
let [deletePasskey, editPasskey, viewPasskey] = [
  "****wants2delete",
  "****wants2edit",
  "****wants2view",
];
let credentialsArray =
  JSON.parse(localStorage.getItem("credentialsData")) || [];
// credentialsArray = [];
// let deleteCredentialBtns = document.querySelectorAll(".delete");
// let editCredentialBtns = document.querySelectorAll(".edit");

credentialsArray.forEach(renderCredentials);
updateEmptyState();

function saveToLocalStorage() {
  localStorage.setItem("credentialsData", JSON.stringify(credentialsArray));
}

saveCredentialBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    serviceInput.value === "" ||
    usernameInput.value === "" ||
    passwordInput.value === ""
  ) {
    alert("Please fill all the fields");
    return;
  }
  let editId = saveCredentialBtn.getAttribute("data-edit-id");
  if (editId) {
    let editCredIndex = credentialsArray.findIndex(
      (c) => c.credentialId == editId
    );
    credentialsArray[editCredIndex] = {
      service: serviceInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      credentialId: editId,
    };
    // re-render all credentials
    credentialsList.innerHTML = "";
    credentialsArray.forEach(renderCredentials);
    saveToLocalStorage();

    // remove the "data-edit-id" attribute from the button
    saveCredentialBtn.removeAttribute("data-edit-id");
  } else {
    let newCredential = {
      service: serviceInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      credentialId: Date.now(),
    };
    credentialsArray.push(newCredential);
    renderCredentials(newCredential);
    saveToLocalStorage();
    updateEmptyState();
  }

  // Clear input fields
  serviceInput.value = "";
  usernameInput.value = "";
  passwordInput.value = "";
  // console.log(credentialsArray);
});

function renderCredentials(credential) {
  let credentialCard = document.createElement("div");
  credentialCard.classList.add(
    "credential-card",
    "bg-gray-800",
    "rounded-xl",
    "p-5",
    "shadow",
    "flex",
    "flex-col",
    "sm:flex-row",
    "sm:justify-between",
    "sm:items-center"
  );
  credentialCard.setAttribute("data-id", credential.credentialId);
  credentialCard.innerHTML = `<div>
                    <h3 class="serviceVal text-lg font-bold capitalize">${credential.service}</h3>
                    <p class="emailVal text-sm text-gray-400">${credential.username}</p>
                    <p class="passwordVal text-sm text-gray-400 cursor-pointer">xxxxxxxx</p>
                  </div>
                  <div class="flex gap-3 mt-4 sm:mt-0">
                    <button class="toggleShow text-blue-400 hover:text-blue-600 transition cursor-pointer opacity-50" disabled>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button class="edit text-green-400 hover:text-green-600 transition cursor-pointer opacity-50" data-id="${credential.credentialId}" disabled>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M4 4v16h16V4H4zm4 4h8v2H8V8zm0 4h5v2H8v-2z" />
                      </svg>
                    </button>
                    <button class="delete text-red-400 hover:text-red-600 transition cursor-pointer opacity-50" disabled>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>`;
  credentialsList.appendChild(credentialCard);
}

credentialsList.addEventListener("click", (e) => {
  if (
    e.target.closest(".delete") ||
    e.target.closest(".edit") ||
    e.target.closest(".toggleShow")
  ) {
    if (!isEnabled) {
      alert("Permissions are disabled. Toggle them ON to proceed.");
      return;
    }
  }

  if (e.target.closest(".delete")) {
    let deleteConfirmation = confirm(
      "Are you sure you want to delete this credential?"
    );
    if (deleteConfirmation) {
      let userPasskey = prompt(
        "Enter the corresponding passkey to confirm deletion"
      );
      if (deletePasskey == userPasskey) {
        let deleteThisCred = e.target.closest(".credential-card");
        let cardId = deleteThisCred.getAttribute("data-id");
        // Remove from DOM
        deleteThisCred.remove();
        // Remove from credentialsArray
        credentialsArray = credentialsArray.filter(
          (cred) => cred.credentialId != cardId
        );
        saveToLocalStorage();
        updateEmptyState();
        serviceInput.value = "";
        usernameInput.value = "";
        passwordInput.value = "";
      } else {
        alert("Incorrect Passkey");
        return;
      }
    } else {
      return;
    }
    // let deleteThisCred = e.target.closest(".credential-card");
    // let cardId = deleteThisCred.getAttribute("data-id");

    // // Remove from DOM
    // deleteThisCred.remove();
    // // Remove from credentialsArray
    // credentialsArray = credentialsArray.filter(
    //   (cred) => cred.credentialId != cardId
    // );
    // saveToLocalStorage();
    // updateEmptyState();
  }
  if (e.target.closest(".edit")) {
    let editorAuth = confirm(
      "You need to verify your identity to edit this credential, enter the passkey!"
    );
    if (!editorAuth) {
      return;
    } else {
      let userPasskey = prompt(
        "Enter the corresponding passkey to confirm edit"
      );
      if (editPasskey != userPasskey) {
        alert("Incorrect Passkey");
        return;
      } else {
        // return;
        // only allow one edit at a time
        if (!saveCredentialBtn.hasAttribute("data-edit-id")) {
          let card = e.target.closest(".credential-card");
          card.classList.remove("bg-gray-800");
          card.style.backgroundColor = "#212f4a";
          let cardId = card.getAttribute("data-id");
          let cred = credentialsArray.find((c) => c.credentialId == cardId);

          serviceInput.value = cred.service;
          usernameInput.value = cred.username;
          passwordInput.value = cred.password;

          // Store this edit ID in the form (hidden state)
          saveCredentialBtn.setAttribute("data-edit-id", cardId);
          // console.log("Editing:", cred);
        }
      }
    }
  }

  if (e.target.closest(".toggleShow")) {
    let card = e.target.closest(".credential-card");
    let cardId = card.getAttribute("data-id");
    let cred = credentialsArray.find((c) => c.credentialId == cardId);
    let passwordVal = card.querySelector(".passwordVal");
    // if (passwordVal.textContent == "xxxxxxxx") {
    //   passwordVal.textContent = cred.password;
    // } else {
    //   passwordVal.textContent = "xxxxxxxx";
    // }
    if (passwordVal.textContent == "xxxxxxxx") {
      let userPasskey = prompt(
        "Enter the corresponding passkey to make this password visible"
      );
      if (viewPasskey === userPasskey) {
        // navigator.clipboard.writeText(e.target.textContent);
        passwordVal.textContent = cred.password;
        // passwordVal.style.color = "#11cc15"; // yellow shade from Tailwind
      } else {
        passwordVal.textContent = "xxxxxxxx";
        alert(
          "Incorrect Passkey! Enter correct one to make this password visible."
        );
        return;
      }
    } else {
      passwordVal.textContent = "xxxxxxxx";
    }
  }
});

function updateEmptyState() {
  const emptyMessage = document.getElementById("emptyMessage");
  emptyMessage.style.display = credentialsArray.length === 0 ? "block" : "none";
}

// togglerContainer.addEventListener("click", (e) => {
//   toggler.classList.toggle("translate-x-full");
//   e.target.classList.add("bg-blue-600");
// });
const togglerContainer = document.getElementById("toggler-container");
const toggler = document.getElementById("toggler");
const buttons = document.querySelectorAll(".toggleShow, .delete, .edit");

let isEnabled = false;

togglerContainer.addEventListener("click", () => {
  isEnabled = !isEnabled;

  // Move the toggle knob
  toggler.style.transform = isEnabled ? "translateX(100%)" : "translateX(0)";

  // Enable or disable buttons
  buttons.forEach((btn) => {
    btn.disabled = !isEnabled;
    btn.classList.toggle("opacity-50", !isEnabled);
    btn.classList.toggle("cursor-not-allowed", !isEnabled);
  });
});

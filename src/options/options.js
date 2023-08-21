// button element

const button = document.querySelector("#configBtn");
const keyInput = document.querySelector("#keyInput");
const alert = document.querySelector("#alert");

button.addEventListener("click", () => {
    // get value of keyInput
    let key = keyInput.value
    chrome.storage.sync.set({"OPENAI_API_KEY": key}).then(() => {
        alert.style.display = "block";
    })
})
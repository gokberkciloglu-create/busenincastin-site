const form = document.getElementById("derdimForm");
const statusMsg = document.getElementById("statusMsg");

function setStatus() {
  statusMsg.innerHTML = `
    <span class="line1">Mesajın gönderildi🍃</span>
    <span class="line2">Paylaştığın şey güvende. Ben buradayım ✨</span>
  `;
  statusMsg.classList.add("show");
}

function clearStatus() {
  statusMsg.innerHTML = "";
  statusMsg.classList.remove("show");
}

function setError(text) {
  statusMsg.innerHTML = `<span class="line1">${text}</span>`;
  statusMsg.classList.add("show");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();

  const rumuz = form.rumuz.value.trim();
  const dert = form.dert.value.trim();

  if (!rumuz || !dert) {
    setError("Lütfen rumuz ve derdini doldur 🤍");
    return;
  }

  try {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rumuz, dert }),
    });

    if (res.ok) {
      setStatus();
      form.reset();
      setTimeout(clearStatus, 6500);
      return;
    }

    if (res.status === 429) {
      setError("Biraz yavaş 🤍 1 dakika içinde en fazla 2 mesaj gönderebilirsin.");
      return;
    }

    setError("Bir hata oldu, tekrar dener misin?");
  } catch (err) {
    setError("Bağlantı hatası. Tekrar dener misin?");
  }
});

const bgAudio = document.getElementById("bgAudio");
const sendAudio = document.getElementById("sendAudio");
const audioToggle = document.getElementById("audioToggle");
let audioOn = false;

audioToggle.addEventListener("click", () => {
  audioOn = !audioOn;
  if(audioOn){
    bgAudio.volume = 0.18;
    bgAudio.play();
    audioToggle.textContent = "🔊";
  } else {
    bgAudio.pause();
    audioToggle.textContent = "🔈";
  }
});

// play send sound on success
const _origSetStatus = setStatus;
setStatus = function(){
  if(audioOn){
    sendAudio.volume = 0.25;
    sendAudio.play();
  }
  _origSetStatus();
};

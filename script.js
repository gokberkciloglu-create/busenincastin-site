const form = document.getElementById("derdimForm");
const statusMsg = document.getElementById("statusMsg");

function setStatus(text) {
  statusMsg.textContent = text;
  statusMsg.classList.add("show");
}

function clearStatus() {
  statusMsg.textContent = "";
  statusMsg.classList.remove("show");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();

  const rumuz = form.rumuz.value.trim();
  const dert = form.dert.value.trim();

  if (!rumuz || !dert) {
    setStatus("Lütfen rumuz ve derdini doldur 🤍");
    return;
  }

  try {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rumuz, dert }),
    });

    if (res.ok) {
      setStatus("Paylaştığın şey güvende. Ben buradayım ✨");
      form.reset();
      setTimeout(() => clearStatus(), 6000);
      return;
    }

    if (res.status === 429) {
      setStatus("Biraz yavaş 🤍 1 dakika içinde en fazla 2 mesaj gönderebilirsin.");
      return;
    }

    setStatus("Bir hata oldu, tekrar dene.");
  } catch (err) {
    setStatus("Bağlantı hatası. Tekrar dener misin?");
  }
});

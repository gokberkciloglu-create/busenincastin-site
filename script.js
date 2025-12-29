const form = document.getElementById("derdimForm");
const statusMsg = document.getElementById("statusMsg");

function setStatusTwoLine(line1, line2) {
  statusMsg.innerHTML = `
    <span class="line1">${line1}</span>
    <span class="line2">${line2}</span>
  `;
  statusMsg.classList.add("show");
}

function clearStatus() {
  statusMsg.innerHTML = "";
  statusMsg.classList.remove("show");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();

  const rumuz = form.rumuz.value.trim();
  const dert = form.dert.value.trim();

  if (!rumuz || !dert) {
    setStatusTwoLine("Bir şey eksik 🤍", "Rumuz ve derdini doldurur musun?");
    return;
  }

  try {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rumuz, dert }),
    });

    if (res.ok) {
      setStatusTwoLine("Mesajın gönderildi🍃", "Paylaştığın şey güvende. Ben buradayım ✨");
      form.reset();
      setTimeout(() => clearStatus(), 6500);
      return;
    }

    if (res.status === 429) {
      setStatusTwoLine("Biraz yavaş 🤍", "1 dakika içinde en fazla 2 mesaj gönderebilirsin.");
      return;
    }

    setStatusTwoLine("Bir hata oldu", "Tekrar dener misin?");
  } catch (err) {
    setStatusTwoLine("Bağlantı hatası", "Tekrar dener misin?");
  }
});

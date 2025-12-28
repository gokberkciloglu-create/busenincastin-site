const form = document.getElementById("derdimForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rumuz = form.rumuz.value.trim();
  const dert = form.dert.value.trim();

  if (!rumuz || !dert) {
    alert("Lütfen rumuz ve derdini doldur 🤍");
    return;
  }

  const res = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rumuz, dert }),
  });

  if (res.ok) {
    alert("Gönderildi 🤍");
    form.reset();
  } else {
    alert("Bir hata oldu, tekrar dene.");
  }
});

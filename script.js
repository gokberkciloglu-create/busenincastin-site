const form = document.getElementById("derdimForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    rumuz: form.rumuz.value.trim(),
    dert: form.dert.value.trim(),
  };

  if (!data.rumuz || !data.dert) {
    alert("Lütfen rumuz ve derdini doldur 🤍");
    return;
  }

  const res = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    alert("Gönderildi 🤍");
    form.reset();
  } else {
    alert("Bir hata oldu, tekrar dene.");
  }
});

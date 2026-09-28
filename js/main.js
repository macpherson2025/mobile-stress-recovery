(function () {
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const form = document.getElementById("intake-form");
  const status = document.getElementById("form-status");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNav(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setNav(false);
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.classList.remove("error");

    if (!form.reportValidity()) {
      status.textContent = "Please complete the required fields.";
      status.classList.add("error");
      return;
    }

    const payload = {
      name: form.name.value.trim(),
      title: form.title.value.trim(),
      company: form.company.value.trim(),
      location: form.location.value.trim(),
      team_size: form.team_size.value,
      message: form.message.value.trim(),
      _subject: "Corporate proposal request — Mobile Stress Recovery"
    };

    status.textContent = "Sending…";

    fetch("https://formsubmit.co/ajax/lea@mobilestressrecovery.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function () {
        form.reset();
        status.textContent =
          "Received. We will follow up with a corporate proposal shortly.";
      })
      .catch(function () {
        const body = [
          "Name: " + payload.name,
          "Title: " + payload.title,
          "Company: " + payload.company,
          "Location: " + payload.location,
          "Team size: " + payload.team_size,
          "",
          payload.message
        ].join("\n");

        window.location.href =
          "mailto:lea@mobilestressrecovery.com?subject=" +
          encodeURIComponent("Corporate proposal request") +
          "&body=" +
          encodeURIComponent(body);

        status.textContent =
          "Opening your email client so we still receive the request.";
      });
  });
})();

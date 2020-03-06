function onSignIn(googleUser) {
  // let profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log("Name: " + profile.getName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token;
  console.log("User successfully logged in.");
  // sent to server
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/users/googlesign",
    headers: {
      token: id_token
    }
  })
    .done(response => {
      console.log("Succesfully returned data");
      localStorage.setItem("token", response.token);
      showDashboard();
    })
    .fail(err => console.log(err))
    .always(alw => console.log(`Currently sending data...`));
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
  });
}

function showLanding() {
  $("#landing-page").show();
  $("#dashboard-page").hide();
}

function showDashboard() {
  $("#landing-page").hide();
  $("#dashboard-page").show();
}

function logOut() {
  localStorage.clear();
  showLanding();
  signOut();
}

$(document).ready(() => {
  console.log("ready");

  let token = localStorage.getItem("token");

  if (token) {
    showDashboard();
  } else {
    showLanding();
  }
  $("#landing-logout").on("click", logOut);

  $("#landing-login").on("click", e => {
    e.preventDefault();
    let email = $("#login-email").val();
    let password = $("#login-password").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/users/login",
      data: {
        email,
        password
      }
    })
      .done(response => {
        let token = response.token;
        localStorage.setItem("token", token);
        showDashboard();
      })
      .fail(err => console.log(err))
      .always(console.log("currently sending data..."));
  });
});

function onSignIn(googleUser) {
  // let profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log("Name: " + profile.getName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token;
  console.log("User successfully logged in.");
  localStorage.setItem("token", id_token);
  // sent to server
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/users/googlesign",
    headers: {
      token: localStorage.getItem("token")
    }
  })
  .done(response => console.log(response))
  .fail(err => console.log(err))
  .always(console.log(`Currently sending data...`))
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
  });
}

$("#btn-signout").on("click", signOut);

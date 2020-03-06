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
      localStorage.setItem("username", response.username);
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
  $("#landing-page-login").show();
  $("#landing-page-register").hide();
  $("#dashboard-page").hide();
}

function showDashboard() {
  $("#landing-page").hide();
  $("#dashboard-page").show();
  $("#landing-page-login").show();
  $("#landing-page-register").hide();
  $('#new-activity').hide()
  // $('$dashboard-past').hide()

}

function logOut() {
  localStorage.clear();
  showLanding();
  signOut();
}

function createActivity() {
  $('#generate-btn').on('click', e => {
    e.preventDefault()
    $.ajax({
      url: 'http://localhost:3000/activities/create',
      method: 'GET',
      headers: { token: localStorage.getItem('token') }
    })
      .done(activity => {
        console.log(activity)
        let newActivity = activity.newActivity
        let activityCard = `
        <div class="col-6 mx-auto">
          <div class="embed-responsive">
            <iframe class="embed-responsive-item" src="${newActivity.gif_url}" allowfullscreen></iframe>
          </div>
        </div>
        <div class="col-6 mx-auto">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${newActivity.name}</h5>
              <p class="card-text">Generated at: ${newActivity.createdAt}</p>
            </div>
          </div>
        </div>
        ` 
        $('#new-activity').html(activityCard)
        $('#new-activity').show()
      })
      .fail(err => {
        console.log(err)
      })
      .always(() => {
        console.log('fetching...')
        // $('#new-activity').html('<h3>Loading...</h3>')
      })
  })
}

//show activities
function activities () {
  console.log('pressed')
  $('#activities-btn').on('click', e => {
    e.preventDefault()
    // $('$dashboard-past').show()
    $("#landing-page").hide();
    $("#dashboard-page").hide();
    $("#landing-page-login").hide();
    $("#landing-page-register").hide();
    $('#new-activity').hide()
  })
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

  $("#switch-register").on("click", e => {
    e.preventDefault();
    $("#landing-page-login").hide();
    $("#landing-page-register").show();
  });

  $("#switch-login").on("click", e => {
    e.preventDefault();
    $("#landing-page-login").show();
    $("#landing-page-register").hide();
    $('#login-email').val('')
    $('#login-password').val('')
  });

  $("#landing-register").on("click", e => {
    e.preventDefault();
    let email = $("#register-email").val();
    let username = $("#register-username").val();
    let password = $("#register-password").val();
    console.log(email);
    console.log(username);
    console.log(password);
    $.ajax({
      method: "post",
      data: {
        email,
        username,
        password
      },
      url: "http://localhost:3000/users/register"
    })
      .done(() => {
        showLanding()
        $('#register-email').val('')
        $('#register-username').val('')
        $('#register-email').val('')
        console.log("Account creation successful, you may now login");
      })
      .fail(err => {
        console.log(err);
      })
      .always(() => console.log("currently sending data"));
  });

  $("#landing-login").on("click", e => {
    e.preventDefault();
    let email = $("#login-email").val();
    let password = $("#login-password").val();
    $.ajax({
      method: "post",
      url: "http://localhost:3000/users/login",
      data: {
        email,
        password
      }
    })
      .done(response => {
        let token = response.token;
        let username = response.username;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        showDashboard();
      })
      .fail(err => {
        console.log(err);
      })
      .always(console.log("currently sending data..."));
  });

  createActivity()
  activities()
});

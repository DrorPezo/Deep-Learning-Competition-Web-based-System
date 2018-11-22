$(document).ready(function(){
    /**
    * loading user properties on the nav if the user logged in
    *
    */
    var user = localStorage.getItem("user");
    if(user){
        $("#username_space").text(user);
        $("#username_space").attr("href", "dashboard.html");
        $("#login_logout").text("Logout");
        $("#login_logout").attr("href", "index.html");
        $("#login_logout").on("click", function(){
          localStorage.removeItem("user");
          localStorage.removeItem("models");
        });
    }
    else{
        $("#username_space").text("Sign Up");
        $("#username_space").attr("href", "signup.html");
        $("#login_logout").text("Login");
        $("#login_logout").attr("href", "login.html");
    }
  })
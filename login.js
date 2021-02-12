const signUp = document.getElementById("signUp")
const loginP = document.getElementById("loginPage");
const signP = document.getElementById("signupPage");

signUp.addEventListener("click", function(){
    if (loginP.style.display == 'none'){
        loginP.style.display = 'flex'
        signP.style.display = 'none'

        signUp.innerHTML = "Sign up"
    }else{
        loginP.style.display = 'none'
        signP.style.display = 'flex'
        signUp.innerHTML = "Login"

    }
})
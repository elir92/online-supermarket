const app = angular.module('welcomeApp', ["ngRoute"]);
app.config($routeProvider => {
    $routeProvider
        .when("/login", {
            templateUrl: "views/login.html"
        }).when("/sign", {
            templateUrl: "views/sign.html"
        });
});

app.controller('loginCtrl', ($scope, $http, $window) => {
    const locationUrl = location.href;
    const loginError = locationUrl.split('=')[1];
    if (loginError == 1) {
        $scope.loginMessage = "Please try again";
    }

});

app.controller('signupCtrl', ($scope, $http, $window) => {
    const signLocationUrl = location.href;
    const signError = signLocationUrl.split('=')[1];
    if (signError == 2) {
        $scope.signMessage = "Email is already taken, please try again";
    }

    //Check if ID is valid
    verifyUserId = () => {
        const checkUserId = {
            id: $scope.user_id_number
        }
        $http.post('/verifyid', checkUserId).then(response => {
            response.data.message === 'Invalid' ? $scope.idMessage = 'ID is already taken, please try again.' : $scope.idMessage = '';
        }).catch(err => console.log(err));
    }

    // Validation password
    verifyPassword = () => {
        if (document.getElementById('password').value == document.getElementById('confirm_password').value) {
            document.getElementById('sign_message').style.color = 'green';
            document.getElementById('sign_message').innerHTML = 'Password successfully verified';
        } else {
            document.getElementById('sign_message').style.color = 'red';
            document.getElementById('sign_message').innerHTML = 'Password is not verified';
        }
    }
});


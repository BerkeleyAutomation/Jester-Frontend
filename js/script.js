/**
 * @author: Viraj Mahesh
 */


BASE_URL = 'http://automation.berkeley.edu/jester_backend/jester/';
REQUEST_URL = BASE_URL + 'request_joke/';
RATE_URL = BASE_URL + 'rate_joke/{0}/{1}/';

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

/**
 * Set the Navbar dropdown color as dark red
 */
function setNavbarDropbownBackground() {
    if ($(window).width() < 768) {
        $('#navbar-collapse').css('background', 'rgb(195, 85, 85)');
    }
    else {
        $('#navbar-collapse').css('background', 'rgb(240, 100, 100)');
    }
}

/**
 * Equal spaces the items on the Navbar if the screen is large
 * Otherwise, Navbar items occupy the entire line in the dropdown menu
 */
function justifyNavbar() {
    if ($(window).width() >= 768) {
        var items = $('.item'); // Number of Navbar items
        var navbarWidth = $('.collapse').width(); // Navbar width
        // Equal sized items. Offset by -1 for smooth resizing
        var itemWidth = (navbarWidth / items.length) - 1.0;
        items.width(itemWidth);
    }
    else {
        $('.item').css('width', '100%'); // Navbar items occupy entire line
    }
}

/**
 * Controller for the register dialog
 * @param $scope
 * @param $mdDialog
 */
function RegisterController($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
        console.log('Register cancel');
    };
    $scope.submit = function () {
        if (typeof $scope.user.email != 'undefined') {
            var c = get(BASE_URL + 'register_user/' + $scope.user.email + '/' +
            $scope.user.password + '/');
            console.log(c);
        }
    };
}

/**
 * Controller for the login dialog
 * @param $scope
 * @param $mdDialog
 * @constructor
 */
function LoginController($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
        console.log('Login cancel');
    };
}

/**
 * Run this code when the page loads
 */
$(document).ready(function () {
    setNavbarDropbownBackground();
    justifyNavbar();
    // Window is resized after loading
    $(window).resize(function () {
        setNavbarDropbownBackground();
        justifyNavbar();
    });
});

/**
 * Requests the next joke from the server. Uses $http to refresh the view as soon
 * as joke is available.
 * @param $scope The angular-js scope to bind the joke data.
 * @param $http
 */
function requestJoke($scope, $http) {
    var promise = $http({
        url: REQUEST_URL,
        type: 'GET',
        withCredentials: true
    });
    // Update the view once a response is received
    promise.then(function (payload) {
        $scope.joke = payload.data;
    });
}


angular.module('jester', ['ngMaterial'])
    .controller('navbar-controller', function ($scope, $mdDialog) {
        $scope.showRegister = function (event) {
            $mdDialog.show({
                controller: RegisterController,
                templateUrl: 'register.tmpl.html',
                targetEvent: event
            });
        };
        $scope.showLogin = function (event) {
            $mdDialog.show({
                controller: LoginController,
                templateUrl: 'login.tmpl.html',
                targetEvent: event
            });
        };
    })
    .controller('joke-controller', function ($scope) {
        // Set default rating
        $scope.rating = 0;
        // Request a new joke. This will also perform authentication
        requestJoke($scope);
        // Submit a rating and request the next joke
        $scope.submitRating = function () {
            // Submit the rating
            var promise = $http({
                url: RATE_URL.format($scope.joke.joke_id, $scope.rating.toFixed(3)),
                type: 'GET',
                withCredentials: true
            });
            // Request a new joke once a response is received
            promise.then(function() {
                requestJoke($scope, $http);
            });
        };
    })
    // Directly inject html
    .filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

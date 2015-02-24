/**
 * @author: Viraj Mahesh
 */

/**
 * Sets the Navbar drop-down color as dark red.
 */

BASE_URL = 'http://127.0.0.1:8000/jester/'

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
        var items = $('.item').length; // Number of Navbar items
        var navbarWidth = $('.collapse').width(); // Navbar width
        // Equal sized items. Offset by -1 for smooth resizing
        var itemWidth = (navbarWidth / items) - 1.0;
        $('.item').width(itemWidth);
    }
    else {
        $('.item').css('width', '100%'); // Navbar items occupy entire line
    }
}

function RegisterController($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
        console.log('Register cancel');
    };
    $scope.submit = function() {
        if (typeof $scope.user.email != 'undefined') {
            var c = get(BASE_URL + 'register_user/' + $scope.user.email + '/' +
                $scope.user.password);
            console.log(c);
        }
    };
}

function LoginController($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
        console.log('Login cancel');
    };
}

$(document).ready(function () {
    setNavbarDropbownBackground();
    justifyNavbar();
    // Window is resized after loading
    $(window).resize(function () {
        setNavbarDropbownBackground();
        justifyNavbar();
    });
});

function requestJoke($scope) {
    $.get(BASE_URL + 'request_joke/', function(data) {
        $scope.joke = data;
        $scope.$apply();
    });
}

function submitRating(user_id, joke_id, rating) {
    return get(BASE_URL + 'rate_joke/' + user_id + '/' + joke_id + '/' + rating.toFixed(2));
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
    .controller('joke-controller', function($scope) {
        // Set default rating
        $scope.rating = 0;
        if (typeof $scope.init == 'undefined') {
            requestJoke($scope);
            $scope.init = true;
        }
        // Submit a rating and request the next joke
        $scope.submitRating = function (event) {
            var url = BASE_URL + 'rate_joke/' +
                $scope.joke.joke_id + '/' + $scope.rating.toFixed(2);
            $.get(url, function() {
                requestJoke($scope);
            })
        };
    })
    // Directly inject html
    .filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });
;
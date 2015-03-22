/**
 * @author: Viraj Mahesh
 */


BASE_URL = 'http://automation.berkeley.edu/jester_backend/jester/';
REQUEST_URL = BASE_URL + 'request_joke/';
RATE_URL = BASE_URL + 'rate_joke/{0}/{1}/';
LOGOUT_URL = BASE_URL + 'logout/';
LOG_SLIDER_URL = BASE_URL + 'log_slider/{0}/{1}';
HOME_URL = "http://berkeleyautomation.github.io/Jester-Frontend";

var old_rating = 0.0;

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


/**
 * Equal spaces the items on the Navbar if the screen is large
 * Otherwise, Navbar items occupy the entire line in the dropdown menu
 */
function justifyNavbar() {
    if ($(window).width() >= 768) {
        var items = $('.item'); // Number of Navbar items
        var navbarWidth = $('.collapse').width(); // Navbar width
        // Equal sized items. Offset by -1 for smooth resizing
        var itemWidth = (navbarWidth / items.length) - 10.0;
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
            console.log($scope.user.source);
        }
    };
}


function PrivacyController($scope, $mdDialog) {
    $scope.submit = function() {
        $mdDialog.cancel();
    }
}


/**
 * Controller for the logout dialog
 * @param $scope
 * @param $mdDialog
 * @constructor
 */
function LogoutController($scope, $http, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.submit = function () {
        // Request the server to logout
        var promise = $http({
            url: LOGOUT_URL,
            type: 'GET',
            withCredentials: true
        });
        // Re-direct to the home page
        promise.then(function() {
            window.location.href = HOME_URL;
        });
    };
}


/**
 * Run this code when the page loads
 */
$(document).ready(function () {
    var item = $('.item');
    item.mouseenter(function() {
       if ($(this).hasClass('.active-item') == true) {
           console.log("Hi");
           $(this).children('.mouseover').css('background', 'rgba(240, 129, 131, 0.65)');
       }
    });
    item.mouseleave(function() {
        if ($(this).hasClass('.active-item')) {
            $(this).children('.mouseover').css('background', 'rgba(240, 129, 131, 0.0)');
        }
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


function logSliderMovement($scope, $http) {
    var rating = $scope.rating; // In case async request takes too long
    var promise = $http({
        url: LOG_SLIDER_URL.format(old_rating, $scope.rating),
        type: 'GET',
        withCredentials: true
    });
    old_rating = rating;
}


angular.module('jester', ['ngMaterial'])
    .controller('navbar-controller', function ($scope, $http, $mdDialog) {
        $scope.showRegister = function (event) {
            $mdDialog.show({
                controller: RegisterController,
                templateUrl: 'register.tmpl.html',
                targetEvent: event
            });
        };
    })
    .controller('jester-homepage-controller', function($scope, $mdDialog) {
        $scope.showPrivacyAlert = function(ev) {
            $mdDialog.show({
                controller: PrivacyController,
                templateUrl: 'privacy.tmpl.html',
                targetEvent: event
            });
        };
    })
    .controller('joke-controller', function ($scope, $http, $mdDialog) {
        // Set default rating
        $scope.rating = 0;
        // Request a new joke. This will also perform authentication
        requestJoke($scope, $http);
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
                $scope.rating = 0.0; // Reset slider to 0
            });
        };
        $scope.showLogoutConfirm = function (event) {
            $mdDialog.show({
                controller: LogoutController,
                templateUrl: 'logout.tmpl.html',
                targetEvent: event
            });
        };

        $scope.click = function() {
            if (old_rating != $scope.rating) {
                logSliderMovement($scope, $http);
            }
        };
        $scope.$watch(function() {return $('#slider').hasClass('dragging')}, function(newValue, oldValue) {
            if (oldValue == false && newValue == false) {
                $scope.tracking_movement = true;
                $scope.old_rating = $scope.rating;
            }
            if ($scope.tracking_movement && oldValue == true && newValue == false) {
                logSliderMovement($scope, $http);
            }
        });

    })
    // Directly inject html
    .filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

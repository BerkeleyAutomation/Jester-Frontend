/**
 * @author: Viraj Mahesh
 */


BASE_URL = 'http://automation.berkeley.edu/jester_backend/jester/';
REQUEST_URL = BASE_URL + 'request_joke/';
RATE_URL = BASE_URL + 'rate_joke/{0}/{1}/';
LOGOUT_URL = BASE_URL + 'logout/';
LOG_SLIDER_URL = BASE_URL + 'log_slider/{0}/{1}/';
MAILING_LIST_URL = BASE_URL + 'join_mailing_list/';

HOME_URL = 'index.html';

var old_rating = 0.0;

var instructions = [
  "As you rate more jokes, Jester improves its recommendations by learning your sense of humor.",
  "Before you can receive recommendations, Jester need ratings on two initial jokes.",
];

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


/**
 * Controller for the register dialog
 * @param $scope
 * @param $mdDialog
 */
function MailingListController($scope, $http, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submit = function () {
        if (typeof $scope.user.email != 'undefined'
            && typeof $scope.user.reference != 'undefined') {

            var email = $scope.user.email;
            var reference = $scope.user.reference;

            var promise = $http({
                url: MAILING_LIST_URL,
                type: 'GET',
                withCredentials: true,
                params: {
                    email: email,
                    reference: reference
                }
            });

            promise.then(function () {
                $mdDialog.cancel();
            });
        }
    };
}


function PrivacyController($scope, $mdDialog) {
    $scope.submit = function() {
        $mdDialog.cancel();
    }
}

function BeginRecommending($scope, $http, $mdDialog, outer_scope) {
    $scope.continue_rating = function () {
        getNextJoke(outer_scope, $http);
        $mdDialog.cancel();
    };
}


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
        if ($(this).hasClass('active-item')) {
            $(this).children('.mouseover').css('background', 'rgba(6,188, 75, 0.65)');
        }
        else {
            $(this).children('.mouseover').css('background', 'rgba(5, 72, 36, 0.65)');
        }
    });
    item.mouseleave(function() {
        $(this).children('.mouseover').css('background', 'rgba(0, 0, 0, 0.0)');
    });
});


/**
 * Requests the next joke from the server. Uses $http to refresh the view as soon
 * as joke is available.
 * @param $scope The angular-js scope to bind the joke data.
 * @param $http
 */
function requestJoke($scope, $http, sucess) {
    var promise = $http({
        url: REQUEST_URL,
        type: 'GET',
        withCredentials: true
    });
    // Update the view once a response is received
    promise.then(function (payload) {
        $scope.joke = payload.data;
        $scope.instructions = instructions[$scope.joke.gauge];
        if (typeof sucess != 'undefined') {
            sucess();
        }
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

function getNextJoke($scope, $http) {
    requestJoke($scope, $http, function () {
        $scope.disabled = false;
    });
    $scope.rating = 0.0; // Reset slider to 0
    old_rating = 0.0;
}


angular.module('jester', ['ngMaterial'])
    .controller('navbar-controller', function ($scope, $http, $mdDialog) {
        $scope.showMailingList = function (event) {
            $mdDialog.show({
                controller: MailingListController,
                templateUrl: 'mailing_list.tmpl.html',
                targetEvent: event
            });
        };
    })
    .controller('jester-controller', function($scope, $http, $mdDialog) {
        $scope.showPrivacyAlert = function(ev) {
            $mdDialog.show({
                controller: PrivacyController,
                templateUrl: 'privacy.tmpl.html',
                targetEvent: event
            });
        };

        $scope.begin = function(ev) {
            requestJoke($scope, $http, function() {
                $("#home-div").fadeOut();
                $("#joke-div").show();
                $("nav").show();
            });
        };
        // Set default rating
        $scope.rating = 0;
        $scope.jokes_rated = 0;
        $scope.disabled = false;

        // Submit a rating and request the next joke
        $scope.submitRating = function () {
            // Submit the rating only if button is not disabled
            if ($scope.disabled) {
                return;
            }
	    //$('.joke-text').fadeOut(800);
            $scope.disabled = true;
            var promise = $http({
                url: RATE_URL.format($scope.joke.joke_id, $scope.rating.toFixed(3)),
                type: 'GET',
                withCredentials: true
            });
            // Request a new joke once a response is received
            promise.then(function() {
                /* if ($scope.joke.joke_id == 54) {
                     $mdDialog.show({
                        controller: BeginRecommending,
                        templateUrl: 'begin_recommending.tmpl.html',
                        locals: {
                            outer_scope: $scope
                        }
                    });
                }
                else {
                    getNextJoke($scope, $http);
                } */
                getNextJoke($scope, $http);
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

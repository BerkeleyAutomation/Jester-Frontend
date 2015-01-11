/**
 * @author: Viraj Mahesh
 */

/**
 * Sets the Navbar drop-down color as dark red.
 */
function setNavbarDropbownBackground() {
    if ($(window).width() <= 768) {
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
        var itemWidth = (navbarWidth/items) - 1.0;
        $('.item').width(itemWidth);
    }
    else {
        $('.item').css('width', '100%'); // Navbar items occupy entire line
    }
}

angular.module('jester', ['ngMaterial'])
    .controller('controller', function($scope, $mdDialog) {
        $scope.showRegister = function(event) {
            $mdDialog.show({
                controller: RegisterController,
                templateUrl: 'register.tmpl.html',
                targetEvent: event
            });
        };
        $scope.showLogin = function(event) {
            $mdDialog.show({
                controller: LoginController,
                templateUrl: 'login.tmpl.html',
                targetEvent: event
            });
        };
    });

function RegisterController($scope, $mdDialog) {
    $scope.cancel = function() {
        $mdDialog.cancel();
        console.log('Register cancel');
    };
}

function LoginController($scope, $mdDialog) {
    $scope.cancel = function() {
        $mdDialog.cancel();
        console.log('Login cancel');
    };
}

$(document).ready(function() {
    // Set Background on page load
    setNavbarDropbownBackground();
    justifyNavbar();
    //setTextFieldCallbacks()
    // Window is resized after loading
    $(window).resize(function() {
        setNavbarDropbownBackground();
        justifyNavbar();
    });
});

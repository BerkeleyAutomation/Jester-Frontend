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
    if ($(window).width() > 768) {
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

function positionModals() {
    var modal = '.modal-dialog'; // Class that defines the modal
    var windowHeight = $(window).height(); // Get window height
    var modalHeight = $(modal).height(); // Get modal height
    var margin = (windowHeight - modalHeight)/2; // Equal margins for centering
    $(modal).css('margin-top', margin);
    $(modal).css('margin-bottom', margin);
}

function setTextFieldCallbacks() {
    $('.text-field').focusin(function() {
        /*
        var defaultText = $(this).attr('defaultText');
        $('#' + this.id + '-heading').text(defaultText); // Move text to heading
        $(this).text(''); // Make the text in the field none
        */
    });
    $('.text-field').focusout(function() {
        /*
        if ($(this).text() === '') {
            var defaultText = $(this).attr('defaultText');
            $('#' + this.id + '-heading').text(''); // Move text to heading
            $(this).text(defaultText); // Make the text in the field none
        }*/
    });
}

angular.module('jester', ['ngMaterial'])
    .controller('controller', function($scope, $mdDialog) {
        $scope.showAdvanced = function(event) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'register.tmpl.html',
                targetEvent: event
            });
        }
    });

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
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

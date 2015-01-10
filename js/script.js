/**
 * @author: Viraj Mahesh
 */

function setNavbarDropbownBackground() {
    if ($(window).width() <= 768) {
        $('#navbar-collapse').css('background', 'rgb(195, 85, 85)');
    }
    else {
        $('#navbar-collapse').css('background', 'rgb(240, 100, 100)');
    }
}

$(document).ready(function() {
    // Set Background on page load
    setNavbarDropbownBackground();
    // Window is resized after loading
    $(window).resize(function() {
        setNavbarDropbownBackground();
    });
});

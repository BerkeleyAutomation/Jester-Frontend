/**
 * Created by Viraj.
 */

$(document).ready(function() {
    console.log("Ready");
    $('.input-field').keyup(function(event) {
        id = event.target.id;
        if ($('#' + id).val() != '') {
            $('#' + id + '-backtext').hide();
        }
        else {
            $('#' + id + '-backtext').show();
        }
    });
});

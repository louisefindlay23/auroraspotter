$(document).ready(function () {

    $(".fa-bars").click(function () {
        $("header .icon, main h2").hide();
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
        $("main h2").addClass("remove-animation");
        $("header .icon, main h2").show();
    });

    $('table tr').each(function () {
        $(this).find('th').first().addClass('first');
        $(this).find('th').last().addClass('last');
        $(this).find('td').first().addClass('first');
        $(this).find('td').last().addClass('last');
    });

});

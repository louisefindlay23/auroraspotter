$(document).ready(function () {

    $(".fa-bars").click(function () {
        $("header .icon").hide();
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
        $("header .icon").show();
    });

    $('table tr').each(function () {
        $(this).find('th').first().addClass('first');
        $(this).find('th').last().addClass('last');
        $(this).find('td').first().addClass('first');
        $(this).find('td').last().addClass('last');
    });

});

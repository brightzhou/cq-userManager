/**
 * Created by majiali on 2016/5/25.
 */
$(".left-title").click(function () {
    $(this).toggleClass("change-blue").siblings(".left-title").removeClass("change-blue");
    $(this).toggleClass("slide-down").siblings(".left-title").removeClass("slide-down");
    $(this).next(".navContent").slideToggle(500).siblings(".navContent").slideUp(500);
})


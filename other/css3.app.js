function render(tag, modId, data) {
    var tmpl,
        duration;
    var $mod,
        $wrapper,
        $views;

    tmpl = $('#tmpl-' + modId).val();
    data = data || {};
    data.pageId = modId;
    $mod = tmplToMod(tmpl, data);

    duration = 10;
    $wrapper = $('#view-wrapper');
    $views = $wrapper.find('div.view');

    if ($wrapper.hasClass('wrapper-slidein')) {
        $views.eq(1).html('').append($views.eq(2).children());
        $wrapper.removeClass('wrapper-slidein');
    }

    window.setTimeout(function () {
        $views.eq(2).html('').append($mod);
        $wrapper.addClass('wrapper-slidein');
    }, duration);

    // $wrapper.bind('animationend', function () {
        // $wrapper.removeClass('wrapper-slidein');
        // $views.eq(1).html('').append($views.eq(2).children());
        // isBusy = false;
    // });

    //$forward.addClass('a-flipoutY');
    //$backward.addClass('a-flipinY');
}
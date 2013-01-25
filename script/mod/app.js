/**
 * @author liangxiao
 * @version [v1.0]
 * @description
 */

/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 80, plusplus: true, sloppy: true*/
/*global define: true, $: true, App: true */
define(function (require, exports, module) {
    'use strict';

    function render(tag, modId, data) {
        var tmpl, initValue, animateValue;
        var $mod, $scenes, $forward, $backward;

        tmpl = $('#tmpl-' + modId).val();
        data = data || {};
        data.pageId = modId;
        $mod = tmplToMod(tmpl, data);

        if (tag > 0) {
            initValue = 320;
            animateValue = -320;
        } else {
            initValue = -320;
            animateValue = 320;
        }

        $scenes = $('#wrapper .scene');
        $forward = $scenes.filter('.forward').css('left', 0).show();
        $backward = $scenes.filter('.backward').css('left', initValue).show();

        $backward.html('').append($mod);

        $forward.animate({ left: animateValue }, 'fast', function () {
            $forward.removeClass('forward').addClass('backward').hide();
        });
        $backward.animate({ left: 0 }, 'fast', function () {
            $backward.removeClass('backward').addClass('forward');
        });
    }

    function tmplToMod(tmpl, data) {
        var $mod = $.tmpl(tmpl, data);
        var $fragments = $mod.find('fragment');
        $.each($fragments, function (i) {
            var $f = $fragments.eq(i);
            var tmplID = $f.data('tmpl');
            var tmpl = $('#tmpl-' + tmplID).val();
            $f.replaceWith($.tmpl(tmpl, data));
        });

        return $mod;
    }

    var defaultConf = {
        dataType: 'json',
        type: 'GET',
        data: {},
        url: 'default-url',
        success: function (data) {
        },
        error: function (message, data) {
        }
    };
    function ajax(conf) {
        conf = $.extend({}, defaultConf, conf);
        $.ajax({
            cache: false,
            dataType: conf.dataType,
            timeout: 30000,
            type: conf.type,
            data: conf.data,
            url: conf.url,
            success: function (data) {
                if (data.status === 'succ') {
                    conf.success(data.data);
                    return;
                }

                if (data.msg === 'need_login') {
                    app.renderLast('login')
                    return;
                }

                // fail
                conf.error(data.message, data.data);
            },
            error: function (xhr) {
                alert('网络错误!');
            }
        });
    }

    window.app = {
        render: function (modId, data) {
            render(0, modId, data);
        },
        renderLast: function (modId, data) {
            render(-1, modId, data);
        },
        renderNext: function (modId, data) {
            render(1, modId, data);
        },
        tmplToMod: tmplToMod,
        ajax: ajax,
        cache: {}
    };

    var api = require('./api');
    app.sessionUser = window.localStorage.__session;
    api.initIndexMod();
});

/**
 * @author liangxiao
 * @version [v1.0]
 * @description
 */

/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 80, plusplus: true, sloppy: true*/
/*global define: true, $: true, App: true */
define(function (require, exports, module) {
    'use strict';

    var q = {
        mod: '#createFantuan',
        name: '#createFantuan input[node-type=name]',
        createBtn: '#createFantuan input[node-type=create]',
        cancelBtn: '#createFantuan input[node-type=cancel]',
        tip: '#createFantuan div[node-type=tip]'
    };

    var url = '/groups.json';
    var handle = null;

    // events
    $(document).delegate(q.name, 'focus', function () {
        $(q.tip).hide();
    });
    $(document).delegate(q.name, 'input', function () {
        var $button = $(q.createBtn);
        window.clearTimeout(handle);
        window.setTimeout(function () {
            var name = $(q.name).val().trim();
            if (name === '') {
                $button.removeClass('button-blue-short').addClass('button-grey-short');
            } else {
                $button.removeClass('button-grey-short').addClass('button-blue-short');
            }
        }, 200);
    });
    $(document).delegate(q.createBtn, 'click', function () {
        var name;

        name = $(q.name).val().trim();

        if (name === '' || $(this).hasClass('button-grey-short')) {
            return;
        }

        app.ajax({
            url: url,
            type: 'POST',
            data: { name: name },
            success: function (data) {
                var api = require('./api');
                api.initModifyFantuanMod(data.group);
            },
            error: function (xhr) {
                $(q.tip).show();
            }
        });
    });
    $(document).delegate(q.cancelBtn, 'click', function () {
        app.renderLast('index', app.cache.index);
    });
});

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
        mod: '#login',
        name: '#login input[node-type=name]',
        pwd: '#login input[node-type=pwd]',
        btn: '#login input[node-type=login]',
        tip: '#login div[node-type=tip]'
    };
    var url = '/login.json';

    // events
    $(document).delegate(q.name, 'focus', function () {
        $(q.tip).hide();
    });
    $(document).delegate(q.pwd, 'focus', function () {
        $(q.tip).hide();
    });
    $(document).delegate(q.btn, 'click', function () {
        var name, pwd;

        name = $(q.name).val().trim();
        pwd = $(q.pwd).val().trim();

        if (name === '' || pwd === '') {
            $(q.tip).show();
            return;
        }

        app.ajax({
            url: url,
            type: 'POST',
            data: { name: name, password: pwd },
            success: function (data) {
                window.localStorage.__session = name;
                app.sessionUser = name;
                var api = require('./api');
                api.initIndexMod();
            },
            error: function (xhr) {
                $(q.tip).show();
            }
        });
    });
});

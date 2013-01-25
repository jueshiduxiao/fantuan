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
        modifyBtn: '#billItem input[node-type=modify]',
        backBtn: '#billItem input[node-type=back]'
    }

    // event
    $(document).delegate(q.modifyBtn, 'click', function () {
        var eventId = $(this).data('event-id');
        var api = require('./api');
        api.initBillMod(eventId);
    });
    $(document).delegate(q.backBtn, 'click', function () {
        var api = require('./api');
        api.initIndexMod(-1);
    });
});

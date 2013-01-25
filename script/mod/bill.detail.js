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
        billItem: '#billDetail li[node-type=item]'
    }

    // event
    $(document).delegate(q.billItem, 'click', function () {
        var eventId = $(this).data('id');
        var api = require('./api');
        api.initBillItem(eventId);
    });
});

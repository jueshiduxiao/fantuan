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
        refreshBtn: '.header a[node-type=refresh]',
        homeBtn: '.header a[node-type=home]',
        billDetail: '.header a[node-type=bill-detail]'
    }

    // event
    $(document).delegate(q.homeBtn, 'click', function () {
        app.renderLast('index', app.cache.index);
    });
    $(document).delegate(q.billDetail, 'click', function () {
        var api = require('./api');
        api.initGroupBillList(true);
    });
    $(document).delegate(q.refreshBtn, 'click', function () {
        var api = require('./api');
        api.initIndexMod();
    })
});

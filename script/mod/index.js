/**
 * @author liangxiao
 * @version [v1.0]
 * @description
 */

/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 80, plusplus: true, sloppy: true*/
/*global define: true, $: true, App: true */
define(function (require, exports, module) {
    'use strict';

    var api = require('./api');
    var q = {
        loginOutBtn: '#index a[node-type=login-out]',
        billDetailBtn: '#index a[node-type=bill-detail]',
        viewDebtListBtn: '#index a[node-type=view-debt-list]',
        addMemberBtn: '#index a[node-type=add-member]',
        createFantuanBtn: '#index a[node-type=create-fantuan], #index input[node-type=create-fantuan]',
        createBill: '#index input[node-type=create-bill]'
    }

    // event
    $(document).delegate(q.loginOutBtn, 'click', function () {
        app.ajax({
            type: 'GET',
            url: '/logout.json',
            success: function (data) {
                app.renderLast('login');
            }
        });
    });
    $(document).delegate(q.createFantuanBtn, 'click', function () {
        app.renderNext('create-fantuan');
    });
    $(document).delegate(q.billDetailBtn, 'click', function () {
        api.initGroupBillList();
    });
    $(document).delegate(q.viewDebtListBtn, 'click', function () {
        var groupId = $(this).data('id');
        var groupName = $(this).data('name');
        api.initGroupDebtList({
            id: groupId,
            name: groupName
        });
    });
    $(document).delegate(q.addMemberBtn, 'click', function () {
        var groupId = $(this).data('id');
        var groupName = $(this).data('name');
        api.initModifyFantuanMod({
            id: groupId,
            name: groupName
        });
    });
    $(document).delegate(q.createBill, 'click', function () {
        api.initBillMod();
    });
});

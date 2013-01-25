/**
 * @author liangxiao
 * @version [v1.0]
 * @description
 */

/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 80, plusplus: true, sloppy: true*/
/*global define: true, $: true, App: true */
define(function (require, exports, module) {
    'use strict';

    function initIndexMod(tag) {
        app.ajax({
            type: 'GET',
            url: '/index.json',
            success: function (data) {
                app.cache.index = data;
                data.sessionUser = app.sessionUser;
                if (tag < 0) {
                    app.renderLast('index', data);
                } else if (tag === 0) {
                    app.render('index', data);
                } else {
                    app.renderNext('index', data);
                }
            }
        });
    }

    function initModifyFantuanMod(group) {
        app.ajax({
            type: 'GET',
            url: '/groups/' + group.id + '/users.json',
            success: function (data) {
                data.group = group;
                app.renderNext('modify-fantuan', data);
            }
        });
    }

    function initBillMod(billId) {
        function createDate(_date) {
            var arrEventDate = [],
                baseDate,
                oNewDate;

            if (!(+_date)) {
                _date = new Date();
            }

            for (var i = 14; i >= -14; i--) {
                baseDate = new Date(_date);
                oNewDate = new Date(baseDate.setDate(_date.getDate() - i));
                arrEventDate.push({
                    value: [
                        oNewDate.getFullYear(),
                        oNewDate.getMonth() > 10 ? oNewDate.getMonth() + 1 : '0' + (oNewDate.getMonth() + 1),
                        oNewDate.getDate() >= 10 ? oNewDate.getDate() : '0' + (oNewDate.getDate())
                    ].join('-'),
                    selected: i === 0 ? 1 : 0
                });
            }

            return arrEventDate;
        }

        app.ajax({
            url: '/events/new.json',
            success: function (data) {
                $.extend(app.cache, data);

                if (!billId) {
                    data.group_users = data.groups_users[data.groups[0].group.id];
                    data.selectedCount = 0;
                    data.pay_user = app.sessionUser;
                    data.date = createDate(new Date());
                    app.renderNext('bill', data);
                } else {
                    app.ajax({
                        url: '/events/' + billId + '.json',
                        success: function (_data) {
                            for (var i in data.groups) {
                                if (data.groups[i].group.id === _data.group.group.id) {
                                    data.groups[i].group._selected = 1;
                                } else {
                                    data.groups[i].group._selected = 0;
                                }
                            }

                            for (var i in data.event_types) {
                                if (data.event_types[i].event_type.id === _data.event_type.event_type.id) {
                                    data.event_types[i].event_type._selected = 1;
                                } else {
                                    data.event_types[i].event_type._selected = 0;
                                }
                            }

                            for (var i in data.places) {
                                if (data.places[i].place.id === _data.place.place.id) {
                                    data.places[i].place._selected = 1;
                                } else {
                                    data.places[i].place._selected = 0;
                                }
                            }

                            var selectedMap = {};
                            var i, user;
                            for (i in _data.users) {
                                 user = _data.users[i].user;
                                 selectedMap[user.id] = 1;
                            }

                            data.group_users = data.groups_users[_data.group.group.id];
                            data.selectedCount = _data.users.length;
                            data.selectedUserMap = selectedMap;
                            data.event_id = billId;
                            data.pay = _data.pay_user.pay;
                            data.pay_user = _data.pay_user.user.user.name;
                            data.date = createDate(new Date(_data.date));

                            app.renderNext('bill', data);
                        }
                    });
                }
            }
        });
    }

    function initBillItem(event_id) {
        function succ(_data) {
            var data = {
                eventId: event_id,
                groupName: _data.group.group.name,
                date: _data.date,
                eventTypeName: _data.event_type.event_type.name,
                placeName: _data.place.place.name,
                pay: _data.pay_user.pay,
                payUserName: _data.pay_user.user.user.name,
                usersCount: _data.users.length,
                isEnableModify: _data.own,
                groupBalance: _data.balance
            };

            data.avgPay = (data.pay / data.usersCount).toFixed(2);

            data.users = [];
            for (var i in _data.users) {
                data.users.push({
                    name: _data.users[i].user.name
                })
            }

            app.renderNext('bill-item', data);
        }

        app.ajax({
            type: 'GET',
            url: '/events/' + event_id + '.json',
            success: succ
        });
    }

    function initGroupBillList(tag) {
        if (tag) {
            app.renderLast('bill-detail', app.cache.billDetail);
            return;
        }

        app.ajax({
            type: 'GET',
            url: '/summary.json',
            success: function (_data) {
                var data,
                    oNewGroup;

                data = {
                    sessionUser: app.sessionUser,
                    groups: []
                };

                for (var i in _data) {
                    oNewGroup = {
                        groupName: _data[i].group.group.name,
                        groupBalance: _data[i].balance,
                        events: []
                    };

                    for (var j in _data[i].events) {
                        oNewGroup.events.push({
                            eventId: _data[i].events[j].pay.event_user.event_id,
                            placeName: _data[i].events[j].place.place.name,
                            eventTypeName: _data[i].events[j].event_type.event_type.name,
                            pay: _data[i].events[j].pay.event_user.pay - _data[i].events[j].pay.event_user.consume,
                            date: _data[i].events[j].date,
                            day: _data[i].events[j].day_of_week,
                            userCount: _data[i].events[j].user_count,
                            avgPay: _data[i].events[j].pay.event_user.consume
                        });
                    }

                    data.groups.push(oNewGroup);
                }

                app.cache.billDetail = data;
                app.renderNext('bill-detail',  data);
            }
        });
    }


    function initGroupDebtList(group) {
        app.ajax({
            type: 'GET',
            url: '/groups/' + group.id + '/top_list.json',
            success: function (data) {
                var _data = {
                    items: data,
                    group: group
                };
                app.renderNext('debt-list', _data);
            }
        });
    }

    return {
        initIndexMod: initIndexMod,
        initModifyFantuanMod: initModifyFantuanMod,
        initBillMod: initBillMod,
        initBillItem: initBillItem,
        initGroupBillList: initGroupBillList,
        initGroupDebtList: initGroupDebtList
    };
});

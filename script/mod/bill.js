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
        groups: '#bill select[node-type=fantuan]',
        date: '#bill select[node-type=date]',
        eventTypes: '#bill select[node-type=event-types]',
        places: '#bill select[node-type=places]',
        account: '#bill input[node-type=account]',
        memberPanel: '#bill div[node-type=member-panel]',
        memberCount: '#bill span[node-type=member-count]',
        memberBtn: '#bill span[node-type=member-btn]',
        saveBtn: '#bill input[node-type=save]',
        cancelBtn: '#bill input[node-type=cancel]'
    }
    var saveUrl = '/events.json';

    // event
    $(document).delegate(q.groups, 'change', function (e) {
        var groupId, users;
        var $memberBtns, $membersParent, $m, $newM;
        
        groupId = $(e.target).val();
        users = app.cache.groups_users[groupId];

        $(q.memberCount).html(0);
        $memberBtns = $(q.memberBtn);
        $membersParent = $memberBtns.parent();
        $m = $memberBtns.eq(0).clone();
        $memberBtns.remove();
        $membersParent.append($m);

        for (var i in users) {
            $newM = $m.clone();
            $newM.data('value', users[i].user.id).html(users[i].user.name).css('display', 'inline-block');
            $membersParent.append($newM);
        }
    });
    $(document).delegate(q.memberBtn, 'click', function () {
        var $memberBtns, $memberCount, $this;

        $this = $(this);
        if ($this.hasClass('selected')) {
            $this.removeClass('selected');
        } else {
            $this.addClass('selected');
        }

        $memberBtns = $(q.memberBtn);
        $memberCount = $(q.memberCount);
        $memberCount.html($memberBtns.filter('.selected').length);
    });
    $(document).delegate(q.saveBtn, 'click', function () {
        var $members;
        var data, ids, eventId;

        $members = $(q.memberBtn);
        ids = [];
        for (var i in $members) {
            if ($members.eq(i).hasClass('selected')) {
                ids.push($members.eq(i).data('value'));
            }
        }

        data = {
            group_id: $(q.groups).val(),
            date: $(q.date).val(),
            event_type_id: $(q.eventTypes).val(),
            place_id: $(q.places).val(),
            pay: parseInt($(q.account).val(), 10),
            user_ids: ids.toString()
        };

        eventId = $(this).data('id');
        if (eventId) {
            saveUrl = '/events/' + eventId + '.json';
            data._method = 'put';
        }
        app.ajax({
            type: 'POST',
            url: saveUrl,
            data: data,
            success: function (data) {
                var api = require('./api');
                api.initBillItem(data.event.id);
            }
        });
    });
    $(document).delegate(q.cancelBtn, 'click', function () {
        app.renderLast('index', app.cache.index);
    });
});

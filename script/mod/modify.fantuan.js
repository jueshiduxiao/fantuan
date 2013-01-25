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
        mod: '#modifyFantuan',
        memberTextbox: '#modifyFantuan input[node-type=member]',
        membersSuggest: '#modifyFantuan ul[node-type=suggest]',
        planMembers: '#modifyFantuan div[node-type=plan-members]',
        addMemberBtn: '#modifyFantuan li[node-type=add-member]',
        cancelMemberBtn: '#modifyFantuan span[node-type=cancel-member]',
        saveBtn: '#modifyFantuan input[node-type=save]',
        cancelBtn: '#modifyFantuan input[node-type=cancel]'
    };

    function createSuggest(users) {
        var $suggest, $user;

        $suggest = $(q.membersSuggest);
        $user = $suggest.children().eq(0);
        $suggest.children().remove();
        $suggest.append($user);

        var i;
        for (i in users) {
            $user.clone().removeClass('hidden')
                .data('id', users[i].user.id)
                .html(users[i].user.name)
                .appendTo($suggest);
        }
    }

    // events
    var handle = null;
    $(document).delegate(q.memberTextbox, 'input', function () {
        window.clearTimeout(handle);
        handle = window.setTimeout(function () {
            var key, users;

            key = $(q.memberTextbox).val().trim();

            if (key === '') {
                users = [];
                createSuggest(users);
                return;
            }

            app.ajax({
                type: 'GET',
                url: '/groups/' + $(q.membersSuggest).data('group-id') + '/suggest.json',
                data: { prefix: key },
                success: function (data) {
                    users = data.users.splice(0, 5);
                    createSuggest(users);
                }
            });
        }, 200);
    });
    $(document).delegate(q.addMemberBtn, 'click', function () {
        var id, name;
        var $this, $planMembers, $members, $newMember;
        
        $this = $(this);
        id = $this.data('id');
        name = $this.html();
        $planMembers = $(q.planMembers);
        $planMembers.parent().show();
        $members = $planMembers.children();

        for (var i in $members) {
            var $m = $members.eq(i);
            if ($m.data('value') === id) {
                return;
            }
        }

        $newMember = $members.eq(0).hide().clone();
        $newMember.data('value', id).html(name).css('display', 'inline-block');
        $newMember.appendTo($planMembers);
    });
    $(document).delegate(q.cancelMemberBtn, 'click', function () {
        var $planMembers;

        $(this).remove();
        $planMembers = $(q.planMembers);
        if ($planMembers.children().length === 1) {
            $planMembers.parent().hide();
        }
    });
    $(document).delegate(q.saveBtn, 'click', function () {
        var groupId, ids = [];
        var $planMembers, $members, $member;

        $planMembers = $(q.planMembers);
        $members = $planMembers.children();
        for (var i = 1; i < $members.length; i++) {
            $member = $members.eq(i);
            ids.push($member.data('value'));
        }

        groupId = $(this).data('id');
        $.ajax({
            cache: false,
            dataType: 'json',
            timeout: 30000,
            type: 'POST',
            data: { ids: ids.toString() },
            url: '/groups/' + groupId + '/users.json',
            success: function (data) {
                app.renderNext('index');

                var api = require('./api');
                api.initIndexMod();
            }
        });
    });
    $(document).delegate(q.cancelBtn, 'click', function () {
        var api = require('./api');
        api.initIndexMod(-1);
    });
});

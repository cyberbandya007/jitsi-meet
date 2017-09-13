/* global APP, $ */

import {processReplacements, linkify} from './Replacement';
import CommandsProcessor from './Commands';
import VideoLayout from "../../videolayout/VideoLayout";

import UIUtil from '../../util/UIUtil';
import UIEvents from '../../../../service/UI/UIEvents';

import { smileys } from './smileys';

import { dockToolbox, setSubject } from '../../../../react/features/toolbox';

let unreadMessages = 0;
let documentUrl = window.location.href;
const sidePanelsContainerId = 'sideToolbarContainer';
const htmlStr = `
    <div id="whiteboard_container" class="sideToolbarContainer__inner__whiteboard">
    </div>`;

function initHTML() {
    $(`#${sidePanelsContainerId}`)
        .append(htmlStr);
}

/**
 * The container id, which is and the element id.
 */
var CHAT_CONTAINER_ID = "whiteboard_container";

/**
 *  Updates visual notification, indicating that a message has arrived.
 */
function updateVisualNotification() {
    // XXX The rewrite of the toolbar in React delayed the availability of the
    // element unreadMessages. In order to work around the delay, I introduced
    // and utilized unreadMsgSelector in addition to unreadMsgElement.
    const unreadMsgSelector = $('#unreadMessages');
    const unreadMsgElement
        = unreadMsgSelector.length > 0 ? unreadMsgSelector[0] : undefined;

    if (unreadMessages && unreadMsgElement) {
        unreadMsgElement.innerHTML = unreadMessages.toString();

        APP.store.dispatch(dockToolbox(true));

        const chatButtonElement
            = document.getElementById('toolbar_button_whiteboard');
        const leftIndent
            = (UIUtil.getTextWidth(chatButtonElement)
                    - UIUtil.getTextWidth(unreadMsgElement))
                / 2;
        const topIndent
            = (UIUtil.getTextHeight(chatButtonElement)
                        - UIUtil.getTextHeight(unreadMsgElement))
                    / 2
                - 5;

        unreadMsgElement.setAttribute(
                'style',
                'top:' + topIndent + '; left:' + leftIndent + ';');
    }
    else {
        unreadMsgSelector.html('');
    }

    if (unreadMsgElement) {
        unreadMsgSelector.parent()[unreadMessages > 0 ? 'show' : 'hide']();
    }
}


/**
 * Returns the current time in the format it is shown to the user
 * @returns {string}
 */
function getCurrentTime(stamp) {
    var now     = (stamp? new Date(stamp): new Date());
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(hour.toString().length === 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length === 1) {
        minute = '0'+minute;
    }
    if(second.toString().length === 1) {
        second = '0'+second;
    }
    return hour+':'+minute+':'+second;
}

function toggleSmileys() {
    var smileys = $('#smileysContainer');
    if(!smileys.is(':visible')) {
        smileys.show("slide", { direction: "down", duration: 300});
    } else {
        smileys.hide("slide", { direction: "down", duration: 300});
    }
    $('#usermsg').focus();
}

function addClickFunction(smiley, number) {
    smiley.onclick = function addSmileyToMessage() {
        var usermsg = $('#usermsg');
        var message = usermsg.val();
        message += smileys['smiley' + number];
        usermsg.val(message);
        usermsg.get(0).setSelectionRange(message.length, message.length);
        toggleSmileys();
        usermsg.focus();
    };
}

/**
 * Adds the smileys container to the chat
 */
function addSmileys() {
    var smileysContainer = document.createElement('div');
    smileysContainer.id = 'smileysContainer';
    for(var i = 1; i <= 21; i++) {
        var smileyContainer = document.createElement('div');
        smileyContainer.id = 'smiley' + i;
        smileyContainer.className = 'smileyContainer';
        var smiley = document.createElement('img');
        smiley.src = 'images/smileys/smiley' + i + '.svg';
        smiley.className =  'smiley';
        addClickFunction(smiley, i);
        smileyContainer.appendChild(smiley);
        smileysContainer.appendChild(smileyContainer);
    }

    $("#whiteboard_container").append(smileysContainer);
}

/**
 * Resizes the chat conversation.
 */
function resizeChatConversation() {
    var msgareaHeight = $('#usermsg').outerHeight();
    var chatspace = $('#' + CHAT_CONTAINER_ID);
    var width = chatspace.width();
    var chat = $('#chatconversation');
    var smileys = $('#smileysarea');

    smileys.height(msgareaHeight);
    $("#smileys").css('bottom', (msgareaHeight - 26) / 2);
    $('#smileysContainer').css('bottom', msgareaHeight);
    chat.width(width - 10);
    chat.height(window.innerHeight - 15 - msgareaHeight);
}

/**
 * Focus input after 400 ms
 * Found input by id
 *
 * @param id {string} input id
 */
function deferredFocus(id){
    setTimeout(() => $(`#${id}`).focus(), 400);
}
/**
 * Whiteboard related user interface.
 */
var Whiteboard = {
    /**
     * Initializes chat related interface.
     */
    init (eventEmitter) {
        initHTML();
        var hname = window.location.hostname;
        var port = 9001;
        var html='<object type="text/html" data="http://'+hname+':'+port+'" ></object>';
        $("#whiteboard_container").append(html);
    },
};

export default Whiteboard;

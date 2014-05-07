/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    connectionStatus: false,
    storage: '',
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.storage = window.localStorage;
        app.storage.removeItem('token');

        $.system.resetUI();

        $("a[data-role=tab]").each(function () {
            var anchor = $(this);
            anchor.bind("click", function () {
                $.mobile.changePage(anchor.attr("href"), {
                    transition: "none",
                    changeHash: true
                });
                return false;
            });
        });

        $("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
            $.mobile.silentScroll(0);
            $.mobile.changePage.defaults.transition = 'slide';
        });

        app.connectionStatus = navigator.onLine;
        setInterval(function () {
            app.connectionStatus = navigator.onLine;

            if(!app.connectionStatus){
                $('#offlineBar').show();
            }
            else{
                $('#offlineBar').hide();
            }
        }, 100);

        if(app.connectionStatus){
            $.get('http://irsaex.ir/contact').done(function(res){
                app.storage.setItem('contact', res);
            });
        }

        $('#page-contactus').find('[data-role="content"]').html(app.storage.getItem('contact'));

        $('#current_datetime').html("ساعت <span id='currenct_clock'></span>، "+"امروز "+$.system.shamsiDate().toPersian());
        setInterval(function(){
            var date = new Date();
            $("#currenct_clock").html(($.system.numberPad(date.getHours())+":"+$.system.numberPad(date.getMinutes())+":"+$.system.numberPad(date.getSeconds())).toPersian());

            $("[counter]").each(function(){
                $(this).attr('counter', parseInt($(this).attr('counter'))+1).html(Math.ceil($(this).attr('counter')/60).toString().toPersian());
            });
        }, 1000);

        $.system.currency_lastUpdate = $.system.coin_lastUpdate = $.system.gold_lastUpdate = null;
        $.system.updateCurrencies(true);
        $.system.updateCoins(true);
        $.system.updateGolds(true);

        setInterval(function(){
            $.system.updateCurrencies();
        }, 15 * 1000);
        setInterval(function(){
            $.system.updateCoins();
        }, 15 * 1000);
        setInterval(function(){
            $.system.updateGolds();
        }, 15 * 1000);
        setInterval(function(){
            if(app.storage.getItem('token')==null){
                $('#user-login').show();
                $('#user-dashboard').hide();
                $('#logout').hide();
            }
            else{
                $('#user-login').hide();
                $('#user-dashboard').show();
                $('#logout').show();
            }
        },1000);
    }
};

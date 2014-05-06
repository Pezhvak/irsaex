(function($){
    $.system = {xhr: null, e_ac: false, m_ac: false, ac_tm: null, token: null, currency_lastUpdate: null, coin_lastUpdate: null, gold_lastUpdate: null, userData: {}}
    $.system.number_format = function(number, decimals, dec_point, thousands_sep){
        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
            .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    }

    $.system.numberPad = function(n){
        return ("0" + n).slice(-2);
    }

    $.system.shamsiDate=function(){
        week= new Array("یكشنبه","دوشنبه","سه شنبه","چهارشنبه","پنج شنبه","جمعه","شنبه");
        months = new Array("فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند");
        a = new Date();
        d= a.getDay();
        day= a.getDate();
        month = a.getMonth()+1;
        year= a.getYear();
        year = (year== 0)?2000:year;
        (year<1000)? (year += 1900):true;
        year -= ( (month < 3) || ((month == 3) && (day < 21)) )? 622:621;
        switch (month) {
            case 1: (day<21)? (month=10, day+=10):(month=11, day-=20); break;
            case 2: (day<20)? (month=11, day+=11):(month=12, day-=19); break;
            case 3: (day<21)? (month=12, day+=9):(month=1, day-=20); break;
            case 4: (day<21)? (month=1, day+=11):(month=2, day-=20); break;
            case 5:
            case 6: (day<22)? (month-=3, day+=10):(month-=2, day-=21); break;
            case 7:
            case 8:
            case 9: (day<23)? (month-=3, day+=9):(month-=2, day-=22); break;
            case 10:(day<23)? (month=7, day+=8):(month=8, day-=22); break;
            case 11:
            case 12:(day<22)? (month-=3, day+=9):(month-=2, day-=21); break;
            default: break;
        }
        return (" "+week[d]+" "+day+" "+months[month-1]+" "+ year);
    }

    $.system.strtotime = function(text, now) {
        //  discuss at: http://phpjs.org/functions/strtotime/
        //     version: 1109.2016
        // original by: Caio Ariede (http://caioariede.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Caio Ariede (http://caioariede.com)
        // improved by: A. Matías Quezada (http://amatiasq.com)
        // improved by: preuter
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Mirko Faber
        //    input by: David
        // bugfixed by: Wagner B. Soares
        // bugfixed by: Artur Tchernychev
        //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
        //   example 1: strtotime('+1 day', 1129633200);
        //   returns 1: 1129719600
        //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
        //   returns 2: 1130425202
        //   example 3: strtotime('last month', 1129633200);
        //   returns 3: 1127041200
        //   example 4: strtotime('2009-05-04 08:30:00 GMT');
        //   returns 4: 1241425800

        var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

        if (!text) {
            return fail;
        }

        // Unecessary spaces
        text = text.replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();

        // in contrast to php, js Date.parse function interprets:
        // dates given as yyyy-mm-dd as in timezone: UTC,
        // dates with "." or "-" as MDY instead of DMY
        // dates with two-digit years differently
        // etc...etc...
        // ...therefore we manually parse lots of common date formats
        match = text.match(
            /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

        if (match && match[2] === match[4]) {
            if (match[1] > 1901) {
                switch (match[2]) {
                    case '-':
                    { // YYYY-M-D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }

                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '.':
                    { // YYYY.M.D is not parsed by strtotime()
                        return fail;
                    }
                    case '/':
                    { // YYYY/M/D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }

                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                }
            } else if (match[5] > 1901) {
                switch (match[2]) {
                    case '-':
                    { // D-M-YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '.':
                    { // D.M.YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '/':
                    { // M/D/YYYY
                        if (match[1] > 12 || match[3] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                }
            } else {
                switch (match[2]) {
                    case '-':
                    { // YY-M-D
                        if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                            return fail;
                        }

                        year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                        return new Date(year, parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '.':
                    { // D.M.YY or H.MM.SS
                        if (match[5] >= 70) { // D.M.YY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }

                            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                        if (match[5] < 60 && !match[6]) { // H.MM.SS
                            if (match[1] > 23 || match[3] > 59) {
                                return fail;
                            }

                            today = new Date();
                            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                        }

                        return fail; // invalid format, cannot be parsed
                    }
                    case '/':
                    { // M/D/YY
                        if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                            return fail;
                        }

                        year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                        return new Date(year, parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case ':':
                    { // HH:MM:SS
                        if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                    }
                }
            }
        }

        // other formats and "now" should be parsed by Date.parse()
        if (text === 'now') {
            return now === null || isNaN(now) ? new Date()
                .getTime() / 1000 | 0 : now | 0;
        }
        if (!isNaN(parsed = Date.parse(text))) {
            return parsed / 1000 | 0;
        }

        date = now ? new Date(now * 1000) : new Date();
        days = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        ranges = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };

        function lastNext(type, range, modifier) {
            var diff, day = days[range];

            if (typeof day !== 'undefined') {
                diff = day - date.getDay();

                if (diff === 0) {
                    diff = 7 * modifier;
                } else if (diff > 0 && type === 'last') {
                    diff -= 7;
                } else if (diff < 0 && type === 'next') {
                    diff += 7;
                }

                date.setDate(date.getDate() + diff);
            }
        }

        function process(val) {
            var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
                type = splt[0],
                range = splt[1].substring(0, 3),
                typeIsNumber = /\d+/.test(type),
                ago = splt[2] === 'ago',
                num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

            if (typeIsNumber) {
                num *= parseInt(type, 10);
            }

            if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
            }

            if (range === 'wee') {
                return date.setDate(date.getDate() + (num * 7));
            }

            if (type === 'next' || type === 'last') {
                lastNext(type, range, num);
            } else if (!typeIsNumber) {
                return false;
            }

            return true;
        }

        times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
        regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

        match = text.match(new RegExp(regex, 'gi'));
        if (!match) {
            return fail;
        }

        for (i = 0, len = match.length; i < len; i++) {
            if (!process(match[i])) {
                return fail;
            }
        }

        // ECMAScript 5 only
        // if (!match.every(process))
        //    return false;

        return (date.getTime() / 1000);
    }

    $.system.updateCurrencies = function(manual){
        if($('#currency_body').length!=0){
            if(!app.connectionStatus){
                if(app.storage.getItem("currency") == null){}
                else{
                    $.system.processCurrencies(app.storage.getItem("currency"));
                }

            }
            else
                $.ajax({url: 'http://www.irsaex.ir/core/retrieveCurrencies?lastUpdate='+ $.system.currency_lastUpdate, complete: function(res){
                    if(res.responseText=='no change') return;
                    if(isNaN(manual))
                        $("#updateCounter_currencies").attr('counter', 0);
                    $('#currency_body').html('');

                    app.storage.setItem("currency", res.responseText);
                    $.system.processCurrencies(res.responseText);
                }});
        }
    }

    $.system.processCurrencies = function(res){
        var res = $.parseJSON(res);
        $.system.currency_lastUpdate = res.last_update;

        var d=$.system.strtotime($.system.currency_lastUpdate);
        var now =$.system.strtotime(new Date().toString())+14100;
        var f = Math.round(now-d);
        $('#updateCounter_currencies').attr('counter', f);

        for(var i = 0; i < res.data.length; i++){
            var record = res.data[i];

            // Generating Table Row
            var tr = document.createElement("TR");
            tr.setAttribute('record_id', record.id);
            tr.setAttribute('name', record.name);


            // Generating Flag Column
            var td_flag = document.createElement("TD");
            td_flag.align = "center";
            var img_flag = document.createElement("IMG");
            img_flag.src = '_images/biggerFlags/'+record.flag.toLowerCase()+'.png';
            img_flag.className = 'currencyFlag';
            img_flag.style.maxWidth = '32px';

            td_flag.appendChild(img_flag);

            // Generating Code Column
            var td_code = document.createElement("TD");
            td_code.innerHTML = record.code;

            // Generating Name Column
            var td_name = document.createElement("TD");
            td_name.innerHTML = record.name;

            // Generating Change Column
            var td_changes = document.createElement("TD");
            td_changes.innerHTML = $.system.number_format(record.fields.difference);

            var div_changeIcon = document.createElement('DIV');
            div_changeIcon.className = parseInt(record.fields.difference) < 0 ? 'icon-arrow-down' : parseInt(record.fields.difference) == 0 ? '' : 'icon-arrow-up';
            td_changes.appendChild(div_changeIcon);

            // Generating Buy Price Column
            var td_buy = document.createElement("TD");
            td_buy.innerHTML = $.system.number_format(record.fields.buy,1);

            // Generating Sell Price Column
            var td_sell = document.createElement("TD");
            td_sell.innerHTML = $.system.number_format(record.fields.sell,1);

            // Appending all into the Table Row
            tr.appendChild(td_flag);
            tr.appendChild(td_code);
            tr.appendChild(td_name);
            tr.appendChild(td_changes);
            tr.appendChild(td_buy);
            tr.appendChild(td_sell);


            // Handling Chart Event
            $(tr).click(function(){
                $("#dialog-chart").attr('title', 'Ù†Ù…ÙˆØ¯Ø§Ø± Ù‚ÛŒÙ…Øª Ø®Ø±ÛŒØ¯ Ùˆ ÙØ±ÙˆØ´ '+$(this).attr('name')).dialog({
                    width: 800,
                    height: 460,
                    modal: true,show: {
                        effect: "bounce",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 200
                    }
                });

                $("[aria-describedby='dialog-chart']").find("SPAN.ui-dialog-title").html('Ù†Ù…ÙˆØ¯Ø§Ø± Ù‚ÛŒÙ…Øª Ø®Ø±ÛŒØ¯ Ùˆ ÙØ±ÙˆØ´ '+$(this).attr('name'));

                $that = $(this);
                $.getJSON('core/jsonp/currency/'+$(this).attr('record_id')+'?filter=buy&callback=?', function(buyData){
                    $.getJSON('core/jsonp/currency/'+$that.attr('record_id')+'?filter=sell&callback=?', function(sellData){
                        $('#chart').highcharts('StockChart', {
                            chart:{
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            },
                            rangeSelector : {
                                selected : 1
                            },

                            title : {
                                text : $($that).attr('title')
                            },

                            series : [{
                                name : 'Ø®Ø±ÛŒØ¯',
                                data : buyData
                            },{
                                name : 'ÙØ±ÙˆØ´',
                                data : sellData,
                                color: 'green'}]
                        });
                    });

                });
            });

            $('#currency_body').append(tr);
        }
    }

    $.system.updateCoins = function(manual){

        if($('#coin_body').length!=0){
            if(!app.connectionStatus){
                if(app.storage.getItem("coins") == null){}
                else{
                    $.system.processCoins(app.storage.getItem("coins"));
                }

            }
            else
                $.ajax({url: 'http://www.irsaex.ir/core/retrieveCoins?lastUpdate='+$.system.coin_lastUpdate, complete: function(res){
                    if(res.responseText=='no change') return;
                    if(isNaN(manual))
                        $("#updateCounter_coins").attr('counter', 0);
                    $('#coin_body').html('');

                    app.storage.setItem("coins", res.responseText);
                    $.system.processCoins(res.responseText);
                }});
        }
    }

    $.system.processCoins = function(res){
        var res = $.parseJSON(res);
        $.system.coin_lastUpdate = res.last_update;

        var d=$.system.strtotime($.system.coin_lastUpdate);
        var now =$.system.strtotime(new Date().toString())+14100;
        var f = Math.round(now-d);
        $('#updateCounter_coins').attr('counter', f);

        for(var i = 0; i < res.data.length; i++){
            var record = res.data[i];

            // Generating Table Row
            var tr = document.createElement("TR");
            tr.setAttribute('record_id', record.id);
            tr.setAttribute('name', record.name);


            // Generating Icon Column
            var td_icon = document.createElement("TD");
            td_icon.align = "center";
            var img_icon = document.createElement("IMG");
            img_icon.src = '_images/golds/'+record.icon+'.png';

            td_icon.appendChild(img_icon);

            // Generating Name Column
            var td_name = document.createElement("TD");
            td_name.innerHTML = record.name;

            // Generating Change Column
            var td_changes = document.createElement("TD");
            td_changes.innerHTML = $.system.number_format(record.fields.difference);

            var div_changeIcon = document.createElement('DIV');
            div_changeIcon.className = parseInt(record.fields.difference) < 0 ? 'icon-arrow-down' : parseInt(record.fields.difference) == 0 ? '' : 'icon-arrow-up';
            td_changes.appendChild(div_changeIcon);

            // Generating Buy Price Column
            var td_buy = document.createElement("TD");
            td_buy.innerHTML = $.system.number_format(record.fields.buy,1);

            // Generating Sell Price Column
            var td_sell = document.createElement("TD");
            td_sell.innerHTML = $.system.number_format(record.fields.sell,1);

            // Appending all into the Table Row
            tr.appendChild(td_icon);
            tr.appendChild(td_name);
            tr.appendChild(td_changes);
            tr.appendChild(td_buy);
            tr.appendChild(td_sell);


            // Handling Chart Event
            $(tr).click(function(){
                $("#dialog-chart").attr('title', 'Ù†Ù…ÙˆØ¯Ø§Ø± Ù‚ÛŒÙ…Øª Ø®Ø±ÛŒØ¯ Ùˆ ÙØ±ÙˆØ´ '+$(this).attr('name')).dialog({
                    width: 800,
                    height: 460,
                    modal: true,show: {
                        effect: "bounce",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 200
                    }
                });

                $("[aria-describedby='dialog-chart']").find("SPAN.ui-dialog-title").html('Ù†Ù…ÙˆØ¯Ø§Ø± Ù‚ÛŒÙ…Øª Ø®Ø±ÛŒØ¯ Ùˆ ÙØ±ÙˆØ´ '+$(this).attr('name'));

                $that = $(this);
                $.getJSON('core/jsonp/coin/'+$(this).attr('record_id')+'?filter=buy&callback=?', function(buyData){
                    $.getJSON('core/jsonp/coin/'+$that.attr('record_id')+'?filter=sell&callback=?', function(sellData){
                        $('#chart').highcharts('StockChart', {
                            chart:{
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            },
                            rangeSelector : {
                                selected : 1
                            },

                            title : {
                                text : $($that).attr('title')
                            },

                            series : [{
                                name : 'Ø®Ø±ÛŒØ¯',
                                data : buyData
                            },{
                                name : 'ÙØ±ÙˆØ´',
                                data : sellData,
                                color: 'green'}]
                        });
                    });

                });
            });

            $('#coin_body').append(tr);
        }
    }

    $.system.updateGolds = function(manual){
        if($('#coin_body').length!=0){
            if(!app.connectionStatus){
                if(app.storage.getItem("golds") == null){}
                else{
                    $.system.processGolds(app.storage.getItem("golds"));
                }

            }
            else
                $.ajax({url: 'http://www.irsaex.ir/core/retrieveGolds?lastUpdate='+ $.system.gold_lastUpdate, complete: function(res){
                    if(res.responseText=='no change') return;
                    if(isNaN(manual))
                        $("#updateCounter_golds").attr('counter', 0);
                    $('#gold_body').html('');

                    app.storage.setItem("golds", res.responseText);
                    $.system.processGolds(res.responseText);
                }});
        }
    }

    $.system.processGolds = function(res){
        var res = $.parseJSON(res);
        $.system.gold_lastUpdate = res.last_update;

        var d=$.system.strtotime($.system.gold_lastUpdate);
        var now =$.system.strtotime(new Date().toString())+14100;
        var f = Math.round(now-d);
        $('#updateCounter_golds').attr('counter', f);

        for(var i = 0; i < res.data.length; i++){
            var record = res.data[i];

            // Generating Table Row
            var tr = document.createElement("TR");
            tr.setAttribute('record_id', record.id);
            tr.setAttribute('name', record.name);

            // Generating Name Column
            var td_name = document.createElement("TD");
            td_name.innerHTML = record.name;

            // Generating Change Column
            var td_changes = document.createElement("TD");
            td_changes.innerHTML = $.system.number_format(record.fields.difference);

            var div_changeIcon = document.createElement('DIV');
            div_changeIcon.className = parseInt(record.fields.difference) < 0 ? 'icon-arrow-down' : parseInt(record.fields.difference) == 0 ? '' : 'icon-arrow-up';
            td_changes.appendChild(div_changeIcon);

            // Generating Sell Price Column
            var td_sell = document.createElement("TD");
            td_sell.innerHTML = $.system.number_format(record.fields.sell, 1)+' '+(i<2 ? '*' : '**');

            // Appending all into the Table Row

            tr.appendChild(td_name);
            tr.appendChild(td_changes);

            tr.appendChild(td_sell);


            // Handling Chart Event
            $(tr).click(function(){
                $("#dialog-chart").attr('title', 'Ù†Ù…ÙˆØ¯Ø§Ø± Ù‚ÛŒÙ…Øª Ø®Ø±ÛŒØ¯ Ùˆ ÙØ±ÙˆØ´ '+$(this).attr('name')).dialog({
                    width: 800,
                    height: 460,
                    modal: true,show: {
                        effect: "bounce",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 200
                    }
                });

                $("[aria-describedby='dialog-chart']").find("SPAN.ui-dialog-title").html('Ù†Ù…ÙˆØ¯Ø§Ø± Ù‚ÛŒÙ…Øª Ø®Ø±ÛŒØ¯ Ùˆ ÙØ±ÙˆØ´ '+$(this).attr('name'));

                $that = $(this);
                $.getJSON('core/jsonp/gold/'+$(this).attr('record_id')+'?filter=buy&callback=?', function(buyData){
                    $.getJSON('core/jsonp/gold/'+$that.attr('record_id')+'?filter=sell&callback=?', function(sellData){
                        $('#chart').highcharts('StockChart', {
                            chart:{
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            },
                            rangeSelector : {
                                selected : 1
                            },

                            title : {
                                text : $($that).attr('title')
                            },

                            series : [{
                                name : 'Ø®Ø±ÛŒØ¯',
                                data : buyData
                            },{
                                name : 'ÙØ±ÙˆØ´',
                                data : sellData,
                                color: 'green'}]
                        });
                    });

                });
            });

            $('#gold_body').append(tr);
        }
    }

    $.system.core = function(opt){
        opt = $.extend({complete: function(res){}, method: '', data: ''}, opt);
        $.mobile.loading('show');
        $.ajax({url: 'http://irsaex.ir/core/'+opt.method, complete: function(res){
            $.mobile.loading('hide');
            opt.complete(res);
        }, data: opt.data, method: 'POST'});
    }

    $.system.loginUser = function(){

        if($('#login_email').val().length < 3){
            $('#login_email').focus();
            return;
        }

        if($('#login_psw').val().length < 6){
            $('#login_psw').focus();
            return;
        }


        $.system.core({method: 'userLogin', data: 'email='+$('#login_email').val()+'&password='+$('#login_psw').val(), complete: function(res){

            if(res.responseJSON.code == 4){
                $('#dialog-loginError').popup('open');
                return;
            }

            $.system.token = res.responseJSON.data.token;
            app.storage.setItem('token', $.system.token);

            $("[href='#page-user']").html().click();
        }});
    }
})(jQuery);

String.prototype.toPersian = String.prototype.toFaDigit = function (a) {
    return this.replace(/\d+/g, function (digit) {
        var digitArr = [], pDigitArr = [];
        for (var i = 0, len = digit.length; i < len; i++) {
            digitArr.push(digit.charCodeAt(i));
        }
        for (var j = 0, leng = digitArr.length; j < leng; j++) {
            pDigitArr.push(String.fromCharCode(digitArr[j] + ((!!a && a == true) ? 1584 : 1728)));
        }
        return pDigitArr.join('');
    });
};
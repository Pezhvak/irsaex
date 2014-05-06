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

    $.system.updateCurrencies = function(manual){
        if($('#currency_body').length!=0){
            $.ajax({url: 'http://www.irsaex.ir/core/retrieveCurrencies?lastUpdate='+ $.system.currency_lastUpdate, complete: function(res){
                if(res.responseText=='no change') return;
                if(isNaN(manual))
                    $("#updateCounter_currencies").attr('counter', 0);
                $('#currency_body').html('');

                var res = $.parseJSON(res.responseText);
                $.system.currency_lastUpdate = res.last_update;
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
            }});
        }
    }

    $.system.updateCoins = function(manual){
        if($('#coin_body').length!=0){
            $.ajax({url: 'http://www.irsaex.ir/core/retrieveCoins?lastUpdate='+$.system.coin_lastUpdate, complete: function(res){
                if(res.responseText=='no change') return;
                if(isNaN(manual))
                    $("#updateCounter_coins").attr('counter', 0);
                $('#coin_body').html('');

                var res = $.parseJSON(res.responseText);
                $.system.coin_lastUpdate = res.last_update;
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
            }});
        }
    }

    $.system.updateGolds = function(manual){
        if($('#coin_body').length!=0){
            $.ajax({url: 'http://www.irsaex.ir/core/retrieveGolds?lastUpdate='+ $.system.gold_lastUpdate, complete: function(res){
                if(res.responseText=='no change') return;
                if(isNaN(manual))
                    $("#updateCounter_golds").attr('counter', 0);
                $('#gold_body').html('');

                var res = $.parseJSON(res.responseText);
                $.system.gold_lastUpdate = res.last_update;
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
            }});
        }
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
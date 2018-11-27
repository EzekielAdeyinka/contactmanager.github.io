var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

$(function () {
    $('#modal_submit').submit(function (event) {
        event.preventDefault();
        const formEl = $(this);
        const submitButton = $('input[type=submit]', formEl);
        var ary = $("#modal_submit").serializeArray();
        var obj = {};
        for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
        var number = obj.amount;
        obj.amount = obj.amount * 100;
        var an = new Date();
        var d = dateFormat(new Date(an.setDate(an.getDate())), "yyyy-mm-dd 00:00:00");
        obj.transcript_time = d;
        axios({
            method: 'post',
            url: 'http://' + window.location.host + '/api/modules/create/entries',
            data: obj,

            headers:
                {
                    'Content-Type': 'application/json',
                    'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                },
        })
            .then(function (response) {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'green', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: "Entry Posted"
                });
                setTimeout(function () {
                    document.getElementById('modal_submit').reset();
                    $('.i-checks').iCheck({
                        radioClass: 'iradio_square-green'
                    });
                }, 2000);
                $(".typeahead_2").typeahead({source: response.data.item});
                $('.typeahead_1').typeahead({source: response.data.units});
                $('.typeahead_4').typeahead({source: response.data.subject});
            })
            .catch(function (error) {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'red', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: error.response.data.message
                });
                $("#modal_submit").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
            });
    });
});
$(function () {
    $('#entries_edit').submit(function (event) {
        event.preventDefault();
        const formEl = $(this);
        const submitButton = $('input[type=submit]', formEl);
        var ary = $("#entries_edit").serializeArray();
        var obj = {};
        for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
        obj.amount = parseFloat(obj.amount).toFixed(2) * 100;
        axios({
            method: 'put',
            url: 'http://' + window.location.host + '/api/modules/entries/edit',
            data: obj,
            headers:
                {
                    'Content-Type': 'application/json',
                    'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                },
        })
            .then(function (response) {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'green', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: 'Entry has been updated'
                });
                setTimeout(function () {
                    document.getElementById('entries_edit').reset();
                    $('.i-checks').iCheck({
                        radioClass: 'iradio_square-green'
                    });
                    $('#titi').trigger('click');
                }, 2000);
            })
            .catch(function (error) {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'red', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: error.response.data.message
                });
                $("#modal_submit").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
            });
    });
});


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

new Vue({
    el: '#page-wrapper',
    data: {
        email: this.document.getElementById('users_id').value,
        checkUsers: '[]',
        dashboard_render: '[]',
        Call_Setup: '[]',
        data_explanatry: '[]',
        data_che: '[]',
        total_expenses: '[]',
        total_income: '[]',
        total_profit: '[]',
        data_all: '[]'
    },
    beforeMount() {
        this.onLoad();
        this.call_schedue_setup();
    },
    methods: {
        onLoad: function () {
            var an = new Date();
            var d = dateFormat(new Date(an.setDate(an.getDate() - 30)), "yyyy-mm-dd 00:00:00");
            this.$data.data_che = d;
            axios({
                method: 'put',
                url: 'http://' + window.location.host + '/api/modules/get/user/session',
                data: this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    $('.i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'
                    });
                    this.$data.checkUsers = response.data.userData;
                    this.$data.data_explanatry = response.data;
                    this.$data.data_explanatry = response.data;
                    if (response.data.exp_total_data_2[0].total > response.data.exp_total_data[0].total){
                        $("#loss_").show();
                    }else if (response.data.exp_total_data[0].total >= response.data.exp_total_data_2[0].total) {
                        $("#profit_").show();
                    }                    this.$data.dashboard_render = response.data.Datas;
                    setTimeout(function () {
                        $('.dataTables-example').DataTable({
                            pageLength: 5,
                            responsive: true,
                            dom: '<"html5buttons"B>lTfgitp',
                            buttons: [
                                {extend: 'copy'},
                                {extend: 'csv'},
                                {extend: 'excel', title: 'ExampleFile'},
                                {extend: 'pdf', title: 'ExampleFile'},

                                {
                                    extend: 'print',
                                    customize: function (win) {
                                        $(win.document.body).addClass('white-bg');
                                        $(win.document.body).css('font-size', '10px');

                                        $(win.document.body).find('table')
                                            .addClass('compact')
                                            .css('font-size', 'inherit');
                                    }
                                }
                            ]

                        });
                        $('#loading').hide();
                    }, 1000);
                    this.$data.total_expenses = response.data.exp_total_data_2[0].total;
                    var number = this.$data.total_expenses / 100;
                    let format = new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'NGN'
                    }).format(number);
                    this.$data.total_expenses = format.replace("NGN", "");

                    this.$data.total_income = response.data.exp_total_data[0].total;
                    var number1 = this.$data.total_income / 100;
                    let format1 = new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'NGN'
                    }).format(number1);
                    this.$data.total_income = format1.replace("NGN", "");
                        this.$data.total_profit = response.data.exp_total_data[0].total - response.data.exp_total_data_2[0].total;
                    var number2 = this.$data.total_profit / 100;
                    let format2 = new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'NGN'
                    }).format(number2);
                    this.$data.total_profit = format2.replace("NGN", "");
                    switch (true) {
                        case (response.data.userData[0].roles == 'superadmin'):
                            $("#dashboard").show();
                            $("#reports").show();
                            $("#settings").show();
                            $("#appenda_show").show();
                            break;
                        case (response.data.userData[0].roles == 'business-owner'):
                            $("#dashboard").show();
                            $("#income").show();
                            $("#expenses").show();
                            $("#transcriptions").show();
                            $("#reports2").show();
                            $("#settings3").show();
                            var links = response.data.Datas;
                            for (var key in links) {
                                var number = links[key].amount / 100;
                                links[key].amount = new Intl.NumberFormat('en', {
                                    style: 'currency',
                                    currency: 'NGN'
                                }).format(number);
                                var parse = new Date(links[key].date_captutred);
                                var formattedDate = dateFormat(parse, "dddd, mmmm dS, yyyy");
                                links[key].date_captutred = formattedDate;
                            }
                            break;
                        default:
                            alert('Error Contact Admin');
                    }
                })
                .catch(function (error) {
                    iziToast.show({
                        theme: 'light', // dark
                        color: 'red', // blue, red, green, yellow
                        animateInside: true,
                        drag: true,
                        icon: 'material-icons',
                        transitionIn: 'flipInX',
                        transitionOut: 'flipOutX',
                        pauseOnHover: true,
                        progressBar: true,
                        progressBarColor: 'white',
                        progressBarEasing: 'linear',
                        transitionOutMobile: 'fadeOutDown',
                        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                        message: error.response.data.message
                    });
                });
        },
        call_schedue_setup: function () {
            axios({
                method: 'put',
                url: 'http://' + window.location.host + '/api/modules/list/call_schedue',
                data: this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    this.$data.Call_Setup = response.data.userData[0];
                    if (this.$data.Call_Setup.monday == 'yes') {
                        $('#inlineCheckbox1').prop('checked', true);
                    } else {
                        $('#inlineCheckbox1').prop('checked', false);
                    }
                    if (this.$data.Call_Setup.tuesday == 'yes') {
                        $('#inlineCheckbox2').prop('checked', true);
                    } else {
                        $('#inlineCheckbox2').prop('checked', false);
                    }
                    if (this.$data.Call_Setup.wednesday == 'yes') {
                        $('#inlineCheckbox3').prop('checked', true);
                    } else {
                        $('#inlineCheckbox3').prop('checked', false);
                    }
                    if (this.$data.Call_Setup.thursday == 'yes') {
                        $('#inlineCheckbox4').prop('checked', true);
                    } else {
                        $('#inlineCheckbox4').prop('checked', false);
                    }
                    if (this.$data.Call_Setup.friday == 'yes') {
                        $('#inlineCheckbox5').prop('checked', true);
                    } else {
                        $('#inlineCheckbox5').prop('checked', false);
                    }
                    if (this.$data.Call_Setup.saturday == 'yes') {
                        $('#inlineCheckbox6').prop('checked', true);
                    } else {
                        $('#inlineCheckbox6').prop('checked', false);
                    }
                    if (this.$data.Call_Setup.sunday == 'yes') {
                        $('#inlineCheckbox7').prop('checked', true);
                    } else {
                        $('#inlineCheckbox7').prop('checked', false);
                    }
                })
                .catch(function (error) {
                    iziToast.show({
                        theme: 'light', // dark
                        color: 'red', // blue, red, green, yellow
                        animateInside: true,
                        drag: true,
                        icon: 'material-icons',
                        transitionIn: 'flipInX',
                        transitionOut: 'flipOutX',
                        pauseOnHover: true,
                        progressBar: true,
                        progressBarColor: 'white',
                        progressBarEasing: 'linear',
                        transitionOutMobile: 'fadeOutDown',
                        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                        message: "Error"
                    });
                });
        },
        call_now: function () {
            document.getElementById("call_now").disabled = true;
            var Api_call_now = {
                "Id": this.$data.checkUsers[0].email,
                "EventData": [{
                    "Key": "PhoneNumber",
                    "Value": this.$data.checkUsers[0].phone
                }, {
                    "Key": "InitiateCall",
                    "Value": "True"
                }]
            };
            axios({
                method: 'post',
                url: 'http://admin.stayon.mercury.2ilabs.co/api/events/createevent',
                data: Api_call_now,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer lXIbnXfHj6jYXkaASLizBGsbNP0pJB29EYlZezRLEDk=',
                    },
            }).then(response => {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'green', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: 'Call In Progress'
                });
                document.getElementById("call_now").disabled = false;
            }).catch(function (error) {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'red', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: "Cant Initiate Now Try Later"
                });
                document.getElementById("call_now").disabled = false;
            });
        },
        foo: function (data) {
            this.$data.data_all = data;
            let amount = this.$data.data_all.amount;
            this.$data.data_all.amount = amount.replace('NGN', '');
        },
        OnSubmit: function () {
            document.getElementById("filter_button").disabled = true;
            $('#loading').show();
            this.$data.dashboard_render = '';
            this.$data.total_income = '';
            this.$data.total_expenses = '';
            this.$data.total_profit = '';
            this.$data.data_explanatry = '';
            var ary = $("#filter_append").serializeArray();
            var obj = {};
            for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
            $(".dataTables-example").dataTable().fnDestroy();
            axios({
                method: 'put',
                url: 'http://' + window.location.host + '/api/modules/entries/filter_all',
                data: obj,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': document.getElementById('use').value
                    },
            })
                .then(response => {
                    this.$data.data_explanatry = response.data;
                    if (response.data.exp_total_data_2[0].total > response.data.exp_total_data[0].total){
                        $("#loss_").show();
                    }else if (response.data.exp_total_data[0].total >= response.data.exp_total_data_2[0].total) {
                        $("#profit_").show();
                    }                    this.$data.dashboard_render = response.data.Datas;
                    this.$data.total_expenses = response.data.exp_total_data_2[0].total;
                    var number = this.$data.total_expenses / 100;
                    let format = new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'NGN'
                    }).format(number);
                    this.$data.total_expenses = format.replace("NGN", "");

                    this.$data.total_income = response.data.exp_total_data[0].total;
                    var number1 = this.$data.total_income / 100;
                    let format1 = new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'NGN'
                    }).format(number1);
                    this.$data.total_income = format1.replace("NGN", "");
                    this.$data.total_profit = response.data.exp_total_data[0].total - response.data.exp_total_data_2[0].total;
                    var number2 = this.$data.total_profit / 100;
                    let format2 = new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'NGN'
                    }).format(number2);
                    this.$data.total_profit = format2.replace("NGN", "");
                    this.$data.dashboard_render = response.data.filtered_data;
                    var  links = response.data.filtered_data;
                    for (var key in links) {
                        var number = links[key].amount / 100;
                        links[key].amount = new Intl.NumberFormat('en', {
                            style: 'currency',
                            currency: 'NGN'
                        }).format(number);
                        var parse = new Date(links[key].date_captutred);
                        var formattedDate = dateFormat(parse, "dddd, mmmm dS, yyyy");
                        links[key].date_captutred = formattedDate;
                    }
                    setTimeout(function () {
                        $('.dataTables-example').DataTable({
                            pageLength: 200,
                            responsive: true,
                            dom: '<"html5buttons"B>lTfgitp',
                            buttons: [
                                {extend: 'copy'},
                                {extend: 'csv'},
                                {extend: 'excel', title: 'ExampleFile'},
                                {extend: 'pdf', title: 'ExampleFile'},

                                {
                                    extend: 'print',
                                    customize: function (win) {
                                        $(win.document.body).addClass('white-bg');
                                        $(win.document.body).css('font-size', '10px');

                                        $(win.document.body).find('table')
                                            .addClass('compact')
                                            .css('font-size', 'inherit');
                                    }
                                }
                            ]

                        });
                        $('#loading').hide();
                    }, 1000);
                    document.getElementById("filter_button").disabled = false;
                }).catch(function (error) {
            });
        }
    }
});

// Listting Script for Items
new Vue({
    el: '#myModal4',
    data: {
        email: this.document.getElementById('use').value,
        results: ''
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad: function () {
            $.ajax({
                method: 'get',
                url: 'http://' + window.location.host + '/api/modules/list/items',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': this.$data.email
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links) {
                        $(".typeahead_2").typeahead({source: response.userData});
                    }
                })
                .catch(function (error) {
                    iziToast.show({
                        theme: 'light', // dark
                        color: 'red', // blue, red, green, yellow
                        animateInside: true,
                        drag: true,
                        icon: 'material-icons',
                        transitionIn: 'flipInX',
                        transitionOut: 'flipOutX',
                        pauseOnHover: true,
                        progressBar: true,
                        progressBarColor: 'white',
                        progressBarEasing: 'linear',
                        transitionOutMobile: 'fadeOutDown',
                        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                        message: error.response.data.message
                    });
                    $("#form_hide").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
                });
        }
    }
});
// Listting Script for Units
new Vue({
    el: '#myModal4',
    data: {
        results: '',
        email: this.document.getElementById('use').value,
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad: function () {
            $.ajax({
                method: 'get',
                url: 'http://' + window.location.host + '/api/modules/list/units',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': this.$data.email
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links) {
                        $('.typeahead_1').typeahead({source: response.userData});
                    }
                })
                .catch(function (error) {
                    iziToast.show({
                        theme: 'light', // dark
                        color: 'red', // blue, red, green, yellow
                        animateInside: true,
                        drag: true,
                        icon: 'material-icons',
                        transitionIn: 'flipInX',
                        transitionOut: 'flipOutX',
                        pauseOnHover: true,
                        progressBar: true,
                        progressBarColor: 'white',
                        progressBarEasing: 'linear',
                        transitionOutMobile: 'fadeOutDown',
                        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                        message: error.response.data.message
                    });
                    $("#form_hide").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
                });
        }
    }
});
// Listting Script for Subject
new Vue({
    el: '#myModal4',
    data: {
        results: '',
        email: this.document.getElementById('use').value,
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad: function () {
            $.ajax({
                method: 'get',
                url: 'http://' + window.location.host + '/api/modules/list/subjects',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': this.$data.email
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links) {
                        $('.typeahead_4').typeahead({source: response.userData});
                    }
                })
                .catch(function (error) {
                    iziToast.show({
                        theme: 'light', // dark
                        color: 'red', // blue, red, green, yellow
                        animateInside: true,
                        drag: true,
                        icon: 'material-icons',
                        transitionIn: 'flipInX',
                        transitionOut: 'flipOutX',
                        pauseOnHover: true,
                        progressBar: true,
                        progressBarColor: 'white',
                        progressBarEasing: 'linear',
                        transitionOutMobile: 'fadeOutDown',
                        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                        message: error.response.data.message
                    });
                    $("#form_hide").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
                });
        }
    }
});

function convertDate(date) {

// # valid js Date and time object format (YYYY-MM-DDTHH:MM:SS)
    var dateTimeParts = date.split(' ');

// # this assumes time format has NO SPACE between time and am/pm marks.
    if (dateTimeParts[1].indexOf(' ') == -1 && dateTimeParts[2] === undefined) {

        var theTime = dateTimeParts[1];

        // # strip out all except numbers and colon
        var ampm = theTime.replace(/[0-9:]/g, '');

        // # strip out all except letters (for AM/PM)
        var time = theTime.replace(/[[^a-zA-Z]/g, '');

        if (ampm == 'pm') {

            time = time.split(':');

            // # if time is 12:00, don't add 12
            if (time[0] == 12) {
                time = parseInt(time[0]) + ':' + time[1] + ':00';
            } else {
                time = parseInt(time[0]) + 12 + ':' + time[1] + ':00';
            }

        } else { // if AM

            time = time.split(':');

            // # if AM is less than 10 o'clock, add leading zero
            if (time[0] < 10) {
                time = '0' + time[0] + ':' + time[1] + ':00';
            } else {
                time = time[0] + ':' + time[1] + ':00';
            }
        }
    }
// # create a new date object from only the date part
    var dateObj = new Date(dateTimeParts[0]);

// # add leading zero to date of the month if less than 10
    var dayOfMonth = (dateObj.getDate() < 10 ? ("0" + dateObj.getDate()) : dateObj.getDate());

// # parse each date object part and put all parts together
    var yearMoDay = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dayOfMonth;

// # finally combine re-formatted date and re-formatted time!
    var date = new Date(yearMoDay + 'T' + time);

    return date;
}

$(function () {
    $('#call_setup_edit').submit(function (event) {
        event.preventDefault();
        const formEl = $(this);
        const submitButton = $('input[type=submit]', formEl);
        var ary = $("#call_setup_edit").serializeArray();
        var obj = {};
        for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
        var an = new Date();
        var d = new Date(an.setDate(an.getDate() + 1));
        var n = d.toLocaleDateString();
        var ts = Math.floor(Date.now() / 1000);
        var Api_Call = {
            "Id": obj.biss_email,
            "EventData": [{
                "Key": "PhoneNumber",
                "Value": obj.phone_number
            }, {
                "Key": "RecurringInterval",
                "Value": '1'
            }, {
                "Key": "RecurringStartDate",
                "Value": n + ',' + obj.time_call
            }, {
                "Key": "RecurringCyclePeriod",
                "Value": ts
            }, {
                "Key": "IsRecurring",
                "Value": "True"
            }]
        };
        console.log(Api_Call);
        axios({
            method: 'put',
            url: 'http://' + window.location.host + '/api/modules/settings/call_schedue_edit',
            data: obj,
            headers:
                {
                    'Content-Type': 'application/json',
                    'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                },
        })
            .then(function (response) {
                axios({
                    method: 'post',
                    url: 'http://admin.stayon.mercury.2ilabs.co/api/events/createevent',
                    data: Api_Call,
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer lXIbnXfHj6jYXkaASLizBGsbNP0pJB29EYlZezRLEDk=',
                        },
                });
                iziToast.show({
                    theme: 'light', // dark
                    color: 'green', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: 'Call-Schedue Updated Successfully'
                });
            })
            .catch(function (error) {
                iziToast.show({
                    theme: 'light', // dark
                    color: 'red', // blue, red, green, yellow
                    animateInside: true,
                    drag: true,
                    icon: 'material-icons',
                    transitionIn: 'flipInX',
                    transitionOut: 'flipOutX',
                    pauseOnHover: true,
                    progressBar: true,
                    progressBarColor: 'white',
                    progressBarEasing: 'linear',
                    transitionOutMobile: 'fadeOutDown',
                    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
                    message: error.response.data.message
                });
                $("#call_setup_edit").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
            });
    });
});
// The From and To Filter
$(function () {
    $('#filter_append').submit(function (event) {
        event.preventDefault();
        const formEl = $(this);
        const submitButton = $('input[type=submit]', formEl);
        var ary = $("#filter_append").serializeArray();
        var obj = {};
        for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
        axios({
            method: 'post',
            url: 'http://' + window.location.host + '/api/v1/web_hook/Haimdall_t_Graph',
            data: obj,
            headers:
                {
                    'Content-Type': 'application/json',
                    'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    'email': document.getElementById('users_id').value
                },
        })
            .then(response => {
                var ctx = document.getElementById('chart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: response.data,
                    borderWidth: 1,
                    options: {
                        scales: {
                            xAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }).catch(function (error) {

        });
        axios({
            method: 'post',
            url: 'http://' + window.location.host + '/api/v1/web_hook/filter_graph',
            data: obj,
            headers:
                {
                    'Content-Type': 'application/json',
                    'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    'email': document.getElementById('users_id').value
                },
        })
            .then(response => {
                if (response.data.userData1 != '') {
                    var links = response.data.userData1;
                    $('#all_data').html("");
                    for (var key in links) {
                        $("#all_data").append("  <li class=\"list-group-item fist-item\" style=\" margin-bottom: 5px;\" >\n" +
                            "                            <span class=\"pull-right\">\n" +
                            "                             " + links[key].unit + "" +
                            "                            </span>" +
                            "                            <span class=\"label alvie-blue\">"+ links[key].item + "</span>" +
                            "                        </li>");

                    }
                } else {
                    $('#all_data').html("");
                    $("#all_data").append("  <li class=\"list-group-item fist-item\" style=\" margin-bottom: 5px;\" >\n" +
                        "                            <span class=\"pull-right\">\n" +
                        "                             " + "No Data" + "" +
                        "                            </span>\n" +
                        "                            <span class=\"label alvie-blue\">" + "0" + "</span>" + "No Data" + "" +
                        "                        </li>");
                }


            }).catch(function (error) {

        });
    });
});


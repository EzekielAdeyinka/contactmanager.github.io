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
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

new Vue({
    el: '#page-wrapper',
    data: {
        user_id: this.document.getElementById('use').value,
        email: this.document.getElementById('use').value,
        currentLog: '[]',
        data_all: [],
        checkit: '[]'
    },
    beforeMount() {
        this.onLoad();
        this.fetch();
        this.fetchitem();
        this.fetchsubjects();
        this.onget();

    },
    methods: {
        onLoad: function () {
            axios({
                method: 'put',
                url: 'http://' + window.location.host + '/api/modules/list/expenses',
                data: this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    this.$data.currentLog = response.data.userData;
                    var links = response.data.userData;
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
                    }, 2000);
                })
                .catch(function (error) {
                    console.log(error);
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
        },
        fetchitem: function () {
            $.ajax({
                method: 'get',
                url: 'http://' + window.location.host + '/api/modules/list/items',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': this.$data.user_id
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links) {
                        $(".typeahead_2").typeahead({source: response.userData});
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
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
        },
        fetch: function () {
            $.ajax({
                method: 'get',
                url: 'http://' + window.location.host + '/api/modules/list/units',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': this.$data.user_id
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links) {
                        $('.typeahead_1').typeahead({source: response.userData});
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
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
        },
        fetchsubjects: function () {
            $.ajax({
                method: 'get',
                url: 'http://' + window.location.host + '/api/modules/list/subjects',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': this.$data.user_id
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links) {
                        $('.typeahead_4').typeahead({source: response.userData});
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
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
        },
        onget: function () {
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
                    this.$data.checkit = response.data.userData;
                    switch (true) {
                        case (response.data.userData[0].roles == 'superadmin'):
                            $("#dashboard").show();
                            $("#reports").show();
                            $("#settings").show();
                            break;
                        case (response.data.userData[0].roles == 'business-owner'):
                            $("#dashboard").show();
                            $("#income").show();
                            $("#expenses").show();
                            $("#transcriptions").show();
                            $("#reports2").show();
                            $("#settings3").show();
                            break;

                        default:
                            alert('Error Contact Admin');
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
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
        foo: function (data) {
            this.$data.data_all = data;
            let amount = this.$data.data_all.amount;
            this.$data.data_all.amount = amount.replace('NGN', '');
            if (this.$data.data_all.entry_type = "expenses") {
                $('#is_data').hide();
                $("#is_valid").show();
            }
        },
        call_now: function () {
            document.getElementById("call_now").disabled = true;
            var Api_call_now = {
                "Id": this.$data.checkit[0].email,
                "EventData": [{
                    "Key": "PhoneNumber",
                    "Value": this.$data.checkit[0].phone
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
        OnSubmit: function () {
            $('#loading').show();
            this.$data.currentLog = '';
            var ary = $("#filter_append").serializeArray();
            var obj = {};
            for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
            $(".dataTables-example").dataTable().fnDestroy();
            axios({
                method: 'put',
                url: 'http://' + window.location.host + '/api/modules/entries/filter_expenses',
                data: obj,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': document.getElementById('use').value
                    },
            })
                .then(response => {
                    this.$data.currentLog = response.data.filtered_data;
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
                    }, 2000);
                }).catch(function (error) {
            });
        }
    }
});
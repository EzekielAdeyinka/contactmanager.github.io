function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
// Login Script
new Vue({
    el: '#app',
    data:{
        userEmail: '',
        password: '',
        newTitle : true
    },
    methods: {
        onSubmit: function() {
            axios({
                method: 'put',
                url: 'http://'+window.location.host+'/api/modules/auth/login',
                data:this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(function(response) {
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
                        message: response.data.message
                    });
                    setCookie('email', response.data.userData[0].email);
                    setCookie('firstname', response.data.userData[0].firstname);
                    setCookie('lastname', response.data.userData[0].lastname);
                    setCookie('user_token', response.data.userData[0].token);
                    setCookie('call_time', response.data.userData[0].time_of_day);
                    setCookie('phone_number', response.data.userData[0].phone);
                    setTimeout(function () {
                        window.location.href = "dashboard"
                    }, 2000);
                })
                .catch(function(error) {
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
                    $("#form_data").effect( "shake", { direction: "left", times: 4, distance: 10}, 1000 );
                });
        }
    }
});

new Vue({
    el: '#reg',
    data: {
        show_content: ''
    },
    methods:{
        foo: function () {
            axios({
                method: 'get',
                url: 'http://'+window.location.host+'/api/modules/settings/terms_cond',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    $('#myModal6').modal('show');
                    this.$data.show_content = response.data;
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
                    $("#form_hide").effect( "shake", { direction: "left", times: 4, distance: 10}, 1000 );
                });
        }
    }
});
// Registration Script
$(function() {
    $('#form_hide').submit(function (event) {
        event.preventDefault();
        const formEl = $(this);
        const submitButton = $('input[type=submit]', formEl);
        var ary = $("#form_hide").serializeArray();
        var obj = {};
        for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
        document.getElementById("reg_sub").disabled = true;
        if (!(obj.off_days1 || obj.off_days2 || obj.off_days3 || obj.off_days4 || obj.off_days5 || obj.off_days6 || obj.off_days7)) {
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
                message: "Please select at least one day"
            });
            $("#form_hide").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
        } else if (this.phone_number.length != 10) {
            const alex = obj.phone_number;
            var ret = alex.replace('0', '');
            var add = '+234' + ret;
           var show = obj.phone_number = add.substring(1);
            var an = new Date();
            var d = new Date(an.setDate(an.getDate() + 1));
            var n = d.toLocaleDateString();
            var ts = Math.floor(Date.now() / 1000);
            var Api_Call = {
    "Id": obj.userEmail,
    "EventData": [{
        "Key": "PhoneNumber",
        "Value": obj.phone_number
    }, {
        "Key": "RecurringInterval",
        "Value": "1"
    }, {
        "Key": "RecurringStartDate",
        "Value": n+ ',' +obj.time_call
    }, {
        "Key": "RecurringCyclePeriod",
        "Value": ts
    }, {
        "Key": "IsRecurring",
        "Value": "True"
    }]
};
            axios({
                        method: 'put',
                        url: 'http://' + window.location.host + '/api/modules/auth/register',
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
                            }).then(response => {
                            }).catch(function (error) {
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
                                message: 'Setting things up…'
                            });
                            $("#form_hide").hide();
                            $("#hide_state").hide();
                            $("#message").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
                            setCookie('email', response.data.userData[0].email);
                            setCookie('firstname', response.data.userData[0].firstname);
                            setCookie('lastname', response.data.userData[0].lastname);
                            setCookie('user_token', response.data.userData[0].token);
                            setCookie('call_time', response.data.userData[0].time_of_day);
                            setCookie('phone_number', response.data.userData[0].phone);
                            setTimeout(function () {
                                window.location.href = "setup_complete"
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
                            $("#form_hide").effect("shake", {direction: "left", times: 4, distance: 10}, 1000);
                            document.getElementById("reg_sub").disabled = false;
                        });

        } else {
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
                title: "Error",
                message: "Check Your Phone Number"
            });
        }
    });
});

// Listting Script
new Vue({
    el: '#reg_mount',
    data: {
        results: []
    },
    beforeMount() {
        this.onLoad();
    },
    methods:{
        onLoad: function() {
            $.ajax({
                method: 'get',
                url: 'http://'+window.location.host+'/api/modules/list/distributors',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    var links = response.userData;
                    for (var key in links){
                    $("#check").append("<option>"  + links[key].name + "</option>");
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
                    $("#form_hide").effect( "shake", { direction: "left", times: 4, distance: 10}, 1000 );
                });
        }
    }
});// Login Script
new Vue({
    el: '#app_data',
    data:{
        email: '',
        Data: '[]',
    },

    methods: {
        onSubmit: function() {
            axios({
                method: 'put',
                url: 'http://'+window.location.host+'/api/modules/settings/forgot_password',
                data:this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(function(response) {
                    $("#show").append('<h4>'+ 'Your Password Is [' +  response.data.Hashed_data +']</h4>'+'<h4>'+ 'Your Bussiness Name Is [' +  response.data.userData[0].name +']</h4>'+'<h4>'+ 'Your Phone_Number Is [' +  response.data.userData[0].phone +']</h4>');
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
                        message: response.data.message
                    });
                    setTimeout(function () {
                        $("#forgot_pass").hide();
                        $("#message").show();
                        $("#message").effect( "shake", { direction: "left", times: 4, distance: 10}, 1000 );
                        }, 2000);
                })
                .catch(function(error) {
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
                    $("#form_data").effect( "shake", { direction: "left", times: 4, distance: 10}, 1000 );
                });
        }
    }
});
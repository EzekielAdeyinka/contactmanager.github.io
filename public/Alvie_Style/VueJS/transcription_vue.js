new Vue({
    el: '#page-wrapper',
    data: {
        user_id: this.document.getElementById('use').value,
        email: this.document.getElementById('use').value,
        to: $("[name='to']").val(),
        from:  $('#from').val(),
        aud_identity: '',
        TranscriptLog: '[]',
        data_all: [],
        checkit: '[]',
        TextTranscript: '',
        text_aud: '',
        text_time: '',
        verify_id: '',
        Entries_list: '',
        Entry_date: '',
        data_explanatry: '[]',
        filter_TranscriptLog: '[]'
    },
    beforeMount() {
        this.onLoad();
        this.FetchItem();
        this.FetchUnits();
        this.fetchSubjects();
        this.SessionHandler();
    },
    methods: {
        onLoad: function () {
            axios({
                method: 'post',
                url: 'http://' + window.location.host + '/api/modules/transcript/list_aud_transcripts',
                data: this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    this.$data.TranscriptLog = response.data.userAudio;
                    var links = response.data.userAudio;
                    for (var key in links) {
                        var parse = new Date(links[key].trascript_response_time);
                        var formattedDate = dateFormat(parse, "dddd, mmmm dS, yyyy  h:MM TT");
                        links[key].trascript_response_time = formattedDate;
                    }
                    setTimeout(function () {
                        $('#loading').hide();
                    }, 1000);
                })
                .catch(function (error) {

                });
        },
        FetchItem: function () {
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
        FetchUnits: function () {
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
        fetchSubjects: function () {
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
        SessionHandler: function () {
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
        ViewTranscript: function (data) {
            this.$data.TextTranscript = '';
            this.$data.text_aud = '';
            $('#reset').html("");
            $('#loading_modal_content').show();
            this.$data.aud_identity = data.id;
            this.$data.text_aud = data.transcript_file_url;
            axios({
                method: 'post',
                url: 'http://' + window.location.host + '/api/modules/transcript/list_text_transcripts',
                data: this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                    this.$data.TextTranscript = response.data.userTranscripts;
                    var parse = new Date(response.data.userTranscripts[0].transcript_response_time);
                    this.$data.text_time = dateFormat(parse, "dddd, mmmm dS, yyyy  h:MM TT");
                    $('#loading_modal_content').hide();
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
                        message: "Transcripts Pending"
                    });
                });
        },
        Verify_Entries: function (data) {
            $(".dataTables-example").dataTable().fnDestroy();
            this.$data.Entries_list = '';
            this.$data.Entry_date = '';
            this.$data.data_explanatry = '';
            $('#loading_modal_content5').show();
            this.$data.verify_id = data.id;
           axios({
                method: 'post',
                url: 'http://' + window.location.host + '/api/modules/transcript/verify_transcript',
                data: this.$data,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                    },
            })
                .then(response => {
                  this.$data.Entries_list = response.data.Entries_Data;
                    this.$data.data_explanatry = response.data;
                    var links = response.data.Entries_Data;
                    for (var key in links) {
                        var number = links[key].amount / 100;
                        links[key].amount = new Intl.NumberFormat('en', {
                            style: 'currency',
                            currency: 'NGN'
                        }).format(number);
                        var parse = new Date(response.data.Entries_Data[0].date_captutred);
                        this.$data.Entry_date = dateFormat(parse, "mmmm dS, yyyy");
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
                        $('#loading_modal_content5').hide();
                    }, 1000);
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
                        message: "Entries In Process"
                    });
                });
        },
        foo: function (data) {
            this.$data.data_all = '';
            this.$data.data_all = data;
            let amount = this.$data.data_all.amount;
            this.$data.data_all.amount = amount.replace('NGN', '');

        },
        OnSubmit: function () {
            $('#loading').show();
            this.$data.TranscriptLog = '';
            var ary = $("#filter_append").serializeArray();
            var obj = {};
            for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
            axios({
                method: 'put',
                url: 'http://' + window.location.host + '/api/modules/transcript/filter_transcripts',
                data: obj,
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Api-ACC-KEY': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                        'email': document.getElementById('use').value
                    },
            })
                .then(response => {
                    if (response.data.filtered_data !== ''){
                        this.$data.TranscriptLog = response.data.filtered_data;
                    } else {
                        this.$data.TranscriptLog = 'No Data';
                    }
                    var links = response.data.filtered_data;
                    for (key in links) {
                        var parse = new Date(links[key].trascript_response_time);
                        var formattedDate = dateFormat(parse, "dddd, mmmm dS, yyyy  h:MM TT");
                        links[key].trascript_response_time = formattedDate;
                    }
                    $('#loading').hide();
                }).catch(function (error) {
            });
        }
    }
});
$(function () {
    $('#update_transcript').submit(function (event) {
        event.preventDefault();
        const formEl = $(this);
        const submitButton = $('input[type=submit]', formEl);
        var ary = $("#update_transcript").serializeArray();
        var obj = {};
        for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
        axios({
            method: 'post',
            url: 'http://' + window.location.host + '/api/modules/transcript/update_text_transcript',
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
                    message: "Transcript Updated"
                });
                setTimeout(function () {
                    $('#close_text_modal').trigger('click');
                }, 1000);
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


<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="UTF-8">
    <title>Login Box Concept</title>
    <meta id="csrf-token" name="csrf-token" content="{{ csrf_token() }}"/>
    <link rel='stylesheet' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>
    <link rel="stylesheet" href="{{asset('Easy2/css/style.css')}}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link href='https://fonts.googleapis.com/css?family=Lato:300|Oswald' rel='stylesheet' type='text/css'>
    <script src="https://use.fontawesome.com/478e097f2b.js"></script>
    {{--<link rel="stylesheet" href="{{asset('Easy/css/style.css')}}">--}}
</head>

<body>
<div id="app">
    <app></app>
</div>
</body>
<!-- Larvel App -->
<script src='https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js'></script>
<script type="text/javascript" src="js/vueapp.js"></script>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script>
    $('#openMenu').on('click', function(evt) {
        $('.content')
            .removeClass('no-animation') //disable initial animation
            .toggleClass('shrink');
    });
</script>
<script  src="{{asset('Easy2/js/index.js')}}"></script>
{{--<script  src="{{asset('Easy/js/index.js')}}"></script>--}}
</html>

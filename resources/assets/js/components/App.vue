<template>
    <div class="">
        <transition name="fade"><router-view></router-view></transition>
    </div>
</template>
<script>
    export default {}
</script>
<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }

    my-5{
        margin-top: 5rem;
        margin-bottom: 5rem;
    }

    .isTranscriptCorrect{
        color: #139CBB;
    }

    .isTranscriptWrong{
        color: red;
    }
    .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td {
        vertical-align: middle;
    }

    .loading{
        display: none;
        background: rgba(19, 156, 187, 0.6);
        width: 100%;
        height: 100%;
        /*position: fixed;*/
        top: 0;
        left: 0;
        z-index: 99999;
        display: block;
    }
</style>

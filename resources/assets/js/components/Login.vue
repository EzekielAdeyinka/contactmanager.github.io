<template>
    <div>
        <div class='brand'>
            <a href='https://www.jamiecoulter.co.uk' target='_blank'>
                <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/logo.png'>
            </a>
        </div>
        <div class='login'>
            <div class='login_title'>
                <span>Login to your account</span>
            </div>
            <div class='login_fields'>
                <div class='login_fields__user'>
                    <div class='icon'>
                        <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/user_icon_copy.png'>
                    </div>
                    <input placeholder='Email' v-model="UserD.email" type='text'>
                    <div class='validation'>
                        <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/tick.png'>
                    </div>
                    </input>
                </div>
                <div class='login_fields__password'>
                    <div class='icon'>
                        <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/lock_icon_copy.png'>
                    </div>
                    <input placeholder='Password' v-model="UserD.password" type='password'>
                    <div class='validation'>
                        <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/tick.png'>
                    </div>
                </div>
                <div class='login_fields__submit'>
                    <input type='submit' @click="login()" value='Log In'>
                    <div class='forgot'>
                        <router-link  tag="a" :to="{name:'register'}" exact>
                            <a href='#'>Create an Account?</a>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class='success'>
                <h2>Authentication Success</h2>
                <p>Welcome back</p>
            </div>
            <div class='disclaimer'>
                <p>Welcome To My Contact based App Built by EasyCode</p>
            </div>
        </div>
        <div class='authent'>
            <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/puff.svg'>
            <p>Authenticating...</p>
        </div>
        <div class='love'>
            <p>Made with <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/love_copy.png" /> by <a href='https://www.jamiecoulter.co.uk' target='_blank'> Jcoulterdesign </a></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                UserD: {
                    // username: 'samalapsy@gmail.com',
                    email: '',
                    password: '',
                },
                loading: false,
                btnAction: "Login",
                isAuth: false,
                alert: {},
                errors: {},
            }
        },
        methods: {
            login() {
                localStorage.setItem("userData",this.UserD);
                this.$router.push("/contact");
            },

            loginFailed() {

            }
        },
        mounted() {
            $('input[type="submit"]').click(function(){
                $('.login').addClass('test');
                setTimeout(function(){
                    $('.login').addClass('testtwo')
                },300);
                setTimeout(function(){
                    $(".authent").show().animate({right:-320},{easing : 'easeOutQuint' ,duration: 600, queue: false });
                    $(".authent").animate({opacity: 1},{duration: 200, queue: false }).addClass('visible');
                },500);
                setTimeout(function(){
                    $(".authent").show().animate({right:90},{easing : 'easeOutQuint' ,duration: 600, queue: false });
                    $(".authent").animate({opacity: 0},{duration: 200, queue: false }).addClass('visible');
                    $('.login').removeClass('testtwo')
                },2500);
                setTimeout(function(){
                    $('.login').removeClass('test')
                    $('.login div').fadeOut(123);
                },2800);
                setTimeout(function(){
                    $('.success').fadeIn();
                },3200);
            });

            $('input[type="text"],input[type="password"]').focus(function(){
                $(this).prev().animate({'opacity':'1'},200)
            });
            $('input[type="text"],input[type="password"]').blur(function(){
                $(this).prev().animate({'opacity':'.5'},200)
            });

            $('input[type="text"],input[type="password"]').keyup(function(){
                if(!$(this).val() == ''){
                    $(this).next().animate({'opacity':'1','right' : '30'},200)
                } else {
                    $(this).next().animate({'opacity':'0','right' : '20'},200)
                }
            });

            var open = 0;
            $('.tab').click(function(){
                $(this).fadeOut(200,function(){
                    $(this).parent().animate({'left':'0'})
                });
            });
        }
    };
</script>

<style>

</style>

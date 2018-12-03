<template>
  <div id="wrapper">
    <img class="splash-logo" src=".././assets/logo2.svg">
    <p class='welcome'>Cadence CDN Saver</p>
  <div class="card">
    
    <!-- <div class="card-header"> 
      <p class='card-header-title' >Login</p>
      </div> -->
      <div class="card-content">

<div class="field">
  <label class="label">Email</label>
  <p class="control has-icons-left has-icons-right">
    <input class="input" type="text" :class="[{'is-danger': !user.email == '' && !isValid}, {'is-success': !isValid}]" placeholder="Email address" v-model="user.email">
    <span class="icon is-small is-left">
      <i class="fa fa-envelope"></i>
    </span>
    <span v-if="!user.email == '' && !isValid" class="icon is-small is-right">
      <i class="fa fa-warning"></i>
    </span>
  </p>
  <p class="help is-danger" v-if="!user.email == '' && !isValid">This email is invalid</p>
</div>

<div class="field">
  <label class="label">Password</label>
  <p class="control has-icons-left">
    <input class="input" type="password" placeholder="Password" v-model="user.password">
    <span class="icon is-small is-left">
      <i class="fa fa-lock"></i>
    </span>
  </p>
</div>

<hr>

       <a class="button is-primary" :class="{'is-success': isValid}" @click.prevent="login" v-if="isValid">Login</a>
       <a class="button is-primary" @click.prevent.native="login" v-if="!isValid" disabled>Login</a>
       <a class="button is-info" @click.prevent="signUp">Sign Up</a>
       <a class="button" @click.prevent="loginBasic">Just Use</a>
      <!--  <a class="button is-danger" @click="close">Exit</a> -->
       </div>
       </div>
      <div id="login-text">
       <p>Sign In to access your history, favourites and special features or just use the basics.</p>
       </div >
      <div class="slogun">coding on the go</div>
  </div>
</template>

<script>
  
  import Firebase from 'firebase'
  import Router from 'vue-router'
  import {mapGetters} from 'vuex'

// Email Address validation 
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  
  export default {
    name: 'landing-page',
    components: {},
    data: function (){
        return  {
       user:{
          email: '',
          password: ''
       },
       emailValid: false
      }
    },
  computed: {
    ...mapGetters ([
      'currentUser',
      'loggedIn',
      'basicUser'
    ]),
    validation: function () {
      return {
        email: emailRE.test(this.user.email)
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    }
  },
  watch: {
    loggedIn: function (data) {
        if (this.loggedIn === true || this.isBasic === true) {
            console.log("true")
            this.$router.push('/cadence') 
          }
    }
  },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      close (){
       this.$electron.shell.win.close();
      },
      login () {
        if (!this.isValid) {
               //TODO: set validEmail to false disabling the submit button
        return  alert("please enter a valid email address!")
        }
          this.emailValid = true;
          this.$store.dispatch('authenticate', {email:this.user.email, password: this.user.password})
      },
      signUp () {
       const promise = auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(user => console.log(user))
          .catch(e => console.log(e.message));
      },
      logOut () {
      //  auth.signOut();
      //  this.$router.push('/');
      this.$store.dispatch('setLoggedOut')
      },
      loginBasic() {
        this.$store.dispatch('basicUser', true)
        .then(() => this.$router.push('/cadence'))
      }
    }
  }
</script>

<style scoped>
 

 #wrapper {
  padding: 0px;
  height: 100%;
  width: 100%;
  position: absolute;
  text-align: center;
 }

 #wrapper::after {
   content: '';
   background: url('../assets/splashBack2.jpg');
   background-size: cover;
   background-repeat: no-repeat;
   /* filter: saturate(-3); */
   /* background-position-y: -150px; */
   opacity: 0.3;
   z-index: -1;
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
 }

 .welcome {
   position: absolute;
   top: 250px;
   left: 50%;
   transform: translateX(-50%);
   color: blueviolet;
   font-size: 1.5rem;
 }

 .splash-logo {
   width: 150px;
   position: absolute;
   left:50%;
   top: 11%;
   transform: translateX(-50%);
    -webkit-app-region: drag;
 }


.card {
  text-align: left;
  height: 300px;
  width: 400px;
  position: absolute;
  top:50%;
  left:50%;
  margin-top:-150px; /* this is half the height of your div*/  
  margin-left:-200px; /*this is half of width of your div*/
  box-shadow: 2px 2px 6px rgba(0,0,0, .2);
  background-color: rgba(250,250,250, .6);
 }

.card-header {
  text-align: center;
}


  body, input { 
     outline: none;
     overflow: hidden;
   }

  

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    top: 300px;
    
  }

  #login-text {
    font-size: 1.2rem;
    color: blueviolet;
    font-weight: 600;
    width: 400px;
    position: absolute;
    top: 620px;
    left: 50%;
    transform: translateX(-50%);
    opacity: .5;
    /* margin-left: -150px; */
  }

  

  .slogun {
    font-size: 7.5rem;
    color: rgba(250,250,250, .3);
    text-transform: uppercase;
    font-weight: bold;
    position: absolute;
    top: 785px;
  }

</style>

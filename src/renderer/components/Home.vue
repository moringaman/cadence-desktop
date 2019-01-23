<template>
  <div id="wrapper">
    <div class="overlay"></div>
    <div class="btn-close" @click='closeApp'><i class="fa fa-times fa-2x"></i></div>
    <img class="splash-logo" src=".././assets/logo2.svg">
    <p class='welcome'>Cadence</p>
  <div class="card">
      <div class="card-content">
        <!-- <div class="card-content-heading">
          Login
        </div> -->
        <form  v-on:submit.prevent>
<div  v-if="online" class="field">
  <!-- <hr> -->
  <label class="label"></label>
  <p class="control has-icons-left has-icons-right">
    <input class="input" 
    key="email-input" 
    type="text" 
    v-validate="'email'"
     name="email"
     placeholder="Email" v-model="user.email">
    <span class="icon is-small is-left">
      <i class="fa fa-envelope"></i>
    </span>
    <span v-if="errors.first('email')" class="icon is-small is-right">
      <i class="fa fa-warning"></i>
    </span>
  </p>
  <p class="help is-danger" v-if="errors.first('email')">This email is invalid</p>
</div>

<div v-if="!online" class="field">
  <hr>
  <label class="label"></label>
  <div class="control has-icons-left">
  <div class="select">
    <select v-validate="'email'" v-model="user.selectedEmail">
      <option selected>{{user.selectedEmail}}</option> 
      <option v-for="user in localUserInfo" :key="user.email" :value="user.email">{{user.email}}</option>
    </select>
    <span class="icon is-small is-left">
      <i class="fa fa-envelope"></i>
    </span>
  </div>
  </div>
</div>


<div v-if="online" class="field">
  <label class="label"></label>
  <p class="control has-icons-left">
    <input class="input" key="password-input"
     v-validate="'required|min:6'" type="password" 
     placeholder="Password" 
     name="password"
     v-model="user.password"
     v-on:keyup.enter="login">
    <span class="icon is-small is-left">
      <i class="fa fa-lock"></i>
    </span>
  </p>
</div>
<div v-if="online && signUpForm" class="field">
  <label class="label"></label>
  <p class="control has-icons-left">
    <input class="input" key="password-input"
     v-validate="{is: user.password}" type="password" 
     placeholder="Confirm Password" 
     name="passwordConfirm"
     v-on:keyup.enter="signUp">
    <span class="icon is-small is-left">
      <i class="fa fa-lock"></i>
    </span>
  </p>
</div>
       <a v-if="signUpForm === false || online === false" class="button is-primary" :class="{'is-success': !errors, 'is-loading': authenticating}" @click.prevent="login">Login</a>
       <!-- <a class="button is-primary" @click.prevent.native="login" v-if="errors" disabled>Login</a> -->
       <a v-if="signUpForm === true && online === true" class="button is-info" @click.prevent="signUp">Sign Up</a>
       
       <a class="button" @click.prevent="loginBasic" v-ttip="'Use simple library search'">Simple Search</a>
       <a v-if="signUpForm === true && online === true" class="form-link" href="#" @click.prevent="signUpForm = false">Login, I already registered</a>
       <a v-if="signUpForm === false" class="form-link" href="#" @click.prevent="signUpForm = true">Register new account?</a>

       <!-- <a class="button" @click.prevent="loginBasic">Just Use</a> -->
</form>
      <!--  <a class="button is-danger" @click="close">Exit</a> -->
       </div>
       </div>
      <!-- <div id="login-text">
       <p>Sign In to access your history, favourites and special features or just use the basics.</p>
       </div > -->
       <app-notify :notification='notification'/>
      <div class="slogun"> coding on the go</div>
  </div>
</template>

<script>

window.__FORM__ = {
  user: {
  selectedEmail: 'Select email address from below'
  },
  signUpForm: true
}
  
  import Firebase from 'firebase'
  import Router from 'vue-router'
  import {mapGetters} from 'vuex'
  import Notify from './helpers/Notify.vue'

  const {getCurrentWindow, globalShortcut} = require('electron').remote;

// Email Address validation 
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  export default {
    name: 'landing-page',
    components: {
      AppNotify: Notify
    },
    data: function (){
        return window.__FORM__ || {
       user:{
          email: '',
          password: '',
          selectedEmail: '',
       },
       emailValid: false,
       signUpForm: true
        }
    },
  computed: {
    ...mapGetters ([
      'currentUser',
      'loggedIn',
      'basicUser',
      'notification',
      'authenticating',
      'localUserInfo',
      'online'
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
        this.$validator.validate().then((result) => {
          if(!result) {
            this.$store.dispatch('notificationCtrl', {msg: "Please correct form errors", color: "danger"})
             return 
          } else {
              if (this.online) {
            this.$store.dispatch('authenticate', {email:this.user.email, password: this.user.password})
          } else {
              let userObj = {}
              let parsedUserData =  JSON.parse(localStorage.getItem('cadenceUsers'))
            
                  for (let i = 0; i < parsedUserData.length; i++){
                    if (parsedUserData[i].email === this.user.selectedEmail) {
                      userObj.email = this.user.selectedEmail
                      userObj.uid = parsedUserData[i].uid
                      userObj.licence = parsedUserData[i].licence
                      userObj.policy = parsedUserData[i].policy
                      userObj.expire = parsedUserData[i].expire
                      userObj.policy = parsedUserData[i].policy
                      userObj.status = parsedUserData[i].status
                    }
                  }
                  console.log( userObj) // uid and email
                  // TODO: set logged in to true and load userdata associated with email selectedEmail in userObj
                  // load favs
                  // set loggedIn to true
                  this.$store.commit('setLoggedIn', {loggedIn: true, user: userObj.uid})
                  this.$store.commit('setLicenseInfo', userObj)
                  // load localCDNs from storage
              }
          }
        })
      },
      signUp () {
       this.$validator.validate().then((result) => {
         if(!result) {
           this.$store.dispatch('notificationCtrl', {msg: "Please correct form errors", color: "danger"})
             return 
         } else {
          this.$store.dispatch('registerNewUser', {email: this.user.email, password: this.user.password})
         }
       })
      },
      logOut () {
      //  auth.signOut(); //TEST: Do we need to logout here?
      //  this.$router.push('/');
      this.$store.dispatch('setLoggedOut')
      },
      loginBasic() {
        this.$store.dispatch('basicUser', true)
        .then(() => this.$router.push('/cadence'))
      },
      closeApp(){
      // getCurrentWindow().reload()
      window.close()
      }
    },
    mounted() {
      window.addEventListener('online', () =>{
        console.log('we are online')
        this.$store.dispatch('networkStatus')
      })
      window.addEventListener('offline', () =>{
        console.log('we are offline')
        this.$store.dispatch('networkStatus')
      })
    },
    created() {
      // getCurrentWindow().reload()
      // TODO: do check for user in local storage and see if logged in to firebase
      this.$store.dispatch('loggedInStatusCheck')
      // TODO: Check for network status and update state variable
      this.$store.dispatch('networkStatus')
      this.$store.dispatch('getLocalUserInfo')
    }
  }
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
 
body {
  font-size: 62.5%;
  border: 0px;
  padding: 0px;
}
 #wrapper {
  
  padding: 0px;
  height: 100vh;
  width: 100vw;
  position: absolute;
  text-align: center;
  overflow: hidden;
  /* background-color:rgba(105, 104, 104, 0.2); */
  background-color: rgba(185, 185, 92, 0.1);
 }

 /* #wrapper > * {
    transform: scale(0.9);
 } */

 #wrapper::after {
   content: '';
   background: url('../assets/splashBack2.jpg');
   background-size: cover;
   background-repeat: no-repeat;
   filter: saturation(9);
   /* background-position-y: -30px; */
   opacity: 0.5;
   z-index: -1;
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
 }

 /* .overlay {
   z-index: 1000;
   color: yellow;
   position: absolute;
   height: 100vh;
   width: 100vw;
   top: 0;
   left: 0;
 } */

  /* .select {
    width: 300px;
  } */

 .btn-close {
   background-color: white;
   width: 50px;
   height: 50px;
   position: absolute;
   left: 10px;
   top: 10px;
   border-radius: 50%;
   opacity: .7;
   cursor: pointer;
 }

.fa-times {
  position: absolute;
  top: 9px;
  left: 12px;
  opacity: .5;
  z-index: 100;
  font-size: 2rem ;
}

.fa-times:hover {
  color: blueviolet;
  opacity: 1;
}

 .welcome {
   position: absolute;
   top: 14rem;
   left: 50%;
   transform: translateX(-50%);
   color: blueviolet;
   font-size: 2.5rem;
   font-weight: 200;
 }

 .splash-logo {
   width: 150px;
   position: absolute;
   left:50%;
   top: 7rem;
   transform: translateX(-50%);
    -webkit-app-region: drag;
 }

.label {
  color: white;
}
.card {
  text-align: center;
  /* height: 23rem; */
  width: 400px;
  position: absolute;
  top:54%;
  left:50%;
  margin-top:-150px; /* this is half the height of your div*/  
  margin-left:-200px; /*this is half of width of your div*/
  box-shadow: 2px 2px 6px rgba(0,0,0, .2);
  /* background-color: rgba(250,250,250, .1); */
  border-radius: 5px;
  background-color: rgba(255,255,255, .8);
 }

.card-header {
  text-align: center;
}

.button {
  position: relative;
}


  body, input { 
     outline: none;
     overflow: hidden;
   }

/* input { margin-top: 20px;} */
  

  .title {
    color: #2c3e50;
    font-size: .2rem;
    font-weight: bold;
    top: 300px;
    
  }

  #login-text {
    font-size: 1.4rem;
    color: white;
    font-weight: 600;
    width: 400px;
    position: absolute;
    top: 39rem;
    left: 50%;
    transform: translateX(-50%);
    /* opacity: .9; */
    /* margin-left: -150px; */
  }

  .button {margin-top: 20px}

  .form-link {
    color:rgba(102, 102, 102, 0.849);
    display: inline-block;
    font-weight: 600;
    margin-top: 25px;
    margin-left: 20px;
  }

  .form-link:hover {
    color: blueviolet;
  }

  .slogun {
    font-size: 7.5rem;
    word-spacing: 1rem;
    font-weight: bolder;
    color: rgba(250,250,250, .3);
    text-transform: uppercase;
    font-weight: bold;
    position: absolute;
    width: 100%;
    top: 44rem;
    left: 45%;
    transform: translateX(-50%);
  }

</style>

<template>
  <div id="wrapper">
    <img class="splash-logo" src=".././assets/logo2.svg">
  <div class="card">
    
    <div class="card-header">
      <p class="card-header-title">Welcome to Cadence</p>
      </div>
      <div class="card-content">

<div class="field">
  <label class="label">Email</label>
  <p class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="Email address" v-model="user.email">
    <span class="icon is-small is-left">
      <i class="fa fa-envelope"></i>
    </span>
   <!-- <span class="icon is-small is-right">
      <i class="fa fa-warning"></i>
    </span> -->
  </p>
  <!--<p class="help is-danger">This email is invalid</p>-->
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

       <a class="button is-primary" @click="login">Login</a>
       <a class="button is-info" @click="signUp">Sign Up</a>
       <router-link class="button"  to="/cadence">Just Use</router-link>
      <!--  <a class="button is-danger" @click="close">Exit</a> -->
       </div>
       </div>
<div id="login-text">
       <p>Sign In to get your History, favourites and Special features or just use the basics.</p>
       </div >
      
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import Firebase from 'firebase';
  import Router from 'vue-router';

// Email Address validation 
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Setup Firebase
var config = {
    apiKey: "AIzaSyBhAK7lteBJ1_0ynbyC3C0KnZq7EHzbQpU",
    authDomain: "cadence-8edfc.firebaseapp.com",
    databaseURL: "https://cadence-8edfc.firebaseio.com",
    storageBucket: "cadence-8edfc.appspot.com"
}

Firebase.initializeApp(config);
const auth = Firebase.auth();
var usersRef = Firebase.database().ref('users')
  
  export default {
    name: 'landing-page',
    components: { 
      SystemInformation
       },
    data: function (){
        return  {
       user:{
          email: '',
          password: ''
       },
       loggedInUser: [],
       isLoggedIn: false,
       userExists: false,
       emailValid: false
      }
    },
     firebase: {
    users: usersRef
  },
  // computed property for form validation state
  computed: {
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
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      close (){
       this.$electron.shell.win.close();
      },
      login () {
        if (this.isValid) {
          this.emailValid = true;
           const promise = auth.signInWithEmailAndPassword(this.user.email, this.user.password)
        //var router = new Router()
        .then(user =>  this.loggedInUser,
        this.$emit('userLoggedIn', this.loggedInUser),
                this.$router.push('/cadence') )
          .catch( e => console.log(e.message)); 
        } else {
        return  alert("please enter a valid email address!")
        }
       
      },
      signUp () {
       const promise = auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(user => console.log(user))
          .catch(e => console.log(e.message));
      },
      logOut () {
       auth.signOut();
       this.$router.push('/');
      }
    }
  }
</script>

<style scoped>
 

 #wrapper {
  padding: 70px;
  height: 800px;
  width: 800px;
  position: absolute;
  top:50%;
  left:50%;
  margin-top:-400px; /* this is half the height of your div*/  
  margin-left:-400px; /*this is half of width of your div*/
  opacity: 0.8;
  text-align: center;
  
 }

 .splash-logo {
   width: 200px;
   position: absolute;
   left:50%;
   top: 7%;
   margin-left: -100px;
    -webkit-app-region: drag;
 }


.card {
  height: 350px;
  width: 400px;
  position: absolute;
  top:50%;
  left:50%;
  margin-top:-150px; /* this is half the height of your div*/  
  margin-left:-200px; /*this is half of width of your div*/
  

   box-shadow: 2px 2px 6px rgba(0,0,0, .4);
 }

  body, input { 
     outline: none;
   }

  

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
 
    
  }

  #login-text {
    width: 300px;
    position:absolute;
    top: 650px;
    left: 50%;
    margin-left: -150px;
  }

  button {
    padding: 5px 10px;
  }

</style>

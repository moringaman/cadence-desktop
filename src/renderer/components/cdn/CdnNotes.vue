<template>
    <div>
        <div class="columns">
               <div class="column is-2 side-bar">
        <app-menu></app-menu>
      </div>
      <div class="column">
      <editor  class="editor" v-model="content" @init="editorInit" lang="javascript" :options="myoptions" theme="twilight" width="850" height="750"></editor>
      </div>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
import Menu from './Menu.vue';
import Footer from './Footer.vue';
export default {
    props: [],
    components: 
        {
      appMenu: Menu,
      appFooter: Footer,
      editor: require('vue2-ace-editor')
      } ,
    data () {
        return {
            content: 'Hello how are you',
            myoptions: { showPrintMargin: false }
        }
    },
    computed: {},
    watch: {},
    methods:{
              editorInit: function (editor) {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')                
            require('brace/mode/javascript')    //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            require('brace/snippets/javascript')
              }
    },
    created(){
       
    },
    mounted () {
       
    }
}
</script>

<style>

@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

  body {
        overflow-x: hidden;
    }


.logo {
    padding: 30px 50px 10px;
   /* background-color: rgba(0,0,0, 0.2);*/
    background-color: rgba(255,242,0, .7);
    color: #fff;
    margin-left: -15px;
    margin-right: -25px;
    font-family: 'Roboto Mono', monospace;
    font-size: 28px;
    margin-bottom: 50px;
    -webkit-app-region: drag;
    
}

.logo img {
    width: 50%;
}

.active {
    color: blueviolet;
    opacity: .9;
}

.editor {
    margin: 50px 50px;
    font-size: 1.6rem;
}

li i {
    outline: none;
    margin: 30px auto;
    width: 50px;
    color: grey; 
    opacity: 0.5;
    vertical-align: middle;
}

li > span {
    text-transform: uppercase;
    transform:translateY(40px);
    position: absolute;
    color: #fff;
    font-weight: 600;
}

li i:hover {
    color: blueviolet;
}

.fa {
    font-size: 50px;
    text-align: center;
    vertical-align: top;
}

</style>



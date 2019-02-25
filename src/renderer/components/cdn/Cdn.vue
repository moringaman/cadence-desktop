<template>
    <div class="list-view">
    <transition name="fade" appear> 
        <div class="card">
            <div class="card-header" >
                <p class="card-content header">
                    {{Data.name}}<span> ({{Data.version}} {{Data.cdnVersion}}) </span>
                </p>
                     <a v-if='showFavs || showLocalStorage' class="card-header-icon tooltip" v-ttip.bottom="'Delete'">
                    <span class="icon" @click="deleteFav()">
            <i class="fa fa-trash"></i>
          </span>
                </a> 
                <a v-if='showFavs===false && searchData.length < 1' class="card-header-icon tooltip" v-ttip.bottom="'Add to favorites'">
                    <span class="icon" @click="favouriteCDN()">
            <i class="fa fa-heart"></i>
          </span>
          </a>
                <a class="card-header-icon tooltip" v-ttip.bottom="'Copy to clipboard'">
                    <span class="icon" @click="copyCDN()">
            <i class="fa fa-clipboard"></i>
          </span>
                </a>
                <a v-if='showFavs===true' class="card-header-icon">
                    <!-- <span class="icon" @click="(showNote =!showNote) && (editing=Data.name)"> -->
                    <span class="icon" @click="shareFav">     
            <i class="fa fa-envelope"></i>
          </span>
                </a>
                <a v-if='searchData.length > 0 || showHistory == true ' class="card-header-icon tooltip" v-ttip.bottom='"Download Library"'>
                    <span class="icon" @click='downloadCDN()'>
            <i  class="fa fa-download"></i>
          </span>
                </a>
            </div>
            <div class="card-content">
                <div v-if="showProgress === true && currentFile === fileNameData" class='content'>
                    <progress class="progress is-primary" :value='progress * 100' max="100"></progress>
                </div>
                <div v-else class="content tooltip" v-ttip.multiline="Data.description">
                  <span class="content" v-if='showFavs'>{{Data.cdn}}</span>{{Data.latest}}
                  <span v-if='searchData.length < 1 && showLocalStorage && Data.version !== "Notes" '>http://localhost:9082/{{userCode}}/</span>{{Data.file}}
                </div>
                <footer v-if='showFavs' class="card-footer">
                     <span id="reveal-notes-icon" class="icon content" @click="(showNote =!showNote) && (editing=Data.name)">
             <div v-if="!showNote && Data.Notes">
                 <span>read notes</span>
                 <i class="fa fa-chevron-down"></i>
             </div>
             <div v-if="showNote === false && !Data.Notes" @click="editCDN(Data.name)">
                 <span>add notes</span>
                 <i class="fa fa-chevron-down"></i>
             </div>
            <div v-if="showNote && !edit">
                 <span>close notes</span>
                 <i class="fa fa-chevron-up"></i>
             </div>
          </span>
            <textarea v-if='edit && editing === Data.name' v-model="contentNote"
             class="textarea is-medium" style="height: 400px"
             id="text-area"
              :placeholder="placeholder" rows="40">
              </textarea>
                <div id="textarea-buttons" v-if='edit && editing === Data.name'>
                    <button id="save-note-btn" class="button" 
                    @click="cancel">Cancel</button>
                    <button id="save-note-btn" class="button is-primary" 
                    @click="updateFav">
                    <span class="icon is-small">
                     <i class="fa fa-check"></i>
                     </span>
                     <span>
                         Save
                     </span>
                    </button>
                </div>
                    
               <div class="content" id="markdown" v-show='(showNote && editing === Data.name)&&(!edit)'>
                   <a v-if="Data.Notes" class="button edit-btn"  @click="editCDN(Data.name)">
                       <span class="icon ">
                       <i class="fa fa-edit is-small"></i>
                       </span>
                       <span>
                           Edit
                       </span>
                   </a>  
             <vue-markdown id="markdown-text" class="content" :source="Data.Notes">
            </vue-markdown>
                   <div id="publicNote" class="field">
                    <input 
                        id="switchExample" 
                        type="checkbox" 
                        name="switchExample" 
                        class="switch" 
                        checked="checked" 
                        :key="this.key"
                        v-model="this.publicNote" 
                        @click="notePrivacy"
                        >
                    <label v-if="Data.publicNote" for="switchExample">Make private?</label>
                    <label v-if="!Data.publicNote" for="switchExample">Make public?</label>
                </div>
                   </div>     
                </footer>
            </div> 
        </div>
    </transition>
    </div>
</template>

<script>
    import marked from 'marked';
    import wget from 'wget-improved';
    import VueMarkdown from 'vue-markdown'
    import { dialog, remote } from 'electron'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    
    export default {
        props: ['Data'],
        components: {
          VueMarkdown
        },
        data() {
            return {
                fileNameData: '/this/file/is/nonexistent',
                userCode: '',
                contentNote: this.Data.Notes,
                edit: false,
                showNote: false,
                publicNote: undefined,
                edited: true,
                key: 0,
                editing: '',
                showNote: false,
                placeholder: `You can put your notes for using ${this.Data.name} here using Markdown
Supports: 
* syntax highlighting
* Code Snippets
-[x] to create a task
# h1
## h2
### h3
\`\`\`js
// Code goes here 
\`\`\` 
etc.`
            }
        },
        methods: {
            editCDN(file){
                let validLicense = this.$store.dispatch('accessRights', {check: 'license'})
                if (validLicense === false) {
                    return
                }
                this.key++
               this.edit===true?this.edit=false:this.edit=true
               console.log('editing file', this.edit)
                this.editing = file
                let editor = this.editor
                
            },
            async showModal(message) {
                    this.$store.commit('resetModal')
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('showModal', {message})
                    return this.$watch('modalResponse', (result) => {
                    console.log("Result: ", result)
                        if (result === 0) {
                            resolve(false)
                        } else if (result === 1) {
                            resolve(true)
                        }
                    })
                })
            },
            cancel(){
                this.showNote = false
                this.edit = false
            },
            notePrivacy() {
                let validLicense = this.$store.dispatch('accessRights', {check: 'license'})
                if (!validLicense) {
                    return
                }
                this.publicNote? this.publicNote = false: this.publicNote = true
                console.log('PUBLICNOTE?', this.publicNote)
                this.updateFav()
                this.key++
            },
            copyCDN(index) {
                if (this.Data.latest) {
                    var cdn = this.Data.latest;
                } else if (this.Data.file){
                    var cdn = `http://localhost:9082/${this.userCode}/${this.Data.file}`
                } else {
                    var cdn = this.Data.cdn
                }
                let clipboard = this.$clipboard,
                    notify = this.$notify
                this.$store.dispatch('copyCDN', {
                    cdn,
                    clipboard,
                    notify
                })
            },
            downloadCDN() {
                // let validLicense = this.$store.dispatch('accessRights', {check: 'license'})
                // if (validLicense === false) {
                //     return
                // }
                if (this.online === false) {
                    this.$store.dispatch('notificationCtrl',
                     {msg: 'NETWORK ERROR: No downloads cannot be performed at this time',
                     color: 'danger'})
                     return
                }
                this.fileNameData = this.Data.latest.split("/").splice(-1)[0]
                console.log("wget: ", wget)
                let cdnName = this.Data.name,
                    version = this.Data.version,
                    cdn = this.Data.latest,
                    currentUser = this.currentUser,
                    description = this.Data.description
                this.$store.dispatch('downloadCDN', {
                        wget,
                        cdn,
                        cdnName,
                        version,
                        currentUser,
                        description
                    })
            },
            favouriteCDN() {
                this.showModal('You are advised to download libraries before adding them to your favorites so that they are available offline also')
                .then(yesNo => {
               if (yesNo) {
                let validLicense = this.$store.dispatch('accessRights', {check: 'license'})
                .then(result => {
                if (result === false) {
                    return
                }
                let name = this.Data.name,
                    version = this.Data.version,
                    cdn = this.Data.latest,
                    userId = this.currentUser,
                    online = this.online,
                    description = this.Data.description
                  this.userCode = userId.split("").splice(0,9).join("")
                let loggedIn = this.loggedIn
                if (!loggedIn) {
                    this.$store.dispatch('accessRights', {check: 'logged in', action: 'add favourites'})
                } else {
                      if (this.searchData.length < 1) {
                    cdn = `http://localhost:9082/${this.userCode}/${this.Data.file}`
                    version = this.Data.cdnVersion
                }
                let userCode = this.userCode
                console.log('LATEST: ', this.Data.latest)
                this.$store.dispatch('addFav', {
                        name,
                        version,
                        cdn,
                        userId,
                        loggedIn,
                        userCode,
                        online,
                        description,
                        url: this.Data.cdn,
                        publicNote: false
                    })
                }
                })
            }
                })
            },
            updateFav(){
                let validLicense = this.$store.dispatch('accessRights', {check: 'license'})
                .then(result => {
                console.log('VALID LICENSE ', result)
                if (result == false) {
                    return
                }
                if(this.online === true){
                    console.log('updating')
                    this.$store.dispatch('updateFavs', {Data:this.Data, Note: this.compiledMarkdown, uid:this.currentUser, publicNote: this.publicNote})
                    this.edit = false
                } else {
                    this.$store.dispatch('notificationCtrl', {msg: 'You need to be online to update Library notes', color: 'warning'})
                }
                })
            },
            deleteFav() {
        
                //  let result = window.confirm("Are you sure you want to remove this")
                // if (result === false) {
                //     return
                // }
                if (this.online === true) {
                         console.log('DELETING: ', this.Data.file)
                if (!this.Data.file) {
                   this.showModal('If you remove this library from your favourites, you will also lose any notes you have collated for it. Do you really want this?')
                    .then(result => {
                        console.log(result)
                   if (result === true) {
                    let name = this.Data.name
                    let userId = this.currentUser
                    console.log('DELETING: ', name)
                // this.$store.commit('deleteFav', name)
                      this.$store.dispatch('delFav', {name: name, userId: userId})
                    .then(() => {
                        this.$store.dispatch('delFirebaseFav', {name: name, userId: userId})
                    })
                    .then(()=> {
                        this.$store.dispatch('notificationCtrl', {msg: `${name} Library removed from your favourites`, color: 'success'})   
                    })
                    } 
                    })
                    
                } else {
                    // call delete locally stored CDN function
                    //TODO: refuse deletion if Library is a favourite
                
                        for(let i=0; i < this.favs.length; i++){
                            if(this.favs[i].name.split('.')[0] === this.Data.file.split('.')[0]) {
                                this.$store.dispatch('notificationCtrl', 
                                {msg: `${this.Data.file.split('.')[0]} is in your favourites, please delete it from your favourites list first`,
                                 color: 'warning'})
                                 console.log("Is a favourite")
                                 return
                            }
                        }
                    let file = this.Data.file
                    let online = this.online
                    console.log('delete ok')

                    this.showModal("If you delete this Library it will no longer be available on your local server")
                    .then(yesNo => {
                    if (yesNo){
                    this.$store.dispatch('deleteCDN', {name: this.Data.name, file:file, userId: this.currentUser})
                    }
                    })
                }
            } else {
                this.$store.dispatch('notificationCtrl',
                {msg: 'You are currently offline deletions cannot be done when offline',
                 color: 'danger'})
            }  
       
            },
            shareFav() {
               // Show modal for user to enter email address of recipient
                // this.$store.dispatch('shareFav', { data: this.Data, recipient: toAddress })
                // this.showModal(`<input type="text" class="input" placeholder="reciepient email" ref="emailto">`)
                this.showModal()
                .then(yesNo => {
                    if (yesNo) {
                        this.$store.dispatch('shareFav', this.Data)
                    }
                })
                console.log('Sharing: ', this.Data)
            },
            ...mapMutations([
                'clearNotification'
            ])
        },
        computed: {
            ...mapGetters([
                'searchData',
                'progress',
                'currentFile',
                'showLocalStorage',
                'currentUser',
                'showFavs',
                'loggedIn',
                'online',
                'favs',
                'showHistory',
                'showProgress',
                'modalResponse'
            ]),
             compiledMarkdown: function () {
                 console.log('compiled')
               return  this.contentNote
            },
            syntaxedNote(){
                return Prism.highlight(this.Data.Notes, Prism.languages.javascript, 'javascript');
            },
            showProgress() {
                if (this.progress > 0 && this.progress < 1) {
                    return true
                } else {
                    return false
                }
            }
        },
        mounted(){
            Prism.highlightAll()
        },
        updated(){
            Prism.highlightAll()
        },
        created() {
    
             if (Object.keys(this.currentUser) != 0) {
            if (this.searchData.length > 1 || this.showHistory == true) {
                this.fileNameData = this.Data.latest.split('/').splice('-1')[0]
            }
            
            this.userCode = this.currentUser.split("").splice(0,9).join("")
            }
            this.publicNote = this.Data.publicNote //|| false
        }
    }
</script>

<style>
    @import '~bulma-switch';
    @import "~bulma/css/bulma.css";
    @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
     @import '~prismjs/themes/prism.css'; 
    body {
        overflow-x: hidden;
    }
    
    div {
        font-family: 'Roboto Mono', monospace;
        font-size: 18px;
    }

    .text-area { 
        height: 600px !important;
        margin-bottom: 50px;
    }
     
    .switch {
        z-index: 5000;
        width: 3rem;
        height: 3rem;
    }

    /* .field {
        width: 19rem;
        margin-left: 24rem;
    } */

    #publicNote{
        transform: translate(-14.6rem, 0.2rem);
    }

    #text-area{
       margin-bottom: 50px; 
       transform: translateX(-24px);
    }

    .parsed {
        text-align: left;
    }

    .edit-btn {
        position: absolute;
        right: 0;
        top: 8px;
        z-index: 2000;
    }

    #reveal-notes-icon {
        position: absolute;
        display: inline-block; 
        top: 112px;
        margin-left: 58.5%;
        color: rgba(102, 102, 102, 0.747);
        background-color: white;
        padding: 3px;
        text-align: right;
        width: 250px;
    }

    #reveal-notes-icon > div> i {
        color: rgba(137, 43, 226, 0.452);
    }
    #markdown {
        width: 100%;
        background: transparent;
        
        transform: translateX(-30px);
    }

    #markdown-text {
        margin-top: 50px;
        text-align: left;
    }

    #textarea-buttons {
        margin-top: 10px;
        display: flex;
        /* display: inline; */
        /* margin-left: 640px; */
        transform: translate(-200px, 410px);
        width: 500px;
        height: 50px;
    }

    pre[class*="language-"]{
    /* background: #ffffff; */
    border: 1px solid #ccc;
}

    pre {
        background-color: #fff;
    }

    #textarea-buttons > button {
        margin-left: 10px;
    }

    .number {
        padding: 0px;
        margin: 0px;
        font-size: .85rem;
        word-spacing: .5rem;
        background-color: transparent;
        border: none;
    }
    
    .card {
        margin: 20px 5%;
        cursor: pointer;
        background-color: #ffffff;
        width: 800px;
        overflow: visible !important;
    }
    
    .card-content {
        opacity: 1;
        overflow: visible !important;
        text-align: left;
    }

    .card-footer  {
        
        padding-top: 20px;
        padding-left: 50px;
    }
    
    .content {
        
        overflow-wrap: break-word;
        overflow: visible !important;
    }
    
    .card-content.header {
        text-align: center;
        padding: 10px;
        padding-left: 90px;
        width: 95%;
        font-size: 24px;
        font-weight: bold;
        opacity: 1;
        color: grey;
         overflow: visible;
    }
    
    .card-content.header span {
        font-weight: normal;
        font-size: 18px;
        overflow: visible;
    }
    
    .card-content.header:hover {
        background-color: blueviolet;
        color: #ffffff;
        opacity: 0.6;
    }
    
    .card-header-icon {
        align-self: right;
        color: blueviolet;
        opacity: 0.6;
    }
    
    .card-header-icon:hover {
        color: #fff;
        background-color: blueviolet;
        opacity: 0.6;
    }

    .tooltip  {
        z-index: 9000 !important;
        font-size: 1rem;
    }
    
    .card:hover {
        /* background-color: rgba(0,0,0, 0.2);*/
        color: #ffffff;
    }
    
    h3 {
        font-weight: bold;
    }
    
    .list-view {
        overflow-x: hidden;
    }


    .fade-enter-active, .fade-leave-active {
        transition: opacity .7s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>
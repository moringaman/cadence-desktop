<template>
    <div class="list-view">
    <transition name="fade" appear> 
        <div class="card">
            <div class="card-header" >
                <p class="card-content header">
                    {{Data.name}}<span> ({{Data.version}} {{Data.cdnVersion}}) </span>
                </p>
                     <a v-if='showFavs || showLocalStorage' class="card-header-icon">
                    <span class="icon" @click="deleteFav()">
            <i class="fa fa-trash"></i>
          </span>
                </a> 
                <a v-if='showFavs===false' class="card-header-icon">
                    <span class="icon" @click="favouriteCDN()">
            <i class="fa fa-heart"></i>
          </span>
                </a>
                <a class="card-header-icon tooltip" data-tooltip="copy to clipboard">
                    <span class="icon" @click="copyCDN()">
            <i class="fa fa-clipboard"></i>
          </span>
                </a>
                <a v-if='searchData.length > 1' class="card-header-icon tooltip is-tooltip-bottom" data-tooltip="download?">
                    <span class="icon" @click='downloadCDN()'>
            <i  class="fa fa-download"></i>
          </span>
                </a>
            </div>
            <div class="card-content">
                <div v-if="showProgress === true && currentFile === fileNameData" class='content'>
                    <progress class="progress is-primary" :value='progress * 100' max="100"></progress>
                </div>
                <div v-else class="content tooltip is-tooltip-primary is-tooltip-multiline" :data-tooltip='Data.description'>
                  <span v-if='showFavs'>{{Data.cdn}}</span>{{Data.latest}}
                  <span v-if='searchData.length < 1 && showLocalStorage'>http://localhost:9990/</span>{{Data.file}}
                </div>
            </div>
        </div>
    </transition>
    </div>
</template>

<script>
    import wget from 'wget-improved';
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    
    export default {
        props: ['Data'],
        data() {
            return {
                fileNameData: '/this/file/is/nonexistent'
            }
        },
        methods: {
            copyCDN(index) {
                if (this.Data.latest) {
                    var cdn = this.Data.latest;
                } else if (this.Data.file){
                    var cdn = `http://localhost:9990/${this.Data.file}`
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
                setTimeout(() => {
                    this.$store.commit('clearNotification')
                }, 3000)
            },
            downloadCDN() {
                if (!this.online) {
                    this.$store.dispatch('accessRights', {check: 'online', action: 'downloading library'})
                }
                console.log("wget: ", wget)
                let cdnName = this.Data.name,
                    version = this.Data.version,
                    cdn = this.Data.latest,
                    notify = this.$notify
                this.$store.dispatch('downloadCDN', {
                        wget,
                        cdn,
                        cdnName,
                        version,
                        notify
                    })
                    .then(() => {
                        setTimeout(() => {
                            this.$store.commit('clearNotification')
                        }, 5000)
                    })
    
            },
            favouriteCDN() {
                let name = this.Data.name,
                    version = this.Data.version,
                    cdn = this.Data.latest,
                    userId = this.currentUser
                let loggedIn = this.loggedIn
                if (!loggedIn) {
                    this.$store.dispatch('accessRights', {check: 'logged in', action: 'add favourites'})
                } else {
                      if (this.searchData.length < 1) {
                    cdn = `http://localhost:9990/${this.Data.file}`
                    version = this.Data.cdnVersion
                }
                this.$store.dispatch('addFav', {
                        name,
                        version,
                        cdn,
                        userId,
                        loggedIn
                    })
                    .then(() => {
                        setTimeout(() => {
                            this.$store.commit('clearNotification')
                        }, 5000)
                    })
                }
              
            },
            deleteFav() {
                if (!this.Data.file) {
                    let name = this.Data.name
                    console.log(name)
                this.$store.commit('deleteFav', name)
                this.$store.commit('setNotification', {msg: `${name} Library removed from your favourites`, color: 'success'})   
                setTimeout(() => {
                            this.$store.commit('clearNotification')
                        }, 5000)
                } else {
                    // call delete locally stored CDN function
                    let file = this.Data.file
                    this.$store.dispatch('deleteCDN', file)
                    .then(() => {
                        setTimeout(() => {
                            this.$store.commit('clearNotification')
                        }, 5000)
                    })
                }
                
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
                'online'
            ]),
            showProgress() {
                if (this.progress > 0 && this.progress < 1) {
                    return true
                } else {
                    return false
                }
            }
        },
        created() {
            if (this.searchData.length > 1) {
                this.fileNameData = this.Data.latest.split('/').splice('-1')[0]
                console.log(this.fileNameData)
            }
        }
    }
</script>

<style>
    @import "~bulma/css/bulma.css";
    @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    body {
        overflow-x: hidden;
    }
    
    div {
        font-family: 'Roboto Mono', monospace;
        font-size: 18px;
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
        overflow: visible !important
    }
    
    .content {
        overflow-wrap: break-word;
        overflow: visible !important
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

    .tooltip {
        z-index: 1000;
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
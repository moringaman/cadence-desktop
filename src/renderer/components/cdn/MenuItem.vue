<template>
<div>
     <li class="nav-item">
         <i :class='faIcon' @click='clickEvent(eventName)'>
        </i>
         <span>{{ itemName }}
        </span>
    </li>
</div>
        
    </template>

<script>

export default {
    props: ['fa-icon', 'item-name', 'event-name'],
    data() {
        return {

        }
    },
    methods: {
        clickEvent: function(val) {
            console.log('hello ',  val)
            this.$emit(val)
        }
    },
    created() {
        console.log('props: ', this.faIcon)
    }
}
</script>

<style scoped>

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



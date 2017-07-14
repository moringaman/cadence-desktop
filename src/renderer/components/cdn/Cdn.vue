<template>
    <div class="list-view">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {

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
    width:800px;
      
}

.card-content {
    opacity: 0.5;  
}

.content {
    overflow-wrap:break-word;
}

.card-content.header {
    text-align: center;
    padding: 10px;
    width: 95%;
    font-size: 24px;
    font-weight: bold;
    opacity: 0.7;
    color:black;
}

.card-content.header span {
    font-weight:normal;
    font-size: 18px;
}

.card-content.header:hover {
    background-color: blueviolet;
    color:#ffffff;
    opacity: 0.6;
}

.card-header-icon {
    align-self: right;
}

.card:hover{
    
   /* background-color: rgba(0,0,0, 0.2);*/
    color: #ffffff;
}

h3 {
    font-weight: bold;
}



.list-view {
    overflow-x: hidden;
}

</style>
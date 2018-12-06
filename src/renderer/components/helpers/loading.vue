<template>
 <div>
     <div class="loading-container">
         <div class="loading-bar" ></div>
     </div>
     </div>   
</template>

<script>
export default {
    
}
</script>


<style>

.loading-container {
    width: 400px;
    height: 30px;
    position: absolute;
    left:58%;
    top: 40%;
    transform: translateX(-50%);
    z-index: 1000;
}

.loading-bar {
    height:100%;
    background-color: blueviolet;
    animation: swipe 2s infinite;
    opacity: .5;
    z-index: 1000;
}

@keyframes swipe {
    0% {
        width: 0%;
    }
    100% {
        width: 100%
    }
   
}

</style>



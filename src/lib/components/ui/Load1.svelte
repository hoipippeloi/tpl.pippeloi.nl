<div class="loading-animation uk-container">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>

<style>
  .loading-animation { /*ok*/
    margin-top:5%;
    margin-left:5%;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  
  .loading-animation div {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin: 0 5px;
    border-radius: 50%;
    background-color: #BDCCC6; /* Customize the color here */
    animation: loading 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  
  .loading-animation div:nth-of-type(2) {
    animation-delay: 0.1s;
  }
  
  .loading-animation div:nth-of-type(3) {
    animation-delay: 0.2s;
  }
  
  .loading-animation div:nth-of-type(4) {
    animation-delay: 0.3s;
  }
  .loading-animation div:nth-of-type(5) {
    animation-delay: 0.4s;
  }

  @keyframes loading {
    0% {
      transform: scale(0);
      opacity: 0.7;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0);
      opacity: 0.7;
    }
  }
</style>
<script>
    export let selectedEvent;
    export let close;
  
    function handleClose() {
      close();
    }
  </script>
  
  <div class="modal">
    <div class="modal-content">
      <h2>{selectedEvent.title}</h2>
      <p>Start: {selectedEvent.start}</p>
      <p>End: {selectedEvent.end}</p>
      <!-- Include other event fields as needed -->
      <button on:click={handleClose}>Close</button>
    </div>
  </div>
  
  <style>
    /* Add your modal styling here */
  </style>
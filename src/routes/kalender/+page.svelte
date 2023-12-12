<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import DayGrid from '@event-calendar/day-grid';
    import List from '@event-calendar/list';
    import Interaction from '@event-calendar/Interaction';
    import ResourceTimeGrid from '@event-calendar/resource-time-grid';
  
    let plugins = [TimeGrid, DayGrid, List, ResourceTimeGrid, Interaction];
    let selectedEvent = null;
    let selectedUser = null;
  
    async function openModal(event) {
      selectedEvent = event;
      selectedUser = await fetchUser(event.resourceIds);
      UIkit.modal(document.getElementById('modal-event')).show();
    }
  
    async function fetchUser(resourceId) {
    if (!resourceId) {
        console.error('Resource ID is undefined. Cannot fetch user.');
        return null;
    }
    const response = await fetch(`https://vdm.pockethost.io/api/collections/users/records/${resourceId}`, {
        headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 
        },
    });
    const data = await response.json();
    return data;
    }
  
    let options = {
     view: 'timeGridWeek',
     eventSources: [
      {
        events: function(fetchInfo, successCallback, failureCallback) {
          fetch('https://vdm.pockethost.io/api/collections/events/records', {
            headers: {
              'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            }
          })
          .then(response => response.json())
          .then(data => {
            const events = data.items.map(item => ({
              id: item.id,
              title: item.title,
              start: item.start,
              end: item.end,
              resourceId: item.resource_id,
              allDay: item.allDay,
              // Include other fields as needed
            }));
            successCallback(events);
          })
          .catch(failureCallback);
        }
      }
     ],
     headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,resourceTimeGridDay,resourceTimeGridWeek'
     },
     eventClick: function(info) {
      openModal(info.event);
      console.log('info.event: ', info.event);
     },
     dateClick: function(info) {
      console.log('Date cell clicked:', info.dateStr);
     }
    };
  </script>
  
  <Calendar {plugins} {options} />
  
  <div id="modal-event" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <h2 class="uk-modal-title">{selectedEvent?.title || ''}</h2>
      <p>Start: {selectedEvent?.start || ''}</p>
      <p>End: {selectedEvent?.end || ''}</p>
      <p>User: {selectedUser?.name || ''}</p>
      <p class="uk-text-right">
        <button class="uk-button uk-button-default uk-modal-close" type="button">Sluiten</button>
      </p>
    </div>
  </div>
  
  <style>
    /* Add your styling here */
    /* Don't forget to include UIkit's CSS and JS separately */
  </style>
  
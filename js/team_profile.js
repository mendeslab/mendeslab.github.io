// const targetEl = document.querySelector(".moreprofile");

// const loadProfile = number => {
//     fetch(`./team/profile-${number}.html`)
//         .then(res => {
//             if (res.ok) {
//                 return res.text();
//             }
//         })
//         .then(htmlSnippet => {
//             targetEl.innerHTML = htmlSnippet;
//         });
// };

// for clicking photos of team members
$(document).ready(function() {
  // 1. Initialize the default bio block
  const firstBio = $('.team-member').first().data('bio');
  $('#team-bio-box').html(firstBio);
  
  // Track movement values for both mice and touch inputs
  let startX = 0;
  let startY = 0;
  const movementThreshold = 6; // Anything under 6px of motion is a pure click/tap

  // Helper function to get coordinates regardless of device type
  function getCoordinates(event) {
    if (event.originalEvent.touches && event.originalEvent.touches.length) {
      return { x: event.originalEvent.touches[0].pageX, y: event.originalEvent.touches[0].pageY };
    } else if (event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
      return { x: event.originalEvent.changedTouches[0].pageX, y: event.originalEvent.changedTouches[0].pageY };
    }
    return { x: event.pageX, y: event.pageY };
  }

  // 2. Start tracking input (Desktop Mouse Down OR Mobile Touch Start)
  $('.team-member').on('mousedown touchstart', function(e) {
    const coords = getCoordinates(e);
    startX = coords.x;
    startY = coords.y;
  });

  // 3. Process end of input (Desktop Mouse Up OR Mobile Touch End)
  $('.team-member').on('mouseup touchend', function(e) {
    const coords = getCoordinates(e);
    const diffX = Math.abs(coords.x - startX);
    const diffY = Math.abs(coords.y - startY);

    // If the movement is less than our threshold, it's a deliberate click/tap!
    if (diffX < movementThreshold && diffY < movementThreshold) {
      const selectedBio = $(this).data('bio');
      
      // Swap the bio block text smoothly
      $('#team-bio-box').fadeOut(150, function() {
        $(this).html(selectedBio).fadeIn(150);
      });
      
      // Toggle visual active states
      $('.team-member').removeClass('active-member');
      $(this).addClass('active-member');
    } 
    // If it's a drag/swipe, we explicitly DO NOTHING here. 
    // This hands full priority control back to your 'hor_scroll.js' script.
  });
});

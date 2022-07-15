/*
		Display current song list on screen
*/
// URL do not change
const APIaddress = 'https://api.streamersonglist.com/V1/';
// add your streamersonglist name here
const streamerName = 'resurrectionfern';
// do you want to show the song count after the song name (ie 4 in queue would show "Curent song name +3)
const showSongCount = true;
// if queue is empty do we want to show a message or remove the overlay from screen
const showEmptyQueue = true;
// message displayed if queue is empty
const queueEmptyMessage = 'Queue is empty';
// Do we want a title screen
const showTitle = true;
// message displayed if queue is empty
const screenTitleMessage = 'Current Song';

const apiBaseUrl = new URL('https://api.streamersonglist.com/V1/');

/**
 * Replaces the jQuery `empty` method
 */
HTMLElement.prototype.empty = function () {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
}

const body = document.body;
const songListContainer = document.getElementById('streamersonglist-container');
const apiUrl = new URL(`streamers/${streamerName}/queue`, apiBaseUrl);
apiUrl.searchParams.append('sortBy', 'artist');
apiUrl.searchParams.append('sortOrder', 'ASC');
apiUrl.searchParams.append('showInactive', 'false');

setInterval(async () => {
	try {
		const response = await fetch(apiUrl);
		const {ok, status} = response; // this is frustrating, there must be a better way...?
		if (ok) {
			songListContainer.empty();
			/** @type {Array} */
			const {list} = await response.json();
			if (list.length > 0) {
				if (showTitle) {
					const titleLabelElem = document.createElement('div');
					titleLabelElem.classList.add('songTitle');
					titleLabelElem.textContent = screenTitleMessage;
					songListContainer.append(titleLabelElem);
				}
				const titleElemWrapper = document.createElement('div');
				titleElemWrapper.classList.add('screenTitle');
				const titleElem = document.createElement('span');
				titleElem.textContent = list[0].song?.title || list[0].nonlistSong;
				titleElemWrapper.append(titleElem);
				if (list.length > 1 && showSongCount) {
					const countElem = document.createElement('span');
					countElem.textContent = ` + ${list.length - 1}`;
					titleElemWrapper.append(countElem);
				}
				songListContainer.append(titleElemWrapper);
			}
		} else {
			throw new Error(`A non-success ${status} status code was received from the API`);
		}
	} catch (exc) {
		console.log(exc);
	}
}, 10000);


// $(function () {
//   // Update the song queue0
//   $('body').updateQueue();

//   // repeat the update every 10 seconds
//   setInterval(function () {
//     $('body').updateQueue();
//   }, 10000);
// });

// jQuery.fn.extend({
//   updateQueue: function () {
//     $.ajax({
//       url: APIaddress + 'streamers/' + streamerName + '/queue?sortBy=artist&sortOrder=ASC&showInactive=false',
//       success: function (data) {
//         // empty the container div contents
//         $('#streamersonglist-container').empty();

//         // If the queue is empty, add a single entry to say so.
//         if (data.list.length == 0) {
//           if (showEmptyQueue) $('#streamersonglist-container').append('<div>' + queueEmptyMessage + '</div>');
//         } else {
//           /* 	lets start building the divs up. */
//           let screenText = '';
//           // add the title text div
//           if (showTitle) screenText = screenText + '<div class="songTitle">' + screenTitleMessage + '<div>';
//           // Show the text for "+X more" if we need it.
//           if (data.list.length > 1 && showSongCount)
//             screenText =
//               screenText +
//               '<div class="screenTitle">' +
//               data.list[0].song.title +
//               ' +' +
//               (data.list.length - 1) +
//               '</div>';
//           else {
//             screenText = screenText + '<div class="screenTitle">' + data.list[0].song.title + '</div>';
//           }
//           /* add our new divs to the screen */
//           $('#streamersonglist-container').append(screenText + '</div>');
//         }
//         console.log(APIaddress + 'streamers/' + streamerName + '/queue?sortBy=artist&sortOrder=ASC&showInactive=false');
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('error: ' + errorThrown);
//       },
//     });
//   },
// });

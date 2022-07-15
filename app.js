/*
		Display current song list on screen
*/
// URL do not change
const APIaddress = "https://api.streamersonglist.com/V1/";
// add your streamersonglist name here
const streamerName = "resurrectionfern";
// do you want to show the song count after the song name (ie 4 in queue would show "Curent song name +3)
const showSongCount = true;
// if queue is empty do we want to show a message or remove the overlay from screen
const showEmptyQueue = true;
// message displayed if queue is empty
const queueEmptyMessage = "Queue is empty";
// Do we want a title screen
const showTitle = true;
// message displayed if queue is empty
const screenTitleMessage = "Current Song";

const apiBaseUrl = new URL("https://api.streamersonglist.com/V1/");

/**
 * Replaces the jQuery `empty` method
 */
HTMLElement.prototype.empty = function () {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
};

const body = document.body;
const songListContainer = document.getElementById("streamersonglist-container");
const apiUrl = new URL(`streamers/${streamerName}/queue`, apiBaseUrl);
apiUrl.searchParams.append("sortBy", "artist");
apiUrl.searchParams.append("sortOrder", "ASC");
apiUrl.searchParams.append("showInactive", "false");

const updateOverlay = async function () {
	try {
		const response = await fetch(apiUrl);
		const { ok, status } = response; // this is frustrating, there must be a better way...?
		if (ok) {
			songListContainer.empty();
			/** @type {Array} */
			const { list } = await response.json();
			if (list.length > 0) {
				if (showTitle) {
					const titleLabelElem = document.createElement("div");
					titleLabelElem.classList.add("songTitle");
					titleLabelElem.textContent = screenTitleMessage;
					songListContainer.append(titleLabelElem);
				}
				const titleElemWrapper = document.createElement("div");
				titleElemWrapper.classList.add("screenTitle");
				const titleElem = document.createElement("span");
				titleElem.textContent = list[0].song?.title || list[0].nonlistSong;
				titleElemWrapper.append(titleElem);
				if (list.length > 1 && showSongCount) {
					const countElem = document.createElement("span");
					countElem.textContent = ` + ${list.length - 1}`;
					titleElemWrapper.append(countElem);
				}
				songListContainer.append(titleElemWrapper);
			}
		} else {
			throw new Error(
				`A non-success ${status} status code was received from the API`
			);
		}
	} catch (exc) {
		console.log(exc);
	}
};

setInterval(updateOverlay, 10000);
updateOverlay();

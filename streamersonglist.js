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

$(function () 
{
	// Update the song queue0
	$("body").updateQueue();

	// repeat the update every 10 seconds
	setInterval(function () 
	{
		$("body").updateQueue();
	}, 10000);
});

jQuery.fn.extend(
	{
		updateQueue: function () 
		{
			$.ajax(
				{
					url: APIaddress + "streamers/" + streamerName + "/queue?sortBy=artist&sortOrder=ASC&showInactive=false",
					success: function (data) 
					{
						// empty the container div contents
						$("#streamersonglist-container").empty();

						// If the queue is empty, add a single entry to say so.
						if (data.list.length == 0) 
						{
							if (showEmptyQueue)
								$("#streamersonglist-container").append('<div>' + queueEmptyMessage + '</div>');
						}
						else
						{
							/* 	lets start building the divs up. */
							let screenText = "";
							// add the title text div
							if (showTitle)
								screenText = screenText + '<div class="songTitle">' + screenTitleMessage + '<div>';
							// Show the text for "+X more" if we need it.
							if (data.list.length > 1 && showSongCount)
								screenText = screenText + '<div class="screenTitle">' + data.list[0].song.title + ' +' + (data.list.length - 1) + '</div>';
							else
								screenText = screenText + '<div class="screenTitle">' + data.list[0].song.title + '</div>';
							/* add our new divs to the screen */
							$('#streamersonglist-container').append(screenText + '</div>');
						}
						console.log(APIaddress + "streamers/" + streamerName + "/queue?sortBy=artist&sortOrder=ASC&showInactive=false")
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console.log("error: " + errorThrown);
					}
				});
		},
	});

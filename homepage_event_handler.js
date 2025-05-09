//populated the genre in dropdown of the addsong option
fetch("./genre.php")
  .then((response) => response.json())
  .then((genres) => {
    const select = document.getElementById("genre-id");
    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      select.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching genres:", error));

// Fetch genres and populate the genre filter dropdown
fetch("./genre.php")
  .then((response) => response.json())
  .then((genres) => {
    const genreFilter = document.getElementById("genre-filter");
    genres.forEach((genre) => {
      const filterOption = document.createElement("option");
      filterOption.value = genre.id;
      filterOption.textContent = genre.name;
      genreFilter.appendChild(filterOption);
    });
  })
  .catch((error) => console.error("Error fetching genres:", error));

function fetchGenreNameById(genreId) {
  return fetch(`./genre.php?id=${genreId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => data.name)
    .catch((error) => {
      console.error("Error fetching genre name:", error);
      return "undefined";
    });
}

// Function to fetch and display available songs based on filters
function fetchAvailableSongs(keyword = "", genre = "", sort = "newest") {
  fetch(
    `./song.php?keyword=${encodeURIComponent(
      keyword
    )}&genre=${encodeURIComponent(genre)}&sort=${encodeURIComponent(sort)}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((songs) => {
      const container = document.getElementById("available-songs-container");
      container.innerHTML = "";
      container.innerHTML =
        '<h1 id="available_songs_heading" class="heading">Available songs</h1>';

      const genrePromises = songs.map((song) =>
        fetchGenreNameById(song.genre_id).then((genreName) => {
          return { ...song, genreName };
        })
      );

      Promise.all(genrePromises).then((songsWithGenres) => {
        songsWithGenres.forEach((song) => {
          const songCard = document.createElement("div");
          songCard.classList.add("song-card");

          const image = document.createElement("img");
          image.src = song.image_path;
          image.alt = `${song.song_name} Picture`;
          image.classList.add("song-image");
          songCard.appendChild(image);

          const infoDiv = document.createElement("div");
          infoDiv.classList.add("song-info");
          infoDiv.innerHTML = `
            <h2 class="song-title">${song.song_name}</h2>
            <p class="song-artist">Artist: ${song.artist_name}</p> 
            <p class="song-genre">Genre: ${song.genreName}</p>
            <p class="song-date">Uploaded At: ${song.created_at}</p>
            <button class="play-button" data-music="${song.music_path}" image-src="${song.image_path}">Play</button>
            <button class="add-to-playlist-button" data-song-id="${song.id}">Add</button>
          `;
          songCard.appendChild(infoDiv);

          container.appendChild(songCard);
        });

        const playButtons = document.querySelectorAll(".play-button");
        playButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const url = event.target.getAttribute("data-music");
            const audioSource = document.getElementById("audio-source");
            const audioPlayer = document.getElementById("audio-player");
            const audioPlayerContainer = document.getElementById(
              "audio-player-container"
            );
            const audioPlayerSongImg = document.getElementById(
              "song-picture-audio-player"
            );
            audioPlayerSongImg.src = event.target.getAttribute("image-src");

            audioSource.src = url;
            audioPlayer.load();
            audioPlayer.play();
            audioPlayerContainer.classList.remove("hidden");
          });
        });

        const addToPlaylistButtons = document.querySelectorAll(
          ".add-to-playlist-button"
        );
        addToPlaylistButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const songId = event.target.getAttribute("data-song-id");
            openAddToPlaylistModal(songId);
          });
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching songs:", error);
    });
}

// Function to open the "Add to Playlist" modal and populate playlists
function openAddToPlaylistModal(songId) {
  const modal = document.getElementById("add-to-playlist-modal");
  modal.style.display = "flex"; // Ensure modal is visible and centered
  modal.classList.remove("hidden");

  // Store the song ID in a hidden input field in the form
  document.getElementById("song-id-input").value = songId;

  // Fetch playlists for the user and populate the checkboxes
  fetch("./get_user_id.php", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((userData) => {
      if (userData.error) {
        console.error(userData.error);
        return;
      }

      const userId = userData.user_id;

      fetch(`./playlist.php?user_id=${userId}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((playlists) => {
          const container = document.getElementById("playlist-checkboxes");
          container.innerHTML = ""; // Clear the container before populating it

          if (playlists.error) {
            console.error(playlists.error);
            return;
          }

          playlists.forEach((playlist) => {
            const checkboxDiv = document.createElement("div");
            checkboxDiv.classList.add("playlist-checkbox");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `playlist-${playlist.id}`;
            checkbox.value = playlist.id;
            checkbox.name = "playlist_ids";

            const label = document.createElement("label");
            label.htmlFor = `playlist-${playlist.id}`;
            label.textContent = playlist.name;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);

            container.appendChild(checkboxDiv);
          });
        })
        .catch((error) => {
          console.error("Error fetching playlists:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching user ID:", error);
    });
}

// Event listener for the cancel button in the modal
document
  .getElementById("add-to-playlist-cancel")
  .addEventListener("click", function () {
    document.getElementById("add-to-playlist-modal").classList.add("hidden");
  });

// Add the function call to fetch songs initially
document.addEventListener("DOMContentLoaded", function () {
  fetchAvailableSongs();
});

//initiate the searching for song by the criterias
document.getElementById("search-button").addEventListener("click", function () {
  const keyword = document.getElementById("search-bar").value.trim();
  const genre = document.getElementById("genre-filter").value;
  const sort = document.getElementById("sort-filter").value;
  fetchAvailableSongs(keyword, genre, sort);
});

document.getElementById("logo").addEventListener("click", function () {
  location.reload();
});

document
  .getElementById("add-song-button")
  .addEventListener("click", function () {
    document.getElementById("add-song-modal").classList.remove("hidden");
  });

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("add-song-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);

      fetch("./song.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            document.getElementById("add-song-form-error").innerText =
              data.error;
          } else {
            window.location.reload();
            alert("Song added successfully!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});

document.getElementById("cancel-button").addEventListener("click", function () {
  document.getElementById("add-song-modal").classList.add("hidden");
});

document
  .getElementById("close-audio-player-button")
  .addEventListener("click", () => {
    const audioPlayerContainer = document.getElementById(
      "audio-player-container"
    );
    const audioPlayer = document.getElementById("audio-player");

    audioPlayer.pause();
    audioPlayerContainer.classList.add("hidden");
  });

let isDragging = false;
let initialX, initialY;
let offsetX, offsetY;
let container;

document.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", endDrag);

function startDrag(event) {
  if (event.button === 0) {
    if (
      event.target.id === "audio-player-container" ||
      event.target.parentElement.id === "audio-player-container"
    ) {
      container =
        event.target.id === "audio-player-container"
          ? event.target
          : event.target.parentElement;

      initialX = container.getBoundingClientRect().left;
      initialY = container.getBoundingClientRect().top;

      offsetX = event.clientX - initialX;
      offsetY = event.clientY - initialY;

      isDragging = true;
    }
  }
}

function drag(event) {
  if (isDragging && container) {
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  }
}

function endDrag() {
  container = null;
  isDragging = false;
}

function fetchPlaylists() {
  // Fetch the user ID from the session
  fetch("./get_user_id.php", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        const userId = data.user_id;

        // Fetch playlists for the user
        fetch(`./playlist.php?user_id=${userId}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((playlists) => {
            const container = document.getElementById(
              "playlists-container-inner"
            );
            container.innerHTML = ""; // Clear the container before populating it

            if (playlists.error) {
              console.error(playlists.error);
              return;
            }

            playlists.forEach((playlist) => {
              const playlistCard = document.createElement("div");
              playlistCard.classList.add("playlist-card");

              const infoDiv = document.createElement("div");
              infoDiv.classList.add("playlist-info");
              infoDiv.innerHTML = `
                <h2 class="playlist-title">${playlist.name}</h2>
                <p class="playlist-length">Length: ${playlist.length}</p>
                <p class="playlist-date">Created At: ${playlist.created_at}</p>
                <button class="view-playlist-button" data-id="${playlist.id}">View</button>
              `;
              playlistCard.appendChild(infoDiv);

              container.appendChild(playlistCard);
            });

            const viewButtons = document.querySelectorAll(
              ".view-playlist-button"
            );
            viewButtons.forEach((button) => {
              button.addEventListener("click", (event) => {
                const playlistId = event.target.getAttribute("data-id");
                fetchSongsInPlaylist(playlistId);
              });
            });
          })
          .catch((error) => {
            console.error("Error fetching playlists:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching user ID:", error);
    });
}

document
  .getElementById("my-playlists-button")
  .addEventListener("click", function () {
    const songsContainer = document.getElementById("available-songs-container");
    const playlistsContainer = document.getElementById("playlists-container");
    const songsHeading = document.getElementById("available_songs_heading");

    // Hide the songs container and heading
    songsContainer.classList.add("hidden");
    if (songsHeading) {
      songsHeading.classList.add("hidden");
    }

    // Fetch and display playlists
    fetchPlaylists();

    // Show the playlists container
    playlistsContainer.classList.remove("hidden");
  });

document
  .getElementById("add-playlist-button")
  .addEventListener("click", function () {
    document.getElementById("add-playlist-modal").classList.remove("hidden");
  });

document
  .getElementById("cancel-playlist-button")
  .addEventListener("click", function () {
    document.getElementById("add-playlist-modal").classList.add("hidden");
  });

//add event to the submission button of the adding playlist
document
  .getElementById("add-playlist-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Fetch the user ID from the session
    fetch("./get_user_id.php", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          document.getElementById("add-playlist-form-error").innerText =
            data.error;
        } else {
          const userId = data.user_id;
          const formData = new FormData(this);
          formData.append("user_id", userId); // Append the user ID to the form data

          fetch("./playlist.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                document.getElementById("add-playlist-form-error").innerText =
                  data.error;
              } else {
                // Hide the form
                document
                  .getElementById("add-playlist-form-container")
                  .classList.add("hidden");

                // Optionally, refresh the playlist display
                //fetchPlaylists();

                alert("Playlist added successfully!");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  });

// Event listener for the form submission to add song to playlists
document
  .getElementById("add-to-playlist-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const songId = document.getElementById("song-id-input").value;

    // Append the song ID to the FormData
    formData.append("song_id", songId);

    // Append each checked playlist ID to the FormData
    document
      .querySelectorAll('input[name="playlist_ids"]:checked')
      .forEach((checkbox) => {
        formData.append("playlist_ids[]", checkbox.value);
      });

    fetch("./song_playlist.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          // Hide the modal
          document
            .getElementById("add-to-playlist-modal")
            .classList.add("hidden");
          alert("Song added to selected playlists successfully!");
        }
      })
      .catch((error) => {
        console.error("Error adding song to playlists:", error);
      });
  });

// Function to fetch and display songs in a playlist
function fetchSongsInPlaylist(playlistId) {
  fetch(`./song_playlist.php?playlist_id=${playlistId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((songs) => {
      const container = document.getElementById("playlist-songs-container");
      container.innerHTML = ""; // Clear the container before populating it

      if (songs.error) {
        console.error(songs.error);
        return;
      }

      if (songs.length === 0) {
        container.innerHTML = "<p>No songs in this playlist.</p>";
        return;
      }

      // Use Promise.all to fetch genre names for all songs
      const genrePromises = songs.map((song) =>
        fetchGenreNameById(song.genre_id).then((genreName) => {
          return { ...song, genreName };
        })
      );

      Promise.all(genrePromises).then((songsWithGenres) => {
        songsWithGenres.forEach((song) => {
          const songCard = document.createElement("div");
          songCard.classList.add("song-playlist-card");

          const image = document.createElement("img");
          image.src = song.image_path;
          image.alt = `${song.song_name} Picture`;
          image.classList.add("song-playlist-image");
          songCard.appendChild(image);

          const infoDiv = document.createElement("div");
          infoDiv.classList.add("song-playlist-info");
          infoDiv.innerHTML = `
            <h3>${song.song_name}</h3>
            <p>Artist: ${song.artist_name}</p>
            <p>Genre: ${song.genreName}</p>
          `;
          songCard.appendChild(infoDiv);

          container.appendChild(songCard);
        });

        // Show the modal
        document
          .getElementById("view-playlist-modal")
          .classList.remove("hidden");
      });
    })
    .catch((error) => {
      console.error("Error fetching songs in playlist:", error);
    });
}

// Event listener for the view buttons
document.querySelectorAll(".view-playlist-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const playlistId = event.target.getAttribute("data-id");
    fetchSongsInPlaylist(playlistId);
  });
});

// Event listener to close the playlist view modal
document.getElementById("close-playlist-view").addEventListener("click", () => {
  document.getElementById("view-playlist-modal").classList.add("hidden");
});

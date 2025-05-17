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

// Основна функция за зареждане на случайни песни
function loadRandomSongs() {
  fetch("./random_songs.php")
    .then((response) => response.json())
    .then((songs) => {
      const sidebar = document.getElementById("sidebar-random-songs");
      sidebar.innerHTML = "";

      songs.forEach((song) => {
        const songDiv = createRandomSongElement(song);
        sidebar.appendChild(songDiv);
      });
    })
    .catch((error) => {
      console.error("Error loading random songs:", error);
    });
}

// Създава HTML елемент за една песен и добавя click listener
function createRandomSongElement(song) {
  const songDiv = document.createElement("div");
  songDiv.className = "random-song-item";

  const wrapper = document.createElement("div");
  wrapper.style = "position: relative; display: inline-block; width: 100px;";

  fetch("./log_debug.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });

  const img = document.createElement("img");
  img.src = song.image_path;
  img.alt = song.song_name;
  img.width = 100;
  img.style =
    "border-radius: 20px; transition: transform 0.3s ease; cursor: pointer;";
  img.dataset.music = song.music_path;
  img.dataset.songId = song.id;
  img.dataset.image = song.image_path;

  img.onmouseover = () => {
    img.style.transform = "scale(1.2)";
    tooltip.style.opacity = "1";
  };

  img.onmouseout = () => {
    img.style.transform = "scale(1)";
    tooltip.style.opacity = "0";
  };

  const music = img.dataset.music;
  const image = img.dataset.image;
  const songId = img.dataset.songId;
  // Логване към сървъра
  fetch("./log_debug.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ music, image, songId }),
  });

  img.addEventListener("click", () => {
    handleSongClick(img.dataset.music, img.dataset.image, img.dataset.songId);
  });

  const tooltip = document.createElement("div");
  tooltip.textContent = song.song_name;
  tooltip.style = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 13px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  `;

  wrapper.appendChild(img);
  wrapper.appendChild(tooltip);
  songDiv.appendChild(wrapper);
  return songDiv;
}

// Действие при кликване на песен от дясната лента
// Глобално, само веднъж! Уникален ID за този клиент
const clientId = Math.random().toString(36).substring(2);
let currentWs = null;

function handleSongClick(url, image, songId) {
  console.log("▶ handleSongClick за songId:", songId);

  // Увеличаваме гледанията
  fetch("./song.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "increment_view", song_id: songId }),
  });

  // Скриваме други секции, показваме избрания song
  document.getElementById("available-songs-container").classList.add("hidden");
  document.getElementById("playlists-container").classList.add("hidden");
  document.getElementById("sidebar-random-songs").classList.remove("hidden");

  const focusContainer = document.getElementById("focused-song-container");
  focusContainer.classList.remove("hidden");

  const mediaElement = url.endsWith(".mp4")
    ? `<video width="720" height="360" controls autoplay><source src="${url}" type="video/mp4"></video>`
    : `<audio controls autoplay><source src="${url}" type="audio/mpeg"></audio>`;

  // Основен HTML
  focusContainer.innerHTML = `
  <div class="focused-player" style="text-align: center; margin-top: 400px;">
    <h2 style="color: #666; margin-bottom: 10px;">Now Playing</h2>
    ${mediaElement}
    <img src="${image}" width="200" style="margin-top: 10px;" />
    <div style="margin-top: 10px;">
      <button class="button" id="like-button" style="background-color: #28a745; color: white;"> Like</button>
      <button class="button" id="dislike-button" style="background-color: #393D41; color: white;"> Dislike</button>
    </div>
    <br>
    <button onclick="goBackToMainView()" class="button" style="margin-top: 10px;">Back</button>
  </div>

  <div id="comments-section" style="margin-top: 60px; background-color: rgba(255,255,255,0.95); padding: 20px; border-radius: 12px; max-width: 800px; margin-left: auto; margin-right: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h3 style="font-weight: bold; margin-bottom: 10px;"> Live Comments</h3>
    <div id="comments-container" style="border: 1px solid #ccc; background-color: #f0f0f0; border-radius: 8px; padding: 10px; height: 180px; overflow-y: auto; font-size: 14px; color: #333;"></div>
    <div style="display: flex; gap: 10px; margin-top: 12px;">
      <input type="text" id="comment-input" placeholder="Type your comment..." style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 14px;">
      <button id="send-comment-button" style="padding: 10px 16px; background-color: #007bff; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
        Send
      </button>
    </div>
  </div>
`;

  // Затваряме предишна WebSocket връзка, ако има
  if (currentWs && currentWs.readyState !== WebSocket.CLOSED) {
    currentWs.close();
  }

  let currentUsername = "User";

  fetch("./get_username.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.username) {
        currentUsername = data.username;
      }
    });

  // Създаваме нова WebSocket връзка
  currentWs = new WebSocket("ws://localhost:3000");

  currentWs.onopen = () => {
    currentWs.send(
      JSON.stringify({
        type: "subscribe",
        songId: songId,
        clientId: clientId, // можеш да го използваш и тук за бъдещи цели
      })
    );
  };

  // Получаване на коментари (само чужди)
  currentWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (
      data.type === "broadcast_comment" &&
      data.songId === songId &&
      data.clientId !== clientId
    ) {
      const commentDiv = document.createElement("div");
      commentDiv.innerHTML = `<strong>${data.username}</strong> [${data.timestamp}]: ${data.message}`;
      document.getElementById("comments-container").appendChild(commentDiv);
    }
  };

  // Слушател за изпращане на коментар
  const oldButton = document.getElementById("send-comment-button");
  oldButton.replaceWith(oldButton.cloneNode(true));
  const newButton = document.getElementById("send-comment-button");
  const input = document.getElementById("comment-input");

  newButton.addEventListener("click", () => {
    const message = input.value.trim();
    if (message !== "") {
      const timestamp = new Date().toLocaleTimeString();

      // Показваме веднага на клиента
      const commentDiv = document.createElement("div");
      commentDiv.innerHTML = `<strong>You</strong> [${timestamp}]: ${message}`;
      document.getElementById("comments-container").appendChild(commentDiv);

      currentWs.send(
        JSON.stringify({
          type: "new_comment",
          songId: songId,
          username: currentUsername,
          message: message,
        })
      );

      input.value = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchAvailableSongs();
});

function goBackToMainView() {
  document.getElementById("focused-song-container").classList.add("hidden");
  document.getElementById("focused-song-container").innerHTML = "";

  // Покажи САМО песните (не и плейлистите!)
  document
    .getElementById("available-songs-container")
    .classList.remove("hidden");

  //hiding the side bar with the random songs
  document.getElementById("sidebar-random-songs").classList.add("hidden");

  // Не показвай playlists-container, освен ако не си бил в My Playlists
  // document.getElementById("playlists-container").classList.remove("hidden"); ❌ махни го
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

      // create the container with the data for every song returned by the SERVER
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
            <button class="play-button" data-music="${song.music_path}" image-src="${song.image_path}" data-song-id="${song.id}">Play</button>
            <button class="add-to-playlist-button" data-song-id="${song.id}">Add</button>
          `;
          songCard.appendChild(infoDiv);

          container.appendChild(songCard);
        });

        // GOING TROUGHT EVERY PLAY-BUTTON TO ATTACH EVENT TO IT ,
        // TO THE PLAY-BUTTON THERE IS ATTACHED INFORMATION ABOUT THE SONG
        const playButtons = document.querySelectorAll(".play-button");
        playButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const url = event.target.getAttribute("data-music");
            const image = event.target.getAttribute("image-src");

            const songId = event.target.getAttribute("data-song-id");

            loadRandomSongs(); // ← добави това тук

            handleSongClick(url, image, songId);
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

//tuk beshe
// event listener for My profile button
document.getElementById("profile-button").addEventListener("click", () => {
  fetch("./get_user_info.php")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "profile-username"
      ).textContent = `Username: ${data.username}`;
      document.getElementById("profile-picture").src =
        data.profile_picture || "./default_profile.png";
      // Скриваме всички основни секции
      document
        .getElementById("available-songs-container")
        .classList.add("hidden");
      document.getElementById("focused-song-container").classList.add("hidden");
      document.getElementById("sidebar-random-songs").classList.add("hidden");
      document.getElementById("playlists-container").classList.add("hidden");
      document.getElementById("statistics-container").classList.add("hidden");

      document.getElementById("profile-modal").classList.remove("hidden");
    });
});

function closeProfileModal() {
  document.getElementById("profile-modal").classList.add("hidden");
  document
    .getElementById("available-songs-container")
    .classList.remove("hidden");
}
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

    document.getElementById("view-playlist-modal").classList.add("hidden");

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

// event for the statistic button
document
  .getElementById("statistics-button")
  .addEventListener("click", function () {
    // Скрий всички други секции
    document
      .getElementById("available-songs-container")
      .classList.add("hidden");
    document.getElementById("focused-song-container").classList.add("hidden");
    document.getElementById("audio-player-container").classList.add("hidden");
    document.getElementById("playlists-container").classList.add("hidden");
    document.getElementById("sidebar-random-songs").classList.add("hidden");

    // Покажи статистиката
    document.getElementById("statistics-container").classList.remove("hidden");

    fetch("./most_viewed.php")
      .then((response) => response.json())
      .then((songs) => {
        const list = document.getElementById("most-viewed-list");
        list.innerHTML = "";

        songs.forEach((song) => {
          const card = document.createElement("div");
          card.style = `
        display: flex;
        align-items: center;
        gap: 16px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      `;

          const img = document.createElement("img");
          img.src = song.image_path || "./default_song_image.png";
          img.alt = song.song_name;
          img.style =
            "width: 80px; height: 80px; border-radius: 8px; object-fit: cover;";

          const info = document.createElement("div");
          info.innerHTML = `
        <h3 style="margin: 0; font-size: 18px;">${song.song_name}</h3>
        <p style="margin: 4px 0 0; color: #555;">Views: ${song.views}</p>
      `;

          card.appendChild(img);
          card.appendChild(info);
          list.appendChild(card);
        });
      })
      .catch((error) => console.error("Error loading statistics:", error));
  });

// event listener for the submit button on the profile picture
document.getElementById("upload-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch("./upload_profile_picture.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("profile-picture").src = data.image_url;
        alert("✅ profile picture was successfully updated!");
      } else {
        alert("❌ Error while uploading: " + data.error);
      }
    })
    .catch((err) => {
      console.error("Error with quering:", err);
      alert("❌ Problem with the query.");
    });
});

//function for loading previous conversations
function loadMyConversations() {
  fetch("./get_conversations.php")
    .then((res) => res.json())
    .then((conversations) => {
      const container = document.getElementById("my-conversations-list");
      container.innerHTML = "";

      if (conversations.length === 0) {
        container.innerHTML = "<p style='color: #777;'>No active chats.</p>";
        return;
      }

      conversations.forEach((conv) => {
        const div = document.createElement("div");
        div.style =
          "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;";

        div.innerHTML = `
          <span><strong>${conv.username} ${conv.conversation_id} </strong></span>
          <button onclick="openChatPopup(${conv.conversation_id}, ${conv.user_id}, '${conv.username}')" style="background-color: #007bff; color: white; border: none; padding: 4px 10px; border-radius: 6px;">Chat</button>
        `;

        container.appendChild(div);
      });
    });
}

// Показване на модuла за съобщения
document.getElementById("messages-button").addEventListener("click", () => {
  // Скриване на всички останали секции
  document.getElementById("available-songs-container").classList.add("hidden");
  document.getElementById("focused-song-container").classList.add("hidden");
  document.getElementById("sidebar-random-songs").classList.add("hidden");
  document.getElementById("playlists-container").classList.add("hidden");
  document.getElementById("statistics-container").classList.add("hidden");
  document.getElementById("profile-modal").classList.add("hidden");

  // Показване на модала за съобщения
  document.getElementById("messages-container").classList.remove("hidden");

  loadMyConversations(); // 👈 това добави

  // (по избор) Изчистване на входните полета и съобщенията
  document.getElementById("message-input").value = "";
  document.getElementById("chat-box").innerHTML = "";
  document.getElementById("chat-users").innerHTML = "";
});

// Скриване на модала
function closeMessagesModal() {
  document.getElementById("messages-container").classList.add("hidden");
  document
    .getElementById("available-songs-container")
    .classList.remove("hidden");
}

// function to send message to the user
function sendMessageToUser(receiverId, popup) {
  const input = popup.querySelector("input[type='text']");
  const message = input.value.trim();
  if (!message) return;

  fetch("./send_message.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `receiver_id=${encodeURIComponent(
      receiverId
    )}&message=${encodeURIComponent(message)}`,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const chatBox = popup.querySelector(".popup-messages");

        const msgDiv = document.createElement("div");
        msgDiv.style =
          "text-align: right; margin-bottom: 6px; padding-right: 8px;";

        msgDiv.innerHTML = `
          <span style="
            background-color: #cce5ff;
            padding: 6px 10px;
            border-radius: 8px;
            display: inline-block;
            max-width: 75%;
            word-wrap: break-word;
          ">
            ${message}
          </span>
        `;

        chatBox.appendChild(msgDiv);

        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
      } else {
        alert("Failed to send message");
      }
    });
}

let currentChatReceiverId = null;

function openChatPopup(conversationId, userId, username) {
  //if (document.getElementById(`chat-popup-${userId}`)) return;

  currentChatReceiverId = userId;

  const popup = document.createElement("div");
  popup.id = `chat-popup-${userId}`;
  popup.classList.add("chat-popup");
  popup.style = `
    position: fixed;
    bottom: 20px;
    right: ${30 + document.querySelectorAll(".chat-popup").length * 320}px;
    width: 300px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    z-index: 1000;
    font-family: 'Segoe UI', sans-serif;
  `;

  popup.innerHTML = `
    <div class="popup-header" style="
      background-color: #007bff;
      color: white;
      padding: 8px 12px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      cursor: move;
    ">
      Chat with ${username}
      <span style="float: right; cursor: pointer;" onclick="document.getElementById('chat-popup-${userId}').remove()">close</span>
    </div>

    <div class="popup-messages" style="padding: 10px; height: 200px; overflow-y: auto; background: #f9f9f9;"></div>

    <div class="popup-input" style="display: flex; gap: 6px; padding: 8px;">
      <input type="text" placeholder="Message..." style="flex: 1; padding: 6px; border-radius: 6px; border: 1px solid #ccc;" />
      <button id="send-message-button-${userId}" style="width: 100%; background-color: #007bff; color: white; border: none; border-radius: 4px; padding: 8px;">Send</button>
    </div>
  `;

  document.body.appendChild(popup);

  // 🎯 ЗАРЕЖДАНЕ НА СЪОБЩЕНИЯТА
  fetch(`./get_messages.php?conversation_id=${conversationId}`)
    .then((res) => res.json())
    .then((messages) => {
      const chatBox = popup.querySelector(".popup-messages");
      chatBox.innerHTML = "";

      messages.forEach((msg) => {
        const msgDiv = document.createElement("div");

        msgDiv.style = `text-align: ${
          msg.is_mine ? "right" : "left"
        }; margin-bottom: 6px;`;

        msgDiv.innerHTML = `
        <span style="
          background-color: ${msg.is_mine ? "#cce5ff" : "#e8e8e8"};
          padding: 6px 10px;
          border-radius: 8px;
          display: inline-block;
          max-width: 75%;
          word-wrap: break-word;
        ">
          ${msg.message}
        </span>
      `;

        chatBox.appendChild(msgDiv);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    });

  document
    .getElementById(`send-message-button-${userId}`)
    .addEventListener("click", () => {
      sendMessageToUser(userId, popup);
    });

  makeDraggable(popup);
}

function makeDraggable(el) {
  const header = el.querySelector(".popup-header");
  let isDragging = false,
    offsetX = 0,
    offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
    el.style.right = "auto"; // забрави за fixed right
    el.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
}

// function to populated the searched users
function searchUsers() {
  const query = document.getElementById("search-users").value.trim();

  if (!query) return;

  fetch(`./search_users.php?q=${encodeURIComponent(query)}`)
    .then((res) => res.json())
    .then((users) => {
      const container = document.getElementById("chat-users");
      container.innerHTML = "";

      if (users.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        return;
      }

      users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.style =
          "display: flex; align-items: center; margin-bottom: 10px; gap: 10px;";

        const img = document.createElement("img");
        img.src = user.profile_picture || "./default_profile.png";
        img.alt = "Profile";
        img.width = 40;
        img.height = 40;
        img.style = "border-radius: 50%; border: 2px solid #007bff;";

        const name = document.createElement("span");
        name.textContent = user.username;
        name.style = "flex: 1; font-weight: bold;";

        const btn = document.createElement("button");
        btn.textContent = "Chat";
        btn.classList.add("button");
        btn.style =
          "background-color: #007bff; color: white; padding: 6px 10px; border: none; border-radius: 6px; cursor: pointer;";

        // 👉 Закачаме popup за чат
        btn.addEventListener("click", () => {
          openChatPopup(1, user.id, user.username);
        });

        userDiv.appendChild(img);
        userDiv.appendChild(name);
        userDiv.appendChild(btn);

        container.appendChild(userDiv);
      });
    });
}

document
  .getElementById("search-users")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      searchUsers();
    }
  });

document
  .querySelector("#messages-container button[onclick='searchUsers()']")
  .addEventListener("click", searchUsers);

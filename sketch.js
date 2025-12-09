let canvas;

let introSong;



let tracks = [];
let currentTrackIndex = 0;
let currentSong;
let totalTracks = 3;

let hoverSound, clickSound;

let startScreenImg;
let startBtn, playImg, pauseImg, resetImg, skipImg, prevImg, nextImg, volumeSlider;
let songNameText;

let playlistButtons = [];
let playlistPrefixes = ["erevemusic", "henesyssong", "kerningcitysong"];
let playlistImgs = ["erevelocation.png", "henesyslocation.png", "kerningcitylocation.png"];
let currentPlaylistIndex = 0;

let playlistBg;

let erevePics = [];
let henesysPics = [];
let kerningPics = [];

let songNames = [
    ["Ereve - Raindrop Flower", "Ereve - Queen’s Garden", "Ereve - Cygnus Garden"],
    ["Henesys - Floral Life", "Henesys - Rest N Peace", "Henesys - Cave Bien"],
    ["Kerning City - Bad Guy", "Kerning City - Kerning Square", "Kerning City - Secret Flower"]
];

let musicStarted = false;
let firstClickDone = false;
let playlistStarted = false;
let pauseState = false;

function preload() {
    for (let i = 1; i <= 3; i++) {
        erevePics.push(loadImage(`erevepic${i}.jpg`));
    }

    for (let i = 1; i <= 3; i++) {
        henesysPics.push(loadImage(`henesyspic${i}.jpg`));
    }

    for (let i = 1; i <= 3; i++) {
        kerningPics.push(loadImage(`kerningcitypic${i}.jpg`));
    }
    startScreenImg = loadImage("startscreenpic.jpg");
}

function setup() {
    let canvasWidth = 800;
    let canvasHeight = 450;
    let canvasX = (windowWidth - canvasWidth) / 2;
    let canvasY = 150;

    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.position(canvasX, canvasY);
    let titleText = createP("MapleMusic");
    titleText.style("color", "white");
    titleText.style("font-size", "48px");
    titleText.style("text-align", "center");
    titleText.position((windowWidth - 800)/2, canvasY - 120); 
    titleText.size(800, 50);

    introSong = createAudio("thememusic1.mp3");
    introSong.loop();
    introSong.volume(1);
    introSong.hide();
    introSong.stop();

    loadPlaylist(playlistPrefixes[currentPlaylistIndex]);

    // UI sounds
    hoverSound = createAudio("mousehover.mp3");
    clickSound = createAudio("mouseclick.mp3");
    hoverSound.hide();
    clickSound.hide();

    startBtn = createButton("Start");
    startBtn.id("startBtn");
    startBtn.position(canvasX + 350, canvasY + canvasHeight + 50);
    startBtn.size(100, 50);
    startBtn.mousePressed(start);
    startBtn.mouseOver(playHoverSound);

    createControlButtons(canvasX, canvasY);

    playlistBg = createImg("location.png");
    playlistBg.position(canvasX - 320, canvasY + 20);
    playlistBg.size(300, 375);
    playlistBg.hide();

    createPlaylistButtons(canvasX, canvasY);

    // Song name 
    songNameText = createP("");
    songNameText.style("color", "white");
    songNameText.style("font-size", "24px");
    songNameText.style("text-align", "center");
    songNameText.position(canvasX, canvasY + canvasHeight + 15);
    songNameText.size(canvasWidth, 30);
}

function playHoverSound() {
    if (hoverSound) {
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
}

function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

function start() {
    playClickSound();
    musicStarted = true;

    startBtn.hide();

    playImg.show();
    pauseImg.show();
    resetImg.show();
    skipImg.show();
    prevImg.show();
    nextImg.show();
    volumeSlider.show();

    playlistBg.show();
    playlistButtons.forEach(btn => btn.show());

    updateSongName();
}

// First click for intro music
function mousePressed() {
    if (!firstClickDone) {
        introSong.play();
        firstClickDone = true;
    }
}

// Load a playlist by prefix
function loadPlaylist(prefix) {
    tracks = [];
    currentTrackIndex = 0;
    totalTracks = 3;

    for (let i = 1; i <= totalTracks; i++) {
        let track = createAudio(`${prefix}${i}.mp3`);
        track.loop();
        track.volume(1);
        track.hide();
        track.stop();
        tracks.push(track);
    }

    currentSong = tracks[0];
    playlistStarted = false;
    pauseState = false;
    if (pauseImg) pauseImg.attribute("src", "pause.png");
    updateSongName();
}

function createControlButtons(canvasX, canvasY) {
    playImg = createImg("play.png");
    playImg.size(60, 60);
    playImg.position(canvasX + 170, canvasY + 450 + 80);
    playImg.id("playBtn");
    playImg.style("transition", "0.2s");
    playImg.mouseOver(playHoverSound);
    playImg.mousePressed(() => { playClickSound(); playPlaylist(); });
    playImg.hide();

    pauseImg = createImg("pause.png");
    pauseImg.size(60, 60);
    pauseImg.position(canvasX + 250, canvasY + 450 + 80);
    pauseImg.id("pauseBtn");
    pauseImg.style("transition", "0.2s");
    pauseImg.mouseOver(playHoverSound);
    pauseImg.mousePressed(() => { playClickSound(); togglePause(); });
    pauseImg.hide();

    resetImg = createImg("reset.png");
    resetImg.size(60, 60);
    resetImg.position(canvasX + 330, canvasY + 450 + 80);
    resetImg.id("resetBtn");
    resetImg.style("transition", "0.2s");
    resetImg.mouseOver(playHoverSound);
    resetImg.mousePressed(() => { playClickSound(); resetSong(); });
    resetImg.hide();

    skipImg = createImg("skip10s.png");
    skipImg.size(60, 60);
    skipImg.position(canvasX + 410, canvasY + 450 + 80);
    skipImg.id("skip10Btn");
    skipImg.style("transition", "0.2s");
    skipImg.mouseOver(playHoverSound);
    skipImg.mousePressed(() => { playClickSound(); skipAhead(); });
    skipImg.hide();

    prevImg = createImg("previoussong.png");
    prevImg.size(60, 60);
    prevImg.position(canvasX + 490, canvasY + 450 + 80);
    prevImg.id("prevBtn");
    prevImg.style("transition", "0.2s");
    prevImg.mouseOver(playHoverSound);
    prevImg.mousePressed(() => { playClickSound(); prevTrack(); });
    prevImg.hide();

    nextImg = createImg("nextsong.png");
    nextImg.size(60, 60);
    nextImg.position(canvasX + 570, canvasY + 450 + 80);
    nextImg.id("nextBtn");
    nextImg.style("transition", "0.2s");
    nextImg.mouseOver(playHoverSound);
    nextImg.mousePressed(() => { playClickSound(); nextTrack(); });
    nextImg.hide();

    volumeSlider = createSlider(0, 1, 1, 0.01);
    volumeSlider.size(200);
    volumeSlider.position(canvasX + 300, canvasY + 450 + 140);
    volumeSlider.input(changeVolume);
    volumeSlider.hide();
}

// Create playlist buttons
function createPlaylistButtons(canvasX, canvasY) {
    const playlists = [
        { img: "erevelocation.png", prefix: "erevemusic" },
        { img: "henesyslocation.png", prefix: "henesyssong" },
        { img: "kerningcitylocation.png", prefix: "kerningcitysong" }
    ];

    let startY = canvasY + 65;
    let gapY = 100;

    playlists.forEach((p, i) => {
        let btn = createImg(p.img);
        btn.size(275, 96);
        btn.position(canvasX - 308, startY + i * gapY);
        btn.id(`playlistBtn${i}`);
        btn.style("transition", "0.2s");
        btn.mouseOver(playHoverSound);
        btn.mousePressed(() => {
            playClickSound();
            if (currentSong && playlistStarted) {
                currentSong.stop();
            }
            playlistStarted = false;
            currentPlaylistIndex = i;
            loadPlaylist(p.prefix);
            playPlaylist();
        });
        btn.hide();
        playlistButtons.push(btn);
    });
}

// Playlist controls
function playPlaylist() {
    if (!playlistStarted) {
        playlistStarted = true;
        introSong.stop();
        currentTrackIndex = 0;
        currentSong = tracks[currentTrackIndex];
        currentSong.time(0);
        currentSong.play();
        currentSong.elt.onended = nextTrackAuto;
        pauseState = false;
        pauseImg.attribute("src", "pause.png");
        updateSongName();
    }
}

function togglePause() {
    if (!playlistStarted) return;

    if (!pauseState) {
        currentSong.pause();
        pauseState = true;
        pauseImg.attribute("src", "resume.png");
    } else {
        currentSong.play();
        pauseState = false;
        pauseImg.attribute("src", "pause.png");
    }
}

function nextTrackAuto() {
    currentSong.stop();
    currentTrackIndex = (currentTrackIndex + 1) % totalTracks;
    currentSong = tracks[currentTrackIndex];
    currentSong.time(0);
    currentSong.play();
    currentSong.elt.onended = nextTrackAuto;
    pauseState = false;
    pauseImg.attribute("src", "pause.png");
    updateSongName();
}

function nextTrack() {
    currentSong.stop();
    currentTrackIndex = (currentTrackIndex + 1) % totalTracks;
    currentSong = tracks[currentTrackIndex];
    currentSong.time(0);
    currentSong.play();
    currentSong.elt.onended = nextTrackAuto;
    pauseState = false;
    pauseImg.attribute("src", "pause.png");
    updateSongName();
}

function prevTrack() {
    currentSong.stop();
    currentTrackIndex = (currentTrackIndex - 1 + totalTracks) % totalTracks;
    currentSong = tracks[currentTrackIndex];
    currentSong.time(0);
    currentSong.play();
    currentSong.elt.onended = nextTrackAuto;
    pauseState = false;
    pauseImg.attribute("src", "pause.png");
    updateSongName();
}

function skipAhead() {
    if (!playlistStarted) return;
    currentSong.time(currentSong.time() + 10);
}

function resetSong() {
    if (!playlistStarted) return;
    currentSong.time(0);
    updateSongName();
}

function changeVolume() {
    if (!playlistStarted) return;
    currentSong.volume(volumeSlider.value());
}

function updateSongName() {
    if (songNameText) {
        let name = songNames[currentPlaylistIndex][currentTrackIndex];
        songNameText.html(name);
    }
}

function draw() {
    background(50);

    if (musicStarted) {
        let imgArray = [];
        if (currentPlaylistIndex === 0) imgArray = erevePics;
        if (currentPlaylistIndex === 1) imgArray = henesysPics;
        if (currentPlaylistIndex === 2) imgArray = kerningPics;

        if (imgArray.length > 0) {
            let imgToDraw = imgArray[currentTrackIndex];
            let imgWidth = 800;
            let imgHeight = 450;
            image(imgToDraw, width / 2 - imgWidth / 2, height / 2 - imgHeight / 2, imgWidth, imgHeight);
        }
    } else {
        image(startScreenImg, 0, 0, width, height);
    }
}

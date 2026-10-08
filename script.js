'use strict';
// Edit this library to add artists/tracks. Put local MP3s in songs/ and covers in covers/.
const songs = [
  {title:'Mortals',artist:'Warriyo',file:'songs/1.mp3',cover:'covers/1.jpg'},
  {title:'Cielo',artist:'Huma-Huma',file:'songs/2.mp3',cover:'covers/2.jpg'},
  {title:'Invincible',artist:'DEAF KEV',file:'songs/3.mp3',cover:'covers/3.jpg'},
  {title:'My Heart',artist:'Different Heaven & EH!DE',file:'songs/4.mp3',cover:'covers/4.jpg'},
  {title:'Heroes Tonight',artist:'Janji',file:'songs/5.mp3',cover:'covers/5.jpg'},
  {title:'Rabba',artist:'Salam-e-Ishq',file:'songs/6.mp3',cover:'covers/6.jpg'},
  {title:'Sakhiyaan',artist:'Salam-e-Ishq',file:'songs/7.mp3',cover:'covers/7.jpg'},
  {title:'Bhula Dena',artist:'Salam-e-Ishq',file:'songs/8.mp3',cover:'covers/8.jpg'},
  {title:'Tumhari Kasam',artist:'Salam-e-Ishq',file:'songs/9.mp3',cover:'covers/9.jpg'},
  {title:'Na Jaana',artist:'Salam-e-Ishq',file:'songs/10.mp3',cover:'covers/10.jpg'},
  {title:'Monsoon Letters',artist:'Raga Avenue',file:'songs/11.mp3',cover:'covers/11.jpg'},
  {title:'Midnight in Mumbai',artist:'Neon Sitar',file:'songs/12.mp3',cover:'covers/12.jpg'},
  {title:'Dil Ki Raah',artist:'Saffron Skies',file:'songs/13.mp3',cover:'covers/13.jpg'},
  {title:'The Last Train Home',artist:'City Raag',file:'songs/14.mp3',cover:'covers/14.jpg'},
  {title:'Sitar Sunrise',artist:'Neon Sitar',file:'songs/15.mp3',cover:'covers/15.jpg'},
  {title:'Chaandni Nights',artist:'Saffron Skies',file:'songs/16.mp3',cover:'covers/16.jpg'},
  {title:'Bollywood Boulevard',artist:'Raga Avenue',file:'songs/17.mp3',cover:'covers/17.jpg'},
  {title:'Rain Over Jaipur',artist:'City Raag',file:'songs/18.mp3',cover:'covers/18.jpg'},
  {title:'Mehfil After Dark',artist:'Saffron Skies',file:'songs/19.mp3',cover:'covers/19.jpg'},
  {title:'Rooftops of Delhi',artist:'City Raag',file:'songs/20.mp3',cover:'covers/20.jpg'},
  {title:'Rangon Ka Safar',artist:'Raga Avenue',file:'songs/21.mp3',cover:'covers/21.jpg'},
  {title:'Electric Mehndi',artist:'Neon Sitar',file:'songs/22.mp3',cover:'covers/22.jpg'},
  {title:'Gulabi Dusk',artist:'Saffron Skies',file:'songs/23.mp3',cover:'covers/23.jpg'},
  {title:'Jashn Tonight',artist:'Neon Sitar',file:'songs/24.mp3',cover:'covers/24.jpg'},
  {title:'Ganga Moonlight',artist:'Raga Avenue',file:'songs/25.mp3',cover:'covers/25.jpg'},
  {title:'Old Delhi Memories',artist:'City Raag',file:'songs/26.mp3',cover:'covers/26.jpg'},
  {title:'Amber Romance',artist:'Saffron Skies',file:'songs/27.mp3',cover:'covers/27.jpg'},
  {title:'Neon Rickshaw',artist:'Neon Sitar',file:'songs/28.mp3',cover:'covers/28.jpg'},
  {title:'Saawan Dreams',artist:'Raga Avenue',file:'songs/29.mp3',cover:'covers/29.jpg'},
  {title:'City of Lanterns',artist:'City Raag',file:'songs/30.mp3',cover:'covers/30.jpg'},
  {title:'Peacock Monsoon',artist:'Saffron Skies',file:'songs/31.mp3',cover:'covers/31.jpg'},
  {title:'Moonlit Bazaar',artist:'Neon Sitar',file:'songs/32.mp3',cover:'covers/32.jpg'},
  {title:'Desert Dhol',artist:'City Raag',file:'songs/33.mp3',cover:'covers/33.jpg'},
  {title:'Lotus Highway',artist:'Raga Avenue',file:'songs/34.mp3',cover:'covers/34.jpg'}
].map((s,id)=>({...s,id,duration:null}));
const $ = id => document.getElementById(id);
const audio = new Audio();
audio.preload='metadata'; audio.volume=.8;
let index=0,view='all',artistFilter='',query='',shuffle=false,repeat=false;
const readList = key => {try {const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v.filter(n=>Number.isInteger(n)&&n>=0&&n<songs.length):[];}catch{return [];}};
const favorites=new Set(readList('pulse_favorites'));
let recent=readList('pulse_recent');
let toastTimer;
const formatTime=n=>Number.isFinite(n)&&n>=0?`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`:'--:--';
function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2200);}
function artists(){const map=new Map();for(const s of songs){if(!map.has(s.artist))map.set(s.artist,{name:s.artist,count:0,cover:s.cover});map.get(s.artist).count++;}return [...map.values()];}
function visibleSongs(){let result=view==='favorites'?songs.filter(s=>favorites.has(s.id)):view==='recent'?recent.map(id=>songs[id]).filter(Boolean):artistFilter?songs.filter(s=>s.artist===artistFilter):songs.slice();if(query)result=result.filter(s=>`${s.title} ${s.artist}`.toLowerCase().includes(query));return result;}
function setView(next){view=next;artistFilter='';document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===next));$('artistsSection').classList.toggle('hidden',next==='favorites'||next==='recent');render();}
function renderArtists(){let items=artists().filter(a=>!query||a.name.toLowerCase().includes(query)||songs.some(s=>s.artist===a.name&&s.title.toLowerCase().includes(query)));if(view!=='artists'&&!artistFilter)items=items.slice(0,5);$('artistGrid').replaceChildren();for(const a of items){const btn=document.createElement('button');btn.className='artist-card'+(artistFilter===a.name?' selected':'');btn.innerHTML='<img alt=""><span class="artist-name"></span><span class="artist-count"></span>';btn.querySelector('img').src=a.cover;btn.querySelector('img').alt=`${a.name} artwork`;btn.querySelector('.artist-name').textContent=a.name;btn.querySelector('.artist-count').textContent=`${a.count} ${a.count===1?'song':'songs'}`;btn.addEventListener('click',()=>{view='artists';artistFilter=a.name;document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view==='artists'));render();$('tracksTitle').scrollIntoView({behavior:'smooth',block:'start'});});$('artistGrid').append(btn);}}
function renderTracks(){const tracks=visibleSongs();$('trackKicker').textContent=view==='favorites'?'YOUR PICKS':view==='recent'?'ON REPEAT':artistFilter?'ARTIST SPOTLIGHT':'MADE FOR YOU';$('tracksTitle').textContent=view==='favorites'?'Liked songs':view==='recent'?'Recently played':artistFilter?artistFilter:view==='artists'?'All artists · tracks':'Your tracks';$('songCount').textContent=`${tracks.length} ${tracks.length===1?'track':'tracks'}`;$('likedCount').textContent=favorites.size;$('trackList').replaceChildren();$('emptyState').classList.toggle('hidden',tracks.length>0);tracks.forEach((s,i)=>{const row=document.createElement('div');row.className='track-row'+(index===s.id?' playing':'');row.innerHTML='<span class="track-number"></span><div class="track-ident"><img alt=""><div style="min-width:0"><span class="track-title"></span><span class="track-sub"></span></div></div><span class="track-artist"></span><span class="track-time"></span><button class="heart" title="Like song" aria-label="Like song"></button>';row.querySelector('.track-number').textContent=index===s.id&&!audio.paused?'♫':i+1;row.querySelector('img').src=s.cover;row.querySelector('img').alt='';row.querySelector('.track-title').textContent=s.title;row.querySelector('.track-sub').textContent=s.artist;row.querySelector('.track-artist').textContent=s.artist;row.querySelector('.track-time').textContent=formatTime(s.duration);const heart=row.querySelector('.heart');heart.textContent=favorites.has(s.id)?'♥':'♡';heart.classList.toggle('liked',favorites.has(s.id));heart.setAttribute('aria-label',`${favorites.has(s.id)?'Unlike':'Like'} ${s.title}`);heart.addEventListener('click',e=>{e.stopPropagation();toggleFavorite(s.id);});row.addEventListener('click',()=>{if(index===s.id){togglePlayback();}else{playSong(s.id);}});$('trackList').append(row);});}
function render(){renderArtists();renderTracks();updatePlayer();}
function updatePlayer(){$('playerTitle').textContent=songs[index].title;$('playerArtist').textContent=songs[index].artist;$('playerCover').src=songs[index].cover;const playing=!audio.paused;$('masterPlay').textContent=playing?'❚❚':'▶';$('masterPlay').setAttribute('aria-label',playing?'Pause':'Play');$('favoriteCurrent').textContent=favorites.has(index)?'♥':'♡';$('favoriteCurrent').classList.toggle('liked',favorites.has(index));$('shuffleBtn').classList.toggle('enabled',shuffle);$('repeatBtn').classList.toggle('enabled',repeat);}
function updateProgress(){$('currentTime').textContent=formatTime(audio.currentTime);$('totalDuration').textContent=formatTime(audio.duration);$('myProgressBar').value=Number.isFinite(audio.duration)&&audio.duration>0?(audio.currentTime/audio.duration)*100:0;}
function saveRecent(){recent=[index,...recent.filter(n=>n!==index)].slice(0,30);try{localStorage.setItem('pulse_recent',JSON.stringify(recent));}catch{}}
async function beginPlayback(){try{await audio.play();}catch(e){if(e.name!=='AbortError'){console.warn('Playback unavailable:',e);notify('Unable to play this audio file');}}}
function playSong(id){if(!songs[id])return;index=id;audio.src=songs[id].file;audio.load();$('currentTime').textContent='0:00';$('totalDuration').textContent=formatTime(songs[id].duration);$('myProgressBar').value=0;saveRecent();renderTracks();updatePlayer();beginPlayback();}
function togglePlayback(){if(audio.paused){if(!audio.src){playSong(index);}else{beginPlayback();}}else{audio.pause();}}
function nextIndex(direction=1){const queue=visibleSongs();const ids=(queue.length?queue:songs).map(s=>s.id);if(shuffle&&ids.length>1){const choices=ids.filter(n=>n!==index);return choices[Math.floor(Math.random()*choices.length)];}const pos=ids.indexOf(index);return ids[(pos<0?(direction===1?0:ids.length-1):(pos+direction+ids.length)%ids.length)];}
function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);try{localStorage.setItem('pulse_favorites',JSON.stringify([...favorites]));}catch{}renderTracks();updatePlayer();}
// Metadata loaders read duration of local audio without starting playback.
const probes=[];songs.forEach(s=>{const probe=new Audio();probe.preload='metadata';probe.addEventListener('loadedmetadata',()=>{if(Number.isFinite(probe.duration)){s.duration=probe.duration;renderTracks();if(index===s.id&&audio.readyState<1)$('totalDuration').textContent=formatTime(s.duration);}});probe.src=s.file;probes.push(probe);});
$('search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render();});
document.querySelectorAll('.nav-button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$('viewAllArtists').addEventListener('click',()=>setView('artists'));
$('heroPlay').addEventListener('click',()=>playSong(visibleSongs()[0]?.id??0));
$('shuffleAll').addEventListener('click',()=>{const list=visibleSongs();if(list.length)playSong(list[Math.floor(Math.random()*list.length)].id);else notify('No tracks to shuffle');});
$('masterPlay').addEventListener('click',togglePlayback);
$('previous').addEventListener('click',()=>{if(audio.currentTime>3){audio.currentTime=0;}else playSong(nextIndex(-1));});
$('next').addEventListener('click',()=>playSong(nextIndex(1)));
$('shuffleBtn').addEventListener('click',()=>{shuffle=!shuffle;updatePlayer();notify(shuffle?'Shuffle on':'Shuffle off');});
$('repeatBtn').addEventListener('click',()=>{repeat=!repeat;updatePlayer();notify(repeat?'Repeat one on':'Repeat off');});
$('favoriteCurrent').addEventListener('click',()=>toggleFavorite(index));
$('myProgressBar').addEventListener('input',e=>{if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Number(e.target.value)/100*audio.duration;updateProgress();}});
$('volume').addEventListener('input',e=>audio.volume=Number(e.target.value)/100);
audio.addEventListener('play',()=>{updatePlayer();renderTracks();});audio.addEventListener('pause',()=>{updatePlayer();renderTracks();});
audio.addEventListener('timeupdate',updateProgress);audio.addEventListener('loadedmetadata',()=>{songs[index].duration=audio.duration;updateProgress();renderTracks();});audio.addEventListener('durationchange',updateProgress);audio.addEventListener('ended',()=>{if(repeat){audio.currentTime=0;beginPlayback();}else playSong(nextIndex(1));});audio.addEventListener('error',()=>{notify('Song file not found or unsupported');});
document.addEventListener('keydown',e=>{const t=e.target;if(t.matches('input,textarea,[contenteditable]'))return;if(e.key==='/'){e.preventDefault();$('search').focus();}else if(e.code==='Space'&&!e.repeat){e.preventDefault();togglePlayback();}else if(e.code==='ArrowRight'&&Number.isFinite(audio.duration)){audio.currentTime=Math.min(audio.duration,audio.currentTime+5);}else if(e.code==='ArrowLeft'){audio.currentTime=Math.max(0,audio.currentTime-5);}});
render();updateProgress();

# NetFlicks-project-backend
The backend server for the [netFlicks project](https://github.com/prince-musonda/netflicks).

The neflicks project is sort of like a **neflix clone**, but because we don't have legal access to movies, we are basically just using youtube movie trailers as movies
with the ability to stream and download those trailers

## main functionalite
- The server can be used to get youtube url streams of youtube videos on this path [http://localhost:3003/watch/:video_id]
- It can also be used to download youtube videos on this path [http://localhost:3003/download/:video_id]

**please note----- replace :video_id with a real id** e.g if you had this link https://www.youtube.com/watch?v=8l0GVXpN2q4 then the id would be what 
comes next after the **v=** which is **8l0GVXpN2q4**.

Therefore, if you wanted to dowload the video in the example link above, then the correct url would be [http://localhost:3003/download/8l0GVXpN2q4]

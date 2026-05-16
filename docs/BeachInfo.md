# Beach Info

## Live Streams

### Playing streams in VLC

The stream URL goes in quotes after the `vlc` command. The `http-referrer` is the webcam page the stream belongs to.

**Znjane Beach (Split)**
```sh
vlc "https://cdn-006.whatsupcams.com/hls/hr_buildznjan01.m3u8" \
  :http-referrer="https://www.whatsupcams.com/hr/webcams/hrvatska/splitsko-dalmatinska/split-hr/split-obnova-znjanskog-platoa/" \
  :http-user-agent="Mozilla/5.0"
```

**Bačvice Beach (Split)**
```sh
vlc "https://cdn-004.whatsupcams.com/hls/hr_splitbacvice01.m3u8" \
  :http-referrer="https://www.whatsupcams.com/hr/webcams/hrvatska/splitsko-dalmatinska/split-hr/split-plaza-bacvice/" \
  :http-user-agent="Mozilla/5.0"
```

**Split Airport (Divulje/Trogir)**
```sh
vlc "https://cdn-004.whatsupcams.com/hls/hr_split04.m3u8" \
  :http-referrer="https://www.whatsupcams.com/hr/webcams/hrvatska/splitsko-dalmatinska/split-hr/european-coastal-airlines-split-divulje-zracna-luka-trogir/" \
  :http-user-agent="Mozilla/5.0"
```

Direct stream URL: `https://cdn-004.whatsupcams.com/hls/hr_split04.m3u8`

## Idea

Every 30 minutes, capture a frame from a live beach stream in Split and pass it through a VLM (e.g. ChatGPT or a local model like Gemma 4) to extract:
- Current weather conditions
- Estimated number of people on the beach
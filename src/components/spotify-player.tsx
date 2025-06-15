
"use client";

import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Music2, Loader2, Play, Pause } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Interfaces for Spotify Web API response (for Top Tracks)
interface SpotifyArtistWebAPI {
  name: string;
}

interface SpotifyTrackWebAPI {
  name: string;
  artists: SpotifyArtistWebAPI[];
  external_urls: {
    spotify: string;
  };
}

interface TopTracksResponse {
  items: SpotifyTrackWebAPI[];
}

const SpotifyPlayer: FC = () => {
  const initialArtistId = "0SKtNTddZSa7jYW84C6CSL"; // Default artist for embed

  // State and refs for Spotify Iframe Embed API
  const embedRef = useRef<HTMLDivElement | null>(null);
  const spotifyEmbedControllerRef = useRef<any>(null); // SpotifyEmbedController type is not explicitly exported
  const [iFrameAPI, setIFrameAPI] = useState<any>(undefined); // SpotifyIframeApi type
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [uri, setUri] = useState(`spotify:artist:${initialArtistId}`);

  // State for Top Tracks (Web API)
  const [topTracks, setTopTracks] = useState<SpotifyTrackWebAPI[] | null>(null);
  const [isLoadingTopTracks, setIsLoadingTopTracks] = useState<boolean>(false);
  const [errorTopTracks, setErrorTopTracks] = useState<string | null>(null);

  const spotifyApiToken = process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN;

  // Effect for loading Spotify Iframe API script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Effect for initializing Iframe API
  useEffect(() => {
    if (iFrameAPI) {
      return;
    }
    // Type casting window to any to access onSpotifyIframeApiReady
    (window as any).onSpotifyIframeApiReady = (SpotifyIframeApi: any) => {
      setIFrameAPI(SpotifyIframeApi);
    };
  }, [iFrameAPI]);

  // Effect for creating and managing the embed controller
  useEffect(() => {
    if (!iFrameAPI || !embedRef.current) {
      return;
    }

    // If a player was already loaded and URI changed, we want to load the new URI.
    // The createController might handle this, or we might need explicit loadUri.
    // For now, let's assume createController re-initializes if called again, or just ensure it's called once.
    // To prevent re-creating multiple controllers, we only create if one isn't already there or URI changes significantly.

    // Clear previous player if exists to avoid multiple players
    if (embedRef.current) {
        embedRef.current.innerHTML = '';
    }
    setPlayerLoaded(false);


    iFrameAPI.createController(
      embedRef.current,
      {
        width: "100%",
        height: "352", // Default height
        uri: uri,
      },
      (spotifyEmbedController: any) => {
        spotifyEmbedControllerRef.current = spotifyEmbedController;
        spotifyEmbedController.addListener("ready", () => {
          setPlayerLoaded(true);
        });

        // Example: Listen to playback updates
        // const handlePlaybackUpdate = (e: any) => {
        //   console.log("Playback State update:", e.data);
        // };
        // spotifyEmbedController.addListener("playback_update", handlePlaybackUpdate);

        // return () => {
        //   spotifyEmbedController.removeListener("playback_update", handlePlaybackUpdate);
        //   // spotifyEmbedController.destroy(); // If a destroy method exists
        // };
      }
    );
  }, [iFrameAPI, uri]); // Re-run if API is ready or URI changes

  const onPauseClick = () => {
    if (spotifyEmbedControllerRef.current) {
      spotifyEmbedControllerRef.current.pause();
    }
  };

  const onPlayClick = () => {
    if (spotifyEmbedControllerRef.current) {
      spotifyEmbedControllerRef.current.play();
    }
  };

  const onUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUri = event.target.value;
    setUri(newUri);
    // No need to call loadUri here if the useEffect for 'uri' handles re-creation or loading.
    // If createController doesn't reload on URI change, then:
    // if (spotifyEmbedControllerRef.current && playerLoaded) {
    //   spotifyEmbedControllerRef.current.loadUri(newUri);
    // }
  };


  // Logic for fetching Top Tracks (Spotify Web API)
  async function fetchWebApi(endpoint: string, method: string, body?: any): Promise<any> {
    if (!spotifyApiToken) {
      throw new Error("Spotify API token is not configured. Please set NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN.");
    }
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${spotifyApiToken}`,
        'Content-Type': 'application/json',
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Spotify API Error: ${res.status} ${res.statusText} - ${errorData?.error?.message || 'Unknown error'}`);
    }
    return await res.json();
  }

  async function getMyTopTracks(): Promise<SpotifyTrackWebAPI[]> {
    const response = (await fetchWebApi(
      'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
    )) as TopTracksResponse;
    return response.items;
  }

  useEffect(() => {
    if (!spotifyApiToken) {
      setErrorTopTracks("Spotify API token is not available. Top Tracks feature disabled.");
      return;
    }

    const fetchTopTracks = async () => {
      setIsLoadingTopTracks(true);
      setErrorTopTracks(null);
      try {
        const tracks = await getMyTopTracks();
        setTopTracks(tracks);
      } catch (err: any) {
        console.error("Failed to fetch top tracks:", err);
        setErrorTopTracks(err.message || "Failed to fetch your top tracks from Spotify.");
      } finally {
        setIsLoadingTopTracks(false);
      }
    };

    fetchTopTracks();
  }, [spotifyApiToken]);

  return (
    <SectionCard title="Spotify Music" icon={<Music2 className="text-primary h-8 w-8" />} >
      {/* Interactive Spotify Player Section */}
      <div className="mb-8">
        <h3 className="font-headline text-xl mb-3 text-card-foreground">Interactive Player</h3>
        <div ref={embedRef} className="overflow-hidden rounded-lg shadow-inner min-h-[352px] bg-muted/20 flex items-center justify-center">
          {!playerLoaded && iFrameAPI && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!iFrameAPI && <p className="text-muted-foreground">Initializing Spotify Player...</p>}
        </div>
        
        {playerLoaded && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Button aria-label="Play" onClick={onPlayClick} variant="outline" size="icon">
                <Play className="h-5 w-5" />
              </Button>
              <Button aria-label="Pause" onClick={onPauseClick} variant="outline" size="icon">
                <Pause className="h-5 w-5" />
              </Button>
            </div>
            <div>
              <Label htmlFor="spotify-uri" className="text-sm font-medium text-muted-foreground">Change Spotify URI (e.g., spotify:track:TRACK_ID):</Label>
              <Input
                id="spotify-uri"
                type="text"
                value={uri}
                onChange={onUriChange}
                placeholder="Enter Spotify URI"
                className="mt-1"
              />
            </div>
          </div>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          Use the controls above to play, pause, or load a new Spotify track, album, or playlist.
        </p>
      </div>

      {/* User's Top Tracks Section */}
      <div>
        <h3 className="font-headline text-xl mt-6 mb-3 text-card-foreground">Your Top 5 Spotify Tracks</h3>
        
        {!process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN && (
           <Alert variant="destructive">
            <AlertTitle>Configuration Missing</AlertTitle>
            <AlertDescription>
              A temporary Spotify API token is not configured in <code>.env</code> (<code>NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN</code>). This feature is currently disabled.
            </AlertDescription>
          </Alert>
        )}

        {process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN && (
          <Alert variant="default" className="mb-4 bg-primary/10 border-primary/30 text-primary-foreground">
            <AlertTitle className="text-primary">Developer Note: Authorization</AlertTitle>
            <AlertDescription className="text-primary/90">
              This section uses a temporary access token for fetching top tracks. For a production app, you must implement a full OAuth 2.0 flow to securely obtain and refresh user-specific Spotify access tokens. The current token may expire.
            </AlertDescription>
          </Alert>
        )}

        {isLoadingTopTracks && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Loading your top tracks...</span>
          </div>
        )}
        {errorTopTracks && !isLoadingTopTracks && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorTopTracks}</AlertDescription>
          </Alert>
        )}
        {topTracks && topTracks.length > 0 && (
          <ul className="space-y-2 list-decimal list-inside text-card-foreground/90">
            {topTracks.map((track, index) => (
              <li key={index} className="text-sm">
                <a 
                  href={track.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary hover:underline"
                >
                  <strong>{track.name}</strong> by {track.artists.map(artist => artist.name).join(', ')}
                </a>
              </li>
            ))}
          </ul>
        )}
        {topTracks && topTracks.length === 0 && !isLoadingTopTracks && !errorTopTracks && (
          <p className="text-sm text-muted-foreground">Could not retrieve your top tracks, or you don't have any.</p>
        )}
      </div>
    </SectionCard>
  );
};

export default SpotifyPlayer;

    
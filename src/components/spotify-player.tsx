
"use client";

import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Music2, Loader2, Play, Pause, ExternalLink, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Interfaces for Spotify Web API response (for Top Tracks)
interface SpotifyArtistWebAPI {
  name: string;
}

interface SpotifyTrackWebAPI {
  id: string;
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
  const initialArtistUri = "spotify:artist:0SKtNTddZSa7jYW84C6CSL";

  const embedRef = useRef<HTMLDivElement | null>(null);
  const spotifyEmbedControllerRef = useRef<any>(null);
  const [iFrameAPI, setIFrameAPI] = useState<any>(undefined);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [uri, setUri] = useState(initialArtistUri); // Initialize with artist URI

  const [topTracks, setTopTracks] = useState<SpotifyTrackWebAPI[] | null>(null);
  const [isLoadingTopTracks, setIsLoadingTopTracks] = useState<boolean>(false);
  const [errorTopTracks, setErrorTopTracks] = useState<string | null>(null);

  const spotifyApiToken = process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN;

  useEffect(() => {
    const scriptId = "spotify-iframe-api-script";
    let localOnSpotifyIframeApiReady: ((api: any) => void) | null = null;

    if (typeof window !== 'undefined') {
      // Define the callback function that Spotify's API will call
      localOnSpotifyIframeApiReady = (SpotifyIframeApi: any) => {
        setIFrameAPI(SpotifyIframeApi);
      };
      // Assign it to the window object
      (window as any).onSpotifyIframeApiReady = localOnSpotifyIframeApiReady;
    }

    // Check if the script already exists to avoid duplicates
    if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);

      // Cleanup script on component unmount
      return () => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript && document.body.contains(existingScript)) {
          document.body.removeChild(existingScript);
        }
        // Clean up the global callback if it's the one we set
        if (typeof window !== 'undefined' && (window as any).onSpotifyIframeApiReady === localOnSpotifyIframeApiReady) {
          (window as any).onSpotifyIframeApiReady = null;
        }
      };
    } else if (typeof window !== 'undefined' && (window as any).SpotifyIframeApi && !iFrameAPI) {
      // If script exists and API is on window but not in state, set it (e.g., HMR)
      setIFrameAPI((window as any).SpotifyIframeApi);
    }
    
    // General cleanup for the window callback if the component unmounts before the script loads
    return () => {
       if (typeof window !== 'undefined' && (window as any).onSpotifyIframeApiReady === localOnSpotifyIframeApiReady) {
          (window as any).onSpotifyIframeApiReady = null;
       }
    };
  }, [iFrameAPI]); // Depend on iFrameAPI to ensure this effect correctly manages its lifecycle

  useEffect(() => {
    // Ensure iFrameAPI is loaded, embedRef is available, and controller hasn't been created
    if (iFrameAPI && embedRef.current && !spotifyEmbedControllerRef.current) {
      const options = {
        width: "100%",
        height: "352", // Default height for Spotify embeds
        uri: uri, // Initial URI to load
      };
      iFrameAPI.createController(
        embedRef.current,
        options,
        (controller: any) => {
          spotifyEmbedControllerRef.current = controller;
          
          const onPlayerReadyCallback = () => {
            setPlayerLoaded(true);
            // console.log("Spotify Player is Ready");
          };
          controller.addListener("ready", onPlayerReadyCallback);
          
          // Store the callback for cleanup
          // It's good practice to type a custom property on the controller if possible,
          // or manage this association externally if not.
          (controller as any).__onPlayerReadyCallback = onPlayerReadyCallback;
        }
      );
    }

    // Cleanup for the player controller's "ready" listener
    return () => {
      const controller = spotifyEmbedControllerRef.current;
      if (controller && (controller as any).__onPlayerReadyCallback) {
        controller.removeListener("ready", (controller as any).__onPlayerReadyCallback);
        // console.log("Spotify Player 'ready' listener removed");
        // It's important to remove the custom property to avoid memory leaks if the controller object persists
        delete (controller as any).__onPlayerReadyCallback; 
      }
      // Note: The Spotify Iframe API does not provide a controller.destroy() method.
      // Removing the iframe or letting React unmount embedRef is the typical cleanup.
    };
  }, [iFrameAPI, uri]); // Re-run if iFrameAPI becomes available or initial URI changes (though URI changes are handled by loadUri)


  const onPauseClick = () => {
    if (spotifyEmbedControllerRef.current && playerLoaded) {
      spotifyEmbedControllerRef.current.pause();
    }
  };

  const onPlayClick = () => {
    if (spotifyEmbedControllerRef.current && playerLoaded) {
      spotifyEmbedControllerRef.current.play();
    }
  };

  const onUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUri = event.target.value;
    setUri(newUri); // Update state for the input field
    if (spotifyEmbedControllerRef.current && playerLoaded) {
      spotifyEmbedControllerRef.current.loadUri(newUri); // Load new content into existing player
    }
  };

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
      const errorData = await res.json().catch(() => ({ error: { message: 'Failed to parse error response' } }));
      throw new Error(`Spotify API Error: ${res.status} ${res.statusText} - ${errorData?.error?.message || 'Unknown error'}`);
    }
    return await res.json();
  }

  async function getMyTopTracks(): Promise<SpotifyTrackWebAPI[]> {
    const response = (await fetchWebApi(
      'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
    )) as TopTracksResponse;
    return response.items || [];
  }

  useEffect(() => {
    if (!spotifyApiToken) {
      setErrorTopTracks("Spotify API token (NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN) is not available. Top Tracks feature disabled.");
      return;
    }

    const fetchTracks = async () => {
      setIsLoadingTopTracks(true);
      setErrorTopTracks(null);
      try {
        const tracks = await getMyTopTracks();
        setTopTracks(tracks);
      } catch (err: any) {
        console.error("Failed to fetch top tracks:", err);
        if (err.message && typeof err.message === 'string' && err.message.includes("401") && err.message.toLowerCase().includes("expired")) {
          setErrorTopTracks("The Spotify API token has expired. To see your top tracks, please provide a new valid token in the .env file (NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN) or implement a full OAuth 2.0 flow for a production application.");
        } else {
          setErrorTopTracks(err.message || "Failed to fetch your top tracks from Spotify.");
        }
      } finally {
        setIsLoadingTopTracks(false);
      }
    };

    fetchTracks();
  }, [spotifyApiToken]);

  return (
    <SectionCard title="Spotify Music" icon={<Music2 className="text-primary h-8 w-8" />} >
      <div className="mb-8">
        <h3 className="font-headline text-xl mb-3 text-card-foreground">Interactive Player</h3>
        <div ref={embedRef} className="overflow-hidden rounded-lg shadow-inner min-h-[352px] bg-muted/20 flex items-center justify-center">
          {!playerLoaded && iFrameAPI && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!iFrameAPI && !playerLoaded && <p className="text-muted-foreground">Initializing Spotify Player...</p>}
        </div>
        
        {playerLoaded && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Button aria-label="Play" onClick={onPlayClick} variant="outline" size="icon" title="Play">
                <Play className="h-5 w-5" />
              </Button>
              <Button aria-label="Pause" onClick={onPauseClick} variant="outline" size="icon" title="Pause">
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
          Use the controls above to play, pause, or load a new Spotify track, album, artist, or playlist.
          Initial content is artist: <code>{initialArtistUri}</code>.
        </p>
      </div>

      <div>
        <h3 className="font-headline text-xl mt-6 mb-3 text-card-foreground">Your Top 5 Spotify Tracks</h3>
        
        {!process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN && (
           <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Missing</AlertTitle>
            <AlertDescription>
              A temporary Spotify API token is not configured in <code>.env</code> (<code>NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN</code>). The "Your Top Tracks" feature is currently disabled.
            </AlertDescription>
          </Alert>
        )}

        {process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN && (
          <Alert variant="default" className="mb-4 bg-primary/10 border-primary/30 text-primary-foreground">
             <Music2 className="h-4 w-4 !text-primary" />
            <AlertTitle className="text-primary">Developer Note: Spotify Authorization</AlertTitle>
            <AlertDescription className="text-primary/90">
              The &quot;Your Top Tracks&quot; section uses a temporary access token (<code>NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN</code>) for demonstration. For a production app, you must implement a full OAuth 2.0 flow to securely obtain user-specific Spotify access tokens. The current token might be expired or lack necessary permissions (<code>user-top-read</code>).
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
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Top Tracks</AlertTitle>
            <AlertDescription>{errorTopTracks}</AlertDescription>
          </Alert>
        )}
        {topTracks && topTracks.length > 0 && (
          <ul className="space-y-2">
            {topTracks.map((track) => (
              <li key={track.id} className="text-sm flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <div>
                  <strong className="text-card-foreground">{track.name}</strong>
                  <span className="text-xs text-muted-foreground ml-2">
                     by {track.artists.map(artist => artist.name).join(', ')}
                  </span>
                </div>
                <a 
                  href={track.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline p-1"
                  title={`Listen to ${track.name} on Spotify`}
                >
                  <ExternalLink size={16} />
                </a>
              </li>
            ))}
          </ul>
        )}
        {topTracks && topTracks.length === 0 && !isLoadingTopTracks && !errorTopTracks && spotifyApiToken && (
          <p className="text-sm text-muted-foreground">Could not retrieve your top tracks, or you haven&apos;t listened to enough music on Spotify for this data to be available.</p>
        )}
      </div>
    </SectionCard>
  );
};

export default SpotifyPlayer;

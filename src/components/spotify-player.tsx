
"use client";

import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Music2, Loader2, Play, Pause, ExternalLink, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
// Input and Label are no longer needed for URI change
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

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
  // URI state and setter are removed as the URI is now fixed to initialArtistUri
  // const [uri, setUri] = useState(initialArtistUri); 

  const [topTracks, setTopTracks] = useState<SpotifyTrackWebAPI[] | null>(null);
  const [isLoadingTopTracks, setIsLoadingTopTracks] = useState<boolean>(false);
  const [errorTopTracks, setErrorTopTracks] = useState<string | null>(null);

  const spotifyApiToken = process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN;

  useEffect(() => {
    const scriptId = "spotify-iframe-api-script";
    let localOnSpotifyIframeApiReady: ((api: any) => void) | null = null;

    if (typeof window !== 'undefined') {
      localOnSpotifyIframeApiReady = (SpotifyIframeApi: any) => {
        setIFrameAPI(SpotifyIframeApi);
      };
      (window as any).onSpotifyIframeApiReady = localOnSpotifyIframeApiReady;
    }

    if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript && document.body.contains(existingScript)) {
          document.body.removeChild(existingScript);
        }
        if (typeof window !== 'undefined' && (window as any).onSpotifyIframeApiReady === localOnSpotifyIframeApiReady) {
          (window as any).onSpotifyIframeApiReady = null;
        }
      };
    } else if (typeof window !== 'undefined' && (window as any).SpotifyIframeApi && !iFrameAPI) {
      setIFrameAPI((window as any).SpotifyIframeApi);
    }
    
    return () => {
       if (typeof window !== 'undefined' && (window as any).onSpotifyIframeApiReady === localOnSpotifyIframeApiReady) {
          (window as any).onSpotifyIframeApiReady = null;
       }
    };
  }, [iFrameAPI]); 

  useEffect(() => {
    if (iFrameAPI && embedRef.current && !spotifyEmbedControllerRef.current) {
      const options = {
        width: "100%",
        height: "352",
        uri: initialArtistUri, // Use initialArtistUri directly
      };
      iFrameAPI.createController(
        embedRef.current,
        options,
        (controller: any) => {
          spotifyEmbedControllerRef.current = controller;
          
          const onPlayerReadyCallback = () => {
            setPlayerLoaded(true);
          };
          controller.addListener("ready", onPlayerReadyCallback);
          
          (controller as any).__onPlayerReadyCallback = onPlayerReadyCallback;
        }
      );
    }

    return () => {
      const controller = spotifyEmbedControllerRef.current;
      if (controller && (controller as any).__onPlayerReadyCallback) {
        controller.removeListener("ready", (controller as any).__onPlayerReadyCallback);
        delete (controller as any).__onPlayerReadyCallback; 
      }
    };
  }, [iFrameAPI, initialArtistUri]); // Depend on initialArtistUri (though it's constant, it's good practice)


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

  // onUriChange function is removed

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
        if (err.message && typeof err.message === 'string' && err.message.includes("401") && (err.message.toLowerCase().includes("expired") || err.message.toLowerCase().includes("invalid access token"))) {
          setErrorTopTracks("The Spotify API token has expired or is invalid. To see your top tracks, please provide a new valid token in the .env file (NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN) or implement a full OAuth 2.0 flow for a production application.");
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
            {/* URI Input and Label removed */}
          </div>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          Use the controls above to play or pause the music. The player is initialized with content from artist: <code>{initialArtistUri}</code>.
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

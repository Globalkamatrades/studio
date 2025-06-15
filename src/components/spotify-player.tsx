
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Music2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Interfaces for Spotify API response
interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

interface TopTracksResponse {
  items: SpotifyTrack[];
}

const SpotifyPlayer: FC = () => {
  const artistId = "0SKtNTddZSa7jYW84C6CSL"; // Default artist for embed

  const [topTracks, setTopTracks] = useState<SpotifyTrack[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // WARNING: This is a temporary, hardcoded token for demonstration.
  // In a real application, implement a proper OAuth 2.0 flow.
  const spotifyApiToken = process.env.NEXT_PUBLIC_SPOTIFY_TEMP_TOKEN;

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

  async function getMyTopTracks(): Promise<SpotifyTrack[]> {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    const response = (await fetchWebApi(
      'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
    )) as TopTracksResponse;
    return response.items;
  }

  useEffect(() => {
    if (!spotifyApiToken) {
      setError("Spotify API token is not available. Feature disabled.");
      return;
    }

    const fetchTopTracks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const tracks = await getMyTopTracks();
        setTopTracks(tracks);
      } catch (err: any) {
        console.error("Failed to fetch top tracks:", err);
        setError(err.message || "Failed to fetch your top tracks from Spotify.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTracks();
  }, [spotifyApiToken]); // Re-run if token changes, though it's from env here

  return (
    <SectionCard title="Spotify Music" icon={<Music2 className="text-primary h-8 w-8" />}>
      {/* Existing Artist Embed */}
      <div className="mb-8">
        <h3 className="font-headline text-xl mb-3 text-card-foreground">Featured Artist</h3>
        <div className="overflow-hidden rounded-lg shadow-inner">
          <iframe
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator`}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-none"
          ></iframe>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Explore the featured artist's top tracks and albums on Spotify.
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
              This section uses a temporary access token. For a production app, you must implement a full OAuth 2.0 flow to securely obtain and refresh user-specific Spotify access tokens. The current token may expire.
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Loading your top tracks...</span>
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
        {topTracks && topTracks.length === 0 && !isLoading && !error && (
          <p className="text-sm text-muted-foreground">Could not retrieve your top tracks, or you don't have any.</p>
        )}
      </div>
    </SectionCard>
  );
};

export default SpotifyPlayer;

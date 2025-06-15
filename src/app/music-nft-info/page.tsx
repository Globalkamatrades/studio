
import type { Metadata, NextPage } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ecoho Gold – Music NFT Info',
  description: 'Detailed information about the Ecoho Music NFT.',
};

const MusicNftInfoPage: NextPage = () => {
  const cssStyles = `
    body.music-nft-info-page {
      background-color: #000; /* Applied to a wrapper div instead of body */
      color: #fff;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .nft-container {
      background: linear-gradient(145deg, #333, #111);
      border-radius: 20px;
      box-shadow: 0 0 20px gold;
      padding: 30px;
      display: inline-block;
      margin-top: 20px; /* Added to give some space if header was present */
    }
    .nft-container img {
      width: 300px;
      height: 300px;
      object-fit: cover;
      border-radius: 10px;
      transition: transform 0.3s;
    }
    .nft-container img:hover {
      transform: scale(1.05);
    }
    .nft-title {
      font-size: 24px;
      margin-top: 20px;
      color: gold;
    }
    .nft-desc {
      font-size: 16px;
      margin-top: 10px;
      color: #ccc;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div className="music-nft-info-page"> {/* Wrapper to apply body-like styles */}
        <div className="nft-container">
          <Image 
            src="https://placehold.co/300x300.png" 
            alt="Ecoho Music NFT" 
            width={300} 
            height={300}
            data-ai-hint="music nft abstract"
          />
          <div className="nft-title">Ecoho Music NFT</div>
          <div className="nft-desc">Own exclusive tracks, support artists, and earn from your sound.</div>
        </div>
      </div>
    </>
  );
};

export default MusicNftInfoPage;

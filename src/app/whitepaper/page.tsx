
import type { Metadata, NextPage } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ecoho Gold Whitepaper',
  description: 'Official whitepaper for Ecoho Gold (ECOHO), detailing its vision, tokenomics, and roadmap.',
};

const WhitepaperPage: NextPage = () => {
  const whitepaperStyles = `
    body.whitepaper-page-container { /* Apply to a wrapper div to avoid global body styling conflicts */
      font-family: Arial, sans-serif;
      background-color: #0c0c0c;
      color: #fff;
      line-height: 1.6;
      padding: 20px; /* Adjusted padding for better viewing within app */
      max-width: 900px;
      margin: auto;
    }
    .whitepaper-page-container h1,
    .whitepaper-page-container h2,
    .whitepaper-page-container h3 {
      color: gold;
    }
    .whitepaper-page-container a:not(.app-link) { /* Avoid styling app links */
      color: #00ffe7;
    }
    .whitepaper-page-container .section {
      margin-bottom: 40px;
    }
    .whitepaper-page-container hr {
      border: 1px solid gold;
      margin: 40px 0;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: whitepaperStyles }} />
      <div className="whitepaper-page-container min-h-screen"> {/* Wrapper div */}
        {/* Add a link back to homepage for better navigation */}
        <div className="mb-4 py-4">
            <Link href="/" className="app-link text-primary hover:underline p-2 bg-background rounded">
                &larr; Back to Ecoho Gold Home
            </Link>
        </div>
        <h1>Ecoho Gold (ECOHO) Whitepaper</h1>
        <p><strong>Version:</strong> 1.0<br />
           <strong>Date:</strong> June 2025</p>

        <hr />

        <div className="section">
          <h2>1. Introduction</h2>
          <p>Ecoho Gold is a decentralized, community-powered cryptocurrency built on Binance Smart Chain (BEP-20). It is designed to empower creators, investors, and eco-conscious communities through tokenized real-world value, music NFTs, and Web3 finance tools.</p>
        </div>

        <div className="section">
          <h2>2. Vision & Mission</h2>
          <p>Our mission is to create a transparent and powerful digital economy where users can earn, trade, and participate in real-world utility ecosystems backed by music, digital art, and environmental projects.</p>
        </div>

        <div className="section">
          <h2>3. Key Features</h2>
          <ul>
            <li><strong>💰 Ecoho Gold Token (ECOHO):</strong> BEP-20 utility token with real use in staking, governance, and rewards.</li>
            <li><strong>🎵 Music NFTs:</strong> Own and trade music-backed NFTs that pay royalties to artists and holders.</li>
            <li><strong>🌱 Green Projects:</strong> Support environmental impact and carbon credit projects.</li>
            <li><strong>📊 Staking & Yield:</strong> Earn rewards through staking pools and DeFi farming.</li>
          </ul>
        </div>

        <div className="section">
          <h2>4. Tokenomics</h2>
          <ul>
            <li><strong>Total Supply:</strong> 1,000,000,000 ECOHO</li>
            <li><strong>Initial Liquidity:</strong> $20 BNB equivalent</li>
            <li><strong>Token Distribution:</strong></li>
            <ul>
              <li>40% – Public Sale</li>
              <li>20% – Ecosystem & Rewards</li>
              <li>15% – Team & Advisors</li>
              <li>15% – Liquidity Pool</li>
              <li>10% – Marketing & Airdrops</li>
            </ul>
          </ul>
        </div>

        <div className="section">
          <h2>5. Roadmap</h2>
          <ul>
            <li><strong>Q2 2025:</strong> Token launch on PancakeSwap, Website Live, Whitepaper Released</li>
            <li><strong>Q3 2025:</strong> Music NFT Minting, Airdrop Campaign, Staking Platform</li>
            <li><strong>Q4 2025:</strong> Ecoho Marketplace, Artist Onboarding, Mobile App Beta</li>
            <li><strong>2026:</strong> DAO Governance Launch, Cross-chain Bridges, Carbon Credit Trading</li>
          </ul>
        </div>

        <div className="section">
          <h2>6. Smart Contract Details</h2>
          <p><strong>Network:</strong> Binance Smart Chain (BSC)<br />
             <strong>Standard:</strong> BEP-20<br />
             <strong>Contract Address:</strong> <em>To be announced after deployment</em></p>
        </div>

        <div className="section">
          <h2>7. Security</h2>
          <p>Ecoho Gold smart contracts will undergo regular audits. Liquidity will be locked, and the project will implement anti-whale and anti-bot mechanisms to protect users.</p>
        </div>

        <div className="section">
          <h2>8. Get Involved</h2>
          <p>Join our growing community on social media and become a part of the future of sustainable, creator-focused crypto.</p>
          <p>
            🌍 <a href="https://kamaincprofile.com" target="_blank" rel="noopener noreferrer">Website</a><br />
            🐦 <a href="https://x.com/Akhona_Kama" target="_blank" rel="noopener noreferrer">Twitter/X</a><br />
            🗨️ Telegram: <em>Coming Soon</em>
          </p>
        </div>

        <hr />

        <p><em>Ecoho Gold is more than a token — it’s a movement toward creative and ecological freedom through decentralized finance.</em></p>
      </div>
    </>
  );
};

export default WhitepaperPage;

    

import type { Metadata, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ecoho Gold Whitepaper',
  description: 'Official whitepaper for Ecoho Gold (ECOHO), detailing its vision, tokenomics, and roadmap.',
};

const WhitepaperPage: NextPage = () => {
  const whitepaperStyles = `
    body.whitepaper-page-container { /* Apply to a wrapper div to avoid global body styling conflicts */
      font-family: Arial, sans-serif;
      background-color: #0c0c0c; /* Black background */
      color: #fff; /* White text */
      line-height: 1.6;
      padding: 20px; 
      max-width: 900px;
      margin: auto;
    }
    .whitepaper-page-container h1,
    .whitepaper-page-container h2,
    .whitepaper-page-container h3 {
      color: gold; /* Gold titles */
    }
    .whitepaper-page-container a:not(.app-link) { 
      color: #00ffe7; /* Link color for external links in content */
    }
    .whitepaper-page-container .section {
      margin-bottom: 30px; 
    }
    .whitepaper-page-container hr {
      border: 1px solid gold;
      margin: 30px 0; 
    }
    .whitepaper-page-container ul {
      list-style-type: disc; 
      padding-left: 40px; 
    }
    .whitepaper-page-container li {
      margin-bottom: 8px;
    }
    .whitepaper-page-container .whitepaper-image-container {
      text-align: center;
      margin-bottom: 30px; 
    }
  `;

  const content = {
    "1. Introduction": "Ecoho Gold is a decentralized, community-powered cryptocurrency built on Binance Smart Chain (BEP-20). It is designed to empower creators, investors, and eco-conscious communities through tokenized real-world value, music NFTs, and Web3 finance tools.",
    "2. Vision & Mission": "Our mission is to create a transparent and powerful digital economy where users can earn, trade, and participate in real-world utility ecosystems backed by music, digital art, and environmental projects.",
    "3. Key Features": [
      "Ecoho Gold Token (ECOHO): BEP-20 utility token with real use in staking, governance, and rewards.",
      "Music NFTs: Own and trade music-backed NFTs that pay royalties.",
      "Green Projects: Support environmental impact and carbon credit projects.",
      "Staking & Yield: Earn rewards through DeFi mechanisms."
    ],
    "4. Tokenomics": [
      "Total Supply: 1,000,000,000 ECOHO",
      "Initial Liquidity: $20 BNB equivalent",
      "Distribution: 40% Public Sale, 20% Rewards, 15% Team, 15% Liquidity, 10% Marketing"
    ],
    "5. Roadmap": [
      "Q2 2025: Token launch, Website, Whitepaper",
      "Q3 2025: Music NFTs, Airdrops, Staking",
      "Q4 2025: Marketplace, Onboarding Artists",
      "2026: DAO, Bridges, Carbon Credit Trading"
    ],
    "6. Smart Contract Details": [
      "Network: Binance Smart Chain (BSC)",
      "Standard: BEP-20",
      "Contract: To be announced after deployment"
    ],
    "7. Security": "Smart contracts will undergo audits. Liquidity will be locked. Anti-bot and anti-whale protection included.",
    "8. Get Involved": [
      "Join the Ecoho community and help shape the future of Web3 and sustainable finance.",
      "Website: https://kamaincprofile.com",
      "Twitter: https://x.com/Akhona_Kama",
      "Telegram: https://t.me/ecoho_gold_chat" 
    ]
  };


  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: whitepaperStyles }} />
      <div className="whitepaper-page-container min-h-screen">
        <div className="mb-4 py-4">
            <Link href="/" className="app-link text-primary hover:underline p-2 bg-background rounded">
                &larr; Back to Ecoho Gold Home
            </Link>
        </div>
        
        <h1>Ecoho Gold (ECOHO) Whitepaper</h1>
        
        <div className="whitepaper-image-container my-8">
          <Image 
            src="/images/ecoho_gold_coin_3d.png" 
            alt="Ecoho Gold Coin" 
            width={180} 
            height={180} 
            className="mx-auto"
            data-ai-hint="gold coin crypto"
          />
        </div>

        {Object.entries(content).map(([title, bodyOrList]) => (
          <div key={title} className="section">
            <h2>{title}</h2>
            {Array.isArray(bodyOrList) ? (
              <ul>
                {bodyOrList.map((item, index) => {
                  if (title === "8. Get Involved" && (item.startsWith("Website:") || item.startsWith("Twitter:") || item.startsWith("Telegram:"))) {
                    const [label, urlPart] = item.split(/:(.*)/s); // Split only on the first colon
                    const url = urlPart.trim();
                    return (
                      <li key={index}>
                        <strong>{label}:</strong> <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{url}</a>
                      </li>
                    );
                  }
                  return <li key={index}>{item.replace(/^- /,"")}</li>;
                })}
              </ul>
            ) : (
              <p>{bodyOrList}</p>
            )}
          </div>
        ))}
        
        <hr />
        <p className="text-center"><em>Join our mission to empower a decentralized, eco-friendly future.</em></p>
      </div>
    </>
  );
};

export default WhitepaperPage;
    

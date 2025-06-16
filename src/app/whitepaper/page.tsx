
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
      margin-bottom: 30px; /* Adjusted margin for sections */
    }
    .whitepaper-page-container hr {
      border: 1px solid gold;
      margin: 30px 0; /* Adjusted margin for hr */
    }
    .whitepaper-page-container ul {
      list-style-type: none; /* Using '-' as bullet via content processing */
      padding-left: 20px;
    }
    .whitepaper-page-container li {
      margin-bottom: 8px;
    }
    .whitepaper-page-container .whitepaper-image-container {
      text-align: center;
      margin-bottom: 30px; /* Space after image */
    }
  `;

  const sections = {
    "1. Introduction": "Ecoho Gold (ECOHO) is a decentralized digital asset built on the Binance Smart Chain (BSC) designed to power a sustainable economic ecosystem by combining blockchain technology with real-world utility.",
    "2. Vision & Mission": "Ecoho Gold aims to create a global, stable, and user-driven token economy backed by real value, with a focus on environmentally conscious projects and community rewards.",
    "3. Tokenomics": "- Token Name: Ecoho Gold (ECOHO)\n- Network: BSC (BEP-20)\n- Total Supply: 1,000,000 ECOHO\n- Liquidity: 20%\n- Community Rewards: 30%\n- Development: 25%\n- Marketing: 15%\n- Reserve: 10%",
    "4. Utility": "ECOHO will power:\n- Music NFT purchases\n- Airdrop incentives\n- Voting rights in the Ecoho DAO\n- Access to exclusive content and rewards",
    "5. Roadmap": "Q2 2025: Token Launch & Website\nQ3 2025: NFT Platform Integration\nQ4 2025: Ecoho Mobile App\nQ1 2026: DAO Governance Launch\nQ2 2026: Cross-chain Expansion",
    "6. Get Involved": "Visit https://kamaincprofile.com and follow us on Twitter @Akhona_Kama to stay updated.\nJoin our mission to empower a decentralized, eco-friendly future."
  };

  // Replace "•" with "-" as in the Python script, and prepare for HTML rendering
  const processedSections = Object.entries(sections).map(([title, content]) => {
    const cleanedContent = content.replace(/•/g, '-');
    const lines = cleanedContent.split('\n').map(line => line.trim());
    return { title, lines };
  });

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
            width={180} // Adjusted width for better layout, Python script used w=90 in a PDF context
            height={180} // Assuming square, adjust if not
            className="mx-auto"
            data-ai-hint="gold coin crypto"
          />
        </div>

        {processedSections.map(({ title, lines }) => (
          <div key={title} className="section">
            <h2>{title}</h2>
            {lines.length === 1 && !lines[0].startsWith('-') ? (
              <p>{lines[0]}</p>
            ) : (
              lines[0].includes(':') && lines.length > 1 && lines[1].startsWith('-') ? ( // For Utility section structure
                <>
                  <p>{lines[0]}</p>
                  <ul>
                    {lines.slice(1).map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <ul>
                  {lines.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        ))}
        
        <hr />

        <p><em>Join our mission to empower a decentralized, eco-friendly future.</em></p>
      </div>
    </>
  );
};

export default WhitepaperPage;

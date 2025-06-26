import type { FC } from 'react';
import { randomUUID } from 'crypto';
import { createSign, createPrivateKey } from 'crypto';
import SectionCard from '@/components/ui/section-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Store } from 'lucide-react';

// Define the structure of a campaign based on a typical API response
interface Campaign {
  campaignId: string;
  campaignName: string;
  status: string;
  startDate: string;
  endDate: string | null;
}

// Function to fetch data, must be on the server
async function getWalmartCampaigns(): Promise<{ campaigns?: Campaign[], error?: string }> {
  const consumerId = process.env.WALMART_CONSUMER_ID;
  const rawPrivateKey = process.env.WALMART_PRIVATE_KEY;
  const keyVersion = process.env.WALMART_KEY_VERSION;
  const advertiserId = process.env.WALMART_ADVERTISER_ID;
  const bearerToken = process.env.WALMART_BEARER_TOKEN;

  if (!consumerId || !rawPrivateKey || !keyVersion || !advertiserId || !bearerToken) {
    return { error: "Walmart API credentials are not set in the environment variables." };
  }

  // The private key from .env must be a single line with `\n` for newlines.
  // This replaces the literal `\n` characters with actual newline characters.
  const privateKeyString = rawPrivateKey.replace(/\\n/g, '\n');

  // Add a specific check for PEM format before attempting to use the key.
  // This prevents cryptic crypto errors if the key is malformed.
  if (!privateKeyString.startsWith('-----BEGIN') || !privateKeyString.includes('-----END')) {
    return { error: `The private key is not in a valid PEM format. Please ensure WALMART_PRIVATE_KEY in your .env file is a correctly formatted PKCS#8 key, including the -----BEGIN... and -----END... markers.` };
  }

  const timestamp = Date.now().toString();
  const correlationId = randomUUID();

  // IMPORTANT: The string to sign is specific to the API provider.
  // This is a common format, but it MUST be verified with Walmart's official developer documentation.
  const stringToSign = `${consumerId}\n${timestamp}\n${keyVersion}\n`;

  try {
    // The private key should be in PKCS#8 format.
    const privateKeyObject = createPrivateKey(privateKeyString);

    const signer = createSign('RSA-SHA256');
    signer.update(stringToSign);
    signer.end();
    // Use the KeyObject for signing.
    const signature = signer.sign(privateKeyObject, 'base64');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'WM_CONSUMER.ID': consumerId,
      'WM_CONSUMER.INTIMESTAMP': timestamp,
      'WM_SEC.KEY_VERSION': keyVersion,
      'WM_QOS.CORRELATION_ID': correlationId,
      'WM_SEC.AUTH_SIGNATURE': signature,
      'Authorization': `Bearer ${bearerToken}`
    };

    const url = `https://developer.api.us.stg.walmart.com/api-proxy/service/sp/api-sams/v1/api/v1/campaigns?advertiserId=${advertiserId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      cache: 'no-store', // Don't cache sensitive data fetches
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Walmart API Error: ${response.status} ${response.statusText}`, errorBody);
        return { error: `Failed to fetch from Walmart API. Status: ${response.status}. Please check your credentials, API permissions, and ensure the private key format is correct.` };
    }

    const data = await response.json();
    
    // The actual structure of the response needs to be adapted based on real API output.
    // Assuming data is an array of campaigns. This may need adjustment.
    return { campaigns: Array.isArray(data) ? data : data.campaigns || [] };

  } catch (err: any) {
    console.error('Error during Walmart API call:', err);
    // Provide a more specific error message if it's a key format issue.
    if (err.code === 'ERR_OSSL_PEM_NO_START_LINE' || err.code === 'ERR_INVALID_ARG_TYPE' || err.message.includes('DECODER')) {
        return { error: `The private key is not in a valid PEM format. Please ensure WALMART_PRIVATE_KEY in your .env file is a correctly formatted PKCS#8 key. Original error: ${err.message}` };
    }
    return { error: err.message || 'An unknown error occurred.' };
  }
}

const WalmartCampaigns: FC = async () => {
  const { campaigns, error } = await getWalmartCampaigns();

  return (
    <SectionCard title="Walmart Ad Campaigns" icon={<Store className="text-primary h-8 w-8" />}>
       <p className="mb-4 text-muted-foreground">
        This component demonstrates fetching data from an external, secured API like Walmart's using request signing.
      </p>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} />
          <div>
            <p className="font-semibold">Could not load campaign data</p>
            <p>{error}</p>
            <p className="text-xs mt-1">Please ensure WALMART_CONSUMER_ID, WALMART_PRIVATE_KEY, WALMART_KEY_VERSION, WALMART_ADVERTISER_ID, and WALMART_BEARER_TOKEN are set correctly in your `.env` file. The private key must be a single line in the .env file with `\n` for newlines and be in the PKCS#8 format.</p>
          </div>
        </div>
      )}

      {!error && campaigns && campaigns.length > 0 && (
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Campaign ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.campaignId}>
                <TableCell className="font-medium">{campaign.campaignName}</TableCell>
                <TableCell>{campaign.campaignId}</TableCell>
                <TableCell>{campaign.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!error && campaigns && campaigns.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No campaigns found or the API returned an empty list.</p>
      )}
    </SectionCard>
  );
};

export default WalmartCampaigns;
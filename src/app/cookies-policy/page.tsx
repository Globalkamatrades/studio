
import type { Metadata, NextPage } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ecoho Gold Cookies Policy',
  description: 'Cookies Policy for Ecoho Gold (ECOHO).',
};

const CookiesPolicyPage: NextPage = () => {
  // Styles adapted from the provided HTML, scoped to a container.
  const policyStyles = `
    .cookies-policy-container {
      font-family: Arial, sans-serif;
      background-color: #0c0c0c;
      color: #fff;
      line-height: 1.6;
      padding: 20px; /* Adjusted padding for better viewing within app */
      max-width: 900px;
      margin: auto;
    }
    .cookies-policy-container h1,
    .cookies-policy-container h2,
    .cookies-policy-container h3 {
      color: gold;
    }
    .cookies-policy-container a:not(.app-link) { /* Avoid styling app links */
      color: #00ffe7;
    }
    .cookies-policy-container .section { /* Added for consistency if sections are used */
      margin-bottom: 20px;
    }
    .cookies-policy-container hr { /* Added for consistency if HRs are used */
      border: 1px solid gold;
      margin: 20px 0;
    }
    .cookies-policy-container ul {
      list-style-type: disc;
      padding-left: 40px;
    }
    .cookies-policy-container li {
      margin-bottom: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: policyStyles }} />
      <div className="cookies-policy-container min-h-screen"> {/* Wrapper div */}
        <div className="mb-4 py-4">
            <Link href="/" className="app-link text-primary hover:underline p-2 bg-background rounded">
                &larr; Back to Ecoho Gold Home
            </Link>
        </div>
        <h1>Cookies Policy</h1>
        <p>Last updated: June 16, 2025</p>
        <p>This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used. This Cookies Policy has been created with the help of the <a href="https://www.privacypolicies.com/cookies-policy-generator/" target="_blank" rel="noopener noreferrer">Cookies Policy Generator</a>.</p>
        <p>Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy.</p>
        <p>We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.</p>
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
        <h3>Definitions</h3>
        <p>For the purposes of this Cookies Policy:</p>
        <ul>
        <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Cookies Policy) refers to K2021753276 (SOUTH AFRICA) PTY Ltd, A16113.</li>
        <li><strong>Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.</li>
        <li><strong>Website</strong> refers to ECOHO GOLD , accessible from <a href="https://ecohogold.co.za" rel="external nofollow noopener" target="_blank">https://ecohogold.co.za</a></li>
        <li><strong>You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.</li>
        </ul>
        <h2>The use of the Cookies</h2>
        <h3>Type of Cookies We Use</h3>
        <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.</p>
        <p>We use both session and persistent Cookies for the purposes set out below:</p>
        <ul>
        <li>
        <p><strong>Necessary / Essential Cookies</strong></p>
        <p>Type: Session Cookies</p>
        <p>Administered by: Us</p>
        <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
        </li>
        <li>
        <p><strong>Functionality Cookies</strong></p>
        <p>Type: Persistent Cookies</p>
        <p>Administered by: Us</p>
        <p>Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
        </li>
        </ul>
        <h3>Your Choices Regarding Cookies</h3>
        <p>If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any time.</p>
        <p>If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.</p>
        <p>If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.</p>
        <ul>
        <li>
        <p>For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" rel="external nofollow noopener" target="_blank">https://support.google.com/accounts/answer/32050</a></p>
        </li>
        <li>
        <p>For the Internet Explorer web browser, please visit this page from Microsoft: <a href="http://support.microsoft.com/kb/278835" rel="external nofollow noopener" target="_blank">http://support.microsoft.com/kb/278835</a></p>
        </li>
        <li>
        <p>For the Firefox web browser, please visit this page from Mozilla: <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" rel="external nofollow noopener" target="_blank">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a></p>
        </li>
        <li>
        <p>For the Safari web browser, please visit this page from Apple: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" rel="external nofollow noopener" target="_blank">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></p>
        </li>
        </ul>
        <p>For any other web browser, please visit your web browser's official web pages.</p>
        <h3>More Information about Cookies</h3>
        <p>You can learn more about cookies: <a href="https://www.privacypolicies.com/blog/cookies/" target="_blank" rel="noopener noreferrer">What Are Cookies?</a>.</p>
        <h3>Contact Us</h3>
        <p>If you have any questions about this Cookies Policy, You can contact us:</p>
        <ul>
        <li>
        <p>By email: Akhona@ecohogold.co.za</p>
        </li>
        <li>
        <p>By visiting this page on our website: <a href="https://ecohogold.co.za" rel="external nofollow noopener" target="_blank">https://ecohogold.co.za</a></p>
        </li>
        <li>
        <p>By phone number: 0655335608</p>
        </li>
        </ul>
      </div>
    </>
  );
};

export default CookiesPolicyPage;

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: November 2025
            </p>
          </div>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              1. Data Controller Information
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              This privacy policy describes how Auphere ("the App", "we", "us", "our") handles your personal data.
            </p>
            <div className="space-y-2 text-foreground/80">
              <p><strong>Data controller:</strong> Auphere</p>
              <p><strong>Registered address:</strong> [COMPLETE ADDRESS]</p>
              <p><strong>Contact for privacy inquiries:</strong> [PRIVACY EMAIL]</p>
              <p><strong>Data Protection Officer (if applicable):</strong> [DPO CONTACT] / If no DPO, please contact [PRIVACY EMAIL]</p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Until legal registration of the company is complete, the data controller will be the entrepreneur in charge. Once the company is incorporated, this policy will be updated accordingly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              2. Personal Data We Process
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Depending on your interaction with the App, we may process the following categories of personal data:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Registration data:</h3>
                <p className="text-foreground/80">Name, username, email address, access credentials (including Apple/Google sign-in where applicable).</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">App usage data:</h3>
                <p className="text-foreground/80">User queries (prompts) sent to the AI agent, user preferences, technical logs (IP, device IDs, OS, App version, error logs).</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Geolocation data:</h3>
                <p className="text-foreground/80">Exact geolocation (GPS, WiFi, Bluetooth), if permission is granted; approximate location (city, region, country) derived from IP or device settings.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Transaction and monetization data (if applicable):</h3>
                <p className="text-foreground/80">Subscription plans, registration and cancellation date, payment tokens or transaction ID (full credit card data is never stored by Auphere).</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Communications:</h3>
                <p className="text-foreground/80">Messages sent to App support, user-submitted reports about venues.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Special categories:</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  <li>The App is NOT designed for the input or processing of sensitive data (such as health or religion).</li>
                  <li>No biometric data (such as facial recognition or voice) is requested or used by Auphere.</li>
                  <li>Should the user include sensitive data in a prompt, it will be processed strictly for generating the requested response and never for further use.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              3. Purposes and Legal Bases of Processing
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.1. AI-Based Recommendations</h3>
                <p className="text-foreground/80 mb-2"><strong>Purpose:</strong> Enable users to obtain personalized nightlife recommendations via natural language queries processed by an AI agent (and third-party services such as OpenAI and Google Places).</p>
                <p className="text-foreground/80"><strong>Legal basis:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Performance of contract (GDPR Art. 6.1.b) for providing the requested service.</li>
                  <li>If prompts include voluntary sensitive data, this is processed under explicit consent (GDPR Art. 9.2.a).</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.2. Use of Precise Geolocation</h3>
                <p className="text-foreground/80 mb-2"><strong>Purpose:</strong> Offer more relevant recommendations based on user location, display nearby venues, optimize experience.</p>
                <p className="text-foreground/80"><strong>Legal basis:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Explicit user consent (GDPR Art. 6.1.a), via device permissions and in-app settings. Consent may be withdrawn at any time.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.3. Account and Subscription Management</h3>
                <p className="text-foreground/80 mb-2"><strong>Purpose:</strong> Register and manage user accounts, process subscriptions and billing.</p>
                <p className="text-foreground/80"><strong>Legal basis:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Performance of contract (GDPR Art. 6.1.b).</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.4. Fraud Prevention and Security</h3>
                <p className="text-foreground/80 mb-2"><strong>Purpose:</strong> Detect abusive/fraudulent use and secure the Service.</p>
                <p className="text-foreground/80"><strong>Legal basis:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Legitimate interest (GDPR Art. 6.1.f), balanced against the user's rights.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.5. Analytics and Service Improvement</h3>
                <p className="text-foreground/80 mb-2"><strong>Purpose:</strong> Analyze service usage, improve algorithms, correct errors, optimize user experience.</p>
                <p className="text-foreground/80"><strong>Legal basis:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Legitimate interest (GDPR Art. 6.1.f), or where required by ePrivacy rules, consent (GDPR Art. 6.1.a).</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.6. Direct Marketing</h3>
                <p className="text-foreground/80 mb-2"><strong>Purpose:</strong> Send updates and commercial offers to users who have opted in or where permitted by law.</p>
                <p className="text-foreground/80"><strong>Legal basis:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Consent or legitimate interest (existing customers, with opt-out option).</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              4. Third-Party Service Providers and International Data Transfers
            </h2>
            <p className="text-foreground/80 leading-relaxed">Data may be shared with:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li><strong>Tech providers:</strong> Infrastructure, analytics, and hosting (within the EU/EEA or outside with adequate safeguards).</li>
              <li><strong>AI and Data APIs:</strong> Prompts sent to OpenAI, Google Places, and others, acting as processors under Art. 28 GDPR.</li>
              <li><strong>Payments and Booking providers:</strong> Payment facilitators (e.g., Stripe) and affiliate partners, which may act as controllers.</li>
              <li><strong>Authorities:</strong> When required by law.</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Where personal data is transferred outside the EEA (for instance, to the United States), Auphere ensures such transfers are protected by the EU-U.S. Data Privacy Framework and/or Standard Contractual Clauses (SCCs), along with supplementary security measures.
            </p>
            <p className="text-foreground/80">
              For more details on cross-border data transfers, contact [PRIVACY EMAIL].
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              5. Data Retention
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li><strong>User account data:</strong> Retained while the account is active and for up to [X] years after deletion (for legal defense).</li>
              <li><strong>Prompts and AI queries:</strong> Retained for up to [X months] for service improvement, then anonymized or aggregated.</li>
              <li><strong>Geolocation data:</strong> Retained only as long as necessary for the real-time service.</li>
              <li><strong>Payment and transaction data:</strong> Retained per tax and accounting regulations.</li>
              <li><strong>Direct marketing:</strong> Data retained until withdrawal of consent or objection.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              6. Automated Decisions and Profiling
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>The App uses AI algorithms to interpret user queries and make recommendations.</li>
              <li>No automated decisions with legal or similarly significant effects are made.</li>
              <li>Users can request human intervention, express their point of view, and contest recommendations by contacting [PRIVACY EMAIL].</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              7. User Rights
            </h2>
            <p className="text-foreground/80 leading-relaxed">As a data subject, you can:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Access your data</li>
              <li>Request correction of inaccurate data</li>
              <li>Ask for data erasure</li>
              <li>Request restriction of processing</li>
              <li>Request data portability</li>
              <li>Object to processing or direct marketing</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              Contact [PRIVACY EMAIL] to exercise your rights.
              You may also lodge a complaint with your data protection authority.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              8. Children's Privacy
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              The App is only intended for users aged 18 or over. If we discover underage users, we may delete their data promptly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              9. Security
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              We apply appropriate technical and organizational security measures (encryption, access controls, minimization, audits, recorded breach procedures).
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Despite safeguards, no system is completely secure. We will notify users and authorities of data breaches as required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              10. Third-Party Content
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Venue data and recommendations may rely on information from external providers (such as Google Places and affiliated venues).</li>
              <li>Auphere cannot guarantee the accuracy, completeness, or timeliness of such third-party information.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              11. Changes to This Policy
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              This Privacy Policy may be updated to reflect changes in law or the service. Latest versions are always available in-app and on [PRIVACY POLICY URL].
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Terms and Conditions
            </h1>
            <p className="text-muted-foreground">
              Last updated: November 2025
            </p>
          </div>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              1. Purpose
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              These Terms and Conditions ("Terms") govern access to and use of the Auphere app and associated services ("the Service") owned by Auphere, with registered address at [COMPLETE ADDRESS] and contact email [CONTACT EMAIL].
            </p>
            <p className="text-foreground/80 leading-relaxed">
              By using the App, you ("the User") agree to these Terms. If you do not agree, do not use the App.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              2. Access and Registration
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Users may be required to create an account.</li>
              <li>You must be at least 18 years old and legally capable.</li>
              <li>You are responsible for providing true, up-to-date information and keeping your access credentials confidential.</li>
              <li>Accounts are strictly personal and non-transferable.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              3. Service Description
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>The App allows Users to submit natural language queries related to nightlife venues (e.g., "I want a quiet bar nearby").</li>
              <li>The App uses artificial intelligence models and third-party data sources (like Google Places) to deliver indicative recommendations.</li>
              <li>Freemium and paid (premium) features, as well as affiliate or booking links, may be offered.</li>
              <li>The Service is a support tool only. Final decisions regarding visiting venues rest solely with the User.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              4. Acceptable Use
            </h2>
            <p className="text-foreground/80 leading-relaxed">Users commit to:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Not using the App for unlawful, fraudulent, or bad-faith purposes.</li>
              <li>Not submitting defamatory, violent, discriminatory, pornographic, illegal, or third-party infringing content.</li>
              <li>Not inputting third-party personal data without consent, especially sensitive data.</li>
              <li>Not using the App to develop competing activities without Auphere's written consent.</li>
              <li>Not reverse-engineering, decompiling, or attempting to access the App's source code beyond those uses legally permitted.</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Auphere reserves the right to suspend or terminate User accounts in breach of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              5. Pricing, Subscription, and Affiliate Services
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>The App may offer a free plan and one or more paid plans (monthly, yearly, etc.), with details provided in-app.</li>
              <li>Prices may change; Users will be informed in advance.</li>
              <li>Affiliate or booking links may be provided:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Payments and bookings are handled directly with the third party.</li>
                  <li>Auphere is not party to contracts between Users and venues or booking platforms.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              6. Disclaimer for AI Results and Third-Party Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">6.1. Nature of Recommendations</h3>
                <p className="text-foreground/80 mb-2">AI answers are based on:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>User prompts and preferences</li>
                  <li>Data from external providers (e.g., Google Places)</li>
                  <li>Statistical models which may contain errors or bias</li>
                </ul>
                <p className="text-foreground/80 mt-2">Recommendations:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Are indicative only and can be incomplete, inaccurate, or outdated</li>
                  <li>Do not constitute professional advice, nor guarantee venue availability, quality, or suitability</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">6.2. No Guarantee of Availability or Accuracy</h3>
                <p className="text-foreground/80 mb-2">Auphere does not guarantee:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>That recommended venues will be open, operating, or accepting booking at the relevant time</li>
                  <li>The truth, safety, quality, environment, pricing, capacity, or accessibility of venues</li>
                  <li>That third-party data is up-to-date or free of errors</li>
                </ul>
                <p className="text-foreground/80 mt-4">
                  Users are responsible for verifying key details with venues before making plans.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">6.3. Limitation of Liability</h3>
                <p className="text-foreground/80 mb-2">To the maximum permitted by law:</p>
                <p className="text-foreground/80 mb-2">Auphere is not responsible for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Economic loss, lost profits, or indirect damages related to App use or reliance on recommendations</li>
                  <li>Any incident, personal injury, or material damage at venues</li>
                  <li>Content, acts, or omissions of third parties (venues, booking platforms, data providers)</li>
                </ul>
                <p className="text-foreground/80 mt-4">
                  Auphere's total liability to the User is limited to the total amount paid by the User to Auphere over the past 12 months, except in cases of gross negligence, fraud, or liability not excludable under applicable law.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              7. Intellectual Property
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">7.1. App and Content Rights</h3>
                <p className="text-foreground/80 leading-relaxed">
                  The app, design, source code, logos, interfaces, texts, images, and all related content are the property of Auphere or its licensors and are protected by intellectual property law.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Users receive only a limited, non-exclusive, revocable, non-sublicensable license to use the App in accordance with these Terms.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Any unauthorized reproduction, distribution, public communication, modification, or exploitation is prohibited.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">7.2. AI-Generated Output</h3>
                <p className="text-foreground/80 mb-2">Text and recommendations generated by the AI ("AI Content") are based on:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>User prompts</li>
                  <li>Third-party AI models and datasets</li>
                </ul>
                <p className="text-foreground/80 mt-4 leading-relaxed">
                  Subject to any rights of third-party model/data owners:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80">
                  <li>Auphere grants Users a non-exclusive, worldwide, royalty-free license to use AI Content generated from their prompts for personal, non-commercial use.</li>
                  <li>Commercial use (e.g., integrating answers into another app or selling listings) requires prior written consent of Auphere.</li>
                </ul>
                <p className="text-foreground/80 mt-4 leading-relaxed">
                  Users acknowledge that AI Content may incorporate or be inspired by third-party data, and rights to such material are subject to the relevant license or law.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Users must not use AI Content for any unlawful or infringing acts.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              8. User-Provided Content
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Users may submit content (e.g., venue reviews, suggestions).</li>
              <li>Users must hold all necessary rights to submitted content.</li>
              <li>Users grant Auphere a non-exclusive, worldwide, free, sublicensable license to reproduce and display content solely for service provision and promotion.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              9. Third-Party Links
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              The App may link to third-party sites or services (booking platforms, venue pages, social media).
              Auphere does not control or endorse these and is not liable for their contents, terms, or privacy policies.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Access is at your own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              10. Service Modifications and Termination
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Auphere may alter, suspend, or discontinue the service at any time, as permitted by law.</li>
              <li>Users will be notified of substantial changes to these Terms. If you disagree with changes, stop using the App.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              11. Governing Law and Jurisdiction
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              These Terms are governed by the laws of [COUNTRY OF INCORPORATION, e.g., ESTONIA or SPAIN], without prejudice to any consumer protection law mandates in the user's place of residence.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Venue for disputes is [CITY/COUNTRY], unless mandatory law provides otherwise.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
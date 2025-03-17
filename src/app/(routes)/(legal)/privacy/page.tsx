import React from 'react';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Learn about our privacy policy and how we handle your personal data.',
};

export default function PrivacyPolicyPage() {
    return (
        <main>
            <header>
                <h1>Privacy Policy</h1>
            </header>
            <section>
                <p>
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your personal information.
                </p>

                <h2>Information We Collect</h2>
                <p>
                    We may collect personal data such as your name, email address, and usage data when you interact with our website.
                </p>

                <h2>How We Use Your Information</h2>
                <p>
                    The collected information is used to improve your browsing experience, personalize content, and for internal analytics. We do not share your data with third parties without your consent unless required by law.
                </p>

                <h2>Data Security</h2>
                <p>
                    We implement robust security measures to ensure your data is protected. However, no method of transmission over the internet is completely secure.
                </p>

                <h2>Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy periodically. Any changes will be posted on this page, and the updated policy will be effective immediately upon posting.
                </p>

                <h2>Contact Us</h2>
                <p>
                    If you have any questions or concerns about our Privacy Policy, please contact us at privacy@example.com.
                </p>
            </section>
        </main>
    );
}
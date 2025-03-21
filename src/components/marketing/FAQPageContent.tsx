import React from 'react';

const faqItems = [
    {
        question: "What types of flowers do you offer?",
        answer:
            "We offer a wide variety of fresh flowers including roses, lilies, tulips, daisies, and seasonal selections. Browse our catalog for more details."
    },
    {
        question: "Do you offer custom arrangements?",
        answer:
            "Yes! We specialize in bespoke floral arrangements for any occasion. Contact our customer service to discuss your ideas and preferences."
    },
    {
        question: "What are your delivery options?",
        answer:
            "We provide same-day delivery in select areas and standard next-day delivery elsewhere. Delivery times and fees may vary based on your location."
    },
    {
        question: "How can I track my order?",
        answer:
            "Once your order is shipped, you'll receive an email with tracking details so you can follow its progress."
    }
];

const FAQPageContent: React.FC = () => {
    return (
        <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1>Frequently Asked Questions</h1>
                <p>Your guide to all things floral</p>
            </header>
            <section>
                {faqItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid #ccc',
                            paddingBottom: '1rem'
                        }}
                    >
                        <h2 style={{ fontSize: '1.25rem' }}>{item.question}</h2>
                        <p>{item.answer}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default FAQPageContent;
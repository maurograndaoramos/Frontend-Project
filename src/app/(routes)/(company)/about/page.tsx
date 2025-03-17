import React from "react";

function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-6">About Our Flower Shop</h1>
            <p className="text-lg text-center mb-4">
                Welcome to [Flower Shop Name]! We're passionate about bringing beauty and freshness to your day.
            </p>
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
                <p>
                    Founded in [Year], our shop has blossomed over the years, offering a wide range of fresh flowers and unique arrangements, all delivered with care.
                </p>
            </section>
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                <p>
                    We aim to bring the beauty of nature into your life with our hand-picked seasonal flowers and creative floral designs.
                </p>
            </section>
            <section>
                <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
                <p>
                    For orders and inquiries, please email us at:{" "}
                    <a href="mailto:info@flowershop.com" className="text-blue-500 underline">
                        info@flowershop.com
                    </a>
                </p>
            </section>
        </div>
    );
}

export default AboutPage;
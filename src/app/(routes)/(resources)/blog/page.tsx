"use client";

export default function Blog() {
    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            backgroundColor: '#fff9f5'
        }}>
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'serif', color: '#d6336c' }}>Flower Shop Blog</h1>
                <p style={{ fontSize: '18px', color: '#555' }}>
                    Latest news, trends, and guides for displaying and caring for your favorite blooms.
                </p>
            </header>
            <section style={{ width: '100%', maxWidth: '800px' }}>
                <article style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                }}>
                    <h2 style={{ color: '#d6336c' }}>Topic Title</h2>
                    <p style={{ fontStyle: 'italic' }}>Published on: Month Day, Year</p>
                    <p>
                        This is a summary of the blog post. Here you can write a brief introduction about the topic, whether it's about flower care tips, seasonal trends, or creative arrangements that are perfect for a special occasion.
                    </p>
                    <a href="#" style={{ color: '#d6336c', textDecoration: 'none' }}>Read more</a>
                </article>
                {/* Add additional blog posts as desired */}
            </section>
        </main>
    );
}
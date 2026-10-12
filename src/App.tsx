import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };
  return (
    <div className="app">


      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">
          <img src="/image.png" alt="FrameCraft Logo" style={{ height: '170px' }} />
        </div>

        <div className="nav-links">
          <a href="#">Shop frames</a>
          <a href="#">Gallery walls</a>
          <a href="#">How it works</a>
        </div>


      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-subtitle">— The Heirloom Edit</span>
          <h1>A beautiful frame changes the way you see a memory.</h1>
          <p className="hero-description">
            Thoughtfully made hardwood frames, archival mats, and gallery-quality printing—crafted one at a time for the photographs you never want to put away.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">
              Shop Best Sellers <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary">
              Build a Custom Frame <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-features">
            <span>FSC® hardwood</span>
            <span>•</span>
            <span>Archival quality</span>
            <span>•</span>
            <span>Ready to hang</span>
          </div>
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Using a placeholder aesthetic image URL since we don't have the actual assets, 
              but it represents a beautiful living room with frames */}
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
            alt="Living room with framed art"
            className="hero-image"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', backgroundColor: 'rgba(255,255,255,0.9)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }}>Shown in room</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>The Hawthorne, Walnut</span>
          </div>
        </div>
      </section>

      {/* Value Props Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', padding: '3rem var(--spacing-lg)', borderBottom: '1px solid #eee' }}>
        {[
          { num: '01', title: 'Made to order', desc: 'Finished by hand in 5-7 days' },
          { num: '02', title: 'Framing made simple', desc: 'Upload, crop, and preview online' },
          { num: '03', title: 'Protected for decades', desc: 'UV acrylic and acid-free materials' },
          { num: '04', title: 'Happiness, guaranteed', desc: '30-day returns on standard sizes' }
        ].map((item) => (
          <div key={item.num} style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: 'var(--color-light-brown)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{item.num}</span>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 600 }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Find Your Frame Section */}
      <section className="container py-2xl">
        <div className="section-header">
          <div>
            <span className="hero-subtitle">— Find Your Frame</span>
            <h2 style={{ marginBottom: '1rem' }}>Made to belong in your home</h2>
            <p style={{ color: '#666', maxWidth: '600px' }}>From quiet oak to slender brass, every profile is designed to let the photograph speak first.</p>
          </div>
          <a href="#" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid currentColor', paddingBottom: '0.2rem' }}>Explore all frames</a>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" alt="Natural wood frame" style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
            <div className="category-info">
              <div>
                <h3 className="category-title">Natural wood</h3>
                <span className="category-desc">Oak, walnut & maple · from $68</span>
              </div>
              <button className="icon-btn"><ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" alt="Slim metal frame" style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
            <div className="category-info">
              <div>
                <h3 className="category-title">Slim metal</h3>
                <span className="category-desc">Brass, pewter & black · from $74</span>
              </div>
              <button className="icon-btn"><ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=600&q=80" alt="Gallery sets" style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
            <div className="category-info">
              <div>
                <h3 className="category-title">Gallery sets</h3>
                <span className="category-desc">Curated sets of 3-9 · from $198</span>
              </div>
              <button className="icon-btn"><ArrowUpRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Most Loved */}
      <section className="container py-2xl" style={{ backgroundColor: '#fdfbf7' }}>
        <div className="section-header">
          <div>
            <span className="hero-subtitle">— Most Loved</span>
            <h2 style={{ marginBottom: '1rem' }}>The frames people come back for</h2>
            <p style={{ color: '#666' }}>Classic proportions, honest materials, and a finish that gets better with time.</p>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderColor: '#ccc' }}>
            Shop all frames <ArrowRight size={16} />
          </button>
        </div>

        <div className="product-grid">
          {[
            { img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80', title: 'The Alder', price: '$78', desc: '8 x 10 in · Archival mat included', badge: 'Best Seller' },
            { img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80', title: 'The Rowan', price: '$72', desc: '8 x 10 in · Archival mat included' },
            { img: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=400&q=80', title: 'The Mercer', price: '$86', desc: '8 x 10 in · Archival mat included', badge: 'New' },
            { img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', title: 'The Juniper', price: '$76', desc: '8 x 10 in · Archival mat included' }
          ].map((item, i) => (
            <div className="product-card" key={i}>
              <div className="product-image-wrap">
                {item.badge && <span className="badge">{item.badge}</span>}
                <img src={item.img} alt={item.title} style={{ aspectRatio: '3/4', objectFit: 'cover' }} />
              </div>
              <div className="product-info">
                <h3>{item.title}</h3>
                <span className="price">{item.price}</span>
              </div>
              <span className="product-desc">{item.desc}</span>
              <button
                onClick={addToCart}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Frame Your Own (Split Section) */}
      <section className="split-section split-bg-sand">
        <div>
          <img src="https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=800&q=80" alt="Crafting frame" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="split-content">
          <span className="hero-subtitle">— Frame your own</span>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>From camera roll to wall in minutes</h2>
          <p style={{ color: '#666', marginBottom: '3rem' }}>Our preview tool makes the choices simple. We print, frame, and finish every detail by hand.</p>

          <div>
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                <h4>Choose your photograph</h4>
                <p>Upload from your phone, Instagram, or computer. We check every file for print quality.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                <h4>Make it yours</h4>
                <p>Select the frame, mat, size, and crop. See a true-to-scale preview before you order.</p>
              </div>
            </div>
            <div className="step-item" style={{ borderBottom: 'none' }}>
              <div className="step-number">3</div>
              <div className="step-text">
                <h4>We craft and deliver</h4>
                <p>Your frame arrives assembled, protected, and ready to hang—with hardware included.</p>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ marginTop: '2rem', alignSelf: 'flex-start' }}>
            Start Framing <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Inspiration */}
      <section className="container py-2xl">
        <div className="section-header">
          <div>
            <span className="hero-subtitle">— In real rooms</span>
            <h2 style={{ marginBottom: '1rem' }}>A little inspiration for every wall</h2>
            <p style={{ color: '#666' }}>Collected homes, quiet corners, and considered groupings from our framing community.</p>
          </div>
          <a href="#" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid currentColor', paddingBottom: '0.2rem' }}>Visit the journal</a>
        </div>

        <div className="inspiration-grid">
          <div className="inspiration-card">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" alt="Living room" />
            <div className="inspiration-content">
              <div>
                <h3>The collected living room</h3>
                <p>A balanced gallery wall in mixed oak and walnut</p>
              </div>
              <button className="icon-btn" style={{ color: 'black' }}><ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="inspiration-card" style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=400&q=80" alt="Bedside" />
              <div className="inspiration-content">
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>Above the bedside</h3>
                  <p>A quiet pair in maple</p>
                </div>
                <button className="icon-btn" style={{ color: 'black', width: '28px', height: '28px' }}><ArrowUpRight size={14} /></button>
              </div>
            </div>
            <div className="inspiration-card" style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80" alt="Small wall" />
              <div className="inspiration-content">
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>Small wall, big story</h3>
                  <p>Four everyday moments in brass</p>
                </div>
                <button className="icon-btn" style={{ color: 'black', width: '28px', height: '28px' }}><ArrowUpRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section py-2xl">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="hero-subtitle">— On your walls</span>
              <h2 style={{ marginBottom: '1rem' }}>Frames with stories already inside</h2>
              <p style={{ color: '#666' }}>Notes from customers who made a little more room for the moments that matter.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>4.9 / 5</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Based on 1,284 verified reviews</div>
            </div>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="stars">
                ★★★★★ <span className="verified-text">Verified purchase</span>
              </div>
              <p className="review-quote">"The walnut is even more beautiful in person. It made a phone photo of my parents feel like a family heirloom."</p>
              <div className="reviewer">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Maya" />
                <div className="reviewer-info">
                  <h4>Maya R.</h4>
                  <p>The Alder - Walnut</p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">
                ★★★★★ <span className="verified-text">Verified purchase</span>
              </div>
              <p className="review-quote">"The online preview was exact, the hanging guide was brilliant, and the whole set was up before dinner."</p>
              <div className="reviewer">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Thomas" />
                <div className="reviewer-info">
                  <h4>Thomas L.</h4>
                  <p>Five-frame gallery set - Oak</p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">
                ★★★★★ <span className="verified-text">Verified purchase</span>
              </div>
              <p className="review-quote">"I send one for every wedding now. Personal, beautifully wrapped, and somehow it always arrives right on time."</p>
              <div className="reviewer">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Nina" />
                <div className="reviewer-info">
                  <h4>Nina S.</h4>
                  <p>Gift frame - Maple</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="split-section split-bg-taupe">
        <div>
          <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80" alt="Gift wrapping" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="split-content" style={{ color: '#2c251f' }}>
          <span className="hero-subtitle" style={{ color: '#5a4f46' }}>— A gift that keeps the moment</span>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Personal, lasting, and already wrapped.</h2>
          <p style={{ color: '#4a3e35', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Choose a photograph now, or let them decide with a digital gift card. Every frame includes a handwritten note and complimentary signature wrapping through December 18.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button className="btn btn-primary" style={{ backgroundColor: '#2c251f' }}>
              Create a Gift Frame <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" style={{ borderColor: '#2c251f', color: '#2c251f' }}>
              Send a Gift Card <ArrowRight size={16} />
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#5a4f46' }}>Order by Dec 18 for complimentary U.S. holiday delivery.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-2xl">
        <div className="faq-container">
          <div className="faq-header">
            <span className="hero-subtitle">— A few helpful details</span>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Questions, answered</h2>
            <p style={{ color: '#666', marginBottom: '3rem' }}>Everything you need to know before your photographs become part of the room.</p>
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: '#666' }}>Still deciding? Our framers are here. </span>
              <a href="#" style={{ borderBottom: '1px solid currentColor', fontWeight: 500 }}>Chat with a framing expert</a>
            </div>
          </div>
          <div>
            <div className="faq-item">
              <div className="faq-question">
                How do I know my photo will print well? <span>−</span>
              </div>
              <div className="faq-answer">
                Upload it to our builder and we'll check resolution, crop, and color before production. If anything looks off, a real person from our print team will email you first.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">What comes with my frame? <span style={{ color: '#999' }}>+</span></div>
            </div>
            <div className="faq-item">
              <div className="faq-question">Can I frame original artwork? <span style={{ color: '#999' }}>+</span></div>
            </div>
            <div className="faq-item">
              <div className="faq-question">How long will my order take? <span style={{ color: '#999' }}>+</span></div>
            </div>
            <div className="faq-item">
              <div className="faq-question">Do you make custom sizes? <span style={{ color: '#999' }}>+</span></div>
            </div>
            <div className="faq-item">
              <div className="faq-question">What is your return policy? <span style={{ color: '#999' }}>+</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ maxWidth: '400px' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#a39c96', marginBottom: '1rem', display: 'block' }}>From the framing table</span>
              <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '2.5rem' }}>Ideas for living with the art and photographs you love.</h2>
              <p style={{ color: '#a39c96', fontSize: '0.9rem' }}>Join for room stories, framing advice, and first access to new finishes. Plus, 10% off your first frame.</p>
            </div>
            <div style={{ width: '400px' }}>
              <form style={{ display: 'flex', marginBottom: '1rem' }}>
                <input type="email" placeholder="Your email address" style={{ flex: 1, padding: '1rem', border: 'none', outline: 'none' }} />
                <button type="submit" style={{ backgroundColor: '#2c251f', color: 'white', border: 'none', padding: '0 1.5rem' }}><ArrowRight size={20} /></button>
              </form>
              <p style={{ fontSize: '0.7rem', color: '#a39c96' }}>By subscribing, you agree to our privacy policy. Unsubscribe any time.</p>
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <img src="/image.png" alt="FrameCraft Logo" style={{ height: '110px', marginTop: '-20px' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#d8d4cf', marginBottom: '1rem', maxWidth: '200px' }}>
                Frames made slowly, for memories worth keeping close.
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                <span>IG</span>
                <span>TW</span>
                <span>FB</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li>All frames</li>
                <li>Gallery wall sets</li>
                <li>Custom framing</li>
                <li>Gift cards</li>
                <li>Wood sample card</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Learn</h4>
              <ul>
                <li>How it works</li>
                <li>Materials & care</li>
                <li>Hanging guides</li>
                <li>The journal</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>About</h4>
              <ul>
                <li>Our workshop</li>
                <li>Sustainability</li>
                <li>Trade program</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Visit the workshop</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                1824 N. Williams Ave.<br />
                Portland, OR 97227
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Tue-Sat · 10am-5pm<br />
                (503) 555-0148
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 frameCraft. Made with care in Portland.</div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Accessibility</span>
            </div>
            <div>Carbon-neutral shipping on every order</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

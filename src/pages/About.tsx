import { CheckCircle, Circle, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeInUp } from '../components/FadeInUp';
import { SEO } from '../components/SEO';

export function About() {
  return (
    <div className="page-section active bg-bg-light-primary">
      <SEO title="Biography" description="Discover the journey of Pastor Efe Ovenseri. From early spiritual foundations to global leadership in ministry and marketplace excellence." />
      
      {/* Page Header */}
      <div className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-bg-dark-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-secondary via-bg-dark-tertiary to-bg-dark-secondary opacity-95"></div>
        <div className="divine-glow -top-20 -left-20 opacity-40"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-border-dark-soft text-accent-gold-primary text-sm font-semibold tracking-wide mb-6 backdrop-blur-md shadow-sm">
              Biography & Origins
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-text-on-dark-primary mb-6 leading-tight">
              Forged in Global Experience.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold-primary to-accent-gold-secondary">Rooted in Divine Calling.</span>
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-xl text-text-on-dark-secondary leading-relaxed font-light max-w-3xl mx-auto">
              The comprehensive journey of Pastor Efe Ovenseri from his early spiritual awakening to international marketplace leadership and pastoral oversight.
            </p>
          </FadeInUp>
        </div>
      </div>

      {/* Detailed Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Sidebar (Sticky Navigation for Bio) */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <FadeInUp className="sticky top-32">
              <div className="bg-white/80 backdrop-blur-md border border-border-gold-soft p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h4 className="font-display font-bold text-text-on-light-primary mb-6 uppercase text-sm tracking-widest border-b border-border-light-soft pb-4">Biography Chapters</h4>
                <ul className="space-y-5 text-sm font-medium">
                  <li className="flex items-center text-accent-gold-primary font-bold">
                    <CheckCircle className="w-5 h-5 mr-3 fill-current" /> Early Foundations
                  </li>
                  <li className="flex items-center text-text-on-light-secondary hover:text-text-on-light-primary transition-colors cursor-pointer">
                    <Circle className="w-5 h-5 text-text-on-light-muted mr-3 fill-current" /> Global Exposure
                  </li>
                  <li className="flex items-center text-text-on-light-secondary hover:text-text-on-light-primary transition-colors cursor-pointer">
                    <Circle className="w-5 h-5 text-text-on-light-muted mr-3 fill-current" /> The Turning Point
                  </li>
                  <li className="flex items-center text-text-on-light-secondary hover:text-text-on-light-primary transition-colors cursor-pointer">
                    <Circle className="w-5 h-5 text-text-on-light-muted mr-3 fill-current" /> Engineering & Enterprise
                  </li>
                  <li className="flex items-center text-text-on-light-secondary hover:text-text-on-light-primary transition-colors cursor-pointer">
                    <Circle className="w-5 h-5 text-text-on-light-muted mr-3 fill-current" /> Ordination & Family
                  </li>
                </ul>
              </div>
            </FadeInUp>
          </div>

          {/* Right Content (Authoritative Narrative) */}
          <div className="lg:col-span-8">
            <div className="bg-white/60 backdrop-blur-sm border border-border-gold-soft p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="prose prose-lg max-w-none text-text-on-light-secondary prose-headings:font-display prose-p:leading-relaxed">
                <FadeInUp>
                  <h2 className="text-3xl font-bold mb-6 mt-0 text-text-on-light-primary opacity-100">Early Foundations & Spiritual Awakening</h2>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    Pastor Ovenseri's spiritual trajectory was set in motion early in life, deeply influenced during the lifetime of his mother. This foundational period played a critical role in shaping his inherent understanding of faith, integrity, and absolute commitment to the Christian doctrine. His early years were not merely passive observation; they were characterized by a profound, growing awareness of God's call upon his life—a call that would soon manifest through active, vigorous involvement in grassroots ministry and evangelistic outreach.
                  </p>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    A significant aspect of his early life was a profound personal challenge: he was born with a speech impediment, a stammer that initially hindered his ability to express himself clearly. While this presented a formidable obstacle, it did not deter the divine purpose for his life. In a remarkable demonstration of grace and transformation, what was once a limitation has been superseded by a calling; today, he is recognized globally as an eloquent and powerful speaker, using his voice to articulate the truths of the Gospel with clarity and conviction.
                  </p>
                </FadeInUp>

                <FadeInUp delay={0.1}>
                  <div className="p-8 bg-bg-light-primary rounded-2xl border border-border-light-soft mb-10 shadow-sm my-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold-primary opacity-10 rounded-full blur-3xl"></div>
                    <h3 className="text-2xl font-display font-bold text-text-on-light-primary mb-4 mt-0 relative z-10 opacity-100">Global Exposure: Canada to Germany</h3>
                    <p className="m-0 text-text-on-light-secondary italic leading-relaxed text-lg relative z-10 opacity-100">
                      Refusing to be confined by geographical limitations, Pastor Ovenseri's early experiences saw him traveling extensively across several nations. His tenures in Canada, Germany, and other territories were not simple relocations—they were intensive seasons of personal growth, cultural adaptation, and spiritual effectiveness. In these diverse environments, he demonstrated remarkable diligence, executing every entrusted assignment with precision. He served in Christ Chosen Church of God as Alter Elder, Usher and a prayer Intercessor while he was in Canada.
                    </p>
                  </div>
                </FadeInUp>

                <FadeInUp delay={0.15}>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    Today, his influence and ministerial impact span across numerous nations of the world, including the United States, Canada, Italy, Germany, Spain, Holland, Belgium, Switzerland, Australia, the United Kingdom, India, South Africa, Kenya, Togo, Ghana, Ivory Coast, Sierra Leone, and Liberia. This global footprint is a testament to his commitment to the Great Commission and his ability to resonate with diverse cultures and congregations.
                  </p>
                </FadeInUp>

                <FadeInUp>
                  <h2 className="text-3xl font-bold mb-6 mt-12 text-text-on-light-primary opacity-100">The Turning Point & Mentorship</h2>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    Destiny eventually led him back to Nigeria, marking a defining era of alignment. Here, he was introduced to Apostle Sunday Iyi, who would become his spiritual father and lifelong mentor. This relationship served as a major catalyst in his ministerial formation. Under Apostle Iyi's guidance, Pastor Ovenseri was thrust into deeper theological and ministerial training via a rigorous seminary program, setting the theological bedrock for his future leadership.
                  </p>
                </FadeInUp>

                <FadeInUp>
                  <h2 className="text-3xl font-bold mb-6 mt-12 text-text-on-light-primary opacity-100">Dual Capacity: Enterprise Meets Ministry</h2>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    In August 2005, a strategic relocation to the United Kingdom opened a new chapter. Demonstrating his belief in the dignity of labor, he began working as a traffic marshal in London's prominent Kings Cross and St Pancras Station areas. His unmatched work ethic soon earned him selection for specialized training in civil engineering and railway construction.
                  </p>
                </FadeInUp>
                
                <FadeInUp delay={0.1}>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    Parallel to his civil engineering certifications—which qualified him to operate heavy plants including 360 Excavators, ADT Dump Trucks, Forklift Telehandlers, and specialized truck dumpers—he advanced his academics at Hackney College. He successfully expanded his entrepreneurial pursuits into international import/export operations and the printing industry. This unique ability to balance high-level business operations with spiritual growth remains a defining hallmark of his leadership brand.
                  </p>
                </FadeInUp>

                <FadeInUp>
                  <h2 className="text-3xl font-bold mb-6 mt-12 text-text-on-light-primary opacity-100">Ordination, Family, & Present Leadership</h2>
                  <p className="mb-8 text-text-on-light-secondary opacity-100">
                    True spiritual offices reflect proven service. Before receiving formal recognition, Pastor Ovenseri functioned actively in establishing The Redeemed Assemblies under Apostle Sunday's leadership. After formal certification from the Global School of Ministry, he was ordained.
                  </p>
                </FadeInUp>

                <FadeInUp delay={0.1}>
                  <p className="mb-0 text-text-on-light-secondary opacity-100">
                    Today, commissioned in May 2025, he serves as the Senior Pastor of The Redeemed Assemblies, Availeith City, whilst simultaneously executing duties as Mission Director and General Assistant Superintendent (GAS). In all these, his greatest support system is his wife, Pastor Stacy Osaze Ovenseri, and their three beautiful children. Together, they exemplify a balanced life integrating faith, family, and extraordinary service.
                  </p>
                </FadeInUp>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About CTA */}
      <div className="py-24 relative overflow-hidden bg-bg-dark-secondary/10 border-t border-border-light-soft">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-on-light-primary mb-6">
            Connect with Pastor Efe
          </h2>
          <p className="text-xl text-text-on-light-secondary mb-10 max-w-2xl mx-auto font-light">
            Whether for speaking engagements, mentorship, or ministry partnership, discover how you can collaborate.
          </p>
          <Link to="/contact" className="px-8 py-4 gold-premium-btn rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2">
            <HeartHandshake className="w-5 h-5" />
            Partner With Us
          </Link>
        </div>
      </div>
    </div>
  );
}

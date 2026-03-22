import { CheckCircle, Circle } from 'lucide-react';
import { FadeInUp } from '../components/FadeInUp';
import { SEO } from '../components/SEO';

export function About() {
  return (
    <div className="page-section bg-white active">
      <SEO title="Biography" description="Discover the journey of Pastor Efe Ovenseri. From early spiritual foundations to global leadership in ministry and marketplace excellence." />
      {/* SaaS Page Header */}
      <div className="bg-surface-50 border-b border-surface-100 pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInUp>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-500 text-sm font-semibold tracking-wide mb-6">
              Biography & Origins
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main mb-6">Forged in Global Experience. Rooted in Divine Calling.</h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-xl text-text-muted leading-relaxed">The comprehensive journey of Pastor Efe Ovenseri from his early spiritual awakening to international marketplace leadership and pastoral oversight.</p>
          </FadeInUp>
        </div>
      </div>

      {/* Detailed Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Sidebar (Sticky Navigation for Bio) */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <FadeInUp className="sticky top-32">
              <div className="bg-white border border-surface-100 p-6 rounded-2xl shadow-saas">
                <h4 className="font-display font-bold text-text-main mb-4 uppercase text-sm tracking-wider">Biography Chapters</h4>
                <ul className="space-y-3 text-sm font-medium text-text-muted">
                  <li className="flex items-center text-brand-500"><CheckCircle className="w-4 h-4 mr-2 fill-current" /> Early Foundations</li>
                  <li className="flex items-center"><Circle className="w-4 h-4 text-surface-100 mr-2 fill-current" /> Global Exposure</li>
                  <li className="flex items-center"><Circle className="w-4 h-4 text-surface-100 mr-2 fill-current" /> The Turning Point</li>
                  <li className="flex items-center"><Circle className="w-4 h-4 text-surface-100 mr-2 fill-current" /> Engineering & Enterprise</li>
                  <li className="flex items-center"><Circle className="w-4 h-4 text-surface-100 mr-2 fill-current" /> Ordination & Family</li>
                </ul>
              </div>
            </FadeInUp>
          </div>

          {/* Right Content (Authoritative Narrative) */}
          <div className="lg:col-span-8 prose prose-lg prose-slate max-w-none text-text-muted">
            <FadeInUp>
              <h2 className="text-3xl font-display font-bold text-text-main mb-6">Early Foundations & Spiritual Awakening</h2>
              <p className="leading-relaxed mb-8">
                Pastor Ovenseri's spiritual trajectory was set in motion early in life, deeply influenced during the lifetime of his mother. This foundational period played a critical role in shaping his inherent understanding of faith, integrity, and absolute commitment to the Christian doctrine. His early years were not merely passive observation; they were characterized by a profound, growing awareness of God's call upon his life—a call that would soon manifest through active, vigorous involvement in grassroots ministry and evangelistic outreach.
              </p>
              <p className="leading-relaxed mb-8">
                A significant aspect of his early life was a profound personal challenge: he was born with a speech impediment, a stammer that initially hindered his ability to express himself clearly. While this presented a formidable obstacle, it did not deter the divine purpose for his life. In a remarkable demonstration of grace and transformation, what was once a limitation has been superseded by a calling; today, he is recognized globally as an eloquent and powerful speaker, using his voice to articulate the truths of the Gospel with clarity and conviction.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="p-8 bg-surface-50 border-l-4 border-brand-500 rounded-r-2xl mb-10">
                <h3 className="text-xl font-display font-bold text-text-main mb-3 m-0">Global Exposure: Canada to Germany</h3>
                <p className="m-0 text-text-muted">
                  Refusing to be confined by geographical limitations, Pastor Ovenseri's early experiences saw him traveling extensively across several nations. His tenures in Canada, Germany, and other territories were not simple relocations—they were intensive seasons of personal growth, cultural adaptation, and spiritual effectiveness. In these diverse environments, he demonstrated remarkable diligence, executing every entrusted assignment with precision. He served in Christ Chosen Church of God as Alter Elder, Usher and a prayer Intercessor while he was in Canada.
                </p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.15}>
              <p className="leading-relaxed mb-8">
                Today, his influence and ministerial impact span across numerous nations of the world, including the United States, Canada, Italy, Germany, Spain, Holland, Belgium, Switzerland, Australia, the United Kingdom, India, South Africa, Kenya, Togo, Ghana, Ivory Coast, Sierra Leone, and Liberia. This global footprint is a testament to his commitment to the Great Commission and his ability to resonate with diverse cultures and congregations.
              </p>
            </FadeInUp>

            <FadeInUp>
              <h2 className="text-3xl font-display font-bold text-text-main mb-6 mt-12">The Turning Point & Mentorship</h2>
              <p className="leading-relaxed mb-8">
                Destiny eventually led him back to Nigeria, marking a defining era of alignment. Here, he was introduced to Apostle Sunday Iyi, who would become his spiritual father and lifelong mentor. This relationship served as a major catalyst in his ministerial formation. Under Apostle Iyi's guidance, Pastor Ovenseri was thrust into deeper theological and ministerial training via a rigorous seminary program, setting the theological bedrock for his future leadership.
              </p>
            </FadeInUp>

            <FadeInUp>
              <h2 className="text-3xl font-display font-bold text-text-main mb-6 mt-12">Dual Capacity: Enterprise Meets Ministry</h2>
              <p className="leading-relaxed mb-8">
                In August 2005, a strategic relocation to the United Kingdom opened a new chapter. Demonstrating his belief in the dignity of labor, he began working as a traffic marshal in London's prominent Kings Cross and St Pancras Station areas. His unmatched work ethic soon earned him selection for specialized training in civil engineering and railway construction.
              </p>
            </FadeInUp>
            
            <FadeInUp delay={0.1}>
              <p className="leading-relaxed mb-8">
                Parallel to his civil engineering certifications—which qualified him to operate heavy plants including 360 Excavators, ADT Dump Trucks, Forklift Telehandlers, and specialized truck dumpers—he advanced his academics at Hackney College. He successfully expanded his entrepreneurial pursuits into international import/export operations and the printing industry. This unique ability to balance high-level business operations with spiritual growth remains a defining hallmark of his leadership brand.
              </p>
            </FadeInUp>

            <FadeInUp>
              <h2 className="text-3xl font-display font-bold text-text-main mb-6 mt-12">Ordination, Family, & Present Leadership</h2>
              <p className="leading-relaxed mb-8">
                True spiritual offices reflect proven service. Before receiving formal recognition, Pastor Ovenseri functioned actively in establishing The Redeemed Assemblies under Apostle Sunday's leadership. After formal certification from the Global School of Ministry, he was ordained.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <p className="leading-relaxed mb-12">
                Today, commissioned in May 2025, he serves as the Senior Pastor of The Redeemed Assemblies, Availeith City, whilst simultaneously executing duties as Mission Director and General Assistant Superintendent (GAS). In all these, his greatest support system is his wife, Pastor Stacy Osaze Ovenseri, and their three beautiful children. Together, they exemplify a balanced life integrating faith, family, and extraordinary service.
              </p>
            </FadeInUp>
          </div>
        </div>
      </div>
    </div>
  );
}

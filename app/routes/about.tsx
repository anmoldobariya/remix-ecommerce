import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ContactInfo } from "~/components/ui/contact-info";
import { CheckIcon, StarIcon, ShieldIcon, TruckIcon, UsersIcon, AwardIcon } from "lucide-react";
import { Footer } from "~/components/ui/footer";
import {
  generateSEOMeta,
  generateBreadcrumbStructuredData,
  SITE_CONFIG,
  SEO_KEYWORDS
} from "~/utils/seo";
import { StructuredData } from "~/components/structured-data";

export const meta: MetaFunction = () => {
  return generateSEOMeta({
    title: `About Us - Expert Eyewear Specialists | ${SITE_CONFIG.name}`,
    description: "Learn about our optical shop's commitment to providing premium eyewear, expert eye care, and exceptional customer service. Discover our story, values, and dedication to your vision.",
    keywords: ["about optical shop", "eye care specialists", "premium eyewear", "optical services", "expert eye exams", ...SEO_KEYWORDS.features],
    canonical: "/about",
    type: "website"
  });
};

export default function About() {
  // Generate structured data for this page
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" }
  ]);

  const features = [
    {
      icon: StarIcon,
      title: "Premium Quality",
      description: "Carefully curated eyewear from top brands with personalized pricing for every budget."
    },
    {
      icon: ShieldIcon,
      title: "Personal Consultation",
      description: "One-on-one sessions with certified opticians to find your perfect eyewear solution."
    },
    {
      icon: TruckIcon,
      title: "Fast Quotes",
      description: "Instant pricing via WhatsApp or phone - get your personalized quote in minutes."
    },
    {
      icon: UsersIcon,
      title: "Family Focused",
      description: "Customized eyewear solutions and competitive pricing for every family member."
    },
    {
      icon: AwardIcon,
      title: "Best Prices Guaranteed",
      description: "We match any competitor's price and often beat it with our exclusive deals."
    },
    {
      icon: CheckIcon,
      title: "Satisfaction Guaranteed",
      description: "100% satisfaction guarantee with our personal service promise."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "50+", label: "Premium Brands" },
    { number: "28", label: "Years of Excellence" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Optical Shop
              </Link>
              <div className="flex items-center space-x-4">
                <Link to="/products">
                  <Button variant="outline" size="sm">Browse Products</Button>
                </Link>
                <Link to="/">
                  <Button size="sm">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <span className="text-gray-900">About Us</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your Vision, Our Personal Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Since 1995, we've specialized in providing premium eyewear with personalized consultations
              and competitive pricing. Every customer receives individual attention and customized quotes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Our Story */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="mb-4">
                    Founded in 1995 by Dr. Sarah Johnson, Optical Shop began as a small family business
                    with a simple mission: to provide high-quality eyewear and exceptional customer service
                    to our local community.
                  </p>
                  <p className="mb-4">
                    What started as a single storefront has grown into the region's most trusted optical
                    destination, serving over 10,000 satisfied customers. We've maintained our commitment
                    to personalized care while embracing the latest technology and fashion trends.
                  </p>
                  <p>
                    Today, our team of certified opticians and style consultants continues to uphold
                    the values that built our reputation: expertise, integrity, and genuine care for
                    every customer who walks through our doors.
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Personal Eyewear Consultations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Custom Prescription Solutions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Premium Designer Collections</span>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Instant Quote Services</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Professional Frame Adjustments</span>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Competitive Pricing Guarantee</span>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Personal Style Consultations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Family Package Deals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <ContactInfo />

              {/* CTA Card */}
              <div className="bg-blue-600 rounded-lg shadow-sm p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-4">Ready for Your Personal Quote?</h3>
                <p className="mb-6 text-blue-100">
                  Contact us today for personalized pricing and expert recommendations tailored to your needs.
                </p>
                <div className="space-y-3">
                  <Link to="/products">
                    <Button variant="secondary" className="w-full">
                      Browse Our Collection
                    </Button>
                  </Link>
                  <a href="tel:+1-800-OPTICAL" className="block">
                    <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-blue-600">
                      📞 Call for Instant Quote
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

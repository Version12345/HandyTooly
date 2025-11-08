import { Metadata } from "next";
import { canonicalUrl } from "@/utils/canonicalUrl";

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with HandyTooly | HandyTooly',
  description: "Have questions about our calculators, found a bug, or want to suggest a new tool? Contact HandyTooly team - we respond within 24 hours.",
  keywords: 'contact handytooly, support, help, feedback, bug report, feature request, calculator help, customer service',
  openGraph: {
    title: 'Contact Us - Get in Touch with HandyTooly',
    description: "Have questions about our calculators, found a bug, or want to suggest a new tool? Contact HandyTooly team - we respond within 24 hours.",
    type: 'website',
    url: canonicalUrl('/contact-us', true),
  },
  alternates: {
    canonical: canonicalUrl('/contact-us'),
  },
};

export default function ContactUs() {
    return (
    <main className="px-8 py-16">
      <div className="max-w-6xl mx-auto text-left">
        <h1>
          Contact HandyTooly
        </h1>
        <p>Have a question about one of our calculators, found a bug, or want to suggest a new tool? We would love to hear from you. Our team usually responds within 24 hours. Whether you are reporting an issue, requesting a new feature, or just saying hello, we are here to help make HandyTooly better for everyone. The fastest way to reach us is by email at <a href="mailto:handytooly@gmail.com" className="text-orange-500">handytooly@gmail.com</a>. We read every message and reply personally. No automated messages or copy-paste responses. We are based in Pacific Standard Time, UTC-8 timezone, and most emails get a reply withing 48 hours.</p>

        <h1>
          How to Contact Us
        </h1>

        <p>To help us respond faster, please include details like the calculator name, its URL, your input values, and what result you expected. For feature requests, describe the tool you need and how you plan to use it. For general questions, be as clear as you can. We take accuracy seriously and review every report carefully. Every message is read by a real person from our small development team. Your feedback, suggestions, and even complaints help us improve and shape the future of HandyTooly. We appreciate your time and effort in helping us build a better platform. Thank you for being part of the HandyTooly community!</p>
      </div>
    </main>
    );
};
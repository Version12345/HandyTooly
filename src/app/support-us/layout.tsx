import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Your support help us keep this service free and continuously improve our AI-powered tools.',
  description: "Our platform helps job seekers create better resumes and cover letters and many other useful tools. Your support helps us keep this service free and continuously improve our AI-powered tools.",
};

export default function SupportUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
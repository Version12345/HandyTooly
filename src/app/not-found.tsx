import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-3xl">There was a problem.</h2>
      <div className="text-gray-400 text-6xl m-20">😩</div>
      <p>We could not find the page you were looking for.</p>
      <p>
        <Link href="/" className="text-orange-500">Go back to the dashboard</Link>
      </p>
    </div>
  );
}
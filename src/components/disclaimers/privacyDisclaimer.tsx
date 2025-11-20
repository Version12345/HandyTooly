export default function PrivacyDisclaimer() {
    return (
        <div className="bg-orange-100 rounded-lg text-orange-700 p-4 my-6 text-sm" role="alert">
            <p className="font-bold">Privacy Disclaimer</p>
            <p>All passwords are generated locally in your browser using cryptographically secure random number generation. No passwords are transmitted to servers or stored anywhere. For maximum security, use generated passwords immediately and store them in a trusted password manager.</p>
        </div>
    );
}
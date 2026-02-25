'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen p-4">
                <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                <p className="text-gray-400 mb-6 max-w-md text-center">
                    {error.message || "A catastrophic error occurred."}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                    Try again
                </button>
            </body>
        </html>
    );
}

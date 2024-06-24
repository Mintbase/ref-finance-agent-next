import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-gray-300 flex items-center justify-center">
      <main className="text-center p-6">
        <h1 className="text-4xl font-bold text-white mb-8">Ref Finance Agent API</h1>

        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
          <ul className="space-y-4">
            <li>
              <Link
                href="/reference"
                className="block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                API Reference
              </Link>
            </li>
            <li>
              <a
                href="https://docs.mintbase.xyz/ai/mintbase-plugins"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Mintbase Plugin Documentation
              </a>
            </li>
            <li>
              <Link href="/.well-known/ai-plugin.json" className="text-blue-400 hover:text-blue-300">
                OpenAPI Specification
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/Mintbase/ref-finance-agent-next"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Github Source Code
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react'
import { ApiResponse } from 'shared'
import { Button } from '@/components/ui/button'
import { GithubIcon, ClipboardCopy, Check } from 'lucide-react'
import { Link } from '@mini_apps/utilities'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()
  const [copied, setCopied] = useState(false)

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('bun create bhvr')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <main className="flex min-h-screen max-w-lg mx-auto flex-col items-center justify-start p-4 md:p-8 mt-20">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-2">
            <p className='text-5xl'>🦫</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">bhvr</h1>
          <p className="text-xl text-muted-foreground">Bun + Hono + Vite + React</p>
          <p className="text-center max-w-md">A typesafe fullstack monorepo template for modern web applications</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={sendRequest} >
            Fetch
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="https://github.com/stevedylandev/bhvr">
            <GithubIcon className="mr-2" />
            GitHub
            </Link>
          </Button>
        </div>

        {data && (
          <div className="w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm">
              <code>
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          </div>
        )}

        <div className="w-full">
          <p className="text-sm text-muted-foreground mb-2">Get started with:</p>
          <div className="relative w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 overflow-hidden">
            <pre className="text-sm font-mono">
              <code>bun create bhvr</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <footer className="text-sm text-muted-foreground pt-8">
          <p>Built with 🦫 by <Link href="https://stevedylan.dev" className="underline">Steve</Link></p>
        </footer>
      </div>

    </main>
  )
}

export default App

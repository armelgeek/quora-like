import { useState } from 'react'
import { ApiResponse } from 'shared'
import { Button } from '@/components/ui/button'
import { GithubIcon, ClipboardCopy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from '@mini_apps/utilities'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block"
import bun from "./assets/bun.svg"
import vite from "./assets/vite.svg"
import hono from "./assets/hono.svg"
import react from "./assets/react.svg"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()
  const [copied, setCopied] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

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
      await navigator.clipboard.writeText('bun create bhvr@latest')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleItem = (item: string) => {
    setOpenItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  return (
    <main className="flex min-h-screen max-w-lg sm:max-w-2xl mx-auto flex-col items-center justify-start p-4 md:p-8 mt-8 sm:mt-20">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-2">
            <p className='text-5xl'>🦫</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">bhvr</h1>
          <p className="text-xl text-muted-foreground">Bun + Hono + Vite + React</p>
          <p className="text-center max-w-md">Modern and lightweight fullstack repo for building web applications in Typescript</p>
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
              <code>bun create bhvr@latest</code>
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

        <div className="w-full mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Why bhvr?</h2>
          <p>While there are plenty of existing app building stacks out there, many of them are either bloated, outdated, or have too much of a vendor lock-in. bhvr is built with the opinion that you should be able to deploy your client or server in any enviorment while also keeping type saftey.</p>
          <br/>
          <p>Each piece of the stack is lightweight and blazing fast to keep your web apps simple and portable. If you're not familiar with Bun, Hono, or Vite, they are replacements for the following:</p>
          <br />
          <ul className='pl-6 list-disc space-y-2'>
            <li>Node / NPM -&gt; Bun</li>
            <li>Express -&gt; Hono</li>
            <li>Webpack -&gt; Vite</li>
          </ul>
        </div>

        <div className="w-full mt-6">
          <div className="grid grid-cols-1 gap-4">
              <Collapsible open={openItems['bun']} onOpenChange={() => toggleItem('bun')}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={bun} alt="Bun logo" className="w-8 h-8" />
                        <div className='flex flex-col items-start'>
                          <CardTitle>Bun</CardTitle>
                          <CardDescription>JavaScript runtime & toolkit</CardDescription>
                        </div>
                      </div>
                      {openItems['bun'] ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className='space-y-4'>
                      <p className="text-sm">
                        A fast all-in-one JavaScript runtime with native bundler,
                        test runner, and npm-compatible package manager. In bhvr Bun is used to install dependencies, bundle types, and manage the workspace.
                      </p>


                      <CodeBlock>
                        <CodeBlockCode code={`bun run install
bun run dev`} language="bash" />
                      </CodeBlock>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={openItems['hono']} onOpenChange={() => toggleItem('hono')}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={hono} alt="Hono logo" className="w-8 h-8" />
                        <div className='flex flex-col items-start'>
                          <CardTitle>Hono</CardTitle>
                          <CardDescription>Ultrafast web framework</CardDescription>
                        </div>
                      </div>
                      {openItems['hono'] ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className='space-y-4'>
                      <p className="text-sm">
                        Lightweight, ultrafast web framework for the Edges.
                        With type safety built in and a minimal API. bhvr uses Hono for it's server making it dead simple to build your backend and API.
                      </p>
                      <CodeBlock>
                        <CodeBlockCode code={`import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello bhvr 🦫!",
    success: true
  }

  return c.json(data, { status: 200 })
})

export default app`} language="javascript" />
                      </CodeBlock>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={openItems['vite']} onOpenChange={() => toggleItem('vite')}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={vite} alt="Vite logo" className="w-8 h-8" />
                        <div className='flex flex-col items-start'>
                          <CardTitle>Vite</CardTitle>
                          <CardDescription>Next generation frontend tooling</CardDescription>
                        </div>
                      </div>
                      {openItems['vite'] ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className='space-y-4'>
                      <p className="text-sm">
                        Provides instant server start, lightning-fast HMR,
                        and optimized builds for production deployment. bhvr uses Vite for bundling the client frontend, and giving users a "just works" experience while also offering great ecosystem plugins.
                      </p>
                      <CodeBlock>
                        <CodeBlockCode code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`} language="javascript" />
                      </CodeBlock>

                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={openItems['react']} onOpenChange={() => toggleItem('react')}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={react} alt="React logo" className="w-8 h-8" />
                        <div className='flex flex-col items-start'>
                          <CardTitle>React</CardTitle>
                          <CardDescription>UI component library</CardDescription>
                        </div>
                      </div>
                      {openItems['react'] ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className='space-y-4'>
                      <p className="text-sm">
                        A classic default for building frontend UIs, but can easily be swapped with something else.
                      </p>
                      <CodeBlock>
                        <CodeBlockCode code={`import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { ApiResponse } from 'shared'
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()

  async function sendRequest() {
    try {
      const req = await fetch({SERVER_URL}/hello)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/stevedylandev/bhvr" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <button onClick={sendRequest}>
          Call API
        </button>
        {data && (
          <pre className='response'>
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
      <p className="read-the-docs">
        Click the beaver to learn more
      </p>
    </>
  )
}
export default App`} language="javascript" />
                      </CodeBlock>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
          </div>
        </div>

        <footer className="text-sm text-muted-foreground pt-8">
          <p className='flex items-center gap-1'>Built with 🦫 by <Link href="https://stevedylan.dev" className="underline">Steve</Link></p>
        </footer>
      </div>

    </main>
  )
}

export default App

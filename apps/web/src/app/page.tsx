import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo-400.png"
            alt="SynTech Studios"
            width={400}
            height={100}
            priority
          />
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-ocean-light via-ocean to-ocean-dark bg-clip-text text-transparent">
          SynTech Studios
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl">
          Studio de développement premium
        </p>

        <div className="flex gap-4 justify-center">
          <div className="px-6 py-3 bg-gradient-to-r from-ocean-light to-ocean-dark rounded-lg text-white font-semibold">
            🚀 En Construction
          </div>
        </div>
      </div>
    </main>
  )
}

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-[#0e0f16] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
          <p className="text-gray-400">
            Sorry, we couldn&apos;t sign you in. The authentication code was invalid or expired.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-gradient-to-r from-[#0db2f3] to-blue-500">
            <Link href="/login">Try Again</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

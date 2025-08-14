import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Mic, LogOut, User } from 'lucide-react'

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#0e0f16] dark:bg-[#0e0f16] light:bg-gradient-to-br light:from-gray-50 light:to-blue-50">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
                  ToriType
                </h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to ToriType! 🎉
            </h2>
            <p className="text-gray-300 text-lg">
              You're successfully authenticated and ready to start transcribing Nigerian speech.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#0db2f3]/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Mic className="w-6 h-6 text-[#0db2f3]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Voice Recording</h3>
              <p className="text-gray-400 text-sm">Record and transcribe Nigerian English and Pidgin speech in real-time.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your Profile</h3>
              <p className="text-gray-400 text-sm">Manage your account settings and transcription preferences.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
              <p className="text-gray-400 text-sm">View your transcription history and accuracy statistics.</p>
            </div>
          </div>

          <div className="bg-[#0db2f3]/10 border border-[#0db2f3]/20 rounded-2xl p-8 mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-gray-300 mb-6">
              Your Nigerian AI speech-to-text platform is ready to use. Start by recording your first audio.
            </p>
            <Button className="bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300">
              Start Recording
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

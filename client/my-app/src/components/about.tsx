import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Shield, Crown, UserPlus, UserMinus, Clock, Database } from 'lucide-react'
import { useTheme } from "@/Context/ThemeProvider"

export default function AboutSection() {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Peer-to-Peer Chat",
      description: "Direct, non-persistent messaging between two users",
      details: [
        "Real-time direct messaging",
        "No message history stored",
        "Complete privacy - messages disappear after session",
        "Perfect for sensitive conversations"
      ],
      badge: "Non-Persistent"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Private Chat",
      description: "Secure one-on-one conversations with flexible storage options",
      details: [
        "Choose persistent or non-persistent mode",
        "End-to-end encryption",
        "Message history when persistent",
        "Private conversation threads"
      ],
      badge: "Flexible Storage"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Group Chat Rooms",
      description: "Create and manage group conversations with admin controls",
      details: [
        "Create custom chat rooms",
        "Join existing rooms with room codes",
        "Admin controls for room management",
        "Kick out users when needed"
      ],
      badge: "Admin Controls"
    }
  ]

  const adminFeatures = [
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Room Creation",
      description: "Create and customize your own chat rooms"
    },
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: "User Management",
      description: "Invite users and manage room membership"
    },
    {
      icon: <UserMinus className="h-6 w-6" />,
      title: "Kick Controls",
      description: "Remove disruptive users from your rooms"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Storage Options",
      description: "Choose persistent or temporary chat history"
    }
  ]

  const {theme}=useTheme()
  return (
    <section className={`py-16 px-4  ${theme==='dark'?'bg-zinc-950 text-white':'bg-amber-50 text-black'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            About Our Chat Platform
          </Badge>
          <h1 className="text-5xl font-bold  mb-6">
            Three Ways to Connect
          </h1>
          <p className={`text-xl ${theme==='dark'?'text-white':'text-zinc-800'} max-w-4xl mx-auto`}>
            Experience versatile communication with our comprehensive chat platform. 
            Whether you need quick peer-to-peer messaging, secure private conversations, 
            or managed group discussions, we've got you covered.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                    {feature.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Features Section */}
        <div className="bg-gradient-to-bl from-blue-300/80 to-white rounded-3xl p-8 shadow-lg mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Admin Controls
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Room creators get full administrative privileges to manage their chat rooms effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2 text-black">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Options */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">Persistent Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Messages are saved and can be accessed later. Perfect for ongoing conversations and important discussions.
              </p>
              <ul className="space-y-2 text-sm text-green-600">
                <li>• Message history preserved</li>
                <li>• Access conversations anytime</li>
                <li>• Search through past messages</li>
                <li>• Great for work and long-term chats</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-red-50 border-orange-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-800">Non-Persistent Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                Messages disappear after the session ends. Ideal for sensitive or temporary conversations.
              </p>
              <ul className="space-y-2 text-sm text-orange-600">
                <li>• No message history stored</li>
                <li>• Complete privacy protection</li>
                <li>• Perfect for sensitive topics</li>
                <li>• Clean slate every session</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

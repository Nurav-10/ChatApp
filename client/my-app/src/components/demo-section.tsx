'use client'
import {motion} from 'motion/react'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Users, Shield, Send, Bot, User, Crown, UserMinus, Copy, Check } from 'lucide-react'
import { useTheme } from "@/Context/ThemeProvider"

interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  sender?: string
  timestamp?: string
}

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState('peer-to-peer')
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'peer-to-peer': [
      { id: 1, role: 'system', content: 'Connected to peer-to-peer chat. Messages will not be saved.' }
    ],
    'private': [
      { id: 1, role: 'system', content: 'Private chat initialized. Choose persistent or non-persistent mode.' }
    ],
    'group': [
      { id: 1, role: 'system', content: 'Welcome to "Project Discussion" room. You are the admin.' }
    ]
  })
  const [input, setInput] = useState('')
  const [roomCode, setRoomCode] = useState('PROJ-2024')
  const [copied, setCopied] = useState(false)
  const [groupMembers] = useState(['You (Admin)', 'Alice', 'Bob', 'Charlie'])

  const handleSendMessage = (chatType: string) => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => ({
      ...prev,
      [chatType]: [...(prev[chatType] || []), userMessage]
    }))
    setInput('')

    // Simulate responses based on chat type
    setTimeout(() => {
      let response: Message
      
      if (chatType === 'peer-to-peer') {
        response = {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Got your message! This conversation will disappear when we disconnect.',
          sender: 'Peer',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      } else if (chatType === 'private') {
        response = {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Thanks for the private message. This chat can be saved if you choose persistent mode.',
          sender: 'Friend',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      } else {
        const responses = [
          { sender: 'Alice', content: 'Great point! I agree with that approach.' },
          { sender: 'Bob', content: 'Should we schedule a meeting to discuss this further?' },
          { sender: 'Charlie', content: 'I can help with the implementation if needed.' }
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        response = {
          id: Date.now() + 1,
          role: 'assistant',
          content: randomResponse.content,
          sender: randomResponse.sender,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      }

      setMessages(prev => ({
        ...prev,
        [chatType]: [...(prev[chatType] || []), response]
      }))
    }, 1000)
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const kickUser = (username: string) => {
    const systemMessage: Message = {
      id: Date.now(),
      role: 'system',
      content: `${username} has been removed from the room by admin.`
    }
    setMessages(prev => ({
      ...prev,
      group: [...(prev.group || []), systemMessage]
    }))
  }

  const renderChatInterface = (chatType: string, title: string, subtitle: string) => (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {chatType === 'peer-to-peer' && <MessageCircle className="h-5 w-5" />}
            {chatType === 'private' && <Shield className="h-5 w-5" />}
            {chatType === 'group' && <Users className="h-5 w-5" />}
            <div>
              <div className="text-lg">{title}</div>
              <div className="text-sm opacity-90">{subtitle}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-y-auto ">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scroll-hidden">
          {(messages[chatType] || []).map((message) => (
            <div key={message.id}>
              {message.role === 'system' ? (
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {message.content}
                  </Badge>
                </div>
              ) : (
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-white shadow-md'
                  }`}>
                    {message.sender && message.role !== 'user' && (
                      <div className="text-xs font-semibold mb-1 text-blue-600">
                        {message.sender}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    {message.timestamp && (
                      <div className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type a message for ${title.toLowerCase()}...`}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatType)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage(chatType)}
              disabled={!input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const {theme}=useTheme()
  return (
    <section className={`py-16 px-4 ${theme==='dark'?'bg-zinc-950 text-white':'bg-amber-50 text-black'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            Interactive Demo
          </Badge>
          <h2 className="text-4xl font-bold  mb-4">
            Try All Chat Features
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Experience each type of chat functionality. Send messages and see how different 
            chat modes work with their unique features and capabilities.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="peer-to-peer" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Peer-to-Peer</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Private Chat</span>
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Group Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="peer-to-peer" className="space-y-6">
            <motion.div className="grid lg:grid-cols-3 gap-6"
            initial={{opacity:0,x:-10}}
              animate={{opacity:100,x:0}}
              transition={{duration:2,ease:'linear'}}>
              <div className="lg:col-span-2">
                {renderChatInterface('peer-to-peer', 'Direct Connection', 'Non-persistent messaging')}
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Peer-to-Peer Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 overflow-auto">
                    <div className="flex items-center space-x-2 scroll-hide overflow-y-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Direct connection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">No message storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Real-time messaging</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Complete privacy</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="private" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div className="lg:col-span-2 transition-all duration-150 ease-linear "
              initial={{opacity:0,x:-10}}
              animate={{opacity:100,x:0}}
              transition={{duration:2,ease:'linear'}}>
                {renderChatInterface('private', 'Private Chat', 'Secure one-on-one messaging')}
              </motion.div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Persistent Mode
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Non-Persistent Mode
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Privacy Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>• End-to-end encryption</div>
                    <div>• Message deletion options</div>
                    <div>• Read receipts</div>
                    <div>• Typing indicators</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="group" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div className="lg:col-span-2" 
              initial={{opacity:0,x:-10}}
              animate={{opacity:100,x:0}}
              transition={{duration:2,ease:'linear'}}
              >
                {renderChatInterface('group', 'Project Discussion', 'Group chat with admin controls')}
              </motion.div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span>Admin Controls</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Room Code:</span>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{roomCode}</code>
                        <Button size="sm" variant="ghost" onClick={copyRoomCode}>
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Room Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {groupMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{member}</span>
                          {member.includes('Admin') && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        {!member.includes('You') && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => kickUser(member)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600 mb-1">P2P</div>
              <p className="text-gray-600 text-sm">Direct messaging without storage</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600 mb-1">Private</div>
              <p className="text-gray-600 text-sm">Secure chats with storage options</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600 mb-1">Group</div>
              <p className="text-gray-600 text-sm">Managed rooms with admin controls</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

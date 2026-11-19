import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  User,
  Send,
  Plus,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { askAssistant, AssistantMessage, AssistantSession } from '@/services/assistantService'
import { useLanguage, type Language } from '@/context/LanguageContext'

const initialSessions: AssistantSession[] = [
  {
    id: 'session-1',
    title: 'Farmer Support & Subsidies',
    createdAt: 'Today, 10:30 AM',
    language: 'en',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What government subsidies are available for a small farmer with 2 acres?',
        timestamp: '10:30 AM',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Under the PM Kisan Samman Nidhi scheme, eligible landholding farmer families receive ₹6,000 per year in three equal instalments of ₹2,000 deposited directly into their bank accounts via DBT. Additionally, in Telangana, the Rythu Bharosa / Rythu Bandhu scheme provides an investment support of ₹10,000 per acre per year across two crop seasons.',
        timestamp: '10:30 AM',
        citations: [
          {
            title: 'PM-KISAN National Portal',
            sourceName: 'Ministry of Agriculture & Farmers Welfare, GoI',
            sourceUrl: 'https://pmkisan.gov.in',
            clauseReference: 'Demonstration Reference • Official Portal',
          },
          {
            title: 'Rythu Bandhu / Rythu Bharosa State Portal',
            sourceName: 'Department of Agriculture, Govt of Telangana',
            sourceUrl: 'https://rythubandhu.telangana.gov.in',
            clauseReference: 'Demonstration Reference • State Portal',
          },
        ],
      },
    ],
  },
  {
    id: 'session-2',
    title: 'సౌర విద్యుత్ సబ్సిడీ (Solar Subsidy)',
    createdAt: 'Yesterday',
    language: 'te',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'రూఫ్‌టాప్ సోలార్ ప్యానెల్స్‌పై ఎంత సబ్సిడీ వస్తుంది?',
        timestamp: '3:15 PM',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ యోజన కింద గృహ వినియోగదారులకు 1 kW కి ₹30,000, 2 kW కి ₹60,000 మరియు 3 kW లేదా అంతకంటే ఎక్కువ సామర్థ్యానికి గరిష్టంగా ₹78,000 సబ్సిడీ అందుతుంది. దీని ద్వారా నెలకు 300 యూనిట్ల వరకు ఉచిత విద్యుత్ లభిస్తుంది.',
        timestamp: '3:15 PM',
        citations: [
          {
            title: 'PM Surya Ghar National Portal',
            sourceName: 'Ministry of New & Renewable Energy (MNRE)',
            sourceUrl: 'https://pmsuryaghar.gov.in',
            clauseReference: 'Demonstration Reference • Official Portal',
          },
        ],
      },
    ],
  },
  {
    id: 'session-3',
    title: 'किसान सहायता एवं सौर ऊर्जा',
    createdAt: 'Yesterday',
    language: 'hi',
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: 'पीएम किसान योजना में सालाना कितनी राशि मिलती है?',
        timestamp: '11:00 AM',
      },
      {
        id: 'm6',
        role: 'assistant',
        content:
          'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान) योजना के तहत पात्र किसानों को प्रति वर्ष ₹6,000 की वित्तीय सहायता ₹2,000 की तीन समान किस्तों में सीधे उनके बैंक खाते (DBT) में प्रदान की जाती है।',
        timestamp: '11:00 AM',
        citations: [
          {
            title: 'PM-KISAN राष्ट्रीय पोर्टल',
            sourceName: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
            sourceUrl: 'https://pmkisan.gov.in',
            clauseReference: 'आधिकारिक संदर्भ • आधिकारिक पोर्टल',
          },
        ],
      },
    ],
  },
]

const suggestedPrompts = [
  {
    en: 'How do I apply for PM Surya Ghar rooftop solar?',
    te: 'పీఎం సూర్య ఘర్ పథకానికి ఎలా దరఖాస్తు చేసుకోవాలి?',
    hi: 'पीएम सूर्य घर योजना के लिए आवेदन कैसे करें?',
  },
  {
    en: 'What are the benefits under Ayushman Bharat PM-JAY?',
    te: 'ఆయుష్మాన్ భారత్ ద్వారా లభించే వైద్య సదుపాయాలు ఏమిటి?',
    hi: 'आयुष्मान भारत पीएम-जय के मुख्य लाभ क्या हैं?',
  },
  {
    en: 'Is there any education scholarship for BC/SC students?',
    te: 'బీసీ మరియు ఎస్సీ విద్యార్థులకు పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ వివరాలు ఏమిటి?',
    hi: 'एससी और ओबीसी छात्रों के लिए छात्रवृत्ति विवरण क्या है?',
  },
  {
    en: 'What documents are required for PM Kisan?',
    te: 'పీఎం కిసాన్ పథకానికి అవసరమైన పత్రాలు ఏమిటి?',
    hi: 'पीएम किसान योजना के लिए आवश्यक दस्तावेज क्या हैं?',
  },
]

const welcomeMessages: Record<Language, string> = {
  en: 'Namaste! I am your CivicSaarthi AI assistant. Ask me anything about Indian central and state government welfare schemes, criteria, and documentation.',
  te: 'నమస్కారం! నేను మీ సివిక్ సారథి ఏఐ సహాయకుడిని. మీకు ఏ ప్రభుత్వ పథకం గురించిన సమాచారం కావాలన్నా ఇక్కడ అడగండి.',
  hi: 'नमस्ते! मैं आपका सिविक सारथी एआई सहायक हूँ। भारत सरकार एवं राज्य सरकारों की कल्याणकारी योजनाओं, पात्रता और आवश्यक दस्तावेजों के बारे में मुझसे कुछ भी पूछें।',
}

const newSessionTitles: Record<Language, string> = {
  en: 'New Scheme Discussion',
  te: 'కొత్త సంభాషణ',
  hi: 'नई योजना चर्चा',
}

export default function AssistantPage() {
  const { language, setLanguage, t, isTelugu, isHindi, fontClass } = useLanguage()
  const [sessions, setSessions] = useState<AssistantSession[]>(initialSessions)
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1')
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession.messages, isLoading])

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || isLoading) return

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [...s.messages, userMsg] } : s))
    )
    setInputText('')
    setIsLoading(true)

    try {
      const response = await askAssistant(text, language)

      const assistantMsg: AssistantMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        isLiveAi: response.isLiveAi,
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id ? { ...s, messages: [...s.messages, assistantMsg] } : s
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    const newSession: AssistantSession = {
      id: `session-${Date.now()}`,
      title: newSessionTitles[language] || 'New Scheme Discussion',
      createdAt: isTelugu ? 'ఇప్పుడే' : isHindi ? 'अभी' : 'Just now',
      language,
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: welcomeMessages[language] || welcomeMessages.en,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }
    setSessions([newSession, ...sessions])
    setActiveSessionId(newSession.id)
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className={`flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--color-background)] ${fontClass}`}>
      {/* ── SESSIONS SIDEBAR (DESKTOP) ── */}
      <div className="hidden md:flex flex-col w-72 bg-white border-r border-[var(--color-border)] shrink-0">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <span className="font-bold text-xs text-[var(--color-primary)]">{t('chatHistory')}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewConversation}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs cursor-pointer"
          >
            {t('chatNewChat')}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          {sessions.map((sess) => (
            <button
              key={sess.id}
              type="button"
              onClick={() => setActiveSessionId(sess.id)}
              className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-2.5 cursor-pointer ${
                sess.id === activeSession.id
                  ? 'bg-[var(--color-primary)] text-white shadow-xs font-semibold'
                  : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
              }`}
            >
              <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${sess.id === activeSession.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted-foreground)]'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs truncate">{sess.title}</p>
                <p className={`text-[10px] mt-0.5 ${sess.id === activeSession.id ? 'text-white/70' : 'text-[var(--color-muted-foreground)]'}`}>
                  {sess.createdAt}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[11px] text-[var(--color-muted-foreground)]">
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-secondary)]" /> {isTelugu ? 'అధికారిక ప్రభుత్వ లింకులు' : isHindi ? 'आधिकारिक सरकारी लिंक' : 'Official Portal Links'}
          </p>
          <p className="mt-0.5 leading-tight">
            {isTelugu ? 'అన్ని సమాధానాలలో నిజమైన ప్రభుత్వ వెబ్‌సైట్ల లింకులు ఉంటాయి.' : isHindi ? 'सभी उत्तरों में प्रामाणिक मंत्रालय वेबसाइटों के सीधे लिंक शामिल हैं।' : 'Responses include direct links to genuine ministry websites.'}
          </p>
        </div>
      </div>

      {/* ── CHAT MAIN VIEW ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header Toolbar */}
        <div className="h-14 px-4 sm:px-6 border-b border-[var(--color-border)] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[var(--color-primary)] leading-tight">
                {t('chatTitle')}
              </h2>
              <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('chatSubtitle')}
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[var(--color-border)] p-0.5 bg-[var(--color-background)]">
              {(
                [
                  { code: 'en', label: 'English', cls: '' },
                  { code: 'te', label: 'తెలుగు', cls: 'font-telugu' },
                  { code: 'hi', label: 'हिन्दी', cls: 'font-hindi' },
                ] as const
              ).map((langItem) => (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => setLanguage(langItem.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${langItem.cls} ${
                    language === langItem.code
                      ? 'bg-white text-[var(--color-primary)] shadow-xs font-bold'
                      : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="md:hidden text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* ── MESSAGES FEED ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-[var(--color-background)]">
          {/* Transparency Advisory */}
          <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-950 text-xs flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>{t('chatOfficialAdvisory')}:</strong> {t('chatAdvisoryText')}
            </div>
          </div>

          {activeSession.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-[var(--color-primary)] text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`card p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white text-[var(--color-foreground)]'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Source Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] block">
                      {t('chatSourceRefs')}
                    </span>
                    {msg.citations.map((cite, cIdx) => (
                      <a
                        key={cIdx}
                        href={cite.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-secondary)] flex items-center justify-between text-xs transition-colors block group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] truncate">
                            {cite.title}
                          </p>
                          <p className="text-[10px] text-[var(--color-muted-foreground)]">
                            {cite.sourceName} {cite.clauseReference && `• ${cite.clauseReference}`}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--color-muted-foreground)] shrink-0" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Footer with timestamp & copy */}
                <div className="flex items-center justify-between mt-2 pt-1 text-[10px] opacity-60">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:opacity-100 flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--color-success)]" /> {t('chatCopied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> {t('chatCopy')}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-2xl mr-auto animate-fade-in">
              <div className="w-7 h-7 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="card p-3.5 bg-white flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-ping" />
                <span>{t('chatSearching')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── PROMPTS & INPUT AREA ── */}
        <div className="p-3 sm:p-4 border-t border-[var(--color-border)] bg-white shrink-0 space-y-3">
          {/* Suggested Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestedPrompts.map((p, idx) => {
              const text = isTelugu ? p.te : isHindi ? p.hi : p.en
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(text)}
                  className="px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-secondary)] hover:bg-white text-[11px] font-medium text-[var(--color-foreground)] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {text}
                </button>
              )
            })}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="input-base text-xs sm:text-sm h-11 flex-1 rounded-xl"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputText.trim() || isLoading}
              className="h-11 px-4 rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

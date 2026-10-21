import { useState, useRef, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { contactApiUrl } from "@/lib/site";

export default function Mailer() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [submittedName, setSubmittedName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResize();
    }, [message]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !name || !message) {
            alert("Please fill in all fields.");
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@][^@]*@[^@]+\.[^@\s]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(contactApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, message, honeypot }),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmittedName(name);
                setEmail("");
                setName("");
                setMessage("");
                setIsSent(true);
            } else if (res.status === 429) {
                alert("Rate limit reached! Please wait a while before sending another message.");
            } else {
                alert(`Failed to send message: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please email atharvaajmera06@gmail.com directly.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-[#1a1a1a] border border-white/10 rounded-lg p-8 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-16 h-16 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white mb-6">
                    Thanks for reaching out, {submittedName}. I&apos;ll get back to you as soon as possible.
                </p>
                <button
                    onClick={() => {
                        setIsSent(false);
                        setSubmittedName("");
                    }}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full"
        >

            <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
            />

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="name"
                    className="text-sm font-medium text-white"
                >
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/35 focus:shadow-lg focus:shadow-blue-500/20 focus:-translate-y-0.5 transition-all duration-200"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="email"
                    className="text-sm font-medium text-white"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/35 focus:shadow-lg focus:shadow-blue-500/20 focus:-translate-y-0.5 transition-all duration-200"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="message"
                    className="text-sm font-medium text-white"
                >
                    Message
                </label>
                <textarea
                    ref={textareaRef}
                    id="message"
                    placeholder="Your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full p-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/35 focus:shadow-lg focus:shadow-blue-500/20 focus:-translate-y-0.5 transition-all duration-200 resize-none min-h-[120px] font-sans"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-blue-500/35 hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                    </>
                ) : (
                    "Send it"
                )}
            </button>
        </form>
    );
}
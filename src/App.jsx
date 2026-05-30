import { useState } from "react";

const DAILY_SWIPE_LIMIT = 10;
const RENDER_URL = "https://spark-mpesa.onrender.com";

const sampleProfiles = [
  { id: 1, name: "Amara", age: 26, job: "Fashion Designer", distance: 2, gender: "woman", ethnicity: "Black", bio: "Nairobi born, world traveler 🌍 Love art, good food and deep talks.", tags: ["Fashion", "Travel", "Art"], color: "#f87171", emoji: "🌺", verified: true },
  { id: 2, name: "James", age: 29, job: "Chef", distance: 5, gender: "man", ethnicity: "Mixed", bio: "Half Irish, half Nigerian 🍀🌍 I cook jollof AND shepherd's pie.", tags: ["Cooking", "Music", "Food"], color: "#60a5fa", emoji: "👨‍🍳", verified: false },
  { id: 3, name: "Priya", age: 24, job: "Software Engineer", distance: 1, gender: "woman", ethnicity: "Asian", bio: "Indian girl who loves Afrobeats 💃 Hiker by day, Netflix by night.", tags: ["Tech", "Hiking", "Music"], color: "#a78bfa", emoji: "✨", verified: true },
  { id: 4, name: "Lucas", age: 31, job: "Photographer", distance: 8, gender: "man", ethnicity: "Latino", bio: "Brazilian living in Nairobi 📷 I shoot portraits and fall for smiles.", tags: ["Photography", "Travel", "Art"], color: "#34d399", emoji: "📸", verified: false },
  { id: 5, name: "Zara", age: 22, job: "Doctor", distance: 3, gender: "woman", ethnicity: "Mixed", bio: "British-Somali 🇬🇧 Saving lives and dancing to Burna Boy on weekends 💃", tags: ["Dancing", "Fitness", "Adventure"], color: "#fb923c", emoji: "🌻", verified: true },
  { id: 6, name: "Ethan", age: 28, job: "Musician", distance: 6, gender: "man", ethnicity: "White", bio: "White boy who grew up in Mombasa 🎵 I play guitar and speak Swahili.", tags: ["Music", "Culture", "Beach"], color: "#f472b6", emoji: "🎸", verified: false },
  { id: 7, name: "Yuki", age: 25, job: "Architect", distance: 4, gender: "woman", ethnicity: "Asian", bio: "Japanese-Kenyan 🇯🇵🇰🇪 Best sushi in Nairobi, I promise.", tags: ["Design", "Food", "Art"], color: "#38bdf8", emoji: "🏛️", verified: true },
  { id: 8, name: "David", age: 33, job: "Teacher", distance: 9, gender: "man", ethnicity: "White", bio: "American in Nairobi ❤️ Coaching football on weekends.", tags: ["Sports", "Education", "Culture"], color: "#4ade80", emoji: "🏈", verified: false },
  { id: 9, name: "Nia", age: 27, job: "Lawyer", distance: 2, gender: "woman", ethnicity: "Black", bio: "Lagos to Nairobi 💼 I argue for fun and dance for free.", tags: ["Law", "Dance", "Foodie"], color: "#e879f9", emoji: "👩‍⚖️", verified: true },
  { id: 10, name: "Carlos", age: 30, job: "Entrepreneur", distance: 7, gender: "man", ethnicity: "Latino", bio: "Mexican-American building businesses in Africa 🚀 Salsa is my therapy.", tags: ["Business", "Salsa", "Travel"], color: "#facc15", emoji: "🌮", verified: false },
];

const initChat = [
  { from: "them", text: "Hey! I saw you like hiking too! 🏔️" },
  { from: "me", text: "Yes!! I was just at Blue Ridge last weekend 😍" },
  { from: "them", text: "We should go together sometime!" },
];

const GIFTS = [
  { id: 1, emoji: "🌹", name: "Rose", price: 99 },
  { id: 2, emoji: "💐", name: "Bouquet", price: 299 },
  { id: 3, emoji: "🍫", name: "Chocolate", price: 199 },
  { id: 4, emoji: "💎", name: "Diamond", price: 499 },
  { id: 5, emoji: "🎁", name: "Gift Box", price: 399 },
  { id: 6, emoji: "⭐", name: "Star", price: 99 },
];

const S = {
  page: { fontFamily: "Georgia, serif", background: "#fdf6f0", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #f0e6f0", fontFamily: "Georgia,serif", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 },
  btn: { width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#e84393,#f97316)", color: "white", fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
  btnGhost: { width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #e84393", background: "white", color: "#e84393", fontFamily: "Georgia,serif", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  label: { fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 6, display: "block" },
};

function LoginPage({ onLogin, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  function handleLogin() {
    if (!email || !pass) { setError("Please fill in all fields"); return; }
    if (!email.includes("@")) { setError("Enter a valid email"); return; }
    onLogin({ email, name: email.split("@")[0] });
  }
  return (
    <div style={{ ...S.page, justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>💘</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#e84393", fontStyle: "italic" }}>spark</div>
          <div style={{ fontSize: 14, color: "#aaa", marginTop: 4 }}>Find your person ✨</div>
        </div>
        {error && <div style={{ background: "#fff0f0", color: "#e84393", padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{error}</div>}
        <label style={S.label}>Email</label>
        <input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        <button style={{ ...S.btn, marginTop: 8 }} onClick={handleLogin}>Log In 💘</button>
        <button style={S.btnGhost} onClick={onGoSignup}>New here? Create Account →</button>
      </div>
    </div>
  );
}

function SignupPage({ onSignup, onGoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "", age: "", job: "", bio: "" });
  const [error, setError] = useState("");
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function handleSignup() {
    if (!form.name || !form.email || !form.pass || !form.age) { setError("Please fill in all required fields"); return; }
    if (!form.email.includes("@")) { setError("Enter a valid email"); return; }
    if (parseInt(form.age) < 18) { setError("You must be 18 or older"); return; }
    onSignup(form);
  }
  return (
    <div style={{ ...S.page, padding: 20 }}>
      <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: 380, marginTop: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 38 }}>💘</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#e84393", fontStyle: "italic" }}>Join spark</div>
          <div style={{ fontSize: 13, color: "#aaa" }}>Create your profile</div>
        </div>
        {error && <div style={{ background: "#fff0f0", color: "#e84393", padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{error}</div>}
        <label style={S.label}>Full Name *</label>
        <input style={S.input} placeholder="Your name" value={form.name} onChange={e => set("name", e.target.value)} />
        <label style={S.label}>Email *</label>
        <input style={S.input} type="email" placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
        <label style={S.label}>Password *</label>
        <input style={S.input} type="password" placeholder="Min 6 characters" value={form.pass} onChange={e => set("pass", e.target.value)} />
        <label style={S.label}>Age *</label>
        <input style={S.input} type="number" placeholder="Must be 18+" value={form.age} onChange={e => set("age", e.target.value)} />
        <label style={S.label}>Job Title</label>
        <input style={S.input} placeholder="e.g. Designer, Teacher..." value={form.job} onChange={e => set("job", e.target.value)} />
        <label style={S.label}>Bio</label>
        <textarea style={{ ...S.input, height: 80, resize: "none" }} placeholder="Tell people about yourself..." value={form.bio} onChange={e => set("bio", e.target.value)} />
        <button style={{ ...S.btn, marginTop: 4 }} onClick={handleSignup}>Create Account 🎉</button>
        <button style={S.btnGhost} onClick={onGoLogin}>Already have account? Log in</button>
      </div>
    </div>
  );
}

function MpesaModal({ amount, plan, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  async function handlePay() {
    if (!phone || phone.length < 9) { setError("Enter a valid phone number"); return; }
    setLoading(true); setError("");
    try {
      const fullPhone = "254" + phone.replace(/^0/, "");
      const res = await fetch(`${RENDER_URL}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, amount, plan })
      });
      const data = await res.json();
      if (data.success) {
        setPaid(true);
        alert("✅ Check your phone for the Mpesa prompt! Enter your PIN to complete.");
        onSuccess();
      } else {
        setError("Payment failed: " + (data.error || "Try again"));
      }
    } catch (err) {
      setError("Connection error. Try again!");
    }
    setLoading(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📱</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Pay with Mpesa</div>
        <div style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>{plan} — KES {amount}</div>
        {error && <div style={{ background: "#fff0f0", color: "#e84393", padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{error}</div>}
        <label style={{ ...S.label, textAlign: "left" }}>Your Mpesa Number</label>
        <input style={S.input} type="tel" placeholder="e.g. 0712345678" value={phone} onChange={e => setPhone(e.target.value)} />
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16, textAlign: "left" }}>You will receive an Mpesa prompt on your phone</div>
        <button onClick={handlePay} disabled={loading || paid} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Sending prompt... ⏳" : paid ? "✅ Prompt Sent!" : `Pay KES ${amount} 💚`}
        </button>
        <button onClick={onClose} style={S.btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function PremiumModal({ onClose, onUpgrade }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>👑</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#e84393", marginBottom: 8 }}>Go Premium!</div>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Unlock all features and find your match faster</div>
        {[["💘 Unlimited Swipes","No daily limit"],["👀 See Who Liked You","Know before you swipe"],["⭐ Super Likes","5 per day"],["🌍 Worldwide Search","Match globally"],["🚀 Profile Boost","10x more views"],["💎 Verified Badge","Stand out instantly"]].map(([f,d]) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f5f5f5", textAlign: "left" }}>
            <span style={{ fontSize: 20 }}>{f.split(" ")[0]}</span>
            <div><div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{f.slice(3)}</div><div style={{ fontSize: 12, color: "#aaa" }}>{d}</div></div>
          </div>
        ))}
        <button onClick={onUpgrade} style={{ ...S.btn, marginTop: 20, fontSize: 16 }}>Pay KES 999/month via Mpesa 💚</button>
        <button onClick={onClose} style={{ ...S.btnGhost, fontSize: 13 }}>Maybe later</button>
      </div>
    </div>
  );
}

function BoostModal({ onClose, onBuy }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🚀</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#e84393", marginBottom: 8 }}>Boost Your Profile!</div>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Be #1 in your area for 1 hour. Get 10x more views!</div>
        <div style={{ background: "#fff0f6", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#e84393" }}>KES 299</div>
          <div style={{ fontSize: 13, color: "#888" }}>for 1 hour boost</div>
        </div>
        <button onClick={onBuy} style={{ ...S.btn, fontSize: 16 }}>Pay KES 299 via Mpesa 💚</button>
        <button onClick={onClose} style={{ ...S.btnGhost, fontSize: 13 }}>Maybe later</button>
      </div>
    </div>
  );
}

function GiftModal({ match, onClose, onSend }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, padding: 28, maxWidth: 380, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e" }}>Send a Gift 🎁</div>
          <div style={{ fontSize: 13, color: "#aaa" }}>to {match?.name || "your match"}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {GIFTS.map(g => (
            <div key={g.id} onClick={() => setSelected(g)} style={{ border: `2px solid ${selected?.id===g.id?"#e84393":"#f0e6f0"}`, borderRadius: 16, padding: 12, textAlign: "center", cursor: "pointer", background: selected?.id===g.id?"#fff0f6":"white" }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>{g.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{g.name}</div>
              <div style={{ fontSize: 12, color: "#e84393", fontWeight: 700 }}>KES {g.price}</div>
            </div>
          ))}
        </div>
        <button onClick={() => selected && onSend(selected)} style={{ ...S.btn, opacity: selected?1:0.5 }}>Send {selected?`${selected.emoji} — KES ${selected.price}`:"a Gift"} 💝</button>
        <button onClick={onClose} style={S.btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("discover");
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initChat);
  const [liked, setLiked] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [maxDist, setMaxDist] = useState(20);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [genderFilter, setGenderFilter] = useState("everyone");
  const [ethnicityFilter, setEthnicityFilter] = useState("All");
  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showMpesa, setShowMpesa] = useState(false);
  const [mpesaConfig, setMpesaConfig] = useState({ amount: 999, plan: "Premium Subscription" });
  const [isBoosted, setIsBoosted] = useState(false);
  const [swipesLeft, setSwipesLeft] = useState(DAILY_SWIPE_LIMIT);
  const [isVerified, setIsVerified] = useState(false);

  const filtered = sampleProfiles.filter(p =>
    p.distance <= maxDist && p.age >= minAge && p.age <= maxAge &&
    (genderFilter === "everyone" || p.gender === genderFilter.slice(0,-1)) &&
    (ethnicityFilter === "All" || p.ethnicity === ethnicityFilter)
  );
  const current = filtered[cardIndex % Math.max(filtered.length, 1)];
  const next = filtered[(cardIndex + 1) % Math.max(filtered.length, 1)];

  function swipe(dir) {
    if (!isPremium && swipesLeft <= 0) { setShowPremium(true); return; }
    setSwipeDir(dir);
    if (dir === "right") setLiked(c => c + 1);
    if (!isPremium) setSwipesLeft(s => s - 1);
    setTimeout(() => { setSwipeDir(null); setCardIndex(i => i + 1); }, 450);
  }

  function sendMsg() {
    if (!message.trim()) return;
    setMessages(m => [...m, { from: "me", text: message }]);
    setMessage("");
  }

  function handleGiftSend(gift) {
    setMpesaConfig({ amount: gift.price, plan: `${gift.emoji} ${gift.name} Gift` });
    setShowGift(false);
    setShowMpesa(true);
  }

  function handlePremiumUpgrade() {
    setShowPremium(false);
    setMpesaConfig({ amount: 999, plan: "Premium Subscription" });
    setShowMpesa(true);
  }

  function handleBoostBuy() {
    setShowBoost(false);
    setMpesaConfig({ amount: 299, plan: "Profile Boost" });
    setShowMpesa(true);
  }

  function handleMpesaSuccess() {
    setShowMpesa(false);
    if (mpesaConfig.plan === "Premium Subscription") {
      setIsPremium(true);
      setIsVerified(true);
    } else if (mpesaConfig.plan === "Profile Boost") {
      setIsBoosted(true);
      setTimeout(() => setIsBoosted(false), 3600000);
    } else {
      setMessages(m => [...m, { from: "me", text: "Sent a gift! 💝" }]);
    }
  }

  function handleMpesaClose() {
    setShowMpesa(false);
  }

  return (
    <div style={S.page}>
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} onUpgrade={handlePremiumUpgrade} />}
      {showBoost && <BoostModal onClose={() => setShowBoost(false)} onBuy={handleBoostBuy} />}
      {showGift && <GiftModal match={activeMatch} onClose={() => setShowGift(false)} onSend={handleGiftSend} />}
      {showMpesa && <MpesaModal amount={mpesaConfig.amount} plan={mpesaConfig.plan} onClose={handleMpesaClose} onSuccess={handleMpesaSuccess} />}

      <div style={{ width: "100%", maxWidth: 480, background: "white", padding: "16px 24px 0", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#e84393", fontStyle: "italic" }}>💘 spark</div>
            {isPremium && <span style={{ background: "linear-gradient(135deg,#f97316,#e84393)", color: "white", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>👑 PREMIUM</span>}
            {isBoosted && <span style={{ background: "#3b82f6", color: "white", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>🚀 BOOSTED</span>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isPremium && <button onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,#f97316,#e84393)", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 11, color: "white", cursor: "pointer", fontWeight: 700 }}>👑 Premium</button>}
            <button onClick={onLogout} style={{ background: "#fff0f6", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#e84393", cursor: "pointer", fontWeight: 600 }}>Logout</button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {[["discover","🔍 Discover"],["matches","💞 Matches"],["chat","💬 Chat"],["profile","👤 Profile"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "Georgia,serif", fontWeight: tab===key?700:400, fontSize: 12, color: tab===key?"#e84393":"#aaa", borderBottom: tab===key?"3px solid #e84393":"3px solid transparent" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 480, padding: "20px 16px", flex: 1 }}>
        {tab === "discover" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ color: "#bbb", fontSize: 13 }}>❤️ {liked} liked • {isPremium?"∞ swipes":`${swipesLeft}/${DAILY_SWIPE_LIMIT} left`}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowBoost(true)} style={{ background: isBoosted?"#3b82f6":"#eff6ff", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, color: isBoosted?"white":"#3b82f6", cursor: "pointer", fontWeight: 600 }}>🚀 Boost</button>
                <button onClick={() => setShowFilters(f => !f)} style={{ background: showFilters?"#e84393":"#fff0f6", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, color: showFilters?"white":"#e84393", cursor: "pointer", fontWeight: 600 }}>⚙️ Filter</button>
              </div>
            </div>
            {!isPremium && swipesLeft <= 3 && (
              <div onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,#fff0f6,#fff7ed)", border: "2px solid #f97316", borderRadius: 12, padding: "10px 16px", marginBottom: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "#f97316", fontWeight: 600 }}>⚠️ Only {swipesLeft} swipes left!</div>
                <div style={{ fontSize: 12, color: "#e84393", fontWeight: 700 }}>Go Premium →</div>
              </div>
            )}
            {showFilters && (
              <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 4px 20px rgba(232,67,147,0.1)", border: "1px solid #f0e6f0" }}>
                <div style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>🎯 Filter Profiles</div>
                <label style={S.label}>📍 Max Distance: <strong style={{ color: "#e84393" }}>{maxDist} km</strong></label>
                <input type="range" min={1} max={50} value={maxDist} onChange={e => { setMaxDist(+e.target.value); setCardIndex(0); }} style={{ width: "100%", accentColor: "#e84393", marginBottom: 16 }} />
                <label style={S.label}>🎂 Age: <strong style={{ color: "#e84393" }}>{minAge}–{maxAge} yrs</strong></label>
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Min</div>
                    <input type="range" min={18} max={60} value={minAge} onChange={e => { setMinAge(+e.target.value); setCardIndex(0); }} style={{ width: "100%", accentColor: "#e84393" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Max</div>
                    <input type="range" min={18} max={60} value={maxAge} onChange={e => { setMaxAge(+e.target.value); setCardIndex(0); }} style={{ width: "100%", accentColor: "#e84393" }} />
                  </div>
                </div>
                <label style={S.label}>👤 Show me</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["everyone","men","women"].map(g => (
                    <button key={g} onClick={() => { setGenderFilter(g); setCardIndex(0); }} style={{ flex: 1, padding: "8px 0", borderRadius: 20, border: `2px solid ${genderFilter===g?"#e84393":"#f0e6f0"}`, background: genderFilter===g?"#e84393":"white", color: genderFilter===g?"white":"#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Georgia,serif", textTransform: "capitalize" }}>{g}</button>
                  ))}
                </div>
                <label style={S.label}>🌍 Ethnicity</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["All","Black","White","Asian","Latino","Mixed"].map(e => (
                    <button key={e} onClick={() => { setEthnicityFilter(e); setCardIndex(0); }} style={{ padding: "7px 12px", borderRadius: 20, border: `2px solid ${ethnicityFilter===e?"#e84393":"#f0e6f0"}`, background: ethnicityFilter===e?"#e84393":"white", color: ethnicityFilter===e?"white":"#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Georgia,serif" }}>{e}</button>
                  ))}
                </div>
              </div>
            )}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#bbb" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
                <div style={{ fontSize: 16 }}>No one matches your filters</div>
              </div>
            ) : (
              <>
                <div style={{ position: "relative", height: 440, marginBottom: 20 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: `linear-gradient(160deg,${next?.color}22,${next?.color}55)`, transform: "scale(0.95) translateY(10px)" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: `linear-gradient(160deg,white 40%,${current?.color}33)`, boxShadow: `0 20px 60px ${current?.color}40`, border: `2px solid ${current?.color}55`, padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", transform: swipeDir==="right"?"translateX(120%) rotate(20deg)":swipeDir==="left"?"translateX(-120%) rotate(-20deg)":"none", transition: swipeDir?"transform 0.4s ease":"none" }}>
                    {swipeDir==="right" && <div style={{ position: "absolute", top: 20, right: 20, fontSize: 56 }}>💖</div>}
                    {swipeDir==="left" && <div style={{ position: "absolute", top: 20, left: 20, fontSize: 56 }}>❌</div>}
                    <div>
                      <div style={{ fontSize: 72, textAlign: "center", marginBottom: 8 }}>{current?.emoji}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e" }}>{current?.name}, {current?.age}</div>
                        {current?.verified && <span style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>✓ Verified</span>}
                      </div>
                      <div style={{ color: "#888", fontSize: 13, marginBottom: 3 }}>💼 {current?.job}</div>
                      <div style={{ color: "#bbb", fontSize: 13, marginBottom: 6 }}>📍 {current?.distance} km away</div>
                      <div style={{ color: "#e84393", fontSize: 12, marginBottom: 12, fontWeight: 600 }}>🌍 {current?.ethnicity}</div>
                      <div style={{ fontSize: 14, color: "#444", lineHeight: 1.6, marginBottom: 14 }}>{current?.bio}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {current?.tags.map(t => <span key={t} style={{ background: `${current.color}22`, color: current.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, border: `1px solid ${current.color}44` }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
                  <button onClick={() => swipe("left")} style={{ width: 65, height: 65, borderRadius: "50%", border: "2px solid #fca5a5", background: "white", fontSize: 26, cursor: "pointer", boxShadow: "0 4px 20px rgba(239,68,68,0.2)" }}>✕</button>
                  <button onClick={() => isPremium?null:setShowPremium(true)} style={{ width: 58, height: 58, borderRadius: "50%", border: `2px solid ${isPremium?"#facc15":"#f0e6f0"}`, background: "white", fontSize: 24, cursor: "pointer", opacity: isPremium?1:0.5 }}>⭐</button>
                  <button onClick={() => swipe("right")} style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#e84393,#f97316)", fontSize: 34, cursor: "pointer", boxShadow: "0 8px 30px rgba(232,67,147,0.4)", color: "white" }}>♥</button>
                  <button onClick={() => setShowBoost(true)} style={{ width: 58, height: 58, borderRadius: "50%", border: "2px solid #bfdbfe", background: "white", fontSize: 24, cursor: "pointer" }}>🚀</button>
                  <button onClick={() => isPremium?null:setShowPremium(true)} style={{ width: 65, height: 65, borderRadius: "50%", border: `2px solid ${isPremium?"#34d399":"#f0e6f0"}`, background: "white", fontSize: 26, cursor: "pointer", opacity: isPremium?1:0.5 }}>↩️</button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "matches" && (
          <div>
            {!isPremium && (
              <div onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,#fff0f6,#fff7ed)", border: "2px solid #e84393", borderRadius: 16, padding: 16, marginBottom: 16, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>👀</div>
                <div style={{ fontWeight: 700, color: "#e84393", fontSize: 14 }}>See who liked you!</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>Upgrade to Premium to unlock</div>
              </div>
            )}
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Your Matches 💞</div>
            {sampleProfiles.slice(0,4).map(m => (
              <div key={m.id} onClick={() => { setActiveMatch(m); setTab("chat"); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "white", borderRadius: 16, cursor: "pointer", boxShadow: `0 2px 16px ${m.color}25`, border: `1px solid ${m.color}33`, marginBottom: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${m.color}66,${m.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, position: "relative" }}>
                  {m.emoji}
                  {m.verified && <span style={{ position: "absolute", bottom: -2, right: -2, background: "#3b82f6", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "white", fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 15 }}>{m.name}, {m.age}</div>
                  <div style={{ fontSize: 12, color: "#e84393" }}>🌍 {m.ethnicity} • 📍 {m.distance}km</div>
                </div>
                <span style={{ fontSize: 20 }}>💬</span>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button onClick={() => setTab("matches")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#e84393" }}>←</button>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: activeMatch?`linear-gradient(135deg,${activeMatch.color}66,${activeMatch.color})`:"linear-gradient(135deg,#f87171,#f87171)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{activeMatch?.emoji||"🌺"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: "#1a1a2e" }}>{activeMatch?.name||"Amara"}</div>
                <div style={{ fontSize: 12, color: "#34d399" }}>● Online</div>
              </div>
              <button onClick={() => setShowGift(true)} style={{ background: "#fff0f6", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#e84393", cursor: "pointer", fontWeight: 600 }}>🎁 Gift</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg,i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.from==="me"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth: "75%", padding: "11px 16px", borderRadius: msg.from==="me"?"20px 20px 4px 20px":"20px 20px 20px 4px", background: msg.from==="me"?"linear-gradient(135deg,#e84393,#f97316)":"white", color: msg.from==="me"?"white":"#1a1a2e", fontSize: 14, boxShadow: msg.from==="me"?"0 4px 16px rgba(232,67,147,0.3)":"0 2px 10px rgba(0,0,0,0.06)" }}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 12, borderTop: "1px solid #f0f0f0", marginTop: 10 }}>
              <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key==="Enter"&&sendMsg()} placeholder="Type a message..." style={{ flex: 1, padding: "12px 18px", borderRadius: 24, border: "2px solid #f0e6f0", fontFamily: "Georgia,serif", fontSize: 14, outline: "none" }} />
              <button onClick={sendMsg} style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#e84393,#f97316)", color: "white", fontSize: 20, cursor: "pointer" }}>➤</button>
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 12px" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#e84393,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>😊</div>
                {isVerified && <span style={{ position: "absolute", bottom: 0, right: 0, background: "#3b82f6", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 800, border: "2px solid white" }}>✓</span>}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{user.name}</div>
              <div style={{ fontSize: 14, color: "#aaa" }}>{user.email}</div>
              {isPremium && <div style={{ marginTop: 8, display: "inline-block", background: "linear-gradient(135deg,#f97316,#e84393)", color: "white", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20 }}>👑 Premium Member</div>}
            </div>
            {!isPremium && (
              <div onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,#fff0f6,#fff7ed)", border: "2px solid #e84393", borderRadius: 16, padding: 20, marginBottom: 16, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>👑</div>
                <div style={{ fontWeight: 800, color: "#e84393", fontSize: 16 }}>Upgrade to Premium</div>
                <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>KES 999/month via Mpesa 💚</div>
              </div>
            )}
            <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Your Info</div>
              {[["Age",user.age||"Not set"],["Job",user.job||"Not set"],["Bio",user.bio||"Not set"],["Plan",isPremium?"👑 Premium":"Free"]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
                  <span style={{ color: k==="Plan"&&isPremium?"#e84393":"#1a1a2e", fontSize: 14, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowBoost(true)} style={{ ...S.btnGhost, marginBottom: 10, borderColor: "#3b82f6", color: "#3b82f6" }}>🚀 Boost Profile — KES 299</button>
            <button onClick={onLogout} style={{ ...S.btn, background: "linear-gradient(135deg,#aaa,#888)" }}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  if (screen === "login") return <LoginPage onLogin={u => { setUser(u); setScreen("app"); }} onGoSignup={() => setScreen("signup")} />;
  if (screen === "signup") return <SignupPage onSignup={u => { setUser(u); setScreen("app"); }} onGoLogin={() => setScreen("login")} />;
  return <MainApp user={user} onLogout={() => { setUser(null); setScreen("login"); }} />;
}
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const DAILY_SWIPE_LIMIT = 10;
const RENDER_URL = "https://spark-mpesa.onrender.com";

const PROFILES = [
  { id: 1, name: "Amara", age: 26, job: "Fashion Designer", distance: 2, gender: "woman", ethnicity: "Black", bio: "Nairobi born, world traveler 🌍 Love art, good food and deep talks.", tags: ["Fashion", "Travel", "Art"], color: "#e84393", emoji: "🌺", verified: true },
  { id: 2, name: "James", age: 29, job: "Chef", distance: 5, gender: "man", ethnicity: "Mixed", bio: "Half Irish, half Nigerian 🍀🌍 I cook jollof AND shepherd's pie.", tags: ["Cooking", "Music", "Food"], color: "#60a5fa", emoji: "👨‍🍳", verified: false },
  { id: 3, name: "Priya", age: 24, job: "Software Engineer", distance: 1, gender: "woman", ethnicity: "Asian", bio: "Indian girl who loves Afrobeats 💃 Hiker by day, Netflix by night.", tags: ["Tech", "Hiking", "Music"], color: "#a78bfa", emoji: "✨", verified: true },
  { id: 4, name: "Lucas", age: 31, job: "Photographer", distance: 8, gender: "man", ethnicity: "Latino", bio: "Brazilian living in Nairobi 📷 I shoot portraits and fall for smiles.", tags: ["Photography", "Travel", "Art"], color: "#34d399", emoji: "📸", verified: false },
  { id: 5, name: "Zara", age: 22, job: "Doctor", distance: 3, gender: "woman", ethnicity: "Mixed", bio: "British-Somali 🇬🇧 Saving lives and dancing to Burna Boy 💃", tags: ["Dancing", "Fitness", "Adventure"], color: "#fb923c", emoji: "🌻", verified: true },
  { id: 6, name: "Ethan", age: 28, job: "Musician", distance: 6, gender: "man", ethnicity: "White", bio: "White boy who grew up in Mombasa 🎵 Guitar + Swahili.", tags: ["Music", "Culture", "Beach"], color: "#f472b6", emoji: "🎸", verified: false },
  { id: 7, name: "Yuki", age: 25, job: "Architect", distance: 4, gender: "woman", ethnicity: "Asian", bio: "Japanese-Kenyan 🇯🇵🇰🇪 Best sushi in Nairobi.", tags: ["Design", "Food", "Art"], color: "#38bdf8", emoji: "🏛️", verified: true },
  { id: 8, name: "Nia", age: 27, job: "Lawyer", distance: 2, gender: "woman", ethnicity: "Black", bio: "Lagos to Nairobi 💼 I argue for fun and dance for free.", tags: ["Law", "Dance", "Foodie"], color: "#e879f9", emoji: "👩‍⚖️", verified: true },
  { id: 9, name: "Carlos", age: 30, job: "Entrepreneur", distance: 7, gender: "man", ethnicity: "Latino", bio: "Mexican-American building businesses in Africa 🚀 Salsa is therapy.", tags: ["Business", "Salsa", "Travel"], color: "#facc15", emoji: "🌮", verified: false },
  { id: 10, name: "Mei", age: 23, job: "Nurse", distance: 3, gender: "woman", ethnicity: "Asian", bio: "Chinese-Kenyan 🇨🇳🇰🇪 Love matcha, hiking and deep conversations.", tags: ["Health", "Nature", "Art"], color: "#6ee7b7", emoji: "🌸", verified: true },
];

const INIT_MSGS = [
  { from: "them", text: "Hey! I saw you like hiking too! 🏔️", read: true },
  { from: "me", text: "Yes!! I was just at Ngong Hills last weekend 😍", read: true },
  { from: "them", text: "We should go together sometime! ☀️", read: false },
];

const GIFTS = [
  { id: 1, emoji: "🌹", name: "Rose", price: 99 },
  { id: 2, emoji: "💐", name: "Bouquet", price: 299 },
  { id: 3, emoji: "🍫", name: "Chocolate", price: 199 },
  { id: 4, emoji: "💎", name: "Diamond", price: 499 },
  { id: 5, emoji: "🎁", name: "Gift Box", price: 399 },
  { id: 6, emoji: "⭐", name: "Star", price: 99 },
  { id: 7, emoji: "🍷", name: "Wine", price: 349 },
  { id: 8, emoji: "🧸", name: "Teddy", price: 249 },
  { id: 9, emoji: "🎂", name: "Cake", price: 449 },
];

const ICEBREAKERS = [
  "Would you rather explore Nairobi or Mombasa on a first date?",
  "What's your most embarrassing Uber story? 😂",
  "Beach or mountains for a weekend getaway?",
  "What's your love language?",
  "Coffee or tea person? ☕",
];

const S = {
  btn: { width: "100%", padding: "14px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#e84393,#f97316)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, boxShadow: "0 6px 20px rgba(232,67,147,0.3)" },
  btnGhost: { width: "100%", padding: "12px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(248,240,255,0.45)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnPurple: { width: "100%", padding: "14px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#8b5cf6,#e84393)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
  btnGold: { width: "100%", padding: "14px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#f97316,#facc15)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 13, border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#f8f0ff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", marginBottom: 12, boxSizing: "border-box" },
  label: { fontSize: 10, fontWeight: 700, color: "rgba(248,240,255,0.45)", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.8px" },
  card: { background: "#1a1020", borderRadius: 20, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 11 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(8px)" },
  modalBox: { background: "#1a1020", borderRadius: "28px 28px 0 0", padding: "20px 22px 40px", width: "100%", maxWidth: 480, borderTop: "1px solid rgba(255,255,255,0.08)", maxHeight: "90vh", overflowY: "auto" },
  handle: { width: 48, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 4, margin: "0 auto 18px" },
  modalTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, textAlign: "center", color: "#f8f0ff", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "rgba(248,240,255,0.45)", textAlign: "center", marginBottom: 20 },
  perkRow: { display: "flex", alignItems: "center", gap: 13, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" },
};

function MpesaModal({ amount, plan, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  async function pay() {
    if (phone.replace(/\D/g, "").length < 9) { setErr("Enter a valid Mpesa number"); return; }
    setLoading(true); setErr("");
    try {
      const fp = "254" + phone.replace(/^0/, "");
      const res = await fetch(`${RENDER_URL}/pay`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: fp, amount, plan }) });
      const data = await res.json();
      if (data.success) { setSent(true); setLoading(false); alert("✅ Check your phone for the Mpesa prompt!"); onSuccess(); }
      else { setErr("Payment failed: " + (data.error || "Try again")); setLoading(false); }
    } catch (e) { setErr("❌ Cannot reach payment server."); setLoading(false); }
  }
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>📱</div>
        <div style={S.modalTitle}>Pay with Mpesa</div>
        <div style={S.modalSub}>{plan} — <span style={{ color: "#34d399", fontWeight: 700 }}>KES {amount}</span></div>
        {err && <div style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <label style={S.label}>Your Mpesa Number</label>
        <input style={S.input} type="tel" placeholder="0712 345 678" value={phone} onChange={e => setPhone(e.target.value)} />
        <div style={{ fontSize: 11, color: "rgba(248,240,255,0.45)", marginBottom: 14 }}>You'll receive an STK push on your phone</div>
        <button style={S.btn} onClick={pay} disabled={loading || sent}>
          {loading ? "Sending... ⏳" : sent ? "✅ Sent!" : `Pay KES ${amount} 💚`}
        </button>
        <button style={S.btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function PremiumModal({ onClose, onUpgrade }) {
  const perks = [["💘", "Unlimited Swipes", "No daily limit"], ["👀", "See Who Liked You", "Know before you swipe"], ["⭐", "5 Super Likes/day", "Stand out instantly"], ["🌍", "Worldwide Search", "Match globally"], ["🚀", "Profile Boost", "10x more views"], ["✅", "Verified Badge", "Blue tick"], ["👁️", "Profile Visitors", "See who viewed you"], ["💌", "Read Receipts", "Know when msgs are read"], ["🎭", "Anonymous Browse", "Browse invisibly"], ["🔥", "Streak Rewards", "Daily bonuses"]];
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>👑</div>
        <div style={S.modalTitle}>Go Premium</div>
        <div style={S.modalSub}>Unlock everything. Find love faster.</div>
        <div style={{ background: "rgba(232,67,147,0.08)", border: "1px solid rgba(232,67,147,0.15)", borderRadius: 16, padding: 16, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, background: "linear-gradient(135deg,#e84393,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KES 999</div>
          <div style={{ fontSize: 12, color: "rgba(248,240,255,0.45)" }}>per month via Mpesa 💚</div>
        </div>
        {perks.map(([icon, title, desc]) => (
          <div key={title} style={S.perkRow}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{icon}</span>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: "#f8f0ff" }}>{title}</div><div style={{ fontSize: 11, color: "rgba(248,240,255,0.45)" }}>{desc}</div></div>
          </div>
        ))}
        <button style={{ ...S.btn, marginTop: 18 }} onClick={onUpgrade}>Upgrade Now 💚</button>
        <button style={S.btnGhost} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function VIPModal({ onClose, onUpgrade }) {
  const perks = [["👑", "Everything in Premium", "All features included"], ["💑", "Curated Matches", "Hand-picked by Spark team"], ["📞", "Video Date Feature", "In-app video calls"], ["🌟", "Spotlight Daily", "Top of everyone's feed"], ["💬", "Unlimited Icebreakers", "Free daily"], ["🎁", "Monthly Gift Credit", "KES 500 credit/month"]];
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>💎</div>
        <div style={S.modalTitle}>VIP Membership</div>
        <div style={S.modalSub}>For serious daters who want results.</div>
        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: 16, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, background: "linear-gradient(135deg,#8b5cf6,#e84393)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KES 2,499</div>
          <div style={{ fontSize: 12, color: "rgba(248,240,255,0.45)" }}>per month via Mpesa 💚</div>
        </div>
        {perks.map(([icon, title, desc]) => (
          <div key={title} style={S.perkRow}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{icon}</span>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: "#f8f0ff" }}>{title}</div><div style={{ fontSize: 11, color: "rgba(248,240,255,0.45)" }}>{desc}</div></div>
          </div>
        ))}
        <button style={{ ...S.btnPurple, marginTop: 18 }} onClick={onUpgrade}>Get VIP 💎</button>
        <button style={S.btnGhost} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function GiftModal({ match, onClose, onSend }) {
  const [sel, setSel] = useState(null);
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={S.modalTitle}>Send a Gift 🎁</div>
        <div style={S.modalSub}>to {match?.name || "your match"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, margin: "14px 0" }}>
          {GIFTS.map(g => (
            <div key={g.id} onClick={() => setSel(g)} style={{ border: `1.5px solid ${sel?.id === g.id ? "#e84393" : "rgba(255,255,255,0.08)"}`, borderRadius: 15, padding: "11px 8px", textAlign: "center", cursor: "pointer", background: sel?.id === g.id ? "rgba(232,67,147,0.1)" : "rgba(255,255,255,0.04)", transition: "all 0.2s" }}>
              <div style={{ fontSize: 27, marginBottom: 3 }}>{g.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(248,240,255,0.45)" }}>{g.name}</div>
              <div style={{ fontSize: 10, color: "#e84393", fontWeight: 700, marginTop: 2 }}>KES {g.price}</div>
            </div>
          ))}
        </div>
        <button style={{ ...S.btn, opacity: sel ? 1 : 0.4 }} onClick={() => sel && onSend(sel)}>
          {sel ? `Send ${sel.emoji} — KES ${sel.price} 💝` : "Select a gift"}
        </button>
        <button style={S.btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function IcebreakerModal({ match, onClose, onSend }) {
  const [sel, setSel] = useState(null);
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>❓</div>
        <div style={S.modalTitle}>Send Icebreaker</div>
        <div style={S.modalSub}>to {match?.name || "your match"} — KES 99 each</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "14px 0" }}>
          {ICEBREAKERS.map((q, i) => (
            <div key={i} onClick={() => setSel(q)} style={{ background: sel === q ? "rgba(232,67,147,0.08)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${sel === q ? "#e84393" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#f8f0ff" }}>{q}</span>
              <span style={{ fontSize: 11, color: "#e84393", fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>KES 99</span>
            </div>
          ))}
        </div>
        <button style={{ ...S.btn, opacity: sel ? 1 : 0.4 }} onClick={() => sel && onSend(sel)}>Send Question 💬 — KES 99</button>
        <button style={S.btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function SuperLikePackModal({ onClose, onBuy }) {
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>⭐</div>
        <div style={S.modalTitle}>Super Like Pack</div>
        <div style={S.modalSub}>Stand out. Get noticed instantly.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
          {[[5, "199", "Most Popular"], [10, "349", "Best Value"], [20, "599", "Power User"]].map(([n, p, label]) => (
            <div key={n} onClick={() => onBuy(p, `${n} Super Likes`)} style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 700, fontSize: 14, color: "#f8f0ff" }}>⭐ {n} Super Likes</div><div style={{ fontSize: 11, color: "rgba(248,240,255,0.45)", marginTop: 2 }}>{label}</div></div>
              <div style={{ color: "#e84393", fontWeight: 800, fontSize: 15 }}>KES {p}</div>
            </div>
          ))}
        </div>
        <button style={S.btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function SpotlightModal({ onClose, onBuy }) {
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>🌟</div>
        <div style={S.modalTitle}>Spotlight</div>
        <div style={S.modalSub}>Shown to 100 targeted people for 30 mins</div>
        <div style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: 16, padding: 16, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, color: "#fbbf24" }}>KES 199</div>
          <div style={{ fontSize: 12, color: "rgba(248,240,255,0.45)" }}>per spotlight session</div>
        </div>
        {[["🎯", "Targeted", "Shown to people who match your type"], ["⏰", "30 Minutes", "Peak visibility window"], ["📈", "10x Views", "More profile visits guaranteed"]].map(([icon, title, desc]) => (
          <div key={title} style={S.perkRow}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{icon}</span>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: "#f8f0ff" }}>{title}</div><div style={{ fontSize: 11, color: "rgba(248,240,255,0.45)" }}>{desc}</div></div>
          </div>
        ))}
        <button style={{ ...S.btnGold, marginTop: 16 }} onClick={() => onBuy(199, "🌟 Spotlight")}>Activate Spotlight 🌟</button>
        <button style={S.btnGhost} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function SecretAdmirerModal({ onClose, onReveal }) {
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>💌</div>
        <div style={S.modalTitle}>Secret Admirers</div>
        <div style={S.modalSub}>These people liked you secretly</div>
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
          {PROFILES.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${p.color}88,${p.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginLeft: i > 0 ? -12 : 0, border: "3px solid #1a1020", filter: "blur(4px)" }}>{p.emoji}</div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "rgba(248,240,255,0.45)", marginBottom: 16 }}>Pay KES 199 to reveal one admirer</div>
        <button style={S.btn} onClick={() => onReveal(199, "💌 Reveal Secret Admirer")}>Reveal One — KES 199 💘</button>
        <button style={S.btnGhost} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function SparkScoreModal({ onClose, onUnlock, isPremium }) {
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>🏅</div>
        <div style={S.modalTitle}>Your Spark Score</div>
        <div style={S.modalSub}>Based on how others swipe on your profile</div>
        <div style={{ textAlign: "center", margin: "20px 0", position: "relative" }}>
          <div style={{ fontSize: 80, fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, background: "linear-gradient(135deg,#8b5cf6,#e84393)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: isPremium ? "none" : "blur(8px)" }}>87</div>
          <div style={{ fontSize: 14, color: "rgba(248,240,255,0.45)" }}>out of 100</div>
          {!isPremium && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 28 }}>🔒</div>
              <div style={{ fontSize: 13, color: "#e84393", fontWeight: 700 }}>Unlock your score</div>
            </div>
          )}
        </div>
        {isPremium ? (
          <>
            <div style={{ background: "rgba(139,92,246,0.1)", borderRadius: 14, padding: 14, textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#f8f0ff" }}>You're in the <strong style={{ color: "#e84393" }}>top 13%</strong> of profiles in Nairobi! 🔥</div>
            </div>
            <button style={S.btnGhost} onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <button style={S.btnPurple} onClick={() => onUnlock(149, "🏅 Spark Score")}>Unlock Score — KES 149</button>
            <button style={S.btnGhost} onClick={onClose}>Maybe later</button>
          </>
        )}
      </div>
    </div>
  );
}

function RematchModal({ profile, onClose, onBuy }) {
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>⏰</div>
        <div style={S.modalTitle}>Get Them Back!</div>
        <div style={S.modalSub}>You accidentally passed on someone special</div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 16, textAlign: "center", margin: "16px 0", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 6 }}>{profile?.emoji || "🌺"}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#f8f0ff" }}>{profile?.name || "Amara"}, {profile?.age || 26}</div>
          <div style={{ fontSize: 12, color: "rgba(248,240,255,0.45)", marginTop: 3 }}>{profile?.job || "Fashion Designer"}</div>
        </div>
        <button style={S.btn} onClick={() => onBuy(99, "⏰ Rematch")}>Get Rematch — KES 99 ⏰</button>
        <button style={S.btnGhost} onClick={onClose}>Let them go</button>
      </div>
    </div>
  );
}

function BoostModal({ onClose, onBuy }) {
  return (
    <div style={S.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={S.handle} />
        <div style={{ fontSize: 46, textAlign: "center", marginBottom: 6 }}>🚀</div>
        <div style={S.modalTitle}>Boost Your Profile!</div>
        <div style={S.modalSub}>Be #1 in your area for 1 hour. 10x more views!</div>
        <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, color: "#60a5fa" }}>KES 299</div>
          <div style={{ fontSize: 12, color: "rgba(248,240,255,0.45)" }}>for 1 hour boost</div>
        </div>
        <button style={{ ...S.btn, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }} onClick={() => onBuy(299, "🚀 Profile Boost")}>Activate Boost 🚀</button>
        <button style={S.btnGhost} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  function go() {
    if (!email || !pass) { setErr("Fill in all fields"); return; }
    if (!email.includes("@")) { setErr("Enter a valid email"); return; }
    onLogin({ email, name: email.split("@")[0] });
  }
  return (
    <div style={{ minHeight: "100vh", background: "#0f0a12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 500, height: 500, background: "radial-gradient(circle,rgba(232,67,147,0.1),transparent 70%)", top: -150, right: -150 }} />
      <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)", bottom: -100, left: -100 }} />
      <div style={{ background: "rgba(26,16,32,0.95)", borderRadius: 28, padding: "28px 24px", width: "100%", maxWidth: 380, border: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 6, filter: "drop-shadow(0 8px 24px rgba(232,67,147,0.4))" }}>💘</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 46, fontWeight: 700, background: "linear-gradient(135deg,#e84393,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>spark</div>
          <div style={{ fontSize: 13, color: "rgba(248,240,255,0.45)", marginTop: 6 }}>Find your person in Nairobi ✨</div>
        </div>
        {err && <div style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <label style={S.label}>Email</label>
        <input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />
        <button style={{ ...S.btn, marginTop: 6 }} onClick={go}>Log In 💘</button>
        <button style={S.btnGhost} onClick={onSignup}>New here? Create Account →</button>
      </div>
    </div>
  );
}

function SignupPage({ onSignup, onLogin }) {
  const [f, setF] = useState({ name: "", email: "", pass: "", age: "", job: "", bio: "" });
  const [err, setErr] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  function go() {
    if (!f.name || !f.email || !f.pass || !f.age) { setErr("Fill in required fields"); return; }
    if (parseInt(f.age) < 18) { setErr("Must be 18+"); return; }
    onSignup(f);
  }
  return (
    <div style={{ minHeight: "100vh", background: "#0f0a12", display: "flex", flexDirection: "column", alignItems: "center", padding: 24, paddingTop: 40, overflowY: "auto", position: "relative" }}>
      <div style={{ position: "absolute", width: 500, height: 500, background: "radial-gradient(circle,rgba(232,67,147,0.1),transparent 70%)", top: -150, right: -150 }} />
      <div style={{ background: "rgba(26,16,32,0.95)", borderRadius: 28, padding: "28px 24px", width: "100%", maxWidth: 380, border: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 36, fontWeight: 700, background: "linear-gradient(135deg,#e84393,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>💘 spark</div>
          <div style={{ fontSize: 13, color: "rgba(248,240,255,0.45)", marginTop: 4 }}>Create your profile</div>
        </div>
        {err && <div style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>{err}</div>}
        {[["Full Name *", "name", "text", "Your name"], ["Email *", "email", "email", "you@email.com"], ["Password *", "pass", "password", "Min 6 chars"], ["Age *", "age", "number", "18+"], ["Job", "job", "text", "e.g. Designer"]].map(([label, key, type, ph]) => (
          <div key={key}><label style={S.label}>{label}</label><input style={S.input} type={type} placeholder={ph} value={f[key]} onChange={e => set(key, e.target.value)} /></div>
        ))}
        <label style={S.label}>Bio</label>
        <textarea style={{ ...S.input, height: 70, resize: "none" }} placeholder="Tell people about yourself..." value={f.bio} onChange={e => set("bio", e.target.value)} />
        <button style={S.btn} onClick={go}>Create Account 🎉</button>
        <button style={S.btnGhost} onClick={onLogin}>Already have account? Log in</button>
      </div>
    </div>
  );
}
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("discover");
  const [idx, setIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [busy, setBusy] = useState(false);
  const [superStamp, setSuperStamp] = useState(false);
  const [activeMatch, setActiveMatch] = useState(PROFILES[0]);
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [liked, setLiked] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [maxDist, setMaxDist] = useState(20);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [gender, setGender] = useState("everyone");
  const [isPremium, setIsPremium] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showVIP, setShowVIP] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [showMpesa, setShowMpesa] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const [showSuperLikePack, setShowSuperLikePack] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showSecretAdmirer, setShowSecretAdmirer] = useState(false);
  const [showSparkScore, setShowSparkScore] = useState(false);
  const [showRematch, setShowRematch] = useState(false);
  const [lastSwiped, setLastSwiped] = useState(null);
  const [mpesa, setMpesa] = useState({ amount: 999, plan: "Premium" });
  const [boosted, setBoosted] = useState(false);
  const [spotlit, setSpotlit] = useState(false);
  const [swipesLeft, setSwipesLeft] = useState(DAILY_SWIPE_LIMIT);
  const [superLikes, setSuperLikes] = useState(3);
  const [myPhoto, setMyPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [matchFlash, setMatchFlash] = useState(null);
  const [streak, setStreak] = useState(5);
  const [unreadChat, setUnreadChat] = useState(true);
  const [coupleMode, setCoupleMode] = useState(false);
  const [coupleMatch, setCoupleMatch] = useState(null);
  const chatEnd = useRef(null);

  const filtered = PROFILES.filter(p =>
    p.distance <= maxDist && p.age >= minAge && p.age <= maxAge &&
    (gender === "everyone" || (gender === "men" && p.gender === "man") || (gender === "women" && p.gender === "woman"))
  );
  const current = filtered[idx % Math.max(filtered.length, 1)];
  const next = filtered[(idx + 1) % Math.max(filtered.length, 1)];

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  useEffect(() => {
    if (tab === "chat") {
      const t = setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMsgs(m => [...m, { from: "them", text: "By the way, have you been to Karura Forest? 🌿", read: false }]);
        }, 2500);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [tab, activeMatch]);

  function swipe(dir, isSuper = false) {
    if (busy) return;
    if (!isPremium && swipesLeft <= 0) { setShowPremium(true); return; }
    if (isSuper && superLikes <= 0) { setShowSuperLikePack(true); return; }
    setLastSwiped(current);
    if (isSuper) { setSuperStamp(true); setTimeout(() => setSuperStamp(false), 600); }
    setSwipeDir(dir); setBusy(true);
    if (dir === "right") {
      setLiked(c => c + 1);
      if (Math.random() > 0.5) {
        setMatchFlash(current);
        setTimeout(() => { setMatchFlash(null); setCoupleMode(true); setCoupleMatch(current); }, 2200);
      }
    }
    if (!isPremium) setSwipesLeft(s => s - 1);
    if (isSuper) setSuperLikes(s => s - 1);
    setTimeout(() => { setSwipeDir(null); setBusy(false); setIdx(i => i + 1); }, 440);
  }

  function openMpesa(amount, plan) { setMpesa({ amount, plan }); setShowMpesa(true); }

  function onMpesaSuccess() {
    setShowMpesa(false);
    const p = mpesa.plan;
    if (p.includes("Premium")) { setIsPremium(true); setSuperLikes(5); setSwipesLeft(999); }
    else if (p.includes("VIP")) { setIsVIP(true); setIsPremium(true); setSuperLikes(999); setSwipesLeft(999); }
    else if (p.includes("Boost")) { setBoosted(true); setTimeout(() => setBoosted(false), 3600000); }
    else if (p.includes("Spotlight")) { setSpotlit(true); setTimeout(() => setSpotlit(false), 1800000); }
    else if (p.includes("Super Likes")) { const n = parseInt(p); setSuperLikes(s => s + n); }
    else if (p.includes("Admirer")) { alert("💘 It's Amara! She liked you 3 days ago!"); }
    else if (p.includes("Score")) { setIsPremium(true); }
    else if (p.includes("Rematch")) { setIdx(i => Math.max(0, i - 1)); alert("⏰ They're back in your deck!"); }
    else if (p.includes("Icebreaker")) { setMsgs(m => [...m, { from: "me", text: "❓ " + mpesa.question, read: false }]); }
    else { setMsgs(m => [...m, { from: "me", text: `Sent a gift! ${p.split(" ")[0]} 💝`, read: false }]); }
  }

  function sendMsg() {
    if (!msg.trim()) return;
    setMsgs(m => [...m, { from: "me", text: msg, read: false }]);
    setMsg(""); setUnreadChat(false);
  }

  function fakePhotoUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    setPhotoLoading(true);
    setTimeout(() => { setMyPhoto(URL.createObjectURL(file)); setPhotoLoading(false); }, 900);
  }

  const dark = "#0f0a12";
  const card = "#1a1020";
  const border = "rgba(255,255,255,0.08)";
  const text = "#f8f0ff";
  const muted = "rgba(248,240,255,0.45)";
  const pink = "#e84393";
  const green = "#34d399";
  const blue = "#60a5fa";
  const yellow = "#fbbf24";

  return (
    <div style={{ background: dark, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'DM Sans',sans-serif", color: text, position: "relative" }}>
      {/* BG ORBS */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, background: "radial-gradient(circle,rgba(232,67,147,0.1),transparent 70%)", top: -200, right: -100, animation: "drift 8s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)", bottom: -100, left: -100, animation: "drift 10s ease-in-out infinite alternate-reverse" }} />
      </div>
      <style>{`@keyframes drift{from{transform:translate(0,0)}to{transform:translate(40px,30px)}} @keyframes flyR{to{transform:translateX(150%) rotate(25deg);opacity:0}} @keyframes flyL{to{transform:translateX(-150%) rotate(-25deg);opacity:0}} @keyframes matchIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}} @keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}} @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}} .modal-box-anim{animation:slideUp 0.35s cubic-bezier(.175,.885,.32,1.275) forwards}`}</style>

      {/* MODALS */}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} onUpgrade={() => { setShowPremium(false); openMpesa(999, "Premium Subscription"); }} />}
      {showVIP && <VIPModal onClose={() => setShowVIP(false)} onUpgrade={() => { setShowVIP(false); openMpesa(2499, "VIP Membership"); }} />}
      {showBoost && <BoostModal onClose={() => setShowBoost(false)} onBuy={(a, p) => { setShowBoost(false); openMpesa(a, p); }} />}
      {showGift && <GiftModal match={activeMatch} onClose={() => setShowGift(false)} onSend={g => { setShowGift(false); openMpesa(g.price, `${g.emoji} ${g.name} Gift`); }} />}
      {showIcebreaker && <IcebreakerModal match={activeMatch} onClose={() => setShowIcebreaker(false)} onSend={q => { setShowIcebreaker(false); setMpesa({ amount: 99, plan: "❓ Icebreaker", question: q }); setShowMpesa(true); }} />}
      {showSuperLikePack && <SuperLikePackModal onClose={() => setShowSuperLikePack(false)} onBuy={(p, plan) => { setShowSuperLikePack(false); openMpesa(p, plan); }} />}
      {showSpotlight && <SpotlightModal onClose={() => setShowSpotlight(false)} onBuy={(a, p) => { setShowSpotlight(false); openMpesa(a, p); }} />}
      {showSecretAdmirer && <SecretAdmirerModal onClose={() => setShowSecretAdmirer(false)} onReveal={(a, p) => { setShowSecretAdmirer(false); openMpesa(a, p); }} />}
      {showSparkScore && <SparkScoreModal onClose={() => setShowSparkScore(false)} onUnlock={(a, p) => { setShowSparkScore(false); openMpesa(a, p); }} isPremium={isPremium} />}
      {showRematch && <RematchModal profile={lastSwiped} onClose={() => setShowRematch(false)} onBuy={(a, p) => { setShowRematch(false); openMpesa(a, p); }} />}
      {showMpesa && <MpesaModal amount={mpesa.amount} plan={mpesa.plan} onClose={() => setShowMpesa(false)} onSuccess={onMpesaSuccess} />}

      {/* MATCH FLASH */}
      {matchFlash && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, animation: "matchIn 0.4s ease forwards" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#e84393,#f97316,#8b5cf6)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 64, marginBottom: 4 }}>💘</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: "white", fontStyle: "italic" }}>It's a Match!</div>
            <div style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>You & {matchFlash.name} liked each other</div>
            <div style={{ fontSize: 80, margin: "18px 0" }}>{matchFlash.emoji}</div>
            <button onClick={() => setMatchFlash(null)} style={{ background: "rgba(255,255,255,0.2)", border: "2px solid white", color: "white", padding: "13px 34px", borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", backdropFilter: "blur(10px)" }}>Send a Message 💬</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ width: "100%", maxWidth: 480, background: "rgba(15,10,18,0.9)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, padding: "14px 18px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 24, fontWeight: 700, background: "linear-gradient(135deg,#e84393,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>💘 spark</span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {isVIP && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: "linear-gradient(135deg,#8b5cf6,#e84393)", color: "white" }}>💎 VIP</span>}
              {isPremium && !isVIP && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: "linear-gradient(135deg,#f97316,#e84393)", color: "white" }}>👑 PRO</span>}
              {boosted && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: "#3b82f6", color: "white" }}>🚀</span>}
              {spotlit && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: "linear-gradient(135deg,#f97316,#facc15)", color: "white" }}>🌟</span>}
              {streak >= 3 && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: "linear-gradient(135deg,#f97316,#facc15)", color: "white" }}>🔥{streak}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {!isPremium && <button onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,#f97316,#e84393)", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 10, color: "white", cursor: "pointer", fontWeight: 700 }}>👑 Premium</button>}
            {isPremium && !isVIP && <button onClick={() => setShowVIP(true)} style={{ background: "linear-gradient(135deg,#8b5cf6,#e84393)", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 10, color: "white", cursor: "pointer", fontWeight: 700 }}>💎 VIP</button>}
            <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`, borderRadius: 20, padding: "5px 11px", fontSize: 10, color: muted, cursor: "pointer" }}>Exit</button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {[["discover", "🔍", "Discover"], ["matches", "💞", "Matches"], ["store", "🛍️", "Store"], ["chat", "💬", "Chat"], ["profile", "👤", "Profile"]].map(([key, icon, label]) => (
            <button key={key} onClick={() => { setTab(key); if (key === "chat") setUnreadChat(false); }} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 0 11px", fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, color: tab === key ? pink : muted, borderBottom: `2px solid ${tab === key ? pink : "transparent"}`, transition: "all 0.2s", position: "relative" }}>
              <span style={{ fontSize: 15, display: "block", marginBottom: 2 }}>{icon}</span>{label}
              {key === "chat" && unreadChat && <span style={{ position: "absolute", top: 6, right: "calc(50% - 14px)", width: 7, height: 7, background: pink, borderRadius: "50%", border: `2px solid ${dark}` }} />}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ width: "100%", maxWidth: 480, padding: "14px 14px 100px", flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>

        {/* ── DISCOVER ── */}
        {tab === "discover" && (
          <div>
            {/* STREAK */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 14, padding: "10px 14px", marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: yellow }}>{streak} Day Streak!</div>
                <div style={{ fontSize: 11, color: muted }}>Keep going for a free Super Like</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <div key={d} style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: d < streak ? "linear-gradient(135deg,#f97316,#facc15)" : d === streak ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.04)", border: d === streak ? `2px solid ${yellow}` : `1px solid ${border}`, color: d < streak ? "white" : d === streak ? yellow : muted }}>
                    {d < streak ? "✓" : d}
                  </div>
                ))}
              </div>
            </div>

            {/* SPARK SCORE */}
            <div onClick={() => setShowSparkScore(true)} style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.1),rgba(232,67,147,0.07))", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 18, padding: 14, marginBottom: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Your Spark Score</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, background: "linear-gradient(135deg,#8b5cf6,#e84393)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: isPremium ? "none" : "blur(7px)" }}>87</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{isPremium ? "Top 13% in Nairobi 🔥" : "Tap to unlock →"}</div>
              </div>
              <div style={{ fontSize: 32 }}>🏅</div>
            </div>

            {/* SECRET ADMIRER */}
            <div onClick={() => setShowSecretAdmirer(true)} style={{ background: "linear-gradient(135deg,rgba(232,67,147,0.08),rgba(139,92,246,0.06))", border: "1px solid rgba(232,67,147,0.2)", borderRadius: 18, padding: 16, marginBottom: 12, cursor: "pointer", textAlign: "center" }}>
              <span style={{ fontSize: 36, display: "block", marginBottom: 6 }}>💌</span>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, marginBottom: 3 }}>{PROFILES.length} Secret Admirers</div>
              <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                {PROFILES.slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${p.color}88,${p.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginLeft: i > 0 ? -10 : 0, border: `3px solid ${dark}`, filter: "blur(3px)" }}>{p.emoji}</div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: pink, fontWeight: 700 }}>Reveal one for KES 199 →</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: muted }}>❤️ {liked} liked • {isPremium ? "∞" : swipesLeft + "/10"} swipes • ⭐ {superLikes}</span>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={() => setShowBoost(true)} style={{ background: boosted ? "#3b82f6" : "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "6px 12px", fontSize: 10, color: boosted ? "white" : blue, cursor: "pointer", fontWeight: 700 }}>🚀 Boost</button>
                <button onClick={() => setShowFilter(f => !f)} style={{ background: showFilter ? pink : "rgba(232,67,147,0.1)", border: "1px solid rgba(232,67,147,0.2)", borderRadius: 20, padding: "6px 12px", fontSize: 10, color: showFilter ? "white" : pink, cursor: "pointer", fontWeight: 700 }}>⚙️ Filter</button>
                <button onClick={() => setShowRematch(true)} style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "6px 12px", fontSize: 10, color: green, cursor: "pointer", fontWeight: 700 }}>↩️</button>
              </div>
            </div>

            {!isPremium && swipesLeft <= 3 && (
              <div onClick={() => setShowPremium(true)} style={{ background: "rgba(249,115,22,0.08)", border: "1.5px solid rgba(249,115,22,0.25)", borderRadius: 13, padding: "9px 14px", marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#f97316", fontWeight: 700 }}>⚠️ Only {swipesLeft} swipes left!</span>
                <span style={{ fontSize: 12, color: pink, fontWeight: 700 }}>Go Premium →</span>
              </div>
            )}

            {showFilter && (
              <div style={{ background: card, borderRadius: 18, padding: 18, marginBottom: 12, border: `1px solid ${border}` }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: text }}>🎯 Filter Profiles</div>
                <label style={S.label}>📍 Distance: <strong style={{ color: pink }}>{maxDist}km</strong></label>
                <input type="range" min={1} max={50} value={maxDist} onChange={e => { setMaxDist(+e.target.value); setIdx(0); }} style={{ width: "100%", accentColor: pink, marginBottom: 14 }} />
                <label style={S.label}>🎂 Age: <strong style={{ color: pink }}>{minAge}–{maxAge}</strong></label>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  {[["Min", minAge, v => setMinAge(v)], ["Max", maxAge, v => setMaxAge(v)]].map(([l, val, fn]) => (
                    <div key={l} style={{ flex: 1 }}><div style={{ fontSize: 10, color: muted, marginBottom: 3 }}>{l}</div><input type="range" min={18} max={60} value={val} onChange={e => { fn(+e.target.value); setIdx(0); }} style={{ width: "100%", accentColor: pink }} /></div>
                  ))}
                </div>
                <label style={S.label}>👤 Show me</label>
                <div style={{ display: "flex", gap: 7 }}>
                  {["everyone", "men", "women"].map(g => (
                    <button key={g} onClick={() => { setGender(g); setIdx(0); }} style={{ flex: 1, padding: "7px 0", borderRadius: 50, border: `1.5px solid ${gender === g ? pink : border}`, background: gender === g ? pink : "transparent", color: gender === g ? "white" : muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize" }}>{g}</button>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: muted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
                <div>No one matches your filters</div>
              </div>
            ) : (
              <>
                <div style={{ position: "relative", height: 420, marginBottom: 16 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: `linear-gradient(160deg,${next?.color}18,${next?.color}38)`, transform: "scale(0.94) translateY(12px)", border: `1px solid ${border}` }} />
                  <div className={swipeDir === "right" ? "fly-r" : swipeDir === "left" ? "fly-l" : ""} style={{ position: "absolute", inset: 0, borderRadius: 28, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", ...(swipeDir ? { animation: `${swipeDir === "right" ? "flyR" : "flyL"} 0.42s ease forwards` } : {}) }}>
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg,${current?.color}28,${current?.color}65)` }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 25%,rgba(0,0,0,0.95) 100%)" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-65%)", fontSize: 90, filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.5))" }}>{current?.emoji}</div>
                    <div style={{ position: "absolute", top: 24, left: 18, background: "linear-gradient(135deg,#e84393,#f97316)", color: "white", fontSize: 20, fontWeight: 900, padding: "7px 16px", borderRadius: 11, border: "3px solid white", opacity: swipeDir === "right" ? 1 : 0, transform: "rotate(-15deg)", fontFamily: "'Cormorant Garamond',serif", letterSpacing: 1 }}>LIKE</div>
                    <div style={{ position: "absolute", top: 24, right: 18, background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white", fontSize: 20, fontWeight: 900, padding: "7px 16px", borderRadius: 11, border: "3px solid white", opacity: swipeDir === "left" ? 1 : 0, transform: "rotate(15deg)", fontFamily: "'Cormorant Garamond',serif", letterSpacing: 1 }}>NOPE</div>
                    {superStamp && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", fontSize: 18, fontWeight: 900, padding: "10px 20px", borderRadius: 14, border: "3px solid white", fontFamily: "'Cormorant Garamond',serif", letterSpacing: 1 }}>⭐ SUPER LIKE!</div>}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: "white" }}>{current?.name}, {current?.age}</span>
                        {current?.verified && <span style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>✓ Verified</span>}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 8 }}>💼 {current?.job} • 📍 {current?.distance}km</div>
                      <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, lineHeight: 1.55, marginBottom: 10 }}>{current?.bio}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {current?.tags.map(t => <span key={t} style={{ padding: "4px 11px", borderRadius: 20, fontSize: 10, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)", color: "white", background: "rgba(255,255,255,0.1)" }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <button onClick={() => swipe("left")} style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.35)", fontSize: 22, cursor: "pointer", color: "#ef4444", transition: "transform 0.15s" }}>✕</button>
                  <button onClick={() => swipe("right", true)} style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(59,130,246,0.1)", border: "2px solid rgba(59,130,246,0.3)", fontSize: 18, cursor: "pointer", opacity: superLikes > 0 ? 1 : 0.35 }}>⭐</button>
                  <button onClick={() => swipe("right")} style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#e84393,#f97316)", border: "none", fontSize: 30, cursor: "pointer", color: "white", boxShadow: "0 8px 28px rgba(232,67,147,0.5)" }}>♥</button>
                  <button onClick={() => setShowSpotlight(true)} style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(249,115,22,0.1)", border: "2px solid rgba(249,115,22,0.3)", fontSize: 18, cursor: "pointer" }}>🌟</button>
                  <button onClick={() => lastSwiped ? setShowRematch(true) : null} style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "2px solid rgba(52,211,153,0.3)", fontSize: 20, cursor: "pointer", opacity: lastSwiped ? 1 : 0.35 }}>↩️</button>
                </div>
                <div style={{ margin: "8px 0", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(232,67,147,0.12)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: 1 }}>AD</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Google AdSense</span>
                </div>
              </>
            )}
          </div>
        )}
        {/* ── MATCHES ── */}
        {tab === "matches" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>👁️ Profile Visitors</div>
                {!isPremium && <span onClick={() => setShowPremium(true)} style={{ fontSize: 11, color: pink, fontWeight: 700, cursor: "pointer" }}>Unlock →</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
                {PROFILES.slice(0, 6).map((p, i) => (
                  <div key={p.id} onClick={() => !isPremium && setShowPremium(true)} style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "1", position: "relative", cursor: "pointer", border: `2px solid ${border}`, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, background: `linear-gradient(135deg,${p.color}44,${p.color}88)`, filter: isPremium ? "none" : "blur(4px)" }}>{p.emoji}</div>
                    {!isPremium && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔒</div>}
                    {isPremium && <div style={{ position: "absolute", bottom: 5, left: 5, right: 5, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "2px 6px", fontSize: 10, fontWeight: 700, color: "white" }}>{p.name}</div>}
                  </div>
                ))}
              </div>
            </div>
            {!isPremium && (
              <div onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,rgba(232,67,147,0.08),rgba(249,115,22,0.05))", border: "1.5px solid rgba(232,67,147,0.2)", borderRadius: 18, padding: 16, marginBottom: 14, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>👀</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: pink, fontSize: 18 }}>See who liked you!</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>Upgrade to Premium to unlock</div>
              </div>
            )}
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Your Matches 💞</div>
            {PROFILES.slice(0, 6).map((m, i) => (
              <div key={m.id}>
                <div onClick={() => { setActiveMatch(m); setTab("chat"); setUnreadChat(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: card, borderRadius: 18, cursor: "pointer", border: `1px solid ${border}`, marginBottom: 9, transition: "all 0.2s" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,${m.color}66,${m.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, position: "relative", flexShrink: 0 }}>
                    {m.emoji}
                    {m.verified && <span style={{ position: "absolute", bottom: -1, right: -1, background: blue, borderRadius: "50%", width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: "white", fontWeight: 800, border: `2px solid ${dark}` }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: text }}>{m.name}, {m.age}</div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>💼 {m.job} • 📍 {m.distance}km</div>
                  </div>
                  {i === 0 && <div style={{ width: 8, height: 8, background: pink, borderRadius: "50%", flexShrink: 0 }} />}
                  <div style={{ background: "rgba(232,67,147,0.12)", borderRadius: 12, padding: "5px 11px", fontSize: 11, color: pink, fontWeight: 700, flexShrink: 0 }}>Chat 💬</div>
                </div>
                {i === 2 && <div style={{ margin: "8px 0", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(232,67,147,0.12)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: 1 }}>AD</span><span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Google AdSense</span></div>}
              </div>
            ))}
          </div>
        )}

        {/* ── STORE ── */}
        {tab === "store" && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Spark Store 🛍️</div>
              <div style={{ fontSize: 13, color: muted }}>Boost your chances of finding love</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Memberships</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <div onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,rgba(232,67,147,0.1),rgba(249,115,22,0.07))", border: "1.5px solid rgba(232,67,147,0.25)", borderRadius: 18, padding: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: text }}>👑 Premium</div><div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Unlimited swipes, visitors, read receipts + more</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800, color: pink }}>KES 999</div><div style={{ fontSize: 10, color: muted }}>per month</div></div>
              </div>
              <div onClick={() => setShowVIP(true)} style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(232,67,147,0.08))", border: "1.5px solid rgba(139,92,246,0.3)", borderRadius: 18, padding: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: text }}>💎 VIP</div><div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Everything + curated matches + gift credit</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800, color: "#a78bfa" }}>KES 2,499</div><div style={{ fontSize: 10, color: muted }}>per month</div></div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Power-Ups</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                ["⭐", "Super Likes", "Stand out. Get noticed instantly.", "From KES 199", () => setShowSuperLikePack(true), "Hot 🔥"],
                ["🚀", "Profile Boost", "Be #1 in your area for 1 hour.", "KES 299", () => setShowBoost(true), null],
                ["🌟", "Spotlight", "Shown to 100 targeted people for 30 mins.", "KES 199", () => setShowSpotlight(true), null],
                ["💌", "Secret Admirer", "Reveal someone who secretly liked you.", "KES 199", () => setShowSecretAdmirer(true), null],
                ["🏅", "Spark Score", "Your attractiveness score based on real swipes.", "KES 149", () => setShowSparkScore(true), "Viral 🔥"],
                ["⏰", "Rematch", "Get back someone you accidentally passed.", "KES 99", () => setShowRematch(true), null],
                ["❓", "Icebreaker", "Send a fun question before matching.", "KES 99", () => setShowIcebreaker(true), null],
                ["🎁", "Send a Gift", "Roses, diamonds, chocolates and more.", "From KES 99", () => { setActiveMatch(PROFILES[0]); setShowGift(true); }, null],
              ].map(([icon, name, desc, price, action, badge]) => (
                <div key={name} onClick={action} style={{ background: card, borderRadius: 18, padding: 16, border: `1px solid ${border}`, textAlign: "center", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
                  {badge && <div style={{ position: "absolute", top: 10, right: 10, background: "linear-gradient(135deg,#e84393,#f97316)", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>{badge}</div>}
                  <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{icon}</span>
                  <div style={{ fontWeight: 700, fontSize: 13, color: text, marginBottom: 3 }}>{name}</div>
                  <div style={{ fontSize: 11, color: muted, marginBottom: 10, lineHeight: 1.4 }}>{desc}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: pink }}>{price}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Privacy & Extras</div>
            {[
              ["🎭", "Anonymous Browse", "Browse without appearing in visitors lists.", "KES 199/month", () => openMpesa(199, "🎭 Anonymous Browse")],
              ["💑", "Couples Mode", "Shared space + countdown + photo album with your match.", "KES 299/month", () => openMpesa(299, "💑 Couples Mode")],
            ].map(([icon, name, desc, price, action]) => (
              <div key={name} onClick={action} style={{ background: card, borderRadius: 18, padding: 16, border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 10, transition: "all 0.2s" }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: text, marginBottom: 3 }}>{name}</div>
                  <div style={{ fontSize: 11, color: muted, marginBottom: 6 }}>{desc}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: pink }}>{price}</div>
                </div>
              </div>
            ))}
            <div style={{ margin: "10px 0", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(232,67,147,0.12)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: 1 }}>AD</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Google AdSense</span>
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", background: card, borderRadius: 17, marginBottom: 12, border: `1px solid ${border}` }}>
              <button onClick={() => setTab("matches")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: pink, padding: 0 }}>←</button>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: activeMatch ? `linear-gradient(135deg,${activeMatch.color}66,${activeMatch.color})` : "linear-gradient(135deg,#e84393,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{activeMatch?.emoji || "🌺"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: text }}>{activeMatch?.name || "Amara"}</div>
                <div style={{ fontSize: 11, color: green, fontWeight: 600, marginTop: 1 }}>● Online now</div>
              </div>
              <button onClick={() => setShowIcebreaker(true)} style={{ background: "rgba(232,67,147,0.12)", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 11, color: pink, cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>❓</button>
              <button onClick={() => setShowGift(true)} style={{ background: "rgba(232,67,147,0.12)", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 11, color: pink, cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", marginLeft: 4 }}>🎁</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 6 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "78%", padding: "10px 15px", fontSize: 14, lineHeight: 1.5, borderRadius: m.from === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", background: m.from === "me" ? "linear-gradient(135deg,#e84393,#f97316)" : card, color: m.from === "me" ? "white" : text, boxShadow: m.from === "me" ? "0 4px 14px rgba(232,67,147,0.28)" : "none", border: m.from !== "me" ? `1px solid ${border}` : "none" }}>{m.text}</div>
                  {m.from === "me" && isPremium && <div style={{ fontSize: 10, color: muted, marginTop: -4, marginRight: 2 }}>{m.read ? "✓✓ Read" : "✓ Sent"}</div>}
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 14px", background: card, borderRadius: "20px 20px 20px 4px", border: `1px solid ${border}` }}>
                    {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: muted, animation: `typingBounce 1.2s ease ${d}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 10, borderTop: `1px solid ${border}` }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && msg.trim() && sendMsg()} placeholder="Type a message..." style={{ flex: 1, padding: "11px 16px", borderRadius: 24, border: `1.5px solid ${border}`, background: card, color: text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} />
              <button onClick={sendMsg} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#e84393,#f97316)", color: "white", fontSize: 17, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 12px" }}>
                {myPhoto ? <img src={myPhoto} alt="me" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: `3px solid ${pink}`, boxShadow: "0 0 0 4px rgba(232,67,147,0.18)" }} /> : <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#e84393,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, boxShadow: "0 0 0 4px rgba(232,67,147,0.18)" }}>😊</div>}
                <label style={{ position: "absolute", bottom: 0, right: 0, background: pink, borderRadius: "50%", width: 27, height: 27, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${dark}`, fontSize: 12 }}>
                  {photoLoading ? "⏳" : "📷"}
                  <input type="file" accept="image/*" onChange={fakePhotoUpload} style={{ display: "none" }} />
                </label>
              </div>
              {photoLoading && <div style={{ fontSize: 11, color: pink, marginBottom: 4 }}>Uploading... ⏳</div>}
              {myPhoto && !photoLoading && <div style={{ fontSize: 11, color: green, marginBottom: 4 }}>✅ Photo saved!</div>}
              <div style={{ fontSize: 10, color: muted, marginBottom: 10 }}>Tap 📷 to update photo</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: text }}>{user.name}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>{user.email}</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                {isVIP && <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: "linear-gradient(135deg,#8b5cf6,#e84393)", color: "white" }}>💎 VIP Member</span>}
                {isPremium && !isVIP && <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: "linear-gradient(135deg,#f97316,#e84393)", color: "white" }}>👑 Premium</span>}
                {streak >= 3 && <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: "linear-gradient(135deg,#f97316,#facc15)", color: "white" }}>🔥 {streak} Day Streak</span>}
              </div>
            </div>

            {coupleMode && coupleMatch && (
              <div style={{ background: "linear-gradient(135deg,rgba(232,67,147,0.1),rgba(139,92,246,0.08))", border: "1px solid rgba(232,67,147,0.2)", borderRadius: 20, padding: 16, marginBottom: 11 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, marginBottom: 4, color: text }}>💑 Couples Mode</div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 12 }}>You matched with {coupleMatch.name}!</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#e84393,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>😊</div>
                  <div style={{ fontSize: 18, color: pink }}>❤️</div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${coupleMatch.color}66,${coupleMatch.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{coupleMatch.emoji}</div>
                  <div style={{ flex: 1, fontSize: 12, color: muted }}>Together since today 🥰</div>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: pink, textAlign: "center", margin: "8px 0" }}>Day 1 💘</div>
                <button onClick={() => openMpesa(299, "💑 Couples Mode")} style={{ background: "rgba(232,67,147,0.15)", border: "1px solid rgba(232,67,147,0.2)", borderRadius: 12, padding: "9px 16px", color: pink, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "'DM Sans',sans-serif" }}>Unlock Full Couples Mode — KES 299</button>
              </div>
            )}

            {!isPremium && (
              <div onClick={() => setShowPremium(true)} style={{ background: "linear-gradient(135deg,rgba(232,67,147,0.08),rgba(249,115,22,0.05))", border: "1.5px solid rgba(232,67,147,0.2)", borderRadius: 18, padding: 18, marginBottom: 11, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>👑</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: pink, fontSize: 18 }}>Upgrade to Premium</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>KES 999/month via Mpesa 💚</div>
              </div>
            )}
            {isPremium && !isVIP && (
              <div onClick={() => setShowVIP(true)} style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(232,67,147,0.08))", border: "1.5px solid rgba(139,92,246,0.3)", borderRadius: 18, padding: 18, marginBottom: 11, cursor: "pointer" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>💎</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: "#a78bfa", fontSize: 18 }}>Upgrade to VIP</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>Curated matches + gift credit — KES 2,499/month</div>
              </div>
            )}

            <div style={S.card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Your Info</div>
              {[["Age", user.age || "Not set"], ["Job", user.job || "Not set"], ["Bio", user.bio || "Not set"], ["Spark Score", isPremium ? "87 🔥" : "🔒 Locked"], ["Streak", `🔥 ${streak} days`], ["Super Likes", `⭐ ${superLikes} left`], ["Plan", isVIP ? "💎 VIP" : isPremium ? "👑 Premium" : "Free"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${border}` }}>
                  <span style={{ color: muted, fontSize: 13 }}>{k}</span>
                  <span style={{ color: k === "Plan" && (isPremium || isVIP) ? pink : k === "Spark Score" && isPremium ? yellow : text, fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ margin: "10px 0 12px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(232,67,147,0.12)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: 1 }}>AD</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Google AdSense</span>
            </div>
            <button onClick={() => setShowBoost(true)} style={{ ...S.btnGhost, borderColor: "rgba(59,130,246,0.3)", color: blue, marginBottom: 10 }}>🚀 Boost Profile — KES 299</button>
            <button onClick={onLogout} style={S.btnGhost}>Log Out</button>
          </div>
        )}

      </div>
    </div>
  );
}
export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  if (screen === "login") return <LoginPage onLogin={u => { setUser(u); setScreen("app"); }} onSignup={() => setScreen("signup")} />;
  if (screen === "signup") return <SignupPage onSignup={u => { setUser(u); setScreen("app"); }} onLogin={() => setScreen("login")} />;
  return <MainApp user={user} onLogout={() => { setUser(null); setScreen("login"); }} />;
}
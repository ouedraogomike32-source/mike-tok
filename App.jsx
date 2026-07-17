import React, { useState, useRef, useEffect, useMemo } from "react";
import { Heart, MessageCircle, Share2, Music2, Plus, Home, Compass, Send, UserCircle2, X, Search, Upload as UploadIcon, Play } from "lucide-react";

const PALETTE = {
  void: "#0A0A0F",
  surface: "#15151D",
  surfaceHi: "#1E1E28",
  violet: "#8B5CF6",
  coral: "#FF5C7C",
  text: "#F5F5F7",
  dim: "#8A8A94",
};

const GRADIENTS = [
  "linear-gradient(160deg,#3A1C71,#D76D77,#FFAF7B)",
  "linear-gradient(160deg,#0F2027,#203A43,#2C5364)",
  "linear-gradient(160deg,#8E2DE2,#4A00E0)",
  "linear-gradient(160deg,#FF512F,#DD2476)",
  "linear-gradient(160deg,#1D2B64,#F8CDDA)",
  "linear-gradient(160deg,#134E5E,#71B280)",
];

const seedVideos = [
  { id: "v1", user: "lucie.cre", avatar: "L", caption: "Recette rapide de pâtes crémeuses 🍝 #cuisine", song: "Son original - lucie.cre", likes: 12400, comments: [
    { id: 1, user: "marco_92", text: "Ça a l'air délicieux !" },
    { id: 2, user: "fannyb", text: "La recette stp 🙏" },
  ], shares: 320, following: true, score: 0.9 },
  { id: "v2", user: "danse.studio", avatar: "D", caption: "Nouvelle choré de la semaine 💃", song: "Beat électro - DJ Nox", likes: 45200, comments: [
    { id: 1, user: "yasmine", text: "Trop stylé !!" },
  ], shares: 980, following: false, score: 0.98 },
  { id: "v3", user: "voyageur.paul", avatar: "P", caption: "Coucher de soleil à Lisbonne 🌅", song: "Son original - voyageur.paul", likes: 8900, comments: [], shares: 150, following: false, score: 0.6 },
  { id: "v4", user: "techavecleo", avatar: "T", caption: "3 astuces pour coder plus vite ⌨️", song: "Lo-fi chill", likes: 15700, comments: [
    { id: 1, user: "devjunior", text: "Merci pour le tip !" },
  ], shares: 610, following: true, score: 0.75 },
  { id: "v5", user: "chatmalicieux", avatar: "C", caption: "Il a encore renversé sa gamelle 😹", song: "Son original - chatmalicieux", likes: 68000, comments: [], shares: 2100, following: false, score: 0.95 },
];

const seedConversations = [
  { id: "c1", user: "marco_92", avatar: "M", last: "Ça a l'air délicieux !", unread: 1, messages: [
    { from: "them", text: "Salut ! J'ai vu ta vidéo de pâtes" },
    { from: "them", text: "Ça a l'air délicieux !" },
  ]},
  { id: "c2", user: "yasmine", avatar: "Y", last: "On se motive pour la choré ?", unread: 0, messages: [
    { from: "me", text: "Salut ! Ta danse est top" },
    { from: "them", text: "Merci beaucoup 🥰" },
    { from: "them", text: "On se motive pour la choré ?" },
  ]},
];

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function ActionRail({ video, liked, onLike, onOpenComments, onShare, onFollow }) {
  return (
    <div className="flex flex-col items-center gap-5 pb-2">
      <button
        onClick={onFollow}
        className="relative w-11 h-11 rounded-full overflow-hidden border-2 flex items-center justify-center text-sm font-bold"
        style={{ borderColor: video.following ? PALETTE.coral : "white", background: GRADIENTS[video.avatar.charCodeAt(0) % GRADIENTS.length] }}
        aria-label={video.following ? "Ne plus suivre" : "Suivre"}
      >
        {video.avatar}
        {!video.following && (
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: PALETTE.coral }}>
            <Plus size={11} strokeWidth={3} color="white" />
          </span>
        )}
      </button>

      <button onClick={onLike} className="flex flex-col items-center gap-1 group" aria-label="J'aime">
        <Heart
          size={30}
          strokeWidth={2}
          fill={liked ? PALETTE.coral : "none"}
          color={liked ? PALETTE.coral : "white"}
          style={{ transform: liked ? "scale(1.15)" : "scale(1)", transition: "transform 160ms ease" }}
        />
        <span className="text-xs font-semibold text-white">{formatCount(video.likes + (liked ? 1 : 0))}</span>
      </button>

      <button onClick={onOpenComments} className="flex flex-col items-center gap-1" aria-label="Commentaires">
        <MessageCircle size={28} color="white" />
        <span className="text-xs font-semibold text-white">{formatCount(video.comments.length)}</span>
      </button>

      <button onClick={onShare} className="flex flex-col items-center gap-1" aria-label="Partager">
        <Share2 size={27} color="white" />
        <span className="text-xs font-semibold text-white">{formatCount(video.shares)}</span>
      </button>

      <div
        className="w-9 h-9 rounded-full flex items-center justify-center mt-1 spin-disc"
        style={{ background: `conic-gradient(from 0deg, #111 0 20%, ${PALETTE.violet} 20% 40%, #111 40% 60%, ${PALETTE.coral} 60% 80%, #111 80% 100%)`, boxShadow: "0 0 0 3px #0A0A0F" }}
      >
        <div className="w-3.5 h-3.5 rounded-full" style={{ background: GRADIENTS[video.avatar.charCodeAt(0) % GRADIENTS.length] }} />
      </div>
    </div>
  );
}

function VideoCard({ video, active, liked, onLike, onOpenComments, onFollow }) {
  return (
    <div className="relative w-full h-full flex-shrink-0 snap-start overflow-hidden" style={{ background: GRADIENTS[seedVideos.indexOf(video) % GRADIENTS.length] }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {!active && <Play size={54} color="rgba(255,255,255,0.55)" />}
      </div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 45%)" }} />

      <div className="absolute left-0 right-16 bottom-4 px-4 text-white">
        <p className="font-bold text-[15px]">@{video.user}</p>
        <p className="text-sm mt-1 leading-snug">{video.caption}</p>
        <div className="flex items-center gap-1.5 mt-2 text-xs opacity-90">
          <Music2 size={13} />
          <span className="truncate">{video.song}</span>
        </div>
      </div>

      <div className="absolute right-2 bottom-4">
        <ActionRail
          video={video}
          liked={liked}
          onLike={onLike}
          onOpenComments={onOpenComments}
          onShare={() => {}}
          onFollow={onFollow}
        />
      </div>
    </div>
  );
}

function CommentsDrawer({ video, onClose, onAddComment }) {
  const [text, setText] = useState("");
  return (
    <div className="absolute inset-0 z-30 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full rounded-t-2xl flex flex-col"
        style={{ background: PALETTE.surface, height: "62%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#26262f" }}>
          <p className="text-white font-semibold text-sm">{video.comments.length} commentaires</p>
          <button onClick={onClose} aria-label="Fermer"><X size={20} color={PALETTE.dim} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {video.comments.length === 0 && (
            <p className="text-sm mt-6 text-center" style={{ color: PALETTE.dim }}>Aucun commentaire. Lance la discussion.</p>
          )}
          {video.comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: GRADIENTS[c.id % GRADIENTS.length] }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: PALETTE.dim }}>@{c.user}</p>
                <p className="text-sm text-white">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 px-3 py-3 border-t"
          style={{ borderColor: "#26262f" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onAddComment(text.trim());
            setText("");
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1 rounded-full px-4 py-2 text-sm text-white outline-none"
            style={{ background: PALETTE.surfaceHi }}
          />
          <button type="submit" aria-label="Envoyer" style={{ color: PALETTE.violet }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

function FeedScreen({ videos, setVideos, likedIds, setLikedIds, feedMode, setFeedMode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentsFor, setCommentsFor] = useState(null);
  const containerRef = useRef(null);

  const displayed = useMemo(() => {
    const list = feedMode === "abonnements" ? videos.filter((v) => v.following) : videos;
    return [...list].sort((a, b) => (feedMode === "pourtoi" ? b.score - a.score : 0));
  }, [videos, feedMode]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [displayed.length]);

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFollow = (id) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, following: !v.following } : v)));
  };

  const addComment = (id, text) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, comments: [...v.comments, { id: v.comments.length + 1, user: "moi", text }] }
          : v
      )
    );
  };

  const activeVideo = commentsFor && videos.find((v) => v.id === commentsFor);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-0 right-0 z-20 flex justify-center gap-6 text-sm font-semibold">
        {[
          { key: "abonnements", label: "Abonnements" },
          { key: "pourtoi", label: "Pour toi" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFeedMode(t.key)}
            className="pb-1"
            style={{
              color: feedMode === t.key ? "white" : "rgba(255,255,255,0.5)",
              borderBottom: feedMode === t.key ? `2px solid white` : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {displayed.length === 0 && (
          <div className="w-full h-full flex items-center justify-center px-8 text-center" style={{ color: PALETTE.dim }}>
            Suis des créateurs pour remplir ce fil.
          </div>
        )}
        {displayed.map((v, i) => (
          <div key={v.id} className="w-full h-full snap-start">
            <VideoCard
              video={v}
              active={i === activeIndex}
              liked={likedIds.has(v.id)}
              onLike={() => toggleLike(v.id)}
              onOpenComments={() => setCommentsFor(v.id)}
              onFollow={() => toggleFollow(v.id)}
            />
          </div>
        ))}
      </div>

      {activeVideo && (
        <CommentsDrawer
          video={activeVideo}
          onClose={() => setCommentsFor(null)}
          onAddComment={(text) => addComment(activeVideo.id, text)}
        />
      )}
    </div>
  );
}

function DiscoverScreen({ videos }) {
  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: PALETTE.void }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: PALETTE.void }}>
        <div className="flex items-center gap-2 rounded-full px-3 py-2" style={{ background: PALETTE.surface }}>
          <Search size={16} color={PALETTE.dim} />
          <input placeholder="Rechercher" className="bg-transparent outline-none text-sm text-white flex-1" style={{ caretColor: PALETTE.violet }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {videos.map((v, i) => (
          <div key={v.id} className="aspect-[9/16] relative" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white text-[11px] font-semibold">
              <Play size={11} fill="white" />
              {formatCount(v.likes)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadScreen({ onPublish }) {
  const [caption, setCaption] = useState("");
  const [published, setPublished] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8" style={{ background: PALETTE.void }}>
      {published ? (
        <div className="text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: PALETTE.violet }}>
            <UploadIcon size={24} color="white" />
          </div>
          <p className="text-white font-semibold">Publié !</p>
          <p className="text-sm mt-1" style={{ color: PALETTE.dim }}>Ta vidéo apparaît maintenant dans le fil "Pour toi".</p>
          <button
            className="mt-5 px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: PALETTE.surfaceHi }}
            onClick={() => { setPublished(false); setCaption(""); }}
          >
            Publier une autre vidéo
          </button>
        </div>
      ) : (
        <>
          <div
            className="w-40 h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 mb-6"
            style={{ borderColor: "#33333f" }}
          >
            <UploadIcon size={26} color={PALETTE.dim} />
            <p className="text-xs text-center px-3" style={{ color: PALETTE.dim }}>Glisse une vidéo ou clique pour choisir un fichier</p>
          </div>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Écris une légende..."
            className="w-full max-w-xs rounded-xl px-4 py-3 text-sm text-white outline-none mb-4"
            style={{ background: PALETTE.surface }}
          />
          <button
            onClick={() => {
              onPublish(caption || "Nouvelle vidéo ✨");
              setPublished(true);
            }}
            className="w-full max-w-xs py-3 rounded-full font-semibold text-white text-sm"
            style={{ background: `linear-gradient(90deg, ${PALETTE.violet}, ${PALETTE.coral})` }}
          >
            Publier
          </button>
        </>
      )}
    </div>
  );
}

function InboxScreen() {
  const [conversations, setConversations] = useState(seedConversations);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState("");

  const openConv = conversations.find((c) => c.id === openId);

  const sendMessage = () => {
    if (!draft.trim() || !openConv) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === openId ? { ...c, messages: [...c.messages, { from: "me", text: draft.trim() }], last: draft.trim(), unread: 0 } : c
      )
    );
    setDraft("");
  };

  if (openConv) {
    return (
      <div className="w-full h-full flex flex-col" style={{ background: PALETTE.void }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "#1f1f28" }}>
          <button onClick={() => setOpenId(null)} aria-label="Retour"><X size={18} color="white" /></button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: GRADIENTS[1] }}>{openConv.avatar}</div>
          <p className="text-white font-semibold text-sm">@{openConv.user}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {openConv.messages.map((m, i) => (
            <div key={i} className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm text-white ${m.from === "me" ? "ml-auto" : ""}`}
              style={{ background: m.from === "me" ? PALETTE.violet : PALETTE.surface }}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-3 border-t" style={{ borderColor: "#1f1f28" }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Message..."
            className="flex-1 rounded-full px-4 py-2 text-sm text-white outline-none"
            style={{ background: PALETTE.surface }}
          />
          <button onClick={sendMessage} aria-label="Envoyer" style={{ color: PALETTE.violet }}><Send size={20} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: PALETTE.void }}>
      <p className="text-white font-bold text-lg px-4 pt-5 pb-3">Messages</p>
      {conversations.map((c) => (
        <button key={c.id} onClick={() => setOpenId(c.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left" style={{ borderBottom: "1px solid #1a1a22" }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: GRADIENTS[c.id.charCodeAt(1) % GRADIENTS.length] }}>{c.avatar}</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">@{c.user}</p>
            <p className="text-xs truncate" style={{ color: PALETTE.dim }}>{c.last}</p>
          </div>
          {c.unread > 0 && (
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PALETTE.coral }} />
          )}
        </button>
      ))}
    </div>
  );
}

function ProfileScreen({ videos, likedIds }) {
  const mine = videos.filter((v) => v.following);
  return (
    <div className="w-full h-full overflow-y-auto px-5 pt-6" style={{ background: PALETTE.void }}>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${PALETTE.violet}, ${PALETTE.coral})` }}>M</div>
        <p className="text-white font-bold mt-3">@moi.perso</p>
        <div className="flex gap-6 mt-4 text-center">
          <div><p className="text-white font-bold">{mine.length}</p><p className="text-xs" style={{ color: PALETTE.dim }}>Abonnements</p></div>
          <div><p className="text-white font-bold">128</p><p className="text-xs" style={{ color: PALETTE.dim }}>Abonnés</p></div>
          <div><p className="text-white font-bold">{formatCount(likedIds.size)}</p><p className="text-xs" style={{ color: PALETTE.dim }}>J'aime</p></div>
        </div>
        <button className="mt-4 px-8 py-2 rounded-full text-sm font-semibold text-white" style={{ background: PALETTE.surfaceHi }}>Modifier le profil</button>
      </div>
      <p className="text-sm font-semibold mt-8 mb-2" style={{ color: PALETTE.dim }}>Vidéos aimées</p>
      <div className="grid grid-cols-3 gap-0.5">
        {videos.filter((v) => likedIds.has(v.id)).map((v, i) => (
          <div key={v.id} className="aspect-[9/16]" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />
        ))}
        {videos.filter((v) => likedIds.has(v.id)).length === 0 && (
          <p className="col-span-3 text-sm text-center py-6" style={{ color: PALETTE.dim }}>Aucune vidéo aimée pour l'instant.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("feed");
  const [videos, setVideos] = useState(seedVideos);
  const [likedIds, setLikedIds] = useState(new Set());
  const [feedMode, setFeedMode] = useState("pourtoi");

  const publishVideo = (caption) => {
    const id = "v" + (videos.length + 1);
    setVideos((prev) => [
      { id, user: "moi.perso", avatar: "M", caption, song: "Son original - moi.perso", likes: 0, comments: [], shares: 0, following: true, score: 0.5 },
      ...prev,
    ]);
  };

  const tabs = [
    { key: "feed", label: "Accueil", icon: Home },
    { key: "discover", label: "Découvrir", icon: Compass },
    { key: "upload", label: "", icon: Plus, isUpload: true },
    { key: "inbox", label: "Messages", icon: MessageCircle },
    { key: "profile", label: "Profil", icon: UserCircle2 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#000" }}>
      <div
        className="relative w-full max-w-[420px] h-[100vh] max-h-[900px] flex flex-col overflow-hidden"
        style={{ background: PALETTE.void, fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .spin-disc { animation: spin 3s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) {
            .spin-disc { animation: none; }
          }
        `}</style>

        <div className="flex-1 relative overflow-hidden">
          {tab === "feed" && (
            <FeedScreen
              videos={videos}
              setVideos={setVideos}
              likedIds={likedIds}
              setLikedIds={setLikedIds}
              feedMode={feedMode}
              setFeedMode={setFeedMode}
            />
          )}
          {tab === "discover" && <DiscoverScreen videos={videos} />}
          {tab === "upload" && <UploadScreen onPublish={publishVideo} />}
          {tab === "inbox" && <InboxScreen />}
          {tab === "profile" && <ProfileScreen videos={videos} likedIds={likedIds} />}
        </div>

        <div className="flex items-center justify-around py-2.5 border-t" style={{ borderColor: "#1a1a22", background: PALETTE.void }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            if (t.isUpload) {
              return (
                <button
                  key={t.key}
                  onClick={() => setTab("upload")}
                  aria-label="Publier"
                  className="w-11 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(90deg, ${PALETTE.violet}, ${PALETTE.coral})` }}
                >
                  <Icon size={18} color="white" strokeWidth={2.5} />
                </button>
              );
            }
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className="flex flex-col items-center gap-0.5" aria-label={t.label}>
                <Icon size={22} color={isActive ? "white" : PALETTE.dim} fill={isActive && t.key === "feed" ? "white" : "none"} />
                <span className="text-[10px]" style={{ color: isActive ? "white" : PALETTE.dim }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
      }

import { useState } from "react";
import { Share2, Mail, MessageCircle, Linkedin, Link2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import "../styles/ShareButton.css";

const ShareButton = ({ resumeId, resumeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null); // tracks which button is loading
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: "",
    recipientName: "",
    customMessage: "",
  });

  /* ── loader helpers ── */
  const isLoading = (id) => loadingId === id;
  const startLoad = (id) => setLoadingId(id);
  const stopLoad = () => setLoadingId(null);

  /* ── Email ── */
  const openEmailModal = () => {
    setIsOpen(false);
    setEmailModal(true);
  };

  const handleEmailShare = async (e) => {
    e.preventDefault();
    const { recipientEmail, recipientName, customMessage } = emailForm;
    if (!recipientEmail.trim()) {
      toast.error("Please enter a recipient email.");
      return;
    }

    startLoad("email");
    try {
      await api.post("/share/email", {
        resume_id: resumeId,
        recipient_email: recipientEmail.trim(),
        recipient_name: recipientName.trim() || "Friend",
        message: customMessage.trim(),
      });
      toast.success(`✉️ Resume shared with ${recipientEmail}!`);
      setEmailModal(false);
      setEmailForm({ recipientEmail: "", recipientName: "", customMessage: "" });
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to send email. Please try again.";
      toast.error(msg);
      console.error("Email share error:", error);
    } finally {
      stopLoad();
    }
  };

  /* ── WhatsApp ── */
  const handleWhatsAppShare = async () => {
    startLoad("whatsapp");
    try {
      const response = await api.get(`/share/whatsapp-link/${resumeId}`);
      if (response.data?.whatsapp_link) {
        window.open(response.data.whatsapp_link, "_blank");
        toast.success("💬 Opening WhatsApp...");
        setIsOpen(false);
      } else {
        toast.error("Could not generate WhatsApp link.");
      }
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to generate WhatsApp link.";
      toast.error(msg);
      console.error("WhatsApp share error:", error);
    } finally {
      stopLoad();
    }
  };

  /* ── LinkedIn ── */
  const handleLinkedInShare = async () => {
    startLoad("linkedin");
    try {
      const response = await api.get(`/share/linkedin-link/${resumeId}`);
      if (response.data?.linkedin_link) {
        window.open(response.data.linkedin_link, "_blank");
        toast.success("💼 Opening LinkedIn...");
        setIsOpen(false);
      } else {
        toast.error("Could not generate LinkedIn link.");
      }
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to generate LinkedIn link.";
      toast.error(msg);
      console.error("LinkedIn share error:", error);
    } finally {
      stopLoad();
    }
  };

  /* ── Copy Link ── */
  const handleCopyLink = async () => {
    startLoad("copy");
    try {
      const response = await api.post(`/share/generate-link/${resumeId}`, {});
      if (response.data?.share_link) {
        await navigator.clipboard.writeText(response.data.share_link);
        toast.success("🎉 Link copied to clipboard!");
        setIsOpen(false);
      } else {
        toast.error("Could not generate share link.");
      }
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to generate share link.";
      toast.error(msg);
      console.error("Copy link error:", error);
    } finally {
      stopLoad();
    }
  };

  const shareOptions = [
    {
      id: "email",
      name: "Email",
      icon: Mail,
      color: "#ef4444",
      onClick: openEmailModal,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#22c55e",
      onClick: handleWhatsAppShare,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "#0a66c2",
      onClick: handleLinkedInShare,
    },
    {
      id: "copy",
      name: "Copy Link",
      icon: Link2,
      color: "#f59e0b",
      onClick: handleCopyLink,
    },
  ];

  return (
    <>
      <div className="share-button-wrapper">
        {/* Overlay to close dropdown */}
        {isOpen && (
          <div className="share-overlay" onClick={() => setIsOpen(false)} />
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="share-menu-dropdown">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              const loading = isLoading(option.id);
              return (
                <button
                  key={option.id}
                  className="share-menu-item"
                  style={{ "--color": option.color }}
                  onClick={option.onClick}
                  disabled={loadingId !== null} // disable all while any is loading
                  title={option.name}
                >
                  {loading ? (
                    <Loader2 size={20} className="share-spinner" />
                  ) : (
                    <IconComponent size={20} />
                  )}
                  <span>{loading ? "Please wait..." : option.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Share Button */}
        <button
          className="share-button-main"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={loadingId !== null}
          title="Share Resume"
        >
          <Share2 size={28} />
        </button>
      </div>

      {/* ── Email Modal ── */}
      {emailModal && (
        <div className="email-modal-overlay" onClick={() => setEmailModal(false)}>
          <div
            className="email-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing on inner click
          >
            <div className="email-modal-header">
              <h3>Share via Email</h3>
              <button
                className="email-modal-close"
                onClick={() => setEmailModal(false)}
                disabled={isLoading("email")}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEmailShare} className="email-modal-form">
              <div className="email-field">
                <label htmlFor="recipientEmail">
                  Recipient Email <span className="required">*</span>
                </label>
                <input
                  id="recipientEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={emailForm.recipientEmail}
                  onChange={(e) =>
                    setEmailForm((f) => ({ ...f, recipientEmail: e.target.value }))
                  }
                  required
                  autoFocus
                />
              </div>

              <div className="email-field">
                <label htmlFor="recipientName">Recipient Name</label>
                <input
                  id="recipientName"
                  type="text"
                  placeholder="Friend (optional)"
                  value={emailForm.recipientName}
                  onChange={(e) =>
                    setEmailForm((f) => ({ ...f, recipientName: e.target.value }))
                  }
                />
              </div>

              <div className="email-field">
                <label htmlFor="customMessage">Personal Message</label>
                <textarea
                  id="customMessage"
                  placeholder="Add a personal note... (optional)"
                  value={emailForm.customMessage}
                  onChange={(e) =>
                    setEmailForm((f) => ({ ...f, customMessage: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="email-modal-actions">
                <button
                  type="button"
                  className="email-btn-cancel"
                  onClick={() => setEmailModal(false)}
                  disabled={isLoading("email")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="email-btn-send"
                  disabled={isLoading("email") || !emailForm.recipientEmail.trim()}
                >
                  {isLoading("email") ? (
                    <>
                      <Loader2 size={16} className="share-spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
"use client";

import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share";
import { useEffect, useState } from "react";

const Share: React.FC = () => {
  const [shareUrl, setShareUrl] = useState<string>("");
  const shareTitle = "Check this out!";
  const shareHashtag = "#AmazingContent";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  if (!shareUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-4">
      {/* WhatsApp */}
      <WhatsappShareButton url={shareUrl} title={shareTitle}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      {/* Facebook */}
      <FacebookShareButton url={shareUrl} hashtag={shareHashtag}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      {/* Twitter */}
      <TwitterShareButton
        url={shareUrl}
        title={shareTitle}
        hashtags={["AmazingContent", "ReactShare"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      {/* Email */}
      <EmailShareButton
        url={shareUrl}
        subject={shareTitle}
        body={`Check this out: ${shareUrl}`}
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default Share;

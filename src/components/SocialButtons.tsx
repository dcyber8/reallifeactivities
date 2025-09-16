'use client';

interface SocialButtonProps {
  href: string;
  label: string;
  icon: string;
  bgColor?: string;
  textColor?: string;
}

function SocialButton({ href, label, icon, bgColor = 'bg-black', textColor = 'text-white' }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${bgColor} ${textColor} px-6 py-3 font-bold border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 flex items-center space-x-3 min-w-[200px] justify-center`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

export default function SocialButtons() {
  const socialLinks = {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL,
    pumpfun: process.env.NEXT_PUBLIC_PUMPFUN_URL,
  };



  // Check if any social links are available
  const hasAnySocialLinks = socialLinks.twitter || socialLinks.telegram || socialLinks.pumpfun;

  // Don't render anything if no social links are available
  if (!hasAnySocialLinks) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl md:text-3xl font-bold">
        FOLLOW THE ACTION
      </h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {socialLinks.twitter && (
          <SocialButton
            href={socialLinks.twitter}
            label="FOLLOW ON X"
            icon="𝕏"
            bgColor="bg-black"
            textColor="text-white"
          />
        )}

        {socialLinks.telegram && (
          <SocialButton
            href={socialLinks.telegram}
            label="JOIN TELEGRAM"
            icon="📱"
            bgColor="bg-black"
            textColor="text-white"
          />
        )}

        {socialLinks.pumpfun && (
          <SocialButton
            href={socialLinks.pumpfun}
            label="PUMP.FUN LIVE"
            icon="🚀"
            bgColor="bg-black"
            textColor="text-white"
          />
        )}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-2 text-gray-600">
        <p className="text-sm md:text-base">
          Stay updated with real-time notifications
        </p>
        <p className="text-xs md:text-sm">
          Join our community for exclusive content and updates
        </p>
      </div>
    </div>
  );
}

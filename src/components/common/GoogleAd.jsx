import { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-7422337469648732';

/**
 * Place a Google AdSense ad.
 * @param {string} adSlot - Ad unit slot ID from AdSense (e.g. when you create an "Ad unit" in AdSense)
 * @param {string} [adFormat='auto'] - e.g. 'auto', 'rectangle', 'horizontal', 'vertical'
 * @param {boolean} [fullWidthResponsive=true]
 * @param {string} [className] - Wrapper class (e.g. for layout)
 * @param {object} [style] - Inline style for the wrapper
 */
export default function GoogleAd({ adSlot, adFormat = 'auto', fullWidthResponsive = true, className = '', style = {} }) {
  const insRef = useRef(null);

  useEffect(() => {
    if (!adSlot || typeof window === 'undefined' || !window.adsbygoogle) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense push error', e);
    }
  }, [adSlot]);

  if (!adSlot) {
    return null;
  }

  return (
    <div className={`min-h-[90px] flex items-center justify-center bg-gray-100/50 rounded-lg overflow-hidden ${className}`} style={style}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

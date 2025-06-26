export interface ShareData {
  title: string;
  url: string;
  description?: string;
  author?: string;
}

export const shareLinks = {
  // 微信分享（通过二维码）
  wechat: (data: ShareData) => {
    // 微信分享通常需要通过二维码或小程序，这里提供一个通用的方式
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.url)}`;
  },

  // 微博分享
  weibo: (data: ShareData) => {
    const text = `${data.title} - ${data.description || ''} ${data.url}`;
    return `https://service.weibo.com/share/share.php?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(text)}`;
  },

  // QQ分享
  qq: (data: ShareData) => {
    return `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}&summary=${encodeURIComponent(data.description || '')}`;
  },

  // Twitter分享
  twitter: (data: ShareData) => {
    const text = `${data.title}${data.author ? ` by ${data.author}` : ''}`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}`;
  },

  // LinkedIn分享
  linkedin: (data: ShareData) => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;
  },

  // Facebook分享
  facebook: (data: ShareData) => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
  },

  // 复制链接
  copyLink: async (data: ShareData): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(data.url);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = data.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      return false;
    }
  },

  // 原生分享API（移动端）
  native: async (data: ShareData): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: data.url,
        });
        return true;
      } catch (err) {
        // User cancelled or error occurred
        console.error('Native share failed:', err);
        return false;
      }
    }
    return false;
  }
};

export const openShareWindow = (url: string, platform: string) => {
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  
  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
};
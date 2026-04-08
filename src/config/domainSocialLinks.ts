export type DomainSocialLinkConfig = {
  group: string;
  hosts: string[];
  telegramLink: string;
  facebookLink: string;
};

const DOMAIN_SOCIAL_LINKS: DomainSocialLinkConfig[] = [
  {
    group: "abc",
    hosts: ["abc.com", "www.abc.com"],
    telegramLink: "https://t.me/CONGBINH2026",
    facebookLink: "https://www.facebook.com/profile.php?id=61551351983672",
  },
  {
    group: "xyz",
    hosts: ["xyz.com", "www.xyz.com"],
    telegramLink: "https://t.me/CONGBINH2026",
    facebookLink: "https://www.facebook.com/profile.php?id=61551351983672",
  },
  {
    group: "vip",
    hosts: ["vip.com", "www.vip.com"],
    telegramLink: "https://t.me/CONGBINH2026",
    facebookLink: "https://www.facebook.com/profile.php?id=61551351983672",
  },
  {
    group: "checkxoamaan",
    hosts: ["checkxoamaan.vip", "www.checkxoamaan.vip"],
    telegramLink: "https://t.me/anhquyetchien",
    facebookLink: "https://www.facebook.com/tinhdung120",
  },
];

const DEFAULT_DOMAIN_SOCIAL_LINK: DomainSocialLinkConfig = {
  group: "default",
  hosts: [],
  telegramLink: "https://t.me/CONGBINH2026",
  facebookLink: "https://www.facebook.com/profile.php?id=61551351983672",
};

export function resolveDomainSocialLinks(
  hostname: string,
): DomainSocialLinkConfig {
  const normalizedHost = hostname.toLowerCase().trim();

  return (
    DOMAIN_SOCIAL_LINKS.find((config) =>
      config.hosts.some(
        (host) => normalizedHost === host || normalizedHost.endsWith(`.${host}`),
      ),
    ) ?? DEFAULT_DOMAIN_SOCIAL_LINK
  );
}

export { DOMAIN_SOCIAL_LINKS, DEFAULT_DOMAIN_SOCIAL_LINK };

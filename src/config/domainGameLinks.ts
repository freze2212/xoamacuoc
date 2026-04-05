export type DomainGameLinkConfig = {
  group: string;
  hosts: string[];
  gameLink: string;
};

const DOMAIN_GAME_LINKS: DomainGameLinkConfig[] = [
  {
    group: "abc",
    hosts: ["abc.com", "www.abc.com"],
    gameLink: "https://play.abc.com/lobby",
  },
  {
    group: "xyz",
    hosts: ["xyz.com", "www.xyz.com"],
    gameLink: "https://games.xyz.com/start",
  },
  {
    group: "vip",
    hosts: ["vip.com", "www.vip.com"],
    gameLink: "https://vip.com/high-roller",
  },
];

const DEFAULT_DOMAIN_GAME_LINK: DomainGameLinkConfig = {
  group: "default",
  hosts: [],
  gameLink: "https://example.com/game",
};

export function resolveDomainGameLink(hostname: string): DomainGameLinkConfig {
  const normalizedHost = hostname.toLowerCase().trim();

  return (
    DOMAIN_GAME_LINKS.find((config) =>
      config.hosts.some(
        (host) => normalizedHost === host || normalizedHost.endsWith(`.${host}`),
      ),
    ) ?? DEFAULT_DOMAIN_GAME_LINK
  );
}

export { DOMAIN_GAME_LINKS, DEFAULT_DOMAIN_GAME_LINK };

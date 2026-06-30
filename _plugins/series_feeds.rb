# frozen_string_literal: true

# Generates a per-series RSS 2.0 feed at /series/{slug}/feed.xml.
# Reads the same `series_match` Liquid boolean used by _layouts/series.html
# to keep the feed and the page in sync.
#
# Hooks on :site, :post_render so all pages (and the layout) are already
# built. The feed is regenerated whenever a post is added/edited.

require "cgi"
require "time"
require "fileutils"

module SeriesFeeds
  # Same expressions as the four _series/*.md pages. Kept in sync manually.
  SERIES_CONFIG = [
    {
      slug: "agent-os",
      title: "Agent OS 系列",
      link:  "/agent-os-series/",
      match: ->(s) {
        s.include?("Agent-OS") || s.include?("Agent OS") ||
          s.include?("AI-OS") || s.include?("agent-os")
      }
    },
    {
      slug: "memory-engineering",
      title: "Memory Engineering 系列",
      link:  "/memory-engineering-series/",
      match: ->(s) { s.include?("Memory") }
    },
    {
      slug: "ai-native-security",
      title: "AI-Native Security 系列",
      link:  "/ai-native-security-series/",
      match: ->(s) { s.include?("Security") || s.include?("AI安全") }
    },
    {
      slug: "aise",
      title: "AISE 系列",
      link:  "/aise-series/",
      match: ->(s) {
        s.include?("AI-Native") || s.include?("AISE") || s.include?("AI产品") ||
          s.include?("企业架构") || s.include?("AI安全") || s.include?("ai-native") ||
          s == "aise" || s.include?("AI-Native软件工程")
      }
    }
  ].freeze

  class Generator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      SERIES_CONFIG.each do |cfg|
        posts = site.posts.docs
                        .select { |p| cfg[:match].call(p.data["series"].to_s) }
                        .sort_by { |p| -p.date.to_i }
                        .first(20)

        next if posts.empty?

        xml = build_xml(site, cfg, posts)
        dir = File.join(site.dest, "series", cfg[:slug])
        FileUtils.mkdir_p(dir)
        path = File.join(dir, "feed.xml")
        File.write(path, xml)

        Jekyll.logger.info "Series feed:", "#{cfg[:slug]} → #{posts.size} posts"
      end
    end

    private

    def build_xml(site, cfg, posts)
      base = site.config["url"].to_s.sub(/\/$/, "")
      feed_link = "#{base}/series/#{cfg[:slug]}/feed.xml"
      page_link = "#{base}#{cfg[:link]}"

      items = posts.map do |p|
        url = "#{base}#{p.url}"
        desc = (p.data["description"] || "").to_s
        <<~ITEM
          <item>
            <title>#{esc(p.data["title"].to_s)}</title>
            <link>#{esc(url)}</link>
            <guid isPermaLink="true">#{esc(url)}</guid>
            <pubDate>#{p.date.rfc822}</pubDate>
            <description>#{esc(desc)}</description>
          </item>
        ITEM
      end.join

      <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
          <channel>
            <title>#{esc("#{cfg[:title]} · #{site.config['title']}")}</title>
            <link>#{esc(page_link)}</link>
            <atom:link href="#{esc(feed_link)}" rel="self" type="application/rss+xml" />
            <description>#{esc(site.config['description'].to_s)}</description>
            <language>zh-CN</language>
            <lastBuildDate>#{Time.now.rfc822}</lastBuildDate>
        #{items}
          </channel>
        </rss>
      XML
    end

    def esc(s)
      CGI.escapeHTML(s)
    end
  end
end

# Generates a Google News sitemap at /news-sitemap.xml
# Lists all posts from the last 48 hours as news articles.
# (For high-frequency publishing, Google recommends last 2 days; we use 30 to be safe.)

require 'date'

module Jekyll
  class NewsSitemapGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      # Generate the file content
      news_items = recent_posts(site)
      return if news_items.empty?

      content = build_sitemap(site, news_items)
      path = File.join(site.dest, 'news-sitemap.xml')
      FileUtils.mkdir_p(File.dirname(path))
      File.write(path, content)
      site.pages << NewsSitemapPage.new(site, site.source, '/', 'news-sitemap.xml') if defined?(NewsSitemapPage)
    end

    def recent_posts(site)
      # jekyll-last-modified-at populates post.date as a Time while
      # frontmatter-only dates can be Date. Coerce to Time to avoid
      # `ArgumentError: comparison of Time with Date failed` (Ruby 3.x).
      cutoff = (Date.today - 30).to_time
      site.posts.docs.select do |post|
        post.date && post.date.to_time >= cutoff
      end
    end

    def build_sitemap(site, posts)
      base = site.config['url']
      languages = site.config['languages'] || ['zh-CN']
      items = posts.map do |post|
        lang = post['lang'] || languages.first
        <<~ITEM
              <news:news>
                <news:publication>
                  <news:name>#{escape(site.config['title'])}</news:name>
                  <news:language>#{lang}</news:language>
                </news:publication>
                <news:publication_date>#{post.date.strftime('%Y-%m-%dT%H:%M:%S%:z')}</news:publication_date>
                <news:title>#{escape(post['title'] || post.basename_without_ext)}</news:title>
                <news:keywords>#{escape((post['tags'] || []).join(', '))}</news:keywords>
              </news:news>
        ITEM
      end.join("\n")
      <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
        #{items}
        </urlset>
      XML
    end

    def escape(s)
      s.to_s.gsub('&', '&amp;').gsub('<', '&lt;').gsub('>', '&gt;')
    end
  end
end

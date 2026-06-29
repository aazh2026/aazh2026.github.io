# Jekyll plugin: augments jekyll-sitemap's output with image:image entries
# for each post, listing its referenced SVG assets + OG image.

module Jekyll
  class ImageSitemapAugmenter
    SAFE = true

    def self.augment(site, content)
      content.gsub(%r{<url>([\s\S]*?)</url>}) do |url_block|
        loc_match = url_block.match(%r{<loc>([^<]+)</loc>})
        next url_block unless loc_match
        loc = loc_match[1]
        post = find_post_for(site, loc)
        next url_block unless post
        images = post_images(site, post)
        next url_block if images.empty?
        image_xml = images.map { |img|
          %Q{  <image:image>\n    <image:loc>#{img[:loc]}</image:loc>\n    <image:title>#{escape(img[:title])}</image:title>\n  </image:image>}
        }.join("\n")
        url_block.sub('</url>', "#{image_xml}\n</url>")
      end
    end

    def self.find_post_for(site, loc)
      base = site.config['url'].to_s
      path = loc.sub(base, '')
      site.posts.find { |p| p.url == path }
    end

    def self.post_images(site, post)
      images = []
      post.content.scan(%r{(?:src|data)=["']([^"']+\.svg)["']}) do |m|
        m = m[0]
        next unless m.start_with?('/')
        next if m.start_with?('/assets/images/og/')
        images << { loc: m, title: post.title }
      end
      slug = post.basename_without_ext.sub(/^\d{4}-\d{2}-\d{2}-/, '')
      og = "/assets/images/og/#{slug}.jpg"
      if File.exist?(File.join(site.source, og.sub(%r{^/}, '')))
        images << { loc: og, title: post.title }
      end
      images.uniq { |i| i[:loc] }
    end

    def self.escape(s)
      s.to_s.gsub('&', '&amp;').gsub('<', '&lt;').gsub('>', '&gt;')
    end
  end

  Hooks.register :site, :post_write do |s|
    sitemap_path = File.join(s.dest, 'sitemap.xml')
    next unless File.exist?(sitemap_path)
    content = File.read(sitemap_path)
    next unless content.include?('<urlset')
    augmented = ImageSitemapAugmenter.augment(s, content)
    File.write(sitemap_path, augmented)
  end
end

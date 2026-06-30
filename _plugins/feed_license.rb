# frozen_string_literal: true

# Adds <dc:creator> and <creativecommons:license> to every <entry> in
# /feed.xml so attribution survives in third-party readers (Feedly, Inoreader,
# NetNewsWire). The base jekyll-feed plugin only sets the channel-level
# <author>, which many readers ignore at the item level.
#
# We hook on :site, :post_write so the file is fully on disk by the time
# we rewrite it (jekyll-feed's generator runs at the same phase but writes
# during site.render / site.write — using a Generator would race the write).

require "cgi"

Jekyll::Hooks.register :site, :post_write do |site|
  feed_path = site.config["feed"]&.dig("path") || "feed.xml"
  out = File.join(site.dest, feed_path)
  next unless File.exist?(out)

  license_url = "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  xml = File.read(out)

  # Register the two extra namespaces on the root <feed> element.
  # Idempotent — re-running on a feed that already has them is a no-op.
  unless xml.include?("xmlns:dc=")
    xml.sub!(
      '<feed ',
      '<feed xmlns:dc="http://purl.org/dc/elements/1.1/" ' \
      'xmlns:cc="http://creativecommons.org/ns#" '
    )
  end

  # Per-item: insert <dc:creator> + <cc:license> right after </id>
  # so the element order matches Atom Pub (RFC 4287) recommendations.
  creator = CGI.escapeHTML(site.config["author"].to_s)
  xml.gsub!(
    /(<entry>.*?<\/id>)/m,
    "\\1" \
    "<dc:creator><![CDATA[#{creator}]]></dc:creator>" \
    "<cc:license rdf:resource=\"#{license_url}\"/>"
  )

  # Channel-level <rights> mirrors the license textually. Some readers
  # surface this in the subscription UI.
  unless xml.include?("<rights>")
    xml.sub!(
      "</feed>",
      "<rights>Content licensed under " \
      "<a href=\"#{license_url}\">CC BY-NC-SA 4.0</a> " \
      "unless noted otherwise.</rights></feed>"
    )
  end

  File.write(out, xml)
  Jekyll.logger.info "Feed license:", "added dc:creator + cc:license to #{feed_path}"
end

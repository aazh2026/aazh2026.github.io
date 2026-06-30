# frozen_string_literal: true

# Generates a JSON search index at /assets/search.json from site.posts.
# Each entry contains: title, url, date, tags, desc, body.
# `body` is the rendered post content stripped to plain text — enables
# full-text search across the article body, not just metadata.
#
# Output is written to the Jekyll destination (_site/assets/search.json).
#
# Runs on :site, :post_render so the full site is already built (including
# Liquid-rendered HTML, which is what we strip down to plain text).

require "json"

module SearchIndex
  class Generator < Jekyll::Generator
    safe true
    priority :low

    OUTPUT_REL = "assets/search.json"

    def generate(site)
      payload = site.posts.docs.map { |post| build_entry(site, post) }
      json = JSON.generate(payload)

      # Write to destination (the actual _site folder)
      dest_dir = File.join(site.dest, "assets")
      FileUtils.mkdir_p(dest_dir)
      out_path = File.join(dest_dir, "search.json")
      File.write(out_path, json)

      Jekyll.logger.info "Search index:", "#{payload.size} posts → #{out_path.sub(site.source, '')}"
    end

    private

    def build_entry(site, post)
      {
        "title" => post.data["title"].to_s,
        "url"   => post.url,
        "date"  => post.date.strftime("%Y-%m-%d"),
        "tags"  => Array(post.data["tags"]),
        "desc"  => post.data["description"].to_s,
        "series" => post.data["series"].to_s,
        "body"  => extract_body(site, post)
      }
    end

    def extract_body(site, post)
      # Prefer the rendered HTML output (Liquid already expanded), then strip
      # tags & collapse whitespace. Fall back to raw content if rendered is empty.
      html = post.output || post.content || ""
      text = html.to_s
              .gsub(/<script[\s\S]*?<\/script>/i, " ")
              .gsub(/<style[\s\S]*?<\/style>/i, " ")
              .gsub(/<svg[\s\S]*?<\/svg>/i, " ")
              .gsub(/<[^>]+>/, " ")
              .gsub(/&nbsp;/, " ")
              .gsub(/&[a-z]+;/i, " ")
              .gsub(/\s+/, " ")
              .strip
      text[0, 8000] # cap each body so the JSON stays reasonable in size
    end
  end
end

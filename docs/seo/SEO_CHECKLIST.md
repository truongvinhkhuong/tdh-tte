# SEO Operations Checklist

Checklist vận hành SEO hàng ngày/tuần/tháng cho TTE Website.

---

## 📅 Hàng ngày

- [ ] Kiểm tra Google Search Console xem có lỗi crawl mới không
- [ ] Monitor Core Web Vitals trong PageSpeed Insights

---

## 📅 Hàng tuần

### Content

- [ ] Review content mới đã có đầy đủ metadata chưa
- [ ] Kiểm tra images có alt text chưa
- [ ] Verify internal links hoạt động

### Technical

- [ ] Kiểm tra sitemap.xml accessible
- [ ] Check robots.txt không block pages quan trọng
- [ ] Monitor 404 errors trong Search Console

---

## 📅 Hàng tháng

### Performance

- [ ] Run full PageSpeed audit cho các pages chính
- [ ] Kiểm tra Core Web Vitals trends
- [ ] Optimize images nếu cần

### Content Audit

- [ ] Review thin content pages
- [ ] Update outdated content
- [ ] Check duplicate content issues

### Technical SEO

- [ ] Verify Schema markup với Rich Results Test
- [ ] Kiểm tra hreflang implementation
- [ ] Audit internal linking structure

### Monitoring

- [ ] Review Search Console performance report
- [ ] Analyze top queries và pages
- [ ] Check mobile usability issues

---

## 📅 Hàng quý

### Comprehensive Audit

- [ ] Full technical SEO audit
- [ ] Competitor analysis
- [ ] Keyword research refresh
- [ ] Content gap analysis

### Updates

- [ ] Update sitemap structure nếu cần
- [ ] Review và update meta descriptions
- [ ] Refresh OG images cho các pages chính

---

## 🚀 Khi Deploy mới

### Pre-deployment

- [ ] Test metadata trên staging
- [ ] Verify sitemap generate đúng
- [ ] Check robots.txt
- [ ] Test JSON-LD với validator

### Post-deployment

- [ ] Submit sitemap mới lên Search Console
- [ ] Request indexing cho pages mới
- [ ] Clear Facebook/Twitter cache
- [ ] Monitor for crawl errors

---

## 📊 KPIs cần theo dõi

| Metric | Tool | Target |
|--------|------|--------|
| Indexed Pages | Search Console | 100% pages cần index |
| Crawl Errors | Search Console | 0 |
| Core Web Vitals | PageSpeed | All green |
| Mobile Usability | Search Console | 0 errors |
| Rich Results | Search Console | Valid |

---

## 🔧 Công cụ cần dùng

1. **Google Search Console** - Monitor indexing
2. **PageSpeed Insights** - Performance
3. **Rich Results Test** - Schema validation
4. **Screaming Frog** - Technical crawl (optional)
5. **Ahrefs/Semrush** - Keyword tracking (optional)

---

## 📞 Liên hệ hỗ trợ

Khi gặp vấn đề SEO cần xử lý:

1. Kiểm tra documentation trong `/docs/seo/`
2. Review code trong `app/sitemap.ts`, `app/robots.ts`
3. Contact dev team với chi tiết issue

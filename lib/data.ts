import type {
    Product,
    Brand,
    ProductCategory,
    Industry,
    Project,
    Service,
    TechArticle,
    NewsArticle,
    Vacancy,
    CompanyInfo,
    TimelineMilestone,
    Certificate,
    Partner,
} from '@/types';

// =========================
// BRANDS
// =========================
export const brands: Brand[] = [
    {
        id: '1',
        slug: 'emerson',
        name: 'Emerson',
        logo: '/brands/emerson-logo.png',
        description: 'Global technology and engineering company',
        subBrands: [
            { id: '1-1', slug: 'fisher', name: 'Fisher' },
            { id: '1-2', slug: 'sempell', name: 'Sempell' },
            { id: '1-3', slug: 'yarway', name: 'Yarway' },
            { id: '1-4', slug: 'vanessa', name: 'Vanessa' },
            { id: '1-5', slug: 'ktm', name: 'KTM' },
            { id: '1-6', slug: 'virgo', name: 'Virgo' },
            { id: '1-7', slug: 'keystone', name: 'Keystone' },
            { id: '1-8', slug: 'crosby', name: 'Crosby' },
            { id: '1-9', slug: 'anderson-greenwood', name: 'Anderson Greenwood' },
            { id: '1-10', slug: 'biffi-bettis', name: 'Biffi Bettis' },
            { id: '1-11', slug: 'morin', name: 'Morin' },
        ],
    },
    {
        id: '2',
        slug: 'flowserve',
        name: 'Flowserve',
        logo: '/brands/flowserve-logo.png',
        description: 'Leading provider of flow control products',
        subBrands: [
            { id: '2-1', slug: 'pumps', name: 'PUMPS' },
            { id: '2-2', slug: 'mechanical-seals', name: 'Mechanical Seals' },
            { id: '2-3', slug: 'dry-gas-seals', name: 'Dry Gas Seals' },
        ],
    },
    {
        id: '3',
        slug: 'pleuger',
        name: 'Pleuger',
        logo: '/brands/pleuger-logo.png',
        description: 'Submersible pump solutions',
        subBrands: [
            { id: '3-1', slug: 'submersible-pump', name: 'Submersible Pump' },
        ],
    },
    {
        id: '5',
        slug: 'cooper',
        name: 'Cooper',
        logo: '/brands/cooper-logo.png',
        description: 'Machinery services provider',
        subBrands: [
            { id: '5-1', slug: 'machinery-services', name: 'Machinery Services for Reciprocating Compressor and Engine' },
        ],
    },
    {
        id: '6',
        slug: 'boustead-int-heater',
        name: 'Boustead Int. Heater (BIH)',
        logo: '/brands/bih-logo.png',
        description: 'Industrial heater solutions',
    },
];

// =========================
// CATEGORIES
// =========================
export const categories: ProductCategory[] = [
    { id: '1', slug: 'valves', name: 'Van công nghiệp' },
    { id: '2', slug: 'pumps', name: 'Máy bơm' },
    { id: '3', slug: 'compressors', name: 'Máy nén khí' },
    { id: '4', slug: 'control-systems', name: 'Hệ thống điều khiển' },
    { id: '5', slug: 'filtration', name: 'Hệ thống lọc' },
    { id: '6', slug: 'boilers', name: 'Nồi hơi' },
];

// =========================
// INDUSTRIES
// =========================
export const industries: Industry[] = [
    { id: '1', slug: 'oil-gas', name: 'Dầu khí' },
    { id: '2', slug: 'petrochemical', name: 'Hóa dầu' },
    { id: '3', slug: 'power', name: 'Năng lượng' },
    { id: '4', slug: 'water', name: 'Xử lý nước' },
    { id: '5', slug: 'manufacturing', name: 'Sản xuất' },
];

// =========================
// PRODUCTS
// =========================
export const products: Product[] = [
    {
        id: '1',
        slug: 'gas-processing-system',
        name: 'Hệ Thống Xử Lý Khí',
        modelNumber: 'GPS-5000',
        shortDescription: 'Hệ thống xử lý khí công nghiệp hiệu suất cao',
        description: `
      <p>Hệ thống xử lý khí GPS-5000 là giải pháp toàn diện cho việc xử lý và tinh chế khí tự nhiên trong các nhà máy công nghiệp.</p>
      <h3>Đặc điểm nổi bật</h3>
      <ul>
        <li>Công suất xử lý lên đến 50,000 m³/giờ</li>
        <li>Hiệu suất lọc đạt 99.9%</li>
        <li>Tiêu thụ năng lượng thấp</li>
        <li>Hệ thống điều khiển tự động</li>
      </ul>
    `,
        images: ['/gas-processing-system-industrial-equipment.jpg'],
        brand: brands[0],
        category: categories[4],
        industries: [industries[0], industries[1]],
        specifications: [
            { key: 'Công suất', value: '50,000', unit: 'm³/h' },
            { key: 'Áp suất hoạt động', value: '0-100', unit: 'bar' },
            { key: 'Nhiệt độ', value: '-40 đến 200', unit: '°C' },
            { key: 'Vật liệu', value: 'Thép không gỉ 316L', unit: '' },
        ],
        documents: [
            { id: '1', name: 'Catalog GPS-5000', type: 'catalog', url: '#', size: '2.5 MB' },
            { id: '2', name: 'Datasheet', type: 'datasheet', url: '#', size: '500 KB' },
        ],
        relatedProjects: [],
    },
    {
        id: '2',
        slug: 'oil-filtration-system',
        name: 'Bộ Lọc Dầu',
        modelNumber: 'OFS-3000',
        shortDescription: 'Bộ lọc dầu công nghiệp với độ tinh khiết cao',
        description: `
      <p>Bộ lọc dầu OFS-3000 được thiết kế đặc biệt cho các ứng dụng lọc dầu trong ngành công nghiệp nặng.</p>
    `,
        images: ['/oil-filtration-system-equipment.jpg'],
        brand: brands[1],
        category: categories[4],
        industries: [industries[0]],
        specifications: [
            { key: 'Lưu lượng', value: '500', unit: 'L/min' },
            { key: 'Độ lọc', value: '1-100', unit: 'micron' },
        ],
        documents: [],
        relatedProjects: [],
    },
    {
        id: '3',
        slug: 'industrial-air-compressor',
        name: 'Máy Nén Khí',
        modelNumber: 'IAC-7500',
        shortDescription: 'Máy nén khí công nghiệp công suất lớn',
        description: '<p>Máy nén khí IAC-7500 với công nghệ tiên tiến, tiết kiệm năng lượng.</p>',
        images: ['/industrial-air-compressor-equipment.jpg'],
        brand: brands[0],
        category: categories[2],
        industries: [industries[2], industries[4]],
        specifications: [
            { key: 'Công suất', value: '75', unit: 'kW' },
            { key: 'Áp suất', value: '8-13', unit: 'bar' },
        ],
        documents: [],
        relatedProjects: [],
    },
    {
        id: '4',
        slug: 'industrial-control-system',
        name: 'Hệ Thống Điều Khiển',
        modelNumber: 'ICS-DCS',
        shortDescription: 'Hệ thống điều khiển phân tán DCS',
        description: '<p>Hệ thống điều khiển phân tán hiện đại với giao diện HMI trực quan.</p>',
        images: ['/industrial-control-system-panel.jpg'],
        brand: brands[0],
        category: categories[3],
        industries: [industries[0], industries[1], industries[2]],
        specifications: [
            { key: 'Số kênh I/O', value: 'Lên đến 10,000', unit: '' },
            { key: 'Giao thức', value: 'Modbus, Profibus, Ethernet', unit: '' },
        ],
        documents: [],
        relatedProjects: [],
    },
    {
        id: '5',
        slug: 'industrial-boiler',
        name: 'Nồi Hơi Công Nghiệp',
        modelNumber: 'IB-2000',
        shortDescription: 'Nồi hơi công nghiệp hiệu suất cao',
        description: '<p>Nồi hơi công nghiệp với công nghệ đốt tiên tiến, hiệu suất cao.</p>',
        images: ['/industrial-boiler-equipment.jpg'],
        brand: brands[4],
        category: categories[5],
        industries: [industries[2], industries[4]],
        specifications: [
            { key: 'Công suất', value: '2,000', unit: 'kg/h' },
            { key: 'Áp suất', value: '10', unit: 'bar' },
        ],
        documents: [],
        relatedProjects: [],
    },
    {
        id: '6',
        slug: 'industrial-pump',
        name: 'Máy Bơm Công Nghiệp',
        modelNumber: 'IP-500',
        shortDescription: 'Máy bơm ly tâm công nghiệp',
        description: '<p>Máy bơm ly tâm đa cấp với độ bền cao, phù hợp cho nhiều ứng dụng.</p>',
        images: ['/industrial-pump-equipment.jpg'],
        brand: brands[1],
        category: categories[1],
        industries: [industries[0], industries[3]],
        specifications: [
            { key: 'Lưu lượng', value: '500', unit: 'm³/h' },
            { key: 'Cột áp', value: '150', unit: 'm' },
        ],
        documents: [],
        relatedProjects: [],
    },
];

// =========================
// PROJECTS
// =========================
export const projects: Project[] = [
    {
        id: '1',
        slug: 'nghi-son-refinery',
        title: 'Nhà máy Lọc dầu Nghi Sơn',
        shortDescription: 'Cung cấp hệ thống xử lý dầu toàn bộ với công suất 200,000 bbl/ngày',
        heroImage: '/oil-refinery-project-industrial.jpg',
        images: ['/oil-refinery-project-industrial.jpg'],
        client: 'Nghi Son Refinery and Petrochemical LLC',
        location: 'Thanh Hóa, Việt Nam',
        completionYear: 2023,
        industry: industries[0],
        challenge: 'Nhà máy yêu cầu hệ thống xử lý dầu thô với công suất lớn, đáp ứng các tiêu chuẩn môi trường nghiêm ngặt và hoạt động liên tục 24/7.',
        solution: 'Toàn Thắng đã cung cấp giải pháp tích hợp bao gồm hệ thống van điều khiển, máy bơm và các thiết bị đo lường từ các thương hiệu hàng đầu như Emerson và Flowserve.',
        products: [products[0], products[1], products[5]],
    },
    {
        id: '2',
        slug: 'binh-son-petrochemical',
        title: 'Nhà máy Hóa dầu Bình Sơn',
        shortDescription: 'Lắp đặt hệ thống điều khiển tự động cho nhà máy hóa dầu',
        heroImage: '/petrochemical-plant-industrial-project.jpg',
        images: ['/petrochemical-plant-industrial-project.jpg'],
        client: 'Binh Son Refining and Petrochemical JSC',
        location: 'Quảng Ngãi, Việt Nam',
        completionYear: 2022,
        industry: industries[1],
        challenge: 'Nâng cấp toàn bộ hệ thống điều khiển từ công nghệ cũ sang hệ thống DCS hiện đại mà không làm gián đoạn sản xuất.',
        solution: 'Triển khai hệ thống điều khiển DCS mới với phương pháp chuyển đổi từng phần, đảm bảo sản xuất không bị gián đoạn.',
        products: [products[3]],
    },
    {
        id: '3',
        slug: 'bach-ho-gas-station',
        title: 'Trạm khí Bạch Hổ',
        shortDescription: 'Cung cấp thiết bị xử lý khí tự nhiên cho trạm trung chuyển',
        heroImage: '/natural-gas-station-industrial.jpg',
        images: ['/natural-gas-station-industrial.jpg'],
        client: 'PetroVietnam',
        location: 'Bà Rịa - Vũng Tàu, Việt Nam',
        completionYear: 2023,
        industry: industries[0],
        challenge: 'Xây dựng trạm xử lý khí mới trong điều kiện offshore với yêu cầu an toàn cao.',
        solution: 'Cung cấp toàn bộ thiết bị xử lý khí với chứng nhận offshore và hỗ trợ kỹ thuật tại chỗ.',
        products: [products[0], products[2]],
    },
];

// =========================
// SERVICES
// =========================
export const services: Service[] = [
    {
        id: '1',
        slug: 'technical-consulting',
        title: 'Tư Vấn Kỹ Thuật',
        shortDescription: 'Cung cấp tư vấn chuyên sâu về công nghệ và giải pháp tối ưu cho doanh nghiệp',
        description: `
      <h2>Dịch vụ Tư vấn Kỹ thuật</h2>
      <p>Với đội ngũ kỹ sư giàu kinh nghiệm, chúng tôi cung cấp dịch vụ tư vấn toàn diện:</p>
      <ul>
        <li>Phân tích nhu cầu và đề xuất giải pháp</li>
        <li>Thiết kế hệ thống kỹ thuật</li>
        <li>Đánh giá và tối ưu hóa hiệu suất</li>
        <li>Tư vấn lựa chọn thiết bị phù hợp</li>
      </ul>
    `,
        icon: 'Lightbulb',
    },
    {
        id: '2',
        slug: 'equipment-supply',
        title: 'Cung Cấp Thiết Bị',
        shortDescription: 'Cung cấp các thiết bị công nghiệp chất lượng cao từ các hãng sản xuất hàng đầu',
        description: `
      <h2>Cung cấp Thiết bị Công nghiệp</h2>
      <p>Chúng tôi là đại lý chính thức của nhiều thương hiệu hàng đầu thế giới.</p>
    `,
        icon: 'Package',
    },
    {
        id: '3',
        slug: 'installation',
        title: 'Lắp Đặt & Vận Hành',
        shortDescription: 'Đội ngũ kỹ sư giàu kinh nghiệm giúp lắp đặt và vận hành thiết bị',
        description: '<h2>Dịch vụ Lắp đặt</h2><p>Lắp đặt chuyên nghiệp với đội ngũ kỹ sư được đào tạo bài bản.</p>',
        icon: 'Wrench',
    },
    {
        id: '4',
        slug: 'maintenance',
        title: 'Bảo Trì & Sửa Chữa',
        shortDescription: 'Dịch vụ bảo trì định kỳ và sửa chữa khẩn cấp 24/7',
        description: '<h2>Bảo trì & Sửa chữa</h2><p>Dịch vụ bảo trì định kỳ và xử lý sự cố nhanh chóng.</p>',
        icon: 'Settings',
    },
    {
        id: '5',
        slug: 'training',
        title: 'Đào Tạo Nhân Sự',
        shortDescription: 'Cung cấp khóa đào tạo chuyên nghiệp cho đội ngũ kỹ thuật của bạn',
        description: '<h2>Đào tạo</h2><p>Các khóa đào tạo vận hành và bảo trì thiết bị.</p>',
        icon: 'Users',
    },
    {
        id: '6',
        slug: 'support',
        title: 'Hỗ Trợ Kỹ Thuật',
        shortDescription: 'Hỗ trợ kỹ thuật 24/7 để giải quyết các vấn đề kỹ thuật',
        description: '<h2>Hỗ trợ 24/7</h2><p>Đường dây nóng hỗ trợ kỹ thuật hoạt động 24/7.</p>',
        icon: 'Headphones',
    },
];

// =========================
// TECH ARTICLES
// =========================
export const techArticles: TechArticle[] = [
    {
        id: '1',
        slug: 'valve-selection-guide',
        title: 'Hướng dẫn Lựa chọn Van Công nghiệp',
        excerpt: 'Tìm hiểu cách lựa chọn van phù hợp cho từng ứng dụng cụ thể trong ngành công nghiệp.',
        content: '<h2>Giới thiệu</h2><p>Van công nghiệp là thiết bị quan trọng...</p>',
        coverImage: '/technology-solution-industrial-plant.jpg',
        author: 'Kỹ sư Nguyễn Văn A',
        publishedAt: '2024-01-15',
        category: 'solution',
        readTime: 10,
    },
    {
        id: '2',
        slug: 'pump-maintenance-best-practices',
        title: 'Best Practices Bảo trì Máy bơm',
        excerpt: 'Các phương pháp tốt nhất để bảo trì máy bơm công nghiệp, kéo dài tuổi thọ thiết bị.',
        content: '<h2>Tầm quan trọng của bảo trì</h2><p>Bảo trì định kỳ...</p>',
        coverImage: '/industrial-pump-facility.jpg',
        author: 'Kỹ sư Trần Văn B',
        publishedAt: '2024-02-20',
        category: 'solution',
        readTime: 8,
    },
    {
        id: '3',
        slug: 'emerson-catalog-2024',
        title: 'Catalog Emerson 2024',
        excerpt: 'Tải về catalog đầy đủ các sản phẩm Emerson năm 2024.',
        content: '',
        coverImage: '/placeholder.jpg',
        publishedAt: '2024-01-01',
        category: 'library',
        downloadUrl: '#',
    },
];

// =========================
// NEWS
// =========================
export const newsArticles: NewsArticle[] = [
    {
        id: '1',
        slug: 'tte-wins-nghi-son-contract',
        title: 'TTE Trúng thầu Dự án Nhà máy Lọc dầu Nghi Sơn',
        excerpt: 'Công ty Cổ phần Kỹ thuật Toàn Thắng vừa chính thức ký hợp đồng cung cấp thiết bị cho dự án mở rộng Nhà máy Lọc dầu Nghi Sơn.',
        content: '<p>Nội dung chi tiết về dự án...</p>',
        coverImage: '/oil-refinery-project-industrial.jpg',
        author: 'Ban Truyền thông',
        publishedAt: '2024-03-15',
        category: 'company',
    },
    {
        id: '2',
        slug: 'oil-gas-industry-trends-2024',
        title: 'Xu hướng Ngành Dầu khí Năm 2024',
        excerpt: 'Phân tích các xu hướng chính trong ngành dầu khí và năng lượng trong năm 2024.',
        content: '<p>Năm 2024 chứng kiến nhiều thay đổi...</p>',
        coverImage: '/offshore-oil-platform-vietnam.jpg',
        author: 'Phòng Nghiên cứu',
        publishedAt: '2024-02-28',
        category: 'industry',
    },
    {
        id: '3',
        slug: 'tte-celebrates-30-years',
        title: 'TTE Kỷ niệm 30 Năm Thành lập',
        excerpt: 'Nhìn lại hành trình 30 năm phát triển của Công ty Cổ phần Kỹ thuật Toàn Thắng.',
        content: '<p>Từ năm 1993, Toàn Thắng đã...</p>',
        coverImage: '/professional-team-engineering-services.jpg',
        author: 'Ban Truyền thông',
        publishedAt: '2024-01-10',
        category: 'company',
    },
];

// =========================
// VACANCIES
// =========================
export const vacancies: Vacancy[] = [
    {
        id: '1',
        slug: 'senior-mechanical-engineer',
        title: 'Kỹ sư Cơ khí Cao cấp',
        department: 'Phòng Kỹ thuật',
        location: 'TP. Hồ Chí Minh',
        type: 'full-time',
        description: 'Chúng tôi đang tìm kiếm Kỹ sư Cơ khí Cao cấp để tham gia các dự án lớn.',
        requirements: [
            'Tốt nghiệp Đại học chuyên ngành Cơ khí',
            'Có ít nhất 5 năm kinh nghiệm',
            'Thành thạo AutoCAD, SolidWorks',
            'Tiếng Anh giao tiếp tốt',
        ],
        benefits: [
            'Lương cạnh tranh',
            'Bảo hiểm sức khỏe',
            'Du lịch hàng năm',
            'Đào tạo chuyên môn',
        ],
        deadline: '2025-02-28',
        contactEmail: 'hr@toanthang.vn',
    },
    {
        id: '2',
        slug: 'project-manager',
        title: 'Quản lý Dự án',
        department: 'Phòng Dự án',
        location: 'TP. Hồ Chí Minh',
        type: 'full-time',
        description: 'Quản lý và điều phối các dự án cung cấp thiết bị công nghiệp.',
        requirements: [
            'Tốt nghiệp Đại học ngành Kỹ thuật hoặc Quản lý',
            'Có chứng chỉ PMP là lợi thế',
            '7+ năm kinh nghiệm quản lý dự án',
        ],
        benefits: [
            'Lương hấp dẫn + thưởng dự án',
            'Bảo hiểm cao cấp',
            'Cơ hội thăng tiến',
        ],
        deadline: '2025-03-15',
        contactEmail: 'hr@toanthang.vn',
    },
];

// =========================
// COMPANY INFO
// =========================
export const companyInfo: CompanyInfo = {
    name: 'Công ty Cổ phần Kỹ thuật Toàn Thắng',
    address: '11B Nguyễn Bỉnh Khiêm, P. Bến Nghé, Q.1, TP. Hồ Chí Minh, Việt Nam',
    phone: '(84-254) 3522219',
    fax: '(84-254) 3522220',
    email: 'tts@toanthang.vn',
    website: 'https://toanthang.vn',
    socialLinks: {
        facebook: 'https://facebook.com/toanthangengineering',
        linkedin: 'https://linkedin.com/company/toanthang',
    },
};

// =========================
// TIMELINE
// =========================
export const timeline: TimelineMilestone[] = [
    {
        year: 1993,
        title: 'Thành lập Công ty',
        description: 'TOÀN THẮNG (TTE) được thành lập.',
        images: ['/about-1.jpg', '/about-2.jpg'],
    },
    {
        year: 2006,
        title: 'Đối tác Cameron',
        description: 'Được chỉ định làm kênh Bán hàng cho Cameron, sau đó được đổi tên thành GE (Phụ tùng máy nén khí).',
        images: ['/industrial-air-compressor-equipment.jpg', '/gas-processing-system-industrial-equipment.jpg'],
    },
    {
        year: 2009,
        title: 'Đại diện EMERSON',
        description: 'Trở thành Đại diện bán hàng cho các thương hiệu sản phẩm thuộc hãng EMERSON.',
        images: ['/industrial-control-system-panel.jpg', '/technology-solution-industrial-plant.jpg'],
    },
    {
        year: 2011,
        title: 'Mở rộng Quy mô',
        description: 'Phát triển kinh doanh, mở rộng văn phòng lên hơn 50 nhân viên.',
        images: ['/professional-team-engineering-services.jpg', '/engineering-team-technical-support.jpg'],
    },
    {
        year: 2013,
        title: 'Xưởng Vũng Tàu',
        description: 'Xưởng Sửa chữa - Bảo trì - Dịch vụ Toàn Thắng được thành lập tại tỉnh Vũng Tàu.',
        images: ['/offshore-oil-platform-vietnam.jpg', '/industrial-pump-facility.jpg'],
    },
    {
        year: 2015,
        title: 'Hợp tác JORD',
        description: 'TTS được thành lập và hợp tác với JORD, chính thức cung cấp dịch vụ của Hãng.',
        images: ['/petrochemical-plant-industrial-project.jpg', '/industrial-equipment-oil-gas-facility.jpg'],
    },
    {
        year: 2016,
        title: 'Nhà phân phối FLOWSERVE',
        description: 'TTT tách ra khỏi TTE và tập trung vào kinh doanh Solar Turbines. TTE được chỉ định làm Nhà phân phối cho Hãng FLOWSERVE.',
        images: ['/industrial-pump-equipment.jpg', '/oil-filtration-system-equipment.jpg'],
    },
    {
        year: 2017,
        title: 'Xưởng Nghi Sơn',
        description: 'Thành lập Xưởng Sửa chữa - Bảo trì Dịch vụ Toàn Thắng (TTS) tại Nghi Sơn - Thanh Hóa.',
        images: ['/oil-refinery-project-industrial.jpg', '/natural-gas-station-industrial.jpg'],
    },
    {
        year: 2019,
        title: 'Chứng nhận Ủy quyền',
        description: 'Toàn Thắng được chứng nhận là Nhà cung cấp dịch vụ ủy quyền của EMERSON. TTE nhận được chứng nhận hệ thống quản lý từ Bureau Veritas.',
        images: ['/advanced-technology-industrial-solutions.jpg', '/industrial-equipment-oil-gas-technology.jpg'],
    },
    {
        year: 2026,
        title: 'Tiếp tục tăng trưởng',
        description: 'Tiếp tục tăng trưởng và cải tiến liên tục.',
        images: ['/placeholder.jpg'],
    },
];

// =========================
// CERTIFICATES
// =========================
export const certificates: Certificate[] = [
    {
        id: '1',
        name: 'ISO 9001:2015',
        issuer: 'BSI',
        image: '/placeholder.jpg',
        year: 2020,
    },
    {
        id: '2',
        name: 'ISO 14001:2015',
        issuer: 'BSI',
        image: '/placeholder.jpg',
        year: 2021,
    },
    {
        id: '3',
        name: 'OHSAS 18001',
        issuer: 'TUV',
        image: '/placeholder.jpg',
        year: 2019,
    },
];

// =========================
// PARTNERS
// =========================
export const partners: Partner[] = [
    { id: '1', name: 'Emerson', logo: '/placeholder-logo.svg' },
    { id: '2', name: 'Flowserve', logo: '/placeholder-logo.svg' },
    { id: '3', name: 'Cameron', logo: '/placeholder-logo.svg' },
    { id: '4', name: 'Dresser', logo: '/placeholder-logo.svg' },
    { id: '5', name: 'Fisher', logo: '/placeholder-logo.svg' },
    { id: '6', name: 'Masoneilan', logo: '/placeholder-logo.svg' },
    { id: '7', name: 'Bettis', logo: '/placeholder-logo.svg' },
    { id: '8', name: 'Rosemount', logo: '/placeholder-logo.svg' },
];

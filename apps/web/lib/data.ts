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
    // ========================
    // SOLUTIONS (Giải pháp & Ứng dụng)
    // ========================
    {
        id: 'sol-1',
        slug: 'giai-phap-giam-sat-an-mon-duong-ong',
        title: 'Giải pháp giám sát ăn mòn trong đường ống dẫn dầu',
        titleEn: 'Pipeline Corrosion Monitoring Solution',
        excerpt: 'Hệ thống đo lường và giám sát ăn mòn thời gian thực với cảm biến thông minh, giúp dự đoán và ngăn ngừa sự cố đường ống.',
        excerptEn: 'Real-time corrosion monitoring system with smart sensors, helping predict and prevent pipeline incidents.',
        content: `
            <h2>Thách thức</h2>
            <p>Ăn mòn đường ống là nguyên nhân hàng đầu gây ra sự cố trong ngành dầu khí, gây thiệt hại hàng triệu đô la mỗi năm và rủi ro môi trường nghiêm trọng.</p>
            
            <h2>Giải pháp TTE</h2>
            <p>Chúng tôi cung cấp hệ thống giám sát ăn mòn toàn diện từ Emerson, bao gồm:</p>
            <ul>
                <li>Cảm biến đo độ dày thành ống thời gian thực</li>
                <li>Hệ thống phân tích dữ liệu AI dự đoán tuổi thọ đường ống</li>
                <li>Dashboard giám sát từ xa 24/7</li>
                <li>Tích hợp với hệ thống DCS/SCADA hiện có</li>
            </ul>
            
            <h2>Lợi ích</h2>
            <p>Giảm 70% chi phí bảo trì không kế hoạch, kéo dài tuổi thọ đường ống 15-20%, đảm bảo an toàn vận hành.</p>
        `,
        coverImage: '/offshore-oil-platform-vietnam.jpg',
        author: 'Kỹ sư Nguyễn Văn Minh',
        publishedAt: '2024-11-15',
        category: 'solution',
        readTime: 12,
    },
    {
        id: 'sol-2',
        slug: 'toi-uu-hoa-van-dieu-khien-nha-may-loc-dau',
        title: 'Tối ưu hóa hệ thống van điều khiển trong nhà máy lọc dầu',
        titleEn: 'Control Valve Optimization in Oil Refineries',
        excerpt: 'Giải pháp nâng cấp hệ thống van Fisher với bộ điều khiển DVC6200, tăng độ chính xác điều khiển và giảm tiêu hao năng lượng.',
        excerptEn: 'Upgrade solution with Fisher valves and DVC6200 controllers for improved accuracy and energy savings.',
        content: `
            <h2>Vấn đề thường gặp</h2>
            <p>Nhiều nhà máy lọc dầu tại Việt Nam đang sử dụng van điều khiển cũ với bộ định vị cơ học, dẫn đến độ chính xác kém và tiêu hao khí nén cao.</p>
            
            <h2>Giải pháp Fisher DVC6200</h2>
            <p>Bộ định vị kỹ thuật số DVC6200 mang lại:</p>
            <ul>
                <li>Độ chính xác định vị ±0.1%</li>
                <li>Giảm 60% tiêu hao khí nén</li>
                <li>Chẩn đoán van nâng cao - phát hiện sớm sự cố</li>
                <li>Giao tiếp HART/Foundation Fieldbus</li>
            </ul>
        `,
        coverImage: '/industrial-control-system-panel.jpg',
        author: 'Kỹ sư Trần Đức Thắng',
        publishedAt: '2024-10-20',
        category: 'solution',
        readTime: 10,
    },
    {
        id: 'sol-3',
        slug: 'he-thong-bom-chim-gian-khoan',
        title: 'Hệ thống bơm chìm cho giàn khoan ngoài khơi',
        titleEn: 'Submersible Pump System for Offshore Platforms',
        excerpt: 'Giải pháp Pleuger submersible pump cho ứng dụng offshore với khả năng chịu áp suất cao và độ bền vượt trội trong môi trường khắc nghiệt.',
        excerptEn: 'Pleuger submersible pump solution for offshore with high pressure tolerance and superior durability.',
        content: `
            <h2>Yêu cầu đặc biệt của Offshore</h2>
            <p>Môi trường giàn khoan ngoài khơi đòi hỏi thiết bị có độ bền cao, chịu được nước biển, áp suất lớn và hoạt động liên tục.</p>
            
            <h2>Giải pháp Pleuger</h2>
            <p>Máy bơm chìm Pleuger với các đặc điểm:</p>
            <ul>
                <li>Vật liệu Duplex Stainless Steel chống ăn mòn</li>
                <li>Công suất từ 100 đến 5,000 m³/h</li>
                <li>Cột áp tới 500m</li>
                <li>Tuổi thọ 25+ năm</li>
            </ul>
        `,
        coverImage: '/submersible-pump-offshore-equipment.jpg',
        author: 'Kỹ sư Lê Hoàng Nam',
        publishedAt: '2024-09-10',
        category: 'solution',
        readTime: 8,
    },
    {
        id: 'sol-4',
        slug: 'giam-sat-rung-dong-may-nen-khi',
        title: 'Giám sát rung động và nhiệt độ máy nén khí',
        titleEn: 'Compressor Vibration & Temperature Monitoring',
        excerpt: 'Hệ thống predictive maintenance với cảm biến Rosemount, phát hiện sớm sự cố trước khi xảy ra dừng máy ngoài kế hoạch.',
        excerptEn: 'Predictive maintenance system with Rosemount sensors for early fault detection.',
        content: `
            <h2>Tầm quan trọng của Predictive Maintenance</h2>
            <p>Máy nén khí là thiết bị quan trọng trong nhà máy. Một lần dừng máy ngoài kế hoạch có thể gây thiệt hại hàng trăm nghìn đô la.</p>
            
            <h2>Giải pháp giám sát liên tục</h2>
            <ul>
                <li>Cảm biến rung động Rosemount 5900S</li>
                <li>Cảm biến nhiệt độ RTD/Thermocouple</li>
                <li>Phần mềm phân tích xu hướng</li>
                <li>Cảnh báo tự động qua SMS/Email</li>
            </ul>
        `,
        coverImage: '/industrial-air-compressor-equipment.jpg',
        author: 'Kỹ sư Phạm Văn Hùng',
        publishedAt: '2024-08-25',
        category: 'solution',
        readTime: 9,
    },
    {
        id: 'sol-5',
        slug: 'tu-dong-hoa-xu-ly-khi-tu-nhien',
        title: 'Tự động hóa quy trình xử lý khí tự nhiên',
        titleEn: 'Natural Gas Processing Automation',
        excerpt: 'Giải pháp DCS và thiết bị đo lường cho Gas Processing Unit, tối ưu hóa hiệu suất và đảm bảo an toàn vận hành.',
        excerptEn: 'DCS and instrumentation solution for GPU optimization and safety.',
        content: `
            <h2>Quy trình xử lý khí</h2>
            <p>Khí tự nhiên cần được xử lý để loại bỏ tạp chất, tách các thành phần có giá trị trước khi đưa vào sử dụng.</p>
            
            <h2>Giải pháp tích hợp</h2>
            <ul>
                <li>Hệ thống DCS DeltaV điều khiển toàn bộ quy trình</li>
                <li>Thiết bị đo lưu lượng Micro Motion</li>
                <li>Van điều khiển Fisher</li>
                <li>Hệ thống an toàn SIS</li>
            </ul>
        `,
        coverImage: '/gas-processing-system-industrial-equipment.jpg',
        author: 'Kỹ sư Võ Thành Đạt',
        publishedAt: '2024-07-15',
        category: 'solution',
        readTime: 11,
    },

    // ========================
    // WHITEPAPERS (Tài liệu kỹ thuật)
    // ========================
    {
        id: 'wp-1',
        slug: 'huong-dan-chon-van-api-6d',
        title: 'Hướng dẫn chọn van theo tiêu chuẩn API 6D',
        titleEn: 'Valve Selection Guide per API 6D Standard',
        excerpt: 'Tài liệu hướng dẫn chi tiết lựa chọn van cổng, van bi, van bướm theo tiêu chuẩn API 6D cho ứng dụng pipeline.',
        excerptEn: 'Detailed guide for gate, ball, butterfly valve selection per API 6D for pipeline applications.',
        content: '',
        coverImage: '/technology-solution-industrial-plant.jpg',
        publishedAt: '2024-12-01',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '2.5 MB',
        documentType: 'guide',
    },
    {
        id: 'wp-2',
        slug: 'so-sanh-cam-bien-ap-suat',
        title: 'So sánh các loại cảm biến áp suất công nghiệp',
        titleEn: 'Industrial Pressure Sensor Comparison',
        excerpt: 'Phân tích ưu nhược điểm của các công nghệ cảm biến: Capacitive, Piezoresistive, Resonant, giúp lựa chọn phù hợp.',
        excerptEn: 'Analysis of sensor technologies: Capacitive, Piezoresistive, Resonant for optimal selection.',
        content: '',
        coverImage: '/industrial-control-system-panel.jpg',
        publishedAt: '2024-11-20',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        documentType: 'whitepaper',
    },
    {
        id: 'wp-3',
        slug: 'catalog-fisher-control-valves-2024',
        title: 'Catalog Fisher Control Valves 2024',
        titleEn: 'Fisher Control Valves Catalog 2024',
        excerpt: 'Catalog đầy đủ các dòng van điều khiển Fisher: easy-e, GX, Vee-Ball, HP, với thông số kỹ thuật và hướng dẫn chọn.',
        excerptEn: 'Complete Fisher control valve catalog: easy-e, GX, Vee-Ball, HP series with specifications.',
        content: '',
        coverImage: '/advanced-technology-industrial-solutions.jpg',
        publishedAt: '2024-01-01',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '15 MB',
        documentType: 'catalog',
    },
    {
        id: 'wp-4',
        slug: 'tieu-chuan-iso-14001-dau-khi',
        title: 'Tiêu chuẩn ISO 14001 trong công nghiệp dầu khí',
        titleEn: 'ISO 14001 Standard in Oil & Gas Industry',
        excerpt: 'Hướng dẫn áp dụng hệ thống quản lý môi trường ISO 14001:2015 cho các doanh nghiệp dầu khí Việt Nam.',
        excerptEn: 'Guide to implementing ISO 14001:2015 environmental management in Vietnam oil & gas sector.',
        content: '',
        coverImage: '/petrochemical-plant-industrial-project.jpg',
        publishedAt: '2024-08-01',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        documentType: 'standard',
    },
    {
        id: 'wp-5',
        slug: 'huong-dan-bao-tri-may-bom-flowserve',
        title: 'Hướng dẫn bảo trì máy bơm ly tâm Flowserve',
        titleEn: 'Flowserve Centrifugal Pump Maintenance Manual',
        excerpt: 'Manual bảo trì định kỳ và xử lý sự cố cho các dòng bơm Flowserve: CPX, LNN, HPX với checklist đầy đủ.',
        excerptEn: 'Maintenance and troubleshooting manual for Flowserve CPX, LNN, HPX pumps with checklists.',
        content: '',
        coverImage: '/industrial-pump-equipment.jpg',
        publishedAt: '2024-06-15',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '5.5 MB',
        documentType: 'manual',
    },
    {
        id: 'wp-6',
        slug: 'datasheet-rosemount-transmitters',
        title: 'Datasheet Rosemount Pressure Transmitters',
        titleEn: 'Rosemount Pressure Transmitters Datasheet',
        excerpt: 'Thông số kỹ thuật chi tiết cho dòng transmitter Rosemount 3051, 2088, với bảng lựa chọn model.',
        excerptEn: 'Technical specifications for Rosemount 3051, 2088 transmitters with model selection table.',
        content: '',
        coverImage: '/industrial-equipment-oil-gas-technology.jpg',
        publishedAt: '2024-05-01',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '800 KB',
        documentType: 'datasheet',
    },
    {
        id: 'wp-7',
        slug: 'best-practices-van-an-toan-crosby',
        title: 'Best Practices - Lắp đặt van an toàn Crosby',
        titleEn: 'Crosby Safety Valve Installation Best Practices',
        excerpt: 'Hướng dẫn lắp đặt, cài đặt áp suất và bảo trì van an toàn Crosby theo tiêu chuẩn API 520/521.',
        excerptEn: 'Installation, set pressure, and maintenance guide for Crosby safety valves per API 520/521.',
        content: '',
        coverImage: '/oil-refinery-project-industrial.jpg',
        publishedAt: '2024-04-10',
        category: 'whitepaper',
        downloadUrl: '#',
        fileType: 'pdf',
        fileSize: '2.1 MB',
        documentType: 'guide',
    },

    // ========================
    // CASE STUDIES (Dự án tiêu biểu)
    // ========================
    {
        id: 'cs-1',
        slug: 'case-study-nsrp-van-dieu-khien',
        title: 'Cung cấp hệ thống van điều khiển cho NSRP',
        titleEn: 'Control Valve System Supply for NSRP',
        excerpt: 'TTE cung cấp hơn 500 van điều khiển Fisher cho Nhà máy Lọc dầu Nghi Sơn, góp phần vận hành ổn định từ 2017.',
        excerptEn: 'TTE supplied 500+ Fisher control valves for Nghi Son Refinery, ensuring stable operation since 2017.',
        content: `
            <h2>Về dự án</h2>
            <p>Nhà máy Lọc dầu Nghi Sơn (NSRP) là một trong những nhà máy lọc dầu lớn nhất Việt Nam với công suất 200,000 bbl/ngày.</p>
            
            <h2>Phạm vi cung cấp</h2>
            <ul>
                <li>500+ van điều khiển Fisher (GX, easy-e, Vee-Ball)</li>
                <li>Bộ định vị kỹ thuật số DVC6200</li>
                <li>Van an toàn Crosby</li>
                <li>Dịch vụ lắp đặt và commissioning</li>
            </ul>
        `,
        coverImage: '/oil-refinery-project-industrial.jpg',
        publishedAt: '2024-03-15',
        category: 'case-study',
        client: 'Nhà máy Lọc dầu Nghi Sơn (NSRP)',
        location: 'Thanh Hóa, Việt Nam',
        projectYear: 2017,
        industry: 'Dầu khí',
        results: [
            'Giảm 25% thời gian dừng máy',
            '99.5% độ sẵn sàng thiết bị',
            'Tiết kiệm $200K/năm bảo trì'
        ],
        resultsEn: [
            '25% reduction in downtime',
            '99.5% equipment availability',
            '$200K/year maintenance savings'
        ],
        gallery: ['/oil-refinery-project-industrial.jpg', '/petrochemical-plant-industrial-project.jpg'],
    },
    {
        id: 'cs-2',
        slug: 'case-study-bsr-nang-cap-bom',
        title: 'Nâng cấp hệ thống bơm xử lý nước BSR',
        titleEn: 'Water Treatment Pump Upgrade for BSR',
        excerpt: 'Dự án thay thế và nâng cấp hệ thống bơm tại Nhà máy Lọc dầu Bình Sơn, tăng hiệu suất xử lý nước thải 30%.',
        excerptEn: 'Pump replacement and upgrade project at Binh Son Refinery, increasing wastewater treatment by 30%.',
        content: `
            <h2>Thách thức</h2>
            <p>Hệ thống bơm cũ đã hoạt động 15 năm, hiệu suất giảm, chi phí bảo trì tăng cao.</p>
            
            <h2>Giải pháp</h2>
            <p>TTE cung cấp giải pháp thay thế toàn bộ bằng bơm Flowserve HPX với hiệu suất cao hơn 15% và tuổi thọ dự kiến 25 năm.</p>
        `,
        coverImage: '/industrial-pump-facility.jpg',
        publishedAt: '2024-02-20',
        category: 'case-study',
        client: 'Bình Sơn Refining (BSR)',
        location: 'Quảng Ngãi, Việt Nam',
        projectYear: 2022,
        industry: 'Hóa dầu',
        results: [
            'Tăng 30% hiệu suất xử lý',
            'Giảm 40% chi phí điện năng',
            'ROI trong 2 năm'
        ],
        resultsEn: [
            '30% processing efficiency increase',
            '40% energy cost reduction',
            'ROI within 2 years'
        ],
        gallery: ['/industrial-pump-facility.jpg', '/industrial-pump-equipment.jpg'],
    },
    {
        id: 'cs-3',
        slug: 'case-study-pvdrilling-giam-sat',
        title: 'Lắp đặt thiết bị giám sát cho PVDrilling',
        titleEn: 'Monitoring Equipment Installation for PVDrilling',
        excerpt: 'Triển khai hệ thống giám sát rung động và tình trạng thiết bị trên 5 giàn khoan, giảm $500K/năm chi phí bảo trì.',
        excerptEn: 'Vibration monitoring system deployment on 5 drilling rigs, saving $500K/year in maintenance.',
        content: `
            <h2>Phạm vi dự án</h2>
            <p>Lắp đặt hệ thống giám sát liên tục cho 5 giàn khoan PVDrilling hoạt động tại vùng biển Việt Nam.</p>
            
            <h2>Thiết bị cung cấp</h2>
            <ul>
                <li>Cảm biến rung động Emerson</li>
                <li>Hệ thống thu thập dữ liệu wireless</li>
                <li>Phần mềm phân tích AMS</li>
            </ul>
        `,
        coverImage: '/offshore-oil-platform-vietnam.jpg',
        publishedAt: '2024-01-10',
        category: 'case-study',
        client: 'PV Drilling',
        location: 'Vùng biển Việt Nam',
        projectYear: 2021,
        industry: 'Khoan dầu khí',
        results: [
            'Tiết kiệm $500K/năm bảo trì',
            'Phát hiện sớm 12 sự cố tiềm ẩn',
            'Tăng 15% uptime giàn khoan'
        ],
        resultsEn: [
            '$500K/year maintenance savings',
            '12 potential failures detected early',
            '15% rig uptime increase'
        ],
        gallery: ['/offshore-oil-platform-vietnam.jpg', '/full-field-development-oil-platform.jpg'],
    },
    {
        id: 'cs-4',
        slug: 'case-study-vietsovpetro-do-luong',
        title: 'Hệ thống đo lường cho trạm khí Bạch Hổ',
        titleEn: 'Measurement System for Bach Ho Gas Station',
        excerpt: 'Cung cấp và lắp đặt hệ thống đo lường khí thiên nhiên với độ chính xác 99.9% cho Vietsovpetro.',
        excerptEn: 'Natural gas measurement system with 99.9% accuracy for Vietsovpetro.',
        content: `
            <h2>Yêu cầu dự án</h2>
            <p>Vietsovpetro cần hệ thống đo lường khí độ chính xác cao để tính toán sản lượng và thuế.</p>
            
            <h2>Giải pháp</h2>
            <p>TTE cung cấp hệ thống hoàn chỉnh từ Emerson với đồng hồ Coriolis Micro Motion.</p>
        `,
        coverImage: '/natural-gas-station-industrial.jpg',
        publishedAt: '2023-12-15',
        category: 'case-study',
        client: 'Vietsovpetro',
        location: 'Bà Rịa - Vũng Tàu, Việt Nam',
        projectYear: 2023,
        industry: 'Dầu khí',
        results: [
            'Đạt độ chính xác 99.9%',
            'Đáp ứng tiêu chuẩn đo lường quốc tế',
            'Vận hành ổn định 24/7'
        ],
        resultsEn: [
            '99.9% measurement accuracy',
            'International metering standards met',
            '24/7 stable operation'
        ],
        gallery: ['/natural-gas-station-industrial.jpg', '/gas-processing-system-industrial-equipment.jpg'],
    },
    {
        id: 'cs-5',
        slug: 'case-study-pvgas-may-nen-khi',
        title: 'Cung cấp máy nén khí cho PV Gas',
        titleEn: 'Gas Compressor Supply for PV Gas',
        excerpt: 'Dự án cung cấp và lắp đặt hệ thống máy nén khí công suất lớn cho trạm nén GPP Dinh Cố.',
        excerptEn: 'High-capacity gas compressor system supply and installation for GPP Dinh Co station.',
        content: `
            <h2>Tổng quan dự án</h2>
            <p>Trạm xử lý khí Dinh Cố cần nâng cấp hệ thống máy nén để tăng công suất xử lý.</p>
            
            <h2>Phạm vi cung cấp</h2>
            <ul>
                <li>2 máy nén khí piston Cooper</li>
                <li>Hệ thống điều khiển tự động</li>
                <li>Thiết bị phụ trợ</li>
                <li>Dịch vụ lắp đặt và commissioning</li>
            </ul>
        `,
        coverImage: '/industrial-air-compressor-equipment.jpg',
        publishedAt: '2023-10-20',
        category: 'case-study',
        client: 'PV Gas',
        location: 'Bà Rịa - Vũng Tàu, Việt Nam',
        projectYear: 2020,
        industry: 'Khí đốt',
        results: [
            'Vận hành liên tục 24/7',
            'Tăng 20% công suất xử lý',
            'Đạt tiêu chuẩn an toàn ATEX'
        ],
        resultsEn: [
            '24/7 continuous operation',
            '20% processing capacity increase',
            'ATEX safety standards met'
        ],
        gallery: ['/industrial-air-compressor-equipment.jpg', '/gas-processing-system-industrial-equipment.jpg'],
    },
];

// =========================
// NEWS
// =========================
export const newsArticles: NewsArticle[] = [
    // ===== TTE ACTIVITIES (company) =====
    {
        id: 'news-1',
        slug: 'tte-celebrates-32-years',
        title: 'TTE Kỷ niệm 32 Năm Thành lập (1993-2025)',
        titleEn: 'TTE Celebrates 32 Years Anniversary (1993-2025)',
        excerpt: 'Nhìn lại hành trình 32 năm phát triển của Công ty Cổ phần Kỹ thuật Toàn Thắng - từ một công ty thương mại nhỏ đến đối tác tin cậy của các tập đoàn đa quốc gia.',
        excerptEn: 'Looking back at 32 years of Toan Thang Engineering - from a small trading company to a trusted partner of multinational corporations.',
        content: '<h2>Chặng đường 32 năm</h2><p>Từ năm 1993, Toàn Thắng đã không ngừng phát triển...</p>',
        contentEn: '<h2>32 Years Journey</h2><p>Since 1993, Toan Thang has continuously grown...</p>',
        coverImage: '/professional-team-engineering-services.jpg',
        author: 'Ban Truyền thông TTE',
        publishedAt: '2025-01-10',
        category: 'company',
        tags: ['anniversary', 'milestone'],
    },
    {
        id: 'news-2',
        slug: 'tte-team-building-2025',
        title: 'Team Building TTE 2025: "Đồng lòng - Vươn xa"',
        titleEn: 'TTE Team Building 2025: "Together - Forward"',
        excerpt: 'Chương trình team building thường niên của TTE diễn ra tại Vũng Tàu, quy tụ hơn 150 CBNV với nhiều hoạt động gắn kết.',
        excerptEn: 'TTE annual team building program held in Vung Tau, gathering over 150 employees with bonding activities.',
        content: '<p>Chi tiết chương trình...</p>',
        contentEn: '<p>Program details...</p>',
        coverImage: '/engineering-team-technical-support.jpg',
        author: 'Phòng Nhân sự',
        publishedAt: '2025-01-05',
        category: 'company',
        tags: ['team-building', 'culture'],
    },
    {
        id: 'news-3',
        slug: 'tte-training-valve-maintenance',
        title: 'Đào tạo Bảo trì Van Công nghiệp cho Kỹ sư TTE',
        titleEn: 'Industrial Valve Maintenance Training for TTE Engineers',
        excerpt: 'Chương trình đào tạo chuyên sâu về bảo trì và sửa chữa van công nghiệp do chuyên gia Flowserve hướng dẫn.',
        excerptEn: 'In-depth training on industrial valve maintenance and repair guided by Flowserve experts.',
        content: '<p>Nội dung khóa đào tạo...</p>',
        contentEn: '<p>Training content...</p>',
        coverImage: '/industrial-control-system-panel.jpg',
        author: 'Phòng Kỹ thuật',
        publishedAt: '2024-12-20',
        category: 'company',
        tags: ['training', 'valve'],
    },
    {
        id: 'news-4',
        slug: 'tte-lunar-new-year-2025',
        title: 'Thông báo Lịch nghỉ Tết Nguyên đán 2025',
        titleEn: 'Lunar New Year 2025 Holiday Schedule',
        excerpt: 'TTE thông báo lịch nghỉ Tết Nguyên đán 2025 và lịch làm việc sau Tết.',
        excerptEn: 'TTE announces Lunar New Year 2025 holiday schedule and post-holiday work schedule.',
        content: '<p>Lịch nghỉ chi tiết...</p>',
        contentEn: '<p>Detailed schedule...</p>',
        coverImage: '/technology-solution-industrial-plant.jpg',
        author: 'Ban Giám đốc',
        publishedAt: '2025-01-02',
        category: 'company',
        tags: ['announcement', 'holiday'],
    },
    {
        id: 'news-5',
        slug: 'tte-wins-nghi-son-contract',
        title: 'TTE Trúng thầu Dự án Mở rộng NMLD Nghi Sơn Giai đoạn II',
        titleEn: 'TTE Wins Nghi Son Refinery Expansion Phase II Contract',
        excerpt: 'TTE chính thức ký hợp đồng cung cấp van và thiết bị đo lường cho dự án mở rộng Nhà máy Lọc dầu Nghi Sơn trị giá 2.5 triệu USD.',
        excerptEn: 'TTE officially signs $2.5 million contract to supply valves and instrumentation for Nghi Son Refinery expansion.',
        content: '<p>Chi tiết dự án...</p>',
        contentEn: '<p>Project details...</p>',
        coverImage: '/oil-refinery-project-industrial.jpg',
        author: 'Ban Truyền thông',
        publishedAt: '2024-11-15',
        category: 'company',
        tags: ['project', 'contract'],
    },

    // ===== PARTNER NEWS (partner) =====
    {
        id: 'news-6',
        slug: 'emerson-plantweb-digital-ecosystem',
        title: 'Emerson Ra mắt Plantweb Digital Ecosystem phiên bản mới',
        titleEn: 'Emerson Launches New Plantweb Digital Ecosystem Version',
        excerpt: 'Emerson giới thiệu phiên bản mới của nền tảng Plantweb với khả năng tích hợp AI và phân tích dữ liệu nâng cao.',
        excerptEn: 'Emerson introduces new Plantweb platform version with AI integration and advanced data analytics.',
        content: '<p>Thông tin chi tiết về công nghệ mới...</p>',
        contentEn: '<p>Details about new technology...</p>',
        coverImage: '/advanced-technology-industrial-solutions.jpg',
        author: 'Emerson Automation Solutions',
        publishedAt: '2024-12-01',
        category: 'partner',
        tags: ['emerson', 'technology', 'digital'],
    },
    {
        id: 'news-7',
        slug: 'flowserve-limitorque-mx-series',
        title: 'Flowserve Giới thiệu Limitorque MX Series - Actuator thế hệ mới',
        titleEn: 'Flowserve Introduces Limitorque MX Series - Next-gen Actuators',
        excerpt: 'Dòng actuator điện Limitorque MX Series với thiết kế module hóa, dễ bảo trì và tích hợp IoT.',
        excerptEn: 'Limitorque MX Series electric actuators with modular design, easy maintenance and IoT integration.',
        content: '<p>Thông số kỹ thuật và ưu điểm...</p>',
        contentEn: '<p>Technical specs and advantages...</p>',
        coverImage: '/industrial-pump-equipment.jpg',
        author: 'Flowserve Corporation',
        publishedAt: '2024-11-20',
        category: 'partner',
        tags: ['flowserve', 'actuator', 'limitorque'],
    },
    {
        id: 'news-8',
        slug: 'emerson-copeland-brand-refresh',
        title: 'Emerson Làm mới Thương hiệu Copeland trên toàn cầu',
        titleEn: 'Emerson Refreshes Copeland Brand Globally',
        excerpt: 'Emerson công bố nhận diện thương hiệu mới cho Copeland, nhấn mạnh cam kết với giải pháp năng lượng bền vững.',
        excerptEn: 'Emerson announces new brand identity for Copeland, emphasizing commitment to sustainable energy solutions.',
        content: '<p>Chi tiết về thương hiệu mới...</p>',
        contentEn: '<p>New brand details...</p>',
        coverImage: '/industrial-air-compressor-equipment.jpg',
        author: 'Emerson Commercial Solutions',
        publishedAt: '2024-10-15',
        category: 'partner',
        tags: ['emerson', 'copeland', 'branding'],
    },
    {
        id: 'news-9',
        slug: 'tyco-fire-protection-abb-integration',
        title: 'Tyco Fire Protection Tích hợp Giải pháp ABB Smart Building',
        titleEn: 'Tyco Fire Protection Integrates ABB Smart Building Solutions',
        excerpt: 'Hệ thống PCCC Tyco giờ đây tích hợp hoàn toàn với nền tảng ABB Ability Smart Building, mang lại khả năng giám sát toàn diện.',
        excerptEn: 'Tyco fire protection systems now fully integrate with ABB Ability Smart Building platform for comprehensive monitoring.',
        content: '<p>Chi tiết tích hợp...</p>',
        contentEn: '<p>Integration details...</p>',
        coverImage: '/industrial-boiler-equipment.jpg',
        author: 'Johnson Controls',
        publishedAt: '2024-09-28',
        category: 'partner',
        tags: ['tyco', 'abb', 'integration'],
    },

    // ===== INDUSTRY NEWS (industry) =====
    {
        id: 'news-10',
        slug: 'oil-gas-trends-2025',
        title: 'Xu hướng Ngành Dầu khí Việt Nam 2025: Chuyển đổi Xanh',
        titleEn: 'Vietnam Oil & Gas Trends 2025: Green Transition',
        excerpt: 'Phân tích xu hướng chuyển đổi năng lượng xanh trong ngành dầu khí Việt Nam và cơ hội cho các nhà cung cấp thiết bị.',
        excerptEn: 'Analysis of green energy transition trends in Vietnam oil & gas industry and opportunities for equipment suppliers.',
        content: '<p>Phân tích chi tiết...</p>',
        contentEn: '<p>Detailed analysis...</p>',
        coverImage: '/offshore-oil-platform-vietnam.jpg',
        author: 'Phòng Nghiên cứu Thị trường',
        publishedAt: '2025-01-08',
        category: 'industry',
        tags: ['oil-gas', 'energy-transition', 'vietnam'],
    },
    {
        id: 'news-11',
        slug: 'new-fire-safety-regulations-2025',
        title: 'Quy định mới về PCCC 2025: Điều doanh nghiệp cần biết',
        titleEn: 'New Fire Safety Regulations 2025: What Businesses Need to Know',
        excerpt: 'Tổng hợp các thay đổi quan trọng trong quy định phòng cháy chữa cháy có hiệu lực từ 01/01/2025.',
        excerptEn: 'Summary of important changes in fire safety regulations effective from January 1, 2025.',
        content: '<p>Chi tiết quy định...</p>',
        contentEn: '<p>Regulation details...</p>',
        coverImage: '/gas-processing-system-industrial-equipment.jpg',
        author: 'Bộ phận Pháp lý',
        publishedAt: '2024-12-28',
        category: 'industry',
        tags: ['regulation', 'fire-safety', 'pccc'],
    },
    {
        id: 'news-12',
        slug: 'global-oil-price-analysis-q1-2025',
        title: 'Phân tích Giá Dầu Thế giới Q1/2025',
        titleEn: 'Global Oil Price Analysis Q1/2025',
        excerpt: 'Biến động giá dầu thế giới đầu năm 2025 và tác động đến ngành công nghiệp năng lượng Việt Nam.',
        excerptEn: 'Global oil price fluctuations in early 2025 and impact on Vietnam energy industry.',
        content: '<p>Phân tích chi tiết...</p>',
        contentEn: '<p>Detailed analysis...</p>',
        coverImage: '/industrial-equipment-oil-gas-facility.jpg',
        author: 'Phòng Nghiên cứu',
        publishedAt: '2025-01-12',
        category: 'industry',
        tags: ['oil-price', 'market', 'energy'],
    },
    {
        id: 'news-13',
        slug: 'vietnam-power-master-plan-8',
        title: 'Quy hoạch Điện VIII: Cơ hội cho Năng lượng Tái tạo',
        titleEn: 'Power Development Plan VIII: Opportunities for Renewable Energy',
        excerpt: 'Phân tích Quy hoạch Điện VIII và cơ hội đầu tư trong lĩnh vực điện gió, điện mặt trời tại Việt Nam.',
        excerptEn: 'Analysis of Power Development Plan VIII and investment opportunities in wind and solar power in Vietnam.',
        content: '<p>Chi tiết quy hoạch...</p>',
        contentEn: '<p>Plan details...</p>',
        coverImage: '/petrochemical-plant-industrial-project.jpg',
        author: 'Phòng Nghiên cứu Thị trường',
        publishedAt: '2024-11-05',
        category: 'industry',
        tags: ['energy', 'renewable', 'policy'],
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

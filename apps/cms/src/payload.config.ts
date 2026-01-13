import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Articles } from './collections/Articles'
import { Vacancies } from './collections/Vacancies'
import { Brands } from './collections/Taxonomies/Brands'
import { ProductCategories } from './collections/Taxonomies/ProductCategories'
import { Industries } from './collections/Taxonomies/Industries'

// Globals
import { Homepage } from './globals/Homepage'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4001',

    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        meta: {
            titleSuffix: '- TTE CMS',
        },
    },

    collections: [
        // Auth
        Users,
        // Media
        Media,
        // Core Content
        Products,
        Projects,
        Services,
        Articles,
        Vacancies,
        // Taxonomies
        Brands,
        ProductCategories,
        Industries,
    ],

    globals: [
        Homepage,
        AboutPage,
        ContactPage,
    ],

    editor: lexicalEditor(),

    secret: process.env.PAYLOAD_SECRET || '',

    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },

    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URL || '',
        },
    }),

    localization: {
        locales: [
            { label: 'Tiếng Việt', code: 'vi' },
            { label: 'English', code: 'en' },
        ],
        defaultLocale: 'vi',
        fallback: true,
    },

    cors: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.BACKEND_URL || 'http://localhost:3002',
    ],

    sharp,
    plugins: [],
})

import { defineField, defineType } from 'sanity'

export const contactInfoType = defineType({
    name: 'contactInfo',
    title: 'Contact Info',
    type: 'document',
    fields: [
        defineField({
            name: 'prefix',
            type: 'string',
            title: 'Prefix',
            description: 'Optional prefix (e.g., Dr., Prof., Mr., Ms.)',
        }),
        defineField({
            name: 'fullName',
            type: 'string',
            title: 'Full Name',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'email',
            type: 'string',
            title: 'Email',
            validation: (rule) => rule.required().email(),
        }),
    ],
    preview: {
        select: {
            title: 'fullName',
            subtitle: 'email',
        },
    },
})

